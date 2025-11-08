import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { getCurrentuser } from "./../utils/utils.js";
import { Menu, X } from "lucide-react";

function Sidebar() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentuser());
  }, []);

  return (
    <div className="relative z-50">
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg z-50">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-3xl font-extrabold tracking-wider text-white drop-shadow-md">
            THERM-<span className="text-red-700 italic">X</span>
          </h1>
          <div className="hidden md:flex items-center gap-6 text-lg font-medium">
            <Link to="/allstocks">
              <button className="flex items-center gap-2 hover:text-blue-300 transition-all duration-200">
                📦 <span>Stocks</span>
              </button>
            </Link>

            {user ? (
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
              >
                🚪 <span>Logout</span>
              </button>
            ) : (
              <Link to="/login">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200">
                  🔐 <span>Login</span>
                </button>
              </Link>
            )}
          </div>
          <button
            className="md:hidden text-white hover:text-blue-400 transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden flex flex-col items-center gap-4 py-4 bg-gradient-to-b from-gray-800 to-gray-700 text-lg shadow-md">
            <Link onClick={() => setIsOpen(false)} to="/allstocks">
              <button className="flex items-center gap-2 hover:text-blue-300 transition-all duration-200 font-medium">
                📦 <span>Stocks</span>
              </button>
            </Link>

            {user ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  localStorage.clear();
                  window.location.href = "/";
                }}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
              >
                🚪 <span>Logout</span>
              </button>
            ) : (
              <Link to="/login">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200">
                  🔐 <span>Login</span>
                </button>
              </Link>
            )}
          </div>
        )}
      </nav>
      <div className="pt-[80px]"></div>

      <footer className="fixed bottom-2 left-0 w-full text-center text-xs text-gray-400 pt-2 border-t border-gray-700 bg-transparent">
        © 2025{" "}
        <span className="font-semibold text-gray-300">Therm-X Pvt. Ltd.</span>
      </footer>
    </div>
  );
}

export default Sidebar;
