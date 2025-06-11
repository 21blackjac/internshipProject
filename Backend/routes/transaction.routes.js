const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, transactionController.getAllTransactionsByUser);
router.post('/', verifyToken, transactionController.createTransaction);
router.get('/:id', verifyToken, transactionController.getTransactionById);
router.put('/:id', verifyToken, transactionController.updateTransaction);
router.delete('/:id', verifyToken, transactionController.deleteTransaction);

module.exports = router;
