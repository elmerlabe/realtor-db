import {
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { getAgentsPerState, getDatabaseSummary, getStates } from "../api";
import Spinner from "./Spinner";

const cards = [
  { name: "Total Agents", icon: UsersIcon },
  { name: "Total Emails", icon: EnvelopeIcon },
  {
    name: "Total Phone Numbers",
    icon: DevicePhoneMobileIcon,
  },
];

const Home = () => {
  const token = localStorage.getItem("token");
  const [dbSummary, setDbSummary] = useState([]);
  const [agentsPerState, setAgentsPerState] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    getDatabaseSummary().then((res) => {
      const d = res.data;
      setDbSummary([d.agents, d.emails, d.phones]);
    });
    setIsFetching(true);
    getAgentsPerState().then((res) => {
      setAgentsPerState(res.data.agentsPerState);
      setIsFetching(false);
    });
  }, []);

  function sortTable(n, type) {
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
          if (
            x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase() &&
            type === "str"
          ) {
            shouldSwitch = true;
            break;
          }
          if (Number(x.innerHTML) > Number(y.innerHTML) && type === "num") {
            shouldSwitch = true;
            break;
          }
        } else if (dir === "desc") {
          if (
            x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase() &&
            type === "str"
          ) {
            shouldSwitch = true;
            break;
          }
          if (Number(x.innerHTML) < Number(y.innerHTML) && type === "num") {
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

  return (
    <div>
      <div className="mt-8">
        <div className="mx-auto">
          <h2 className="text-lg font-medium leading-6 text-gray-900">
            Database summary
          </h2>
          <div className="mt-2 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
            {cards.map((card, i) => (
              <div
                key={card.name}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div>
                      <card.icon className="h-7 w-7 text-gray-400" />
                    </div>
                    <div className="flex-1 ml-5 w-0">
                      <dl>
                        <dt className="font-semibold text-gray-500 text-sm">
                          {card.name}
                        </dt>
                        <dd className="font-semibold text-lg">
                          {dbSummary.length != 0 ? dbSummary[i] : "---"}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-800 px-5 py-1"></div>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-lg max-w-6xl font-medium leading-6 text-gray-900">
            Number of agents per state
          </h2>
          <div className="mt-2">
            <div className="mx-auto">
              <div className="flex flex-col">
                {isFetching ? (
                  <div className="flex justify-center p-40">
                    <Spinner size={16} />
                  </div>
                ) : (
                  <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                    <table
                      id="myTable"
                      className="min-w-full divide-y divide-gray-300"
                    >
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                          >
                            <div className="flex items-center">
                              State
                              <button onClick={() => sortTable(0, "str")}>
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
                            className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                          >
                            -
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                          >
                            <div className="flex items-center">
                              Agents
                              <button onClick={() => sortTable(2, "num")}>
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
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {agentsPerState.map((state, i) => (
                          <tr key={state.id} className="hover:bg-gray-100">
                            <td className="w-auto max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              <a
                                href={"/agents?state=" + state.name}
                                className="hover:text-blue-500"
                              >
                                {state.longName}
                              </a>
                            </td>
                            <td className="md:w-1/2 max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              {state.name}
                            </td>
                            <td className="w-auto max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900 font-semibold">
                              {state.totalAgents}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
