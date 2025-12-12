// // // // // // // import React, { useState } from 'react';
// // // // // // // import StringProcessor from './StringProcessor';
// // // // // // // import styles from './StringProcessorWrapper.module.css';

// // // // // // // const functionCategories = {
// // // // // // //   basic: {
// // // // // // //     label: 'Basic Operations',
// // // // // // //     operations: [
// // // // // // //       {
// // // // // // //         name: 'length',
// // // // // // //         format: 'dot',
// // // // // // //         description: 'Get string length',
// // // // // // //         operation: str => str.length
// // // // // // //       },
// // // // // // //       {
// // // // // // //         name: 'charAt',
// // // // // // //         format: 'dot',
// // // // // // //         description: 'Get character at specific index',
// // // // // // //         operation: (str, index) => str.charAt(index),
// // // // // // //         args: [{
// // // // // // //           name: 'index',
// // // // // // //           type: 'number',
// // // // // // //           default: '0',
// // // // // // //           placeholder: 'Enter index'
// // // // // // //         }]
// // // // // // //       }
// // // // // // //     ]
// // // // // // //   },
// // // // // // //   manipulation: {
// // // // // // //     label: 'String Manipulation',
// // // // // // //     operations: [
// // // // // // //       {
// // // // // // //         name: 'slice',
// // // // // // //         format: 'dot',
// // // // // // //         description: 'Extract part of string',
// // // // // // //         operation: (str, start, end) => str.slice(start, end),
// // // // // // //         args: [
// // // // // // //           {
// // // // // // //             name: 'start',
// // // // // // //             type: 'number',
// // // // // // //             default: '0',
// // // // // // //             placeholder: 'Start index'
// // // // // // //           },
// // // // // // //           {
// // // // // // //             name: 'end',
// // // // // // //             type: 'number',
// // // // // // //             default: '5',
// // // // // // //             placeholder: 'End index'
// // // // // // //           }
// // // // // // //         ]
// // // // // // //       },
// // // // // // //       {
// // // // // // //         name: 'split',
// // // // // // //         format: 'dot',
// // // // // // //         description: 'Split string by delimiter',
// // // // // // //         operation: (str, delimiter) => JSON.stringify(str.split(delimiter)),
// // // // // // //         args: [{
// // // // // // //           name: 'delimiter',
// // // // // // //           type: 'text',
// // // // // // //           default: ' ',
// // // // // // //           placeholder: 'Enter delimiter'
// // // // // // //         }]
// // // // // // //       }
// // // // // // //     ]
// // // // // // //   },
// // // // // // //   search: {
// // // // // // //     label: 'Search Operations',
// // // // // // //     operations: [
// // // // // // //       {
// // // // // // //         name: 'indexOf',
// // // // // // //         format: 'dot',
// // // // // // //         description: 'Find first occurrence of substring',
// // // // // // //         operation: (str, searchStr) => str.indexOf(searchStr),
// // // // // // //         args: [{
// // // // // // //           name: 'search',
// // // // // // //           type: 'text',
// // // // // // //           default: 'o',
// // // // // // //           placeholder: 'Search text'
// // // // // // //         }]
// // // // // // //       }
// // // // // // //     ]
// // // // // // //   }
// // // // // // // };

// // // // // // // const StringProcessorWrapper = () => {
// // // // // // //   const [selectedOperations, setSelectedOperations] = useState({});
  
// // // // // // //   const handleCategoryChange = (category, operationName) => {
// // // // // // //     setSelectedOperations(prev => ({
// // // // // // //       ...prev,
// // // // // // //       [category]: {
// // // // // // //         ...prev[category],
// // // // // // //         [operationName]: !prev[category]?.[operationName]
// // // // // // //       }
// // // // // // //     }));
// // // // // // //   };

// // // // // // //   const handleSelectAll = (category) => {
// // // // // // //     const categoryOperations = functionCategories[category].operations;
// // // // // // //     const newState = {};
// // // // // // //     categoryOperations.forEach(op => {
// // // // // // //       newState[op.name] = true;
// // // // // // //     });
    
// // // // // // //     setSelectedOperations(prev => ({
// // // // // // //       ...prev,
// // // // // // //       [category]: newState
// // // // // // //     }));
// // // // // // //   };

// // // // // // //   const handleResetAll = (category) => {
// // // // // // //     setSelectedOperations(prev => ({
// // // // // // //       ...prev,
// // // // // // //       [category]: {}
// // // // // // //     }));
// // // // // // //   };

// // // // // // //   const getSelectedOperations = () => {
// // // // // // //     const selected = [];
// // // // // // //     Object.entries(selectedOperations).forEach(([category, operations]) => {
// // // // // // //       Object.entries(operations).forEach(([opName, isSelected]) => {
// // // // // // //         if (isSelected) {
// // // // // // //           const categoryOps = functionCategories[category].operations;
// // // // // // //           const operation = categoryOps.find(op => op.name === opName);
// // // // // // //           if (operation) {
// // // // // // //             selected.push(operation);
// // // // // // //           }
// // // // // // //         }
// // // // // // //       });
// // // // // // //     });
// // // // // // //     return selected;
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div className={styles.wrapper}>
// // // // // // //       <div className={styles.selectionPanel}>
// // // // // // //         <h2 className={styles.title}>Select Operations</h2>
// // // // // // //         {Object.entries(functionCategories).map(([category, { label, operations }]) => (
// // // // // // //           <div key={category} className={styles.category}>
// // // // // // //             <div className={styles.categoryHeader}>
// // // // // // //               <h3>{label}</h3>
// // // // // // //               <div className={styles.categoryActions}>
// // // // // // //                 <button 
// // // // // // //                   onClick={() => handleSelectAll(category)}
// // // // // // //                   className={styles.actionButton}
// // // // // // //                 >
// // // // // // //                   Select All
// // // // // // //                 </button>
// // // // // // //                 <button 
// // // // // // //                   onClick={() => handleResetAll(category)}
// // // // // // //                   className={styles.actionButton}
// // // // // // //                 >
// // // // // // //                   Reset
// // // // // // //                 </button>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //             <div className={styles.operations}>
// // // // // // //               {operations.map(op => (
// // // // // // //                 <label key={op.name} className={styles.operationLabel}>
// // // // // // //                   <input
// // // // // // //                     type="checkbox"
// // // // // // //                     checked={selectedOperations[category]?.[op.name] || false}
// // // // // // //                     onChange={() => handleCategoryChange(category, op.name)}
// // // // // // //                     className={styles.checkbox}
// // // // // // //                   />
// // // // // // //                   {op.name}
// // // // // // //                 </label>
// // // // // // //               ))}
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         ))}
// // // // // // //       </div>
      
// // // // // // //       <div className={styles.processorContainer}>
// // // // // // //         <StringProcessor operations={getSelectedOperations()} />
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default StringProcessorWrapper;


// // // // // // import React, { useState } from 'react';
// // // // // // import StringProcessor from './StringProcessor';
// // // // // // import styles from './StringProcessorWrapper.module.css';

// // // // // // const functionCategories = {
// // // // // //   basic: {
// // // // // //     label: 'Basic Operations',
// // // // // //     operations: [
// // // // // //       {
// // // // // //         name: 'length',
// // // // // //         format: 'dot',
// // // // // //         description: 'Get string length',
// // // // // //         operation: str => str.length
// // // // // //       },
// // // // // //       {
// // // // // //         name: 'charAt',
// // // // // //         format: 'dot',
// // // // // //         description: 'Get character at specific index',
// // // // // //         operation: (str, index) => str.charAt(index),
// // // // // //         args: [{
// // // // // //           name: 'index',
// // // // // //           type: 'number',
// // // // // //           default: '0',
// // // // // //           placeholder: 'Enter index'
// // // // // //         }]
// // // // // //       }
// // // // // //     ]
// // // // // //   },
// // // // // //   manipulation: {
// // // // // //     label: 'String Manipulation',
// // // // // //     operations: [
// // // // // //       {
// // // // // //         name: 'slice',
// // // // // //         format: 'dot',
// // // // // //         description: 'Extract part of string',
// // // // // //         operation: (str, start, end) => str.slice(start, end),
// // // // // //         args: [
// // // // // //           {
// // // // // //             name: 'start',
// // // // // //             type: 'number',
// // // // // //             default: '0',
// // // // // //             placeholder: 'Start index'
// // // // // //           },
// // // // // //           {
// // // // // //             name: 'end',
// // // // // //             type: 'number',
// // // // // //             default: '5',
// // // // // //             placeholder: 'End index'
// // // // // //           }
// // // // // //         ]
// // // // // //       },
// // // // // //       {
// // // // // //         name: 'split',
// // // // // //         format: 'dot',
// // // // // //         description: 'Split string by delimiter',
// // // // // //         operation: (str, delimiter) => JSON.stringify(str.split(delimiter)),
// // // // // //         args: [{
// // // // // //           name: 'delimiter',
// // // // // //           type: 'text',
// // // // // //           default: ' ',
// // // // // //           placeholder: 'Enter delimiter'
// // // // // //         }]
// // // // // //       }
// // // // // //     ]
// // // // // //   },
// // // // // //   search: {
// // // // // //     label: 'Search Operations',
// // // // // //     operations: [
// // // // // //       {
// // // // // //         name: 'indexOf',
// // // // // //         format: 'dot',
// // // // // //         description: 'Find first occurrence of substring',
// // // // // //         operation: (str, searchStr) => str.indexOf(searchStr),
// // // // // //         args: [{
// // // // // //           name: 'search',
// // // // // //           type: 'text',
// // // // // //           default: 'o',
// // // // // //           placeholder: 'Search text'
// // // // // //         }]
// // // // // //       }
// // // // // //     ]
// // // // // //   }
// // // // // // };

// // // // // // const CategoryPanel = ({ 
// // // // // //   category, 
// // // // // //   label, 
// // // // // //   operations, 
// // // // // //   selectedOps, 
// // // // // //   onOperationChange, 
// // // // // //   onSelectAll, 
// // // // // //   onReset 
// // // // // // }) => {
// // // // // //   const [isExpanded, setIsExpanded] = useState(false);

// // // // // //   return (
// // // // // //     <div className={styles.categoryPanel}>
// // // // // //       <div 
// // // // // //         className={styles.categoryHeader} 
// // // // // //         onClick={() => setIsExpanded(!isExpanded)}
// // // // // //       >
// // // // // //         <div className={styles.categoryTitle}>
// // // // // //           <span className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}>▶</span>
// // // // // //           <h3>{label}</h3>
// // // // // //         </div>
// // // // // //         <div className={styles.categoryActions}>
// // // // // //           <button onClick={(e) => {
// // // // // //             e.stopPropagation();
// // // // // //             onSelectAll(category);
// // // // // //           }}>
// // // // // //             Select All
// // // // // //           </button>
// // // // // //           <button onClick={(e) => {
// // // // // //             e.stopPropagation();
// // // // // //             onReset(category);
// // // // // //           }}>
// // // // // //             Reset
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       </div>
      
// // // // // //       {isExpanded && (
// // // // // //         <div className={styles.operations}>
// // // // // //           {operations.map(op => (
// // // // // //             <label key={op.name} className={styles.operationLabel}>
// // // // // //               <input
// // // // // //                 type="checkbox"
// // // // // //                 checked={selectedOps[op.name] || false}
// // // // // //                 onChange={() => onOperationChange(category, op.name)}
// // // // // //               />
// // // // // //               {op.name}
// // // // // //             </label>
// // // // // //           ))}
// // // // // //         </div>
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // const StringProcessorWrapper = (props) => {
// // // // // //   const [selectedOperations, setSelectedOperations] = useState({});
  
// // // // // //   const handleCategoryChange = (category, operationName) => {
// // // // // //     setSelectedOperations(prev => ({
// // // // // //       ...prev,
// // // // // //       [category]: {
// // // // // //         ...prev[category],
// // // // // //         [operationName]: !prev[category]?.[operationName]
// // // // // //       }
// // // // // //     }));
// // // // // //   };

// // // // // //   const handleSelectAll = (category) => {
// // // // // //     const categoryOperations = functionCategories[category].operations;
// // // // // //     const newState = {};
// // // // // //     categoryOperations.forEach(op => {
// // // // // //       newState[op.name] = true;
// // // // // //     });
    
// // // // // //     setSelectedOperations(prev => ({
// // // // // //       ...prev,
// // // // // //       [category]: newState
// // // // // //     }));
// // // // // //   };

// // // // // //   const handleResetAll = (category) => {
// // // // // //     setSelectedOperations(prev => ({
// // // // // //       ...prev,
// // // // // //       [category]: {}
// // // // // //     }));
// // // // // //   };

// // // // // //   const handleSelectAllCategories = () => {
// // // // // //     const allSelected = {};
// // // // // //     Object.entries(functionCategories).forEach(([category, { operations }]) => {
// // // // // //       allSelected[category] = {};
// // // // // //       operations.forEach(op => {
// // // // // //         allSelected[category][op.name] = true;
// // // // // //       });
// // // // // //     });
// // // // // //     setSelectedOperations(allSelected);
// // // // // //   };

// // // // // //   const handleResetAllCategories = () => {
// // // // // //     setSelectedOperations({});
// // // // // //   };

// // // // // //   const getSelectedOperations = () => {
// // // // // //     const selected = [];
// // // // // //     Object.entries(selectedOperations).forEach(([category, operations]) => {
// // // // // //       Object.entries(operations).forEach(([opName, isSelected]) => {
// // // // // //         if (isSelected) {
// // // // // //           const categoryOps = functionCategories[category].operations;
// // // // // //           const operation = categoryOps.find(op => op.name === opName);
// // // // // //           if (operation) {
// // // // // //             selected.push(operation);
// // // // // //           }
// // // // // //         }
// // // // // //       });
// // // // // //     });
// // // // // //     return selected;
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className={styles.wrapper}>
// // // // // //       <div className={styles.selectionPanel}>
// // // // // //         <div className={styles.globalActions}>
// // // // // //           <button onClick={handleSelectAllCategories}>Select All Operations</button>
// // // // // //           <button onClick={handleResetAllCategories}>Reset All</button>
// // // // // //         </div>
        
// // // // // //         {Object.entries(functionCategories).map(([category, { label, operations }]) => (
// // // // // //           <CategoryPanel
// // // // // //             key={category}
// // // // // //             category={category}
// // // // // //             label={label}
// // // // // //             operations={operations}
// // // // // //             selectedOps={selectedOperations[category] || {}}
// // // // // //             onOperationChange={handleCategoryChange}
// // // // // //             onSelectAll={handleSelectAll}
// // // // // //             onReset={handleResetAll}
// // // // // //           />
// // // // // //         ))}
// // // // // //       </div>
      
// // // // // //       <StringProcessor 
// // // // // //         {...props}
// // // // // //         operations={getSelectedOperations()} 
// // // // // //       />
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default StringProcessorWrapper;

// // // // // import React, { useState } from 'react';
// // // // // import StringProcessor from './StringProcessor';
// // // // // import styles from './StringProcessorWrapper.module.css';

// // // // // const functionCategories = {
// // // // //   basic: {
// // // // //     label: 'Basic',
// // // // //     operations: [
// // // // //       {
// // // // //         name: 'length',
// // // // //         format: 'dot',
// // // // //         description: 'Get string length',
// // // // //         operation: str => str.length
// // // // //       },
// // // // //       {
// // // // //         name: 'charAt',
// // // // //         format: 'dot',
// // // // //         description: 'Get character at specific index',
// // // // //         operation: (str, index) => str.charAt(index),
// // // // //         args: [{
// // // // //           name: 'index',
// // // // //           type: 'number',
// // // // //           default: '0',
// // // // //           placeholder: 'Enter index'
// // // // //         }]
// // // // //       }
// // // // //     ]
// // // // //   },
// // // // //   manipulation: {
// // // // //     label: 'Manipulation',
// // // // //     operations: [
// // // // //       {
// // // // //         name: 'slice',
// // // // //         format: 'dot',
// // // // //         description: 'Extract part of string',
// // // // //         operation: (str, start, end) => str.slice(start, end),
// // // // //         args: [
// // // // //           {
// // // // //             name: 'start',
// // // // //             type: 'number',
// // // // //             default: '0',
// // // // //             placeholder: 'Start'
// // // // //           },
// // // // //           {
// // // // //             name: 'end',
// // // // //             type: 'number',
// // // // //             default: '5',
// // // // //             placeholder: 'End'
// // // // //           }
// // // // //         ]
// // // // //       },
// // // // //       {
// // // // //         name: 'split',
// // // // //         format: 'dot',
// // // // //         description: 'Split string by delimiter',
// // // // //         operation: (str, delimiter) => JSON.stringify(str.split(delimiter)),
// // // // //         args: [{
// // // // //           name: 'delimiter',
// // // // //           type: 'text',
// // // // //           default: ' ',
// // // // //           placeholder: 'Delimiter'
// // // // //         }]
// // // // //       }
// // // // //     ]
// // // // //   },
// // // // //   search: {
// // // // //     label: 'Search',
// // // // //     operations: [
// // // // //       {
// // // // //         name: 'indexOf',
// // // // //         format: 'dot',
// // // // //         description: 'Find first occurrence of substring',
// // // // //         operation: (str, searchStr) => str.indexOf(searchStr),
// // // // //         args: [{
// // // // //           name: 'search',
// // // // //           type: 'text',
// // // // //           default: 'o',
// // // // //           placeholder: 'Search text'
// // // // //         }]
// // // // //       }
// // // // //     ]
// // // // //   }
// // // // // };

// // // // // const CategoryPanel = ({ 
// // // // //   category, 
// // // // //   label, 
// // // // //   operations, 
// // // // //   selectedOps, 
// // // // //   onOperationChange, 
// // // // //   onSelectAll, 
// // // // //   onReset 
// // // // // }) => {
// // // // //   const [isExpanded, setIsExpanded] = useState(false);

// // // // //   return (
// // // // //     <div className={styles.categoryPanel}>
// // // // //       <div 
// // // // //         className={styles.categoryHeader} 
// // // // //         onClick={() => setIsExpanded(!isExpanded)}
// // // // //       >
// // // // //         <div className={styles.categoryTitle}>
// // // // //           <span className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}>▶</span>
// // // // //           <h3>{label}</h3>
// // // // //         </div>
// // // // //         <div className={styles.categoryActions}>
// // // // //           <button onClick={(e) => {
// // // // //             e.stopPropagation();
// // // // //             onSelectAll(category);
// // // // //           }}>
// // // // //             All
// // // // //           </button>
// // // // //           <button onClick={(e) => {
// // // // //             e.stopPropagation();
// // // // //             onReset(category);
// // // // //           }}>
// // // // //             Reset
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
      
// // // // //       {isExpanded && (
// // // // //         <div className={styles.operations}>
// // // // //           {operations.map(op => (
// // // // //             <label key={op.name} className={styles.operationLabel}>
// // // // //               <input
// // // // //                 type="checkbox"
// // // // //                 checked={selectedOps[op.name] || false}
// // // // //                 onChange={() => onOperationChange(category, op.name)}
// // // // //               />
// // // // //               {op.name}
// // // // //             </label>
// // // // //           ))}
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // const StringProcessorWrapper = ({ language, defaultString, baseUrl, title, ...otherProps }) => {
// // // // //   const [selectedOperations, setSelectedOperations] = useState({});
  
// // // // //   const handleCategoryChange = (category, operationName) => {
// // // // //     setSelectedOperations(prev => ({
// // // // //       ...prev,
// // // // //       [category]: {
// // // // //         ...prev[category],
// // // // //         [operationName]: !prev[category]?.[operationName]
// // // // //       }
// // // // //     }));
// // // // //   };

// // // // //   const handleSelectAll = (category) => {
// // // // //     const categoryOperations = functionCategories[category].operations;
// // // // //     const newState = {};
// // // // //     categoryOperations.forEach(op => {
// // // // //       newState[op.name] = true;
// // // // //     });
    
// // // // //     setSelectedOperations(prev => ({
// // // // //       ...prev,
// // // // //       [category]: newState
// // // // //     }));
// // // // //   };

// // // // //   const handleResetAll = (category) => {
// // // // //     setSelectedOperations(prev => ({
// // // // //       ...prev,
// // // // //       [category]: {}
// // // // //     }));
// // // // //   };

// // // // //   const handleSelectAllCategories = () => {
// // // // //     const allSelected = {};
// // // // //     Object.entries(functionCategories).forEach(([category, { operations }]) => {
// // // // //       allSelected[category] = {};
// // // // //       operations.forEach(op => {
// // // // //         allSelected[category][op.name] = true;
// // // // //       });
// // // // //     });
// // // // //     setSelectedOperations(allSelected);
// // // // //   };

// // // // //   const handleResetAllCategories = () => {
// // // // //     setSelectedOperations({});
// // // // //   };

// // // // //   const getSelectedOperations = () => {
// // // // //     const selected = [];
// // // // //     Object.entries(selectedOperations).forEach(([category, operations]) => {
// // // // //       Object.entries(operations).forEach(([opName, isSelected]) => {
// // // // //         if (isSelected) {
// // // // //           const categoryOps = functionCategories[category].operations;
// // // // //           const operation = categoryOps.find(op => op.name === opName);
// // // // //           if (operation) {
// // // // //             selected.push(operation);
// // // // //           }
// // // // //         }
// // // // //       });
// // // // //     });
// // // // //     return selected;
// // // // //   };

// // // // //   return (
// // // // //     <div className={styles.wrapper}>
// // // // //       <div className={styles.processorContent}>
// // // // //         <div className={styles.selectionPanel}>
// // // // //           <div className={styles.globalActions}>
// // // // //             <button onClick={handleSelectAllCategories}>All Operations</button>
// // // // //             <button onClick={handleResetAllCategories}>Reset All</button>
// // // // //           </div>
          
// // // // //           <div className={styles.categoriesRow}>
// // // // //             {Object.entries(functionCategories).map(([category, { label, operations }]) => (
// // // // //               <CategoryPanel
// // // // //                 key={category}
// // // // //                 category={category}
// // // // //                 label={label}
// // // // //                 operations={operations}
// // // // //                 selectedOps={selectedOperations[category] || {}}
// // // // //                 onOperationChange={handleCategoryChange}
// // // // //                 onSelectAll={handleSelectAll}
// // // // //                 onReset={handleResetAll}
// // // // //               />
// // // // //             ))}
// // // // //           </div>
// // // // //         </div>

// // // // //         <StringProcessor 
// // // // //           language={language}
// // // // //           defaultString={defaultString}
// // // // //           baseUrl={baseUrl}
// // // // //           title={title}
// // // // //           {...otherProps}
// // // // //           operations={getSelectedOperations()} 
// // // // //         />
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default StringProcessorWrapper;

// // // // import React, { useState } from 'react';
// // // // import StringProcessor from './StringProcessor';
// // // // import styles from './StringProcessorWrapper.module.css';

// // // // const functionCategories = {
// // // //   basic: {
// // // //     label: 'Basic',
// // // //     operations: [
// // // //       {
// // // //         name: 'length',
// // // //         format: 'dot',
// // // //         description: 'Get string length',
// // // //         operation: str => str.length
// // // //       },
// // // //       {
// // // //         name: 'charAt',
// // // //         format: 'dot',
// // // //         description: 'Get character at specific index',
// // // //         operation: (str, index) => str.charAt(index),
// // // //         args: [{
// // // //           name: 'index',
// // // //           type: 'number',
// // // //           default: '0',
// // // //           placeholder: 'Enter index'
// // // //         }]
// // // //       }
// // // //     ]
// // // //   },
// // // //   manipulation: {
// // // //     label: 'Manipulation',
// // // //     operations: [
// // // //       {
// // // //         name: 'slice',
// // // //         format: 'dot',
// // // //         description: 'Extract part of string',
// // // //         operation: (str, start, end) => str.slice(start, end),
// // // //         args: [
// // // //           {
// // // //             name: 'start',
// // // //             type: 'number',
// // // //             default: '0',
// // // //             placeholder: 'Start'
// // // //           },
// // // //           {
// // // //             name: 'end',
// // // //             type: 'number',
// // // //             default: '5',
// // // //             placeholder: 'End'
// // // //           }
// // // //         ]
// // // //       },
// // // //       {
// // // //         name: 'split',
// // // //         format: 'dot',
// // // //         description: 'Split string by delimiter',
// // // //         operation: (str, delimiter) => JSON.stringify(str.split(delimiter)),
// // // //         args: [{
// // // //           name: 'delimiter',
// // // //           type: 'text',
// // // //           default: ' ',
// // // //           placeholder: 'Delimiter'
// // // //         }]
// // // //       }
// // // //     ]
// // // //   },
// // // //   search: {
// // // //     label: 'Search',
// // // //     operations: [
// // // //       {
// // // //         name: 'indexOf',
// // // //         format: 'dot',
// // // //         description: 'Find first occurrence of substring',
// // // //         operation: (str, searchStr) => str.indexOf(searchStr),
// // // //         args: [{
// // // //           name: 'search',
// // // //           type: 'text',
// // // //           default: 'o',
// // // //           placeholder: 'Search text'
// // // //         }]
// // // //       }
// // // //     ]
// // // //   }
// // // // };

// // // // const CategoryPanel = ({ 
// // // //   category, 
// // // //   label, 
// // // //   operations, 
// // // //   selectedOps, 
// // // //   onOperationChange, 
// // // //   onSelectAll, 
// // // //   onReset 
// // // // }) => {
// // // //   const [isExpanded, setIsExpanded] = useState(false);

// // // //   return (
// // // //     <div className={styles.categoryPanel}>
// // // //       <div 
// // // //         className={styles.categoryHeader} 
// // // //         onClick={() => setIsExpanded(!isExpanded)}
// // // //       >
// // // //         <div className={styles.categoryTitle}>
// // // //           <span className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}>▶</span>
// // // //           <h3>{label}</h3>
// // // //         </div>
// // // //         <div className={styles.categoryActions}>
// // // //           <button onClick={(e) => {
// // // //             e.stopPropagation();
// // // //             onSelectAll(category);
// // // //           }}>
// // // //             All
// // // //           </button>
// // // //           <button onClick={(e) => {
// // // //             e.stopPropagation();
// // // //             onReset(category);
// // // //           }}>
// // // //             Reset
// // // //           </button>
// // // //         </div>
// // // //       </div>
      
// // // //       {isExpanded && (
// // // //         <div className={styles.operations}>
// // // //           {operations.map(op => (
// // // //             <label key={op.name} className={styles.operationLabel}>
// // // //               <input
// // // //                 type="checkbox"
// // // //                 checked={selectedOps[op.name] || false}
// // // //                 onChange={() => onOperationChange(category, op.name)}
// // // //               />
// // // //               {op.name}
// // // //             </label>
// // // //           ))}
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // const StringProcessorWrapper = ({ language, defaultString, baseUrl, title, ...otherProps }) => {
// // // //   const [selectedOperations, setSelectedOperations] = useState({});
  
// // // //   const handleCategoryChange = (category, operationName) => {
// // // //     setSelectedOperations(prev => ({
// // // //       ...prev,
// // // //       [category]: {
// // // //         ...prev[category],
// // // //         [operationName]: !prev[category]?.[operationName]
// // // //       }
// // // //     }));
// // // //   };

// // // //   const handleSelectAll = (category) => {
// // // //     const categoryOperations = functionCategories[category].operations;
// // // //     const newState = {};
// // // //     categoryOperations.forEach(op => {
// // // //       newState[op.name] = true;
// // // //     });
    
// // // //     setSelectedOperations(prev => ({
// // // //       ...prev,
// // // //       [category]: newState
// // // //     }));
// // // //   };

// // // //   const handleResetAll = (category) => {
// // // //     setSelectedOperations(prev => ({
// // // //       ...prev,
// // // //       [category]: {}
// // // //     }));
// // // //   };

// // // //   const handleSelectAllCategories = () => {
// // // //     const allSelected = {};
// // // //     Object.entries(functionCategories).forEach(([category, { operations }]) => {
// // // //       allSelected[category] = {};
// // // //       operations.forEach(op => {
// // // //         allSelected[category][op.name] = true;
// // // //       });
// // // //     });
// // // //     setSelectedOperations(allSelected);
    
// // // //     // Force expand all panels
// // // //     const panels = document.querySelectorAll(`.${styles.categoryPanel}`);
// // // //     panels.forEach(panel => {
// // // //       const header = panel.querySelector(`.${styles.categoryHeader}`);
// // // //       if (header) header.click();
// // // //     });
// // // //   };

// // // //   const handleResetAllCategories = () => {
// // // //     setSelectedOperations({});
// // // //   };

// // // //   const getSelectedOperations = () => {
// // // //     const selected = [];
// // // //     Object.entries(selectedOperations).forEach(([category, operations]) => {
// // // //       Object.entries(operations).forEach(([opName, isSelected]) => {
// // // //         if (isSelected) {
// // // //           const categoryOps = functionCategories[category].operations;
// // // //           const operation = categoryOps.find(op => op.name === opName);
// // // //           if (operation) {
// // // //             selected.push(operation);
// // // //           }
// // // //         }
// // // //       });
// // // //     });
// // // //     return selected;
// // // //   };

// // // //   return (
// // // //     <div className={styles.wrapper}>
// // // //       <div className={styles.selectionPanel}>
// // // //         <div className={styles.globalActions}>
// // // //           <button onClick={handleSelectAllCategories}>All Operations</button>
// // // //           <button onClick={handleResetAllCategories}>Reset All</button>
// // // //         </div>
        
// // // //         <div className={styles.categoriesRow}>
// // // //           {Object.entries(functionCategories).map(([category, { label, operations }]) => (
// // // //             <CategoryPanel
// // // //               key={category}
// // // //               category={category}
// // // //               label={label}
// // // //               operations={operations}
// // // //               selectedOps={selectedOperations[category] || {}}
// // // //               onOperationChange={handleCategoryChange}
// // // //               onSelectAll={handleSelectAll}
// // // //               onReset={handleResetAll}
// // // //             />
// // // //           ))}
// // // //         </div>
// // // //       </div>

// // // //       <div className={styles.stringInput}>
// // // //         <StringProcessor 
// // // //           language={language}
// // // //           defaultString={defaultString}
// // // //           baseUrl={baseUrl}
// // // //           title={title}
// // // //           {...otherProps}
// // // //           operations={[]} 
// // // //         />
// // // //       </div>

// // // //       <div className={styles.operationsGrid}>
// // // //         <StringProcessor 
// // // //           language={language}
// // // //           defaultString={defaultString}
// // // //           baseUrl={baseUrl}
// // // //           title={title}
// // // //           {...otherProps}
// // // //           operations={getSelectedOperations()} 
// // // //         />
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default StringProcessorWrapper;


// // // import React, { useState } from 'react';
// // // import StringProcessor from './StringProcessor';
// // // import styles from './StringProcessorWrapper.module.css';

// // // const functionCategories = {
// // //   basic: {
// // //     label: 'Basic',
// // //     operations: [
// // //       {
// // //         name: 'length',
// // //         format: 'dot',
// // //         description: 'Get string length',
// // //         operation: str => str.length
// // //       },
// // //       {
// // //         name: 'charAt',
// // //         format: 'dot',
// // //         description: 'Get character at specific index',
// // //         operation: (str, index) => str.charAt(index),
// // //         args: [{
// // //           name: 'index',
// // //           type: 'number',
// // //           default: '0',
// // //           placeholder: 'Enter index'
// // //         }]
// // //       }
// // //     ]
// // //   },
// // //   manipulation: {
// // //     label: 'Manipulation',
// // //     operations: [
// // //       {
// // //         name: 'slice',
// // //         format: 'dot',
// // //         description: 'Extract part of string',
// // //         operation: (str, start, end) => str.slice(start, end),
// // //         args: [
// // //           {
// // //             name: 'start',
// // //             type: 'number',
// // //             default: '0',
// // //             placeholder: 'Start'
// // //           },
// // //           {
// // //             name: 'end',
// // //             type: 'number',
// // //             default: '5',
// // //             placeholder: 'End'
// // //           }
// // //         ]
// // //       },
// // //       {
// // //         name: 'split',
// // //         format: 'dot',
// // //         description: 'Split string by delimiter',
// // //         operation: (str, delimiter) => JSON.stringify(str.split(delimiter)),
// // //         args: [{
// // //           name: 'delimiter',
// // //           type: 'text',
// // //           default: ' ',
// // //           placeholder: 'Delimiter'
// // //         }]
// // //       }
// // //     ]
// // //   },
// // //   search: {
// // //     label: 'Search',
// // //     operations: [
// // //       {
// // //         name: 'indexOf',
// // //         format: 'dot',
// // //         description: 'Find first occurrence of substring',
// // //         operation: (str, searchStr) => str.indexOf(searchStr),
// // //         args: [{
// // //           name: 'search',
// // //           type: 'text',
// // //           default: 'o',
// // //           placeholder: 'Search text'
// // //         }]
// // //       }
// // //     ]
// // //   }
// // // };

// // // const CategoryPanel = ({ 
// // //   category, 
// // //   label, 
// // //   operations, 
// // //   selectedOps, 
// // //   onOperationChange, 
// // //   onSelectAll, 
// // //   onReset 
// // // }) => {
// // //   const [isExpanded, setIsExpanded] = useState(false);

// // //   return (
// // //     <div className={styles.categoryPanel}>
// // //       <div 
// // //         className={styles.categoryHeader} 
// // //         onClick={() => setIsExpanded(!isExpanded)}
// // //       >
// // //         <div className={styles.categoryTitle}>
// // //           <span className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}>▶</span>
// // //           <h3>{label}</h3>
// // //         </div>
// // //         <div className={styles.categoryActions}>
// // //           <button onClick={(e) => {
// // //             e.stopPropagation();
// // //             onSelectAll(category);
// // //           }}>
// // //             All
// // //           </button>
// // //           <button onClick={(e) => {
// // //             e.stopPropagation();
// // //             onReset(category);
// // //           }}>
// // //             Reset
// // //           </button>
// // //         </div>
// // //       </div>
      
// // //       {isExpanded && (
// // //         <div className={styles.operations}>
// // //           {operations.map(op => (
// // //             <label key={op.name} className={styles.operationLabel}>
// // //               <input
// // //                 type="checkbox"
// // //                 checked={selectedOps[op.name] || false}
// // //                 onChange={() => onOperationChange(category, op.name)}
// // //               />
// // //               {op.name}
// // //             </label>
// // //           ))}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // const StringProcessorWrapper = ({ language, defaultString, baseUrl, title, ...otherProps }) => {
// // //   const [selectedOperations, setSelectedOperations] = useState({});
// // //   const [inputString, setInputString] = useState(defaultString);
  
// // //   const handleCategoryChange = (category, operationName) => {
// // //     setSelectedOperations(prev => ({
// // //       ...prev,
// // //       [category]: {
// // //         ...prev[category],
// // //         [operationName]: !prev[category]?.[operationName]
// // //       }
// // //     }));
// // //   };

// // //   const handleSelectAll = (category) => {
// // //     const categoryOperations = functionCategories[category].operations;
// // //     const newState = {};
// // //     categoryOperations.forEach(op => {
// // //       newState[op.name] = true;
// // //     });
    
// // //     setSelectedOperations(prev => ({
// // //       ...prev,
// // //       [category]: newState
// // //     }));
// // //   };

// // //   const handleResetAll = (category) => {
// // //     setSelectedOperations(prev => ({
// // //       ...prev,
// // //       [category]: {}
// // //     }));
// // //   };

// // //   const handleSelectAllCategories = () => {
// // //     const allSelected = {};
// // //     Object.entries(functionCategories).forEach(([category, { operations }]) => {
// // //       allSelected[category] = {};
// // //       operations.forEach(op => {
// // //         allSelected[category][op.name] = true;
// // //       });
// // //     });
// // //     setSelectedOperations(allSelected);
    
// // //     const panels = document.querySelectorAll(`.${styles.categoryPanel}`);
// // //     panels.forEach(panel => {
// // //       const header = panel.querySelector(`.${styles.categoryHeader}`);
// // //       if (header) header.click();
// // //     });
// // //   };

// // //   const handleResetAllCategories = () => {
// // //     setSelectedOperations({});
// // //   };

// // //   const getSelectedOperations = () => {
// // //     const selected = [];
// // //     Object.entries(selectedOperations).forEach(([category, operations]) => {
// // //       Object.entries(operations).forEach(([opName, isSelected]) => {
// // //         if (isSelected) {
// // //           const categoryOps = functionCategories[category].operations;
// // //           const operation = categoryOps.find(op => op.name === opName);
// // //           if (operation) {
// // //             selected.push(operation);
// // //           }
// // //         }
// // //       });
// // //     });
// // //     return selected;
// // //   };

// // //   return (
// // //     <div className={styles.wrapper}>
// // //       <div className={styles.selectionPanel}>
// // //         <div className={styles.globalActions}>
// // //           <button onClick={handleSelectAllCategories}>All Operations</button>
// // //           <button onClick={handleResetAllCategories}>Reset All</button>
// // //         </div>
        
// // //         <div className={styles.categoriesRow}>
// // //           {Object.entries(functionCategories).map(([category, { label, operations }]) => (
// // //             <CategoryPanel
// // //               key={category}
// // //               category={category}
// // //               label={label}
// // //               operations={operations}
// // //               selectedOps={selectedOperations[category] || {}}
// // //               onOperationChange={handleCategoryChange}
// // //               onSelectAll={handleSelectAll}
// // //               onReset={handleResetAll}
// // //             />
// // //           ))}
// // //         </div>
// // //       </div>

// // //       <div className={styles.operationsContainer}>
// // //         <StringProcessor 
// // //           language={language}
// // //           defaultString={defaultString}
// // //           baseUrl={baseUrl}
// // //           title={title}
// // //           {...otherProps}
// // //           operations={getSelectedOperations()} 
// // //         />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default StringProcessorWrapper;

// // import React, { useState } from 'react';
// // import StringProcessor from './StringProcessor';
// // import styles from './StringProcessorWrapper.module.css';

// // const functionCategories = {
// //   basic: {
// //     label: 'Basic',
// //     operations: [
// //       {
// //         name: 'length',
// //         format: 'dot',
// //         description: 'Get string length',
// //         operation: str => str.length
// //       },
// //       {
// //         name: 'charAt',
// //         format: 'dot',
// //         description: 'Get character at specific index',
// //         operation: (str, index) => str.charAt(index),
// //         args: [{
// //           name: 'index',
// //           type: 'number',
// //           default: '0',
// //           placeholder: 'Enter index'
// //         }]
// //       }
// //     ]
// //   },
// //   manipulation: {
// //     label: 'Manipulation',
// //     operations: [
// //       {
// //         name: 'slice',
// //         format: 'dot',
// //         description: 'Extract part of string',
// //         operation: (str, start, end) => str.slice(start, end),
// //         args: [
// //           {
// //             name: 'start',
// //             type: 'number',
// //             default: '0',
// //             placeholder: 'Start'
// //           },
// //           {
// //             name: 'end',
// //             type: 'number',
// //             default: '5',
// //             placeholder: 'End'
// //           }
// //         ]
// //       },
// //       {
// //         name: 'split',
// //         format: 'dot',
// //         description: 'Split string by delimiter',
// //         operation: (str, delimiter) => JSON.stringify(str.split(delimiter)),
// //         args: [{
// //           name: 'delimiter',
// //           type: 'text',
// //           default: ' ',
// //           placeholder: 'Delimiter'
// //         }]
// //       }
// //     ]
// //   },
// //   search: {
// //     label: 'Search',
// //     operations: [
// //       {
// //         name: 'indexOf',
// //         format: 'dot',
// //         description: 'Find first occurrence of substring',
// //         operation: (str, searchStr) => str.indexOf(searchStr),
// //         args: [{
// //           name: 'search',
// //           type: 'text',
// //           default: 'o',
// //           placeholder: 'Search text'
// //         }]
// //       }
// //     ]
// //   }
// // };

// // const CategoryPanel = ({ 
// //   category, 
// //   label, 
// //   operations, 
// //   selectedOps, 
// //   onOperationChange, 
// //   onSelectAll, 
// //   onReset 
// // }) => {
// //   const [isExpanded, setIsExpanded] = useState(false);

// //   return (
// //     <div className={styles.categoryPanel}>
// //       <div 
// //         className={styles.categoryHeader} 
// //         onClick={() => setIsExpanded(!isExpanded)}
// //       >
// //         <div className={styles.categoryTitle}>
// //           <span className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}>▶</span>
// //           <h3>{label}</h3>
// //         </div>
// //         <div className={styles.categoryActions}>
// //           <button onClick={(e) => {
// //             e.stopPropagation();
// //             onSelectAll(category);
// //           }}>
// //             All
// //           </button>
// //           <button onClick={(e) => {
// //             e.stopPropagation();
// //             onReset(category);
// //           }}>
// //             Reset
// //           </button>
// //         </div>
// //       </div>
      
// //       {isExpanded && (
// //         <div className={styles.operations}>
// //           {operations.map(op => (
// //             <label key={op.name} className={styles.operationLabel}>
// //               <input
// //                 type="checkbox"
// //                 checked={selectedOps[op.name] || false}
// //                 onChange={() => onOperationChange(category, op.name)}
// //               />
// //               {op.name}
// //             </label>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const StringProcessorWrapper = ({ language, defaultString, baseUrl, title, ...otherProps }) => {
// //   const [selectedOperations, setSelectedOperations] = useState({});
// //   const [inputString, setInputString] = useState(defaultString);
  
// //   const handleCategoryChange = (category, operationName) => {
// //     setSelectedOperations(prev => ({
// //       ...prev,
// //       [category]: {
// //         ...prev[category],
// //         [operationName]: !prev[category]?.[operationName]
// //       }
// //     }));
// //   };

// //   const handleSelectAll = (category) => {
// //     const categoryOperations = functionCategories[category].operations;
// //     const newState = {};
// //     categoryOperations.forEach(op => {
// //       newState[op.name] = true;
// //     });
    
// //     setSelectedOperations(prev => ({
// //       ...prev,
// //       [category]: newState
// //     }));
// //   };

// //   const handleResetAll = (category) => {
// //     setSelectedOperations(prev => ({
// //       ...prev,
// //       [category]: {}
// //     }));
// //   };

// //   const handleSelectAllCategories = () => {
// //     const allSelected = {};
// //     Object.entries(functionCategories).forEach(([category, { operations }]) => {
// //       allSelected[category] = {};
// //       operations.forEach(op => {
// //         allSelected[category][op.name] = true;
// //       });
// //     });
// //     setSelectedOperations(allSelected);
    
// //     const panels = document.querySelectorAll(`.${styles.categoryPanel}`);
// //     panels.forEach(panel => {
// //       const isCollapsed = !panel.querySelector(`.${styles.operations}`);
// //       if (isCollapsed) {
// //         const header = panel.querySelector(`.${styles.categoryHeader}`);
// //         if (header) header.click();
// //       }
// //     });
// //   };

// //   const handleResetAllCategories = () => {
// //     setSelectedOperations({});
// //   };

// //   const getSelectedOperations = () => {
// //     const selected = [];
// //     Object.entries(selectedOperations).forEach(([category, operations]) => {
// //       Object.entries(operations).forEach(([opName, isSelected]) => {
// //         if (isSelected) {
// //           const categoryOps = functionCategories[category].operations;
// //           const operation = categoryOps.find(op => op.name === opName);
// //           if (operation) {
// //             selected.push(operation);
// //           }
// //         }
// //       });
// //     });
// //     return selected;
// //   };

// //   return (
// //     <div className={styles.wrapper}>
// //       <div className={styles.selectionPanel}>
// //         <div className={styles.globalActions}>
// //           <button onClick={handleSelectAllCategories}>All Operations</button>
// //           <button onClick={handleResetAllCategories}>Reset All</button>
// //         </div>
        
// //         <div className={styles.categoriesRow}>
// //           {Object.entries(functionCategories).map(([category, { label, operations }]) => (
// //             <CategoryPanel
// //               key={category}
// //               category={category}
// //               label={label}
// //               operations={operations}
// //               selectedOps={selectedOperations[category] || {}}
// //               onOperationChange={handleCategoryChange}
// //               onSelectAll={handleSelectAll}
// //               onReset={handleResetAll}
// //             />
// //           ))}
// //         </div>
// //       </div>

// //       <div className={styles.operationsContainer}>
// //         <StringProcessor 
// //           language={language}
// //           defaultString={defaultString}
// //           baseUrl={baseUrl}
// //           title={title}
// //           {...otherProps}
// //           operations={getSelectedOperations()} 
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default StringProcessorWrapper;


// import React, { useState } from 'react';
// import StringProcessor from './StringProcessor';
// import styles from './StringProcessorWrapper.module.css';

// const functionCategories = {
//   basic: {
//     label: 'Basic',
//     operations: [
//       {
//         name: 'length',
//         format: 'dot',
//         description: 'Get string length',
//         operation: str => str.length
//       },
//       {
//         name: 'charAt',
//         format: 'dot',
//         description: 'Get character at specific index',
//         operation: (str, index) => str.charAt(index),
//         args: [{
//           name: 'index',
//           type: 'number',
//           default: '0',
//           placeholder: 'Enter index'
//         }]
//       }
//     ]
//   },
//   manipulation: {
//     label: 'Manipulation',
//     operations: [
//       {
//         name: 'slice',
//         format: 'dot',
//         description: 'Extract part of string',
//         operation: (str, start, end) => str.slice(start, end),
//         args: [
//           {
//             name: 'start',
//             type: 'number',
//             default: '0',
//             placeholder: 'Start'
//           },
//           {
//             name: 'end',
//             type: 'number',
//             default: '5',
//             placeholder: 'End'
//           }
//         ]
//       },
//       {
//         name: 'split',
//         format: 'dot',
//         description: 'Split string by delimiter',
//         operation: (str, delimiter) => JSON.stringify(str.split(delimiter)),
//         args: [{
//           name: 'delimiter',
//           type: 'text',
//           default: ' ',
//           placeholder: 'Delimiter'
//         }]
//       }
//     ]
//   },
//   search: {
//     label: 'Search',
//     operations: [
//       {
//         name: 'indexOf',
//         format: 'dot',
//         description: 'Find first occurrence of substring',
//         operation: (str, searchStr) => str.indexOf(searchStr),
//         args: [{
//           name: 'search',
//           type: 'text',
//           default: 'o',
//           placeholder: 'Search text'
//         }]
//       }
//     ]
//   }
// };

// const CategoryPanel = ({ 
//   category, 
//   label, 
//   operations, 
//   selectedOps, 
//   onOperationChange, 
//   onSelectAll, 
//   onReset 
// }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   return (
//     <div className={styles.categoryPanel}>
//       <div 
//         className={styles.categoryHeader} 
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <div className={styles.categoryTitle}>
//           <span className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}>▶</span>
//           <h3>{label}</h3>
//         </div>
//         <div className={styles.categoryActions}>
//           <button onClick={(e) => {
//             e.stopPropagation();
//             onSelectAll(category);
//           }}>
//             All
//           </button>
//           <button onClick={(e) => {
//             e.stopPropagation();
//             onReset(category);
//           }}>
//             Reset
//           </button>
//         </div>
//       </div>
      
//       {isExpanded && (
//         <div className={styles.operations}>
//           {operations.map(op => (
//             <label key={op.name} className={styles.operationLabel}>
//               <input
//                 type="checkbox"
//                 checked={selectedOps[op.name] || false}
//                 onChange={() => onOperationChange(category, op.name)}
//               />
//               {op.name}
//             </label>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const StringProcessorWrapper = ({ language, defaultString, baseUrl, title, ...otherProps }) => {
//   const [selectedOperations, setSelectedOperations] = useState({});
//   const [inputString, setInputString] = useState(defaultString);
  
//   const handleCategoryChange = (category, operationName) => {
//     setSelectedOperations(prev => ({
//       ...prev,
//       [category]: {
//         ...prev[category],
//         [operationName]: !prev[category]?.[operationName]
//       }
//     }));
//   };

//   const handleSelectAll = (category) => {
//     const categoryOperations = functionCategories[category].operations;
//     const newState = {};
//     categoryOperations.forEach(op => {
//       newState[op.name] = true;
//     });
    
//     setSelectedOperations(prev => ({
//       ...prev,
//       [category]: newState
//     }));
//   };

//   const handleResetAll = (category) => {
//     setSelectedOperations(prev => ({
//       ...prev,
//       [category]: {}
//     }));
//   };

//   const handleSelectAllCategories = () => {
//     const allSelected = {};
//     Object.entries(functionCategories).forEach(([category, { operations }]) => {
//       allSelected[category] = {};
//       operations.forEach(op => {
//         allSelected[category][op.name] = true;
//       });
//     });
//     setSelectedOperations(allSelected);
    
//     const panels = document.querySelectorAll(`.${styles.categoryPanel}`);
//     panels.forEach(panel => {
//       const isCollapsed = !panel.querySelector(`.${styles.operations}`);
//       if (isCollapsed) {
//         const header = panel.querySelector(`.${styles.categoryHeader}`);
//         if (header) header.click();
//       }
//     });
//   };

//   const handleResetAllCategories = () => {
//     setSelectedOperations({});
//   };

//   const getSelectedOperations = () => {
//     const selected = [];
//     Object.entries(selectedOperations).forEach(([category, operations]) => {
//       Object.entries(operations).forEach(([opName, isSelected]) => {
//         if (isSelected) {
//           const categoryOps = functionCategories[category].operations;
//           const operation = categoryOps.find(op => op.name === opName);
//           if (operation) {
//             selected.push(operation);
//           }
//         }
//       });
//     });
//     return selected;
//   };

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.selectionPanel}>
//         <div className={styles.panelHeader}>
//           <div className={styles.globalActions}>
//             <button onClick={handleSelectAllCategories}>All Operations</button>
//             <button onClick={handleResetAllCategories}>Reset All</button>
//           </div>
//           <div className={styles.instructions}>
//             Select string operations from categories below. Click 'All Operations' to view all available functions. Each category can be expanded to reveal more options. Selected operations will appear as cards below.
//           </div>
//         </div>
        
//         <div className={styles.categoriesRow}>
//           {Object.entries(functionCategories).map(([category, { label, operations }]) => (
//             <CategoryPanel
//               key={category}
//               category={category}
//               label={label}
//               operations={operations}
//               selectedOps={selectedOperations[category] || {}}
//               onOperationChange={handleCategoryChange}
//               onSelectAll={handleSelectAll}
//               onReset={handleResetAll}
//             />
//           ))}
//         </div>
//       </div>

//       <div className={styles.operationsContainer}>
//         <StringProcessor 
//           language={language}
//           defaultString={defaultString}
//           baseUrl={baseUrl}
//           title={title}
//           {...otherProps}
//           operations={getSelectedOperations()} 
//         />
//       </div>
//     </div>
//   );
// };

// export default StringProcessorWrapper;

import React, { useState } from 'react';
import StringProcessor from './StringProcessor';
// import { pythonData } from './pythonData';
import styles from './StringProcessorWrapper.module.css';

const CategoryPanel = ({ 
  category, 
  label, 
  operations, 
  selectedOps, 
  onOperationChange, 
  onSelectAll, 
  onReset 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.categoryPanel}>
      <div 
        className={styles.categoryHeader} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.categoryTitle}>
          <span className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}>▶</span>
          <h3>{label}</h3>
        </div>
        <div className={styles.categoryActions}>
          <button onClick={(e) => {
            e.stopPropagation();
            onSelectAll(category);
          }}>
            All
          </button>
          <button onClick={(e) => {
            e.stopPropagation();
            onReset(category);
          }}>
            Reset
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className={styles.operations}>
          {operations.map(op => (
            <label key={op.name} className={styles.operationLabel}>
              <input
                type="checkbox"
                checked={selectedOps[op.name] || false}
                onChange={() => onOperationChange(category, op.name)}
              />
              {/* {op.format === 'dot' ? `str.${op.name}()` : `${op.name}(str)`} */}
              {op.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const StringProcessorWrapper = ({pythonData, language = 'Python', defaultString, baseUrl, title, ...otherProps }) => {
  const [selectedOperations, setSelectedOperations] = useState({});
  
  const functionCategories = language.toLowerCase() === 'python' ? pythonData : {};

  const handleCategoryChange = (category, operationName) => {
    setSelectedOperations(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [operationName]: !prev[category]?.[operationName]
      }
    }));
  };

  const handleSelectAll = (category) => {
    const categoryOperations = functionCategories[category].operations;
    const newState = {};
    categoryOperations.forEach(op => {
      newState[op.name] = true;
    });
    
    setSelectedOperations(prev => ({
      ...prev,
      [category]: newState
    }));
  };

  const handleResetAll = (category) => {
    setSelectedOperations(prev => ({
      ...prev,
      [category]: {}
    }));
  };

  const handleSelectAllCategories = () => {
    const allSelected = {};
    Object.entries(functionCategories).forEach(([category, { operations }]) => {
      allSelected[category] = {};
      operations.forEach(op => {
        allSelected[category][op.name] = true;
      });
    });
    setSelectedOperations(allSelected);
    
    const panels = document.querySelectorAll(`.${styles.categoryPanel}`);
    panels.forEach(panel => {
      const isCollapsed = !panel.querySelector(`.${styles.operations}`);
      if (isCollapsed) {
        const header = panel.querySelector(`.${styles.categoryHeader}`);
        if (header) header.click();
      }
    });
  };

  const handleResetAllCategories = () => {
    setSelectedOperations({});
  };

  const getSelectedOperations = () => {
    const selected = [];
    Object.entries(selectedOperations).forEach(([category, operations]) => {
      Object.entries(operations).forEach(([opName, isSelected]) => {
        if (isSelected) {
          const categoryOps = functionCategories[category].operations;
          const operation = categoryOps.find(op => op.name === opName);
          if (operation) {
            const displayName = operation.format === 'dot' ? 
              `str.${operation.name}()` : 
              `${operation.name}(str)`;
            selected.push({
              ...operation,
              displayName
            });
          }
        }
      });
    });
    return selected;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.selectionPanel}>
        <div className={styles.panelHeader}>
          <div className={styles.globalActions}>
            <button onClick={handleSelectAllCategories}>All Operations</button>
            <button onClick={handleResetAllCategories}>Reset All</button>
          </div>
          <div className={styles.instructions}>
            Select string operations from categories below. Click &#39;All Operations&#39; to view all available functions.
          </div>
        </div>
        
        <div className={styles.categoriesRow}>
          {Object.entries(functionCategories).map(([category, { label, operations }]) => (
            <CategoryPanel
              key={category}
              category={category}
              label={label}
              operations={operations}
              selectedOps={selectedOperations[category] || {}}
              onOperationChange={handleCategoryChange}
              onSelectAll={handleSelectAll}
              onReset={handleResetAll}
            />
          ))}
        </div>
      </div>

      <div className={styles.operationsContainer}>
        <StringProcessor 
          language={language}
          defaultString={defaultString}
          baseUrl={baseUrl}
          title={title}
          {...otherProps}
          operations={getSelectedOperations()} 
        />
      </div>
    </div>
  );
};

export default StringProcessorWrapper;