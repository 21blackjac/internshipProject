const Category = require("../Models/category.model");

exports.createCategory = (req, res) => {
  const { name, user_defined } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const newCategory = {
    name,
    user_defined: user_defined !== undefined ? user_defined : true,
  };

  Category.create(newCategory, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Category created", id: result.insertId });
  });
};

exports.getAllCategories = (req, res) => {
  Category.getAll((err, categories) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(categories);
  });
};

exports.getCategoryById = (req, res) => {
  const id = req.params.id;
  Category.getById(id, (err, category) => {
    if (err) return res.status(500).json({ error: err.message });
    if (category.length === 0)
      return res.status(404).json({ error: "Category not found" });
    res.json(category[0]);
  });
};

exports.updateCategory = (req, res) => {
  const id = req.params.id;
  const { name, user_defined } = req.body;

  Category.update(id, { name, user_defined }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Category updated" });
  });
};

exports.deleteCategory = (req, res) => {
  const id = req.params.id;
  Category.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Category deleted" });
  });
};
