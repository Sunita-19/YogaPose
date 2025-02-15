/* YogaPosesVideos.js */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './YogaPosesVideos.css';

const YogaPosesVideos = () => {
  const navigate = useNavigate();

  // Step 1: Set up state for user input
  const [activityLevel, setActivityLevel] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [healthCondition, setHealthCondition] = useState('');

  // Step 2: Initialize recommended poses object
  const [recommendedPoses, setRecommendedPoses] = useState({
    beginner: [],
    intermediate: [],
    advanced: []
  });

  // Step 3: Validate inputs
  const isFormValid = () => {
    return activityLevel && age && weight && healthCondition;
  };

  // Step 4: Logic to filter recommended yoga poses based on user inputs
  const recommendPoses = () => {
    const recommendedPoses = {
      beginner: [
        "Tadasana (Mountain Pose)",
        "Adho Mukha Svanasana (Downward Dog)",
        "Virabhadrasana I (Warrior I)",
        "Vrikshasana (Tree Pose)",
        "Balasana (Child's Pose)",
        "Paschimottanasana (Seated Forward Bend)",
        "Setu Bandhasana (Bridge Pose)",
        "Sukhasana (Easy Pose)",
        "Baddha Konasana (Bound Angle Pose)",
        "Utkatasana (Chair Pose)"
      ],
      intermediate: [
        "Trikonasana (Triangle Pose)",
        "Ardha Chandrasana (Half Moon Pose)",
        "Bakasana (Crow Pose)",
        "Navasana (Boat Pose)",
        "Parivrtta Trikonasana (Revolved Triangle Pose)",
        "Uttanasana (Standing Forward Bend)",
        "Virabhadrasana II (Warrior II)",
        "Anjaneyasana (Low Lunge)",
        "Utthita Parsvakonasana (Extended Side Angle Pose)",
        "Bhekasana (Frog Pose)"
      ],
      advanced: [
        "Vrschikasana (Scorpion Pose)",
        "Sirsasana (Headstand)",
        "Adho Mukha Vrksasana (Handstand)",
        "Pincha Mayurasana (Forearm Stand)",
        "Eka Pada Galavasana (Flying Pigeon Pose)",
        "Kundalini Pose",
        "Astavakrasana (Eight-Angle Pose)",
        "Hanumanasana (Monkey Pose)",
        "Chaturanga Dandasana (Four-Limbed Staff Pose)",
        "Kundalini Pose"
      ]
    };

    // Adjust the recommendations based on user input
    if (age >= 60) {
      // Older users - gentle poses
      return {
        beginner: ["Balasana (Child's Pose)", "Savasana", "Supta Baddha Konasana", "Setu Bandhasana (Bridge Pose)", "Sukhasana (Easy Pose)"]
      };
    } else if (activityLevel === "sedentary") {
      // Sedentary users - start with basics
      return recommendedPoses;
    } else if (weight >= 200) {
      // Users with higher weight - more supported poses
      return {
        beginner: ["Setu Bandhasana (Bridge Pose)", "Tadasana", "Vrikshasana (Tree Pose)", "Balasana (Child's Pose)", "Utkatasana (Chair Pose)"]
      };
    } else if (healthCondition === "back pain") {
      // Users with back issues
      return {
        beginner: ["Bhujangasana (Cobra Pose)", "Setu Bandhasana (Bridge Pose)", "Balasana (Child's Pose)", "Tadasana", "Sukhasana (Easy Pose)"]
      };
    }
    return recommendedPoses;
  };

  // Step 5: Update recommended poses
  const updatePoses = () => {
    const updatedPoses = recommendPoses();
    setRecommendedPoses(updatedPoses);
  };

  // Step 6: Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      updatePoses();
    }
  };

  const handleAsanaClick = (asanaId) => {
    navigate(`/pose/${asanaId}`);
  };

  return (
    <div className="yoga-poses-container">
      <header className="yoga-header">
        <h1>Yoga Asanas</h1>
      </header>

      {/* User Input Form */}
      <section className="yoga-input-form">
        <h3>Enter Your Details for Yoga Pose Recommendations</h3>
        <form onSubmit={handleFormSubmit}>
          <label>
            Age:
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
            />
          </label>
          <label>
            Weight:
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
            />
          </label>
          <label>
            Activity Level:
            <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
              <option value="">Select Activity Level</option>
              <option value="sedentary">Sedentary</option>
              <option value="active">Active</option>
              <option value="athlete">Athlete</option>
            </select>
          </label>
          <label>
            Health Condition:
            <input
              type="text"
              placeholder="Any health conditions (e.g., back pain)"
              value={healthCondition}
              onChange={(e) => setHealthCondition(e.target.value)}
            />
          </label>
          <button type="submit" disabled={!isFormValid()}>Get Recommendations</button>
        </form>
      </section>

      {/* Error Message */}
      {!isFormValid() && <p className="error-message">Please fill all fields to get recommendations.</p>}

      {/* Yoga Levels Section */}
      {isFormValid() && (
        <section className="yoga-levels">
          <div className="level-box">
            <h3>Beginner</h3>
            <ul>
              {recommendedPoses.beginner && recommendedPoses.beginner.map((asana, index) => (
                <li key={index} onClick={() => handleAsanaClick(index + 1)}>
                  {asana}
                </li>
              ))}
            </ul>
          </div>

          <div className="level-box">
            <h3>Intermediate</h3>
            <ul>
              {recommendedPoses.intermediate && recommendedPoses.intermediate.map((asana, index) => (
                <li key={index} onClick={() => handleAsanaClick(index + 11)}>
                  {asana}
                </li>
              ))}
            </ul>
          </div>

          <div className="level-box">
            <h3>Advanced</h3>
            <ul>
              {recommendedPoses.advanced && recommendedPoses.advanced.map((asana, index) => (
                <li key={index} onClick={() => handleAsanaClick(index + 21)}>
                  {asana}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Video Section */}
      <section className="yoga-videos">
        <h2>Interactive Yoga Videos</h2>
        <div className="videos">
          <div className="video-box">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/7GyC_UVFGU0"
              title="Beginner Yoga"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <h4>Beginner Yoga</h4>
          </div>
          <div className="video-box">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/_LvGTQ3Aq-g"
              title="Intermediate Yoga"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <h4>Intermediate Yoga</h4>
          </div>
          <div className="video-box">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/CiaD3jP0YhA"
              title="Advanced Yoga"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <h4>Advanced Yoga</h4>
          </div>
        </div>
      </section>
    </div>
  );
};

export default YogaPosesVideos;
