// src/contexts/AccuracyContext.js
import React, { createContext, useState, useContext } from 'react';

const AccuracyContext = createContext();

export const AccuracyProvider = ({ children }) => {
  const [accuracy, setAccuracy] = useState(0);

  return (
    <AccuracyContext.Provider value={{ accuracy, setAccuracy }}>
      {children}
    </AccuracyContext.Provider>
  );
};

export const useAccuracy = () => useContext(AccuracyContext);
