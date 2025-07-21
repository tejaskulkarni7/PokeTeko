import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import supabase from "../../supabaseClient";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const AllCards = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [conditionFilter, setConditionFilter] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("pokemon").select("*");
      if (!error && data) {
        const productsWithImageUrl = data.map((product) => ({
          ...product,
          image: `${SUPABASE_URL}/storage/v1/object/public/images/${product.image}.jpg`,
        }));
        setProducts(productsWithImageUrl);
        setFiltered(productsWithImageUrl);
      }
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
    const min = parseFloat(priceRange.min);
    const max = parseFloat(priceRange.max);
    if (!isNaN(min)) result = result.filter((p) => p.price >= min);
    if (!isNaN(max)) result = result.filter((p) => p.price <= max);

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
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Conditions</option>
            <option value="PSA 10">PSA 10</option>
            <option value="PSA 9">PSA 9</option>
          </select>

          {/* Price Filter */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="border p-2 rounded w-24"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="border p-2 rounded w-24"
            />
          </div>

          {/* Sort */}
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Sort by</option>
            <option value="price">Price</option>
            <option value="created_at">Created At</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="asc">↑ Ascending</option>
            <option value="desc">↓ Descending</option>
          </select>
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
