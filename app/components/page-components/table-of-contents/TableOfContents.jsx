// // // import React from 'react';
// // // import styles from './TableOfContents.module.css';

// // // const createSlug = (text) => {
// // //   // Remove text within parentheses and trim
// // //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// // //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // // };

// // // const TableOfContents = ({ tocItems, baseUrl = '' }) => {
// // //   const renderItems = (items) => {
// // //     return items.map((item, index) => (
// // //       <li key={index} className={styles.item}>
// // //         {item.subItems ? (
// // //           <a 
// // //             href={`#${createSlug(item.title)}`} 
// // //             className={styles.mainLink}
// // //           >
// // //             {item.number} {item.title}
// // //           </a>
// // //         ) : (
// // //           <a 
// // //             href={`${baseUrl}/${createSlug(item.title)}`}
// // //             className={styles.subLink}
// // //           >
// // //             {item.number} {item.title}
// // //           </a>
// // //         )}
// // //         {item.subItems && (
// // //           <ul className={styles.subList}>
// // //             {renderItems(item.subItems)}
// // //           </ul>
// // //         )}
// // //       </li>
// // //     ));
// // //   };

// // //   return (
// // //     <div className={styles.container}>
// // //       <h2 className={styles.title}>Probability Learning Roadmap</h2>
// // //       <ul className={styles.mainList}>
// // //         {renderItems(tocItems)}
// // //       </ul>
// // //     </div>
// // //   );
// // // };

// // // export default TableOfContents;
// // // import React from 'react';
// // // import styles from './TableOfContents.module.css';

// // // const createSlug = (text) => {
// // //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// // //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // // };

// // // const TableOfContents = ({ tocItems, baseUrl = '', showNumbers = true }) => {
// // //   const renderItems = (items, prefix = '') => {
// // //     return items.map((item, index) => {
// // //       const number = showNumbers ? `${prefix}${index + 1}.` : '';
// // //       const fullTitle = `${number} ${item.title}`.trim();
      
// // //       return (
// // //         <li key={index} className={styles.item}>
// // //           {item.subItems ? (
// // //             <a 
// // //               href={`#${createSlug(item.title)}`} 
// // //               className={styles.mainLink}
// // //             >
// // //               {fullTitle}
// // //             </a>
// // //           ) : (
// // //             <a 
// // //               href={`${baseUrl}/${createSlug(item.title)}`}
// // //               className={styles.subLink}
// // //             >
// // //               {fullTitle}
// // //             </a>
// // //           )}
// // //           {item.subItems && (
// // //             <ul className={styles.subList}>
// // //               {renderItems(item.subItems, `${number} `)}
// // //             </ul>
// // //           )}
// // //         </li>
// // //       );
// // //     });
// // //   };

// // //   return (
// // //     <div className={styles.container}>
// // //       <h2 className={styles.title}>Probability Learning Roadmap</h2>
// // //       <ul className={styles.mainList}>
// // //         {renderItems(tocItems)}
// // //       </ul>
// // //     </div>
// // //   );
// // // };

// // // export default TableOfContents;
// // import React from 'react';
// // import styles from './TableOfContents.module.css';

// // const createSlug = (text) => {
// //   const cleanText = text.replace(/\s*\(.*?\)\s*/g, '').trim();
// //   return cleanText.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
// // };

// // const TableOfContents = ({ tocItems, showNumbers = true }) => {
// //   const renderItems = (items, prefix = '', isMainItem = true) => {
// //     return items.map((item, index) => {
// //       const number = showNumbers ? `${prefix}${index + 1}.` : '';
// //       const fullTitle = `${number} ${item.title}`.trim();
      
// //       let content;
// //       if (isMainItem) {
// //         content = <a href={`#${createSlug(item.title)}`} className={styles.mainLink}>{fullTitle}</a>;
// //       } else if (item.link) {
// //         content = <a href={item.link} className={styles.subLink}>{fullTitle}</a>;
// //       } else {
// //         content = <span className={styles.subItem}>{fullTitle}</span>;
// //       }

// //       return (
// //         <li key={index} className={styles.item}>
// //           {content}
// //           {item.subItems && (
// //             <ul className={styles.subList}>
// //               {renderItems(item.subItems, `${number} `, false)}
// //             </ul>
// //           )}
// //         </li>
// //       );
// //     });
// //   };

// //   return (
// //     <div className={styles.container}>
// //       <h4 className={styles.title}>Table of Contents</h4>
// //       <ul className={styles.mainList}>
// //         {renderItems(tocItems)}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default TableOfContents;
// import React from 'react';
// import { InlineMath, BlockMath } from 'react-katex';
// import 'katex/dist/katex.min.css';
// import styles from './TableOfContents.module.css';

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

// const TableOfContents = ({ tocItems, showNumbers = true }) => {
//   const renderItems = (items, prefix = '', isMainItem = true) => {
//     return items.map((item, index) => {
//       const number = showNumbers ? `${prefix}${index + 1}.` : '';
//       const fullTitle = `${number} ${item.title}`.trim();
      
//       let content;
//       if (isMainItem) {
//         content = (
//           <a href={`#${createSlug(item.title)}`} className={styles.mainLink}>
//             {renderMathContent(fullTitle)}
//           </a>
//         );
//       } else if (item.link) {
//         content = (
//           <a href={item.link} className={styles.subLink}>
//             {renderMathContent(fullTitle)}
//           </a>
//         );
//       } else {
//         content = <span className={styles.subItem}>{renderMathContent(fullTitle)}</span>;
//       }

//       return (
//         <li key={index} className={styles.item}>
//           {content}
//           {item.subItems && (
//             <ul className={styles.subList}>
//               {renderItems(item.subItems, `${number} `, false)}
//             </ul>
//           )}
//         </li>
//       );
//     });
//   };

//   return (
//     <div className={styles.container} id='toc'>
//       <h4 className={styles.title}>Table of Contents</h4>
//       <ul className={styles.mainList}>
//         {renderItems(tocItems)}
//       </ul>
//     </div>
//   );
// };

// export default TableOfContents;
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import styles from './TableOfContents.module.css';
import { lora700, poppins500 } from '@/utils/fonts';

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

const TableOfContents = ({ tocItems, showNumbers = true }) => {
  const renderItems = (items, prefix = '', isMainItem = true) => {
    return items.map((item, index) => {
      const number = showNumbers ? `${prefix}${index + 1}.` : '';
      const fullTitle = `${number} ${item.title}`.trim();
      
      let content;
      if (isMainItem) {
        content = item.content ? (
          <a href={`#${createSlug(item.title)}`} className={`${styles.mainLink} ${lora700.className}`}>
            {renderMathContent(fullTitle)}
          </a>
        ) : (
          <span className={`${styles.mainItem} ${lora700.className}`}>{renderMathContent(fullTitle)}</span>
        );
      } else if (item.link) {
        content = (
          <a href={item.link} className={`${styles.subLink} ${roboto.className}`}>
            {renderMathContent(fullTitle)}
          </a>
        );
      } else {
        content = <span className={`${styles.subItem} ${roboto.className}`}>{renderMathContent(fullTitle)}</span>;
      }

      return (
        <li key={index} className={styles.item}>
          {content}
          {item.subItems && (
            <ul className={styles.subList}>
              {renderItems(item.subItems, `${number} `, false)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <div className={styles.container} id='toc'>
        <br></br>
        <br></br>
        <br></br>
        
      <h4 className={styles.title}>Table of Contents</h4>
      <ul className={styles.mainList}>
        {renderItems(tocItems)}
      </ul>
    </div>
  );
};

export default TableOfContents;