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
          error: "Product quantity not in stock",
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

export const generateOrder = asyncHandler(async (req, res) => {
  const { transactionId, product, coupon } = req.body;

  // You may need to create an order object and save it to the database.
  const order = new Order({
    transactionId,
    product,
    coupon,
    // Add other fields as needed.
  });

  await order.save();

  // Then, you can update the stock of the ordered products.
  product.map(async (product) => {
    const productFromDB = await Product.findById(product.productId);
    productFromDB.stock -= product.count;
    await productFromDB.save();
  });

  // Finally, send a response.
  res.status(200).json({ message: "Order generated successfully." });
});

// Todo get only my orders
export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming you have user in req after authentication
  const orders = await Order.find({ user: userId });
  res.status(200).json({ orders });
});

// Todo get updateOrderStatus

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    throw new CustomError("Order not found", 404);
  }

  order.status = status;
  await order.save();

  res.status(200).json({ message: "Order status updated successfully." });
});
