import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header({ toggleSidebar }) {
    const [dropdown, setDropdown] = useState(null);

    const toggleDropdown = (menu) => {
        setDropdown(dropdown === menu ? null : menu);
    };

    return (
        <header className='home-header'>
            <div className="menu-icon" onClick={toggleSidebar}>☰</div>
            
            <h1 className='main-heading'>Fun Yoga AI Trainer</h1>

            <nav className="header-nav">
                <Link to='/home' className="header-link" onClick={() => setDropdown(null)}>Home</Link>

                <div className="header-link" onMouseEnter={() => toggleDropdown("about")} onMouseLeave={() => setDropdown(null)}>
                    About Us
                    {dropdown === "about" && (
                        <div className="dropdown-menu">
                            <Link to='/about' className="dropdown-link">Our Mission</Link>
                            <Link to='/team' className="dropdown-link">Meet the Team</Link>
                        </div>
                    )}
                </div>

                <div className="header-link" onMouseEnter={() => toggleDropdown("offer")} onMouseLeave={() => setDropdown(null)}>
                    What We Offer
                    {dropdown === "offer" && (
                        <div className="dropdown-menu">
                            <Link to='/diet' className="dropdown-link">Diet Chart</Link>
                            <Link to='/progress' className="dropdown-link">Progress</Link>
                        </div>
                    )}
                </div>

                <div className="header-link" onMouseEnter={() => toggleDropdown("use")} onMouseLeave={() => setDropdown(null)}>
                    How to Use
                    {dropdown === "use" && (
                        <div className="dropdown-menu">
                            <Link to='/tutorials' className="dropdown-link">Tutorial</Link>
                        </div>
                    )}
                </div>

                <div className="header-link" onMouseEnter={() => toggleDropdown("volunteer")} onMouseLeave={() => setDropdown(null)}>
                    Volunteer
                    {dropdown === "volunteer" && (
                        <div className="dropdown-menu">
                            <Link to='/volunteer-info' className="dropdown-link">Volunteer Info</Link>
                            <Link to='/apply' className="dropdown-link">Apply Now</Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
