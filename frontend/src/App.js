// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Import page components
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
import SignUpPage from './components/Login/SignUpPage';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Navigate to="/login" replace />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SignUpPage />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/reset-password' element={<ResetPassword />} />

                {/* Protected Routes with Layout */}
                <Route path='/home' element={<Layout><Home /></Layout>} />
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
