const crypto = require("crypto");

const randomBytesGenerator = (bytes) =>
  crypto.randomBytes(bytes).toString("hex");

const randomIntGenerator = (len) =>
  crypto.randomInt(0, 1000000).toString().substring(0, 4);

exports.randomBytesGenerator = randomBytesGenerator;
exports.randomIntGenerator = randomIntGenerator;
