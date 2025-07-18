const db = require("../config/db");

const Transaction = {
  create: (transaction, callback) => {
    const sql = `INSERT INTO transactions (user_id, account_id, category_id, type, amount, date, description) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const {
      user_id,
      account_id,
      category_id,
      type,
      amount,
      date,
      description,
    } = transaction;
    db.query(
      sql,
      [user_id, account_id, category_id, type, amount, date, description],
      callback
    );
  },

  getAllByUser: (user_id, callback) => {
    const sql = `SELECT * FROM transactions
                 WHERE user_id = ?`;
    db.query(sql, [user_id], callback);
  },

  getAll: (callback) => {
    const sql = `SELECT t.*, c.name as category_name, a.name as account_name, u.name as user_name
                 FROM transactions t
                 JOIN categories c ON t.category_id = c.id
                 JOIN accounts a ON t.account_id = a.id
                 JOIN users u ON t.user_id = u.id
                 ORDER BY t.date DESC`;
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM transactions WHERE id = ?";
    db.query(sql, [id], callback);
  },

  getByUserId: (id, userId, callback) => {
    const sql = "SELECT * FROM transactions WHERE id = ? AND user_id = ?";
    db.query(sql, [id, userId], callback);
  },
  
  getByUserIdAndType: (userId, type, callback) => {
    const sql = "SELECT * FROM transactions WHERE user_id = ? AND type = ?";
    db.query(sql, [userId, type], callback);
  },

  update: (id, transaction, userId, callback) => {
    const sql = `UPDATE transactions 
                 SET account_id=?, category_id=?, type=?, amount=?, date=?, description=?
                 WHERE id = ? AND user_id = ?`;
    const { account_id, category_id, type, amount, date, description } =
      transaction;
    db.query(
      sql,
      [account_id, category_id, type, amount, date, description, id, userId],
      callback
    );
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM transactions WHERE id = ?";
    db.query(sql, [id], callback);
  },
  count: (callback) => {
    const sql = "SELECT COUNT(*) AS count FROM transactions";
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].count);
    });
  },
  getMonthlyExpenses: (userId, callback) => {
    const sql = `
      SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(amount) AS total
      FROM transactions
      WHERE user_id = ? AND type = 'expense'
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `;
    db.query(sql, [userId], callback);
  },
  getExpensesByCategory: (userId, callback) => {
    const sql = `
    SELECT categories.name AS category, SUM(transactions.amount) AS total
    FROM transactions
    JOIN categories ON transactions.category_id = categories.id
    WHERE transactions.user_id = ? AND transactions.type = 'expense'
    GROUP BY category
    ORDER BY total DESC
  `;
    db.query(sql, [userId], callback);
  },
};

module.exports = Transaction;
