import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const Checkout = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) return;

      const { data: cartData, error: cartError } = await supabase
        .from("cart")
        .select("product_id")
        .eq("product_type", 'pokemon')
        .eq("user_id", user.id);

      if (cartError || !cartData.length) {
        setCartItems([]);
        return;
      }

      const pokemonIds = cartData.map((item) => item.pokemon);

      const { data: pokemonDetails, error: pokeError } = await supabase
        .from("pokemon")
        .select("*")
        .in("id", pokemonIds);

      if (pokeError) return;

      const enriched = pokemonDetails.map((item) => ({
        ...item,
        image: `${SUPABASE_URL}/storage/v1/object/public/images/${item.image}.jpg`,
      }));

      setCartItems(enriched);
      const totalPrice = enriched.reduce((acc, item) => acc + item.price, 0);
      setTotal(totalPrice);
    };

    fetchCartItems();
  }, [user]);

  const handlePay = async () => {
    try {
      const response = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          userEmail: user.email,
        }),
      });
      const data = await response.json();
      window.location.href = data.url; // Redirect to Stripe Checkout
    } catch (error) {
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-tavern">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">Checkout</h2>

        {cartItems.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border border-border p-4 rounded-md bg-card/30">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-foreground">{item.name}</span>
                    <span className="text-muted-foreground text-sm">{item.condition}</span>
                    <span className="text-primary font-medium mt-1">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t pt-4 border-border">
              <span className="text-xl font-semibold text-foreground">Total: ${total.toFixed(2)}</span>
              <Button
                onClick={handlePay}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-md shadow"
              >
                Pay with Stripe
              </Button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
