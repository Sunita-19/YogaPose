// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import fbIcon from '../../utils/images/Fb.PNG';
import twitterIcon from '../../utils/images/Twitter.PNG';
import instaIcon from '../../utils/images/Insta.PNG';
import linkedinIcon from '../../utils/images/LinkedIn.PNG';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section contact-us">
                    <h4>Contact Us</h4>
                    <p>Email: FunYoga@gmail.com</p>
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
                        <a href="https://www.linkedin.com/in/sunita-yadav-057a75300" target="_blank" rel="noopener noreferrer">
                            <img src={linkedinIcon} alt="LinkedIn" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Fun Yoga AI Trainer. All rights reserved.</p>

            </div>
        </footer>
    );
}
