import HeroSlider from "@/components/home/HeroSlider";
import SceneEdit from "@/components/home/SceneEdit";
import SceneOrbit from "@/components/home/SceneOrbit";
import SceneMaking from "@/components/home/SceneMaking";
import SceneCraftsmanship from "@/components/home/SceneCraftsmanship";
import SceneQuote from "@/components/home/SceneQuote";
import SceneCollection from "@/components/home/SceneCollection";

/**
 * Home (v3) — after the client's reference film:
 * Hero slider (brush reveals + 3D silk-ribbon knot) → The Edit (3D magazine
 * cards) → Golden Orbit (bridal) → The Making (hanging brocade, lens) →
 * Craftsmanship (bursting brocades + callouts) → The House Line (gems, tags)
 * → The Collection.
 */
export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <SceneEdit />
      <SceneOrbit />
      <SceneMaking />
      <SceneCraftsmanship />
      <SceneQuote />
      <SceneCollection />
    </>
  );
}
