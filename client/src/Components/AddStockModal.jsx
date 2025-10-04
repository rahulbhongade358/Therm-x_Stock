import React, { useEffect, useState } from "react";
import { getCurrentuser } from "./../utils/utils.js";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
function AddStockModal({ onClose }) {
  const [user, setUser] = useState(null);
  const [newStock, setNewStock] = useState({
    thickness: "",
    size: "",
    quantity: "",
    minRequired: "",
    remarks: "",
    addedBy: "",
    companyname: "",
  });
  const addstock = async () => {
    try {
      const payload = { ...newStock, addedBy: user?._id };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/stocks`,
        payload
      );
      if (response?.data?.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error saving stock");
    }
  };
  useEffect(() => {
    setUser(getCurrentuser());
  }, []);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Add Stock</h3>
        <div className="flex flex-col gap-3">
          <input
            type="number"
            placeholder="Thickness (mm)"
            className="border px-3 py-2 rounded"
            value={newStock.thickness}
            onChange={(e) => {
              setNewStock({ ...newStock, thickness: e.target.value });
            }}
          />
          <input
            type="text"
            placeholder="Size (mm x mm)"
            className="border px-3 py-2 rounded"
            value={newStock.size}
            onChange={(e) => {
              setNewStock({ ...newStock, size: e.target.value });
            }}
          />
          <input
            type="number"
            placeholder="Quantity"
            className="border px-3 py-2 rounded"
            value={newStock.quantity}
            onChange={(e) => {
              setNewStock({ ...newStock, quantity: e.target.value });
            }}
          />
          <input
            type="number"
            placeholder="Minimum Required"
            className="border px-3 py-2 rounded"
            value={newStock.minRequired}
            onChange={(e) => {
              setNewStock({ ...newStock, minRequired: e.target.value });
            }}
          />
          <input
            type="text"
            placeholder="remark"
            className="border px-3 py-2 rounded"
            value={newStock.remarks}
            onChange={(e) => {
              setNewStock({ ...newStock, remarks: e.target.value });
            }}
          />
          <input
            type="text"
            placeholder="companyname"
            className="border px-3 py-2 rounded"
            value={newStock.companyname}
            onChange={(e) => {
              setNewStock({ ...newStock, companyname: e.target.value });
            }}
          />
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              className="px-4 py-2 rounded border"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              onClick={addstock}
              className="px-4 py-2 rounded bg-orange-500 text-white"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <Toaster className="position top right" />
    </div>
  );
}

export default AddStockModal;
