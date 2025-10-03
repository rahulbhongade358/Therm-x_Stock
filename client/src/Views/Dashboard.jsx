import React, { useState } from "react";
import StockTable from "./../Components/StockTable";
import AddStockModal from "./../Components/AddStockModal";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockData, setStockData] = useState([
    {
      id: 1,
      thickness: 2,
      size: "1250x2500",
      quantity: 10,
      minRequired: 5,
      lastUpdated: "2025-10-02",
    },
    {
      id: 2,
      thickness: 5,
      size: "1500x3000",
      quantity: 3,
      minRequired: 5,
      lastUpdated: "2025-10-02",
    },
    {
      id: 3,
      thickness: 10,
      size: "2000x6000",
      quantity: 12,
      minRequired: 10,
      lastUpdated: "2025-10-01",
    },
  ]);

  return (
    <div className="p-6 flex-1 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Stock List</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600"
        >
          + Add Stock
        </button>
      </div>
      <StockTable stockData={stockData} />
      {isModalOpen && <AddStockModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default Dashboard;
