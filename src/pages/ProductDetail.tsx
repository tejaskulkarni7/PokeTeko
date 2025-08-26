import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Share2, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import supabase from "../../supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { useLoading } from "@/components/LoadingContext";
import { set } from "date-fns";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const { user } = useAuth(); // <-- Get user
  const [inCart, setInCart] = useState(false);
  const { setIsLoading } = useLoading();
      useEffect(() => {
      const fetchProductAndCart = async () => {
        if (!id) return;
        setIsLoading(true);

        // Step 1: Fetch product
        const { data, error } = await supabase
          .from("pokemon")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          setIsLoading(false);
          return;
        }

        const productWithImage = {
          ...data,
          image: `${SUPABASE_URL}/storage/v1/object/public/images/${data.image}.jpg`,
        };
        setProduct(productWithImage);

        // Step 2: Check cart (only if user is available)
        if (user) {
          const { count } = await supabase
            .from("cart")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("product_id", productWithImage.id);

          setInCart(count > 0);
        }

        // Step 3: All done
        setIsLoading(false);
      };

      fetchProductAndCart();
    }, [id, user]); // re-run if id or user changes



  const handleAddToCart = async () => {
  if (!product || !user) return;

  // Check if item already exists in cart
  const { count, error: fetchError } = await supabase
    .from("cart")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("product_type", 'pokemon')
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
    .insert({ user_id: user.id, product_id: product.id, product_type: 'pokemon' });
  
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
};

const handleRemoveFromCart = async () => {
  if (!product || !user) return;

  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("user_id", user.id)
    .eq("product_type", 'pokemon')
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
};

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
                <span className="text-muted-foreground">{product.set}</span>
              </div>

              <p className="text-4xl font-bold text-primary-glow mb-6">
                ${product.price?.toFixed(2)}
              </p>
            </div>

            <Separator className="bg-border/50" />

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button
                onClick={inCart ? handleRemoveFromCart : handleAddToCart}
                className={`w-full font-semibold shadow-glow transition-all duration-300 ${
                  inCart
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gradient-gold hover:bg-gradient-ember text-primary-foreground"
                }`}
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {inCart ? "Remove from Cart" : "Add to Cart"}
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