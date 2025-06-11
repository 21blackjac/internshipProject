const db = require("../config/db");

const Category = {
  create: (category, callback) => {
    const { name, user_id, user_defined } = category;
    db.query(
      "INSERT INTO categories (name, user_id, user_defined) VALUES (?, ?, ?)",
      [name, user_id, user_defined],
      callback
    );
  },

  getAll: (callback) => {
    const sql = "SELECT * FROM categories";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    db.query(
      "SELECT * FROM categories WHERE user_id = ? OR user_defined = false",
      [userId],
      callback
    );
  },

  update: (id, category, callback) => {
    const { name } = category;
    db.query(
      "UPDATE categories SET name = ? WHERE id = ? AND user_id = ?",
      [name, id, userId],
      callback
    );
  },

  delete: (id, callback) => {
    db.query(
      "DELETE FROM categories WHERE id = ? AND user_id = ?",
      [id, userId],
      callback
    );
  },
};

module.exports = Category;
