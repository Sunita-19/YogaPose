// src/pages/Feedback/Feedback.js
import React, { useState } from 'react';
import './Feedback.css'; // Import the CSS file

const Feedback = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [satisfaction, setSatisfaction] = useState('');
    const [comments, setComments] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Email validation regex
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name || !email || !satisfaction || !comments) {
            setError('Please fill in all fields.');
            return;
        }
        if (!emailPattern.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        // Handle successful submission (e.g., send data to an API)
        console.log({ name, email, satisfaction, comments });
    };

    return (
        <div className="feedback-container">
            <h2>Feedback Form</h2>
            <p>Your feedback is highly valuable for our Fun Yoga. Kindly take a few moments to share your thoughts on your experience with the portal. Please provide ratings indicating your satisfaction levels with the content, features, and services. Thank you!</p>
            <form className="feedback-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label>
                        Name: 
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required
                        />
                    </label>
                   <br></br>
                    <label>
                        Email: 
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </label>
                </div>

                <div className="form-group">
                    <label>How satisfied are you with the portal content?</label>
                    <div className="radio-group">
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                value="Very-Satisfied" 
                                checked={satisfaction === 'Very-Satisfied'} 
                                onChange={(e) => setSatisfaction(e.target.value)} 
                                required 
                            />
                            Very Satisfied
                        </label>
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                value="Satisfied" 
                                checked={satisfaction === 'Satisfied'} 
                                onChange={(e) => setSatisfaction(e.target.value)} 
                                required 
                            />
                            Satisfied
                        </label>
                        <label className="radio-option">
                            <input 
                                type="radio" 
                                value="Neutral" 
                                checked={satisfaction === 'Neutral'} 
                                onChange={(e) => setSatisfaction(e.target.value)} 
                                required 
                            />
                            Neutral
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label>Comments and Suggestions:</label>
                    <textarea 
                        value={comments} 
                        onChange={(e) => setComments(e.target.value)} 
                        required 
                    ></textarea>
                </div>

                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </div>
    );
};

export default Feedback;
