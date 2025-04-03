import React from 'react';
import './MeetTheTeam.css';
import TeamSunita from '../../utils/images/TeamSunita.jpeg';
import TeamMamta from '../../utils/images/TeamMamta.jpeg';

const MeetTheTeam = () => {
  return (
    <div className="team-container">
      <h1>Meet the Team</h1>
      
      <div className="team-member">
        <img 
          src={TeamSunita} 
          alt="Sunita Yadav" 
          className="team-photo wrapped" 
        />
        <div className="team-info">
          <h2>Sunita Yadav</h2>
          <ul className="team-info-list">
          <li>Crafts intuitive and visually appealing UI/UX designs.</li>
            <li>Develops responsive front-end code ensuring cross-device compatibility.</li>
            <li>Maintains consistency in visual design and branding.</li>
            <li>Creates graphic assets and optimizes them for the web.</li>
            <li>Ensures seamless communication between design and development teams.</li>
            <li>Incorporates feedback to continually enhance the application design.</li>
            <li>Stays updated with modern design trends for continual innovation.</li>

            
          </ul>
        </div>
      </div>

      <div className="team-member">
        <img 
          src={TeamMamta} 
          alt="Mamta Yadav" 
          className="team-photo" 
        />
        <div className="team-info">
          <h2>Mamta Yadav</h2>
          <ul className="team-info-list">
          <li>Develops and maintains robust backend server logic.</li>
            <li>Designs the overall system architecture for efficient data handling.</li>
            <li>Integrates advanced yoga pose detection algorithms seamlessly.</li>
            <li>Optimizes database queries for faster performance.</li>
            <li>Ensures system security and stability at all times.</li>
            <li>Coordinates API integration with the frontend team.</li>
            <li>Monitors health, performance, and scalability of the system.</li>
            <li>Troubleshoots server issues and implements effective fixes.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MeetTheTeam;
