import React, { useState } from "react";
import AddStockModal from "../Components/AddStockModal";

function Dashboard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 flex-1 overflow-auto bg-white rounded-lg shadow-md m-4">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h3 className="text-2xl font-semibold text-gray-700">Stock List</h3>
      </div>

      <div className="flex justify-end">
        <button
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg shadow-md font-medium"
          onClick={() => setShowModal(true)}
        >
          + Add Stock
        </button>
      </div>

      {showModal && <AddStockModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default Dashboard;
