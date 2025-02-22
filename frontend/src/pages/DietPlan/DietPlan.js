import React, { useState } from 'react';
import './DietPlan.css';

const dietOptions = [
  {
    breakfast: 'Oatmeal with Almond Butter and Banana',
    lunch: 'Grilled Veggie Wrap with Hummus',
    dinner: 'Quinoa Salad with Chickpeas and Avocado'
  },
  {
    breakfast: 'Smoothie Bowl with Berries and Granola',
    lunch: 'Lentil Soup with Whole Grain Bread',
    dinner: 'Stir-fried Tofu with Brown Rice'
  },
  {
    breakfast: 'Greek Yogurt with Honey and Nuts',
    lunch: 'Stuffed Bell Peppers with Quinoa',
    dinner: 'Grilled Paneer with Steamed Vegetables'
  }
];

const DietPlan = () => {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    gender: 'female',
    activityLevel: 'low',
    dietaryPreferences: 'none'
  });

  const [errors, setErrors] = useState({ age: '', height: '', weight: '' });
  const [dietPlan, setDietPlan] = useState(null);

  const validateInputs = (name, value) => {
    let errorMsg = '';
    const numValue = Number(value);

    if (name === 'age') {
      if (!/^[1-9][0-9]?$|^120$/.test(value)) errorMsg = 'Age must be between 1 and 120';
    } else if (name === 'height') {
      if (numValue < 54.6 || numValue > 251) errorMsg = 'Height must be between 54.6 cm and 251 cm';
    } else if (name === 'weight') {
      if (numValue < 10 || numValue > 350) errorMsg = 'Weight must be between 10 kg and 350 kg';
    }
    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateInputs(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
    if (!errorMsg) {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const isFormValid = () => {
    return Object.values(errors).every((err) => err === '') &&
      formData.age !== '' &&
      formData.height !== '' &&
      formData.weight !== '';
  };

  const generateDiet = () => {
    const newDiet = dietOptions[Math.floor(Math.random() * dietOptions.length)];
    setDietPlan(newDiet);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      generateDiet();
    }
  };

  return (
    <div className="diet-plan-container">
      <header className="diet-plan-header">
        <h1>Personalized Diet Plan</h1>
      </header>

      <div className="diet-plan-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Age:</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} required />
            {errors.age && <div className="error-message">{errors.age}</div>}
          </div>
          <div className="form-group">
            <label>Height (cm):</label>
            <input type="number" name="height" value={formData.height} onChange={handleChange} required />
            {errors.height && <div className="error-message">{errors.height}</div>}
          </div>
          <div className="form-group">
            <label>Weight (kg):</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
            {errors.weight && <div className="error-message">{errors.weight}</div>}
          </div>
          <button type="submit" disabled={!isFormValid()}>Generate Diet Chart</button>
        </form>
      </div>

      {dietPlan && (
        <div className="diet-chart">
          <h2>Your Personalized Diet Chart</h2>
          <p>Here is a diet plan based on your input values.</p>
          <ul>
            <li><strong>Breakfast:</strong> {dietPlan.breakfast}</li>
            <li><strong>Lunch:</strong> {dietPlan.lunch}</li>
            <li><strong>Dinner:</strong> {dietPlan.dinner}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DietPlan;
