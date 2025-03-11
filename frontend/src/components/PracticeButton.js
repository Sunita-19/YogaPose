import React from 'react';
import axios from 'axios';

const PracticeButton = ({ poseId, accuracy }) => {
  const token = localStorage.getItem('token');
  console.log('PracticeButton props:', { poseId, accuracy });

  const handlePractice = async () => {
    try {
      const response = await axios.post(
        '/api/practice',
        { poseId, accuracy },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error('Error logging practice activity:', error);
    }
  };

  return <button onClick={handlePractice}>I did this pose!</button>;
};

export default PracticeButton;