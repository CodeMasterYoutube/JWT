const { createContext, useContext, useState, useEffect } = require("react");

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(token ? true : false);
  const [user, setUser] = useState("");

  useEffect(() => {
    console.log("--useEffect--");
    if (token) {
      localStorage.setItem("authToken", token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
    }
  }, [token]);
  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
