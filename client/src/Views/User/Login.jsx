import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import toast, { Toaster } from "react-hot-toast";
function Login() {
  const [loginuser, setLoginuser] = useState({
    email: "",
    password: "",
  });

  const login = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/login`,
      loginuser
    );
    if (response?.data?.success) {
      toast.success(response.data.message);
      localStorage.setItem("userlogin", JSON.stringify(response.data.user));
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
        <div className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={loginuser.email}
            onChange={(e) => {
              setLoginuser({ ...loginuser, email: e.target.value });
            }}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginuser.password}
            onChange={(e) => {
              setLoginuser({ ...loginuser, password: e.target.value });
            }}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <button
            onClick={login}
            className="bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
          >
            Login
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-orange-500 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
      <Toaster className="position top right" />
    </div>
  );
}

export default Login;
