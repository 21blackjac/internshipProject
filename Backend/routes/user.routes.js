const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/dashboard", verifyToken, userController.getMyDashboardData);
router.get("/profile", verifyToken, userController.getMyProfile);
router.put("/profile", verifyToken, userController.updateMyProfile);
router.delete("/profile", verifyToken, userController.deleteMyProfile);

router.get("/accounts", verifyToken, userController.getMyAccountsList);
router.get("/accounts/:id", verifyToken, userController.getMyAccounts);
router.get("/accounts/type/:type", verifyToken, userController.getMyAccountsByType);
router.post("/accounts", verifyToken, userController.createMyAccount);
router.put("/accounts/:id", verifyToken, userController.updateMyAccount);
router.delete("/accounts/:id", verifyToken, userController.deleteMyAccountById);

router.get("/categories", verifyToken, userController.getMyCategories);
router.post("/categories", verifyToken, userController.createMyCategory);
router.get("/categories/:id", verifyToken, userController.getMyCategoryById);
router.put("/categories/:id", verifyToken, userController.updateMyCategory);
router.delete("/categories/:id", verifyToken, userController.deleteMyCategoryById);

router.get("/transactions", verifyToken, userController.getMyTransactions);
router.get("/transactions/:id", verifyToken, userController.getMyTransactionById);
router.get("/transactions/type/:type", verifyToken, userController.getMyTransactionByType);
router.post("/transactions", verifyToken, userController.createMyTransaction);
router.put("/transactions/:id", verifyToken, userController.updateMyTransaction);
router.delete("/transactions/:id", verifyToken, userController.deleteMyTransactionById);

module.exports = router;
