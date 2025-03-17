import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Progress.css';

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Helper to get a full URL for images.
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:5000/${url}`;
  };

  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:5000/api/progress-report', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          // console.log('Progress response:', response.data);
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

  // Updated parser to correctly map meals based on their labels
  const parseDietMeals = (mealStr) => {
    // Remove any leading text like "Generated diet chart:"
    mealStr = mealStr.replace(/^Generated diet chart:\s*/i, '');
    // Split string by comma instead of assuming fixed order
    const parts = mealStr.split(',');
    let breakfast = 'N/A';
    let lunch = 'N/A';
    let dinner = 'N/A';
    
    parts.forEach(part => {
      const trimmed = part.trim();
      if (trimmed.toLowerCase().startsWith("breakfast:")) {
        breakfast = trimmed.replace(/Breakfast:\s*/i, '').trim();
      } else if (trimmed.toLowerCase().startsWith("lunch:")) {
        lunch = trimmed.replace(/Lunch:\s*/i, '').trim();
      } else if (trimmed.toLowerCase().startsWith("dinner:")) {
        dinner = trimmed.replace(/Dinner:\s*/i, '').trim();
      }
    });
    
    return { breakfast, lunch, dinner };
  };

  return (
    <div className="progress-container">
      <h1 className="progress-heading">Your Progress</h1>

      {/* Practice Activities Section */}
      <section className="segment activity-section" style={{background: "white"}}>
        <h2 className="segment-heading">Your Recent Activities</h2>
        <div className="grid-container">
          {progress.history
            .filter(item => item.activity_type === 'practice' && item.yoga_pose_id)
            .map(item => (
              <div
                key={item.id}
                className="card"
                onClick={() => navigate(`/pose/${item.yoga_pose_id}`)}
              >
                {item.image_url ? (
                  <img src={getImageUrl(item.image_url)} alt={item.name} className="pose-image" />
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
      <section className="segment diet-section" style={{background: "white"}}>
        <h2 className="segment-heading">Your Diet For Today</h2>
        {progress.dietCharts && progress.dietCharts.map((item, idx) => {
          const meals = parseDietMeals(item.meals || item.detail);
          return (
            <div key={idx} className="diet-chart-card">
              <div>
                <p className="date">{new Date(item.date).toLocaleDateString()}</p>
              </div>
              <div className="diet-quote">
                "Eat healthy, live healthy. Your body is your temple."
              </div>
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
      <section className="segment recommendation-section" style={{background: "white"}}>
        <h2 className="segment-heading">Recommended Yoga Poses For You</h2>
        <div className="grid-container">
          {progress.recommendedPoses &&
            progress.recommendedPoses.slice(0, 4).map(poseData => (
              <div
                key={poseData.id}
                className="card"
                onClick={() => navigate(`/pose/${poseData.id}`)}
              >
                {poseData.image_url ? (
                  <img src={getImageUrl(poseData.image_url)} alt={poseData.name} className="pose-image" />
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
