import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { getCurrentuser } from "../utils/utils";
function Update() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [updateStock, setUpdateStock] = useState({
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
  let updateCanvasData = localStorage.getItem("updateSheetCanvas");
  const validateForm = () => {
    if (
      !updateStock.thickness ||
      !updateStock.length ||
      !updateStock.width ||
      !updateStock.quantity ||
      !updateStock.companyname
    ) {
      toast.error("Please fill in all required fields before proceeding!");
      return false;
    }
    return true;
  };
  const handleDrawShape = () => {
    if (!validateForm()) return;
    localStorage.setItem("updateStockForm", JSON.stringify(updateStock));
    navigate(`/updatecanvas/${id}`);
  };
  const update = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/stocks/${id}`
    );
    setUpdateStock(response.data.data);
  };
  useEffect(() => {
    update();
  }, [id]);
  const updatestock = async () => {
    try {
      const update = localStorage.getItem("updateStockForm");
      const restoredStock = update ? JSON.parse(update) : updateStock;
      const payload = {
        ...restoredStock,
        sheetCanvas: updateCanvasData,
        addedBy: user?._id,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/stocks/${id}`,
        payload
      );

      if (response?.data?.success) {
        toast.success(response.data.message);
        localStorage.removeItem("updateSheetCanvas");
        localStorage.removeItem("updateStockForm");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error Updating stock");
    }
  };

  const onClose = () => {
    setTimeout(() => {
      navigate("/");
    });
  };
  useEffect(() => {
    setUser(getCurrentuser());
    const savedForm = localStorage.getItem("updateStockForm");
    if (savedForm) {
      setUpdateStock(JSON.parse(savedForm));
    }
  }, []);
  const baseFields = [
    { label: "Thickness (mm)", key: "thickness", type: "number" },
    { label: "Length (mm × mm)", key: "length", type: "text" },
    { label: "Width (mm × mm)", key: "width", type: "text" },
    { label: "Quantity", key: "quantity", type: "number" },
    { label: "Remarks", key: "remarks", type: "text" },
    { label: "Company Name", key: "companyname", type: "text" },
  ];

  // ✅ Conditionally add fields
  if (updateStock.sheetType === "remnant") {
    baseFields.push(
      { label: "Sheet Type", key: "sheetType", type: "text" },
      { label: "Shape Description", key: "shapeDescription", type: "text" }
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center py-10 px-4 sm:px-8">
      {/* Header */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-2xl shadow-lg flex justify-between items-center px-6 py-4">
        <h1 className="text-xl sm:text-2xl font-semibold">Update Stock</h1>
        <button
          onClick={onClose}
          className="text-white text-xl hover:text-red-200 transition"
        >
          ✕
        </button>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-b-2xl border border-gray-200 p-6 sm:p-8 space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updatestock();
          }}
          className="space-y-6"
        >
          {/* Base Fields */}
          {baseFields.map((field, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-3 items-center gap-3 bg-gray-50 p-3 sm:p-4 rounded-xl shadow-sm"
            >
              <label className="text-sm font-medium text-gray-700 sm:col-span-1">
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.label}
                value={updateStock[field.key] || ""}
                onChange={(e) =>
                  setUpdateStock({
                    ...updateStock,
                    [field.key]: e.target.value,
                  })
                }
                className="sm:col-span-2 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm transition w-full"
              />
            </div>
          ))}

          {/* Conditional Remnant Shape Section */}
          {updateStock.sheetType === "remnant" && (
            <div className="space-y-4">
              <label className="text-base font-semibold text-gray-800">
                Draw Shape:
              </label>

              {/* Draw Shape Button */}
              <div className="max-w-4xl mx-auto p-2">
                <button
                  type="button"
                  onClick={handleDrawShape}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md hover:shadow-lg"
                >
                  Draw Shape
                </button>
              </div>

              {/* Preview Section */}
              <div className="space-y-2">
                <h2 className="text-gray-700 font-medium">Preview:</h2>
                {updateCanvasData ? (
                  <img
                    src={updateCanvasData}
                    alt="Sheet Canvas"
                    className="w-80 h-56 border border-gray-300 rounded-lg shadow-sm object-contain"
                  />
                ) : (
                  <div className="w-80 h-56 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-400 italic text-sm">
                    No Preview
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-95 transition text-sm"
            >
              Update
            </button>
          </div>
        </form>

        {/* Toast Notification */}
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default Update;
