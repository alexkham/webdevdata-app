// import React from 'react';
// import { processContent } from '@/utils/contentProcessor';

// /**
//  * Content Block Component Props:
//  * 
//  * @param {string|object} content - Required. Content to display. Can be:
//  *   - String: 'Content text'
//  *   - Object: { text: 'Content text' }
//  * 
//  * @param {string} id - Optional. HTML id for the block
//  * @param {boolean} boxed - Optional. Default: false
//  * @param {boolean} compact - Optional. Default: false
//  * @param {boolean} divided - Optional. Default: false
//  * @param {string} color - Optional. Color theme. Default: 'gray'
//  * @param {string} displayField - Optional. Default: 'text'
//  */
// const ContentBlock = ({
//   content,
//   id,
//   boxed = false,
//   compact = false,
//   divided = false,
//   color = 'gray',
//   displayField = 'text'
// }) => {
//   const colors = {
//     gray: { marker: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' },
//     blue: { marker: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
//     green: { marker: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
//     red: { marker: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
//     yellow: { marker: '#F59E0B', bg: '#fdfdea', border: '#FEF08A' }
//   };

//   const styles = {
//     container: {
//       margin: '0.5rem 0',
//       position: 'relative',
//       padding: compact ? '0.25rem 1rem' : '0.5rem 1rem',
//       ...(boxed && {
//         backgroundColor: colors[color].bg,
//         border: `1px solid ${colors[color].border}`,
//         borderRadius: '0.375rem',
//         margin: '0.95rem 0'
//       }),
//       ...(divided && !boxed && {
//         borderBottom: `1px solid ${colors[color].border}`
//       }),
//       fontSize: '16px'
//     },
//     content: {
//       flex: 1
//     }
//   };

//   const processContent = (item) => {
//     if (typeof item === 'string') {
//       return processContent(item);
//     }
    
//     if (typeof item === 'object' && item !== null) {
//       const contentValue = item[displayField] || JSON.stringify(item);
//       return processContent(contentValue);
//     }
    
//     return processContent(String(item));
//   };

//   return (
//     <div id={id} style={styles.container}>
//       <div style={styles.content}>
//         {processContent(content)}
//       </div>
//     </div>
//   );
// };

// export default ContentBlock;


import React from 'react';
import { processContent } from '@/utils/contentProcessor';

const ContentBlock = ({
 content,
 id,
 boxed = false,
 compact = false,
 divided = false,
 color = 'gray',
 displayField = 'text'
}) => {
 const colors = {
   gray: { marker: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB' },
   blue: { marker: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
   green: { marker: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
   red: { marker: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
   yellow: { marker: '#F59E0B', bg: '#fdfdea', border: '#FEF08A' }
 };

 const styles = {
   container: {
     margin: '0.5rem 0',
     position: 'relative',
     padding: compact ? '0.25rem 1rem' : '0.5rem 1rem',
     ...(boxed && {
       backgroundColor: colors[color].bg,
       border: `1px solid ${colors[color].border}`,
       borderRadius: '0.375rem',
       margin: '0.95rem 0'
     }),
     ...(divided && !boxed && {
       borderBottom: `1px solid ${colors[color].border}`
     }),
     fontSize: '16px'
   },
   content: {
     flex: 1
   }
 };

 const prepareContent = (item) => {
   if (typeof item === 'string') {
     return item;
   }
   
   if (typeof item === 'object' && item !== null) {
     return item[displayField] || JSON.stringify(item);
   }
   
   return String(item);
 };

 return (
   <div id={id} style={styles.container}>
    <br/>
    <br/>
  
    
     <div style={styles.content}>
       {processContent(prepareContent(content))}
     </div>
   </div>
 );
};

export default ContentBlock;