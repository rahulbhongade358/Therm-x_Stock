import React, { useEffect, useRef, useState } from "react";
import { getCurrentuser } from "./../utils/utils.js";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { ReactSketchCanvas } from "react-sketch-canvas";
function AddStockModal({ onClose }) {
  const [user, setUser] = useState(null);
  const [newStock, setNewStock] = useState({
    sheetType: "regular",
    thickness: "",
    size: "",
    quantity: "",
    remarks: "",
    addedBy: "",
    companyname: "",
    sheetCanvas: "",
  });
  const canvasRef = useRef(null);
  const saveCanva = async () => {
    const canvaData = await canvasRef.current.exportImage("png");
    setNewStock((prev) => ({ ...prev, sheetCanvas: canvaData }));
    toast.success("Shape Saved Successfully");
  };
  const addstock = async () => {
    try {
      const payload = { ...newStock, addedBy: user?._id };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/stocks`,
        payload
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error saving stock");
    }
  };
  useEffect(() => {
    setUser(getCurrentuser());
  }, []);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[95%] sm:w-[450px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Add New Stock
        </h2>
        <div className="flex justify-center mb-4">
          <p
            className="px-4 py-2 rounded-lg 
              bg-blue-600 text-white"
          >
            Regular Sheet
          </p>
        </div>
        <div className="flex flex-col gap-3">
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
            type="number"
            placeholder="Quantity"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newStock.quantity}
            onChange={(e) =>
              setNewStock({ ...newStock, quantity: e.target.value })
            }
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
          <label htmlFor="sheetType">Sheet Type:</label>
          <select
            id="sheetType"
            value={newStock.sheetType}
            onChange={(e) =>
              setNewStock({ ...newStock, sheetType: e.target.value })
            }
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="regular">Regular</option>
            <option value="remnant">Remnant</option>
          </select>
          {newStock?.sheetType === "remnant" ? (
            <div>
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
              <div className="border rounded-md shadow-sm overflow-hidden">
                <ReactSketchCanvas
                  ref={canvasRef}
                  width="100%"
                  height="350px"
                  strokeWidth={3}
                  strokeColor="black"
                />
              </div>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => canvasRef.current.clearCanvas()}
                  className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Clear
                </button>
                <button
                  onClick={saveCanva}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save Shape
                </button>
              </div>
            </div>
          ) : null}
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

export default AddStockModal;
