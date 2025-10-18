const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ firebaseUid: id }).select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile by username
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or update user profile
const createOrUpdateUser = async (req, res) => {
  try {
    const { firebaseUid, email, username, displayName, bio, socialLinks, preferences } = req.body;
    
    if (!firebaseUid || !email || !username || !displayName) {
      return res.status(400).json({ 
        message: 'Firebase UID, email, username, and display name are required' 
      });
    }
    
    // Check if username is taken (excluding current user)
    const existingUser = await User.findOne({ 
      username, 
      firebaseUid: { $ne: firebaseUid } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }
    
    const userData = {
      firebaseUid,
      email,
      username,
      displayName,
      bio: bio || '',
      socialLinks: socialLinks || {},
      preferences: preferences || {}
    };
    
    const user = await User.findOneAndUpdate(
      { firebaseUid },
      userData,
      { new: true, upsert: true, runValidators: true }
    );
    
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update profile photo
const updateProfilePhoto = async (req, res) => {
  try {
    const { firebaseUid } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    const profilePhoto = `/uploads/${req.file.filename}`;
    
    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { profilePhoto },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ profilePhoto });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user stats
const getUserStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    const postsCount = await Post.countDocuments({ authorId: id });
    const commentsCount = await Comment.countDocuments({ authorId: id });
    
    // Calculate total likes received on user's posts
    const userPosts = await Post.find({ authorId: id }).select('likesCount');
    const likesReceived = userPosts.reduce((total, post) => total + post.likesCount, 0);
    
    const stats = {
      postsCount,
      commentsCount,
      likesReceived
    };
    
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  getUserByUsername,
  createOrUpdateUser,
  updateProfilePhoto,
  getUserStats
};