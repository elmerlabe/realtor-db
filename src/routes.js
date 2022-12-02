import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Sidebar from "./components/Sidebar";
import Agents from "./components/Agents";
import NewAgent from "./components/NewRecord";
import Account from "./components/Account";
import NewRecord from "./components/NewRecord";
import Home from "./components/Home";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />
    <Route path="/logout" element={<Logout />} />
    <Route path="/agents" element={<Sidebar children={<Agents />} />} />
    <Route
      path="/agents/newRecord"
      element={<Sidebar children={<NewAgent />} />}
    />
    <Route
      path="/agents/:agentId"
      element={<Sidebar children={<NewRecord />} />}
    />
    <Route path="/account" element={<Sidebar children={<Account />} />} />
    <Route path="/home" element={<Sidebar children={<Home />} />} />
  </Routes>
);

export default AppRoutes;
