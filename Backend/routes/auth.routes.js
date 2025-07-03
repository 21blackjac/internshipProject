const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const User = require("../Models/user.model");
const { verifyToken } = require("../middlewares/auth.middleware");
const { verifyToken: verifyClerkToken } = require("@clerk/backend");
const { clerkClient } = require("@clerk/clerk-sdk-node");

// Auth classique
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", verifyToken, authController.logout);
router.get("/me", verifyToken, authController.getMe);

// Reset password
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

// ✔️ Route 1 : Vérifier un token Clerk (Postman)
router.get("/verify", async (req, res) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Token requis (Authorization: Bearer ...)" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const session = await verifyClerkToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    return res.json({ success: true, session });
  } catch (error) {
    return res.status(401).json({
      error: "Token invalide ou expiré",
      details: error.message,
    });
  }
});

// ✔️ Route 2 : Obtenir les infos de l'utilisateur Clerk
router.get("/clerk-user", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Token requis (Authorization: Bearer ...)" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const session = await verifyClerkToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const userId = session.sub;
    const user = await clerkClient.users.getUser(userId);
    
    return res.json({ user });
    
  } catch (error) {
    return res.status(401).json({
      error: "Erreur lors de la récupération",
      details: error.message,
    });
  }
});

module.exports = router;
