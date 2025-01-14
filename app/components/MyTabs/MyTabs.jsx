'use client'
import React, { useState } from 'react';
import './Tabs.css'; 

function MyTabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tabs">
      
      
      <ul className="tab-links">
        {tabs.map((tab, index) => (
          <li
            key={index}
            className={activeTab === index ? 'active' : ''}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {tabs.map((tab, index) => (
          <div
            key={index}
            id={`tab-${index}`}
            className={`tab ${activeTab === index ? 'active' : ''}`}
          >
            
           <div className='title-container'> {tab.title}</div>
            {tabs[activeTab].content}
            {/* {activeTab === index && tab.content()} */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTabs;
