import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context";

const Logout = () => {
  const { onLogout } = useContext(AuthContext);

  useEffect(() => {
    onLogout();
  });
  return <Navigate to="/login" />;
};

export default Logout;
