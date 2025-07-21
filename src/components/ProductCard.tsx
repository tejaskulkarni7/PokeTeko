import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  condition: string;
  set: string;
}

const ProductCard = ({ id, name, price, image, condition, set }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <Card 
      className="group relative overflow-hidden bg-card/80 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow cursor-pointer backdrop-blur-sm"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Card Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 right-4">
            </div>
          </div>

        </div>

        {/* Card Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {name}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{set}</span>
            <span className="bg-muted px-2 py-1 rounded text-xs">
              {condition}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary-glow">
              ${price.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;