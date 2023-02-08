const fs = require("fs");
const jwt = require("jsonwebtoken");

const privateKey = fs.readFileSync("./keys/private.pem", "utf8");
const publicKey = fs.readFileSync("./keys/public.pem", "utf8");

module.exports = {
  signToken: (payload) => {
    try {
      return jwt.sign(payload, privateKey, {
        expiresIn: "12h",
        algorithm: "RS256",
      });
    } catch (err) {
      /*
                TODO throw http 500 here 
                ! Dont send JWT error messages to the client
                ! Let exception handler handles this error
            */
      throw err;
    }
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, publicKey, { algorithm: "RS256" });
    } catch (err) {
      /*
                TODO throw http 500 here 
                ! Dont send JWT error messages to the client
                ! Let exception handler handles this error
            */
      throw err;
    }
  },
};
