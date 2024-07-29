// src/api.js
import axios from "axios";
import { clearAuthData } from "./utils/authUtils";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Important to send cookies with requests
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Call the clearAuthData function to clear cookies and localStorage
      clearAuthData();
      // Redirect the user to the login page
      const navigate = useNavigate();
      navigate("/auth");
    }
    return Promise.reject(error);
  }
);

export default api;
