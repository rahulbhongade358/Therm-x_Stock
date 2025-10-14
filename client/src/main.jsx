import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./Views/User/Login.jsx";
import Signin from "./Views/User/Signin.jsx";
import Dashboard from "./Views/Dashboard.jsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import AddStockModal from "./Components/AddStockModal.jsx";
import StockTable from "./Components/StockTable.jsx";
import Update from "./Views/Update.jsx";
import UpdateRemnant from "./Views/UpdateRemnant.jsx";
import StockDetails from "./Views/StockDetails.jsx";
import Canvas from "./Components/Canvas/Canvas.jsx";
import AddRemnantStockModal from "./Components/AddRemnantStockModal .jsx";
import RemnantCanvas from "./Components/Canvas/RemnantCanvas.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signin />} />
      <Route path="/addstocks" element={<AddStockModal />} />
      <Route path="/addremnantstocks" element={<AddRemnantStockModal />} />
      <Route path="/allstocks" element={<StockTable />} />
      <Route path="/update/:id" element={<Update />} />
      <Route path="/updateremnant/:id" element={<UpdateRemnant />} />
      <Route path="/stockdetails/:id" element={<StockDetails />} />
      <Route path="/canvas" element={<Canvas />} />
      <Route path="/remnantcanvas" element={<RemnantCanvas />} />
    </Routes>
  </Router>
);
