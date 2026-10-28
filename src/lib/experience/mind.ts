/**
 * A procedural brain, drawn as a 3D point cloud with a nearest-neighbour link
 * network, projected by hand onto a 2D canvas. No model file, no 3D library.
 *
 * Coordinates: x is the long (front-back) axis, y is up, z is left-right.
 * Front of the brain is +x. Units are roughly "brain radii".
 */
import { ambient, cameraDistance, cameraPitch, cameraYaw, clamp01, ignition, smoothstep } from "./timeline";

export interface Mind {
  count: number;
  pos: Float32Array; // x,y,z per node
  tone: Uint8Array; // 0 cream, 1 amber, 2 terminal green
  nodeKey: Float32Array; // when (0..1) the ignition front reaches this node
  edgeCount: number;
  edgeA: Uint16Array;
  edgeB: Uint16Array;
  edgeKey: Float32Array; // when the front reaches this link
  edgePulse: Uint8Array; // 1 if a travelling pulse runs along this link
  edgePhase: Float32Array;
  // scratch buffers, reused every frame (no per-frame allocation)
  sx: Float32Array;
  sy: Float32Array;
  sz: Float32Array;
  buckets: Int32Array[];
  bucketLen: Int32Array;
}

/** Small deterministic PRNG so the brain looks the same every visit and in tests. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Vec3 = [number, number, number];

function sampleCerebrum(rand: () => number): Vec3 {
  const u = rand() * 2 - 1;
  const th = rand() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  const dx = s * Math.cos(th);
  const dy = u;
  const dz = s * Math.sin(th);
  const ry = dy < 0 ? dy * 0.72 : dy; // flatter underside
  // Folds (gyri): a few interfering waves over the surface direction.
  const g =
    1 +
    0.075 * Math.sin(7 * dx + 3 * dy) * Math.sin(6 * dz - 2 * dx) +
    0.05 * Math.sin(11 * dy + 5 * dz + 3 * dx) +
    0.03 * Math.sin(17 * dx) * Math.sin(13 * dz);
  const shell = rand() < 0.8;
  const r = shell ? 0.97 + rand() * 0.05 : Math.cbrt(rand()) * 0.95;
  const x = 1.28 * dx * r * g;
  let y = 0.86 * ry * r * g;
  let z = 0.98 * dz * r * g;
  z += (z >= 0 ? 1 : -1) * 0.035; // two hemispheres
  if (Math.abs(z) < 0.11 && y > 0.2) y -= (0.11 - Math.abs(z)) * 0.9; // longitudinal fissure
  return [x, y, z];
}

function sampleCerebellum(rand: () => number): Vec3 {
  const u = rand() * 2 - 1;
  const th = rand() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  const dx = s * Math.cos(th);
  const dy = u;
  const dz = s * Math.sin(th);
  const r = (0.95 + rand() * 0.06) * (1 + 0.05 * Math.sin(34 * dy)); // fine horizontal ridges
  return [-0.78 + 0.42 * dx * r, -0.6 + 0.27 * dy * r, 0.55 * dz * r];
}

function sampleStem(rand: () => number): Vec3 {
  const t = rand();
  const a = rand() * Math.PI * 2;
  const rad = 0.12 * (0.8 + rand() * 0.25);
  return [-0.28 - 0.12 * t + Math.cos(a) * rad, -0.7 - 0.55 * t, Math.sin(a) * rad];
}

/** Build the brain and its link network. Cost is paid once, not per frame. */
export function createMind(count: number, seed = 607): Mind {
  const rand = mulberry32(seed);
  const pos = new Float32Array(count * 3);
  const tone = new Uint8Array(count);
  const nodeKey = new Float32Array(count);
  const origin: Vec3 = [0.95, 0.2, 0]; // where the "thought" starts: the front of the brain
  const maxD = 2.7;

  for (let i = 0; i < count; i++) {
    const k = rand();
    const p = k < 0.83 ? sampleCerebrum(rand) : k < 0.94 ? sampleCerebellum(rand) : sampleStem(rand);
    pos[i * 3] = p[0];
    pos[i * 3 + 1] = p[1];
    pos[i * 3 + 2] = p[2];
    const tr = rand();
    tone[i] = tr < 0.04 ? 2 : tr < 0.18 ? 1 : 0;
    const d = Math.hypot(p[0] - origin[0], p[1] - origin[1], p[2] - origin[2]);
    nodeKey[i] = clamp01(d / maxD) * 0.82 + rand() * 0.18;
  }

  // k-nearest links via a coarse spatial hash.
  const cell = 0.2;
  const grid = new Map<string, number[]>();
  const keyOf = (x: number, y: number, z: number) => `${Math.floor(x / cell)},${Math.floor(y / cell)},${Math.floor(z / cell)}`;
  for (let i = 0; i < count; i++) {
    const k = keyOf(pos[i * 3] as number, pos[i * 3 + 1] as number, pos[i * 3 + 2] as number);
    const list = grid.get(k);
    if (list) list.push(i);
    else grid.set(k, [i]);
  }

  const K = 3;
  const maxLink2 = 0.3 * 0.3;
  const seen = new Set<number>();
  const aList: number[] = [];
  const bList: number[] = [];
  for (let i = 0; i < count; i++) {
    const x = pos[i * 3] as number;
    const y = pos[i * 3 + 1] as number;
    const z = pos[i * 3 + 2] as number;
    const cx = Math.floor(x / cell);
    const cy = Math.floor(y / cell);
    const cz = Math.floor(z / cell);
    const near: [number, number][] = [];
    for (let ix = cx - 1; ix <= cx + 1; ix++)
      for (let iy = cy - 1; iy <= cy + 1; iy++)
        for (let iz = cz - 1; iz <= cz + 1; iz++) {
          const list = grid.get(`${ix},${iy},${iz}`);
          if (!list) continue;
          for (const j of list) {
            if (j === i) continue;
            const dx = (pos[j * 3] as number) - x;
            const dy = (pos[j * 3 + 1] as number) - y;
            const dz = (pos[j * 3 + 2] as number) - z;
            const d2 = dx * dx + dy * dy + dz * dz;
            if (d2 < maxLink2) near.push([d2, j]);
          }
        }
    near.sort((m, n) => m[0] - n[0]);
    for (let n = 0; n < Math.min(K, near.length); n++) {
      const j = (near[n] as [number, number])[1];
      const lo = Math.min(i, j);
      const hi = Math.max(i, j);
      const id = lo * count + hi;
      if (seen.has(id)) continue;
      seen.add(id);
      aList.push(lo);
      bList.push(hi);
    }
  }

  const edgeCount = aList.length;
  const edgeA = Uint16Array.from(aList);
  const edgeB = Uint16Array.from(bList);
  const edgeKey = new Float32Array(edgeCount);
  const edgePulse = new Uint8Array(edgeCount);
  const edgePhase = new Float32Array(edgeCount);
  for (let e = 0; e < edgeCount; e++) {
    edgeKey[e] = Math.max(nodeKey[edgeA[e] as number] as number, nodeKey[edgeB[e] as number] as number);
    edgePulse[e] = rand() < 0.2 ? 1 : 0;
    edgePhase[e] = rand();
  }

  const LEVELS = 5;
  return {
    count,
    pos,
    tone,
    nodeKey,
    edgeCount,
    edgeA,
    edgeB,
    edgeKey,
    edgePulse,
    edgePhase,
    sx: new Float32Array(count),
    sy: new Float32Array(count),
    sz: new Float32Array(count),
    buckets: Array.from({ length: LEVELS }, () => new Int32Array(edgeCount)),
    bucketLen: new Int32Array(LEVELS),
  };
}

export interface FrameState {
  /** CSS pixels. The context is expected to be pre-scaled by devicePixelRatio. */
  w: number;
  h: number;
  /** Scroll progress 0..1. */
  p: number;
  /** Seconds since start (drives idle sway and pulses). */
  t: number;
  /** Pointer position, -0.5..0.5, for slight parallax. */
  mx: number;
  my: number;
  /** Cheaper drawing for phones: no pulses, plain blending. */
  lowPower: boolean;
}

const CREAM = "244,240,230";
const AMBER = "233,177,85";
const GREEN = "98,230,165";
const NEAR = 0.16;

/** Draw one frame. Allocation-free apart from a couple of gradients. */
export function drawMind(ctx: CanvasRenderingContext2D, m: Mind, f: FrameState): void {
  const { w, h, p, t } = f;
  ctx.clearRect(0, 0, w, h);

  const camD = cameraDistance(p);
  const yaw = cameraYaw(p, t) + f.mx * 0.22;
  const pitch = cameraPitch(p) + f.my * 0.12;
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const focal = Math.min(w, h) * 1.22;
  // On wide screens the brain starts right of the headline and drifts to centre as you go in.
  const ox = w / 2 + (w > 900 ? w * 0.17 * (1 - smoothstep(0.08, 0.42, p)) : 0);
  const oy = h / 2 + h * 0.015;
  const ign = ignition(p);
  const amb = ambient(p);

  const { pos, sx, sy: syArr, sz } = m;
  for (let i = 0; i < m.count; i++) {
    const x = pos[i * 3] as number;
    const y = pos[i * 3 + 1] as number;
    const z = pos[i * 3 + 2] as number;
    const x1 = x * cy + z * sy;
    const z1 = -x * sy + z * cy;
    const y2 = y * cp - z1 * sp;
    const z2 = y * sp + z1 * cp;
    const zc = z2 + camD;
    if (zc < NEAR) {
      sz[i] = -1;
      continue;
    }
    const k = focal / zc;
    sx[i] = ox + x1 * k;
    syArr[i] = oy - y2 * k;
    sz[i] = zc;
  }

  // Glow at the core, brightening as ideas ignite.
  if (ign > 0.02 && camD > 0.3) {
    const k = focal / camD;
    const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, 1.4 * k);
    g.addColorStop(0, `rgba(${AMBER},${(0.1 * Math.min(1, ign) * amb).toFixed(3)})`);
    g.addColorStop(1, `rgba(${AMBER},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  const additive = !f.lowPower;
  ctx.globalCompositeOperation = additive ? "lighter" : "source-over";
  ctx.lineWidth = 1;

  // Links: one faint scaffold pass, then amber links grouped into brightness levels.
  const LEVELS = m.buckets.length;
  m.bucketLen.fill(0);
  ctx.beginPath();
  for (let e = 0; e < m.edgeCount; e++) {
    const a = m.edgeA[e] as number;
    const b = m.edgeB[e] as number;
    const za = sz[a] as number;
    const zb = sz[b] as number;
    if (za < 0 || zb < 0) continue;
    const depth = clamp01(1.25 - ((za + zb) * 0.5) * 0.22);
    const lit = smoothstep(m.edgeKey[e] as number, (m.edgeKey[e] as number) + 0.09, ign);
    if (lit > 0.02) {
      const lvl = Math.min(LEVELS - 1, Math.floor(lit * depth * LEVELS));
      const list = m.buckets[lvl] as Int32Array;
      list[m.bucketLen[lvl] as number] = e;
      m.bucketLen[lvl] = (m.bucketLen[lvl] as number) + 1;
    }
    ctx.moveTo(sx[a] as number, syArr[a] as number);
    ctx.lineTo(sx[b] as number, syArr[b] as number);
  }
  ctx.strokeStyle = `rgba(${CREAM},${(0.11 * amb).toFixed(3)})`;
  ctx.stroke();

  for (let lvl = 0; lvl < LEVELS; lvl++) {
    const n = m.bucketLen[lvl] as number;
    if (n === 0) continue;
    const list = m.buckets[lvl] as Int32Array;
    ctx.beginPath();
    for (let q = 0; q < n; q++) {
      const e = list[q] as number;
      const a = m.edgeA[e] as number;
      const b = m.edgeB[e] as number;
      ctx.moveTo(sx[a] as number, syArr[a] as number);
      ctx.lineTo(sx[b] as number, syArr[b] as number);
    }
    ctx.strokeStyle = `rgba(${AMBER},${(((lvl + 1) / LEVELS) * 0.5 * amb).toFixed(3)})`;
    ctx.stroke();
  }

  // Nodes: three passes (cream, amber, green) so the fill style changes only three times.
  for (let pass = 0; pass < 3; pass++) {
    ctx.fillStyle = `rgb(${pass === 0 ? CREAM : pass === 1 ? AMBER : GREEN})`;
    for (let i = 0; i < m.count; i++) {
      const zc = sz[i] as number;
      if (zc < 0) continue;
      const tone = m.tone[i] as number;
      const lit = smoothstep(m.nodeKey[i] as number, (m.nodeKey[i] as number) + 0.1, ign);
      const cat = tone === 2 ? 2 : lit > 0.5 || tone === 1 ? 1 : 0;
      if (cat !== pass) continue;
      const depth = clamp01(1.3 - zc * 0.24);
      const r = Math.min(4.2, Math.max(0.75, (0.0019 * focal) / zc));
      ctx.globalAlpha = Math.min(1, (0.55 + 0.35 * lit + 0.1 * (tone ? 1 : 0)) * depth * amb);
      const px = sx[i] as number;
      const py = syArr[i] as number;
      if (r < 1.4) ctx.fillRect(px - r, py - r, r * 2, r * 2);
      else {
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.globalAlpha = 1;

  // Pulses travelling along lit links.
  if (!f.lowPower && ign > 0.15) {
    ctx.fillStyle = `rgb(${CREAM})`;
    for (let e = 0; e < m.edgeCount; e++) {
      if (!m.edgePulse[e]) continue;
      const a = m.edgeA[e] as number;
      const b = m.edgeB[e] as number;
      if ((sz[a] as number) < 0 || (sz[b] as number) < 0) continue;
      const lit = smoothstep(m.edgeKey[e] as number, (m.edgeKey[e] as number) + 0.09, ign);
      if (lit < 0.6) continue;
      const s = (t * 0.45 + (m.edgePhase[e] as number)) % 1;
      const px = (sx[a] as number) + ((sx[b] as number) - (sx[a] as number)) * s;
      const py = (syArr[a] as number) + ((syArr[b] as number) - (syArr[a] as number)) * s;
      ctx.globalAlpha = 0.9 * amb;
      ctx.fillRect(px - 1.2, py - 1.2, 2.4, 2.4);
    }
    ctx.globalAlpha = 1;
  }

  ctx.globalCompositeOperation = "source-over";
}
