import axios from "axios";
import React, { useEffect, useState } from "react";
import { getCurrentuser } from "../utils/utils.js";
import { Link } from "react-router";
function StockTable() {
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

  console.log("This is stocks", stocks.length);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mx-4 sm:mx-6 mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        📋 Current Stock
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm sm:text-base">
          <thead className="bg-gray-900 text-white uppercase text-xs sm:text-sm tracking-wide">
            <tr>
              <th className="px-3 sm:px-4 py-2 text-left">Thickness (mm)</th>
              <th className="px-3 sm:px-4 py-2 text-left">Size</th>
              <th className="px-3 sm:px-4 py-2 text-left">Quantity</th>
              <th className="px-3 sm:px-4 py-2 text-left">Min Required</th>
              <th className="px-3 sm:px-4 py-2 text-left">Last Updated</th>
              <th className="px-3 sm:px-4 py-2 text-left">Remarks</th>
              <th className="px-3 sm:px-4 py-2 text-left">Company</th>
              <th className="px-3 sm:px-4 py-2 text-left">Action</th>
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
                  <Link to={`/update/${s._id}`}>
                    <td className="px-3 sm:px-4 py-2">Update</td>
                  </Link>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-gray-600 font-medium text-sm sm:text-base">
        Total Stocks: <span className="font-bold">{stocks.length}</span>
      </div>
    </div>
  );
}

export default StockTable;
