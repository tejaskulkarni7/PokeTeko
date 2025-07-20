import { ShoppingBag, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-gradient-tavern border-b border-border/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-gold rounded-lg shadow-glow animate-glow-pulse" />
            <h1 className="text-2xl font-bold text-primary-glow">
              PokeTavern
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search for cards..." 
                className="pl-10 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-primary/10">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-primary/10 relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-tavern-ember text-xs rounded-full flex items-center justify-center text-white animate-lantern-flicker">
                3
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;