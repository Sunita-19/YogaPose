import React, { useState, useEffect } from "react";
import "./Diet.css";

const Diet = () => {
  const [userData, setUserData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    activityLevel: "",
    dietaryPreference: "",
    healthConditions: "",
  });

  const [dietPlan, setDietPlan] = useState(null);
  const [error, setError] = useState(null);
  const [previousInput, setPreviousInput] = useState(null);
  const [cache, setCache] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const validateInputs = () => {
    const { age, weight, height } = userData;
    if (age <= 0 || age > 120) return "Please enter a valid age (1-120).";
    if (weight <= 0 || weight > 300) return "Please enter a valid weight (1-300 kg).";
    if (height <= 50 || height > 250) return "Please enter a valid height (50-250 cm).";
    return null;
  };

  const fetchDietPlan = async () => {
    try {
      const apiKey = "3bf8f3f8c47b417aa03d776ebc78a657"; // Replace with your actual API key
      const apiUrl = `https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=day`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the diet plan. Please try again.");
      }

      const data = await response.json();

      const mealPlan = {
        breakfast: data.meals[0]?.title || "Find healthy recipes online or consult a nutritionist.",
        lunch: data.meals[1]?.title || "Check meal plan online.",
        dinner: data.meals[2]?.title || "Explore dinner ideas tailored for your needs.",
        hydration: "Drink at least 8-10 glasses of water daily.",
        tips: "Include fresh fruits and vegetables in every meal.",
      };

      return mealPlan;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentInput = JSON.stringify(userData);

    if (cache[currentInput]) {
      // If input is in cache, use the stored diet plan
      setDietPlan(cache[currentInput]);
    } else {
      const newDietPlan = await fetchDietPlan();
      if (newDietPlan) {
        setDietPlan(newDietPlan);
        setCache({ ...cache, [currentInput]: newDietPlan }); // Store result in cache
      }
    }

    setPreviousInput(currentInput);
  };

  return (
    <div className="diet-container">
      <h1>Personalized Diet Chart</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <label>Age:
          <input type="number" name="age" value={userData.age} onChange={handleInputChange} min="1" max="120" required />
        </label>
        
        <label>Gender:
          <select name="gender" value={userData.gender} onChange={handleInputChange} required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="transgender">Transgender</option>
          </select>
        </label>
        
        <label>Weight (kg):
          <input type="number" name="weight" value={userData.weight} onChange={handleInputChange} min="1" max="300" required />
        </label>

        <label>Height (cm):
          <input type="number" name="height" value={userData.height} onChange={handleInputChange} min="50" max="250" required />
        </label>
        
        <label>Activity Level:
          <select name="activityLevel" value={userData.activityLevel} onChange={handleInputChange} required>
            <option value="">Select</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>Dietary Preference:
          <select name="dietaryPreference" value={userData.dietaryPreference} onChange={handleInputChange} required>
            <option value="">Select</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </label>

        <label>Health Conditions:
          <input type="text" name="healthConditions" value={userData.healthConditions} onChange={handleInputChange} placeholder="e.g., Diabetes, Hypertension" />
        </label>

        <button type="submit">Generate Diet Chart</button>
      </form>

      {error && <p className="error">{error}</p>}

      {dietPlan && (
        <div className="diet-plan">
          <h2>Your Diet Plan</h2>
          <p>Here is a diet plan based on your input values.</p>
          <div className="breakfast">
            <h3>Breakfast:</h3>
            <p>{dietPlan.breakfast}</p>
          </div>
          <div className="lunch">
            <h3>Lunch:</h3>
            <p>{dietPlan.lunch}</p>
          </div>
          <div className="dinner">
            <h3>Dinner:</h3>
            <p>{dietPlan.dinner}</p>
          </div>
          <p className="tip">Hydration Tip: {dietPlan.hydration}</p>
          <p className="tip">General Tip: {dietPlan.tips}</p>
        </div>
      )}
    </div>
  );
};

export default Diet;
