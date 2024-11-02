import React from 'react';
import { Link } from 'react-router-dom';
// import Header from '../../components/Header/Header';
// import Footer from '../../components/Footer/Footer';
import './Home.css';

export default function Home() {
    return (
        <div className='home-container'>
            <div className="home-main">
                <div className="text-section">
                    <h2 className="heading">Make yoga part<br /> of your life</h2>
                    <p className="subheading">Sharing the love of yoga to create positive change in the world</p>
                </div>
            </div>
            <div className="btn-section">
                    <Link to='/start'>
                        <button className="btn start-btn">Let's Start</button>
                    </Link>
                </div>
        </div>
    );
}
