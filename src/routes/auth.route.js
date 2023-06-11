import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  signup,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";
import { isLoggedIn } from "../utils/authRoles";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.post("/password/forgot/", forgotPassword);
router.post("/password/reset/:token", resetPassword);

router.get("/profile", isLoggedIn, getProfile);

export default router;
