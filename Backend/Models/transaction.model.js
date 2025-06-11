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
    const sql = `SELECT t.*, c.name as category_name, a.name as account_name
                 FROM transactions t
                 JOIN categories c ON t.category_id = c.id
                 JOIN accounts a ON t.account_id = a.id
                 WHERE t.user_id = ?
                 ORDER BY t.date DESC`;
    db.query(sql, [user_id], callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM transactions WHERE id = ?";
    db.query(sql, [id], callback);
  },

  update: (id, transaction, callback) => {
    const sql = `UPDATE transactions 
                 SET account_id=?, category_id=?, type=?, amount=?, date=?, description=?
                 WHERE id = ?`;
    const { account_id, category_id, type, amount, date, description } =
      transaction;
    db.query(
      sql,
      [account_id, category_id, type, amount, date, description, id],
      callback
    );
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM transactions WHERE id = ?";
    db.query(sql, [id], callback);
  },
};

module.exports = Transaction;
