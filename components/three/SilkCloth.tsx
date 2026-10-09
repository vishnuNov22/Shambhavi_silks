"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { SIMPLEX_NOISE, SILK_DISPLACEMENT } from "./glsl";

export type SilkPalette = { base: string; sheen: string; gold: string };

export const PALETTES: Record<string, SilkPalette> = {
  burgundy: { base: "#4a0c19", sheen: "#f0b98a", gold: "#c9a063" },
  champagne: { base: "#cdb48f", sheen: "#fff3dc", gold: "#a8793a" },
  emerald: { base: "#0b3a30", sheen: "#9fe0c4", gold: "#c9a063" },
  midnight: { base: "#121018", sheen: "#c9a37a", gold: "#b8935a" },
};

/** Physically-based studio lighting (PMREM room environment). */
export function StudioEnvironment({ intensity = 1 }: { intensity?: number }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = intensity;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
      room.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          const mat = m.material as THREE.Material | THREE.Material[];
          (Array.isArray(mat) ? mat : [mat]).forEach((x) => x.dispose());
        }
      });
    };
  }, [gl, scene, intensity]);
  return null;
}

type Props = {
  palette?: SilkPalette;
  /** 0..1 value written by GSAP ScrollTrigger; read every frame. */
  progress?: React.MutableRefObject<number>;
  pointer?: React.MutableRefObject<{ x: number; y: number }>;
  detail?: "high" | "low";
  pattern?: number;
  parallax?: number;
  /** fade zari motifs in as `progress` rises */
  revealPattern?: boolean;
};

const W = 9;
const H = 6;

export default function SilkCloth({ palette = PALETTES.burgundy, progress, pointer, detail = "high", pattern = 1, parallax = 0.35, revealPattern = false }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const smoothMouse = useRef(new THREE.Vector2(0, 0));
  const hover = useRef(0);
  const { camera } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 1 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uHover: { value: 0 },
      uProgress: { value: 0 },
      uSize: { value: new THREE.Vector2(W, H) },
      uGold: { value: new THREE.Color(palette.gold) },
      uPattern: { value: revealPattern ? 0 : pattern },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(palette.base),
      roughness: 0.42,
      metalness: 0.08,
      sheen: 1,
      sheenColor: new THREE.Color(palette.sheen),
      sheenRoughness: 0.32,
      clearcoat: 0.15,
      clearcoatRoughness: 0.6,
      side: THREE.DoubleSide,
    });
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>\nuniform vec2 uSize;\n${SIMPLEX_NOISE}\n${SILK_DISPLACEMENT}`
        )
        .replace(
          "#include <beginnormal_vertex>",
          `vec2 sp = position.xy;
           float e = 0.025;
           float dX = silkDisp(sp + vec2(e, 0.0)) - silkDisp(sp - vec2(e, 0.0));
           float dY = silkDisp(sp + vec2(0.0, e)) - silkDisp(sp - vec2(0.0, e));
           vec3 objectNormal = normalize(vec3(-dX / (2.0 * e), -dY / (2.0 * e), 1.0));
           #ifdef USE_TANGENT
             vec3 objectTangent = vec3(tangent.xyz);
           #endif`
        )
        .replace(
          "#include <begin_vertex>",
          `vec3 transformed = vec3(position);
           transformed.z += silkDisp(position.xy);
           vSilkUv = position.xy / uSize + 0.5;`
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
           varying vec2 vSilkUv;
           uniform vec3 uGold;
           uniform float uPattern;
           float band(float y, float a, float b, float s){ return smoothstep(a - s, a, y) * (1.0 - smoothstep(b, b + s, y)); }
           float zariMask(vec2 uv){
             float y = uv.y;
             float s = 0.0025;
             // temple-spire border
             float inBorder = band(y, 0.05, 0.17, s);
             float spire = 1.0 - smoothstep(-0.02, 0.02, abs(fract(uv.x * 22.0) - 0.5) * 2.0 - (y - 0.05) / 0.12);
             float temple = inBorder * spire;
             float lines = band(y, 0.185, 0.192, s) + band(y, 0.200, 0.204, s) + band(y, 0.02, 0.035, s);
             // butta motifs across the body
             vec2 g = uv * vec2(16.0, 11.0);
             g.x += step(1.0, mod(floor(g.y), 2.0)) * 0.5;
             vec2 c = fract(g) - 0.5;
             float r = length(c * vec2(1.0, 0.75));
             float butta = (1.0 - smoothstep(0.065, 0.095, r)) * smoothstep(0.23, 0.26, y);
             return clamp(temple + lines + butta * uPattern, 0.0, 1.0);
           }`
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
           float zm = zariMask(vSilkUv);
           float weave = 0.97 + 0.03 * sin(vSilkUv.x * 900.0) * sin(vSilkUv.y * 600.0);
           diffuseColor.rgb = mix(diffuseColor.rgb * weave, uGold, zm);`
        )
        .replace(
          "#include <roughnessmap_fragment>",
          `#include <roughnessmap_fragment>
           roughnessFactor = mix(roughnessFactor, 0.26, zm);`
        )
        .replace(
          "#include <metalnessmap_fragment>",
          `#include <metalnessmap_fragment>
           metalnessFactor = mix(metalnessFactor, 0.92, zm);`
        );
    };
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const geometry = useMemo(
    () => (detail === "high" ? new THREE.PlaneGeometry(W, H, 200, 140) : new THREE.PlaneGeometry(W, H, 90, 64)),
    [detail]
  );

  useEffect(() => () => { geometry.dispose(); }, [geometry]);
  useEffect(() => () => { material.dispose(); }, [material]);

  // Palette changes animate smoothly instead of recompiling the shader.
  const target = useMemo(
    () => ({ base: new THREE.Color(palette.base), sheen: new THREE.Color(palette.sheen), gold: new THREE.Color(palette.gold) }),
    [palette.base, palette.sheen, palette.gold]
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    uniforms.uTime.value += dt;
    const p = progress?.current ?? 0;
    uniforms.uProgress.value += (p - uniforms.uProgress.value) * 0.08;
    // Zari motifs "emerge" with scroll when requested.
    const targetPattern = revealPattern ? pattern * Math.min(1, Math.max(0, (p - 0.1) * 1.8)) : pattern;
    uniforms.uPattern.value += (targetPattern - uniforms.uPattern.value) * 0.06;

    const px = pointer?.current.x ?? 0;
    const py = pointer?.current.y ?? 0;
    smoothMouse.current.x += (px * (W / 2) * 0.8 - smoothMouse.current.x) * 0.06;
    smoothMouse.current.y += (py * (H / 2) * 0.8 - smoothMouse.current.y) * 0.06;
    uniforms.uMouse.value.copy(smoothMouse.current);
    const moving = Math.abs(px) + Math.abs(py) > 0.001 ? 1 : 0;
    hover.current += (moving - hover.current) * 0.04;
    uniforms.uHover.value = hover.current;

    material.color.lerp(target.base, 0.05);
    material.sheenColor.lerp(target.sheen, 0.05);
    uniforms.uGold.value.lerp(target.gold, 0.05);

    // Cinematic camera: pointer parallax + scroll-driven dolly.
    camera.position.x += (px * parallax - camera.position.x) * 0.04;
    camera.position.y += (py * parallax * 0.6 - camera.position.y) * 0.04;
    camera.position.z += (4.2 - p * 1.4 - camera.position.z) * 0.06;
    camera.lookAt(0, 0, 0);

    if (mesh.current) {
      mesh.current.rotation.z = 0.14 + Math.sin(state.clock.elapsedTime * 0.1) * 0.02 - p * 0.12;
    }
  });

  return (
    <>
      <mesh ref={mesh} geometry={geometry} material={material} rotation={[-0.55, 0.05, 0.14]} position={[0, -0.1, 0]} />
      <directionalLight position={[3, 4, 3]} intensity={1.6} color="#ffe7c7" />
      <directionalLight position={[-4, -1, 2]} intensity={0.6} color="#d8a76a" />
      <ambientLight intensity={0.15} />
    </>
  );
}
