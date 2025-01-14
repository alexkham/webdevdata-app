import React from 'react'
import './Tabs.css'



function Tabs() {
    const n=3
  return (
    <>
        
    <div className="tabs">
    <input type="radio" className="tabs__radio" name="tabs-example" id="tab1" defaultChecked />
    <label htmlFor="tab1" className="tabs__label">Tab #1</label>
    
    <div className="tabs__content">
        CONTENT for Tab #1
    </div>
    <input type="radio" className="tabs__radio" name="tabs-example" id="tab2" />
    <label htmlFor="tab2" className="tabs__label">Tab #2</label>
   
    <div className="tabs__content">
        CONTENT for Tab #2
    </div>

    <input type="radio" className="tabs__radio" name="tabs-example" id={`tab${n}`} />
    <label htmlFor={`tab${n}`} className="tabs__label">Tab #3</label>
    
    <div className="tabs__content">
        CONTENT for Tab #3
    </div>
    <input type="radio" className="tabs__radio" name="tabs-example" id="tab4" />
    <label htmlFor="tab4" className="tabs__label">Tab #4</label>
   
    <div className="tabs__content">
        CONTENT for Tab #4
    </div>
    </div>

    
    
    </>
  )
}

export default Tabs