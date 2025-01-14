import React from 'react';
import './AccordionCheckBox.css';
import './Accordion.css'

function AccordionCheckBox() {

    const toggleSection = (event) => {
        const section = event.currentTarget;
        const isOpen = section.classList.contains('open');
    
        // Close all sections
        document.querySelectorAll('.accordion__section').forEach(s => {
          s.classList.remove('open');
        });
    
        // If the clicked section was not already open, open it
        if (!isOpen) {
          section.classList.add('open');
        }
      };
    
  return (
    <div className="accordion">
      <div>
        <input type="checkbox" id="section1" className="accordion__input" />
        <label htmlFor="section1" className="accordion__label">Section #1</label>
        <div className="accordion__content">
          Content for Section #1
        </div>
        <input type="checkbox" id="section2" className="accordion__input" />
        <label htmlFor="section2" className="accordion__label">Section #2</label>
        <div className="accordion__content">
          Content for Section #2
        </div>
        <input type="checkbox" id="section3" className="accordion__input" />
        <label htmlFor="section3" className="accordion__label">Section #3</label>
        <div className="accordion__content">
          Content for Section #3
        </div>
      </div>
      
    </div>
  );
}

export default AccordionCheckBox;
