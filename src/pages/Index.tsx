import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import tavernBg from "@/assets/tavern-bg.jpg";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const navigate = useNavigate();
  const seeAllCards = () => {
    navigate("/all-cards");
  };

  return (
    <div className="min-h-screen bg-gradient-tavern relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${tavernBg})` }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Welcome to{" "}
                <span
                  className=""
                  style={{
                    background: "none",
                    textShadow: "0 0 16px #FFD700, 0 0 32px #FFD70099"
                  }}
                >
                  PokeTavern
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Discover legendary Pokemon cards in our magical tavern. 
              </p>
              
              {/* Decorative elements */}
              <div className="flex justify-center items-center gap-4 mb-12">
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1 max-w-xs" />
                <div className="w-3 h-3 bg-primary rounded-full animate-lantern-flicker" />
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1 max-w-xs" />
              </div>
                <Button 
                  onClick={seeAllCards}
                  className="w-full bg-gradient-gold hover:bg-gradient-ember text-primary-foreground font-semibold shadow-glow hover:shadow-ember transition-all duration-300"
                  size="lg">
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
