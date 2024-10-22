// src/pages/Home/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import fbIcon from '../../utils/images/Fb.PNG';
import twitterIcon from '../../utils/images/Twitter.PNG';
import instaIcon from '../../utils/images/Insta.PNG';
import linkedinIcon from '../../utils/images/LinkedIn.PNG';

export default function Home() {
    return (
        <div className='home-container'>
            <header className='home-header'>
                <h1 className='home-heading'>SuMaY</h1>
                <h1 className="description">A Yoga AI Trainer</h1>
                <div className="header-buttons">
                    <Link to='/'>
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

            <div className="home-main">
                <div className="text-section">
                    <h2 className="heading">Make yoga part<br /> of your life</h2>
                    <p className="subheading">Sharing the love of yoga to create positive change in the world</p>
                </div>
                <div className="btn-section">
                    <Link to='/start'>
                        <button className="btn start-btn">Let's Start</button>
                    </Link>
                </div>
            </div>

            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-section contact-us">
                        <h4>Contact Us</h4>
                        <p>Email: info@funyogatrainer.com</p>
                        <p>Phone: +123 456 7890</p>
                        <p>Address: 123 Yoga Street, Wellness City, YG 78900</p>
                    </div>

                    <div className="footer-section quick-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to='/'>Home</Link></li>
                            <li><Link to='/about'>About</Link></li>
                            <li><Link to='/tutorials'>Tutorials</Link></li>
                            <li><Link to='/chatbot'>Chatbot</Link></li>
                            <li><Link to='/diet'>Diet Chart</Link></li>
                            <li><Link to='/progress'>Progress</Link></li>
                            <li><Link to="/feedback">Feedback</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section follow-us">
                        <h4>Follow Us</h4>
                        <div className="social-icons">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <img src={fbIcon} alt="Facebook" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <img src={twitterIcon} alt="Twitter" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <img src={instaIcon} alt="Instagram" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <img src={linkedinIcon} alt="LinkedIn" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2024 Fun Yoga AI Trainer. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}