import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  // Get all items
  getItems: async () => {
    try {
      const response = await axios.get(API_URL);
      
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.results)) {
          return response.data.results;
        }
        if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      return [];
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

  // Create item
  createItem: async (formData) => {
    try {
      // JANGAN set Content-Type manual, biarkan axios generate boundary
      const response = await axios.post(API_URL, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  // Update item
  updateItem: async (id, formData) => {
    try {
      const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
      // Gunakan PATCH agar field yang tidak dikirim (misal gambar lama) tidak dihapus
      const response = await axios.patch(`${baseUrl}${id}/`, formData);
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