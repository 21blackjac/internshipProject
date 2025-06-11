const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Tous les champs sont requis." });

  User.findByEmail(email, async (err, users) => {
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

  User.findByEmail(email, async (err, users) => {
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
