// // // // 'use client'
// // // // import React, { useState, useEffect } from 'react';
// // // // import AceEditorComponent from '../ace-editor/AceEditorComponent';
// // // // import { useRouter } from 'next/router';
// // // // import styles from './FunctionDetailsPage.module.css';

// // // // const FunctionDetailsPage = () => {
// // // //   const [functionData, setFunctionData] = useState(null);
// // // //   const [activeTab, setActiveTab] = useState('description');
// // // //   const router = useRouter();
// // // //   const { functionName } = router.query;

// // // //   useEffect(() => {
// // // //     // Fetch function data based on functionName
// // // //     // This is where you'd make an API call or fetch from your JSON structure
// // // //     // For now, we'll use a mock function
// // // //     const fetchFunctionData = async () => {
// // // //       // Mock data - replace this with actual data fetching
// // // //       const mockData = {
// // // //         function_name: "nextafter",
// // // //         include_file: "math.h",
// // // //         return_type: "double",
// // // //         parameter_types: ["double", "double"],
// // // //         main_category: "Mathematical Operations",
// // // //         sub_category: "Advanced Computation",
// // // //         data_type_manipulated: "floating-point numbers",
// // // //         description: "Returns the next representable value of the first argument in the direction of the second argument.",
// // // //         examples: [
// // // //           {
// // // //             code: `#include <stdio.h>
// // // // #include <math.h>

// // // // int main() {
// // // //     double x = 3.14;
// // // //     double y = 3.15;
// // // //     double result = nextafter(x, y);
// // // //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// // // //     return 0;
// // // // }`,
// // // //             explanation: "This example demonstrates how to use the nextafter function to find the next representable value."
// // // //           }
// // // //         ]
// // // //       };
// // // //       setFunctionData(mockData);
// // // //     };

// // // //     if (functionName) {
// // // //       fetchFunctionData();
// // // //     }
// // // //   }, [functionName]);

// // // //   if (!functionData) return <div>Loading...</div>;

// // // //   return (
// // // //     <div className={styles.container}>
// // // //       <h1 className={styles.title}>{functionData.function_name}</h1>
      
// // // //       <div className={styles.tabContainer}>
// // // //         <button 
// // // //           className={`${styles.tabButton} ${activeTab === 'description' ? styles.active : ''}`}
// // // //           onClick={() => setActiveTab('description')}
// // // //         >
// // // //           Description
// // // //         </button>
// // // //         <button 
// // // //           className={`${styles.tabButton} ${activeTab === 'examples' ? styles.active : ''}`}
// // // //           onClick={() => setActiveTab('examples')}
// // // //         >
// // // //           Examples
// // // //         </button>
// // // //       </div>

// // // //       <div className={styles.content}>
// // // //         {activeTab === 'description' && (
// // // //           <div>
// // // //             <h2>Description</h2>
// // // //             <p>{functionData.description}</p>
// // // //             <h3>Details</h3>
// // // //             <ul>
// // // //               <li><strong>Include File:</strong> {functionData.include_file}</li>
// // // //               <li><strong>Return Type:</strong> {functionData.return_type}</li>
// // // //               <li><strong>Parameter Types:</strong> {functionData.parameter_types.join(', ')}</li>
// // // //               <li><strong>Main Category:</strong> {functionData.main_category}</li>
// // // //               <li><strong>Sub Category:</strong> {functionData.sub_category}</li>
// // // //               <li><strong>Data Type Manipulated:</strong> {functionData.data_type_manipulated}</li>
// // // //             </ul>
// // // //           </div>
// // // //         )}

// // // //         {activeTab === 'examples' && (
// // // //           <div>
// // // //             <h2>Examples</h2>
// // // //             {functionData.examples.map((example, index) => (
// // // //               <div key={index} className={styles.exampleContainer}>
// // // //                 <AceEditorComponent
// // // //                   code={example.code}
// // // //                   fontSize={14}
// // // //                   theme="monokai"
// // // //                   mode="c_cpp"
// // // //                   onChange={() => {}}
// // // //                   width="100%"
// // // //                 />
// // // //                 <div className={styles.explanation}>
// // // //                   <h3>Explanation</h3>
// // // //                   <p>{example.explanation}</p>
// // // //                 </div>
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default FunctionDetailsPage;
// // // 'use client'
// // // import React, { useState } from 'react';
// // // import AceEditorComponent from '../ace-editor/AceEditorComponent';
// // // import styles from './FunctionDetailsPage.module.css';

// // // const FunctionDetailsPage = () => {
// // //   const [activeTab, setActiveTab] = useState('description');

// // //   // Hardcoded mock data
// // //   const functionData = {
// // //     function_name: "nextafter",
// // //     include_file: "math.h",
// // //     return_type: "double",
// // //     parameter_types: ["double", "double"],
// // //     main_category: "Mathematical Operations",
// // //     sub_category: "Advanced Computation",
// // //     data_type_manipulated: "floating-point numbers",
// // //     description: "Returns the next representable value of the first argument in the direction of the second argument.",
// // //     examples: [
// // //       {
// // //         code: `#include <stdio.h>
// // // #include <math.h>

// // // int main() {
// // //     double x = 3.14;
// // //     double y = 3.15;
// // //     double result = nextafter(x, y);
// // //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// // //     return 0;
// // // }`,
// // //         explanation: "This example demonstrates how to use the nextafter function to find the next representable value."
// // //       }
// // //     ]
// // //   };

// // //   return (
// // //     <div className={styles.container}>
// // //       <h1 className={styles.title}>{functionData.function_name}</h1>
      
// // //       <div className={styles.tabContainer}>
// // //         <button 
// // //           className={`${styles.tabButton} ${activeTab === 'description' ? styles.active : ''}`}
// // //           onClick={() => setActiveTab('description')}
// // //         >
// // //           Description
// // //         </button>
// // //         <button 
// // //           className={`${styles.tabButton} ${activeTab === 'examples' ? styles.active : ''}`}
// // //           onClick={() => setActiveTab('examples')}
// // //         >
// // //           Examples
// // //         </button>
// // //       </div>

// // //       <div className={styles.content}>
// // //         {activeTab === 'description' && (
// // //           <div>
// // //             <h2>Description</h2>
// // //             <p>{functionData.description}</p>
// // //             <h3>Details</h3>
// // //             <ul>
// // //               <li><strong>Include File:</strong> {functionData.include_file}</li>
// // //               <li><strong>Return Type:</strong> {functionData.return_type}</li>
// // //               <li><strong>Parameter Types:</strong> {functionData.parameter_types.join(', ')}</li>
// // //               <li><strong>Main Category:</strong> {functionData.main_category}</li>
// // //               <li><strong>Sub Category:</strong> {functionData.sub_category}</li>
// // //               <li><strong>Data Type Manipulated:</strong> {functionData.data_type_manipulated}</li>
// // //             </ul>
// // //           </div>
// // //         )}

// // //         {activeTab === 'examples' && (
// // //           <div>
// // //             <h2>Examples</h2>
// // //             {functionData.examples.map((example, index) => (
// // //               <div key={index} className={styles.exampleContainer}>
// // //                 <AceEditorComponent
// // //                   code={example.code}
// // //                   fontSize={14}
// // //                   theme="monokai"
// // //                   mode="c_cpp"
// // //                   onChange={() => {}}
// // //                   width="100%"
// // //                 />
// // //                 <div className={styles.explanation}>
// // //                   <h3>Explanation</h3>
// // //                   <p>{example.explanation}</p>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default FunctionDetailsPage;
// // 'use client'
// // import React, { useState } from 'react';
// // import AceEditorComponent from '../ace-editor/AceEditorComponent';
// // import MermaidDiagram from '../mermaid-diagram/MermaidDiagram';
// // import MarkdownComponent from '../markdown-component/MarkdownComponent';
// // import styles from './FunctionDetailsPage.module.css';

// // const FunctionDetailsPage = () => {
// //   const [activeOuterTab, setActiveOuterTab] = useState('description');
// //   const [activeExampleTab, setActiveExampleTab] = useState(0);

// //   // Hardcoded mock data
// //   const functionData = {
// //     function_name: "nextafter",
// //     include_file: "math.h",
// //     return_type: "double",
// //     parameter_types: ["double", "double"],
// //     main_category: "Mathematical Operations",
// //     sub_category: "Advanced Computation",
// //     data_type_manipulated: "floating-point numbers",
// //     description: "Returns the next representable value of the first argument in the direction of the second argument.",
// //     examples: [
// //       {
// //         title: "Basic Usage",
// //         code: `#include <stdio.h>
// // #include <math.h>

// // int main() {
// //     double x = 3.14;
// //     double y = 3.15;
// //     double result = nextafter(x, y);
// //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// //     return 0;
// // }`,
// //         mermaid: `graph TD
// //     A[Start] --> B[Initialize x and y]
// //     B --> C[Call nextafter]
// //     C --> D[Print result]
// //     D --> E[End]`,
// //         markdown: "This example demonstrates the basic usage of the `nextafter` function. It finds the next representable value after 3.14 in the direction of 3.15."
// //       },
// //       {
// //         title: "Edge Case",
// //         code: `#include <stdio.h>
// // #include <math.h>

// // int main() {
// //     double x = 1.0;
// //     double y = -INFINITY;
// //     double result = nextafter(x, y);
// //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// //     return 0;
// // }`,
// //         mermaid: `graph TD
// //     A[Start] --> B[Initialize x and y]
// //     B --> C[Call nextafter]
// //     C --> D[Print result]
// //     D --> E[End]`,
// //         markdown: "This example shows how `nextafter` behaves when moving towards negative infinity. It demonstrates the function's behavior in extreme cases."
// //       }
// //     ]
// //   };

// //   const renderExampleContent = (example) => (
// //     <div className={styles.exampleContent}>
// //       <div className={styles.upperRow}>
// //         <div className={styles.left}>
// //           <AceEditorComponent
// //             code={example.code}
// //             fontSize={12}
// //             mode={'c_cpp'}
// //             theme={'twilight'}
// //             onChange={() => {}}
// //             width="100%"
// //           />
// //         </div>
// //         <div className={styles.right}>
// //           <MermaidDiagram chartDefinition={example.mermaid} />
// //         </div>
// //       </div>
// //       <div className={styles.markdown}>
// //         <MarkdownComponent article={example.markdown} />
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <div className={styles.container}>
// //       <h1 className={styles.title}>{functionData.function_name}</h1>
      
// //       <div className={styles.outerTabContainer}>
// //         <button 
// //           className={`${styles.tabButton} ${activeOuterTab === 'description' ? styles.active : ''}`}
// //           onClick={() => setActiveOuterTab('description')}
// //         >
// //           Description
// //         </button>
// //         <button 
// //           className={`${styles.tabButton} ${activeOuterTab === 'details' ? styles.active : ''}`}
// //           onClick={() => setActiveOuterTab('details')}
// //         >
// //           Details
// //         </button>
// //         <button 
// //           className={`${styles.tabButton} ${activeOuterTab === 'examples' ? styles.active : ''}`}
// //           onClick={() => setActiveOuterTab('examples')}
// //         >
// //           Examples
// //         </button>
// //       </div>

// //       <div className={styles.content}>
// //         {activeOuterTab === 'description' && (
// //           <div>
// //             <h2>Description</h2>
// //             <p>{functionData.description}</p>
// //           </div>
// //         )}

// //         {activeOuterTab === 'details' && (
// //           <div>
// //             <h2>Details</h2>
// //             <ul>
// //               <li><strong>Include File:</strong> {functionData.include_file}</li>
// //               <li><strong>Return Type:</strong> {functionData.return_type}</li>
// //               <li><strong>Parameter Types:</strong> {functionData.parameter_types.join(', ')}</li>
// //               <li><strong>Main Category:</strong> {functionData.main_category}</li>
// //               <li><strong>Sub Category:</strong> {functionData.sub_category}</li>
// //               <li><strong>Data Type Manipulated:</strong> {functionData.data_type_manipulated}</li>
// //             </ul>
// //           </div>
// //         )}

// //         {activeOuterTab === 'examples' && (
// //           <div>
// //             <h2>Examples</h2>
// //             <div className={styles.innerTabContainer}>
// //               {functionData.examples.map((example, index) => (
// //                 <button 
// //                   key={index}
// //                   className={`${styles.tabButton} ${activeExampleTab === index ? styles.active : ''}`}
// //                   onClick={() => setActiveExampleTab(index)}
// //                 >
// //                   {example.title}
// //                 </button>
// //               ))}
// //             </div>
// //             {renderExampleContent(functionData.examples[activeExampleTab])}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default FunctionDetailsPage;
// // 'use client'
// // import React, { useState } from 'react';
// // import AceEditorComponent from '../ace-editor/AceEditorComponent';
// // import styles from './FunctionDetails.module.css';

// // const FunctionDetails = () => {
// //   const [activeOuterTab, setActiveOuterTab] = useState('description');
// //   const [activeExampleTab, setActiveExampleTab] = useState(0);

// //   // Hardcoded mock data
// //   const functionData = {
// //     function_name: "nextafter",
// //     include_file: "math.h",
// //     return_type: "double",
// //     parameter_types: ["double", "double"],
// //     main_category: "Mathematical Operations",
// //     sub_category: "Advanced Computation",
// //     data_type_manipulated: "floating-point numbers",
// //     description: "Returns the next representable value of the first argument in the direction of the second argument.",
// //     examples: [
// //       {
// //         title: "Basic Usage",
// //         code: `#include <stdio.h>
// // #include <math.h>

// // int main() {
// //     double x = 3.14;
// //     double y = 3.15;
// //     double result = nextafter(x, y);
// //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// //     return 0;
// // }`,
// //         explanation: "This example demonstrates the basic usage of the `nextafter` function. It finds the next representable value after 3.14 in the direction of 3.15. The function is called with two double parameters and returns a double value."
// //       },
// //       {
// //         title: "Edge Case",
// //         code: `#include <stdio.h>
// // #include <math.h>

// // int main() {
// //     double x = 1.0;
// //     double y = -INFINITY;
// //     double result = nextafter(x, y);
// //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// //     return 0;
// // }`,
// //         explanation: "This example shows how `nextafter` behaves when moving towards negative infinity. It demonstrates the function's behavior in extreme cases. Here, we're finding the next representable value after 1.0 in the direction of negative infinity."
// //       },
// //       {
// //         title: "Edge Case",
// //         code: `#include <stdio.h>
// // #include <math.h>

// // int main() {
// //     double x = 1.0;
// //     double y = -INFINITY;
// //     double result = nextafter(x, y);
// //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// //     return 0;
// // }`,
// //         explanation: "This example shows how `nextafter` behaves when moving towards negative infinity. It demonstrates the function's behavior in extreme cases. Here, we're finding the next representable value after 1.0 in the direction of negative infinity."
// //       },
// //       {
// //         title: "Edge Case",
// //         code: `#include <stdio.h>
// // #include <math.h>

// // int main() {
// //     double x = 1.0;
// //     double y = -INFINITY;
// //     double result = nextafter(x, y);
// //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// //     return 0;
// // }`,
// //         explanation: "This example shows how `nextafter` behaves when moving towards negative infinity. It demonstrates the function's behavior in extreme cases. Here, we're finding the next representable value after 1.0 in the direction of negative infinity."
// //       },
// //       {
// //         title: "Edge Case",
// //         code: `#include <stdio.h>
// // #include <math.h>

// // int main() {
// //     double x = 1.0;
// //     double y = -INFINITY;
// //     double result = nextafter(x, y);
// //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// //     return 0;
// // }`,
// //         explanation: "This example shows how `nextafter` behaves when moving towards negative infinity. It demonstrates the function's behavior in extreme cases. Here, we're finding the next representable value after 1.0 in the direction of negative infinity."
// //       },
// //       {
// //         title: "Edge Case",
// //         code: `#include <stdio.h>
// // #include <math.h>

// // int main() {
// //     double x = 1.0;
// //     double y = -INFINITY;
// //     double result = nextafter(x, y);
// //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// //     return 0;
// // }`,
// //         explanation: "This example shows how `nextafter` behaves when moving towards negative infinity. It demonstrates the function's behavior in extreme cases. Here, we're finding the next representable value after 1.0 in the direction of negative infinity."
// //       },
// //       {
// //         title: "Edge Case",
// //         code: `#include <stdio.h>
// // #include <math.h>

// // int main() {
// //     double x = 1.0;
// //     double y = -INFINITY;
// //     double result = nextafter(x, y);
// //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// //     return 0;
// // }`,
// //         explanation: "This example shows how `nextafter` behaves when moving towards negative infinity. It demonstrates the function's behavior in extreme cases. Here, we're finding the next representable value after 1.0 in the direction of negative infinity."
// //       },
// //       {
// //         title: "Edge Case",
// //         code: `#include <stdio.h>
// // #include <math.h>

// // int main() {
// //     double x = 1.0;
// //     double y = -INFINITY;
// //     double result = nextafter(x, y);
// //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// //     return 0;
// // }`,
// //         explanation: "This example shows how `nextafter` behaves when moving towards negative infinity. It demonstrates the function's behavior in extreme cases. Here, we're finding the next representable value after 1.0 in the direction of negative infinity."
// //       }
// //     ]
// //   };

// //   const renderExampleContent = (example) => (
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
// //         </div>
// //         <div className={styles.explanationContainer}>
// //           <h3>Explanation</h3>
// //           <p>{example.explanation}</p>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   // const renderExampleContent = (example) => (
// //   //   <div className={styles.exampleContent}>
// //   //     <div className={styles.codeExplanationContainer}>
// //   //       <div className={styles.codeContainer}>
// //   //         <AceEditorComponent
// //   //           code={example.code}
// //   //           fontSize={12}
// //   //           mode={'c_cpp'}
// //   //           theme={'twilight'}
// //   //           onChange={() => {}}
// //   //           width="100%"
// //   //         />
// //   //       </div>
// //   //       <div className={styles.explanationContainer}>
// //   //         <h3>Explanation</h3>
// //   //         <p>{example.explanation}</p>
// //   //       </div>
// //   //     </div>
// //   //   </div>
// //   // );

// //   // return (
// //   //   <div className={styles.container}>
// //   //     <h1 className={styles.title}>{functionData.function_name}</h1>
      
// //   //     <div className={styles.outerTabContainer}>
// //   //       <button 
// //   //         className={`${styles.tabButton} ${activeOuterTab === 'description' ? styles.active : ''}`}
// //   //         onClick={() => setActiveOuterTab('description')}
// //   //       >
// //   //         Description
// //   //       </button>
// //   //       <button 
// //   //         className={`${styles.tabButton} ${activeOuterTab === 'details' ? styles.active : ''}`}
// //   //         onClick={() => setActiveOuterTab('details')}
// //   //       >
// //   //         Details
// //   //       </button>
// //   //       <button 
// //   //         className={`${styles.tabButton} ${activeOuterTab === 'examples' ? styles.active : ''}`}
// //   //         onClick={() => setActiveOuterTab('examples')}
// //   //       >
// //   //         Examples
// //   //       </button>
// //   //     </div>

// //   //     <div className={styles.content}>
// //   //       {activeOuterTab === 'description' && (
// //   //         <div>
// //   //           <h2>Description</h2>
// //   //           <p>{functionData.description}</p>
// //   //         </div>
// //   //       )}

// //   //       {activeOuterTab === 'details' && (
// //   //         <div>
// //   //           <h2>Details</h2>
// //   //           <ul>
// //   //             <li><strong>Include File:</strong> {functionData.include_file}</li>
// //   //             <li><strong>Return Type:</strong> {functionData.return_type}</li>
// //   //             <li><strong>Parameter Types:</strong> {functionData.parameter_types.join(', ')}</li>
// //   //             <li><strong>Main Category:</strong> {functionData.main_category}</li>
// //   //             <li><strong>Sub Category:</strong> {functionData.sub_category}</li>
// //   //             <li><strong>Data Type Manipulated:</strong> {functionData.data_type_manipulated}</li>
// //   //           </ul>
// //   //         </div>
// //   //       )}

// //   //       {activeOuterTab === 'examples' && (
// //   //         <div>
// //   //           <h2>Examples</h2>
// //   //           <div className={styles.innerTabContainer}>
// //   //             {functionData.examples.map((example, index) => (
// //   //               <button 
// //   //                 key={index}
// //   //                 className={`${styles.tabButton} ${activeExampleTab === index ? styles.active : ''}`}
// //   //                 onClick={() => setActiveExampleTab(index)}
// //   //               >
// //   //                 {example.title}
// //   //               </button>
// //   //             ))}
// //   //           </div>
// //   //           {renderExampleContent(functionData.examples[activeExampleTab])}
// //   //         </div>
// //   //       )}
// //   //     </div>
// //   //   </div>
// //   // );

// //   return (
// //     <div className={styles.container}>
// //       <h1 className={styles.title}>{functionData.function_name}</h1>
      
// //       <div className={styles.outerTabContainer}>
// //         <button 
// //           className={`${styles.tabButton} ${activeOuterTab === 'description' ? styles.active : ''}`}
// //           onClick={() => setActiveOuterTab('description')}
// //         >
// //           Description
// //         </button>
// //         <button 
// //           className={`${styles.tabButton} ${activeOuterTab === 'details' ? styles.active : ''}`}
// //           onClick={() => setActiveOuterTab('details')}
// //         >
// //           Details
// //         </button>
// //         <button 
// //           className={`${styles.tabButton} ${activeOuterTab === 'examples' ? styles.active : ''}`}
// //           onClick={() => setActiveOuterTab('examples')}
// //         >
// //           Examples
// //         </button>
// //       </div>
  
// //       <div className={styles.content}>
// //         <div className={`${styles.tabContent} ${activeOuterTab === 'description' ? styles.active : ''}`}>
// //           <h2>Description</h2>
// //           <p>{functionData.description}</p>
// //         </div>
  
// //         <div className={`${styles.tabContent} ${activeOuterTab === 'details' ? styles.active : ''}`}>
// //           <h2>Details</h2>
// //           <ul>
// //             <li><strong>Include File:</strong> {functionData.include_file}</li>
// //             <li><strong>Return Type:</strong> {functionData.return_type}</li>
// //             <li><strong>Parameter Types:</strong> {functionData.parameter_types.join(', ')}</li>
// //             <li><strong>Main Category:</strong> {functionData.main_category}</li>
// //             <li><strong>Sub Category:</strong> {functionData.sub_category}</li>
// //             <li><strong>Data Type Manipulated:</strong> {functionData.data_type_manipulated}</li>
// //           </ul>
// //         </div>
  
// //         <div className={`${styles.tabContent} ${activeOuterTab === 'examples' ? styles.active : ''}`}>
// //           <h2>Examples</h2>
// //           <div className={styles.innerTabContainer}>
// //             {functionData.examples.map((example, index) => (
// //               <button 
// //                 key={index}
// //                 className={`${styles.tabButton} ${activeExampleTab === index ? styles.active : ''}`}
// //                 onClick={() => setActiveExampleTab(index)}
// //               >
// //                 {example.title}
// //               </button>
// //             ))}
// //           </div>
// //           {renderExampleContent(functionData.examples[activeExampleTab])}
// //         </div>
// //       </div>
// //     </div>
// //   );

// // };

// // export default FunctionDetails;
// // 'use client'
// // import React, { useState, useRef } from 'react';
// // import AceEditorComponent from '../ace-editor/AceEditorComponent';
// // import styles from './FunctionDetails.module.css';

// // const FunctionDetails = () => {
// //   const [activeOuterTab, setActiveOuterTab] = useState('description');
// //   const [activeExampleTab, setActiveExampleTab] = useState(0);

// //   const descriptionRef = useRef(null);
// //   const detailsRef = useRef(null);
// //   const examplesRef = useRef(null);

// //   // Hardcoded mock data
// //   const functionData = {
// //     function_name: "nextafter",
// //     include_file: "math.h",
// //     return_type: "double",
// //     parameter_types: ["double", "double"],
// //     main_category: "Mathematical Operations",
// //     sub_category: "Advanced Computation",
// //     data_type_manipulated: "floating-point numbers",
// //     description: "Returns the next representable value of the first argument in the direction of the second argument.",
// //     examples: [
// //       {
// //         title: "Basic Usage",
// //         code: `#include <stdio.h>
// // #include <math.h>

// // int main() {
// //     double x = 3.14;
// //     double y = 3.15;
// //     double result = nextafter(x, y);
// //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// //     return 0;
// // }`,
// //         explanation: "This example demonstrates the basic usage of the `nextafter` function. It finds the next representable value after 3.14 in the direction of 3.15. The function is called with two double parameters and returns a double value."
// //       },
// //       {
// //         title: "Edge Case",
// //         code: `#include <stdio.h>
// // #include <math.h>

// // int main() {
// //     double x = 1.0;
// //     double y = -INFINITY;
// //     double result = nextafter(x, y);
// //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// //     return 0;
// // }`,
// //         explanation: "This example shows how `nextafter` behaves when moving towards negative infinity. It demonstrates the function's behavior in extreme cases. Here, we're finding the next representable value after 1.0 in the direction of negative infinity."
// //       },
// //       // ... (other examples remain the same)
// //     ]
// //   };

// //   const renderExampleContent = (example) => (
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
// //         </div>
// //         <div className={styles.explanationContainer}>
// //           <h3>Explanation</h3>
// //           <p>{example.explanation}</p>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   const scrollToContent = (ref) => {
// //     if (ref && ref.current) {
// //       const yOffset = -150; // 30px from the top
// //       const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;

// //       window.scrollTo({top: y, behavior: 'smooth'});
// //     }
// //   };

// //   const handleTabClick = (tab) => {
// //     setActiveOuterTab(tab);
// //     switch(tab) {
// //       case 'description':
// //         scrollToContent(descriptionRef);
// //         break;
// //       case 'details':
// //         scrollToContent(detailsRef);
// //         break;
// //       case 'examples':
// //         scrollToContent(examplesRef);
// //         break;
// //     }
// //   };

// //   return (
// //     <div className={styles.container}>
// //       <h1 className={styles.title}>{functionData.function_name}</h1>
      
// //       <div className={styles.outerTabContainer}>
// //         <button 
// //           className={`${styles.tabButton} ${activeOuterTab === 'description' ? styles.active : ''}`}
// //           onClick={() => handleTabClick('description')}
// //         >
// //           Description
// //         </button>
// //         <button 
// //           className={`${styles.tabButton} ${activeOuterTab === 'details' ? styles.active : ''}`}
// //           onClick={() => handleTabClick('details')}
// //         >
// //           Details
// //         </button>
// //         <button 
// //           className={`${styles.tabButton} ${activeOuterTab === 'examples' ? styles.active : ''}`}
// //           onClick={() => handleTabClick('examples')}
// //         >
// //           Examples
// //         </button>
// //       </div>
  
// //       <div className={styles.content}>
// //         <div ref={descriptionRef} className={`${styles.tabContent} ${activeOuterTab === 'description' ? styles.active : ''}`}>
// //           <h2>Description</h2>
// //           <p>{functionData.description}</p>
// //         </div>
  
// //         <div ref={detailsRef} className={`${styles.tabContent} ${activeOuterTab === 'details' ? styles.active : ''}`}>
// //           <h2>Details</h2>
// //           <ul>
// //             <li><strong>Include File:</strong> {functionData.include_file}</li>
// //             <li><strong>Return Type:</strong> {functionData.return_type}</li>
// //             <li><strong>Parameter Types:</strong> {functionData.parameter_types.join(', ')}</li>
// //             <li><strong>Main Category:</strong> {functionData.main_category}</li>
// //             <li><strong>Sub Category:</strong> {functionData.sub_category}</li>
// //             <li><strong>Data Type Manipulated:</strong> {functionData.data_type_manipulated}</li>
// //           </ul>
// //         </div>
  
// //         <div ref={examplesRef} className={`${styles.tabContent} ${activeOuterTab === 'examples' ? styles.active : ''}`}>
// //           <h2>Examples</h2>
// //           <div className={styles.innerTabContainer}>
// //             {functionData.examples.map((example, index) => (
// //               <button 
// //                 key={index}
// //                 className={`${styles.tabButton} ${activeExampleTab === index ? styles.active : ''}`}
// //                 onClick={() => setActiveExampleTab(index)}
// //               >
// //                 {example.title}
// //               </button>
// //             ))}
// //           </div>
// //           {renderExampleContent(functionData.examples[activeExampleTab])}
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

// const FunctionDetails = () => {
//   const [activeOuterTab, setActiveOuterTab] = useState('description');
//   const [activeExampleTab, setActiveExampleTab] = useState(0);
//   const [codeOutput, setCodeOutput] = useState('');
//   const [isRunning, setIsRunning] = useState(false);

//   const descriptionRef = useRef(null);
//   const detailsRef = useRef(null);
//   const examplesRef = useRef(null);

//   // Hardcoded mock data
// //   const functionData = {
// //     function_name: "nextafter",
// //     include_file: "math.h",
// //     return_type: "double",
// //     parameter_types: ["double", "double"],
// //     main_category: "Mathematical Operations",
// //     sub_category: "Advanced Computation",
// //     data_type_manipulated: "floating-point numbers",
// //     description: "Returns the next representable value of the first argument in the direction of the second argument.",
// //     examples: [
// //       {
// //         title: "Basic Usage",
// //         code: `#include <stdio.h>
// // #include <math.h>

// // int main() {
// //     double x = 3.14;
// //     double y = 3.15;
// //     double result = nextafter(x, y);
// //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// //     return 0;
// // }`,
// //         explanation: "This example demonstrates the basic usage of the `nextafter` function. It finds the next representable value after 3.14 in the direction of 3.15. The function is called with two double parameters and returns a double value.",
// //         expectedOutput: "Next representable value after 3.140000 towards 3.150000 is 3.140000000000000124"
// //       },
// //       {
// //         title: "Edge Case",
// //         code: `#include <stdio.h>
// // #include <math.h>

// // int main() {
// //     double x = 1.0;
// //     double y = -INFINITY;
// //     double result = nextafter(x, y);
// //     printf("Next representable value after %f towards %f is %f\\n", x, y, result);
// //     return 0;
// // }`,
// //         explanation: "This example shows how `nextafter` behaves when moving towards negative infinity. It demonstrates the function's behavior in extreme cases. Here, we're finding the next representable value after 1.0 in the direction of negative infinity.",
// //         expectedOutput: "Next representable value after 1.000000 towards -inf is 0.999999999999999889"
// //       },
// //     ]
// //   };

//   // const functionData={
//   //   "function_name": "abort",
//   //   "include_file": "stdlib.h",
//   //   "return_type": "void",
//   //   "parameter_types": [],
//   //   "main_category": "Error Handling and Debugging",
//   //   "sub_category": "Process Termination",
//   //   "data_type_manipulated": "none",
//   //   "description": "Causes abnormal program termination.",
//   //   "return_value": "This function does not return any value as it terminates the program.",
//   //   "parameter_values": [],
//   //   "function_prototype": "void abort(void);",
//   //   "examples": [
//   //     {
//   //       "title": "Basic Usage",
//   //       "code": `#include <stdio.h>
//   // #include <stdlib.h>
  
//   // int main() {
//   //     printf("Program starting...\n");
//   //     abort();
//   //     printf("This line will never be executed.\n");
//   //     return 0;
//   // }`,
//   //       "explanation": "This example demonstrates the basic usage of the `abort` function. It immediately terminates the program, and any code after the `abort()` call is not executed.",
//   //       "expectedOutput": "Program starting...\nAborted (core dumped)"
//   //     },
//   //     {
//   //       "title": "Using abort in error handling",
//   //       "code": `#include <stdio.h>
//   // #include <stdlib.h>
  
//   // int divide(int a, int b) {
//   //     if (b == 0) {
//   //         fprintf(stderr, "Error: Division by zero!\n");
//   //         abort();
//   //     }
//   //     return a / b;
//   // }
  
//   // int main() {
//   //     printf("10 / 2 = %d\n", divide(10, 2));
//   //     printf("10 / 0 = %d\n", divide(10, 0));
//   //     printf("This line will never be executed.\n");
//   //     return 0;
//   // }`,
//   //       "explanation": "This example shows how `abort` can be used in error handling. When a division by zero is attempted, the program prints an error message and then terminates using `abort`.",
//   //       "expectedOutput": "10 / 2 = 5\nError: Division by zero!\nAborted (core dumped)"
//   //     },
//   //     {
//   //       "title": "abort vs exit",
//   //       "code": `#include <stdio.h>
//   // #include <stdlib.h>
  
//   // void cleanup() {
//   //     printf("Cleanup function called.\n");
//   // }
  
//   // int main() {
//   //     atexit(cleanup);
      
//   //     printf("Program starting...\n");
//   //     printf("Calling abort...\n");
//   //     abort();
      
//   //     printf("This line will never be executed.\n");
//   //     return 0;
//   // }`,
//   //       "explanation": "This example demonstrates the difference between `abort` and `exit`. Even though a cleanup function is registered with `atexit`, it is not called when `abort` is used to terminate the program.",
//   //       "expectedOutput": "Program starting...\nCalling abort...\nAborted (core dumped)"
//   //     }
//   //   ]
//   // }

// const functionData={
//   "function_name": "abort",
//   "include_file": "stdlib.h",
//   "return_type": "void",
//   "parameter_types": [],
//   "main_category": "Error Handling and Debugging",
//   "sub_category": "Process Termination",
//   "data_type_manipulated": "none",
//   "description": "Causes abnormal program termination.",
//   "extended_description": "The abort function raises the SIGABRT signal, which by default causes the program to terminate abnormally. This function is typically used to handle critical errors where normal program flow cannot continue. It does not perform any clean-up operations or buffer flushing. After calling abort, control never returns to the calling program.",
//   "return_value": "This function does not return as it terminates the program.",
//   "parameter_values": "This function takes no parameters. It can be called without any arguments to immediately terminate the program.",
//   "function_prototype": "void abort(void);",
//   "examples": [
//     {
//       "title": "Basic Usage",
//       "code": `#include <stdio.h>
// #include <stdlib.h>

// int main() {
//     printf("Program starting...\n");
//     abort();
//     printf("This line will never be executed.\n");
//     return 0;
// }`,
//       "explanation": "This example demonstrates the basic usage of the `abort` function. It immediately terminates the program, and any code after the `abort()` call is not executed.",
//       "expectedOutput": "Program starting...\nAborted (core dumped)"
//     },
//     {
//       "title": "Using abort in error handling",
//       "code": `#include <stdio.h>
// #include <stdlib.h>

// int divide(int a, int b) {
//     if (b == 0) {
//         fprintf(stderr, "Error: Division by zero!\n");
//         abort();
//     }
//     return a / b;
// }

// int main() {
//     printf("10 / 2 = %d\n", divide(10, 2));
//     printf("10 / 0 = %d\n", divide(10, 0));
//     printf("This line will never be executed.\n");
//     return 0;
// }`,
//       "explanation": "This example shows how `abort` can be used in error handling. When a division by zero is attempted, the program prints an error message and then terminates using `abort`.",
//       "expectedOutput": "10 / 2 = 5\nError: Division by zero!\nAborted (core dumped)"
//     },
//     {
//       "title": "abort vs exit",
//       "code": `#include <stdio.h>
// #include <stdlib.h>

// void cleanup() {
//     printf("Cleanup function called.\n");
// }

// int main() {
//     atexit(cleanup);
    
//     printf("Program starting...\n");
//     printf("Calling abort...\n");
//     abort();
    
//     printf("This line will never be executed.\n");
//     return 0;
// }`,
//       "explanation": "This example demonstrates the difference between `abort` and `exit`. Even though a cleanup function is registered with `atexit`, it is not called when `abort` is used to terminate the program.",
//       "expectedOutput": "Program starting...\nCalling abort...\nAborted (core dumped)"
//     }
//   ]
// }

//   const simulateCodeExecution = (exampleIndex) => {
//     setIsRunning(true);
//     setCodeOutput('Compiling and running...');
    
//     // Simulate a delay to mimic compilation and execution
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
//           <h3>Explanation</h3>
//           <p>{example.explanation}</p>
//           {/* <h3>Output</h3>
//           <pre className={styles.outputBox}>{codeOutput}</pre> */}
//         </div>
//       </div>
//     </div>
//   );

//   const scrollToContent = (ref) => {
//     if (ref && ref.current) {
//       const yOffset = -150; // 150px from the top
//       const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;

//       window.scrollTo({top: y, behavior: 'smooth'});
//     }
//   };

//   const handleTabClick = (tab) => {
//     setActiveOuterTab(tab);
//     switch(tab) {
//       case 'description':
//         scrollToContent(descriptionRef);
//         break;
//       case 'details':
//         scrollToContent(detailsRef);
//         break;
//       case 'examples':
//         scrollToContent(examplesRef);
//         break;
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>{functionData.function_name}</h1>
      
//       <div className={styles.outerTabContainer}>
//         <button 
//           className={`${styles.tabButton} ${activeOuterTab === 'description' ? styles.active : ''}`}
//           onClick={() => handleTabClick('description')}
//         >
//           Description
//         </button>
//         <button 
//           className={`${styles.tabButton} ${activeOuterTab === 'details' ? styles.active : ''}`}
//           onClick={() => handleTabClick('details')}
//         >
//           Details
//         </button>
//         <button 
//           className={`${styles.tabButton} ${activeOuterTab === 'examples' ? styles.active : ''}`}
//           onClick={() => handleTabClick('examples')}
//         >
//           Examples
//         </button>
//       </div>
  
//       <div className={styles.content}>
//         <div ref={descriptionRef} className={`${styles.tabContent} ${activeOuterTab === 'description' ? styles.active : ''}`}>
//           <h2>Description</h2>
//           <p>{functionData.description}</p>
//         </div>
  
//         <div ref={detailsRef} className={`${styles.tabContent} ${activeOuterTab === 'details' ? styles.active : ''}`}>
//           <h2>Details</h2>
//           <ul>
//             <li><strong>Include File:</strong> {functionData.include_file}</li>
//             <li><strong>Return Type:</strong> {functionData.return_type}</li>
//             <li><strong>Parameter Types:</strong> {functionData.parameter_types.join(', ')}</li>
//             <li><strong>Main Category:</strong> {functionData.main_category}</li>
//             <li><strong>Sub Category:</strong> {functionData.sub_category}</li>
//             <li><strong>Data Type Manipulated:</strong> {functionData.data_type_manipulated}</li>
//           </ul>
//         </div>
  
//         <div ref={examplesRef} className={`${styles.tabContent} ${activeOuterTab === 'examples' ? styles.active : ''}`}>
//           <h2>Examples</h2>
//           <div className={styles.innerTabContainer}>
//             {functionData.examples.map((example, index) => (
//               <button 
//                 key={index}
//                 className={`${styles.tabButton} ${activeExampleTab === index ? styles.active : ''}`}
//                 onClick={() => {
//                   setActiveExampleTab(index);
//                   setCodeOutput('');  // Clear previous output when changing examples
//                 }}
//               >
//                 {example.title}
//               </button>
//             ))}
//           </div>
//           {renderExampleContent(functionData.examples[activeExampleTab], activeExampleTab)}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FunctionDetails;
'use client'
import React, { useState, useRef } from 'react';
import AceEditorComponent from '../ace-editor/AceEditorComponent';
import styles from './FunctionDetails.module.css';
import Link from 'next/link';
///import functionsD from '../../api/db/developement/c/functions_new.json'

const FunctionDetails = ({functionData}) => {
  const [activeTab, setActiveTab] = useState('description');
  const [activeExampleTab, setActiveExampleTab] = useState(0);
  const [codeOutput, setCodeOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const tabRefs = {
    description: useRef(null),
    prototype: useRef(null),
    parameters: useRef(null),
    return: useRef(null),
    examples: useRef(null),
  };

  // Updated mock data based on the new structure
//   const functionData = {
//     function_name: "abort",
//     include_file: "stdlib.h",
//     return_type: "void",
//     parameter_types: [],
//     main_category: "Error Handling and Debugging",
//     sub_category: "Process Termination",
//     data_type_manipulated: "none",
//     description: "Causes abnormal program termination.",
//     extended_description: "The abort function raises the SIGABRT signal, which by default causes the program to terminate abnormally. This function is typically used to handle critical errors where normal program flow cannot continue. It does not perform any clean-up operations or buffer flushing. After calling abort, control never returns to the calling program.",
//     return_value: "This function does not return as it terminates the program.",
//     parameter_values: "This function takes no parameters. It can be called without any arguments to immediately terminate the program.",
//     function_prototype: "void abort(void);",

//    "examples": [
//     {
//       "title": "Basic Usage",
//       "code": `#include <stdio.h>
// #include <stdlib.h>

// int main() {
//     printf("Program starting...\n");
//     abort();
//     printf("This line will never be executed.\n");
//     return 0;
// }`,
//       "explanation": "This example demonstrates the basic usage of the `abort` function. It immediately terminates the program, and any code after the `abort()` call is not executed.",
//       "expectedOutput": "Program starting...\nAborted (core dumped)"
//     },
//     {
//       "title": "Using abort in error handling",
//       "code": `#include <stdio.h>
// #include <stdlib.h>

// int divide(int a, int b) {
//     if (b == 0) {
//         fprintf(stderr, "Error: Division by zero!\n");
//         abort();
//     }
//     return a / b;
// }

// int main() {
//     printf("10 / 2 = %d\n", divide(10, 2));
//     printf("10 / 0 = %d\n", divide(10, 0));
//     printf("This line will never be executed.\n");
//     return 0;
// }`,
//       "explanation": "This example shows how `abort` can be used in error handling. When a division by zero is attempted, the program prints an error message and then terminates using `abort`.",
//       "expectedOutput": "10 / 2 = 5\nError: Division by zero!\nAborted (core dumped)"
//     },
//     {
//       "title": "abort vs exit",
//       "code": `#include <stdio.h>
// #include <stdlib.h>

// void cleanup() {
//     printf("Cleanup function called.\n");
// }

// int main() {
//     atexit(cleanup);
    
//     printf("Program starting...\n");
//     printf("Calling abort...\n");
//     abort();
    
//     printf("This line will never be executed.\n");
//     return 0;
// }`,
//       "explanation": "This example demonstrates the difference between `abort` and `exit`. Even though a cleanup function is registered with `atexit`, it is not called when `abort` is used to terminate the program.",
//       "expectedOutput": "Program starting...\nCalling abort...\nAborted (core dumped)"
//     }
//   ]  


// };

//const functionData=functionsD[3]

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
          <h3>Explanation</h3>
          <p>{example.explanation}</p>
          {/* <h3>Output</h3>
          <pre className={styles.outputBox}>{codeOutput}</pre> */}
        </div>
      </div>
    </div>
  );

  const scrollToContent = (ref) => {
    if (ref && ref.current) {
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
      {/* <h1 className={styles.title}>{functionData.function_name}</h1> */}
      
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
          <br></br>
          <p>{functionData.extended_description}</p>
          <br></br>
          {functionData.link&&<Link href={`${functionData.link}`}>Read More</Link>}
        </div>

        <div ref={tabRefs.prototype} className={`${styles.tabContent} ${activeTab === 'prototype' ? styles.active : ''}`}>
          <h2>Function Prototype</h2>
          <br></br>
          <pre className={styles.prototypeBox}>{functionData.function_prototype}</pre>
        </div>

        <div ref={tabRefs.parameters} className={`${styles.tabContent} ${activeTab === 'parameters' ? styles.active : ''}`}>
          <h2>Parameters</h2>
          <br></br>
          <p>{functionData.parameter_values}</p>
          <br></br>
          <h3>Parameter Types</h3>
          <br></br>
          <p>{functionData.parameter_types?.length > 0 ? functionData.parameter_types.join(', ') : 'None'}</p>
        </div>

        <div ref={tabRefs.return} className={`${styles.tabContent} ${activeTab === 'return' ? styles.active : ''}`}>
          <h2>Return</h2>
          <br></br>
          <p>{functionData.return_value}</p>
          <br></br>
          <h3>Return Type</h3>
          <br></br>
          <p>{functionData.return_type}</p>
        </div>
  
        <div ref={tabRefs.examples} className={`${styles.tabContent} ${activeTab === 'examples' ? styles.active : ''}`}>
          {/* <h2>Examples</h2> */}
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
          {/* {renderExampleContent(functionData?.examples[activeExampleTab], activeExampleTab)} */}
          {functionData?.examples?.length > 0 ?
          renderExampleContent(functionData.examples[activeExampleTab], activeExampleTab) :
          <p>No examples found.</p>
        }
        </div>
      </div>
    </div>
  );
};

export default FunctionDetails;