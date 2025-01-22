// // // // // StyledList.jsx
// // // // import React from 'react';
// // // // import { themes, defaultTheme } from './themes';
// // // // import './StyledList.css';

// // // // const StyledList = ({
// // // //   items = [],
// // // //   title = 'List Title',
// // // //   theme = defaultTheme,
// // // //   showNumbers = false,
// // // //   width,
// // // //   height,
// // // //   backgroundColor,
// // // //   textColor
// // // // }) => {
// // // //   const currentTheme = themes[theme] || themes[defaultTheme];

// // // //   // Combine theme styles with custom props
// // // //   const containerStyle = {
// // // //     width: width || '100%',
// // // //     height: height || 'auto',
// // // //     backgroundColor: backgroundColor || currentTheme.styles.backgroundColor,
// // // //     color: textColor || currentTheme.styles.textColor,
// // // //     '--icon-color': currentTheme.styles.iconColor,
// // // //     '--item-background': currentTheme.styles.itemBackground,
// // // //     '--item-hover-background': currentTheme.styles.itemHoverBackground,
// // // //     '--item-border-color': currentTheme.styles.itemBorder,
// // // //     '--item-shadow': currentTheme.styles.itemShadow
// // // //   };

// // // //   // Process items to handle both string and object formats
// // // //   const processedItems = items.map(item => {
// // // //     if (typeof item === 'string') {
// // // //       return { text: item };
// // // //     }
// // // //     return item;
// // // //   });

// // // //   const hasIcons = processedItems.some(item => item.icon);

// // // //   return (
// // // //     <div 
// // // //       className={`styled-list-container ${theme} ${showNumbers ? 'numbered' : ''} ${hasIcons ? 'has-icons' : ''}`}
// // // //       style={containerStyle}
// // // //     >
// // // //       {title && <h2 className="list-title">{title}</h2>}
      
// // // //       <ul className="list-items">
// // // //         {processedItems.map((item, index) => {
// // // //           const ItemIcon = item.icon;
// // // //           const itemClass = [
// // // //             'list-item',
// // // //             theme === 'stacked' ? 'stacked-item' : '',
// // // //             theme === 'timeline' ? 'timeline-item' : ''
// // // //           ].filter(Boolean).join(' ');

// // // //           return (
// // // //             <li key={index} className={itemClass}>
// // // //               {ItemIcon && (
// // // //                 <ItemIcon className="item-icon" />
// // // //               )}
// // // //               <span className="item-text">{item.text}</span>
// // // //             </li>
// // // //           );
// // // //         })}
// // // //       </ul>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default StyledList;

// // // import React from 'react';
// // // import { themes, defaultTheme } from './themes';
// // // import './StyledList.css';

// // // const StyledList = ({
// // //   items = [],
// // //   title = 'List Title',
// // //   theme = defaultTheme,
// // //   showNumbers = false,
// // //   width,
// // //   height,
// // //   backgroundColor,
// // //   textColor
// // // }) => {
// // //   const currentTheme = themes[theme] || themes[defaultTheme];

// // //   const containerStyle = {
// // //     width: width || '100%',
// // //     height: height || 'auto',
// // //     backgroundColor: backgroundColor || currentTheme.styles.backgroundColor,
// // //     color: textColor || currentTheme.styles.textColor,
// // //     '--icon-color': currentTheme.styles.iconColor,
// // //     '--item-background': currentTheme.styles.itemBackground,
// // //     '--item-hover-background': currentTheme.styles.itemHoverBackground,
// // //     '--item-border-color': currentTheme.styles.itemBorder,
// // //     '--item-shadow': currentTheme.styles.itemShadow
// // //   };

// // //   // Process items to handle strings, links and icons
// // //   const processedItems = items.map(item => {
// // //     if (typeof item === 'string') {
// // //       return { text: item };
// // //     }
// // //     return item;
// // //   });

// // //   const hasIcons = processedItems.some(item => item.icon);

// // //   return (
// // //     <div 
// // //       className={`styled-list-container ${theme} ${showNumbers ? 'numbered' : ''} ${hasIcons ? 'has-icons' : ''}`}
// // //       style={containerStyle}
// // //     >
// // //       {title && <h2 className="list-title">{title}</h2>}
      
// // //       <ul className="list-items">
// // //         {processedItems.map((item, index) => {
// // //           const ItemIcon = item.icon;
// // //           const itemClass = [
// // //             'list-item',
// // //             theme === 'stacked' ? 'stacked-item' : '',
// // //             theme === 'timeline' ? 'timeline-item' : ''
// // //           ].filter(Boolean).join(' ');

// // //           const content = item.link ? (
// // //             <a href={item.link} className="item-link" target="_blank" rel="noopener noreferrer">
// // //               {item.text}
// // //             </a>
// // //           ) : (
// // //             <span className="item-text">{item.text}</span>
// // //           );

// // //           return (
// // //             <li key={index} className={itemClass}>
// // //               {ItemIcon && (
// // //                 <ItemIcon className="item-icon" />
// // //               )}
// // //               {content}
// // //             </li>
// // //           );
// // //         })}
// // //       </ul>
// // //     </div>
// // //   );
// // // };

// // // export default StyledList;


// // import React from 'react';
// // import { themes, defaultTheme } from './themes';
// // import './StyledList.css';

// // const StyledList = ({
// //   items = [],
// //   title = 'List Title',
// //   theme = defaultTheme,
// //   showNumbers = false,
// //   width,
// //   height,
// //   backgroundColor,
// //   textColor
// // }) => {
// //   const currentTheme = themes[theme] || themes[defaultTheme];

// //   const containerStyle = {
// //     width: width || '100%',
// //     height: height || 'auto',
// //     backgroundColor: backgroundColor || currentTheme.styles.backgroundColor,
// //     color: textColor || currentTheme.styles.textColor,
// //     '--icon-color': currentTheme.styles.iconColor,
// //     '--item-background': currentTheme.styles.itemBackground,
// //     '--item-hover-background': currentTheme.styles.itemHoverBackground,
// //     '--item-border-color': currentTheme.styles.itemBorder,
// //     '--item-shadow': currentTheme.styles.itemShadow
// //   };

// //   const processedItems = items.map(item => {
// //     if (typeof item === 'string') {
// //       return { text: item };
// //     }
// //     return item;
// //   });

// //   const hasIcons = processedItems.some(item => item.icon);

// //   const renderLink = (item) => {
// //     if (!item.link) return <span className="item-text">{item.text}</span>;

// //     return item.newTab ? (
// //       <a 
// //         href={item.link} 
// //         className="item-link" 
// //         target="_blank" 
// //         rel="noopener noreferrer"
// //       >
// //         {item.text}
// //       </a>
// //     ) : (
// //       <a 
// //         href={item.link} 
// //         className="item-link"
// //       >
// //         {item.text}
// //       </a>
// //     );
// //   };

// //   return (
// //     <div 
// //       className={`styled-list-container ${theme} ${showNumbers ? 'numbered' : ''} ${hasIcons ? 'has-icons' : ''}`}
// //       style={containerStyle}
// //     >
// //       {title && <h2 className="list-title">{title}</h2>}
      
// //       <ul className="list-items">
// //         {processedItems.map((item, index) => {
// //           const ItemIcon = item.icon;
// //           const itemClass = [
// //             'list-item',
// //             theme === 'stacked' ? 'stacked-item' : '',
// //             theme === 'timeline' ? 'timeline-item' : ''
// //           ].filter(Boolean).join(' ');

// //           return (
// //             <li key={index} className={itemClass}>
// //               {ItemIcon && <ItemIcon className="item-icon" />}
// //               {renderLink(item)}
// //             </li>
// //           );
// //         })}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default StyledList;

// import React from 'react';
// import { themes, defaultTheme } from './themes';
// import { processContent } from '@/utils/contentProcessor';
// import './StyledList.css';

// const StyledList = ({
//   items = [],
//   title = 'List Title',
//   theme = defaultTheme,
//   showNumbers = false,
//   width,
//   height,
//   backgroundColor,
//   textColor
// }) => {
//   const currentTheme = themes[theme] || themes[defaultTheme];

//   const containerStyle = {
//     width: width || '100%',
//     height: height || 'auto',
//     backgroundColor: backgroundColor || currentTheme.styles.backgroundColor,
//     color: textColor || currentTheme.styles.textColor,
//     '--icon-color': currentTheme.styles.iconColor,
//     '--item-background': currentTheme.styles.itemBackground,
//     '--item-hover-background': currentTheme.styles.itemHoverBackground,
//     '--item-border-color': currentTheme.styles.itemBorder,
//     '--item-shadow': currentTheme.styles.itemShadow
//   };

//   const processedItems = items.map(item => {
//     if (typeof item === 'string') {
//       return { text: item };
//     }
//     return item;
//   });

//   const hasIcons = processedItems.some(item => item.icon);

//   return (
//     <div 
//       className={`styled-list-container ${theme} ${showNumbers ? 'numbered' : ''} ${hasIcons ? 'has-icons' : ''}`}
//       style={containerStyle}
//     >
//       {title && <h2 className="list-title">{title}</h2>}
      
//       <ul className="list-items">
//         {processedItems.map((item, index) => {
//           const ItemIcon = item.icon;
//           const itemClass = [
//             'list-item',
//             theme === 'stacked' ? 'stacked-item' : '',
//             theme === 'timeline' ? 'timeline-item' : ''
//           ].filter(Boolean).join(' ');

//           const content = item.link ? (
//             <a 
//               href={item.link} 
//               className="item-link"
//               style={{ whiteSpace: 'pre-wrap' }}
//               {...(item.newTab && { target: "_blank", rel: "noopener noreferrer" })}
//             >
//               {processContent(item.text)}
//             </a>
//           ) : (
//             <span className="item-text" style={{ whiteSpace: 'pre-wrap' }}>
//               {processContent(item.text)}
//             </span>
//           );

//           return (
//             <li key={index} className={itemClass}>
//               {ItemIcon && <ItemIcon className="item-icon" />}
//               {content}
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default StyledList;

import React from 'react';
import { themes, defaultTheme } from './themes';
import { processContent } from '@/utils/contentProcessor';
import './StyledList.css';

const StyledList = ({
  items = [],
  title = 'List Title',
  theme = defaultTheme,
  showNumbers = false,
  width,
  height,
  backgroundColor,
  textColor,
  iconColor
}) => {
  const currentTheme = themes[theme] || themes[defaultTheme];

  const containerStyle = {
    width: width || '100%',
    height: height || 'auto',
    backgroundColor: backgroundColor || currentTheme.styles.backgroundColor,
    color: textColor || currentTheme.styles.textColor,
    '--icon-color': iconColor || currentTheme.styles.iconColor,
    '--item-background': currentTheme.styles.itemBackground,
    '--item-hover-background': currentTheme.styles.itemHoverBackground,
    '--item-border-color': currentTheme.styles.itemBorder,
    '--item-shadow': currentTheme.styles.itemShadow
  };

  const processedItems = items.map(item => {
    if (typeof item === 'string') {
      return { text: item };
    }
    return item;
  });

  const hasIcons = processedItems.some(item => item.icon);

  return (
    <div 
      className={`styled-list-container ${theme} ${showNumbers ? 'numbered' : ''} ${hasIcons ? 'has-icons' : ''}`}
      style={containerStyle}
    >
      {title && <h2 className="list-title">{title}</h2>}
      
      <ul className="list-items">
        {processedItems.map((item, index) => {
          const ItemIcon = item.icon;
          const itemClass = [
            'list-item',
            theme === 'stacked' ? 'stacked-item' : '',
            theme === 'timeline' ? 'timeline-item' : ''
          ].filter(Boolean).join(' ');

          const content = item.link ? (
            <a 
              href={item.link} 
              className="item-link"
              style={{ whiteSpace: 'pre-wrap' }}
              {...(item.newTab && { target: "_blank", rel: "noopener noreferrer" })}
            >
              {processContent(item.text)}
            </a>
          ) : (
            <span className="item-text" style={{ whiteSpace: 'pre-wrap' }}>
              {processContent(item.text)}
            </span>
          );

          return (
            <li key={index} className={itemClass}>
              {ItemIcon && <ItemIcon className="item-icon" />}
              {content}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StyledList;