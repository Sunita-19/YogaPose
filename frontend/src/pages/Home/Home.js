import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
    return (
        <div className='home-container'>
            <header className='home-header'>
                <h1 className='home-heading'>SuMaY</h1>
                <h1 className="description">A Yoga AI Trainer</h1>
                <div className="header-buttons">
                    <Link to='/about'>
                        <button className="btn btn-secondary" id="about-btn">About</button>
                    </Link>
                    <Link to='/tutorials'>
                        <button className="btn btn-secondary" id="tutorial-btn">Tutorials</button>
                    </Link>
                    <Link to='/chatbot'>
                        <button className="btn btn-secondary">Chatbot</button>
                    </Link>
                </div>
            </header>

            <div className="home-main">
                <div className="btn-section">
                    <Link to='/start'>
                        <button className="btn start-btn">Let's Start</button>
                    </Link>
                </div>
            </div>

            <footer className="footer">
                <p>© 2024 Fun Yoga. All rights reserved.</p>
            </footer>
        </div>
    );
}
