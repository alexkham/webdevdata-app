// // // // // // import React, { useState } from 'react';
// // // // // // import { ChevronDown, ChevronRight } from 'lucide-react';
// // // // // // import styles from './VerticalBlocks.module.css';
// // // // // // import { processContent } from '@/app/utils/contentProcessor';

// // // // // // const VerticalBlocks = ({ data, includedFields = [] }) => {
// // // // // //   const [expandedBlockId, setExpandedBlockId] = useState(null);
// // // // // //   const [activeTab, setActiveTab] = useState({});

// // // // // //   const mainFields = includedFields.length > 0 
// // // // // //     ? includedFields.filter(field => !['content', 'id'].includes(field))
// // // // // //     : Object.keys(data[0] || {}).filter(key => !['content', 'id'].includes(key));

// // // // // //   const toggleBlock = (id) => {
// // // // // //     setExpandedBlockId(expandedBlockId === id ? null : id);
// // // // // //   };

// // // // // //   const handleTabClick = (blockId, tab) => {
// // // // // //     setActiveTab(prev => ({
// // // // // //       ...prev,
// // // // // //       [blockId]: tab
// // // // // //     }));
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className={styles.container}>
// // // // // //       <div className={styles.blocksList}>
// // // // // //         {data.map((block) => (
// // // // // //           <div key={block.id} className={styles.block}>
// // // // // //             <div
// // // // // //               className={styles.blockHeader}
// // // // // //               onClick={() => toggleBlock(block.id)}
// // // // // //             >
// // // // // //               {block.content && (
// // // // // //                 <span className={styles.chevron}>
// // // // // //                   {expandedBlockId === block.id ? <ChevronDown /> : <ChevronRight />}
// // // // // //                 </span>
// // // // // //               )}
// // // // // //               <div className={styles.fieldsGrid}>
// // // // // //                 {mainFields.map((field) => (
// // // // // //                   <div key={field} className={styles.field}>
// // // // // //                     <div className={styles.fieldLabel}>
// // // // // //                       {processContent(field.replace(/_/g, ' '))}
// // // // // //                     </div>
// // // // // //                     <div className={styles.fieldValue}>
// // // // // //                       {processContent(block[field])}
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                 ))}
// // // // // //               </div>
// // // // // //             </div>

// // // // // //             {expandedBlockId === block.id && block.content && (
// // // // // //               <div className={styles.expandedContent}>
// // // // // //                 {typeof block.content === 'object' ? (
// // // // // //                   <div className={styles.tabContainer}>
// // // // // //                     <div className={styles.tabList}>
// // // // // //                       {Object.keys(block.content).map((tab) => (
// // // // // //                         <button
// // // // // //                           key={tab}
// // // // // //                           onClick={() => handleTabClick(block.id, tab)}
// // // // // //                           className={`${styles.tabButton} ${
// // // // // //                             activeTab[block.id] === tab ? styles.activeTab : ''
// // // // // //                           }`}
// // // // // //                         >
// // // // // //                           {processContent(tab)}
// // // // // //                         </button>
// // // // // //                       ))}
// // // // // //                     </div>
// // // // // //                     <div className={styles.tabContent}>
// // // // // //                       {Object.keys(block.content).map((tab) => (
// // // // // //                         <div
// // // // // //                           key={tab}
// // // // // //                           className={`${styles.tabPanel} ${
// // // // // //                             activeTab[block.id] === tab ? styles.activePanel : styles.hiddenPanel
// // // // // //                           }`}
// // // // // //                         >
// // // // // //                           {processContent(block.content[tab])}
// // // // // //                         </div>
// // // // // //                       ))}
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                 ) : (
// // // // // //                   <div className={styles.simpleContent}>
// // // // // //                     {processContent(block.content)}
// // // // // //                   </div>
// // // // // //                 )}
// // // // // //               </div>
// // // // // //             )}
// // // // // //           </div>
// // // // // //         ))}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default VerticalBlocks;


// // // // // import React, { useState } from 'react';
// // // // // import { ChevronDown, ChevronRight } from 'lucide-react';
// // // // // import styles from './VerticalBlocks.module.css';
// // // // // import { processContent } from '@/app/utils/contentProcessor';

// // // // // const VerticalBlocks = ({ data, includedFields = [] }) => {
// // // // //   const [expandedBlockId, setExpandedBlockId] = useState(null);
// // // // //   const [activeTab, setActiveTab] = useState({});

// // // // //   const mainFields = includedFields.length > 0 
// // // // //     ? includedFields.filter(field => !['content', 'id'].includes(field))
// // // // //     : Object.keys(data[0] || {}).filter(key => !['content', 'id'].includes(key));

// // // // //   const toggleBlock = (id) => {
// // // // //     if (expandedBlockId === id) {
// // // // //       setExpandedBlockId(null);
// // // // //     } else {
// // // // //       setExpandedBlockId(id);
// // // // //       const blockContent = data.find(block => block.id === id)?.content;
// // // // //       if (typeof blockContent === 'object' && blockContent !== null) {
// // // // //         setActiveTab(prev => ({
// // // // //           ...prev,
// // // // //           [id]: Object.keys(blockContent)[0]
// // // // //         }));
// // // // //       }
// // // // //     }
// // // // //   };

// // // // //   const handleTabClick = (blockId, tab) => {
// // // // //     setActiveTab(prev => ({
// // // // //       ...prev,
// // // // //       [blockId]: tab
// // // // //     }));
// // // // //   };

// // // // //   return (
// // // // //     <div className={styles.container}>
// // // // //       <div className={styles.blocksList}>
// // // // //         {data.map((block) => (
// // // // //           <div key={block.id} className={styles.block}>
// // // // //             <div
// // // // //               className={styles.blockHeader}
// // // // //               onClick={() => toggleBlock(block.id)}
// // // // //             >
// // // // //               {block.content && (
// // // // //                 <span className={styles.chevron}>
// // // // //                   {expandedBlockId === block.id ? <ChevronDown /> : <ChevronRight />}
// // // // //                 </span>
// // // // //               )}
// // // // //               <div className={styles.fieldsGrid}>
// // // // //                 {mainFields.map((field) => (
// // // // //                   <div key={field} className={styles.field}>
// // // // //                     <div className={styles.fieldLabel}>
// // // // //                       {processContent(field.replace(/_/g, ' '))}
// // // // //                     </div>
// // // // //                     <div className={styles.fieldValue}>
// // // // //                       {processContent(block[field])}
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 ))}
// // // // //               </div>
// // // // //             </div>

// // // // //             {expandedBlockId === block.id && block.content && (
// // // // //               <div className={styles.expandedContent}>
// // // // //                 {typeof block.content === 'object' ? (
// // // // //                   <div className={styles.tabContainer}>
// // // // //                     <div className={styles.tabList}>
// // // // //                       {Object.keys(block.content).map((tab) => (
// // // // //                         <button
// // // // //                           key={tab}
// // // // //                           onClick={() => handleTabClick(block.id, tab)}
// // // // //                           className={`${styles.tabButton} ${
// // // // //                             activeTab[block.id] === tab ? styles.activeTab : ''
// // // // //                           }`}
// // // // //                         >
// // // // //                           {processContent(tab)}
// // // // //                         </button>
// // // // //                       ))}
// // // // //                     </div>
// // // // //                     <div className={styles.tabContent}>
// // // // //                       {Object.keys(block.content).map((tab) => (
// // // // //                         <div
// // // // //                           key={tab}
// // // // //                           className={`${styles.tabPanel} ${
// // // // //                             activeTab[block.id] === tab ? styles.activePanel : styles.hiddenPanel
// // // // //                           }`}
// // // // //                         >
// // // // //                           {processContent(block.content[tab])}
// // // // //                         </div>
// // // // //                       ))}
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 ) : (
// // // // //                   <div className={styles.simpleContent}>
// // // // //                     {processContent(block.content)}
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>
// // // // //             )}
// // // // //           </div>
// // // // //         ))}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default VerticalBlocks;

// // // // import React, { useState } from 'react';
// // // // import { ChevronDown, ChevronRight } from 'lucide-react';
// // // // import styles from './VerticalBlocks.module.css';
// // // // import { processContent } from '@/app/utils/contentProcessor';

// // // // const VerticalBlocks = ({ data, titleField, explanationField }) => {
// // // //   const [expandedBlockId, setExpandedBlockId] = useState(null);
// // // //   const [activeTab, setActiveTab] = useState({});

// // // //   const toggleBlock = (id) => {
// // // //     if (expandedBlockId === id) {
// // // //       setExpandedBlockId(null);
// // // //     } else {
// // // //       setExpandedBlockId(id);
// // // //       const blockContent = data.find(block => block.id === id)?.content;
// // // //       if (typeof blockContent === 'object' && blockContent !== null) {
// // // //         setActiveTab(prev => ({
// // // //           ...prev,
// // // //           [id]: Object.keys(blockContent)[0]
// // // //         }));
// // // //       }
// // // //     }
// // // //   };

// // // //   const handleTabClick = (blockId, tab) => {
// // // //     setActiveTab(prev => ({
// // // //       ...prev,
// // // //       [blockId]: tab
// // // //     }));
// // // //   };

// // // //   return (
// // // //     <div className={styles.container}>
// // // //       <div className={styles.blocksList}>
// // // //         {data.map((block) => (
// // // //           <div key={block.id} className={styles.block}>
// // // //             <div
// // // //               className={styles.blockHeader}
// // // //               onClick={() => toggleBlock(block.id)}
// // // //             >
// // // //               {block.content && (
// // // //                 <span className={styles.chevron}>
// // // //                   {expandedBlockId === block.id ? <ChevronDown /> : <ChevronRight />}
// // // //                 </span>
// // // //               )}
// // // //               <div className={styles.mainInfo}>
// // // //                 <div className={styles.title}>{processContent(block[titleField])}</div>
// // // //                 <div className={styles.explanation}>{processContent(block[explanationField])}</div>
// // // //               </div>
// // // //             </div>

// // // //             {expandedBlockId === block.id && block.content && (
// // // //               <div className={styles.expandedContent}>
// // // //                 {typeof block.content === 'object' ? (
// // // //                   <div className={styles.tabContainer}>
// // // //                     <div className={styles.tabList}>
// // // //                       {Object.keys(block.content).map((tab) => (
// // // //                         <button
// // // //                           key={tab}
// // // //                           onClick={() => handleTabClick(block.id, tab)}
// // // //                           className={`${styles.tabButton} ${
// // // //                             activeTab[block.id] === tab ? styles.activeTab : ''
// // // //                           }`}
// // // //                         >
// // // //                           {processContent(tab)}
// // // //                         </button>
// // // //                       ))}
// // // //                     </div>
// // // //                     <div className={styles.tabContent}>
// // // //                       {Object.keys(block.content).map((tab) => (
// // // //                         <div
// // // //                           key={tab}
// // // //                           className={`${styles.tabPanel} ${
// // // //                             activeTab[block.id] === tab ? styles.activePanel : styles.hiddenPanel
// // // //                           }`}
// // // //                         >
// // // //                           {processContent(block.content[tab])}
// // // //                         </div>
// // // //                       ))}
// // // //                     </div>
// // // //                   </div>
// // // //                 ) : (
// // // //                   <div className={styles.simpleContent}>
// // // //                     {processContent(block.content)}
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         ))}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default VerticalBlocks;


// // // import React, { useState } from 'react';
// // // import { ChevronDown, ChevronRight } from 'lucide-react';
// // // import styles from './VerticalBlocks.module.css';
// // // import { processContent } from '@/app/utils/contentProcessor';

// // // const VerticalBlocks = ({ 
// // //   data, 
// // //   titleField, 
// // //   explanationField,
// // //   backgroundColor = '#fff',
// // //   textColor = '#000',
// // //   width = '1200px'
// // // }) => {
// // //   const [expandedBlockId, setExpandedBlockId] = useState(null);
// // //   const [activeTab, setActiveTab] = useState({});

// // //   const blockStyle = {
// // //     backgroundColor,
// // //     color: textColor,
// // //     maxWidth: width
// // //   };

// // //   const toggleBlock = (id) => {
// // //     if (expandedBlockId === id) {
// // //       setExpandedBlockId(null);
// // //     } else {
// // //       setExpandedBlockId(id);
// // //       const blockContent = data.find(block => block.id === id)?.content;
// // //       if (typeof blockContent === 'object' && blockContent !== null) {
// // //         setActiveTab(prev => ({
// // //           ...prev,
// // //           [id]: Object.keys(blockContent)[0]
// // //         }));
// // //       }
// // //     }
// // //   };

// // //   const handleTabClick = (blockId, tab) => {
// // //     setActiveTab(prev => ({
// // //       ...prev,
// // //       [blockId]: tab
// // //     }));
// // //   };

// // //   return (
// // //     <div className={styles.container} style={blockStyle}>
// // //       <div className={styles.blocksList}>
// // //         {data.map((block) => (
// // //           <div key={block.id} className={styles.block}>
// // //             <div
// // //               className={styles.blockHeader}
// // //               onClick={() => toggleBlock(block.id)}
// // //             >
// // //               <div className={styles.mainInfo}>
// // //                 <div className={styles.title}>{processContent(block[titleField])}</div>
// // //                 <div className={styles.explanation}>{processContent(block[explanationField])}</div>
// // //               </div>
// // //               {block.content && (
// // //                 <span className={styles.chevron}>
// // //                   {expandedBlockId === block.id ? <ChevronDown /> : <ChevronRight />}
// // //                 </span>
// // //               )}
// // //             </div>

// // //             {expandedBlockId === block.id && block.content && (
// // //               <div className={styles.expandedContent}>
// // //                 {typeof block.content === 'object' ? (
// // //                   <div className={styles.tabContainer}>
// // //                     <div className={styles.tabList}>
// // //                       {Object.keys(block.content).map((tab) => (
// // //                         <button
// // //                           key={tab}
// // //                           onClick={() => handleTabClick(block.id, tab)}
// // //                           className={`${styles.tabButton} ${
// // //                             activeTab[block.id] === tab ? styles.activeTab : ''
// // //                           }`}
// // //                         >
// // //                           {processContent(tab)}
// // //                         </button>
// // //                       ))}
// // //                     </div>
// // //                     <div className={styles.tabContent}>
// // //                       {Object.keys(block.content).map((tab) => (
// // //                         <div
// // //                           key={tab}
// // //                           className={`${styles.tabPanel} ${
// // //                             activeTab[block.id] === tab ? styles.activePanel : styles.hiddenPanel
// // //                           }`}
// // //                         >
// // //                           {processContent(block.content[tab])}
// // //                         </div>
// // //                       ))}
// // //                     </div>
// // //                   </div>
// // //                 ) : (
// // //                   <div className={styles.simpleContent}>
// // //                     {processContent(block.content)}
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             )}
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default VerticalBlocks;


// // import React, { useState } from 'react';
// // import { ChevronDown, ChevronRight } from 'lucide-react';
// // import styles from './VerticalBlocks.module.css';
// // import { processContent } from '@/app/utils/contentProcessor';

// // const VerticalBlocks = ({ 
// //   data, 
// //   titleField, 
// //   explanationField,
// //   backgroundColor = '#fff',
// //   textColor = '#000',
// //   width = '1200px'
// // }) => {
// //   const [expandedBlockId, setExpandedBlockId] = useState(null);
// //   const [activeTab, setActiveTab] = useState({});

// //   const headerStyle = {
// //     backgroundColor,
// //     color: textColor,
// //     width
// //   };

// //   const containerStyle = {
// //     width: width
// //   };

// //   const toggleBlock = (id) => {
// //     if (expandedBlockId === id) {
// //       setExpandedBlockId(null);
// //     } else {
// //       setExpandedBlockId(id);
// //       const blockContent = data.find(block => block.id === id)?.content;
// //       if (typeof blockContent === 'object' && blockContent !== null) {
// //         setActiveTab(prev => ({
// //           ...prev,
// //           [id]: Object.keys(blockContent)[0]
// //         }));
// //       }
// //     }
// //   };

// //   const handleTabClick = (blockId, tab) => {
// //     setActiveTab(prev => ({
// //       ...prev,
// //       [blockId]: tab
// //     }));
// //   };

// //   return (
// //     <div className={styles.container} style={containerStyle}>
// //       <div className={styles.blocksList}>
// //         {data.map((block) => (
// //           <div key={block.id} className={styles.block}>
// //             <div
// //               className={styles.blockHeader}
// //               onClick={() => toggleBlock(block.id)}
// //               style={headerStyle}
// //             >
// //               <div className={styles.mainInfo}>
// //                 <div className={styles.title}>{processContent(block[titleField])}</div>
// //                 <div className={styles.explanation}>{processContent(block[explanationField])}</div>
// //               </div>
// //               {block.content && (
// //                 <span className={styles.chevron}>
// //                   {expandedBlockId === block.id ? <ChevronDown /> : <ChevronRight />}
// //                 </span>
// //               )}
// //             </div>

// //             {expandedBlockId === block.id && block.content && (
// //               <div className={styles.expandedContent}>
// //                 {typeof block.content === 'object' ? (
// //                   <div className={styles.tabContainer}>
// //                     <div className={styles.tabList}>
// //                       {Object.keys(block.content).map((tab) => (
// //                         <button
// //                           key={tab}
// //                           onClick={() => handleTabClick(block.id, tab)}
// //                           className={`${styles.tabButton} ${
// //                             activeTab[block.id] === tab ? styles.activeTab : ''
// //                           }`}
// //                         >
// //                           {processContent(tab)}
// //                         </button>
// //                       ))}
// //                     </div>
// //                     <div className={styles.tabContent}>
// //                       {Object.keys(block.content).map((tab) => (
// //                         <div
// //                           key={tab}
// //                           className={`${styles.tabPanel} ${
// //                             activeTab[block.id] === tab ? styles.activePanel : styles.hiddenPanel
// //                           }`}
// //                         >
// //                           {processContent(block.content[tab])}
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 ) : (
// //                   <div className={styles.simpleContent}>
// //                     {processContent(block.content)}
// //                   </div>
// //                 )}
// //               </div>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default VerticalBlocks;

// import React, { useState } from 'react';
// import { ChevronDown, ChevronRight } from 'lucide-react';
// import styles from './VerticalBlocks.module.css';
// import { processContent } from '@/utils/contentProcessor';

// const VerticalBlocks = ({ 
//   data, 
//   titleField, 
//   explanationField,
//   backgroundColor = '#fff',
//   titleColor = '#000',
//   explanationColor = '#666',
//   chevronColor = '#666',
//   width = '1200px'
// }) => {
//   const [expandedBlockId, setExpandedBlockId] = useState(null);
//   const [activeTab, setActiveTab] = useState({});

//   const headerStyle = {
//     backgroundColor,
//     width
//   };

//   const titleStyle = {
//     color: titleColor
//   };

//   const explanationStyle = {
//     color: explanationColor
//   };

//   const chevronStyle = {
//     color: chevronColor
//   };

//   const toggleBlock = (id) => {
//     if (expandedBlockId === id) {
//       setExpandedBlockId(null);
//     } else {
//       setExpandedBlockId(id);
//       const blockContent = data.find(block => block.id === id)?.content;
//       if (typeof blockContent === 'object' && blockContent !== null) {
//         setActiveTab(prev => ({
//           ...prev,
//           [id]: Object.keys(blockContent)[0]
//         }));
//       }
//     }
//   };

//   const handleTabClick = (blockId, tab) => {
//     setActiveTab(prev => ({
//       ...prev,
//       [blockId]: tab
//     }));
//   };

//   return (
//     <div className={styles.container} style={{ width }}>
//       <div className={styles.blocksList}>
//         {data.map((block) => (
//           <div key={block.id} className={styles.block}>
//             <div
//               className={styles.blockHeader}
//               onClick={() => toggleBlock(block.id)}
//               style={headerStyle}
//             >
//               <div className={styles.mainInfo}>
//                 <div className={styles.title} style={titleStyle}>
//                   {processContent(block[titleField])}
//                 </div>
//                 <div className={styles.explanation} style={explanationStyle}>
//                   {processContent(block[explanationField])}
//                 </div>
//               </div>
//               {block.content && (
//                 <span className={styles.chevron} style={chevronStyle}>
//                   {expandedBlockId === block.id ? <ChevronDown /> : <ChevronRight />}
//                 </span>
//               )}
//             </div>

//             {expandedBlockId === block.id && block.content && (
//               <div className={styles.expandedContent}>
//                 {typeof block.content === 'object' ? (
//                   <div className={styles.tabContainer}>
//                     <div className={styles.tabList}>
//                       {Object.keys(block.content).map((tab) => (
//                         <button
//                           key={tab}
//                           onClick={() => handleTabClick(block.id, tab)}
//                           className={`${styles.tabButton} ${
//                             activeTab[block.id] === tab ? styles.activeTab : ''
//                           }`}
//                         >
//                           {processContent(tab)}
//                         </button>
//                       ))}
//                     </div>
//                     <div className={styles.tabContent}>
//                       {Object.keys(block.content).map((tab) => (
//                         <div
//                           key={tab}
//                           className={`${styles.tabPanel} ${
//                             activeTab[block.id] === tab ? styles.activePanel : styles.hiddenPanel
//                           }`}
//                         >
//                           {processContent(block.content[tab])}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className={styles.simpleContent}>
//                     {processContent(block.content)}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VerticalBlocks;


import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './VerticalBlocks.module.css';
import { processContent } from '@/utils/contentProcessor';

const VerticalBlocks = ({ 
  data, 
  titleField, 
  explanationField,
  backgroundColor = '#fff',
  titleColor = '#000',
  explanationColor = '#666',
  chevronColor = '#666',
  width = '1200px'
}) => {
  const [expandedBlockId, setExpandedBlockId] = useState(null);
  const [activeTab, setActiveTab] = useState({});

  const headerStyle = {
    backgroundColor,
    width
  };

  const titleStyle = {
    color: titleColor
  };

  const explanationStyle = {
    color: explanationColor
  };

  const chevronStyle = {
    color: chevronColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.05)',
    transition: 'background 0.2s ease'
  };

  const toggleBlock = (id) => {
    if (expandedBlockId === id) {
      setExpandedBlockId(null);
    } else {
      setExpandedBlockId(id);
      const blockContent = data.find(block => block.id === id)?.content;
      if (typeof blockContent === 'object' && blockContent !== null) {
        setActiveTab(prev => ({
          ...prev,
          [id]: Object.keys(blockContent)[0]
        }));
      }
    }
  };

  const handleTabClick = (blockId, tab) => {
    setActiveTab(prev => ({
      ...prev,
      [blockId]: tab
    }));
  };

  return (
    <div className={styles.container} style={{ width }}>
      <div className={styles.blocksList}>
        {data.map((block) => (
          <div key={block.id} className={styles.block}>
            <div
              className={styles.blockHeader}
              onClick={() => toggleBlock(block.id)}
              style={headerStyle}
            >
              <div className={styles.mainInfo}>
                <div className={styles.title} style={titleStyle}>
                  {processContent(block[titleField])}
                </div>
                <div className={styles.explanation} style={explanationStyle}>
                  {processContent(block[explanationField])}
                </div>
              </div>
              {block.content && (
                <span 
                  className={styles.chevron} 
                  style={chevronStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                  }}
                >
                  {expandedBlockId === block.id ? 
                    <ChevronUp size={24} strokeWidth={2.5} /> : 
                    <ChevronDown size={24} strokeWidth={2.5} />
                  }
                </span>
              )}
            </div>

            {expandedBlockId === block.id && block.content && (
              <div className={styles.expandedContent}>
                {typeof block.content === 'object' ? (
                  <div className={styles.tabContainer}>
                    <div className={styles.tabList}>
                      {Object.keys(block.content).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => handleTabClick(block.id, tab)}
                          className={`${styles.tabButton} ${
                            activeTab[block.id] === tab ? styles.activeTab : ''
                          }`}
                        >
                          {processContent(tab)}
                        </button>
                      ))}
                    </div>
                    <div className={styles.tabContent}>
                      {Object.keys(block.content).map((tab) => (
                        <div
                          key={tab}
                          className={`${styles.tabPanel} ${
                            activeTab[block.id] === tab ? styles.activePanel : styles.hiddenPanel
                          }`}
                        >
                          {processContent(block.content[tab])}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={styles.simpleContent}>
                    {processContent(block.content)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerticalBlocks;