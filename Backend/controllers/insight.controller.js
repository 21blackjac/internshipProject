const Transaction = require("../models/transaction.model");

exports.getInsights = (req, res) => {
  const userId = req.user.id;

  Transaction.getMonthlyExpenses(userId, (err, monthly) => {
    if (err) return res.status(500).json({ error: err.message });

    Transaction.getExpensesByCategory(userId, (err, categories) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        monthlyExpenses: monthly,
        categoryExpenses: categories,
      });
    });
  });
};
