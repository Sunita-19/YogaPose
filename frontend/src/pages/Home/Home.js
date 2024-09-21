import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
    return (
        <div className='home-container'>
            <header className='home-header'>
                <h1 className='home-heading'>SuMaY</h1>
                <Link to='/about'>
                    <button className="btn btn-secondary" id="about-btn">About</button>
                </Link>
            </header>

            <div className="home-main">
                <h1 className="description">A Yoga AI Trainer</h1>
                <div className="btn-section">
                    <Link to='/start'>
                        <button className="btn start-btn">Let's Start</button>
                    </Link>
                    <Link to='/tutorials'>
                        <button className="btn start-btn">Tutorials</button>
                    </Link>
                </div>
            </div>

            <footer className="footer">
                <p>© 2024 Fun Yoga. All rights reserved.</p>
            </footer>
        </div>
    );
}
