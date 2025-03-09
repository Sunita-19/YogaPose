import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import './RecommendedPoses.css';

// Function to convert YouTube URL to embeddable format
const getEmbeddedUrl = (url) => {
  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/");
  } else if (url.includes("youtu.be/")) {
    return url.replace("youtu.be/", "youtube.com/embed/");
  }
  return url;
};

const RecommendedPoses = () => {
  const { recommendedPoses, setRecommendedPoses } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    gender: "female",
    fitnessLevel: "beginner",
    healthConditions: "none",
    activityLevel: "low"
  });
  const [error, setError] = useState("");
  const [lastFormData, setLastFormData] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchPoses = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("User not authenticated. Please log in.");
        return;
      }
  
      const response = await axios.post('http://localhost:5000/api/recommended-poses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.status === 200) {
        if (response.data.length === 0) {
          setError("No exact matches found, but here are some general poses.");
          setRecommendedPoses([]);
          return;
        }
  
        const shuffledPoses = response.data.sort(() => 0.5 - Math.random());
        const selectedPoses = shuffledPoses.slice(0, Math.floor(Math.random() * 2) + 6);
  
        setRecommendedPoses(selectedPoses);
      } else {
        setError("No recommended poses found.");
        setRecommendedPoses([]);
      }
    } catch (error) {
      console.error('Error fetching poses:', error.response ? error.response.data : error);
      setError(error.response?.data?.error || "Failed to fetch poses. Please try again later.");
      setRecommendedPoses([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (JSON.stringify(formData) === JSON.stringify(lastFormData)) {
      setError("Your recommendations are already up to date.");
      return;
    }

    await fetchPoses();
    setLastFormData(formData);
  };

  // Updated click handler to navigate to the PoseDetails page
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
              <option value="other">Transgender</option>
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

          {error && <div className="error-message">{error}</div>}
          <button type="submit">Get Recommendations</button>
        </form>
      </div>

      <section className="yoga-levels">
        <div className="level-box">
          <h3>Recommended Poses</h3>
          <ul>
            {recommendedPoses?.length > 0 ? (
              recommendedPoses.slice(0, 7).map((asana) => (
                <li 
                  key={asana.id}
                  className="pose-name"
                  onClick={() => handleAsanaClick(asana.id)}
                >
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
