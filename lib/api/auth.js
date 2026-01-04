import axiosClient from "../axiosClient";

export const login = async (credentials) => {
  return await axiosClient.post("/auth/login/", credentials);
};

export const register = async (userData) => {
  return await axiosClient.post("/auth/register/", userData);
};

export const getProfile = async () => {
  return await axiosClient.get("/auth/profile/");
};

export const updateProfile = async (formData) => {
  return await axiosClient.patch("/auth/profile/", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};