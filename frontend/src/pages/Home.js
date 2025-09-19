import React, { useState, useEffect } from 'react';
import { postAPI } from '../services/api';
import PostCard from '../components/PostCard';

const Home = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getAllPosts();
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts');
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postAPI.deletePost(postId, currentUser.uid);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading posts...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Welcome to Blog Platform</h1>
        <p style={styles.subtitle}>
          Share your thoughts and connect with others
        </p>
      </div>

      {posts.length === 0 ? (
        <div style={styles.noPosts}>
          <h3>No posts yet</h3>
          <p>Be the first to share something!</p>
          {currentUser && (
            <a href="/create-post" style={styles.createPostBtn}>
              Create Your First Post
            </a>
          )}
        </div>
      ) : (
        <div style={styles.postsContainer}>
          <h2>Latest Posts</h2>
          {posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={currentUser}
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginTop: '2rem'
  },
  error: {
    textAlign: 'center',
    color: '#dc3545',
    fontSize: '1.2rem',
    marginTop: '2rem'
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1rem',
    margin: '0.5rem 0 0 0'
  },
  noPosts: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  createPostBtn: {
    display: 'inline-block',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    marginTop: '1rem'
  },
  postsContainer: {
    marginTop: '2rem'
  }
};

export default Home;