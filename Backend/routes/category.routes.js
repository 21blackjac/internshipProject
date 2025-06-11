const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', verifyToken, categoryController.getAllCategories);
router.get('/:id', verifyToken, categoryController.getCategoryById);
router.post('/', verifyToken, categoryController.createCategory);
router.put('/:id', verifyToken, categoryController.updateCategory);
router.delete('/:id', verifyToken, categoryController.deleteCategory);

module.exports = router;
