// UserInput.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/UserContext";
import "./UserInput.css";

const UserInput = ({ setUserData }) => {
  const navigate = useNavigate();
  const { updateUserInput, setRecommendedPoses: updateRecommendedPoses } = useContext(UserContext);
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "female",
    fitnessLevel: "beginner",
    healthConditions: "none",
    activityLevel: "low",
    specificGoals: "flexibility",
    timeCommitment: "short",
    preferredStyle: "hatha",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const { age, height, weight } = formData;
    if (age < 1 || age > 120) {
      return 'Age must be between 1 and 120';
    }
    if (height < 54.6 || height > 251) {
      return 'Height must be between 54.6cm and 251cm';
    }
    if (weight < 10 || weight > 350) {
      return 'Weight must be between 10kg and 350kg';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    try {
      const response = await axios.post('/api/recommended-poses', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      updateUserInput(formData); // Update user input in context
      updateRecommendedPoses(response.data); // Store recommended poses in context
      navigate("/recommended-poses");
    } catch (error) {
      console.error('Error fetching recommended poses:', error);
      setError('Failed to fetch recommended poses');
    }
  };

  return (
    <div className="user-input-container">
      <h2>Personalized Yoga Recommendation</h2>
      <form onSubmit={handleSubmit}>
        <label>Age:</label>
        <input 
          type="number" 
          name="age" 
          value={formData.age} 
          onChange={handleChange} 
          min="1"
          max="120"
          required 
        />
        
        <label>Height (cm):</label>
        <input 
          type="number" 
          name="height" 
          value={formData.height} 
          onChange={handleChange} 
          min="54.6"
          max="251"
          step="0.1"
          required 
        />

        <label>Weight (kg):</label>
        <input 
          type="number" 
          name="weight" 
          value={formData.weight} 
          onChange={handleChange} 
          min="10"
          max="350"
          required 
        />

        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>

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

        <label>Specific Goals:</label>
        <select name="specificGoals" value={formData.specificGoals} onChange={handleChange}>
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

        <label>Preferred Yoga Style:</label>
        <select name="preferredStyle" value={formData.preferredStyle} onChange={handleChange}>
          <option value="hatha">Hatha</option>
          <option value="vinyasa">Vinyasa</option>
          <option value="ashtanga">Ashtanga</option>
          <option value="yin">Yin</option>
          <option value="restorative">Restorative</option>
        </select>

        {error && <div className="error-message">{error}</div>}
        <button type="submit">Get Recommendations</button>
      </form>
    </div>
  );
};

export default UserInput;
