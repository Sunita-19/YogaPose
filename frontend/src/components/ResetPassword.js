// src/components/ResetPassword.js
import React, { useState } from 'react';
import './ResetPassword.css'; // Import the updated CSS for styling

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resetToken, newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Your password has been reset successfully!');
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
                <h2 className="auth-logo">Fun Yoga</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="auth-input"
                        placeholder="Enter your reset token"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="auth-input"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="auth-button">Reset Password</button>
                </form>
                {message && <p className="message">{message}</p>}
                <p className="auth-text">Remember your password? <a href="/login" className="auth-link">Log in</a></p>
            </div>
        </div>
    );
};

export default ResetPassword;
