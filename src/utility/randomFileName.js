const crypto = require("crypto");

const randomiseFileName = (bytes) => crypto.randomBytes(bytes).toString("hex");

exports.randomiseFileName = randomiseFileName;
