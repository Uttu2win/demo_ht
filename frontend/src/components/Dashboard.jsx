import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, fetchPosts, likePost } from '../services/api';
import PostConfirmationModal from './PostConfirmationModal';
import axios from 'axios';
import './Dashboard.css';

// Utility function to format time ago
const formatTimeAgo = (date) => {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now - postDate) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (let interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('home');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPost, setPendingPost] = useState(null);
  const [user, setUser] = useState(null);

  // Load user from local storage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log('Stored User:', storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (currentView === 'home' || currentView === 'forsalefree') {
      const loadPosts = async () => {
        try {
          setIsLoading(true);
          const response = await fetchPosts();
          const postsData = Array.isArray(response.data) ? response.data : [];
          setPosts(postsData);
          setError(null);
        } catch (error) {
          console.error('Error fetching posts:', error);
          setPosts([]);
          setError(error.message || 'Failed to fetch posts');
        } finally {
          setIsLoading(false);
        }
      };

      loadPosts();
    }
  }, [currentView]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const postData = {
      title: formData.get('title'),
      content: formData.get('content'),
      category: formData.get('category'),
      imageUrl: formData.get('imageUrl') || ''
    };

    setPendingPost(postData);
    setIsModalOpen(true);
  };

  const confirmPost = async () => {
    if (!pendingPost) return;

    try {
      const response = await createPost(pendingPost);
      
      if (currentView === 'home') {
        setPosts(prevPosts => [response.data, ...prevPosts]);
      }
      
      setCurrentView('home');
      setIsModalOpen(false);
      setPendingPost(null);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleLikePost = async (postId) => {
    // Check if user is logged in
    console.log('Current User:', user);
    if (!user) {
      alert('Please log in to like posts');
      return;
    }
    try {
      const response = await likePost(postId);
  
      // Ensure response.data exists and has the expected structure
      if (response && response.data) {
        // Update the posts list with the updated post
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId ? response.data : post
          )
        );
      }
    } catch (error) {
      console.error('Detailed like error:', error.response ? error.response.data : error);
      alert(error.response?.data?.message || 'Failed to like/unlike the post');
    }
  };
  
  

  const handleAddComment = async (postId, commentText) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/posts/${postId}/comment`, 
        { text: commentText }, 
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        }
      );

      // Update the posts list with the updated post
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data : post
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderSidebarButtons = () => {
    const buttons = [
      { view: 'home', label: 'Home' },
      { view: 'notifications', label: 'Notifications' },
      { view: 'chats', label: 'Chats' },
      { view: 'post', label: 'Post' },
      { view: 'forsalefree', label: 'For Sale & Free' },
    ];

    return buttons.map(button => (
      <button 
        key={button.view}
        onClick={() => setCurrentView(button.view)}
        className={currentView === button.view ? 'active' : ''}
      >
        {button.label}
      </button>
    ));
  };

  const PostCard = ({ post }) => {
    const [showFullContent, setShowFullContent] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
  
    const MAX_CONTENT_LENGTH = 200;
  
    const toggleContent = () => setShowFullContent(!showFullContent);
    const toggleComments = () => setShowComments(!showComments);
  
    const renderContent = () => {
      if (showFullContent || post.content.length <= MAX_CONTENT_LENGTH) {
        return post.content;
      }
      return `${post.content.substring(0, MAX_CONTENT_LENGTH)}...`;
    };
  
    // Add null checks for post and nested objects
    if (!post || !post.createdBy) {
      return null; // or a placeholder/error component
    }
  
    return (
      <div className="post-card">
        {/* User info and timestamp */}
        <div className="post-header">
          <img 
            src={post.createdBy.profilePic || '/default-profile.png'} 
            alt={`${post.createdBy.name || 'Unknown'}'s profile`} 
            className="profile-pic" 
          />
          <div>
            <span className="post-author">{post.createdBy.name || 'Unknown User'}</span>
            <span className="post-timestamp">
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>
        </div>
  
        {/* Post content */}
        <div className="post-content">
          <h3>{post.title || 'Untitled Post'}</h3>
          <p>
            {renderContent()}
            {post.content && post.content.length > MAX_CONTENT_LENGTH && (
              <button 
                onClick={toggleContent} 
                className="see-more-btn"
              >
                {showFullContent ? 'See Less' : 'See More'}
              </button>
            )}
          </p>
  
          {/* Post image */}
          {post.imageUrl && (
            <img 
              src={post.imageUrl} 
              alt={post.title || 'Post Image'} 
              className="post-image" 
            />
          )}
        </div>
  
        {/* Interactions section */}
        <div className="post-interactions">
  <div className="like-section">
    <button 
      onClick={() => handleLikePost(post._id)}
      className="like-btn"
    >
      <span style={{ 
        color: (post.likes && Array.isArray(post.likes) && 
                user && 
                post.likes.some(like => 
                  // Check if like is an object with _id or a direct user ID
                  (like._id || like) === user._id
                )) ? 'red' : 'black' 
      }}>
        👍 {post.likes ? post.likes.length : 0}
      </span>
    </button>
  </div>
</div>
  
        {/* Comments section */}
        {showComments && (
          <div className="comments-container">
            {(post.comments || []).map((comment, index) => (
              <div key={index} className="comment">
                <img 
                  src={(comment.userId?.profilePic) || '/default-profile.png'} 
                  alt={`${comment.userName || 'Unknown'}'s profile`} 
                  className="comment-profile-pic" 
                />
                <div>
                  <span className="comment-author">{comment.userName || 'Unknown User'}</span>
                  <p>{comment.text}</p>
                </div>
              </div>
            ))}
  
            {/* Add comment input */}
            <div className="add-comment">
              <input 
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button 
                onClick={() => {
                  handleAddComment(post._id, newComment);
                  setNewComment('');
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="home-content">
            <h2>Neighborhood Updates</h2>
            {isLoading ? (
              <p>Loading posts...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : posts.length === 0 ? (
              <p>No posts available</p>
            ) : (
              posts.filter(post => post && post._id).map(post => (
                <PostCard key={post._id} post={post} />
              ))
            )}
          </div>
        );
      case 'forsalefree':
        return (
          <div className="home-content">
            <h2>For Sale & Free</h2>
            {isLoading ? (
              <p>Loading posts...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : posts.filter(p => p.category === 'ForSaleFree').length === 0 ? (
              <p>No For Sale & Free posts available</p>
            ) : (
              posts
                .filter(p => p.category === 'ForSaleFree')
                .map(post => <PostCard key={post._id} post={post} />)
            )}
          </div>
        );
      case 'notifications':
        return (
          <div className="notifications-content">
            <h2>Neighborhood Notifications</h2>
            <p>No notifications at the moment.</p>
          </div>
        );
      case 'chats':
        return (
          <div className="chats-content">
            <h2>Neighborhood Chats</h2>
            <p>Chat feature coming soon!</p>
          </div>
        );
      case 'post':
        return (
          <div className="post-content">
            <h2>Create a New Post</h2>
            <form onSubmit={handleCreatePost}>
              <input 
                type="text" 
                placeholder="Post Title" 
                name="title" 
                required 
              />
              <textarea 
                placeholder="What's happening?" 
                name="content" 
                required 
              />
              <select name="category" required>
                <option value="">Select Category</option>
                <option value="Events">Events</option>
                <option value="Announcements">Announcements</option>
                <option value="News">News</option>
                <option value="Sale">Sale</option>
                <option value="ForSaleFree">For Sale & Free</option>
                <option value="LostAndFound">Lost and Found</option>
                <option value="Services">Services</option>
              </select>
              <input 
                type="text" 
                placeholder="Image URL (optional)" 
                name="imageUrl" 
              />
              <button type="submit">Post</button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        {renderSidebarButtons()}
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {renderContent()}
      </div>

      <PostConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmPost}
        postDetails={pendingPost || {}}
      />
    </div>
  );
};

export default Dashboard;