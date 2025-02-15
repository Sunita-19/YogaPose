// UserInput.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserInput.css";

const UserInput = ({ setUserData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    fitnessLevel: "beginner",
    healthConditions: "none",
    activityLevel: "low",
    goals: "flexibility",
    timeCommitment: "short",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData(formData);
    navigate("/recommended-poses");
  };

  return (
    <div className="user-input-container">
      <h2>Personalized Yoga Recommendation</h2>
      <form onSubmit={handleSubmit}>
        <label>Age:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} required />

        <label>Fitness Level:</label>
        <select name="fitnessLevel" value={formData.fitnessLevel} onChange={handleChange}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <label>Health Conditions:</label>
        <select name="healthConditions" value={formData.healthConditions} onChange={handleChange}>
          <option value="none">None</option>
          <option value="back pain">Back Pain</option>
          <option value="high blood pressure">High Blood Pressure</option>
          <option value="joint pain">Joint Pain</option>
        </select>

        <label>Activity Level:</label>
        <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>

        <label>Yoga Goals:</label>
        <select name="goals" value={formData.goals} onChange={handleChange}>
          <option value="flexibility">Flexibility</option>
          <option value="strength">Strength</option>
          <option value="stress relief">Stress Relief</option>
          <option value="balance">Balance</option>
        </select>

        <label>Time Commitment:</label>
        <select name="timeCommitment" value={formData.timeCommitment} onChange={handleChange}>
          <option value="short">Short (5-15 min)</option>
          <option value="medium">Medium (15-30 min)</option>
          <option value="long">Long (30+ min)</option>
        </select>

        <button type="submit">Get Recommendations</button>
      </form>
    </div>
  );
};

export default UserInput;