const db = require("../config/db");

exports.getInsights = (req, res) => {
  const userId = req.user.id;

  const queries = {
    income:
      "SELECT SUM(amount) AS total FROM transactions WHERE user_id = ? AND type = 'income'",
    expense:
      "SELECT SUM(amount) AS total FROM transactions WHERE user_id = ? AND type = 'expense'",
    balance: `
      SELECT 
        IFNULL(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) - 
        IFNULL(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total 
      FROM transactions WHERE user_id = ?`,
  };

  db.query(queries.income, [userId], (err, income) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(queries.expense, [userId], (err, expense) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query(queries.balance, [userId], (err, balance) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          totalIncome: income[0].total || 0,
          totalExpense: expense[0].total || 0,
          totalBalance: balance[0].total || 0,
        });
      });
    });
  });
};
