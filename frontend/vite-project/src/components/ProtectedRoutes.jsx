import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// API base URL
const API_BASE_URL = "http://localhost:8000"; // Change this if your backend is on a different URL

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to check if user is authenticated
    const checkAuthStatus = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token validity by making a request to your auth endpoint
        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // If the request is successful, the user is authenticated
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        // If there's an error, the token is invalid or expired
        console.error("Authentication error:", error);
        localStorage.removeItem("token"); // Clear invalid token
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render the children components, otherwise redirect to login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;