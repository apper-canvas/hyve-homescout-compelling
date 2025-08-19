const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const savedPropertyService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const tableName = 'saved_property_c';
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "saved_date_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database response to match UI expectations
      const savedProperties = response.data.map(item => ({
        Id: item.Id,
        propertyId: item.property_id_c,
        notes: item.notes_c || '',
        savedDate: item.saved_date_c || item.CreatedOn
      }));

      return savedProperties;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching saved properties:", error.response.data.message);
      } else {
        console.error("Error fetching saved properties:", error.message);
      }
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const tableName = 'saved_property_c';
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "saved_date_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Saved property not found");
      }

      // Transform database response to match UI expectations
      const item = response.data;
      const savedProperty = {
        Id: item.Id,
        propertyId: item.property_id_c,
        notes: item.notes_c || '',
        savedDate: item.saved_date_c || item.CreatedOn
      };

      return savedProperty;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching saved property with ID ${id}:`, error.response.data.message);
      } else {
        console.error("Error fetching saved property:", error.message);
      }
      throw error;
    }
  },

  async getByPropertyId(propertyId) {
    try {
      const apperClient = getApperClient();
      const tableName = 'saved_property_c';
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "saved_date_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        where: [
          {
            FieldName: "property_id_c",
            Operator: "EqualTo",
            Values: [propertyId.toString()]
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        return null;
      }

      // Transform database response to match UI expectations
      const item = response.data[0];
      const savedProperty = {
        Id: item.Id,
        propertyId: item.property_id_c,
        notes: item.notes_c || '',
        savedDate: item.saved_date_c || item.CreatedOn
      };

      return savedProperty;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching saved property by property ID ${propertyId}:`, error.response.data.message);
      } else {
        console.error("Error fetching saved property:", error.message);
      }
      return null;
    }
  },

  async create(savedProperty) {
    try {
      // Check if already saved
      const existing = await this.getByPropertyId(savedProperty.propertyId);
      if (existing) {
        throw new Error("Property already saved");
      }

      const apperClient = getApperClient();
      const tableName = 'saved_property_c';
      
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: `Saved Property ${savedProperty.propertyId}`,
            property_id_c: savedProperty.propertyId.toString(),
            notes_c: savedProperty.notes || '',
            saved_date_c: new Date().toISOString()
          }
        ]
      };

      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create saved property ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const item = successfulRecords[0].data;
          return {
            Id: item.Id,
            propertyId: item.property_id_c,
            notes: item.notes_c || '',
            savedDate: item.saved_date_c || item.CreatedOn
          };
        }
      }

      throw new Error("Failed to create saved property");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating saved property:", error.response.data.message);
      } else {
        console.error("Error creating saved property:", error.message);
      }
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      const tableName = 'saved_property_c';
      
      // Only include Updateable fields
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...(updates.notes !== undefined && { notes_c: updates.notes }),
            ...(updates.savedDate !== undefined && { saved_date_c: updates.savedDate })
          }
        ]
      };

      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update saved property ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const item = successfulUpdates[0].data;
          return {
            Id: item.Id,
            propertyId: item.property_id_c,
            notes: item.notes_c || '',
            savedDate: item.saved_date_c || item.CreatedOn
          };
        }
      }

      throw new Error("Failed to update saved property");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating saved property:", error.response.data.message);
      } else {
        console.error("Error updating saved property:", error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const tableName = 'saved_property_c';
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete saved property ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting saved property:", error.response.data.message);
      } else {
        console.error("Error deleting saved property:", error.message);
      }
      throw error;
    }
  },

  async deleteByPropertyId(propertyId) {
    try {
      const existing = await this.getByPropertyId(propertyId);
      if (!existing) {
        throw new Error("Property not saved");
      }

      return await this.delete(existing.Id);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting saved property by property ID:", error.response.data.message);
      } else {
        console.error("Error deleting saved property by property ID:", error.message);
      }
      throw error;
    }
  }
};