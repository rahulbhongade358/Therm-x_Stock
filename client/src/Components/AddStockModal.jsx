import React from "react";

function AddStockModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Add Stock</h3>
        <form className="flex flex-col gap-3">
          <input
            type="number"
            placeholder="Thickness (mm)"
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Size (mm x mm)"
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Quantity"
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Minimum Required"
            className="border px-3 py-2 rounded"
          />
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-orange-500 text-white"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStockModal;
