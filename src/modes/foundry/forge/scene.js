/**
 * The billet: one cast bar of steel, made of 81 blocks, that cools from
 * white-hot to dark metal and, as it cools, opens into a lattice of modules
 * joined by lit lines (the foundry years turning into the platforms built
 * since). Everything is drawn from a state, never from what the last frame
 * did, so the same code renders the live hero, the still and the prototype:
 *
 *   const forge = createForge({ THREE, RoundedBoxGeometry, RoomEnvironment, renderer, theme });
 *   forge.frame({ t, heat, open, px, py });   // t in seconds; heat, open 0..1; px, py -1..1
 *
 * No imports here on purpose: the caller hands three.js in (the npm package
 * in the site, Jig's three.jig.min.js in a page or a scene picture).
 */

const NX = 9;
const NY = 3;
const NZ = 3;
const SIZE = 0.42;
const SPARKS = 90;

export const THEMES = {
  dark: { steel: "#5d5a5c", glacier: "#7bd5cb", ember: "#ff7a45", dark: true },
  light: { steel: "#7e7a7c", glacier: "#1d6c78", ember: "#d4511f", dark: false },
};

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (x) => Math.min(1, Math.max(0, x));
const smooth = (x) => {
  const c = clamp(x);
  return c * c * (3 - 2 * c);
};

export function createForge({ THREE, RoundedBoxGeometry, RoomEnvironment, renderer, theme = THEMES.dark }) {
  const rnd = rng(1121);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envMap;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  let distance = 11;
  camera.position.set(0, 0.9, distance);
  camera.lookAt(0, 0, 0);

  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(-4, 6, 5);
  scene.add(key);
  // A cold light from behind, in the lattice's colour, that comes up as the
  // bar opens: today's end of the ramp.
  const rim = new THREE.DirectionalLight(0xffffff, 0);
  rim.position.set(5, 2, -6);
  scene.add(rim);

  const billet = new THREE.Group();
  scene.add(billet);

  // ── the blocks: one instanced mesh, a heat ramp in the shader ──
  const count = NX * NY * NZ;
  const home = [];
  const drift = [];
  const seeds = new Float32Array(count);
  for (let ix = 0; ix < NX; ix++) {
    for (let iy = 0; iy < NY; iy++) {
      for (let iz = 0; iz < NZ; iz++) {
        const i = home.length;
        home.push([ix - (NX - 1) / 2, iy - (NY - 1) / 2, iz - (NZ - 1) / 2]);
        drift.push([(rnd() - 0.5) * 0.5, (rnd() - 0.5) * 0.5, (rnd() - 0.5) * 0.5]);
        // One end of the bar cools first, with a little noise across it.
        seeds[i] = (ix / (NX - 1)) * 0.7 + rnd() * 0.3;
      }
    }
  }

  const uniforms = { uHeat: { value: 1 }, uTime: { value: 0 } };
  const metal = new THREE.MeshStandardMaterial({ metalness: 0.82, roughness: 0.36 });
  metal.onBeforeCompile = (shader) => {
    shader.uniforms.uHeat = uniforms.uHeat;
    shader.uniforms.uTime = uniforms.uTime;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aSeed;\nvarying float vSeed;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvSeed = aSeed;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float uHeat;
uniform float uTime;
varying float vSeed;
vec3 heatRamp(float h) {
  vec3 c = mix(vec3(0.0), vec3(0.36, 0.02, 0.0), smoothstep(0.0, 0.3, h));
  c = mix(c, vec3(0.85, 0.12, 0.01), smoothstep(0.25, 0.7, h));
  c = mix(c, vec3(1.0, 0.36, 0.05), smoothstep(0.7, 1.0, h));
  return c * (0.3 + 0.7 * h);
}`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
float hh = clamp((uHeat - vSeed * 0.4) / 0.6, 0.0, 1.0);
hh *= 0.93 + 0.07 * sin(uTime * 1.7 + vSeed * 31.0);
// Hot metal glows; it does not shine. Its own colour and reflections give
// way to the heat, and come back as it cools.
diffuseColor.rgb *= 1.0 - 0.9 * smoothstep(0.1, 0.6, hh);
// Faces turned to the eye glow brightest; edges and the far sides fall
// off towards red, which gives the bar its depth.
float facing = clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0);
totalEmissiveRadiance += heatRamp(hh * (0.62 + 0.38 * facing));`,
      );
  };
  const blockGeometry = new RoundedBoxGeometry(SIZE, SIZE, SIZE, 3, 0.035);
  blockGeometry.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1));
  const blocks = new THREE.InstancedMesh(blockGeometry, metal, count);
  billet.add(blocks);

  // ── the lattice: lines between neighbouring blocks, and a node in each ──
  const pairs = [];
  home.forEach(([x, y, z], i) => {
    home.forEach(([x2, y2, z2], j) => {
      if (j > i && Math.abs(x - x2) + Math.abs(y - y2) + Math.abs(z - z2) === 1) pairs.push([i, j]);
    });
  });
  const linePositions = new Float32Array(pairs.length * 6);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({ transparent: true, depthWrite: false });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  billet.add(lines);

  const nodeMaterial = new THREE.MeshBasicMaterial({ transparent: true });
  const nodes = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 12, 8), nodeMaterial, count);
  billet.add(nodes);

  // ── the glow behind it, and sparks rising off it while it is hot ──
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 256;
  const g = glowCanvas.getContext("2d");
  const fade = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  fade.addColorStop(0, "rgba(255,255,255,0.9)");
  fade.addColorStop(0.35, "rgba(255,255,255,0.32)");
  fade.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = fade;
  g.fillRect(0, 0, 256, 256);
  const glowMaterial = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(glowCanvas), transparent: true, depthWrite: false });
  // Kept inside the frame at every size, so its edge is never cut by the canvas.
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 3.8), glowMaterial);
  glow.position.set(0, 0, -2.5);
  scene.add(glow);

  const sparkStart = Array.from({ length: SPARKS }, () => ({
    x: (rnd() - 0.5) * NX * SIZE,
    z: (rnd() - 0.5) * NZ * SIZE,
    phase: rnd(),
    speed: 0.25 + rnd() * 0.35,
    sway: rnd() * 6.28,
    seed: rnd(),
  }));
  const sparkAt = new Float32Array(SPARKS * 3);
  const sparkAlpha = new Float32Array(SPARKS);
  const sparkGeometry = new THREE.BufferGeometry();
  sparkGeometry.setAttribute("position", new THREE.BufferAttribute(sparkAt, 3));
  sparkGeometry.setAttribute("aAlpha", new THREE.BufferAttribute(sparkAlpha, 1));
  const sparkMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uColor: { value: new THREE.Color() }, uScale: { value: 1 } },
    vertexShader: `attribute float aAlpha; varying float vAlpha; uniform float uScale;
void main() { vAlpha = aAlpha; vec4 mv = modelViewMatrix * vec4(position, 1.0);
gl_PointSize = uScale * 26.0 / -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; varying float vAlpha;
void main() { float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
gl_FragColor = vec4(uColor, vAlpha * smoothstep(0.5, 0.1, d)); }`,
  });
  const sparks = new THREE.Points(sparkGeometry, sparkMaterial);
  scene.add(sparks);

  const steel = new THREE.Color();
  const glacier = new THREE.Color();
  function setTheme(next) {
    steel.set(next.steel);
    glacier.set(next.glacier);
    metal.color.copy(steel);
    lineMaterial.color.copy(glacier);
    nodeMaterial.color.copy(glacier);
    rim.color.copy(glacier);
    glowMaterial.color.set(next.ember);
    sparkMaterial.uniforms.uColor.value.set(next.dark ? "#ffb070" : next.ember);
    const blend = next.dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    lineMaterial.blending = blend;
    glowMaterial.blending = blend;
    sparkMaterial.blending = blend;
    lineMaterial.needsUpdate = glowMaterial.needsUpdate = sparkMaterial.needsUpdate = true;
    theme = next;
  }
  setTheme(theme);

  /** pixelRatio null leaves the canvas to whoever sized it (a scene picture). */
  function resize(width, height, pixelRatio = 1) {
    if (pixelRatio != null) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
    }
    camera.aspect = width / height;
    // Keep the whole bar in frame when the box is taller than wide.
    distance = width < height ? 11 * (height / width) * 0.92 : 11;
    camera.updateProjectionMatrix();
    sparkMaterial.uniforms.uScale.value = (height * (pixelRatio || 1)) / 600;
  }

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const centres = home.map(() => new THREE.Vector3());

  /** Draws one frame. heat 1 is white-hot, 0 cold; open 0 is one bar, 1 the lattice. */
  function frame({ t = 0, heat = 1, open = 0, px = 0, py = 0 }) {
    uniforms.uHeat.value = heat;
    uniforms.uTime.value = t;
    const o = smooth(open);

    // A slow turn that never stops, plus a share of the pointer.
    billet.rotation.set(0.38 + py * 0.12 + Math.sin(t * 0.21) * 0.03, -0.62 + px * 0.28 + Math.sin(t * 0.13) * 0.06, 0.1);
    billet.position.y = Math.sin(t * 0.5) * 0.04;

    // The camera steps back as the bar opens, so the lattice stays in frame.
    camera.position.z = distance * (1 + o * 0.24);
    const spread = SIZE * (1 + o * 0.5);
    const shrink = 1 - o * 0.42;
    home.forEach(([x, y, z], i) => {
      const [dx, dy, dz] = drift[i];
      const c = centres[i].set(x * spread + dx * o * 0.35, y * spread + dy * o * 0.35, z * spread + dz * o * 0.35);
      e.set(dx * o * 0.9, dy * o * 0.9, dz * o * 0.9);
      q.setFromEuler(e);
      s.setScalar(shrink);
      m.compose(c, q, s);
      blocks.setMatrixAt(i, m);
      s.setScalar(o);
      m.compose(c, q.identity(), s);
      nodes.setMatrixAt(i, m);
    });
    blocks.instanceMatrix.needsUpdate = true;
    nodes.instanceMatrix.needsUpdate = true;

    pairs.forEach(([a, b], k) => {
      centres[a].toArray(linePositions, k * 6);
      centres[b].toArray(linePositions, k * 6 + 3);
    });
    lineGeometry.attributes.position.needsUpdate = true;
    const lit = smooth((open - 0.15) / 0.6);
    lineMaterial.opacity = lit * (theme.dark ? 0.85 : 0.75);
    rim.intensity = lit * 2.4;
    nodeMaterial.opacity = lit;

    glowMaterial.opacity = smooth(heat) * (theme.dark ? 0.55 : 0.28);
    glow.scale.setScalar(0.85 + heat * 0.25);

    billet.updateMatrixWorld();
    const lid = (NY * SIZE) / 2;
    sparkStart.forEach((k, i) => {
      const life = (t * k.speed + k.phase) % 1;
      p.set(k.x * (1 + o * 0.6), lid * (1 + o * 0.6), k.z).applyMatrix4(billet.matrixWorld);
      sparkAt[i * 3] = p.x + Math.sin(life * 4 + k.sway) * 0.12;
      sparkAt[i * 3 + 1] = p.y + life * 2.2;
      sparkAt[i * 3 + 2] = p.z;
      // Only the hot part of the bar throws sparks.
      const local = clamp((heat - k.seed * 0.4) / 0.6);
      sparkAlpha[i] = (1 - life) * smooth((local - 0.45) / 0.4) * Math.min(1, life * 8);
    });
    sparkGeometry.attributes.position.needsUpdate = true;
    sparkGeometry.attributes.aAlpha.needsUpdate = true;

    renderer.render(scene, camera);
  }

  function dispose() {
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
    glowMaterial.map.dispose();
    envMap.dispose();
    pmrem.dispose();
  }

  return { frame, resize, setTheme, dispose };
}
