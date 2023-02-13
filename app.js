require("dotenv").config();

const express = require("express");
const colors = require("colors");
const cors = require("cors");

// Import local modules
const db = require("./src/configs/database.config");
const errorHandler = require("./src/middlewares/error.middleware");
const {
  API_ENDPOINT_NOT_FOUND_ERR,
} = require("./src/constants/response.message");

// Routes
const authRoutes = require("./src/routes/auth.routes");
const businessRoutes = require("./src/routes/business.routes");
const productRoutes = require("./src/routes/product.routes");
const categoryRoutes = require("./src/routes/category.routes");
const paymentRoutes = require("./src/routes/payment.routes");
// Configs
const app = express();
db.connect();

// CORS
app.use(cors());

// Body Parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error middleware
app.use(errorHandler);

// Route Middlewares
app.use("/api/users", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payments", paymentRoutes);
// 404 route
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
