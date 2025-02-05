import React from 'react';
import './MeetTheTeam.css'; // Make sure this is properly linked

const MeetTheTeam = () => {
  return (
    <div className="team-container">
      <h1>Meet the Team</h1>
      
      <div className="team-member">
        <img src="path_to_sunita_image.jpg" alt="Sunita Yadav" className="team-photo" />
        <div className="team-info">
          <h2>Sunita Yadav</h2>
          <p>Sunita is the lead developer of the project and has a passion for yoga and technology...</p>
        </div>
      </div>

      <div className="team-member">
        <img src="path_to_mamta_image.jpg" alt="Mamta Yadav" className="team-photo" />
        <div className="team-info">
          <h2>Mamta Yadav</h2>
          <p>Mamta is a creative designer responsible for the UI/UX design of the Yoga Pose Detection system...</p>
        </div>
      </div>
    </div>
  );
};

export default MeetTheTeam;
