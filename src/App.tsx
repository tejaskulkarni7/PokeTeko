import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import AllCards from "./pages/AllCards";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Services from "./pages/Services";
import { AuthProvider } from "./components/AuthProvider";
import { LoadingProvider } from "@/components/LoadingContext";
import LoadingOverlay from "@/components/LoadingOverlay";
import Checkout from "./pages/Checkout";
import AllApparelPage from "./pages/AllApparel";
import ApparelProductPage from "./pages/ApparelProductPage";
import Success from "./pages/Success";
import Privacy from "./pages/privacy";
import { Analytics } from "@vercel/analytics/react"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LoadingProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/all-cards" element={<AllCards />} />
              <Route path="/apparel" element={<AllApparelPage />} />
              <Route path="/apparel/:id" element={<ApparelProductPage />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/success" element={<Success />} />
              <Route path="/services" element={<Services />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Analytics />
          <LoadingOverlay />
        </TooltipProvider>
      </AuthProvider>
    </LoadingProvider>
  </QueryClientProvider>
);

export default App;
