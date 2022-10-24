import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  addNewAgent,
  getAgentFromId,
  removeAgent,
  updateAgentInfo,
} from "../api";

const NewRecord = () => {
  const token = localStorage.getItem("token");
  const { agentId } = useParams();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    officeName: "",
    officeAddress1: "",
    officeAddress2: "",
    officeCity: "",
    officeState: "",
    officeZip: "",
    officeCountry: "",
    officePhone: "",
    officeFax: "",
    cellPhone: "",
  });

  useEffect(() => {
    if (agentId) {
      getAgentFromId(agentId, token).then((res) => {
        const d = res.data.data[0];
        setFormData({
          email: d["email"],
          firstName: d["firstName"],
          middleName: d["middleName"],
          lastName: d["lastName"],
          suffix: d["suffix"],
          officeName: d["officeName"],
          officeAddress1: d["officeAddress1"],
          officeAddress2: d["officeAddress2"],
          officeCity: d["officeCity"],
          officeState: d["officeState"],
          officeZip: d["officeZip"],
          officeCountry: d["officeCountry"],
          officePhone: d["officePhone"],
          officeFax: d["officeFax"],
          cellPhone: d["cellPhone"],
        });
      });
    }
  }, []);

  const handleSubmitForm = (e) => {
    e.preventDefault();
    console.log(formData);

    if (agentId) {
      updateAgentInfo(token, agentId, formData).then((res) => {
        console.log(res);
        Swal.fire("Success", res.data.message, "success");
      });
    } else {
      addNewAgent(token, formData).then((res) => {
        console.log(res);
        Swal.fire("Success", res.data.message, "success");
      });
    }
  };

  const handleRemove = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeAgent(token, agentId)
          .then((res) => {
            //Swal.fire("Deleted!", "Agent record has been deleted.", "success");
            window.location.href = "/agents";
          })
          .catch((res) => {
            console.log(res);
          });
      }
    });
  };

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {agentId !== undefined ? "Update Record" : "Add New Record"}
        </h1>
        <form onSubmit={handleSubmitForm}>
          <div className="mt-4 grid md:grid-cols-2 md:gap-x-10 gap-y-2 bg-white p-4 md:p-10 xs:-1 shadow rounded-md">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <div>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="middleName"
                className="block text-sm font-medium text-gray-700"
              >
                Middle Name
              </label>
              <div>
                <input
                  type="text"
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) =>
                    setFormData({ ...formData, middleName: e.target.value })
                  }
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <div>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="suffix"
                className="block text-sm font-medium text-gray-700"
              >
                Suffix
              </label>
              <div>
                <input
                  type="text"
                  id="suffix"
                  value={formData.suffix}
                  onChange={(e) =>
                    setFormData({ ...formData, suffix: e.target.value })
                  }
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="officeName"
                className="block text-sm font-medium text-gray-700"
              >
                Office Name
              </label>
              <div>
                <input
                  type="text"
                  id="officeName"
                  value={formData.officeName}
                  onChange={(e) =>
                    setFormData({ ...formData, officeName: e.target.value })
                  }
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="officeAddress1"
                className="block text-sm font-medium text-gray-700"
              >
                Office Address 1
              </label>
              <div>
                <input
                  type="text"
                  id="officeAddress1"
                  value={formData.officeAddress1}
                  onChange={(e) =>
                    setFormData({ ...formData, officeAddress1: e.target.value })
                  }
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="officeAddress2"
                className="block text-sm font-medium text-gray-700"
              >
                Office Address 2
              </label>
              <div>
                <input
                  type="text"
                  id="officeAddress2"
                  value={formData.officeAddress2}
                  onChange={(e) =>
                    setFormData({ ...formData, officeAddress2: e.target.value })
                  }
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="officeCity"
                className="block text-sm font-medium text-gray-700"
              >
                Office City
              </label>
              <div>
                <input
                  type="text"
                  id="officeCity"
                  value={formData.officeCity}
                  onChange={(e) =>
                    setFormData({ ...formData, officeCity: e.target.value })
                  }
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="officeState"
                className="block text-sm font-medium text-gray-700"
              >
                Office State
              </label>
              <div>
                <input
                  type="text"
                  id="officeState"
                  value={formData.officeState}
                  onChange={(e) =>
                    setFormData({ ...formData, officeState: e.target.value })
                  }
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="officeZip"
                className="block text-sm font-medium text-gray-700"
              >
                Office Zip
              </label>
              <div>
                <input
                  type="text"
                  id="officeZip"
                  value={formData.officeZip}
                  onChange={(e) =>
                    setFormData({ ...formData, officeZip: e.target.value })
                  }
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="officeCountry"
                className="block text-sm font-medium text-gray-700"
              >
                Office Country
              </label>
              <div>
                <input
                  type="text"
                  id="officeCountry"
                  value={formData.officeCountry}
                  onChange={(e) =>
                    setFormData({ ...formData, officeCountry: e.target.value })
                  }
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="officePhone"
                className="block text-sm font-medium text-gray-700"
              >
                Office Phone
              </label>
              <div>
                <input
                  type="text"
                  id="officePhone"
                  value={formData.officePhone}
                  onChange={(e) =>
                    setFormData({ ...formData, officePhone: e.target.value })
                  }
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="officeFax"
                className="block text-sm font-medium text-gray-700"
              >
                Office Fax
              </label>
              <div>
                <input
                  type="text"
                  id="officeFax"
                  value={formData.officeFax}
                  onChange={(e) =>
                    setFormData({ ...formData, officeFax: e.target.value })
                  }
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="cellPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Cell Phone
              </label>
              <div>
                <input
                  type="text"
                  id="cellPhone"
                  value={formData.cellPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, cellPhone: e.target.value })
                  }
                  className="block w-full text-sm px-3 py-2 rounded-md border border-gray-300 shadow-sm outline-indigo-800 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div></div>
            <div className="md:mt-4">
              <button
                type="submit"
                className="mr-4 md:w-40 tracking-widest items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Submit
              </button>

              {agentId !== undefined ? (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="mr-4 md:w-40 mt-2 tracking-wider rounded-md border border-transparent outline outline-1 outline-red-500 py-2 px-4 font-medium text-red-500 hover:text-slate-200 hover:bg-red-500  focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  Delete
                </button>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRecord;
