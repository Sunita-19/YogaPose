import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar({ isOpen, toggleSidebar }) {
    return (
        <>
            <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={toggleSidebar}></div>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={toggleSidebar}>×</button>
                <Link to="/home" onClick={toggleSidebar}>Home</Link>
                <Link to="/start" onClick={toggleSidebar}>Yoga</Link>
                <Link to="/about" onClick={toggleSidebar}>About</Link>
                <Link to="/tutorials" onClick={toggleSidebar}>Tutorials</Link>
                <Link to="/chatbot" onClick={toggleSidebar}>Chatbot</Link>
                <Link to="/diet" onClick={toggleSidebar}>Diet Chart</Link>
                <Link to="/dietplan" onClick={toggleSidebar}>Diet Plan</Link>
                <Link to="/progress" onClick={toggleSidebar}>Progress</Link>
                <Link to="/feedback" onClick={toggleSidebar}>Feedback</Link>
            </div>
        </>
    );
}
