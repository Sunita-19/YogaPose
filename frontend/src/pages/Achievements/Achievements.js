import React, { useEffect, useState, lazy, Suspense } from 'react';
import axios from 'axios';
import './Achievements.css';

// Use React.lazy for dynamic import
const Confetti = lazy(() => import('react-confetti'));

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/achievements', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setAchievements(response.data.achievements);
        if (response.data.newAchievement) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      })
      .catch(error => console.error('Error fetching achievements:', error));
    }
  }, [token]);

  return (
    <div className="achievements-container">
      {/* Use Suspense to avoid crashing when loading Confetti */}
      <Suspense fallback={<div>Loading...</div>}>
        {showConfetti && <Confetti numberOfPieces={300} recycle={false} gravity={0.2} />}
      </Suspense>

      <h1>Your Achievements</h1>
      <p>Practice yoga, earn badges, level up and unlock exclusive rewards!</p>

      {/* Leaderboard Section */}
      <div className="leaderboard">
        <h2>🏆 Top Achievers</h2>
        <ul>
          <li>1. Alex - 500 XP</li>
          <li>2. Priya - 420 XP</li>
          <li>3. Sunita - 390 XP</li>
        </ul>
      </div>

      <div className="achievements-grid">
        {achievements.length === 0 ? (
          <p>You haven't earned any achievements yet. Start practicing to unlock rewards!</p>
        ) : (
          achievements.map((achievement, index) => (
            <div key={index} className="achievement-card">
              <img src={achievement.badgeUrl} alt={achievement.title} className="achievement-badge sparkle-effect" />
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
