import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { getCurrentuser } from "../utils/utils";

function UpdateRemnant() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [calculatedWeight, setCalculatedWeight] = useState(0);

  const [updateRemnantStock, setUpdateRemnantStock] = useState({
    thickness: "",
    dimensions: [{ length: "", width: "" }],
    quantity: "",
    remarks: "",
    addedBy: "",
    companyname: "",
    shapeDescription: "",
    sheetCanvas: "",
  });

  const updateRemnantCanvaData = localStorage.getItem(
    "updateRemnantSheetCanvas"
  );

  // ✅ Add new L×W row
  const handleAddDimension = () => {
    setUpdateRemnantStock((prev) => ({
      ...prev,
      dimensions: [...prev.dimensions, { length: "", width: "" }],
    }));
  };

  // ✅ Remove a dimension
  const handleRemoveDimension = (index) => {
    setUpdateRemnantStock((prev) => ({
      ...prev,
      dimensions: prev.dimensions.filter((_, i) => i !== index),
    }));
  };

  // ✅ Handle change for a single field
  const handleDimensionChange = (index, field, value) => {
    const updatedDims = [...updateRemnantStock.dimensions];
    updatedDims[index][field] = value;
    setUpdateRemnantStock({ ...updateRemnantStock, dimensions: updatedDims });
  };

  // ✅ Total area calculation (mm²)
  const calculateTotalArea = () => {
    const total = updateRemnantStock.dimensions.reduce(
      (sum, dim) => sum + (Number(dim.length) || 0) * (Number(dim.width) || 0),
      0
    );
    return total;
  };

  // ✅ Weight calculation (steel = 7850 kg/m³)
  useEffect(() => {
    if (updateRemnantStock.thickness) {
      const density = 7850; // kg/m³
      const totalArea = calculateTotalArea(); // mm²
      const volume = totalArea * Number(updateRemnantStock.thickness); // mm³
      const weight = (volume * density) / 1_000_000_000; // convert mm³ → m³
      setCalculatedWeight(weight.toFixed(2));
    }
  }, [updateRemnantStock.dimensions, updateRemnantStock.thickness]);

  // ✅ Validate inputs
  const validateForm = () => {
    const { thickness, dimensions, quantity, companyname } = updateRemnantStock;
    if (!thickness || !quantity || !companyname) {
      toast.error("Please fill all required fields!");
      return false;
    }
    if (dimensions.some((dim) => !dim.length || !dim.width)) {
      toast.error("Please fill all Length and Width fields!");
      return false;
    }
    return true;
  };

  // ✅ Go to Canvas page
  const handleDrawShape = () => {
    if (!validateForm()) return;
    localStorage.setItem(
      "updateRemnantStockForm",
      JSON.stringify(updateRemnantStock)
    );
    navigate(`/updateremnantcanvas/${id}`);
  };

  // ✅ Fetch remnant data
  const fetchRemnant = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/remnantstocks/${id}`
      );
      const data = response.data.data;
      setUpdateRemnantStock({
        ...data,
        dimensions: data.dimensions?.length
          ? data.dimensions
          : [{ length: data.length, width: data.width }],
      });
    } catch (err) {
      toast.error("Error fetching remnant data!");
    }
  };

  useEffect(() => {
    fetchRemnant();
  }, [id]);

  // ✅ Update remnant stock
  const updateRemnantStockData = async () => {
    try {
      const stored = localStorage.getItem("updateRemnantStockForm");
      const restoredStock = stored ? JSON.parse(stored) : updateRemnantStock;

      const payload = {
        ...restoredStock,
        sheetCanvas: updateRemnantCanvaData,
        addedBy: user?._id,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/remnantstocks/${id}`,
        payload
      );

      if (response?.data?.success) {
        toast.success("Remnant Stock Updated Successfully!");
        localStorage.removeItem("updateRemnantSheetCanvas");
        localStorage.removeItem("updateRemnantStockForm");
        setTimeout(() => (window.location.href = "/"), 2000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error Updating Stock");
    }
  };

  const onClose = () => (window.location.href = "/");

  useEffect(() => {
    setUser(getCurrentuser());
    const saved = localStorage.getItem("updateRemnantStockForm");
    if (saved) setUpdateRemnantStock(JSON.parse(saved));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm px-4 py-6 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg overflow-hidden border border-gray-200 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
          <h2 className="text-lg font-semibold">Update Remnant Stock</h2>
          <button onClick={onClose} className="hover:text-red-200 transition">
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-3 overflow-y-auto max-h-[65vh]">
          {/* Thickness */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Thickness (mm)</label>
            <input
              type="number"
              value={updateRemnantStock.thickness}
              onChange={(e) =>
                setUpdateRemnantStock({
                  ...updateRemnantStock,
                  thickness: e.target.value,
                })
              }
              className="border border-gray-300 px-3 py-2 rounded-md"
            />
          </div>

          {/* Dimensions */}
          <div>
            <label className="font-semibold text-gray-700">
              Dimensions (Length × Width)
            </label>
            {updateRemnantStock.dimensions.map((dim, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded-md mb-2"
              >
                <input
                  type="number"
                  placeholder={`L${index + 1} (mm)`}
                  value={dim.length}
                  onChange={(e) =>
                    handleDimensionChange(index, "length", e.target.value)
                  }
                  className="border border-gray-300 px-2 py-1 rounded-md w-1/2"
                />
                <input
                  type="number"
                  placeholder={`W${index + 1} (mm)`}
                  value={dim.width}
                  onChange={(e) =>
                    handleDimensionChange(index, "width", e.target.value)
                  }
                  className="border border-gray-300 px-2 py-1 rounded-md w-1/2"
                />
                {index > 0 && (
                  <button
                    onClick={() => handleRemoveDimension(index)}
                    className="text-red-500 font-bold hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddDimension}
              className="mt-1 text-sm text-blue-600 hover:underline"
            >
              + Add Dimension
            </button>

            {/* Calculations */}
            <p className="mt-4 text-gray-700">
              <strong>Total Area:</strong> {calculateTotalArea()} mm²
            </p>
            <p className="text-gray-700">
              <strong>Estimated Weight:</strong> {calculatedWeight} kg
            </p>
          </div>

          {/* Other fields */}
          {[
            { label: "Quantity", key: "quantity", type: "number" },
            { label: "Remarks", key: "remarks", type: "text" },
            { label: "Company Name", key: "companyname", type: "text" },
            {
              label: "Shape Description",
              key: "shapeDescription",
              type: "text",
            },
          ].map((field) => (
            <div key={field.key}>
              <label className="font-medium text-gray-700">{field.label}</label>
              <input
                type={field.type}
                value={updateRemnantStock[field.key]}
                onChange={(e) =>
                  setUpdateRemnantStock({
                    ...updateRemnantStock,
                    [field.key]: e.target.value,
                  })
                }
                className="border border-gray-300 px-3 py-2 rounded-md w-full"
              />
            </div>
          ))}

          {/* Canvas */}
          <label className="text-sm font-semibold mt-2">Draw Shape:</label>
          <div className="p-2">
            <button
              onClick={handleDrawShape}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Draw Shape
            </button>
          </div>

          {/* Preview */}
          <div>
            <h2>Preview:</h2>
            {updateRemnantCanvaData ? (
              <img
                src={updateRemnantCanvaData}
                alt="Sheet Canvas"
                className="w-70 h-50 border border-gray-300 rounded-lg shadow-sm"
              />
            ) : (
              <div className="w-56 h-40 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-400 italic text-sm">
                No Preview
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={updateRemnantStockData}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Update
          </button>
        </div>

        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default UpdateRemnant;
