import axios from "axios";

const API_URL = "https://task-manager-exol.onrender.com/tasks"; // Backend API

export const getTasks = async () => {
  const response = await axios.get(API_URL);
  await new Promise((resolve) => setTimeout(resolve, 300));  // ✅ Adds 300ms delay for smoother UI
  return response.data;
};


export const addTask = async (task) => {
  const response = await axios.post(API_URL, task);
  return response.data;
};

export const updateTask = async (id, updates) => {
  const response = await axios.put(`${API_URL}/${id}`, updates);
  return response.data;
};

export const deleteTask = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
