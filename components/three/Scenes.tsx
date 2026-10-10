"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import FabricMesh from "./FabricMesh";
import { StudioEnvironment } from "./SilkCloth";
import { useInView, useIsMobile } from "@/lib/hooks";
import { imgUrl } from "@/lib/img";

/* ------------------------------------------------------------------ */
/* Shared canvas shell: renders only on screen, capped DPR, ACES tone. */
/* ------------------------------------------------------------------ */
function Shell({ children, className, fov = 38, z = 6 }: { children: React.ReactNode; className?: string; fov?: number; z?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, "80px");
  const mobile = useIsMobile();
  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <Canvas
        style={{ pointerEvents: "none" }}
        frameloop={inView ? "always" : "never"}
        dpr={mobile ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [0, 0, z], fov }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; }}
      >
        {children}
      </Canvas>
    </div>
  );
}

function usePointer() {
  const p = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const on = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);
  return p;
}

/* ------------------------------------------------------------------ */
/* THE MAKING — a single hanging length of brocade                    */
/* ------------------------------------------------------------------ */
function Hanging({ texture, energy }: { texture: string; energy: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const pointer = usePointer();
  const { viewport } = useThree();
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y += ((pointer.current.x * 0.35 - 0.35) - group.current.rotation.y) * 0.04;
    group.current.rotation.x += ((-pointer.current.y * 0.12 + 0.05) - group.current.rotation.x) * 0.04;
    group.current.position.y = Math.sin(t * 0.6) * 0.06 + energy.current * 0.4;
  });
  const s = Math.min(1, viewport.height / 4.2);
  return (
    <group ref={group} scale={s}>
      <FabricMesh url={imgUrl(texture, 1400, 2100, 82)} width={2.1} height={3.15} segments={70} mode="hang" amplitude={1.1} energy={energy} />
    </group>
  );
}

export function MakingCanvas({ texture, energy, className }: { texture: string; energy: React.MutableRefObject<number>; className?: string }) {
  return (
    <Shell className={className} fov={36} z={6}>
      <StudioEnvironment intensity={0.6} />
      <directionalLight position={[-3, 4, 4]} intensity={2.4} color="#ffe2c8" />
      <directionalLight position={[4, -2, 2]} intensity={0.5} color="#c98f78" />
      <ambientLight intensity={0.12} />
      <Suspense fallback={null}>
        <Hanging texture={texture} energy={energy} />
      </Suspense>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* CRAFTSMANSHIP — brocade pieces that burst apart, with callout       */
/* anchors projected to the DOM each frame                              */
/* ------------------------------------------------------------------ */
export type CraftPiece = { texture: string; target: [number, number, number]; rot: [number, number, number]; w: number; h: number };

type CalloutRefs = {
  anchors: React.MutableRefObject<(HTMLElement | null)[]>;
  lines?: React.MutableRefObject<(SVGLineElement | null)[]>;
  labels?: React.MutableRefObject<(HTMLElement | null)[]>;
};

function Burst({ pieces, progress, anchors, lines, labels }: { pieces: CraftPiece[]; progress: React.MutableRefObject<number> } & CalloutRefs) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  const pointer = usePointer();
  const { camera, size, viewport } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  const energy = useRef(0);
  const spread = Math.min(1, viewport.width / 7.5);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = THREE.MathUtils.smootherstep(progress.current, 0.05, 0.75);
    energy.current = Math.sin(Math.min(1, progress.current * 1.3) * Math.PI) * 0.8;
    pieces.forEach((pc, i) => {
      const g = refs.current[i];
      if (!g) return;
      const tx = pc.target[0] * spread * p + Math.sin(t * 0.5 + i) * 0.05;
      const ty = pc.target[1] * p + Math.cos(t * 0.45 + i * 2) * 0.06;
      const tz = pc.target[2] * p;
      g.position.set(tx, ty, tz);
      g.rotation.set(
        pc.rot[0] * (0.4 + p) + Math.sin(t * 0.3 + i) * 0.1 + pointer.current.y * 0.1,
        pc.rot[1] * (0.4 + p) + t * 0.08 * (i % 2 ? 1 : -1) + pointer.current.x * 0.15,
        pc.rot[2] * (0.3 + p)
      );
      const sc = 0.55 + p * 0.45;
      g.scale.setScalar(sc);
      // project a point on the piece to place its DOM callout dot
      const el = anchors.current[i];
      if (el) {
        g.updateMatrixWorld();
        v.set(pc.w * 0.25, pc.h * 0.2, 0).applyMatrix4(g.matrixWorld).project(camera);
        const dx = ((v.x + 1) / 2) * size.width;
        const dy = ((1 - v.y) / 2) * size.height;
        const vis = Math.max(0, (p - 0.55) / 0.45);
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        el.style.opacity = String(vis);
        // leader line from the dot to the nearest edge of its label
        const line = lines?.current[i];
        const label = labels?.current[i];
        if (line && label) {
          const host = state.gl.domElement.getBoundingClientRect();
          const r = label.getBoundingClientRect();
          const visible = r.width > 0 && getComputedStyle(label).display !== "none";
          const lx = Math.min(Math.max(dx, r.left - host.left), r.right - host.left);
          const ly = Math.min(Math.max(dy, r.top - host.top), r.bottom - host.top);
          line.setAttribute("x1", dx.toFixed(1));
          line.setAttribute("y1", dy.toFixed(1));
          line.setAttribute("x2", lx.toFixed(1));
          line.setAttribute("y2", ly.toFixed(1));
          line.style.opacity = visible ? String(vis * 0.8) : "0";
        }
      }
    });
  });

  return (
    <>
      {pieces.map((pc, i) => (
        <group key={pc.texture + i} ref={(el) => { refs.current[i] = el; }}>
          <FabricMesh url={imgUrl(pc.texture, 1000, Math.round(1000 * (pc.h / pc.w)), 80)} width={pc.w} height={pc.h} segments={40} mode="float" amplitude={1.2} seed={i * 1.7} energy={energy} />
        </group>
      ))}
    </>
  );
}

export function CraftCanvas({ pieces, progress, anchors, lines, labels, className }: { pieces: CraftPiece[]; progress: React.MutableRefObject<number>; className?: string } & CalloutRefs) {
  return (
    <Shell className={className} fov={40} z={7}>
      <StudioEnvironment intensity={0.6} />
      <directionalLight position={[-4, 5, 5]} intensity={2.2} color="#ffe2c8" />
      <directionalLight position={[5, -3, 2]} intensity={0.6} color="#c98f78" />
      <ambientLight intensity={0.15} />
      <Suspense fallback={null}>
        <Burst pieces={pieces} progress={progress} anchors={anchors} lines={lines} labels={labels} />
      </Suspense>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* GOLDEN ORBIT — luminous rings around the bridal look                */
/* Rings dim where they pass *behind* the figure (z < 0 inside its     */
/* on-screen rectangle) so they read as orbiting her in depth.          */
/* ------------------------------------------------------------------ */
const ringVertex = /* glsl */ `
  varying float vAngle;
  varying float vDepth;
  varying vec2 vNdc;
  void main(){
    vAngle = atan(position.y, position.x);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vDepth = world.z;
    vec4 clip = projectionMatrix * viewMatrix * world;
    vNdc = clip.xy / clip.w;
    gl_Position = clip;
  }
`;
const ringFragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uOffset;
  uniform float uIntensity;
  uniform vec4 uRect; // figure rect in NDC: minX, minY, maxX, maxY
  varying float vAngle;
  varying float vDepth;
  varying vec2 vNdc;
  void main(){
    float streak = pow(0.5 + 0.5 * sin(vAngle - uTime * 1.4 + uOffset), 10.0);
    float base = 0.22 + 0.15 * sin(vAngle * 3.0 + uTime + uOffset);
    float inside = step(uRect.x, vNdc.x) * step(vNdc.x, uRect.z) * step(uRect.y, vNdc.y) * step(vNdc.y, uRect.w);
    float behind = smoothstep(0.05, -0.15, vDepth) * inside;
    float a = (base + streak * 1.6) * (1.0 - behind * 0.92) * uIntensity;
    vec3 col = mix(vec3(0.85, 0.62, 0.36), vec3(1.0, 0.93, 0.78), streak);
    gl_FragColor = vec4(col * a, a);
  }
`;

function Rings({ progress, rectEl }: { progress: React.MutableRefObject<number>; rectEl: React.RefObject<HTMLElement> }) {
  const { size, viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  const rect = useMemo(() => new THREE.Vector4(-0.2, -0.6, 0.2, 0.6), []);
  const rings = useMemo(
    () =>
      [
        { r: 1.55, tilt: [1.2, 0.2, 0.3], speed: 0.35 },
        { r: 1.75, tilt: [1.35, -0.5, -0.2], speed: -0.28 },
        { r: 1.35, tilt: [1.05, 0.6, 0.9], speed: 0.42 },
        { r: 1.95, tilt: [1.5, 0.15, -0.7], speed: -0.2 },
        { r: 1.6, tilt: [0.9, -0.3, 1.4], speed: 0.3 },
      ].map((c, i) => ({
        ...c,
        geometry: new THREE.TorusGeometry(c.r, 0.009, 8, 260),
        material: new THREE.ShaderMaterial({
          vertexShader: ringVertex,
          fragmentShader: ringFragment,
          uniforms: { uTime: { value: 0 }, uOffset: { value: i * 1.3 }, uIntensity: { value: 0 }, uRect: { value: rect } },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      })),
    [rect]
  );
  useEffect(() => () => rings.forEach((r) => { r.geometry.dispose(); r.material.dispose(); }), [rings]);
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, delta) => {
    const p = progress.current;
    const el = rectEl.current;
    if (el) {
      const b = el.getBoundingClientRect();
      const host = state.gl.domElement.getBoundingClientRect();
      rect.set(
        ((b.left - host.left) / size.width) * 2 - 1,
        1 - ((b.bottom - host.top) / size.height) * 2,
        ((b.right - host.left) / size.width) * 2 - 1,
        1 - ((b.top - host.top) / size.height) * 2
      );
    }
    const k = Math.min(1, viewport.width / 5.2) * (0.85 + p * 0.35);
    group.current?.scale.setScalar(k);
    rings.forEach((r, i) => {
      const m = ringRefs.current[i];
      if (!m) return;
      m.rotation.z += r.speed * delta * (1 + p * 2);
      r.material.uniforms.uTime.value += delta;
      const target = Math.min(1, 0.35 + p * 1.6);
      r.material.uniforms.uIntensity.value += (target - r.material.uniforms.uIntensity.value) * 0.05;
    });
  });

  return (
    <group ref={group}>
      {rings.map((r, i) => (
        <group key={i} rotation={r.tilt as [number, number, number]}>
          <mesh ref={(el) => { ringRefs.current[i] = el; }} geometry={r.geometry} material={r.material} />
        </group>
      ))}
    </group>
  );
}

export function OrbitCanvas({ progress, rectEl, className }: { progress: React.MutableRefObject<number>; rectEl: React.RefObject<HTMLElement>; className?: string }) {
  return (
    <Shell className={className} fov={40} z={6}>
      <Rings progress={progress} rectEl={rectEl} />
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* GEMS — slow-turning faceted gold & onyx forms for the closing quote */
/* ------------------------------------------------------------------ */
function Gems() {
  const pointer = usePointer();
  const { viewport } = useThree();
  const items = useMemo(() => {
    const gold = new THREE.MeshPhysicalMaterial({ color: "#d9b77c", metalness: 1, roughness: 0.22, clearcoat: 0.6, flatShading: true });
    const onyx = new THREE.MeshPhysicalMaterial({ color: "#1c1416", metalness: 0.6, roughness: 0.18, clearcoat: 1, flatShading: true });
    const rose = new THREE.MeshPhysicalMaterial({ color: "#c98f78", metalness: 0.9, roughness: 0.28, flatShading: true });
    const oct = new THREE.OctahedronGeometry(0.5, 0);
    const tet = new THREE.TetrahedronGeometry(0.55, 0);
    const edge = new THREE.LineBasicMaterial({ color: "#e9cf9c", transparent: true, opacity: 0.85 });
    const list = [
      { g: oct, m: onyx, p: [2.6, 1.2, -0.5], s: 0.9 },
      { g: tet, m: gold, p: [-2.9, -1.0, 0.2], s: 0.7 },
      { g: oct, m: rose, p: [3.3, -1.5, -1.2], s: 0.55 },
      { g: tet, m: onyx, p: [-3.4, 1.6, -1.5], s: 0.6 },
      { g: oct, m: gold, p: [0.9, -2.1, -2.2], s: 0.45 },
    ];
    return { list, edges: [new THREE.EdgesGeometry(oct), new THREE.EdgesGeometry(tet)], edge, dispose: () => { [gold, onyx, rose, edge].forEach((x) => x.dispose()); [oct, tet].forEach((x) => x.dispose()); } };
  }, []);
  useEffect(() => () => { items.dispose(); items.edges.forEach((e) => e.dispose()); }, [items]);
  const refs = useRef<(THREE.Group | null)[]>([]);
  const k = Math.min(1, viewport.width / 8);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    items.list.forEach((it, i) => {
      const g = refs.current[i];
      if (!g) return;
      g.rotation.x = t * (0.15 + i * 0.03);
      g.rotation.y = t * (0.22 - i * 0.02);
      g.position.set(it.p[0] * k + pointer.current.x * 0.15 * (i + 1) * 0.3, it.p[1] + Math.sin(t * 0.6 + i) * 0.12 + pointer.current.y * 0.1, it.p[2]);
    });
  });
  return (
    <>
      {items.list.map((it, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el; }} scale={it.s}>
          <mesh geometry={it.g} material={it.m} />
          <lineSegments geometry={it.g.type === "OctahedronGeometry" ? items.edges[0] : items.edges[1]} material={items.edge} />
        </group>
      ))}
    </>
  );
}

export function GemsCanvas({ className }: { className?: string }) {
  return (
    <Shell className={className} fov={40} z={7}>
      <StudioEnvironment intensity={1} />
      <directionalLight position={[-3, 4, 5]} intensity={2.5} color="#ffe6cc" />
      <pointLight position={[3, -2, 3]} intensity={6} color="#c98f78" />
      <Gems />
    </Shell>
  );
}
