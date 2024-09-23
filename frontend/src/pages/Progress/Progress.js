import React from 'react';
import './Progress.css'; // Import the CSS file

const Progress = () => {
    return (
        <div className="progress-container">
            <div className="progress-header">
                <h1 className="progress-heading">Your Progress</h1>
            </div>
            <p className="progress-content">
                Track your yoga practice and improvements here!
            </p>
            <button className="btn">View Progress</button>
        </div>
    );
};

export default Progress;
