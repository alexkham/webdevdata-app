import React from 'react';
import './AccordionToggle2.css';
import './Accordion.css'
import DynamicNestedTable from '../nested-table/DynamicNestedTable';
import { capitalizeWords } from '@/app/page';

function DynamicAccordion({data}) {
//   const toggleSection = (sectionId) => {
//     // Query all sections
//     const sections = document.querySelectorAll('.accordion__section');

//     // Iterate over sections
//     sections.forEach(section => {
//       if (section.id === sectionId) {
//         // Toggle 'open' class on the clicked section
//         section.classList.toggle('open');
//       } else {
//         // Ensure all other sections are closed
//         section.classList.remove('open');
//       }
//     });
//   };

const toggleSection = (sectionId) => {
    const sections = document.querySelectorAll('.accordion__section');

    sections.forEach(section => {
      if (section.id === sectionId) {
        section.classList.toggle('open');
        // Scroll the section into view
        if (section.classList.contains('open')) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        section.classList.remove('open');
      }
    });
  };

  return (
    <div className="accordion">
        
       {data.map((item,index)=>{
        return(
            <div key={index} id={`section${index}`} className="accordion__section" onClick={() => toggleSection(`section${index}`)}>
            <div className="accordion__label">{item.function}</div>
            <div className="accordion__content">
             <DynamicNestedTable  main={data[index].function}
                rows={[ 'Description' , data[index].description,
                'Signature', data[index].signature,
                'Return Type',data[index].return['type'],
                'Return Value',data[index].return['value'],
                'Mutating',data[index].is_mutating?'True':'False']}></DynamicNestedTable>
        </div>
      </div>
        )
       })}
      {/* <div id="section1" className="accordion__section" onClick={() => toggleSection('section1')}>
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
        </div> */}
      {/* </div> */}
    </div>
  );
}

export default DynamicAccordion;
