import { useState, useRef, useEffect } from "react";
import { ShoppingCart, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { useAuth } from "@/components/AuthProvider"; // <-- Add this import

const Header = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // <-- Add this state
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user, logout } = useAuth(); // <-- Get user and logout

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) {
        setCartCount(0);
        return;
      }

      const { data, error } = await supabase
        .from("cart")
        .select("id", { count: "exact" })
        .eq("user_id", user.id);

      if (!error && data) {
        setCartCount(data.length);
      } else {
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [user]);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (user) setShowProfileDropdown(true);
  };

  const handleMouseLeave = () => {
    // Delay hiding to allow smoother movement
    hoverTimeout.current = setTimeout(() => {
      setShowProfileDropdown(false);
    }, 150); // You can tweak the delay (ms)
  };

  const handleProfileClick = () => {
    if (user) {
      setShowProfileDropdown((prev) => !prev);
    } else {
      navigate(`/auth`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowProfileDropdown(false);
    navigate("/auth");
  };
  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleDeleteAccount = async () => {
    // Supabase delete user API (admin only, so this is a placeholder)
    // You may need to call a backend function to delete the user
    alert("Account deletion is not implemented. Please contact support.");
    setShowProfileDropdown(false);
  };

  // Autocomplete handler
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearch(value);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (value.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    // Debounce search
    timeoutRef.current = setTimeout(async () => {
      const { data, error } = await supabase
        .from("pokemon")
        .select("id, name, image")
        .ilike("name", `%${value}%`)
        .limit(5);
      if (!error && data) {
        setResults(data);
        setShowDropdown(true);
      }
    }, 200);
  };

  const handleResultClick = (id) => {
    setSearch("");
    setShowDropdown(false);
    navigate(`/product/${id}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-tavern border-b border-border/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-1">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, #ffd9007e 0%, transparent 90%)",
                  filter: "blur(9px)",
                  zIndex: 0,
                }}
              />
              <img
                src="\src\assets\lantern_logo.png"
                alt="PokeTavern Logo"
                className="w-10 h-10 bg-transparent relative z-10"
              />
            </div>
            <h1 className="text-2xl font-bold text-primary-glow px-0 py-0">
              PokeTavern
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search for cards..." 
                className="pl-10 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-primary/30"
                value={search}
                onChange={handleSearchChange}
                onFocus={() => { if (results.length) setShowDropdown(true); }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                autoComplete="off"
              />
            </div>
            {/* Autocomplete Dropdown */}
            {showDropdown && results.length > 0 && (
              <ul className="absolute left-0 right-0 mt-2 bg-card border border-border rounded shadow-lg z-50 max-h-64 overflow-auto">
                {results.map((pokemon) => (
                  <li
                    key={pokemon.id}
                    className="flex items-center px-4 py-2 cursor-pointer hover:bg-primary/10"
                    onMouseDown={() => handleResultClick(pokemon.id)}
                  >
                    <img
                      src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${pokemon.image}.jpg`}
                      alt={pokemon.name}
                      className="w-8 h-8 rounded mr-3 object-cover"
                    />
                    <span className="text-foreground">{pokemon.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4 relative">
            <div
  className="relative"
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
  <Button
    variant="ghost"
    size="icon"
    className="text-foreground hover:text-primary hover:bg-primary/10"
    onClick={handleProfileClick}
  >
    <User className="w-5 h-5" />
  </Button>

  {user && showProfileDropdown && (
    <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded shadow-lg z-50 flex flex-col">
      <div className="px-4 py-3 border-b border-border text-sm text-muted-foreground">
        Signed in as<br />
        <span className="font-semibold text-foreground">{user.email}</span>
            </div>
            <Button
              variant="ghost"
              className="justify-start px-4 py-2 w-full text-left"
              onClick={handleLogout}
            >
              Log Out
            </Button>
            <Button
              variant="destructive"
              className="justify-start px-4 py-2 w-full text-left"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
        )}
      </div>
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-primary/10 relative" onClick={handleCartClick}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-tavern-ember text-xs rounded-full flex items-center justify-center text-white animate-lantern-flicker">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;