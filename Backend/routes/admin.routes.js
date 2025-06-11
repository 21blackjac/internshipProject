const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

router.get("/dashboard", verifyToken, isAdmin, adminController.getDashboardData);

// --- Users ---
router.get("/users", verifyToken, isAdmin, adminController.getAllUsers);
router.get("/users/:id", verifyToken, isAdmin, adminController.getUserById);
router.put("/users/:id", verifyToken, isAdmin, adminController.updateUser);
router.delete("/users/:id", verifyToken, isAdmin, adminController.deleteUser);

// --- Accounts ---
router.get("/accounts", verifyToken, isAdmin, adminController.getAllAccounts);
router.get("/accounts/:id", verifyToken, isAdmin, adminController.getAccountById);
router.put("/accounts/:id", verifyToken, isAdmin, adminController.updateAccount);
router.delete("/accounts/:id", verifyToken, isAdmin, adminController.deleteAccount);

// --- Transactions ---
router.get("/transactions", verifyToken, isAdmin, adminController.getAllTransactions);
router.get("/transactions/:id", verifyToken, isAdmin, adminController.getTransactionById);
router.put("/transactions/:id", verifyToken, isAdmin, adminController.updateTransaction);
router.delete("/transactions/:id", verifyToken, isAdmin, adminController.deleteTransaction);

// --- Categories ---
router.get("/categories", verifyToken, isAdmin, adminController.getAllCategories);
router.get("/categories/:id", verifyToken, isAdmin, adminController.getCategoryById);
router.put("/categories/:id", verifyToken, isAdmin, adminController.updateCategory);
router.delete("/categories/:id", verifyToken, isAdmin, adminController.deleteCategory);

module.exports = router;
