import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, fetchPosts } from '../services/api';
import PostConfirmationModal from './PostConfirmationModal';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('home');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state for post creation confirmation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPost, setPendingPost] = useState(null);

  // Fetch posts when component mounts or when home view is selected
  useEffect(() => {
    if (currentView === 'home') {
      const loadPosts = async () => {
        try {
          setIsLoading(true);
          const response = await fetchPosts();
          
          // Ensure response.data is an array
          const postsData = Array.isArray(response.data) ? response.data : [];
          setPosts(postsData);
          setError(null);
        } catch (error) {
          console.error('Error fetching posts:', error);
          setPosts([]); // Ensure posts is an array even on error
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

    // Instead of directly creating post, open modal
    setPendingPost(postData);
    setIsModalOpen(true);
  };

  const confirmPost = async () => {
    if (!pendingPost) return;

    try {
      const response = await createPost(pendingPost);
      
      // Add the new post to the existing posts if on home view
      if (currentView === 'home') {
        setPosts(prevPosts => [response.data, ...prevPosts]);
      }
      
      // Reset form and switch to home view
      setCurrentView('home');
      
      // Close modal and reset pending post
      setIsModalOpen(false);
      setPendingPost(null);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPendingPost(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
              posts.map(post => (
                <div key={post._id} className="post-card">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <p>Category: {post.category}</p>
                  {post.imageUrl && (
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      style={{ maxWidth: '300px', maxHeight: '300px' }} 
                    />
                  )}
                  <div className="post-meta">
                    <span>Likes: {post.likes}</span>
                  </div>
                </div>
              ))
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
                <option value="LostAndFound">LostAndFound</option>
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
        <button onClick={() => setCurrentView('home')}>
          Home
        </button>
        <button onClick={() => setCurrentView('notifications')}>
          Notifications
        </button>
        <button onClick={() => setCurrentView('chats')}>
          Chats
        </button>
        <button onClick={() => setCurrentView('post')}>
          Post
        </button>
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
        onClose={closeModal}
        onConfirm={confirmPost}
        postDetails={pendingPost || {}}
      />
    </div>
      

      
    
  );
};

export default Dashboard;