import axios from 'axios';

// PENTING: URL ini sudah lengkap sampai /items/
// Jadi JANGAN tambah /items/ lagi saat dipanggil
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/items/';

// Tambahkan interceptor untuk debugging
axios.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const api = {
  // Get all items
  getItems: async () => {
    try {
      // FIXED: Langsung pakai API_URL, jangan tambah apapun
      const response = await axios.get(API_URL);
      
      if (response.data && typeof response.data === 'object') {
        // Jika ada pagination (DRF default)
        if (Array.isArray(response.data.results)) {
          return response.data.results;
        }
        // Jika langsung array
        if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      return [];
    } catch (error) {
      console.error('Error fetching items:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  // Get single item
  getItem: async (id) => {
    try {
      // FIXED: Pastikan tidak ada double slash
      const url = `${API_URL}${id}/`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  },

  // Create item
  createItem: async (formData) => {
    try {
      // FIXED: Langsung ke API_URL
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

  // Update item
  updateItem: async (id, formData) => {
    try {
      // FIXED: Pastikan format URL benar
      const url = `${API_URL}${id}/`;
      const response = await axios.patch(url, formData, {
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
      // FIXED: Pastikan format URL benar
      const url = `${API_URL}${id}/`;
      await axios.delete(url);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
};