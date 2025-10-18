import axios from "axios";
import React, { useEffect, useState } from "react";
import { getCurrentuser } from "../utils/utils.js";
import { Link } from "react-router";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(" Therm-x Stock Report", 100, 20, {
      align: "center",
      width: 150,
      fontSize: 20,
      fontWeight: "bold",
      textColor: [22, 160, 133],
    });

    const allData = [...stocks, ...remnantstocks].map((s) => [
      s.thickness,
      s.size,
      s.quantity,
      s.companyname,
      s.sheetType,
      s.lastUpdated ? new Date(s.lastUpdated).toLocaleString("en-IN") : "—",
    ]);

    autoTable(doc, {
      head: [
        [
          "Thickness (mm)",
          "Size",
          "Quantity",
          "Company",
          "Type",
          "Last Updated",
        ],
      ],
      body: allData,
      startY: 35,
      styles: { fontSize: 12, cellPadding: 3 },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    doc.save("Stock_Report.pdf");
  };
  const exportToExcel = () => {
    const allData = [...stocks, ...remnantstocks].map((s) => ({
      Thickness: s.thickness,
      Size: s.size,
      Quantity: s.quantity,
      Company: s.companyname,
      Type: s.sheetType,
      "Last Updated": s.lastUpdated
        ? new Date(s.lastUpdated).toLocaleString("en-IN")
        : "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(allData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Therm-x Stock Report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellDates: true,
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Stock_Report.xlsx");
  };

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
        <div className="flex gap-2">
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-green-700 transition"
          >
            📄 Download Pdf
          </button>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            📊 Download Excel
          </button>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border border-gray-200 rounded-lg overflow-hidden text-sm sm:text-base table-auto">
          <thead className="bg-gray-900 text-white text-xs sm:text-sm">
            <tr>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                Thickness (mm)
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Size</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                Quantity
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                Last Updated
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                Sheet Type
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Company</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Action</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 divide-y">
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
                  className="hover:bg-gray-50 transition-all duration-150 cursor-pointer"
                >
                  <td className="px-4 py-2">
                    <Link
                      to={`/stockdetails/${s._id}`}
                      className="block w-full h-full"
                    >
                      {s.thickness}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/stockdetails/${s._id}`}
                      className="block w-full h-full"
                    >
                      {s.size}
                    </Link>
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    <Link
                      to={`/stockdetails/${s._id}`}
                      className="block w-full h-full"
                    >
                      {s.quantity}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-500 text-sm">
                    <Link
                      to={`/stockdetails/${s._id}`}
                      className="block w-full h-full"
                    >
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
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-500 text-sm">
                    <Link
                      to={`/stockdetails/${s._id}`}
                      className="block w-full h-full"
                    >
                      {s.sheetType}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/stockdetails/${s._id}`}
                      className="block w-full h-full"
                    >
                      {s.companyname}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    {logginUser ? (
                      <Link
                        to={`/update/${s._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Update
                      </Link>
                    ) : (
                      <span className="text-gray-400 cursor-not-allowed">
                        Update
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>

          <tbody className="text-gray-700 divide-y ">
            {remnantstocks.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No stock data available.
                </td>
              </tr>
            ) : (
              remnantstocks.map((s) => (
                <tr
                  key={s._id}
                  className="hover:bg-gray-50 transition-all duration-150 cursor-pointer"
                >
                  <td className="px-4 py-2">
                    <Link
                      to={`/stockdetails/${s._id}`}
                      className="block w-full h-full"
                    >
                      {s.thickness}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/stockdetails/${s._id}`}
                      className="block w-full h-full"
                    >
                      {s.size}
                    </Link>
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    <Link
                      to={`/stockdetails/${s._id}`}
                      className="block w-full h-full"
                    >
                      {s.quantity}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-500 text-sm">
                    <Link
                      to={`/stockdetails/${s._id}`}
                      className="block w-full h-full"
                    >
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
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-500 text-sm">
                    <Link
                      to={`/stockdetails/${s._id}`}
                      className="block w-full h-full"
                    >
                      {s.sheetType}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/stockdetails/${s._id}`}
                      className="block w-full h-full"
                    >
                      {s.companyname}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    {logginUser ? (
                      <Link
                        to={`/updateremnant/${s._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Update
                      </Link>
                    ) : (
                      <span className="text-gray-400 cursor-not-allowed">
                        Update
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Toaster className="position top right" />
    </div>
  );
}

export default StockTable;
