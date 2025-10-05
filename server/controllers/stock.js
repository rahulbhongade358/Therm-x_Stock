import Stock from "./../models/Stock.js";

const postStocks = async (req, res) => {
  const {
    thickness,
    size,
    quantity,
    minRequired,
    remarks,
    addedBy,
    companyname,
  } = req.body;
  if (
    (!thickness,
    !size,
    !quantity,
    !minRequired,
    !remarks,
    !addedBy,
    !companyname)
  ) {
    return res.json({
      success: false,
      message: "All Fields Are Required",
    });
  }
  const newStock = new Stock({
    thickness,
    size,
    quantity,
    minRequired,
    remarks,
    addedBy,
    companyname,
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
export { postStocks, getStocks, getStocksbyID };
