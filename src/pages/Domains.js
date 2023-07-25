import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getDomains } from '../api';
import Spinner from '../components/Spinner';

const Domains = () => {
  const [domains, setDomains] = useState({});
  const [isFetching, setIsFetching] = useState(false);

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
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Domain
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Agents
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {Object.keys(domains).map((key, index) => {
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Domains;
