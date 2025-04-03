import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const trimmedToken = token.trim(); // Ensure no extra whitespace is sent

    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: trimmedToken, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset successfully.");
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setMessage(data.message || 'Reset failed.');
      }
    } catch (error) {
      console.error('Error during reset:', error);
      setMessage("An error occurred while processing your request.");
    }
  };

  return (
    <div className="container">
      <div className="auth-box">
        <h2>Reset Password</h2>
        <form onSubmit={handleReset}>
          <input 
            type="text"
            className="auth-input"
            placeholder="Enter token from email"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <input 
            type="password"
            className="auth-input"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input 
            type="password"
            className="auth-input"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">Reset Password</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;

// Server-side code for handling the reset-password request
const handleResetPasswordRequest = (req, res) => {
  const { token, newPassword } = req.body;

  db.query(
    'SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiry > UTC_TIMESTAMP()',
    [token.trim()],
    async (err, results) => {
      if (err) {
        console.error('Database error during reset-password:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      console.log("Reset token query results:", results);
      if (results.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
      }
      // … continue with password hashing and update.
    }
  );
};