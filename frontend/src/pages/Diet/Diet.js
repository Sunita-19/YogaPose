import React, { useState } from "react";
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
  const [cache, setCache] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const validateInputs = () => {
    const { age, weight, height } = userData;
    const ageInt = parseInt(age, 10);
    const weightInt = parseFloat(weight);
    const heightInt = parseFloat(height);

    if (ageInt <= 0 || ageInt > 120) return "Please enter a valid age (1-120).";

    if (ageInt <= 1) {
      if (weightInt < 2 || weightInt > 14) return "For a 1-year-old, weight should be between 2-14 kg.";
      if (heightInt < 45 || heightInt > 80) return "For a 1-year-old, height should be between 45-80 cm.";
    } else if (ageInt <= 10) {
      if (weightInt < 7 || weightInt > 40) return "For ages 1-10, weight should be between 7-40 kg.";
      if (heightInt < 70 || heightInt > 150) return "For ages 1-10, height should be between 70-150 cm.";
    } else if (ageInt <= 18) {
      if (weightInt < 30 || weightInt > 120) return "For ages 11-18, weight should be between 30-120 kg.";
      if (heightInt < 130 || heightInt > 200) return "For ages 11-18, height should be between 130-200 cm.";
    } else {
      if (weightInt < 40 || weightInt > 300) return "For adults, weight should be between 40-300 kg.";
      if (heightInt < 140 || heightInt > 250) return "For adults, height should be between 140-250 cm.";
    }

    return null; // No errors
  };

  const fetchDietPlan = async () => {
    try {
      const apiKey = "3bf8f3f8c47b417aa03d776ebc78a657"; // Replace with actual API key
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

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null); // Clear previous errors

    const currentInput = JSON.stringify(userData);
    let newDietPlan;
    if (cache[currentInput]) {
      newDietPlan = cache[currentInput];
      setDietPlan(newDietPlan);
    } else {
      newDietPlan = await fetchDietPlan();
      if (newDietPlan) {
        setDietPlan(newDietPlan);
        setCache({ ...cache, [currentInput]: newDietPlan });
      }
    }
    
    // Persist the diet chart in the backend
    if (newDietPlan) {
      try {
        const token = localStorage.getItem("token");
        await fetch("http://localhost:5000/api/diet-chart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            meals: `Breakfast: ${newDietPlan.breakfast}, Lunch: ${newDietPlan.lunch}, Dinner: ${newDietPlan.dinner}`
          })
        });
        console.log("Diet chart activity inserted successfully.");
      } catch (err) {
        console.error("Error inserting diet chart activity:", err);
      }
    }
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
