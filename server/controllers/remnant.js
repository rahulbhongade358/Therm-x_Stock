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
  } = req.body;
  const newRemnantStock = new RemnantStock({
    thickness,
    size,
    shapeDescription,
    companyname,
    addedBy,
    orignalsheetid,
    remarks,
    minRequired: 1,
    sheetType: "remnant",
    quantity: 1,
  });
  const saveRemnantStock = await newRemnantStock.save();

  await Stock.findByIdAndUpdate(orignalsheetid, {
    $inc: { quantity: -1 },
  });

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
    quantity,
    minRequired,
    remarks,
    addedBy,
    companyname,
    shapeDescription,
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
      minRequired,
      remarks,
      addedBy,
      companyname,
      shapeDescription,
      sheetType: "remnant",
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

  const response = await RemnantStock.findById(ID).populate(
    "addedBy",
    "_id name email"
  );
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

export { postRemnantStocks, putRemnantStocksbyID, getRemnantStocksbyID };
