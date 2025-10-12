import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router";
import { getCurrentuser } from "../utils/utils";
function Update() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [updateStock, setUpdateStock] = useState({
    thickness: "",
    size: "",
    quantity: "",
    remarks: "",
    addedBy: "",
    companyname: "",
    shapeDescription: "",
  });

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
      const payload = { ...updateStock, addedBy: user?._id };
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/stocks/${id}`,
        payload
      );

      if (response?.data?.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
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
  }, []);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm px-4 py-6 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg overflow-hidden border border-gray-200 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
          <h2 className="text-base sm:text-lg font-semibold">Update Stock</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
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
                value={updateStock[field.key]}
                onChange={(e) =>
                  setUpdateStock({
                    ...updateStock,
                    [field.key]: e.target.value,
                  })
                }
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 sm:gap-3 px-5 py-3 border-t bg-gray-50 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={updatestock}
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

export default Update;
