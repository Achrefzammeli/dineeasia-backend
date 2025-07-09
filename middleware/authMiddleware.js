import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ✅ Vérifie si le token JWT est présent et valide
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant ou invalide" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contient { id, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalide" });
  }
}

// ✅ Vérifie si l'utilisateur a un rôle spécifique
export function verifyRole(requiredRole) {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Accès interdit : rôle insuffisant" });
    }
    next();
  };
}
