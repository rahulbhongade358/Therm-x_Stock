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
      const dimensionsData = localStorage.getItem("RemnantStockDimensions");
      const restoredDimensions = dimensionsData
        ? JSON.parse(dimensionsData)
        : dimensions;

      const payload = {
        ...restoredStock,
        dimensions: restoredDimensions,
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
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/allstocks`
      );

      const allSheets = response.data.data;

      // ✅ Filter only regular sheets
      const regularSheets = allSheets.filter(
        (sheet) => sheet.sheetType === "regular"
      );

      // ✅ Format dropdown data
      const formatted = regularSheets.map((sheet) => ({
        value: sheet._id,
        label: `Thk: ${sheet.thickness}mm | ${sheet.length}×${sheet.width}mm | Qty: ${sheet.quantity} | ${sheet.companyname}`,
        thickness: sheet.thickness,
        length: sheet.length,
        width: sheet.width,
        quantity: sheet.quantity,
      }));

      // ✅ Update dropdown options
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
    const remnantDimensions = localStorage.getItem("RemnantStockDimensions");
    if (remnantDimensions) {
      setDimensions(JSON.parse(remnantDimensions));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center text-blue-700">
          Add Remnant Stock
        </h1>

        {/* --- Sheet Selection Section --- */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">
            Select Original Sheet
          </h2>
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
        </section>

        {/* --- Thickness + Dimensions --- */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">
            Sheet Details
          </h2>

          <div className="text-lg">
            <p className="mb-3">
              Thickness:{" "}
              <input
                type="number"
                placeholder="mm"
                className="ml-2 px-3 py-1 rounded-md border border-gray-300 w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={remnantStock.thickness}
                onChange={(e) =>
                  setRemnantStock({
                    ...remnantStock,
                    thickness: e.target.value,
                  })
                }
              />
            </p>

            <p className="font-medium">Dimensions (mm):</p>
            <div className="space-y-2 mt-2">
              {dimensions.map((dim, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-600">Set {index + 1}:</span>
                  <input
                    type="number"
                    placeholder="Length"
                    className="border border-gray-300 rounded-md px-3 py-1 w-28 focus:ring-2 focus:ring-blue-400"
                    value={dim.length}
                    onChange={(e) =>
                      handleDimensionChange(index, "length", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Width"
                    className="border border-gray-300 rounded-md px-3 py-1 w-28 focus:ring-2 focus:ring-blue-400"
                    value={dim.width}
                    onChange={(e) =>
                      handleDimensionChange(index, "width", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <button
              onClick={addNewDimension}
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add More Dimensions
            </button>
          </div>
        </section>

        {/* --- Area and Weight --- */}
        <section className="bg-white p-5 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Preview Calculations</h2>
          <p>
            <strong>Total Area:</strong> {calculateTotalArea()} mm²
          </p>
          <p>
            <strong>Estimated Weight:</strong> {calculatedWeight} kg
          </p>
        </section>

        {/* --- Additional Info --- */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">
            Additional Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Company:</span>
              <input
                type="text"
                placeholder="Company Name"
                className="ml-2 border-b border-gray-400 focus:border-blue-500 bg-transparent outline-none w-full"
                value={remnantStock.companyname}
                onChange={(e) =>
                  setRemnantStock({
                    ...remnantStock,
                    companyname: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <span className="font-medium">Remarks:</span>
              <input
                type="text"
                placeholder="Remarks"
                className="ml-2 border-b border-gray-400 focus:border-blue-500 bg-transparent outline-none w-full"
                value={remnantStock.remarks}
                onChange={(e) =>
                  setRemnantStock({ ...remnantStock, remarks: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <span className="font-medium">Shape Description:</span>
            <input
              type="text"
              placeholder="Describe the shape..."
              className="ml-2 border-b border-gray-400 focus:border-blue-500 bg-transparent outline-none w-full"
              value={remnantStock.shapeDescription}
              onChange={(e) =>
                setRemnantStock({
                  ...remnantStock,
                  shapeDescription: e.target.value,
                })
              }
            />
          </div>
        </section>

        {/* --- Canvas Section --- */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">
            Shape Drawing
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button
              onClick={handleRemnantDrawShape}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Draw Shape
            </button>

            <div>
              <h3 className="font-medium mb-2">Preview:</h3>
              {remnantCanvasData ? (
                <img
                  src={remnantCanvasData}
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
        </section>

        {/* --- Action Buttons --- */}
        <section className="flex justify-center gap-6 pt-6 border-t">
          <button
            type="button"
            className="px-6 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 transition"
            onClick={() => navigate("/")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={addstock}
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

export default AddRemnantStockModal;
