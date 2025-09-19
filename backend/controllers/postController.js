const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    
    if (!title || !content || !authorId) {
      return res.status(400).json({ 
        message: 'Title, content, and authorId are required' 
      });
    }

    const newPost = new Post({
      title,
      content,
      authorId
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user is the author
    if (post.authorId !== authorId) {
      return res.status(403).json({ message: 'Unauthorized to update this post' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { authorId } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user is the author
    if (post.authorId !== authorId) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    // Delete all comments associated with this post
    await Comment.deleteMany({ postId: req.params.id });
    
    // Delete the post
    await Post.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Post and associated comments deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get posts by author
const getPostsByAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;
    const posts = await Post.find({ authorId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByAuthor
};