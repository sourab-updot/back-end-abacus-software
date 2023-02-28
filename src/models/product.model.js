const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    created_by: {
      type: Schema.Types.ObjectId,
      required: [true, "created by is required"],
      ref: "user",
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: [true, "updated by is required"],
      ref: "user",
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      required: [true, "category is required"],
      ref: "category",
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      default: 0.0,
    },
    images: [
      {
        filename: String,
        user: { type: Schema.Types.ObjectId, ref: "user" },
      },
    ],
    quantity: {
      type: Number,
      default: 0,
    },
    totalQty: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
    },
    stock_status: {
      type: String,
      required: [true, "stock status is required"],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const ProductModel = mongoose.model("product", ProductSchema);
module.exports = ProductModel;
