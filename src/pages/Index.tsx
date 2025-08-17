import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import backgroundImage from "@/assets/background.webp";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DarkVeil from "@/components/DarkVeil";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-tavern relative">
      <Header />
      
      {/* Content with fade-in transition */}
      <div className={`relative z-10 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
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
                    textShadow: "0 0 20px #6d29daff, 0 0 32px #9f20e9e7"
                  }}
                >
                  PokeTek Shop
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
              <Button
                onClick={seeAllCards}
                className="w-full bg-gradient-gold hover:bg-gradient-ember text-primary-foreground font-semibold shadow-glow hover:shadow-ember transition-all duration-300"
                size="lg"
              >
                See All Cards
              </Button>
            </div>
          </div>
        </section>

        <ProductGrid />
        <Footer />
      </div>
    </div>
  );
};

export default Index;