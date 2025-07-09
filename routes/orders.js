import express from "express";
import Order from "../models/Order.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/orders → client passe commande
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.status(201).json(newOrder);
});

// GET /api/orders/global → admin voit tout
router.get("/global", verifyToken, verifyRole("ADMIN"), async (req, res) => {
  const orders = await Order.find().populate("clientId serverId tableId");
  res.json(orders);
});

// GET /api/orders/me → serveur/chef voit ses commandes
router.get("/me", verifyToken, async (req, res) => {
  const role = req.user.role;
  const query = role === "SERVER" ? { serverId: req.user.id } : {};
  const orders = await Order.find(query);
  res.json(orders);
});

// PATCH /api/orders/status/:id → mise à jour de l’état
router.patch("/status/:id", verifyToken, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(order);
});

export default router;