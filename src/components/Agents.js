import { useState, useContext, useEffect, Fragment } from "react";
import { AuthContext } from "../context";
import { exportCSV, getCities, getRealtors, getStates } from "../api";
import Swal from "sweetalert2";
import {
  CheckIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
import Spinner from "./Spinner";
import { Navigate } from "react-router-dom";

const perPage = [
  { value: "10", name: "Show 10" },
  { value: "20", name: "Show 20" },
  { value: "30", name: "Show 30" },
  { value: "40", name: "Show 40" },
  { value: "50", name: "Show 50" },
  { value: "100", name: "Show 100" },
];

const Agents = ({ children }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [agentList, setAgentList] = useState([]);
  const [refreshData, setRefreshData] = useState({
    page: 1,
    pages: 0,
    perPage: 50,
    nextPage: 0,
    prevPage: 0,
    total: 0,
  });
  const [searchVal, setSearchVal] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPerPage, setSelectedPerPage] = useState(perPage[4].value);
  const [isFetching, setIsFetching] = useState(false);

  const handleChangePage = (e) => {
    if (e === "0" || e === "") return;
    refreshData.page = e;
    getRealtorsData();
  };

  const handlePrevPage = () => {
    if (refreshData.prevPage === null) return;
    refreshData.page = refreshData.prevPage;
    setIsFetching(true);
    getRealtorsData();
  };

  const handleNextPage = () => {
    if (refreshData.nextPage === null) return;
    refreshData.page = refreshData.nextPage;
    setIsFetching(true);
    getRealtorsData();
  };

  const handleSearch = (e) => {
    let val = e.target.value;
    if (e.which === 13) {
      e.preventDefault();
      if (val === "") return;
      setIsFetching(true);
      refreshData.page = 1;
      setSearchVal(val);
      getRealtorsData();
    }
  };

  const handleSearchChange = (e) => {
    let val = e.target.value;
    setSearchVal(val);
    setSelectedCity("");
    setSelectedState("");
  };

  const handleStateChange = (d) => {
    setSearchVal("");
    setSelectedCity("");
    setSelectedState(d.target.value);
  };

  const handleCityChange = (d) => {
    setSearchVal("");
    setSelectedCity(d.target.value);
  };

  const handleSelectPerPage = (d) => {
    setSelectedPerPage(d.target.value);
  };

  const handleExportCSV = (e) => {
    if (selectedState === "") return;
    e.target.disabled = true;
    let url =
      process.env.REACT_APP_API_URL +
      "/exportCSV?state=" +
      selectedState +
      "&city=" +
      selectedCity;
    window.open(url, "_blank");
    e.target.disabled = false;
  };

  useEffect(() => {
    setIsFetching(true);
    getStatesData();
    getRealtorsData();
  }, []);

  useEffect(() => {
    refreshData.page = 1;
    if (selectedState !== "") {
      setIsFetching(true);
      getRealtorsData();
      getCitiesData();
    }
  }, [selectedState, selectedCity]);

  useEffect(() => {
    refreshData.perPage = selectedPerPage;
    setIsFetching(true);
    getRealtorsData();
  }, [selectedPerPage]);

  function getRealtorsData() {
    getRealtors(
      token,
      refreshData.page,
      refreshData.perPage,
      selectedCity,
      selectedState,
      searchVal
    )
      .then((res) => {
        //console.log(res);
        setIsFetching(false);
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

  function getStatesData() {
    getStates().then((res) => {
      setStates(res.data.states);
    });
  }

  function getCitiesData() {
    getCities(selectedState).then((res) => {
      setCities(res.data.cities);
    });
  }

  function sortTable(n) {
    let table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchCount = 0;
    table = document.getElementById("myTable");
    switching = true;
    dir = "asc";

    while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];

        if (dir === "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (dir === "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
      }

      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchCount++;
      } else {
        if (switchCount === 0 && dir === "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

  if (!user && !token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="">
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
            <div className="mb-2 flex">
              <label htmlFor="table-search" className="sr-only">
                Search
              </label>
              <div className="relative mr-5">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer" />
                </div>

                <input
                  value={searchVal}
                  onKeyPress={(e) => handleSearch(e)}
                  onChange={(e) => handleSearchChange(e)}
                  type="text"
                  id="table-search"
                  className="block p-2 pl-10 w-80 text-sm text-gray-900 bg-white-500 rounded-lg border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-800"
                  placeholder="Search for agent information"
                />
              </div>

              <div className="mr-5 relative text-left w-60 items-center">
                <select
                  onChange={handleStateChange}
                  className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border-none shadow-md focus:outline-none sm:text-sm"
                >
                  <option className="font-semibold" value="">
                    Select State
                  </option>
                  {states.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} - {c.longName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mr-5 relative text-left w-60 items-center">
                <select
                  onChange={handleCityChange}
                  className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border-none shadow-md focus:outline-none sm:text-sm"
                >
                  <option className="font-semibold" value="">
                    Select City
                  </option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mr-5 relative text-left w-30 items-center">
                <select
                  value={selectedPerPage}
                  onChange={handleSelectPerPage}
                  className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border-none shadow-md focus:outline-none sm:text-sm"
                >
                  {perPage.map((c, i) => (
                    <option key={i} value={c.value}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mr-5 flex ">
                <button
                  onClick={handleExportCSV}
                  type="button"
                  className="rounded-md bg-gray-500 border-none shadow-md focus:outline-none sm:text-sm text-center text-gray-200"
                  style={{ width: "6rem" }}
                >
                  Export CSV
                </button>
              </div>

              <div
                className="mr-5 relative text-left w-30 items-center"
                style={{ display: "none" }}
              >
                <Listbox value={selectedPerPage} onChange={setSelectedPerPage}>
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">
                      {selectedPerPage.name}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {perPage.map((pPage, index) => (
                        <Listbox.Option
                          key={index}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={pPage}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {pPage.value}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </Listbox>
              </div>
            </div>

            {isFetching ? (
              <div className="flex justify-center p-40">
                <Spinner size={16} />
              </div>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table
                  id="myTable"
                  className="min-w-full divide-y divide-gray-300"
                >
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <div className="flex items-center">
                          First Name
                          <button onClick={() => sortTable(0)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="ml-1 w-3 h-3"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 320 512"
                            >
                              <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                            </svg>
                          </button>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <div className="flex items-center">
                          Last Name
                          <button onClick={() => sortTable(1)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="ml-1 w-3 h-3"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 320 512"
                            >
                              <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                            </svg>
                          </button>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <div className="flex items-center">
                          Office Name
                          <button onClick={() => sortTable(2)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="ml-1 w-3 h-3"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 320 512"
                            >
                              <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                            </svg>
                          </button>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <div className="flex items-center">
                          City
                          <button onClick={() => sortTable(3)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="ml-1 w-3 h-3"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 320 512"
                            >
                              <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                            </svg>
                          </button>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <div className="flex items-center">
                          State
                          <button onClick={() => sortTable(4)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="ml-1 w-3 h-3"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 320 512"
                            >
                              <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                            </svg>
                          </button>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <div className="flex items-center">
                          Office Phone
                          <button onClick={() => sortTable(5)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="ml-1 w-3 h-3"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 320 512"
                            >
                              <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                            </svg>
                          </button>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <div className="flex items-center">
                          Cell Phone
                          <button onClick={() => sortTable(6)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="ml-1 w-3 h-3"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 320 512"
                            >
                              <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                            </svg>
                          </button>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <div className="flex items-center">
                          Email
                          <button onClick={() => sortTable(7)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="ml-1 w-3 h-3"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 320 512"
                            >
                              <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                            </svg>
                          </button>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {agentList.map((agent) => (
                      <tr key={agent._id} className="hover:bg-gray-100">
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
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {agent.cellPhone}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <a
                            className="hover:underline underline-offset-1 hover:text-blue-500"
                            href={`mailto: ${agent.email}`}
                          >
                            {agent.email}
                          </a>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a
                            href={`/agents/${agent._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {isFetching ? null : (
          <nav
            className="flex items-center justify-between py-2"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{refreshData.page}</span> of{" "}
                <span className="font-medium">{refreshData.pages}</span>
                <span className="text-sm ml-2 mr-4">
                  Go to page{" "}
                  <input
                    style={{ width: "60px" }}
                    onChange={(e) => handleChangePage(e.target.value)}
                    type="number"
                    min="1"
                    className="border text-left p-1 rounded-md outline-none focus:border-sky-300"
                  />{" "}
                </span>
                Total results:{" "}
                <span className="font-medium">{refreshData.total}</span>
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
        )}
      </div>
    </div>
  );
};

export default Agents;
