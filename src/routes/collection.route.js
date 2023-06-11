import { Router } from "express";
import {
  createCollection,
  deleteCollection,
  getAllCollection,
  updateCollection,
} from "../controllers/collection.controller.js";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware.js";
import AuthRole from "../utils/authRoles.js";

const router = Router();

router.post("/", isLoggedIn, authorize(AuthRole.ADMIN), createCollection);

// update the collection
router.put("/:id", isLoggedIn, authorize(AuthRole.ADMIN), updateCollection);
// delete a single collection
router.delete("/:id", isLoggedIn, authorize(AuthRole.ADMIN), deleteCollection);
// get all collection
router.get("/", getAllCollection);

export default router;
