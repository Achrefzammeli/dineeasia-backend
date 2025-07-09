import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["SERVER", "CHEF", "ADMIN"],
      default: "ADMIN",
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
