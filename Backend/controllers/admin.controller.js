const User = require("../Models/user.model");
const Transaction = require("../Models/transaction.model");
const Category = require("../Models/category.model");
const Account = require("../Models/account.model");

exports.getDashboardData = (req, res) => {
  let dashboard = {};
  User.count((err, userCount) => {
    if (err) return res.status(500).json({ error: err.message });
    dashboard.totalUsers = userCount;

    Transaction.count((err, txCount) => {
      if (err) return res.status(500).json({ error: err.message });
      dashboard.totalTransactions = txCount;

      Account.totalBalance((err, totalBalance) => {
        if (err) return res.status(500).json({ error: err.message });
        dashboard.totalBalance = totalBalance;

        res.json(dashboard);
      });
    });
  });
};

// --- User Controllers ---
exports.getAllUsers = (req, res) => {
  User.getAll((err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(users);
  });
};

exports.getUserById = (req, res) => {
  User.getById(req.params.id, (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!users.length)
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(users[0]);
  });
};

exports.updateUser = (req, res) => {
  const { name, email, password } = req.body;
  const updateFields = { name, email };

  if (password) {
    const bcrypt = require("bcrypt");
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: err.message });
      updateFields.password = hash;

      User.update(req.params.id, updateFields, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Utilisateur mis à jour" });
      });
    });
  } else {
    User.update(req.params.id, updateFields, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Utilisateur mis à jour" });
    });
  }
};

exports.deleteUser = (req, res) => {
  User.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Utilisateur supprimé" });
  });
};

// --- Account Controllers ---
exports.getAllAccounts = (req, res) => {
  Account.getAll((err, accounts) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(accounts);
  });
};

exports.getAccountById = (req, res) => {
  Account.getById(req.params.id, (err, account) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!account.length)
      return res.status(404).json({ error: "Account not found" });
    res.json(account[0]);
  });
};

exports.getAccountsByUserId = (req, res) => {
  const userId = req.params.userId;
  Account.getByUserId(userId, (err, accounts) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(accounts);
  });
};

exports.createAccount = (req, res) => {
  const { name, balance, type } = req.body;
  Account.create(
    { user_id: req.user.id, name, balance, type },
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Account created", id: result.insertId });
    }
  );
};

exports.updateAccount = (req, res) => {
  const { name, balance, type } = req.body;
  Account.update(req.params.id, { name, balance, type }, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Account updated successfully" });
  });
};

exports.deleteAccount = (req, res) => {
  Account.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Account deleted successfully" });
  });
};

// --- Transaction Controllers ---
exports.getAllTransactions = (req, res) => {
  Transaction.getAll((err, transactions) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(transactions);
  });
};

exports.getTransactionById = (req, res) => {
  Transaction.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ error: "Transaction not found" });
    res.json(result[0]);
  });
};

exports.getTransactionsByUserId = (req, res) => {
  const userId = req.params.userId;
  Transaction.getByUserId(userId, (err, transactions) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(transactions);
  });
};

exports.createTransaction = (req, res) => {
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
        .json({ message: "Transaction created", id: result.insertId });
    }
  );
};

exports.updateTransaction = (req, res) => {
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
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Transaction updated" });
    }
  );
};

exports.deleteTransaction = (req, res) => {
  Transaction.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Transaction deleted" });
  });
};

// --- Category Controllers ---
exports.getAllCategories = (req, res) => {
  Category.getAll((err, categories) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(categories);
  });
};

exports.getCategoryById = (req, res) => {
  Category.getById(req.params.id, (err, category) => {
    if (err) return res.status(500).json({ error: err.message });
    if (category.length == 0)
      return res.status(404).json({ error: "Category not found" });
    res.json(category[0]);
  });
};

exports.getCategoriesByUserId = (req, res) => {
  const userId = req.params.userId;
  Category.getUserCategories(userId, (err, categories) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(categories);
  });
};

exports.createCategory = (req, res) => {
  const { name, user_defined } = req.body;
  Category.create(
    { name, user_id: req.user.id, user_defined },
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res
        .status(201)
        .json({ message: "Category created", id: result.insertId });
    }
  );
};

exports.updateCategory = (req, res) => {
  const { name, user_defined } = req.body;
  Category.update(req.params.id, { name, user_defined }, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Category updated" });
  });
};

exports.deleteCategory = (req, res) => {
  Category.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Category deleted" });
  });
};
