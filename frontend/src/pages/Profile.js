import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { userAPI, postAPI } from '../services/api';
import PostCard from '../components/PostCard';
import ProfileCard from '../components/ProfileCard';

const Profile = ({ currentUser }) => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const [userResponse, postsResponse, statsResponse] = await Promise.all([
        userAPI.getUserByUsername(username),
        postAPI.getPostsByAuthor(username),
        userAPI.getUserStats(username)
      ]);
      
      setUser(userResponse.data);
      setUserPosts(postsResponse.data);
      setUserStats(statsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postAPI.deletePost(postId, currentUser.uid);
      setUserPosts(userPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="error-container">
        <h2>User Not Found</h2>
        <p>The user profile you're looking for doesn't exist.</p>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.uid === user.firebaseUid;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <ProfileCard 
          user={user} 
          stats={userStats} 
          isOwnProfile={isOwnProfile}
        />
        
        <div className="profile-content">
          <div className="profile-tabs">
            <button
              className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              Posts ({userStats.postsCount || 0})
            </button>
            <button
              className={`tab ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'posts' && (
              <div className="posts-grid">
                {userPosts.length === 0 ? (
                  <div className="no-posts">
                    <h3>No posts yet</h3>
                    {isOwnProfile && (
                      <Link to="/create-post" className="btn btn-primary">
                        Create Your First Post
                      </Link>
                    )}
                  </div>
                ) : (
                  userPosts.map(post => (
                    <PostCard
                      key={post._id}
                      post={post}
                      currentUser={currentUser}
                      onDelete={handleDeletePost}
                      showAuthor={false}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="about-section">
                <div className="bio">
                  <h3>Bio</h3>
                  <p>{user.bio || 'No bio available.'}</p>
                </div>
                
                {Object.values(user.socialLinks || {}).some(link => link) && (
                  <div className="social-links">
                    <h3>Social Links</h3>
                    <div className="links-grid">
                      {user.socialLinks?.twitter && (
                        <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          Twitter
                        </a>
                      )}
                      {user.socialLinks?.linkedin && (
                        <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      )}
                      {user.socialLinks?.github && (
                        <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                          GitHub
                        </a>
                      )}
                      {user.socialLinks?.website && (
                        <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer">
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="member-since">
                  <p>Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;