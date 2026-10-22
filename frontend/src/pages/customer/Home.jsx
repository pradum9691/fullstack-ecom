import { useNavigate } from "react-router-dom";

import HeroSection from "../../components/home/HeroSection";
import TrustSection from "../../components/home/TrustSection";
import CategorySection from "../../components/home/CategorySection";
import FeaturedSection from "../../components/home/FeaturedSection";
import BannerSection from "../../components/home/BannerSection";
import BrandStorySection from "../../components/home/BrandStorySection";
import ExpertiseSection from "../../components/home/ExpertiseSection";

import Reveal from "../../components/ui/Reveal";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-hidden bg-bg-base">
      <HeroSection onShop={() => navigate("/products")} />
 
      <Reveal y={30} duration={0.6}>
        <TrustSection />
      </Reveal>
 
      <Reveal y={50} duration={0.8}>
        <CategorySection />
      </Reveal>
 
      <Reveal y={40} duration={0.7}>
        <FeaturedSection />
      </Reveal>
 
      <Reveal y={60} duration={1}>
        <BannerSection />
      </Reveal>
 
      <Reveal y={50} duration={0.9}>
        <BrandStorySection />
      </Reveal>
 
      <Reveal y={50} duration={0.9}>
        <ExpertiseSection />
      </Reveal>
    </div>
  );
};

export default Home;
