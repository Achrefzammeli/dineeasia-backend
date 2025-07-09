import express from "express";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/orders", verifyToken, verifyRole("SERVER"), (req, res) => {
  res.json({ message: `Bienvenue serveur ${req.user.id}` });
});

export default router;
    