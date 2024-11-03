import React, { useState } from 'react';
import './Tabs.css';

const Tabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].name);

    return (
        <div>
            <div className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        className={`tab-button ${activeTab === tab.name ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.name)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {tabs.find(tab => tab.name === activeTab)?.content}
            </div>
        </div>
    );
};

export default Tabs;
