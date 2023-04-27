import { createContext, useEffect, useState } from "react";
import { apiInstance, getUserFromToken } from "./api";
import { Loader } from "./components/Loader";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const onLogin = (loginToken) => {
    setToken(loginToken);
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);

    delete apiInstance.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    if (token && !user) {
      getUserFromToken(token)
        .then((res) => {
          if (res.data.user) {
            localStorage.setItem("token", token);
            setUser(res.data.user);
            apiInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${token}`;
          } else {
            localStorage.removeItem("token");
            setToken(null);
          }

          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("token");
          setToken(null);
        });
    }
  }, [token, user]);

  useEffect(() => {
    const lsToken = localStorage.getItem("token");
    if (lsToken) {
      setToken(lsToken);
    } else {
      setIsLoading(false);
    }
  });

  if (isLoading) {
    let size = 10;
    return <Loader size={size} />;
  }

  return (
    <AuthContext.Provider value={{ user, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
