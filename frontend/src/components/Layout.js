// src/components/Layout.js
import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Sidebar from './Sidebar/Sidebar'; // Import Sidebar component
import '../App.css';

export default function Layout({ children }) {
    return (
        <div className='layout-container'>
            <Header />
            <div className='main-content-with-sidebar'>
                <Sidebar /> {/* Add Sidebar component */}
                <main className='main-content'>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
