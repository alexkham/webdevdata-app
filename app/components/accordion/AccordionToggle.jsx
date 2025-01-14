import React from 'react';
import './AccordionToggle.css';
import './Accordion.css'

function AccordionToggle() {
  // Function to toggle accordion sections
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
      <div className="accordion__section" onClick={toggleSection}>
        <div className="accordion__label">Section #1</div>
        <div className="accordion__content">
          Content for Section #1
        </div>
      </div>

      <div className="accordion__section" onClick={toggleSection}>
        <div className="accordion__label">Section #2</div>
        <div className="accordion__content">
          Content for Section #2
        </div>
      </div>

      <div className="accordion__section" onClick={toggleSection}>
        <div className="accordion__label">Section #3</div>
        <div className="accordion__content">
          Content for Section #3
        </div>
      </div>
      
    </div>
  );
}

export default AccordionToggle;
