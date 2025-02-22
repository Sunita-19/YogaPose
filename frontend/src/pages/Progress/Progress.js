import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Progress.css';

const Progress = () => {
    const [progress, setProgress] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
      if (token) {
        axios.get('/api/progress-report', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          console.log("Response data:", response.data); // Log the response data
          setProgress(response.data);
        })
        .catch(error => {
          console.error('Error fetching progress:', error);
          // Optionally set an error state to display an error message to the user
          // setProgress({ error: 'Failed to load progress. Please try again later.' });
        });
        console.log("Request headers:", axios.defaults.headers.common); // Log request headers
      }
    }, [token]);

    const handleViewDetailedReport = () => {
      navigate('/progress/detailedreport');
    };

    if (!token) {
      return (
        <div className="progress-container">
          <h1>Please log in to view your progress.</h1>
        </div>
      );
    }

    return (
      <div className="progress-container">
        <div className="progress-header">
          <h1 className="progress-heading">Your Progress</h1>
        </div>
        { !progress ? (
          <p className="progress-content">Loading progress...</p>
        ) : (
          <div className="progress-report">
            <p className="progress-content">
              You have completed {progress.completed} out of {progress.total} yoga sessions.
            </p>
            <p className="progress-content">
              Upcoming recommendations: {progress.recommendations.join(', ')}.
            </p>
            <p className="progress-content">
              Keep up the great work and try these challenges for further improvement!
            </p>
          </div>
        )}
        <button className="btn" onClick={handleViewDetailedReport}>View Detailed Report</button>
      </div>
    );
};

export default Progress;
