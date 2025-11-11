import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { getCurrentuser } from "../utils/utils";

function UpdateRemnant() {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [calculatedWeight, setCalculatedWeight] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);
  const [updateRemnantStock, setUpdateRemnantStock] = useState({
    thickness: "",
    dimensions: [{ length: "", width: "" }],
    quantity: "",
    remarks: "",
    addedBy: "",
    companyname: "",
    shapeDescription: "",
  });

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

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
  // ✅ Fetch remnant data from API
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

  // ✅ Restore data (localStorage → state OR API)
  useEffect(() => {
    setUser(getCurrentuser());
    const saved = localStorage.getItem("updateRemnantStockForm");
    if (saved) {
      console.log("Restoring from localStorage:", JSON.parse(saved));
      setUpdateRemnantStock(JSON.parse(saved));
    } else {
      fetchRemnant();
    }
  }, [id]);

  // ✅ Auto-sync form to localStorage whenever user edits
  useEffect(() => {
    localStorage.setItem(
      "updateRemnantStockForm",
      JSON.stringify(updateRemnantStock)
    );
  }, [updateRemnantStock]);

  // ✅ Update remnant stock
  const updateRemnantStockData = async () => {
    try {
      setIsSubmitting(true);
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }
      const stored = localStorage.getItem("updateRemnantStockForm");
      const restoredStock = stored ? JSON.parse(stored) : updateRemnantStock;
      let base64Pdf = null;
      let pdfName = null;

      if (pdfFile) {
        base64Pdf = await convertToBase64(pdfFile);
        pdfName = pdfFile.name;
      }
      const payload = {
        ...restoredStock,
        addedBy: user?._id,
        pdfBase64: base64Pdf,
        pdfName: pdfName,
      };
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/remnantstocks/${id}`,
        payload
      );

      if (response?.data?.success) {
        toast.success(response.data.message || "Stock Updated Successfully");
        localStorage.removeItem("updateRemnantStockForm");
        setTimeout(() => (window.location.href = "/"), 1000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error Updating Stock");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  const onClose = () => (window.location.href = "/");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 sm:px-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-2xl">
          <h2 className="text-lg font-semibold">Update Remnant Stock</h2>
          <button onClick={onClose} className="hover:text-red-200 transition">
            ✕
          </button>
        </div>

        {/* ✅ Form Section */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateRemnantStockData();
          }}
          className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]"
        >
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
              required
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
                  required
                />
                <input
                  type="number"
                  placeholder={`W${index + 1} (mm)`}
                  value={dim.width}
                  onChange={(e) =>
                    handleDimensionChange(index, "width", e.target.value)
                  }
                  className="border border-gray-300 px-2 py-1 rounded-md w-1/2"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDimension(index)}
                    className="text-red-500 font-bold hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDimension}
              className="mt-1 text-sm text-blue-600 hover:underline"
            >
              + Add Dimension
            </button>

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
                required={field.key !== "remarks"} // make remarks optional
              />
            </div>
          ))}
          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">
              Attach PDF{" "}
              <span className="text-[12px] text-gray-400 ">
                Please upload a PDF file by clicking below 👇 size should be
                15kb
              </span>
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

          {/* Footer */}
          <div className="flex justify-end gap-2 px-5 py-3 border-t bg-gray-50 mt-3 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg text-white font-semibold ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Stock"}
            </button>
          </div>
        </form>

        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default UpdateRemnant;
