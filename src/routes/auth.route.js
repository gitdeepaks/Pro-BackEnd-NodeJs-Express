import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  signup,
} from "../controllers/auth.controller";
import { isLoggedIn } from "../utils/authRoles";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", isLoggedIn, getProfile);

export default router;
