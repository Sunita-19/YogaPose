import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PoseList = ({ poses }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handlePoseClick = async (poseId) => {
    try {
      const response = await axios.get(`/api/yoga_poses/${poseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optionally navigate to a details page:
      navigate(`/poses/${poseId}`);
    } catch (error) {
      console.error('Error fetching pose details:', error);
    }
  };

  return (
    <ul>
      {poses.map((pose) => (
        <li key={pose.id} onClick={() => handlePoseClick(pose.id)}>
          {pose.name}
        </li>
      ))}
    </ul>
  );
};

export default PoseList;