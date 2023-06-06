import mongoose from "mongoose";

const ORDER_STATUS = {
  ORDERED: "ORDERED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  DISPATCHED: "DISPATCHED",
};

const productSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  count: Number,
  price: Number,
});

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: [productSchema],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    coupon: String,
    transactionId: String,
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.ORDERED,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
