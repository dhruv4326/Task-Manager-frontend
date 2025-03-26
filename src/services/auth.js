import axios from "axios";

const API_URL = "https://task-manager-exol.onrender.com/auth";

export const register = async (name, email, password) => {
  try {
    const res = await axios.post(`${API_URL}/register`, { name, email, password });
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (error) {
    console.error("Registration failed:", error.response?.data?.message || error.message);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data?.message || error.message);
    throw error;
  }
};

export const getToken = () => localStorage.getItem("token");

export const logout = () => {
  localStorage.removeItem("token");
};
