// // import React from 'react';
// // import styles from './HierarchyPyramid.module.css';

// // const HierarchyLevel = ({ level, width, marginLeft }) => {
// //   const { title, content, bgColor, color, link } = level;
  
// //   const mainBlockStyle = {
// //     width: `${width}%`,
// //     marginLeft: `${marginLeft}%`,
// //     background: bgColor,
// //     color: color || '#1a1a1a'
// //   };

// //   const topAngleStyle = {
// //     background: bgColor,
// //   };

// //   const TitleComponent = link ? 'a' : 'div';
// //   const titleProps = link ? { href: link } : {};

// //   return (
// //     <div className={styles.levelContainer}>
// //       <div 
// //         className={styles.levelWrapper}
// //         style={mainBlockStyle}
// //       >
// //         <div className={styles.mainBlock} style={{ background: bgColor }} />
// //         <div className={styles.topAngle} style={topAngleStyle} />
// //         <div className={styles.content}>
// //           <TitleComponent 
// //             className={styles.title}
// //             {...titleProps}
// //           >
// //             {title}
// //           </TitleComponent>
// //           {content && (
// //             <div className={styles.description}>{content}</div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const HierarchyPyramid = ({ data }) => {
// //   const processedData = data.map((level, index) => {
// //     const totalLevels = data.length;
// //     const widthStep = 50 / totalLevels;
// //     const marginStep = 35 / totalLevels;
    
// //     return {
// //       width: 40 + (widthStep * index),
// //       marginLeft: 30 - (marginStep * index),
// //       level
// //     };
// //   });

// //   return (
// //     <div className={styles.pyramidContainer}>
// //       {processedData.map((item, index) => (
// //         <HierarchyLevel
// //           key={index}
// //           {...item}
// //         />
// //       ))}
// //     </div>
// //   );
// // };

// // export default HierarchyPyramid;

// // import React from 'react';
// // import styles from './HierarchyPyramid.module.css';

// // const ContentItem = ({ item = {} }) => {
// //   const { title = '', items = [] } = item;
  
// //   return (
// //     <div className={styles.contentItem}>
// //       {title && <span className={styles.contentItemTitle}>{title}</span>}
// //       {Array.isArray(items) && items.length > 0 && (
// //         <div className={styles.codeList}>
// //           {items.map((code, idx) => (
// //             <code key={idx} className={styles.code}>{String(code)}</code>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const HierarchyLevel = ({ level = {}, width = 40, marginLeft = 0 }) => {
// //   const { 
// //     title = '',
// //     content = [],
// //     bgColor = '#e2e8f0',
// //     color = '#1a1a1a',
// //     link = ''
// //   } = level;
  
// //   const mainBlockStyle = {
// //     width: `${width}%`,
// //     marginLeft: `${marginLeft}%`,
// //     background: bgColor,
// //     color
// //   };

// //   const topAngleStyle = {
// //     background: bgColor,
// //   };

// //   const TitleComponent = link ? 'a' : 'div';
// //   const titleProps = link ? { href: link } : {};

// //   return (
// //     <div className={styles.levelContainer}>
// //       <div 
// //         className={styles.levelWrapper}
// //         style={mainBlockStyle}
// //       >
// //         <div className={styles.mainBlock} style={{ background: bgColor }} />
// //         <div className={styles.topAngle} style={topAngleStyle} />
// //         <div className={styles.content}>
// //           {title && (
// //             <TitleComponent 
// //               className={styles.title}
// //               {...titleProps}
// //             >
// //               {title}
// //             </TitleComponent>
// //           )}
// //           {Array.isArray(content) && content.length > 0 && (
// //             <div className={styles.contentWrapper}>
// //               {content.map((item, index) => (
// //                 <ContentItem key={index} item={item} />
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const HierarchyPyramid = ({ data = [] }) => {
// //   const safeData = Array.isArray(data) ? data : [];
  
// //   const processedData = safeData.map((level, index) => {
// //     const totalLevels = safeData.length || 1;
// //     const widthStep = 50 / totalLevels;
// //     const marginStep = 35 / totalLevels;
    
// //     return {
// //       width: 40 + (widthStep * index),
// //       marginLeft: 30 - (marginStep * index),
// //       level
// //     };
// //   });

// //   return (
// //     <div className={styles.pyramidContainer}>
// //       {processedData.map((item, index) => (
// //         <HierarchyLevel
// //           key={index}
// //           {...item}
// //         />
// //       ))}
// //     </div>
// //   );
// // };

// // export default HierarchyPyramid;

// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import styles from './HierarchyPyramid.module.css';

// const ContentItem = ({ item = {} }) => {
//   const { title = '', items = [] } = item;
  
//   return (
//     <div className={styles.contentItem}>
//       <span className={styles.contentItemTitle}>{title}</span>
//       {Array.isArray(items) && items.length > 0 && (
//         <div className={styles.codeList}>
//           {items.map((code, idx) => (
//             <code key={idx} className={styles.code}>{String(code)}</code>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const HierarchyLevel = ({ level = {}, width = 40, marginLeft = 0 }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const {
//     title = '',
//     content = [],
//     bgColor = '#e2e8f0',
//     color = '#1a1a1a',
//     link = ''
//   } = level;

//   const mainBlockStyle = {
//     width: `${width}%`,
//     marginLeft: `${marginLeft}%`,
//     background: bgColor,
//     color
//   };

//   const topAngleStyle = {
//     background: bgColor,
//   };

//   const TitleComponent = link ? 'a' : 'div';
//   const titleProps = link ? { href: link } : {};

//   return (
//     <div className={styles.levelContainer}>
//       <div 
//         className={styles.levelWrapper}
//         style={mainBlockStyle}
//       >
//         <div className={styles.mainBlock} style={{ background: bgColor }} />
//         <div className={styles.topAngle} style={topAngleStyle} />
//         <div className={styles.content}>
//           <div className={styles.titleWrapper} onClick={() => setIsOpen(!isOpen)}>
//             <TitleComponent className={styles.title} {...titleProps}>
//               {title}
//             </TitleComponent>
//             {isOpen ? 
//               <ChevronUp className={styles.chevron} /> : 
//               <ChevronDown className={styles.chevron} />
//             }
//           </div>
//           {isOpen && Array.isArray(content) && content.length > 0 && (
//             <div className={styles.contentWrapper}>
//               {content.map((item, index) => (
//                 <ContentItem key={index} item={item} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const HierarchyPyramid = ({ data = [] }) => {
//   const safeData = Array.isArray(data) ? data : [];

//   const processedData = safeData.map((level, index) => {
//     const totalLevels = safeData.length || 1;
//     const widthStep = 50 / totalLevels;
//     const marginStep = 35 / totalLevels;
    
//     return {
//       width: 40 + (widthStep * index),
//       marginLeft: 30 - (marginStep * index),
//       level
//     };
//   });

//   return (
//     <div className={styles.pyramidContainer}>
//       {processedData.map((item, index) => (
//         <HierarchyLevel
//           key={index}
//           {...item}
//         />
//       ))}
//     </div>
//   );
// };

// export default HierarchyPyramid;

// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import styles from './HierarchyPyramid.module.css';

// const ContentItem = ({ item = {} }) => {
//  const { title = '', items = [] } = item;
//  return (
//    <div className={styles.contentItem}>
//      <span className={styles.contentItemTitle}>{title}</span>
//      {Array.isArray(items) && items.length > 0 && (
//        <div className={styles.codeList}>
//          {items.map((code, idx) => (
//            <code key={idx} className={styles.code}>{String(code)}</code>
//          ))}
//        </div>
//      )}
//    </div>
//  );
// };

// const HierarchyLevel = ({ level = {}, width = 40, marginLeft = 0 }) => {
//  const [isOpen, setIsOpen] = useState(false);
//  const {
//    title = '',
//    content = [],
//    bgColor = '#e2e8f0',
//    color = '#1a1a1a',
//    link = ''
//  } = level;

//  const hasContent = Array.isArray(content) && content.length > 0;

//  const mainBlockStyle = {
//    width: `${width}%`,
//    marginLeft: `${marginLeft}%`,
//    background: bgColor,
//    color
//  };

//  const topAngleStyle = {
//    background: bgColor,
//  };

//  const TitleComponent = link ? 'a' : 'div';
//  const titleProps = link ? { href: link } : {};

//  return (
//    <div className={styles.levelContainer}>
//      <div className={styles.levelWrapper} style={mainBlockStyle}>
//        <div className={styles.mainBlock} style={{ background: bgColor }} />
//        <div className={styles.topAngle} style={topAngleStyle} />
//        <div className={styles.content}>
//          <div className={styles.titleWrapper} onClick={() => hasContent && setIsOpen(!isOpen)}>
//            <TitleComponent className={styles.title} {...titleProps}>
//              {title}
//            </TitleComponent>
//            {hasContent && (
//              isOpen ? <ChevronUp className={styles.chevron} /> : 
//                      <ChevronDown className={styles.chevron} />
//            )}
//          </div>
//          {isOpen && hasContent && (
//            <div className={styles.contentWrapper}>
//              {content.map((item, index) => (
//                <ContentItem key={index} item={item} />
//              ))}
//            </div>
//          )}
//        </div>
//      </div>
//    </div>
//  );
// };

// const HierarchyPyramid = ({ data = [] }) => {
//  const safeData = Array.isArray(data) ? data : [];

//  const processedData = safeData.map((level, index) => {
//    const totalLevels = safeData.length || 1;
//    const widthStep = 50 / totalLevels;
//    const marginStep = 35 / totalLevels;
   
//    return {
//      width: 40 + (widthStep * index),
//      marginLeft: 30 - (marginStep * index),
//      level
//    };
//  });

//  return (
//    <div className={styles.pyramidContainer}>
//      {processedData.map((item, index) => (
//        <HierarchyLevel
//          key={index}
//          {...item}
//        />
//      ))}
//    </div>
//  );
// };

// export default HierarchyPyramid;

// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import styles from './HierarchyPyramid.module.css';
// import { colorSchemes } from './themes';

// const ContentItem = ({ item = {} }) => {
//   const { title = '', items = [] } = item;
//   return (
//     <div className={styles.contentItem}>
//       <span className={styles.contentItemTitle}>{title}</span>
//       {Array.isArray(items) && items.length > 0 && (
//         <div className={styles.codeList}>
//           {items.map((code, idx) => (
//             <code key={idx} className={styles.code}>{String(code)}</code>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const HierarchyLevel = ({ level = {}, width = 40, marginLeft = 0 }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const {
//     title = '',
//     content = [],
//     bgColor = '#e2e8f0',
//     color = '#1a1a1a',
//     link = ''
//   } = level;
  
//   const hasContent = Array.isArray(content) && content.length > 0;
  
//   const mainBlockStyle = {
//     width: `${width}%`,
//     marginLeft: `${marginLeft}%`,
//     background: bgColor,
//     color
//   };
  
//   const topAngleStyle = {
//     background: bgColor,
//   };
  
//   const TitleComponent = link ? 'a' : 'div';
//   const titleProps = link ? { href: link } : {};
  
//   return (
//     <div className={styles.levelContainer}>
//       <div className={styles.levelWrapper} style={mainBlockStyle}>
//         <div className={styles.mainBlock} style={{ background: bgColor }} />
//         <div className={styles.topAngle} style={topAngleStyle} />
//         <div className={styles.content}>
//           <div className={styles.titleWrapper} onClick={() => hasContent && setIsOpen(!isOpen)}>
//             <TitleComponent className={styles.title} {...titleProps}>
//               {title}
//             </TitleComponent>
//             {hasContent && (
//               isOpen ? <ChevronUp className={styles.chevron} /> : 
//                       <ChevronDown className={styles.chevron} />
//             )}
//           </div>
//           {isOpen && hasContent && (
//             <div className={styles.contentWrapper}>
//               {content.map((item, index) => (
//                 <ContentItem key={index} item={item} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const HierarchyPyramid = ({ data = [] }) => {
//   const safeData = Array.isArray(data) ? data : [];
  
//   const processedData = safeData.map((level, index) => {
//     const totalLevels = safeData.length || 1;
//     const widthStep = 50 / totalLevels;
//     const marginStep = 35 / totalLevels;
    
//     return {
//       width: 40 + (widthStep * index),
//       marginLeft: 30 - (marginStep * index),
//       level
//     };
//   });
  
//   return (
//     <div className={styles.pyramidContainer}>
//       {processedData.map((item, index) => (
//         <HierarchyLevel
//           key={index}
//           {...item}
//         />
//       ))}
//     </div>
//   );
// };

// export default HierarchyPyramid;


import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './HierarchyPyramid.module.css';
import { colorSchemes } from './themes';

const ContentItem = ({ item = {} }) => {
  const { title = '', items = [] } = item;
  return (
    <div className={styles.contentItem}>
      <span className={styles.contentItemTitle}>{title}</span>
      {Array.isArray(items) && items.length > 0 && (
        <div className={styles.codeList}>
          {items.map((code, idx) => (
            <code key={idx} className={styles.code}>{String(code)}</code>
          ))}
        </div>
      )}
    </div>
  );
};

const HierarchyLevel = ({ level = {}, width = 40, marginLeft = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    title = '',
    content = [],
    bgColor = '#e2e8f0',
    link = ''
  } = level;
  
  const hasContent = Array.isArray(content) && content.length > 0;
  
  const mainBlockStyle = {
    width: `${width}%`,
    marginLeft: `${marginLeft}%`,
    background: bgColor,
    borderTop: '2px solid #cbd5e1', 
  };
  
  const topAngleStyle = {
    background: bgColor,
    borderTop: '1px solid #cbd5e1', 
  };
  
  const TitleComponent = link ? 'a' : 'div';
  const titleProps = link ? { href: link } : {};
  
  return (
    <div className={styles.levelContainer}>
      <div className={styles.levelWrapper} style={mainBlockStyle}>
        <div className={styles.mainBlock} style={{ background: bgColor }} />
        <div className={styles.topAngle} style={topAngleStyle} />
        <div className={styles.content}>
          <div className={styles.titleWrapper} onClick={() => hasContent && setIsOpen(!isOpen)}>
            <TitleComponent className={styles.title} {...titleProps}>
              {title}
            </TitleComponent>
            {hasContent && (
              isOpen ? <ChevronUp className={styles.chevron} /> : 
                      <ChevronDown className={styles.chevron} />
            )}
          </div>
          {isOpen && hasContent && (
            <div className={styles.contentWrapper}>
              {content.map((item, index) => (
                <ContentItem key={index} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HierarchyPyramid = ({ data = [], theme }) => {
  const safeData = Array.isArray(data) ? data : [];
  
  const processedData = safeData.map((level, index) => {
    const totalLevels = safeData.length || 1;
    const widthStep = 50 / totalLevels;
    const marginStep = 35 / totalLevels;
    
    return {
      width: 40 + (widthStep * index),
      marginLeft: 30 - (marginStep * index),
      level: {
        ...level,
        bgColor: theme ? colorSchemes[theme]?.[index]?.bgColor || '#e2e8f0' : level.bgColor
      }
    };
  });
  
  return (
    <div className={styles.pyramidContainer}>
      {processedData.map((item, index) => (
        <HierarchyLevel
          key={index}
          {...item}
          className={styles.step}
        />
      ))}
    </div>
  );
};

export default HierarchyPyramid;