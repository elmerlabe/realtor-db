import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context";
import { signin } from "../api";

const Login = () => {
  const { user, onLogin } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const handleSubmitLogin = (e) => {
    e.preventDefault();
    signin(loginData.username, loginData.password).then((res) => {
      console.log(res);
      if (res.data.token) {
        onLogin(res.data.token);
      } else {
        Swal.fire("Error!", "Invalid username and/or password.", "error");
      }
    });
  };

  if (user || token) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="mt-20">
      <div className="grid grid-cols-1">
        <div className="mx-auto bg-white rounded-md shadow p-16">
          <p className="text-2xl font-bold text-gray-600 mb-5">Sign In</p>
          <form onSubmit={handleSubmitLogin}>
            <div className="mb-2">
              <label className="block text-sm font-medium">Username</label>
              <input
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                type="text"
                required
                className="mt-1 block w-60 border border-slate-300 rounded-md shadow focus:outline-none focus:border-sky-500 md:text-sm p-2 bg-gray-50"
              ></input>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium">Password</label>
              <input
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                type="password"
                className="mt-1 block w-60 border border-slate-300 rounded-md shadow focus:outline-none focus:border-sky-500 md:text-sm p-2 bg-gray-50"
              ></input>
            </div>

            <div className="mb-2 mt-3">
              <button
                type="submit"
                className="block w-60 bg-sky-500 rounded-md shadow border-none text-slate-100 p-2 font-bold tracking-widest"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
