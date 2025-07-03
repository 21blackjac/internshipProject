const jwt = require("jsonwebtoken");
const { clerkClient } = require("@clerk/clerk-sdk-node");
const User = require("../Models/user.model");

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requis" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔐 Token reçu:", token);
  console.log("🔎 Longueur du token:", token.length);
  console.log("🔎 Début du token:", token.slice(0, 30));

  // ✅ 1. Vérification via Clerk (JWT issu de getToken)
  try {
    const session = await clerkClient.verifyToken(token);
    console.log("✅ Token Clerk JWT vérifié:", session);

    const clerkId = session.sub;

    // Vérifier si l'utilisateur Clerk existe déjà dans MySQL
    User.getByClerkId(clerkId, (err, users) => {
      if (err) return res.status(500).json({ error: err.message });

      if (users.length) {
        req.user = { id: users[0].id, role: users[0].role };
        return next();
      } else {
        // 🔄 Synchronisation utilisateur Clerk → MySQL
        clerkClient.users
          .getUser(clerkId)
          .then((clerkUser) => {
            const newUser = {
              name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
              email: clerkUser.emailAddresses?.[0]?.emailAddress,
              password: "",
              role: "user",
              clerk_id: clerkId,
            };

            User.createFromClerk(newUser, (err, result) => {
              if (err) return res.status(500).json({ error: err.message });
              req.user = { id: result.insertId, role: "user" };
              return next();
            });
          })
          .catch((error) =>
            res
              .status(500)
              .json({ error: "Erreur lors de la récupération Clerk", details: error.message })
          );
      }
    });

    return; // ⛔ ne pas continuer
  } catch (err) {
    console.warn("⚠️ Ce n'est pas un token Clerk ou il est invalide:", err.message);
  }

  // 🎫 2. Sinon, JWT local
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ JWT local vérifié :", decoded);
    req.user = decoded;
    return next();
  } catch (err) {
    console.error("❌ JWT invalide :", err.message);
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
};

// 🔒 Vérification rôle admin
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Accès réservé aux administrateurs" });
  }
  next();
};
