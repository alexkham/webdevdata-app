// // // // // // // import React, { useState } from 'react';
// // // // // // // import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// // // // // // // import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
// // // // // // // import { Copy, Check } from 'lucide-react';

// // // // // // // const SQLCodeWidget = ({ data }) => {
// // // // // // //   const [copied, setCopied] = useState(false);

// // // // // // //   const handleCopy = () => {
// // // // // // //     navigator.clipboard.writeText(data.code);
// // // // // // //     setCopied(true);
// // // // // // //     setTimeout(() => setCopied(false), 2000);
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div className="max-w-2xl mx-auto my-8">
// // // // // // //       <div className="bg-gray-800 rounded-t-lg p-4 flex justify-between items-center">
// // // // // // //         <h3 className="text-white font-semibold">{data.title}</h3>
// // // // // // //         <button
// // // // // // //           onClick={handleCopy}
// // // // // // //           className="text-white hover:text-gray-300 focus:outline-none"
// // // // // // //           aria-label="Copy code"
// // // // // // //         >
// // // // // // //           {copied ? (
// // // // // // //             <Check className="w-5 h-5 text-green-500" />
// // // // // // //           ) : (
// // // // // // //             <Copy className="w-5 h-5" />
// // // // // // //           )}
// // // // // // //         </button>
// // // // // // //       </div>
// // // // // // //       <SyntaxHighlighter
// // // // // // //         language="sql"
// // // // // // //         style={tomorrow}
// // // // // // //         customStyle={{
// // // // // // //           margin: 0,
// // // // // // //           borderTopLeftRadius: 0,
// // // // // // //           borderTopRightRadius: 0,
// // // // // // //           borderBottomLeftRadius: '0.5rem',
// // // // // // //           borderBottomRightRadius: '0.5rem',
// // // // // // //         }}
// // // // // // //       >
// // // // // // //         {data.code}
// // // // // // //       </SyntaxHighlighter>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default SQLCodeWidget;
// // // // // // import React, { useState } from 'react';
// // // // // // import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// // // // // // import * as themes from 'react-syntax-highlighter/dist/cjs/styles/prism';
// // // // // // import { Copy, Check } from 'lucide-react';
// // // // // // import styles from './SQLCodeWidget.module.css';

// // // // // // const SQLCodeWidget = ({ 
// // // // // //   data, 
// // // // // //   theme = 'tomorrow', 
// // // // // //   showLineNumbers = true,
// // // // // //   maxHeight = '400px',
// // // // // //   backgroundColor = '#f5f5f5',
// // // // // //   textColor = '#333'
// // // // // // }) => {
// // // // // //   const [copied, setCopied] = useState(false);

// // // // // //   const handleCopy = () => {
// // // // // //     navigator.clipboard.writeText(data.code);
// // // // // //     setCopied(true);
// // // // // //     setTimeout(() => setCopied(false), 2000);
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className={styles.widget} style={{ backgroundColor }}>
// // // // // //       <div className={styles.header} style={{ backgroundColor, color: textColor }}>
// // // // // //         <h3 className={styles.title}>{data.title}</h3>
// // // // // //         <button
// // // // // //           onClick={handleCopy}
// // // // // //           className={styles.copyButton}
// // // // // //         >
// // // // // //           {copied ? (
// // // // // //             <>
// // // // // //               <Check className={styles.icon} />
// // // // // //               Copied!
// // // // // //             </>
// // // // // //           ) : (
// // // // // //             <>
// // // // // //               <Copy className={styles.icon} />
// // // // // //               Copy
// // // // // //             </>
// // // // // //           )}
// // // // // //         </button>
// // // // // //       </div>
// // // // // //       <div className={styles.codeContainer} style={{ maxHeight }}>
// // // // // //         <SyntaxHighlighter
// // // // // //           language="sql"
// // // // // //           style={themes[theme]}
// // // // // //           showLineNumbers={showLineNumbers}
// // // // // //           wrapLines={true}
// // // // // //           customStyle={{
// // // // // //             margin: 0,
// // // // // //             padding: '1rem',
// // // // // //             backgroundColor: 'transparent',
// // // // // //           }}
// // // // // //         >
// // // // // //           {data.code}
// // // // // //         </SyntaxHighlighter>
// // // // // //       </div>
// // // // // //       {data.explanation && (
// // // // // //         <div className={styles.explanation} style={{ backgroundColor, color: textColor }}>
// // // // // //           <h4 className={styles.explanationTitle}>Explanation:</h4>
// // // // // //           <p>{data.explanation}</p>
// // // // // //         </div>
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default SQLCodeWidget;
// // // // // import React, { useState } from 'react';
// // // // // import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// // // // // import * as themes from 'react-syntax-highlighter/dist/cjs/styles/prism';
// // // // // import { Copy, Check } from 'lucide-react';
// // // // // import styles from './SQLCodeWidget.module.css';

// // // // // const SQLCodeWidget = ({ 
// // // // //   data, 
// // // // //   theme = 'tomorrow', 
// // // // //   showLineNumbers = true,
// // // // //   backgroundColor = '#f5f5f5',
// // // // //   textColor = '#333'
// // // // // }) => {
// // // // //   const [copied, setCopied] = useState(false);

// // // // //   const handleCopy = () => {
// // // // //     navigator.clipboard.writeText(data.code);
// // // // //     setCopied(true);
// // // // //     setTimeout(() => setCopied(false), 2000);
// // // // //   };

// // // // //   return (
// // // // //     <div className={styles.widget} style={{ backgroundColor }}>
// // // // //       <div className={styles.header} style={{ backgroundColor, color: textColor }}>
// // // // //         <h3 className={styles.title}>{data.title}</h3>
// // // // //         <button
// // // // //           onClick={handleCopy}
// // // // //           className={styles.copyButton}
// // // // //         >
// // // // //           {copied ? (
// // // // //             <>
// // // // //               <Check className={styles.icon} />
// // // // //               Copied!
// // // // //             </>
// // // // //           ) : (
// // // // //             <>
// // // // //               <Copy className={styles.icon} />
// // // // //               Copy
// // // // //             </>
// // // // //           )}
// // // // //         </button>
// // // // //       </div>
// // // // //       <div className={styles.codeContainer}>
// // // // //         <SyntaxHighlighter
// // // // //           language="sql"
// // // // //           style={themes[theme]}
// // // // //           showLineNumbers={showLineNumbers}
// // // // //           wrapLines={true}
// // // // //           customStyle={{
// // // // //             margin: 0,
// // // // //             padding: '1rem',
// // // // //             backgroundColor: 'transparent',
// // // // //             whiteSpace: 'pre-wrap',
// // // // //             wordBreak: 'break-word',
// // // // //           }}
// // // // //         >
// // // // //           {data.code}
// // // // //         </SyntaxHighlighter>
// // // // //       </div>
// // // // //       {data.explanation && (
// // // // //         <div className={styles.explanation} style={{ backgroundColor, color: textColor }}>
// // // // //           <h4 className={styles.explanationTitle}>Explanation:</h4>
// // // // //           <p>{data.explanation}</p>
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default SQLCodeWidget;
// // // // import React, { useState } from 'react';
// // // // import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// // // // import * as themes from 'react-syntax-highlighter/dist/cjs/styles/prism';
// // // // import { Copy, Check } from 'lucide-react';
// // // // import styles from './SQLCodeWidget.module.css';
// // // // import prismThemes from './themes';

// // // // const SQLCodeWidget = ({ 
// // // //   data, 
// // // //   theme = 'tomorrow', 
// // // //   showLineNumbers = true,
// // // //   backgroundColor = '#f5f5f5',
// // // //   textColor = '#333'
// // // // }) => {
// // // //   const [copied, setCopied] = useState(false);

// // // //   const handleCopy = () => {
// // // //     navigator.clipboard.writeText(data.code);
// // // //     setCopied(true);
// // // //     setTimeout(() => setCopied(false), 2000);
// // // //   };

// // // //   // Ensure each major SQL clause is on its own line
// // // //   const formattedCode = data.code.replace(/\s*(SELECT|FROM|WHERE|ORDER BY|LIMIT)\s*/g, '\n$1 ').trim();

// // // //   return (
// // // //     <div className={styles.widget} style={{ backgroundColor }}>
// // // //       <div className={styles.header} style={{ backgroundColor, color: textColor }}>
// // // //         <h3 className={styles.title}>{data.title}</h3>
// // // //         <button
// // // //           onClick={handleCopy}
// // // //           className={styles.copyButton}
// // // //         >
// // // //           {copied ? (
// // // //             <>
// // // //               <Check className={styles.icon} />
// // // //               Copied!
// // // //             </>
// // // //           ) : (
// // // //             <>
// // // //               <Copy className={styles.icon} />
// // // //               Copy
// // // //             </>
// // // //           )}
// // // //         </button>
// // // //       </div>
// // // //       <div className={styles.codeContainer}>
// // // //         <SyntaxHighlighter
// // // //           language="sql"
// // // //           style={themes[theme]}
// // // //           showLineNumbers={showLineNumbers}
// // // //           wrapLines={true}
// // // //           customStyle={{
// // // //             margin: 0,
// // // //             padding: '1rem',
// // // //             backgroundColor: 'transparent',
// // // //           }}
// // // //         >
// // // //           {formattedCode}
// // // //         </SyntaxHighlighter>
// // // //       </div>
// // // //       {data.explanation && (
// // // //         <div className={styles.explanation} style={{ backgroundColor, color: textColor }}>
// // // //           <h4 className={styles.explanationTitle}>Explanation:</h4>
// // // //           <p>{data.explanation}</p>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default SQLCodeWidget;

// // // import React, { useState } from 'react';
// // // import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// // // import * as themes from 'react-syntax-highlighter/dist/cjs/styles/prism';
// // // import { Copy, Check } from 'lucide-react';
// // // import styles from './SQLCodeWidget.module.css';
// // // import prismThemes from './themes';

// // // const SQLCodeWidget = ({ 
// // //   data, 
// // //   theme = 'tomorrow', 
// // //   showLineNumbers = true,
// // //   backgroundColor = '#f5f5f5',
// // //   textColor = '#333',
// // //   showTitle = true
// // // }) => {
// // //   const [copied, setCopied] = useState(false);

// // //   const handleCopy = () => {
// // //     navigator.clipboard.writeText(data.code);
// // //     setCopied(true);
// // //     setTimeout(() => setCopied(false), 2000);
// // //   };

// // //   const validTheme = prismThemes[theme] || prismThemes.tomorrow;
// // //   const formattedCode = data.code.replace(/\s*(SELECT|FROM|WHERE|ORDER BY|LIMIT)\s*/g, '\n$1 ').trim();

// // //   return (
// // //     <div className={styles.widget} style={{ backgroundColor }}>
// // //       {showTitle && data.title && (
// // //         <div className={styles.header} style={{ backgroundColor, color: textColor }}>
// // //           <h3 className={styles.title}>{data.title}</h3>
// // //         </div>
// // //       )}
// // //       <div className={styles.contentWrapper}>
// // //         <div className={styles.codeWrapper}>
// // //           <div className={styles.codeHeader}>
// // //             <button
// // //               onClick={handleCopy}
// // //               className={styles.copyButton}
// // //             >
// // //               {copied ? (
// // //                 <>
// // //                   <Check className={styles.icon} />
// // //                   Copied!
// // //                 </>
// // //               ) : (
// // //                 <>
// // //                   <Copy className={styles.icon} />
// // //                   Copy
// // //                 </>
// // //               )}
// // //             </button>
// // //           </div>
// // //           <div className={styles.codeContainer}>
// // //             <SyntaxHighlighter
// // //               language="sql"
// // //               style={themes[validTheme]}
// // //               showLineNumbers={showLineNumbers}
// // //               wrapLines={true}
// // //               customStyle={{
// // //                 margin: 0,
// // //                 padding: '1rem',
// // //                 backgroundColor: 'transparent',
// // //               }}
// // //             >
// // //               {formattedCode}
// // //             </SyntaxHighlighter>
// // //           </div>
// // //         </div>
// // //         {data.explanation && (
// // //           <div className={styles.explanation} style={{ backgroundColor, color: textColor }}>
// // //             <h4 className={styles.explanationTitle}>Explanation:</h4>
// // //             <p>{data.explanation}</p>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default SQLCodeWidget;
// // import React, { useState } from 'react';
// // import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// // import * as themes from 'react-syntax-highlighter/dist/cjs/styles/prism';
// // import { Copy, Check } from 'lucide-react';
// // import styles from './SQLCodeWidget.module.css';
// // import prismThemes from './themes';

// // const SQLCodeWidget = ({ 
// //   data, 
// //   theme = 'tomorrow', 
// //   showLineNumbers = true,
// //   backgroundColor = '#f5f5f5',
// //   textColor = '#333',
// //   showTitle = true
// // }) => {
// //   const [copied, setCopied] = useState(false);

// //   const handleCopy = () => {
// //     navigator.clipboard.writeText(data.code);
// //     setCopied(true);
// //     setTimeout(() => setCopied(false), 2000);
// //   };

// //   const validTheme = prismThemes[theme] || prismThemes.tomorrow;
// //   const formattedCode = data.code.replace(/\s*(SELECT|FROM|WHERE|ORDER BY|LIMIT)\s*/g, '\n$1 ').trim();

// //   return (
// //     <div className={styles.widget} style={{ backgroundColor }}>
// //       {showTitle && data.title && (
// //         <div className={styles.header} style={{ backgroundColor, color: textColor }}>
// //           <h3 className={styles.title}>{data.title}</h3>
// //         </div>
// //       )}
// //       <div className={`${styles.contentWrapper} ${!data.explanation ? styles.fullWidth : ''}`}>
// //         <div className={`${styles.codeWrapper} ${!data.explanation ? styles.fullWidth : ''}`}>
// //           <div className={styles.codeHeader}>
// //             <button
// //               onClick={handleCopy}
// //               className={styles.copyButton}
// //             >
// //               {copied ? (
// //                 <>
// //                   <Check className={styles.icon} />
// //                   Copied!
// //                 </>
// //               ) : (
// //                 <>
// //                   <Copy className={styles.icon} />
// //                   Copy
// //                 </>
// //               )}
// //             </button>
// //           </div>
// //           <div className={styles.codeContainer}>
// //             <SyntaxHighlighter
// //               language="sql"
// //               style={themes[validTheme]}
// //               showLineNumbers={showLineNumbers}
// //               wrapLines={true}
// //               customStyle={{
// //                 margin: 0,
// //                 padding: '1rem',
// //                 backgroundColor: 'transparent',
// //               }}
// //             >
// //               {formattedCode}
// //             </SyntaxHighlighter>
// //           </div>
// //         </div>
// //         {data.explanation && (
// //           <div className={styles.explanation} style={{ backgroundColor, color: textColor }}>
// //             <h4 className={styles.explanationTitle}>Explanation:</h4>
// //             <p>{data.explanation}</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SQLCodeWidget;
// // import React, { useState } from 'react';
// // import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// // import * as themes from 'react-syntax-highlighter/dist/cjs/styles/prism';
// // import { Copy, Check } from 'lucide-react';
// // import styles from './SQLCodeWidget.module.css';
// // import prismThemes from './themes';

// // const SQLCodeWidget = ({ 
// //   data, 
// //   theme = 'tomorrow', 
// //   showLineNumbers = true,
// //   backgroundColor = '#f5f5f5',
// //   textColor = '#333',
// //   showTitle = true,
// //   showExplanation = true  // New prop to control explanation visibility
// // }) => {
// //   const [copied, setCopied] = useState(false);

// //   const handleCopy = () => {
// //     navigator.clipboard.writeText(data.code);
// //     setCopied(true);
// //     setTimeout(() => setCopied(false), 2000);
// //   };

// //   const validTheme = prismThemes[theme] || prismThemes.tomorrow;
// //   const formattedCode = data.code.replace(/\s*(SELECT|FROM|WHERE|ORDER BY|LIMIT)\s*/g, '\n$1 ').trim();

// //   const showExplanationSection = showExplanation && data.explanation;

// //   return (
// //     <div className={styles.widget} style={{ backgroundColor }}>
// //       {showTitle && data.title && (
// //         <div className={styles.header} style={{ backgroundColor, color: textColor }}>
// //           <h3 className={styles.title}>{data.title}</h3>
// //         </div>
// //       )}
// //       <div className={`${styles.contentWrapper} ${!showExplanationSection ? styles.fullWidth : ''}`}>
// //         <div className={`${styles.codeWrapper} ${!showExplanationSection ? styles.fullWidth : ''}`}>
// //           <div className={styles.codeHeader}>
// //             <button
// //               onClick={handleCopy}
// //               className={styles.copyButton}
// //             >
// //               {copied ? (
// //                 <>
// //                   <Check className={styles.icon} />
// //                   Copied!
// //                 </>
// //               ) : (
// //                 <>
// //                   <Copy className={styles.icon} />
// //                   Copy
// //                 </>
// //               )}
// //             </button>
// //           </div>
// //           <div className={styles.codeContainer}>
// //             <SyntaxHighlighter
// //               language="sql"
// //               style={themes[validTheme]}
// //               showLineNumbers={showLineNumbers}
// //               wrapLines={true}
// //               customStyle={{
// //                 margin: 0,
// //                 padding: '1rem',
// //                 backgroundColor: 'transparent',
// //               }}
// //             >
// //               {formattedCode}
// //             </SyntaxHighlighter>
// //           </div>
// //         </div>
// //         {showExplanationSection && (
// //           <div className={styles.explanation} style={{ backgroundColor, color: textColor }}>
// //             <h4 className={styles.explanationTitle}>Explanation:</h4>
// //             <p>{data.explanation}</p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SQLCodeWidget;
// import React, { useState } from 'react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import * as themes from 'react-syntax-highlighter/dist/cjs/styles/prism';
// import { Copy, Check } from 'lucide-react';
// import styles from './SQLCodeWidget.module.css';
// import prismThemes from './themes';

// const SQLCodeWidget = ({
//   data,
//   theme = 'tomorrow',
//   showLineNumbers = true,
//   backgroundColor = '#f5f5f5',
//   textColor = '#333',
//   showTitle = true,
//   showExplanation = true,
//   table = null // New prop for table data
// }) => {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(data.code);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const validTheme = prismThemes[theme] || prismThemes.tomorrow;
//   const formattedCode = data.code.replace(/\s*(SELECT|FROM|WHERE|ORDER BY|LIMIT)\s*/g, '\n$1 ').trim();

//   const showExplanationSection = showExplanation && data.explanation;

//   return (
//     <div className={styles.widget} style={{ backgroundColor }}>
//       {showTitle && data.title && (
//         <div className={styles.header} style={{ backgroundColor, color: textColor }}>
//           <h3 className={styles.title}>{data.title}</h3>
//         </div>
//       )}
//       <div className={`${styles.contentWrapper} ${!showExplanationSection ? styles.fullWidth : ''}`}>
//         <div className={`${styles.codeWrapper} ${!showExplanationSection ? styles.fullWidth : ''}`}>
//           <div className={styles.codeHeader}>
//             <button
//               onClick={handleCopy}
//               className={styles.copyButton}
//             >
//               {copied ? (
//                 <>
//                   <Check className={styles.icon} />
//                   Copied!
//                 </>
//               ) : (
//                 <>
//                   <Copy className={styles.icon} />
//                   Copy
//                 </>
//               )}
//             </button>
//           </div>
//           <div className={styles.codeContainer}>
//             <SyntaxHighlighter
//               language="sql"
//               style={themes[validTheme]}
//               showLineNumbers={showLineNumbers}
//               wrapLines={true}
//               customStyle={{
//                 margin: 0,
//                 padding: '1rem',
//                 backgroundColor: 'transparent',
//               }}
//             >
//               {formattedCode}
//             </SyntaxHighlighter>
//           </div>
//         </div>
//         {showExplanationSection && (
//           <div className={styles.explanation} style={{ backgroundColor, color: textColor }}>
//             <h4 className={styles.explanationTitle}>Explanation:</h4>
//             <p>{data.explanation}</p>
//           </div>
//         )}
//       </div>
//       {table && (
//         <div className={styles.tableWrapper}>
//           <table className={styles.sqlTable}>
//             <thead>
//               <tr>
//                 {Object.keys(table[0]).map((header, index) => (
//                   <th key={index}>{header}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {table.map((row, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {Object.values(row).map((cell, cellIndex) => (
//                     <td key={cellIndex}>{cell}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SQLCodeWidget;
// import React, { useState } from 'react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import * as themes from 'react-syntax-highlighter/dist/cjs/styles/prism';
// import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
// import styles from './SQLCodeWidget.module.css';
// import prismThemes from './themes';

// const SQLCodeWidget = ({
//   data,
//   theme = 'tomorrow',
//   showLineNumbers = true,
//   backgroundColor = '#f5f5f5',
//   textColor = '#333',
//   showTitle = true,
//   showExplanation = true,
//   table = null
// }) => {
//   const [copied, setCopied] = useState(false);
//   const [isTableExpanded, setIsTableExpanded] = useState(false);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(data.code);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const toggleTable = () => {
//     setIsTableExpanded(!isTableExpanded);
//   };

//   function extractTableName(tableData) {
   
//       const firstKey = Object.keys(tableData[0])[0];
//       const namePart = firstKey.replace(/_id$/, '');
//       return namePart.charAt(0).toUpperCase() + namePart.slice(1) + 's';
    
//   }

//   const validTheme = prismThemes[theme] || prismThemes.tomorrow;
//   const formattedCode = data.code.replace(/\s*(SELECT|FROM|WHERE|ORDER BY|LIMIT)\s*/g, '\n$1 ').trim();

//   const showExplanationSection = showExplanation && data.explanation;

//   return (
//     <div className={styles.widget} style={{ backgroundColor }}>
//       {showTitle && data.title && (
//         <div className={styles.header} style={{ backgroundColor, color: textColor }}>
//           <h3 className={styles.title}>{data.title}</h3>
//         </div>
//       )}
//       <div className={`${styles.contentWrapper} ${!showExplanationSection ? styles.fullWidth : ''}`}>
//         <div className={`${styles.codeWrapper} ${!showExplanationSection ? styles.fullWidth : ''}`}>
//           <div className={styles.codeHeader}>
//             <button
//               onClick={handleCopy}
//               className={styles.copyButton}
//             >
//               {copied ? (
//                 <>
//                   <Check className={styles.icon} />
//                   Copied!
//                 </>
//               ) : (
//                 <>
//                   <Copy className={styles.icon} />
//                   Copy
//                 </>
//               )}
//             </button>
//           </div>
//           <div className={styles.codeContainer}>
//             <SyntaxHighlighter
//               language="sql"
//               style={themes[validTheme]}
//               showLineNumbers={showLineNumbers}
//               wrapLines={true}
//               customStyle={{
//                 margin: 0,
//                 padding: '1rem',
//                 backgroundColor: 'transparent',
//               }}
//             >
//               {formattedCode}
//             </SyntaxHighlighter>
//           </div>
//         </div>
//         {showExplanationSection && (
//           <div className={styles.explanation} style={{ backgroundColor, color: textColor }}>
//             <h4 className={styles.explanationTitle}>Explanation:</h4>
//             <p>{data.explanation}</p>
//           </div>
//         )}
//       </div>
//       {table && (
//         <div className={styles.tableSection}>
//           <button className={styles.tableToggle} onClick={toggleTable}>
//             {isTableExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//             <span>{isTableExpanded?"Close ":"See Related Table "}
//             {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg> */}
//             </span>
//           </button>
//           {isTableExpanded && (
//             <>
//             <h4 className={styles.tableName}>{extractTableName(table)+' Table'}</h4>
//             <div className={styles.tableWrapper}>
//               <table className={styles.sqlTable}>
//                 <thead>
//                   <tr>
//                     {Object.keys(table[0]).map((header, index) => (
//                       <th key={index}>{header}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {table.map((row, rowIndex) => (
//                     <tr key={rowIndex}>
//                       {Object.values(row).map((cell, cellIndex) => (
//                         <td key={cellIndex}>{cell}</td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SQLCodeWidget;
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as themes from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './SQLCodeWidget.module.css';
import prismThemes from './themes';

const SQLCodeWidget = ({
  data,
  theme = 'tomorrow',
  showLineNumbers = true,
  backgroundColor = '#f5f5f5',
  textColor = '#333',
  showTitle = true,
  showExplanation = true,
  tables = []
}) => {
  const [copied, setCopied] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [activeTableIndex, setActiveTableIndex] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTable = () => {
    setIsTableExpanded(!isTableExpanded);
  };

  function extractTableName(tableData) {
    const firstKey = Object.keys(tableData[0])[0];
    const namePart = firstKey.replace(/_id$/, '');
    return namePart.charAt(0).toUpperCase() + namePart.slice(1) + 's';
  }

  const validTheme = prismThemes[theme] || prismThemes.tomorrow;
  const formattedCode = data.code.replace(/\s*(SELECT|FROM|WHERE|ORDER BY|LIMIT)\s*/g, '\n$1 ').trim();

  const showExplanationSection = showExplanation && data.explanation;

  return (
    <div className={styles.widget} style={{ backgroundColor }}>
      {showTitle && data.title && (
        <div className={styles.header} style={{ backgroundColor, color: textColor }}>
          <h3 className={styles.title}>{data.title}</h3>
        </div>
      )}
      <div className={`${styles.contentWrapper} ${!showExplanationSection ? styles.fullWidth : ''}`}>
        <div className={`${styles.codeWrapper} ${!showExplanationSection ? styles.fullWidth : ''}`}>
          <div className={styles.codeHeader}>
            <button onClick={handleCopy} className={styles.copyButton}>
              {copied ? (
                <>
                  <Check className={styles.icon} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className={styles.icon} />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className={styles.codeContainer}>
            <SyntaxHighlighter
              language="sql"
              style={themes[validTheme]}
              showLineNumbers={showLineNumbers}
              wrapLines={true}
              customStyle={{
                margin: 0,
                padding: '1rem',
                backgroundColor: 'transparent',
              }}
            >
              {formattedCode}
            </SyntaxHighlighter>
          </div>
        </div>
        {showExplanationSection && (
          <div className={styles.explanation} style={{ backgroundColor, color: textColor }}>
            <h4 className={styles.explanationTitle}>Explanation:</h4>
            <p>{data.explanation}</p>
          </div>
        )}
      </div>
      {tables.length > 0 && (
        <div className={styles.tableSection}>
          <button className={styles.tableToggle} onClick={toggleTable}>
            {isTableExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            <span>{isTableExpanded ? "Close " : "See Related Tables "}
            </span>
          </button>
          {isTableExpanded && (
            <>
              <div className={styles.tabContainer}>
                {tables.map((table, index) => (
                  <button
                    key={index}
                    className={`${styles.tabButton} ${index === activeTableIndex ? styles.activeTab : ''}`}
                    onClick={() => setActiveTableIndex(index)}
                  >
                    {extractTableName(table)}
                  </button>
                ))}
              </div>
              {/* <span className={styles.tableName}>{extractTableName(tables[activeTableIndex]) + ' Table'}</span> */}
              <div className={styles.tableWrapper}>
                <table className={styles.sqlTable}>
                  <thead>
                    <tr>
                      {Object.keys(tables[activeTableIndex][0]).map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tables[activeTableIndex].map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SQLCodeWidget;