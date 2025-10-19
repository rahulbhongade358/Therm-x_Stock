import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const StockDetails = () => {
  const { id } = useParams();
  const [zoom, setZoom] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [remnantData, setRemnantData] = useState(null);
  const [loadingStock, setLoadingStock] = useState(true);
  const [loadingRemnant, setLoadingRemnant] = useState(true);
  const fetchData = async () => {
    try {
      const stockRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/stocks/${id}`
      );
      const remnantRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/remnantstocks/${id}`
      );

      setStockData(stockRes?.data?.data);
      setLoadingStock(false);
      setRemnantData(remnantRes?.data?.data);
      setLoadingRemnant(false);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const deletesheet = async () => {
    const del = await axios.delete(
      `${import.meta.env.VITE_API_URL}/stock/${id}`
    );
    if (del) {
      toast.success("sheet deleted successfully");
      fetchData();
    }
  };
  const zoomCanva = () => {
    setZoom(!zoom);
    console.log(zoom);
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
        {loadingStock ? (
          <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
            <div className="space-y-4 p-4">
              <Skeleton height={30} width={"40%"} />
              <Skeleton height={25} count={6} />
              <Skeleton height={180} borderRadius={10} />
            </div>
          </SkeletonTheme>
        ) : type === "regular" || type === "remnant" ? (
          <div className="mb-8 relative">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2 mb-6 border-b pb-2">
              <span className="text-blue-600 text-2xl">📦</span>
              {`${type.charAt(0).toUpperCase() + type.slice(1)} stock`}
            </h2>
            <div
              className="absolute top-10 right-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold p-2.5 rounded-xl shadow-md transition-all duration-200"
              onClick={() => {
                deletesheet();
              }}
            >
              <button className="cursor-pointer ">delete</button>
            </div>
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
              <p className="col-span-1 sm:col-span-2">
                <span className="font-semibold text-gray-900">Remarks:</span>{" "}
                {stockData.remarks || "—"}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Company:</span>{" "}
                {stockData.companyname}
              </p>
              {stockData?.sheetType === "remnant" ? (
                <div className="col-span-1 sm:col-span-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                    <div className="flex-1">
                      <p className="text-gray-700">
                        <span className="font-semibold text-gray-900">
                          Shape Description:
                        </span>{" "}
                        {stockData.shapeDescription || "—"}
                      </p>
                    </div>
                    {stockData.sheetCanvas ? (
                      <div>
                        <img
                          src={stockData.sheetCanvas}
                          alt="Sheet Canvas"
                          className="w-70 h-50  border border-gray-300 rounded-lg shadow-sm"
                        />
                        <button
                          onClick={zoomCanva}
                          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-sm transition-all duration-200"
                        >
                          🔍 Zoom
                        </button>
                      </div>
                    ) : (
                      <div className="w-56 h-40 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-400 italic text-sm">
                        No Preview
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
              {zoom && (
                <div className="fixed inset-0 bg-gray-400 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
                  <div className="relative">
                    <img
                      src={stockData.sheetCanvas}
                      alt="Zoomed Sheet Canvas"
                      className="max-w-[90vw] max-h-[100vh] rounded-xl shadow-2xl transform scale-100 transition-transform duration-300"
                    />
                    <button
                      onClick={() => setZoom(false)}
                      className="absolute top-2 right-2 bg-white hover:bg-gray-200 text-gray-800 font-semibold px-3 py-1 rounded-lg shadow-md transition-all duration-200"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

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

        {loadingRemnant ? (
          <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
            <div className="space-y-4 p-4">
              <Skeleton height={30} width={"40%"} />
              <Skeleton height={25} count={6} />
              <Skeleton height={180} borderRadius={10} />
            </div>
          </SkeletonTheme>
        ) : remnantData?.sheetType === "remnant" ? (
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
              <img
                src={remnantData.sheetCanvas}
                alt="sheetCanvas"
                className="w-48 h-32 border rounded-2xl shadow"
              />
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

      <Toaster className="position top right" />
    </div>
  );
};

export default StockDetails;
