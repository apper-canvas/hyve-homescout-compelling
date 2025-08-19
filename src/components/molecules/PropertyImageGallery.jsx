import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const PropertyImageGallery = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        {/* Main image */}
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-surface hover:scale-110 transition-all duration-200 shadow-lg"
              >
                <ApperIcon name="ChevronLeft" size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-surface hover:scale-110 transition-all duration-200 shadow-lg"
              >
                <ApperIcon name="ChevronRight" size={20} />
              </button>
            </>
          )}
          
          {/* Full screen button */}
          <button
            onClick={() => setShowFullScreen(true)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-surface/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-surface hover:scale-110 transition-all duration-200 shadow-lg"
          >
            <ApperIcon name="Maximize" size={20} />
          </button>
          
          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-sm text-sm font-medium text-gray-800">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? "border-primary scale-110"
                    : "border-surface/50 hover:border-primary/50 hover:scale-105"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full screen modal */}
      <AnimatePresence>
        {showFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowFullScreen(false)}
          >
            <div className="relative max-w-7xl max-h-full p-4">
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                src={images[currentIndex]}
                alt={`${title} - Image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Close button */}
              <button
                onClick={() => setShowFullScreen(false)}
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-surface/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-surface/20 transition-all duration-200"
              >
                <ApperIcon name="X" size={24} />
              </button>
              
              {/* Navigation in full screen */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-surface/20 transition-all duration-200"
                  >
                    <ApperIcon name="ChevronLeft" size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-surface/20 transition-all duration-200"
                  >
                    <ApperIcon name="ChevronRight" size={24} />
                  </button>
                </>
              )}
              
              {/* Image counter in full screen */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-surface/10 backdrop-blur-sm text-white font-medium">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyImageGallery;