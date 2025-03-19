import React, { useEffect, useState, lazy, Suspense } from 'react';
import axios from 'axios';
import './Achievements.css';

const Confetti = lazy(() => import('react-confetti'));

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
        // Fetch Achievements
        axios.get('http://localhost:5000/api/achievements', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            console.log("Achievements Data:", response.data.achievements); // Debugging
            setAchievements(response.data.achievements || []); 
            if (response.data.newAchievement) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
            }
        })
        .catch(error => console.error('Error fetching achievements:', error));

        // Fetch Leaderboard
        axios.get('http://localhost:5000/api/leaderboard', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            console.log("Leaderboard Data:", response.data.leaderboard); // Debugging
            setLeaderboard(response.data.leaderboard || []);
        })
        .catch(error => console.error('Error fetching leaderboard:', error));
    }
  }, [token]);

  return (
    <div className="achievements-container">
      <Suspense fallback={<div>Loading...</div>}>
        {showConfetti && <Confetti numberOfPieces={300} recycle={false} gravity={0.2} />}
      </Suspense>

      <h1>Your Achievements</h1>
      <p>Practice yoga, earn badges, level up, and unlock exclusive rewards!</p>

      {/* Leaderboard Section */}
      <div className="leaderboard">
        <h2>🏆 Top Achievers</h2>
        <ul>
          {leaderboard.length === 0 ? (
            <p>No leaderboard data available</p>
          ) : (
            leaderboard.map((user, index) => (
              <li key={index} className="leaderboard-item">
                <span className="rank">{index + 1}.</span>
                <span className="username">{user.username}</span>
                <span className="xp">{user.xp} XP</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Achievements Section */}
      <div className="achievements-grid">
        {achievements.length === 0 ? (
          <p className="no-achievements">You haven't earned any achievements yet. Start practicing to unlock rewards!</p>
        ) : (
          <>
            {achievements.some(achievement => achievement.xp > 0) ? (
              <p className="motivational-message">🎉 Keep going! You're doing great! More rewards are on the way! 🚀</p>
            ) : null}

            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-card">
                <img src={achievement.badgeUrl} alt={achievement.title} className="achievement-badge sparkle-effect" />
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                <div className="achievement-progress">
                  <div className="progress-bar" style={{ width: `${achievement.progress}%` }}></div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Achievements;
