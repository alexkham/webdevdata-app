// 'use client'
// import React from 'react';
// import './AccordionToggle2.css';
// import './Accordion.css'
// import DynamicNestedTable from '../nested-table/DynamicNestedTable';
// import { capitalizeWords } from '@/app/page';
// import Link from 'next/link';

// function DynamicAccordion({ data, link }) {
    
//     const toggleSection = (sectionId) => {
//       const sections = document.querySelectorAll('.accordion__section');
//       sections.forEach(section => {
//           if (section.id === sectionId) {
//               section.classList.toggle('open');
//               if (section.classList.contains('open')) {
//                   section.scrollIntoView({ behavior: 'smooth', block: 'start' });
//               }
//           } else {
//               section.classList.remove('open');
//           }
//       });
//   };

//     const preventClose = (event) => {
//         event.stopPropagation();
//     };

//     return (
//         <>
//         <div className="accordion">
//             {data.map((item, index) => {
//                 const sectionId = `section${index}`;
//                 return (
//                     <div key={index} id={sectionId} className="accordion__section">
//                         <div className="accordion__label" onClick={(event) => toggleSection(sectionId, event)}>
//                             {item.function}
//                         </div>
//                         <div className="accordion__content" onClick={preventClose}>
//                             {link && item?.function && (
//                                 <Link href={`${link}${encodeURIComponent(item.function.split('(')[0])}`} className='link'>
//                                     Go to Page
//                                 </Link>
//                             )}
//                             <DynamicNestedTable main={item.function}
//                                 rows={[
//                                     'Description', item.description,
//                                     'Signature', item.signature,
//                                     'Return Type', item.return['type'],
//                                     'Return Value', item.return['value'],
//                                     'Mutating', item.is_mutating ? 'True' : 'False'
//                                 ]}>
//                             </DynamicNestedTable>
//                             {link && item?.function && (
//                                 <Link href={`${link}${encodeURIComponent(item.function.split('(')[0])}`} className='link'>
//                                     Go to Page
//                                 </Link>
//                             )}
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//         </>
//     );
// }

// export default DynamicAccordion;
'use client'
import React from 'react';
import './AccordionToggle2.css';
import './Accordion.css';
import DynamicNestedTable from '../nested-table/DynamicNestedTable';
import Link from 'next/link';

function DynamicAccordion({ data, link }) {
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
        <div className="accordion">
            {data.map((item, index) => {
                const sectionId = `section${index}`;
                return (
                    <div key={index} id={sectionId} className="accordion__section">
                        <div className="accordion__label" onClick={() => toggleSection(sectionId)}>
                            {item.function}
                        </div>
                        <div className="accordion__content" onClick={preventClose}>
                            {link && item?.function && (
                                <Link href={`${link}${encodeURIComponent(item.function.split('(')[0])}`} className='link'>
                                    Go to Page
                                </Link>
                            )}
                            <DynamicNestedTable 
                                className="dynamic-nested-table"
                                main={item.function}
                                rows={[
                                    'Description', item.description,
                                    'Signature', item.signature,
                                    'Return Type', item.return?.type,
                                    'Return Value', item.return?.value,
                                    'Mutating', item.is_mutating ? 'True' : 'False'
                                ]}
                            />
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
    );
}

export default DynamicAccordion;
