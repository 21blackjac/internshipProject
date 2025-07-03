const db = require("../config/db");

const Account = {
  create: (account, callback) => {
    const sql =
      "INSERT INTO accounts (user_id, name, balance, type) VALUES (?, ?, ?, ?)";
    const values = [
      account.user_id,
      account.name,
      account.balance,
      account.type,
    ];
    db.query(sql, values, callback);
  },

  getAllByUser: (user_id, callback) => {
    const sql = "SELECT * FROM accounts WHERE user_id = ?";
    db.query(sql, [user_id], callback);
  },

  getByUserId: (user_id, callback) => {
    const sql = "SELECT * FROM accounts WHERE user_id = ?";
    db.query(sql, [user_id], callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM accounts WHERE id = ?";
    db.query(sql, [id], callback);
  },

  getAll: (callback) => {
    const sql = "SELECT * FROM accounts";
    db.query(sql, callback);
  },

  getByUserIdAndType: (user_id, type, callback) => {
    const sql = "SELECT * FROM accounts WHERE user_id = ? AND type = ?";
    db.query(sql, [user_id, type], callback);
  },

  update: (id, account, user_id, callback) => {
    const sql =
      "UPDATE accounts SET name = ?, balance = ?, type = ? WHERE id = ? AND user_id = ?";
    const values = [account.name, account.balance, account.type, id, user_id];
    db.query(sql, values, callback);
  },

  updateForAdmin: (id, account, callback) => {
    const sql =
      "UPDATE accounts SET name = ?, balance = ?, type = ? WHERE id = ?";
    const values = [account.name, account.balance, account.type, id];
    db.query(sql, values, callback);
  },

  delete: (id, user_id, callback) => {
    const sql = "DELETE FROM accounts WHERE id = ? AND user_id = ?";
    db.query(sql, [id, user_id], callback);
  },

  deleteForAdmin: (id, callback) => {
    const sql = "DELETE FROM accounts WHERE id = ?";
    db.query(sql, [id], callback);
  },

  totalBalance: (callback) => {
    const sql = "SELECT SUM(balance) AS total FROM accounts";
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].total || 0);
    });
  },
};

module.exports = Account;
