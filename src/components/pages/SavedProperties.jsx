import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { savedPropertyService } from "@/services/api/savedPropertyService";
import { propertyService } from "@/services/api/propertyService";

const SavedProperties = () => {
  const navigate = useNavigate();
  const [savedProperties, setSavedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSavedProperties = async () => {
    try {
      setLoading(true);
      setError("");

      // Get saved property IDs
      const saved = await savedPropertyService.getAll();
      setSavedProperties(saved);

      // Get full property details
      const propertyPromises = saved.map(sp => 
        propertyService.getById(sp.propertyId)
      );
      
      const propertyDetails = await Promise.allSettled(propertyPromises);
      const validProperties = propertyDetails
        .filter(result => result.status === "fulfilled")
        .map(result => result.value);

      // Sort by save date (most recent first)
      const sortedBySaveDate = validProperties.map(property => {
        const savedInfo = saved.find(sp => sp.propertyId === property.Id.toString());
        return {
          ...property,
          savedDate: savedInfo?.savedDate,
          savedNotes: savedInfo?.notes
        };
      }).sort((a, b) => new Date(b.savedDate) - new Date(a.savedDate));

      setProperties(sortedBySaveDate);
    } catch (err) {
      setError(err.message || "Failed to load saved properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const handleRemoveProperty = async (propertyId) => {
    try {
      await savedPropertyService.deleteByPropertyId(propertyId.toString());
      
      // Update local state
      setSavedProperties(prev => prev.filter(sp => sp.propertyId !== propertyId.toString()));
      setProperties(prev => prev.filter(p => p.Id !== propertyId));
      
      toast.success("Property removed from favorites");
    } catch (error) {
      toast.error(error.message || "Failed to remove property");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to remove all saved properties?")) {
      return;
    }

    try {
      // Remove all saved properties
      const deletePromises = savedProperties.map(sp => 
        savedPropertyService.delete(sp.Id)
      );
      
      await Promise.all(deletePromises);
      
      setSavedProperties([]);
      setProperties([]);
      toast.success("All saved properties removed");
    } catch (error) {
      toast.error("Failed to clear all properties");
    }
  };

  const handleGoToBrowse = () => {
    navigate("/browse");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading type="grid" message="Loading your saved properties..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error 
          message={error}
          onRetry={loadSavedProperties}
          type="general"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Saved Properties
            </h1>
            <div className="flex items-center space-x-4 text-sm text-secondary">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Heart" size={16} className="text-accent" />
                <span>
                  {properties.length} {properties.length === 1 ? "property" : "properties"} saved
                </span>
              </div>
              {properties.length > 0 && (
                <span className="text-gray-300">•</span>
              )}
              {properties.length > 0 && (
                <span>
                  Last saved {new Date(Math.max(...properties.map(p => new Date(p.savedDate)))).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {properties.length > 0 && (
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={handleClearAll}
                className="text-error hover:text-error/80 hover:bg-error/5"
              >
                <ApperIcon name="Trash2" size={16} className="mr-2" />
                Clear All
              </Button>
              <Button
                variant="outline"
                onClick={handleGoToBrowse}
              >
                <ApperIcon name="Search" size={16} className="mr-2" />
                Find More
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Content */}
      {properties.length === 0 ? (
        <Empty
          type="saved"
          onAction={handleGoToBrowse}
          showAction={true}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/10"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ApperIcon name="Home" size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                  <p className="text-sm text-secondary">Properties Saved</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-6 border border-accent/10"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <ApperIcon name="DollarSign" size={24} className="text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(properties.reduce((sum, p) => sum + p.price, 0) / properties.length / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-secondary">Average Price</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-gradient-to-br from-success/5 to-success/10 rounded-2xl p-6 border border-success/10"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <ApperIcon name="TrendingUp" size={24} className="text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(properties.reduce((sum, p) => sum + p.squareFeet, 0) / properties.length / 100) * 100}
                  </p>
                  <p className="text-sm text-secondary">Avg. Square Feet</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Properties Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {properties.map((property, index) => (
              <motion.div
                key={property.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="relative group"
              >
                <PropertyCard property={property} index={index} />
                
                {/* Saved Date Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-accent/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                    Saved {new Date(property.savedDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Quick Remove Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 right-16 w-8 h-8 rounded-full bg-error/90 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveProperty(property.Id);
                  }}
                  title="Remove from saved"
                >
                  <ApperIcon name="X" size={12} />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SavedProperties;