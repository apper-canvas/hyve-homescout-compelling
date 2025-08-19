import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";

const FilterSidebar = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    priceMin: initialFilters.priceMin || "",
    priceMax: initialFilters.priceMax || "",
    bedrooms: initialFilters.bedrooms || "",
    bathrooms: initialFilters.bathrooms || "",
    propertyTypes: initialFilters.propertyTypes || [],
    location: initialFilters.location || "",
    ...initialFilters
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePropertyTypeToggle = (type) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceMin: "",
      priceMax: "",
      bedrooms: "",
      bathrooms: "",
      propertyTypes: [],
      location: ""
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ""
  );

  const propertyTypes = ["House", "Condo", "Townhouse", "Apartment"];
  const bedroomOptions = [1, 2, 3, 4, 5];
  const bathroomOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-surface rounded-2xl shadow-card h-fit sticky top-24 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-80"
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h3 className="text-lg font-display font-semibold text-gray-900">
              Filter Properties
            </h3>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ApperIcon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={16} 
              className="text-gray-600" 
            />
          </button>
        </div>
        
        {!isCollapsed && hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-accent hover:text-accent/80 hover:bg-accent/10"
            >
              <ApperIcon name="X" size={14} className="mr-1" />
              Clear All
            </Button>
          </motion.div>
        )}
      </div>

      {!isCollapsed && (
        <div className="p-6 space-y-8">
          {/* Price Range */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="DollarSign" size={16} className="mr-2 text-primary" />
              Price Range
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Min Price
                </label>
                <Input
                  type="number"
                  placeholder="$0"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Max Price
                </label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Home" size={16} className="mr-2 text-primary" />
              Property Type
            </h4>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handlePropertyTypeToggle(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filters.propertyTypes.includes(type)
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Bed" size={16} className="mr-2 text-primary" />
              Bedrooms
            </h4>
            <Select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
              className="text-sm"
            >
              <option value="">Any bedrooms</option>
              {bedroomOptions.map(num => (
                <option key={num} value={num}>
                  {num}+ bedroom{num !== 1 ? "s" : ""}
                </option>
              ))}
            </Select>
          </div>

          {/* Bathrooms */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Bath" size={16} className="mr-2 text-primary" />
              Bathrooms
            </h4>
            <Select
              value={filters.bathrooms}
              onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
              className="text-sm"
            >
              <option value="">Any bathrooms</option>
              {bathroomOptions.map(num => (
                <option key={num} value={num}>
                  {num}+ bathroom{num !== 1 ? "s" : ""}
                </option>
              ))}
            </Select>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="MapPin" size={16} className="mr-2 text-primary" />
              Location
            </h4>
            <Input
              type="text"
              placeholder="City, state, or zip code"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Active Filters
              </h4>
              <div className="flex flex-wrap gap-2">
                {filters.priceMin && (
                  <Badge variant="primary" className="text-xs">
                    Min: ${parseInt(filters.priceMin).toLocaleString()}
                  </Badge>
                )}
                {filters.priceMax && (
                  <Badge variant="primary" className="text-xs">
                    Max: ${parseInt(filters.priceMax).toLocaleString()}
                  </Badge>
                )}
                {filters.bedrooms && (
                  <Badge variant="primary" className="text-xs">
                    {filters.bedrooms}+ beds
                  </Badge>
                )}
                {filters.bathrooms && (
                  <Badge variant="primary" className="text-xs">
                    {filters.bathrooms}+ baths
                  </Badge>
                )}
                {filters.propertyTypes.map(type => (
                  <Badge key={type} variant="primary" className="text-xs">
                    {type}
                  </Badge>
                ))}
                {filters.location && (
                  <Badge variant="primary" className="text-xs">
                    {filters.location}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default FilterSidebar;