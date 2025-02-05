import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header({ toggleSidebar }) {
    const [dropdown, setDropdown] = useState(null);

    const toggleDropdown = (menu) => {
        setDropdown(dropdown === menu ? null : menu);
    };

    return (
        <header className="home-header">
            <div className="menu-icon" onClick={toggleSidebar}>☰</div>
            
            <h1 className="main-heading">Fun Yoga AI Trainer</h1>

            <nav className="header-nav">
                <Link to="/home" className="header-link">Home</Link>

                <div
                    className="header-link header-dropdown-parent"
                    onMouseEnter={() => toggleDropdown("about")}
                    onMouseLeave={() => setDropdown(null)}
                >
                    About Us
                    {dropdown === "about" && (
                        <div className="header-dropdown-menu">
                            <Link to="/about" className="header-dropdown-link">Our Mission</Link>
                            <Link to="/team" className="header-dropdown-link">Meet the Team</Link>
                        </div>
                    )}
                </div>

                <div
                    className="header-link header-dropdown-parent"
                    onMouseEnter={() => toggleDropdown("offer")}
                    onMouseLeave={() => setDropdown(null)}
                >
                    What We Offer
                    {dropdown === "offer" && (
                        <div className="header-dropdown-menu">
                            <Link to="/diet" className="header-dropdown-link">Diet Chart</Link>
                            <Link to="/progress" className="header-dropdown-link">Progress</Link>
                            <Link to="/start" className="header-dropdown-link">Yoga Poses</Link>
                            <Link to="/YogaHistory" className="header-dropdown-link">Yoga History</Link>
                            <Link to="/YogaPosesVideos" className="header-dropdown-link">Different Levels</Link>

                        </div>
                    )}
                </div>

                <div
                    className="header-link header-dropdown-parent"
                    onMouseEnter={() => toggleDropdown("use")}
                    onMouseLeave={() => setDropdown(null)}
                >
                    How to Use
                    {dropdown === "use" && (
                        <div className="header-dropdown-menu">
                            <Link to="/tutorials" className="header-dropdown-link">Tutorial</Link>
                        </div>
                    )}
                </div>

                <div
                    className="header-link header-dropdown-parent"
                    onMouseEnter={() => toggleDropdown("volunteer")}
                    onMouseLeave={() => setDropdown(null)}
                >
                    Volunteer
                    {dropdown === "volunteer" && (
                        <div className="header-dropdown-menu">
                            <Link to="/volunteer-info" className="header-dropdown-link">Volunteer Info</Link>
                            <Link to="/apply" className="header-dropdown-link">Apply Now</Link>
                            
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
