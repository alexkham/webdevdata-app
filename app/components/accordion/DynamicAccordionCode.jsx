'use client'
import React from 'react';
import './AccordionToggle2.css';
import './Accordion.css'
import DynamicNestedTable from '../nested-table/DynamicNestedTable';
import { capitalizeWords } from '@/app/page';
import Link from 'next/link';
import SimpleCodeExample from '../code-example/SimpleCodeExample';

function DynamicAccordionCode({data,link,width}) {

// const toggleSection = (sectionId) => {
//     const sections = document.querySelectorAll('.accordion__section');

//     sections.forEach(section => {
//       if (section.id === sectionId) {
//         section.classList.toggle('open');
//         // Scroll the section into view
//         if (section.classList.contains('open')) {
//           section.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         }
//       } else {
//         section.classList.remove('open');
//       }
//     });
//   };

const toggleSection = (sectionId) => {
    const sections = document.querySelectorAll('.accordion__section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.toggle('open');
            if (section.classList.contains('open')) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // setTimeout(() => {
                //     window.scrollBy(0, -30); // Scrolls up by 20 pixels
                // }, 1500); 
            }
        } else {
            section.classList.remove('open');
        }
    });
};

  const preventClose = (event) => {
      event.stopPropagation();
  };

  return (
    <>
    
    <div className="accordion" style={{width:`${width}`}}>
        
       {data.map((item,index)=>{
        return(
            <div key={index} id={`section${index}`} className="accordion__section" onClick={() => toggleSection(`section${index}`)}>
            <div className="accordion__label">{item.title}</div>
            <div className="accordion__content" 
            style={{width:'1500px'}} 
            onClick={preventClose}>
            {/* {link &&<Link href={link+data[index].function.split('(')[0]}><span style={{textDecoration:'none'}} className='link'>Go to Page</span></Link>} */}
            {link && data[index]?.function && (
                <Link href={`${link}${encodeURIComponent(data[index].function.split('(')[0])}`}
                className='link'>
                    Go to Page
                </Link>
                 )}
                 <SimpleCodeExample 
                 code={item.code} 
                 article={item.explanation} 
                 width={'950px'}></SimpleCodeExample>
                {link && data[index]?.function && (
                <Link href={`${link}${encodeURIComponent(data[index].function.split('(')[0])}`}
                className='link'>
                    Go to Page
                </Link>
                 )}
        </div>
      </div>
        )
       })}
    
    </div>
    </>
  );

}

export default DynamicAccordionCode;
