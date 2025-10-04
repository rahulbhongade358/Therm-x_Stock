import React from "react";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import Dashboard from "./Views/Dashboard";
import StockTable from "./Components/StockTable";

function App() {
  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-4 overflow-auto space-y-6">
          <StockTable />
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default App;
