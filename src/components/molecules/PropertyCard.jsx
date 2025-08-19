import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { savedPropertyService } from "@/services/api/savedPropertyService";

const PropertyCard = ({ property, index = 0 }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const saved = await savedPropertyService.getByPropertyId(property.Id.toString());
        setIsSaved(!!saved);
      } catch (error) {
        // Property not saved, which is fine
      }
    };
    
    checkSavedStatus();
  }, [property.Id]);

  const handleSave = async (e) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      if (isSaved) {
        await savedPropertyService.deleteByPropertyId(property.Id.toString());
        setIsSaved(false);
        toast.success("Property removed from favorites");
      } else {
        await savedPropertyService.create({
          propertyId: property.Id.toString(),
          notes: ""
        });
        setIsSaved(true);
        toast.success("Property saved to favorites");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update saved properties");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat("en-US").format(sqft);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-surface rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          whileHover={{ scale: 1.05 }}
        />
        
        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Property type badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="default" className="bg-surface/90 backdrop-blur-sm text-gray-800 font-medium">
            {property.propertyType}
          </Badge>
        </div>

        {/* Save button */}
        <motion.button
          onClick={handleSave}
          disabled={isLoading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-sm border transition-all duration-200 ${
            isSaved 
              ? "bg-accent/90 border-accent text-white" 
              : "bg-surface/90 border-gray-200 text-gray-600 hover:bg-accent/10 hover:border-accent hover:text-accent"
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            <ApperIcon 
              name={isSaved ? "Heart" : "Heart"} 
              size={16} 
              className={isSaved ? "fill-current" : ""} 
            />
          )}
        </motion.button>
      </div>

      <div className="p-6">
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-display font-bold text-gray-900 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            {formatPrice(property.price)}
          </h3>
          <div className="flex items-center space-x-1 text-sm text-secondary">
            <ApperIcon name="Calendar" size={14} />
            <span>{new Date(property.listingDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {property.title}
        </h4>

        {/* Address */}
        <div className="flex items-start space-x-2 mb-4">
          <ApperIcon name="MapPin" size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-secondary line-clamp-2">{property.address.full}</p>
        </div>

        {/* Property details */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-secondary">
              <ApperIcon name="Bed" size={16} className="text-primary" />
              <span className="font-medium">{property.bedrooms}</span>
              <span>bed{property.bedrooms !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-secondary">
              <ApperIcon name="Bath" size={16} className="text-primary" />
              <span className="font-medium">{property.bathrooms}</span>
              <span>bath{property.bathrooms !== 1 ? "s" : ""}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-secondary">
            <ApperIcon name="Square" size={16} className="text-primary" />
            <span className="font-medium">{formatSquareFeet(property.squareFeet)}</span>
            <span>sqft</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;