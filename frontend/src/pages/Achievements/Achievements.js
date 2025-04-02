import React, { useEffect, useState, lazy, Suspense } from 'react';
import axios from 'axios';
import './Achievements.css';

const Confetti = lazy(() => import('react-confetti'));

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const token = localStorage.getItem('token');
  const currentUsername = localStorage.getItem('username') || ""; 

  // Use a case-insensitive search for the current user's leaderboard entry.
  const currentUserBoard = leaderboard.find(user => {
    // Make sure user.username exists before calling trim.
    return (user.username || "").trim().toLowerCase() === currentUsername.trim().toLowerCase();
  });
  const userXp = currentUserBoard ? currentUserBoard.xp : 0;

  const shareAchievement = (achievement) => {
    const shareText = `I just reached ${achievement.title} on Fun Yoga! Join me and unlock your own rewards!`;
    if (navigator.share) {
      navigator.share({
        title: 'My Yoga Achievement!',
        text: shareText,
        url: window.location.href
      }).then(() => console.log('Thanks for sharing!'))
        .catch(console.error);
    } else {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, '_blank');
    }
  };

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/achievements', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setAchievements(response.data.achievements || []);
        if (response.data.newAchievement) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      })
      .catch(error => console.error('Error fetching achievements:', error));

      axios.get('http://localhost:5000/api/leaderboard', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
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
            leaderboard.map((user, index) => {
              const isCurrentUser = user.username === currentUsername;
              return (
                <li
                  key={index}
                  className={`${index === 0 ? "top-achiever" : ""} ${isCurrentUser ? "current-user" : ""}`}
                >
                  <span className="rank">{index + 1}.</span>
                  <span className="username">{user.username}</span>
                  <span className="xp">{user.xp} XP</span>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* Achievements Section */}
      <div className="achievements-grid">
        {achievements.length > 0 &&
          achievements.map((achievement, index) => (
            <div
              key={index}
              className={`achievement-card ${achievement.username === currentUsername ? "current-user-card" : ""}`}
            >
              <img
                src={achievement.badgeUrl}
                alt={achievement.title}
                className="achievement-badge"
              />
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
              <div className="achievement-progress">
                <div className="progress-bar" style={{ width: `${achievement.progress}%` }}></div>
              </div>
              <button className="share-btn" onClick={() => shareAchievement(achievement)}>
                Share
              </button>
              {achievement.username === currentUsername && (
                <div className="user-level">Your Level: {achievement.level || "N/A"}</div>
              )}
            </div>
          ))
        }
        {userXp > 0 && (
          <div className="achievement-card current-user-card">
            <h3>Keep it up, {currentUsername}!</h3>
            <p>
              You have earned {userXp} XP so far. More achievements will unlock as you continue practicing.
            </p>
          </div>
        )}
        {/* {achievements.length === 0 && userXp === 0 && (
          <p className="no-achievements">
            You haven't earned any achievements yet. Start practicing to unlock rewards!
          </p>
        )} */}
      </div>
    </div>
  );
};

export default Achievements;
