import Stock from "../models/Stock.js";
import RemnantStock from "./../models/Remnant.js";

const postRemnantStocks = async (req, res) => {
  const {
    thickness,
    size,
    shapeDescription,
    companyname,
    addedBy,
    orignalsheetid,
    remarks,
    sheetCanvas,
  } = req.body;
  const newRemnantStock = new RemnantStock({
    thickness,
    size,
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
// const getRemnantStockbySearch = async (req, res) => {
//   const { q } = req.query;
//   const conditions = [];
//   if (!isNaN(q)) {
//     conditions.push({ thickness: Number(q) });
//   }

//   conditions.push({ companyname: { $regex: q, $options: "i" } });
//   conditions.push({ companyname: { $regex: q, $options: "i" } });
//   const Remnant = await RemnantStock.find({ $or: conditions });
//   try {
//     if (Remnant.length == 0) {
//       return res.status(404).json({
//         success: false,
//         data: [],
//         message: "❌ No Stock found ",
//       });
//     }
//     res.json({
//       success: true,
//       data: Remnant,
//       message: ` ${Remnant.length} Stocks fetched successfully`,
//     });
//   } catch (error) {
//     return res.json({
//       success: false,
//       message: `${error}`,
//     });
//   }
// };

const putRemnantStocksbyID = async (req, res) => {
  const { ID } = req.params;
  const {
    thickness,
    size,
    remarks,
    addedBy,
    companyname,
    shapeDescription,
    sheetCanvas,
  } = req.body;
  const existingStock = await RemnantStock.findOne({ _id: ID });
  if (!existingStock) {
    return res.status(404).json({
      success: false,
      message: "Blog not Found",
    });
  }
  const updatestock = await RemnantStock.findOneAndUpdate(
    { _id: ID },
    {
      thickness,
      size,
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
    .populate("orignalsheetid", "quantity _id size")
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

export {
  postRemnantStocks,
  putRemnantStocksbyID,
  getRemnantStocksbyID,
  getRemnantStock,
};
