import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../config/cloudinary.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createPost);
router.get("/", getPosts);
router.get("/mine", protect, getMyPosts);
router.get("/:id", getPostById);
router.put("/:id", protect, upload.single("image"), updatePost);
router.delete("/:id", protect, deletePost);

export default router;