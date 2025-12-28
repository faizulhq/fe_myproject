import axios from 'axios';

const API_URL = 'https://myproject-production-ee63.up.railway.app/api/items/';

export const api = {
  // Get all items
  getItems: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  },

  // Get single item
  getItem: async (id) => {
    try {
      const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
      const response = await axios.get(`${baseUrl}${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  },

  // Create item (dengan file upload)
  createItem: async (formData) => {
    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  // Update item (dengan file upload)
  updateItem: async (id, formData) => {
    try {
      const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
      const response = await axios.put(`${baseUrl}${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  // Delete item
  deleteItem: async (id) => {
    try {
      const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
      await axios.delete(`${baseUrl}${id}/`);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
};