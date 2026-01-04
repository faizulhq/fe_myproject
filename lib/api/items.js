import axiosClient from "./axiosClient";

export const getItems = async () => {
  const response = await axiosClient.get("/items/");
  return response.data.results || response.data;
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