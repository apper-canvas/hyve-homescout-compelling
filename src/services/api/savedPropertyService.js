import savedPropertiesData from "@/services/mockData/savedProperties.json";

let savedProperties = [...savedPropertiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const savedPropertyService = {
  async getAll() {
    await delay(200);
    return savedProperties.map(sp => ({ ...sp }));
  },

  async getById(id) {
    await delay(150);
    const saved = savedProperties.find(sp => sp.Id === parseInt(id));
    if (!saved) {
      throw new Error("Saved property not found");
    }
    return { ...saved };
  },

  async getByPropertyId(propertyId) {
    await delay(150);
    const saved = savedProperties.find(sp => sp.propertyId === propertyId.toString());
    return saved ? { ...saved } : null;
  },

  async create(savedProperty) {
    await delay(300);
    
    // Check if already saved
    const existing = savedProperties.find(sp => sp.propertyId === savedProperty.propertyId);
    if (existing) {
      throw new Error("Property already saved");
    }
    
    const maxId = savedProperties.length > 0 ? Math.max(...savedProperties.map(sp => sp.Id)) : 0;
    const newSaved = {
      ...savedProperty,
      Id: maxId + 1,
      savedDate: new Date().toISOString()
    };
    savedProperties.push(newSaved);
    return { ...newSaved };
  },

  async update(id, updates) {
    await delay(300);
    const index = savedProperties.findIndex(sp => sp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Saved property not found");
    }
    savedProperties[index] = { ...savedProperties[index], ...updates };
    return { ...savedProperties[index] };
  },

  async delete(id) {
    await delay(250);
    const index = savedProperties.findIndex(sp => sp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Saved property not found");
    }
    const deleted = savedProperties.splice(index, 1)[0];
    return { ...deleted };
  },

  async deleteByPropertyId(propertyId) {
    await delay(250);
    const index = savedProperties.findIndex(sp => sp.propertyId === propertyId.toString());
    if (index === -1) {
      throw new Error("Property not saved");
    }
    const deleted = savedProperties.splice(index, 1)[0];
    return { ...deleted };
  }
};