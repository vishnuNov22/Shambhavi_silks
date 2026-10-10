"use client";

import { forwardRef, useEffect, useMemo } from "react";
import { useFrame, useLoader, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { SIMPLEX_NOISE } from "./glsl";

/**
 * A piece of real (photographed) brocade mapped onto displaced geometry.
 * PBR MeshPhysicalMaterial (sheen + clearcoat) with the texture as colour map;
 * the vertex shader adds hanging folds (pinned top edge) or free-floating
 * ripples, and recomputes normals so the zari catches the light as it moves.
 */
export type FabricMode = "hang" | "float";

type Props = {
  url: string;
  width?: number;
  height?: number;
  segments?: number;
  mode?: FabricMode;
  amplitude?: number;
  seed?: number;
  /** extra animated uniform 0..1 (e.g. scroll) that increases the billow */
  energy?: React.MutableRefObject<number>;
} & Omit<ThreeElements["mesh"], "ref" | "geometry" | "material" | "args">;

const FabricMesh = forwardRef<THREE.Mesh, Props>(function FabricMesh(
  { url, width = 2, height = 3, segments = 64, mode = "hang", amplitude = 1, seed = 0, energy, ...meshProps },
  ref
) {
  const texture = useLoader(THREE.TextureLoader, url, (l) => l.setCrossOrigin("anonymous"));
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: seed * 7.0 },
      uAmp: { value: amplitude },
      uHang: { value: mode === "hang" ? 1 : 0 },
      uSize: { value: new THREE.Vector2(width, height) },
      uEnergy: { value: 0 },
      uSeed: { value: seed },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const geometry = useMemo(() => new THREE.PlaneGeometry(width, height, segments, Math.round(segments * (height / width))), [width, height, segments]);
  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      map: texture,
      roughness: 0.48,
      metalness: 0.05,
      sheen: 0.8,
      sheenColor: new THREE.Color("#ffd9b8"),
      sheenRoughness: 0.35,
      clearcoat: 0.2,
      clearcoatRoughness: 0.5,
      side: THREE.DoubleSide,
    });
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
           uniform float uTime; uniform float uAmp; uniform float uHang; uniform vec2 uSize; uniform float uEnergy; uniform float uSeed;
           ${SIMPLEX_NOISE}
           float fabricDisp(vec2 p){
             float t = uTime * 0.45;
             // 0 at the pinned top edge → 1 at the hem when hanging
             float fromTop = clamp((uSize.y * 0.5 - p.y) / uSize.y, 0.0, 1.0);
             float hangW = mix(1.0, pow(fromTop, 1.4), uHang);
             float d = sin(p.x * 3.1 + t * 1.6 + uSeed) * 0.07
                     + sin(p.y * 2.2 - t * 1.1 + p.x * 0.8) * 0.06
                     + snoise(vec3(p * 0.9 + uSeed, t * 0.6)) * 0.12;
             // vertical drape folds when hanging
             d += uHang * sin(p.x * 7.5 + sin(t * 0.7) * 0.6) * 0.05 * fromTop;
             return d * hangW * uAmp * (1.0 + uEnergy * 1.6);
           }`
        )
        .replace(
          "#include <beginnormal_vertex>",
          `float fe = 0.02;
           float fdx = fabricDisp(position.xy + vec2(fe, 0.0)) - fabricDisp(position.xy - vec2(fe, 0.0));
           float fdy = fabricDisp(position.xy + vec2(0.0, fe)) - fabricDisp(position.xy - vec2(0.0, fe));
           vec3 objectNormal = normalize(vec3(-fdx / (2.0 * fe), -fdy / (2.0 * fe), 1.0));
           #ifdef USE_TANGENT
             vec3 objectTangent = vec3(tangent.xyz);
           #endif`
        )
        .replace(
          "#include <begin_vertex>",
          `vec3 transformed = vec3(position);
           transformed.z += fabricDisp(position.xy);
           // a gentle sway around the pinned edge
           transformed.x += uHang * sin(uTime * 0.6 + uSeed) * 0.05 * clamp((uSize.y * 0.5 - position.y) / uSize.y, 0.0, 1.0);`
        );
    };
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texture]);

  useEffect(() => () => { geometry.dispose(); }, [geometry]);
  useEffect(() => () => { material.dispose(); }, [material]);

  useFrame((_, delta) => {
    uniforms.uTime.value += Math.min(delta, 1 / 30);
    if (energy) uniforms.uEnergy.value += (energy.current - uniforms.uEnergy.value) * 0.08;
  });

  return <mesh ref={ref} geometry={geometry} material={material} {...meshProps} />;
});

export default FabricMesh;
