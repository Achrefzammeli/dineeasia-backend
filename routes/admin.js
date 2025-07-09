import express from "express";
import Table from "../models/Table.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken, verifyRole("ADMIN"), (req, res) => {
  res.json({ message: "Bienvenue sur le dashboard Admin !" });
});
// GET /api/admin/overview → vue d’ensemble
router.get("/overview", verifyToken, verifyRole("ADMIN"), async (req, res) => {
  try {
    const activeServers = await User.countDocuments({ role: "SERVER" });
    const tablesOccupied = await Table.countDocuments({ occupied: true });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ordersToday = await Order.countDocuments({ createdAt: { $gte: today } });

    res.json({ activeServers, tablesOccupied, ordersToday });
  } catch (err) {
    res.status(500).json({ message: "Erreur dans la vue d’ensemble." });
  }
});
export default router;
