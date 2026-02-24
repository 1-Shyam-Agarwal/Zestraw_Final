import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { Grid, List, ChevronRight, Leaf } from "lucide-react";
import { Product } from "@/data/products";
import riceField from "@/assets/rice-field.jpg";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/services/operations/productAPI";

const productTypes = ["All", "Plates", "Bowls", "Section Plates", "Cups", "Cutlery", "ComboPack"];
const sortOptions = ["Price: Low to High", "Price: High to Low"];

export default function ShopPage() {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedType, setSelectedType] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("Price: Low to High");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      if (data) {
        setProducts(data);
      }
    };
    fetchProducts();

    // Handle deep linking from categories
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      // Find matching type from productTypes
      const matched = productTypes.find(t => t.toLowerCase() === categoryParam.toLowerCase());
      if (matched) {
        setSelectedType(matched);
      }
    }
  }, [location.search]);

  const filteredAndSorted = useMemo(() => {
    let result = products.filter((p) => {
      const category = p.category || p.type || "";
      if (selectedType !== "All" && category.toLowerCase() !== selectedType.toLowerCase()) return false;
      const price = p.productPrice || p.price || 0;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      const isACutlery = (a.category || a.type || "").toLowerCase() === "cutlery";
      const isBCutlery = (b.category || b.type || "").toLowerCase() === "cutlery";

      // If one is cutlery and the other isn't, cutlery moves to the end
      if (isACutlery && !isBCutlery) return 1;
      if (!isACutlery && isBCutlery) return -1;

      // If both are same (both cutlery or both NOT cutlery), sort by price
      const priceA = a.productPrice || a.price || 0;
      const priceB = b.productPrice || b.price || 0;

      if (sortBy === "Price: Low to High") {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });

    return result;
  }, [products, selectedType, priceRange, sortBy]);

  return (
    <Layout>
      {/* Header */}
      <div className="container mx-auto px-6 pt-12 pb-6">
        <h1 className="text-3xl md:text-4xl font-normal font-lora mb-2 sm:border-l-4 sm:border-orange-500 sm:pl-4">Our Conscious Catalog</h1>
      </div>

      {/* Shop Content */}
      <section>
        <div className="container mx-auto px-6">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-end  gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 ml-4 text-muted-foreground">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-muted text-foreground" : "hover:bg-muted/50"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-muted text-foreground" : "hover:bg-muted/50"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-border rounded-lg px-3 py-1.5 bg-card focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {sortOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block w-56 shrink-0 space-y-6">
              {/* Product Type */}
              <div>
                <h3 className="text-sm font-semibold mb-3 font-lora flex items-center justify-between">
                  Product Type
                </h3>
                <div className="space-y-2">
                  {productTypes.filter(t => t !== "All").map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedType === type}
                        onChange={() => setSelectedType(selectedType === type ? "All" : type)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-semibold mb-3 font-lora flex items-center justify-between">
                  Price Range
                </h3>
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}+</span>
                </div>
              </div>

              {/* Compostable Promise */}
              <div className="bg-eco-light rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-4 h-4 text-eco" />
                  <span className="text-sm font-semibold">Compostable Promise</span>
                </div>
                <p className="text-xs text-muted-foreground">Every item in our shop is guaranteed 100% biodegradable and chemical-free.</p>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1 p-2">
              {filteredAndSorted.length > 0 ? (
                <div className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"} gap-6`}>
                  {filteredAndSorted.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                  <Leaf className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-xl font-normal font-lora mb-2">No eco-friendly matches found</h3>
                  <p className="text-muted-foreground text-[12px] max-w-xs mx-auto">
                    We couldn't find products matching your current filters. Try adjusting the price range or category.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedType("All");
                      setPriceRange([1, 150]);
                    }}
                    className="mt-6 text-sm font-semibold text-primary hover:underline transition-all"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Tracker Banner */}
      <section className="bg-secondary py-16 mt-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold mb-4">IMPACT TRACKER</span>
              <h2 className="text-3xl font-bold font-lora   mb-3">Making Every Meal Count</h2>
              <p className="text-muted-foreground mb-6">
                Switching from plastic to Zestraw saves an average of 1.2kg of CO2 per event. Track your cumulative impact in your dashboard after every purchase.
              </p>
              <Link to="/impact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                See Our Impact Metrics <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative rounded-2xl overflow-hidden">
              <img src={riceField} alt="Rice field impact" className="w-full h-80 md:h-[450px] object-cover rounded-2xl" />
              <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-xl">
                <span className="text-lg font-bold">1.2M+</span>
                <p className="text-[10px]">KGS OF RICE STRAW UPCYCLED</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
