import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface CartProduct {
  id: number;
  name: string;
  price?: number;
  condition?: string;
  image: string;
  created_at: string;
  type: 'pokemon' | 'apparel';
  thumbnail_url?: string;
  size?: string; // Add size property for apparel items
  cart_id?: number; // Add cart_id for reference
}

interface ShippingForm {
  billing_first_name: string;
  billing_last_name: string;
  billing_address_line1: string;
  billing_address_line2: string;
  billing_city: string;
  billing_state: string;
  billing_postal_code: string;
  billing_country: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address_line1: string;
  shipping_address_line2: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  order_notes: string;
}

const Checkout = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ShippingForm>({
    billing_first_name: '',
    billing_last_name: '',
    billing_address_line1: '',
    billing_address_line2: '',
    billing_city: '',
    billing_state: '',
    billing_postal_code: '',
    billing_country: 'US',
    shipping_first_name: '',
    shipping_last_name: '',
    shipping_address_line1: '',
    shipping_address_line2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: 'US',
    order_notes: ''
  });

  const handleGoBack = () => navigate('/cart');

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) return;

      try {
        // Step 1: Get all items from cart for the current user (including size for apparel)
        const { data: cartData, error: cartError } = await supabase
          .from("cart")
          .select("id, product_id, product_type, size")
          .eq("user_id", user.id);

        if (cartError || !cartData.length) {
          setCartItems([]);
          return;
        }

        // Separate pokemon and apparel items
        const pokemonItems = cartData.filter(item => item.product_type === 'pokemon');
        const apparelItems = cartData.filter(item => item.product_type === 'apparel');

        const allProducts: CartProduct[] = [];

        // Fetch Pokemon products
        if (pokemonItems.length > 0) {
          const pokemonIds = pokemonItems.map((item) => item.product_id);
          const { data: pokemons, error: pokeError } = await supabase
            .from("pokemon")
            .select("*")
            .in("id", pokemonIds);

          if (!pokeError && pokemons) {
            const enrichedPokemons = pokemons.map((product): CartProduct => {
              const cartItem = pokemonItems.find(item => item.product_id === product.id);
              return {
                ...product,
                image: `${SUPABASE_URL}/storage/v1/object/public/images/${product.image}.jpg`,
                type: 'pokemon',
                cart_id: cartItem?.id
              };
            });
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

              const apparelProduct = data.result.find(
                (prod: any) => prod.id === item.product_id
              );
              
              const price = apparelProduct.base_price || apparelProduct.min_price || 19.99;
              
              return {
                id: apparelProduct.id,
                name: apparelProduct.name,
                price: price,
                image: apparelProduct.thumbnail_url || '',
                created_at: new Date().toISOString(),
                type: 'apparel' as const,
                thumbnail_url: apparelProduct.thumbnail_url,
                size: item.size, // Include size from cart
                cart_id: item.id
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

        setCartItems(allProducts);
        
        // Calculate total price
        const totalPrice = allProducts.reduce((acc, item) => acc + (item.price || 0), 0);
        setTotal(totalPrice);

      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, [user]);

  const handleInputChange = (field: keyof ShippingForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSameAsBillingChange = (checked: boolean) => {
    setSameAsBilling(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        shipping_first_name: prev.billing_first_name,
        shipping_last_name: prev.billing_last_name,
        shipping_address_line1: prev.billing_address_line1,
        shipping_address_line2: prev.billing_address_line2,
        shipping_city: prev.billing_city,
        shipping_state: prev.billing_state,
        shipping_postal_code: prev.billing_postal_code,
        shipping_country: prev.billing_country,
      }));
    }
  };

  // Auto-copy billing to shipping when same as billing is checked
  useEffect(() => {
    if (sameAsBilling) {
      setFormData(prev => ({
        ...prev,
        shipping_first_name: prev.billing_first_name,
        shipping_last_name: prev.billing_last_name,
        shipping_address_line1: prev.billing_address_line1,
        shipping_address_line2: prev.billing_address_line2,
        shipping_city: prev.billing_city,
        shipping_state: prev.billing_state,
        shipping_postal_code: prev.billing_postal_code,
        shipping_country: prev.billing_country,
      }));
    }
  }, [formData.billing_first_name, formData.billing_last_name, formData.billing_address_line1, 
      formData.billing_address_line2, formData.billing_city, formData.billing_state, 
      formData.billing_postal_code, formData.billing_country, sameAsBilling]);

  const validateForm = () => {
    const required = [
      'billing_first_name', 'billing_last_name', 'billing_address_line1', 
      'billing_city', 'billing_state', 'billing_postal_code',
      'shipping_first_name', 'shipping_last_name', 'shipping_address_line1',
      'shipping_city', 'shipping_state', 'shipping_postal_code'
    ];

    return required.every(field => formData[field as keyof ShippingForm]?.trim());
  };

  const handlePay = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsProcessing(true);

    try {
      // First, save the order draft with shipping info
      const { data: draftData, error: draftError } = await supabase
        .from('order_drafts')
        .insert({
          user_id: user.id,
          total_amount: total,
          ...formData
        })
        .select('id')
        .single();

      if (draftError) {
        console.error('Error saving order draft:', draftError);
        alert('Error saving order information. Please try again.');
        return;
      }

      // Then create Stripe session with the draft ID and cart items with sizes
      const { data, error } = await supabase.functions.invoke('swift-api', {
        body: {
          cartItems,
          userEmail: user.email,
          orderDraftId: draftData.id,
        },
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        alert("Payment failed. Please try again.");
        return;
      }

      if (data?.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert("Failed to create checkout session.");
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-tavern">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">Please sign in to continue</p>
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2"
            >
              Sign In
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={handleGoBack} className="text-foreground hover:text-primary hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <h2 className="text-3xl font-bold text-foreground">Checkout</h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button 
              onClick={() => navigate('/')}
              className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Order Summary</h3>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.type}-${item.id}-${item.size || 'no-size'}`} className="flex items-center gap-4 border border-border p-4 rounded-md bg-card/30">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex flex-col flex-grow">
                      <span className="font-semibold text-foreground">{item.name}</span>
                      {item.type === 'pokemon' ? (
                        <span className="text-muted-foreground text-sm">{item.condition}</span>
                      ) : (
                        <div className="flex gap-2 items-center text-sm">
                          <span className="text-muted-foreground">Apparel</span>
                          {item.size && (
                            <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                              Size: {item.size}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-primary font-medium">
                      ${(item.price || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 border-border">
                <span className="text-foreground">Shipping and Tax Included</span>
                <div className="flex justify-between items-center text-xl font-semibold">
                  <span className="text-foreground">Total:</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Form */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Shipping Information</h3>
              
              <div className="space-y-6">
                {/* Billing Address */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-foreground">Billing Address</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billing_first_name">First Name *</Label>
                      <Input
                        id="billing_first_name"
                        value={formData.billing_first_name}
                        onChange={(e) => handleInputChange('billing_first_name', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="billing_last_name">Last Name *</Label>
                      <Input
                        id="billing_last_name"
                        value={formData.billing_last_name}
                        onChange={(e) => handleInputChange('billing_last_name', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="billing_address_line1">Address Line 1 *</Label>
                    <Input
                      id="billing_address_line1"
                      value={formData.billing_address_line1}
                      onChange={(e) => handleInputChange('billing_address_line1', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="billing_address_line2">Address Line 2</Label>
                    <Input
                      id="billing_address_line2"
                      value={formData.billing_address_line2}
                      onChange={(e) => handleInputChange('billing_address_line2', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billing_city">City *</Label>
                      <Input
                        id="billing_city"
                        value={formData.billing_city}
                        onChange={(e) => handleInputChange('billing_city', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="billing_state">State *</Label>
                      <Input
                        id="billing_state"
                        value={formData.billing_state}
                        onChange={(e) => handleInputChange('billing_state', e.target.value)}
                        className="mt-1"
                        placeholder="e.g. CA, NY"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billing_postal_code">ZIP Code *</Label>
                      <Input
                        id="billing_postal_code"
                        value={formData.billing_postal_code}
                        onChange={(e) => handleInputChange('billing_postal_code', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="billing_country">Country *</Label>
                      <Input
                        id="billing_country"
                        value={formData.billing_country}
                        onChange={(e) => handleInputChange('billing_country', e.target.value)}
                        className="mt-1"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Same as Billing Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="same-as-billing" 
                    checked={sameAsBilling}
                    onCheckedChange={handleSameAsBillingChange}
                  />
                  <Label htmlFor="same-as-billing">Shipping address is same as billing address</Label>
                </div>

                {/* Shipping Address */}
                {!sameAsBilling && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-foreground">Shipping Address</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shipping_first_name">First Name *</Label>
                        <Input
                          id="shipping_first_name"
                          value={formData.shipping_first_name}
                          onChange={(e) => handleInputChange('shipping_first_name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shipping_last_name">Last Name *</Label>
                        <Input
                          id="shipping_last_name"
                          value={formData.shipping_last_name}
                          onChange={(e) => handleInputChange('shipping_last_name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="shipping_address_line1">Address Line 1 *</Label>
                      <Input
                        id="shipping_address_line1"
                        value={formData.shipping_address_line1}
                        onChange={(e) => handleInputChange('shipping_address_line1', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="shipping_address_line2">Address Line 2</Label>
                      <Input
                        id="shipping_address_line2"
                        value={formData.shipping_address_line2}
                        onChange={(e) => handleInputChange('shipping_address_line2', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shipping_city">City *</Label>
                        <Input
                          id="shipping_city"
                          value={formData.shipping_city}
                          onChange={(e) => handleInputChange('shipping_city', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shipping_state">State *</Label>
                        <Input
                          id="shipping_state"
                          value={formData.shipping_state}
                          onChange={(e) => handleInputChange('shipping_state', e.target.value)}
                          className="mt-1"
                          placeholder="e.g. CA, NY"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shipping_postal_code">ZIP Code *</Label>
                        <Input
                          id="shipping_postal_code"
                          value={formData.shipping_postal_code}
                          onChange={(e) => handleInputChange('shipping_postal_code', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shipping_country">Country *</Label>
                        <Input
                          id="shipping_country"
                          value={formData.shipping_country}
                          onChange={(e) => handleInputChange('shipping_country', e.target.value)}
                          className="mt-1"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Notes */}
                <div>
                  <Label htmlFor="order_notes">Order Notes</Label>
                  <Textarea
                    id="order_notes"
                    placeholder="Special shipping instructions, delivery notes, etc..."
                    value={formData.order_notes}
                    onChange={(e) => handleInputChange('order_notes', e.target.value)}
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handlePay}
                  disabled={!validateForm() || isProcessing}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 text-lg disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)} with Stripe`}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;