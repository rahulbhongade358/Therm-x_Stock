import React from "react";

function StockTable({ stockData }) {
  return (
    <table className="min-w-full bg-white rounded shadow overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-4 py-2">Thickness (mm)</th>
          <th className="px-4 py-2">Size</th>
          <th className="px-4 py-2">Quantity</th>
          <th className="px-4 py-2">Min Required</th>
          <th className="px-4 py-2">Last Updated</th>
          <th className="px-4 py-2">Remarks</th>
        </tr>
      </thead>
      <tbody>
        {stockData.map((stock) => (
          <tr
            key={stock.id}
            className={stock.quantity < stock.minRequired ? "bg-red-100" : ""}
          >
            <td className="border px-4 py-2">{stock.thickness}</td>
            <td className="border px-4 py-2">{stock.size}</td>
            <td className="border px-4 py-2">{stock.quantity}</td>
            <td className="border px-4 py-2">{stock.minRequired}</td>
            <td className="border px-4 py-2">{stock.lastUpdated}</td>
            <td className="border px-4 py-2">
              {stock.quantity < stock.minRequired ? "Low Stock" : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StockTable;
