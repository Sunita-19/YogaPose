// src/pages/Home/Home.js
import React from 'react';
import { Link } from 'react-router-dom'; // Make sure this line is included
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Home.css';
import fbIcon from '../../utils/images/Fb.PNG';
import twitterIcon from '../../utils/images/Twitter.PNG';
import instaIcon from '../../utils/images/Insta.PNG';
import linkedinIcon from '../../utils/images/LinkedIn.PNG';

export default function Home() {
    return (
        <div className='home-container'>
            {/* <Header />
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
            </header> */}

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

            {/* <Footer /> */}
        </div>
    );
}
