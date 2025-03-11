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
          // Set defaults if any key is missing
          const progressData = {
            sessions: response.data.sessions || { completed: 0, total: 0 },
            history: response.data.history || [],
            dietCharts: response.data.dietCharts || [],
            recommendedPoses: response.data.recommendedPoses || []
          };
          setProgress(progressData);
        })
        .catch(error => {
          console.error('Error fetching progress:', error);
        });
      }
    }, [token]);

    if (!token) {
      return <div>Please log in to view your progress.</div>;
    }

    return (
      <div>
        <h1>Your Progress & History</h1>
        {!progress ? (
          <p>Loading progress...</p>
        ) : (
          <>
            <p>You have completed {progress.sessions.completed} out of {progress.sessions.total} sessions</p>
            <h2>Activity History</h2>
            <ul>
              {progress.history.map((item, index) => (
                <li key={index}>
                  {new Date(item.activity_date).toLocaleString()}: {item.activity_type} - {item.detail} {item.accuracy ? `(Accuracy: ${item.accuracy * 100}%)` : ''}
                </li>
              ))}
            </ul>
            <h2>Diet Charts</h2>
            <ul>
              {progress.dietCharts.map((chart, index) => (
                <li key={index}>
                  {new Date(chart.date).toLocaleDateString()}: {chart.meals}
                </li>
              ))}
            </ul>
            <h2>Recommended Yoga Poses</h2>
            <ul>
              {progress.recommendedPoses.map((pose, index) => (
                <li key={index} onClick={() => navigate(`/poses/${pose.id}`)}>
                  {pose.name}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
};

export default Progress;
