import express from "express";
import User from "../models/User.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/users → Ajouter un serveur ou cuisinier (ADMIN)
router.post("/", verifyToken, verifyRole("ADMIN"), async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.status(201).json(newUser);
});

// GET /api/users → Liste tous
router.get("/", verifyToken, verifyRole("ADMIN"), async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// PUT /api/users/:id → Modifier un utilisateur
router.put("/:id", verifyToken, verifyRole("ADMIN"), async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

// DELETE /api/users/:id → Supprimer
router.delete("/:id", verifyToken, verifyRole("ADMIN"), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Utilisateur supprimé" });
});

export default router;
