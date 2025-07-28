import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import serverRoutes from "./routes/Server.js";
import chefRoutes from "./routes/chef.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import clientAuthRoutes from "./routes/clientAuth.js";
import dishRoutes from "./routes/dish.js";
import ordersRoutes from "./routes/orders.js";
import usersRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const httpServer = createServer(app); // ✅ on crée un serveur HTTP
const io = new Server(httpServer, {
  cors: {
    origin: "*", // pour Postman ou ton frontend plus tard
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

/** ✅ Socket.io configuration */
io.on("connection", (socket) => {
  console.log("🟢 Client connecté :", socket.id);

  socket.on("newOrder", (orderData) => {
    console.log("🍽️ Nouvelle commande reçue :", orderData);
    io.emit("orderReceived", orderData); // envoie à tous
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client déconnecté :", socket.id);
  });
});

/** ✅ Injection de io dans les routes si besoin */
app.set("io", io);

/** 🔁 Routes */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/server", serverRoutes);
app.use("/api/chef", chefRoutes);
app.use("/api/client", clientAuthRoutes);
app.use("/api/dish", dishRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/users", usersRoutes);

/** ✅ MongoDB + Lancement serveur */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    httpServer.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
