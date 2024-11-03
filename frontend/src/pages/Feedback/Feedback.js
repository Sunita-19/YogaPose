import React, { useState } from 'react';
import axios from 'axios';
import './Feedback.css';

const Feedback = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [satisfaction, setSatisfaction] = useState('');
    const [comments, setComments] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        // Ensure satisfaction level is selected
        if (!satisfaction) {
            setMessage('Please select a satisfaction level.');
            return;
        }

        try {
            const token = localStorage.getItem('token'); // Assume token is stored in local storage
            const response = await axios.post('http://localhost:5000/api/feedback', {
                name,
                email,
                satisfaction,
                comments,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the request header
                },
            });

            setMessage(response.data.message);
            // Clear form after submission
            setName('');
            setEmail('');
            setSatisfaction('');
            setComments('');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setMessage(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
        }
    };

    return (
        <div className="feedback-container">
            <h2>Feedback</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Satisfaction Level:</label>
                    <select
                        value={satisfaction}
                        onChange={(e) => setSatisfaction(e.target.value)}
                        required
                    >
                        <option value="">Select...</option>
                        <option value="1">1 - Very Dissatisfied</option>
                        <option value="2">2 - Dissatisfied</option>
                        <option value="3">3 - Neutral</option>
                        <option value="4">4 - Satisfied</option>
                        <option value="5">5 - Very Satisfied</option>
                    </select>
                </div>
                <div>
                    <label>Comments:</label>
                    <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit Feedback</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Feedback;
