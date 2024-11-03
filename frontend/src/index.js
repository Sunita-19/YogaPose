// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AccuracyProvider } from './context/AccuracyContext'; // Adjusted to singular "context"
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Optional: Log performance metrics
reportWebVitals(console.log);

ReactDOM.render(
  <AccuracyProvider>
    <App />
  </AccuracyProvider>,
  document.getElementById('root')
);
