import React from 'react';
import './ApplyNow.css';

const ApplyNow = () => {
  return (
    <div className="apply-now-container">
      <h1 className="apply-now-heading">Apply to Volunteer</h1>
      <div className="apply-now-box">
        <div className="apply-now-content">
          Thank you for your interest in contributing to our Yoga Pose Detection project! As a volunteer, you will have the opportunity to help us enhance our AI-powered system that helps people learn and perfect yoga poses.
          <br></br><br></br>
          We are excited to have passionate people join our team! Fill out the form below to apply.
          <br></br><br></br>
          <button onClick={() => window.open('https://forms.gle/kHhxTfg3bTtXnfXHA', '_blank')}>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyNow;
