import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingCart, Heart, Share2 } from "lucide-react";
import { useLoading } from "@/components/LoadingContext";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
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

const ApparelProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setIsLoading } = useLoading();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<ApparelProduct | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const fetchProductAndCart = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch products from Supabase edge function
        const { data: productsData, error } = await supabase.functions.invoke('rapid-handler', {
          body: { name: 'sync/products' },
        });

        if (error || !productsData?.result) {
          console.error("Failed to fetch apparel:", error);
          return;
        }

        console.log("API Response:", productsData); // Debug log
        
        // Find the specific product
        const foundProduct = productsData.result.find((product: any) => 
          product.id.toString() === id
        );
        
        setProduct(foundProduct || null);

        // Check if item is in cart (if user is logged in)
        if (user && foundProduct) {
          const { count } = await supabase
            .from("cart")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("product_type", 'apparel')
            .eq("product_id", foundProduct.id);

          setInCart(count > 0);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductAndCart();
  }, [id, user]);

  const handleAddToCart = async () => {
    if (!user || !product) {
      if (!user) {
        navigate("/auth");
      }
      return;
    }

    setIsAddingToCart(true);
    try {
      // Check if item already exists in cart
      const { count, error: fetchError } = await supabase
        .from("cart")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("product_type", 'apparel')
        .eq("product_id", product.id)
        .limit(1);

      if (fetchError && fetchError.code !== "PGRST116") {
        toast({
          title: "Error",
          description: "Could not check cart. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (count > 0) {
        toast({
          title: "Already in Cart",
          description: `${product.name} is already in your cart.`,
        });
        return;
      }

      // Add to cart if not already there
      const { error: insertError } = await supabase
        .from("cart")
        .insert([
          {
            product_type: 'apparel',
            product_id: product.id,
            user_id: user.id,
          }
        ]);

      if (insertError) {
        toast({
          title: "Error",
          description: "Failed to add to cart. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Added to Cart!",
          description: `${product.name} has been added to your cart.`,
        });
        setInCart(true);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!user || !product) return;

    setIsAddingToCart(true);
    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", user.id)
        .eq("product_type", 'apparel')
        .eq("product_id", product.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to remove from cart. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Removed from Cart",
          description: `${product.name} was removed from your cart.`,
        });
        setInCart(false);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove from cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-tavern">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Product not found</p>
            <Button 
              onClick={handleGoBack}
              className="mt-4"
              variant="ghost"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-tavern">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-6 text-foreground hover:text-primary hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Apparel
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div
            className="relative w-full max-w-lg mx-auto overflow-hidden group"
            onMouseMove={e => {
              const img = e.currentTarget.querySelector("img");
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              if (img) {
                img.style.transformOrigin = `${x}% ${y}%`;
              }
            }}
            onMouseLeave={e => {
              const img = e.currentTarget.querySelector("img");
              if (img) {
                img.style.transformOrigin = "center center";
              }
            }}
          >
            <Card className="overflow-hidden bg-card/80 border-border/50">
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden">
                  {product.thumbnail_url ? (
                    <img
                      src={product.thumbnail_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-150"
                      style={{ transformOrigin: "center center" }}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      <span className="text-lg">No Image Available</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
                <span className="text-muted-foreground">ID: {product.external_id}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-muted text-foreground">
                  {product.variants} Variants Available
                </Badge>
                <Badge variant="secondary" className="bg-muted text-foreground">
                  {product.synced} Synced
                </Badge>
                <Badge 
                  variant={!product.is_ignored ? 'default' : 'destructive'}
                  className={!product.is_ignored ? 'bg-green-600' : ''}
                >
                  {!product.is_ignored ? 'Active' : 'Ignored'}
                </Badge>
              </div>

              <p className="text-2xl font-bold text-primary-glow mb-6">
                Multiple variants available
                <span className="block text-sm text-muted-foreground mt-1">
                  Pricing varies by variant
                </span>
              </p>
            </div>

            <Separator className="bg-border/50" />

            {/* Add to Cart */}
            <div className="space-y-4">
              {!user ? (
                <div className="space-y-4">
                  <div className="bg-blue-600/20 border border-blue-600 rounded-md p-3 text-blue-400">
                    Please{" "}
                    <button
                      onClick={() => navigate("/auth")}
                      className="underline hover:text-blue-300 transition-colors"
                    >
                      sign in
                    </button>{" "}
                    to add items to your cart.
                  </div>
                  <Button
                    onClick={() => navigate("/auth")}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                    size="lg"
                  >
                    Sign In to Purchase
                  </Button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Button
                    onClick={inCart ? handleRemoveFromCart : handleAddToCart}
                    disabled={isAddingToCart || product.is_ignored}
                    className={`flex-1 font-semibold shadow-glow transition-all duration-300 ${
                      inCart
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-gradient-gold hover:bg-gradient-ember text-primary-foreground"
                    }`}
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isAddingToCart 
                      ? "Processing..." 
                      : inCart 
                        ? "Remove from Cart" 
                        : "Add to Cart"
                    }
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    size="lg"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              )}

              <p className="text-sm text-muted-foreground text-center">
                Fast shipping • Secure packaging • 30-day return policy
              </p>
            </div>

            {product.is_ignored && (
              <div className="bg-red-600/20 border border-red-600 rounded-md p-3 text-red-400">
                This product is currently not available for purchase.
              </div>
            )}

            {/* Product Info */}
            <div className="bg-card/50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-foreground">Product Information</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• This product has {product.variants} different variants</p>
                <p>• {product.synced} variants are currently synced and available</p>
                <p>• Product ID: {product.external_id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApparelProductPage;