// import React from 'react';
// import './AccordionToggle2.css';
// import './Accordion.css'
// import DynamicNestedTable from '../nested-table/DynamicNestedTable';
// import { capitalizeWords } from '@/app/page';
// import Link from 'next/link';

// function DynamicAccordion({data,link}) {

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

//   return (
//     <>
//     {/* <span>{data.length} items</span> */}
//     <div className="accordion">
        
//        {data.map((item,index)=>{
//         return(
//             <div key={index} id={`section${index}`} className="accordion__section" onClick={() => toggleSection(`section${index}`)}>
//             <div className="accordion__label">{item.function}</div>
//             <div className="accordion__content">
//             {/* {link &&<Link href={link+data[index].function.split('(')[0]}><span style={{textDecoration:'none'}} className='link'>Go to Page</span></Link>} */}
//             {link && data[index]?.function && (
//                 <Link href={`${link}${encodeURIComponent(data[index].function.split('(')[0])}`}
//                 className='link'>
//                     Go to Page
//                 </Link>
//                  )}
//              <DynamicNestedTable  main={data[index].function}
//                 rows={[ 'Description' , data[index].description,
//                 'Signature', data[index].signature,
//                 'Return Type',data[index].return['type'],
//                 'Return Value',data[index].return['value'],
//                 'Mutating',data[index].is_mutating?'True':'False']}></DynamicNestedTable>
//                 {link && data[index]?.function && (
//                 <Link href={`${link}${encodeURIComponent(data[index].function.split('(')[0])}`}
//                 className='link'>
//                     Go to Page
//                 </Link>
//                  )}
//         </div>
//       </div>
//         )
//        })}
    
//     </div>
//     </>
//   );
// }

// export default DynamicAccordion;
'use client'
import React from 'react';
import './AccordionToggle2.css';
import './Accordion.css'
import DynamicNestedTable from '../nested-table/DynamicNestedTable';
import { capitalizeWords } from '@/app/page';
import Link from 'next/link';

function DynamicAccordion({ data, link }) {
    // const toggleSection = (sectionId, event) => {
    //     const section = document.getElementById(sectionId);
    //     section.classList.toggle('open');
    //     if (section.classList.contains('open')) {
    //         section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //     }
    // };
    const toggleSection = (sectionId) => {
      const sections = document.querySelectorAll('.accordion__section');
      sections.forEach(section => {
          if (section.id === sectionId) {
              section.classList.toggle('open');
              if (section.classList.contains('open')) {
                  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        <div className="accordion">
            {data.map((item, index) => {
                const sectionId = `section${index}`;
                return (
                    <div key={index} id={sectionId} className="accordion__section">
                        <div className="accordion__label" onClick={(event) => toggleSection(sectionId, event)}>
                            {item.function}
                        </div>
                        <div className="accordion__content" onClick={preventClose}>
                            {link && item?.function && (
                                <Link href={`${link}${encodeURIComponent(item.function.split('(')[0])}`} className='link'>
                                    Go to Page
                                </Link>
                            )}
                            <DynamicNestedTable main={item.function}
                                rows={[
                                    'Description', item.description,
                                    'Signature', item.signature,
                                    'Return Type', item.return['type'],
                                    'Return Value', item.return['value'],
                                    'Mutating', item.is_mutating ? 'True' : 'False'
                                ]}>
                            </DynamicNestedTable>
                            {link && item?.function && (
                                <Link href={`${link}${encodeURIComponent(item.function.split('(')[0])}`} className='link'>
                                    Go to Page
                                </Link>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
        </>
    );
}

export default DynamicAccordion;
