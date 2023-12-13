import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getDomains } from '../api';
import Spinner from '../components/Spinner';

const Domains = () => {
  const [domains, setDomains] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isDescAgent, setIsDescAgent] = useState(true);
  const [isDescDomain, setIsDescDomain] = useState(false);
  const [paginatedData, setPaginatedData] = useState({});
  const [data, setData] = useState({ page: 1, per_page: 50 });

  const fetchDomains = () => {
    setIsFetching(true);
    getDomains().then((res) => {
      const sorted = Object.fromEntries(
        Object.entries(res.data).sort(([, a], [, b]) => b - a)
      );
      setDomains(sorted);
      setIsFetching(false);
    });
  };

  const sortTable = (col) => {
    let sorted = {};
    setPaginatedData({});
    if (col === 1) {
      sorted = Object.fromEntries(
        Object.entries(paginatedData).sort((a, b) => {
          if (isDescDomain) {
            return a < b ? -1 : 1;
          } else {
            return a > b ? -1 : 1;
          }
        })
      );
      setIsDescDomain(!isDescDomain);
    } else if (col === 2) {
      sorted = Object.fromEntries(
        Object.entries(paginatedData).sort(([, a], [, b]) => {
          if (isDescAgent) {
            return a - b;
          } else {
            return b - a;
          }
        })
      );
      setIsDescAgent(!isDescAgent);
    }

    setPaginatedData(sorted);
  };

  const getTotalPages = () => {
    return Math.ceil(Object.entries(domains).length / data.per_page);
  };

  const nextPage = () => {
    if (data.page < getTotalPages()) setData({ ...data, page: data.page + 1 });
  };

  const prevPage = () => {
    if (data.page > 1) setData({ ...data, page: data.page - 1 });
  };

  useEffect(() => {
    let obj = {};
    const arrayDomain = Object.entries(domains);

    for (let i = (data.page - 1) * data.per_page; i < data.page * data.per_page && i < arrayDomain.length; i++) {
      obj[arrayDomain[i][0]] = arrayDomain[i][1];
    }

    setPaginatedData(obj);
  }, [data, domains]);

  useEffect(() => {
    fetchDomains();
  }, []);

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-10">Domains</h1>
        {isFetching ? (
          <div className="flex justify-center p-40">
            {' '}
            <Spinner size={16} />
          </div>
        ) : (
          <div>
            <span>
              Total results:
              <span className="ml-1 font-semibold">
                {Object.entries(domains).length}
              </span>
            </span>
            <div className="mt-1 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table
                id="myTable"
                className="min-w-full divide-y divide-gray-300"
              >
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Domain
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
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Agents
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
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {Object.keys(paginatedData).map((key, index) => {
                    const domain = key;
                    const agents = domains[key];

                    return (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <a
                            href={`/agents?column=email&state=&city=&perPage=50&page=1&search=${domain}`}
                            target="_blank"
                            className="hover:text-blue-600"
                          >
                            {domain}
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-500">
                          {agents.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                          <a
                            href={`//${domain}`}
                            target="_blank"
                            className="text-xs bg-green-500 hover:bg-green-600 hover:text-slate-200 p-1 px-2 rounded-md"
                          >
                            Visit Site
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="mr-5">
                Page {data.page} of {getTotalPages()}
              </span>

              <div>
                <button
                  onClick={prevPage}
                  className="p-2 px-5 bg-white mr-3 shadow rounded-md text-sm text-gray-500 hover:font-semibold"
                >
                  Prev
                </button>
                <button
                  onClick={nextPage}
                  className="p-2 px-5 bg-white shadow rounded-md text-sm text-gray-500 hover:font-semibold"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Domains;
