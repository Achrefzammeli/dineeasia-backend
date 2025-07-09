import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", default: null }

  },
  { timestamps: true }
);

export default mongoose.model("Client", ClientSchema);
