import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserFromToken, updateUser } from "../api";
import { AuthContext } from "../context";
import Layout from "../components/Layout";

const Account = () => {
  const token = localStorage.getItem("token");
  const [formSecur, setFormSecur] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  function showPassword(e) {
    if (e.target.checked) {
      document.getElementById("password").type = "text";
    } else {
      document.getElementById("password").type = "password";
    }
  }

  const handleFormSecurSubmit = (e) => {
    e.preventDefault();
    updateUser(token, formSecur).then((res) => {
      if (res.data.result) {
        Swal.fire("Success", res.data.message, "success");
      }
    });
  };

  useEffect(() => {
    getUserFromToken(token).then((res) => {
      setFormSecur({
        ...formSecur,
        name: res.data.name,
        email: res.data.email,
        username: res.data.user,
      });
    });
  }, []);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div>
        <div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Security Settings
          </h1>
          <form onSubmit={handleFormSecurSubmit}>
            <div className="md:w-1/3 grid md:grid-cols-1 bg-white p-6 shadow rounded-md">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  required
                  value={formSecur.name}
                  onChange={(e) =>
                    setFormSecur({
                      ...formSecur,
                      name: e.target.value,
                    })
                  }
                  id="name"
                  type="text"
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                ></input>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  required
                  value={formSecur.email}
                  onChange={(e) =>
                    setFormSecur({
                      ...formSecur,
                      email: e.target.value,
                    })
                  }
                  id="email"
                  type="email"
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                ></input>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  required
                  value={formSecur.username}
                  onChange={(e) =>
                    setFormSecur({
                      ...formSecur,
                      username: e.target.value,
                    })
                  }
                  id="username"
                  type="text"
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                ></input>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  required
                  value={formSecur.password}
                  onChange={(e) =>
                    setFormSecur({
                      ...formSecur,
                      password: e.target.value,
                    })
                  }
                  id="password"
                  type="password"
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                ></input>
                <div className="mt-2 flex items-center">
                  <input
                    onChange={(e) => showPassword(e)}
                    id="showPass"
                    type="checkbox"
                    className="mr-1"
                  ></input>
                  <label htmlFor="showPass" className="text-sm">
                    Show password
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="mr-4 md:w-30 tracking-widest items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
