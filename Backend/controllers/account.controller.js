const Account = require("../models/account.model");

exports.createAccount = (req, res) => {
  const { user_id, name, balance, type } = req.body;
  if (!user_id || !name || !type) {
    return res
      .status(400)
      .json({ error: "user_id, name, and type are required" });
  }

  const newAccount = { user_id, name, balance, type };
  Account.create(newAccount, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res
      .status(201)
      .json({ message: "Account created successfully", id: result.insertId });
  });
};

exports.getAccountsByUser = (req, res) => {
  const userId = req.params.user_id;
  Account.getAllByUser(userId, (err, accounts) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(accounts);
  });
};

exports.getAccountById = (req, res) => {
  const id = req.params.id;
  Account.getById(id, (err, account) => {
    if (err) return res.status(500).json({ error: err.message });
    if (account.length === 0)
      return res.status(404).json({ error: "Account not found" });
    res.json(account[0]);
  });
};

exports.updateAccount = (req, res) => {
  const id = req.params.id;
  const { name, balance, type } = req.body;

  Account.update(id, { name, balance, type }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Account updated successfully" });
  });
};

exports.deleteAccount = (req, res) => {
  const id = req.params.id;
  Account.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Account deleted successfully" });
  });
};
