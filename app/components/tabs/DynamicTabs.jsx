import React from 'react'
import './Tabs.css'



function DynamicTabs({data}) {
    const n=3
  return (
    <>
    {data.map((item,index)=>{
        return (
            
            <div key={index} className="tabs">
            <input type="radio" className="tabs__radio" name="tabs-example" id={`tab${index}`} defaultChecked={index === 0} />
            <label htmlFor={`tab${index}`}  className="tabs__label">Argument {index+1}</label>
            
            <div className="tabs__content">
                <h2>CONTENT for Tab {index}</h2>
                <span>{data[index].type}</span>
               <div> {data[index].description}</div>
               <div> {data[index].default}</div>
            </div> 
            </div>
        )
    })}
        
    
    
    </>
  )
}

export default DynamicTabs