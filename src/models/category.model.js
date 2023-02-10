const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    created_by: {
      type: Schema.Types.ObjectId,
      required: [true, "creator of product is required"],
      ref: "user",
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: [true, "updator of product is required"],
      ref: "user",
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const CategoryModal = mongoose.model("category", CategorySchema);
module.exports = CategoryModal;
