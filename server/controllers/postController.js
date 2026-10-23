import Post from "../models/Post.js";

// POST /api/posts (protected)
export const createPost = async (req, res) => {
  try {
    const { title, description, type, category, location, date } = req.body;

    if (!title || !description || !type || !category || !location || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (title.trim().length < 3 || title.trim().length > 100) {
      return res.status(400).json({ message: "Title must be between 3 and 100 characters" });
    }

    if (description.trim().length < 10 || description.trim().length > 1000) {
      return res.status(400).json({ message: "Description must be between 10 and 1000 characters" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Please provide a valid date" });
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (parsedDate > today) {
      return res.status(400).json({ message: "Date cannot be in the future" });
    }

    const post = await Post.create({
      title: title.trim(),
      description: description.trim(),
      type,
      category,
      location,
      date: parsedDate,
      image: req.file ? req.file.path : "",
      postedBy: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/posts (public) - supports search, category, type, location, page, limit
export const getPosts = async (req, res) => {
  try {
    const { search, category, type, location, page = 1, limit = 12 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (location) filter.location = location;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);

    let query = Post.find(filter);

    if (search) {
      query = query
        .select({ score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const posts = await query
      .skip(skip)
      .limit(Number(limit))
      .populate("postedBy", "name");

    const total = await Post.countDocuments(filter);

    res.status(200).json({
      posts,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/posts/:id (public)
export const getPostById = async (req, res) => {
  try {
    // Contact details are only returned to logged-in (verified) users.
    // Logged-out visitors get the poster's name only.
    const populateFields = req.user ? "name email phone" : "name";
    const post = await Post.findById(req.params.id).populate("postedBy", populateFields);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/posts/:id (protected, owner only)
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    const { title, description, type, category, location, date } = req.body;

    if (title && (title.trim().length < 3 || title.trim().length > 100)) {
      return res.status(400).json({ message: "Title must be between 3 and 100 characters" });
    }

    if (description && (description.trim().length < 10 || description.trim().length > 1000)) {
      return res.status(400).json({ message: "Description must be between 10 and 1000 characters" });
    }

    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Please provide a valid date" });
      }
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (parsedDate > today) {
        return res.status(400).json({ message: "Date cannot be in the future" });
      }
    }

    if (title) post.title = title.trim();
    if (description) post.description = description.trim();
    if (type) post.type = type;
    if (category) post.category = category;
    if (location) post.location = location;
    if (date) post.date = date;
    if (req.file) post.image = req.file.path;

    await post.save();

    const updatedPost = await Post.findById(post._id).populate("postedBy", "name email phone");

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/posts/:id (protected, owner only)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/posts/mine (protected)
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /api/posts/:id/status (protected, owner only)
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["lost", "found", "claimed", "recovered"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this post's status" });
    }

    post.status = status;
    await post.save();

    const updatedPost = await Post.findById(post._id).populate("postedBy", "name email phone");

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/admin/posts (admin only)
export const getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "name email phone");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/admin/posts/:id (admin only, can delete ANY post)
export const deletePostAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post removed by admin" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};