import React, { useEffect, useState } from "react";
import { getCurrentuser } from "./../utils/utils.js";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router";

function AddStockModal({ onClose }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dimensions, setDimensions] = useState([{ length: "", width: "" }]);
  const [newStock, setNewStock] = useState({
    sheetType: "regular",
    thickness: "",
    length: "",
    width: "",
    quantity: "",
    remarks: "",
    addedBy: "",
    companyname: "",
    shapeDescription: "",
    sheetCanvas: "",
  });

  const canvaData = localStorage.getItem("sheetCanvas");

  // Add new length-width pair (for remnant)
  const handleAddDimension = () => {
    setDimensions([...dimensions, { length: "", width: "" }]);
  };

  // Update particular dimension
  const handleDimensionChange = (index, field, value) => {
    const updated = [...dimensions];
    updated[index][field] = value;
    setDimensions(updated);
  };

  // Validate before saving
  const validateForm = () => {
    if (!newStock.thickness || !newStock.quantity || !newStock.companyname) {
      toast.error("Please fill in all required fields!");
      return false;
    }

    if (newStock.sheetType === "regular") {
      if (!newStock.length || !newStock.width) {
        toast.error("Please enter length and width for regular sheet!");
        return false;
      }
    } else if (newStock.sheetType === "remnant") {
      if (!dimensions.length || dimensions.some((d) => !d.length || !d.width)) {
        toast.error("Please fill in all remnant dimensions!");
        return false;
      }
    }

    return true;
  };

  // Navigate to Canvas
  const handleDrawShape = () => {
    if (!validateForm()) return;
    localStorage.setItem("newStockForm", JSON.stringify(newStock));
    navigate("/canvas");
  };

  // Save stock data
  const addStock = async () => {
    try {
      if (!validateForm()) return;

      setIsSubmitting(true);
      const sheetData = localStorage.getItem("newStockForm");
      const restoredStock = sheetData ? JSON.parse(sheetData) : newStock;

      const payload =
        newStock.sheetType === "remnant"
          ? {
              ...restoredStock,
              dimensions,
              sheetCanvas: canvaData,
              addedBy: user?._id,
            }
          : {
              ...restoredStock,
              sheetCanvas: canvaData,
              addedBy: user?._id,
            };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/stocks`,
        payload
      );

      if (response?.data?.success) {
        toast.success(response.data.message);
        localStorage.removeItem("sheetCanvas");
        localStorage.removeItem("newStockForm");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error saving stock");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  useEffect(() => {
    setUser(getCurrentuser());
    const savedForm = localStorage.getItem("newStockForm");
    if (savedForm) {
      setNewStock(JSON.parse(savedForm));
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[95%] sm:w-[450px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Add New Stock
        </h2>

        {/* Sheet Type Selector */}
        <label htmlFor="sheetType" className="font-semibold">
          Sheet Type:
        </label>
        <select
          id="sheetType"
          value={newStock.sheetType}
          onChange={(e) =>
            setNewStock({ ...newStock, sheetType: e.target.value })
          }
          className="border border-gray-300 w-full px-3 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="regular">Regular</option>
          <option value="remnant">Remnant</option>
        </select>

        {/* Common Inputs */}
        <div className="flex flex-col gap-3">
          <input
            type="number"
            placeholder="Thickness (mm)"
            className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
            value={newStock.thickness}
            onChange={(e) =>
              setNewStock({ ...newStock, thickness: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
            value={newStock.quantity}
            onChange={(e) =>
              setNewStock({ ...newStock, quantity: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Company Name"
            className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
            value={newStock.companyname}
            onChange={(e) =>
              setNewStock({ ...newStock, companyname: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Remarks"
            className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
            value={newStock.remarks}
            onChange={(e) =>
              setNewStock({ ...newStock, remarks: e.target.value })
            }
          />
        </div>

        {/* Regular Sheet Inputs */}
        {newStock.sheetType === "regular" && (
          <div className="flex flex-col gap-3 mt-3">
            <input
              type="number"
              placeholder="Length (mm)"
              className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
              value={newStock.length}
              onChange={(e) =>
                setNewStock({ ...newStock, length: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Width (mm)"
              className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
              value={newStock.width}
              onChange={(e) =>
                setNewStock({ ...newStock, width: e.target.value })
              }
              required
            />
          </div>
        )}

        {/* Remnant Sheet Inputs */}
        {newStock.sheetType === "remnant" && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Remnant Dimensions:</h3>
            {dimensions.map((dim, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="number"
                  placeholder={`L${index + 1} (mm)`}
                  value={dim.length}
                  onChange={(e) =>
                    handleDimensionChange(index, "length", e.target.value)
                  }
                  className="border px-3 py-2 rounded-md w-1/2"
                />
                <input
                  type="number"
                  placeholder={`W${index + 1} (mm)`}
                  value={dim.width}
                  onChange={(e) =>
                    handleDimensionChange(index, "width", e.target.value)
                  }
                  className="border px-3 py-2 rounded-md w-1/2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDimension}
              className="text-blue-600 text-sm font-semibold hover:underline mb-2"
            >
              + Add More Dimensions
            </button>

            <input
              type="text"
              placeholder="Shape Description"
              className="border px-3 py-2 rounded-md w-full mb-2"
              value={newStock.shapeDescription}
              onChange={(e) =>
                setNewStock({ ...newStock, shapeDescription: e.target.value })
              }
            />

            <button
              onClick={handleDrawShape}
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Draw Shape
            </button>

            <div className="mt-3">
              <h4 className="font-semibold">Preview:</h4>
              {canvaData ? (
                <img
                  src={canvaData}
                  alt="Sheet Canvas"
                  className="w-64 h-48 border rounded-lg shadow-sm"
                />
              ) : (
                <div className="w-64 h-48 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-400 italic text-sm">
                  No Preview
                </div>
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="w-1/2 mr-2 px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={addStock}
            disabled={isSubmitting}
            className={`w-1/2 ml-2 px-4 py-2 rounded-lg font-semibold text-white transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default AddStockModal;
