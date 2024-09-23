import React from 'react';
import './DietPlan.css';

const DietPlan = () => {
  const dietData = {
    breakfast: 'Oatmeal with fruits',
    lunch: 'Grilled chicken with quinoa',
    dinner: 'Stir-fried vegetables with tofu',
    snacks: 'Nuts and yogurt',
  };

  return (
    <div className="diet-plan-container">
      <h1 className="diet-plan-header">Diet Plan</h1>
      <table className="diet-table">
        <thead>
          <tr>
            <th>Meal</th>
            <th>Suggestion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Breakfast</td>
            <td>{dietData.breakfast}</td>
          </tr>
          <tr>
            <td>Lunch</td>
            <td>{dietData.lunch}</td>
          </tr>
          <tr>
            <td>Dinner</td>
            <td>{dietData.dinner}</td>
          </tr>
          <tr>
            <td>Snacks</td>
            <td>{dietData.snacks}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DietPlan;
