import React, { useRef, useEffect, useState } from "react";
import { getCurrentuser } from "../utils/utils.js";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import axios from "axios";
import { Link } from "react-router";
function AddStockRemnantModal({ onClose }) {
  const [user, setUser] = useState(null);
  const [sheetOptions, setSheetOptions] = useState([]);
  const [newStock, setNewStock] = useState({
    sheetType: "remnant",
    thickness: "",
    size: "",
    quantity: "1",
    remarks: "",
    addedBy: "",
    companyname: "",
    shapeDescription: "",
    sheetCanvas: "",
  });
  let canvaData = localStorage.getItem("sheetCanvas");

  const addstock = async () => {
    try {
      const sheetData = localStorage.getItem("newStockForm");
      const restoredStock = sheetData ? JSON.parse(sheetData) : newStock;
      const payload = {
        ...restoredStock,
        sheetCanvas: canvaData,
        addedBy: user?._id,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/remnantstocks`,
        payload
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        localStorage.removeItem("sheetCanvas");
        localStorage.removeItem("newStockForm");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error saving stock");
    }
  };
  const fetchSheets = async () => {
    try {
      const searchResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/allstocks`
      );
      setSheetOptions(searchResponse.data.data);
      const formatted = searchResponse.data.data.map((sheet) => ({
        value: sheet._id,
        label: `${sheet.thickness}mm × ${sheet.size} (${sheet.companyname})`,
      }));
      setSheetOptions(formatted);
    } catch (error) {
      console.error("Error fetching sheets:", error);
    }
  };

  useEffect(() => {
    setUser(getCurrentuser());
    fetchSheets();
    const savedForm = localStorage.getItem("newStockForm");
    if (savedForm) {
      setNewStock(JSON.parse(savedForm));
    }
  }, []);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[95%] sm:w-[450px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Add Remnant Stock
        </h2>
        <div className="flex justify-center mb-4">
          <p
            className="px-4 py-2 rounded-lg 
              bg-blue-600 text-white"
          >
            Remnant Sheet
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <label className="block text-gray-700 font-medium mb-2">
            Select Original Sheet
          </label>
          <Select
            options={sheetOptions}
            value={
              sheetOptions.find(
                (opt) => opt.value === newStock.orignalsheetid
              ) || null
            }
            onChange={(selected) =>
              setNewStock({ ...newStock, orignalsheetid: selected.value })
            }
            placeholder="Search or select original sheet..."
            isSearchable
          />
          <input
            type="number"
            placeholder="Thickness (mm)"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newStock.thickness}
            onChange={(e) =>
              setNewStock({ ...newStock, thickness: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Size (mm x mm)"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newStock.size}
            onChange={(e) => setNewStock({ ...newStock, size: e.target.value })}
          />

          <input
            type="text"
            placeholder="Company Name"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newStock.companyname}
            onChange={(e) =>
              setNewStock({ ...newStock, companyname: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Remarks"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newStock.remarks}
            onChange={(e) =>
              setNewStock({ ...newStock, remarks: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Shape Description"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newStock.shapeDescription}
            onChange={(e) =>
              setNewStock({ ...newStock, shapeDescription: e.target.value })
            }
          />
          <label className="text-sm font-semibold mt-2">Draw Shape:</label>
          <div className="max-w-4xl mx-auto p-4">
            <Link
              to="/canvas"
              onClick={() =>
                localStorage.setItem("newStockForm", JSON.stringify(newStock))
              }
            >
              Draw Shape
            </Link>
          </div>
          <div>
            <h2>Preview:</h2>
            {canvaData ? (
              <img
                src={canvaData}
                alt="Sheet Canvas"
                className="w-70 h-50  border border-gray-300 rounded-lg shadow-sm"
              />
            ) : (
              <div className="w-56 h-40 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-400 italic text-sm">
                No Preview
              </div>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="w-1/2 mr-2 px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              onClick={addstock}
              className="w-1/2 ml-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default AddStockRemnantModal;
