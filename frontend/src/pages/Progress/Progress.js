import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Progress.css';
import { poseImages } from '../../utils/pose_images';

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [historyCarouselIndex, setHistoryCarouselIndex] = useState(0);
  const [activitiesCarouselIndex, setActivitiesCarouselIndex] = useState(0);
  const [recommendedCarouselIndex, setRecommendedCarouselIndex] = useState(0);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const historyDisplayedCount = 3; // cards to show in yogaHistory carousel
  const activitiesDisplayedCount = 3; // cards to show in recent activities carousel
  const recommendedDisplayedCount = 3; // show 3 poses at once

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

  // Parse diet meals (unchanged)
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

  // Deduplicate yogaHistory by pose name
  const dedupedYogaHistory = Array.from(
    new Map(
      progress.yogaHistory.map(record => [record.pose_name || "Yoga Pose", record])
    ).values()
  );

  // Compute final recommended list by merging backend and fallback poses
  const finalRecommended = (() => {
    const backendRecs = progress.recommendedPoses || [];
    // Take at most 2 from backend recommendations.
    const backendPart = backendRecs.slice(0, 2);
    // Get fallback pose names from poseImages that are not already in backendPart (case-insensitive)
    const fallbackNames = Object.keys(poseImages).filter(poseName =>
      !backendPart.some(rec => rec.name && rec.name.toLowerCase() === poseName.toLowerCase())
    );
    // Take enough fallback poses to reach a total of 6 items
    const fallbackPart = fallbackNames.slice(0, Math.max(0, 6 - backendPart.length)).map(poseName => ({
      id: `fallback-${poseName}`,
      name: poseName,
      image_url: null // Frontend uses poseImages mapping
    }));
    // Merge and then deduplicate by pose name (case-insensitive)
    const merged = [...backendPart, ...fallbackPart];
    return Array.from(
      new Map(merged.map(pose => [ (pose.name || 'Yoga Pose').toLowerCase(), pose ])).values()
    );
  })();

  // Calculate maximum indexes for carousels
  const maxHistoryIndex = Math.max(dedupedYogaHistory.length - historyDisplayedCount, 0);
  // Use the recentActivities property from the API for "Your Recent Activities"
  const practiceActivities = progress.recentActivities || [];

  // Calculate maximum index for the "Your Recent Activities" carousel
  // (Now, since the query returns activity_type, the filter works correctly)
  const maxActivitiesIndex = Math.max(
    practiceActivities.filter(item => item.activity_type === 'practice' && item.yoga_pose_id).length - activitiesDisplayedCount,
    0
  );
  // Calculate maxRecommendedIndex based on the new recommended count
  const maxRecommendedIndex = Math.max(finalRecommended.length - recommendedDisplayedCount, 0);

  return (
    <div className="progress-container">
      <h1 className="progress-heading">Your Progress</h1>

      {/* Yoga Practice History Carousel Section */}
      {dedupedYogaHistory.length > 0 && (
        <section className="segment yoga-history-section" style={{ background: "white" }}>
          <h2 className="segment-heading">Your Recent Detected Poses</h2>
          <div className="carousel-container">
            <button 
              className="carousel-nav left" 
              onClick={() => setHistoryCarouselIndex(prev => Math.max(prev - 1, 0))} 
              disabled={historyCarouselIndex === 0}
            >
              &#60;
            </button>
            <div className="carousel-slide">
              {dedupedYogaHistory.slice(historyCarouselIndex, historyCarouselIndex + historyDisplayedCount).map(record => (
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
                      alt={record.pose_name || "Yoga Pose"}
                      className="pose-image"
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                  <div className="card-content">
                    <h3>{record.pose_name || "Yoga Pose"}</h3>
                    <p className="date">{new Date(record.activity_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="carousel-nav right" 
              onClick={() => setHistoryCarouselIndex(prev => Math.min(prev + 1, maxHistoryIndex))} 
              disabled={historyCarouselIndex >= maxHistoryIndex}
            >
              &#62;
            </button>
          </div>
        </section>
      )}

      {/* Recent Activities Carousel Section */}
      <section className="segment activity-section" style={{ background: "white" }}>
        <h2 className="segment-heading">Your Recent Activities</h2>
        <div className="carousel-container">
          <button 
            className="carousel-nav left" 
            onClick={() => setActivitiesCarouselIndex(prev => Math.max(prev - 1, 0))} 
            disabled={activitiesCarouselIndex === 0}
          >
            &#60;
          </button>
          <div className="carousel-slide">
            {practiceActivities
              .filter(item => item.activity_type === 'practice' && item.yoga_pose_id)
              .slice(activitiesCarouselIndex, activitiesCarouselIndex + activitiesDisplayedCount)
              .map(item => (
                <div
                  key={item.id}
                  className="card"
                  onClick={() => navigate(`/pose/${item.yoga_pose_id}`)}
                >
                  {item.image_url ? (
                    <img 
                      src={getImageUrl(item.image_url)} 
                      alt={item.name} 
                      className="pose-image" 
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                  <div className="card-content">
                    <h3>{item.name || 'Yoga Pose'}</h3>
                    <p className="date">{new Date(item.activity_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            }
          </div>
          <button 
            className="carousel-nav right" 
            onClick={() => setActivitiesCarouselIndex(prev => Math.min(prev + 1, maxActivitiesIndex))} 
            disabled={activitiesCarouselIndex >= maxActivitiesIndex}
          >
            &#62;
          </button>
        </div>
      </section>

      {/* Diet Chart Section */}
      <section className="segment diet-section" style={{ background: "white" }}>
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

      {/* Recommended Yoga Poses Carousel Section */}
      <section className="segment recommendation-section" style={{ background: "white" }}>
        <h2 className="segment-heading">Recommended Yoga Poses For You</h2>
        <div className="carousel-container">
          <button 
            className="carousel-nav left" 
            onClick={() => setRecommendedCarouselIndex(prev => Math.max(prev - 1, 0))} 
            disabled={recommendedCarouselIndex === 0}
          >
            &#60;
          </button>
          <div className="carousel-slide">
            {finalRecommended.slice(recommendedCarouselIndex, recommendedCarouselIndex + recommendedDisplayedCount).map(poseData => (
              <div
                key={poseData.id}
                className="card"
                onClick={() =>
                  poseData.id.toString().startsWith('fallback')
                    ? navigate("/start", { state: { selectedPose: poseData.name } })
                    : navigate(`/pose/${poseData.yoga_pose_id}`)
                }
              >
                { (poseData.image_url || poseImages[poseData.name]) ? (
                  <img 
                    src={poseData.image_url || poseImages[poseData.name]} 
                    alt={poseData.name || 'Yoga Pose'} 
                    className="pose-image"
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <div className="card-content">
                  <h3>{poseData.name || 'Yoga Pose'}</h3>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="carousel-nav right" 
            onClick={() => setRecommendedCarouselIndex(prev => Math.min(prev + 1, maxRecommendedIndex))} 
            disabled={recommendedCarouselIndex >= maxRecommendedIndex}
          >
            &#62;
          </button>
        </div>
      </section>
    </div>
  );
};

export default Progress;
