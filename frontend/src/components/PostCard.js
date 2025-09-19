import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post, currentUser, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const isAuthor = currentUser && currentUser.uid === post.authorId;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.title}>
          <Link to={`/post/${post._id}`} style={styles.titleLink}>
            {post.title}
          </Link>
        </h2>
        {isAuthor && (
          <div style={styles.actions}>
            <Link to={`/edit-post/${post._id}`} style={styles.editBtn}>
              Edit
            </Link>
            <button 
              onClick={() => onDelete(post._id)} 
              style={styles.deleteBtn}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      
      <div style={styles.content}>
        <p>{truncateContent(post.content)}</p>
      </div>
      
      <div style={styles.cardFooter}>
        <small style={styles.date}>
          Created: {formatDate(post.createdAt)}
        </small>
        {post.updatedAt !== post.createdAt && (
          <small style={styles.date}>
            Updated: {formatDate(post.updatedAt)}
          </small>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  title: {
    margin: '0 0 0.5rem 0',
    color: '#333'
  },
  titleLink: {
    textDecoration: 'none',
    color: '#007bff',
    cursor: 'pointer'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem'
  },
  editBtn: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#28a745',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.875rem'
  },
  deleteBtn: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  content: {
    marginBottom: '1rem',
    lineHeight: '1.6'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #eee',
    paddingTop: '0.5rem'
  },
  date: {
    color: '#666',
    fontSize: '0.875rem'
  }
};

export default PostCard;