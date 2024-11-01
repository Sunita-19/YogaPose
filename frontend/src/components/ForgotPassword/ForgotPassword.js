// src/components/ForgotPassword/ForgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for navigation
import './ForgotPassword.css'; // Import the CSS file

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigate for routing

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Call the API to request a password reset
        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }), // Send email as JSON
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Check your email for reset instructions.'); // Success message
                // Redirect to Reset Password page
                navigate('/reset-password'); // Change this to your actual reset password route
            } else {
                setMessage(data.message || 'Something went wrong!'); // Error message
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while processing your request.'); // Error handling
        }
    };

    return (
        <div className="container">
            <div className="auth-box">
                <div className="auth-logo">Fun Yoga</div>
                <h2>Forgot Password?</h2>
                {/* <p>Please enter your email address to receive a password reset link.</p> */}
                <form onSubmit={handleSubmit}> {/* Submit handler for the form */}
                    <input
                        type="email"
                        className="auth-input"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update email state
                        required
                    />
                    <button type="submit" className="auth-button">Send Reset Link</button>
                </form>
                {message && <p className="message">{message}</p>} {/* Display response message */}
                <div className="auth-text">
                    <p>Need to reset your password? <a href="/reset-password" className="auth-link">Reset Password</a></p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
