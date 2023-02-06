require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

// Import Routes
const authRoutes = require("./src/routes/authentication");
const db = require("./src/database.config");

const app = express();
db.connect();

// Body Parser middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route Middlewares
app.use("/api/user", authRoutes);

// Env vars
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
