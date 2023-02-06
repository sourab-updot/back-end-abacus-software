const router = require("express").Router();
const User = require("../models/user.model");

router.post("/register", async (req, res) => {
  const {
    first_name,
    last_name,
    mobile_number,
    email,
    avatar,
    username,
    password,
    designation,
    role,
    businessId,
  } = req.body;

  const newUser = new User({
    first_name: first_name,
    last_name: last_name,
    username: username,
    avatar: avatar,
    mobile_number: mobile_number,
    email: email,
    password: password,
    designation: designation,
    role: role,
    businessId: businessId,
  });

  try {
    await newUser.save();
    res.status(200).send("User created successfully!");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
