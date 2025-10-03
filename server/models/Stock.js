import { model, Schema } from "mongoose";

const stockSchema = new Schema(
  {
    thickness: { type: Number, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    minRequired: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },
    remarks: { type: String },
    addedBy: { type: Schema.Types.ObjectId, ref: "User" },
    companyname: { type: String, required: true },
  },
  { timestamps: true }
);

const Stock = model("Stock", stockSchema);
export default Stock;
