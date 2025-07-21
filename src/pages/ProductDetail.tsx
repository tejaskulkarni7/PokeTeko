import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Share2, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import supabase from "../../supabaseClient";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("pokemon")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        setProduct({
          ...data,
          image: `${SUPABASE_URL}/storage/v1/object/public/images/${data.image}.jpg`
        });
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-tavern">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-6 text-foreground hover:text-primary hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Card Image */}
          <div
            className="relative w-[25rem] h-[38rem] mx-auto overflow-hidden group"
            style={{ maxWidth: "100%" }}
            onMouseMove={e => {
              const img = e.currentTarget.querySelector("img");
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              img.style.transformOrigin = `${x}% ${y}%`;
            }}
            onMouseLeave={e => {
              const img = e.currentTarget.querySelector("img");
              img.style.transformOrigin = "center center";
            }}
          >
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-150"
              style={{ transformOrigin: "center center" }}
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {product.name}
                </h1>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link copied!",
                        description: "Product link copied to clipboard.",
                      });
                    }}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="border-border/50">
                  {product.condition}
                </Badge>
                <span className="text-muted-foreground">{product.set}</span>
              </div>

              <p className="text-4xl font-bold text-primary-glow mb-6">
                ${product.price?.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {"this is a test description for the product. It provides details about the card, its features, and why it's a great addition to any collection."}
              </p>
            </div>

            <Separator className="bg-border/50" />

            {/* Card Stats */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Card Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HP:</span>
                    <span className="text-foreground font-medium">{"test"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="text-foreground font-medium">{"test2"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weakness:</span>
                    <span className="text-foreground font-medium">{"test3"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Card #:</span>
                    <span className="text-foreground font-medium">{"test4"}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-gradient-gold hover:bg-gradient-ember text-primary-foreground font-semibold shadow-glow hover:shadow-ember transition-all duration-300"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                Fast shipping • Secure packaging • 30-day return policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;