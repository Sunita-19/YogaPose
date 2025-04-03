import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/profile">Profile</Link>
      <Link to="/progress">Progress</Link>
      <Link to="/achievements">Achievements</Link>
      {/* Other links */}
    </div>
  );
};

export default Sidebar;