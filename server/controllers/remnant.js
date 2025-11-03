import Stock from "../models/Stock.js";
import RemnantStock from "./../models/Remnant.js";

const postRemnantStocks = async (req, res) => {
  try {
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

    // ✅ Calculate total area and weight (for steel)
    const density = 7850; // kg/m³ for steel
    const totalArea = dimensions.reduce(
      (sum, dim) => sum + Number(dim.length || 0) * Number(dim.width || 0),
      0
    );

    const weight = (totalArea * Number(thickness) * density) / 1_000_000_000; // mm³ → m³

    // ✅ Create new remnant record
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

    const savedRemnant = await newRemnantStock.save();

    // ✅ Update original sheet: decrease quantity and adjust weight
    if (orignalsheetid) {
      const originalSheet = await Stock.findById(orignalsheetid);

      if (originalSheet) {
        const updatedQuantity = Math.max(originalSheet.quantity - 1, 0);
        const updatedWeight =
          (originalSheet.length *
            originalSheet.width *
            thickness *
            density *
            updatedQuantity) /
          1000000000;
        await Stock.findByIdAndUpdate(
          orignalsheetid,
          {
            $set: { weight: updatedWeight, quantity: updatedQuantity },
          },
          { new: true }
        );

        // ✅ If quantity becomes 0 → delete the original stock
        if (updatedQuantity <= 0) {
          await Stock.findByIdAndDelete(orignalsheetid);
        }
      }
    }

    // ✅ Send response
    res.status(201).json({
      success: true,
      data: savedRemnant,
      message: "Remnant stock saved successfully!",
    });
  } catch (error) {
    console.error("Error posting remnant stock:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save remnant stock.",
      error: error.message,
    });
  }
};

const putRemnantStocksbyID = async (req, res) => {
  const { ID } = req.params;
  const {
    thickness,
    dimensions,
    remarks,
    addedBy,
    companyname,
    shapeDescription,
    sheetCanvas,
  } = req.body;

  const density = 7850; // kg/m³ for steel

  // ✅ Calculate total area
  const totalArea = dimensions.reduce(
    (sum, dim) => sum + dim.length * dim.width,
    0
  );

  // ✅ Calculate weight
  const weight = (totalArea * thickness * density) / 1_000_000_000;

  // ✅ Find existing stock
  const existingStock = await RemnantStock.findOne({ _id: ID });
  if (!existingStock) {
    return res.status(404).json({
      success: false,
      message: "Remnant not found",
    });
  }

  // ✅ Check if remnant is fully used
  const isFullyUsed =
    dimensions.every((dim) => dim.length <= 100 || dim.width <= 100) ||
    thickness === 0;

  if (isFullyUsed) {
    await RemnantStock.findByIdAndDelete(ID);
    return res.status(200).json({
      success: true,
      message: "Remnant fully used — record deleted automatically",
    });
  }

  // ✅ Update remnant data
  const updatedStock = await RemnantStock.findOneAndUpdate(
    { _id: ID },
    {
      thickness,
      dimensions,
      weight,
      quantity: 1,
      remarks,
      addedBy,
      companyname,
      shapeDescription,
      sheetType: "remnant",
      sheetCanvas,
    },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Stock updated successfully",
    data: updatedStock,
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
