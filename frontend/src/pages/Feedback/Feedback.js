import React, { useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../../context/UserContext';
import './Feedback.css';


const Feedback = () => {
    const { user } = useContext(UserContext) || {}; // Fallback to an empty object
    const userId = user ? user.id : null; // Get the user's ID
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [satisfaction, setSatisfaction] = useState('');
    const [comments, setComments] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate input
        if (!name || !email || !satisfaction || !comments) {
            setError('All fields are required!');
            return;
        }

        // Submit feedback to the server
        try {
            const response = await axios.post('http://localhost:5000/api/feedback', {
                user_id: userId,
                name,
                email,
                satisfaction,
                comments,
            });
            setSuccess(response.data.message);
            setName('');
            setEmail('');
            setSatisfaction('');
            setComments('');
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || 'An error occurred while submitting feedback');
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="feedback-container">
            <h2>Feedback Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="satisfaction">Satisfaction Level:</label>
                    <select
                        id="satisfaction"
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
                <div className="form-group">
                    <label htmlFor="comments">Comments:</label>
                    <textarea
                        id="comments"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit">Submit Feedback</button>
            </form>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </div>
    );
};

export default Feedback;
