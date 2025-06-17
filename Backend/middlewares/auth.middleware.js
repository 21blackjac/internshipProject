const jwt = require("jsonwebtoken");
const { verifyToken } = require("@clerk/backend");
const User = require("../Models/user.model");

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requis" });
  }

  const token = authHeader.split(" ")[1];

  // 🧪 1. Vérification Clerk (Google OAuth ou Clerk JWT)
  try {
    const session = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (session && session.sub) {
      const clerkId = session.sub;

      // Cherche l'utilisateur dans ta base MySQL par son Clerk ID
      User.getByClerkId(clerkId, (err, users) => {
        if (err) return res.status(500).json({ error: err.message });

        if (users.length) {
          // Utilisateur existant
          req.user = { id: users[0].id, role: users[0].role };
          return next();
        } else {
          // Crée un nouvel utilisateur si non trouvé
          const newUser = {
            name: session.firstName || "Utilisateur Google",
            email:
              session.emailAddresses?.[0]?.emailAddress || "unknown@email.com",
            password: "", // mot de passe vide car Clerk gère l'auth
            role: "user",
            clerk_id: clerkId,
          };

          User.createFromClerk(newUser, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            req.user = { id: result.insertId, role: "user" };
            return next();
          });
        }
      });

      return;
    }
  } catch (err) {
    console.error("Erreur Clerk:", err.message);
  }

  // 🎫 2. Vérification JWT classique (ex: login local)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
};

// Middleware pour vérifier si l'utilisateur est un admin
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Accès réservé aux administrateurs" });
  }
  next();
};
