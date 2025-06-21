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

  createFromClerk: (userData, callback) => {
    const sql =
      "INSERT INTO users (name, email, password, role, clerk_id) VALUES (?, ?, ?, ?, ?)";
    const params = [
      userData.name,
      userData.email,
      userData.password,
      userData.role || "user",
      userData.clerk_id,
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

  getByClerkId: (clerkId, callback) => {
    const sql = "SELECT * FROM users WHERE clerk_id = ?";
    db.query(sql, [clerkId], callback);
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
  count: (callback) => {
    const sql = "SELECT COUNT(*) AS count FROM users";
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].count);
    });
  },

  query: (sql, params, callback) => {
    db.query(sql, params, callback);
  },
};

module.exports = User;
