import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rarity: string;
  condition: string;
  set: string;
}

const ProductCard = ({ id, name, price, image, rarity, condition, set }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-muted text-muted-foreground';
      case 'uncommon': return 'bg-secondary text-secondary-foreground';
      case 'rare': return 'bg-primary text-primary-foreground';
      case 'ultra rare': return 'bg-gradient-gold text-primary-foreground';
      case 'secret rare': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
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
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1 bg-card/90 hover:bg-card text-card-foreground">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button size="sm" variant="ghost" className="bg-card/90 hover:bg-card text-card-foreground">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Rarity Badge */}
          <Badge className={`absolute top-2 right-2 ${getRarityColor(rarity)}`}>
            {rarity}
          </Badge>
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