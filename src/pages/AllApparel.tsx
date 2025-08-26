import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowDown, ArrowUp } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useLoading } from "@/components/LoadingContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import supabase from "../../supabaseClient";

interface ApparelProduct {
  id: number;
  external_id: string;
  name: string;
  variants: number;
  synced: number;
  thumbnail_url: string;
  is_ignored: boolean;
}

const AllApparelPage = () => {
  const [products, setProducts] = useState<ApparelProduct[]>([]);
  const [filtered, setFiltered] = useState<ApparelProduct[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApparel = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('rapid-handler', {
          body: { name: 'sync/products' },
        });

        if (error || !data?.result) {
          console.error("Failed to fetch apparel:", error);
          return;
        }

        console.log("API Response:", data); // Debug log
        setProducts(data.result);
        setFiltered(data.result);
      } catch (err) {
        console.error("Failed to fetch apparel:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApparel();
  }, []);

  // Filter + Sort
  useEffect(() => {
    let result = [...products];

    // Note: Since we don't have price data in this response, 
    // we'll skip price filtering for now
    
    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        let aVal, bVal;
        if (sortKey === "name") {
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
        } else if (sortKey === "variants") {
          aVal = a.variants;
          bVal = b.variants;
        }
        
        if (typeof aVal === "string") {
          return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      });
    }

    setFiltered(result);
  }, [priceRange, sortKey, sortOrder, products]);

  const handleCardClick = (productId: number) => {
    navigate(`/apparel/${productId}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-tavern">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="text-foreground hover:text-primary hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h2 className="text-3xl font-bold text-foreground">All Apparel</h2>
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          {/* Sort by Name */}
          <Button
            variant="ghost"
            onClick={() => {
              setSortKey("name");
              setSortOrder((prev) => (sortKey === "name" && prev === "desc" ? "asc" : "desc"));
            }}
            className="text-foreground hover:text-primary hover:bg-primary/10 flex items-center"
          >
            Name
            {sortKey === "name" &&
              (sortOrder === "asc" ? (
                <ArrowUp className="ml-1 w-4 h-4" />
              ) : (
                <ArrowDown className="ml-1 w-4 h-4" />
              ))}
          </Button>

          {/* Sort by Variants Count */}
          <Button
            variant="ghost"
            onClick={() => {
              setSortKey("variants");
              setSortOrder((prev) => (sortKey === "variants" && prev === "desc" ? "asc" : "desc"));
            }}
            className="text-foreground hover:text-primary hover:bg-primary/10 flex items-center"
          >
            Variants
            {sortKey === "variants" &&
              (sortOrder === "asc" ? (
                <ArrowUp className="ml-1 w-4 h-4" />
              ) : (
                <ArrowDown className="ml-1 w-4 h-4" />
              ))}
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <Card
              key={product.id}
              className="group relative overflow-hidden bg-card/80 border-border/50 hover:border-primary/100 hover:shadow-glow cursor-pointer transition-all duration-300 backdrop-blur-sm"
              onClick={() => handleCardClick(product.id)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[2/3] overflow-hidden">
                  {product.thumbnail_url ? (
                    <img
                      src={product.thumbnail_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{product.variants} variants</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No apparel found matching your criteria</p>
          </div>
        )}
        
        <Footer />
      </div>
    </div>
  );
};

export default AllApparelPage;