import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  currentClient: { type: mongoose.Schema.Types.ObjectId, ref: "Client", default: null },
  occupied: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Table", TableSchema);