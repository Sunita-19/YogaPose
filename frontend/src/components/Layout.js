// src/components/Layout.js
import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import '../App.css';

export default function Layout({ children }) {
    return (
        <div className='layout-container'>
            <Header />
            <main className='main-content'>
                {children}
            </main>
            <Footer />
        </div>
    );
}
