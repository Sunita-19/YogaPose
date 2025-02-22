import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../context/UserContext';
import './RecommendedPoses.css';

const RecommendedPoses = () => {
  const navigate = useNavigate();
  const { recommendedPoses, setRecommendedPoses: updateRecommendedPoses } = useContext(UserContext);
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    gender: "female",
    fitnessLevel: "beginner",
    healthConditions: "none",
    activityLevel: "low",
    specificGoals: "flexibility",
    timeCommitment: "short",
    preferredStyle: "hatha"
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const { age, weight } = formData;
    if (age < 1 || age > 120) {
      return 'Age must be between 1 and 120';
    }
    if (weight < 10 || weight > 350) {
      return 'Weight must be between 10kg and 350kg';
    }
    return '';
  };

  const fetchPoses = async () => {
    try {
      const response = await axios.post('/api/recommended-poses', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Fetched poses:', response.data);
      updateRecommendedPoses(response.data);
    } catch (error) {
      console.error('Error fetching poses:', error.response ? error.response.data : error);
      setError('Failed to fetch recommendations. Try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    await fetchPoses();
  };

  const handleAsanaClick = (asanaId) => {
    navigate(`/pose/${asanaId}`);
  };

  return (
    <div className="recommended-poses-container">
      <header className="recommended-header">
        <h1>Recommended Yoga Poses</h1>
      </header>

      <div className="user-input-form">
        <h2>Personalized Yoga Recommendation</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
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
          </div>
          
          <div className="form-group">
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
          </div>

          <div className="form-group">
            <label>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fitness Level:</label>
            <select name="fitnessLevel" value={formData.fitnessLevel} onChange={handleChange}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label>Health Conditions:</label>
            <select name="healthConditions" value={formData.healthConditions} onChange={handleChange}>
              <option value="none">None</option>
              <option value="back pain">Back Pain</option>
              <option value="high blood pressure">High Blood Pressure</option>
              <option value="joint pain">Joint Pain</option>
            </select>
          </div>

          <div className="form-group">
            <label>Activity Level:</label>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Specific Goals:</label>
            <select name="specificGoals" value={formData.specificGoals} onChange={handleChange}>
              <option value="flexibility">Flexibility</option>
              <option value="strength">Strength</option>
              <option value="stress relief">Stress Relief</option>
              <option value="balance">Balance</option>
            </select>
          </div>

          <div className="form-group">
            <label>Time Commitment:</label>
            <select name="timeCommitment" value={formData.timeCommitment} onChange={handleChange}>
              <option value="short">Short (5-15 min)</option>
              <option value="medium">Medium (15-30 min)</option>
              <option value="long">Long (30+ min)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Preferred Yoga Style:</label>
            <select name="preferredStyle" value={formData.preferredStyle} onChange={handleChange}>
              <option value="hatha">Hatha</option>
              <option value="vinyasa">Vinyasa</option>
              <option value="ashtanga">Ashtanga</option>
              <option value="yin">Yin</option>
              <option value="restorative">Restorative</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}
          <button type="submit">Get Recommendations</button>
        </form>
      </div>

      <section className="yoga-levels">
        <div className="level-box">
          <h3>Beginner</h3>
          <ul>
            {recommendedPoses?.beginner?.length > 0 ? (
              recommendedPoses.beginner.map((asana) => (
                <li key={asana.id} onClick={() => handleAsanaClick(asana.id)}>
                  {asana.name}
                </li>
              ))
            ) : (
              <li>No poses available</li>
            )}
          </ul>
        </div>

        <div className="level-box">
          <h3>Intermediate</h3>
          <ul>
            {recommendedPoses?.intermediate?.length > 0 ? (
              recommendedPoses.intermediate.map((asana) => (
                <li key={asana.id} onClick={() => handleAsanaClick(asana.id)}>
                  {asana.name}
                </li>
              ))
            ) : (
              <li>No poses available</li>
            )}
          </ul>
        </div>

        <div className="level-box">
          <h3>Advanced</h3>
          <ul>
            {recommendedPoses?.advanced?.length > 0 ? (
              recommendedPoses.advanced.map((asana) => (
                <li key={asana.id} onClick={() => handleAsanaClick(asana.id)}>
                  {asana.name}
                </li>
              ))
            ) : (
              <li>No poses available</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default RecommendedPoses;
