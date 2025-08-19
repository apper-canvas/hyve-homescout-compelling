import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PropertyImageGallery from "@/components/molecules/PropertyImageGallery";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { propertyService } from "@/services/api/propertyService";
import { savedPropertyService } from "@/services/api/savedPropertyService";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setError("");
        
        const result = await propertyService.getById(id);
        setProperty(result);
        
        // Check if property is saved
        try {
          const saved = await savedPropertyService.getByPropertyId(id);
          setIsSaved(!!saved);
        } catch {
          // Property not saved, which is fine
        }
      } catch (err) {
        setError(err.message || "Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProperty();
    }
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      if (isSaved) {
        await savedPropertyService.deleteByPropertyId(id);
        setIsSaved(false);
        toast.success("Property removed from favorites");
      } else {
        await savedPropertyService.create({
          propertyId: id,
          notes: ""
        });
        setIsSaved(true);
        toast.success("Property saved to favorites");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update saved properties");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading type="detail" message="Loading property details..." />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error 
          message={error || "Property not found"}
          onRetry={() => window.location.reload()}
          type="notFound"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-900"
        >
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          Back to Browse
        </Button>
      </motion.div>

      {/* Image Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <PropertyImageGallery images={property.images} title={property.title} />
      </motion.div>

      {/* Property Details */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center space-x-2 text-secondary">
                  <ApperIcon name="MapPin" size={16} />
                  <span>{property.address.full}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant={isSaved ? "accent" : "outline"}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <ApperIcon 
                      name="Heart" 
                      size={16} 
                      className={`mr-2 ${isSaved ? "fill-current" : ""}`} 
                    />
                  )}
                  {isSaved ? "Saved" : "Save"}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-6 mb-6">
              <h2 className="text-4xl font-display font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {formatPrice(property.price)}
              </h2>
              <Badge variant="primary" className="text-sm px-3 py-1">
                {property.propertyType}
              </Badge>
            </div>

            {/* Key Stats */}
            <div className="flex items-center space-x-8 p-6 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-2xl">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Bed" size={20} className="text-primary" />
                <span className="font-semibold">{property.bedrooms}</span>
                <span className="text-secondary">bed{property.bedrooms !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Bath" size={20} className="text-primary" />
                <span className="font-semibold">{property.bathrooms}</span>
                <span className="text-secondary">bath{property.bathrooms !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Square" size={20} className="text-primary" />
                <span className="font-semibold">{formatSquareFeet(property.squareFeet)}</span>
                <span className="text-secondary">sqft</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Calendar" size={20} className="text-primary" />
                <span className="text-secondary">
                  Listed {new Date(property.listingDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
              About This Property
            </h3>
            <p className="text-secondary leading-relaxed text-lg">
              {property.description}
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
              Features & Amenities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="flex items-center space-x-3 p-3 bg-surface rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ApperIcon name="Check" size={14} className="text-primary" />
                  </div>
                  <span className="font-medium text-gray-800">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Contact Card */}
          <div className="bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-6 text-white">
            <h4 className="text-lg font-display font-semibold mb-4">
              Interested in this property?
            </h4>
            <div className="space-y-3">
              <Button
                className="w-full bg-surface/20 backdrop-blur-sm text-white border border-surface/30 hover:bg-surface/30"
                onClick={() => toast.info("Contact feature would be implemented here")}
              >
                <ApperIcon name="Phone" size={16} className="mr-2" />
                Call Agent
              </Button>
              <Button
                className="w-full bg-surface/20 backdrop-blur-sm text-white border border-surface/30 hover:bg-surface/30"
                onClick={() => toast.info("Schedule viewing feature would be implemented here")}
              >
                <ApperIcon name="Calendar" size={16} className="mr-2" />
                Schedule Tour
              </Button>
              <Button
                className="w-full bg-surface/20 backdrop-blur-sm text-white border border-surface/30 hover:bg-surface/30"
                onClick={() => toast.info("Message feature would be implemented here")}
              >
                <ApperIcon name="MessageSquare" size={16} className="mr-2" />
                Send Message
              </Button>
            </div>
          </div>

          {/* Property Summary */}
          <div className="bg-surface rounded-2xl p-6 shadow-card">
            <h4 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Property Summary
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-secondary">Property Type</span>
                <span className="font-medium text-gray-900">{property.propertyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Bedrooms</span>
                <span className="font-medium text-gray-900">{property.bedrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Bathrooms</span>
                <span className="font-medium text-gray-900">{property.bathrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Square Feet</span>
                <span className="font-medium text-gray-900">{formatSquareFeet(property.squareFeet)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Price per sqft</span>
                <span className="font-medium text-gray-900">
                  ${Math.round(property.price / property.squareFeet)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="text-secondary font-medium">Total Price</span>
                  <span className="font-bold text-xl text-primary">
                    {formatPrice(property.price)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="bg-surface rounded-2xl p-6 shadow-card">
            <h4 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Location
            </h4>
            <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mb-4">
              <div className="text-center">
                <ApperIcon name="MapPin" size={32} className="text-primary mx-auto mb-2" />
                <p className="text-secondary text-sm">Interactive map preview</p>
              </div>
            </div>
            <div className="text-sm text-secondary">
              <p className="font-medium text-gray-900">{property.address.street}</p>
              <p>{property.address.city}, {property.address.state} {property.address.zipCode}</p>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate(`/map?property=${property.Id}`)}
            >
              <ApperIcon name="Map" size={16} className="mr-2" />
              View on Map
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyDetail;