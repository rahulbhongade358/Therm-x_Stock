import Stock from "../models/Stock.js";
import RemnantStock from "./../models/Remnant.js";

const postRemnantStocks = async (req, res) => {
  const {
    thickness,
    dimensions,
    shapeDescription,
    companyname,
    addedBy,
    orignalsheetid,
    remarks,
    sheetCanvas,
  } = req.body;
  const density = 7850; // kg/m³ for steel
  const totalarea = dimensions.reduce(
    (sum, dim) => sum + dim.length * dim.width,
    0
  );
  const weight = (totalarea * thickness * density) / 1000000000;
  const newRemnantStock = new RemnantStock({
    thickness,
    dimensions,
    weight,
    shapeDescription,
    companyname,
    addedBy,
    orignalsheetid,
    remarks,
    sheetType: "remnant",
    quantity: 1,
    sheetCanvas,
  });
  const saveRemnantStock = await newRemnantStock.save();

  const updatedOriginal = await Stock.findByIdAndUpdate(
    orignalsheetid,
    {
      $inc: { quantity: -1 },
    },
    { new: true }
  );
  if (updatedOriginal && updatedOriginal.quantity <= 0) {
    await Stock.findByIdAndDelete(orignalsheetid);
  }
  res.status(201).json({
    success: true,
    data: saveRemnantStock,
    message: "Stock is saved Successfully",
  });
};

const putRemnantStocksbyID = async (req, res) => {
  const { ID } = req.params;
  const {
    thickness,
    length,
    width,
    remarks,
    addedBy,
    companyname,
    shapeDescription,
    sheetCanvas,
  } = req.body;
  const density = 7850; // kg/m³ for steel
  const weight = (length * width * thickness * density) / 1000000000;
  const existingStock = await RemnantStock.findOne({ _id: ID });
  if (!existingStock) {
    return res.status(404).json({
      success: false,
      message: "Blog not Found",
    });
  }
  if ((length && width === "0") || thickness === "0") {
    await RemnantStock.findByIdAndDelete(ID);
    return res.status(200).json({
      success: true,
      message: "Remnant fully used — record deleted automatically",
    });
  }
  const updatestock = await RemnantStock.findOneAndUpdate(
    { _id: ID },
    {
      thickness,
      length,
      width,
      weight,
      quantity: 1,
      remarks,
      addedBy,
      companyname,
      shapeDescription,
      sheetType: "remnant",
      sheetCanvas,
    }
  );
  return res.status(200).json({
    success: true,
    message: "Stock updated successfully",
    data: updatestock,
  });
};

const getRemnantStocksbyID = async (req, res) => {
  const { ID } = req.params;

  const response = await RemnantStock.findById(ID)
    .populate("orignalsheetid", "quantity _id length width")
    .populate("addedBy", "_id name email");
  try {
    if (response) {
      res.status(201).json({
        success: true,
        data: response,
        message: "Stock fetched successfully",
      });
    } else {
      res.json({
        success: false,
        data: null,
        message: "❌ No Stock found with the given ID",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "❌ Invalid ID format",
    });
  }
};
const getRemnantStock = async (req, res) => {
  const remnantstock = await RemnantStock.find()
    .populate("orignalsheetid", "_id quantity")
    .populate("addedBy", "_id name email")
    .sort({ thickness: 1, updatedAt: -1 });
  res.json({
    success: true,
    data: remnantstock,
    message: `${remnantstock.length} Stocks fetched successfully`,
  });
};
const deleteremnantStockbyID = async (req, res) => {
  const { ID } = req.params;
  await RemnantStock.findByIdAndDelete(ID);
  const updatedata = await RemnantStock.find();
  res.json({
    success: true,
    data: updatedata,
    message: `Sheet Deleted Successfully`,
  });
};
export {
  deleteremnantStockbyID,
  postRemnantStocks,
  putRemnantStocksbyID,
  getRemnantStocksbyID,
  getRemnantStock,
};
