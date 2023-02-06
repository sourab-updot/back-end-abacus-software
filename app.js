require("dotenv").config();

const express = require("express");
const app = express();

// Env vars
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
