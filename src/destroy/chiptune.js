// An original 8-bit loop for destruction mode, played live by WebAudio — no
// audio file. Four channels like the old consoles had:
//
//   lead   square, 25% duty     the tune
//   arp    square, 12.5% duty   fast chord arpeggios, quiet
//   bass   triangle             eighth-note octave pump
//   drums  noise + a pitched triangle kick
//
// A minor, i - VI - III - VII (Am F C G), eight bars: the A melody once, then
// a higher, busier B melody. It reacts to the game: `setIntensity(1..6)`
// (the combo multiplier) raises the tempo and doubles the hats, and
// `setMuffled(true)` closes a low-pass over the whole band while the gun is
// cooling.
//
// Scheduling uses the standard lookahead pattern: a coarse timer wakes every
// 25 ms and books every note due in the next 120 ms on the audio clock, so
// timing stays tight however busy the main thread is with explosions.

const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

// [step, midi note, length in steps] per bar, 16 steps to a bar.
const MELODY = [
  // A
  [[0, 76, 3], [3, 74, 1], [4, 72, 2], [6, 71, 2], [8, 72, 4], [12, 69, 4]],
  [[0, 69, 2], [2, 72, 2], [4, 77, 4], [8, 76, 2], [10, 74, 2], [12, 72, 4]],
  [[0, 72, 2], [2, 76, 2], [4, 79, 4], [8, 77, 2], [10, 76, 2], [12, 74, 2], [14, 72, 2]],
  [[0, 71, 4], [4, 74, 4], [8, 79, 6], [14, 78, 2]],
  // B
  [[0, 81, 2], [2, 79, 2], [4, 76, 2], [6, 79, 2], [8, 81, 3], [11, 79, 1], [12, 76, 4]],
  [[0, 77, 2], [2, 76, 2], [4, 72, 2], [6, 76, 2], [8, 77, 4], [12, 81, 4]],
  [[0, 79, 2], [2, 76, 2], [4, 72, 2], [6, 76, 2], [8, 79, 2], [10, 84, 2], [12, 83, 2], [14, 79, 2]],
  [[0, 83, 4], [4, 81, 2], [6, 79, 2], [8, 78, 4], [12, 74, 2], [14, 71, 2]],
];

// One chord per bar, repeating every four.
const CHORDS = [
  { root: 45, arp: [57, 60, 64, 69] }, // Am
  { root: 41, arp: [53, 57, 60, 65] }, // F
  { root: 48, arp: [55, 60, 64, 67] }, // C
  { root: 43, arp: [55, 59, 62, 67] }, // G
];

const STEPS = 16;
const BARS = MELODY.length;

export function createChiptune(ctx, out, noise) {
  const bus = ctx.createGain();
  bus.gain.value = 0.32;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 18000;
  lp.Q.value = 0.7;
  bus.connect(lp).connect(out);

  // Pulse waves with a set duty cycle, built from Fourier terms.
  const pulse = (duty) => {
    const n = 32;
    const re = new Float32Array(n);
    const im = new Float32Array(n);
    for (let k = 1; k < n; k++) im[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * duty);
    return ctx.createPeriodicWave(re, im);
  };
  const SQ25 = pulse(0.25);
  const SQ12 = pulse(0.125);

  const tone = (wave, freq, t, dur, gain, { type, slideTo } = {}) => {
    const o = ctx.createOscillator();
    if (wave) o.setPeriodicWave(wave);
    else o.type = type || "triangle";
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    const g = ctx.createGain();
    // a tiny attack and release so notes do not click
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.005);
    g.gain.setValueAtTime(gain, t + Math.max(0.006, dur - 0.02));
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + dur + 0.01);
  };

  const hit = (t, dur, gain, freq, type = "highpass") => {
    const s = ctx.createBufferSource();
    s.buffer = noise;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(bus);
    s.start(t, Math.random());
    s.stop(t + dur);
  };

  let intensity = 1;
  let step = 0; // global 16th counter
  let next = 0; // audio time of the next step
  let timer = 0;
  let playing = false;

  const bpm = () => Math.min(176, 128 + (intensity - 1) * 9);
  const stepDur = () => 60 / bpm() / 4;

  const book = (s, t) => {
    const bar = Math.floor(s / STEPS) % BARS;
    const i = s % STEPS;
    const sd = stepDur();
    const chord = CHORDS[bar % CHORDS.length];
    const b = bar >= 4; // the B half

    // lead
    for (const [at, note, len] of MELODY[bar]) {
      if (at === i) tone(SQ25, midi(note), t, len * sd * 0.92, 0.16);
    }
    // arp: every 16th, louder as things heat up
    tone(SQ12, midi(chord.arp[i % 4] + (intensity >= 4 ? 12 : 0)), t, sd * 0.8, 0.035 + Math.min(intensity, 6) * 0.006);
    // bass: octave pump on the eighths
    if (i % 2 === 0) tone(null, midi(chord.root + (i % 4 === 2 ? 12 : 0)), t, sd * 1.7, 0.42);
    // kick
    if (i === 0 || i === 8 || (b && i === 6) || (intensity >= 5 && i === 14)) {
      tone(null, 150, t, 0.13, 0.7, { slideTo: 40 });
    }
    // snare
    if (i === 4 || i === 12) {
      hit(t, 0.14, 0.32, 1800, "bandpass");
      tone(null, 210, t, 0.06, 0.18, { slideTo: 120 });
    }
    // hats: eighths, sixteenths once the combo is going
    if (intensity >= 3 ? true : i % 2 === 0) hit(t, 0.03, i % 4 === 2 ? 0.12 : 0.07, 7000);
    // a crash at the top of the loop
    if (s % (STEPS * BARS) === 0) hit(t, 0.9, 0.16, 4000);
  };

  const tick = () => {
    while (next < ctx.currentTime + 0.12) {
      book(step, next);
      next += stepDur();
      step++;
    }
  };

  return {
    start() {
      if (playing) return;
      playing = true;
      next = ctx.currentTime + 0.08;
      step = 0;
      timer = setInterval(tick, 25);
      tick();
    },
    stop() {
      playing = false;
      clearInterval(timer);
      timer = 0;
    },
    get playing() {
      return playing;
    },
    setIntensity(n) {
      intensity = Math.max(1, Math.min(6, n));
    },
    setMuffled(on) {
      const t = ctx.currentTime;
      lp.frequency.cancelScheduledValues(t);
      lp.frequency.setValueAtTime(lp.frequency.value, t);
      lp.frequency.exponentialRampToValueAtTime(on ? 500 : 18000, t + (on ? 0.15 : 0.6));
    },
  };
}
