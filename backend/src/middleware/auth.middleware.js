import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this";

export const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized (no token)" });

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * requireRole('admin'), requireRole('admin','manager')
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden — insufficient role" });
    }
    next();
  };
};

/**
 * Check ownership OR allowed role (admin/manager).
 */
export const requireOwnershipOrRole = (modelName, ownerField = "ownerId") => {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      if (["admin", "manager"].includes(req.user.role)) return next();

      const idParam = Number(req.params.id || req.params.leadId || req.params.userId);
      if (!idParam) return res.status(400).json({ error: "Missing id param to check ownership" });

      const record = await prisma[modelName].findUnique({ where: { id: idParam } });
      if (!record) return res.status(404).json({ error: `${modelName} not found` });

      if (record[ownerField] && Number(record[ownerField]) === Number(req.user.id)) {
        return next();
      }

      return res.status(403).json({ error: "Forbidden — not owner" });
    } catch (err) {
      console.error("ownership check", err);
      return res.status(500).json({ error: "Server error" });
    }
  };
};
