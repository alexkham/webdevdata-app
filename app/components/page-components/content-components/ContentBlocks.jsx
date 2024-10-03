// // // // // // // // // import React from 'react';
// // // // // // // // // import { InlineMath, BlockMath } from 'react-katex';
// // // // // // // // // import 'katex/dist/katex.min.css';
// // // // // // // // // import styles from './ContentBlocks.module.css';

// // // // // // // // // const createSlug = (text) => {
// // // // // // // // //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// // // // // // // // //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // // // // // // // // };

// // // // // // // // // const renderMathContent = (content) => {
// // // // // // // // //   if (typeof content !== 'string') return content;

// // // // // // // // //   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
// // // // // // // // //   return parts.map((part, index) => {
// // // // // // // // //     if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // // // // //       return <BlockMath key={index} math={part.slice(2, -2)} />;
// // // // // // // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // // // // //       return <InlineMath key={index} math={part.slice(1, -1)} />;
// // // // // // // // //     } else {
// // // // // // // // //       return <span key={index}>{part}</span>;
// // // // // // // // //     }
// // // // // // // // //   });
// // // // // // // // // };

// // // // // // // // // const normalizeText = (text) => {
// // // // // // // // //   return text.toLowerCase().replace(/[^\w\s]/g, '').trim().replace(/\s+/g, ' ');
// // // // // // // // // };

// // // // // // // // // const processContent = (content, subItems) => {
// // // // // // // // //   if (!content || !subItems) return content;

// // // // // // // // //   const normalizedSubtitles = subItems.map(item => ({
// // // // // // // // //     original: item.title,
// // // // // // // // //     normalized: normalizeText(item.title),
// // // // // // // // //     link: item.link // Only use the link if it's provided, no fallback
// // // // // // // // //   }));

// // // // // // // // //   console.log("Normalized Subtitles:", normalizedSubtitles);

// // // // // // // // //   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
  
// // // // // // // // //   return parts.map((part, partIndex) => {
// // // // // // // // //     if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // // // // //       return <BlockMath key={`math-${partIndex}`} math={part.slice(2, -2)} />;
// // // // // // // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // // // // //       return <InlineMath key={`math-${partIndex}`} math={part.slice(1, -1)} />;
// // // // // // // // //     } else {
// // // // // // // // //       let result = [];
// // // // // // // // //       let currentText = '';
// // // // // // // // //       const words = part.split(/(\s+)/);

// // // // // // // // //       const addCurrentText = () => {
// // // // // // // // //         if (currentText) {
// // // // // // // // //           result.push(currentText);
// // // // // // // // //           currentText = '';
// // // // // // // // //         }
// // // // // // // // //       };

// // // // // // // // //       for (let i = 0; i < words.length; i++) {
// // // // // // // // //         currentText += words[i];
        
// // // // // // // // //         // Check for matches of increasing length
// // // // // // // // //         for (let j = i + 1; j <= words.length; j++) {
// // // // // // // // //           const phrase = words.slice(i, j).join('');
// // // // // // // // //           const normalizedPhrase = normalizeText(phrase);
// // // // // // // // //           const match = normalizedSubtitles.find(item => item.normalized === normalizedPhrase);
          
// // // // // // // // //           if (match && match.link) { // Only create a link if match.link exists
// // // // // // // // //             addCurrentText();
// // // // // // // // //             result.push(
// // // // // // // // //               <a key={`link-${result.length}`} href={match.link} className={styles.inlineLink}>
// // // // // // // // //                 {phrase}
// // // // // // // // //               </a>
// // // // // // // // //             );
// // // // // // // // //             currentText = '';
// // // // // // // // //             i = j - 1; // Skip to end of matched phrase
// // // // // // // // //             break;
// // // // // // // // //           }
// // // // // // // // //         }
// // // // // // // // //       }

// // // // // // // // //       addCurrentText();
// // // // // // // // //       return <React.Fragment key={`text-${partIndex}`}>{result}</React.Fragment>;
// // // // // // // // //     }
// // // // // // // // //   });
// // // // // // // // // };

// // // // // // // // // const ContentBlocks = ({ tocItems }) => {
// // // // // // // // //   const mainItems = tocItems.filter(item => item.content);

// // // // // // // // //   return (
// // // // // // // // //     <div className={styles.contentBlocks}>
// // // // // // // // //       {mainItems.map((item, index) => {
// // // // // // // // //         const prevItem = mainItems[index - 1];
// // // // // // // // //         const nextItem = mainItems[index + 1];
// // // // // // // // //         const prevSlug = prevItem ? createSlug(prevItem.title) : null;
// // // // // // // // //         const nextSlug = nextItem ? createSlug(nextItem.title) : null;
        
// // // // // // // // //         const processedContent = processContent(item.content, item.subItems);

// // // // // // // // //         return (
// // // // // // // // //           <section key={index} id={createSlug(item.title)} className={styles.block}>
// // // // // // // // //             <br></br>
// // // // // // // // //             <br></br>
// // // // // // // // //             <br></br>
          
// // // // // // // // //             <h2 className={styles.blockTitle}>{renderMathContent(item.title)}</h2>
// // // // // // // // //             <div className={styles.blockContent}>
// // // // // // // // //               {processedContent}
// // // // // // // // //             </div>
// // // // // // // // //             <div className={styles.navigation}>
// // // // // // // // //               <a href="#toc" className={styles.navButton}>Back to Top</a>
// // // // // // // // //               {prevSlug && (
// // // // // // // // //                 <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
// // // // // // // // //               )}
// // // // // // // // //               {nextSlug && (
// // // // // // // // //                 <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
// // // // // // // // //               )}
// // // // // // // // //             </div>
// // // // // // // // //           </section>
// // // // // // // // //         );
// // // // // // // // //       })}
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default ContentBlocks;
// // // // // // // // import React from 'react';
// // // // // // // // import { InlineMath, BlockMath } from 'react-katex';
// // // // // // // // import 'katex/dist/katex.min.css';
// // // // // // // // import styles from './ContentBlocks.module.css';

// // // // // // // // const createSlug = (text) => {
// // // // // // // //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// // // // // // // //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // // // // // // // };

// // // // // // // // const renderMathContent = (content) => {
// // // // // // // //   if (typeof content !== 'string') return content;

// // // // // // // //   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
// // // // // // // //   return parts.map((part, index) => {
// // // // // // // //     if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // // // //       return <BlockMath key={index} math={part.slice(2, -2)} />;
// // // // // // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // // // //       return <InlineMath key={index} math={part.slice(1, -1)} />;
// // // // // // // //     } else {
// // // // // // // //       return <span key={index}>{part}</span>;
// // // // // // // //     }
// // // // // // // //   });
// // // // // // // // };

// // // // // // // // const normalizeText = (text) => {
// // // // // // // //   return text.toLowerCase().replace(/[^\w\s]/g, '').trim().replace(/\s+/g, ' ');
// // // // // // // // };

// // // // // // // // const processContent = (content, subItems) => {
// // // // // // // //   if (!content || !subItems) return content;

// // // // // // // //   const normalizedSubtitles = subItems.map(item => ({
// // // // // // // //     original: item.title,
// // // // // // // //     normalized: normalizeText(item.title),
// // // // // // // //     link: item.link
// // // // // // // //   }));

// // // // // // // //   const lines = content.split('\n');

// // // // // // // //   return lines.map((line, lineIndex) => {
// // // // // // // //     const parts = line.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
    
// // // // // // // //     const processedParts = parts.map((part, partIndex) => {
// // // // // // // //       if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // // // //         return <BlockMath key={`block-math-${lineIndex}-${partIndex}`} math={part.slice(2, -2)} />;
// // // // // // // //       } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // // // //         return <InlineMath key={`inline-math-${lineIndex}-${partIndex}`} math={part.slice(1, -1)} />;
// // // // // // // //       } else {
// // // // // // // //         let result = [];
// // // // // // // //         let currentText = '';
// // // // // // // //         const words = part.split(/(\s+)/);

// // // // // // // //         const addCurrentText = () => {
// // // // // // // //           if (currentText) {
// // // // // // // //             result.push(currentText);
// // // // // // // //             currentText = '';
// // // // // // // //           }
// // // // // // // //         };

// // // // // // // //         for (let i = 0; i < words.length; i++) {
// // // // // // // //           currentText += words[i];
          
// // // // // // // //           for (let j = i + 1; j <= words.length; j++) {
// // // // // // // //             const phrase = words.slice(i, j).join('');
// // // // // // // //             const normalizedPhrase = normalizeText(phrase);
// // // // // // // //             const match = normalizedSubtitles.find(item => item.normalized === normalizedPhrase);
            
// // // // // // // //             if (match && match.link) {
// // // // // // // //               addCurrentText();
// // // // // // // //               result.push(
// // // // // // // //                 <a key={`link-${lineIndex}-${partIndex}-${i}`} href={match.link} className={styles.inlineLink}>
// // // // // // // //                   {phrase}
// // // // // // // //                 </a>
// // // // // // // //               );
// // // // // // // //               currentText = '';
// // // // // // // //               i = j - 1;
// // // // // // // //               break;
// // // // // // // //             }
// // // // // // // //           }
// // // // // // // //         }

// // // // // // // //         addCurrentText();
// // // // // // // //         return result;
// // // // // // // //       }
// // // // // // // //     });

// // // // // // // //     return (
// // // // // // // //       <React.Fragment key={`line-${lineIndex}`}>
// // // // // // // //         {processedParts}
// // // // // // // //         {lineIndex < lines.length - 1 && <br />}
// // // // // // // //       </React.Fragment>
// // // // // // // //     );
// // // // // // // //   });
// // // // // // // // };

// // // // // // // // const ContentBlocks = ({ tocItems }) => {
// // // // // // // //   const mainItems = tocItems.filter(item => item.content);

// // // // // // // //   return (
// // // // // // // //     <div className={styles.contentBlocks}>
// // // // // // // //       {mainItems.map((item, index) => {
// // // // // // // //         const prevItem = mainItems[index - 1];
// // // // // // // //         const nextItem = mainItems[index + 1];
// // // // // // // //         const prevSlug = prevItem ? createSlug(prevItem.title) : null;
// // // // // // // //         const nextSlug = nextItem ? createSlug(nextItem.title) : null;
        
// // // // // // // //         const processedContent = processContent(item.content, item.subItems);

// // // // // // // //         return (
// // // // // // // //           <section key={index} id={createSlug(item.title)} className={styles.block}>
// // // // // // // //             <br></br>
// // // // // // // //             <br></br>
// // // // // // // //             <br></br>
// // // // // // // //             <h2 className={styles.blockTitle}>{renderMathContent(item.title)}</h2>
// // // // // // // //             <div className={styles.blockContent}>
// // // // // // // //               {processedContent}
// // // // // // // //             </div>
// // // // // // // //             <div className={styles.navigation}>
// // // // // // // //               <a href="#toc" className={styles.navButton}>Back to Top</a>
// // // // // // // //               {prevSlug && (
// // // // // // // //                 <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
// // // // // // // //               )}
// // // // // // // //               {nextSlug && (
// // // // // // // //                 <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
// // // // // // // //               )}
// // // // // // // //             </div>
// // // // // // // //           </section>
// // // // // // // //         );
// // // // // // // //       })}
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default ContentBlocks;
// // // // // // // // import React from 'react';
// // // // // // // // import { InlineMath, BlockMath } from 'react-katex';
// // // // // // // // import 'katex/dist/katex.min.css';
// // // // // // // // import styles from './ContentBlocks.module.css';

// // // // // // // // const createSlug = (text) => {
// // // // // // // //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// // // // // // // //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // // // // // // // };

// // // // // // // // const renderMathContent = (content) => {
// // // // // // // //   if (typeof content !== 'string') return content;

// // // // // // // //   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
// // // // // // // //   return parts.map((part, index) => {
// // // // // // // //     if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // // // //       return <BlockMath key={index} math={part.slice(2, -2)} />;
// // // // // // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // // // //       return <InlineMath key={index} math={part.slice(1, -1)} />;
// // // // // // // //     } else {
// // // // // // // //       return <span key={index}>{part}</span>;
// // // // // // // //     }
// // // // // // // //   });
// // // // // // // // };

// // // // // // // // const normalizeText = (text) => {
// // // // // // // //   return text.toLowerCase().replace(/[^\w\s]/g, '').trim().replace(/\s+/g, ' ');
// // // // // // // // };

// // // // // // // // const processContent = (content, subItems) => {
// // // // // // // //   if (!content || !subItems) return content;

// // // // // // // //   const normalizedSubtitles = subItems.map(item => ({
// // // // // // // //     original: item.title,
// // // // // // // //     normalized: normalizeText(item.title),
// // // // // // // //     link: item.link
// // // // // // // //   }));

// // // // // // // //   const lines = content.split('\n');

// // // // // // // //   return lines.map((line, lineIndex) => {
// // // // // // // //     // Check if the line is a bullet point
// // // // // // // //     const isBulletPoint = line.trim().startsWith('- ');

// // // // // // // //     if (isBulletPoint) {
// // // // // // // //       return (
// // // // // // // //         <li key={`line-${lineIndex}`} className={styles.bulletPoint}>
// // // // // // // //           {renderMathContent(line.trim().slice(2))} {/* Remove the '- ' and render the rest */}
// // // // // // // //         </li>
// // // // // // // //       );
// // // // // // // //     }

// // // // // // // //     const parts = line.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
    
// // // // // // // //     const processedParts = parts.map((part, partIndex) => {
// // // // // // // //       if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // // // //         return <BlockMath key={`block-math-${lineIndex}-${partIndex}`} math={part.slice(2, -2)} />;
// // // // // // // //       } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // // // //         return <InlineMath key={`inline-math-${lineIndex}-${partIndex}`} math={part.slice(1, -1)} />;
// // // // // // // //       } else {
// // // // // // // //         let result = [];
// // // // // // // //         let currentText = '';
// // // // // // // //         const words = part.split(/(\s+)/);

// // // // // // // //         const addCurrentText = () => {
// // // // // // // //           if (currentText) {
// // // // // // // //             result.push(currentText);
// // // // // // // //             currentText = '';
// // // // // // // //           }
// // // // // // // //         };

// // // // // // // //         for (let i = 0; i < words.length; i++) {
// // // // // // // //           currentText += words[i];
          
// // // // // // // //           for (let j = i + 1; j <= words.length; j++) {
// // // // // // // //             const phrase = words.slice(i, j).join('');
// // // // // // // //             const normalizedPhrase = normalizeText(phrase);
// // // // // // // //             const match = normalizedSubtitles.find(item => item.normalized === normalizedPhrase);
            
// // // // // // // //             if (match && match.link) {
// // // // // // // //               addCurrentText();
// // // // // // // //               result.push(
// // // // // // // //                 <a key={`link-${lineIndex}-${partIndex}-${i}`} href={match.link} className={styles.inlineLink}>
// // // // // // // //                   {phrase}
// // // // // // // //                 </a>
// // // // // // // //               );
// // // // // // // //               currentText = '';
// // // // // // // //               i = j - 1;
// // // // // // // //               break;
// // // // // // // //             }
// // // // // // // //           }
// // // // // // // //         }

// // // // // // // //         addCurrentText();
// // // // // // // //         return result;
// // // // // // // //       }
// // // // // // // //     });

// // // // // // // //     return (
// // // // // // // //       <React.Fragment key={`line-${lineIndex}`}>
// // // // // // // //         {processedParts}
// // // // // // // //         {lineIndex < lines.length - 1 && <br />}
// // // // // // // //       </React.Fragment>
// // // // // // // //     );
// // // // // // // //   });
// // // // // // // // };

// // // // // // // // const ContentBlocks = ({ tocItems }) => {
// // // // // // // //   const mainItems = tocItems.filter(item => item.content);

// // // // // // // //   return (
// // // // // // // //     <div className={styles.contentBlocks}>
// // // // // // // //       {mainItems.map((item, index) => {
// // // // // // // //         const prevItem = mainItems[index - 1];
// // // // // // // //         const nextItem = mainItems[index + 1];
// // // // // // // //         const prevSlug = prevItem ? createSlug(prevItem.title) : null;
// // // // // // // //         const nextSlug = nextItem ? createSlug(nextItem.title) : null;
        
// // // // // // // //         const processedContent = processContent(item.content, item.subItems);

// // // // // // // //         // Check if the content contains bullet points
// // // // // // // //         const containsBulletPoints = item.content.includes('- ');

// // // // // // // //         return (
// // // // // // // //           <section key={index} id={createSlug(item.title)} className={styles.block}>
// // // // // // // //             <br></br>
// // // // // // // //             <br></br>
// // // // // // // //             <br></br>
// // // // // // // //             <h2 className={styles.blockTitle}>{renderMathContent(item.title)}</h2>
// // // // // // // //             <div className={styles.blockContent}>
// // // // // // // //               {containsBulletPoints ? (
// // // // // // // //                 <ul>{processedContent}</ul> /* Wrap bullet points in a <ul> */
// // // // // // // //               ) : (
// // // // // // // //                 processedContent
// // // // // // // //               )}
// // // // // // // //             </div>
// // // // // // // //             <div className={styles.navigation}>
// // // // // // // //               <a href="#toc" className={styles.navButton}>Back to Top</a>
// // // // // // // //               {prevSlug && (
// // // // // // // //                 <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
// // // // // // // //               )}
// // // // // // // //               {nextSlug && (
// // // // // // // //                 <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
// // // // // // // //               )}
// // // // // // // //             </div>
// // // // // // // //           </section>
// // // // // // // //         );
// // // // // // // //       })}
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default ContentBlocks;
// // // // // // // import React from 'react';
// // // // // // // import { InlineMath, BlockMath } from 'react-katex';
// // // // // // // import 'katex/dist/katex.min.css';
// // // // // // // import styles from './ContentBlocks.module.css';
// // // // // // // import { Poppins ,Roboto_Slab, Roboto ,Montserrat, Libre_Baskerville ,Lora, Open_Sans, 
// // // // // // //   Playfair_Display, Raleway,Merriweather } from 'next/font/google';

// // // // // // // const poppins = Poppins({
// // // // // // //   weight: '500',
// // // // // // //   style: 'normal',
// // // // // // //   subsets: ['latin'],
// // // // // // // });

// // // // // // // // const robotoSlab = Roboto_Slab({
// // // // // // // //   weight: ['700'],
// // // // // // // //   style: ['normal'],
// // // // // // // //   subsets: ['latin'],
// // // // // // // // });

// // // // // // // // const roboto = Roboto({
// // // // // // // //   weight: ['400', '500'],
// // // // // // // //   style: ['normal', 'italic'],
// // // // // // // //   subsets: ['latin'],
// // // // // // // // });

// // // // // // // // const montserrat = Montserrat({
// // // // // // // //   weight: ['700'],
// // // // // // // //   style: ['normal'],
// // // // // // // //   subsets: ['latin'],
// // // // // // // // });

// // // // // // // // const libreBaskerville = Libre_Baskerville({
// // // // // // // //   weight: ['400', '700'],
// // // // // // // //   style: ['normal', 'italic'],
// // // // // // // //   subsets: ['latin'],
// // // // // // // // });

// // // // // // // const lora = Lora({
// // // // // // //   weight: ['700'],
// // // // // // //   style: ['normal'],
// // // // // // //   subsets: ['latin'],
// // // // // // // });

// // // // // // // // const openSans = Open_Sans({
// // // // // // // //   weight: ['400', '600'],
// // // // // // // //   style: ['normal'],
// // // // // // // //   subsets: ['latin'],
// // // // // // // // });

// // // // // // // // const playfairDisplay = Playfair_Display({
// // // // // // // //   weight: ['700'],
// // // // // // // //   style: ['italic'],
// // // // // // // //   subsets: ['latin'],
// // // // // // // // });

// // // // // // // // const raleway = Raleway({
// // // // // // // //   weight: ['400', '600'],
// // // // // // // //   style: ['normal'],
// // // // // // // //   subsets: ['latin'],
// // // // // // // // });


// // // // // // // // const merriweather = Merriweather({
// // // // // // // //   weight: ['700'],
// // // // // // // //   style: ['normal'],
// // // // // // // //   subsets: ['latin'],
// // // // // // // // });

// // // // // // // // const sourceSansPro = Source_Sans_Pro({
// // // // // // // //   weight: ['400', '600'],
// // // // // // // //   style: ['normal'],
// // // // // // // //   subsets: ['latin'],
// // // // // // // // });


// // // // // // // const createSlug = (text) => {
// // // // // // //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// // // // // // //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // // // // // // };

// // // // // // // const renderMathContent = (content) => {
// // // // // // //   if (typeof content !== 'string') return content;

// // // // // // //   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
// // // // // // //   return parts.map((part, index) => {
// // // // // // //     if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // // //       return <BlockMath key={index} math={part.slice(2, -2)} />;
// // // // // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // // //       return <InlineMath key={index} math={part.slice(1, -1)} />;
// // // // // // //     } else {
// // // // // // //       return <span key={index}>{part}</span>;
// // // // // // //     }
// // // // // // //   });
// // // // // // // };

// // // // // // // const normalizeText = (text) => {
// // // // // // //   return text.toLowerCase().replace(/[^\w\s]/g, '').trim().replace(/\s+/g, ' ');
// // // // // // // };

// // // // // // // // const processContent = (content, subItems) => {
// // // // // // // //   if (!content || !subItems) return content;

// // // // // // // //   const normalizedSubtitles = subItems.map(item => ({
// // // // // // // //     original: item.title,
// // // // // // // //     normalized: normalizeText(item.title),
// // // // // // // //     link: item.link
// // // // // // // //   }));

// // // // // // // //   const lines = content.split('\n');

// // // // // // // //   return lines.map((line, lineIndex) => {
// // // // // // // //     // Check if the line is a bullet point
// // // // // // // //     const isBulletPoint = line.trim().startsWith('- ');

// // // // // // // //     if (isBulletPoint) {
// // // // // // // //       return (
// // // // // // // //         <li key={`line-${lineIndex}`} className={styles.bulletPoint}>
// // // // // // // //           {renderMathContent(line.trim().slice(2))} {/* Remove the '- ' and render the rest */}
// // // // // // // //         </li>
// // // // // // // //       );
// // // // // // // //     }

// // // // // // // //     const parts = line.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
    
// // // // // // // //     const processedParts = parts.map((part, partIndex) => {
// // // // // // // //       if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // // // //         return <BlockMath key={`block-math-${lineIndex}-${partIndex}`} math={part.slice(2, -2)} />;
// // // // // // // //       } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // // // //         return <InlineMath key={`inline-math-${lineIndex}-${partIndex}`} math={part.slice(1, -1)} />;
// // // // // // // //       } else {
// // // // // // // //         let result = [];
// // // // // // // //         let currentText = '';
// // // // // // // //         const words = part.split(/(\s+)/);

// // // // // // // //         const addCurrentText = () => {
// // // // // // // //           if (currentText) {
// // // // // // // //             result.push(currentText);
// // // // // // // //             currentText = '';
// // // // // // // //           }
// // // // // // // //         };

// // // // // // // //         for (let i = 0; i < words.length; i++) {
// // // // // // // //           currentText += words[i];
          
// // // // // // // //           for (let j = i + 1; j <= words.length; j++) {
// // // // // // // //             const phrase = words.slice(i, j).join('');
// // // // // // // //             const normalizedPhrase = normalizeText(phrase);
// // // // // // // //             const match = normalizedSubtitles.find(item => item.normalized === normalizedPhrase);
            
// // // // // // // //             if (match && match.link) {
// // // // // // // //               addCurrentText();
// // // // // // // //               result.push(
// // // // // // // //                 <a key={`link-${lineIndex}-${partIndex}-${i}`} href={match.link} className={styles.inlineLink}>
// // // // // // // //                   {phrase}
// // // // // // // //                 </a>
// // // // // // // //               );
// // // // // // // //               currentText = '';
// // // // // // // //               i = j - 1;
// // // // // // // //               break;
// // // // // // // //             }
// // // // // // // //           }
// // // // // // // //         }

// // // // // // // //         addCurrentText();
// // // // // // // //         return result;
// // // // // // // //       }
// // // // // // // //     });

// // // // // // // //     return (
// // // // // // // //       <React.Fragment key={`line-${lineIndex}`}>
// // // // // // // //         {processedParts}
// // // // // // // //         {lineIndex < lines.length - 1 && <br />}
// // // // // // // //       </React.Fragment>
// // // // // // // //     );
// // // // // // // //   });
// // // // // // // // };

// // // // // // // // const processContent = (content, subItems) => {
// // // // // // // //   if (!content || !subItems) return content;

// // // // // // // //   const normalizedSubtitles = subItems.map(item => ({
// // // // // // // //     original: item.title,
// // // // // // // //     normalized: normalizeText(item.title),
// // // // // // // //     link: item.link
// // // // // // // //   }));

// // // // // // // //   const lines = content.split('\n');

// // // // // // // //   return lines.map((line, lineIndex) => {
// // // // // // // //     // Check if the line is a bullet point
// // // // // // // //     const isBulletPoint = line.trim().startsWith('- ');

// // // // // // // //     // Split the line by bold markers (**text**)
// // // // // // // //     const parts = line.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*)/);

// // // // // // // //     const processedParts = parts.map((part, partIndex) => {
// // // // // // // //       if (part.startsWith('**') && part.endsWith('**')) {
// // // // // // // //         return <strong key={`strong-${lineIndex}-${partIndex}`}>{part.slice(2, -2)}</strong>;
// // // // // // // //       } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // // // //         return <BlockMath key={`block-math-${lineIndex}-${partIndex}`} math={part.slice(2, -2)} />;
// // // // // // // //       } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // // // //         return <InlineMath key={`inline-math-${lineIndex}-${partIndex}`} math={part.slice(1, -1)} />;
// // // // // // // //       } else {
// // // // // // // //         return part;
// // // // // // // //       }
// // // // // // // //     });

// // // // // // // //     if (isBulletPoint) {
// // // // // // // //       return (
// // // // // // // //         <li key={`line-${lineIndex}`} className={styles.bulletPoint}>
// // // // // // // //           {processedParts} {/* Render the processed parts of the bullet point */}
// // // // // // // //         </li>
// // // // // // // //       );
// // // // // // // //     }

// // // // // // // //     return (
// // // // // // // //       <React.Fragment key={`line-${lineIndex}`}>
// // // // // // // //         {processedParts}
// // // // // // // //         {lineIndex < lines.length - 1 && <br />}
// // // // // // // //       </React.Fragment>
// // // // // // // //     );
// // // // // // // //   });
// // // // // // // // };


// // // // // // // // const processContent = (content, subItems) => {
// // // // // // // //   if (!content || !subItems) return content;

// // // // // // // //   const normalizedSubtitles = subItems.map(item => ({
// // // // // // // //     original: item.title,
// // // // // // // //     normalized: normalizeText(item.title),
// // // // // // // //     link: item.link
// // // // // // // //   }));

// // // // // // // //   const lines = content.split('\n');

// // // // // // // //   return lines.map((line, lineIndex) => {
// // // // // // // //     // Check if the line is a bullet point
// // // // // // // //     const isBulletPoint = line.trim().startsWith('- ');

// // // // // // // //     // If it's a bullet point, remove the leading "- "
// // // // // // // //     const text = isBulletPoint ? line.trim().slice(2) : line;

// // // // // // // //     // Split the line by bold markers (**text**) and math markers ($...$ or $$...$$)
// // // // // // // //     const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*)/);

// // // // // // // //     const processedParts = parts.map((part, partIndex) => {
// // // // // // // //       if (part.startsWith('**') && part.endsWith('**')) {
// // // // // // // //         return <strong key={`strong-${lineIndex}-${partIndex}`}>{part.slice(2, -2)}</strong>;
// // // // // // // //       } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // // // //         return <BlockMath key={`block-math-${lineIndex}-${partIndex}`} math={part.slice(2, -2)} />;
// // // // // // // //       } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // // // //         return <InlineMath key={`inline-math-${lineIndex}-${partIndex}`} math={part.slice(1, -1)} />;
// // // // // // // //       } else {
// // // // // // // //         return part;
// // // // // // // //       }
// // // // // // // //     });

// // // // // // // //     if (isBulletPoint) {
// // // // // // // //       return (
// // // // // // // //         <li key={`line-${lineIndex}`} className={styles.bulletPoint}>
// // // // // // // //           {processedParts}
// // // // // // // //         </li>
// // // // // // // //       );
// // // // // // // //     }

// // // // // // // //     return (
// // // // // // // //       <React.Fragment key={`line-${lineIndex}`}>
// // // // // // // //         {processedParts}
// // // // // // // //         {lineIndex < lines.length - 1 && <br />}
// // // // // // // //       </React.Fragment>
// // // // // // // //     );
// // // // // // // //   });
// // // // // // // // };

// // // // // // // const processContent = (content) => {
// // // // // // //   // Split the content by line breaks
// // // // // // //   const lines = content.split('\n');

// // // // // // //   return lines.map((line, lineIndex) => {
// // // // // // //     // Check if the line contains an SVG tag
// // // // // // //     if (line.includes('<svg')) {
// // // // // // //       return (
// // // // // // //         <div
// // // // // // //           key={`svg-${lineIndex}`}
// // // // // // //           dangerouslySetInnerHTML={{ __html: line.trim() }}
// // // // // // //         />
// // // // // // //       );
// // // // // // //     }

// // // // // // //     // Split by bold markers, math markers, etc.
// // // // // // //     const parts = line.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*)/);

// // // // // // //     const processedParts = parts.map((part, partIndex) => {
// // // // // // //       if (part.startsWith('**') && part.endsWith('**')) {
// // // // // // //         return <strong key={`strong-${lineIndex}-${partIndex}`}>{part.slice(2, -2)}</strong>;
// // // // // // //       } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // // //         return <BlockMath key={`block-math-${lineIndex}-${partIndex}`} math={part.slice(2, -2)} />;
// // // // // // //       } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // // //         return <InlineMath key={`inline-math-${lineIndex}-${partIndex}`} math={part.slice(1, -1)} />;
// // // // // // //       } else {
// // // // // // //         return part;
// // // // // // //       }
// // // // // // //     });

// // // // // // //     return (
// // // // // // //       <React.Fragment key={`line-${lineIndex}`}>
// // // // // // //         {processedParts}
// // // // // // //         {lineIndex < lines.length - 1 && <br />}
// // // // // // //       </React.Fragment>
// // // // // // //     );
// // // // // // //   });
// // // // // // // };




// // // // // // // const ContentBlocks = ({ tocItems }) => {
// // // // // // //   const mainItems = tocItems.filter(item => item.content);

// // // // // // //   return (
// // // // // // //     <div className={styles.contentBlocks}>
// // // // // // //       {mainItems.map((item, index) => {
// // // // // // //         const prevItem = mainItems[index - 1];
// // // // // // //         const nextItem = mainItems[index + 1];
// // // // // // //         const prevSlug = prevItem ? createSlug(prevItem.title) : null;
// // // // // // //         const nextSlug = nextItem ? createSlug(nextItem.title) : null;
        
// // // // // // //         const processedContent = processContent(item.content, item.subItems);

// // // // // // //         // Check if the content contains bullet points
// // // // // // //         const containsBulletPoints = item.content.includes('- ');

// // // // // // //         return (
// // // // // // //           <section key={index} id={createSlug(item.title)} className={styles.block}>
// // // // // // //             <br></br>
// // // // // // //             <br></br>
// // // // // // //             <br></br>
// // // // // // //             <h2 className={`${styles.blockTitle} ${lora.className}`}>{renderMathContent(item.title)}</h2>
// // // // // // //             <div className={`${styles.blockContent} ${poppins.className}`}>
// // // // // // //               {containsBulletPoints ? (
// // // // // // //                 <ul>{processedContent}</ul> /* Wrap bullet points in a <ul> */
// // // // // // //               ) : (
// // // // // // //                 processedContent
// // // // // // //               )}
// // // // // // //             </div>
// // // // // // //             <div className={styles.navigation}>
// // // // // // //               <a href="#toc" className={styles.navButton}>Back to Top</a>
// // // // // // //               {prevSlug && (
// // // // // // //                 <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
// // // // // // //               )}
// // // // // // //               {nextSlug && (
// // // // // // //                 <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
// // // // // // //               )}
// // // // // // //             </div>
// // // // // // //           </section>
// // // // // // //         );
// // // // // // //       })}
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default ContentBlocks;
// // // // // // import React from 'react';
// // // // // // import { InlineMath, BlockMath } from 'react-katex';
// // // // // // import 'katex/dist/katex.min.css';
// // // // // // import styles from './ContentBlocks.module.css';
// // // // // // import { Poppins ,Roboto_Slab, Roboto ,Montserrat, Libre_Baskerville ,Lora, Open_Sans, 
// // // // // //   Playfair_Display, Raleway,Merriweather } from 'next/font/google';

// // // // // // const poppins = Poppins({
// // // // // //   weight: '500',
// // // // // //   style: 'normal',
// // // // // //   subsets: ['latin'],
// // // // // // });

// // // // // // // const robotoSlab = Roboto_Slab({
// // // // // // //   weight: ['700'],
// // // // // // //   style: ['normal'],
// // // // // // //   subsets: ['latin'],
// // // // // // // });

// // // // // // // const roboto = Roboto({
// // // // // // //   weight: ['400', '500'],
// // // // // // //   style: ['normal', 'italic'],
// // // // // // //   subsets: ['latin'],
// // // // // // // });

// // // // // // // const montserrat = Montserrat({
// // // // // // //   weight: ['700'],
// // // // // // //   style: ['normal'],
// // // // // // //   subsets: ['latin'],
// // // // // // // });

// // // // // // // const libreBaskerville = Libre_Baskerville({
// // // // // // //   weight: ['400', '700'],
// // // // // // //   style: ['normal', 'italic'],
// // // // // // //   subsets: ['latin'],
// // // // // // // });

// // // // // // const lora = Lora({
// // // // // //   weight: ['700'],
// // // // // //   style: ['normal'],
// // // // // //   subsets: ['latin'],
// // // // // // });

// // // // // // // const openSans = Open_Sans({
// // // // // // //   weight: ['400', '600'],
// // // // // // //   style: ['normal'],
// // // // // // //   subsets: ['latin'],
// // // // // // // });

// // // // // // // const playfairDisplay = Playfair_Display({
// // // // // // //   weight: ['700'],
// // // // // // //   style: ['italic'],
// // // // // // //   subsets: ['latin'],
// // // // // // // });

// // // // // // // const raleway = Raleway({
// // // // // // //   weight: ['400', '600'],
// // // // // // //   style: ['normal'],
// // // // // // //   subsets: ['latin'],
// // // // // // // });

// // // // // // // const merriweather = Merriweather({
// // // // // // //   weight: ['700'],
// // // // // // //   style: ['normal'],
// // // // // // //   subsets: ['latin'],
// // // // // // // });

// // // // // // // const sourceSansPro = Source_Sans_Pro({
// // // // // // //   weight: ['400', '600'],
// // // // // // //   style: ['normal'],
// // // // // // //   subsets: ['latin'],
// // // // // // // });

// // // // // // const createSlug = (text) => {
// // // // // //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// // // // // //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // // // // // };

// // // // // // const renderMathContent = (content) => {
// // // // // //   if (typeof content !== 'string') return content;

// // // // // //   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
// // // // // //   return parts.map((part, index) => {
// // // // // //     if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // //       return <BlockMath key={index} math={part.slice(2, -2)} />;
// // // // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // //       return <InlineMath key={index} math={part.slice(1, -1)} />;
// // // // // //     } else {
// // // // // //       return <span key={index}>{part}</span>;
// // // // // //     }
// // // // // //   });
// // // // // // };

// // // // // // const processContent = (content) => {
// // // // // //   const lines = content.split('\n');

// // // // // //   return lines.map((line, lineIndex) => {
// // // // // //     // Check if the line is a bullet point
// // // // // //     const isBulletPoint = line.trim().startsWith('- ');

// // // // // //     // If it's a bullet point, remove the leading "- "
// // // // // //     const text = isBulletPoint ? line.trim().slice(2) : line;

// // // // // //     // Check if the line contains an SVG tag
// // // // // //     if (text.includes('<svg')) {
// // // // // //       // Extract the complete SVG content
// // // // // //       const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/);
// // // // // //       if (svgMatch) {
// // // // // //         const svgContent = svgMatch[0];
// // // // // //         return (
// // // // // //           <div key={`svg-${lineIndex}`} dangerouslySetInnerHTML={{ __html: svgContent }} />
// // // // // //         );
// // // // // //       }
// // // // // //     }

// // // // // //     // Process other content (math, bold text, etc.)
// // // // // //     const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*)/);

// // // // // //     const processedParts = parts.map((part, partIndex) => {
// // // // // //       if (part.startsWith('**') && part.endsWith('**')) {
// // // // // //         return <strong key={`strong-${lineIndex}-${partIndex}`}>{part.slice(2, -2)}</strong>;
// // // // // //       } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // //         return <BlockMath key={`block-math-${lineIndex}-${partIndex}`} math={part.slice(2, -2)} />;
// // // // // //       } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // //         return <InlineMath key={`inline-math-${lineIndex}-${partIndex}`} math={part.slice(1, -1)} />;
// // // // // //       } else {
// // // // // //         return part;
// // // // // //       }
// // // // // //     });

// // // // // //     if (isBulletPoint) {
// // // // // //       return (
// // // // // //         <li key={`line-${lineIndex}`} className={styles.bulletPoint}>
// // // // // //           {processedParts}
// // // // // //         </li>
// // // // // //       );
// // // // // //     }

// // // // // //     return (
// // // // // //       <React.Fragment key={`line-${lineIndex}`}>
// // // // // //         {processedParts}
// // // // // //         {lineIndex < lines.length - 1 && <br />}
// // // // // //       </React.Fragment>
// // // // // //     );
// // // // // //   });
// // // // // // };

// // // // // // const ContentBlocks = ({ tocItems }) => {
// // // // // //   const mainItems = tocItems.filter(item => item.content);

// // // // // //   return (
// // // // // //     <div className={styles.contentBlocks}>
// // // // // //       {mainItems.map((item, index) => {
// // // // // //         const prevItem = mainItems[index - 1];
// // // // // //         const nextItem = mainItems[index + 1];
// // // // // //         const prevSlug = prevItem ? createSlug(prevItem.title) : null;
// // // // // //         const nextSlug = nextItem ? createSlug(nextItem.title) : null;
        
// // // // // //         const processedContent = processContent(item.content);

// // // // // //         // Check if the content contains bullet points
// // // // // //         const containsBulletPoints = item.content.includes('- ');

// // // // // //         return (
// // // // // //           <section key={index} id={createSlug(item.title)} className={styles.block}>
// // // // // //             <br></br>
// // // // // //             <br></br>
// // // // // //             <br></br>
// // // // // //             <h2 className={`${styles.blockTitle} ${lora.className}`}>{renderMathContent(item.title)}</h2>
// // // // // //             <div className={`${styles.blockContent} ${poppins.className}`}>
// // // // // //               {containsBulletPoints ? (
// // // // // //                 <ul>{processedContent}</ul>
// // // // // //               ) : (
// // // // // //                 processedContent
// // // // // //               )}
// // // // // //             </div>
// // // // // //             <div key={index} dangerouslySetInnerHTML={{ __html: item.svg }} />;
// // // // // //             <div className={styles.navigation}>
// // // // // //               <a href="#toc" className={styles.navButton}>Back to Top</a>
// // // // // //               {prevSlug && (
// // // // // //                 <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
// // // // // //               )}
// // // // // //               {nextSlug && (
// // // // // //                 <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
// // // // // //               )}
// // // // // //             </div>
// // // // // //           </section>
// // // // // //         );
// // // // // //       })}
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default ContentBlocks;
// // // // // // import React from 'react';
// // // // // // import { InlineMath, BlockMath } from 'react-katex';
// // // // // // import 'katex/dist/katex.min.css';
// // // // // // import styles from './ContentBlocks.module.css';
// // // // // // import { lora700,poppins500 } from '@/app/utils/fonts';


// // // // // // const createSlug = (text) => {
// // // // // //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// // // // // //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // // // // // };

// // // // // // const renderMathContent = (content) => {
// // // // // //   if (typeof content !== 'string') return content;

// // // // // //   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
// // // // // //   return parts.map((part, index) => {
// // // // // //     if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // //       return <BlockMath key={index} math={part.slice(2, -2)} />;
// // // // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // //       return <InlineMath key={index} math={part.slice(1, -1)} />;
// // // // // //     } else {
// // // // // //       return <span key={index}>{part}</span>;
// // // // // //     }
// // // // // //   });
// // // // // // };

// // // // // // const parseSVG = (svgString) => {
// // // // // //   const div = document.createElement('div');
// // // // // //   div.innerHTML = svgString.trim();
// // // // // //   return div.firstChild;
// // // // // // };

// // // // // // const SVGComponent = ({ svgString }) => {
// // // // // //   const svgElement = parseSVG(svgString);
// // // // // //   const props = {};

// // // // // //   if (svgElement) {
// // // // // //     Array.from(svgElement.attributes).forEach(attr => {
// // // // // //       props[attr.name] = attr.value;
// // // // // //     });
// // // // // //   }

// // // // // //   return (
// // // // // //     <svg {...props}>
// // // // // //       <g dangerouslySetInnerHTML={{ __html: svgElement ? svgElement.innerHTML : '' }} />
// // // // // //     </svg>
// // // // // //   );
// // // // // // };

// // // // // // // const processContent = (content) => {
// // // // // // //   const lines = content.split('\n');

// // // // // // //   return lines.map((line, lineIndex) => {
// // // // // // //     // Check if the line is a bullet point
// // // // // // //     const isBulletPoint = line.trim().startsWith('- ');

// // // // // // //     // If it's a bullet point, remove the leading "- "
// // // // // // //     const text = isBulletPoint ? line.trim().slice(2) : line;

// // // // // // //     // Check if the line contains an SVG tag
// // // // // // //     if (text.includes('<svg')) {
// // // // // // //       // Extract the complete SVG content
// // // // // // //       const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/);
// // // // // // //       if (svgMatch) {
// // // // // // //         return <SVGComponent key={`svg-${lineIndex}`} svgString={svgMatch[0]} />;
// // // // // // //       }
// // // // // // //     }

// // // // // // //     // Process other content (math, bold text, etc.)
// // // // // // //     const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*)/);

// // // // // // //     const processedParts = parts.map((part, partIndex) => {
// // // // // // //       if (part.startsWith('**') && part.endsWith('**')) {
// // // // // // //         return <strong key={`strong-${lineIndex}-${partIndex}`}>{part.slice(2, -2)}</strong>;
// // // // // // //       } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // // //         return <BlockMath key={`block-math-${lineIndex}-${partIndex}`} math={part.slice(2, -2)} />;
// // // // // // //       } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // // //         return <InlineMath key={`inline-math-${lineIndex}-${partIndex}`} math={part.slice(1, -1)} />;
// // // // // // //       } else {
// // // // // // //         return part;
// // // // // // //       }
// // // // // // //     });

// // // // // // //     if (isBulletPoint) {
// // // // // // //       return (
// // // // // // //         <li key={`line-${lineIndex}`} className={styles.bulletPoint}>
// // // // // // //           {processedParts}
// // // // // // //         </li>
// // // // // // //       );
// // // // // // //     }

// // // // // // //     return (
// // // // // // //       <React.Fragment key={`line-${lineIndex}`}>
// // // // // // //         {processedParts}
// // // // // // //         {lineIndex < lines.length - 1 && <br />}
// // // // // // //       </React.Fragment>
// // // // // // //     );
// // // // // // //   });
// // // // // // // };


// // // // // // // const processContent = (content) => {
// // // // // // //   const parts = content.split(/(<svg[\s\S]*?<\/svg>|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*|\n- )/);

// // // // // // //   const elements = parts.map((part, index) => {
// // // // // // //     if (part.startsWith('<svg')) {
// // // // // // //       // Render SVG content
// // // // // // //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: part }} />;
// // // // // // //     } else if (part.startsWith('**') && part.endsWith('**')) {
// // // // // // //       // Render bold text
// // // // // // //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// // // // // // //     } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // // //       // Render block math
// // // // // // //       return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
// // // // // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // // //       // Render inline math
// // // // // // //       return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
// // // // // // //     } else if (part === '\n- ') {
// // // // // // //       // This identifies the start of a bullet point list item
// // // // // // //       return <li key={`li-${index}`}>{parts[index + 1]}</li>;
// // // // // // //     } else if (index > 0 && parts[index - 1] === '\n- ') {
// // // // // // //       // Skip the text that has already been wrapped in <li>
// // // // // // //       return null;
// // // // // // //     } else {
// // // // // // //       // Render regular text
// // // // // // //       return <span key={`text-${index}`}>{part}</span>;
// // // // // // //     }
// // // // // // //   });

// // // // // // //   // Filter out any null elements and wrap any list items in an <ul>
// // // // // // //   const filteredElements = elements.filter(Boolean);
// // // // // // //   const hasListItems = filteredElements.some(el => el.type === 'li');

// // // // // // //   return hasListItems ? <ul>{filteredElements}</ul> : <>{filteredElements}</>;
// // // // // // // };


// // // // // // // const processContent = (content) => {
// // // // // // //   const parts = content.split(/(<svg[\s\S]*?<\/svg>|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*|\n- )/);

// // // // // // //   let inList = false;
// // // // // // //   const elements = parts.map((part, index) => {
// // // // // // //     if (part.startsWith('<svg')) {
// // // // // // //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: part }} />;
// // // // // // //     } else if (part.startsWith('**') && part.endsWith('**')) {
// // // // // // //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// // // // // // //     } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // // //       return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
// // // // // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // // //       return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
// // // // // // //     } else if (part === '\n- ') {
// // // // // // //       inList = true;
// // // // // // //       return null; // We'll handle the list item in the next iteration
// // // // // // //     } else if (inList) {
// // // // // // //       inList = false; // Reset for the next potential list item
// // // // // // //       return <li key={`li-${index}`}>{part}</li>;
// // // // // // //     } else {
// // // // // // //       return <span key={`text-${index}`}>{part}</span>;
// // // // // // //     }
// // // // // // //   });

// // // // // // //   const filteredElements = elements.filter(Boolean);
// // // // // // //   const hasListItems = filteredElements.some(el => el.type === 'li');

// // // // // // //   return hasListItems ? <ul>{filteredElements}</ul> : <>{filteredElements}</>;
// // // // // // // };

// // // // // // // const processContent = (content) => {
// // // // // // //   const parts = content.split(/(<svg[\s\S]*?<\/svg>|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*|\n- )/);

// // // // // // //   let inList = false;
// // // // // // //   let currentListItem = [];
// // // // // // //   const elements = [];

// // // // // // //   parts.forEach((part, index) => {
// // // // // // //     const processPart = (p) => {
// // // // // // //       if (p.startsWith('<svg')) {
// // // // // // //         return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: p }} />;
// // // // // // //       } else if (p.startsWith('**') && p.endsWith('**')) {
// // // // // // //         return <strong key={`strong-${index}`}>{p.slice(2, -2)}</strong>;
// // // // // // //       } else if (p.startsWith('$$') && p.endsWith('$$')) {
// // // // // // //         return <BlockMath key={`block-math-${index}`} math={p.slice(2, -2)} />;
// // // // // // //       } else if (p.startsWith('$') && p.endsWith('$')) {
// // // // // // //         return <InlineMath key={`inline-math-${index}`} math={p.slice(1, -1)} />;
// // // // // // //       } else {
// // // // // // //         return p;
// // // // // // //       }
// // // // // // //     };

// // // // // // //     if (part === '\n- ') {
// // // // // // //       if (inList) {
// // // // // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // // // // //         currentListItem = [];
// // // // // // //       } else {
// // // // // // //         inList = true;
// // // // // // //       }
// // // // // // //     } else if (inList) {
// // // // // // //       currentListItem.push(processPart(part));
// // // // // // //     } else {
// // // // // // //       elements.push(processPart(part));
// // // // // // //     }
// // // // // // //   });

// // // // // // //   if (inList && currentListItem.length > 0) {
// // // // // // //     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // // // // //   }

// // // // // // //   const hasListItems = elements.some(el => el.type === 'li');
// // // // // // //   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// // // // // // // };


// // // // // // const processContent = (content) => {
// // // // // //   // First, let's extract SVGs and replace them with placeholders
// // // // // //   const svgs = [];
// // // // // //   const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
// // // // // //     svgs.push(match);
// // // // // //     return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
// // // // // //   });

// // // // // //   const lines = contentWithPlaceholders.split('\n');
// // // // // //   let inList = false;
// // // // // //   let currentListItem = [];
// // // // // //   const elements = [];

// // // // // //   const processPart = (part, index) => {
// // // // // //     if (part.startsWith('__SVG_PLACEHOLDER_')) {
// // // // // //       const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
// // // // // //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
// // // // // //     } else if (part.startsWith('**') && part.endsWith('**')) {
// // // // // //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// // // // // //     } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // //       return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
// // // // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // //       return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
// // // // // //     } else {
// // // // // //       return part;
// // // // // //     }
// // // // // //   };

// // // // // //   lines.forEach((line, lineIndex) => {
// // // // // //     const parts = line.split(/(__SVG_PLACEHOLDER_\d+__|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*)/);
// // // // // //     const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

// // // // // //     if (line.trim().startsWith('- ')) {
// // // // // //       if (inList && currentListItem.length > 0) {
// // // // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // // // //         currentListItem = [];
// // // // // //       }
// // // // // //       inList = true;
// // // // // //       currentListItem.push(...processedParts.slice(1)); // Skip the '- ' at the beginning
// // // // // //     } else if (inList) {
// // // // // //       if (line.trim() === '') {
// // // // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // // // //         currentListItem = [];
// // // // // //         inList = false;
// // // // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // // // //       } else {
// // // // // //         currentListItem.push(<br key={`br-${currentListItem.length}`} />);
// // // // // //         currentListItem.push(...processedParts);
// // // // // //       }
// // // // // //     } else {
// // // // // //       elements.push(...processedParts);
// // // // // //       if (lineIndex < lines.length - 1) {
// // // // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // // // //       }
// // // // // //     }
// // // // // //   });

// // // // // //   if (inList && currentListItem.length > 0) {
// // // // // //     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // // // //   }

// // // // // //   const hasListItems = elements.some(el => el.type === 'li');
// // // // // //   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// // // // // // };



// // // // // // const ContentBlocks = ({ tocItems }) => {
// // // // // //   const mainItems = tocItems.filter(item => item.content);

// // // // // //   return (
// // // // // //     <div className={styles.contentBlocks}>
// // // // // //       {mainItems.map((item, index) => {
// // // // // //         const prevItem = mainItems[index - 1];
// // // // // //         const nextItem = mainItems[index + 1];
// // // // // //         const prevSlug = prevItem ? createSlug(prevItem.title) : null;
// // // // // //         const nextSlug = nextItem ? createSlug(nextItem.title) : null;
        
// // // // // //         const processedContent = processContent(item.content);

// // // // // //         // Check if the content contains bullet points
// // // // // //         const containsBulletPoints = item.content.includes('- ');

// // // // // //         return (
// // // // // //           <section key={index} id={createSlug(item.title)} className={styles.block}>
// // // // // //             <br></br>
// // // // // //             <br></br>
            
// // // // // //             <h2 className={`${styles.blockTitle} ${lora700.className}`}>{renderMathContent(item.title)}</h2>
// // // // // //             <div className={`${styles.blockContent} ${poppins500.className}`}>
// // // // // //               {containsBulletPoints ? (
// // // // // //                 <ul>{processedContent}</ul>
// // // // // //               ) : (
// // // // // //                 processedContent
// // // // // //               )}
// // // // // //             </div>
// // // // // //             <div className={styles.navigation}>
// // // // // //               <a href="#toc" className={styles.navButton}>Back to Top</a>
// // // // // //               {prevSlug && (
// // // // // //                 <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
// // // // // //               )}
// // // // // //               {nextSlug && (
// // // // // //                 <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
// // // // // //               )}
// // // // // //             </div>
// // // // // //           </section>
// // // // // //         );
// // // // // //       })}
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default ContentBlocks;
// // // // // import React from 'react';
// // // // // import { InlineMath, BlockMath } from 'react-katex';
// // // // // import 'katex/dist/katex.min.css';
// // // // // import styles from './ContentBlocks.module.css';
// // // // // import { lora700, poppins500 } from '@/app/utils/fonts';

// // // // // const createSlug = (text) => {
// // // // //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// // // // //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // // // // };

// // // // // const renderMathContent = (content) => {
// // // // //   if (typeof content !== 'string') return content;

// // // // //   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
// // // // //   return parts.map((part, index) => {
// // // // //     if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // //       return <BlockMath key={index} math={part.slice(2, -2)} />;
// // // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // //       return <InlineMath key={index} math={part.slice(1, -1)} />;
// // // // //     } else {
// // // // //       return <span key={index}>{part}</span>;
// // // // //     }
// // // // //   });
// // // // // };

// // // // // // const processContent = (content) => {
// // // // // //   // First, let's extract SVGs and replace them with placeholders
// // // // // //   const svgs = [];
// // // // // //   const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
// // // // // //     svgs.push(match);
// // // // // //     return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
// // // // // //   });

// // // // // //   const lines = contentWithPlaceholders.split('\n');
// // // // // //   let inList = false;
// // // // // //   let currentListItem = [];
// // // // // //   const elements = [];

// // // // // //   const processPart = (part, index) => {
// // // // // //     if (part.startsWith('__SVG_PLACEHOLDER_')) {
// // // // // //       const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
// // // // // //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
// // // // // //     } else if (part.startsWith('**') && part.endsWith('**')) {
// // // // // //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// // // // // //     } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // // //       return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
// // // // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // // //       return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
// // // // // //     } else {
// // // // // //       return part;
// // // // // //     }
// // // // // //   };

// // // // // //   lines.forEach((line, lineIndex) => {
// // // // // //     const parts = line.split(/(__SVG_PLACEHOLDER_\d+__|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*)/);
// // // // // //     const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

// // // // // //     if (line.trim().startsWith('- ')) {
// // // // // //       if (inList && currentListItem.length > 0) {
// // // // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // // // //         currentListItem = [];
// // // // // //       }
// // // // // //       inList = true;
// // // // // //       currentListItem.push(...processedParts.slice(1)); // Skip the '- ' at the beginning
// // // // // //     } else if (inList) {
// // // // // //       if (line.trim() === '') {
// // // // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // // // //         currentListItem = [];
// // // // // //         inList = false;
// // // // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // // // //       } else {
// // // // // //         currentListItem.push(<br key={`br-${currentListItem.length}`} />);
// // // // // //         currentListItem.push(...processedParts);
// // // // // //       }
// // // // // //     } else {
// // // // // //       elements.push(...processedParts);
// // // // // //       if (lineIndex < lines.length - 1) {
// // // // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // // // //       }
// // // // // //     }
// // // // // //   });

// // // // // //   if (inList && currentListItem.length > 0) {
// // // // // //     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // // // //   }

// // // // // //   const hasListItems = elements.some(el => el.type === 'li');
// // // // // //   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// // // // // // };


// // // // // const processContent = (content) => {
// // // // //   const svgs = [];
// // // // //   const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
// // // // //     svgs.push(match);
// // // // //     return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
// // // // //   });

// // // // //   const lines = contentWithPlaceholders.split('\n');
// // // // //   let inList = false;
// // // // //   let currentListItem = [];
// // // // //   const elements = [];

// // // // //   const processPart = (part, index) => {
// // // // //     if (part.startsWith('__SVG_PLACEHOLDER_')) {
// // // // //       const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
// // // // //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
// // // // //     } else if (part.startsWith('**') && part.endsWith('**')) {
// // // // //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// // // // //     } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // //       return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
// // // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // //       return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
// // // // //     } else {
// // // // //       return part;
// // // // //     }
// // // // //   };

// // // // //   lines.forEach((line, lineIndex) => {
// // // // //     const tabCount = line.match(/^\t*/)[0].length;
// // // // //     const trimmedLine = line.replace(/^\t+/, '');
    
// // // // //     const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*)/);
// // // // //     const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

// // // // //     if (trimmedLine.startsWith('- ')) {
// // // // //       if (inList && currentListItem.length > 0) {
// // // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // // //         currentListItem = [];
// // // // //       }
// // // // //       inList = true;
// // // // //       currentListItem.push(
// // // // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // // //           {processedParts.slice(1)}
// // // // //         </span>
// // // // //       );
// // // // //     } else if (inList) {
// // // // //       if (trimmedLine === '') {
// // // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // // //         currentListItem = [];
// // // // //         inList = false;
// // // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // // //       } else {
// // // // //         currentListItem.push(<br key={`br-${currentListItem.length}`} />);
// // // // //         currentListItem.push(
// // // // //           <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // // //             {processedParts}
// // // // //           </span>
// // // // //         );
// // // // //       }
// // // // //     } else {
// // // // //       elements.push(
// // // // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // // //           {processedParts}
// // // // //         </span>
// // // // //       );
// // // // //       if (lineIndex < lines.length - 1) {
// // // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // // //       }
// // // // //     }
// // // // //   });

// // // // //   if (inList && currentListItem.length > 0) {
// // // // //     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // // //   }

// // // // //   const hasListItems = elements.some(el => el.type === 'li');
// // // // //   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// // // // // };

// // // // // const ContentBlocks = ({ tocItems }) => {
// // // // //   const mainItems = tocItems.filter(item => item.content || item.before || item.after);

// // // // //   return (
// // // // //     <div className={styles.contentBlocks}>
// // // // //       {mainItems.map((item, index) => {
// // // // //         const prevItem = mainItems[index - 1];
// // // // //         const nextItem = mainItems[index + 1];
// // // // //         const prevSlug = prevItem ? createSlug(prevItem.title) : null;
// // // // //         const nextSlug = nextItem ? createSlug(nextItem.title) : null;
        
// // // // //         const processedContent = item.content ? processContent(item.content) : null;
// // // // //         const processedBefore = item.before ? processContent(item.before) : null;
// // // // //         const processedAfter = item.after ? processContent(item.after) : null;

// // // // //         return (
// // // // //           <section key={index} id={createSlug(item.title)} className={styles.block}>
// // // // //             {processedBefore && (
// // // // //               <div className={`${styles.beforeContent} ${poppins500.className}`}>
// // // // //                 {processedBefore}
// // // // //               </div>
// // // // //             )}
// // // // //             <br />
// // // // //             <br />
            
// // // // //             <h2 className={`${styles.blockTitle} ${lora700.className}`}>{renderMathContent(item.title)}</h2>
// // // // //             {processedContent && (
// // // // //               <div className={`${styles.blockContent} ${poppins500.className}`}>
// // // // //                 {processedContent}
// // // // //               </div>
// // // // //             )}
// // // // //             <div className={styles.navigation}>
// // // // //               <a href="#toc" className={styles.navButton}>Back to Top</a>
// // // // //               {prevSlug && (
// // // // //                 <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
// // // // //               )}
// // // // //               {nextSlug && (
// // // // //                 <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
// // // // //               )}
// // // // //             </div>
// // // // //             {processedAfter && (
// // // // //               <div className={`${styles.afterContent} ${poppins500.className}`}>
// // // // //                 {processedAfter}
// // // // //               </div>
// // // // //             )}
// // // // //           </section>
// // // // //         );
// // // // //       })}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default ContentBlocks;
// // // // import React from 'react';
// // // // import { InlineMath, BlockMath } from 'react-katex';
// // // // import 'katex/dist/katex.min.css';
// // // // import styles from './ContentBlocks.module.css';
// // // // import { lora700, poppins500 } from '@/app/utils/fonts';

// // // // const createSlug = (text) => {
// // // //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// // // //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // // // };

// // // // const renderMathContent = (content) => {
// // // //   if (typeof content !== 'string') return content;

// // // //   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
// // // //   return parts.map((part, index) => {
// // // //     if (part.startsWith('$$') && part.endsWith('$$')) {
// // // //       return <BlockMath key={index} math={part.slice(2, -2)} />;
// // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // //       return <InlineMath key={index} math={part.slice(1, -1)} />;
// // // //     } else {
// // // //       return <span key={index}>{part}</span>;
// // // //     }
// // // //   });
// // // // };

// // // // const processContent = (content) => {
// // // //   const svgs = [];
// // // //   const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
// // // //     svgs.push(match);
// // // //     return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
// // // //   });

// // // //   const lines = contentWithPlaceholders.split('\n');
// // // //   let inList = false;
// // // //   let currentListItem = [];
// // // //   const elements = [];

// // // //   const processPart = (part, index) => {
// // // //     if (part.startsWith('__SVG_PLACEHOLDER_')) {
// // // //       const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
// // // //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
// // // //     } else if (part.startsWith('**') && part.endsWith('**')) {
// // // //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// // // //     } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // // //       return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
// // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // //       return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
// // // //     } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
// // // //       const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
// // // //       if (linkMatch) {
// // // //         const [, text, url] = linkMatch;
// // // //         return <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
// // // //       }
// // // //     }
// // // //     return part;
// // // //   };

// // // //   lines.forEach((line, lineIndex) => {
// // // //     const tabCount = line.match(/^\t*/)[0].length;
// // // //     const trimmedLine = line.replace(/^\t+/, '');
    
// // // //     const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/);
// // // //     const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

// // // //     if (trimmedLine.startsWith('- ')) {
// // // //       if (inList && currentListItem.length > 0) {
// // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // //         currentListItem = [];
// // // //       }
// // // //       inList = true;
// // // //       currentListItem.push(
// // // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // //           {processedParts.slice(1)}
// // // //         </span>
// // // //       );
// // // //     } else if (inList) {
// // // //       if (trimmedLine === '') {
// // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // //         currentListItem = [];
// // // //         inList = false;
// // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // //       } else {
// // // //         currentListItem.push(<br key={`br-${currentListItem.length}`} />);
// // // //         currentListItem.push(
// // // //           <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // //             {processedParts}
// // // //           </span>
// // // //         );
// // // //       }
// // // //     } else {
// // // //       elements.push(
// // // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // //           {processedParts}
// // // //         </span>
// // // //       );
// // // //       if (lineIndex < lines.length - 1) {
// // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // //       }
// // // //     }
// // // //   });

// // // //   if (inList && currentListItem.length > 0) {
// // // //     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // //   }

// // // //   const hasListItems = elements.some(el => el.type === 'li');
// // // //   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// // // // };

// // // // const ContentBlocks = ({ tocItems }) => {
// // // //   const mainItems = tocItems.filter(item => item.content || item.before || item.after);

// // // //   return (
// // // //     <div className={styles.contentBlocks}>
// // // //       {mainItems.map((item, index) => {
// // // //         const prevItem = mainItems[index - 1];
// // // //         const nextItem = mainItems[index + 1];
// // // //         const prevSlug = prevItem ? createSlug(prevItem.title) : null;
// // // //         const nextSlug = nextItem ? createSlug(nextItem.title) : null;
        
// // // //         const processedContent = item.content ? processContent(item.content) : null;
// // // //         const processedBefore = item.before ? processContent(item.before) : null;
// // // //         const processedAfter = item.after ? processContent(item.after) : null;

// // // //         return (
// // // //           <section key={index} id={createSlug(item.title)} className={styles.block}>
// // // //             {processedBefore && (
// // // //               <div className={`${styles.beforeContent} ${poppins500.className}`}>
// // // //                 {processedBefore}
// // // //               </div>
// // // //             )}
// // // //             <br />
// // // //             <br />
            
// // // //             <h2 className={`${styles.blockTitle} ${lora700.className}`}>{renderMathContent(item.title)}</h2>
// // // //             {processedContent && (
// // // //               <div className={`${styles.blockContent} ${poppins500.className}`}>
// // // //                 {processedContent}
// // // //               </div>
// // // //             )}
// // // //             <div className={styles.navigation}>
// // // //               <a href="#toc" className={styles.navButton}>Back to Top</a>
// // // //               {prevSlug && (
// // // //                 <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
// // // //               )}
// // // //               {nextSlug && (
// // // //                 <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
// // // //               )}
// // // //             </div>
// // // //             {processedAfter && (
// // // //               <div className={`${styles.afterContent} ${poppins500.className}`}>
// // // //                 {processedAfter}
// // // //               </div>
// // // //             )}
// // // //           </section>
// // // //         );
// // // //       })}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ContentBlocks;
// // // // import React from 'react';
// // // // import { InlineMath, BlockMath } from 'react-katex';
// // // // import 'katex/dist/katex.min.css';
// // // // import styles from './ContentBlocks.module.css';
// // // // import { lora700, poppins500 } from '@/app/utils/fonts';

// // // // const createSlug = (text) => {
// // // //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// // // //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // // // };

// // // // const renderMathContent = (content) => {
// // // //   if (typeof content !== 'string') return content;

// // // //   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
// // // //   return parts.map((part, index) => {
// // // //     if (part.startsWith('$$') && part.endsWith('$$')) {
// // // //       return <BlockMath key={index} math={part.slice(2, -2)} />;
// // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // //       return <InlineMath key={index} math={part.slice(1, -1)} />;
// // // //     } else {
// // // //       return <span key={index}>{part}</span>;
// // // //     }
// // // //   });
// // // // };

// // // // const parseHTMLContent = (content) => {
// // // //   if (typeof content !== 'string') return content;

// // // //   // Check if the content is HTML-like
// // // //   if (content.trim().startsWith('<') && content.trim().endsWith('>')) {
// // // //     return <div dangerouslySetInnerHTML={{ __html: content }} />;
// // // //   }

// // // //   return content;
// // // // };


// // // // // const processContent = (content) => {
// // // // //   const svgs = [];
// // // // //   const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
// // // // //     svgs.push(match);
// // // // //     return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
// // // // //   });

// // // // //   const lines = contentWithPlaceholders.split('\n');
// // // // //   let inList = false;
// // // // //   let currentListItem = [];
// // // // //   const elements = [];

// // // // //   const processPart = (part, index) => {
// // // // //     if (part.startsWith('__SVG_PLACEHOLDER_')) {
// // // // //       const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
// // // // //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
// // // // //     } else if (part.startsWith('**') && part.endsWith('**')) {
// // // // //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// // // // //     } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // // // //       return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
// // // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // // //       return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
// // // // //     } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
// // // // //       const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
// // // // //       if (linkMatch) {
// // // // //         const [, text, url] = linkMatch;
// // // // //         return <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
// // // // //       }
// // // // //     }
// // // // //     return part;
// // // // //   };

// // // // //   lines.forEach((line, lineIndex) => {
// // // // //     const tabCount = line.match(/^\t*/)[0].length;
// // // // //     const trimmedLine = line.replace(/^\t+/, '');
    
// // // // //     const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/);
// // // // //     const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

// // // // //     if (trimmedLine.startsWith('- ')) {
// // // // //       if (inList && currentListItem.length > 0) {
// // // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // // //         currentListItem = [];
// // // // //       }
// // // // //       inList = true;
// // // // //       currentListItem.push(
// // // // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // // //           {processedParts.slice(1)}
// // // // //         </span>
// // // // //       );
// // // // //     } else if (inList) {
// // // // //       if (trimmedLine === '') {
// // // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // // //         currentListItem = [];
// // // // //         inList = false;
// // // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // // //       } else {
// // // // //         currentListItem.push(<br key={`br-${currentListItem.length}`} />);
// // // // //         currentListItem.push(
// // // // //           <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // // //             {processedParts}
// // // // //           </span>
// // // // //         );
// // // // //       }
// // // // //     } else {
// // // // //       elements.push(
// // // // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // // //           {processedParts}
// // // // //         </span>
// // // // //       );
// // // // //       if (lineIndex < lines.length - 1) {
// // // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // // //       }
// // // // //     }
// // // // //   });

// // // // //   if (inList && currentListItem.length > 0) {
// // // // //     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // // //   }

// // // // //   const hasListItems = elements.some(el => el.type === 'li');
// // // // //   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// // // // // };

// // // // const processContent = (content) => {
// // // //   const svgs = [];
// // // //   const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
// // // //     svgs.push(match);
// // // //     return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
// // // //   });

// // // //   const lines = contentWithPlaceholders.split('\n');
// // // //   let inList = false;
// // // //   let currentListItem = [];
// // // //   const elements = [];

// // // //   const processPart = (part, index) => {
// // // //     if (part.startsWith('__SVG_PLACEHOLDER_')) {
// // // //       const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
// // // //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
// // // //     } else if (part.startsWith('**') && part.endsWith('**')) {
// // // //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// // // //     } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // // //       return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
// // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // //       return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
// // // //     } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
// // // //       const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
// // // //       if (linkMatch) {
// // // //         const [, text, url] = linkMatch;
// // // //         return <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
// // // //       }
// // // //     } else if (part.trim().startsWith('<') && part.trim().endsWith('>')) {
// // // //       return parseHTMLContent(part);
// // // //     }
// // // //     return part;
// // // //   };

// // // //   lines.forEach((line, lineIndex) => {
// // // //     const tabCount = line.match(/^\t*/)[0].length;
// // // //     const trimmedLine = line.replace(/^\t+/, '');
    
// // // //     const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/);
// // // //     const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

// // // //     if (trimmedLine.startsWith('- ')) {
// // // //       if (inList && currentListItem.length > 0) {
// // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // //         currentListItem = [];
// // // //       }
// // // //       inList = true;
// // // //       currentListItem.push(
// // // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // //           {processedParts.slice(1)}
// // // //         </span>
// // // //       );
// // // //     } else if (inList) {
// // // //       if (trimmedLine === '') {
// // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // //         currentListItem = [];
// // // //         inList = false;
// // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // //       } else {
// // // //         currentListItem.push(<br key={`br-${currentListItem.length}`} />);
// // // //         currentListItem.push(
// // // //           <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // //             {processedParts}
// // // //           </span>
// // // //         );
// // // //       }
// // // //     } else {
// // // //       elements.push(
// // // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // //           {processedParts}
// // // //         </span>
// // // //       );
// // // //       if (lineIndex < lines.length - 1) {
// // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // //       }
// // // //     }
// // // //   });

// // // //   if (inList && currentListItem.length > 0) {
// // // //     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // //   }

// // // //   const hasListItems = elements.some(el => el.type === 'li');
// // // //   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// // // // };

// // // // const ContentBlocks = ({ tocItems }) => {
// // // //   const mainItems = tocItems.filter(item => item.content || item.before || item.after);

// // // //   return (
// // // //     <div className={styles.contentBlocks}>
// // // //       {mainItems.map((item, index) => {
// // // //         const prevItem = mainItems[index - 1];
// // // //         const nextItem = mainItems[index + 1];
// // // //         const prevSlug = prevItem ? createSlug(prevItem.title) : null;
// // // //         const nextSlug = nextItem ? createSlug(nextItem.title) : null;
        
// // // //         const processedContent = item.content ? processContent(item.content) : null;
// // // //         const processedBefore = item.before ? item.before : null;
// // // //         const processedAfter = item.after ? item.after : null;

// // // //         return (
// // // //           <section key={index} id={createSlug(item.title)} className={styles.block}>
// // // //             {processedBefore && (
// // // //               <div 
// // // //                 className={`${styles.beforeContent} ${poppins500.className}`}
// // // //                 dangerouslySetInnerHTML={{ __html: processedBefore }}
// // // //               />
// // // //             )}
// // // //             <br />
// // // //             <br />
            
// // // //             <h2 className={`${styles.blockTitle} ${lora700.className}`}>{renderMathContent(item.title)}</h2>
// // // //             {processedContent && (
// // // //               <div className={`${styles.blockContent} ${poppins500.className}`}>
// // // //                 {processedContent}
// // // //               </div>
// // // //             )}
// // // //             <div className={styles.navigation}>
// // // //               <a href="#toc" className={styles.navButton}>Back to Top</a>
// // // //               {prevSlug && (
// // // //                 <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
// // // //               )}
// // // //               {nextSlug && (
// // // //                 <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
// // // //               )}
// // // //             </div>
// // // //             {processedAfter && (
// // // //               <div 
// // // //                 className={`${styles.afterContent} ${poppins500.className}`}
// // // //                 dangerouslySetInnerHTML={{ __html: processedAfter }}
// // // //               />
// // // //             )}
// // // //           </section>
// // // //         );
// // // //       })}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ContentBlocks;
// // // // import React from 'react';
// // // // import { InlineMath, BlockMath } from 'react-katex';
// // // // import 'katex/dist/katex.min.css';
// // // // import styles from './ContentBlocks.module.css';
// // // // import { lora700, poppins500 } from '@/utils/fonts';

// // // // const createSlug = (text) => {
// // // //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// // // //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // // // };

// // // // const renderMathContent = (content) => {
// // // //   if (typeof content !== 'string') return content;

// // // //   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
// // // //   return parts.map((part, index) => {
// // // //     if (part.startsWith('$$') && part.endsWith('$$')) {
// // // //       return <BlockMath key={index} math={part.slice(2, -2)} />;
// // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // //       return <InlineMath key={index} math={part.slice(1, -1)} />;
// // // //     } else {
// // // //       return <span key={index}>{part}</span>;
// // // //     }
// // // //   });
// // // // };

// // // // const parseHTMLContent = (content) => {
// // // //   if (typeof content !== 'string') return content;

// // // //   if (content.trim().startsWith('<') && content.trim().endsWith('>')) {
// // // //     return <div dangerouslySetInnerHTML={{ __html: content }} />;
// // // //   }

// // // //   return content;
// // // // };

// // // // const processContent = (content) => {
// // // //   if (Array.isArray(content)) {
// // // //     return content.map((item, index) => 
// // // //       React.isValidElement(item) ? React.cloneElement(item, { key: index }) : processContent(item)
// // // //     );
// // // //   }

// // // //   if (React.isValidElement(content)) {
// // // //     return content;
// // // //   }

// // // //   if (typeof content !== 'string') {
// // // //     return content;
// // // //   }

// // // //   const svgs = [];
// // // //   const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
// // // //     svgs.push(match);
// // // //     return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
// // // //   });

// // // //   const lines = contentWithPlaceholders.split('\n');
// // // //   let inList = false;
// // // //   let currentListItem = [];
// // // //   const elements = [];

// // // //   const processPart = (part, index) => {
// // // //     if (part.startsWith('__SVG_PLACEHOLDER_')) {
// // // //       const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
// // // //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
// // // //     } else if (part.startsWith('**') && part.endsWith('**')) {
// // // //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// // // //     } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // // //       return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
// // // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // // //       return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
// // // //     } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
// // // //       const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
// // // //       if (linkMatch) {
// // // //         const [, text, url] = linkMatch;
// // // //         return <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
// // // //       }
// // // //     } else if (part.trim().startsWith('<') && part.trim().endsWith('>')) {
// // // //       return parseHTMLContent(part);
// // // //     }
// // // //     return part;
// // // //   };

// // // //   lines.forEach((line, lineIndex) => {
// // // //     const tabCount = line.match(/^\t*/)[0].length;
// // // //     const trimmedLine = line.replace(/^\t+/, '');
    
// // // //     const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/);
// // // //     const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

// // // //     if (trimmedLine.startsWith('- ')) {
// // // //       if (inList && currentListItem.length > 0) {
// // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // //         currentListItem = [];
// // // //       }
// // // //       inList = true;
// // // //       currentListItem.push(
// // // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // //           {processedParts.slice(1)}
// // // //         </span>
// // // //       );
// // // //     } else if (inList) {
// // // //       if (trimmedLine === '') {
// // // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // //         currentListItem = [];
// // // //         inList = false;
// // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // //       } else {
// // // //         currentListItem.push(<br key={`br-${currentListItem.length}`} />);
// // // //         currentListItem.push(
// // // //           <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // //             {processedParts}
// // // //           </span>
// // // //         );
// // // //       }
// // // //     } else {
// // // //       elements.push(
// // // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // // //           {processedParts}
// // // //         </span>
// // // //       );
// // // //       if (lineIndex < lines.length - 1) {
// // // //         elements.push(<br key={`br-${elements.length}`} />);
// // // //       }
// // // //     }
// // // //   });

// // // //   if (inList && currentListItem.length > 0) {
// // // //     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // // //   }

// // // //   const hasListItems = elements.some(el => el.type === 'li');
// // // //   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// // // // };

// // // // const ContentBlocks = ({ tocItems }) => {
// // // //   const mainItems = tocItems.filter(item => item.content || item.before || item.after);

// // // //   return (
// // // //     <div className={styles.contentBlocks}>
// // // //       {mainItems.map((item, index) => {
// // // //         const prevItem = mainItems[index - 1];
// // // //         const nextItem = mainItems[index + 1];
// // // //         const prevSlug = prevItem ? createSlug(prevItem.title) : null;
// // // //         const nextSlug = nextItem ? createSlug(nextItem.title) : null;
// // // //         const currentSlug = createSlug(item.title);
        
// // // //         const processedContent = item.content ? processContent(item.content) : null;
// // // //         const processedBefore = item.before ? processContent(item.before) : null;
// // // //         const processedAfter = item.after ? processContent(item.after) : null;

// // // //         return (
// // // //           <section key={index} id={currentSlug} className={styles.block}>
// // // //             {processedBefore && (
// // // //               <div className={`${styles.beforeContent} ${poppins500.className}`}>
// // // //                 {processedBefore}
// // // //               </div>
// // // //             )}
// // // //             <br />
// // // //             <br />
            
// // // //             <h2 className={`${styles.blockTitle} ${lora700.className}`}>
// // // //               {renderMathContent(item.title)}
// // // //               <a href={`#${currentSlug}`} className={styles.anchorLink} aria-label={`Link to ${item.title}`}>
                
// // // //               </a>
// // // //             </h2>
// // // //             {processedContent && (
// // // //               <div className={`${styles.blockContent} ${poppins500.className}`}>
// // // //                 {processedContent}
// // // //               </div>
// // // //             )}
// // // //             <div className={styles.navigation}>
// // // //               <a href="#toc" className={styles.navButton}>Back to Top</a>
// // // //               {prevSlug && (
// // // //                 <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
// // // //               )}
// // // //               {nextSlug && (
// // // //                 <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
// // // //               )}
// // // //             </div>
// // // //             {processedAfter && (
// // // //               <div className={`${styles.afterContent} ${poppins500.className}`}>
// // // //                 {processedAfter}
// // // //               </div>
// // // //             )}
// // // //           </section>
// // // //         );
// // // //       })}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ContentBlocks;
// // // import React, { useEffect } from 'react';
// // // import { InlineMath, BlockMath } from 'react-katex';
// // // import 'katex/dist/katex.min.css';
// // // import styles from './ContentBlocks.module.css';
// // // import { lora700, poppins500 } from '@/utils/fonts';

// // // const createSlug = (text) => {
// // //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// // //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // // };

// // // const renderMathContent = (content) => {
// // //   if (typeof content !== 'string') return content;

// // //   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
// // //   return parts.map((part, index) => {
// // //     if (part.startsWith('$$') && part.endsWith('$$')) {
// // //       return <BlockMath key={index} math={part.slice(2, -2)} />;
// // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // //       return <InlineMath key={index} math={part.slice(1, -1)} />;
// // //     } else {
// // //       return <span key={index}>{part}</span>;
// // //     }
// // //   });
// // // };

// // // const parseHTMLContent = (content) => {
// // //   if (typeof content !== 'string') return content;

// // //   if (content.trim().startsWith('<') && content.trim().endsWith('>')) {
// // //     return <div dangerouslySetInnerHTML={{ __html: content }} />;
// // //   }

// // //   return content;
// // // };

// // // const processContent = (content) => {
// // //   if (Array.isArray(content)) {
// // //     return content.map((item, index) => 
// // //       React.isValidElement(item) ? React.cloneElement(item, { key: index }) : processContent(item)
// // //     );
// // //   }

// // //   if (React.isValidElement(content)) {
// // //     return content;
// // //   }

// // //   if (typeof content !== 'string') {
// // //     return content;
// // //   }

// // //   const svgs = [];
// // //   const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
// // //     svgs.push(match);
// // //     return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
// // //   });

// // //   const lines = contentWithPlaceholders.split('\n');
// // //   let inList = false;
// // //   let currentListItem = [];
// // //   const elements = [];

// // //   const processPart = (part, index) => {
// // //     if (part.startsWith('__SVG_PLACEHOLDER_')) {
// // //       const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
// // //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
// // //     } else if (part.startsWith('**') && part.endsWith('**')) {
// // //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// // //     } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // //       return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
// // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // //       return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
// // //     } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
// // //       const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
// // //       if (linkMatch) {
// // //         const [, text, url] = linkMatch;
// // //         return <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
// // //       }
// // //     } else if (part.trim().startsWith('<') && part.trim().endsWith('>')) {
// // //       return parseHTMLContent(part);
// // //     }
// // //     return part;
// // //   };

// // //   lines.forEach((line, lineIndex) => {
// // //     const tabCount = line.match(/^\t*/)[0].length;
// // //     const trimmedLine = line.replace(/^\t+/, '');
    
// // //     const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/);
// // //     const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

// // //     if (trimmedLine.startsWith('- ')) {
// // //       if (inList && currentListItem.length > 0) {
// // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // //         currentListItem = [];
// // //       }
// // //       inList = true;
// // //       currentListItem.push(
// // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // //           {processedParts.slice(1)}
// // //         </span>
// // //       );
// // //     } else if (inList) {
// // //       if (trimmedLine === '') {
// // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // //         currentListItem = [];
// // //         inList = false;
// // //         elements.push(<br key={`br-${elements.length}`} />);
// // //       } else {
// // //         currentListItem.push(<br key={`br-${currentListItem.length}`} />);
// // //         currentListItem.push(
// // //           <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // //             {processedParts}
// // //           </span>
// // //         );
// // //       }
// // //     } else {
// // //       elements.push(
// // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // //           {processedParts}
// // //         </span>
// // //       );
// // //       if (lineIndex < lines.length - 1) {
// // //         elements.push(<br key={`br-${elements.length}`} />);
// // //       }
// // //     }
// // //   });

// // //   if (inList && currentListItem.length > 0) {
// // //     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // //   }

// // //   const hasListItems = elements.some(el => el.type === 'li');
// // //   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// // // };

// // // const ContentBlocks = ({ tocItems }) => {
// // //   const mainItems = tocItems.filter(item => item.content || item.before || item.after);

// // //   useEffect(() => {
// // //     const handleAnchorClick = (e) => {
// // //       const href = e.target.getAttribute('href');
// // //       if (href && href.startsWith('#')) {
// // //         e.preventDefault();
// // //         const targetId = href.substring(1);
// // //         const targetElement = document.getElementById(targetId);
// // //         if (targetElement) {
// // //           targetElement.scrollIntoView({ behavior: 'smooth' });
// // //           window.history.pushState(null, '', href);
// // //         }
// // //       }
// // //     };

// // //     document.addEventListener('click', handleAnchorClick);

// // //     return () => {
// // //       document.removeEventListener('click', handleAnchorClick);
// // //     };
// // //   }, []);

// // //   return (
// // //     <div className={styles.contentBlocks}>
// // //       {mainItems.map((item, index) => {
// // //         const prevItem = mainItems[index - 1];
// // //         const nextItem = mainItems[index + 1];
// // //         const prevSlug = prevItem ? createSlug(prevItem.title) : null;
// // //         const nextSlug = nextItem ? createSlug(nextItem.title) : null;
// // //         const currentSlug = createSlug(item.title);
        
// // //         const processedContent = item.content ? processContent(item.content) : null;
// // //         const processedBefore = item.before ? processContent(item.before) : null;
// // //         const processedAfter = item.after ? processContent(item.after) : null;

// // //         return (
// // //           <section key={index} id={currentSlug} className={styles.block}>
// // //             {processedBefore && (
// // //               <div className={`${styles.beforeContent} ${poppins500.className}`}>
// // //                 {processedBefore}
// // //               </div>
// // //             )}
// // //             <br />
// // //             <br />
            
// // //             <h2 className={`${styles.blockTitle} ${lora700.className}`}>
// // //               {renderMathContent(item.title)}
// // //               <a href={`#${currentSlug}`} className={styles.anchorLink} aria-label={`Link to ${item.title}`}>
              
// // //               </a>
// // //             </h2>
// // //             {processedContent && (
// // //               <div className={`${styles.blockContent} ${poppins500.className}`}>
// // //                 {processedContent}
// // //               </div>
// // //             )}
// // //             <div className={styles.navigation}>
// // //               <a href="#toc" className={styles.navButton}>Back to Top</a>
// // //               {prevSlug && (
// // //                 <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
// // //               )}
// // //               {nextSlug && (
// // //                 <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
// // //               )}
// // //             </div>
// // //             {processedAfter && (
// // //               <div className={`${styles.afterContent} ${poppins500.className}`}>
// // //                 {processedAfter}
// // //               </div>
// // //             )}
// // //           </section>
// // //         );
// // //       })}
// // //     </div>
// // //   );
// // // };

// // // export default ContentBlocks;
// // // import React, { useEffect, useRef } from 'react';
// // // import { InlineMath, BlockMath } from 'react-katex';
// // // import 'katex/dist/katex.min.css';
// // // import styles from './ContentBlocks.module.css';
// // // import { lora700, poppins500 } from '@/utils/fonts';

// // // const createSlug = (text) => {
// // //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// // //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // // };

// // // const renderMathContent = (content) => {
// // //   if (typeof content !== 'string') return content;

// // //   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
// // //   return parts.map((part, index) => {
// // //     if (part.startsWith('$$') && part.endsWith('$$')) {
// // //       return <BlockMath key={index} math={part.slice(2, -2)} />;
// // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // //       return <InlineMath key={index} math={part.slice(1, -1)} />;
// // //     } else {
// // //       return <span key={index}>{part}</span>;
// // //     }
// // //   });
// // // };

// // // const parseHTMLContent = (content) => {
// // //   if (typeof content !== 'string') return content;

// // //   if (content.trim().startsWith('<') && content.trim().endsWith('>')) {
// // //     return <div dangerouslySetInnerHTML={{ __html: content }} />;
// // //   }

// // //   return content;
// // // };

// // // const processContent = (content) => {
// // //   if (Array.isArray(content)) {
// // //     return content.map((item, index) => 
// // //       React.isValidElement(item) ? React.cloneElement(item, { key: index }) : processContent(item)
// // //     );
// // //   }

// // //   if (React.isValidElement(content)) {
// // //     return content;
// // //   }

// // //   if (typeof content !== 'string') {
// // //     return content;
// // //   }

// // //   const svgs = [];
// // //   const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
// // //     svgs.push(match);
// // //     return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
// // //   });

// // //   const lines = contentWithPlaceholders.split('\n');
// // //   let inList = false;
// // //   let currentListItem = [];
// // //   const elements = [];

// // //   const processPart = (part, index) => {
// // //     if (part.startsWith('__SVG_PLACEHOLDER_')) {
// // //       const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
// // //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
// // //     } else if (part.startsWith('**') && part.endsWith('**')) {
// // //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// // //     } else if (part.startsWith('$$') && part.endsWith('$$')) {
// // //       return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
// // //     } else if (part.startsWith('$') && part.endsWith('$')) {
// // //       return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
// // //     } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
// // //       const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
// // //       if (linkMatch) {
// // //         const [, text, url] = linkMatch;
// // //         return <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
// // //       }
// // //     } else if (part.trim().startsWith('<') && part.trim().endsWith('>')) {
// // //       return parseHTMLContent(part);
// // //     }
// // //     return part;
// // //   };

// // //   lines.forEach((line, lineIndex) => {
// // //     const tabCount = line.match(/^\t*/)[0].length;
// // //     const trimmedLine = line.replace(/^\t+/, '');
    
// // //     const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/);
// // //     const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

// // //     if (trimmedLine.startsWith('- ')) {
// // //       if (inList && currentListItem.length > 0) {
// // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // //         currentListItem = [];
// // //       }
// // //       inList = true;
// // //       currentListItem.push(
// // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // //           {processedParts.slice(1)}
// // //         </span>
// // //       );
// // //     } else if (inList) {
// // //       if (trimmedLine === '') {
// // //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // //         currentListItem = [];
// // //         inList = false;
// // //         elements.push(<br key={`br-${elements.length}`} />);
// // //       } else {
// // //         currentListItem.push(<br key={`br-${currentListItem.length}`} />);
// // //         currentListItem.push(
// // //           <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // //             {processedParts}
// // //           </span>
// // //         );
// // //       }
// // //     } else {
// // //       elements.push(
// // //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// // //           {processedParts}
// // //         </span>
// // //       );
// // //       if (lineIndex < lines.length - 1) {
// // //         elements.push(<br key={`br-${elements.length}`} />);
// // //       }
// // //     }
// // //   });

// // //   if (inList && currentListItem.length > 0) {
// // //     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// // //   }

// // //   const hasListItems = elements.some(el => el.type === 'li');
// // //   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// // // };

// // // const ContentBlocks = ({ tocItems }) => {
// // //   const mainItems = tocItems.filter(item => item.content || item.before || item.after);
// // //   const contentRef = useRef(null);

// // //   useEffect(() => {
// // //     const handleClick = (event) => {
// // //       const target = event.target;
// // //       if (target.tagName === 'A' && target.getAttribute('href').startsWith('#')) {
// // //         event.preventDefault();
// // //         const id = target.getAttribute('href').slice(1);
// // //         const element = document.getElementById(id);
// // //         if (element) {
// // //           element.scrollIntoView({ behavior: 'smooth' });
// // //           window.history.pushState(null, '', `#${id}`);
// // //         }
// // //       }
// // //     };

// // //     const content = contentRef.current;
// // //     if (content) {
// // //       content.addEventListener('click', handleClick);
// // //     }

// // //     return () => {
// // //       if (content) {
// // //         content.removeEventListener('click', handleClick);
// // //       }
// // //     };
// // //   }, []);

// // //   return (
// // //     <div ref={contentRef} className={styles.contentBlocks}>
// // //       {mainItems.map((item, index) => {
// // //         const prevItem = mainItems[index - 1];
// // //         const nextItem = mainItems[index + 1];
// // //         const prevSlug = prevItem ? createSlug(prevItem.title) : null;
// // //         const nextSlug = nextItem ? createSlug(nextItem.title) : null;
// // //         const currentSlug = createSlug(item.title);
        
// // //         const processedContent = item.content ? processContent(item.content) : null;
// // //         const processedBefore = item.before ? processContent(item.before) : null;
// // //         const processedAfter = item.after ? processContent(item.after) : null;

// // //         return (
// // //           <section key={index} id={currentSlug} className={styles.block}>
// // //             {processedBefore && (
// // //               <div className={`${styles.beforeContent} ${poppins500.className}`}>
// // //                 {processedBefore}
// // //               </div>
// // //             )}
// // //             <br />
// // //             <br />
            
// // //             <h2 className={`${styles.blockTitle} ${lora700.className}`}>
// // //               {renderMathContent(item.title)}
// // //               <a href={`#${currentSlug}`} className={styles.anchorLink} aria-label={`Link to ${item.title}`}>
                
// // //               </a>
// // //             </h2>
// // //             {processedContent && (
// // //               <div className={`${styles.blockContent} ${poppins500.className}`}>
// // //                 {processedContent}
// // //               </div>
// // //             )}
// // //             <div className={styles.navigation}>
// // //               <a href="#toc" className={styles.navButton}>Back to Top</a>
// // //               {prevSlug && (
// // //                 <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
// // //               )}
// // //               {nextSlug && (
// // //                 <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
// // //               )}
// // //             </div>
// // //             {processedAfter && (
// // //               <div className={`${styles.afterContent} ${poppins500.className}`}>
// // //                 {processedAfter}
// // //               </div>
// // //             )}
// // //           </section>
// // //         );
// // //       })}
// // //     </div>
// // //   );
// // // };

// // // export default ContentBlocks;
// // import React, { useEffect, useRef } from 'react';
// // import { InlineMath, BlockMath } from 'react-katex';
// // import 'katex/dist/katex.min.css';
// // import styles from './ContentBlocks.module.css';
// // import { lora700, poppins500 } from '@/utils/fonts';

// // const createSlug = (text) => {
// //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // };

// // const renderMathContent = (content) => {
// //   if (typeof content !== 'string') return content;

// //   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
// //   return parts.map((part, index) => {
// //     if (part.startsWith('$$') && part.endsWith('$$')) {
// //       return <BlockMath key={index} math={part.slice(2, -2)} />;
// //     } else if (part.startsWith('$') && part.endsWith('$')) {
// //       return <InlineMath key={index} math={part.slice(1, -1)} />;
// //     } else {
// //       return <span key={index}>{part}</span>;
// //     }
// //   });
// // };

// // const parseHTMLContent = (content) => {
// //   if (typeof content !== 'string') return content;

// //   if (content.trim().startsWith('<') && content.trim().endsWith('>')) {
// //     return <div dangerouslySetInnerHTML={{ __html: content }} />;
// //   }

// //   return content;
// // };

// // const processContent = (content) => {
// //   if (Array.isArray(content)) {
// //     return content.map((item, index) => 
// //       React.isValidElement(item) ? React.cloneElement(item, { key: index }) : processContent(item)
// //     );
// //   }

// //   if (React.isValidElement(content)) {
// //     return content;
// //   }

// //   if (typeof content !== 'string') {
// //     return content;
// //   }

// //   const svgs = [];
// //   const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
// //     svgs.push(match);
// //     return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
// //   });

// //   const lines = contentWithPlaceholders.split('\n');
// //   let inList = false;
// //   let currentListItem = [];
// //   const elements = [];

// //   const processPart = (part, index) => {
// //     if (part.startsWith('__SVG_PLACEHOLDER_')) {
// //       const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
// //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
// //     } else if (part.startsWith('**') && part.endsWith('**')) {
// //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// //     } else if (part.startsWith('$$') && part.endsWith('$$')) {
// //       return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
// //     } else if (part.startsWith('$') && part.endsWith('$')) {
// //       return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
// //     } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
// //       const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
// //       if (linkMatch) {
// //         const [, text, url] = linkMatch;
// //         return <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
// //       }
// //     } else if (part.trim().startsWith('<') && part.trim().endsWith('>')) {
// //       return <div key={`html-${index}`} dangerouslySetInnerHTML={{ __html: part }} />;
// //     }
// //     return part;
// //   };

// //   lines.forEach((line, lineIndex) => {
// //     const tabCount = line.match(/^\t*/)[0].length;
// //     const trimmedLine = line.replace(/^\t+/, '');
    
// //     const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\)|<[\s\S]*?>)/);
// //     const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

// //     if (trimmedLine.startsWith('- ')) {
// //       if (inList && currentListItem.length > 0) {
// //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// //         currentListItem = [];
// //       }
// //       inList = true;
// //       currentListItem.push(
// //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// //           {processedParts.slice(1)}
// //         </span>
// //       );
// //     } else if (inList) {
// //       if (trimmedLine === '') {
// //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// //         currentListItem = [];
// //         inList = false;
// //         elements.push(<br key={`br-${elements.length}`} />);
// //       } else {
// //         currentListItem.push(<br key={`br-${currentListItem.length}`} />);
// //         currentListItem.push(
// //           <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// //             {processedParts}
// //           </span>
// //         );
// //       }
// //     } else {
// //       elements.push(
// //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// //           {processedParts}
// //         </span>
// //       );
// //       if (lineIndex < lines.length - 1) {
// //         elements.push(<br key={`br-${elements.length}`} />);
// //       }
// //     }
// //   });

// //   if (inList && currentListItem.length > 0) {
// //     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// //   }

// //   const hasListItems = elements.some(el => el.type === 'li');
// //   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// // };

// // const ContentBlocks = ({ tocItems }) => {
// //   const mainItems = tocItems.filter(item => item.content || item.before || item.after);
// //   const contentRef = useRef(null);

// //   useEffect(() => {
// //     const handleClick = (event) => {
// //       const target = event.target;
// //       if (target.tagName === 'A' && target.getAttribute('href').startsWith('#')) {
// //         event.preventDefault();
// //         const id = target.getAttribute('href').slice(1);
// //         const element = document.getElementById(id);
// //         if (element) {
// //           element.scrollIntoView({ behavior: 'smooth' });
// //           window.history.pushState(null, '', `#${id}`);
// //         }
// //       }
// //     };

// //     const content = contentRef.current;
// //     if (content) {
// //       content.addEventListener('click', handleClick);
// //     }

// //     return () => {
// //       if (content) {
// //         content.removeEventListener('click', handleClick);
// //       }
// //     };
// //   }, []);

// //   return (
// //     <div ref={contentRef} className={styles.contentBlocks}>
// //       {mainItems.map((item, index) => {
// //         const prevItem = mainItems[index - 1];
// //         const nextItem = mainItems[index + 1];
// //         const prevSlug = prevItem ? createSlug(prevItem.title) : null;
// //         const nextSlug = nextItem ? createSlug(nextItem.title) : null;
// //         const currentSlug = createSlug(item.title);
        
// //         const processedContent = item.content ? processContent(item.content) : null;
// //         const processedBefore = item.before ? processContent(item.before) : null;
// //         const processedAfter = item.after ? processContent(item.after) : null;

// //         return (
// //           <section key={index} id={currentSlug} className={styles.block}>
// //             {processedBefore && (
// //               <div className={`${styles.beforeContent} ${poppins500.className}`}>
// //                 {processedBefore}
// //               </div>
// //             )}
// //             <br />
// //             <br />
            
// //             <h2 className={`${styles.blockTitle} ${lora700.className}`}>
// //               {renderMathContent(item.title)}
// //               <a href={`#${currentSlug}`} className={styles.anchorLink} aria-label={`Link to ${item.title}`}>
                
// //               </a>
// //             </h2>
// //             {processedContent && (
// //               <div className={`${styles.blockContent} ${poppins500.className}`}>
// //                 {processedContent}
// //               </div>
// //             )}
// //             <div className={styles.navigation}>
// //               <a href="#toc" className={styles.navButton}>Back to Top</a>
// //               {prevSlug && (
// //                 <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
// //               )}
// //               {nextSlug && (
// //                 <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
// //               )}
// //             </div>
// //             {processedAfter && (
// //               <div className={`${styles.afterContent} ${poppins500.className}`}>
// //                 {processedAfter}
// //               </div>
// //             )}
// //           </section>
// //         );
// //       })}
// //     </div>
// //   );
// // };

// // export default ContentBlocks;
// // import React, { useEffect, useRef } from 'react';
// // import { InlineMath, BlockMath } from 'react-katex';
// // import 'katex/dist/katex.min.css';
// // import styles from './ContentBlocks.module.css';
// // import { lora700, poppins500 } from '@/utils/fonts';
// // import ReactMarkdown from 'react-markdown';
// // import remarkMath from 'remark-math';
// // import remarkGfm from 'remark-gfm';

// // const createSlug = (text) => {
// //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // };

// // const renderMathContent = (content) => {
// //   if (typeof content !== 'string') return content;

// //   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
// //   return parts.map((part, index) => {
// //     if (part.startsWith('$$') && part.endsWith('$$')) {
// //       return <BlockMath key={index} math={part.slice(2, -2)} />;
// //     } else if (part.startsWith('$') && part.endsWith('$')) {
// //       return <InlineMath key={index} math={part.slice(1, -1)} />;
// //     } else {
// //       return <span key={index}>{part}</span>;
// //     }
// //   });
// // };

// // const parseHTMLContent = (content) => {
// //   if (typeof content !== 'string') return content;

// //   if (content.trim().startsWith('<') && content.trim().endsWith('>')) {
// //     return <div dangerouslySetInnerHTML={{ __html: content }} />;
// //   }

// //   return content;
// // };

// // const processContent = (content) => {
// //   if (Array.isArray(content)) {
// //     return content.map((item, index) => 
// //       React.isValidElement(item) ? React.cloneElement(item, { key: index }) : processContent(item)
// //     );
// //   }

// //   if (React.isValidElement(content)) {
// //     return content;
// //   }

// //   if (typeof content !== 'string') {
// //     return content;
// //   }

// //   const svgs = [];
// //   const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
// //     svgs.push(match);
// //     return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
// //   });

// //   const lines = contentWithPlaceholders.split('\n');
// //   let inList = false;
// //   let currentListItem = [];
// //   const elements = [];

// //   const processPart = (part, index) => {
// //     if (part.startsWith('__SVG_PLACEHOLDER_')) {
// //       const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
// //       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
// //     } else if (part.startsWith('**') && part.endsWith('**')) {
// //       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
// //     } else if (part.startsWith('$$') && part.endsWith('$$')) {
// //       return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
// //     } else if (part.startsWith('$') && part.endsWith('$')) {
// //       return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
// //     } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
// //       const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
// //       if (linkMatch) {
// //         const [, text, url] = linkMatch;
// //         return <a key={`link-${index}`} href={url} target="_blank" rel="noopener noreferrer">{text}</a>;
// //       }
// //     } else if (part.trim().startsWith('<') && part.trim().endsWith('>')) {
// //       return parseHTMLContent(part);
// //     }
// //     return part;
// //   };

// //   lines.forEach((line, lineIndex) => {
// //     const tabCount = line.match(/^\t*/)[0].length;
// //     const trimmedLine = line.replace(/^\t+/, '');
    
// //     const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/);
// //     const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

// //     if (trimmedLine.startsWith('- ')) {
// //       if (inList && currentListItem.length > 0) {
// //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// //         currentListItem = [];
// //       }
// //       inList = true;
// //       currentListItem.push(
// //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// //           {processedParts.slice(1)}
// //         </span>
// //       );
// //     } else if (inList) {
// //       if (trimmedLine === '') {
// //         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// //         currentListItem = [];
// //         inList = false;
// //         elements.push(<br key={`br-${elements.length}`} />);
// //       } else {
// //         currentListItem.push(<br key={`br-${currentListItem.length}`} />);
// //         currentListItem.push(
// //           <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// //             {processedParts}
// //           </span>
// //         );
// //       }
// //     } else {
// //       elements.push(
// //         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
// //           {processedParts}
// //         </span>
// //       );
// //       if (lineIndex < lines.length - 1) {
// //         elements.push(<br key={`br-${elements.length}`} />);
// //       }
// //     }
// //   });

// //   if (inList && currentListItem.length > 0) {
// //     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
// //   }

// //   const hasListItems = elements.some(el => el.type === 'li');
// //   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// // };

// // const ContentBlocks = ({ tocItems }) => {
// //   const mainItems = tocItems.filter(item => item.content || item.before || item.after);
// //   const contentRef = useRef(null);

// //   useEffect(() => {
// //     const handleClick = (event) => {
// //       const target = event.target;
// //       if (target.tagName === 'A' && target.getAttribute('href').startsWith('#')) {
// //         event.preventDefault();
// //         const id = target.getAttribute('href').slice(1);
// //         const element = document.getElementById(id);
// //         if (element) {
// //           element.scrollIntoView({ behavior: 'smooth' });
// //           window.history.pushState(null, '', `#${id}`);
// //         }
// //       }
// //     };

// //     const content = contentRef.current;
// //     if (content) {
// //       content.addEventListener('click', handleClick);
// //     }

// //     return () => {
// //       if (content) {
// //         content.removeEventListener('click', handleClick);
// //       }
// //     };
// //   }, []);

// //   return (
// //     <div ref={contentRef} className={styles.contentBlocks}>
// //       {mainItems.map((item, index) => {
// //         const prevItem = mainItems[index - 1];
// //         const nextItem = mainItems[index + 1];
// //         const prevSlug = prevItem ? createSlug(prevItem.title) : null;
// //         const nextSlug = nextItem ? createSlug(nextItem.title) : null;
// //         const currentSlug = createSlug(item.title);
        
// //         const processedContent = item.content ? processContent(item.content) : null;
// //         const processedBefore = item.before ? processContent(item.before) : null;
// //         const processedAfter = item.after ? processContent(item.after) : null;

// //         return (
// //           <section key={index} id={currentSlug} className={styles.block}>
// //             {processedBefore && (
// //               <div className={`${styles.beforeContent} ${poppins500.className}`}>
// //                 {processedBefore}
// //               </div>
// //             )}
// //             <br />
// //             <br />
            
// //             <h2 className={`${styles.blockTitle} ${lora700.className}`}>
// //               {renderMathContent(item.title)}
// //               <a href={`#${currentSlug}`} className={styles.anchorLink} aria-label={`Link to ${item.title}`}>
                
// //               </a>
// //             </h2>
// //             {processedContent && (
// //               <div className={`${styles.blockContent} ${poppins500.className}`}>
// //                 {processedContent}
// //               </div>
// //             )}
// //             <div className={styles.navigation}>
// //               <a href="#toc" className={styles.navButton}>Back to Top</a>
// //               {prevSlug && (
// //                 <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
// //               )}
// //               {nextSlug && (
// //                 <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
// //               )}
// //             </div>
// //             {processedAfter && (
// //               <div className={`${styles.afterContent} ${poppins500.className}`}>
// //                 {processedAfter}
// //               </div>
// //             )}
// //           </section>
// //         );
// //       })}
// //     </div>
// //   );
// // };
// // export default ContentBlocks;
// import React, { useEffect, useRef } from 'react';
// import { InlineMath, BlockMath } from 'react-katex';
// import 'katex/dist/katex.min.css';
// import styles from './ContentBlocks.module.css';
// import { lora700, poppins500 } from '@/utils/fonts';
// import ReactMarkdown from 'react-markdown';
// import remarkMath from 'remark-math';
// import remarkGfm from 'remark-gfm';

// const createSlug = (text) => {
//   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
//   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// };

// const renderMathContent = (content) => {
//   if (typeof content !== 'string') return content;

//   const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
//   return parts.map((part, index) => {
//     if (part.startsWith('$$') && part.endsWith('$$')) {
//       return <BlockMath key={index} math={part.slice(2, -2)} />;
//     } else if (part.startsWith('$') && part.endsWith('$')) {
//       return <InlineMath key={index} math={part.slice(1, -1)} />;
//     } else {
//       return <span key={index}>{part}</span>;
//     }
//   });
// };

// const parseHTMLContent = (content) => {
//   if (typeof content !== 'string') return content;

//   if (content.trim().startsWith('<') && content.trim().endsWith('>')) {
//     return <div dangerouslySetInnerHTML={{ __html: content }} />;
//   }

//   return content;
// };

// const processContent = (content) => {
//   if (Array.isArray(content)) {
//     return content.map((item, index) => 
//       React.isValidElement(item) ? React.cloneElement(item, { key: index }) : processContent(item)
//     );
//   }

//   if (React.isValidElement(content)) {
//     return content;
//   }

//   if (typeof content !== 'string') {
//     return content;
//   }

//   const svgs = [];
//   const contentWithPlaceholders = content.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
//     svgs.push(match);
//     return `__SVG_PLACEHOLDER_${svgs.length - 1}__`;
//   });

//   const lines = contentWithPlaceholders.split('\n');
//   let inList = false;
//   let currentListItem = [];
//   const elements = [];

//   const processPart = (part, index) => {
//     if (part.startsWith('__SVG_PLACEHOLDER_')) {
//       const svgIndex = parseInt(part.match(/__SVG_PLACEHOLDER_(\d+)__/)[1]);
//       return <div key={`svg-${index}`} dangerouslySetInnerHTML={{ __html: svgs[svgIndex] }} />;
//     } else if (part.startsWith('**') && part.endsWith('**')) {
//       return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
//     } else if (part.startsWith('$$') && part.endsWith('$$')) {
//       return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
//     } else if (part.startsWith('$') && part.endsWith('$')) {
//       return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
//     } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
//       const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
//       if (linkMatch) {
//         const [, text, url] = linkMatch;
//         const isInternal = url.startsWith('#') || url.startsWith('/');
//         return (
//           <a
//             key={`link-${index}`}
//             href={url}
//             target={isInternal ? "_self" : "_blank"}
//             rel={isInternal ? "" : "noopener noreferrer"}
//           >
//             {text}
//           </a>
//         );
//       }
//     } else if (part.trim().startsWith('<') && part.trim().endsWith('>')) {
//       return parseHTMLContent(part);
//     }
//     return part;
//   };

//   lines.forEach((line, lineIndex) => {
//     const tabCount = line.match(/^\t*/)[0].length;
//     const trimmedLine = line.replace(/^\t+/, '');
    
//     const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/);
//     const processedParts = parts.map((part, partIndex) => processPart(part, `${lineIndex}-${partIndex}`));

//     if (trimmedLine.startsWith('- ')) {
//       if (inList && currentListItem.length > 0) {
//         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
//         currentListItem = [];
//       }
//       inList = true;
//       currentListItem.push(
//         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
//           {processedParts.slice(1)}
//         </span>
//       );
//     } else if (inList) {
//       if (trimmedLine === '') {
//         elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
//         currentListItem = [];
//         inList = false;
//         elements.push(<br key={`br-${elements.length}`} />);
//       } else {
//         currentListItem.push(<br key={`br-${currentListItem.length}`} />);
//         currentListItem.push(
//           <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
//             {processedParts}
//           </span>
//         );
//       }
//     } else {
//       elements.push(
//         <span key={`tab-${lineIndex}`} style={{ marginLeft: `${tabCount * 2}em` }}>
//           {processedParts}
//         </span>
//       );
//       if (lineIndex < lines.length - 1) {
//         elements.push(<br key={`br-${elements.length}`} />);
//       }
//     }
//   });

//   if (inList && currentListItem.length > 0) {
//     elements.push(<li key={`li-${elements.length}`}>{currentListItem}</li>);
//   }

//   const hasListItems = elements.some(el => el.type === 'li');
//   return hasListItems ? <ul>{elements}</ul> : <>{elements}</>;
// };

// const ContentBlocks = ({ tocItems }) => {
//   const mainItems = tocItems.filter(item => item.content || item.before || item.after);
//   const contentRef = useRef(null);

//   useEffect(() => {
//     const handleClick = (event) => {
//       const target = event.target;
//       if (target.tagName === 'A' && target.getAttribute('href').startsWith('#')) {
//         event.preventDefault();
//         const id = target.getAttribute('href').slice(1);
//         const element = document.getElementById(id);
//         if (element) {
//           element.scrollIntoView({ behavior: 'smooth' });
//           window.history.pushState(null, '', `#${id}`);
//         }
//       }
//     };

//     const content = contentRef.current;
//     if (content) {
//       content.addEventListener('click', handleClick);
//     }

//     return () => {
//       if (content) {
//         content.removeEventListener('click', handleClick);
//       }
//     };
//   }, []);

//   return (
//     <div ref={contentRef} className={styles.contentBlocks}>
//       {mainItems.map((item, index) => {
//         const prevItem = mainItems[index - 1];
//         const nextItem = mainItems[index + 1];
//         const prevSlug = prevItem ? createSlug(prevItem.title) : null;
//         const nextSlug = nextItem ? createSlug(nextItem.title) : null;
//         const currentSlug = createSlug(item.title);
        
//         const processedContent = item.content ? processContent(item.content) : null;
//         const processedBefore = item.before ? processContent(item.before) : null;
//         const processedAfter = item.after ? processContent(item.after) : null;

//         return (
//           <section key={index} id={currentSlug} className={styles.block}>
//             {processedBefore && (
//               <div className={`${styles.beforeContent} ${poppins500.className}`}>
//                 {processedBefore}
//               </div>
//             )}
//             <br />
//             <br />
            
//             <h2 className={`${styles.blockTitle} ${lora700.className}`}>
//               {renderMathContent(item.title)}
//               <a href={`#${currentSlug}`} className={styles.anchorLink} aria-label={`Link to ${item.title}`}>
                
//               </a>
//             </h2>
//             {processedContent && (
//               <div className={`${styles.blockContent} ${poppins500.className}`}>
//                 {processedContent}
//               </div>
//             )}
//             <div className={styles.navigation}>
//               <a href="#toc" className={styles.navButton}>Back to Top</a>
//               {prevSlug && (
//                 <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
//               )}
//               {nextSlug && (
//                 <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
//               )}
//             </div>
//             {processedAfter && (
//               <div className={`${styles.afterContent} ${poppins500.className}`}>
//                 {processedAfter}
//               </div>
//             )}
//           </section>
//         );
//       })}
//     </div>
//   );
// };

// export default ContentBlocks;
import React, { useEffect, useRef } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import styles from './ContentBlocks.module.css';
import { lora700, poppins500 } from '@/utils/fonts';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';

const createSlug = (text) => {
  const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
  return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
};

const renderMathContent = (content) => {
  if (typeof content !== 'string') return content;

  const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/);
  return parts.map((part, index) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      return <BlockMath key={index} math={part.slice(2, -2)} />;
    } else if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    } else {
      return <span key={index}>{part}</span>;
    }
  });
};

const parseHTMLContent = (content) => {
  if (typeof content !== 'string') return content;

  if (content.trim().startsWith('<') && content.trim().endsWith('>')) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return content;
};

const processContent = (content) => {
  if (Array.isArray(content)) {
    return content.map((item, index) => 
      React.isValidElement(item) ? React.cloneElement(item, { key: index }) : processContent(item)
    );
  }

  if (React.isValidElement(content)) {
    return content;
  }

  if (typeof content !== 'string') {
    return content;
  }

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
    } else if (part.startsWith('$$') && part.endsWith('$$')) {
      return <BlockMath key={`block-math-${index}`} math={part.slice(2, -2)} />;
    } else if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={`inline-math-${index}`} math={part.slice(1, -1)} />;
    } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const linkMatch = part.match(/\[(.+?)\]\((.+?)\)/);
      if (linkMatch) {
        const [, text, url] = linkMatch;
        const isAbsolute = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
        const isAnchor = url.startsWith('#');
        const isInternal = !isAbsolute && (isAnchor || url.startsWith('/'));

        return (
          <a
          className={styles.link}
            key={`link-${index}`}
            href={url}
            onClick={(e) => {
              if (isAnchor) {
                e.preventDefault();
                const targetId = url.slice(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', url);
                }
              }
            }}
            target={isAbsolute ? "_blank" : "_self"}
            rel={isAbsolute ? "noopener noreferrer" : ""}
          >
            {text}
          </a>
        );
      }
    } else if (part.trim().startsWith('<') && part.trim().endsWith('>')) {
      return parseHTMLContent(part);
    }
    return part;
  };

  lines.forEach((line, lineIndex) => {
    const tabCount = line.match(/^\t*/)[0].length;
    const trimmedLine = line.replace(/^\t+/, '');
    
    const parts = trimmedLine.split(/(__SVG_PLACEHOLDER_\d+__|\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\*\*[\s\S]+?\*\*|\[.+?\]\(.+?\))/);
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

const navigateBack = () => {
  window.history.back()
}


const ContentBlocks = ({ tocItems }) => {
  const mainItems = tocItems.filter(item => item.content || item.before || item.after);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      const target = event.target;
      if (target.tagName === 'A' && target.getAttribute('href').startsWith('#')) {
        event.preventDefault();
        const id = target.getAttribute('href').slice(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', `#${id}`);
        }
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('click', handleClick);
    }

    return () => {
      if (content) {
        content.removeEventListener('click', handleClick);
      }
    };
  }, []);

  return (
    <div ref={contentRef} className={styles.contentBlocks}>
      {mainItems.map((item, index) => {
        const prevItem = mainItems[index - 1];
        const nextItem = mainItems[index + 1];
        const prevSlug = prevItem ? createSlug(prevItem.title) : null;
        const nextSlug = nextItem ? createSlug(nextItem.title) : null;
        const currentSlug = createSlug(item.title);
        
        const processedContent = item.content ? processContent(item.content) : null;
        const processedBefore = item.before ? processContent(item.before) : null;
        const processedAfter = item.after ? processContent(item.after) : null;

        return (
          <section key={index} id={currentSlug} className={styles.block}>
            {processedBefore && (
              <div className={`${styles.beforeContent} ${poppins500.className}`}>
                {processedBefore}
              </div>
            )}
            <br />
            <br />
            <div className={styles.titleContainer}>
            <h2 className={`${styles.blockTitle} ${lora700.className}`}>
              {renderMathContent(item.title)}
              <a href={`#${currentSlug}`} className={styles.anchorLink} aria-label={`Link to ${item.title}`}>
                
              </a>
            </h2>
            <button className={styles.backButton} onClick={navigateBack}>Go Back</button>
            </div>
            {processedContent && (
              <div className={`${styles.blockContent} ${poppins500.className}`}>
                {processedContent}
              </div>
            )}
            <div className={styles.navigation}>
              <a href="#toc" className={styles.navButton}>Back to Top</a>
              {prevSlug && (
                <a href={`#${prevSlug}`} className={styles.navButton}>Previous</a>
              )}
              {nextSlug && (
                <a href={`#${nextSlug}`} className={styles.navButton}>Next</a>
              )}
            </div>
            {processedAfter && (
              <div className={`${styles.afterContent} ${poppins500.className}`}>
                {processedAfter}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default ContentBlocks;