const crypto = require("crypto");

const randomBytesGenerator = (bytes) =>
  crypto.randomBytes(bytes).toString("hex");

const randomIntGenerator = (len) =>
  crypto.randomInt(0, 10000).toString().padStart(len, "0");

exports.randomBytesGenerator = randomBytesGenerator;
exports.randomIntGenerator = randomIntGenerator;
