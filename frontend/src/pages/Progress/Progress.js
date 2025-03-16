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
      axios
        .get('http://localhost:5000/api/progress-report', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          console.log('Progress response:', response.data);
          setProgress(response.data);
        })
        .catch(error => {
          console.error('Error fetching progress:', error.response?.data || error);
        });
    }
  }, [token]);

  if (!token) {
    return <div className="warning">Please log in to view your progress.</div>;
  }

  if (!progress) {
    return <div className="loading">Loading progress...</div>;
  }

  // Parser to extract meal details.
  // Expected format: "Generated diet chart: Breakfast: xxx, Lunch: yyy, Dinner: zzz"
  const parseDietMeals = (mealStr) => {
    // Remove the prefix if it exists.
    mealStr = mealStr.replace(/^Generated diet chart:\s*/i, '');
    const parts = mealStr.split(',');
    const breakfast = parts[0] ? parts[0].replace(/Breakfast:\s*/i, '').trim() : 'N/A';
    const lunch = parts[1] ? parts[1].replace(/Lunch:\s*/i, '').trim() : 'N/A';
    const dinner = parts[2] ? parts[2].replace(/Dinner:\s*/i, '').trim() : 'N/A';
    return { breakfast, lunch, dinner };
  };

  return (
    <div className="progress-container">
      <h1 className="progress-heading">Your Progress</h1>

      {/* Practice Activities Section */}
      <section className="segment activity-section">
        <h2 className="segment-heading">Practice Activities</h2>
        <div className="grid-container">
          {progress.history
            .filter(item => item.activity_type === 'practice' && item.yoga_pose_id)
            .map(item => (
              <div
                key={item.id}
                className="card"
                onClick={() => navigate(`/pose/${item.yoga_pose_id}`)}
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="pose-image" />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <div className="card-content">
                  <h3>{item.name || 'Yoga Pose'}</h3>
                  <p className="date">{new Date(item.activity_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Diet Chart Section */}
      <section className="segment diet-section">
        <h2 className="segment-heading">Diet Chart</h2>
        {progress.dietCharts && progress.dietCharts.map((item, idx) => {
            const meals = parseDietMeals(item.meals || item.detail);
            return (
              <div key={idx} className="diet-chart-card">
                <p className="date">{new Date(item.date).toLocaleDateString()}</p>
                <div className="diet-grid">
                  <div className="diet-card">
                    <h3>Breakfast</h3>
                    <p>{meals.breakfast}</p>
                  </div>
                  <div className="diet-card">
                    <h3>Lunch</h3>
                    <p>{meals.lunch}</p>
                  </div>
                  <div className="diet-card">
                    <h3>Dinner</h3>
                    <p>{meals.dinner}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </section>

      {/* Recommended Yoga Poses Section */}
      <section className="segment recommendation-section">
        <h2 className="segment-heading">Recommended Yoga Poses</h2>
        <div className="grid-container">
          {progress.recommendedPoses && progress.recommendedPoses.map(poseData => (
            <div
              key={poseData.id}
              className="card"
              onClick={() => navigate(`/pose/${poseData.id}`)}
            >
              {poseData.image ? (
                <img src={poseData.image} alt={poseData.name} className="pose-image" />
              ) : (
                <div className="no-image">No Image</div>
              )}
              <div className="card-content">
                <h3>{poseData.name || 'Yoga Pose'}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Progress;
