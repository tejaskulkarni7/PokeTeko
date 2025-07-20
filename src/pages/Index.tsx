import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import tavernBg from "@/assets/tavern-bg.jpg";

const Index = () => {
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
                <span className="text-primary-glow animate-glow-pulse">
                  PokeTavern
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Discover legendary Pokemon cards in our magical tavern. 
                Each card holds power waiting to be unleashed.
              </p>
              
              {/* Decorative elements */}
              <div className="flex justify-center items-center gap-4 mb-12">
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1 max-w-xs" />
                <div className="w-3 h-3 bg-primary rounded-full animate-lantern-flicker" />
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1 max-w-xs" />
              </div>
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
