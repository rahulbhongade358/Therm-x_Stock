import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import AddStockModal from "../Components/AddStockModal";
import AddStockRemnantModal from "../Components/AddRemnantStockModal ";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { getCurrentuser } from "../utils/utils";

function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showRemnantModal, setShowRemnantModal] = useState(false);
  const [remnantstocks, setRemnantStocks] = useState([]);
  const [logginUser, setLogginUser] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [showgraph, setShowgraph] = useState(false);
  const [loading, setLoading] = useState(false);
  const Stocks = async () => {
    setLoading(true);
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/allstocks`
    );
    setStocks(response.data.data);
    setRemnantStocks(response.data.remnantstock);
    setLoading(false);
  };
  useEffect(() => {
    setLogginUser(getCurrentuser());
  }, []);
  useEffect(() => {
    Stocks();
  }, [logginUser]);
  const totalRemnantQuantity =
    stocks
      .filter((s) => s.sheetType === "remnant")
      .reduce((acc, s) => acc + s.quantity, 0) +
    remnantstocks
      .filter((s) => s.sheetType === "remnant")
      .reduce((acc, s) => acc + s.quantity, 0);
  const totalRemnantCount =
    (stocks?.filter((s) => s.sheetType === "remnant").length || 0) +
    (remnantstocks?.filter((s) => s.sheetType === "remnant").length || 0);

  const summaryData = [
    {
      title: "Total Regular Stock Items",
      value: stocks.filter((s) => s.sheetType === "regular").length,
      color: "bg-blue-500",
    },
    {
      title: "Total Remnant-Stock Items",
      value: totalRemnantCount,
      color: "bg-green-500",
    },
    {
      title: "Total Quantity of Regular Stock",
      value: stocks
        .filter((s) => s.sheetType === "regular")
        .reduce((acc, s) => acc + s.quantity, 0),
      color: "bg-purple-500",
    },
    {
      title: "Total Quantity of Remnant Stock",
      value: totalRemnantQuantity,
      color: "bg-purple-500",
    },
    { title: "Managed By", value: "Therm-X Team", color: "bg-yellow-500" },
  ];
  const limitedStocksItems = stocks.slice(0, 4);
  const limitedRemnantItems = remnantstocks.slice(0, 4);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 ">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              📦 Stock Dashboard
            </h2>
            {loading ? (
              <div className="flex gap-3 mt-3 sm:mt-0">
                <>
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      width={110}
                      height={40}
                      baseColor="#d1d5db"
                      highlightColor="#f3f4f6"
                      borderRadius={8}
                    />
                  ))}
                </>
              </div>
            ) : (
              logginUser && (
                <div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="mr-3 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-lg shadow-md font-medium text-sm sm:text-base transition"
                  >
                    + Add Stock
                  </button>
                  <button
                    onClick={() => setShowRemnantModal(true)}
                    className="mr-3 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-lg shadow-md font-medium text-sm sm:text-base transition"
                  >
                    + Add Remnant
                  </button>
                  <button
                    className={`${
                      !showgraph ? "bg-blue-600" : "bg-gray-400"
                    } hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-lg shadow-md font-medium text-sm sm:text-base transition`}
                    onClick={() => setShowgraph(!showgraph)}
                  >
                    Show Graph
                  </button>
                </div>
              )
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {showgraph &&
              summaryData.map((item, index) => (
                <SummaryCard
                  key={index}
                  title={item.title}
                  value={item.value}
                  color={item.color}
                />
              ))}
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              📋 Current Stock List
            </h3>
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm sm:text-base">
              <thead className="bg-gray-900 text-white uppercase text-xs sm:text-sm tracking-wide">
                <tr>
                  <th className="px-3 sm:px-4 py-2 text-left">Thickness</th>
                  <th className="px-3 sm:px-4 py-2 text-left">Size</th>
                  <th className="px-3 sm:px-4 py-2 text-left">Quantity</th>
                  <th className="px-3 sm:px-4 py-2 text-left">Last Updated</th>
                  <th className="px-3 sm:px-4 py-2 text-left">Company</th>
                </tr>
              </thead>

              {loading ? (
                <tr>
                  <td colSpan="5">
                    <Skeleton
                      count={2}
                      height={40}
                      baseColor="#f3f4f6"
                      highlightColor="#e5e7eb"
                      borderRadius={8}
                      width={"100%"}
                    />
                  </td>
                </tr>
              ) : stocks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No stock data available
                  </td>
                </tr>
              ) : (
                <tbody className="text-gray-700">
                  {limitedStocksItems.map((s) => (
                    <tr
                      key={s._id}
                      className="border-b transition-all duration-150 hover:bg-gray-50"
                    >
                      <td className="px-3 sm:px-4 py-2">{s.thickness}</td>
                      <td className="px-3 sm:px-4 py-2">{s.size}</td>
                      <td className="px-3 sm:px-4 py-2 font-semibold">
                        {s.quantity}
                      </td>
                      <td className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-500">
                        {s.lastUpdated
                          ? new Date(s.lastUpdated).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "—"}
                      </td>
                      <td className="px-3 sm:px-4 py-2">{s.companyname}</td>
                    </tr>
                  ))}
                </tbody>
              )}
              {loading ? (
                <tr>
                  <td colSpan="5">
                    <Skeleton
                      count={2}
                      height={40}
                      baseColor="#f3f4f6"
                      highlightColor="#e5e7eb"
                      borderRadius={8}
                      width={"100%"}
                    />
                  </td>
                </tr>
              ) : remnantstocks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No remnant data available
                  </td>
                </tr>
              ) : (
                <tbody className="text-gray-700">
                  {limitedRemnantItems.map((s) => (
                    <tr
                      key={s._id}
                      className={`border-b transition-all duration-150 hover:bg-gray-50`}
                    >
                      <td className="px-3 sm:px-4 py-2">{s.thickness}</td>
                      <td className="px-3 sm:px-4 py-2">{s.size}</td>
                      <td className="px-3 sm:px-4 py-2 font-semibold">
                        {s.quantity}
                      </td>
                      <td className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-500">
                        {s.lastUpdated
                          ? new Date(s.lastUpdated).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "—"}
                      </td>
                      <td className="px-3 sm:px-4 py-2">{s.companyname}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
            <div className="mt-4 rounded-2xl shadow-md text-white bg-indigo-500 w-fit p-4 font-medium text-sm sm:text-base transition transform hover:scale-105">
              Total Stocks:{" "}
              <span className="font-bold">{`${
                stocks.length + remnantstocks.length
              }`}</span>
            </div>
          </div>

          {showModal && <AddStockModal onClose={() => setShowModal(false)} />}
          {showRemnantModal && (
            <AddStockRemnantModal onClose={() => setShowRemnantModal(false)} />
          )}
        </main>
      </div>
    </div>
  );
}
{
  /* Summary Card Component */
}
function SummaryCard({ title, value, color }) {
  return (
    <div
      className={`rounded-2xl shadow-md p-4 sm:p-5 text-white ${color} transition transform hover:scale-105`}
    >
      <h4 className="text-xs sm:text-sm opacity-90">{title}</h4>
      <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{value}</p>
    </div>
  );
}

export default Dashboard;
