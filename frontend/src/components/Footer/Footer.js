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
                    <p>Email: funyoga@gmail.com</p>
                    <p>Phone: +91 9234567890</p>
                    <p>Address: 123 Yoga Street, Wellness City, Healthy Place 78900</p>
                </div>

                <div className="footer-section quick-links">
                    <h4>Quick Links</h4>
                    <ul>
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
                <p>© 2025 Fun Yoga AI Trainer. All rights reserved.</p>
        
        </footer>
    );
}
