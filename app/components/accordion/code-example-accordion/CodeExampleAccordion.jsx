 
// // // // import React, { useRef, useEffect } from 'react';
// // // // import styles from './CodeExampleAccordion.module.css';
// // // // import SimpleCodeExample from '../../code-example/SimpleCodeExample';
// // // // import { capitalizeWords } from '@/utils/functions';
// // // // import Link from 'next/link';

// // // // function CodeExampleAccordion({ data, link, width = '1000px', codeTheme = 'twilight', codeMode = 'c_cpp' }) {
// // // //   const accordionRef = useRef(null);

// // // //   const smoothScroll = (target, duration) => {
// // // //     const targetPosition = target - 30; // 30px from the top
// // // //     const startPosition = window.pageYOffset;
// // // //     const distance = targetPosition - startPosition;
// // // //     let startTime = null;

// // // //     function animation(currentTime) {
// // // //       if (startTime === null) startTime = currentTime;
// // // //       const timeElapsed = currentTime - startTime;
// // // //       const run = ease(timeElapsed, startPosition, distance, duration);
// // // //       window.scrollTo(0, run);
// // // //       if (timeElapsed < duration) requestAnimationFrame(animation);
// // // //     }

// // // //     function ease(t, b, c, d) {
// // // //       t /= d / 2;
// // // //       if (t < 1) return c / 2 * t * t + b;
// // // //       t--;
// // // //       return -c / 2 * (t * (t - 2) - 1) + b;
// // // //     }

// // // //     requestAnimationFrame(animation);
// // // //   }

// // // //   const toggleSection = (sectionId) => {
// // // //     const sections = accordionRef.current.querySelectorAll(`.${styles.accordion__section}`);
// // // //     sections.forEach(section => {
// // // //       if (section.id === sectionId) {
// // // //         const isOpening = !section.classList.contains(styles.open);
// // // //         section.classList.toggle(styles.open);
        
// // // //         if (isOpening) {
// // // //           setTimeout(() => {
// // // //             const sectionRect = section.getBoundingClientRect();
// // // //             const offset = sectionRect.top + window.pageYOffset;
// // // //             smoothScroll(offset, 500); // 500ms duration for the scroll
// // // //           }, 300); // Wait for the section to expand before scrolling
// // // //         }
// // // //       } else {
// // // //         section.classList.remove(styles.open);
// // // //       }
// // // //     });
// // // //   };

// // // //   const preventClose = (event) => {
// // // //     event.stopPropagation();
// // // //   };

// // // //   useEffect(() => {
// // // //     const handleHashChange = () => {
// // // //       const hash = window.location.hash.substring(1);
// // // //       if (hash) {
// // // //         const section = document.getElementById(hash);
// // // //         if (section) {
// // // //           toggleSection(hash);
// // // //         }
// // // //       }
// // // //     };

// // // //     handleHashChange(); // Check hash on initial load
// // // //     window.addEventListener('hashchange', handleHashChange);

// // // //     return () => {
// // // //       window.removeEventListener('hashchange', handleHashChange);
// // // //     };
// // // //   }, []);

// // // //   return (
// // // //     <div className={styles.accordion} style={{ width }} ref={accordionRef}>
// // // //       {data.map((item, index) => (
// // // //         <div 
// // // //           key={index} 
// // // //           id={`section${index}`} 
// // // //           className={styles.accordion__section} 
// // // //           onClick={() => toggleSection(`section${index}`)}
// // // //         >
// // // //           <div className={styles.accordion__label}>
// // // //             {capitalizeWords(item.title.replaceAll('_', ' '))}
// // // //             <span className={styles.chevron}></span>
// // // //           </div>
// // // //           <div className={styles.accordion__content} onClick={preventClose}>
// // // //             <SimpleCodeExample
// // // //               code={item.code}
// // // //               article={item.explanation}
// // // //               codeMode={codeMode}
// // // //               codeTheme={codeTheme}
// // // //               width={'100%'}
// // // //             />
// // // //             {item.related_functions && item.related_functions.length > 0 && (
// // // //               <div className={styles.related_functions}>
// // // //                 <h4>Related Functions:</h4>
// // // //                 <ul>
// // // //                   {item.related_functions.map((func, funcIndex) => (
// // // //                     <li key={funcIndex}>
// // // //                       {link ? (
// // // //                         <Link href={`${link}/${encodeURIComponent(func)}`}>
// // // //                           {func}
// // // //                         </Link>
// // // //                       ) : (
// // // //                         <span>{func}</span>
// // // //                       )}
// // // //                     </li>
// // // //                   ))}
// // // //                 </ul>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       ))}
// // // //     </div>
// // // //   );
// // // // }

// // // // export default CodeExampleAccordion;
// // // import React, { useRef } from 'react';
// // // import styles from './CodeExampleAccordion.module.css';
// // // import SimpleCodeExample from '../../code-example/SimpleCodeExample';
// // // import { capitalizeWords } from '@/utils/functions';
// // // import Link from 'next/link';

// // // function CodeExampleAccordion({ data, link, width = '1000px', codeTheme = 'twilight', codeMode = 'c_cpp' }) {
// // //   const accordionRef = useRef(null);

// // //   const toggleSection = (sectionId) => {
// // //     const sections = accordionRef.current.querySelectorAll(`.${styles.accordion__section}`);
// // //     sections.forEach(section => {
// // //       if (section.id === sectionId) {
// // //         const isOpening = !section.classList.contains(styles.open);
// // //         section.classList.toggle(styles.open);
        
// // //         if (isOpening) {
// // //           // Wait for the section to expand before scrolling
// // //           setTimeout(() => {
// // //             const sectionRect = section.getBoundingClientRect();
// // //             const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
// // //             const finalPosition = sectionRect.top + scrollTop - 30;
            
// // //             window.scrollTo({
// // //               top: finalPosition,
// // //               behavior: 'smooth'
// // //             });
// // //           }, 50);
// // //         }
// // //       } else {
// // //         section.classList.remove(styles.open);
// // //       }
// // //     });
// // //   };

// // //   const preventClose = (event) => {
// // //     event.stopPropagation();
// // //   };

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
// // // import React from 'react';
// // // import styles from './CodeExampleAccordion.module.css';
// // // import SimpleCodeExample from '../../code-example/SimpleCodeExample';
// // // import { capitalizeWords } from '@/utils/functions';
// // // import Link from 'next/link';

// // // function CodeExampleAccordion({ data, link, width = '1000px', codeTheme = 'twilight', codeMode = 'c_cpp' }) {
  
  
// // //   // const toggleSection = (sectionId) => {
// // //   //   const sections = document.querySelectorAll(`.${styles.accordion__section}`);
// // //   //   sections.forEach(section => {
// // //   //     if (section.id === sectionId) {
// // //   //       section.classList.toggle(styles.open);
// // //   //       if (section.classList.contains(styles.open)) {
// // //   //         section.scrollIntoView({ behavior: 'smooth', block: 'start' });
// // //   //         setTimeout(() => {
// // //   //           window.scrollBy(0, -30); // Scrolls up by 30 pixels
// // //   //         }, 1000);
// // //   //       }
// // //   //     } else {
// // //   //       section.classList.remove(styles.open);
// // //   //     }
// // //   //   });
// // //   // };

// // //   const toggleSection = (sectionId) => {
// // //     const sections = document.querySelectorAll(`.${styles.accordion__section}`);
// // //     sections.forEach(section => {
// // //       if (section.id === sectionId) {
// // //         section.classList.toggle(styles.open);
// // //         if (section.classList.contains(styles.open)) {
// // //           setTimeout(() => {
// // //             const yOffset = -30; // Adjust this value as needed
// // //             const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
// // //             window.scrollTo({top: y, behavior: 'smooth'});
// // //           }, 400); // Wait for the section to expand
// // //         }
// // //       } else {
// // //         section.classList.remove(styles.open);
// // //       }
// // //     });
// // //   };
  
// // //   // const toggleSection = (sectionId) => {
// // //   //   const sections = document.querySelectorAll(`.${styles.accordion__section}`);
// // //   //   let targetSection;
    
// // //   //   sections.forEach(section => {
// // //   //     if (section.id === sectionId) {
// // //   //       const isOpening = !section.classList.contains(styles.open);
// // //   //       section.classList.toggle(styles.open);
// // //   //       if (isOpening) {
// // //   //         targetSection = section;
// // //   //       }
// // //   //     } else {
// // //   //       section.classList.remove(styles.open);
// // //   //     }
// // //   //   });
  
// // //   //   if (targetSection) {
// // //   //     // Wait for the content to expand
// // //   //     setTimeout(() => {
// // //   //       const yOffset = -20; // Adjust this value as needed
// // //   //       const sectionRect = targetSection.getBoundingClientRect();
// // //   //       const absoluteY = window.pageYOffset + sectionRect.top + yOffset;
        
// // //   //       window.scrollTo({
// // //   //         top: absoluteY,
// // //   //         behavior: 'smooth'
// // //   //       });
// // //   //     }, 50); // Short delay to allow for initial expansion
// // //   //   }
// // //   // };
 
// // //   const preventClose = (event) => {
// // //     event.stopPropagation();
// // //   };

// // //   return (
// // //     <div className={styles.accordion} style={{ width }}>
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
// // import React from 'react';
// // import styles from './CodeExampleAccordion.module.css';
// // import SimpleCodeExample from '../../code-example/SimpleCodeExample';
// // import { capitalizeWords } from '@/utils/functions';
// // import Link from 'next/link';

// // function CodeExampleAccordion({ data, link, width = '1000px', codeTheme = 'twilight', codeMode = 'c_cpp', idPrefix = '' }) {
  
// //   const toggleSection = (sectionId) => {
// //     const sections = document.querySelectorAll(`.${styles.accordion__section}`);
// //     sections.forEach(section => {
// //       if (section.id === sectionId) {
// //         section.classList.toggle(styles.open);
// //         if (section.classList.contains(styles.open)) {
// //           setTimeout(() => {
// //             const yOffset = -30;
// //             const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
// //             window.scrollTo({top: y, behavior: 'smooth'});
// //           }, 400);
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
// //     <div className={styles.accordion} style={{ width }}>
// //       {data.map((item, index) => (
// //         <div 
// //           key={index} 
// //           id={`${idPrefix}section${index}`} 
// //           className={styles.accordion__section} 
// //           onClick={() => toggleSection(`${idPrefix}section${index}`)}
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
//                         <Link href={`${link}/${encodeURIComponent(func.name)}`}>
//                           {func.name}
//                         </Link>
//                       ) : (
//                         <span>{func.name}</span>
//                       )}
//                       <span className={styles.tooltip}>{func.description}</span>
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
import { lora700,poppins500,poppins400 } from '@/utils/fonts';


const createSlug = (text) => {
  const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
  return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
};

const processContent = (content) => {
  if (typeof content !== 'string') return content;

  const svgs = [];
  const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
    svgs.push(match);
    return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
  });

  const lines = contentWithPlaceholders.split('\n');
  let inList = false;
  let currentListItem = [];
  const elements = [];

  const processPart = (part, index) => {
    if (part.startsWith('__SVG_PLACEHOLDER_')) {
      const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
      return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
    } else if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
    } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
      if (linkMatch) {
        const [, text, url] = linkMatch;
        return <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
      }
    } else if (part.trim().startsWith('<') && part.trim().endsWith('>')) {
      return <div key={`html-${index}`} dangerouslySetInnerHTML={{ __html: part }} />;
    }
    return part;
  };

  lines.forEach((line, lineIndex) => {
    const tabCount = line.match(/^\t*/)[0].length;
    const trimmedLine = line.replace(/^\t+/, '');
    
    const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/);
    const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

    if (trimmedLine.startsWith('- ')) {
      if (inList && currentListItem.length > 0) {
        elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
        currentListItem = [];
      }
      inList = true;
      currentListItem.push(
        <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
          {processedParts.slice(1)}
        </span>
      );
    } else if (inList) {
      if (trimmedLine === '') {
        elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
        currentListItem = [];
        inList = false;
        elements.push(<br key={`br-${elements.length}`} />);
      } else {
        currentListItem.push(<br key={`br-${currentListItem.length}`} />);
        currentListItem.push(
          <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
            {processedParts}
          </span>
        );
      }
    } else {
      elements.push(
        <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
          {processedParts}
        </span>
      );
      if (lineIndex < lines.length - 1) {
        elements.push(<br key={`br-${elements.length}`} />);
      }
    }
  });

  if (inList && currentListItem.length > 0) {
    elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
  }

  const hasListItems = elements.some(el => el.type === 'li');
  return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
};

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
        <React.Fragment key={index}>
          {item.before && (
            <div   className={`${styles.beforeContent} ${poppins500.className}`}>
              {processContent(item.before)}
            </div>
          )}
          <div
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
                  <span onClick={toggleSection} className={styles.chevronContainer}>
                  {/* <svg xmlns="http://www.w3.org/2000/svg" width="44" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-chevron-up"><circle cx="12" cy="12" r="10"/><path d="m8 14 4-4 4 4"/></svg> */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="#b3b3b3" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-chevron-up"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m8 14 4-4 4 4"/></svg>
                   </span>
                  
                </div>
              )}
            </div>
          </div>
          {item.after && (
            <div  className={`${styles.afterContent} ${poppins400.className}`}>
              {processContent(item.after)}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default CodeExampleAccordion;