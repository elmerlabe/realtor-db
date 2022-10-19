import { Dialog, Transition } from "@headlessui/react";

import { Fragment, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAgentFromId, getRealtors, updateAgentInfo } from "../api";
import { AuthContext } from "../context";

const tHeader = [
  "Email",
  "First Name",
  "Last Name",
  "Office Name",
  "Office City",
  "Office State",
  "Office Phone",
];

let perPage = 10;

const perPageOption = [
  { value: "10", name: "Show 10" },
  { value: "20", name: "Show 20" },
  { value: "30", name: "Show 30" },
  { value: "40", name: "Show 40" },
  { value: "50", name: "Show 50" },
  { value: "100", name: "Show 100" },
  { value: "500", name: "Show 500" },
  { value: "1000", name: "Show 1000" },
];

const agentFormList = [
  { value: "", name: "Email" },
  { value: "", name: "Full Name" },
  { value: "", name: "First Name" },
  { value: "", name: "Middle Name" },
  { value: "", name: "Last Name" },
  { value: "", name: "Suffix" },
  { value: "", name: "Office Name" },
  { value: "", name: "Office Address 1" },
  { value: "", name: "Office Address 2" },
  { value: "", name: "Office City" },
  { value: "", name: "Office State" },
  { value: "", name: "Office Zip" },
  { value: "", name: "Office Country" },
  { value: "", name: "Office Phone" },
  { value: "", name: "Office Fax" },
  { value: "", name: "Cellphone" },
];

const Admin = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [refreshData, setRefreshData] = useState({
    page: 1,
    pages: 0,
    next_page: 0,
    prev_page: 0,
    total: 0,
  });

  const [agentForm, setAgentForm] = useState(agentFormList);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [toUpdateCol, setToUpdateCol] = useState(null);

  const handleChangePerPage = (p) => {
    perPage = p;
    getRealtorsData();
  };

  const handlePrevPage = () => {
    if (refreshData.prev_page === null) return;
    refreshData.page = refreshData.prev_page;
    setRefreshData({ ...refreshData });
    getRealtorsData();
  };

  const handleNextPage = () => {
    if (refreshData.next_page === null) return;
    refreshData.page = refreshData.next_page;
    setRefreshData({ ...refreshData });
    getRealtorsData();
  };

  const handleChangePage = (e) => {
    refreshData.page = e;
    setRefreshData({ ...refreshData });
    if (e !== "") {
      getRealtorsData();
    }
  };

  const handleUpdate = (id) => {
    setSelectedAgent(null);
    getAgentFromId(id, token).then((res) => {
      let d = res.data.data[0];
      agentFormList[0].value = d.email;
      agentFormList[1].value = d.full_name;
      agentFormList[2].value = d.first_name;
      agentFormList[3].value = d.middle_name;
      agentFormList[4].value = d.last_name;
      agentFormList[5].value = d.suffix;
      agentFormList[6].value = d.office_name;
      agentFormList[7].value = d.office_address_1;
      agentFormList[8].value = d.office_address_2;
      agentFormList[9].value = d.office_city;
      agentFormList[10].value = d.office_state;
      agentFormList[11].value = d.office_zip;
      agentFormList[12].value = d.office_country;
      agentFormList[13].value = d.office_phone;
      agentFormList[14].value = d.office_fax;
      agentFormList[15].value = d.cellphone;
      setAgentForm(agentFormList);
      setSelectedAgent(id);
    });
  };

  const handleUpdtFormChange = (e, i) => {
    agentFormList[i].value = e.target.value;
    setAgentForm(agentFormList);
    setToUpdateCol(() => toUpdateCol + 1);
  };

  const handleSubmitUpdateForm = (e) => {
    e.preventDefault();
    updateAgentInfo(token, selectedAgent, agentForm)
      .then((res) => {
        //setIsOpen(false);
        Swal.fire("Success", res.data.message, "success");
        getRealtorsData();
      })
      .catch((res) => {
        console.log(res);
      });
  };

  useEffect(() => {
    if (agentForm[0].value) {
      setIsOpen(true);
    }
  }, [selectedAgent]);

  useEffect(() => {}, [toUpdateCol]);

  useEffect(() => {
    getRealtorsData();
  }, []);

  const getRealtorsData = () => {
    setTableData([]);
    getRealtors(refreshData.page, perPage, token).then((res) => {
      //console.log(res.data);
      setTableData(res.data.realtors);
      setRefreshData({
        ...refreshData,
        page: res.data.page,
        pages: res.data.pages,
        next_page: res.data.next_page,
        prev_page: res.data.prev_page,
        total: res.data.total,
      });
    });
  };

  if (!user && !token) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <div className="px-3">
        <p className="text-4xl font-bold mb-8 text-gray-700"> Agent List</p>
        <div className="overflow-x-auto" style={{ maxHeight: "800px" }}>
          <table id="agentTable" className="bg-white rounded shadow w-full">
            <thead>
              <tr>
                <th className="text-white">#</th>
                {tHeader.map((tH, index) => (
                  <th className="text-white px-4 table-cell" key={index}>
                    {tH}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((t, index) => (
                <tr key={index}>
                  <td
                    className="border px-4 table-cell cursor-pointer"
                    onClick={() => handleUpdate(t._id)}
                  >
                    {index + 1}
                  </td>
                  <td className="border px-4 table-cell">{t.email}</td>
                  <td className="border px-4 table-cell">{t.first_name}</td>
                  <td className="border px-4 table-cell">{t.last_name}</td>
                  <td className="border px-4 table-cell">{t.office_name}</td>
                  <td className="border px-4 table-cell">{t.office_city}</td>
                  <td className="border px-4 table-cell">{t.office_state}</td>
                  <td className="border px-4 table-cell">{t.office_phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-right mt-2">
          <div className="flex">
            <p className="my-auto mx-2 font-bold">Total: {refreshData.total}</p>
          </div>
          <div className="flex">
            <label className="my-auto mx-2">Go to page:</label>
            <input
              className="w-16 text-center border border-slate-300 rounded focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
              type="number"
              min="1"
              value={refreshData.page}
              onChange={(e) => handleChangePage(e.target.value)}
            ></input>
          </div>

          <div className="flex mx-4">
            <select
              onChange={(e) => handleChangePerPage(e.target.value)}
              className="w-full text-center border border-slate-300 rounded focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            >
              {perPageOption.map((p, i) => (
                <option className="text-left" key={i} value={p.value}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end items-end space-x-4">
            <div
              onClick={() => {
                handlePrevPage();
              }}
              className="border rounded-md bg-gray-200 px-2 py-1 text-3xl leading-6 text-slate-400 transition hover:bg-gray-300 hover:text-slate-500 cursor-pointer shadow-sm"
            >
              {"<"}
            </div>
            <div className="text-slate-500">
              {refreshData.page} / {refreshData.pages}
            </div>
            <div
              onClick={() => {
                handleNextPage();
              }}
              className="border rounded-md bg-gray-200 px-2 py-1 text-3xl leading-6 text-slate-400 transition hover:bg-gray-300 hover:text-slate-500 cursor-pointer shadow-sm"
            >
              {">"}
            </div>
          </div>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opcity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <button
                  style={{ marginTop: "-30px", marginRight: "-20px" }}
                  className="p-2 float-right text-3xl font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  &times;
                </button>
                <Dialog.Title
                  as="h3"
                  className="mb-10 text-2xl font-bold leading-6 text-gray-600"
                >
                  Update Agent Info
                </Dialog.Title>
                <form onSubmit={handleSubmitUpdateForm}>
                  <div className="grid grid-cols-3 gap-3">
                    {agentForm.map((d, i) => (
                      <div key={i}>
                        <label className="text-sm font-medium ">
                          {d.name}:
                        </label>
                        <input
                          value={d.value}
                          onChange={(e) => handleUpdtFormChange(e, i)}
                          type="text"
                          className=" w-full border border-slate-300 rounded-md  focus:outline-none focus:border-sky-500 md:text-sm p-2 bg-gray-100"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-5">
                    <button className="mr-3 tracking-wider w-200 rounded-md border border-transparent bg-blue-500 py-2 px-4 font-medium text-slate-50 hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                      Update
                    </button>

                    <button className="mr-3 tracking-wider w-200 rounded-md border border-transparent outline outline-1 outline-red-500 py-2 px-4 font-medium text-red-500 hover:text-slate-200 hover:bg-red-500  focus-visible:ring-2 focus-visible:ring-red-500">
                      Remove
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Admin;
