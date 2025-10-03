import Stock from "../models/Stock";

const postStock = async (req, res) => {
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

export { postStock };
