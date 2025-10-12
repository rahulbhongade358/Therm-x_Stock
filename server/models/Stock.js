import { model, Schema } from "mongoose";

const stockSchema = new Schema(
  {
    thickness: { type: Number, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },
    remarks: { type: String },
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyname: { type: String, required: true },
    sheetType: {
      type: String,
      enum: ["regular", "remnant"],
      default: "regular",
    },

    approxArea: { type: String },
    shapeDescription: { type: String },
    sheetCanvas: { type: String },
  },
  { timestamps: true }
);

const Stock = model("Stock", stockSchema);
export default Stock;
