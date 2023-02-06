const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;
const UserSchema = new Schema(
  {
    emp_id: {
      type: String,
      default: `emp${Date.now()}`,
    },
    first_name: {
      type: String,
      required: [true, "first name required"],
      min: 2,
      max: 1024,
    },
    last_name: {
      type: String,
      required: [true, "last name required"],
      min: 2,
      max: 1024,
    },
    mobile_number: {
      type: Number,
      required: [true, "mobile number required"],
    },
    avatar: String,
    username: {
      type: String,
      required: [true, "username required"],
      min: 2,
      max: 255,
    },
    designation: {
      type: String,
      required: [true, "designation required"],
      min: 2,
      max: 255,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: [true, "email already registered"],
    },
    password: {
      type: String,
      required: true,
      min: 4,
    },
    role: {
      type: Array,
      default: ["admin"],
    },
    businessId: {
      type: String,
      default: 0,
      required: [true, "business ID required"],
    },
    lastVisited: { type: Date, default: new Date() },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

UserSchema.pre("save", async function (next) {
  try {
    // check method of registration
    const user = this;
    if (!user.isModified("password")) next(); // generate salt
    const salt = await bcrypt.genSalt(10); // hash the password
    const hashedPassword = await bcrypt.hash(this.password, salt); // replace plain text password with hashed password
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});
const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
