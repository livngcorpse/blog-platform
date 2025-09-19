import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Post API calls
export const postAPI = {
  // Get all posts
  getAllPosts: () => api.get('/posts'),
  
  // Get single post by ID
  getPostById: (id) => api.get(`/posts/${id}`),
  
  // Create new post
  createPost: (postData) => api.post('/posts', postData),
  
  // Update post
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  
  // Delete post
  deletePost: (id, authorId) => api.delete(`/posts/${id}`, { 
    data: { authorId } 
  }),
  
  // Get posts by author
  getPostsByAuthor: (authorId) => api.get(`/posts/author/${authorId}`)
};

// Comment API calls
export const commentAPI = {
  // Get comments for a post
  getCommentsByPost: (postId) => api.get(`/comments/post/${postId}`),
  
  // Get single comment by ID
  getCommentById: (id) => api.get(`/comments/${id}`),
  
  // Create new comment
  createComment: (commentData) => api.post('/comments', commentData),
  
  // Update comment
  updateComment: (id, commentData) => api.put(`/comments/${id}`, commentData),
  
  // Delete comment
  deleteComment: (id, authorId) => api.delete(`/comments/${id}`, { 
    data: { authorId } 
  }),
  
  // Get comments by author
  getCommentsByAuthor: (authorId) => api.get(`/comments/author/${authorId}`)
};

export default api;