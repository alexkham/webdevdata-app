'use client'
import React, { useState } from 'react';
import './Tabs.css'; 
import { TextFormatter,capitalizeWords } from '@/utils/functions';


function ParametersTabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  
  if (!tabs || tabs.length === 0) {
    return <h3>Takes no Parameters</h3>;  // Or return some fallback UI
  }
 const result=tabs[activeTab].description.split('.')
  return (

    <div className="tabs">
      <h3>Parameters</h3>
      
     
      <ul className="tab-links">
        {tabs.map((tab, index) => (
          <li
            key={index}
            className={activeTab === index ? 'active' : ''}
            onClick={() => setActiveTab(index)}
          >
            {capitalizeWords(tab.parameter)}
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
            
           {/* <div className='title-container'> {capitalizeWords(tab.parameter)}</div> */}
            {result.map((sentense,index)=>{
                return <p key={index} style={{paddingTop:'20px'}}>{capitalizeWords(sentense) }.</p>
            })}
           
          </div>
        ))}
      </div>

    </div>
        
  );
}

export default ParametersTabs;
