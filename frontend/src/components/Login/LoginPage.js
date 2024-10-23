import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            setErrorMessage('');
            window.location.href = '/'; // Redirect to home page
        } else {
            setErrorMessage(data.error);
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
                <div className="or-separator">
                    <div className="or-line"></div>
                    <div className="or-text">OR</div>
                    <div className="or-line"></div>
                </div>
                <p className="auth-text">Don't have an account? <a href="/signup" className="auth-link">Sign up</a></p>
            </div>
        </div>
    );
};

export default LoginPage;
