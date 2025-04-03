import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ user }) => {
  return (
    <div className="sidebar">
      <img 
        src={user.profilePhoto ? `http://localhost:5000/${user.profilePhoto}` : 'path/to/default/avatar.jpeg'} 
        alt="User Avatar" 
        className="sidebar-avatar" 
      />
      <Link to="/profile">Profile</Link>
      <Link to="/progress">Progress</Link>
      <Link to="/achievements">Achievements</Link>
      {/* Other links */}
    </div>
  );
};

export default Sidebar;