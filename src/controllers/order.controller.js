import Product from "../models/product.schema.js";
import Coupon from "../models/coupon.schema.js";
import Order from "../models/order.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import razorpay from "../config/razorpay.config.js";

export const generateRazorpayOrderId = asyncHandler(async (res, req) => {});
