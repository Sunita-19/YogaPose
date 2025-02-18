import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer'; // Import Footer component
import { UserProvider } from './context/UserContext'; // Import UserProvider

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
import YogaHistory from './pages/YogaHistory/YogaHistory';
import YogaPosesVideos from './pages/YogaPosesVideos/YogaPosesVideos';
import AsanaDetailPage from './pages/AsanaDetailPage/AsanaDetailPage';
import PoseDetails from './pages/PoseDetails/PoseDetails'; // Import PoseDetails component
import ApplyNow from './pages/ApplyNow/ApplyNow';
import VolunteerInfo from './pages/VolunteerInfo/VolunteerInfo';
import MeetTheTeam from './pages/MeetTheTeam/MeetTheTeam';
import UserInput from './pages/UserInput/UserInput';
import RecommendedPoses from './pages/RecommendedPoses/RecommendedPoses'; // Import the new component

export default function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

    // Toggle the sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogin = () => {
        setIsAuthenticated(true); // Set authenticated to true on successful login
    };

    return (
        <UserProvider>
            <Router>
                <div className="layout-container">
                    {isAuthenticated && <Header toggleSidebar={toggleSidebar} />} {/* Render Header only if authenticated */}
                    {isAuthenticated && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />} {/* Render Sidebar only if authenticated */}
                    <main className="main-content">
                        <Routes>
                            <Route path='/' element={<Navigate to="/login" replace />} />
                            <Route path='/login' element={<LoginPage onLogin={handleLogin} />} /> {/* Pass onLogin to LoginPage */}
                            <Route path='/signup' element={<SignUpPage />} />
                            <Route path='/forgot-password' element={<ForgotPassword />} />
                            <Route path='/reset-password' element={<ResetPassword />} />

                            {/* Protected Routes with Layout */}
                            {isAuthenticated ? (
                                <>
                                    <Route path='/home' element={<Home />} />
                                    <Route path='/start' element={<Yoga />} />
                                    <Route path='/about' element={<About />} />
                                    <Route path='/tutorials' element={<Tutorials />} />
                                    <Route path='/chatbot' element={<Chatbot />} />
                                    <Route path='/diet' element={<Diet />} />
                                    <Route path='/dietplan' element={<DietPlan />} />
                                    <Route path='/progress' element={<Progress />} />
                                    <Route path='/feedback' element={<Feedback />} />
                                    <Route path='/YogaHistory' element={<YogaHistory />} />
                                    <Route path='/YogaPosesVideos' element={<YogaPosesVideos />} />
                                    <Route path="/AsanaDetailPage" element={<AsanaDetailPage />} />
                                    <Route path="/" element={<YogaPosesVideos />} />
                                    <Route path="/pose/:id" element={<PoseDetails />} />
                                    <Route path="/volunteer-info" element={<VolunteerInfo />} />
                                    <Route path="/apply" element={<ApplyNow />} />
                                    <Route path="/MeetTheTeam" element={<MeetTheTeam/>} />
                                    <Route path="/" element={<UserInput />} />
                                    <Route path="/yoga-poses" element={<YogaPosesVideos />} /> {/* Add new route for yoga poses */}
                                    <Route path="/recommended-poses" element={<RecommendedPoses />} /> {/* Add new route */}
                                </>
                            ) : (
                                <Route path='/home' element={<Navigate to="/login" replace />} />
                            )}
                        </Routes>
                    </main>
                </div>
                {isAuthenticated && <Footer />} {/* Render Footer only if authenticated */}
            </Router>
        </UserProvider>
    );
}
