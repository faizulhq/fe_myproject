import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  // Get all items
  getItems: async () => {
    try {
      const response = await axios.get(API_URL);
      
      // Handle paginated response dari DRF
      if (response.data && typeof response.data === 'object') {
        // Jika ada key 'results', ambil itu (paginated)
        if (Array.isArray(response.data.results)) {
          return response.data.results;
        }
        // Jika langsung array
        if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      
      // Fallback: return empty array
      console.warn('Unexpected API response format:', response.data);
      return [];
    } catch (error) {
      console.error('Error fetching items:', error);
      console.error('Response:', error.response?.data);
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
      console.error('Response:', error.response?.data);
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
      console.error('Response:', error.response?.data);
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
      console.error('Response:', error.response?.data);
      throw error;
    }
  }
};