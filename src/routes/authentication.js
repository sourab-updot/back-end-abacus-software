const router = require("express").Router();
const User = require("../models/user.model");
const { registerValidation } = require("../validations/user.validations");

router.post("/register", async (req, res) => {
  // Validate
  const { error } = registerValidation.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  // To check unique emails
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send({ message: "Email already exists!" });
  }

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
