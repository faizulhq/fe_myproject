import axiosClient from "./axiosClient";

export const login = async (credentials) => {
  // Backend URL: /api/auth/login/
  return await axiosClient.post("/auth/login/", credentials);
};

export const register = async (userData) => {
  // Backend URL: /api/auth/register/
  return await axiosClient.post("/auth/register/", userData);
};

export const getProfile = async () => {
  // Backend URL: /api/auth/profile/
  return await axiosClient.get("/auth/profile/");
};

export const updateProfile = async (formData) => {
  // Backend URL: /api/auth/profile/
  // Gunakan FormData jika upload gambar, json biasa jika hanya text
  const isFormData = formData instanceof FormData;
  
  return await axiosClient.patch("/auth/profile/", formData, {
    headers: { 
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json' 
    },
  });
};