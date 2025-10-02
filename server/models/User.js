import { model, Schema } from "mongoose";

export const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["employee", "staff"], default: "staff" },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
