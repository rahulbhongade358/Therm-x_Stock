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
    minRequired: "",
    remarks: "",
    addedBy: "",
    companyname: "",
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Add Stock</h3>
        <div className="flex flex-col gap-3">
          <input
            type="number"
            placeholder="Thickness (mm)"
            className="border px-3 py-2 rounded"
            value={updateStock.thickness}
            onChange={(e) => {
              setUpdateStock({ ...updateStock, thickness: e.target.value });
            }}
          />
          <input
            type="text"
            placeholder="Size (mm x mm)"
            className="border px-3 py-2 rounded"
            value={updateStock.size}
            onChange={(e) => {
              setUpdateStock({ ...updateStock, size: e.target.value });
            }}
          />
          <input
            type="number"
            placeholder="Quantity"
            className="border px-3 py-2 rounded"
            value={updateStock.quantity}
            onChange={(e) => {
              setUpdateStock({ ...updateStock, quantity: e.target.value });
            }}
          />
          <input
            type="number"
            placeholder="Minimum Required"
            className="border px-3 py-2 rounded"
            value={updateStock.minRequired}
            onChange={(e) => {
              setUpdateStock({ ...updateStock, minRequired: e.target.value });
            }}
          />
          <input
            type="text"
            placeholder="remark"
            className="border px-3 py-2 rounded"
            value={updateStock.remarks}
            onChange={(e) => {
              setUpdateStock({ ...updateStock, remarks: e.target.value });
            }}
          />
          <input
            type="text"
            placeholder="companyname"
            className="border px-3 py-2 rounded"
            value={updateStock.companyname}
            onChange={(e) => {
              setUpdateStock({ ...updateStock, companyname: e.target.value });
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
              onClick={updatestock}
              className="px-4 py-2 rounded bg-orange-500 text-white"
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <Toaster className="position top right" />
    </div>
  );
}

export default Update;
