import React from 'react';
import './ApplyNow.css';

const ApplyNow = () => {
  return (
    <div className="apply-now">
      <h1>Apply to Volunteer</h1>
      <p>We are excited to have passionate people join our team! Fill out the form below to apply.</p>
      <button onClick={() => window.open('https://forms.gle/kHhxTfg3bTtXnfXHA', '_blank')}>
        Apply Now
      </button>
    </div>
  );
};

export default ApplyNow;
