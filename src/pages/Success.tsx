import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const Success = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('loading');
  const [sessionData, setSessionData] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Use useRef to persist the orderSaved state across renders
  const orderSavedRef = useRef(false);
  const processedSessionRef = useRef(null); // Track which session we've processed

  const saveOrderToDatabase = async (sessionId: string, sessionData: any, userId: string) => {
    // Prevent duplicate order saves using ref
    if (orderSavedRef.current || processedSessionRef.current === sessionId) {
      console.log('Order already saved for this session, skipping...');
      return;
    }
    
    orderSavedRef.current = true;
    processedSessionRef.current = sessionId;

    try {
      // First, get the order draft with shipping information
      const { data: orderDraft, error: draftError } = await supabase
        .from("order_drafts")
        .select("*")
        .eq("session_id", sessionId)
        .single();

      if (draftError || !orderDraft) {
        console.error('Failed to fetch order draft:', draftError);
        orderSavedRef.current = false;
        return;
      }

      // Get current cart items to save as individual order rows
      const { data: cartItems, error: cartError } = await supabase
        .from("cart")
        .select("product_id, product_type, size")
        .eq("user_id", userId);

      if (cartError) {
        console.error('Failed to fetch cart items for order:', cartError);
        orderSavedRef.current = false;
        return;
      }

      if (!cartItems?.length) {
        console.warn('No cart items found - cart may have been cleared already');
        return;
      }

      // Create individual order records for each cart item, linking to the draft
      const orderRecords = cartItems.map(item => ({
        user_id: userId,
        session_id: sessionId,
        total_amount: sessionData.amount_total / 100,
        purchased_at: new Date().toISOString(),
        product_id: item.product_id,
        product_type: item.product_type,
        size: item.size,
        order_draft_id: orderDraft.id
      }));

      console.log('Attempting to create orders:', orderRecords);

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert(orderRecords)
        .select('id');

      if (orderError) {
        console.error('Failed to create orders:', orderError);
        console.error('Order error details:', JSON.stringify(orderError, null, 2));
        orderSavedRef.current = false;
        return;
      }

      console.log('Orders saved successfully:', orderData?.length, 'records created');

      // Clear the user's cart after successful order save
      const { error: cartClearError } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId);

      if (cartClearError) {
        console.error('Failed to clear cart:', cartClearError);
      }

      console.log('Order completed successfully with shipping information from draft:', orderDraft.id);

    } catch (error) {
      console.error('Error saving order to database:', error);
      orderSavedRef.current = false;
    }
  };

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setVerificationStatus('error');
        return;
      }

      // If we've already processed this session, don't do it again
      if (processedSessionRef.current === sessionId) {
        console.log('Session already processed, skipping verification...');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-session', {
          body: { session_id: sessionId },
        });

        if (error || !data?.success) {
          setVerificationStatus('error');
          return;
        }

        setSessionData(data.session);
        setVerificationStatus('success');

        // Save order to database only if we have a user and haven't saved yet
        if (user && !orderSavedRef.current) {
          await saveOrderToDatabase(sessionId, data.session, user.id);
        }

      } catch (error) {
        console.error('Error verifying payment:', error);
        setVerificationStatus('error');
      }
    };

    // Only run if we have the necessary data and haven't processed this session
    const sessionId = searchParams.get('session_id');
    if (sessionId && (!processedSessionRef.current || processedSessionRef.current !== sessionId)) {
      verifyPayment();
    }
  }, []); // Remove dependencies to prevent re-runs

  // Separate effect to handle when user becomes available
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (user && sessionId && sessionData && verificationStatus === 'success' && !orderSavedRef.current) {
      saveOrderToDatabase(sessionId, sessionData, user.id);
    }
  }, [user, sessionData, verificationStatus]); // Only run when these change

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Verifying Payment...</h2>
            <p className="text-muted-foreground">Please wait while we confirm your payment.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            
            {sessionData && (
              <div className="bg-card/30 border border-border rounded-lg p-6 max-w-md mx-auto mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Order Details</h3>
                <div className="space-y-2 text-sm">
                  {sessionData.customer_email && (
                    <p className="text-muted-foreground">
                      Email: <span className="text-foreground">{sessionData.customer_email}</span>
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    Total: <span className="text-foreground font-medium">
                      ${(sessionData.amount_total / 100).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => navigate('/')}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-12">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Payment Verification Failed</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't verify your payment. If you were charged, please contact support.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => navigate('/checkout')}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2"
              >
                Try Again
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="px-6 py-2"
              >
                Go Home
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-tavern">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
};

export default Success;