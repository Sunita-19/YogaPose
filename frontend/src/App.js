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
import Feedback from './pages/Feedback/Feedback'; 
import LoginPage from './components/Login/LoginPage';
import SignupPage from './components/Login/SignUpPage'; // Correctly spelled


import './App.css';

export default function App() {
    return (
        <Router>
            <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} /> {/* Add Signup route */}
                <Route path='/' element={<Home />} />
               
                <Route path='/start' element={<Yoga />} />
                <Route path='/about' element={<About />} />
                <Route path='/tutorials' element={<Tutorials />} />
                <Route path='/chatbot' element={<Chatbot />} />
                <Route path='/diet' element={<Diet />} /> 
                <Route path='/dietplan' element={<DietPlan />} /> 
                <Route path='/progress' element={<Progress />} /> 
                <Route path='/feedback' element={<Feedback />} /> 
            </Routes>
        </Router>
    );
}
