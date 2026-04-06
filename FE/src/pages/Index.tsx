import { useState } from "react";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import HeroSlider from "@/components/HeroSlider";
import Footer from "@/components/Footer";
import collectionBanner from "@/assets/collection-banner.jpg";
import { Link } from "react-router-dom";

const Index = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header onMenuToggle={() => setNavOpen(!navOpen)} />
      <SideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />

      {/* Hero */}
      <HeroSlider />

      {/* Collection Banner */}
      <section className="w-full">
        <Link
          to="/collection"
          className="block relative group overflow-hidden"
          data-track-id="home_product_click"
        >
          <img
            src={collectionBanner}
            alt="Spring Summer Collection"
            className="w-full h-[50vh] md:h-[70vh] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p
              className="text-2xl md:text-4xl tracking-[0.15em] uppercase"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
                color: "hsl(0 0% 10%)",
                mixBlendMode: "difference",
                filter: "invert(1)",
              }}
            >
              Spring Summer Collection
            </p>
          </div>
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
