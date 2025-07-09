// 📁 routes/dishes.js
import express from "express";
import Dish from "../models/Dish.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/dishes → tous les plats
router.get("/", async (req, res) => {
  const dishes = await Dish.find();
  res.json(dishes);
});

// POST /api/dishes → ajouter un plat (ADMIN seulement)
router.post("/", verifyToken, verifyRole("ADMIN"), async (req, res) => {
  try {
    const dish = new Dish(req.body);
    await dish.save();
    res.status(201).json(dish);
  } catch (err) {
    res.status(400).json({ message: "Erreur création plat" });
  }
});

// PUT /api/dishes/:id → modifier
router.put("/:id", verifyToken, verifyRole("ADMIN"), async (req, res) => {
  const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(dish);
});

// DELETE /api/dishes/:id → supprimer
router.delete("/:id", verifyToken, verifyRole("ADMIN"), async (req, res) => {
  await Dish.findByIdAndDelete(req.params.id);
  res.json({ message: "Plat supprimé" });
});

// GET /api/dishes/filter?tag=recommendation
router.get("/filter", async (req, res) => {
  const tag = req.query.tag;
  const dishes = await Dish.find({ tags: tag });
  res.json(dishes);
});

export default router;
