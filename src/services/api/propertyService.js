import propertiesData from "@/services/mockData/properties.json";

let properties = [...propertiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const propertyService = {
  async getAll(filters = {}) {
    await delay(300);
    
    let filteredProperties = [...properties];
    
    // Filter by price range
    if (filters.priceMin) {
      filteredProperties = filteredProperties.filter(p => p.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      filteredProperties = filteredProperties.filter(p => p.price <= filters.priceMax);
    }
    
    // Filter by bedrooms
    if (filters.bedrooms && filters.bedrooms > 0) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms >= filters.bedrooms);
    }
    
    // Filter by bathrooms
    if (filters.bathrooms && filters.bathrooms > 0) {
      filteredProperties = filteredProperties.filter(p => p.bathrooms >= filters.bathrooms);
    }
    
    // Filter by property types
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filteredProperties = filteredProperties.filter(p => 
        filters.propertyTypes.includes(p.propertyType)
      );
    }
    
    // Filter by location (search in address fields)
    if (filters.location && filters.location.trim()) {
      const searchTerm = filters.location.toLowerCase();
      filteredProperties = filteredProperties.filter(p => 
        p.address.city.toLowerCase().includes(searchTerm) ||
        p.address.state.toLowerCase().includes(searchTerm) ||
        p.address.zipCode.includes(searchTerm) ||
        p.address.street.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort by listing date (newest first)
    filteredProperties.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
    
    return filteredProperties;
  },

  async getById(id) {
    await delay(200);
    const property = properties.find(p => p.Id === parseInt(id));
    if (!property) {
      throw new Error("Property not found");
    }
    return { ...property };
  },

  async searchByLocation(query) {
    await delay(300);
    
    if (!query || query.trim().length < 2) {
      return [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    // Get unique locations matching the search
    const matchingProperties = properties.filter(p => 
      p.address.city.toLowerCase().includes(searchTerm) ||
      p.address.state.toLowerCase().includes(searchTerm) ||
      p.address.zipCode.includes(searchTerm) ||
      p.address.street.toLowerCase().includes(searchTerm)
    );
    
    // Extract unique locations
    const locations = new Set();
    matchingProperties.forEach(p => {
      locations.add(`${p.address.city}, ${p.address.state}`);
      locations.add(p.address.zipCode);
    });
    
    return Array.from(locations).slice(0, 5);
  },

  async create(property) {
    await delay(400);
    const maxId = Math.max(...properties.map(p => p.Id));
    const newProperty = {
      ...property,
      Id: maxId + 1,
      listingDate: new Date().toISOString()
    };
    properties.push(newProperty);
    return { ...newProperty };
  },

  async update(id, updates) {
    await delay(400);
    const index = properties.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Property not found");
    }
    properties[index] = { ...properties[index], ...updates };
    return { ...properties[index] };
  },

  async delete(id) {
    await delay(300);
    const index = properties.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Property not found");
    }
    const deleted = properties.splice(index, 1)[0];
    return { ...deleted };
  }
};