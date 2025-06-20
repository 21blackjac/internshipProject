const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const CLERK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

function isValidClerkRequest(req) {
  // ✅ Skip signature validation in development (for local Postman or curl testing)
  if (process.env.NODE_ENV === "development") {
    console.warn("⚠️ Skipping Clerk signature check in development mode.");
    return true;
  }

  const signature = req.headers["clerk-signature"];
  if (!req.rawBody) {
    console.error("❌ req.rawBody is undefined");
    return false;
  }

  const hmac = crypto.createHmac("sha256", process.env.CLERK_WEBHOOK_SECRET);
  hmac.update(req.rawBody);
  const digest = hmac.digest("base64");

  return signature === digest;
}

router.post("/clerk-webhook", async (req, res) => {
  if (!isValidClerkRequest(req)) {
    console.warn("❌ Signature Clerk invalide");
    return res.status(403).send("Invalid signature");
  }

  const event = req.body;
  console.log("📩 Événement Clerk reçu :", event.type);

  if (event.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = event.data;
    const email = email_addresses[0]?.email_address;

    try {
      const db = require("../config/db");
      db.query(
            "INSERT INTO users (clerk_id, name, email, role) VALUES (?, ?, ?, ?)",
            [id, `${first_name} ${last_name}`, email, "user"]
        );

      console.log("✅ Utilisateur ajouté :", email);
    } catch (err) {
      console.error("❌ Erreur MySQL :", err);
    }
  }

  res.status(200).send("Event processed");
});

module.exports = router;
