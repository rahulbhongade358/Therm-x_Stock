import React from "react";

function Navbar() {
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h2 className="text-xl font-bold">Stock Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">User Name</span>
        <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  );
}

export default Navbar;
