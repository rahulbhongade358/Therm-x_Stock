import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { getCurrentuser } from "../utils/utils";
function UpdateRemnant() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [updateRemnantStock, setUpdateRemnantStock] = useState({
    thickness: "",
    size: "",
    quantity: "",
    remarks: "",
    addedBy: "",
    companyname: "",
    shapeDescription: "",
    sheetCanvas: "",
  });
  let updateRemnantCanvaData = localStorage.getItem("updateRemnantSheetCanvas");
  const validateForm = () => {
    if (
      !updateRemnantStock.thickness ||
      !updateRemnantStock.size ||
      !updateRemnantStock.quantity ||
      !updateRemnantStock.companyname
    ) {
      toast.error("Please fill in all required fields before proceeding!");
      return false;
    }
    return true;
  };
  const handleDrawShape = () => {
    if (!validateForm()) return;
    localStorage.setItem(
      "updateRemnantStockForm",
      JSON.stringify(updateRemnantStock)
    );
    navigate(`/updateremnantcanvas/${id}`);
  };
  const updateremnant = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/remnantstocks/${id}`
    );
    setUpdateRemnantStock(response.data.data);
  };
  useEffect(() => {
    updateremnant();
  }, [id]);
  const updateremnantstock = async () => {
    try {
      const updateRemnant = localStorage.getItem("updateRemnantStockForm");
      const restoredStock = updateRemnant
        ? JSON.parse(updateRemnant)
        : updateRemnantStock;
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
        toast.success(response.data.message);
        localStorage.removeItem("updateRemnantSheetCanvas");
        localStorage.removeItem("updateRemnantStockForm");
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
      window.location.href = "/";
    });
  };
  useEffect(() => {
    setUser(getCurrentuser());
    const savedRemnantStock = localStorage.getItem("updateRemnantStockForm");
    if (savedRemnantStock) {
      setUpdateRemnantStock(JSON.parse(savedRemnantStock));
    }
  }, []);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm px-4 py-6 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg overflow-hidden border border-gray-200 animate-fadeIn">
        <div className="flex items-center justify-between px-5 py-3 border-b bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
          <h2 className="text-base sm:text-lg font-semibold">
            Update Remnant Stock
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-200 transition"
          >
            ✕
          </button>
        </div>
        <div className="p-5 space-y-3 sm:space-y-4 overflow-y-auto max-h-[65vh]">
          {[
            { label: "Thickness (mm)", key: "thickness", type: "number" },
            { label: "Size (mm × mm)", key: "size", type: "text" },
            { label: "Quantity", key: "quantity", type: "number" },
            { label: "Remarks", key: "remarks", type: "text" },
            { label: "Company Name", key: "companyname", type: "text" },
            {
              label: "Shape Description",
              key: "shapeDescription",
              type: "text",
            },
          ].map((field, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2 bg-gray-50 p-2 sm:p-3 rounded-xl"
            >
              <label className="text-sm font-medium text-gray-700 sm:col-span-1">
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.label}
                className="sm:col-span-2 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm transition w-full"
                value={updateRemnantStock[field.key]}
                onChange={(e) =>
                  setUpdateRemnantStock({
                    ...updateRemnantStock,
                    [field.key]: e.target.value,
                  })
                }
              />
            </div>
          ))}
          <label className="text-sm font-semibold mt-2">Draw Shape:</label>
          <div className="max-w-4xl mx-auto p-4">
            <button
              onClick={handleDrawShape}
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Draw Shape
            </button>
          </div>
          <div>
            <h2>Preview:</h2>
            {updateRemnantCanvaData ? (
              <img
                src={updateRemnantCanvaData}
                alt="Sheet Canvas"
                className="w-70 h-50  border border-gray-300 rounded-lg shadow-sm"
              />
            ) : (
              <div className="w-56 h-40 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-400 italic text-sm">
                No Preview
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 sm:gap-3 px-5 py-3 border-t bg-gray-50 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={updateremnantstock}
            className="px-4 py-1.5 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-95 transition text-sm"
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
