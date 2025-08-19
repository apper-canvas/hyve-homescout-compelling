import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { propertyService } from "@/services/api/propertyService";

const SearchBar = ({ onSearch, placeholder = "Search by city, state, or zip code..." }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const searchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await propertyService.searchByLocation(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search suggestions error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (searchQuery = query) => {
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon name="Search" size={20} className="text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-10 pr-12 h-12 text-base bg-surface border-gray-200 focus:border-primary focus:ring-primary/20"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          {isLoading ? (
            <div className="pr-3">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <button
              onClick={() => handleSearch()}
              className="mr-2 p-2 text-gray-400 hover:text-primary transition-colors duration-200 rounded-lg hover:bg-gray-50"
            >
              <ApperIcon name="ArrowRight" size={16} />
            </button>
          )}
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-surface border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl flex items-center space-x-3"
            >
              <ApperIcon name="MapPin" size={16} className="text-gray-400" />
              <span className="text-gray-700">{suggestion}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;