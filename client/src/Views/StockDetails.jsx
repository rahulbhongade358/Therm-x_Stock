import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

const StockDetails = () => {
  const { id } = useParams();

  const [stockData, setStockData] = useState(null);
  const [remnantData, setRemnantData] = useState(null);

  const fetchData = async () => {
    try {
      const stockRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/stocks/${id}`
      );
      const remnantRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/remnantstocks/${id}`
      );

      setStockData(stockRes?.data?.data);
      setRemnantData(remnantRes?.data?.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);
  const type = stockData?.sheetType;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-8 text-center">
          Stock Details
        </h1>
        {stockData?.sheetType === "regular" ||
        stockData?.sheetType === "remnant" ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2 mb-6 border-b pb-2">
              <span className="text-blue-600 text-2xl">📦</span>
              {`${type.charAt(0).toUpperCase() + type.slice(1)} stock`}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Thickness:</span>{" "}
                {stockData.thickness} mm
              </p>
              <p>
                <span className="font-semibold text-gray-900">Size:</span>{" "}
                {stockData.size}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Quantity:</span>{" "}
                {stockData.quantity}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Sheet Type:</span>{" "}
                {stockData.sheetType}
              </p>
              <p>
                <span className="font-semibold text-gray-900">
                  Min Required:
                </span>{" "}
                {stockData.minRequired}
              </p>
              <p className="col-span-1 sm:col-span-2">
                <span className="font-semibold text-gray-900">Remarks:</span>{" "}
                {stockData.remarks || "—"}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Company:</span>{" "}
                {stockData.companyname}
              </p>
              <p className="col-span-1 sm:col-span-2">
                <span className="font-semibold text-gray-900">Added By:</span>{" "}
                {stockData.addedBy?.name} ({stockData.addedBy?.email})
              </p>
              <p className="col-span-1 sm:col-span-2 text-sm text-gray-500">
                <span className="font-semibold text-gray-700">
                  Last Updated:
                </span>{" "}
                {new Date(stockData.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : null}

        <div className="border-t border-gray-300 my-6"></div>

        {remnantData?.sheetType === "remnant" ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2 mb-6 border-b pb-2">
              <span className="text-blue-600 text-2xl">🧩</span>
              Remnant Stock
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Thickness:</span>{" "}
                {remnantData.thickness} mm
              </p>
              <p>
                <span className="font-semibold text-gray-900">Size:</span>{" "}
                {remnantData.size}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Quantity:</span>{" "}
                {remnantData.quantity}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Remarks:</span>{" "}
                {remnantData.remarks || "—"}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Company:</span>{" "}
                {remnantData.companyname}
              </p>
              <p>
                <span className="font-semibold text-gray-900">
                  Shape Description:
                </span>{" "}
                {remnantData.shapeDescription || "—"}
              </p>
              <p className="col-span-1 sm:col-span-2">
                <span className="font-semibold text-gray-900">Added By:</span>{" "}
                {remnantData.addedBy?.name} ({remnantData.addedBy?.email})
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-10 text-center">
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all duration-200"
          >
            ← Back to Stocks
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
