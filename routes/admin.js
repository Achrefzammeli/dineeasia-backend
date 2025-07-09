import express from "express";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken, verifyRole("ADMIN"), (req, res) => {
  res.json({ message: "Bienvenue sur le dashboard Admin !" });
});

export default router;
