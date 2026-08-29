import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { getAllPostsAdmin, deletePostAdmin } from "../controllers/postController.js";
import { getAllUsers } from "../controllers/adminUserController.js";

const router = express.Router();

router.get("/posts", protect, isAdmin, getAllPostsAdmin);
router.delete("/posts/:id", protect, isAdmin, deletePostAdmin);
router.get("/users", protect, isAdmin, getAllUsers);

export default router;