import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (err) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const payload = decodeToken(storedToken);
      setUser(payload);
    }
  }, []);
  
  useEffect(() => {
    if (!token || !user?.exp) return;
  
    const currentTime = Date.now() / 1000;
    const timeLeft = user.exp - currentTime;
  
    if (timeLeft <= 0) {
      logout();
      return;
    }
  
    const timer = setTimeout(() => {
      logout();
    }, timeLeft * 1000);
  
    return () => clearTimeout(timer);
  }, [token, user]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    const payload = decodeToken(newToken);
    setUser(payload);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}