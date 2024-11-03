// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Toggle the sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Router>
            <div className="layout-container">
                <Header toggleSidebar={toggleSidebar} />
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <main className="main-content">
                    <Routes>
                        <Route path='/' element={<Navigate to="/login" replace />} />
                        <Route path='/login' element={<LoginPage />} />
                        <Route path='/signup' element={<SignUpPage />} />
                        <Route path='/forgot-password' element={<ForgotPassword />} />
                        <Route path='/reset-password' element={<ResetPassword />} />

                        {/* Protected Routes with Layout */}
                        <Route path='/home' element={<Home />} />
                        <Route path='/start' element={<Yoga />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/tutorials' element={<Tutorials />} />
                        <Route path='/chatbot' element={<Chatbot />} />
                        <Route path='/diet' element={<Diet />} />
                        <Route path='/dietplan' element={<DietPlan />} />
                        <Route path='/progress' element={<Progress />} />
                        <Route path='/feedback' element={<Feedback />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
