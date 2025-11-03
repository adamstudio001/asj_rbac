import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const getStoredUser = () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [expired, setExpired] = useState(() => {
    const currentUser = getStoredUser();
    if (currentUser && currentUser.expires_at) {
      return new Date(currentUser.expires_at) < new Date();
    }
    return false;
  });

  const isUserAccess = () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      const info = storedUser ? JSON.parse(storedUser) : null;
      return info.user_access==1;
    } catch {
      return false;
    }
  };

  const isAdminAccess = () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      const info = storedUser ? JSON.parse(storedUser) : null;
      return info.admin_access==1;
    } catch {
      return false;
    }
  };

  const isCompanyAccess = () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      const info = storedUser ? JSON.parse(storedUser) : null;
      return info.company_access==1;
    } catch {
      return false;
    }
  };

  // Sinkronisasi antar tab
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "user" || event.key === "token") {
        const storedUser = sessionStorage.getItem("user");
        const storedToken = sessionStorage.getItem("token");

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);

          if (parsedUser.expires_at) {
            setExpired(new Date(parsedUser.expires_at) < new Date());
          }
        } else {
          setUser(null);
          setToken(null);
          setExpired(false);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const refreshSession = () => { 
    try { 
      const storedUser = sessionStorage.getItem("user"); 
      const storedToken = sessionStorage.getItem("token"); 
      if (storedUser && storedToken) { 
        const parsedUser = JSON.parse(storedUser); 
        setUser(parsedUser); 
        setToken(storedToken); 
        if (parsedUser.expires_at) { 
          setExpired(new Date(parsedUser.expires_at) < new Date()); 
        } 
      } else { 
        setUser(null); 
        setToken(null); 
        setExpired(false); 
      } 
    } catch (error) { 
      console.error("Error refreshing session:", error); 
      setUser(null); 
      setToken(null); 
      setExpired(false); 
    } 
  }; 

  const logout = () => { 
    try { 
      sessionStorage.removeItem("user"); 
      sessionStorage.removeItem("token"); 
    } catch (error) { 
      console.error("Error removing session:", error); 
    } finally { 
      setUser(null); 
      setToken(null); 
      setExpired(false); 
    } 
  };

  return (
    <AuthContext.Provider value={{ user, token, expired, setUser, refreshSession, logout, isAdminAccess, isCompanyAccess, isUserAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
