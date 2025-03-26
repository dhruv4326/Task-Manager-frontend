import axios from "axios";


const API_URL = "https://task-manager-exol.onrender.com/tasks"; // ✅ Corrected API route for tasks

// ✅ Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // Assuming JWT is stored in localStorage
  return token ? { "Authorization" : `Bearer ${token}` } : {};
};

// ✅ Corrected Login Function
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // ✅ Store token
    }

    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error);
    return error.response?.data || { error: "Server error" };
  }
};
// ✅ Fetch tasks for the logged-in user
export const getTasks = async () => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    await new Promise((resolve) => setTimeout(resolve, 300)); // ✅ Adds 300ms delay for smoother UI
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error.response?.data?.message || error.message);
    throw error;
  }
};

// ✅ Add a new task for the logged-in user

export const addTask = async (taskData) => {
  const token = localStorage.getItem("token"); // ✅ Retrieve token

  if (!token) {
    console.error("No token found. User must log in.");
    return { error: "Authentication required" };
  }

  try {
    const response = await axios.post(API_URL, taskData, {
      headers: {
        "Authorization": `Bearer ${token}`, // ✅ Include token
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding task:", error.response?.data || error);
    return error.response?.data || { error: "Server error" };
  }
};
// ✅ Update an existing task (only if it belongs to the user)
export const updateTask = async (id, updates) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updates, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error.response?.data?.message || error.message);
    throw error;
  }
};

// ✅ Delete a task (only if it belongs to the user)
export const deleteTask = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  } catch (error) {
    console.error("Error deleting task:", error.response?.data?.message || error.message);
    throw error;
  }
};
