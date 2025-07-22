import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import supabase from "../../supabaseClient";
import { useLoading } from "@/components/LoadingContext";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL; // Make sure this is set in your .env

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const { setIsLoading } = useLoading();
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("pokemon")
        .select("*")
        .limit(4);
      if (!error && data) {
        // Attach public image URL to each product
        const productsWithImageUrl = data.map((product) => ({
          ...product,
          image: `${SUPABASE_URL}/storage/v1/object/public/images/${product.image}.jpg`
        }));
        setProducts(productsWithImageUrl);
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Featured Cards
        </h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;