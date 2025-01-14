
// // // 'use client'
// // // import React, { useState, useRef } from 'react';
// // // import AceEditorComponent from '../ace-editor/AceEditorComponent';
// // // import styles from './FunctionDetails.module.css';
// // // import Link from 'next/link';
// // // ///import functionsD from '../../api/db/developement/c/functions_new.json'

// // // const FunctionDetails = ({functionData,external_links}) => {
// // //   const [activeTab, setActiveTab] = useState('description');
// // //   const [activeExampleTab, setActiveExampleTab] = useState(0);
// // //   const [codeOutput, setCodeOutput] = useState('');
// // //   const [isRunning, setIsRunning] = useState(false);

// // //   const tabRefs = {
// // //     description: useRef(null),
// // //     prototype: useRef(null),
// // //     parameters: useRef(null),
// // //     return: useRef(null),
// // //     examples: useRef(null),
// // //   };

// // // const simulateCodeExecution = (exampleIndex) => {
// // //     setIsRunning(true);
// // //     setCodeOutput('Compiling and running...');
    
// // //     setTimeout(() => {
// // //       setCodeOutput(functionData.examples[exampleIndex].expectedOutput);
// // //       setIsRunning(false);
// // //     }, 1500);
// // //   };

// // //   const renderExampleContent = (example, index) => (
// // //     <div className={styles.exampleContent}>
// // //       <div className={styles.codeExplanationContainer}>
// // //         <div className={styles.codeContainer}>
// // //           <AceEditorComponent
// // //             code={example.code}
// // //             fontSize={14}
// // //             mode={'c_cpp'}
// // //             theme={'twilight'}
// // //             onChange={() => {}}
// // //             width="100%"
// // //           />
// // //           <button 
// // //             onClick={() => simulateCodeExecution(index)} 
// // //             disabled={isRunning}
// // //             className={styles.runButton}
// // //           >
// // //             {isRunning ? 'Running...' : 'Run Code'}

// // //           </button>
// // //           <h3>Output</h3>
// // //           <pre className={styles.outputBox}>{codeOutput}</pre>
// // //         </div>
// // //         <div className={styles.explanationContainer}>
// // //           <h3>Explanation</h3>
// // //           <p>{example.explanation}</p>
// // //           {/* <h3>Output</h3>
// // //           <pre className={styles.outputBox}>{codeOutput}</pre> */}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );

// // //   const scrollToContent = (ref) => {
// // //     if (ref && ref.current) {
// // //       const yOffset = -150;
// // //       const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
// // //       window.scrollTo({top: y, behavior: 'smooth'});
// // //     }
// // //   };

// // //   const handleTabClick = (tab) => {
// // //     setActiveTab(tab);
// // //     scrollToContent(tabRefs[tab]);
// // //   };

// // //   return (
// // //     <div className={styles.container}>
// // //       {/* <h1 className={styles.title}>{functionData.function_name}</h1> */}
      
// // //       <div className={styles.tabContainer}>
// // //         {Object.keys(tabRefs).map((tab) => (
// // //           <button 
// // //             key={tab}
// // //             className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
// // //             onClick={() => handleTabClick(tab)}
// // //           >
// // //             {tab.charAt(0).toUpperCase() + tab.slice(1)}
// // //           </button>
// // //         ))}
// // //       </div>
  
// // //       <div className={styles.content}>
// // //         <div ref={tabRefs.description} className={`${styles.tabContent} ${activeTab === 'description' ? styles.active : ''}`}>
// // //           <h2>Description</h2>
// // //           <br></br>
// // //           <p>{functionData.extended_description}</p>
// // //           <br></br>
// // //           <br></br>
         

// // //           {external_links&&external_links[functionData.function_name]&&<Link
// // //           className={styles.link}
// // //           href={`${external_links[functionData.function_name]}`}
// // //           target="_blank"
// // //           rel="noopener noreferrer">Read More about {functionData.function_name} from  C Documentation</Link>}
         
// // //           {functionData.link&&<Link
// // //           className={styles.link}
// // //           href={`${functionData.link}`}
// // //           target="_blank"
// // //           rel="noopener noreferrer">Read More about {functionData.function_name} from  C Documentation</Link>}
// // //         </div>

// // //         <div ref={tabRefs.prototype} className={`${styles.tabContent} ${activeTab === 'prototype' ? styles.active : ''}`}>
// // //           <h2>Function Prototype</h2>
// // //           <br></br>
// // //           <pre className={styles.prototypeBox}>{functionData.function_prototype}</pre>
// // //         </div>

// // //         <div ref={tabRefs.parameters} className={`${styles.tabContent} ${activeTab === 'parameters' ? styles.active : ''}`}>
// // //           <h2>Parameters</h2>
// // //           <br></br>
// // //           <p>{functionData.parameter_values}</p>
// // //           <br></br>
// // //           <h3>Parameter Types</h3>
// // //           <br></br>
// // //           <p>{functionData.parameter_types?.length > 0 ? functionData.parameter_types.join(', ') : 'None'}</p>
// // //         </div>

// // //         <div ref={tabRefs.return} className={`${styles.tabContent} ${activeTab === 'return' ? styles.active : ''}`}>
// // //           <h2>Return</h2>
// // //           <br></br>
// // //           <p>{functionData.return_value}</p>
// // //           <br></br>
// // //           <h3>Return Type</h3>
// // //           <br></br>
// // //           <p>{functionData.return_type}</p>
// // //         </div>
  
// // //         <div ref={tabRefs.examples} className={`${styles.tabContent} ${activeTab === 'examples' ? styles.active : ''}`}>
// // //           {/* <h2>Examples</h2> */}
// // //           <div className={styles.innerTabContainer}>
// // //             {functionData?.examples?.map((example, index) => (
// // //               <button 
// // //                 key={index}
// // //                 className={`${styles.tabButton} ${activeExampleTab === index ? styles.active : ''}`}
// // //                 onClick={() => {
// // //                   setActiveExampleTab(index);
// // //                   setCodeOutput('');
// // //                 }}
// // //               >
// // //                 {example.title}
// // //               </button>
// // //             ))}
// // //           </div>
// // //           {/* {renderExampleContent(functionData?.examples[activeExampleTab], activeExampleTab)} */}
// // //           {functionData?.examples?.length > 0 ?
// // //           renderExampleContent(functionData.examples[activeExampleTab], activeExampleTab) :
// // //           <p>No examples found.</p>
// // //         }
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default FunctionDetails;

// // // 'use client'
// // // import React, { useState, useRef } from 'react';
// // // import AceEditorComponent from '../ace-editor/AceEditorComponent';
// // // import styles from './FunctionDetails.module.css';
// // // import Link from 'next/link';
// // // import { processContent } from '@/utils/contentProcessor';

// // // const FunctionDetails = ({functionData, external_links}) => {
// // //   // Fixed state hooks at the top
// // //   const [activeTab, setActiveTab] = useState('description');
// // //   const [activeExampleTab, setActiveExampleTab] = useState(0);
// // //   const [codeOutput, setCodeOutput] = useState('');
// // //   const [isRunning, setIsRunning] = useState(false);

// // //   // Fixed refs for base tabs
// // //   const descriptionRef = useRef(null);
// // //   const prototypeRef = useRef(null);
// // //   const parametersRef = useRef(null);
// // //   const returnRef = useRef(null);
// // //   const examplesRef = useRef(null);
// // //   const optionalRef = useRef(null);

// // //   const baseRefs = {
// // //     description: descriptionRef,
// // //     prototype: prototypeRef,
// // //     parameters: parametersRef,
// // //     return: returnRef,
// // //     examples: examplesRef,
// // //   };

// // //   const simulateCodeExecution = (exampleIndex) => {
// // //     setIsRunning(true);
// // //     setCodeOutput('Compiling and running...');
// // //     setTimeout(() => {
// // //       setCodeOutput(functionData.examples[exampleIndex].expectedOutput);
// // //       setIsRunning(false);
// // //     }, 1500);
// // //   };

// // //   const renderExampleContent = (example, index) => (
// // //     <div className={styles.exampleContent}>
// // //       <div className={styles.codeExplanationContainer}>
// // //         <div className={styles.codeContainer}>
// // //           <AceEditorComponent
// // //             code={example.code}
// // //             fontSize={14}
// // //             mode={'c_cpp'}
// // //             theme={'twilight'}
// // //             onChange={() => {}}
// // //             width="100%"
// // //           />
// // //           <button 
// // //             onClick={() => simulateCodeExecution(index)} 
// // //             disabled={isRunning}
// // //             className={styles.runButton}
// // //           >
// // //             {isRunning ? 'Running...' : 'Run Code'}
// // //           </button>
// // //           <h3>Output</h3>
// // //           <pre className={styles.outputBox}>{codeOutput}</pre>
// // //         </div>
// // //         <div className={styles.explanationContainer}>
// // //           <h3>Explanation</h3>
// // //           <p>{example.explanation}</p>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );

// // //   const scrollToContent = (ref) => {
// // //     if (ref && ref.current) {
// // //       const yOffset = -150;
// // //       const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
// // //       window.scrollTo({top: y, behavior: 'smooth'});
// // //     }
// // //   };

// // //   const handleTabClick = (tab) => {
// // //     setActiveTab(tab);
// // //     if (tab.startsWith('optional_')) {
// // //       scrollToContent(optionalRef);
// // //     } else {
// // //       scrollToContent(baseRefs[tab]);
// // //     }
// // //   };

// // //   return (
// // //     <div className={styles.container}>
// // //       <div className={styles.tabContainer}>
// // //         {/* Base tabs */}
// // //         {Object.keys(baseRefs).map((tab) => (
// // //           <button 
// // //             key={tab}
// // //             className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
// // //             onClick={() => handleTabClick(tab)}
// // //           >
// // //             {tab.charAt(0).toUpperCase() + tab.slice(1)}
// // //           </button>
// // //         ))}
        
// // //         {/* Optional tabs */}
// // //         {functionData.optionalTabs?.map((tab, index) => (
// // //   <div 
// // //     key={`optional_${index}`}
// // //     className={`${styles.tabContent} ${activeTab === `optional_${index}` ? styles.active : ''}`}
// // //   >
// // //     <h2>{tab.title}</h2>
// // //     <br />
// // //     {processContent(tab.content)}
// // //   </div>
// // // ))}
// // //         {/* {functionData.optionalTabs?.map((tab, index) => (
// // //           <button 
// // //             key={`optional_${index}`}
// // //             className={`${styles.tabButton} ${activeTab === `optional_${index}` ? styles.active : ''}`}
// // //             onClick={() => handleTabClick(`optional_${index}`)}
// // //           >
// // //             {tab.title}
// // //           </button>
// // //         ))} */}
// // //       </div>
  
// // //       <div className={styles.content}>
// // //         <div ref={descriptionRef} className={`${styles.tabContent} ${activeTab === 'description' ? styles.active : ''}`}>
// // //           <h2>Description</h2>
// // //           <br />
// // //           <p>{functionData.extended_description}</p>
// // //           <br />
// // //           <br />
// // //           {external_links && external_links[functionData.function_name] && (
// // //             <Link
// // //               className={styles.link}
// // //               href={`${external_links[functionData.function_name]}`}
// // //               target="_blank"
// // //               rel="noopener noreferrer"
// // //             >
// // //               Read More about {functionData.function_name} from C Documentation
// // //             </Link>
// // //           )}
// // //           {functionData.link && (
// // //             <Link
// // //               className={styles.link}
// // //               href={`${functionData.link}`}
// // //               target="_blank"
// // //               rel="noopener noreferrer"
// // //             >
// // //               Read More about {functionData.function_name} from C Documentation
// // //             </Link>
// // //           )}
// // //         </div>

// // //         <div ref={prototypeRef} className={`${styles.tabContent} ${activeTab === 'prototype' ? styles.active : ''}`}>
// // //           <h2>Function Prototype</h2>
// // //           <br />
// // //           <pre className={styles.prototypeBox}>{functionData.function_prototype}</pre>
// // //         </div>

// // //         <div ref={parametersRef} className={`${styles.tabContent} ${activeTab === 'parameters' ? styles.active : ''}`}>
// // //           <h2>Parameters</h2>
// // //           <br />
// // //           <p>{functionData.parameter_values}</p>
// // //           <br />
// // //           <h3>Parameter Types</h3>
// // //           <br />
// // //           <p>{functionData.parameter_types?.length > 0 ? functionData.parameter_types.join(', ') : 'None'}</p>
// // //         </div>

// // //         <div ref={returnRef} className={`${styles.tabContent} ${activeTab === 'return' ? styles.active : ''}`}>
// // //           <h2>Return</h2>
// // //           <br />
// // //           <p>{functionData.return_value}</p>
// // //           <br />
// // //           <h3>Return Type</h3>
// // //           <br />
// // //           <p>{functionData.return_type}</p>
// // //         </div>
  
// // //         <div ref={examplesRef} className={`${styles.tabContent} ${activeTab === 'examples' ? styles.active : ''}`}>
// // //           <div className={styles.innerTabContainer}>
// // //             {functionData?.examples?.map((example, index) => (
// // //               <button 
// // //                 key={index}
// // //                 className={`${styles.tabButton} ${activeExampleTab === index ? styles.active : ''}`}
// // //                 onClick={() => {
// // //                   setActiveExampleTab(index);
// // //                   setCodeOutput('');
// // //                 }}
// // //               >
// // //                 {example.title}
// // //               </button>
// // //             ))}
// // //           </div>
// // //           {functionData?.examples?.length > 0 ?
// // //             renderExampleContent(functionData.examples[activeExampleTab], activeExampleTab) :
// // //             <p>No examples found.</p>
// // //           }
// // //         </div>

// // //         {/* All optional tabs content in one container */}
// // //         <div ref={optionalRef}>
// // //           {functionData.optionalTabs?.map((tab, index) => (
// // //             <div 
// // //               key={`optional_${index}`}
// // //               className={`${styles.tabContent} ${activeTab === `optional_${index}` ? styles.active : ''}`}
// // //             >
// // //               <h2>{tab.title}</h2>
// // //               <br />
// // //               <p>{tab.content}</p>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default FunctionDetails;

// // 'use client'
// // import React, { useState, useRef } from 'react';
// // import AceEditorComponent from '../ace-editor/AceEditorComponent';
// // import styles from './FunctionDetails.module.css';
// // import Link from 'next/link';
// // import { processContent } from '@/utils/contentProcessor';

// // const FunctionDetails = ({functionData, external_links}) => {
// //   const [activeTab, setActiveTab] = useState('description');
// //   const [activeExampleTab, setActiveExampleTab] = useState(0);
// //   const [codeOutput, setCodeOutput] = useState('');
// //   const [isRunning, setIsRunning] = useState(false);

// //   const descriptionRef = useRef(null);
// //   const prototypeRef = useRef(null);
// //   const parametersRef = useRef(null);
// //   const returnRef = useRef(null);
// //   const examplesRef = useRef(null);
// //   const optionalRef = useRef(null);

// //   const baseRefs = {
// //     description: descriptionRef,
// //     prototype: prototypeRef,
// //     parameters: parametersRef,
// //     return: returnRef,
// //     examples: examplesRef,
// //   };

// //   const simulateCodeExecution = (exampleIndex) => {
// //     setIsRunning(true);
// //     setCodeOutput('Compiling and running...');
// //     setTimeout(() => {
// //       setCodeOutput(functionData.examples[exampleIndex].expectedOutput);
// //       setIsRunning(false);
// //     }, 1500);
// //   };

// //   const renderExampleContent = (example, index) => (
// //     <div className={styles.exampleContent}>
// //       <div className={styles.codeExplanationContainer}>
// //         <div className={styles.codeContainer}>
// //           <AceEditorComponent
// //             code={example.code}
// //             fontSize={14}
// //             mode={'c_cpp'}
// //             theme={'twilight'}
// //             onChange={() => {}}
// //             width="100%"
// //           />
// //           <button 
// //             onClick={() => simulateCodeExecution(index)} 
// //             disabled={isRunning}
// //             className={styles.runButton}
// //           >
// //             {isRunning ? 'Running...' : 'Run Code'}
// //           </button>
// //           <h3>Output</h3>
// //           <pre className={styles.outputBox}>{codeOutput}</pre>
// //         </div>
// //         <div className={styles.explanationContainer}>
// //           <h3>Explanation</h3>
// //           {processContent(example.explanation)}
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   const scrollToContent = (ref) => {
// //     if (ref?.current) {
// //       const yOffset = -150;
// //       const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
// //       window.scrollTo({top: y, behavior: 'smooth'});
// //     }
// //   };

// //   const handleTabClick = (tab) => {
// //     setActiveTab(tab);
// //     if (tab.startsWith('optional_')) {
// //       scrollToContent(optionalRef);
// //     } else {
// //       scrollToContent(baseRefs[tab]);
// //     }
// //   };

// //   return (
// //     <div className={styles.container}>
// //       <div className={styles.tabContainer}>
// //         {Object.keys(baseRefs).map((tab) => (
// //           <button 
// //             key={tab}
// //             className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
// //             onClick={() => handleTabClick(tab)}
// //           >
// //             {tab}
// //           </button>
// //         ))}
        
// //         {functionData.optionalTabs?.map((tab, index) => (
// //           <button 
// //             key={`optional_${index}`}
// //             className={`${styles.tabButton} ${activeTab === `optional_${index}` ? styles.active : ''}`}
// //             onClick={() => handleTabClick(`optional_${index}`)}
// //           >
// //             {tab.title}
// //           </button>
// //         ))}
// //       </div>
  
// //       <div className={styles.content}>
// //         <div ref={descriptionRef} className={`${styles.tabContent} ${activeTab === 'description' ? styles.active : ''}`}>
// //           <h2>Description</h2>
// //           <br />
// //           {processContent(functionData.extended_description)}
// //           <br />
// //           <br />
// //           {external_links && external_links[functionData.function_name] && (
// //             <Link
// //               className={styles.link}
// //               href={`${external_links[functionData.function_name]}`}
// //               target="_blank"
// //               rel="noopener noreferrer"
// //             >
// //               Read More about {functionData.function_name} from C Documentation
// //             </Link>
// //           )}
// //           {functionData.link && (
// //             <Link
// //               className={styles.link}
// //               href={`${functionData.link}`}
// //               target="_blank"
// //               rel="noopener noreferrer"
// //             >
// //               Read More about {functionData.function_name} from C Documentation
// //             </Link>
// //           )}
// //         </div>

// //         <div ref={prototypeRef} className={`${styles.tabContent} ${activeTab === 'prototype' ? styles.active : ''}`}>
// //           <h2>Function Prototype</h2>
// //           <br />
// //           {processContent(functionData.function_prototype)}
// //         </div>

// //         <div ref={parametersRef} className={`${styles.tabContent} ${activeTab === 'parameters' ? styles.active : ''}`}>
// //           <h2>Parameters</h2>
// //           <br />
// //           {processContent(functionData.parameter_values)}
// //           <br />
// //           <h3>Parameter Types</h3>
// //           <br />
// //           {processContent(functionData.parameter_types?.length > 0 ? functionData.parameter_types.join(', ') : 'None')}
// //         </div>

// //         <div ref={returnRef} className={`${styles.tabContent} ${activeTab === 'return' ? styles.active : ''}`}>
// //           <h2>Return</h2>
// //           <br />
// //           {processContent(functionData.return_value)}
// //           <br />
// //           <h3>Return Type</h3>
// //           <br />
// //           {processContent(functionData.return_type)}
// //         </div>
  
// //         <div ref={examplesRef} className={`${styles.tabContent} ${activeTab === 'examples' ? styles.active : ''}`}>
// //           <div className={styles.innerTabContainer}>
// //             {functionData?.examples?.map((example, index) => (
// //               <button 
// //                 key={index}
// //                 className={`${styles.tabButton} ${activeExampleTab === index ? styles.active : ''}`}
// //                 onClick={() => {
// //                   setActiveExampleTab(index);
// //                   setCodeOutput('');
// //                 }}
// //               >
// //                 {example.title}
// //               </button>
// //             ))}
// //           </div>
// //           {functionData?.examples?.length > 0 ?
// //             renderExampleContent(functionData.examples[activeExampleTab], activeExampleTab) :
// //             <p>No examples found.</p>
// //           }
// //         </div>

// //         <div ref={optionalRef}>
// //           {functionData.optionalTabs?.map((tab, index) => (
// //             <div 
// //               key={`optional_${index}`}
// //               className={`${styles.tabContent} ${activeTab === `optional_${index}` ? styles.active : ''}`}
// //             >
// //               <h2>{tab.title}</h2>
// //               <br />
// //               {processContent(tab.content)}
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default FunctionDetails;

// 'use client'
// import React, { useState, useRef } from 'react';
// import AceEditorComponent from '../ace-editor/AceEditorComponent';
// import styles from './FunctionDetails.module.css';
// import Link from 'next/link';
// import { processContent } from '@/utils/contentProcessor';

// const FunctionDetails = ({functionData, external_links}) => {
//   const [activeTab, setActiveTab] = useState('description');
//   const [activeExampleTab, setActiveExampleTab] = useState(0);
//   const [codeOutput, setCodeOutput] = useState('');
//   const [isRunning, setIsRunning] = useState(false);

//   const descriptionRef = useRef(null);
//   const prototypeRef = useRef(null);
//   const parametersRef = useRef(null);
//   const returnRef = useRef(null);
//   const examplesRef = useRef(null);
//   const optionalRef = useRef(null);

//   const baseRefs = {
//     description: descriptionRef,
//     prototype: prototypeRef,
//     parameters: parametersRef,
//     return: returnRef,
//     examples: examplesRef,
//   };

//   const simulateCodeExecution = (exampleIndex) => {
//     setIsRunning(true);
//     setCodeOutput('Compiling and running...');
//     setTimeout(() => {
//       setCodeOutput(functionData.examples[exampleIndex].expectedOutput);
//       setIsRunning(false);
//     }, 1500);
//   };

//   const renderExampleContent = (example, index) => (
//     <div className={styles.exampleContent}>
//       <div className={styles.codeExplanationContainer}>
//         <div className={styles.codeContainer}>
//           <AceEditorComponent
//             code={example.code}
//             fontSize={14}
//             mode={'c_cpp'}
//             theme={'twilight'}
//             onChange={() => {}}
//             width="100%"
//           />
//           <button 
//             onClick={() => simulateCodeExecution(index)} 
//             disabled={isRunning}
//             className={styles.runButton}
//           >
//             {isRunning ? 'Running...' : 'Run Code'}
//           </button>
//           <h3>Output</h3>
//           <pre className={styles.outputBox}>{codeOutput}</pre>
//         </div>
//         <div className={styles.explanationContainer}>
//           {processContent(example.explanation)}
//         </div>
//       </div>
//     </div>
//   );

//   const scrollToContent = (ref) => {
//     if (ref?.current) {
//       const yOffset = -150;
//       const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
//       window.scrollTo({top: y, behavior: 'smooth'});
//     }
//   };

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//     if (tab.startsWith('optional_')) {
//       scrollToContent(optionalRef);
//     } else {
//       scrollToContent(baseRefs[tab]);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.tabContainer}>
//         {Object.keys(baseRefs).map((tab) => (
//           <button 
//             key={tab}
//             className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
//             onClick={() => handleTabClick(tab)}
//           >
//             {tab}
//           </button>
//         ))}
        
//         {functionData.optionalTabs?.map((tab, index) => (
//           <button 
//             key={`optional_${index}`}
//             className={`${styles.tabButton} ${activeTab === `optional_${index}` ? styles.active : ''}`}
//             onClick={() => handleTabClick(`optional_${index}`)}
//           >
//             {tab.title}
//           </button>
//         ))}
//       </div>
  
//       <div className={styles.content}>
//         <div ref={descriptionRef} className={`${styles.tabContent} ${activeTab === 'description' ? styles.active : ''}`}>
//           {processContent(functionData.extended_description)}
//         </div>

//         <div ref={prototypeRef} className={`${styles.tabContent} ${activeTab === 'prototype' ? styles.active : ''}`}>
//           {processContent(functionData.function_prototype)}
//         </div>

//         <div ref={parametersRef} className={`${styles.tabContent} ${activeTab === 'parameters' ? styles.active : ''}`}>
//           {processContent(functionData.parameter_values)}
//           {processContent(functionData.parameter_types?.length > 0 ? functionData.parameter_types.join(', ') : 'None')}
//         </div>

//         <div ref={returnRef} className={`${styles.tabContent} ${activeTab === 'return' ? styles.active : ''}`}>
//           {processContent(functionData.return_value)}
//           {processContent(functionData.return_type)}
//         </div>
  
//         <div ref={examplesRef} className={`${styles.tabContent} ${activeTab === 'examples' ? styles.active : ''}`}>
//           <div className={styles.innerTabContainer}>
//             {functionData?.examples?.map((example, index) => (
//               <button 
//                 key={index}
//                 className={`${styles.tabButton} ${activeExampleTab === index ? styles.active : ''}`}
//                 onClick={() => {
//                   setActiveExampleTab(index);
//                   setCodeOutput('');
//                 }}
//               >
//                 {example.title}
//               </button>
//             ))}
//           </div>
//           {functionData?.examples?.length > 0 ?
//             renderExampleContent(functionData.examples[activeExampleTab], activeExampleTab) :
//             <p>No examples found.</p>
//           }
//         </div>

//         <div ref={optionalRef}>
//           {functionData.optionalTabs?.map((tab, index) => (
//             <div 
//               key={`optional_${index}`}
//               className={`${styles.tabContent} ${activeTab === `optional_${index}` ? styles.active : ''}`}
//             >
//               {processContent(tab.content)}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FunctionDetails;

// 'use client'
// import React, { useState, useRef } from 'react';
// import AceEditorComponent from '../ace-editor/AceEditorComponent';
// import { ComparisonTable } from '../comparison-tables/FunctionComparison';
// import styles from './FunctionDetails.module.css';
// import Link from 'next/link';
// import { processContent } from '@/utils/contentProcessor';

// const FunctionDetails = ({functionData, external_links}) => {
//   const [activeTab, setActiveTab] = useState('description');
//   const [activeExampleTab, setActiveExampleTab] = useState(0);
//   const [codeOutput, setCodeOutput] = useState('');
//   const [isRunning, setIsRunning] = useState(false);

//   const descriptionRef = useRef(null);
//   const prototypeRef = useRef(null);
//   const parametersRef = useRef(null);
//   const returnRef = useRef(null);
//   const examplesRef = useRef(null);
//   const similarRef = useRef(null);
//   const optionalRef = useRef(null);

//   const baseRefs = {
//     description: descriptionRef,
//     prototype: prototypeRef,
//     parameters: parametersRef,
//     return: returnRef,
//     examples: examplesRef,
//     similar_functions: similarRef
//   };

//   const simulateCodeExecution = (exampleIndex) => {
//     setIsRunning(true);
//     setCodeOutput('Compiling and running...');
//     setTimeout(() => {
//       setCodeOutput(functionData.examples[exampleIndex].expectedOutput);
//       setIsRunning(false);
//     }, 1500);
//   };

//   const renderExampleContent = (example, index) => (
//     <div className={styles.exampleContent}>
//       <div className={styles.codeExplanationContainer}>
//         <div className={styles.codeContainer}>
//           <AceEditorComponent
//             code={example.code}
//             fontSize={14}
//             mode={'c_cpp'}
//             theme={'twilight'}
//             onChange={() => {}}
//             width="100%"
//           />
//           <button 
//             onClick={() => simulateCodeExecution(index)} 
//             disabled={isRunning}
//             className={styles.runButton}
//           >
//             {isRunning ? 'Running...' : 'Run Code'}
//           </button>
//           <h3>Output</h3>
//           <pre className={styles.outputBox}>{codeOutput}</pre>
//         </div>
//         <div className={styles.explanationContainer}>
//           {processContent(example.explanation)}
//         </div>
//       </div>
//     </div>
//   );

//   const scrollToContent = (ref) => {
//     if (ref?.current) {
//       const yOffset = -150;
//       const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
//       window.scrollTo({top: y, behavior: 'smooth'});
//     }
//   };

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//     if (tab.startsWith('optional_')) {
//       scrollToContent(optionalRef);
//     } else {
//       scrollToContent(baseRefs[tab]);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.tabContainer}>
//         {Object.keys(baseRefs).map((tab) => {
//           if (tab === 'similar_functions' && !functionData.comparisons) return null;
//           return (
//             <button 
//               key={tab}
//               className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
//               onClick={() => handleTabClick(tab)}
//             >
//               {tab}
//             </button>
//           );
//         })}
        
//         {functionData.optionalTabs?.map((tab, index) => (
//           <button 
//             key={`optional_${index}`}
//             className={`${styles.tabButton} ${activeTab === `optional_${index}` ? styles.active : ''}`}
//             onClick={() => handleTabClick(`optional_${index}`)}
//           >
//             {tab.title}
//           </button>
//         ))}
//       </div>
  
//       <div className={styles.content}>
//         <div ref={descriptionRef} className={`${styles.tabContent} ${activeTab === 'description' ? styles.active : ''}`}>
//           {processContent(functionData.extended_description)}
//         </div>

//         <div ref={prototypeRef} className={`${styles.tabContent} ${activeTab === 'prototype' ? styles.active : ''}`}>
//           {processContent(functionData.function_prototype)}
//         </div>

//         <div ref={parametersRef} className={`${styles.tabContent} ${activeTab === 'parameters' ? styles.active : ''}`}>
//           {processContent(functionData.parameter_values)}
//           {processContent(functionData.parameter_types?.length > 0 ? functionData.parameter_types.join(', ') : 'None')}
//         </div>

//         <div ref={returnRef} className={`${styles.tabContent} ${activeTab === 'return' ? styles.active : ''}`}>
//           {processContent(functionData.return_value)}
//           {processContent(functionData.return_type)}
//         </div>
  
//         <div ref={examplesRef} className={`${styles.tabContent} ${activeTab === 'examples' ? styles.active : ''}`}>
//           <div className={styles.innerTabContainer}>
//             {functionData?.examples?.map((example, index) => (
//               <button 
//                 key={index}
//                 className={`${styles.tabButton} ${activeExampleTab === index ? styles.active : ''}`}
//                 onClick={() => {
//                   setActiveExampleTab(index);
//                   setCodeOutput('');
//                 }}
//               >
//                 {example.title}
//               </button>
//             ))}
//           </div>
//           {functionData?.examples?.length > 0 ?
//             renderExampleContent(functionData.examples[activeExampleTab], activeExampleTab) :
//             <p>No examples found.</p>
//           }
//         </div>

//         {functionData.comparisons && (
//           <div ref={similarRef} className={`${styles.tabContent} ${activeTab === 'similar_functions' ? styles.active : ''}`}>
//             <div style={{transform:'scale(0.9)'}}>
//             <ComparisonTable
//               functionName={functionData.function_name}
//               comparisonData={functionData.comparisons}
//               base_url="/c-programming/functions"
//             />
//             </div>
//           </div>
//         )}

//         <div ref={optionalRef}>
//           {functionData.optionalTabs?.map((tab, index) => (
//             <div 
//               key={`optional_${index}`}
//               className={`${styles.tabContent} ${activeTab === `optional_${index}` ? styles.active : ''}`}
//             >
//               {processContent(tab.content)}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FunctionDetails;


'use client'
import React, { useState, useRef,useEffect} from 'react';
import AceEditorComponent from '../ace-editor/AceEditorComponent';
import { ComparisonTable } from '../comparison-tables/FunctionComparison';
import styles from './FunctionDetails.module.css';
import Link from 'next/link';
import { processContent } from '@/utils/contentProcessor';
import FunctionPrototype from './c-function/FunctionPrototype';
import CFunctionFlow from './c-function/CFunctionFlow';
import MyList from '../page-components/MyList';
import MermaidDiagram2 from '../mermaid-diagram/MermaidDiagram2';


const FunctionDetails = ({functionData, external_links}) => {
  const [activeTab, setActiveTab] = useState('prototype'); // Changed default tab to prototype
  const [activeExampleTab, setActiveExampleTab] = useState(0);
  const [codeOutput, setCodeOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const prototypeRef = useRef(null);
  const descriptionRef = useRef(null);
  const parametersRef = useRef(null);
  const returnRef = useRef(null);
  const examplesRef = useRef(null);
  const similarRef = useRef(null);
  const optionalRef = useRef(null);

  // Reordered the baseRefs object to match new tab order
  const baseRefs = {
    prototype: prototypeRef,
    description: descriptionRef,
    parameters: parametersRef,
    return: returnRef,
    examples: examplesRef,
    similar_functions: similarRef
  };

  const simulateCodeExecution = (exampleIndex) => {
    setIsRunning(true);
    setCodeOutput('Compiling and running...');
    setTimeout(() => {
      setCodeOutput(functionData.examples[exampleIndex].expectedOutput);
      setIsRunning(false);
    }, 1500);
  };

  const renderExampleContent = (example, index) => (
    <div className={styles.exampleContent}>
      <div className={styles.codeExplanationContainer}>
        <div className={styles.codeContainer}>
          <AceEditorComponent
            code={example.code}
            fontSize={14}
            mode={'c_cpp'}
            theme={'twilight'}
            onChange={() => {}}
            width="100%"
          />
          <button 
            onClick={() => simulateCodeExecution(index)} 
            disabled={isRunning}
            className={styles.runButton}
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          <h3>Output</h3>
          <pre className={styles.outputBox}>{codeOutput}</pre>
        </div>
        <div className={styles.explanationContainer}>
          {processContent(example.explanation)}
        </div>
      </div>
    </div>
  );

  const scrollToContent = (ref) => {
    if (ref?.current) {
      const yOffset = -200;
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  // const handleTabClick = (tab) => {
  //   setActiveTab(tab);
  //   if (tab.startsWith('optional_')) {
  //     scrollToContent(optionalRef);
  //   } else {
  //     scrollToContent(baseRefs[tab]);
  //   }
  // };

  // const handleTabClick = (tab) => {
  //   setActiveTab(tab);
  //   if (tab.startsWith('optional_')) {
  //     scrollToContent(optionalRef);
  //   } else {
  //     scrollToContent(baseRefs[tab]);
  //   }
  // };


  const handleTabClick = (tab) => {
    setActiveTab(tab);
    window.history.pushState({}, '', `#tab-${tab}`);
    if (tab.startsWith('optional_')) {
      scrollToContent(optionalRef);
    } else {
      scrollToContent(baseRefs[tab]);
    }
  };
  
  // Add event listener for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const tab = hash.replace('#tab-', '');
        handleTabClick(tab);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  
  // const paramsData = functionData.function_prototype.parameters.map(param => ({
  //   text: `**${param.type}** \`${param.name}\`: ${param.nameExplanation}`
  // }));

  const paramsData = functionData.function_prototype.parameters.map(param => ({
    text: `**${param.type}** \`${param.name}\`: ${param.nameExplanation}${param.description ? `\n${param.description}` : ''}`
  }));

  
  const returnList=functionData.return_value.split('.').map((item)=>item.trim())

  return (
    <div className={styles.container}>
      <div className={styles.tabContainer}>
        {/* {Object.keys(baseRefs).map((tab) => {
          if (tab === 'similar_functions' && !functionData.comparisons) return null;
          return (
            <button 
              key={tab}
              className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          );
        })} */}
        {Object.keys(baseRefs).map((tab) => {
          if (tab === 'similar_functions' && !functionData.comparisons) return null;
          return (
            <button 
              key={tab}
              className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab === 'return' ? 'Return Value' : tab}
            </button>
          );
        })}
        
        {functionData.optionalTabs?.map((tab, index) => (
          <button 
            key={`optional_${index}`}
            className={`${styles.tabButton} ${activeTab === `optional_${index}` ? styles.active : ''}`}
            onClick={() => handleTabClick(`optional_${index}`)}
          >
            {tab.title}
          </button>
        ))}
      </div>
  
      <div className={styles.content}>
        <div ref={prototypeRef} className={`${styles.tabContent} ${activeTab === 'prototype' ? styles.active : ''}`}>
          <FunctionPrototype prototype={functionData.function_prototype} colorScheme="default" />
        </div>

        <div ref={descriptionRef} className={`${styles.tabContent} ${activeTab === 'description' ? styles.active : ''}`}>
        {functionData.description&&( <div className={styles.excerpt}>
          {/* {processContent(functionData.extended_description)} */}
          {`The`} <span className={styles.functionSpan}>
            {functionData.function_name}</span> 
            {`function in C language  ${functionData.description}`}
          </div>)}
          {functionData.extended_description&&(
            <div className={styles.extendedDescription}>
              {processContent(functionData.extended_description)}
            </div>
          )}

          {/* <div className={styles.functionDiagramContainer}>
           {functionData.function_prototype.description&&
           <CFunctionFlow  functionPrototype={functionData.function_prototype}/>}
          </div> */}

          {/* {functionData.summary&&
          <MyList data={functionData.summary} 
            type="number"  color="blue"
            boxed={true}/>}
            <br/>
            <div className={styles.content}>{'Read more about return type and value of'}
              <span className={styles.functionSpan}>{functionData.function_name}</span>
              {processContent(' function in #tab:return# section.')}
              </div> */}
              {functionData.summary && (
                <div className={styles.workFlow} >
                <br/>
                  <div className={styles.subTitle}>To Summarize the Workflow:</div>
                  <div  className={styles.diagrams}>
                  <MyList 
                    data={functionData.summary} 
                    type="number" 
                    color="blue" 
                    boxed={true}
                  />

                   { functionData.diagram_svg&&<div 
                    style={{marginLeft:'30px',transform:'scale(0.9)',marginTop:'-120px'}}>
                      {processContent(functionData.diagram_svg)}</div>}
                    { functionData.diagram&&<div style={{transform:'scale(0.95)', marginLeft:'50px'}}>
                    <MermaidDiagram2 chartDefinition={functionData.diagram}/>
                    </div>}
                    </div>
                  <br/>
                 
                
                  <br/>
                  <div className={styles.content}>
                  {'Read more about return type and value of'}
                  <span className={styles.functionSpan}>{functionData.function_name}</span>
                  {processContent(' function in #tab:return# section.')}
                </div>
              </div>
            )}
        </div>

        <div ref={parametersRef} className={`${styles.tabContent} ${activeTab === 'parameters' ? styles.active : ''}`}>
          <div id='tab-parameters'></div>
          {/* {processContent(functionData.parameter_values)}
          {processContent(functionData.parameter_types?.length > 0 ? functionData.parameter_types.join(', ') : 'None')} */}
         
          <span className={styles.excerpt}>{'The '} <span className={styles.functionSpan}>
          {functionData.function_name}</span> 
         {`function takes ${functionData.function_prototype.parameters.length}
          parameter${functionData.function_prototype.parameters.length === 1 ? '' : 's'}:`}
         </span>
         <div style={{width:'50%'}}>
          <MyList 
        data={paramsData}
        type="dot"
        boxed={true}
        color="blue"
        displayField="text"
      />
      </div>
        <span>{processContent(functionData.function_prototype.description)}</span>
        </div>

        <div id="tab-return" ref={returnRef} className={`${styles.tabContent} ${activeTab === 'return' ? styles.active : ''}`}>
          {/* {processContent(functionData.return_value)}
          {processContent(functionData.return_type)} */}
           <span className={styles.excerpt}>{'The '} <span className={styles.functionSpan}>
          {functionData.function_name}</span> {'function return value :'}  </span>
         {/* {processContent(`function returns ${functionData.return_value}`)} */}
        <div style={{display:'flex',flexDirection:'row'}}>
         <div style={{width:'50%'}}>
         <MyList
         data={returnList}
        //  type="dot"
         boxed={true}
         color="yellow"
         />
         </div>
         <div style={{width:'50%'}}>
         {functionData.return_svg&&processContent(functionData.return_svg)}
         </div>
         </div>
       
        </div>
  
        <div ref={examplesRef} className={`${styles.tabContent} ${activeTab === 'examples' ? styles.active : ''}`}>
          <div className={styles.innerTabContainer}>
            {functionData?.examples?.map((example, index) => (
              <button 
                key={index}
                className={`${styles.tabButton} ${activeExampleTab === index ? styles.active : ''}`}
                onClick={() => {
                  setActiveExampleTab(index);
                  setCodeOutput('');
                }}
              >
                {example.title}
              </button>
            ))}
          </div>
          {functionData?.examples?.length > 0 ?
            renderExampleContent(functionData.examples[activeExampleTab], activeExampleTab) :
            <p>No examples found.</p>
          }
        </div>

        {functionData.comparisons && (
          <div ref={similarRef} className={`${styles.tabContent} ${activeTab === 'similar_functions' ? styles.active : ''}`}>
            <div style={{transform:'scale(0.9)'}}>
            <ComparisonTable
              functionName={functionData.function_name}
              comparisonData={functionData.comparisons}
              base_url="/c-programming/functions"
            />
            </div>
          </div>
        )}

        <div ref={optionalRef}>
          {functionData.optionalTabs?.map((tab, index) => (
            <div 
              key={`optional_${index}`}
              className={`${styles.tabContent} ${activeTab === `optional_${index}` ? styles.active : ''}`}
            >
              {processContent(tab.content)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FunctionDetails;