import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

// Importing the avatar image
import avatar from '../../utils/images/avatar.jpeg';

export default function Sidebar({ isOpen, toggleSidebar }) {
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
                    <Link to="/settings" onClick={toggleSidebar}>Settings</Link>
                </div>

                {/* Categories */}
                <div className="categories">
                    <h4>Yoga Categories</h4>
                    <Link to="/start" onClick={toggleSidebar}>Yoga Poses</Link>
                    <Link to="/yoga/techniques" onClick={toggleSidebar}>Yoga Techniques</Link>
                    <Link to="/yoga/meditations" onClick={toggleSidebar}>Meditations</Link>
                </div>

                {/* Help Section */}
                <div className="contact-help">
                    <h4>Need Help?</h4>
                    <Link to="/contact" onClick={toggleSidebar}>Contact Us</Link>
                    <Link to="/faq" onClick={toggleSidebar}>FAQ</Link>
                </div>
            </div>
        </>
    );
}
