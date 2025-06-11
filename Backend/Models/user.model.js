const db = require("../config/db");

const User = {
  create: (userData, callback) => {
    const sql =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    const params = [
      userData.name,
      userData.email,
      userData.password,
      userData.role || "user",
    ];
    db.query(sql, params, callback);
  },

  getByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  },

  update: (id, updateFields, callback) => {
    let sql = "UPDATE users SET ";
    const fields = [];
    const params = [];

    for (const key in updateFields) {
      fields.push(`${key} = ?`);
      params.push(updateFields[key]);
    }

    sql += fields.join(", ") + " WHERE id = ?";
    params.push(id);

    db.query(sql, params, callback);
  },

  remove: (id, callback) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  },

  getAll: (callback) => {
    const sql = "SELECT * FROM users";
    db.query(sql, callback);
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  },
};

module.exports = User;
