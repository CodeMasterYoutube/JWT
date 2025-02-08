import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  console.log("location :", location);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/protected", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const res = await response.json();

        if (response.ok) {
          setIsAuthenticated(true);
          setUser(res.user.username);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    verifyToken();
  });
  if (loading) {
    return <h1> Loading ....</h1>;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};
export default ProtectedRoute;
