import { model, Schema } from "mongoose";

const newRemnant = new Schema(
  {
    thickness: { type: Number, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    minRequired: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },
    remarks: { type: String },
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyname: { type: String, required: true },
    sheetType: {
      type: String,
      default: "remnant",
    },
    orignalsheetid: {
      type: Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
    shapeDescription: { type: String },
    sheetCanvas: { type: String },
  },
  { timestamps: true }
);

const RemnantStock = model("RemnantStock", newRemnant);
export default RemnantStock;
