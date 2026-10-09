"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SIMPLEX_NOISE } from "./glsl";
import { useInView } from "@/lib/hooks";

const vertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform vec2 uFromRes;
uniform vec2 uToRes;
uniform vec2 uRes;
uniform float uMix;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uGold;
${SIMPLEX_NOISE}

vec2 coverUv(vec2 uv, vec2 img, vec2 screen){
  float rs = screen.x / screen.y;
  float ri = img.x / img.y;
  vec2 scale = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
  return (uv - 0.5) * scale + 0.5;
}

void main(){
  vec2 uv = vUv;
  // gentle pointer-driven drift, like light moving across fabric
  uv += uMouse * 0.012;
  float n = snoise(vec3(uv * vec2(2.2, 3.4), uTime * 0.08)) * 0.5 + 0.5;
  float threads = snoise(vec3(uv.x * 1.5, uv.y * 40.0, uTime * 0.05)) * 0.5 + 0.5;
  float field = mix(n, threads, 0.35);
  float m = uMix * 1.3 - 0.15;
  float edge = smoothstep(field - 0.08, field + 0.08, m);
  vec2 dispA = edge * vec2(0.04, -0.02) * field;
  vec2 dispB = (1.0 - edge) * vec2(-0.04, 0.03) * field;
  vec4 a = texture2D(uFrom, coverUv(uv + dispA, uFromRes, uRes));
  vec4 b = texture2D(uTo, coverUv(uv + dispB, uToRes, uRes));
  vec3 col = mix(a.rgb, b.rgb, edge);
  // molten zari seam along the dissolve front
  float seam = 1.0 - abs(edge * 2.0 - 1.0);
  col += uGold * pow(seam, 3.0) * 0.9;
  // cinematic grade: lifted blacks, warm highlights, vignette
  col = mix(col, col * vec3(1.05, 0.98, 0.9), 0.5);
  float v = smoothstep(1.15, 0.35, length(vUv - 0.5) * 1.4);
  col *= mix(0.55, 1.0, v);
  gl_FragColor = vec4(col, 1.0);
}
`;

function MorphPlane({ urls, progress, onReady }: { urls: string[]; progress: React.MutableRefObject<number>; onReady: () => void }) {
  const { size } = useThree();
  const [textures, setTextures] = useState<THREE.Texture[] | null>(null);
  const mouse = useRef(new THREE.Vector2());
  const target = useRef(new THREE.Vector2());

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    Promise.all(
      urls.map(
        (u) =>
          new Promise<THREE.Texture>((resolve, reject) =>
            loader.load(
              u,
              (t) => {
                // Sampled as raw sRGB and written straight out (no colour-space round trip).
                t.colorSpace = THREE.NoColorSpace;
                t.minFilter = THREE.LinearFilter;
                t.generateMipmaps = false;
                resolve(t);
              },
              undefined,
              reject
            )
          )
      )
    )
      .then((tex) => {
        if (cancelled) { tex.forEach((t) => t.dispose()); return; }
        setTextures(tex);
        onReady();
      })
      .catch(() => { /* DOM fallback stays visible */ });
    return () => { cancelled = true; };
  }, [urls, onReady]);

  useEffect(() => () => { textures?.forEach((t) => t.dispose()); }, [textures]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uFrom: { value: null },
          uTo: { value: null },
          uFromRes: { value: new THREE.Vector2(1, 1) },
          uToRes: { value: new THREE.Vector2(1, 1) },
          uRes: { value: new THREE.Vector2(1, 1) },
          uMix: { value: 0 },
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2() },
          uGold: { value: new THREE.Color("#d9b26f") },
        },
        depthTest: false,
        depthWrite: false,
      }),
    []
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, delta) => {
    if (!textures) return;
    const u = material.uniforms;
    u.uTime.value += delta;
    u.uRes.value.set(size.width, size.height);
    mouse.current.lerp(target.current, 0.05);
    u.uMouse.value.copy(mouse.current);
    const max = textures.length - 1;
    const p = Math.min(Math.max(progress.current, 0), 1) * max;
    const i = Math.min(Math.floor(p), max - 1);
    const from = textures[i];
    const to = textures[i + 1];
    u.uFrom.value = from;
    u.uTo.value = to;
    const fi = from.image as HTMLImageElement;
    const ti = to.image as HTMLImageElement;
    u.uFromRes.value.set(fi.naturalWidth || fi.width, fi.naturalHeight || fi.height);
    u.uToRes.value.set(ti.naturalWidth || ti.width, ti.naturalHeight || ti.height);
    // ease each transition so frames "hold" between dissolves
    const t = p - i;
    const eased = THREE.MathUtils.smoothstep(t, 0.15, 0.85);
    u.uMix.value = eased;
  });

  if (!textures) return null;
  return (
    <mesh frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

export default function ImageMorph({ urls, progress, className }: { urls: string[]; progress: React.MutableRefObject<number>; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, "200px");
  const [ready, setReady] = useState(false);
  const markReady = useMemo(() => () => setReady(true), []);
  return (
    <div ref={wrap} className={className} data-ready={ready ? "true" : "false"} aria-hidden="true">
      <Canvas frameloop={inView ? "always" : "never"} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }} orthographic>
        <MorphPlane urls={urls} progress={progress} onReady={markReady} />
      </Canvas>
    </div>
  );
}
