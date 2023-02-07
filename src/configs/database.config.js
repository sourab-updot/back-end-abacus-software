const mongoose = require("mongoose");
const clusterUrl = process.env.CLUSTER_URL;

mongoose.Promise = global.Promise;
const dbUrl = clusterUrl;
const connect = async () => {
  mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on("error", () => {
    console.log("could not connect".bgRed);
  });
  db.once("open", () => {
    console.log("> Successfully connected to database".bgCyan);
  });
};
module.exports = { connect };
