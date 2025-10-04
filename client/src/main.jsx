import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./Views/User/Login.jsx";
import Signin from "./Views/User/Signin.jsx";
import Dashboard from "./Views/Dashboard.jsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AddStockModal from "./Components/AddStockModal.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/addstocks" element={<AddStockModal />} />
    </Routes>
  </Router>
);
