import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import MapComponent from "@/components/organisms/MapComponent";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { propertyService } from "@/services/api/propertyService";

const MapView = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({});

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
        default:
          break;
      }
      
      setProperties(sortedResults);
      
      // Auto-select property from URL params
      const propertyId = searchParams.get("property");
      if (propertyId) {
        const property = sortedResults.find(p => p.Id === parseInt(propertyId));
        if (property) {
          setSelectedProperty(property);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [filters, sortBy, searchParams]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
  };

  if (loading && properties.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loading message="Loading map..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Error 
          message={error}
          onRetry={loadProperties}
          type="network"
        />
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      {/* Map Controls Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute top-0 left-0 right-0 z-30 bg-surface/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-display font-bold text-gray-900">
                Map View
              </h1>
              <span className="text-sm text-secondary">
                {properties.length} {properties.length === 1 ? "property" : "properties"}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Sort:</label>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="min-w-[140px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </Select>
              </div>

              {/* Filter Toggle */}
              <Button
                variant={showFilters ? "primary" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                size="sm"
              >
                <ApperIcon name="Filter" size={16} className="mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="flex h-full pt-16">
        {/* Filters Sidebar */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, x: -280 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -280 }}
            transition={{ duration: 0.3 }}
            className="w-80 border-r border-gray-200 bg-background p-4 overflow-y-auto"
          >
            <FilterSidebar
              onFiltersChange={handleFiltersChange}
              initialFilters={filters}
            />
          </motion.div>
        )}

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapComponent
            properties={properties}
            selectedProperty={selectedProperty}
            onPropertySelect={handlePropertySelect}
          />

          {/* Selected Property Info */}
          {selectedProperty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-6 left-6 right-6 bg-surface/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-6 max-w-md"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <img
                    src={selectedProperty.images[0]}
                    alt={selectedProperty.title}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-gray-900 truncate">
                      {selectedProperty.title}
                    </h3>
                    <p className="text-sm text-secondary truncate">
                      {selectedProperty.address.full}
                    </p>
                    <p className="text-lg font-bold text-primary mt-1">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(selectedProperty.price)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
                >
                  <ApperIcon name="X" size={16} className="text-gray-600" />
                </button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-secondary">
                  <span>{selectedProperty.bedrooms} beds</span>
                  <span>{selectedProperty.bathrooms} baths</span>
                  <span>{selectedProperty.squareFeet.toLocaleString()} sqft</span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-primary to-primary/90 text-white"
                onClick={() => window.open(`/property/${selectedProperty.Id}`, "_blank")}
              >
                <ApperIcon name="Eye" size={16} className="mr-2" />
                View Details
              </Button>
            </motion.div>
          )}

          {/* Map Legend */}
          <div className="absolute top-6 right-6 bg-surface/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100 p-4 max-w-xs">
            <h4 className="font-semibold text-gray-900 mb-3">Map Guide</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
                <span className="text-secondary">Property markers show price</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-gradient-to-r from-accent to-accent/80 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
                <span className="text-secondary">Selected property</span>
              </div>
              <p className="text-xs text-secondary mt-3">
                Click on markers to view property details
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;