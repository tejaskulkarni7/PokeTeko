import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Heart, Share2, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app this would come from API
const mockProductDetail = {
  id: "1",
  name: "Pikachu VMAX",
  price: 29.99,
  image: "https://images.unsplash.com/photo-1542779283-429940ce8336?w=600&h=900&fit=crop",
  rarity: "Ultra Rare",
  condition: "Near Mint",
  set: "Vivid Voltage",
  cardNumber: "043/185",
  artist: "PLANETA Mochizuki",
  description: "This electric mouse Pokemon has stored up so much electricity in its body that it glows with golden light. When Pikachu releases this energy, its power is truly devastating to behold.",
  hp: "310",
  type: "Lightning",
  weakness: "Fighting",
  retreat: "2",
  attacks: [
    {
      name: "Max Lightning",
      cost: ["Lightning", "Lightning", "Lightning"],
      damage: "120+",
      description: "This attack does 30 more damage for each Lightning Energy attached to all of your Pokémon."
    }
  ],
  specifications: [
    { label: "Card Type", value: "Pokémon" },
    { label: "Stage", value: "VMAX" },
    { label: "Evolves From", value: "Pikachu V" },
    { label: "Regulation Mark", value: "D" },
    { label: "Release Date", value: "November 13, 2020" }
  ]
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart!",
      description: `${mockProductDetail.name} has been added to your cart.`,
    });
  };

  const handleGoBack = () => {
    navigate(-1);
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
          <div className="space-y-4">
            <Card className="overflow-hidden bg-card/80 border-border/50 shadow-tavern">
              <CardContent className="p-0">
                <div className="aspect-[2/3] relative">
                  <img 
                    src={mockProductDetail.image} 
                    alt={mockProductDetail.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {mockProductDetail.name}
                </h1>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getRarityColor(mockProductDetail.rarity)}>
                  {mockProductDetail.rarity}
                </Badge>
                <Badge variant="outline" className="border-border/50">
                  {mockProductDetail.condition}
                </Badge>
                <span className="text-muted-foreground">{mockProductDetail.set}</span>
              </div>

              <p className="text-4xl font-bold text-primary-glow mb-6">
                ${mockProductDetail.price.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {mockProductDetail.description}
              </p>
            </div>

            <Separator className="bg-border/50" />

            {/* Card Stats */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Card Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HP:</span>
                    <span className="text-foreground font-medium">{mockProductDetail.hp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="text-foreground font-medium">{mockProductDetail.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weakness:</span>
                    <span className="text-foreground font-medium">{mockProductDetail.weakness}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Card #:</span>
                    <span className="text-foreground font-medium">{mockProductDetail.cardNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Artist:</span>
                    <span className="text-foreground font-medium">{mockProductDetail.artist}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Retreat:</span>
                    <span className="text-foreground font-medium">{mockProductDetail.retreat}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-gradient-gold hover:bg-gradient-ember text-primary-foreground font-semibold shadow-glow hover:shadow-ember transition-all duration-300"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
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