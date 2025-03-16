import React from 'react';
import axios from 'axios';

const DietChartButton = () => {
  const token = localStorage.getItem('token');

  const handleGenerateDietChart = async () => {
    try {
      // Assume you have already fetched the meals from an external API
      const meals = "Breakfast: Oatmeal, Lunch: Salad, Dinner: Grilled Chicken";
      const response = await axios.post(
        "http://localhost:5000/api/diet-chart",
        { meals },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data.message);
      // Optionally update UI state to reflect new diet chart entry
    } catch (error) {
      console.error('Error logging diet chart activity:', error.response?.data || error);
    }
  };

  return <button onClick={handleGenerateDietChart}>Generate Diet Chart</button>;
};

export default DietChartButton;