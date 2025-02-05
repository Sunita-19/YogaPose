import React from 'react';
import './VolunteerInfo.css';

const VolunteerInfo = () => {
  return (
    <div className="volunteer-info">
      <h1>Volunteer Information</h1>
      <p>
        Thank you for your interest in contributing to our Yoga Pose Detection project! As a volunteer, you will have the opportunity to help us enhance our AI-powered system that helps people learn and perfect yoga poses.
      </p>
      <h2>What You Will Do:</h2>
      <ul>
        <li>Assist in testing the yoga pose detection accuracy.</li>
        <li>Help improve the machine learning algorithms for better pose recognition.</li>
        <li>Contribute to the development of new features and tools for yoga enthusiasts.</li>
      </ul>
      <h2>Requirements:</h2>
      <ul>
        <li>Basic understanding of yoga poses and practice.</li>
        <li>Interest in machine learning and AI technologies.</li>
        <li>Availability to contribute a few hours per week.</li>
      </ul>
      <p>
        Volunteers will be acknowledged for their contributions and have the chance to work with a dedicated team of developers and yoga practitioners.
      </p>
    </div>
  );
};

export default VolunteerInfo;
