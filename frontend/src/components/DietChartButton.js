import React from 'react';
import axios from 'axios';

const DietChartButton = () => {
  const token = localStorage.getItem('token');

  const handleGenerateDietChart = async () => {
    const meals = "Breakfast: Oatmeal, Lunch: Salad, Dinner: Grilled Chicken"; // you can get this from user's preferences
    try {
      const response = await axios.post(
        '/api/diet-chart',
        { meals },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error('Error logging diet chart activity:', error);
    }
  };

  return <button onClick={handleGenerateDietChart}>Generate Diet Chart</button>;
};

export default DietChartButton;