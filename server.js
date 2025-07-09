import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import serverRoutes from "./routes/Server.js";
import chefRoutes from "./routes/chef.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import clientAuthRoutes from "./routes/clientAuth.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
// Ajoute après les autres middlewares
app.use("/api/admin", adminRoutes);
app.use("/api/server", serverRoutes);
app.use("/api/chef", chefRoutes);
app.use("/api/client", clientAuthRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
