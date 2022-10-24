import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context";
import { getRealtors } from "../api";
import Swal from "sweetalert2";

const Agents = ({ children }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [agentList, setAgentList] = useState([]);
  const [refreshData, setRefreshData] = useState({
    page: 1,
    pages: 0,
    perPage: 10,
    nextPage: 0,
    prevPage: 0,
    total: 0,
  });

  const handleChangePage = (e) => {
    if (e === "0" || e === "") return;
    refreshData.page = e;
    getRealtorsData();
  };

  const handlePrevPage = () => {
    if (refreshData.prevPage === null) return;
    refreshData.page = refreshData.prevPage;
    getRealtorsData();
  };

  const handleNextPage = () => {
    if (refreshData.nextPage === null) return;
    refreshData.page = refreshData.nextPage;
    getRealtorsData();
  };

  useEffect(() => {
    getRealtorsData();
  }, []);

  function getRealtorsData() {
    getRealtors(refreshData.page, refreshData.perPage, token)
      .then((res) => {
        //console.log(res);
        setAgentList(res.data.realtors);
        setRefreshData({
          ...refreshData,
          page: res.data.page,
          pages: res.data.pages,
          nextPage: res.data.next_page,
          prevPage: res.data.prev_page,
          total: res.data.total,
        });
      })
      .catch((err) => {
        Swal.fire("Error", "Unable to get data!", "error");
      });
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              window.location.href = "/agents/newRecord";
            }}
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add agent
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      First Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Last Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Office Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Office City
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Office State
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Office Phone
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {agentList.map((agent) => (
                    <tr key={agent._id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {agent.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {agent.firstName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {agent.lastName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {agent.officeName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {agent.officeCity}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {agent.officeState}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {agent.officePhone}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href={`/agents/${agent._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit<span className="sr-only">, {agent._id}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <nav
          className="flex items-center justify-between py-2"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{refreshData.page}</span> to{" "}
              <span className="font-medium">{refreshData.pages}</span> of{" "}
              <span className="font-medium">{refreshData.total}</span> results{" "}
              <span className="text-sm ml-2">
                Go to page{" "}
                <input
                  onChange={(e) => handleChangePage(e.target.value)}
                  type="number"
                  min="1"
                  className="border w-20 text-left p-1 rounded-md outline-none focus:border-sky-300"
                />{" "}
              </span>
            </p>
          </div>
          <div className="flex flex-1 justify-between sm:justify-end">
            <button
              onClick={handlePrevPage}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Agents;
