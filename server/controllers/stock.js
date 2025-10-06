import Stock from "./../models/Stock.js";

const postStocks = async (req, res) => {
  const {
    sheetType,
    thickness,
    size,
    quantity,
    minRequired,
    approxArea,
    shapeDescription,
    companyname,
    addedBy,
    remarks,
  } = req.body;
  const newStock = new Stock({
    sheetType,
    thickness,
    size,
    quantity,
    minRequired,
    approxArea,
    shapeDescription,
    companyname,
    addedBy,
    remarks,
  });
  const saveStock = await newStock.save();

  res.status(201).json({
    success: true,
    data: saveStock,
    message: "Stock is saved Successfully",
  });
};
const getStocks = async (req, res) => {
  const stocks = await Stock.find().populate("addedBy", "_id name email");

  res.status(200).json({
    success: true,
    message: "Stocks fetched successfully",
    data: stocks,
  });
};

const getStocksbyID = async (req, res) => {
  const { ID } = req.params;

  const response = await Stock.findById(ID).populate(
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

const getStockbySearch = async (req, res) => {
  const { q } = req.query;
  const conditions = [];
  if (!isNaN(q)) {
    conditions.push({ thickness: Number(q) });
  }

  conditions.push({ companyname: { $regex: q, $options: "i" } });
  const Stocks = await Stock.find({ $or: conditions });
  try {
    if (Stocks.length == 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "❌ No Stock found ",
      });
    }
    res.json({
      success: true,
      data: Stocks,
      message: ` ${Stocks.length} Stocks fetched successfully`,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `${error}`,
    });
  }
};
const putStocksbyID = async (req, res) => {
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
  const existingStock = await Stock.findOne({ _id: ID });
  if (!existingStock) {
    return res.status(404).json({
      success: false,
      message: "Blog not Found",
    });
  }
  if (
    !thickness ||
    !size ||
    !quantity ||
    !minRequired ||
    !remarks ||
    !addedBy ||
    !companyname
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required ",
    });
  }
  const updatestock = await Stock.findOneAndUpdate(
    { _id: ID },
    {
      thickness,
      size,
      quantity,
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

export {
  postStocks,
  getStocks,
  getStocksbyID,
  putStocksbyID,
  getStockbySearch,
};
