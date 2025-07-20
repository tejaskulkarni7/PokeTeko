import ProductCard from "./ProductCard";

// Mock data for Pokemon cards
const mockProducts = [
  {
    id: "1",
    name: "Pikachu VMAX",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1542779283-429940ce8336?w=400&h=600&fit=crop",
    rarity: "Ultra Rare",
    condition: "Near Mint",
    set: "Vivid Voltage"
  },
  {
    id: "2", 
    name: "Charizard GX",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1613373965685-c4b2c3a505c6?w=400&h=600&fit=crop",
    rarity: "Secret Rare",
    condition: "Mint",
    set: "Hidden Fates"
  },
  {
    id: "3",
    name: "Blastoise EX",
    price: 45.50,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=600&fit=crop",
    rarity: "Rare",
    condition: "Lightly Played",
    set: "Evolutions"
  },
  {
    id: "4",
    name: "Venusaur V",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
    rarity: "Rare",
    condition: "Near Mint",
    set: "Champion's Path"
  },
  {
    id: "5",
    name: "Gengar VMAX",
    price: 35.99,
    image: "https://images.unsplash.com/photo-1564671165093-20688ff1c23e?w=400&h=600&fit=crop",
    rarity: "Ultra Rare",
    condition: "Mint",
    set: "Fusion Strike"
  },
  {
    id: "6",
    name: "Lucario GX",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1610847489995-1753c62a92c0?w=400&h=600&fit=crop",
    rarity: "Rare",
    condition: "Near Mint",
    set: "Ultra Prism"
  },
  {
    id: "7",
    name: "Rayquaza VMAX",
    price: 55.00,
    image: "https://images.unsplash.com/photo-1570776784627-bd2792c87dc3?w=400&h=600&fit=crop",
    rarity: "Secret Rare",
    condition: "Mint",
    set: "Evolving Skies"
  },
  {
    id: "8",
    name: "Alakazam EX",
    price: 18.50,
    image: "https://images.unsplash.com/photo-1594820648011-41a41c0b7c2e?w=400&h=600&fit=crop",
    rarity: "Uncommon",
    condition: "Lightly Played",
    set: "Fates Collide"
  }
];

const ProductGrid = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Featured Cards
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover rare and powerful Pokemon cards from our magical collection. 
          Each card tells a story waiting to be yours.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
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