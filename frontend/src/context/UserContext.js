// src/context/UserContext.js
import React, { createContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInput, setUserInput] = useState({
    age: "",
    weight: "",
    gender: "female",
    fitnessLevel: "beginner",
    healthConditions: "none",
    activityLevel: "low",
    specificGoals: "flexibility",
    timeCommitment: "short",
  });
  const [recommendedPoses, setRecommendedPoses] = useState({
    beginner: [],
    intermediate: [],
    advanced: []
  });

  const updateUserInput = (input) => {
    setUserInput(input);
  };

  return (
    <UserContext.Provider value={{ userInput, recommendedPoses, setRecommendedPoses, updateUserInput }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
