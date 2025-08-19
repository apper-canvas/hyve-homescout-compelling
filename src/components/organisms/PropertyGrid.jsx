import { motion } from "framer-motion";
import PropertyCard from "@/components/molecules/PropertyCard";
import Empty from "@/components/ui/Empty";

const PropertyGrid = ({ properties, loading = false, viewMode = "grid" }) => {
  if (!loading && properties.length === 0) {
    return (
      <Empty
        type="search"
        onAction={() => window.location.reload()}
        actionLabel="Refresh Search"
      />
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-6">
        {properties.map((property, index) => (
          <motion.div
            key={property.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="w-full"
          >
            <PropertyCard property={property} index={index} />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {properties.map((property, index) => (
        <PropertyCard
          key={property.Id}
          property={property}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default PropertyGrid;