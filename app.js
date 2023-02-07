require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const colors = require("colors");

// Import local modules
const authRoutes = require("./src/routes/auth.route");
const db = require("./src/configs/database.config");
const errorHandler = require("./src/middlewares/error.middleware");

const app = express();
db.connect();

// Body Parser middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error middleware
app.use(errorHandler);

// Route Middlewares
app.use("/api/user", authRoutes);

// Env vars
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`.bgGreen);
});
