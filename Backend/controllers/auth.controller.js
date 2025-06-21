const User = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Tous les champs sont requis." });

  User.getByEmail(email, async (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    if (users.length)
      return res.status(400).json({ error: "Email déjà utilisé." });

    const hashedPassword = await bcrypt.hash(password, 10);
    User.create({ name, email, password: hashedPassword }, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Inscription réussie." });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email et mot de passe requis." });

  User.getByEmail(email, async (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!users.length)
      return res.status(404).json({ error: "Utilisateur introuvable." });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Mot de passe incorrect." });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requis." });

  User.getByEmail(email, (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!users.length)
      return res.status(404).json({ error: "Utilisateur introuvable." });

    const token = crypto.randomBytes(32).toString("hex");
    const expiration = new Date(Date.now() + 3600000); // 1h

    User.update(
      users[0].id,
      { reset_token: token, reset_token_expiration: expiration },
      (err) => {
        if (err) return res.status(500).json({ error: err.message });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Réinitialisation de mot de passe",
          html: `<p>Bonjour,</p><p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p><a href="${resetLink}">${resetLink}</a>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Erreur lors de l'envoi de l'email." });
          res.json({ message: "Lien de réinitialisation envoyé par email." });
        });
      }
    );
  });
};

exports.resetPassword = (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || password.length < 6)
    return res.status(400).json({ error: "Mot de passe invalide." });
  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ error: "Les mots de passe ne correspondent pas." });

  const now = new Date();
  const sql =
    "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiration > ?";
  const params = [token, now];

  User.query(sql, params, async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length)
      return res.status(400).json({ error: "Token invalide ou expiré." });

    const user = results[0];
    const hashed = await bcrypt.hash(password, 10);

    User.update(
      user.id,
      {
        password: hashed,
        reset_token: null,
        reset_token_expiration: null,
      },
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Mot de passe mis à jour avec succès." });
      }
    );
  });
};

exports.logout = (req, res) => {
  res.json({ message: "Déconnexion réussie" });
};

exports.getMe = (req, res) => {
  const userId = req.user.id;

  User.getById(userId, (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!users.length)
      return res.status(404).json({ error: "Utilisateur introuvable." });

    const { password, ...userSansPassword } = users[0];
    res.json(userSansPassword);
  });
};
