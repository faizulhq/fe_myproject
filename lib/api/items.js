import axiosClient from "./axiosClient";

export const getItems = async ({ page = 1, search = '', scope = 'public' }) => {
  // Mengirim parameter page, search, dan scope ke backend
  const params = {
    page,
    search,
    scope
  };
  const response = await axiosClient.get("/items/", { params });
  return response.data; 
};

export const createItem = async (formData) => {
  return await axiosClient.post("/items/", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateItem = async ({ id, formData }) => {
  return await axiosClient.patch(`/items/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteItem = async (id) => {
  return await axiosClient.delete(`/items/${id}/`);
};