import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { getCurrentuser } from "./../utils/utils.js";
function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentuser());
  }, []);
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col p-5 shadow-lg">
      <h1 className="text-3xl font-extrabold mb-10 text-center tracking-wide">
        Therm-X
      </h1>
      <nav className="flex flex-col gap-3">
        <Link to="/allstocks">
          <button className="w-full text-left hover:bg-gray-800 p-3 rounded-lg transition-colors duration-200">
            Stocks
          </button>
        </Link>
        <button className="text-left hover:bg-gray-800 p-3 rounded-lg transition-colors duration-200">
          Reports
        </button>
        {user ? (
          <button
            className="w-full text-left hover:bg-red-600 p-3 rounded-lg transition-colors duration-200"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button className="w-full text-left hover:bg-red-600 p-3 rounded-lg transition-colors duration-200">
              Login
            </button>
          </Link>
        )}
      </nav>
      <footer className="mt-auto text-sm text-gray-400 text-center pt-6 border-t border-gray-700">
        © 2025 Therm-X Pvt. Ltd.
      </footer>
    </div>
  );
}

export default Sidebar;
