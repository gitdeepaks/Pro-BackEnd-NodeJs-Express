import Coupon from "../models/coupon.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError.js";

/**********************************************************
 * @CREATE_COUPON
 * @route https://localhost:4000/api/coupon
 * @description Controller used for creating a new coupon
 * @description Only admin and Moderator can create the coupon
 * @returns Coupon Object with success message "Coupon Created SuccessFully"
 *********************************************************/

export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount } = res.body;

  if (!code || !discount) {
    throw new CustomError("Code and discout is required", 400);
  }

  //   check id code is already exists
  const coupon = await Coupon.create({
    code,
    discount,
  });

  res.status(200).json({
    success: true,
    message: "Coupon created successfully",
    coupon,
  });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const { id: couponId } = req.params;
  const { action } = req.body;

  // action us boolean or not

  const coupon = await Coupon.findByIdAndUpdate(
    couponId,
    {
      active: action,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!coupon) {
    throw new CustomError("Coupon not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Coupon is Updated",
    coupon,
  });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const { id: couponId } = req.params;

  const coupon = await Coupon.findByIdAndDelete(couponId);

  if (!coupon) {
    throw new CustomError("Coupon not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Coupon is deleted",
    coupon,
  });
});

export const getAllCoupons = asyncHandler(async (res, req) => {
  const allCoupons = await Coupon.find();

  if (!allCoupons) {
    throw new CustomError("No Coupon found", 400);
  }

  res.status(200).json({
    success: true,
    allCoupons,
  });
});
