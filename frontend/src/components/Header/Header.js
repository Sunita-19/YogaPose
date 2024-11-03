import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header({ toggleSidebar }) {
    return (
        <header className='home-header'>
            <div className="menu-icon" onClick={toggleSidebar}>
                ☰
            </div>
            <h1 className='home-heading'>SuMaY</h1>
            <h1 className="description">A Yoga AI Trainer</h1>
            <div className="header-buttons">
                <Link to='/home'>
                    <button className="btn btn-secondary" id="home-btn">Home</button>
                </Link>
                <Link to='/about'>
                    <button className="btn btn-secondary" id="about-btn">About</button>
                </Link>
                <Link to='/tutorials'>
                    <button className="btn btn-secondary" id="tutorial-btn">Tutorials</button>
                </Link>
                <Link to='/chatbot'>
                    <button className="btn btn-secondary">Chatbot</button>
                </Link>
                <Link to='/diet'>
                    <button className="btn btn-secondary">Diet Chart</button>
                </Link>
                <Link to='/progress'>
                    <button className="btn btn-secondary">Progress</button>
                </Link>
            </div>
        </header>
    );
}
