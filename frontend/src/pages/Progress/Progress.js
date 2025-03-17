import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Progress.css';
import { poseImages } from '../../utils/pose_images';

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
    mealStr = mealStr.replace(/^Generated diet chart:\s*/i, '');
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

  // Compute final recommended list by taking a fixed mix of backend and fallback poses
  const finalRecommended = (() => {
    const backendRecs = progress.recommendedPoses || [];
    // Always take at most 2 from backend recommendations.
    const backendPart = backendRecs.slice(0, 2);
    
    // Get fallback pose names from local poseImages that are not already in the backendPart (by name, case-insensitive)
    const fallbackNames = Object.keys(poseImages).filter(poseName =>
      !backendPart.some(rec => rec.name && rec.name.toLowerCase() === poseName.toLowerCase())
    );
    
    // Take 2 fallback poses (or however many you need to reach 4 total)
    const fallbackPart = fallbackNames.slice(0, Math.max(0, 4 - backendPart.length)).map(poseName => ({
      id: `fallback-${poseName}`,
      name: poseName,
      image_url: null // Frontend will use poseImages mapping
    }));
    
    // Merge backend and fallback parts
    return [...backendPart, ...fallbackPart];
  })();

  return (
    <div className="progress-container">
      <h1 className="progress-heading">Your Progress</h1>

      {/* Yoga Practice History Section */}
      {progress.yogaHistory && progress.yogaHistory.length > 0 && (
        <section className="segment yoga-history-section" style={{ background: "white" }}>
          <h2 className="segment-heading">Your Recent Detected Poses</h2>
          <div className="grid-container">
            {Array.from(
              new Map(
                progress.yogaHistory.map(record => [record.pose_name || "Yoga Pose", record])
              ).values()
            ).map((record) => (
              <div
                key={record.id}
                className="card"
                onClick={() =>
                  navigate("/start", { state: { selectedPose: record.pose_name || "Yoga Pose" } })
                }
                style={{ cursor: "pointer" }}
              >
                {poseImages[record.pose_name] ? (
                  <img
                    src={poseImages[record.pose_name]}
                    alt={record.pose_name}
                    className="pose-image"
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <div className="card-content">
                  <h3>{record.pose_name || "Yoga Pose"}</h3>
                  <p className="date">
                    {new Date(record.activity_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
      <section className="segment recommendation-section" style={{ background: "white" }}>
        <h2 className="segment-heading">Recommended Yoga Poses For You</h2>
        <div className="grid-container">
          {finalRecommended && finalRecommended.length > 0 ? (
            finalRecommended.map(poseData => (
              <div
                key={poseData.id}
                className="card"
                onClick={() =>
                  // If fallback, navigate to /start (yoga.js), otherwise go to pose details
                  poseData.id.toString().startsWith('fallback')
                    ? navigate("/start", { state: { selectedPose: poseData.name } })
                    : navigate(`/pose/${poseData.id}`)
                }
              >
                {poseData.image_url || poseImages[poseData.name] ? (
                  <img 
                    src={poseData.image_url || poseImages[poseData.name]} 
                    alt={poseData.name} 
                    className="pose-image" 
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <div className="card-content">
                  <h3>{poseData.name || 'Yoga Pose'}</h3>
                </div>
              </div>
            ))
          ) : (
            <p>No Recommended Yoga Poses available</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Progress;
