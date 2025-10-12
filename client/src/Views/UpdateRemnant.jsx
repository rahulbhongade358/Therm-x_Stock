import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router";
import { getCurrentuser } from "../utils/utils";
import { ReactSketchCanvas } from "react-sketch-canvas";
function UpdateRemnant() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [updateRemnantStock, setUpdateRemnantStock] = useState({
    thickness: "",
    size: "",
    quantity: "",
    minRequired: "",
    remarks: "",
    addedBy: "",
    companyname: "",
    shapeDescription: "",
    sheetCanvas: "",
  });
  const canvasRef = useRef(null);
  const saveCanva = async () => {
    const canvaData = await canvasRef.current.exportImage("png");
    setUpdateRemnantStock((prev) => ({ ...prev, sheetCanvas: canvaData }));
    toast.success("Shape Saved Successfully");
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
      const payload = { ...updateRemnantStock, addedBy: user?._id };
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/remnantstocks/${id}`,
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
            { label: "Min Required", key: "minRequired", type: "number" },
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
          <div className="border rounded-md shadow-sm overflow-hidden">
            <ReactSketchCanvas
              ref={canvasRef}
              width="100%"
              height="250px"
              strokeWidth={3}
              strokeColor="black"
            />
          </div>

          <div className="flex justify-between mt-3">
            <button
              onClick={() => canvasRef.current.clearCanvas()}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Clear
            </button>
            <button
              onClick={saveCanva}
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Shape
            </button>
          </div>
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
