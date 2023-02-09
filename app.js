require("dotenv").config();

const express = require("express");
const colors = require("colors");

// Import local modules
const db = require("./src/configs/database.config");
const errorHandler = require("./src/middlewares/error.middleware");
const {
  API_ENDPOINT_NOT_FOUND_ERR,
} = require("./src/constants/response.message");

// Routes
const authRoutes = require("./src/routes/auth.route");
const businessRoutes = require("./src/routes/business.route");
const productRoutes = require("./src/routes/product.route");

// Configs
const app = express();
db.connect();

// Body Parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error middleware
app.use(errorHandler);

// Route Middlewares
app.use("/api/user", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/products", productRoutes);

app.use("*", (req, res, next) => {
  return res.status(404).json({
    message: API_ENDPOINT_NOT_FOUND_ERR,
  });
});

// Env vars
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`.bgGreen);
});
