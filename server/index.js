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
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    if (connect) {
      console.log("✅ MongoDB connected successfully");
    }
  } catch (error) {
    console.log(`MongoDB connection error: ${error.message}`);
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
app.get("/allstocks", getStocks);
app.get("/stocks/search", getStockbySearch);
app.get("/stocks/:ID", getStocksbyID);
app.put("/stocks/:ID", putStocksbyID);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
