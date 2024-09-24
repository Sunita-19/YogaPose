// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';
import Yoga from './pages/Yoga/Yoga';
import About from './pages/About/About';
import Tutorials from './pages/Tutorials/Tutorials';
import Chatbot from './pages/ChatBot/Chatbot';
import Diet from './pages/Diet/Diet'; 
import DietPlan from './pages/DietPlan/DietPlan'; 
import Progress from './pages/Progress/Progress';
import Feedback from './pages/Feedback/Feedback'; // Importing the Feedback page
import Layout from './components/Layout';  // Import the Layout component

import './App.css';  // Global styles if needed

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/start' element={<Layout><Yoga /></Layout>} />
        <Route path='/about' element={<Layout><About /></Layout>} />
        <Route path='/tutorials' element={<Layout><Tutorials /></Layout>} />
        <Route path='/chatbot' element={<Layout><Chatbot /></Layout>} />
        <Route path='/diet' element={<Layout><Diet /></Layout>} /> 
        <Route path='/dietplan' element={<Layout><DietPlan /></Layout>} /> 
        <Route path='/progress' element={<Layout><Progress /></Layout>} /> 
        <Route path='/feedback' element={<Layout><Feedback /></Layout>} /> 
      </Routes>
    </Router>
  );
}
