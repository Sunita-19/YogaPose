import React from 'react';
import './About.css';

export default function About() {
    return (
        <div className="about-container">
            <h1 className="about-heading">About Fun Yoga</h1>
            <div className="about-main">
                <p className="about-content">
                    Welcome to Fun Yoga, your all-in-one platform for a healthier, balanced lifestyle. We’re here to help you master yoga while ensuring your diet complements your fitness journey, giving you a complete wellness experience.
                </p>
                <p className="about-content">
                    At Fun Yoga, we use advanced pose detection technology to provide real-time feedback on your yoga poses. Whether you're working on flexibility, strength, or balance, we guide you with personalized tips to perfect your form and avoid injury.
                </p>
                <p className="about-content">
                    But we don’t stop there. We believe that fitness is more than just exercise, which is why we offer customized diet plans tailored to your activity levels and health goals. Our system analyzes your yoga practice and creates a personalized diet to keep you energized and feeling your best.
                </p>

                <h3 className="about-subheading">Why Choose Fun Yoga?</h3>
                <ul className="about-list">
                    <li><b>Real-time Pose Correction:</b> Get instant feedback on your yoga postures to improve your practice.</li>
                    <li><b>Personalized Diet Plans:</b> We suggest meal plans based on your yoga routine and health needs.</li>
                    <li><b>User-Friendly:</b> Whether you’re new to yoga or a seasoned yogi, our platform is designed to be easy to use and enjoyable.</li>
                    <li><b>Holistic Health Approach: </b>We combine yoga and nutrition to offer a balanced approach to fitness and well-being.</li>
                </ul>

                <p className="about-content">
                    Our mission is simple: to make yoga fun, accessible, and effective for everyone. Whether you’re looking to reduce stress, improve flexibility, or build strength, Fun Yoga is here to support your journey.
                </p>
                <p className="about-content">
                    Let’s start your wellness journey together! Practice smarter, eat better, and feel amazing with Fun Yoga.
                </p>

                <div className="developer-info">
                    <h4>About Us</h4>
                    <p className="about-content">
                        We are passionate about promoting wellness through yoga and nutrition. Our team is dedicated to providing you with the tools and resources you need to succeed in your wellness journey.
                    </p>
                    <h4>Contact</h4>
                    <a href="https://github.com/Sunita-19/YogaPose/tree/main">
                        <p className="about-content">GitHub</p>
                    </a>
                </div>
            </div>
        </div>
    );
}
