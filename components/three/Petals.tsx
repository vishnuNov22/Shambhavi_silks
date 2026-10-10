"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Rose petals drifting across the whole site — a single fixed, click-through
 * WebGL layer. Each petal is a curled, two-sided instanced plane with a
 * procedural petal silhouette; scrolling stirs them (they lift against the
 * scroll direction). Fewer petals on phones; disabled for reduced motion.
 */
const vertex = /* glsl */ `
  varying vec2 vUv;
  varying float vShade;
  void main(){
    vUv = uv;
    vec3 p = position;
    // curl the petal: edges lift, tip bends back
    p.z += (p.x * p.x) * 0.9 + (p.y * p.y) * 0.25;
    vec4 world = modelMatrix * instanceMatrix * vec4(p, 1.0);
    vec3 n = normalize(mat3(modelMatrix * instanceMatrix) * vec3(-p.x * 1.8, -p.y * 0.5, 1.0));
    vShade = 0.55 + 0.45 * abs(dot(n, normalize(vec3(-0.4, 0.8, 0.6))));
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;
const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying float vShade;
  uniform float uOpacity;
  void main(){
    vec2 q = vUv - vec2(0.5, 0.42);
    // teardrop / rose-petal silhouette with a soft notch at the top
    float w = 0.36 - q.y * 0.32;
    float body = length(vec2(q.x / max(w, 0.05), q.y * 1.15));
    float notch = smoothstep(0.08, 0.0, abs(q.x)) * smoothstep(0.42, 0.52, vUv.y) * 0.25;
    float a = smoothstep(0.62, 0.52, body + notch);
    if (a < 0.02) discard;
    vec3 base = mix(vec3(0.95, 0.76, 0.75), vec3(1.0, 0.92, 0.90), smoothstep(0.0, 0.9, vUv.y));
    base = mix(base, vec3(0.86, 0.55, 0.58), smoothstep(0.35, 0.0, vUv.y) * 0.5); // deeper at the base
    float vein = smoothstep(0.012, 0.0, abs(q.x)) * 0.06;
    gl_FragColor = vec4(base * vShade - vein, a * uOpacity);
  }
`;

type P = { pos: THREE.Vector3; vel: THREE.Vector3; rot: THREE.Euler; spin: THREE.Vector3; scale: number; phase: number };

function Field({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const scrollVel = useRef(0);
  const last = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const petals = useMemo<P[]>(
    () =>
      Array.from({ length: count }, () => ({
        pos: new THREE.Vector3((Math.random() - 0.5) * 9, (Math.random() - 0.5) * 6, Math.random() * 3 - 1.5),
        vel: new THREE.Vector3((Math.random() - 0.3) * 0.12, -0.12 - Math.random() * 0.18, 0),
        rot: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
        spin: new THREE.Vector3((Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.4, (Math.random() - 0.5) * 0.8),
        scale: 0.09 + Math.random() * 0.12,
        phase: Math.random() * 10,
      })),
    [count]
  );

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1.2, 6, 6), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: { uOpacity: { value: 0.92 } },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useEffect(() => {
    last.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      scrollVel.current += (y - last.current) * 0.002;
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    scrollVel.current *= 0.92;
    const hw = viewport.width / 2 + 0.6;
    const hh = viewport.height / 2 + 0.6;
    petals.forEach((p, i) => {
      p.pos.x += (p.vel.x + Math.sin(t * 0.6 + p.phase) * 0.12) * dt;
      p.pos.y += (p.vel.y + Math.cos(t * 0.4 + p.phase) * 0.05) * dt + scrollVel.current * (0.6 + p.pos.z * 0.15);
      p.rot.x += p.spin.x * dt;
      p.rot.y += p.spin.y * dt;
      p.rot.z += p.spin.z * dt;
      if (p.pos.y < -hh) { p.pos.y = hh; p.pos.x = (Math.random() - 0.5) * hw * 2; }
      if (p.pos.y > hh + 0.5) { p.pos.y = -hh; }
      if (p.pos.x > hw) p.pos.x = -hw;
      if (p.pos.x < -hw) p.pos.x = hw;
      dummy.position.copy(p.pos);
      dummy.rotation.copy(p.rot);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, count]} frustumCulled={false} />;
}

export default function Petals() {
  const [mode, setMode] = useState<"off" | "low" | "high">("off");
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      const c = document.createElement("canvas");
      if (!(c.getContext("webgl2") || c.getContext("webgl"))) return;
    } catch { return; }
    setMode(window.matchMedia("(max-width: 820px)").matches ? "low" : "high");
  }, []);
  if (mode === "off") return null;
  return (
    <div className="petals" aria-hidden="true">
      <Canvas style={{ pointerEvents: "none" }} dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <Field count={mode === "low" ? 14 : 32} />
      </Canvas>
    </div>
  );
}
