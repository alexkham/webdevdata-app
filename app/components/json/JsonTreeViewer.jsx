// // // 'use client';

// // // import React, { useState } from 'react';

// // // const JSONTreeViewer = () => {
// // //   const [jsonData, setJsonData] = useState(null);
// // //   const [error, setError] = useState('');

// // //   const handleInputChange = (e) => {
// // //     const input = e.target.value;
// // //     try {
// // //       const parsed = JSON.parse(input);
// // //       setJsonData(parsed);
// // //       setError('');
// // //     } catch (err) {
// // //       setError('Invalid JSON');
// // //       setJsonData(null);
// // //     }
// // //   };

// // //   const resetData = () => {
// // //     setJsonData(null);
// // //     setError('');
// // //   };

// // //   const copyToClipboard = () => {
// // //     navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
// // //   };

// // //   const renderNode = (node, path = '') => {
// // //     if (typeof node !== 'object' || node === null) {
// // //       return <span className="json-value">{JSON.stringify(node)}</span>;
// // //     }

// // //     const isArray = Array.isArray(node);
// // //     const nodeEntries = Object.entries(node);

// // //     return (
// // //       <div className="json-object">
// // //         <span className="json-toggle">▼</span>
// // //         <span className="json-key">{isArray ? '[]' : '{}'}</span>
// // //         <ul className="json-list">
// // //           {nodeEntries.map(([key, value]) => (
// // //             <li key={key}>
// // //               <span className="json-key">{key}:</span>
// // //               {renderNode(value, `${path}.${key}`)}
// // //             </li>
// // //           ))}
// // //         </ul>
// // //       </div>
// // //     );
// // //   };

// // //   return (
// // //     <div className="json-tree-viewer">
// // //       <textarea
// // //         onChange={handleInputChange}
// // //         placeholder="Paste your JSON here"
// // //         rows={10}
// // //         cols={50}
// // //       />
// // //       {error && <p className="error">{error}</p>}
// // //       <div>
// // //         <button onClick={resetData}>Reset</button>
// // //         <button onClick={copyToClipboard} disabled={!jsonData}>Copy</button>
// // //       </div>
// // //       {jsonData && <div className="json-tree">{renderNode(jsonData)}</div>}
// // //     </div>
// // //   );
// // // };

// // // export default JSONTreeViewer;
// // 'use client';

// // import React, { useState } from 'react';
// // import styles from './JSONTreeViewer.module.css';

// // const JSONTreeViewer = () => {
// //   const [jsonData, setJsonData] = useState(null);
// //   const [error, setError] = useState('');

// //   const handleInputChange = (e) => {
// //     const input = e.target.value;
// //     try {
// //       const parsed = JSON.parse(input);
// //       setJsonData(parsed);
// //       setError('');
// //     } catch (err) {
// //       setError('Invalid JSON');
// //       setJsonData(null);
// //     }
// //   };

// //   const resetData = () => {
// //     setJsonData(null);
// //     setError('');
// //   };

// //   const copyToClipboard = () => {
// //     navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
// //   };

// //   const renderNode = (node, key = null, depth = 0) => {
// //     if (typeof node !== 'object' || node === null) {
// //       return (
// //         <div className={styles.row} style={{ marginLeft: `${depth * 20}px` }}>
// //           {key !== null && <span className={styles.key}>{key} : </span>}
// //           <span className={styles.value}>{JSON.stringify(node)}</span>
// //         </div>
// //       );
// //     }

// //     const isArray = Array.isArray(node);
// //     const nodeEntries = Object.entries(node);
// //     const label = isArray ? `[${nodeEntries.length}]` : `{${nodeEntries.length}}`;

// //     return (
// //       <div className={styles.object} style={{ marginLeft: `${depth * 20}px` }}>
// //         <div className={styles.row}>
// //           {key !== null && <span className={styles.key}>{key} : </span>}
// //           <span className={styles.toggle}>▼</span>
// //           <span className={styles.label}>{isArray ? 'array' : 'object'} {label}</span>
// //         </div>
// //         <div className={styles.children}>
// //           {nodeEntries.map(([childKey, childValue], index) => (
// //             <React.Fragment key={childKey}>
// //               {renderNode(childValue, isArray ? index : childKey, depth + 1)}
// //             </React.Fragment>
// //           ))}
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className={styles.container}>
// //       <textarea
// //         onChange={handleInputChange}
// //         placeholder="Paste your JSON here"
// //         rows={10}
// //         cols={50}
// //       />
// //       {error && <p className={styles.error}>{error}</p>}
// //       <div>
// //         <button onClick={resetData}>Reset</button>
// //         <button onClick={copyToClipboard} disabled={!jsonData}>Copy</button>
// //       </div>
// //       {jsonData && <div className={styles.treeView}>{renderNode(jsonData)}</div>}
// //     </div>
// //   );
// // };

// // export default JSONTreeViewer;
// 'use client';

// import React, { useState } from 'react';
// import styles from './JSONTreeViewer.module.css';

// const JSONTreeViewer = () => {
//   const [jsonData, setJsonData] = useState('');
//   const [error, setError] = useState('');
//   const [expandedNodes, setExpandedNodes] = useState(new Set());

//   const handleInputChange = (e) => {
//     const input = e.target.value;
//     try {
//       const parsed = JSON.parse(input);
//       setJsonData(parsed);
//       setError('');
//       setExpandedNodes(new Set());
//     } catch (err) {
//       setError('Invalid JSON');
//       setJsonData(null);
//     }
//   };

//   const resetData = () => {
//     setJsonData('');
//     setError('');
//     setExpandedNodes(new Set());
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
//   };

// //   const toggleNode = (path) => {
// //     setExpandedNodes((prevExpanded) => {
// //       const newExpanded = new Set(prevExpanded);
// //       if (newExpanded.has(path)) {
// //         newExpanded.delete(path);
// //       } else {
// //         newExpanded.add(path);
// //       }
// //       return newExpanded;
// //     });
// //   };

// const toggleNode = (key) => {
//     setExpandedNodes((prevExpanded) => {
//       const newExpanded = new Set(prevExpanded);
//       if (newExpanded.has(key)) {
//         newExpanded.delete(key);
//       } else {
//         newExpanded.add(key);
//       }
//       return newExpanded;
//     });
//   };


//   const renderNode = (node, key = null, depth = 0) => {
//     if (typeof node !== 'object' || node === null) {
//       return (
//         <div className={styles.row} style={{ marginLeft: `${depth * 20}px` }}>
//           {key !== null && <span className={styles.key}>{key}: </span>}
//           <span className={styles.value}>{JSON.stringify(node)}</span>
//         </div>
//       );
//     }
  
//     const isArray = Array.isArray(node);
//     const nodeEntries = Object.entries(node);
//     const isExpanded = expandedNodes.has(key);
//     const bracketOpen = isArray ? '[' : '{';
//     const bracketClose = isArray ? ']' : '}';
  
//     return (
//       <div className={styles.object} style={{ marginLeft: `${depth * 20}px` }}>
//         <div className={styles.row} onClick={() => toggleNode(key)}>
//           <span className={`${styles.toggle} ${isExpanded ? styles.expanded : ''}`}>
//             {isExpanded ? '▼' : '►'}
//           </span>
//           {key !== null && <span className={styles.key}>{key}: </span>}
//           <span className={styles.bracket}>{bracketOpen}</span>
//           {!isExpanded && <span>{nodeEntries.length}</span>}
//           {!isExpanded && <span className={styles.bracket}>{bracketClose}</span>}
//           {isExpanded && <span className={styles.bracket}>{bracketOpen}</span>}
//         </div>
//         {isExpanded && (
//           <div className={styles.children}>
//             {nodeEntries.map(([childKey, childValue]) => (
//               renderNode(childValue, childKey, depth + 1)
//             ))}
//             <div className={styles.row} style={{ marginLeft: `${depth * 20}px` }}>
//               <span className={styles.bracket}>{bracketClose}</span>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };
  

// //   const renderNode = (node, key = null, depth = 0) => {
// //     if (typeof node !== 'object' || node === null) {
// //       return (
// //         <div className={styles.row} style={{ marginLeft: `${depth * 20}px` }}>
// //           {key !== null && <span className={styles.key}>{key}: </span>}
// //           <span className={styles.value}>{JSON.stringify(node)}</span>
// //         </div>
// //       );
// //     }
  
// //     const isArray = Array.isArray(node);
// //     const nodeEntries = Object.entries(node);
// //     const isExpanded = expandedNodes.has(key);
// //     const bracketOpen = isArray ? '[' : '{';
// //     const bracketClose = isArray ? ']' : '}';
  
// //     return (
// //       <div className={styles.object} style={{ marginLeft: `${depth * 20}px` }}>
// //         <div className={styles.row} onClick={() => toggleNode(key)}>
// //           <span className={`${styles.toggle} ${isExpanded ? styles.expanded : ''}`}>
// //             {isExpanded ? '▼' : '►'}
// //           </span>
// //           {key !== null && <span className={styles.key}>{key}: </span>}
// //           <span className={styles.bracket}>{bracketOpen}</span>
// //           {!isExpanded && <span className={styles.ellipsis}>...</span>}
// //           {!isExpanded && <span className={styles.bracket}>{bracketClose}</span>}
// //           {isExpanded && <span className={styles.length}>{nodeEntries.length}</span>}
// //         </div>
// //         {isExpanded && (
// //           <div className={styles.children}>
// //             {nodeEntries.map(([childKey, childValue]) => (
// //               renderNode(childValue, childKey, depth + 1)
// //             ))}
// //           </div>
// //         )}
// //         {isExpanded && (
// //           <div className={styles.row} style={{ marginLeft: `${depth * 20}px` }}>
// //             <span className={styles.bracket}>{bracketClose}</span>
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   const renderNode = (node, key = null, depth = 0) => {
// //     if (typeof node !== 'object' || node === null) {
// //       return (
// //         <div className={styles.row} style={{ marginLeft: `${depth * 20}px` }}>
// //           {key !== null && <span className={styles.key}>{key}: </span>}
// //           <span className={styles.value}>{JSON.stringify(node)}</span>
// //         </div>
// //       );
// //     }
  
// //     const isArray = Array.isArray(node);
// //     const nodeEntries = Object.entries(node);
// //     const isExpanded = expandedNodes.has(key);
  
// //     return (
// //       <div className={styles.object} style={{ marginLeft: `${depth * 20}px` }}>
// //         <div className={styles.row} onClick={() => toggleNode(key)}>
// //           <span className={`${styles.toggle} ${isExpanded ? styles.expanded : ''}`}>
// //             {isExpanded ? '▼' : '►'}
// //           </span>
// //           {key !== null && <span className={styles.key}>{key}: </span>}
// //           <span className={styles.label}>{isArray ? 'Array' : 'Object'} [{nodeEntries.length}]</span>
// //         </div>
// //         {isExpanded && (
// //           <div className={styles.children}>
// //             {nodeEntries.map(([childKey, childValue]) => (
// //               renderNode(childValue, childKey, depth + 1)
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   const renderNode = (node, path = '', depth = 0) => {
// //     if (typeof node !== 'object' || node === null) {
// //       return (
// //         <div className={styles.row} style={{ marginLeft: `${depth * 20}px` }}>
// //           <span className={styles.key}>{path.split('.').pop()} : </span>
// //           <span className={styles.value}>{JSON.stringify(node)}</span>
// //         </div>
// //       );
// //     }

// //     const isArray = Array.isArray(node);
// //     const nodeEntries = Object.entries(node);
// //     const isExpanded = expandedNodes.has(path);
// //     const label = isArray ? `[${nodeEntries.length}]` : `{${nodeEntries.length}}`;

// //     return (
// //       <div className={styles.object} style={{ marginLeft: `${depth * 20}px` }}>
// //         <div className={styles.row} onClick={() => toggleNode(path)}>
// //           <span className={`${styles.toggle} ${isExpanded ? styles.expanded : ''}`}>
// //             {isExpanded ? '▼' : '►'}
// //           </span>
// //           <span className={styles.key}>{path.split('.').pop()} : </span>
// //           <span className={styles.label}>{isArray ? 'array' : 'object'} {label}</span>
// //         </div>
// //         {isExpanded && (
// //           <div className={styles.children}>
// //             {nodeEntries.map(([key, value]) => (
// //               <React.Fragment key={key}>
// //                 {renderNode(value, `${path}.${key}`, depth + 1)}
// //               </React.Fragment>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

//   return (
//     <div className={styles.container}>
//       <textarea
//         onChange={handleInputChange}
//         placeholder="Paste your JSON here"
//         rows={10}
//         cols={50}
//         value={jsonData}
//       />
//       {error && <p className={styles.error}>{error}</p>}
//       <div>
//         <button onClick={resetData}>Reset</button>
//         <button onClick={copyToClipboard} disabled={!jsonData}>Copy</button>
//       </div>
//       {jsonData && <div className={styles.treeView}>{renderNode(jsonData, 'root')}</div>}
//     </div>
//   );
// };

// export default JSONTreeViewer;
'use client';

import React, { useState ,useCallback} from 'react';
import styles from './JsonTreeViewer.module.css';

const JSONTreeViewer = () => {
  const [inputString, setInputString] = useState(''); // State for the input string
  const [jsonData, setJsonData] = useState(null); // State for the parsed JSON
  const [error, setError] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [copyButtonText, setCopyButtonText] = useState('Copy');

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputString(input); // Update the input string state
    // try {
    //   const parsed = JSON.parse(input);
    //   setJsonData(parsed); // Update the parsed JSON state
    //   setError('');
    //   setExpandedNodes(new Set()); // Reset expanded nodes upon new input
    // } catch (err) {
    //   setError('Invalid JSON');
    //   setJsonData(null); // Clear previous JSON data on error
    // }
  };

  const resetData = () => {
    setInputString(''); // Clear input string
    setJsonData(null); // Clear JSON data
    setError('');
    setExpandedNodes(new Set()); // Reset expanded nodes
  };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
//   };

const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(inputString).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy'), 2000);
    }).catch(() => {
      setError('Failed to copy to clipboard');
    });
  }, [inputString]);

  const toggleNode = (key) => {
    setExpandedNodes(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(key)) {
        newExpanded.delete(key);
      } else {
        newExpanded.add(key);
      }
      return newExpanded;
    });
  };

  const renderNode = (node, key = null, depth = 0) => {
    if (typeof node !== 'object' || node === null) {
      // Render primitive values directly with type-based coloring
      return (
        <div className={styles.row} style={{ marginLeft: `${depth * 20}px` }}>
          {key !== null && <span className={styles.key}>{key}: </span>}
          {renderValue(node)}
        </div>
      );
    }
  
    const isArray = Array.isArray(node);
    const nodeEntries = Object.entries(node);
    const isExpanded = expandedNodes.has(key);
    const bracketOpen = isArray ? '[' : '{';
    const bracketClose = isArray ? ']' : '}';
  
    return (
      <div className={styles.object} style={{ marginLeft: `${depth * 20}px` }}>
        <div className={styles.row} onClick={() => toggleNode(key)}>
          <span className={`${styles.toggle} ${isExpanded ? styles.expanded : ''}`}>
            {isExpanded ? '▼' : '▶'}
          </span>
          {key !== null && <span className={styles.key}>{key}: </span>}
          <span className={styles.bracket}>{bracketOpen}</span>
          {!isExpanded && nodeEntries.length > 0 && <span>{nodeEntries.length} items</span>}
          {!isExpanded && <span className={styles.bracket}>{bracketClose}</span>}
        </div>
        {isExpanded && (
          <div className={styles.children}>
            {nodeEntries.map(([childKey, childValue]) => (
              renderNode(childValue, childKey, depth + 1)
            ))}
          </div>
        )}
        {isExpanded && (
          <div className={styles.row} style={{ marginLeft: `${depth * 20}px` }}>
            <span className={styles.bracket}>{bracketClose}</span>
          </div>
        )}
      </div>
    );
  };


  const handleViewTree = () => {
    try {
      const parsed = JSON.parse(inputString);
      setJsonData(parsed);
      setError('');
      setExpandedNodes(new Set());
    } catch (err) {
      if(inputString===''){
        setError('Input can not be Empty')
      }else{
        setError('Invalid JSON');
      }
      
      setJsonData(null);
    }
  };


  const renderValue = (value) => {
    const type = typeof value;
    // Apply CSS classes based on the type of the value
    return <span className={`${styles.value} ${styles[type]}`}>{JSON.stringify(value)}</span>;
  };

//   const renderNode = (node, key = null, depth = 0) => {
//     if (typeof node !== 'object' || node === null) {
//       return (
//         <div className={styles.row} style={{ marginLeft: `${depth * 20}px` }}>
//           {key !== null && <span className={styles.key}>{key}: </span>}
//           <span className={styles.value}>{JSON.stringify(node)}</span>
//         </div>
//       );
//     }

//     const isArray = Array.isArray(node);
//     const nodeEntries = Object.entries(node);
//     const isExpanded = expandedNodes.has(key);
//     const bracketOpen = isArray ? '[' : '{';
//     const bracketClose = isArray ? ']' : '}';

//     return (
//       <div className={styles.object} style={{ marginLeft: `${depth * 20}px` }}>
//         <div className={styles.row} onClick={() => toggleNode(key)}>
//           <span className={`${styles.toggle} ${isExpanded ? styles.expanded : ''}`}>
//             {isExpanded ? '▼' : '►'}
//           </span>
//           {key !== null && <span className={styles.key}>{key}: </span>}
//           <span className={styles.bracket}>{bracketOpen}</span>
//           {!isExpanded && <span>{nodeEntries.length} items</span>}
//           {!isExpanded && <span className={styles.bracket}>{bracketClose}</span>}
//         </div>
//         {isExpanded && (
//           <div className={styles.children}>
//             {nodeEntries.map(([childKey, childValue]) => (
//               renderNode(childValue, childKey, depth + 1)
//             ))}
//           </div>
//         )}
//         {isExpanded && (
//           <div className={styles.row} style={{ marginLeft: `${depth * 20}px` }}>
//             <span className={styles.bracket}>{bracketClose}</span>
//           </div>
//         )}
//       </div>
//     );
//   };

  return (
    <div className={styles.container}>
        <div className={styles.inputContainer}>
    <div  className={styles.textareaWrapper}>
      <textarea
        className={styles.textarea}
        onChange={handleInputChange}
        placeholder="Paste or type your JSON here"
        rows={10}
        cols={50}
        value={inputString} // Use inputString as the value for the textarea
      />
       <button  className={styles.copyInputButton} onClick={handleCopy} >
       <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
        {copyButtonText}</button>
       </div>
      {error && <p className={styles.error}>{error}</p>}
      </div>
      <div className={styles.buttonGroup}>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <button className={styles.viewButton} onClick={handleViewTree}>View Tree</button>
        <button className={styles.resetButton} onClick={resetData}>Reset</button>
        {/* <button onClick={copyToClipboard} disabled={!jsonData}>Copy</button> */}
      </div>
      {jsonData && <div className={styles.treeView}>{renderNode(jsonData, 'root')}</div>}
    </div>
  );
};

export default JSONTreeViewer;
