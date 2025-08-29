import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DarkVeil from "@/components/DarkVeil";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // Prevent flash of unstyled content
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const seeAllCards = () => {
    navigate("/all-cards");
  };

  const seeAllApparel = () => {
    navigate("/apparel");
  };

  return (
    <div className="min-h-screen bg-gradient-tavern relative">
      {/* Banner */}
      {showBanner && (
        <div className="bg-primary/90 text-white px-4 py-3 text-center flex items-center justify-center relative z-20">
          <span className="text-sm md:text-base font-medium">
            All prices already include shipping and taxes — no surprises at checkout.
          </span>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <Header />

      {/* Content with fade-in transition */}
      <div
        className={`relative z-10 transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Background animation covering hero and product grid */}
        <div className="absolute inset-0 top-0 h-screen pointer-events-none overflow-hidden">
          <div className="w-full h-full opacity-50">
            <DarkVeil />
          </div>
        </div>

        {/* Hero Section */}
        <section className="text-center relative py-16">
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto relative z-10">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-3 leading-tight">
                Welcome to{" "}
                <span
                  style={{
                    color: "hsla(270, 27%, 87%, 1.00)",
                    background: "none",
                    textShadow: "0 0 20px #6d29daff, 0 0 32px #9f20e9e7",
                  }}
                >
                  PokeTeko Shop
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-4 leading-relaxed">
                Discover legendary Pokemon products.
              </p>

              {/* Decorative elements */}
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1 max-w-xs" />
                <div className="w-3 h-3 bg-primary rounded-full animate-lantern-flicker" />
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1 max-w-xs" />
              </div>

              {/* Side-by-side buttons */}
              <div className="flex justify-center gap-20 mt-6">
                <Button
                  onClick={seeAllCards}
                  className="flex-1 text-xl px-6 py-3 bg-transparent text-white font-semibold 
                            border-2 border-transparent 
                            hover:border-primary/100 hover:bg-transparent 
                            focus:ring-2 focus:ring-primary/30 
                            transition-all duration-300"
                  size="lg"
                >
                  Cards
                </Button>

                <Button
                  onClick={seeAllApparel}
                  className="flex-1 text-xl px-6 py-3 bg-transparent text-white font-semibold 
                            border-2 border-transparent 
                            hover:border-primary/100 hover:bg-transparent 
                            focus:ring-2 focus:ring-primary/30 
                            transition-all duration-300"
                  size="lg"
                >
                  Apparel
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductGrid />
      <Footer />
    </div>
  );
};

export default Index;
