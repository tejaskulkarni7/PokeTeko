import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import supabase from "../../supabaseClient";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp, ArrowLeft } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useLoading } from "@/components/LoadingContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface CartProduct {
  id: number;
  name: string;
  price?: number;
  condition?: string;
  image: string;
  created_at: string;
  type: 'pokemon' | 'apparel';
  variants?: number;
  thumbnail_url?: string;
}

const Cart = () => {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [filtered, setFiltered] = useState<CartProduct[]>([]);
  const [conditionFilter, setConditionFilter] = useState("");
  const [productTypeFilter, setProductTypeFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const { setIsLoading } = useLoading();

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      
      // If user is not logged in, show empty cart
      if (!user) {
        setCartProducts([]);
        setFiltered([]);
        setIsLoading(false);
        return;
      }

      try {
        // Step 1: Get all items from cart for the current user
        const { data: cartItems, error: cartError } = await supabase
          .from("cart")
          .select("product_id, product_type")
          .eq("user_id", user.id);

        if (cartError || !cartItems.length) {
          setCartProducts([]);
          setFiltered([]);
          setIsLoading(false);
          return;
        }

        // Separate pokemon and apparel items
        const pokemonItems = cartItems.filter(item => item.product_type === 'pokemon');
        const apparelItems = cartItems.filter(item => item.product_type === 'apparel');

        const allProducts: CartProduct[] = [];

        // Fetch Pokemon products
        if (pokemonItems.length > 0) {
          const pokemonIds = pokemonItems.map((item) => item.product_id);
          const { data: pokemons, error: pokeError } = await supabase
            .from("pokemon")
            .select("*")
            .in("id", pokemonIds);

          if (!pokeError && pokemons) {
            const enrichedPokemons = pokemons.map((product): CartProduct => ({
              ...product,
              image: `${SUPABASE_URL}/storage/v1/object/public/images/${product.image}.jpg`,
              type: 'pokemon'
            }));
            allProducts.push(...enrichedPokemons);
          }
        }

        // Fetch Apparel products from Printful API
        if (apparelItems.length > 0) {
          const apparelPromises = apparelItems.map(async (item) => {
            try {
              const { data, error } = await supabase.functions.invoke('rapid-handler', {
                body: { name: `sync/products/${item.product_id}` },
              });

              if (error || !data?.result) {
                console.error(`Failed to fetch apparel ${item.product_id}:`, error);
                return null;
              }

              const apparelProduct = data.result;
              
              // Use the enhanced pricing info from the cloud function
              const price = apparelProduct.base_price || apparelProduct.min_price || 25.00;
              
              return {
                id: apparelProduct.id,
                name: apparelProduct.name,
                price: price,
                image: apparelProduct.thumbnail_url || '',
                created_at: new Date().toISOString(),
                type: 'apparel' as const,
                variants: apparelProduct.variants_count || apparelProduct.variants || 0,
                thumbnail_url: apparelProduct.thumbnail_url
              };
            } catch (error) {
              console.error(`Error fetching apparel ${item.product_id}:`, error);
              return null;
            }
          });

          const apparelResults = await Promise.all(apparelPromises);
          const validApparelProducts = apparelResults.filter(Boolean) as CartProduct[];
          allProducts.push(...validApparelProducts);
        }

        setCartProducts(allProducts);
        setFiltered(allProducts);

      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartProducts([]);
        setFiltered([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
    
  }, [user]);

  // Filter + Sort
  useEffect(() => {
    let result = [...cartProducts];

    // Filter by product type
    if (productTypeFilter) {
      result = result.filter((p) => p.type === productTypeFilter);
    }

    // Filter by condition (only for Pokemon cards)
    if (conditionFilter) {
      result = result.filter((p) => p.type === 'pokemon' && p.condition === conditionFilter);
    }

    // Filter by price range
    const [min, max] = priceRange;
    if (!isNaN(min)) result = result.filter((p) => (p.price || 0) >= min);
    if (!isNaN(max)) result = result.filter((p) => (p.price || 0) <= max);

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        let aVal, bVal;
        
        if (sortKey === "created_at") {
          aVal = new Date(a[sortKey]);
          bVal = new Date(b[sortKey]);
        } else if (sortKey === "price") {
          aVal = a.price || 0;
          bVal = b.price || 0;
        } else if (sortKey === "name") {
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
        } else {
          aVal = a[sortKey];
          bVal = b[sortKey];
        }

        if (typeof aVal === "string") {
          return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      });
    }

    setFiltered(result);
  }, [conditionFilter, productTypeFilter, priceRange, sortKey, sortOrder, cartProducts]);

  const handleGoBack = () => navigate(-1);

  const handleRemoveFromCart = async (productId: number, productType: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .eq("product_type", productType);

      if (!error) {
        // Remove from local state
        setCartProducts(prev => prev.filter(p => !(p.id === productId && p.type === productType)));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Unified cart product card component
  const CartProductCard = ({ product }: { product: CartProduct }) => {
    const handleCardClick = () => {
      if (product.type === 'pokemon') {
        navigate(`/product/${product.id}`);
      } else {
        navigate(`/apparel/${product.id}`);
      }
    };

    return (
      <Card 
        className="group relative overflow-hidden bg-card/80 border-border/50 hover:border-primary/100 transition-all duration-300 hover:shadow-glow cursor-pointer backdrop-blur-sm"
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          {/* Product Image Container */}
          <div className="relative aspect-[2/3] overflow-hidden">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 right-4">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromCart(product.id, product.type);
                  }}
                  variant="destructive"
                  size="sm"
                  className="opacity-90 hover:opacity-100"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {product.name}
            </h3>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {product.type === 'pokemon' ? (
                <>
                  <span>{(product as any).set || 'Unknown Set'}</span>
                  <span className="bg-muted px-2 py-1 rounded text-xs">
                    {product.condition || 'Unknown'}
                  </span>
                </>
              ) : (
                <>
                  <span>{product.variants} variants</span>
                  <span className="bg-muted px-2 py-1 rounded text-xs">
                    Apparel
                  </span>
                </>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary-glow">
                ${(parseFloat(product.price?.toString() || '0')).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-tavern">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleGoBack} className="text-foreground hover:text-primary hover:bg-primary/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h2 className="text-3xl font-bold text-foreground">Your Cart</h2>
          </div>
          {user && cartProducts.length > 0 && (
            <Button
              onClick={() => navigate("/checkout")}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-md shadow"
            >
              Checkout
            </Button>
          )}
        </div>

        {!user ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">Please sign in to view your cart</p>
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-md shadow"
            >
              Sign In
            </Button>
          </div>
        ) : cartProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Your cart is empty</p>
          </div>
        ) : (
          <>
            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap gap-4 mb-8 items-center">

              {/* Product Type Filter */}
              <div className="relative">
                <select
                  className="border-none p-2 rounded text-white bg-black focus:ring-2 focus:ring-primary transition-colors shadow hover:bg-primary/10 hover:text-primary"
                  value={productTypeFilter}
                  onChange={(e) => setProductTypeFilter(e.target.value)}
                  style={{ minWidth: 120 }}
                >
                  <option value="" className="bg-black text-white">All Types</option>
                  <option value="pokemon" className="bg-black text-white">Pokemon Cards</option>
                  <option value="apparel" className="bg-black text-white">Apparel</option>
                </select>
              </div>

              {/* Condition Filter (only show for Pokemon or when no type filter) */}
              {(!productTypeFilter || productTypeFilter === 'pokemon') && (
                <div className="relative">
                  <select
                    className="border-none p-2 rounded text-white bg-black focus:ring-2 focus:ring-primary transition-colors shadow hover:bg-primary/10 hover:text-primary"
                    value={conditionFilter}
                    onChange={(e) => setConditionFilter(e.target.value)}
                    style={{ minWidth: 120 }}
                  >
                    <option value="" className="bg-black text-white">All Grades</option>
                    <option value="PSA 10" className="bg-black text-white">PSA 10</option>
                    <option value="PSA 9" className="bg-black text-white">PSA 9</option>
                    <option value="PSA 8" className="bg-black text-white">PSA 8</option>
                    <option value="PSA 7" className="bg-black text-white">PSA 7</option>
                  </select>
                </div>
              )}

              {/* Price Range Slider */}
              <div className="flex flex-col gap-1 items-start w-64">
                <label className="text-sm text-foreground">Price Range</label>
                <div className="w-full px-2">
                  <Slider
                    range
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onChange={(vals) => setPriceRange(Array.isArray(vals) ? vals : [vals, vals])}
                    trackStyle={[{ background: "linear-gradient(90deg, #9d54f1ff 0%, #4c00ffff 100%)", height: 8 }]}
                    handleStyle={[
                      { borderColor: "#9d54f1ff", backgroundColor: "#9d54f1ff", width: 20, height: 20 },
                      { borderColor: "#4c00ffff", backgroundColor: "#4c00ffff", width: 20, height: 20 },
                    ]}
                    railStyle={{ background: "#222", height: 8 }}
                  />
                  <div className="flex justify-between text-xs text-foreground mt-1">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

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

              {/* Sort by Price */}
              <Button
                variant="ghost"
                onClick={() => {
                  setSortKey("price");
                  setSortOrder((prev) => (sortKey === "price" && prev === "desc" ? "asc" : "desc"));
                }}
                className="text-foreground hover:text-primary hover:bg-primary/10 flex items-center"
              >
                Price
                {sortKey === "price" &&
                  (sortOrder === "asc" ? (
                    <ArrowUp className="ml-1 w-4 h-4" />
                  ) : (
                    <ArrowDown className="ml-1 w-4 h-4" />
                  ))}
              </Button>

              {/* Sort by Created At */}
              <Button
                variant="ghost"
                onClick={() => {
                  setSortKey("created_at");
                  setSortOrder((prev) => (sortKey === "created_at" && prev === "desc" ? "asc" : "desc"));
                }}
                className="text-foreground hover:text-primary hover:bg-primary/10 flex items-center"
              >
                Newly Added
                {sortKey === "created_at" &&
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
                <CartProductCard key={`${product.type}-${product.id}`} product={product} />
              ))}
            </div>
          </>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default Cart;