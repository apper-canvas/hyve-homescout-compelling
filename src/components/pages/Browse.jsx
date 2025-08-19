import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { propertyService } from "@/services/api/propertyService";

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || ""
  });

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      
      const results = await propertyService.getAll(filters);
      
      // Apply sorting
      let sortedResults = [...results];
      switch (sortBy) {
        case "price-low":
          sortedResults.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          sortedResults.sort((a, b) => b.price - a.price);
          break;
        case "newest":
          sortedResults.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
          break;
        case "oldest":
          sortedResults.sort((a, b) => new Date(a.listingDate) - new Date(b.listingDate));
          break;
        case "sqft":
          sortedResults.sort((a, b) => b.squareFeet - a.squareFeet);
          break;
        default:
          break;
      }
      
      setProperties(sortedResults);
    } catch (err) {
      setError(err.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [filters, sortBy]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.location) {
      params.set("location", newFilters.location);
    }
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setFilters({
      location: ""
    });
    setSearchParams({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ""
  );

  if (loading && properties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading type="grid" message="Searching for properties..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error 
          message={error}
          onRetry={loadProperties}
          type="search"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Browse Properties
            </h1>
            <div className="flex items-center space-x-4 text-sm text-secondary">
              <span>
                {loading ? "Searching..." : `${properties.length} ${properties.length === 1 ? "property" : "properties"} found`}
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-accent hover:text-accent/80 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-w-[140px]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="sqft">Largest First</option>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-surface text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ApperIcon name="Grid3X3" size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-surface text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ApperIcon name="List" size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex gap-8">
        {/* Filters */}
        <div className="hidden lg:block">
          <FilterSidebar
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
          />
        </div>

        {/* Properties */}
        <div className="flex-1">
          {loading ? (
            <Loading type="grid" />
          ) : (
            <PropertyGrid
              properties={properties}
              loading={loading}
              viewMode={viewMode}
            />
          )}
        </div>
      </div>

      {/* Mobile Filters Button */}
      <div className="fixed bottom-6 right-6 lg:hidden z-30">
        <Button
          className="rounded-full shadow-2xl bg-gradient-to-r from-primary to-primary/90 text-white p-4"
          onClick={() => {
            // In a real app, this would open a mobile filter modal
            console.log("Open mobile filters");
          }}
        >
          <ApperIcon name="Filter" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Browse;