import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
  items: [
    {
      dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
      quantity: Number
    }
  ],
  status: {
    type: String,
    enum: ["reçue", "en préparation", "prête", "servie", "annulée"],
    default: "reçue"
  }
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
