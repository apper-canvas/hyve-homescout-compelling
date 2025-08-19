import { motion } from "framer-motion";

const LoadingSkeleton = ({ type = "property" }) => {
  if (type === "property") {
    return (
      <motion.div 
        className="bg-surface rounded-2xl overflow-hidden shadow-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-64 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse w-32" />
            <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse w-8" />
          </div>
          <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse w-3/4" />
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse w-16" />
              <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse w-16" />
            </div>
            <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse w-20" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === "detail") {
    return (
      <motion.div 
        className="max-w-6xl mx-auto space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-96 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-3xl animate-pulse" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="h-10 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse w-3/4" />
              <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse w-1/2" />
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse w-full" />
                <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse w-4/5" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-32 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-xl animate-pulse" />
            <div className="h-48 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {[...Array(6)].map((_, i) => (
        <LoadingSkeleton key={i} type="property" />
      ))}
    </div>
  );
};

const Loading = ({ type, message = "Loading properties..." }) => {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-secondary font-medium">{message}</span>
        </motion.div>
      </div>
      
      {type === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} type="property" />
          ))}
        </div>
      ) : (
        <LoadingSkeleton type={type} />
      )}
    </div>
  );
};

export default Loading;