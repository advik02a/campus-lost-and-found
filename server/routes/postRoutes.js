import express from "express";
import { createPost, getPosts, getPostById } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);

export default router;