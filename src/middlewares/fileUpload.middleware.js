const multer = require("multer");

// User image Storage
const storage = multer.memoryStorage();
const uploadUserImage = multer({ storage: storage });

exports.uploadUserImage = uploadUserImage;
