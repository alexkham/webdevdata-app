// 'use client'
// import React, { useState, useRef } from 'react';
// import AceEditorComponent from '../ace-editor/AceEditorComponent';
// import styles from './FunctionDetails.module.css';
// import Link from 'next/link';

// export default function PythonFunctionDetails({functionData}) {
//   const [activeTab, setActiveTab] = useState('description');
//   const [activeExampleTab, setActiveExampleTab] = useState(0);
//   const [codeOutput, setCodeOutput] = useState('');
//   const [isRunning, setIsRunning] = useState(false);

//   const tabRefs = {
//     description: useRef(null),
//     signature: useRef(null),
//     parameters: useRef(null),
//     return: useRef(null),
//     examples: useRef(null),
//   };

//   const simulateCodeExecution = (exampleIndex) => {
//     setIsRunning(true);
//     setCodeOutput('Running...');
    
//     setTimeout(() => {
//       setCodeOutput(functionData.examples[exampleIndex].expected_output);
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
//             mode={'python'}
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
//           <h3>Explanation</h3>
//           <p>{example.explanation}</p>
//         </div>
//       </div>
//     </div>
//   );

//   const scrollToContent = (ref) => {
//     if (ref && ref.current) {
//       const yOffset = -150;
//       const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
//       window.scrollTo({top: y, behavior: 'smooth'});
//     }
//   };

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//     scrollToContent(tabRefs[tab]);
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.tabContainer}>
//         {Object.keys(tabRefs).map((tab) => (
//           <button 
//             key={tab}
//             className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
//             onClick={() => handleTabClick(tab)}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>
  
//       <div className={styles.content}>
//         <div ref={tabRefs.description} className={`${styles.tabContent} ${activeTab === 'description' ? styles.active : ''}`}>
//           <h2>Description</h2>
//           <br />
//           <p>{functionData.docstring}</p>
//           <br />
//           <h3>Extended Description</h3>
//           <br />
//           <p>{functionData.extended_description}</p>
//           {functionData.exceptions && functionData.exceptions.length > 0 && (
//             <>
//               <br />
//               <h3>Exceptions</h3>
//               <br />
//               <ul>
//                 {functionData.exceptions.map((exception, index) => (
//                   <li key={index}><strong>{exception.type}:</strong> {exception.condition}</li>
//                 ))}
//               </ul>
//             </>
//           )}
//           <br></br>
         
//           {functionData.module==='builtins'&&
//           <Link 
//           className={styles.link}
//           href={`https://docs.python.org/3/library/functions.html#${functionData.name}`}
//           target="_blank"
//           rel="noopener noreferrer" >
//             Read More about {functionData.name} from Python Documentation </Link>}
//         </div>

//         <div ref={tabRefs.signature} className={`${styles.tabContent} ${activeTab === 'signature' ? styles.active : ''}`}>
//           <h2>Function Signature</h2>
//           <br />
//           <pre className={styles.prototypeBox}>{functionData.function_signature}</pre>
//           <br />
//           <p><strong>Module:</strong> {functionData.module}</p>
//           {functionData.class_name && <p><strong>Class:</strong> {functionData.class_name}</p>}
//           {functionData.decorators && functionData.decorators.length > 0 && (
//             <>
//               <br />
//               <h3>Decorators</h3>
//               <ul>
//                 {functionData.decorators.map((decorator, index) => (
//                   <li key={index}>{decorator}</li>
//                 ))}
//               </ul>
//             </>
//           )}
//         </div>

//         <div ref={tabRefs.parameters} className={`${styles.tabContent} ${activeTab === 'parameters' ? styles.active : ''}`}>
//           <h2>Parameters</h2>
//           <br />
//           <p>{functionData.parameter_details}</p>
//           <br />
//           {functionData.parameters && functionData.parameters.length > 0 && (
//             <>
//               <h3>Parameter List</h3>
//               <br />
//               <ul>
//                 {functionData.parameters.map((param, index) => (
//                   <li key={index}><strong>{param.name}</strong>: {param.type}</li>
//                 ))}
//               </ul>
//             </>
//           )}
//         </div>

//         <div ref={tabRefs.return} className={`${styles.tabContent} ${activeTab === 'return' ? styles.active : ''}`}>
//           <h2>Return</h2>
//           <br />
//           <p>{functionData.return_value}</p>
//           <br />
//           <h3>Return Type</h3>
//           <br />
//           <p>{functionData.return_type}</p>
//         </div>
  
//         <div ref={tabRefs.examples} className={`${styles.tabContent} ${activeTab === 'examples' ? styles.active : ''}`}>
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
//       </div>
//     </div>
//   );
// };

// 'use client'
// import React, { useState, useRef } from 'react';
// import AceEditorComponent from '../ace-editor/AceEditorComponent';
// import styles from './FunctionDetails.module.css';
// import Link from 'next/link';

// const SVGRenderer = ({ svgData }) => {
//  if (!svgData?.svg_diagram) return null;
//  return (
//    <div className={styles.svgContainer}>
//      <div dangerouslySetInnerHTML={{ __html: svgData.svg_diagram }} />
//      {svgData.explanation && (
//        <p className={styles.svgExplanation}>{svgData.explanation}</p>
//      )}
//    </div>
//  );
// };

// export default function PythonFunctionDetails({functionData}) {
//  const [activeTab, setActiveTab] = useState('description');
//  const [activeExampleTab, setActiveExampleTab] = useState(0);
//  const [codeOutput, setCodeOutput] = useState('');
//  const [isRunning, setIsRunning] = useState(false);

//  const tabRefs = {
//    description: useRef(null),
//    signature: useRef(null),
//    parameters: useRef(null),
//    return: useRef(null),
//    examples: useRef(null),
//  };
 
//  const getSVGsForTab = (tabName) => {
//    if (!functionData?.svg_data?.length) return [];
//    return functionData.svg_data.filter(svg => svg?.tab === tabName);
//  };

//  const simulateCodeExecution = (exampleIndex) => {
//    setIsRunning(true);
//    setCodeOutput('Running...');
//    setTimeout(() => {
//      setCodeOutput(functionData.examples[exampleIndex].expected_output);
//      setIsRunning(false);
//    }, 1500);
//  };

//  const renderExampleContent = (example, index) => (
//    <div className={styles.exampleContent}>
//      <div className={styles.codeExplanationContainer}>
//        <div className={styles.codeContainer}>
//          <AceEditorComponent
//            code={example.code}
//            fontSize={14}
//            mode={'python'}
//            theme={'twilight'}
//            onChange={() => {}}
//            width="100%"
//          />
//          <button 
//            onClick={() => simulateCodeExecution(index)} 
//            disabled={isRunning}
//            className={styles.runButton}
//          >
//            {isRunning ? 'Running...' : 'Run Code'}
//          </button>
//          <h3>Output</h3>
//          <pre className={styles.outputBox}>{codeOutput}</pre>
//        </div>
//        <div className={styles.explanationContainer}>
//          <h3>Explanation</h3>
//          <p>{example.explanation}</p>
//        </div>
//      </div>
//    </div>
//  );

//  const renderTabContent = (tabName, content) => {
//    const svgs = getSVGsForTab(tabName);
//    return (
//      <>
//        {content}
//        {svgs.map((svg, index) => (
//          <SVGRenderer key={index} svgData={svg} />
//        ))}
//      </>
//    );
//  };

//  const scrollToContent = (ref) => {
//    if (ref?.current) {
//      const yOffset = -150;
//      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
//      window.scrollTo({top: y, behavior: 'smooth'});
//    }
//  };

//  const handleTabClick = (tab) => {
//    setActiveTab(tab);
//    scrollToContent(tabRefs[tab]);
//  };

//  return (
//    <div className={styles.container}>
//      <div className={styles.tabContainer}>
//        {Object.keys(tabRefs).map((tab) => (
//          <button 
//            key={tab}
//            className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
//            onClick={() => handleTabClick(tab)}
//          >
//            {tab.charAt(0).toUpperCase() + tab.slice(1)}
//          </button>
//        ))}
//      </div>
 
//      <div className={styles.content}>
//        <div ref={tabRefs.description} className={`${styles.tabContent} ${activeTab === 'description' ? styles.active : ''}`}>
//          {renderTabContent('description', 
//            <>
//              <h2>Description</h2>
//              <br />
//              <p>{functionData.docstring}</p>
//              <br />
//              <h3>Extended Description</h3>
//              <br />
//              <p>{functionData.extended_description}</p>
//              {functionData.exceptions?.length > 0 && (
//                <>
//                  <br />
//                  <h3>Exceptions</h3>
//                  <br />
//                  <ul>
//                    {functionData.exceptions.map((exception, index) => (
//                      <li key={index}><strong>{exception.type}:</strong> {exception.condition}</li>
//                    ))}
//                  </ul>
//                </>
//              )}
//              <br />
//              {functionData.module === 'builtins' && (
//                <Link 
//                  className={styles.link}
//                  href={`https://docs.python.org/3/library/functions.html#${functionData.name}`}
//                  target="_blank"
//                  rel="noopener noreferrer"
//                >
//                  Read More about {functionData.name} from Python Documentation
//                </Link>
//              )}
//            </>
//          )}
//        </div>

//        <div ref={tabRefs.signature} className={`${styles.tabContent} ${activeTab === 'signature' ? styles.active : ''}`}>
//          {renderTabContent('signature',
//            <>
//              <h2>Function Signature</h2>
//              <br />
//              <pre className={styles.prototypeBox}>{functionData.function_signature}</pre>
//              <br />
//              <p><strong>Module:</strong> {functionData.module}</p>
//              {functionData.class_name && <p><strong>Class:</strong> {functionData.class_name}</p>}
//              {functionData.decorators?.length > 0 && (
//                <>
//                  <br />
//                  <h3>Decorators</h3>
//                  <ul>
//                    {functionData.decorators.map((decorator, index) => (
//                      <li key={index}>{decorator}</li>
//                    ))}
//                  </ul>
//                </>
//              )}
//            </>
//          )}
//        </div>

//        <div ref={tabRefs.parameters} className={`${styles.tabContent} ${activeTab === 'parameters' ? styles.active : ''}`}>
//          {renderTabContent('parameters',
//            <>
//              <h2>Parameters</h2>
//              <br />
//              <p>{functionData.parameter_details}</p>
//              <br />
//              {functionData.parameters?.length > 0 && (
//                <>
//                  <h3>Parameter List</h3>
//                  <br />
//                  <ul>
//                    {functionData.parameters.map((param, index) => (
//                      <li key={index}><strong>{param.name}</strong>: {param.type}</li>
//                    ))}
//                  </ul>
//                </>
//              )}
//            </>
//          )}
//        </div>

//        <div ref={tabRefs.return} className={`${styles.tabContent} ${activeTab === 'return' ? styles.active : ''}`}>
//          {renderTabContent('return',
//            <>
//              <h2>Return</h2>
//              <br />
//              <p>{functionData.return_value}</p>
//              <br />
//              <h3>Return Type</h3>
//              <br />
//              <p>{functionData.return_type}</p>
//            </>
//          )}
//        </div>
 
//        <div ref={tabRefs.examples} className={`${styles.tabContent} ${activeTab === 'examples' ? styles.active : ''}`}>
//          {renderTabContent('examples',
//            <>
//              <div className={styles.innerTabContainer}>
//                {functionData?.examples?.map((example, index) => (
//                  <button 
//                    key={index}
//                    className={`${styles.tabButton} ${activeExampleTab === index ? styles.active : ''}`}
//                    onClick={() => {
//                      setActiveExampleTab(index);
//                      setCodeOutput('');
//                    }}
//                  >
//                    {example.title}
//                  </button>
//                ))}
//              </div>
//              {functionData?.examples?.length > 0 ?
//                renderExampleContent(functionData.examples[activeExampleTab], activeExampleTab) :
//                <p>No examples found.</p>
//              }
//            </>
//          )}
//        </div>
//      </div>
//    </div>
//  );
// }

// 'use client'
// import React, { useState, useRef } from 'react';
// import AceEditorComponent from '../ace-editor/AceEditorComponent';
// import styles from './FunctionDetails.module.css';
// import Link from 'next/link';

// // const SVGRenderer = ({ svgData }) => {
// //  if (!Array.isArray(svgData) || !svgData.length) return null;
 
// //  return svgData.map((item, index) => (
// //    <div key={index} className={styles.svgContainer}>
// //      <div dangerouslySetInnerHTML={{ __html: item.svg_diagram }} />
// //      {item.explanation && (
// //        <p className={styles.svgExplanation}>{item.explanation}</p>
// //      )}
// //    </div>
// //  ));
// // };


// const SVGRenderer = ({ svgData }) => {
//   if (!Array.isArray(svgData) || !svgData.length) return null;
  
//   return svgData.map((item, index) => (
//     <div key={index} className={styles.svgContainer}>
//       <div className={styles.svgWrapper}>
//         <div dangerouslySetInnerHTML={{ __html: item.svg_diagram }} />
//       </div>
//       {item.explanation && <p className={styles.svgExplanation}>{item.explanation}</p>}
//     </div>
//   ));
// };

// export default function PythonFunctionDetails({functionData}) {
//  const [activeTab, setActiveTab] = useState('description');
//  const [activeExampleTab, setActiveExampleTab] = useState(0);
//  const [codeOutput, setCodeOutput] = useState('');
//  const [isRunning, setIsRunning] = useState(false);

//  const tabRefs = {
//    description: useRef(null),
//    signature: useRef(null),
//    parameters: useRef(null),
//    return: useRef(null),
//    examples: useRef(null),
//  };

//  const getSVGsForTab = (tabName) => {
//    if (!functionData?.svg?.length) return [];
//    return functionData.svg.filter(svg => svg?.tab === tabName);
//  };

//  const simulateCodeExecution = (exampleIndex) => {
//    setIsRunning(true);
//    setCodeOutput('Running...');
//    setTimeout(() => {
//      setCodeOutput(functionData.examples[exampleIndex].expected_output);
//      setIsRunning(false);
//    }, 1500);
//  };

//  const renderExampleContent = (example, index) => (
//    <div className={styles.exampleContent}>
//      <div className={styles.codeExplanationContainer}>
//        <div className={styles.codeContainer}>
//          <AceEditorComponent
//            code={example.code}
//            fontSize={14}
//            mode={'python'}
//            theme={'twilight'}
//            onChange={() => {}}
//            width="100%"
//          />
//          <button 
//            onClick={() => simulateCodeExecution(index)} 
//            disabled={isRunning}
//            className={styles.runButton}
//          >
//            {isRunning ? 'Running...' : 'Run Code'}
//          </button>
//          <h3>Output</h3>
//          <pre className={styles.outputBox}>{codeOutput}</pre>
//        </div>
//        <div className={styles.explanationContainer}>
//          <h3>Explanation</h3>
//          <p>{example.explanation}</p>
//        </div>
//      </div>
//    </div>
//  );

//  const renderTabContent = (tabName, content) => {
//    const svgs = getSVGsForTab(tabName);
//    return (
//      <>
//        {content}
//        <SVGRenderer svgData={svgs} />
//      </>
//    );
//  };

//  const scrollToContent = (ref) => {
//    if (ref?.current) {
//      const yOffset = -150;
//      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
//      window.scrollTo({top: y, behavior: 'smooth'});
//    }
//  };

//  const handleTabClick = (tab) => {
//    setActiveTab(tab);
//    scrollToContent(tabRefs[tab]);
//  };

//  return (
//    <div className={styles.container}>
//      <div className={styles.tabContainer}>
//        {Object.keys(tabRefs).map((tab) => (
//          <button 
//            key={tab}
//            className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
//            onClick={() => handleTabClick(tab)}
//          >
//            {tab.charAt(0).toUpperCase() + tab.slice(1)}
//          </button>
//        ))}
//      </div>
 
//      <div className={styles.content}>
//        <div ref={tabRefs.description} className={`${styles.tabContent} ${activeTab === 'description' ? styles.active : ''}`}>
//          {renderTabContent('description', 
//            <>
//              <h2>Description</h2>
//              <br />
//              <p>{functionData.docstring}</p>
//              <br />
//              <h3>Extended Description</h3>
//              <br />
//              <p>{functionData.extended_description}</p>
//              {functionData.exceptions?.length > 0 && (
//                <>
//                  <br />
//                  <h3>Exceptions</h3>
//                  <br />
//                  <ul>
//                    {functionData.exceptions.map((exception, index) => (
//                      <li key={index}><strong>{exception.type}:</strong> {exception.condition}</li>
//                    ))}
//                  </ul>
//                </>
//              )}
//              <br />
//              {functionData.module === 'builtins' && (
//                <Link 
//                  className={styles.link}
//                  href={`https://docs.python.org/3/library/functions.html#${functionData.name}`}
//                  target="_blank"
//                  rel="noopener noreferrer"
//                >
//                  Read More about {functionData.name} from Python Documentation
//                </Link>
//              )}
//            </>
//          )}
//        </div>

//        <div ref={tabRefs.signature} className={`${styles.tabContent} ${activeTab === 'signature' ? styles.active : ''}`}>
//          {renderTabContent('signature',
//            <>
//              <h2>Function Signature</h2>
//              <br />
//              <pre className={styles.prototypeBox}>{functionData.function_signature}</pre>
//              <br />
//              <p><strong>Module:</strong> {functionData.module}</p>
//              {functionData.class_name && <p><strong>Class:</strong> {functionData.class_name}</p>}
//              {functionData.decorators?.length > 0 && (
//                <>
//                  <br />
//                  <h3>Decorators</h3>
//                  <ul>
//                    {functionData.decorators.map((decorator, index) => (
//                      <li key={index}>{decorator}</li>
//                    ))}
//                  </ul>
//                </>
//              )}
//            </>
//          )}
//        </div>

//        <div ref={tabRefs.parameters} className={`${styles.tabContent} ${activeTab === 'parameters' ? styles.active : ''}`}>
//          {renderTabContent('parameters',
//            <>
//              <h2>Parameters</h2>
//              <br />
//              <p>{functionData.parameter_details}</p>
//              <br />
//              {functionData.parameters?.length > 0 && (
//                <>
//                  <h3>Parameter List</h3>
//                  <br />
//                  <ul>
//                    {functionData.parameters.map((param, index) => (
//                      <li key={index}><strong>{param.name}</strong>: {param.type}</li>
//                    ))}
//                  </ul>
//                </>
//              )}
//            </>
//          )}
//        </div>

//        <div ref={tabRefs.return} className={`${styles.tabContent} ${activeTab === 'return' ? styles.active : ''}`}>
//          {renderTabContent('return',
//            <>
//              <h2>Return</h2>
//              <br />
//              <p>{functionData.return_value}</p>
//              <br />
//              <h3>Return Type</h3>
//              <br />
//              <p>{functionData.return_type}</p>
//            </>
//          )}
//        </div>
 
//        <div ref={tabRefs.examples} className={`${styles.tabContent} ${activeTab === 'examples' ? styles.active : ''}`}>
//          {renderTabContent('examples',
//            <>
//              <div className={styles.innerTabContainer}>
//                {functionData?.examples?.map((example, index) => (
//                  <button 
//                    key={index}
//                    className={`${styles.tabButton} ${activeExampleTab === index ? styles.active : ''}`}
//                    onClick={() => {
//                      setActiveExampleTab(index);
//                      setCodeOutput('');
//                    }}
//                  >
//                    {example.title}
//                  </button>
//                ))}
//              </div>
//              {functionData?.examples?.length > 0 ?
//                renderExampleContent(functionData.examples[activeExampleTab], activeExampleTab) :
//                <p>No examples found.</p>
//              }
//            </>
//          )}
//        </div>
//      </div>
//    </div>
//  );
// }


'use client'
import React, { useState, useRef } from 'react';
import AceEditorComponent from '../ace-editor/AceEditorComponent';
import styles from './FunctionDetails.module.css';
import Link from 'next/link';
import { processContent } from '@/utils/contentProcessor';

const SVGRenderer = ({ svgData }) => {
 if (!Array.isArray(svgData) || !svgData.length) return null;
 
 return svgData.map((item, index) => (
   <div key={index} className={styles.svgContainer}>
     <div className={styles.svgWrapper}>
       <div dangerouslySetInnerHTML={{ __html: item.svg_diagram }} />
     </div>
     {item.explanation && <p className={styles.svgExplanation}>{item.explanation}</p>}
   </div>
 ));
};

export default function PythonFunctionDetails({functionData}) {
 const [activeTab, setActiveTab] = useState('description');
 const [activeExampleTab, setActiveExampleTab] = useState(0);
 const [codeOutput, setCodeOutput] = useState('');
 const [isRunning, setIsRunning] = useState(false);

 const tabRefs = {
   description: useRef(null),
   signature: useRef(null),
   parameters: useRef(null),
   return: useRef(null),
   examples: useRef(null),
 };

 const getSVGsForTab = (tabName) => {
   if (!functionData?.svg?.length) return [];
   return functionData.svg.filter(svg => svg?.tab === tabName);
 };

 const simulateCodeExecution = (exampleIndex) => {
   setIsRunning(true);
   setCodeOutput('Running...');
   setTimeout(() => {
     setCodeOutput(functionData.examples[exampleIndex].expected_output);
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
           mode={'python'}
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
         <h3>Explanation</h3>
         <p>{example.explanation}</p>
       </div>
     </div>
   </div>
 );

 const renderTabContent = (tabName, content) => {
   const svgs = tabName !== 'description' ? getSVGsForTab(tabName) : [];
   return (
     <>
       {content}
       <SVGRenderer svgData={svgs} />
     </>
   );
 };

 const scrollToContent = (ref) => {
   if (ref?.current) {
     const yOffset = -150;
     const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
     window.scrollTo({top: y, behavior: 'smooth'});
   }
 };

 const handleTabClick = (tab) => {
   setActiveTab(tab);
   scrollToContent(tabRefs[tab]);
 };

 return (
   <div className={styles.container}>
     <div className={styles.tabContainer}>
       {Object.keys(tabRefs).map((tab) => (
         <button 
           key={tab}
           className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
           onClick={() => handleTabClick(tab)}
         >
           {tab.charAt(0).toUpperCase() + tab.slice(1)}
         </button>
       ))}
     </div>
 
     <div className={styles.content}>
       <div ref={tabRefs.description} className={`${styles.tabContent} ${activeTab === 'description' ? styles.active : ''}`}>
         <h2>Description</h2>
        
         <p>{functionData.docstring}</p>
         
         <SVGRenderer svgData={functionData.svg?.filter(svg => svg?.tab === 'description')} />
         
         <h3>Extended Description</h3>
        
         <p>{processContent(functionData.extended_description)}</p>
         {functionData.exceptions?.length > 0 && (
           <>
             <br />
             <h3>Exceptions</h3>
             <br />
             <ul>
               {functionData.exceptions.map((exception, index) => (
                 <li key={index}><strong>{exception.type}:</strong> {exception.condition}</li>
               ))}
             </ul>
           </>
         )}
         <br />
         {functionData.module === 'builtins' && (
           <Link 
             className={styles.link}
             href={`https://docs.python.org/3/library/functions.html#${functionData.name}`}
             target="_blank"
             rel="noopener noreferrer"
           >
             Read More about {functionData.name} from Python Documentation
           </Link>
         )}
       </div>

       <div ref={tabRefs.signature} className={`${styles.tabContent} ${activeTab === 'signature' ? styles.active : ''}`}>
         {renderTabContent('signature',
           <>
             <h2>Function Signature</h2>
             <br />
             <pre className={styles.prototypeBox}>{functionData.function_signature}</pre>
             <br />
             <p><strong>Module:</strong> {functionData.module}</p>
             {functionData.class_name && <p><strong>Class:</strong> {functionData.class_name}</p>}
             {functionData.decorators?.length > 0 && (
               <>
                 <br />
                 <h3>Decorators</h3>
                 <ul>
                   {functionData.decorators.map((decorator, index) => (
                     <li key={index}>{decorator}</li>
                   ))}
                 </ul>
               </>
             )}
           </>
         )}
       </div>

       <div ref={tabRefs.parameters} className={`${styles.tabContent} ${activeTab === 'parameters' ? styles.active : ''}`}>
         {renderTabContent('parameters',
           <>
             <h2>Parameters</h2>
             <br />
             <p>{functionData.parameter_details}</p>
             <br />
             {functionData.parameters?.length > 0 && (
               <>
                 <h3>Parameter List</h3>
                 <br />
                 <ul>
                   {functionData.parameters.map((param, index) => (
                     <li key={index}><strong>{param.name}</strong>: {param.type}</li>
                   ))}
                 </ul>
               </>
             )}
           </>
         )}
       </div>

       <div ref={tabRefs.return} className={`${styles.tabContent} ${activeTab === 'return' ? styles.active : ''}`}>
         {renderTabContent('return',
           <>
             <h2>Return</h2>
             <br />
             <p>{functionData.return_value}</p>
             <br />
             <h3>Return Type</h3>
             <br />
             <p>{functionData.return_type}</p>
           </>
         )}
       </div>
 
       <div ref={tabRefs.examples} className={`${styles.tabContent} ${activeTab === 'examples' ? styles.active : ''}`}>
         {renderTabContent('examples',
           <>
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
           </>
         )}
       </div>
     </div>
   </div>
 );
}