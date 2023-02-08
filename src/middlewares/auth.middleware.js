const asyncHandler = require("express-async-handler");
const { verifyToken } = require("../configs/jwt.config");
const { UNAUTHORIZED_ERR } = require("../constants/response.message");
const User = require("../models/user.model");

const authHandler = asyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      const decoded = verifyToken(req.headers.authorization.split(" ")[1]);
      req.user = await User.findOne({ emp_id: decoded.emp_id }).select(
        "-password"
      );
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({
        message: UNAUTHORIZED_ERR,
      });
    }
  } else {
    res.status(401).json({
      message: UNAUTHORIZED_ERR,
    });
  }
});

module.exports = authHandler;
