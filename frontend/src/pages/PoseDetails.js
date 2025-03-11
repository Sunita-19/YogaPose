import React from 'react';
import PracticeButton from '../components/PracticeButton';

const PoseDetails = ({ pose }) => {
  return (
    <div>
      <h1>{pose.name}</h1>
      <p>{pose.description}</p>
      {/* Render the PracticeButton, passing the pose id and some accuracy value */}
      <PracticeButton poseId={pose.id} accuracy={0.95} />
    </div>
  );
};

export default PoseDetails;