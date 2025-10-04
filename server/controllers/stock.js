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

export { postStocks, getStocks };
