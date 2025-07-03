const express = require("express");
const router = express.Router();
const insightController = require("../controllers/insight.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/insights", verifyToken, insightController.getInsights); // ta route actuelle

module.exports = router;
