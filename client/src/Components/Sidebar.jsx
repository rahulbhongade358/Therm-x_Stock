import React from "react";
import { Link } from "react-router";
function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8">Therm-X</h1>
      <nav className="flex flex-col gap-4">
        <Link to="/dashboard">
          <button className="hover:bg-gray-700 p-2 rounded">Dashboard</button>
        </Link>
        <Link to="/addstocks">
          <button className="hover:bg-gray-700 p-2 rounded">Add Stock</button>
        </Link>
        <button className="hover:bg-gray-700 p-2 rounded">Update Stock</button>
        <button className="hover:bg-gray-700 p-2 rounded">Reports</button>
        <Link to="/login">
          <button className="hover:bg-gray-700 p-2 rounded">Login</button>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
