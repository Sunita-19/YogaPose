import React from 'react';
import './ApplyNow.css';

const ApplyNow = () => {
  return (
    <div className="apply-now-container">
      <h1 className="apply-now-heading">Apply to Volunteer</h1>
      <div className="apply-now-box">
        <div className="apply-now-content">
          <p>We are excited to have passionate people join our team! Fill out the form below to apply.</p>
          <button onClick={() => window.open('https://forms.gle/kHhxTfg3bTtXnfXHA', '_blank')}>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyNow;
