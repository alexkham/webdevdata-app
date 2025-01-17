
// // import React, { useState } from 'react';
// // import styles from './ExpandableTable.module.css';
// // import { ChevronDown, ChevronRight } from 'lucide-react';
// // import { processContent } from '@/app/utils/contentProcessor';

// // const ExpandableTable = ({ 
// //   data, 
// //   copyableFields = [],
// //   nestedCopyableFields = [],
// //   excludedFields = []
// // }) => {
// //   const [expandedRowId, setExpandedRowId] = useState(null);
// //   const [activeTab, setActiveTab] = useState({});
// //   const [copiedStates, setCopiedStates] = useState({});
  
// //   const mainFields = Object.keys(data[0]).filter(key => 
// //     !['content', 'id'].includes(key) && 
// //     !excludedFields.includes(key)
// //   );

// //   const handleCopy = async (content, fieldName, rowId) => {
// //     try {
// //       await navigator.clipboard.writeText(content);
// //       const stateKey = `${rowId}-${fieldName}`;
// //       setCopiedStates(prev => ({
// //         ...prev,
// //         [stateKey]: true
// //       }));
// //       setTimeout(() => {
// //         setCopiedStates(prev => ({
// //           ...prev,
// //           [stateKey]: false
// //         }));
// //       }, 2000);
// //     } catch (err) {
// //       console.error('Failed to copy:', err);
// //     }
// //   };

// //   const toggleRow = (id) => {
// //     if (expandedRowId === id) {
// //       setExpandedRowId(null);
// //     } else {
// //       setExpandedRowId(id);
// //       const rowContent = data.find(row => row.id === id)?.content;
// //       if (typeof rowContent === 'object') {
// //         setActiveTab(prev => ({
// //           ...prev,
// //           [id]: Object.keys(rowContent)[0]
// //         }));
// //       }
// //     }
// //   };

// //   const handleTabClick = (rowId, tab) => {
// //     setActiveTab(prev => ({
// //       ...prev,
// //       [rowId]: tab
// //     }));
// //   };

// //   const isExpandable = (row) => {
// //     return row.hasOwnProperty('content') && row.content !== null && row.content !== undefined;
// //   };

// //   const shouldHaveTabs = (content) => {
// //     return typeof content === 'object';
// //   };

// //   return (
// //     <div className={styles.tableContainer}>
// //       <table className={styles.table}>
// //         <thead>
// //           <tr>
// //             <th className={styles.iconCell}></th>
// //             {mainFields.map((field) => (
// //               <th key={field} className={styles.headerCell}>
// //                 {processContent(field)}
// //               </th>
// //             ))}
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {data.map((row) => (
// //             <React.Fragment key={row.id}>
// //               <tr className={isExpandable(row) ? styles.tableRow : styles.simpleRow}>
// //                 <td className={styles.iconCell}>
// //                   {isExpandable(row) && (
// //                    <span onClick={() => toggleRow(row.id)}>
// //                    {expandedRowId === row.id ? (
// //                      <ChevronDown className={styles.icon} />
// //                    ) : (
// //                      <ChevronRight className={styles.icon} />
// //                    )}
// //                  </span>
// //                   )}
// //                 </td>
// //                 {mainFields.map((field) => (
// //                   <td 
// //                     key={field} 
// //                     className={styles.tableCell}
// //                     onClick={(e) => {
// //                       if (e.target.tagName === 'BUTTON') return;
// //                       isExpandable(row) && toggleRow(row.id);
// //                     }}
// //                   >
// //                     <div className={styles.cellContent}>
// //                       <span>{processContent(row[field]?.toString() || '')}</span>
// //                       {copyableFields.includes(field) && (
// //                         <button
// //                           className={`${styles.copyButton} ${copiedStates[`${row.id}-${field}`] ? styles.copied : ''}`}
// //                           onClick={() => handleCopy(row[field]?.toString() || '', field, row.id)}
// //                         >
// //                           {copiedStates[`${row.id}-${field}`] ? '✓' : 'Copy'}
// //                         </button>
// //                       )}
// //                     </div>
// //                   </td>
// //                 ))}
// //               </tr>
// //               {isExpandable(row) && expandedRowId === row.id && (
// //                 <tr>
// //                   <td colSpan={mainFields.length + 1} className={styles.expandedContent}>
// //                     {shouldHaveTabs(row.content) ? (
// //                       <div className={styles.tabContainer}>
// //                         <div className={styles.tabList}>
// //                           {Object.keys(row.content).map((tab) => (
// //                             <button
// //                               key={tab}
// //                               className={`${styles.tabButton} ${activeTab[row.id] === tab ? styles.activeTab : ''}`}
// //                               onClick={() => handleTabClick(row.id, tab)}
// //                             >
// //                               {processContent(tab)}
// //                             </button>
// //                           ))}
// //                         </div>
// //                         <div className={styles.tabContent}>
// //                           {Object.keys(row.content).map((tab) => (
// //                             <div
// //                               key={tab}
// //                               className={`${styles.tabPanel} ${activeTab[row.id] === tab ? styles.activePanel : styles.hiddenPanel}`}
// //                             >
// //                               <div className={styles.contentValue}>
// //                                 <div className={styles.cellContent}>
// //                                   <span>{processContent(row.content[tab].toString())}</span>
// //                                   {nestedCopyableFields.includes(tab) && (
// //                                     <button
// //                                       className={`${styles.copyButton} ${copiedStates[`${row.id}-${tab}`] ? styles.copied : ''}`}
// //                                       onClick={() => handleCopy(
// //                                         row.content[tab].toString(),
// //                                         tab,
// //                                         row.id
// //                                       )}
// //                                     >
// //                                       {copiedStates[`${row.id}-${tab}`] ? '✓' : 'Copy'}
// //                                     </button>
// //                                   )}
// //                                 </div>
// //                               </div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     ) : (
// //                       <div className={styles.simpleContent}>
// //                         <div className={styles.cellContent}>
// //                           <span>{processContent(row.content.toString())}</span>
// //                           {nestedCopyableFields.includes('content') && (
// //                             <button
// //                               className={`${styles.copyButton} ${copiedStates[`${row.id}-content`] ? styles.copied : ''}`}
// //                               onClick={() => handleCopy(row.content.toString(), 'content', row.id)}
// //                             >
// //                               {copiedStates[`${row.id}-content`] ? '✓' : 'Copy'}
// //                             </button>
// //                           )}
// //                         </div>
// //                       </div>
// //                     )}
// //                   </td>
// //                 </tr>
// //               )}
// //             </React.Fragment>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default ExpandableTable;

// import React, { useState } from 'react';
// import styles from './ExpandableTable.module.css';
// import { ChevronDown, ChevronRight } from 'lucide-react';
// import { processContent } from '@/utils/contentProcessor';

// const ExpandableTable = ({ 
//   data = [], 
//   copyableFields = [],
//   nestedCopyableFields = [],
//   includedFields = [],
// }) => {
//   const [expandedRowId, setExpandedRowId] = useState(null);
//   const [activeTab, setActiveTab] = useState({});
//   const [copiedStates, setCopiedStates] = useState({});
  
  
//   // Validate and sanitize input data
//   const sanitizedData = data.map(row => ({
//     id: row?.id || Math.random().toString(36).substr(2, 9),
//     ...row
//   }));

//   // Use included fields instead of excludedi
//   const mainFields = includedFields.length > 0 
//     ? includedFields.filter(field => !['content', 'id'].includes(field))
//     : Object.keys(sanitizedData[0] || {}).filter(key => !['content', 'id'].includes(key));

//   const handleCopy = async (content, fieldName, rowId) => {
//     console.log(copiedStates);
   
//     if (!content) return;
//     try {
//       await navigator.clipboard.writeText(content);
//       const stateKey = `${rowId}-${fieldName}`;
//       setCopiedStates(prev => ({
//         ...prev,
//         [stateKey]: true
//       }));
//       setTimeout(() => {
//         setCopiedStates(prev => ({
//           ...prev,
//           [stateKey]: false
//         }));
//       }, 2000);
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };

//   const toggleRow = (id) => {
//     if (expandedRowId === id) {
//       setExpandedRowId(null);
//     } else {
//       setExpandedRowId(id);
//       const rowContent = sanitizedData.find(row => row.id === id)?.content;
//       if (typeof rowContent === 'object' && rowContent !== null) {
//         setActiveTab(prev => ({
//           ...prev,
//           [id]: Object.keys(rowContent)[0]
//         }));
//       }
//     }
//   };

//   const handleTabClick = (rowId, tab) => {
//     setActiveTab(prev => ({
//       ...prev,
//       [rowId]: tab
//     }));
//   };

//   const isExpandable = (row) => {
//     return row?.content != null;
//   };

//   const shouldHaveTabs = (content) => {
//     return typeof content === 'object' && content !== null;
//   };

//   if (!sanitizedData.length || !mainFields.length) {
//     return <div className={styles.noData}>No data available</div>;
//   }

//   return (
//     <div className={styles.tableContainer}>
//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th className={styles.iconCell}></th>
//             {mainFields.map((field) => (
//               <th key={field} className={styles.headerCell}>
//                 {processContent(field.replaceAll('_',' '))}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {sanitizedData.map((row) => (
//             <React.Fragment key={row.id}>
//               <tr className={isExpandable(row) ? styles.tableRow : styles.simpleRow}>
//                 <td className={styles.iconCell}>
//                   {isExpandable(row) && (
//                     <span onClick={() => toggleRow(row.id)}>
//                       {expandedRowId === row.id ? (
//                         <ChevronDown className={styles.icon} />
//                       ) : (
//                         <ChevronRight className={styles.icon} />
//                       )}
//                     </span>
//                   )}
//                 </td>
//                 {mainFields.map((field) => (
//                   <td 
//                     key={field} 
//                     className={styles.tableCell}
//                     onClick={(e) => {
//                       if (e.target.tagName === 'BUTTON') return;
//                       isExpandable(row) && toggleRow(row.id);
//                     }}
//                   >
//                     <div className={styles.cellContent}>
//                       <span>{processContent(row[field]?.toString() || '')}</span>
//                       {copyableFields.includes(field) && row[field] && (
//                         <button
//                           className={`${styles.copyButton} ${copiedStates[`${row.id}-${field}`] ? styles.copied : ''}`}
//                           onClick={() => handleCopy(row[field]?.toString(), field, row.id)}
//                         >
//                           {copiedStates[`${row.id}-${field}`] ? '✓' : 'Copy'}
//                           {/* {copy?'✓':'Copy'} */}
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 ))}
//               </tr>
//               {isExpandable(row) && expandedRowId === row.id && (
//                 <tr>
//                   <td colSpan={mainFields.length + 1} className={styles.expandedContent}>
//                     {shouldHaveTabs(row.content) ? (
//                       <div className={styles.tabContainer}>
//                         <div className={styles.tabList}>
//                           {Object.keys(row.content).map((tab) => (
//                             <button
//                               key={tab}
//                               className={`${styles.tabButton} ${activeTab[row.id] === tab ? styles.activeTab : ''}`}
//                               onClick={() => handleTabClick(row.id, tab)}
//                             >
//                               {processContent(tab)}
//                             </button>
//                           ))}
//                         </div>
//                         <div className={styles.tabContent}>
//                           {Object.keys(row.content).map((tab) => (
//                             <div
//                               key={tab}
//                               className={`${styles.tabPanel} ${activeTab[row.id] === tab ? styles.activePanel : styles.hiddenPanel}`}
//                             >
//                               <div className={styles.contentValue}>
//                                 <div className={styles.cellContent}>
//                                   <span>{processContent(row.content[tab]?.toString() || '')}</span>
//                                   {nestedCopyableFields.includes(tab) && row.content[tab] && (
//                                     <button
//                                       className={`${styles.copyButton} ${copiedStates[`${row.id}-${tab}`] ? styles.copied : ''}`}
//                                       onClick={() => handleCopy(
//                                         row.content[tab].toString(),
//                                         tab,
//                                         row.id
//                                       )}
//                                     >
//                                       {copiedStates[`${row.id}-${tab}`] ? '✓' : 'Copy'}
//                                     </button>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ) : (
//                       <div className={styles.simpleContent}>
//                         <div className={styles.cellContent}>
//                           <span>{processContent(row.content?.toString() || '')}</span>
//                           {nestedCopyableFields.includes('content') && row.content && (
//                             <button
//                               className={`${styles.copyButton} ${copiedStates[`${row.id}-content`] ? styles.copied : ''}`}
//                               onClick={() => handleCopy(row.content.toString(), 'content', row.id)}
//                             >
//                               {copiedStates[`${row.id}-content`] ? '✓' : 'Copy'}
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               )}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ExpandableTable;

import React, { useState } from 'react';
import styles from './ExpandableTable.module.css';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { processContent } from '@/utils/contentProcessor';

const ExpandableTable = ({ 
  data = [], 
  copyableFields = [],
  nestedCopyableFields = [],
  includedFields = [],
}) => {
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [activeTab, setActiveTab] = useState({});
  const [copiedStates, setCopiedStates] = useState({});
  
  // Validate and sanitize input data
  const sanitizedData = data.map(row => ({
    id: row?.id || Math.random().toString(36).substr(2, 9),
    ...row
  }));

  // Use included fields instead of excluded
  const mainFields = includedFields.length > 0 
    ? includedFields.filter(field => !['content', 'id'].includes(field))
    : Object.keys(sanitizedData[0] || {}).filter(key => !['content', 'id'].includes(key));

  const handleCopy = async (content, fieldName, rowId) => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      const stateKey = `${rowId}-${fieldName}`;
      setCopiedStates(prev => ({
        ...prev,
        [stateKey]: true
      }));
      setTimeout(() => {
        setCopiedStates(prev => ({
          ...prev,
          [stateKey]: false
        }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleRow = (id) => {
    if (expandedRowId === id) {
      setExpandedRowId(null);
      setActiveTab(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    } else {
      setExpandedRowId(id);
      const rowContent = sanitizedData.find(row => row.id === id)?.content;
      if (typeof rowContent === 'object' && rowContent !== null) {
        setActiveTab(prev => ({
          ...prev,
          [id]: Object.keys(rowContent)[0]
        }));
      }
    }
  };

  const isExpandable = (row) => {
    return row?.content != null;
  };

  // New helper function to check if a content field should have a copy button
  const shouldShowNestedCopyButton = (key) => {
    return nestedCopyableFields.includes(key);
  };

  if (!sanitizedData.length || !mainFields.length) {
    return <div className={styles.noData}>No data available</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.iconCell}></th>
            {mainFields.map((field) => (
              <th key={field} className={styles.headerCell}>
                {processContent(field.replace(/_/g, ' '))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sanitizedData.map((row) => (
            <React.Fragment key={row.id}>
              <tr className={isExpandable(row) ? styles.tableRow : styles.simpleRow}>
                <td className={styles.iconCell}>
                  {isExpandable(row) && (
                    <span onClick={() => toggleRow(row.id)}>
                      {expandedRowId === row.id ? (
                        <ChevronDown className={styles.icon} />
                      ) : (
                        <ChevronRight className={styles.icon} />
                      )}
                    </span>
                  )}
                </td>
                {mainFields.map((field) => (
                  <td 
                    key={field} 
                    className={styles.tableCell}
                    onClick={(e) => {
                      if (e.target.tagName === 'BUTTON') return;
                      isExpandable(row) && toggleRow(row.id);
                    }}
                  >
                    <div className={styles.cellContent}>
                      <span>{processContent(row[field]?.toString() || '')}</span>
                      {copyableFields.includes(field) && row[field] && (
                        <button
                          className={`${styles.copyButton} ${copiedStates[`${row.id}-${field}`] ? styles.copied : ''}`}
                          onClick={() => handleCopy(row[field]?.toString(), field, row.id)}
                        >
                          {copiedStates[`${row.id}-${field}`] ? '✓' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
              {isExpandable(row) && expandedRowId === row.id && (
                <tr>
                  <td colSpan={mainFields.length + 1} className={styles.expandedContent}>
                    {typeof row.content === 'object' && row.content !== null ? (
                      <div className={styles.tabContainer}>
                        <div className={styles.tabList}>
                          {Object.keys(row.content).map((tab) => (
                            <button
                              key={tab}
                              className={`${styles.tabButton} ${activeTab[row.id] === tab ? styles.activeTab : ''}`}
                              onClick={() => setActiveTab(prev => ({ ...prev, [row.id]: tab }))}
                            >
                              {processContent(tab)}
                            </button>
                          ))}
                        </div>
                        <div className={styles.tabContent}>
                          {Object.keys(row.content).map((tab) => (
                            <div
                              key={tab}
                              className={`${styles.tabPanel} ${activeTab[row.id] === tab ? styles.activePanel : styles.hiddenPanel}`}
                            >
                              <div className={styles.contentValue}>
                                <div className={styles.cellContent}>
                                  <span>{processContent(row.content[tab]?.toString() || '')}</span>
                                  {shouldShowNestedCopyButton(tab) && row.content[tab] && (
                                    <button
                                      className={`${styles.copyButton} ${copiedStates[`${row.id}-${tab}`] ? styles.copied : ''}`}
                                      onClick={() => handleCopy(
                                        row.content[tab].toString(),
                                        tab,
                                        row.id
                                      )}
                                    >
                                      {copiedStates[`${row.id}-${tab}`] ? '✓' : 'Copy'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className={styles.simpleContent}>
                        <div className={styles.cellContent}>
                          <span>{processContent(row.content?.toString() || '')}</span>
                          {shouldShowNestedCopyButton('content') && row.content && (
                            <button
                              className={`${styles.copyButton} ${copiedStates[`${row.id}-content`] ? styles.copied : ''}`}
                              onClick={() => handleCopy(row.content.toString(), 'content', row.id)}
                            >
                              {copiedStates[`${row.id}-content`] ? '✓' : 'Copy'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpandableTable;