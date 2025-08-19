import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const MapComponent = ({ properties = [], selectedProperty, onPropertySelect }) => {
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 }); // Center of US
  const [zoom, setZoom] = useState(4);
  const [hoveredProperty, setHoveredProperty] = useState(null);

  // Update map center based on properties
  useEffect(() => {
    if (properties.length > 0) {
      const bounds = {
        north: Math.max(...properties.map(p => p.coordinates.lat)),
        south: Math.min(...properties.map(p => p.coordinates.lat)),
        east: Math.max(...properties.map(p => p.coordinates.lng)),
        west: Math.min(...properties.map(p => p.coordinates.lng))
      };
      
      const centerLat = (bounds.north + bounds.south) / 2;
      const centerLng = (bounds.east + bounds.west) / 2;
      
      setMapCenter({ lat: centerLat, lng: centerLng });
      setZoom(6);
    }
  }, [properties]);

  const handlePropertyClick = (property) => {
    onPropertySelect?.(property);
    navigate(`/property/${property.Id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Mock map implementation - in a real app, this would use Google Maps, Mapbox, etc.
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden">
      {/* Map Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setZoom(zoom + 1)}
          className="bg-surface/90 backdrop-blur-sm shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" size={16} />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setZoom(Math.max(1, zoom - 1))}
          className="bg-surface/90 backdrop-blur-sm shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Minus" size={16} />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => {
            setMapCenter({ lat: 39.8283, lng: -98.5795 });
            setZoom(4);
          }}
          className="bg-surface/90 backdrop-blur-sm shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="RotateCcw" size={16} />
        </Button>
      </div>

      {/* Property Markers */}
      <div className="absolute inset-0 z-10">
        {properties.map((property, index) => {
          // Calculate position based on coordinates (mock positioning)
          const x = ((property.coordinates.lng + 130) / 60) * 100;
          const y = ((90 - property.coordinates.lat) / 180) * 100;
          
          const isSelected = selectedProperty?.Id === property.Id;
          const isHovered = hoveredProperty?.Id === property.Id;
          
          return (
            <motion.div
              key={property.Id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{
                left: `${Math.max(5, Math.min(95, x))}%`,
                top: `${Math.max(5, Math.min(95, y))}%`
              }}
              onClick={() => handlePropertyClick(property)}
              onMouseEnter={() => setHoveredProperty(property)}
              onMouseLeave={() => setHoveredProperty(null)}
            >
              {/* Price Marker */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-3 py-2 rounded-full text-sm font-bold shadow-lg transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-r from-accent to-accent/90 text-white ring-4 ring-accent/30"
                    : isHovered
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-xl scale-110"
                    : "bg-surface/95 backdrop-blur-sm text-primary border border-primary/20 hover:bg-primary hover:text-white"
                }`}
              >
                {formatPrice(property.price)}
                
                {/* Marker Pin */}
                <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent ${
                  isSelected
                    ? "border-t-accent"
                    : isHovered
                    ? "border-t-primary"
                    : "border-t-surface/95"
                }`} />
              </motion.div>

              {/* Property Info Popup */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 w-64 bg-surface/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-100 p-4 z-20"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {property.title}
                      </h4>
                      <p className="text-sm text-secondary truncate">
                        {property.address.city}, {property.address.state}
                      </p>
                      <div className="flex items-center space-x-3 mt-2 text-xs text-secondary">
                        <span>{property.bedrooms} beds</span>
                        <span>{property.bathrooms} baths</span>
                        <span>{property.squareFeet.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow pointing down */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-surface/95" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Map Info */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-surface/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <ApperIcon name="MapPin" size={16} className="text-primary" />
            <span className="font-medium">
              {properties.length} {properties.length === 1 ? "Property" : "Properties"} Found
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-1 text-xs text-secondary">
            <ApperIcon name="Zoom" size={14} />
            <span>Zoom: {zoom}x</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-surface/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Legend</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-primary/90" />
              <span className="text-secondary">Available Property</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-accent to-accent/90" />
              <span className="text-secondary">Selected Property</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;