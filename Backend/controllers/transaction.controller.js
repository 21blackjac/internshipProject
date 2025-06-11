const Transaction = require("../Models/transaction.model");

exports.createTransaction = (req, res) => {
  const { user_id, account_id, category_id, type, amount, date, description } =
    req.body;

  if (!user_id || !account_id || !category_id || !type || !amount || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newTransaction = {
    user_id,
    account_id,
    category_id,
    type,
    amount,
    date,
    description,
  };

  Transaction.create(newTransaction, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res
      .status(201)
      .json({ message: "Transaction created", id: result.insertId });
  });
};

exports.getAllTransactionsByUser = (req, res) => {
  const user_id = req.params.user_id;

  Transaction.getAllByUser(user_id, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getTransactionById = (req, res) => {
  const id = req.params.id;

  Transaction.getById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ error: "Transaction not found" });
    res.json(result[0]);
  });
};

exports.updateTransaction = (req, res) => {
  const id = req.params.id;
  const { account_id, category_id, type, amount, date, description } = req.body;

  const updatedTransaction = {
    account_id,
    category_id,
    type,
    amount,
    date,
    description,
  };

  Transaction.update(id, updatedTransaction, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Transaction updated" });
  });
};

exports.deleteTransaction = (req, res) => {
  const id = req.params.id;

  Transaction.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Transaction deleted" });
  });
};
