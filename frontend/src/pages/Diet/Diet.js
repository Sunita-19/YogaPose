import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Diet.css';

const Diet = () => {
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [isVegetarian, setIsVegetarian] = useState(null);
    const [healthIssue, setHealthIssue] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const ageNum = parseInt(age);
        const weightNum = parseInt(weight);

        if (ageNum < 0 || weightNum < 0) {
            alert('Age and Weight cannot be negative.');
            return;
        }

        // Navigate to DietPlan page with the calculated diet plan
        navigate('/dietplan', {
            state: {
                age: ageNum,
                weight: weightNum,
                isVegetarian,
                healthIssue,
            },
        });
    };

    return (
        <div className="diet-container">
            <h2 className="diet-header">Diet Chart</h2>
            <form onSubmit={handleSubmit} className="diet-form">
                <div className="input-group">
                    <label>Age:</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Weight (kg):</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Diet Type:</label>
                    <label>
                        <input
                            type="radio"
                            value="vegetarian"
                            checked={isVegetarian === true}
                            onChange={() => setIsVegetarian(true)}
                        />{' '}
                        Vegetarian
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="nonVegetarian"
                            checked={isVegetarian === false}
                            onChange={() => setIsVegetarian(false)}
                        />{' '}
                        Non-Vegetarian
                    </label>
                </div>
                <div className="input-group">
                    <label>Health Issues:</label>
                    <input
                        type="text"
                        value={healthIssue}
                        onChange={(e) => setHealthIssue(e.target.value)}
                    />
                </div>
                <button type="submit">Calculate Diet Plan</button>
            </form>
        </div>
    );
};

export default Diet;
