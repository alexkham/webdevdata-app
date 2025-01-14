// // 'use client'

// // import { useState, useCallback } from 'react';
// // import { minify } from 'html-minifier';
// // import iconv from 'iconv-lite';
// // import styles from './JavaScriptMinifier.module.css';

// // export default function HTMLMinifier() {
// //   const [input, setInput] = useState('');
// //   const [output, setOutput] = useState('');
// //   const [error, setError] = useState('');
// //   const [copyButtonText, setCopyButtonText] = useState('Copy');
// //   const [encoding, setEncoding] = useState('UTF-8');

// //   const MAX_INPUT_LENGTH = 50000;

// //   const validateInput = (str) => {
// //     if (!str.trim()) {
// //       throw new Error('Input cannot be empty');
// //     }
// //     if (str.length > MAX_INPUT_LENGTH) {
// //       throw new Error(`Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
// //     }
// //   };

// //   const handleMinify = () => {
// //     try {
// //       validateInput(input);
      
// //       const inputBuffer = iconv.encode(input, encoding);
// //       const decodedInput = inputBuffer.toString();
      
// //       const minifiedHTML = minify(decodedInput, {
// //         removeComments: true,
// //         collapseWhitespace: true,
// //         minifyCSS: true,
// //         minifyJS: true,
// //         decodeEntities: true,
// //         characterSet: encoding,
// //       });
      
// //       const outputBuffer = iconv.encode(minifiedHTML, encoding);
// //       const encodedOutput = iconv.decode(outputBuffer, encoding);
      
// //       setOutput(encodedOutput);
// //       setError('');
// //     } catch (err) {
// //       setError('Error minifying HTML: ' + err.message);
// //       setOutput('');
// //     }
// //   };

// //   const handleReset = () => {
// //     setInput('');
// //     setOutput('');
// //     setError('');
// //     setCopyButtonText('Copy');
// //     setEncoding('UTF-8');
// //   };

// //   const handleCopy = useCallback(() => {
// //     navigator.clipboard.writeText(output).then(() => {
// //       setCopyButtonText('Copied!');
// //       setTimeout(() => setCopyButtonText('Copy'), 5000);
// //     }).catch(() => {
// //       setError('Failed to copy to clipboard');
// //     });
// //   }, [output]);

// //   return (
// //     <div className={styles.outerContainer}>
// //       <div className={styles.container}>
// //         <div className={styles.columnsContainer}>
// //           <div className={styles.column}>
// //             <h2 className={styles.subtitle}>Input</h2>
// //             <textarea
// //               className={styles.inputArea}
// //               value={input}
// //               onChange={(e) => {
// //                 setInput(e.target.value);
// //                 setError('');
// //                 if (e.target.value.length > MAX_INPUT_LENGTH) {
// //                   setError(`Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
// //                 }
// //               }}
// //               placeholder="Enter HTML code here"
// //             />
// //             <div className={styles.charCount}>
// //               {input.length} / {MAX_INPUT_LENGTH}
// //               {input.length > MAX_INPUT_LENGTH * 0.9 && 
// //                 <span className={styles.warning}> (Approaching limit)</span>}
// //             </div>
// //             <div className={styles.buttonGroup}>
// //               <div className={styles.buttonContainer}>
// //                 <button className={`${styles.button} ${styles.convertButton}`} onClick={handleMinify}>Minify</button>
// //                 <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
// //               </div>
// //               <div className={styles.encodingContainer}>
// //                 <select 
// //                   id="encoding" 
// //                   name="encoding" 
// //                   className={styles.encodingSelect}
// //                   value={encoding}
// //                   onChange={(e) => setEncoding(e.target.value)}
// //                 >
// //                   <option value="ISO-8859-1">ISO-8859-1 (Latin Alphabet No. 1)</option>
// //                   <option value="ISO-8859-2">ISO-8859-2 (Latin Alphabet No. 2)</option>
// //                   <option value="ISO-8859-3">ISO-8859-3 (Latin Alphabet No. 3)</option>
// //                   <option value="ISO-8859-4">ISO-8859-4 (Latin Alphabet No. 4)</option>
// //                   <option value="ISO-8859-5">ISO-8859-5 (Latin/Cyrillic Alphabet)</option>
// //                   <option value="ISO-8859-6">ISO-8859-6 (Latin/Arabic Alphabet)</option>
// //                   <option value="ISO-8859-7">ISO-8859-7 (Latin/Greek Alphabet)</option>
// //                   <option value="ISO-8859-8">ISO-8859-8 (Latin/Hebrew Alphabet)</option>
// //                   <option value="ISO-8859-9">ISO-8859-9 (Latin Alphabet No. 5)</option>
// //                   <option value="ISO-8859-13">ISO-8859-13 (Latin Alphabet No. 7)</option>
// //                   <option value="ISO-8859-15">ISO-8859-15 (Latin Alphabet No. 9)</option>
// //                   <option value="UTF-8" selected="selected">UTF-8</option>
// //                   <option value="UTF-16">UTF-16</option>
// //                   <option value="UTF-16BE">UTF-16 (Big-Endian)</option>
// //                   <option value="UTF-16LE">UTF-16 (Little-Endian)</option>
// //                   <option value="UTF-32">UTF-32</option>
// //                   <option value="UTF-32BE">UTF-32 (Big-Endian)</option>
// //                   <option value="UTF-32LE">UTF-32 (Little-Endian)</option>
// //                   <option value="US-ASCII">US-ASCII</option>
// //                   <option value="windows-1250">windows-1250 (Windows Eastern European)</option>
// //                   <option value="windows-1251">windows-1251 (Windows Cyrillic)</option>
// //                   <option value="windows-1252">windows-1252 (Windows Latin-1)</option>
// //                   <option value="windows-1253">windows-1253 (Windows Greek)</option>
// //                   <option value="windows-1254">windows-1254 (Windows Turkish)</option>
// //                   <option value="windows-1255">windows-1255 (Windows Hebrew)</option>
// //                   <option value="windows-1256">windows-1256 (Windows Arabic)</option>
// //                   <option value="windows-1257">windows-1257 (Windows Baltic)</option>
// //                   <option value="windows-1258">windows-1258 (Windows Vietnamese)</option>
// //                 </select>
// //                 <div className={styles.tooltipContainer}>
// //                   <span className={styles.tooltipIcon}>?</span>
// //                   <span className={styles.tooltipText}>Select the character encoding for the input and output. This determines how characters are represented in the minified HTML.</span>
// //                 </div>
// //               </div>
// //             </div>
// //             {error && <div className={styles.errorMessage}>{error}</div>}
// //           </div>
// //           <div className={styles.column}>
// //             <h2 className={styles.subtitle}>Output</h2>
// //             <div className={styles.outputContainer}>
// //               <button className={styles.copyButton} onClick={handleCopy}>
// //                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //                   <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
// //                   <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
// //                 </svg>
// //                 {copyButtonText}
// //               </button>
// //               <p className={styles.text}>{output}</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// // 'use client'

// // // import { useState, useCallback } from 'react';
// // // import iconv from 'iconv-lite';
// // // import styles from './JavaScriptMinifier.module.css';

// // // export default function HTMLMinifier() {
// // //   const [input, setInput] = useState('');
// // //   const [output, setOutput] = useState('');
// // //   const [error, setError] = useState('');
// // //   const [copyButtonText, setCopyButtonText] = useState('Copy');
// // //   const [encoding, setEncoding] = useState('UTF-8');

// // //   const MAX_INPUT_LENGTH = 50000;

// // //   const validateInput = (str) => {
// // //     if (!str.trim()) {
// // //       throw new Error('Input cannot be empty');
// // //     }
// // //     if (str.length > MAX_INPUT_LENGTH) {
// // //       throw new Error(`Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
// // //     }
// // //   };

// // //   const minifyHTML = (html) => {
// // //     return html
// // //       .replace(/\s+/g, ' ')
// // //       .replace(/>\s+</g, '><')
// // //       .replace(/<!--[\s\S]*?-->/g, '')
// // //       .trim();
// // //   };

// // //   const handleMinify = () => {
// // //     try {
// // //       validateInput(input);
      
// // //       const inputBuffer = iconv.encode(input, encoding);
// // //       const decodedInput = inputBuffer.toString();
      
// // //       const minifiedHTML = minifyHTML(decodedInput);
      
// // //       const outputBuffer = iconv.encode(minifiedHTML, encoding);
// // //       const encodedOutput = iconv.decode(outputBuffer, encoding);
      
// // //       setOutput(encodedOutput);
// // //       setError('');
// // //     } catch (err) {
// // //       setError('Error minifying HTML: ' + err.message);
// // //       setOutput('');
// // //     }
// // //   };

// // //   const handleReset = () => {
// // //     setInput('');
// // //     setOutput('');
// // //     setError('');
// // //     setCopyButtonText('Copy');
// // //     setEncoding('UTF-8');
// // //   };

// // //   const handleCopy = useCallback(() => {
// // //     navigator.clipboard.writeText(output).then(() => {
// // //       setCopyButtonText('Copied!');
// // //       setTimeout(() => setCopyButtonText('Copy'), 5000);
// // //     }).catch(() => {
// // //       setError('Failed to copy to clipboard');
// // //     });
// // //   }, [output]);

// // //   return (
// // //     <div className={styles.outerContainer}>
// // //       <div className={styles.container}>
// // //         <div className={styles.columnsContainer}>
// // //           <div className={styles.column}>
// // //             <h2 className={styles.subtitle}>Input</h2>
// // //             <textarea
// // //               className={styles.inputArea}
// // //               value={input}
// // //               onChange={(e) => {
// // //                 setInput(e.target.value);
// // //                 setError('');
// // //                 if (e.target.value.length > MAX_INPUT_LENGTH) {
// // //                   setError(`Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
// // //                 }
// // //               }}
// // //               placeholder="Enter HTML code here"
// // //             />
// // //             <div className={styles.charCount}>
// // //               {input.length} / {MAX_INPUT_LENGTH}
// // //               {input.length > MAX_INPUT_LENGTH * 0.9 && 
// // //                 <span className={styles.warning}> (Approaching limit)</span>}
// // //             </div>
// // //             <div className={styles.buttonGroup}>
// // //               <div className={styles.buttonContainer}>
// // //                 <button className={`${styles.button} ${styles.convertButton}`} onClick={handleMinify}>Minify</button>
// // //                 <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
// // //               </div>
// // //               <div className={styles.encodingContainer}>
// // //                 <select 
// // //                   id="encoding" 
// // //                   name="encoding" 
// // //                   className={styles.encodingSelect}
// // //                   value={encoding}
// // //                   onChange={(e) => setEncoding(e.target.value)}
// // //                 >
// // //                   <option value="ISO-8859-1">ISO-8859-1 (Latin Alphabet No. 1)</option>
// // //                   <option value="ISO-8859-2">ISO-8859-2 (Latin Alphabet No. 2)</option>
// // //                   <option value="ISO-8859-3">ISO-8859-3 (Latin Alphabet No. 3)</option>
// // //                   <option value="ISO-8859-4">ISO-8859-4 (Latin Alphabet No. 4)</option>
// // //                   <option value="ISO-8859-5">ISO-8859-5 (Latin/Cyrillic Alphabet)</option>
// // //                   <option value="ISO-8859-6">ISO-8859-6 (Latin/Arabic Alphabet)</option>
// // //                   <option value="ISO-8859-7">ISO-8859-7 (Latin/Greek Alphabet)</option>
// // //                   <option value="ISO-8859-8">ISO-8859-8 (Latin/Hebrew Alphabet)</option>
// // //                   <option value="ISO-8859-9">ISO-8859-9 (Latin Alphabet No. 5)</option>
// // //                   <option value="ISO-8859-13">ISO-8859-13 (Latin Alphabet No. 7)</option>
// // //                   <option value="ISO-8859-15">ISO-8859-15 (Latin Alphabet No. 9)</option>
// // //                   <option value="UTF-8" selected="selected">UTF-8</option>
// // //                   <option value="UTF-16">UTF-16</option>
// // //                   <option value="UTF-16BE">UTF-16 (Big-Endian)</option>
// // //                   <option value="UTF-16LE">UTF-16 (Little-Endian)</option>
// // //                   <option value="UTF-32">UTF-32</option>
// // //                   <option value="UTF-32BE">UTF-32 (Big-Endian)</option>
// // //                   <option value="UTF-32LE">UTF-32 (Little-Endian)</option>
// // //                   <option value="US-ASCII">US-ASCII</option>
// // //                   <option value="windows-1250">windows-1250 (Windows Eastern European)</option>
// // //                   <option value="windows-1251">windows-1251 (Windows Cyrillic)</option>
// // //                   <option value="windows-1252">windows-1252 (Windows Latin-1)</option>
// // //                   <option value="windows-1253">windows-1253 (Windows Greek)</option>
// // //                   <option value="windows-1254">windows-1254 (Windows Turkish)</option>
// // //                   <option value="windows-1255">windows-1255 (Windows Hebrew)</option>
// // //                   <option value="windows-1256">windows-1256 (Windows Arabic)</option>
// // //                   <option value="windows-1257">windows-1257 (Windows Baltic)</option>
// // //                   <option value="windows-1258">windows-1258 (Windows Vietnamese)</option>
// // //                 </select>
// // //                 <div className={styles.tooltipContainer}>
// // //                   <span className={styles.tooltipIcon}>?</span>
// // //                   <span className={styles.tooltipText}>Select the character encoding for the input and output. This determines how characters are represented in the minified HTML.</span>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //             {error && <div className={styles.errorMessage}>{error}</div>}
// // //           </div>
// // //           <div className={styles.column}>
// // //             <h2 className={styles.subtitle}>Output</h2>
// // //             <div className={styles.outputContainer}>
// // //               <button className={styles.copyButton} onClick={handleCopy}>
// // //                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// // //                   <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
// // //                   <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
// // //                 </svg>
// // //                 {copyButtonText}
// // //               </button>
// // //               <p className={styles.text}>{output}</p>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // 'use client'
// // import { useState, useCallback } from 'react';
// // import iconv from 'iconv-lite';
// // import styles from './JavaScriptMinifier.module.css';

// // export default function HTMLMinifier() {
// //   const [input, setInput] = useState('');
// //   const [output, setOutput] = useState('');
// //   const [error, setError] = useState('');
// //   const [copyButtonText, setCopyButtonText] = useState('Copy');
// //   const [encoding, setEncoding] = useState('UTF-8');  // Simplified to always use UTF-8 for this example

// //   const MAX_INPUT_LENGTH = 50000;

// //   const validateInput = (str) => {
// //     if (!str.trim()) {
// //       throw new Error('Input cannot be empty');
// //     }
// //     if (str.length > MAX_INPUT_LENGTH) {
// //       throw new Error(`Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
// //     }
// //   };

// //   const minifyHTML = (html) => {
// //     return html
// //       .replace(/\s+/g, ' ')
// //       .replace(/>\s+</g, '><')
// //       .replace(/<!--[\s\S]*?-->/g, '')
// //       .trim();
// //   };

// //   const handleMinify = () => {
// //     try {
// //       validateInput(input);
      
// //       // Using UTF-8 encoding explicitly
// //       const encodedInput = iconv.encode(input, 'UTF-8');
// //       const decodedInput = iconv.decode(encodedInput, 'UTF-8');
// //       console.log('Decoded Input:', decodedInput); // Logging for debugging
      
// //       const minifiedHTML = minifyHTML(decodedInput);
// //       console.log('Minified HTML:', minifiedHTML); // Logging for debugging

// //       setOutput(minifiedHTML);
// //       setError('');
// //     } catch (err) {
// //       setError('Error minifying HTML: ' + err.message);
// //       setOutput('');
// //     }
// //   };

// //   const handleReset = () => {
// //     setInput('');
// //     setOutput('');
// //     setError('');
// //     setCopyButtonText('Copy');
// //     setEncoding('UTF-8');
// //   };

// //   const handleCopy = useCallback(() => {
// //     navigator.clipboard.writeText(output).then(() => {
// //       setCopyButtonText('Copied!');
// //       setTimeout(() => setCopyButtonText('Copy'), 5000);
// //     }).catch(() => {
// //       setError('Failed to copy to clipboard');
// //     });
// //   }, [output]);

// //   return (
// //     <div className={styles.outerContainer}>
// //       <div className={styles.container}>
// //         <div className={styles.columnsContainer}>
// //           <div className={styles.column}>
// //             <h2 className={styles.subtitle}>Input</h2>
// //             <textarea
// //               className={styles.inputArea}
// //               value={input}
// //               onChange={(e) => setInput(e.target.value)}
// //               placeholder="Enter HTML code here"
// //             />
// //             <div className={styles.charCount}>
// //               {input.length} / {MAX_INPUT_LENGTH}
// //               {input.length > MAX_INPUT_LENGTH * 0.9 && 
// //                 <span className={styles.warning}> (Approaching limit)</span>}
// //             </div>
// //             <div className={styles.buttonGroup}>
// //               <button className={`${styles.button} ${styles.convertButton}`} onClick={handleMinify}>Minify</button>
// //               <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
// //             </div>
// //           </div>
// //           <div className={styles.column}>
// //             <h2 className={styles.subtitle}>Output</h2>
// //             <div className={styles.outputContainer}>
// //               <button className={styles.copyButton} onClick={handleCopy}>
// //                 {copyButtonText}
// //               </button>
// //               <p className={styles.text}>{output}</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// 'use client'

// import { useState, useCallback } from 'react';
// import styles from './JavaScriptMinifier.module.css';

// export default function HTMLMinifier() {
//   const [input, setInput] = useState('');
//   const [output, setOutput] = useState('');
//   const [error, setError] = useState('');
//   const [copyButtonText, setCopyButtonText] = useState('Copy');
//   const [encoding, setEncoding] = useState('UTF-8');

//   const MAX_INPUT_LENGTH = 50000;

//   const validateInput = (str) => {
//     if (!str.trim()) {
//       throw new Error('Input cannot be empty');
//     }
//     if (str.length > MAX_INPUT_LENGTH) {
//       throw new Error(`Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
//     }
//   };

//   const handleMinify = async () => {
//     try {
//       validateInput(input);
      
//       const response = await fetch('/api/minify-html', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ html: input, encoding }),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to minify HTML');
//       }
      
//       const data = await response.json();
//       setOutput(data.minifiedHtml);
//       setError('');
//     } catch (err) {
//       setError('Error minifying HTML: ' + err.message);
//       setOutput('');
//     }
//   };

//   const handleReset = () => {
//     setInput('');
//     setOutput('');
//     setError('');
//     setCopyButtonText('Copy');
//     setEncoding('UTF-8');
//   };

//   const handleCopy = useCallback(() => {
//     navigator.clipboard.writeText(output).then(() => {
//       setCopyButtonText('Copied!');
//       setTimeout(() => setCopyButtonText('Copy'), 5000);
//     }).catch(() => {
//       setError('Failed to copy to clipboard');
//     });
//   }, [output]);

//   return (
//     <div className={styles.outerContainer}>
//       <div className={styles.container}>
//         <div className={styles.columnsContainer}>
//           <div className={styles.column}>
//             <h2 className={styles.subtitle}>Input</h2>
//             <textarea
//               className={styles.inputArea}
//               value={input}
//               onChange={(e) => {
//                 setInput(e.target.value);
//                 setError('');
//                 if (e.target.value.length > MAX_INPUT_LENGTH) {
//                   setError(`Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
//                 }
//               }}
//               placeholder="Enter HTML code here"
//             />
//             <div className={styles.charCount}>
//               {input.length} / {MAX_INPUT_LENGTH}
//               {input.length > MAX_INPUT_LENGTH * 0.9 && 
//                 <span className={styles.warning}> (Approaching limit)</span>}
//             </div>
//             <div className={styles.buttonGroup}>
//               <div className={styles.buttonContainer}>
//                 <button className={`${styles.button} ${styles.convertButton}`} onClick={handleMinify}>Minify</button>
//                 <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
//               </div>
//               <div className={styles.encodingContainer}>
//                 <select 
//                   id="encoding" 
//                   name="encoding" 
//                   className={styles.encodingSelect}
//                   value={encoding}
//                   onChange={(e) => setEncoding(e.target.value)}
//                 >
//                   <option value="ISO-8859-1">ISO-8859-1 (Latin Alphabet No. 1)</option>
//                   <option value="ISO-8859-2">ISO-8859-2 (Latin Alphabet No. 2)</option>
//                   <option value="ISO-8859-3">ISO-8859-3 (Latin Alphabet No. 3)</option>
//                   <option value="ISO-8859-4">ISO-8859-4 (Latin Alphabet No. 4)</option>
//                   <option value="ISO-8859-5">ISO-8859-5 (Latin/Cyrillic Alphabet)</option>
//                   <option value="ISO-8859-6">ISO-8859-6 (Latin/Arabic Alphabet)</option>
//                   <option value="ISO-8859-7">ISO-8859-7 (Latin/Greek Alphabet)</option>
//                   <option value="ISO-8859-8">ISO-8859-8 (Latin/Hebrew Alphabet)</option>
//                   <option value="ISO-8859-9">ISO-8859-9 (Latin Alphabet No. 5)</option>
//                   <option value="ISO-8859-13">ISO-8859-13 (Latin Alphabet No. 7)</option>
//                   <option value="ISO-8859-15">ISO-8859-15 (Latin Alphabet No. 9)</option>
//                   <option value="UTF-8">UTF-8</option>
//                   <option value="UTF-16">UTF-16</option>
//                   <option value="UTF-16BE">UTF-16 (Big-Endian)</option>
//                   <option value="UTF-16LE">UTF-16 (Little-Endian)</option>
//                   <option value="UTF-32">UTF-32</option>
//                   <option value="UTF-32BE">UTF-32 (Big-Endian)</option>
//                   <option value="UTF-32LE">UTF-32 (Little-Endian)</option>
//                   <option value="US-ASCII">US-ASCII</option>
//                   <option value="windows-1250">windows-1250 (Windows Eastern European)</option>
//                   <option value="windows-1251">windows-1251 (Windows Cyrillic)</option>
//                   <option value="windows-1252">windows-1252 (Windows Latin-1)</option>
//                   <option value="windows-1253">windows-1253 (Windows Greek)</option>
//                   <option value="windows-1254">windows-1254 (Windows Turkish)</option>
//                   <option value="windows-1255">windows-1255 (Windows Hebrew)</option>
//                   <option value="windows-1256">windows-1256 (Windows Arabic)</option>
//                   <option value="windows-1257">windows-1257 (Windows Baltic)</option>
//                   <option value="windows-1258">windows-1258 (Windows Vietnamese)</option>
//                 </select>
//                 <div className={styles.tooltipContainer}>
//                   <span className={styles.tooltipIcon}>?</span>
//                   <span className={styles.tooltipText}>Select the character encoding for the input and output. This determines how characters are represented in the minified HTML.</span>
//                 </div>
//               </div>
//             </div>
//             {error && <div className={styles.errorMessage}>{error}</div>}
//           </div>
//           <div className={styles.column}>
//             <h2 className={styles.subtitle}>Output</h2>
//             <div className={styles.outputContainer}>
//               <button className={styles.copyButton} onClick={handleCopy}>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
//                   <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
//                 </svg>
//                 {copyButtonText}
//               </button>
//               <p className={styles.text}>{output}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client'

import { useState, useCallback, useEffect } from 'react';
import styles from './JavaScriptMinifier.module.css';

export default function HTMLMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const [encoding, setEncoding] = useState('UTF-8');
  const [isLoading, setIsLoading] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState(null);

  const MAX_INPUT_LENGTH = 100000;

  const validateInput = (str) => {
    if (!str.trim()) {
      throw new Error('Input cannot be empty');
    }
    if (str.length > MAX_INPUT_LENGTH) {
      throw new Error(`Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
    }
  };

  const handleMinify = async () => {
    try {
      setIsLoading(true);
      validateInput(input);
      
      const response = await fetch('/api/minify-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: input, encoding }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to minify HTML');
      }
      
      const data = await response.json();
      setOutput(data.minifiedHtml);
      setError('');
      
      const ratio = ((1 - data.minifiedHtml.length / input.length) * 100).toFixed(2);
      setCompressionRatio(ratio);
    } catch (err) {
      setError('Error minifying HTML: ' + err.message);
      setOutput('');
      setCompressionRatio(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInput('');
    setOutput('');
    setError('');
    setCopyButtonText('Copy');
    setEncoding('UTF-8');
    setCompressionRatio(null);
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy'), 2000);
    }).catch(() => {
      setError('Failed to copy to clipboard');
    });
  }, [output]);

  useEffect(() => {
    const handlePaste = (event) => {
      const pastedText = event.clipboardData.getData('text');
      if (pastedText.length > MAX_INPUT_LENGTH) {
        event.preventDefault();
        setError(`Pasted content exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <div className={styles.columnsContainer}>
          <div className={styles.column}>
            <h2 className={styles.subtitle}>Input HTML</h2>
            <textarea
              className={styles.inputArea}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
                if (e.target.value.length > MAX_INPUT_LENGTH) {
                  setError(`Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
                }
              }}
              placeholder="Enter HTML code here"
            />
            <div className={styles.charCount}>
              {input.length} / {MAX_INPUT_LENGTH}
              {input.length > MAX_INPUT_LENGTH * 0.9 && 
                <span className={styles.warning}> (Approaching limit)</span>}
            </div>
            <div className={styles.buttonGroup}>
              <div className={styles.buttonContainer}>
                <button 
                  className={`${styles.button} ${styles.convertButton}`} 
                  onClick={handleMinify}
                //   disabled={isLoading || !input.trim()}
                >
                  {isLoading ? 'Minifying...' : 'Minify'}
                </button>
                <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
              </div>
              
              <div className={styles.encodingContainer}>
                <select 
                  id="encoding" 
                  name="encoding" 
                  className={styles.encodingSelect}
                  value={encoding}
                  onChange={(e) => setEncoding(e.target.value)}
                >
                  <option value="UTF-8">UTF-8</option>
                  <option value="ISO-8859-1">ISO-8859-1 (Latin-1)</option>
                  <option value="windows-1252">Windows-1252</option>
                </select>
                <div className={styles.tooltipContainer}>
                  <span className={styles.tooltipIcon}>?</span>
                  <span className={styles.tooltipText}>Select the character encoding for the input and output.</span>
                </div>
                {/* {error && <div className={styles.errorMessage}>{error}</div>} */}
              </div>
              {/* {error && <div className={styles.errorMessage}>{error}</div>} */}
            </div>
            {error && <div className={styles.errorMessage}>{error}</div>}
          </div>
          {/* {error && <div className={styles.errorMessage}>{error}</div>} */}
          <div className={styles.column}>
            <h2 className={styles.subtitle}>Minified Output</h2>
            <div className={styles.outputContainer}>
              <button 
                className={styles.copyButton} 
                onClick={handleCopy}
                disabled={!output}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                {copyButtonText}
              </button>
              <pre className={styles.text}>{output}</pre>
            </div>
            {compressionRatio !== null && (
              <div className={styles.compressionInfo}>
                Compression ratio: {compressionRatio}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}