import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

// Importing the avatar image
import avatar from '../../utils/images/avatar.jpeg';

export default function Sidebar({ isOpen, toggleSidebar }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/logout'); // Redirect to the logout page
        toggleSidebar(); // Close the sidebar
    };

    return (
        <>
            <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={toggleSidebar}></div>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={toggleSidebar}>×</button>

                {/* Profile Section */}
                <div className="profile-section">
                    <img src={avatar} alt="User Avatar" className="profile-avatar" />
                    <Link to="/profile" onClick={toggleSidebar}>My Profile</Link>
                </div>

                {/* Quick Links */}
                <div className="quick-links">
                    <Link to="/progress" onClick={toggleSidebar}>My Progress</Link>
                    <Link to="/achievements" onClick={toggleSidebar}>Achievements</Link>
                </div>

                {/* Categories */}
                <div className="categories">
                    <Link to="/start" onClick={toggleSidebar}>Yoga Poses</Link>
                    <button onClick={handleLogout} className="logout-btn">Log Out</button>
                </div>

                {/* Help Section */}
                <div className="contact-help">
                    <Link to="/faq" onClick={toggleSidebar}>FAQ</Link>
                </div>
            </div>
        </>
    );
}
