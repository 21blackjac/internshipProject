const bcrypt = require("bcrypt");
const User = require("../Models/user.model");
const Account = require("../Models/account.model");
const Category = require("../Models/category.model");
const Transaction = require("../Models/transaction.model");
const db = require("../config/db");

exports.getMyDashboardData = (req, res) => {
  const userId = req.user.id;

  const queries = {
    income: "SELECT SUM(amount) AS total FROM transactions WHERE user_id = ? AND type = 'income'",
    expense: "SELECT SUM(amount) AS total FROM transactions WHERE user_id = ? AND type = 'expense'",
    balance: `
      SELECT 
        IFNULL(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) - 
        IFNULL(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total 
      FROM transactions WHERE user_id = ?`,
  };

  const results = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  for (const [key, query] of Object.entries(queries)) {
    db.query(query, [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      results[key] = parseFloat(rows[0].total) || 0;
      completed++;
      if (completed === total) {
        return res.json({
          totalIncome: results.income,
          totalExpense: results.expense,
          totalBalance: results.balance,
        });
      }
    });
  }
};


exports.getMyProfile = (req, res) => {
  const userId = req.user.id;
  User.getById(userId, (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!users.length)
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    const { password, ...userWithoutPassword } = users[0];
    res.json(userWithoutPassword);
  });
};

exports.updateMyProfile = (req, res) => {
  const userId = req.user.id;
  const { name, email, password } = req.body;
  const updateFields = {};
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;

  if (password) {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: err.message });
      updateFields.password = hash;
      User.update(userId, updateFields, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Profil mis à jour avec succès" });
      });
    });
  } else {
    User.update(userId, updateFields, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Profil mis à jour avec succès" });
    });
  }
};

exports.deleteMyProfile = (req, res) => {
  const userId = req.user.id;
  User.delete(userId, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Compte supprimé avec succès" });
  });
};

exports.getMyAccountsList = (req, res) => {
  const userId = req.user.id;
  Account.getAllByUser(userId, (err, accounts) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!accounts.length)
      return res.status(404).json({ error: "Aucun compte trouvé" });
    res.json(accounts);
  });
};

exports.getMyAccounts = (req, res) => {
  Account.getById(req.params.id, (err, accounts) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(accounts);
  });
};

exports.getMyAccountsByType = (req, res) => {
  const userId = req.user.id;
  Account.getByUserIdAndType(userId, req.params.type, (err, accounts) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!accounts.length)
      return res.status(404).json({ error: "Aucun compte trouvé" });
    res.json(accounts);
  });
};
exports.createMyAccount = (req, res) => {
  const { name, type, balance } = req.body;
  Account.create(
    { user_id: req.user.id, name, type, balance },
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Compte créé", id: result.insertId });
    }
  );
};

exports.updateMyAccount = (req, res) => {
  const { name, type, balance } = req.body;
  Account.update(
    req.params.id,
    { name, type, balance },
    req.user.id,
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Compte mis à jour" });
    }
  );
};

exports.deleteMyAccountById = (req, res) => {
  Account.delete(req.params.id, req.user.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Compte supprimé" });
  });
};

exports.getMyCategories = (req, res) => {
  Category.getUserDefinedCategories(req.user.id, (err, categories) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!categories.length)
      return res.status(404).json({ error: "Aucune catégorie trouvée" });
    res.json(categories);
  });
};

exports.getMyCategoryById = (req, res) => {
  Category.getByUserId(req.params.id, req.user.id, (err, categories) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!categories.length)
      return res.status(404).json({ error: "Catégorie non trouvée" });
    res.json(categories[0]);
  });
};

exports.createMyCategory = (req, res) => {
  const { name } = req.body;
  Category.create(
    { name, user_id: req.user.id, user_defined: true },
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Catégorie créée", id: result.insertId });
    }
  );
};

exports.updateMyCategory = (req, res) => {
  const { name } = req.body;
  Category.update(req.params.id, { name }, req.user.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ error: "Catégorie non trouvée ou accès refusé" });
    res.json({ message: "Catégorie mise à jour" });
  });
};

exports.deleteMyCategoryById = (req, res) => {
  Category.delete(req.params.id, req.user.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ error: "Catégorie non trouvée ou accès refusé" });
    res.json({ message: "Catégorie supprimée" });
  });
};

exports.getMyTransactions = (req, res) => {
  Transaction.getAllByUser(req.user.id, (err, transactions) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(transactions);
  });
};

exports.getMyTransactionByType = (req, res) => {
  Transaction.getByUserIdAndType(
    req.user.id,
    req.params.type,
    (err, transactions) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!transactions.length)
        return res.status(404).json({ error: "Aucune transaction trouvée" });
      res.json(transactions);
    }
  );
};

exports.getMyTransactionById = (req, res) => {
  Transaction.getByUserId(req.params.id, req.user.id, (err, transactions) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!transactions.length)
      return res.status(404).json({ error: "Transaction non trouvée" });
    res.json(transactions[0]);
  });
};

exports.createMyTransaction = (req, res) => {
  const { account_id, category_id, type, amount, date, description } = req.body;
  Transaction.create(
    {
      user_id: req.user.id,
      account_id,
      category_id,
      type,
      amount,
      date,
      description,
    },
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res
        .status(201)
        .json({ message: "Transaction ajoutée", id: result.insertId });
    }
  );
};

exports.updateMyTransaction = (req, res) => {
  const { account_id, category_id, type, amount, date, description } = req.body;
  Transaction.update(
    req.params.id,
    {
      account_id,
      category_id,
      type,
      amount,
      date,
      description,
    },
    req.user.id,
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Transaction mise à jour" });
    }
  );
};

exports.deleteMyTransactionById = (req, res) => {
  Transaction.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Transaction supprimée" });
  });
};
