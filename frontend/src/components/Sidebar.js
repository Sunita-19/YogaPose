import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li><Link to="/progress">Progress</Link></li>
          <li><Link to="/achievements">Achievements</Link></li>
          {/* Other sidebar links */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;