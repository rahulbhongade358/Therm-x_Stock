import React, { useEffect, useState } from "react";
import { getCurrentuser } from "../utils/utils.js";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router";

function AddRemnantStockModal({ onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sheetOptions, setSheetOptions] = useState([]);

  // ✅ Multiple dimensions (length-width pairs)
  const [dimensions, setDimensions] = useState([{ length: "", width: "" }]);
  const [calculatedWeight, setCalculatedWeight] = useState(0);

  const [remnantStock, setRemnantStock] = useState({
    sheetType: "remnant",
    thickness: "",
    quantity: "1",
    remarks: "",
    addedBy: "",
    companyname: "",
    shapeDescription: "",
    sheetCanvas: "",
  });

  let remnantCanvasData = localStorage.getItem("remnantSheetCanvas");

  // ✅ Add new dimension input box
  const addNewDimension = () => {
    setDimensions([...dimensions, { length: "", width: "" }]);
  };

  // ✅ Update specific length/width
  const handleDimensionChange = (index, field, value) => {
    const updated = [...dimensions];
    updated[index][field] = value;
    setDimensions(updated);
  };

  // ✅ Calculate total area
  const calculateTotalArea = () => {
    const total = dimensions.reduce(
      (sum, dim) => sum + (Number(dim.length) || 0) * (Number(dim.width) || 0),
      0
    );
    return total;
  };

  // ✅ Calculate weight (steel = 7850 kg/m³)
  useEffect(() => {
    if (remnantStock.thickness) {
      const density = 7850;
      const totalArea = calculateTotalArea(); // mm²
      const volume = totalArea * Number(remnantStock.thickness); // mm³
      const weight = (volume * density) / 1_000_000_000; // convert mm³ → m³
      setCalculatedWeight(weight.toFixed(2));
    }
  }, [dimensions, remnantStock.thickness]);

  // ✅ Form validation
  const validateForm = () => {
    if (
      !remnantStock.thickness ||
      !remnantStock.companyname ||
      !remnantStock.remarks ||
      !remnantStock.shapeDescription ||
      !dimensions.some((d) => d.length && d.width)
    ) {
      toast.error("Please fill in all required fields before proceeding!");
      return false;
    }
    return true;
  };

  const handleRemnantDrawShape = () => {
    if (!validateForm()) return;
    localStorage.setItem("RemnantStockForm", JSON.stringify(remnantStock));
    localStorage.setItem("RemnantStockDimensions", JSON.stringify(dimensions));
    navigate("/remnantcanvas");
  };

  // ✅ Save stock
  const addstock = async () => {
    try {
      setIsSubmitting(true);
      const sheetData = localStorage.getItem("RemnantStockForm");
      const restoredStock = sheetData ? JSON.parse(sheetData) : remnantStock;

      const payload = {
        ...restoredStock,
        dimensions,
        weight: calculatedWeight,
        sheetCanvas: remnantCanvasData,
        addedBy: user?._id,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/remnantstocks`,
        payload
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        localStorage.removeItem("remnantSheetCanvas");
        localStorage.removeItem("RemnantStockForm");
        localStorage.removeItem("RemnantStockDimensions");
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

  // ✅ Fetch all regular sheets
  const fetchSheets = async () => {
    try {
      const searchResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/allstocks`
      );
      const formatted = searchResponse.data.data.map((sheet) => ({
        value: sheet._id,
        label: `${sheet.thickness}mm × ${sheet.length}mm × ${sheet.width}mm (${sheet.companyname})`,
      }));
      setSheetOptions(formatted);
    } catch (error) {
      console.error("Error fetching sheets:", error);
    }
  };

  useEffect(() => {
    setUser(getCurrentuser());
    fetchSheets();
    const remnantForm = localStorage.getItem("RemnantStockForm");
    if (remnantForm) {
      setRemnantStock(JSON.parse(remnantForm));
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[95%] sm:w-[480px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Add Remnant Stock
        </h2>

        {/* Select Original Sheet */}
        <label className="block text-gray-700 font-medium mb-2">
          Select Original Sheet
        </label>
        <Select
          options={sheetOptions}
          value={
            sheetOptions.find(
              (opt) => opt.value === remnantStock.orignalsheetid
            ) || null
          }
          onChange={(selected) =>
            setRemnantStock({
              ...remnantStock,
              orignalsheetid: selected.value,
            })
          }
          placeholder="Search or select original sheet..."
          isSearchable
        />

        <input
          type="number"
          placeholder="Thickness (mm)"
          className="border border-gray-300 px-3 py-2 rounded-md mt-3 w-full"
          value={remnantStock.thickness}
          onChange={(e) =>
            setRemnantStock({ ...remnantStock, thickness: e.target.value })
          }
        />

        {/* Dynamic Dimensions */}
        <label className="block text-gray-700 font-medium mt-3">
          Add Dimensions (mm):
        </label>
        {dimensions.map((dim, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <input
              type="number"
              placeholder={`Length ${index + 1}`}
              className="border border-gray-300 px-3 py-2 rounded-md w-1/2"
              value={dim.length}
              onChange={(e) =>
                handleDimensionChange(index, "length", e.target.value)
              }
            />
            <input
              type="number"
              placeholder={`Width ${index + 1}`}
              className="border border-gray-300 px-3 py-2 rounded-md w-1/2"
              value={dim.width}
              onChange={(e) =>
                handleDimensionChange(index, "width", e.target.value)
              }
            />
          </div>
        ))}
        <button
          onClick={addNewDimension}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add More Dimensions
        </button>

        {/* Weight Preview */}
        <p className="mt-4 text-gray-700">
          <strong>Total Area:</strong> {calculateTotalArea()} mm²
        </p>
        <p className="text-gray-700">
          <strong>Estimated Weight:</strong> {calculatedWeight} kg
        </p>

        {/* Other Inputs */}
        <input
          type="text"
          placeholder="Company Name"
          className="border border-gray-300 px-3 py-2 rounded-md w-full mt-3"
          value={remnantStock.companyname}
          onChange={(e) =>
            setRemnantStock({ ...remnantStock, companyname: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Remarks"
          className="border border-gray-300 px-3 py-2 rounded-md w-full mt-3"
          value={remnantStock.remarks}
          onChange={(e) =>
            setRemnantStock({ ...remnantStock, remarks: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Shape Description"
          className="border border-gray-300 px-3 py-2 rounded-md w-full mt-3"
          value={remnantStock.shapeDescription}
          onChange={(e) =>
            setRemnantStock({
              ...remnantStock,
              shapeDescription: e.target.value,
            })
          }
        />

        {/* Canvas + Preview */}
        <label className="text-sm font-semibold mt-3">Draw Shape:</label>
        <div className="max-w-4xl mx-auto p-4">
          <button
            onClick={handleRemnantDrawShape}
            className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Draw Shape
          </button>
        </div>
        <div>
          <h2>Preview:</h2>
          {remnantCanvasData ? (
            <img
              src={remnantCanvasData}
              alt="Sheet Canvas"
              className="w-70 h-50 border border-gray-300 rounded-lg shadow-sm"
            />
          ) : (
            <div className="w-56 h-40 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-400 italic text-sm">
              No Preview
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="w-1/2 mr-2 px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 transition"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={addstock}
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

export default AddRemnantStockModal;
