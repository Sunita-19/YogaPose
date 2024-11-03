// src/components/AccuracyDisplay.js
import React from 'react';
import { useAccuracy } from '../../contexts/AccuracyContext';

const AccuracyDisplay = () => {
  const { accuracy } = useAccuracy(); // Access accuracy from context

  return (
    <div className="accuracy-display" style={{ textAlign: 'left' }}>
      <h4>Accuracy: <span>{accuracy.toFixed(2)}%</span></h4>
    </div>
  );
};

export default AccuracyDisplay;
