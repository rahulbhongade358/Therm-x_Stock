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

  // ✅ Multiple dimensions
  const [dimensions, setDimensions] = useState([{ length: "", width: "" }]);
  const [calculatedWeight, setCalculatedWeight] = useState(0);

  // ✅ Base form data
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

  // ✅ PDF File State
  const [pdfFile, setPdfFile] = useState(null);

  let remnantCanvasData = localStorage.getItem("remnantSheetCanvas");

  // ✅ Convert PDF → Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  // ✅ Add dimension input
  const addNewDimension = () => {
    setDimensions([...dimensions, { length: "", width: "" }]);
  };

  // ✅ Update dim values
  const handleDimensionChange = (index, field, value) => {
    const updated = [...dimensions];
    updated[index][field] = value;
    setDimensions(updated);
  };

  // ✅ Calculate total area mm²
  const calculateTotalArea = () => {
    return dimensions.reduce(
      (sum, dim) => sum + (Number(dim.length) || 0) * (Number(dim.width) || 0),
      0
    );
  };

  // ✅ Weight calculation
  useEffect(() => {
    if (remnantStock.thickness) {
      const density = 7850;
      const totalArea = calculateTotalArea();
      const volume = totalArea * Number(remnantStock.thickness);
      const weight = (volume * density) / 1_000_000_000;
      setCalculatedWeight(weight.toFixed(2));
    }
  }, [dimensions, remnantStock.thickness]);

  // ✅ Validate form
  const validateForm = () => {
    if (
      !remnantStock.thickness ||
      !remnantStock.companyname ||
      !remnantStock.remarks ||
      !remnantStock.shapeDescription ||
      !dimensions.some((d) => d.length && d.width)
    ) {
      toast.error("Please fill all required fields!");
      return false;
    }
    return true;
  };

  // ✅ Navigate to canvas draw page
  const handleRemnantDrawShape = () => {
    if (!validateForm()) return;
    localStorage.setItem("RemnantStockForm", JSON.stringify(remnantStock));
    localStorage.setItem("RemnantStockDimensions", JSON.stringify(dimensions));
    navigate("/remnantcanvas");
  };

  // ✅ Save stock (FINAL)
  const addstock = async () => {
    try {
      setIsSubmitting(true);

      const storedForm = localStorage.getItem("RemnantStockForm");
      const restoredStock = storedForm ? JSON.parse(storedForm) : remnantStock;

      const storedDimensions = localStorage.getItem("RemnantStockDimensions");
      const restoredDimensions = storedDimensions
        ? JSON.parse(storedDimensions)
        : dimensions;

      // ✅ PDF convert
      let base64Pdf = null;
      let pdfName = null;

      if (pdfFile) {
        base64Pdf = await convertToBase64(pdfFile);
        pdfName = pdfFile.name;
      }

      // ✅ Payload for backend
      const payload = {
        ...restoredStock,
        dimensions: restoredDimensions,
        weight: calculatedWeight,
        sheetCanvas: remnantCanvasData,
        addedBy: user?._id,

        // ✅ Add PDF
        pdfBase64: base64Pdf,
        pdfName: pdfName,
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

  // ✅ Fetch regular sheets
  const fetchSheets = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/allstocks`
      );

      const allSheets = response.data.data;
      const regularSheets = allSheets.filter(
        (sheet) => sheet.sheetType === "regular"
      );

      const formatted = regularSheets.map((sheet) => ({
        value: sheet._id,
        label: `Thk: ${sheet.thickness}mm | ${sheet.length}×${sheet.width} | Qty: ${sheet.quantity} | ${sheet.companyname}`,
      }));

      setSheetOptions(formatted);
    } catch (error) {
      console.error("Error fetching sheets:", error);
    }
  };

  useEffect(() => {
    setUser(getCurrentuser());
    fetchSheets();

    const savedForm = localStorage.getItem("RemnantStockForm");
    if (savedForm) setRemnantStock(JSON.parse(savedForm));

    const savedDim = localStorage.getItem("RemnantStockDimensions");
    if (savedDim) setDimensions(JSON.parse(savedDim));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center text-blue-700">
          Add Remnant Stock
        </h1>

        {/* ✅ Select Original Sheet */}
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
            placeholder="Select a sheet..."
          />
        </section>

        {/* ✅ Thickness + Dimensions */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">
            Sheet Details
          </h2>

          <p className="mb-3">
            Thickness:
            <input
              type="number"
              placeholder="mm"
              className="ml-2 px-3 py-1 border rounded-md w-24"
              value={remnantStock.thickness}
              onChange={(e) =>
                setRemnantStock({ ...remnantStock, thickness: e.target.value })
              }
            />
          </p>

          <p className="font-medium">Dimensions (mm):</p>
          <div className="space-y-2 mt-2">
            {dimensions.map((dim, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>Set {index + 1}:</span>
                <input
                  type="number"
                  placeholder="Length"
                  className="border rounded-md px-3 py-1 w-28"
                  value={dim.length}
                  onChange={(e) =>
                    handleDimensionChange(index, "length", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Width"
                  className="border rounded-md px-3 py-1 w-28"
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
        </section>

        {/* ✅ Preview Area */}
        <section className="bg-white p-5 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Preview Calculations</h2>
          <p>
            <strong>Total Area:</strong> {calculateTotalArea()} mm²
          </p>
          <p>
            <strong>Estimated Weight:</strong> {calculatedWeight} kg
          </p>
        </section>

        {/* ✅ Additional Info */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">
            Additional Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Company:</span>
              <input
                type="text"
                placeholder="Company name"
                className="ml-2 border-b border-gray-400 w-full"
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
                className="ml-2 border-b border-gray-400 w-full"
                value={remnantStock.remarks}
                onChange={(e) =>
                  setRemnantStock({
                    ...remnantStock,
                    remarks: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <span className="font-medium">Shape Description:</span>
            <input
              type="text"
              placeholder="Describe shape..."
              className="ml-2 border-b border-gray-400 w-full"
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

        {/* ✅ PDF Upload Section */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">
            Attach PDF
          </h2>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="block mt-2"
          />

          {pdfFile && (
            <p className="text-sm text-gray-600 mt-2">
              Selected: <strong>{pdfFile.name}</strong>
            </p>
          )}
        </section>

        {/* ✅ Canvas Preview */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">
            Shape Drawing
          </h2>

          <div className="flex flex-col sm:flex-row gap-6">
            <button
              onClick={handleRemnantDrawShape}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Draw Shape
            </button>

            <div>
              <h3 className="font-medium mb-2">Preview:</h3>
              {remnantCanvasData ? (
                <img
                  src={remnantCanvasData}
                  alt="Sheet Canvas"
                  className="w-80 border rounded-lg shadow-sm"
                />
              ) : (
                <div className="w-80 h-40 border border-dashed rounded-lg flex justify-center items-center text-gray-400">
                  No Preview
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ✅ Action Buttons */}
        <section className="flex justify-center gap-6 pt-6 border-t">
          <button
            type="button"
            className="px-6 py-2 rounded-lg border hover:bg-gray-100"
            onClick={() => navigate("/")}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            onClick={addstock}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg text-white font-semibold ${
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
