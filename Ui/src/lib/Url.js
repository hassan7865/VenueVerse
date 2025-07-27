import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const userDataString = localStorage.getItem("venue_venture_user_data");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        const token = userData?.token; // or the actual key where token is stored
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle known errors globally
      console.error("API Error:", error.response.data);
      if (error.response.status === 401) {
        // Optionally redirect to login
        console.warn("Unauthorized! Redirecting to login...");
        // window.location.href = '/login';
      }
    } else {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
