import React from 'react';
import './AccordionToggle2.css';
import './Accordion.css'

function AccordionToggle2() {
  const toggleSection = (sectionId) => {
    // Query all sections
    const sections = document.querySelectorAll('.accordion__section');

    // Iterate over sections
    sections.forEach(section => {
      if (section.id === sectionId) {
        // Toggle 'open' class on the clicked section
        section.classList.toggle('open');
      } else {
        // Ensure all other sections are closed
        section.classList.remove('open');
      }
    });
  };

  return (
    <div className="accordion">
      <div id="section1" className="accordion__section" onClick={() => toggleSection('section1')}>
        <div className="accordion__label">Section #1</div>
        <div className="accordion__content">
          <p>Content for Section #1</p>
        </div>
      </div>

      <div id="section2" className="accordion__section" onClick={() => toggleSection('section2')}>
        <div className="accordion__label">Section #2</div>
        <div className="accordion__content">
          <p>Content for Section #2</p>
        </div>
      </div>

      <div id="section3" className="accordion__section" onClick={() => toggleSection('section3')}>
        <div className="accordion__label">Section #3</div>
        <div className="accordion__content">
          <p>Content for Section #3</p>
        </div>
      </div>
    </div>
  );
}

export default AccordionToggle2;
