import { useState, useEffect, Fragment } from 'react';
import {
  getCities,
  getEmailDomainsCount,
  getRealtors,
  getStates,
} from '../api';
import {
  CheckIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Listbox, Transition } from '@headlessui/react';
import Spinner from '../components/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';

const perPage = [
  { value: '10', name: 'Show 10' },
  { value: '20', name: 'Show 20' },
  { value: '30', name: 'Show 30' },
  { value: '40', name: 'Show 40' },
  { value: '50', name: 'Show 50' },
  { value: '100', name: 'Show 100' },
];

const searchList = [
  { value: 'name', name: 'Name' },
  { value: 'email', name: 'Email' },
  { value: 'officeName', name: 'Company' },
  { value: 'officeAddress', name: 'Address' },
  { value: 'phoneNumber', name: 'Phone Number' },
  { value: 'officeZip', name: 'Zip Code' },
  { value: 'officeCity', name: 'City' },
  { value: 'officeCountry', name: 'Country' },
];

const Agents = () => {
  const [agentList, setAgentList] = useState([]);
  const [refreshData, setRefreshData] = useState({
    page: 1,
    pages: 0,
    perPage: 50,
    nextPage: 0,
    prevPage: 0,
    total: 0,
  });
  const [searchVal, setSearchVal] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(perPage[4].value);
  const [isFetching, setIsFetching] = useState(false);
  const [onClearFilters, setOnClearFilters] = useState(false);
  const [onFilterDomain, setOnFilterDomain] = useState(false);
  const [emailDomainsCount, setEmailDomainsCount] = useState({});
  const urlParams = new URLSearchParams(window.location.search);
  const stateParam = urlParams.get('state') ? urlParams.get('state') : '';
  const navigate = useNavigate();

  const handleChangePage = (e) => {
    if (e === '0' || e === '') return;
    refreshData.page = e;
    getRealtorsData();
  };

  const handlePrevPage = () => {
    if (refreshData.prevPage === null) return;
    refreshData.page = refreshData.prevPage;
    setIsFetching(true);
  };

  const handleNextPage = () => {
    if (refreshData.nextPage === null) return;
    refreshData.page = refreshData.nextPage;
    setIsFetching(true);
  };

  const handleColumnChange = (e) => {
    const val = e.target.value;
    setSelectedColumn(val);
    updateUrl();
  };

  const handleSearch = (e, type) => {
    if (e.which === 13 && type === '') {
      let val = e.target.value;
      e.preventDefault();
      if (val === '') return;
      setIsFetching(true);
      refreshData.page = 1;
      setSearchVal(val);
      updateUrl();
      getRealtorsData();
    }
    if (type === 'btnSearch') {
      if (searchVal === '') return;
      setIsFetching(true);
      refreshData.page = 1;
      updateUrl();
      getRealtorsData();
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
  };

  const handleStateChange = (e) => {
    const val = e.target.value;
    setSelectedCity('');
    setSelectedState(val);
    refreshData.page = 1;
  };

  const handleCityChange = (e) => {
    const val = e.target.value;
    setSelectedCity(val);
  };

  const handleSelectPerPage = (e) => {
    const val = e.target.value;
    setSelectedPerPage(val);
    refreshData.perPage = val;
    refreshData.page = 1;
  };

  const handleExportCSV = (e) => {
    if (selectedState === '') return;
    e.target.disabled = true;
    let url =
      process.env.REACT_APP_API_URL +
      '/exportCSV?state=' +
      selectedState +
      '&city=' +
      selectedCity;
    window.open(url, '_blank');
    e.target.disabled = false;
  };

  const getDomainFromEmail = (email) => {
    return email.substring(email.indexOf('@') + 1, email.length);
  };

  const handleFilterDomain = (email) => {
    refreshData.page = 1;
    setSelectedColumn('email');
    setSelectedState('');
    setSelectedCity('');
    setSearchVal(getDomainFromEmail(email));
    setOnFilterDomain(true);
  };

  const fetchEmailDomainsCount = (domains) =>
    getEmailDomainsCount(domains).then((response) => {
      setEmailDomainsCount(response.data);
    });

  useEffect(() => {
    if (stateParam !== '' && stateParam !== null) {
      const st = stateParam.toUpperCase();
      setSelectedState(st);
    }
    if (urlParams.get('city')) {
      setSelectedCity(urlParams.get('city'));
    }

    if (urlParams.get('perPage')) {
      refreshData.perPage = Number(urlParams.get('perPage'));
      setSelectedPerPage(Number(urlParams.get('perPage')));
    }
    if (urlParams.get('page')) {
      refreshData.page = urlParams.get('page');
    }
    if (urlParams.get('column')) {
      setSelectedColumn(urlParams.get('column'));
    }
    if (urlParams.get('search')) {
      setSearchVal(urlParams.get('search'));
    }
    getStatesData();
  }, []);

  useEffect(() => {
    if (agentList.length > 0) {
      const emailDomainsMap = [];

      for (const agent of agentList) {
        const agentEmail = agent.email.split('@');
        const domain = agentEmail[1];

        if (!emailDomainsMap.includes(domain)) {
          emailDomainsMap.push(domain);
        }
      }

      fetchEmailDomainsCount(emailDomainsMap);
    }
  }, [agentList]);

  useEffect(() => {
    updateUrl();
    getRealtorsData();
  }, [
    selectedState,
    selectedCity,
    selectedPerPage,
    refreshData.page,
    onClearFilters,
    onFilterDomain,
  ]);

  function updateUrl() {
    const searchParams = new URLSearchParams();
    searchParams.append('column', selectedColumn);
    searchParams.append('state', selectedState);
    searchParams.append('city', selectedCity);
    searchParams.append('perPage', selectedPerPage);
    searchParams.append('page', refreshData.page);
    searchParams.append('search', searchVal);
    navigate(`?${searchParams.toString()}`);
  }

  function getRealtorsData() {
    if (selectedState !== '') {
      getCitiesData();
    }
    setIsFetching(true);
    setOnClearFilters(false);
    setOnFilterDomain(false);
    setAgentList([]);
    getRealtors(
      refreshData.page,
      refreshData.perPage,
      selectedCity,
      selectedState,
      searchVal,
      selectedColumn
    )
      .then((res) => {
        //console.log(res);
        setIsFetching(false);
        setAgentList(res.data.realtors);
        setRefreshData({
          ...refreshData,
          //page: res.data.page,
          pages: res.data.pages,
          nextPage: res.data.next_page,
          prevPage: res.data.prev_page,
          total: res.data.total,
        });
        setIsFetching(false);
      })
      .catch((err) => {
        console.log(err);
        //Swal.fire("Error", "Unable to get data!", "error");
      });
  }

  function getStatesData() {
    getStates().then((res) => {
      setStates(res.data.states);
      const s = document.getElementById('stateDropDown');
      for (var x = 0; x < s.length; x++) {
        if (stateParam === s[x].value) {
          s[x].selected = 'selected';
        }
      }
    });
  }

  function getCitiesData() {
    getCities(selectedState).then((res) => {
      setCities(res.data.cities);
    });
  }

  function clearFilters() {
    setOnClearFilters(true);
    setSearchVal('');
    setSelectedColumn('');
    setSelectedState('');
    setSelectedCity('');
    setSelectedPerPage(50);
    setRefreshData({ ...refreshData, perPage: 50, page: 1 });

    document.getElementById('inputSearch').value = '';
    document.getElementById('searchDropDown').options[0].selected = 'selected';
    document.getElementById('stateDropDown').options[0].selected = 'selected';
    document.getElementById('cityDropDown').options[0].selected = 'selected';
    document.getElementById('perPageDropDown').options[1].selected = 'selected';
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
    table = document.getElementById('myTable');
    switching = true;
    dir = 'asc';

    while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName('TD')[n];
        y = rows[i + 1].getElementsByTagName('TD')[n];

        if (dir === 'asc') {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (dir === 'desc') {
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
        if (switchCount === 0 && dir === 'asc') {
          dir = 'desc';
          switching = true;
        }
      }
    }
  }

  return (
    <Layout>
      <div className="">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => {
                window.location.href = '/agents/newRecord';
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
                <label htmlFor="inputSearch" className="sr-only">
                  Search
                </label>
                <div className="flex mr-5">
                  <select
                    id="searchDropDown"
                    value={selectedColumn}
                    onChange={handleColumnChange}
                    style={{ width: '8.5rem' }}
                    className="text-sm p-2 text-gray-900 bg-white-500 rounded-tl-md rounded-bl-md border border-gray-300 outline-none"
                  >
                    <option className="font-semibold" value="">
                      Search by
                    </option>
                    {searchList.map((info, i) => (
                      <option key={i} value={info.value}>
                        {info.name}
                      </option>
                    ))}
                  </select>
                  <input
                    style={{ width: '16rem', borderLeft: 'none' }}
                    value={searchVal}
                    onKeyPress={(e) => handleSearch(e, '')}
                    onChange={(e) => handleSearchChange(e)}
                    type="text"
                    id="inputSearch"
                    className="relative p-2 pr-10 left-0 text-sm text-gray-900 bg-white-500 border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-800"
                    placeholder="Enter Keywords"
                  />
                  <div
                    onClick={() => handleSearch([], 'btnSearch')}
                    style={{ borderLeft: 'none' }}
                    className="flex px-2 border border-gray-300 inset-y-0  items-center rounded-tr-md rounded-br-md bg-gray-100 cursor-pointer"
                  >
                    <MagnifyingGlassIcon className="w-5 text-slate-600" />
                  </div>
                </div>

                <div
                  style={{ width: '12rem' }}
                  className="mr-5 relative text-left items-center"
                >
                  <select
                    id="stateDropDown"
                    onChange={handleStateChange}
                    className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border-none shadow-md focus:outline-none sm:text-sm"
                  >
                    <option className="font-semibold" value="">
                      Select State
                    </option>
                    {states.map((c) => (
                      <option
                        key={c.id}
                        value={c.name}
                        //selected={stateParam === c.name}
                      >
                        {c.name} - {c.longName}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  style={{ width: '12rem' }}
                  className="mr-5 relative text-left items-center"
                >
                  <select
                    id="cityDropDown"
                    value={selectedCity}
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
                    id="perPageDropDown"
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
                    style={{ width: '6rem' }}
                  >
                    Export CSV
                  </button>
                </div>

                <div className="mr-5 flex">
                  <a
                    onClick={clearFilters}
                    type="button"
                    className="underline cursor-pointer mt-2 hover:text-blue-500"
                    style={{ width: '6rem' }}
                  >
                    Clear filters
                  </a>
                </div>

                <div
                  className="mr-5 relative text-left w-30 items-center"
                  style={{ display: 'none' }}
                >
                  <Listbox
                    value={selectedPerPage}
                    onChange={setSelectedPerPage}
                  >
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
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'text-gray-900'
                              }`
                            }
                            value={pPage}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
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

              <div className="mt-5 mb-1">
                Total results:{' '}
                <span className="font-medium">
                  {isFetching ? '' : refreshData.total}
                </span>
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

                        <th scope="col" className="px-3 py-3.5"></th>
                        <th scope="col" className="px-3 py-3.5"></th>

                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        ></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {agentList.map((agent) => {
                        const domain = getDomainFromEmail(agent.email);
                        let numOfAgentsInDomain = '-';

                        if (domain in emailDomainsCount) {
                          numOfAgentsInDomain = emailDomainsCount[domain];
                        }

                        return (
                          <tr key={agent._id} className="hover:bg-gray-100">
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <a
                                href={`/agents/${agent._id}`}
                                className="hover:text-blue-500"
                              >
                                {agent.firstName}
                              </a>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <a
                                href={`/agents/${agent._id}`}
                                className="hover:text-blue-500"
                              >
                                {agent.lastName}
                              </a>
                            </td>
                            <td className=" px-3 py-4 text-sm text-gray-500">
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
                            <td
                              onClick={() => handleFilterDomain(agent.email)}
                              className="whitespace-nowrap px-3 py-4 text-sm text-yellow-500 hover:text-yellow-600 cursor-pointer"
                            >
                              {numOfAgentsInDomain.toLocaleString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-xs text-white">
                              <a
                                href={`//` + getDomainFromEmail(agent.email)}
                                target="_blank"
                                className="bg-green-500 hover:bg-green-600 hover:text-slate-200 p-1 px-2 rounded-md"
                              >
                                Visit Site
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
                        );
                      })}
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
                  Page <span className="font-medium">{refreshData.page}</span>{' '}
                  of <span className="font-medium">{refreshData.pages}</span>
                  <span className="text-sm ml-2 mr-4">
                    Go to page{' '}
                    <input
                      style={{ width: '60px' }}
                      onChange={(e) => handleChangePage(e.target.value)}
                      type="number"
                      min="1"
                      className="border text-left p-1 rounded-md outline-none focus:border-sky-300"
                    />{' '}
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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Agents;
