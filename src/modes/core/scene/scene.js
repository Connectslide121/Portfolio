/**
 * The system: the platforms Jon leads, as a live graph. Five products sit
 * round SAGE, the shared core; each product is a column of four nodes, one
 * per layer of the stack (client, services, data, AI), with smaller service
 * nodes round it and packets of light running along every link.
 *
 * Scrolled, the graph opens into those four layers: every node drops onto
 * its layer's plane, the products become columns through the stack and SAGE
 * the spine in the middle.
 *
 * Everything is drawn from a state, never from the frame before, so the same
 * code renders the live hero and its still (a Jig scene picture):
 *
 *   const core = createCore({ THREE, renderer, theme, post });
 *   core.frame({ t, assemble, explode, focus, hover, yaw, pitch, px, py });
 *
 * No imports on purpose: three.js and its post-processing passes are handed
 * in (the npm package in the site, Jig's three.jig.min.js in a picture).
 */

export const THEMES = {
  dark: {
    dark: true,
    bg: "#070a12",
    layers: ["#4de1ff", "#5b8cff", "#3fe0b0", "#a585ff"],
    core: "#f4f7ff",
    edge: "#4d8dff",
    dust: "#7d8db5",
  },
  light: {
    dark: false,
    bg: "#f3f5fa",
    layers: ["#0a7ea8", "#2f5be0", "#0d8f6c", "#6a4cf0"],
    core: "#0b1020",
    edge: "#4a5f8c",
    dust: "#9aa6c2",
  },
};

const PRODUCTS = 5;
const LAYERS = 4;
const SATELLITES = 8;
const DUST = 700;

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
const easeOut = (x) => 1 - (1 - clamp(x)) ** 3;

export function createCore({ THREE, renderer, theme = THEMES.dark, post = null }) {
  const rnd = rng(2025);
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  const bg = new THREE.Color();
  scene.background = bg;
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const world = new THREE.Group();
  scene.add(world);
  const system = new THREE.Group();
  world.add(system);

  // ── the nodes ─────────────────────────────────────────────────────────
  // kind: 0 product node, 1 satellite, 2 core. owner: product index (-1 core).
  const nodes = [];
  const randomDir = () => {
    const u = rnd() * 2 - 1;
    const a = rnd() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    return [s * Math.cos(a), u, s * Math.sin(a)];
  };
  const scatterOf = () => {
    const [x, y, z] = randomDir();
    const r = 7 + rnd() * 5;
    return [x * r, y * r, z * r];
  };
  const layerY = (l) => (1.5 - l) * 1.35;

  for (let p = 0; p < PRODUCTS; p++) {
    const a = (p / PRODUCTS) * Math.PI * 2 + 0.35;
    const c = [Math.cos(a) * 2.7, Math.sin(p * 1.7) * 0.55, Math.sin(a) * 2.7];
    const e = [Math.cos(a) * 2.5, 0, Math.sin(a) * 2.5];
    for (let l = 0; l < LAYERS; l++) {
      nodes.push({
        kind: 0,
        owner: p,
        layer: l,
        size: 0.1,
        graph: [c[0] + (rnd() - 0.5) * 0.12, c[1] + (1.5 - l) * 0.3, c[2] + (rnd() - 0.5) * 0.12],
        open: [e[0], layerY(l), e[2]],
        scatter: scatterOf(),
        delay: rnd() * 0.35,
      });
    }
    for (let k = 0; k < SATELLITES; k++) {
      const l = k % LAYERS;
      const [dx, dy, dz] = randomDir();
      const r = 0.55 + rnd() * 0.5;
      const ring = rnd() * Math.PI * 2;
      const rr = 0.45 + rnd() * 0.45;
      nodes.push({
        kind: 1,
        owner: p,
        layer: l,
        size: 0.03 + rnd() * 0.025,
        graph: [c[0] + dx * r, c[1] + dy * r, c[2] + dz * r],
        open: [e[0] + Math.cos(ring) * rr, layerY(l), e[2] + Math.sin(ring) * rr],
        scatter: scatterOf(),
        delay: 0.2 + rnd() * 0.45,
      });
    }
  }
  const coreStart = nodes.length;
  for (let l = 0; l < LAYERS; l++) {
    nodes.push({
      kind: 2,
      owner: -1,
      layer: l,
      size: 0.13,
      graph: [0, (1.5 - l) * 0.62, 0],
      open: [0, layerY(l), 0],
      scatter: scatterOf(),
      delay: 0,
    });
  }
  const productNode = (p, l) => p * (LAYERS + SATELLITES) + l;

  const nodeMesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), new THREE.MeshBasicMaterial(), nodes.length);
  nodeMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(nodes.length * 3), 3);
  system.add(nodeMesh);

  // ── the links ─────────────────────────────────────────────────────────
  const edges = [];
  for (let p = 0; p < PRODUCTS; p++) {
    for (let l = 0; l < LAYERS - 1; l++) edges.push([productNode(p, l), productNode(p, l + 1), p]);
    for (let l = 0; l < LAYERS; l++) edges.push([productNode(p, l), coreStart + l, p]);
    for (let k = 0; k < SATELLITES; k++) {
      const s = p * (LAYERS + SATELLITES) + LAYERS + k;
      edges.push([productNode(p, nodes[s].layer), s, p]);
    }
    // Neighbours share their AI and data layers.
    edges.push([productNode(p, 3), productNode((p + 1) % PRODUCTS, 3), -2]);
    edges.push([productNode(p, 2), productNode((p + 2) % PRODUCTS, 2), -2]);
  }
  for (let l = 0; l < LAYERS - 1; l++) edges.push([coreStart + l, coreStart + l + 1, -1]);

  const linePos = new Float32Array(edges.length * 6);
  const lineCol = new Float32Array(edges.length * 6);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
  lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineCol, 3));
  const lines = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ vertexColors: true }));
  system.add(lines);

  // ── packets running along the links ───────────────────────────────────
  const packets = edges.map(() => ({ speed: 0.18 + rnd() * 0.35, phase: rnd(), back: rnd() < 0.5 }));
  const packetPos = new Float32Array(edges.length * 3);
  const packetCol = new Float32Array(edges.length * 3);
  const packetGeometry = new THREE.BufferGeometry();
  packetGeometry.setAttribute("position", new THREE.BufferAttribute(packetPos, 3));
  packetGeometry.setAttribute("color", new THREE.BufferAttribute(packetCol, 3));
  const packetMaterial = new THREE.PointsMaterial({ size: 0.09, vertexColors: true, sizeAttenuation: true });
  system.add(new THREE.Points(packetGeometry, packetMaterial));

  // ── SAGE's shell, and the layer planes the graph opens onto ───────────
  const shellMaterial = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, depthWrite: false });
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 1), shellMaterial);
  system.add(shell);

  const planes = [];
  for (let l = 0; l < LAYERS; l++) {
    const g = new THREE.Group();
    const material = new THREE.LineBasicMaterial({ transparent: true, depthWrite: false });
    for (const r of [1.4, 2.5, 3.5]) {
      const pts = [];
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
      }
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), material));
    }
    const spokes = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      spokes.push(new THREE.Vector3(Math.cos(a) * 1.4, 0, Math.sin(a) * 1.4), new THREE.Vector3(Math.cos(a) * 3.5, 0, Math.sin(a) * 3.5));
    }
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(spokes), material));
    g.position.y = layerY(l);
    system.add(g);
    planes.push({ group: g, material });
  }

  // ── dust in the dark around it ────────────────────────────────────────
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    const [x, y, z] = randomDir();
    const r = 5 + rnd() * 9;
    dustPos.set([x * r, y * r * 0.6, z * r], i * 3);
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dustMaterial = new THREE.PointsMaterial({ size: 0.025, transparent: true, opacity: 0.6, depthWrite: false });
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  world.add(dust);

  // ── glow (bloom), only on the dark page ───────────────────────────────
  let composer = null;
  let bloom = null;
  if (post) {
    composer = new post.EffectComposer(renderer);
    composer.addPass(new post.RenderPass(scene, camera));
    bloom = new post.UnrealBloomPass(new THREE.Vector2(256, 256), 0.6, 0.35, 0.22);
    composer.addPass(bloom);
    composer.addPass(new post.OutputPass());
  }

  // ── theme ─────────────────────────────────────────────────────────────
  const layerColors = [];
  const coreColor = new THREE.Color();
  const edgeColor = new THREE.Color();
  function setTheme(next) {
    theme = next;
    bg.set(next.bg);
    layerColors.length = 0;
    next.layers.forEach((c) => layerColors.push(new THREE.Color(c)));
    coreColor.set(next.core);
    edgeColor.set(next.edge);
    shellMaterial.color.copy(edgeColor);
    dustMaterial.color.set(next.dust);
    planes.forEach((pl, l) => pl.material.color.copy(layerColors[l]));
  }
  setTheme(theme);

  let width = 1;
  let height = 1;
  function resize(w, h, pixelRatio = 1) {
    width = w;
    height = h;
    if (pixelRatio != null) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(w, h, false);
    }
    composer?.setPixelRatio(pixelRatio || 1);
    composer?.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    packetMaterial.size = 0.09 * Math.max(1, (pixelRatio || 1) * 0.75);
  }

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const v = new THREE.Vector3();
  const at = nodes.map(() => new THREE.Vector3());
  const tmp = new THREE.Color();
  const mixBg = (color, k, out) => out.copy(bg).lerp(color, k);
  const projected = [];

  /**
   * One frame. assemble 0..1 brings the graph in from scattered points;
   * explode 0..1 opens it into the layers; focus is the layer being read
   * (-1 none); hover the product under the pointer (-1 none); yaw and pitch
   * come from dragging, px and py from the pointer (-1..1); shiftX and
   * shiftY place the system in the frame (beside the text).
   */
  function frame({ t = 0, assemble = 1, explode = 0, focus = -1, hover = -1, yaw = 0, pitch = 0, px = 0, py = 0, shiftX = 0, shiftY = 0, distance = 11 }) {
    const ex = smooth(explode);

    camera.position.set(0, 0.6 + ex * 2.2, distance + ex * 1.5);
    camera.lookAt(shiftX * 0.15, ex * 0.2, 0);
    world.position.set(shiftX, shiftY, 0);
    system.rotation.set(0.12 + ex * 0.22 + pitch + py * 0.1, t * 0.06 + yaw + px * 0.22, 0);
    dust.rotation.y = t * 0.012;

    // Where every node is, and how it looks.
    nodes.forEach((n, i) => {
      const k = easeOut((assemble - n.delay) / (1 - n.delay * 0.6));
      const gx = n.graph[0] + (n.open[0] - n.graph[0]) * ex;
      const gy = n.graph[1] + (n.open[1] - n.graph[1]) * ex;
      const gz = n.graph[2] + (n.open[2] - n.graph[2]) * ex;
      // A slow breath, so nothing is ever quite still.
      const bob = Math.sin(t * 0.9 + i * 1.7) * 0.03 * (n.kind === 1 ? 2 : 1);
      at[i].set(n.scatter[0] + (gx - n.scatter[0]) * k, n.scatter[1] + (gy - n.scatter[1]) * k + bob, n.scatter[2] + (gz - n.scatter[2]) * k);

      const lit = hover < 0 ? 1 : n.owner === hover || n.kind === 2 ? 1 : 0.32;
      const focused = focus < 0 ? 1 : n.layer === Math.round(focus) ? 1 : 0.38 + 0.62 * (1 - ex);
      const grow = (n.owner === hover && hover >= 0 ? 1.55 : 1) * (focus >= 0 && n.layer === Math.round(focus) ? 1 + 0.4 * ex : 1);
      s.setScalar(n.size * grow * (0.2 + 0.8 * k));
      m.compose(at[i], q, s);
      nodeMesh.setMatrixAt(i, m);
      mixBg(n.kind === 2 ? coreColor : layerColors[n.layer], Math.min(lit, focused) * (0.25 + 0.75 * k), tmp);
      nodeMesh.setColorAt(i, tmp);
    });
    nodeMesh.instanceMatrix.needsUpdate = true;
    nodeMesh.instanceColor.needsUpdate = true;

    // The links, dimmed unless they belong to what is pointed at.
    edges.forEach(([a, b, owner], k) => {
      at[a].toArray(linePos, k * 6);
      at[b].toArray(linePos, k * 6 + 3);
      const lit = hover < 0 ? 0.55 : owner === hover ? 1 : 0.14;
      const sameLayer = nodes[a].layer === nodes[b].layer;
      const focused = focus < 0 || !sameLayer ? 1 : nodes[a].layer === Math.round(focus) ? 1.4 : 0.5;
      const color = sameLayer && owner >= 0 && nodes[a].kind !== 2 && nodes[b].kind !== 2 ? layerColors[nodes[a].layer] : edgeColor;
      mixBg(color, Math.min(1, lit * focused) * smooth(assemble * 1.3 - 0.3), tmp);
      tmp.toArray(lineCol, k * 6);
      tmp.toArray(lineCol, k * 6 + 3);

      const pk = packets[k];
      let f = (t * pk.speed + pk.phase) % 1;
      if (pk.back) f = 1 - f;
      v.copy(at[a]).lerp(at[b], f);
      v.toArray(packetPos, k * 3);
      mixBg(theme.dark ? coreColor : color, Math.min(1, lit * 1.4) * smooth(assemble * 1.5 - 0.5), tmp);
      tmp.toArray(packetCol, k * 3);
    });
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;
    packetGeometry.attributes.position.needsUpdate = true;
    packetGeometry.attributes.color.needsUpdate = true;

    shell.position.copy(at[coreStart + 1]).lerp(at[coreStart + 2], 0.5);
    shell.rotation.set(t * 0.2, t * 0.3, 0);
    shell.scale.setScalar(Math.max(0.001, (1 - ex) * smooth(assemble)));
    shellMaterial.opacity = 0.35 * (1 - ex);

    planes.forEach((pl, l) => {
      const f = focus >= 0 && l === Math.round(focus) ? 1 : 0.45;
      pl.material.opacity = ex * f * (theme.dark ? 0.5 : 0.6);
      pl.group.visible = ex > 0.01;
      pl.group.rotation.y = t * 0.02 * (l % 2 ? 1 : -1);
    });

    dustMaterial.opacity = (theme.dark ? 0.55 : 0.5) * smooth(assemble);

    // Where each product's label goes: above its top node, in pixels.
    world.updateMatrixWorld();
    projected.length = 0;
    for (let p = 0; p < PRODUCTS + 1; p++) {
      const head = p < PRODUCTS ? at[productNode(p, 0)] : at[coreStart];
      v.copy(head).applyMatrix4(system.matrixWorld);
      v.y += 0.32;
      v.project(camera);
      projected.push({ x: (v.x * 0.5 + 0.5) * width, y: (-v.y * 0.5 + 0.5) * height, z: v.z, ndc: [v.x, v.y] });
    }

    if (composer && theme.dark) {
      bloom.strength = 0.6 - ex * 0.15;
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  }

  /** The labels' places from the last frame: five products, then SAGE. */
  const labels = () => projected;

  /** The product (0..4, or 5 for SAGE) nearest the pointer, or -1. */
  function pick(nx, ny) {
    let best = -1;
    let bestD = 0.09;
    projected.forEach((p, i) => {
      const dx = (p.ndc[0] - nx) * camera.aspect;
      const dy = p.ndc[1] - 0.06 - ny;
      const d = Math.hypot(dx, dy);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  }

  function dispose() {
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
    composer?.dispose?.();
  }

  return { frame, resize, setTheme, labels, pick, dispose };
}
