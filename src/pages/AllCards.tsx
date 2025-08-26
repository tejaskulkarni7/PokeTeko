import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import supabase from "../../supabaseClient";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp, ArrowLeft } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useLoading } from "@/components/LoadingContext";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const AllCards = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [conditionFilter, setConditionFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]); // [min, max]
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();
    
    
  useEffect(() => {
    
    const fetchProducts = async () => { 
      setIsLoading(true); 
      const { data, error } = await supabase.from("pokemon").select("*");
      if (!error && data) {
        const productsWithImageUrl = data.map((product) => ({
          ...product,
          image: `${SUPABASE_URL}/storage/v1/object/public/images/${product.image}.jpg`,
        }));
        setProducts(productsWithImageUrl);
        setFiltered(productsWithImageUrl);
      }
      setIsLoading(false);
    };
    fetchProducts();
    
  }, []);

  // Filter + Sort
  useEffect(() => {
    let result = [...products];

    // Filter by condition
    if (conditionFilter) {
      result = result.filter((p) => p.condition === conditionFilter);
    }

    // Filter by price range
    const [min, max] = priceRange;
    result = result.filter((p) => p.price >= min && p.price <= max);

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = sortKey === "created_at" ? new Date(a[sortKey]) : a[sortKey];
        const bVal = sortKey === "created_at" ? new Date(b[sortKey]) : b[sortKey];
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      });
    }

    setFiltered(result);
  }, [conditionFilter, priceRange, sortKey, sortOrder, products]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-tavern">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="text-foreground hover:text-primary hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h2 className="text-3xl font-bold text-foreground">All Cards</h2>
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">

          {/* Condition Filter */}
          <div className="relative">
            <select
              className="border-none p-2 rounded text-white bg-black focus:ring-2 focus:ring-primary transition-colors shadow hover:bg-primary/10 hover:text-primary"
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              style={{ minWidth: 120 }}
            >
              <option value="" className="bg-black text-white">All Grades</option>
              <option value="PSA 10" className="bg-black text-white">PSA 10</option>
              <option value="PSA 9" className="bg-black text-white">PSA 9</option>
              <option value="PSA 8" className="bg-black text-white">PSA 8</option>
              <option value="PSA 7" className="bg-black text-white">PSA 7</option>
            </select>
          </div>

              {/* Price Range Slider */}
              <div className="flex flex-col gap-1 items-start w-64">
                <label className="text-sm text-foreground">Price Range</label>
                <div className="w-full px-2">
                  <Slider
                    range
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onChange={(vals) => setPriceRange(Array.isArray(vals) ? vals : [vals, vals])}
                    trackStyle={[{ background: "linear-gradient(90deg, #9d54f1ff 0%, #4c00ffff 100%)", height: 8 }]}
                    handleStyle={[
                      { borderColor: "#9d54f1ff", backgroundColor: "#9d54f1ff", width: 20, height: 20 },
                      { borderColor: "#4c00ffff", backgroundColor: "#4c00ffff", width: 20, height: 20 },
                    ]}
                    railStyle={{ background: "#222", height: 8 }}
                  />
                  <div className="flex justify-between text-xs text-foreground mt-1">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

          {/* Sort by Price */}
          <Button
            variant="ghost"
            onClick={() => {
              setSortKey("price");
              setSortOrder((prev) => (sortKey === "price" && prev === "desc" ? "asc" : "desc"));
            }}
            className="text-foreground hover:text-primary hover:bg-primary/10 flex items-center"
          >
            Price
            {sortKey === "price" &&
              (sortOrder === "asc" ? (
                <ArrowUp className="ml-1 w-4 h-4" />
              ) : (
                <ArrowDown className="ml-1 w-4 h-4" />
              ))}
          </Button>
        </div>


        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AllCards;
