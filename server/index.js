import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { postLogin, postSignin } from "./controllers/user.js";
import {
  getStocks,
  postStocks,
  getStocksbyID,
  putStocksbyID,
  getStockbySearch,
} from "./controllers/stock.js";
import {
  postRemnantStocks,
  putRemnantStocksbyID,
  getRemnantStocksbyID,
} from "./controllers/remnant.js";
dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://therm-x-stock-in.onrender.com",

    credentials: true,
  })
);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // exit server if DB fails
  }
};

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Therm-x Server is healthy",
  });
});

app.post("/login", postLogin);
app.post("/signin", postSignin);
app.post("/stocks", postStocks);
app.post("/remnantstocks", postRemnantStocks);
app.get("/allstocks", getStocks);
app.get("/stocks/search", getStockbySearch);
app.get("/stocks/:ID", getStocksbyID);
app.get("/remnantstocks/:ID", getRemnantStocksbyID);
app.put("/stocks/:ID", putStocksbyID);
app.put("/remnantstocks/:ID", putRemnantStocksbyID);

const PORT = process.env.PORT || 8080;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
