import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  showRetry = true,
  type = "general"
}) => {
  const getErrorContent = () => {
    switch (type) {
      case "network":
        return {
          icon: "WifiOff",
          title: "Connection Error",
          description: "Unable to connect to our servers. Please check your internet connection and try again."
        };
      case "notFound":
        return {
          icon: "Home",
          title: "Property Not Found",
          description: "The property you're looking for doesn't exist or has been removed."
        };
      case "search":
        return {
          icon: "SearchX",
          title: "Search Error",
          description: "Unable to complete your search request. Please try again with different criteria."
        };
      default:
        return {
          icon: "AlertCircle",
          title: "Oops! Something went wrong",
          description: message || "We encountered an unexpected error. Please try again."
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="relative mb-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-error/10 to-error/20 flex items-center justify-center">
          <ApperIcon name={errorContent.icon} size={32} className="text-error" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-error to-error/80 flex items-center justify-center">
          <ApperIcon name="X" size={12} className="text-white" />
        </div>
      </motion.div>

      <motion.h3
        className="text-2xl font-display font-semibold text-gray-900 mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {errorContent.title}
      </motion.h3>

      <motion.p
        className="text-secondary max-w-md mb-8 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {errorContent.description}
      </motion.p>

      {showRetry && onRetry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        </motion.div>
      )}

      <motion.div
        className="mt-8 text-sm text-secondary/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <p>If the problem persists, please contact our support team.</p>
      </motion.div>
    </motion.div>
  );
};

export default Error;