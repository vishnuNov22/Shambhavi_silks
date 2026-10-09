import Hero from "@/components/home/Hero";
import SceneSilk from "@/components/home/SceneSilk";
import SceneThread from "@/components/home/SceneThread";
import SceneSaree from "@/components/home/SceneSaree";
import SceneBridal from "@/components/home/SceneBridal";
import SceneLehenga from "@/components/home/SceneLehenga";
import SceneCollection from "@/components/home/SceneCollection";
import SceneVisit from "@/components/home/SceneVisit";

/**
 * Home — one continuous film in seven scenes:
 * Hero → Art of Silk → Thread to Masterpiece → The Saree → Bridal Couture →
 * Designer Lehengas → The Collection (shopping) → Visit Shambhavi.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <SceneSilk />
      <SceneThread />
      <SceneSaree />
      <SceneBridal />
      <SceneLehenga />
      <SceneCollection />
      <SceneVisit />
    </>
  );
}
