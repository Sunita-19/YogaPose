// src/context/UserContext.js
import React, { createContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInput, setUserInput] = useState({});
  const [recommendedPoses, setRecommendedPoses] = useState([]);

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
