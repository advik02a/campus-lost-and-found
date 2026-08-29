import Post from "../models/Post.js";

// POST /api/posts (protected)

export const createPost = async (req, res) => {
  try {
    const { title, description, type, category, location, date } = req.body;

    if (!title || !description || !type || !category || !location || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const post = await Post.create({
      title,
      description,
      type,
      category,
      location,
      date,
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

    // When searching, sort by text relevance score; otherwise by newest first
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
      .populate("postedBy", "name email");

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
    const post = await Post.findById(req.params.id).populate("postedBy", "name email");

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

    if (title) post.title = title;
    if (description) post.description = description;
    if (type) post.type = type;
    if (category) post.category = category;
    if (location) post.location = location;
    if (date) post.date = date;
    if (req.file) post.image = req.file.path; // only update image if a new one was uploaded

    const updatedPost = await post.save();
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

    const updatedPost = await Post.findById(post._id).populate("postedBy", "name email");

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};