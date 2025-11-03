import React, { useEffect, useState } from "react";
import { getCurrentuser } from "./../utils/utils.js";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router";

function AddStockModal() {
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
    <div className="min-h-screen bg-gray-50 text-gray-800 p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          Add New Stock
        </h1>

        {/* --- Sheet Type Section --- */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">
            Sheet Type
          </h2>
          <select
            value={newStock.sheetType}
            onChange={(e) =>
              setNewStock({ ...newStock, sheetType: e.target.value })
            }
            className="px-4 py-2 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400"
          >
            <option value="regular">Regular</option>
            <option value="remnant">Remnant</option>
          </select>
        </section>

        {/* --- Common Info Section --- */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">
            Common Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="font-medium">Thickness (mm)</p>
              <input
                type="number"
                value={newStock.thickness}
                onChange={(e) =>
                  setNewStock({ ...newStock, thickness: e.target.value })
                }
                className="mt-1 w-full border-b border-gray-400 bg-transparent focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <p className="font-medium">Quantity</p>
              <input
                type="number"
                value={newStock.quantity}
                onChange={(e) =>
                  setNewStock({ ...newStock, quantity: e.target.value })
                }
                className="mt-1 w-full border-b border-gray-400 bg-transparent focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <p className="font-medium">Company Name</p>
              <input
                type="text"
                value={newStock.companyname}
                onChange={(e) =>
                  setNewStock({ ...newStock, companyname: e.target.value })
                }
                className="mt-1 w-full border-b border-gray-400 bg-transparent focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <p className="font-medium">Remarks</p>
              <input
                type="text"
                value={newStock.remarks}
                onChange={(e) =>
                  setNewStock({ ...newStock, remarks: e.target.value })
                }
                className="mt-1 w-full border-b border-gray-400 bg-transparent focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </section>

        {/* --- Regular Sheet Section --- */}
        {newStock.sheetType === "regular" && (
          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">
              Regular Sheet Dimensions
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="font-medium">Length (mm)</p>
                <input
                  type="number"
                  value={newStock.length}
                  onChange={(e) =>
                    setNewStock({ ...newStock, length: e.target.value })
                  }
                  className="mt-1 w-full border-b border-gray-400 bg-transparent focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <p className="font-medium">Width (mm)</p>
                <input
                  type="number"
                  value={newStock.width}
                  onChange={(e) =>
                    setNewStock({ ...newStock, width: e.target.value })
                  }
                  className="mt-1 w-full border-b border-gray-400 bg-transparent focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </section>
        )}

        {/* --- Remnant Sheet Section --- */}
        {newStock.sheetType === "remnant" && (
          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">
              Remnant Sheet Details
            </h2>

            <div className="space-y-3">
              <h3 className="font-semibold">Remnant Dimensions</h3>
              {dimensions.map((dim, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="number"
                    placeholder={`L${index + 1} (mm)`}
                    value={dim.length}
                    onChange={(e) =>
                      handleDimensionChange(index, "length", e.target.value)
                    }
                    className="border-b border-gray-400 bg-transparent px-2 py-1 focus:border-blue-500 outline-none w-1/2"
                  />
                  <input
                    type="number"
                    placeholder={`W${index + 1} (mm)`}
                    value={dim.width}
                    onChange={(e) =>
                      handleDimensionChange(index, "width", e.target.value)
                    }
                    className="border-b border-gray-400 bg-transparent px-2 py-1 focus:border-blue-500 outline-none w-1/2"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddDimension}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
              >
                + Add More Dimensions
              </button>

              <div className="mt-4">
                <p className="font-medium">Shape Description</p>
                <input
                  type="text"
                  placeholder="Describe the shape..."
                  className="mt-1 w-full border-b border-gray-400 bg-transparent focus:border-blue-500 outline-none"
                  value={newStock.shapeDescription}
                  onChange={(e) =>
                    setNewStock({
                      ...newStock,
                      shapeDescription: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mt-4">
                <button
                  onClick={handleDrawShape}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Draw Shape
                </button>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Preview:</h4>
                  {canvaData ? (
                    <img
                      src={canvaData}
                      alt="Sheet Canvas"
                      className="w-80 h-auto border border-gray-300 rounded-lg shadow-sm"
                    />
                  ) : (
                    <div className="w-80 h-40 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-400 italic text-sm">
                      No Preview
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --- Buttons --- */}
        <section className="flex justify-center gap-6 pt-8 border-t">
          <button
            type="button"
            className="px-6 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 transition"
            disabled={isSubmitting}
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button
            onClick={addStock}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg font-semibold text-white transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </section>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}

export default AddStockModal;
