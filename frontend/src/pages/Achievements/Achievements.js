import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Achievements.css';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/achievements', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setAchievements(response.data.achievements);
      })
      .catch(error => {
        console.error('Error fetching achievements:', error);
      });
    }
  }, [token]);

  return (
    <div className="achievements-container">
      <h1>Your Achievements</h1>
      <p>Practice yoga, earn badges, level up and unlock exclusive rewards!</p>
      <div className="achievements-grid">
        {achievements.length === 0 ? (
          <p>You haven't earned any achievements yet. Get practice and come back to see your progress!</p>
        ) : (
          achievements.map((achievement, index) => (
            <div key={index} className="achievement-card">
              <img src={achievement.badgeUrl} alt={achievement.title} className="achievement-badge" />
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
              <div className="achievement-progress">
                <div className="progress-bar" style={{ width: `${achievement.progress}%` }}></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Achievements;