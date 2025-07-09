import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Client from "../models/Client.js";

dotenv.config();

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await Client.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email déjà utilisé" });

    const hashed = await bcrypt.hash(password, 10);
    const client = new Client({ username, email, password: hashed });
    await client.save();

    res.status(201).json({ message: "Client inscrit avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await Client.findOne({ email });
    if (!client) return res.status(400).json({ message: "Email invalide" });

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ id: client._id, type: "CLIENT" }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.status(200).json({ token, client });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
