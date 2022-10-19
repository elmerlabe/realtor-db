import { createContext, useEffect, useState } from "react";
import { getUserFromToken } from "./api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const onLogin = (loginToken) => {
    setToken(loginToken);
    localStorage.setItem("token", loginToken);
  };

  const onLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (!user && token) {
      getUserFromToken(token).then((res) => {
        setUser(res.data.user);
      });
    }
  }, [token, user]);

  return (
    <AuthContext.Provider value={{ user, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
