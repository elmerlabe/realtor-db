import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Agents from "./pages/Agents";
import NewAgent from "./components/NewRecord";
import Account from "./pages/Account";
import NewRecord from "./components/NewRecord";
import Home from "./pages/Home";
import RequireAuth from "./components/RequireAuth";

const routes = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <RequireAuth children={<Home />} />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
      {
        path: "/agents",
        element: <RequireAuth children={<Agents />} />,
      },
      {
        path: "/agents/newRecord",
        element: <RequireAuth children={<NewAgent />} />,
      },
      {
        path: "/agents/:agentId",
        element: <RequireAuth children={<NewRecord />} />,
      },
      {
        path: "/account",
        element: <RequireAuth children={<Account />} />,
      },
      {
        path: "/home",
        element: <RequireAuth children={<Home />} />,
      },
    ],
  },
]);

export default routes;
