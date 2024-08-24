 
// // // import React, { useRef, useEffect } from 'react';
// // // import styles from './CodeExampleAccordion.module.css';
// // // import SimpleCodeExample from '../../code-example/SimpleCodeExample';
// // // import { capitalizeWords } from '@/utils/functions';
// // // import Link from 'next/link';

// // // function CodeExampleAccordion({ data, link, width = '1000px', codeTheme = 'twilight', codeMode = 'c_cpp' }) {
// // //   const accordionRef = useRef(null);

// // //   const smoothScroll = (target, duration) => {
// // //     const targetPosition = target - 30; // 30px from the top
// // //     const startPosition = window.pageYOffset;
// // //     const distance = targetPosition - startPosition;
// // //     let startTime = null;

// // //     function animation(currentTime) {
// // //       if (startTime === null) startTime = currentTime;
// // //       const timeElapsed = currentTime - startTime;
// // //       const run = ease(timeElapsed, startPosition, distance, duration);
// // //       window.scrollTo(0, run);
// // //       if (timeElapsed < duration) requestAnimationFrame(animation);
// // //     }

// // //     function ease(t, b, c, d) {
// // //       t /= d / 2;
// // //       if (t < 1) return c / 2 * t * t + b;
// // //       t--;
// // //       return -c / 2 * (t * (t - 2) - 1) + b;
// // //     }

// // //     requestAnimationFrame(animation);
// // //   }

// // //   const toggleSection = (sectionId) => {
// // //     const sections = accordionRef.current.querySelectorAll(`.${styles.accordion__section}`);
// // //     sections.forEach(section => {
// // //       if (section.id === sectionId) {
// // //         const isOpening = !section.classList.contains(styles.open);
// // //         section.classList.toggle(styles.open);
        
// // //         if (isOpening) {
// // //           setTimeout(() => {
// // //             const sectionRect = section.getBoundingClientRect();
// // //             const offset = sectionRect.top + window.pageYOffset;
// // //             smoothScroll(offset, 500); // 500ms duration for the scroll
// // //           }, 300); // Wait for the section to expand before scrolling
// // //         }
// // //       } else {
// // //         section.classList.remove(styles.open);
// // //       }
// // //     });
// // //   };

// // //   const preventClose = (event) => {
// // //     event.stopPropagation();
// // //   };

// // //   useEffect(() => {
// // //     const handleHashChange = () => {
// // //       const hash = window.location.hash.substring(1);
// // //       if (hash) {
// // //         const section = document.getElementById(hash);
// // //         if (section) {
// // //           toggleSection(hash);
// // //         }
// // //       }
// // //     };

// // //     handleHashChange(); // Check hash on initial load
// // //     window.addEventListener('hashchange', handleHashChange);

// // //     return () => {
// // //       window.removeEventListener('hashchange', handleHashChange);
// // //     };
// // //   }, []);

// // //   return (
// // //     <div className={styles.accordion} style={{ width }} ref={accordionRef}>
// // //       {data.map((item, index) => (
// // //         <div 
// // //           key={index} 
// // //           id={`section${index}`} 
// // //           className={styles.accordion__section} 
// // //           onClick={() => toggleSection(`section${index}`)}
// // //         >
// // //           <div className={styles.accordion__label}>
// // //             {capitalizeWords(item.title.replaceAll('_', ' '))}
// // //             <span className={styles.chevron}></span>
// // //           </div>
// // //           <div className={styles.accordion__content} onClick={preventClose}>
// // //             <SimpleCodeExample
// // //               code={item.code}
// // //               article={item.explanation}
// // //               codeMode={codeMode}
// // //               codeTheme={codeTheme}
// // //               width={'100%'}
// // //             />
// // //             {item.related_functions && item.related_functions.length > 0 && (
// // //               <div className={styles.related_functions}>
// // //                 <h4>Related Functions:</h4>
// // //                 <ul>
// // //                   {item.related_functions.map((func, funcIndex) => (
// // //                     <li key={funcIndex}>
// // //                       {link ? (
// // //                         <Link href={`${link}/${encodeURIComponent(func)}`}>
// // //                           {func}
// // //                         </Link>
// // //                       ) : (
// // //                         <span>{func}</span>
// // //                       )}
// // //                     </li>
// // //                   ))}
// // //                 </ul>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       ))}
// // //     </div>
// // //   );
// // // }

// // // export default CodeExampleAccordion;
// // import React, { useRef } from 'react';
// // import styles from './CodeExampleAccordion.module.css';
// // import SimpleCodeExample from '../../code-example/SimpleCodeExample';
// // import { capitalizeWords } from '@/utils/functions';
// // import Link from 'next/link';

// // function CodeExampleAccordion({ data, link, width = '1000px', codeTheme = 'twilight', codeMode = 'c_cpp' }) {
// //   const accordionRef = useRef(null);

// //   const toggleSection = (sectionId) => {
// //     const sections = accordionRef.current.querySelectorAll(`.${styles.accordion__section}`);
// //     sections.forEach(section => {
// //       if (section.id === sectionId) {
// //         const isOpening = !section.classList.contains(styles.open);
// //         section.classList.toggle(styles.open);
        
// //         if (isOpening) {
// //           // Wait for the section to expand before scrolling
// //           setTimeout(() => {
// //             const sectionRect = section.getBoundingClientRect();
// //             const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
// //             const finalPosition = sectionRect.top + scrollTop - 30;
            
// //             window.scrollTo({
// //               top: finalPosition,
// //               behavior: 'smooth'
// //             });
// //           }, 50);
// //         }
// //       } else {
// //         section.classList.remove(styles.open);
// //       }
// //     });
// //   };

// //   const preventClose = (event) => {
// //     event.stopPropagation();
// //   };

// //   return (
// //     <div className={styles.accordion} style={{ width }} ref={accordionRef}>
// //       {data.map((item, index) => (
// //         <div 
// //           key={index} 
// //           id={`section${index}`} 
// //           className={styles.accordion__section} 
// //           onClick={() => toggleSection(`section${index}`)}
// //         >
// //           <div className={styles.accordion__label}>
// //             {capitalizeWords(item.title.replaceAll('_', ' '))}
// //             <span className={styles.chevron}></span>
// //           </div>
// //           <div className={styles.accordion__content} onClick={preventClose}>
// //             <SimpleCodeExample
// //               code={item.code}
// //               article={item.explanation}
// //               codeMode={codeMode}
// //               codeTheme={codeTheme}
// //               width={'100%'}
// //             />
// //             {item.related_functions && item.related_functions.length > 0 && (
// //               <div className={styles.related_functions}>
// //                 <h4>Related Functions:</h4>
// //                 <ul>
// //                   {item.related_functions.map((func, funcIndex) => (
// //                     <li key={funcIndex}>
// //                       {link ? (
// //                         <Link href={`${link}/${encodeURIComponent(func)}`}>
// //                           {func}
// //                         </Link>
// //                       ) : (
// //                         <span>{func}</span>
// //                       )}
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// // export default CodeExampleAccordion;
// // import React from 'react';
// // import styles from './CodeExampleAccordion.module.css';
// // import SimpleCodeExample from '../../code-example/SimpleCodeExample';
// // import { capitalizeWords } from '@/utils/functions';
// // import Link from 'next/link';

// // function CodeExampleAccordion({ data, link, width = '1000px', codeTheme = 'twilight', codeMode = 'c_cpp' }) {
  
  
// //   // const toggleSection = (sectionId) => {
// //   //   const sections = document.querySelectorAll(`.${styles.accordion__section}`);
// //   //   sections.forEach(section => {
// //   //     if (section.id === sectionId) {
// //   //       section.classList.toggle(styles.open);
// //   //       if (section.classList.contains(styles.open)) {
// //   //         section.scrollIntoView({ behavior: 'smooth', block: 'start' });
// //   //         setTimeout(() => {
// //   //           window.scrollBy(0, -30); // Scrolls up by 30 pixels
// //   //         }, 1000);
// //   //       }
// //   //     } else {
// //   //       section.classList.remove(styles.open);
// //   //     }
// //   //   });
// //   // };

// //   const toggleSection = (sectionId) => {
// //     const sections = document.querySelectorAll(`.${styles.accordion__section}`);
// //     sections.forEach(section => {
// //       if (section.id === sectionId) {
// //         section.classList.toggle(styles.open);
// //         if (section.classList.contains(styles.open)) {
// //           setTimeout(() => {
// //             const yOffset = -30; // Adjust this value as needed
// //             const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
// //             window.scrollTo({top: y, behavior: 'smooth'});
// //           }, 400); // Wait for the section to expand
// //         }
// //       } else {
// //         section.classList.remove(styles.open);
// //       }
// //     });
// //   };
  
// //   // const toggleSection = (sectionId) => {
// //   //   const sections = document.querySelectorAll(`.${styles.accordion__section}`);
// //   //   let targetSection;
    
// //   //   sections.forEach(section => {
// //   //     if (section.id === sectionId) {
// //   //       const isOpening = !section.classList.contains(styles.open);
// //   //       section.classList.toggle(styles.open);
// //   //       if (isOpening) {
// //   //         targetSection = section;
// //   //       }
// //   //     } else {
// //   //       section.classList.remove(styles.open);
// //   //     }
// //   //   });
  
// //   //   if (targetSection) {
// //   //     // Wait for the content to expand
// //   //     setTimeout(() => {
// //   //       const yOffset = -20; // Adjust this value as needed
// //   //       const sectionRect = targetSection.getBoundingClientRect();
// //   //       const absoluteY = window.pageYOffset + sectionRect.top + yOffset;
        
// //   //       window.scrollTo({
// //   //         top: absoluteY,
// //   //         behavior: 'smooth'
// //   //       });
// //   //     }, 50); // Short delay to allow for initial expansion
// //   //   }
// //   // };
 
// //   const preventClose = (event) => {
// //     event.stopPropagation();
// //   };

// //   return (
// //     <div className={styles.accordion} style={{ width }}>
// //       {data.map((item, index) => (
// //         <div 
// //           key={index} 
// //           id={`section${index}`} 
// //           className={styles.accordion__section} 
// //           onClick={() => toggleSection(`section${index}`)}
// //         >
// //           <div className={styles.accordion__label}>
// //             {capitalizeWords(item.title.replaceAll('_', ' '))}
// //             <span className={styles.chevron}></span>
// //           </div>
// //           <div className={styles.accordion__content} onClick={preventClose}>
// //             <SimpleCodeExample
// //               code={item.code}
// //               article={item.explanation}
// //               codeMode={codeMode}
// //               codeTheme={codeTheme}
// //               width={'100%'}
// //             />
// //             {item.related_functions && item.related_functions.length > 0 && (
// //               <div className={styles.related_functions}>
// //                 <h4>Related Functions:</h4>
// //                 <ul>
// //                   {item.related_functions.map((func, funcIndex) => (
// //                     <li key={funcIndex}>
// //                       {link ? (
// //                         <Link href={`${link}/${encodeURIComponent(func)}`}>
// //                           {func}
// //                         </Link>
// //                       ) : (
// //                         <span>{func}</span>
// //                       )}
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// // export default CodeExampleAccordion;
// import React from 'react';
// import styles from './CodeExampleAccordion.module.css';
// import SimpleCodeExample from '../../code-example/SimpleCodeExample';
// import { capitalizeWords } from '@/utils/functions';
// import Link from 'next/link';

// function CodeExampleAccordion({ data, link, width = '1000px', codeTheme = 'twilight', codeMode = 'c_cpp', idPrefix = '' }) {
  
//   const toggleSection = (sectionId) => {
//     const sections = document.querySelectorAll(`.${styles.accordion__section}`);
//     sections.forEach(section => {
//       if (section.id === sectionId) {
//         section.classList.toggle(styles.open);
//         if (section.classList.contains(styles.open)) {
//           setTimeout(() => {
//             const yOffset = -30;
//             const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
//             window.scrollTo({top: y, behavior: 'smooth'});
//           }, 400);
//         }
//       } else {
//         section.classList.remove(styles.open);
//       }
//     });
//   };
 
//   const preventClose = (event) => {
//     event.stopPropagation();
//   };

//   return (
//     <div className={styles.accordion} style={{ width }}>
//       {data.map((item, index) => (
//         <div 
//           key={index} 
//           id={`${idPrefix}section${index}`} 
//           className={styles.accordion__section} 
//           onClick={() => toggleSection(`${idPrefix}section${index}`)}
//         >
//           <div className={styles.accordion__label}>
//             {capitalizeWords(item.title.replaceAll('_', ' '))}
//             <span className={styles.chevron}></span>
//           </div>
//           <div className={styles.accordion__content} onClick={preventClose}>
//             <SimpleCodeExample
//               code={item.code}
//               article={item.explanation}
//               codeMode={codeMode}
//               codeTheme={codeTheme}
//               width={'100%'}
//             />
//             {item.related_functions && item.related_functions.length > 0 && (
//               <div className={styles.related_functions}>
//                 <h4>Related Functions:</h4>
//                 <ul>
//                   {item.related_functions.map((func, funcIndex) => (
//                     <li key={funcIndex}>
//                       {link ? (
//                         <Link href={`${link}/${encodeURIComponent(func)}`}>
//                           {func}
//                         </Link>
//                       ) : (
//                         <span>{func}</span>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default CodeExampleAccordion;
import React from 'react';
import styles from './CodeExampleAccordion.module.css';
import SimpleCodeExample from '../../code-example/SimpleCodeExample';
import { capitalizeWords } from '@/utils/functions';
import Link from 'next/link';

function CodeExampleAccordion({ data, link, width = '1000px', codeTheme = 'twilight', codeMode = 'c_cpp', idPrefix = '' }) {
  
  const toggleSection = (sectionId) => {
    const sections = document.querySelectorAll(`.${styles.accordion__section}`);
    sections.forEach(section => {
      if (section.id === sectionId) {
        section.classList.toggle(styles.open);
        if (section.classList.contains(styles.open)) {
          setTimeout(() => {
            const yOffset = -30;
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'});
          }, 400);
        }
      } else {
        section.classList.remove(styles.open);
      }
    });
  };
 
  const preventClose = (event) => {
    event.stopPropagation();
  };

  return (
    <div className={styles.accordion} style={{ width }}>
      {data.map((item, index) => (
        <div 
          key={index} 
          id={`${idPrefix}section${index}`} 
          className={styles.accordion__section} 
          onClick={() => toggleSection(`${idPrefix}section${index}`)}
        >
          <div className={styles.accordion__label}>
            {capitalizeWords(item.title.replaceAll('_', ' '))}
            <span className={styles.chevron}></span>
          </div>
          <div className={styles.accordion__content} onClick={preventClose}>
            <SimpleCodeExample
              code={item.code}
              article={item.explanation}
              codeMode={codeMode}
              codeTheme={codeTheme}
              width={'100%'}
            />
            {item.related_functions && item.related_functions.length > 0 && (
              <div className={styles.related_functions}>
                <h4>Related Functions:</h4>
                <ul>
                  {item.related_functions.map((func, funcIndex) => (
                    <li key={funcIndex}>
                      {link ? (
                        <Link href={`${link}/${encodeURIComponent(func.name)}`}>
                          {func.name}
                        </Link>
                      ) : (
                        <span>{func.name}</span>
                      )}
                      <span className={styles.tooltip}>{func.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CodeExampleAccordion;