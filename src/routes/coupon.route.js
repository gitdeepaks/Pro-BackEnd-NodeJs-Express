import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
} from "../controllers/coupon.controller.js";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware.js";
import AuthRole from "../utils/authRoles.js";

const router = Router();

router.post("/", isLoggedIn, authorize(AuthRole.ADMIN), createCoupon);
router.delete(
  "/:id",
  isLoggedIn,
  authorize(AuthRole.ADMIN, AuthRole.MODERATOR),
  createCoupon
);
router.put(
  "/action/:id",
  isLoggedIn,
  authorize(AuthRole.ADMIN, AuthRole.MODERATOR),
  updateCoupon
);
router.get(
  "/",
  isLoggedIn,
  authorize(AuthRole.ADMIN, AuthRole.MODERATOR),
  getAllCoupons
);

export default router;
