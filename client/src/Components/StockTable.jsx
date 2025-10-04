import axios from "axios";
import React, { useEffect, useState } from "react";
import { getCurrentuser } from "../utils/utils.js";

function StockTable() {
  const [logginUser, setLogginUser] = useState(null);
  const [stocks, setStocks] = useState([]);
  const Stocks = async () => {
    const response = await axios(`${import.meta.env.VITE_API_URL}/allstocks`);
    setStocks(response.data.data);
  };
  useEffect(() => {
    setLogginUser(getCurrentuser());
  }, []);
  useEffect(() => {
    Stocks();
  }, [logginUser]);
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Current Stock
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Thickness (mm)</th>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-left">Quantity</th>
              <th className="px-4 py-3 text-left">Min Required</th>
              <th className="px-4 py-3 text-left">Last Updated</th>
              <th className="px-4 py-3 text-left">Remarks</th>
              <th className="px-4 py-3 text-left">Company</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {stocks.map((s) => (
              <tr
                key={s.id}
                className={`border-b hover:bg-gray-50 ${
                  s.quantity < s.minRequired ? "bg-red-100" : ""
                }`}
              >
                <td className="px-4 py-3">{s.thickness}</td>
                <td className="px-4 py-3">{s.size}</td>
                <td className="px-4 py-3 font-semibold">{s.quantity}</td>
                <td className="px-4 py-3">{s.minRequired}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {s.lastUpdated}
                </td>
                <td className="border-r px-4 py-2">
                  {s.quantity > s.minRequired ? (
                    <span className="text-red-600 font-semibold">
                      ⚠ Low Stock
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">OK</span>
                  )}
                </td>
                <td className="px-4 py-3">{s.companyname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockTable;
