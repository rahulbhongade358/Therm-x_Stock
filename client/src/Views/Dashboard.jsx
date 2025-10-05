import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import AddStockModal from "../Components/AddStockModal";
import axios from "axios";
import { getCurrentuser } from "../utils/utils";

function Dashboard() {
  const [showModal, setShowModal] = useState(false);

  const [logginUser, setLogginUser] = useState(null);
  const [stocks, setStocks] = useState([]);
  const Stocks = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/allstocks`
    );
    setStocks(response.data.data);
  };
  useEffect(() => {
    setLogginUser(getCurrentuser());
  }, []);
  useEffect(() => {
    Stocks();
  }, [logginUser]);

  // Summary card data
  const summaryData = [
    { title: "Total Stock Items", value: stocks.length, color: "bg-blue-500" },
    {
      title: "Low Stock Items",
      value: stocks.filter((s) => s.quantity < s.minRequired).length,
      color: "bg-red-500",
    },
    { title: "Managed By", value: "Therm-X Team", color: "bg-yellow-500" },
  ];
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        {/* Main Section */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              📦 Stock Dashboard
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-lg shadow-md font-medium text-sm sm:text-base transition"
            >
              + Add Stock
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {summaryData.map((item, index) => (
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
                  <th className="px-3 sm:px-4 py-2 text-left">
                    Thickness (mm)
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-left">Size</th>
                  <th className="px-3 sm:px-4 py-2 text-left">Quantity</th>
                  <th className="px-3 sm:px-4 py-2 text-left">Min Required</th>
                  <th className="px-3 sm:px-4 py-2 text-left">Last Updated</th>
                  <th className="px-3 sm:px-4 py-2 text-left">Remarks</th>
                  <th className="px-3 sm:px-4 py-2 text-left">Company</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {stocks.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No stock data available.
                    </td>
                  </tr>
                ) : (
                  stocks.map((s) => (
                    <tr
                      key={s._id}
                      className={`border-b transition-all duration-150 hover:bg-gray-50 ${
                        s.quantity < s.minRequired ? "bg-red-50" : ""
                      }`}
                    >
                      <td className="px-3 sm:px-4 py-2">{s.thickness}</td>
                      <td className="px-3 sm:px-4 py-2">{s.size}</td>
                      <td className="px-3 sm:px-4 py-2 font-semibold">
                        {s.quantity}
                      </td>
                      <td className="px-3 sm:px-4 py-2">{s.minRequired}</td>
                      <td className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-500">
                        {s.lastUpdated}
                      </td>
                      <td className="px-3 sm:px-4 py-2">
                        {s.quantity < s.minRequired ? (
                          <span className="bg-red-100 text-red-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                            ⚠ Low Stock
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                            OK
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-2">{s.companyname}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="mt-4 text-gray-600 font-medium text-sm sm:text-base">
              Total Stocks: <span className="font-bold">{stocks.length}</span>
            </div>
          </div>

          {showModal && <AddStockModal onClose={() => setShowModal(false)} />}
        </main>
      </div>
    </div>
  );
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
}

export default Dashboard;
