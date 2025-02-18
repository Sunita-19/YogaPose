import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import './RecommendedPoses.css';

const RecommendedPoses = () => {
  const navigate = useNavigate();
  const { recommendedPoses } = useContext(UserContext);

  const handleAsanaClick = (asanaId) => {
    navigate(`/pose/${asanaId}`);
  };

  return (
    <div className="recommended-poses-container">
      <header className="recommended-header">
        <h1>Recommended Yoga Poses</h1>
      </header>

      <section className="yoga-levels">
        <div className="level-box">
          <h3>Beginner</h3>
          <ul>
            {recommendedPoses.beginner.length > 0 ? (
              recommendedPoses.beginner.map((asana, index) => (
                <li key={index} onClick={() => handleAsanaClick(asana.id)}>
                  {asana.name}
                </li>
              ))
            ) : (
              <li>No poses available</li>
            )}
          </ul>
        </div>

        <div className="level-box">
          <h3>Intermediate</h3>
          <ul>
            {recommendedPoses.intermediate.length > 0 ? (
              recommendedPoses.intermediate.map((asana, index) => (
                <li key={index} onClick={() => handleAsanaClick(asana.id)}>
                  {asana.name}
                </li>
              ))
            ) : (
              <li>No poses available</li>
            )}
          </ul>
        </div>

        <div className="level-box">
          <h3>Advanced</h3>
          <ul>
            {recommendedPoses.advanced.length > 0 ? (
              recommendedPoses.advanced.map((asana, index) => (
                <li key={index} onClick={() => handleAsanaClick(asana.id)}>
                  {asana.name}
                </li>
              ))
            ) : (
              <li>No poses available</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default RecommendedPoses;
