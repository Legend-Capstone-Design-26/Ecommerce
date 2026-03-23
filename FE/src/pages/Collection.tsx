import { useState } from "react";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import Footer from "@/components/Footer";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const collectionImages = [hero1, hero2, hero3];

const Collection = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header onMenuToggle={() => setNavOpen(!navOpen)} />
      <SideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />

      <main className="pt-20">
        {/* Title */}
        <div className="px-6 md:px-12 py-16">
          <h2 className="nav-category text-foreground">26 SPRING CAMPAIGN PART 2.</h2>
        </div>

        {/* Full-width images */}
        <div className="space-y-1">
          {collectionImages.map((img, i) => (
            <div key={i} className="w-full">
              <img
                src={img}
                alt={`Collection ${i + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Collection;
