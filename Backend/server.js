const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/user.routes");
const transactionRoutes = require("./routes/transaction.routes");
const categoryRoutes = require("./routes/category.routes");
const accountRoutes = require("./routes/account.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const insightRoutes = require("./routes/insight.routes");

dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // autorise le frontend
  credentials: true, // permet d'envoyer les cookies
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  "/api/clerk-webhook",
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", insightRoutes);
app.use("/api", require("./routes/clerkWebhook.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
