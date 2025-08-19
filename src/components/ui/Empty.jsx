import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  type = "properties",
  title,
  description,
  actionLabel,
  onAction,
  showAction = true
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "search":
        return {
          icon: "Search",
          title: title || "No properties found",
          description: description || "Try adjusting your search criteria or filters to find more properties.",
          actionLabel: actionLabel || "Clear Filters",
          gradient: "from-info/10 to-info/20",
          iconColor: "text-info"
        };
      case "saved":
        return {
          icon: "Heart",
          title: title || "No saved properties yet",
          description: description || "Start exploring properties and save your favorites to view them here later.",
          actionLabel: actionLabel || "Browse Properties",
          gradient: "from-accent/10 to-accent/20",
          iconColor: "text-accent"
        };
      case "map":
        return {
          icon: "MapPin",
          title: title || "No properties in this area",
          description: description || "Try zooming out or searching in a different location to find more properties.",
          actionLabel: actionLabel || "Expand Search",
          gradient: "from-success/10 to-success/20",
          iconColor: "text-success"
        };
      default:
        return {
          icon: "Home",
          title: title || "No properties available",
          description: description || "We don't have any properties matching your criteria right now. Check back later or try a different search.",
          actionLabel: actionLabel || "Browse All",
          gradient: "from-primary/10 to-primary/20",
          iconColor: "text-primary"
        };
    }
  };

  const emptyContent = getEmptyContent();

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${emptyContent.gradient} flex items-center justify-center backdrop-blur-sm`}>
          <ApperIcon name={emptyContent.icon} size={40} className={emptyContent.iconColor} />
        </div>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed border-gray-200"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <motion.h3
        className="text-2xl font-display font-semibold text-gray-900 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {emptyContent.title}
      </motion.h3>

      <motion.p
        className="text-secondary max-w-lg mb-8 leading-relaxed text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {emptyContent.description}
      </motion.p>

      {showAction && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Button
            onClick={onAction}
            className={`bg-gradient-to-r ${emptyContent.iconColor.replace('text-', 'from-')} to-${emptyContent.iconColor.replace('text-', '')}/80 hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-white px-8 py-3 rounded-xl font-medium`}
          >
            <ApperIcon name="ArrowRight" size={16} className="mr-2" />
            {emptyContent.actionLabel}
          </Button>
        </motion.div>
      )}

      <motion.div
        className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {[
          { icon: "Search", text: "Advanced Search" },
          { icon: "Map", text: "Map View" },
          { icon: "Bell", text: "Set Alerts" }
        ].map((item, index) => (
          <motion.div
            key={item.text}
            className="flex flex-col items-center p-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            whileHover={{ y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-2">
              <ApperIcon name={item.icon} size={20} className="text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">{item.text}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Empty;