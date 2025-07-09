import express from "express";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/kitchen", verifyToken, verifyRole("CHEF"), (req, res) => {
  res.json({ message: `Bienvenue chef ${req.user.id}` });
});

export default router;
