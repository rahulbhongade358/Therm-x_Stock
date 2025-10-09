import axios from "axios";
import React, { useEffect, useState } from "react";
import { getCurrentuser } from "../utils/utils.js";
import { Link } from "react-router";
import toast, { Toaster } from "react-hot-toast";
function StockTable() {
  const [logginUser, setLogginUser] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [remnantstocks, setRemnantStocks] = useState([]);
  const [search, setSearch] = useState("");
  const Stocks = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/allstocks`
    );
    setStocks(response.data.data);
    setRemnantStocks(response.data.remnantstock);
  };
  const searchStock = async () => {
    toast.loading("🔎 Searching for stocks...", { id: "searching" });
    try {
      const searchResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/stocks/search?q=${search}`
      );
      setStocks(searchResponse.data.data);
      setRemnantStocks(searchResponse.data.remnantstock);
      toast.success(" Stocks updated successfully!", { id: "searching" });
    } catch (error) {
      toast.dismiss("searching");
      const message =
        error.response?.data?.message ||
        "⚠️ Unable to fetch stock data. Please try again later.";

      toast.error(message, { id: "search-error" });
      toast.dismiss();
      setStocks([]);
      setRemnantStocks([]);
    }
  };
  useEffect(() => {
    searchStock();
  }, [search]);
  useEffect(() => {
    setLogginUser(getCurrentuser());
  }, []);

  useEffect(() => {
    Stocks();
  }, [logginUser]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mx-4 sm:mx-6 mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        📋 Current Stock
      </h2>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="🔍 Search Stocks..."
            className="w-full sm:w-72 md:w-96 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition"
            >
              ✖
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm sm:text-base">
          <thead className="bg-gray-900 text-white uppercase text-xs sm:text-sm tracking-wide">
            <tr>
              <th className="px-3 sm:px-4 py-2 text-left">Thickness (mm)</th>
              <th className="px-3 sm:px-4 py-2 text-left">Size</th>
              <th className="px-3 sm:px-4 py-2 text-left">Quantity</th>
              <th className="px-3 sm:px-4 py-2 text-left">Min Required</th>
              <th className="px-3 sm:px-4 py-2 text-left">Last Updated</th>
              <th className="px-3 sm:px-4 py-2 text-left">Sheet Type</th>
              <th className="px-3 sm:px-4 py-2 text-left">Remarks</th>
              <th className="px-3 sm:px-4 py-2 text-left">Company</th>
              <th className="px-3 sm:px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {stocks.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
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
                  <td className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-500">
                    {s.sheetType}
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
                  {logginUser ? (
                    <Link to={`/update/${s._id}`}>
                      <td className="px-3 sm:px-4 py-2 text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                        Update
                      </td>
                    </Link>
                  ) : (
                    <td className="px-3 sm:px-4 py-2 text-gray-400 cursor-not-allowed">
                      Update
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
          <tbody className="text-gray-700">
            {remnantstocks.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No remnant stock data available.
                </td>
              </tr>
            ) : (
              remnantstocks.map((s) => (
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
                  <td className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-500">
                    {s.sheetType}
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
                  {logginUser ? (
                    <Link to={`/update/${s._id}`}>
                      <td className="px-3 sm:px-4 py-2 text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                        Update
                      </td>
                    </Link>
                  ) : (
                    <td className="px-3 sm:px-4 py-2 text-gray-400 cursor-not-allowed">
                      Update
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-gray-600 font-medium text-sm sm:text-base">
        Total regular Stocks:{" "}
        <span className="font-bold">{stocks.length} </span>
        Total remnant Stocks:{" "}
        <span className="font-bold">{remnantstocks.length}</span>
      </div>
      <Toaster className="position top right" />
    </div>
  );
}

export default StockTable;
