import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import UserContext from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
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
  const [selectedPose, setSelectedPose] = useState(null);
  const [poseDetails, setPoseDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

  const handleAsanaClick = async (asanaId) => {
    if (selectedPose === asanaId) {
      setSelectedPose(null);
      setPoseDetails(null);
      return;
    }

    setLoadingDetails(true);
    setSelectedPose(asanaId);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debug token
      if (!token) {
        throw new Error('User not authenticated');
      }

      const url = `http://localhost:5000/api/yoga_poses/${asanaId}`;
      console.log('Fetching pose details from:', url); // Debug URL

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('API Response:', response); // Debug response

      if (!response.data) {
        throw new Error('No pose data received');
      }

      setPoseDetails(response.data);
    } catch (error) {
      console.error('Error fetching pose details:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      setError(`Failed to load pose details: ${error.message}`);
      setPoseDetails(null);
    } finally {
      setLoadingDetails(false);
    }
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
                <React.Fragment key={asana.id}>
                  <li 
                    className={`pose-name ${selectedPose === asana.id ? 'active' : ''}`}
                    onClick={() => handleAsanaClick(asana.id)}
                  >
                    {asana.name}
                  </li>
                  {selectedPose === asana.id && (
                    <div className="pose-details">
                      {loadingDetails ? (
                        <div>Loading pose details...</div>
                      ) : poseDetails ? (
                        <div>
                          <h4>{poseDetails.name}</h4>
                          <img 
                            src={poseDetails.image_url} 
                            alt={poseDetails.name} 
                            className="pose-image"
                          />
                          <ul className="pose-steps">
                            {poseDetails.description.split('\n').map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                          {poseDetails.video_url && (
                            <iframe
                              className="pose-video"
                              width="100%"
                              height="315"
                              src={getEmbeddedUrl(poseDetails.video_url)}
                              title={poseDetails.name}
                              frameBorder="0"
                              allowFullScreen
                            ></iframe>
                          )}
                        </div>
                      ) : (
                        <div>Failed to load pose details</div>
                      )}
                    </div>
                  )}
                </React.Fragment>
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
