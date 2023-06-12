import Product from "../models/product.schema.js";
import Coupon from "../models/coupon.schema.js";
import Order from "../models/order.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import razorpay from "../config/razorpay.config.js";

export const generateRazorpayOrderId = asyncHandler(async (res, req) => {
  if (!products || products.length === 0) {
    throw new CustomError("No product found", 400);
  }

  let totalAmount = 0;
  let discountAmount = 0;
  //  TODO: Do product calculation based on DB calls

  let productPriceCalc = Promise.all(
    product.map(async (product) => {
      const { productId, count } = product;
      const productFromDB = Product.findById(productId);

      if (!productFromDB) {
        throw new CustomError("No product found", 400);
      }
      if (productFromDB.stock < count) {
        return res.status(400).json({
          error: "Product quantity npt in stock",
        });
      }
      totalAmount += productFromDB.price * count;
    })
  );

  await productPriceCalc;

  //   todo: check for coupon discoun if applicable

  const options = {
    amount: Math.round(totalAmount * 100),
    currency: "INR",
    receipt: `receipt_${new Date().getTime()}`,
  };
  const order = await razorpay.orders.create(options);

  if (!order) {
    throw new CustomError("Unable to generate order", 400);
  }
  res.status(200).json({
    success: true,
    message: "razorpay order id generated successfully",
    order,
  });
});

// Todo: add order in DB and update the product stock

export const generarteOrder = asyncHandler(async (req, res) => {
  //
});

// Todo get only my orders
export const getMyorders = asyncHandler(async (req, res) => {
  //
});

// Todo get updateOrderStatus

export const updateOrderStatus = asyncHandler(async (req, res) => {
  //
});
