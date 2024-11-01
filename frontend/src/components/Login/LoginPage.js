// src/components/Login/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token in local storage
                localStorage.setItem('token', data.token);
                setErrorMessage('');
                navigate('/home'); // Redirect to home page
            } else {
                setErrorMessage(data.message || 'Login failed.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="container">
            <div className="auth-box">
                <h1 className="auth-logo">Fun Yoga</h1>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        className="auth-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="auth-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="auth-button">Log In</button>
                </form>
                <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
                <div className="or-separator">
                    <div className="or-line"></div>
                    <div className="or-text">OR</div>
                    <div className="or-line"></div>
                </div>
                <p className="auth-text">Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link></p>
            </div>
        </div>
    );
};

export default LoginPage;
