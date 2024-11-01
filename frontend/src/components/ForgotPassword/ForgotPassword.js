// src/components/ForgotPassword/ForgotPassword.js
import React, { useState } from 'react';
import './ForgotPassword.css'; // Import the CSS file

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Check your email for reset instructions.');
            } else {
                setMessage(data.message || 'Something went wrong!');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while processing your request.');
        }
    };

    return (
        <div className="container">
            <div className="auth-box">
                <div className="auth-logo">MyApp</div>
                <h2>Forgot Password?</h2>
                <p>Please enter your email address to receive a password reset link.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="auth-input"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="auth-button">Send Reset Link</button>
                </form>
                {message && <p className="message">{message}</p>}
                <div className="auth-text">
                    <p>Remembered your password? <a href="/login" className="auth-link">Back to Login</a></p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
