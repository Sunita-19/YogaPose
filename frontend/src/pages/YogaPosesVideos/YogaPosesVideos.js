import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './YogaPosesVideos.css';

const YogaPosesVideos = () => {
  const navigate = useNavigate();

  // Navigate to the specific yoga pose tutorial page
  const handleAsanaClick = (asanaId) => {
    navigate(`/pose/${asanaId}`);
  };

  return (
    <div className="yoga-poses-container">
      <header className="yoga-header">
        <h1>Yoga Asanas</h1>
      </header>

      {/* Yoga Levels Section */}
      <section className="yoga-levels">
        <div className="level-box">
          <h3>Beginner</h3>
          <ul>
            {/* Example list of beginner poses */}
            {["Tadasana (Mountain Pose)", "Adho Mukha Svanasana (Downward Dog)"].map((asana, index) => (
              <li key={index} onClick={() => handleAsanaClick(index + 1)}>
                {asana}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default YogaPosesVideos;
