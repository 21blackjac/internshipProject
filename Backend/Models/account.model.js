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

  getById: (id, user_id, callback) => {
    const sql = "SELECT * FROM accounts WHERE id = ? AND user_id = ?";
    db.query(sql, [id, user_id], callback);
  },

  update: (id, account, user_id, callback) => {
    const sql =
      "UPDATE accounts SET name = ?, balance = ?, type = ? WHERE id = ? AND user_id = ?";
    const values = [account.name, account.balance, account.type, id, user_id];
    db.query(sql, values, callback);
  },

  delete: (id, user_id, callback) => {
    const sql = "DELETE FROM accounts WHERE id = ? AND user_id = ?";
    db.query(sql, [id, user_id], callback);
  },
};

module.exports = Account;
