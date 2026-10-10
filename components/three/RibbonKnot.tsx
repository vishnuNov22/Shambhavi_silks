"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { StudioEnvironment } from "./SilkCloth";
import { useInView, useIsMobile } from "@/lib/hooks";

/**
 * Two rose-gold satin ribbons sweep in from opposite edges, twist, gather
 * and meet in a knot, then slide through and away — the hero's slide
 * transition. Ribbons are real geometry bent and twisted in the vertex
 * shader with anisotropic (Kajiya-Kay) satin highlights; the knot is a PBR
 * torus-knot with sheen under a studio environment.
 *
 * `phase` (0→1) is driven by GSAP: 0–0.42 sweep in, ~0.45 knot, 0.58–1 pull away.
 */
const ribbonVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSide;
  uniform float uHalfW;
  uniform float uWidth;
  varying float vU;
  varying vec3 vN;
  varying vec3 vT;

  vec3 center(float u){
    float x = uSide * mix(uHalfW * 1.45, 0.0, u);
    float y = sin(u * 5.0 + uTime * 0.8 + uSide) * 0.32 * (1.0 - u * 0.75) + (1.0 - u) * 0.55 * uSide;
    float z = sin(u * 3.0 + uTime * 0.5) * 0.25 * (1.0 - u);
    return vec3(x, y, z);
  }
  void main(){
    float u = position.x + 0.5;
    float v = position.y;
    vU = u;
    float gather = mix(1.0, 0.16, smoothstep(0.72, 1.0, u));
    float ang = sin(u * 6.0 - uTime * 0.6 + uSide * 1.3) * 1.55 + u * 2.4 * uSide;
    vec3 c = center(u);
    vec3 d = vec3(0.0, cos(ang), sin(ang));
    vec3 T = normalize(center(u + 0.01) - center(u - 0.01));
    vec3 nrm = normalize(cross(T, d));
    // soft lengthwise folds across the width (satin catching light in bands)
    float fold = sin(v * 6.2832 * 1.5 + u * 9.0 - uTime * 1.2) * 0.09 * gather;
    float foldSlope = cos(v * 6.2832 * 1.5 + u * 9.0 - uTime * 1.2) * 0.09 * 6.2832 * 1.5 * gather;
    vec3 p = c + d * v * uWidth * 2.0 * gather + nrm * fold * uWidth;
    vT = normalize(mat3(modelMatrix) * T);
    // tilt the normal by the fold slope so each crease shades
    vN = normalize(mat3(modelMatrix) * normalize(nrm - d * foldSlope * 1.8));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const ribbonFragment = /* glsl */ `
  precision highp float;
  uniform float uHead;
  uniform float uTail;
  varying float vU;
  varying vec3 vN;
  varying vec3 vT;
  void main(){
    if (vU > uHead || vU < uTail) discard;
    vec3 n = normalize(vN);
    if (!gl_FrontFacing) n = -n;
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 L = normalize(vec3(-0.45, 0.75, 0.6));
    vec3 H = normalize(L + V);
    vec3 L2 = normalize(vec3(0.6, -0.3, 0.7));
    float diff = max(dot(n, L), 0.0) * 0.85 + max(dot(n, L2), 0.0) * 0.25;
    float tdh = dot(normalize(vT), H);
    float sinTH = sqrt(max(0.0, 1.0 - tdh * tdh));
    float spec = pow(sinTH, 90.0) * 0.9 + pow(sinTH, 14.0) * 0.18;
    vec3 base = vec3(0.9, 0.63, 0.53);
    vec3 shadow = vec3(0.28, 0.1, 0.1);
    float sheen = pow(1.0 - max(dot(n, V), 0.0), 3.0);
    vec3 col = mix(shadow, base, pow(clamp(0.15 + 0.85 * diff, 0.0, 1.0), 1.4)) + vec3(1.0, 0.88, 0.8) * spec * (0.4 + 0.6 * diff) + vec3(1.0, 0.8, 0.7) * sheen * 0.35;
    float fresnel = pow(1.0 - abs(dot(n, V)), 2.0);
    col += vec3(0.95, 0.7, 0.6) * fresnel * 0.25;
    float tip = smoothstep(uHead, uHead - 0.015, vU) * smoothstep(uTail, uTail + 0.015, vU);
    gl_FragColor = vec4(col, tip);
  }
`;

function Ribbon({ side, phase }: { side: 1 | -1; phase: React.MutableRefObject<number> }) {
  const { viewport } = useThree();
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ribbonVertex,
        fragmentShader: ribbonFragment,
        uniforms: {
          uTime: { value: 0 },
          uSide: { value: side },
          uHalfW: { value: 4 },
          uWidth: { value: 0.5 },
          uHead: { value: 0 },
          uTail: { value: 0 },
        },
        side: THREE.DoubleSide,
        transparent: true,
      }),
    [side]
  );
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 280, 10), []);
  useEffect(() => () => { material.dispose(); geometry.dispose(); }, [material, geometry]);

  useFrame((_, delta) => {
    const p = phase.current;
    const u = material.uniforms;
    u.uTime.value += delta;
    u.uHalfW.value = viewport.width / 2;
    u.uWidth.value = Math.min(viewport.height * 0.15, viewport.width * 0.16);
    u.uHead.value = THREE.MathUtils.smootherstep(p, 0.0, 0.42) * 1.02;
    u.uTail.value = THREE.MathUtils.smootherstep(p, 0.58, 1.0) * 1.02;
  });

  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}

function Knot({ phase }: { phase: React.MutableRefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const geometry = useMemo(() => new THREE.TorusKnotGeometry(0.42, 0.17, 240, 36, 2, 3), []);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#c98f78"),
        roughness: 0.34,
        metalness: 0.12,
        sheen: 1,
        sheenColor: new THREE.Color("#ffd9c4"),
        sheenRoughness: 0.3,
        clearcoat: 0.35,
        clearcoatRoughness: 0.4,
      }),
    []
  );
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  useFrame((state) => {
    const p = phase.current;
    const s = THREE.MathUtils.smootherstep(p, 0.33, 0.48) * (1 - THREE.MathUtils.smootherstep(p, 0.8, 0.96));
    const k = Math.min(1, Math.min(viewport.height * 0.15, viewport.width * 0.16) / 0.55);
    if (mesh.current) {
      mesh.current.scale.set(s * k, s * k * 0.9, s * k * 0.55);
      mesh.current.rotation.set(0.35, state.clock.elapsedTime * 0.25, 0.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08);
      mesh.current.visible = s > 0.001;
    }
  });
  return <mesh ref={mesh} geometry={geometry} material={material} />;
}

export default function RibbonKnot({ phase, className }: { phase: React.MutableRefObject<number>; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, "0px");
  const mobile = useIsMobile();
  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <Canvas
        style={{ pointerEvents: "none" }}
        frameloop={inView ? "always" : "never"}
        dpr={mobile ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; }}
      >
        <StudioEnvironment intensity={0.9} />
        <directionalLight position={[-3, 4, 4]} intensity={2} color="#ffe6d2" />
        <ambientLight intensity={0.2} />
        <Ribbon side={-1} phase={phase} />
        <Ribbon side={1} phase={phase} />
        <Knot phase={phase} />
      </Canvas>
    </div>
  );
}
