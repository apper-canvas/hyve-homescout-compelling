// Property service for handling property data operations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const propertyService = {
  async getAll(filters = {}) {
    try {
      const apperClient = getApperClient();
      const tableName = 'property_c';
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "address_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "full_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "street_c" } },
          { field: { Name: "zip_code_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "coordinates_c" } },
          { field: { Name: "lat_c" } },
          { field: { Name: "lng_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "listing_date_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "property_type_c" } },
          { field: { Name: "square_feet_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "features_c" } }
        ],
        where: [],
        orderBy: [
          {
            fieldName: "listing_date_c",
            sorttype: "DESC"
          }
        ]
      };

      // Apply filters
      if (filters.priceMin) {
        params.where.push({
          FieldName: "price_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [parseFloat(filters.priceMin)]
        });
      }
      if (filters.priceMax) {
        params.where.push({
          FieldName: "price_c",
          Operator: "LessThanOrEqualTo",
          Values: [parseFloat(filters.priceMax)]
        });
      }
      if (filters.bedrooms) {
        params.where.push({
          FieldName: "bedrooms_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [parseInt(filters.bedrooms)]
        });
      }
      if (filters.bathrooms) {
        params.where.push({
          FieldName: "bathrooms_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [parseFloat(filters.bathrooms)]
        });
      }
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        params.where.push({
          FieldName: "property_type_c",
          Operator: "ExactMatch",
          Values: filters.propertyTypes
        });
      }
      if (filters.location && filters.location.trim()) {
        params.whereGroups = [{
          operator: "OR",
          subGroups: [
            {
              conditions: [{
                fieldName: "city_c",
                operator: "Contains",
                values: [filters.location.trim()]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "state_c",
                operator: "Contains",
                values: [filters.location.trim()]
              }],
              operator: "OR"
            },
            {
              conditions: [{
                fieldName: "zip_code_c",
                operator: "Contains",
                values: [filters.location.trim()]
              }],
              operator: "OR"
            }
          ]
        }];
      }

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database response to match UI expectations
      const properties = response.data.map(item => ({
        Id: item.Id,
        title: item.title_c || item.Name,
        price: parseFloat(item.price_c) || 0,
        bedrooms: parseInt(item.bedrooms_c) || 0,
        bathrooms: parseFloat(item.bathrooms_c) || 0,
        squareFeet: parseInt(item.square_feet_c) || 0,
        propertyType: item.property_type_c || '',
        description: item.description_c || '',
        listingDate: item.listing_date_c || new Date().toISOString(),
        images: item.images_c ? item.images_c.split(',').map(img => img.trim()) : ['/placeholder-property.jpg'],
        features: item.features_c ? item.features_c.split(',').map(f => f.trim()) : [],
        address: {
          street: item.street_c || '',
          city: item.city_c || '',
          state: item.state_c || '',
          zipCode: item.zip_code_c || '',
          full: item.full_c || `${item.street_c || ''}, ${item.city_c || ''}, ${item.state_c || ''} ${item.zip_code_c || ''}`
        },
        coordinates: {
          lat: parseFloat(item.lat_c) || 0,
          lng: parseFloat(item.lng_c) || 0
        }
      }));

      return properties;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching properties:", error.response.data.message);
      } else {
        console.error("Error fetching properties:", error.message);
      }
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const tableName = 'property_c';
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "address_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "full_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "street_c" } },
          { field: { Name: "zip_code_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "coordinates_c" } },
          { field: { Name: "lat_c" } },
          { field: { Name: "lng_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "listing_date_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "property_type_c" } },
          { field: { Name: "square_feet_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "features_c" } }
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Property not found");
      }

      // Transform database response to match UI expectations
      const item = response.data;
      const property = {
        Id: item.Id,
        title: item.title_c || item.Name,
        price: parseFloat(item.price_c) || 0,
        bedrooms: parseInt(item.bedrooms_c) || 0,
        bathrooms: parseFloat(item.bathrooms_c) || 0,
        squareFeet: parseInt(item.square_feet_c) || 0,
        propertyType: item.property_type_c || '',
        description: item.description_c || '',
        listingDate: item.listing_date_c || new Date().toISOString(),
        images: item.images_c ? item.images_c.split(',').map(img => img.trim()) : ['/placeholder-property.jpg'],
        features: item.features_c ? item.features_c.split(',').map(f => f.trim()) : [],
        address: {
          street: item.street_c || '',
          city: item.city_c || '',
          state: item.state_c || '',
          zipCode: item.zip_code_c || '',
          full: item.full_c || `${item.street_c || ''}, ${item.city_c || ''}, ${item.state_c || ''} ${item.zip_code_c || ''}`
        },
        coordinates: {
          lat: parseFloat(item.lat_c) || 0,
          lng: parseFloat(item.lng_c) || 0
        }
      };

      return property;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching property with ID ${id}:`, error.response.data.message);
      } else {
        console.error("Error fetching property:", error.message);
      }
      throw error;
    }
  },

  async searchByLocation(query) {
    await delay(300);
    
    if (!query || query.trim().length < 2) {
      return [];
    }
    
    try {
      const properties = await this.getAll({ location: query });
      
      // Extract unique locations
      const locations = new Set();
      properties.forEach(p => {
        locations.add(`${p.address.city}, ${p.address.state}`);
        locations.add(p.address.zipCode);
      });
      
      return Array.from(locations).slice(0, 5);
    } catch (error) {
console.error("Search suggestions error:", error);
      return [];
    }
  }
};