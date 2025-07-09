import express from "express";
import Table from "../models/Table.js";
import Client from "../models/Client.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/tables → créer une nouvelle table (admin seulement)
router.post("/", verifyToken, verifyRole("ADMIN"), async (req, res) => {
  try {
    const table = new Table(req.body);
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la création de la table." });
  }
});

// PATCH /api/tables/:id/assign → affecter un serveur à une table (admin)
router.patch("/:id/assign", verifyToken, verifyRole("ADMIN"), async (req, res) => {
  try {
    const { serverId } = req.body;
    const table = await Table.findByIdAndUpdate(req.params.id, { assignedTo: serverId }, { new: true });
    res.json(table);
  } catch (err) {
    res.status(400).json({ message: "Erreur d'affectation du serveur." });
  }
});

// PATCH /api/tables/:id/occupy → un client s’assoit à une table (client)
router.patch("/:id/occupy", verifyToken, async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table || table.occupied) return res.status(400).json({ message: "Table non disponible" });

    table.occupied = true;
    table.currentClient = req.user.id;
    await table.save();

    await Client.findByIdAndUpdate(req.user.id, { table: table._id });

    res.json({ message: "Table occupée avec succès", tableId: table._id });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l’occupation de la table." });
  }
});

// PATCH /api/tables/:id/free → libérer une table (admin ou serveur)
router.patch("/:id/free", verifyToken, async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, { occupied: false, currentClient: null }, { new: true });
    res.json({ message: "Table libérée", table });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la libération de la table." });
  }
});

// GET /api/tables → liste de toutes les tables (filtrage possible)
router.get("/", verifyToken, async (req, res) => {
  const filter = {};
  if (req.query.occupied) filter.occupied = req.query.occupied === "true";
  if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

  const tables = await Table.find(filter).populate("assignedTo currentClient");
  res.json(tables);
});

export default router;
