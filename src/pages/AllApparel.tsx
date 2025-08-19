import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ApparelProduct {
  id: number;
  name: string;
  variants: { id: number; name: string; price: number; image?: string }[];
}

const AllApparelPage = () => {
  const [products, setProducts] = useState<ApparelProduct[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApparel = async () => {
      try {
        const res = await fetch("https://api.printful.com/products", {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_PRINTFUL_API_KEY}`,
          },
        });
        const data = await res.json();

        // Filter for apparel category (e.g., T-Shirts, Hoodies, etc.)
        const apparelProducts = data.result.filter((p: any) =>
          p.categories?.some((c: any) =>
            ["Apparel", "T-Shirts", "Hoodies", "Sweatshirts"].includes(c.name)
          )
        );

        setProducts(apparelProducts);
      } catch (err) {
        console.error("Failed to fetch apparel:", err);
      }
    };

    fetchApparel();
  }, []);

  const handleCardClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">All Apparel</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) =>
          product.variants.map((variant) => (
            <Card
              key={variant.id}
              className="group relative overflow-hidden bg-card/80 border-border/50 hover:border-primary/100 hover:shadow-[0_0_10px_rgba(111,41,218,0.6)] cursor-pointer transition-all duration-300"
              onClick={() => handleCardClick(variant.id)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[2/3] overflow-hidden">
                  {variant.image ? (
                    <img
                      src={variant.image}
                      alt={variant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-white">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-white group-hover:text-primary transition-colors truncate">
                    {variant.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-glow">
                      ${variant.price?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AllApparelPage;
