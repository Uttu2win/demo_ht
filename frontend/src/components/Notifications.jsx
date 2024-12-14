import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { formatTimeAgo } from '../utils/dateUtils.js';
import axios from 'axios';

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/notifications', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          userId,
          days: 5 // Only fetch last 5 days notifications
        }
      });
      setNotifications(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch notifications');
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/notifications/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div key={notification._id} className="notification-item">
              <div className="notification-content">
                {notification.type === 'post' && (
                  <p>
                    <strong>{notification.actor.name}</strong> posted a{' '}
                    {notification.data.category} {formatTimeAgo(notification.createdAt)} ago
                  </p>
                )}
                {notification.type === 'like' && (
                  <p>
                    <strong>{notification.actor.name}</strong> liked your post{' '}
                    "{notification.data.postTitle}" {formatTimeAgo(notification.createdAt)} ago
                  </p>
                )}
                {notification.type === 'comment' && (
                  <p>
                    <strong>{notification.actor.name}</strong> commented on your post{' '}
                    "{notification.data.postTitle}" {formatTimeAgo(notification.createdAt)} ago
                  </p>
                )}
                {notification.type === 'listing' && (
                  <p>
                    <strong>{notification.actor.name}</strong> has posted a listing for{' '}
                    {notification.data.category === 'paid' ? 'sale' : 'free'}
                  </p>
                )}
                {notification.type === 'join' && (
                  <p>
                    <strong>{notification.actor.name}</strong> has joined our neighborhood{' '}
                    {formatTimeAgo(notification.createdAt)} ago
                  </p>
                )}
              </div>
              <button
                className="delete-notification"
                onClick={() => deleteNotification(notification._id)}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;