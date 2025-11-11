import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const StockDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [zoom, setZoom] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [remnantData, setRemnantData] = useState(null);
  const [loadingStock, setLoadingStock] = useState(true);
  const [loadingRemnant, setLoadingRemnant] = useState(true);
  // ✅ Fetch both Stock and Remnant Data
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
  // ✅ Delete function
  const deletesheet = async () => {
    try {
      const Regulardel = await axios.delete(
        `${import.meta.env.VITE_API_URL}/stock/${id}`
      );
      const remnantDel = await axios.delete(
        `${import.meta.env.VITE_API_URL}/remnantstocks/${id}`
      );
      if (Regulardel || remnantDel) {
        toast.success("Sheet deleted successfully");
        fetchData();
        navigate("/allstocks");
      }
    } catch (err) {
      toast.error("Failed to delete sheet");
      console.error(err);
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

        {/* ---------- Regular Stock Section ---------- */}
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
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-6 border-b pb-2">
              📦 {type === "regular" ? "Regular" : "Remnant"} Stock
            </h2>

            <div
              className="absolute top-10 right-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold p-2.5 rounded-xl shadow-md transition-all duration-200"
              onClick={deletesheet}
            >
              <button className="cursor-pointer">Delete</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
              <p>
                <strong>Thickness:</strong> {stockData.thickness} mm
              </p>

              {type === "regular" ? (
                <>
                  <p>
                    <strong>Length:</strong> {stockData.length} mm
                  </p>
                  <p>
                    <strong>Width:</strong> {stockData.width} mm
                  </p>
                  <p>
                    <strong>Weight:</strong> {stockData.weight} kg
                  </p>
                </>
              ) : (
                <div className="col-span-2 bg-gray-50 border rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    📏 Dimensions:
                  </h3>
                  {Array.isArray(stockData.dimensions) &&
                  stockData.dimensions.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {stockData.dimensions.map((dim, index) => (
                        <li key={index}>
                          <strong>L{index + 1}:</strong> {dim.length} mm &nbsp;
                          <strong>W{index + 1}:</strong> {dim.width} mm
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>— No Dimensions Found —</p>
                  )}
                  <p>
                    <strong>Weight:</strong> {stockData.weight} kg
                  </p>
                </div>
              )}

              <p>
                <strong>Quantity:</strong> {stockData.quantity}
              </p>
              <p>
                <strong>Company:</strong> {stockData.companyname}
              </p>
              <p>
                <strong>Remarks:</strong> {stockData.remarks || "—"}
              </p>
              <p className="col-span-2">
                <strong>Added By:</strong> {stockData.addedBy?.name} (
                {stockData.addedBy?.email})
              </p>
              <p className="text-sm text-gray-500 col-span-2">
                <strong>Last Updated:</strong>{" "}
                {new Date(stockData.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : null}

        {/* ---------- Remnant Stock Section ---------- */}
        {loadingRemnant ? (
          <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
            <div className="space-y-4 p-4">
              <Skeleton height={30} width={"40%"} />
              <Skeleton height={25} count={6} />
              <Skeleton height={180} borderRadius={10} />
            </div>
          </SkeletonTheme>
        ) : remnantData?.sheetType === "remnant" ? (
          <div className="mb-8 relative">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-6 border-b pb-2">
              📦 Remnant Stock
            </h2>

            <div
              className="absolute top-10 right-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold p-2.5 rounded-xl shadow-md transition-all duration-200"
              onClick={deletesheet}
            >
              <button className="cursor-pointer">Delete</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
              <p>
                <strong>Thickness:</strong> {remnantData.thickness} mm
              </p>

              {/* ✅ Show multiple dimensions */}
              <div className="col-span-2 bg-gray-50 border rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  📏 Dimensions:
                </h3>
                {Array.isArray(remnantData.dimensions) &&
                remnantData.dimensions.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {remnantData.dimensions.map((dim, index) => (
                      <li key={index}>
                        <strong>L{index + 1}:</strong> {dim.length} mm &nbsp;
                        <strong>W{index + 1}:</strong> {dim.width} mm
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>— No Dimensions Found —</p>
                )}
                <p>
                  <strong>Weight:</strong> {remnantData.weight} kg
                </p>
              </div>

              <p>
                <strong>Quantity:</strong> {remnantData.quantity}
              </p>
              <p>
                <strong>Remarks:</strong> {remnantData.remarks || "—"}
              </p>
              <p>
                <strong>Company:</strong> {remnantData.companyname}
              </p>

              <p>
                <strong>Shape Description:</strong>{" "}
                {remnantData.shapeDescription || "—"}
              </p>

              <p className="col-span-2">
                <strong>Added By:</strong> {remnantData.addedBy?.name} (
                {remnantData.addedBy?.email})
              </p>
              <p className="text-sm text-gray-500 col-span-2">
                <strong>Last Updated:</strong>{" "}
                {new Date(remnantData.updatedAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 col-span-2">
                <strong>Pdf Name:</strong> {remnantData.pdfName}
              </p>
            </div>
          </div>
        ) : null}
        {
          <a
            href={`${import.meta.env.VITE_API_URL}/remnantstocks/viewpdf/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            View PDF
          </a>
        }

        <div className="mt-10 text-center">
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all duration-200"
          >
            ← Back to Stocks
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default StockDetails;
