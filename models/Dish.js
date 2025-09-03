// 📁 models/Dish.js
import mongoose from "mongoose";

const DishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  tags: [String], // ex: ["vegan", "recommendation", "dessert"]
  available: { type: Boolean, default: true },
  imageUrl: { type: String, default: "" } // 🔥 URL de l'image (hébergée)
}, { timestamps: true });

export default mongoose.model("Dish", DishSchema);
 