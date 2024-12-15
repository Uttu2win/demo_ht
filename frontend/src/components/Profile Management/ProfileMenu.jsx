import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileMenu.css';

const ProfileMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="profile-menu" ref={menuRef}>
      <div className="profile-trigger" onClick={() => setIsOpen(!isOpen)}>
        <img 
          src={user?.profilePicUrl || '/default-profile.png'} 
          alt="Profile" 
          className="profile-pic"
        />
      </div>
      
      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <img 
              src={user?.profilePicUrl || '/default-profile.png'} 
              alt="Profile" 
              className="profile-pic-large"
            />
            <div className="profile-info">
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
            </div>
          </div>
          <div className="profile-actions">
            <button onClick={handleProfileClick}>Manage Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;