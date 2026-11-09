"use client";

import { useEffect, useRef, useState } from "react";

export type BgVariant = "wave" | "hyperspeed" | "aurora" | "galaxy";

const VARIANTS: BgVariant[] = ["wave", "hyperspeed", "aurora", "galaxy"];

/**
 * Animated background behind the whole site.
 * Add ?bg=wave | hyperspeed | aurora | galaxy to the URL to preview another style.
 */
export default function AnimatedBackground({ variant }: { variant?: BgVariant }) {
  // No style chosen = no animated background (preview one with ?bg=...).
  const [active, setActive] = useState<BgVariant | undefined>(variant);
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("bg") as BgVariant | null;
    if (q && VARIANTS.includes(q)) setActive(q);
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !active) return;
    const start = { wave: startWave, hyperspeed: startHyperspeed, aurora: startAurora, galaxy: startGalaxy }[active];
    return start(canvas);
  }, [active]);

  if (!active) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* A fresh canvas per style, because 2D and WebGL can't share one. */}
      <canvas key={active} ref={ref} className="absolute inset-0" />
      {/* Darken the edges a little so text stays easy to read. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,7,0.65)_100%)]" />
    </div>
  );
}

/* ================= Shared helpers ================= */

function trackPointer() {
  const m = { x: 0, y: 0, tx: 0, ty: 0, down: false };
  const move = (e: PointerEvent) => {
    m.tx = (e.clientX / window.innerWidth) * 2 - 1;
    m.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  const down = () => (m.down = true);
  const up = () => (m.down = false);
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerdown", down);
  window.addEventListener("pointerup", up);
  return {
    m,
    ease(k = 0.05) {
      m.x += (m.tx - m.x) * k;
      m.y += (m.ty - m.y) * k;
    },
    stop() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    },
  };
}

/** Sizes the canvas to the window and runs draw() every frame. Returns a stop function. */
function runLoop(
  canvas: HTMLCanvasElement,
  draw: (t: number) => void,
  onResize: (w: number, h: number, dpr: number) => void,
) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    onResize(w, h, dpr);
  };
  resize();
  window.addEventListener("resize", resize);
  let raf = 0;
  const frame = (ms: number) => {
    draw(ms / 1000);
    if (!reduced) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}

function makeProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  gl.useProgram(p);
  return p;
}

function bindAttr(gl: WebGLRenderingContext, prog: WebGLProgram, name: string, data: Float32Array, size: number) {
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, name);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
}

const ROUND_POINT_FS = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = 1.0 - smoothstep(0.0, 0.5, d);
  gl_FragColor = vec4(vColor, a * vAlpha);
}`;

/* ================= 1. 3D particle wave ================= */

function startWave(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
  if (!gl) return;
  const vs = `
  attribute vec2 grid;
  uniform float t;
  uniform float aspect;
  uniform vec2 mouse;
  uniform float pxScale;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float x = grid.x;
    float z = grid.y;
    float y = sin(x * 0.22 + t * 0.9) * 0.9 + cos(z * 0.28 + t * 0.7) * 0.9 + sin((x + z) * 0.12 + t * 0.5) * 0.6;
    vec2 m = vec2(mouse.x * 18.0, -14.0 + mouse.y * 10.0);
    float d = distance(vec2(x, z), m);
    y += 2.2 * sin(d * 0.7 - t * 3.5) * exp(-d * 0.12);

    vec3 p = vec3(x, y, z) - vec3(0.0, 6.0, 10.0);
    float pitch = 0.32;
    p = vec3(p.x, p.y * cos(pitch) - p.z * sin(pitch), p.y * sin(pitch) + p.z * cos(pitch));
    float f = 1.6;
    gl_Position = vec4(p.x * f / aspect, p.y * f, 0.0, -p.z);
    gl_PointSize = max(2.0, pxScale * 60.0 / -p.z);

    float h = clamp((y + 2.5) / 5.0, 0.0, 1.0);
    vColor = mix(vec3(0.2, 0.4, 1.0), vec3(0.75, 0.85, 1.0), h);
    float depthFade = smoothstep(-48.0, -25.0, z);
    vAlpha = (0.5 + h * 0.5) * depthFade;
  }`;
  const prog = makeProgram(gl, vs, ROUND_POINT_FS);
  const cols = 140, rows = 80;
  const pts = new Float32Array(cols * rows * 2);
  let i = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      pts[i++] = (c / (cols - 1) - 0.5) * 70;
      pts[i++] = -(r / (rows - 1)) * 50 + 2;
    }
  bindAttr(gl, prog, "grid", pts, 2);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  const u = (n: string) => gl.getUniformLocation(prog, n);
  const ptr = trackPointer();

  const stopLoop = runLoop(
    canvas,
    (t) => {
      ptr.ease();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(u("t"), t);
      gl.uniform2f(u("mouse"), ptr.m.x, ptr.m.y);
      gl.drawArrays(gl.POINTS, 0, cols * rows);
    },
    (w, h, dpr) => {
      gl.viewport(0, 0, w * dpr, h * dpr);
      gl.uniform1f(u("aspect"), w / h);
      gl.uniform1f(u("pxScale"), dpr * Math.min(1, w / 1200) + 0.4);
    },
  );
  return () => {
    stopLoop();
    ptr.stop();
  };
}

/* ================= 2. Hyperspeed light tunnel ================= */

function startHyperspeed(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const ptr = trackPointer();
  type Star = { x: number; y: number; z: number; pz: number; hue: number };
  let w = 0, h = 0, stars: Star[] = [];
  let speed = 0.6;
  const colors = [225, 235, 255, 270, 195];

  const reset = (s: Star, far = true) => {
    s.x = (Math.random() - 0.5) * 2;
    s.y = (Math.random() - 0.5) * 2;
    s.z = far ? 1 : Math.random();
    s.pz = s.z;
    s.hue = colors[(Math.random() * colors.length) | 0];
  };

  const stopLoop = runLoop(
    canvas,
    () => {
      ptr.ease(0.04);
      const target = ptr.m.down ? 6 : 0.9;
      speed += (target - speed) * 0.05;
      ctx.fillStyle = "rgba(5,5,7,0.28)";
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2 + ptr.m.x * w * 0.12;
      const cy = h / 2 - ptr.m.y * h * 0.12;
      const fov = Math.max(w, h) * 0.5;
      ctx.lineCap = "round";
      for (const s of stars) {
        s.pz = s.z;
        s.z -= 0.006 * speed;
        if (s.z <= 0.02) {
          reset(s);
          continue;
        }
        const sx = cx + (s.x / s.z) * fov * 0.5;
        const sy = cy + (s.y / s.z) * fov * 0.5;
        const px = cx + (s.x / s.pz) * fov * 0.5;
        const py = cy + (s.y / s.pz) * fov * 0.5;
        if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) {
          reset(s);
          continue;
        }
        const life = 1 - s.z;
        ctx.strokeStyle = `hsla(${s.hue}, 95%, ${55 + life * 25}%, ${Math.min(1, life * 1.4)})`;
        ctx.lineWidth = Math.max(0.6, life * 3);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
      // Glowing core in the centre
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.35);
      g.addColorStop(0, `rgba(80,120,255,${0.1 + speed * 0.02})`);
      g.addColorStop(1, "rgba(80,120,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    },
    (W, H, dpr) => {
      w = W;
      h = H;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(900, (W * H) / 1800));
      stars = Array.from({ length: count }, () => {
        const s = { x: 0, y: 0, z: 0, pz: 0, hue: 0 };
        reset(s, false);
        return s;
      });
    },
  );
  return () => {
    stopLoop();
    ptr.stop();
  };
}

/* ================= 3. Liquid aurora shader ================= */

function startAurora(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { alpha: true });
  if (!gl) return;
  const vs = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
  const fs = `
  precision highp float;
  uniform vec2 res;
  uniform float t;
  uniform vec2 mouse;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }
  void main(){
    vec2 uv = gl_FragCoord.xy / res;
    vec2 p = uv;
    p.x *= res.x / res.y;
    p += mouse * 0.12;
    float tt = t * 0.09;
    vec2 q = vec2(fbm(p * 1.4 + tt), fbm(p * 1.4 + vec2(5.2, 1.3) - tt));
    vec2 r = vec2(fbm(p * 1.4 + 4.0 * q + vec2(1.7, 9.2) + tt * 1.5), fbm(p * 1.4 + 4.0 * q + vec2(8.3, 2.8) - tt));
    float f = fbm(p * 1.4 + 4.0 * r);

    vec3 base = vec3(0.02, 0.02, 0.035);
    vec3 blue = vec3(0.2, 0.4, 1.0);
    vec3 violet = vec3(0.5, 0.22, 0.95);
    vec3 cyan = vec3(0.1, 0.75, 1.0);
    vec3 col = mix(base, blue, clamp(f * f * 2.4, 0.0, 1.0));
    col = mix(col, violet, clamp(length(q) * 0.8 - 0.25, 0.0, 1.0) * 0.7);
    col = mix(col, cyan, clamp(r.x * r.x * 0.9, 0.0, 1.0) * 0.4);
    col *= 0.2 + f * f * 1.6;
    gl_FragColor = vec4(col * 0.85, 1.0);
  }`;
  const prog = makeProgram(gl, vs, fs);
  bindAttr(gl, prog, "p", new Float32Array([-1, -1, 3, -1, -1, 3]), 2);
  const u = (n: string) => gl.getUniformLocation(prog, n);
  const ptr = trackPointer();
  const stopLoop = runLoop(
    canvas,
    (t) => {
      ptr.ease(0.03);
      gl.uniform1f(u("t"), t);
      gl.uniform2f(u("mouse"), ptr.m.x, ptr.m.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    (w, h, dpr) => {
      gl.viewport(0, 0, w * dpr, h * dpr);
      gl.uniform2f(u("res"), w * dpr, h * dpr);
    },
  );
  return () => {
    stopLoop();
    ptr.stop();
  };
}

/* ================= 4. Spinning 3D galaxy ================= */

function startGalaxy(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
  if (!gl) return;
  const vs = `
  attribute vec3 star;   // radius, start angle, height
  attribute vec3 offset; // random scatter
  uniform float t;
  uniform float aspect;
  uniform vec2 mouse;
  uniform float pxScale;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float r = star.x;
    float a = star.y + t * (0.35 / (0.6 + r * 0.35));
    vec3 p = vec3(cos(a) * r, star.z, sin(a) * r) + offset;

    float tilt = 1.05 + mouse.y * 0.25;
    float yaw = mouse.x * 0.4;
    p = vec3(p.x * cos(yaw) - p.z * sin(yaw), p.y, p.x * sin(yaw) + p.z * cos(yaw));
    p = vec3(p.x, p.y * cos(tilt) - p.z * sin(tilt), p.y * sin(tilt) + p.z * cos(tilt));
    p.z -= 9.0;

    float f = 1.7;
    gl_Position = vec4(p.x * f / aspect, p.y * f + 0.05, 0.0, -p.z);
    gl_PointSize = max(1.5, pxScale * 30.0 / -p.z);

    float k = clamp(r / 6.0, 0.0, 1.0);
    vColor = mix(vec3(1.0, 0.92, 0.88), mix(vec3(0.4, 0.55, 1.0), vec3(0.65, 0.35, 1.0), k), smoothstep(0.0, 0.3, k));
    vAlpha = 1.0 - k * 0.35;
  }`;
  const prog = makeProgram(gl, vs, ROUND_POINT_FS);
  const count = 26000, branches = 4, R = 6.5;
  const star = new Float32Array(count * 3);
  const off = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 1.6) * R;
    const branch = ((i % branches) / branches) * Math.PI * 2;
    star[i * 3] = r;
    star[i * 3 + 1] = branch + r * 0.9;
    const s = () => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (0.25 + r * 0.18);
    star[i * 3 + 2] = s() * 0.5;
    off[i * 3] = s();
    off[i * 3 + 1] = s() * 0.4;
    off[i * 3 + 2] = s();
  }
  bindAttr(gl, prog, "star", star, 3);
  bindAttr(gl, prog, "offset", off, 3);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  const u = (n: string) => gl.getUniformLocation(prog, n);
  const ptr = trackPointer();
  const stopLoop = runLoop(
    canvas,
    (t) => {
      ptr.ease(0.04);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(u("t"), t * 0.25);
      gl.uniform2f(u("mouse"), ptr.m.x, ptr.m.y);
      gl.drawArrays(gl.POINTS, 0, count);
    },
    (w, h, dpr) => {
      gl.viewport(0, 0, w * dpr, h * dpr);
      gl.uniform1f(u("aspect"), w / h);
      gl.uniform1f(u("pxScale"), dpr * (w < 700 ? 0.8 : 1.2));
    },
  );
  return () => {
    stopLoop();
    ptr.stop();
  };
}
