import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const existing = await User.findOne({ email: "admin@dine.com" });
    if (existing) {
      console.log("❌ Admin déjà créé");
      process.exit();
    }

    const hashed = await bcrypt.hash("admin123", 10);
    const admin = new User({
      username: "admin",
      email: "admin@dine.com",
      password: hashed,
      role: "ADMIN"
    });

    await admin.save();
    console.log("✅ Admin créé avec succès");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Erreur:", err);
    process.exit();
  });
