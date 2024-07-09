// // // // // // 'use client'
// // // // // // import { useState, useEffect } from 'react';

// // // // // // function URLEncoder2() {
// // // // // //   const [input, setInput] = useState('');
// // // // // //   const [output, setOutput] = useState('');
// // // // // //   const [error, setError] = useState('');

// // // // // //   useEffect(() => {
// // // // // //     setError('');
// // // // // //     setOutput('');
// // // // // //   }, [input]);

// // // // // //   const isValidURL = (str) => {
// // // // // //     try {
// // // // // //       new URL(str);
// // // // // //       return true;
// // // // // //     } catch {
// // // // // //       return false;
// // // // // //     }
// // // // // //   };

// // // // // //   const encodeURL = () => {
// // // // // //     if (!input.trim()) {
// // // // // //       setError('Input cannot be empty');
// // // // // //       return;
// // // // // //     }
// // // // // //     if (isValidURL(input)) {
// // // // // //       setOutput(encodeURIComponent(input));
// // // // // //     } else {
// // // // // //       setError('Invalid URL');
// // // // // //     }
// // // // // //   };

// // // // // //   const decodeURL = () => {
// // // // // //     if (!input.trim()) {
// // // // // //       setError('Input cannot be empty');
// // // // // //       return;
// // // // // //     }
// // // // // //     try {
// // // // // //       const decoded = decodeURIComponent(input);
// // // // // //       if (isValidURL(decoded)) {
// // // // // //         setOutput(decoded);
// // // // // //       } else {
// // // // // //         setError('Decoded string is not a valid URL');
// // // // // //       }
// // // // // //     } catch {
// // // // // //       setError('Failed to decode URL');
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h1>URL Encoder/Decoder</h1>
// // // // // //       <textarea
// // // // // //         value={input}
// // // // // //         onChange={(e) => setInput(e.target.value)}
// // // // // //         placeholder="Enter URL here"
// // // // // //       />
// // // // // //       <button onClick={encodeURL} disabled={!input.trim()}>Encode</button>
// // // // // //       <button onClick={decodeURL} disabled={!input.trim()}>Decode</button>
// // // // // //       {error && <div style={{color: 'red'}}>{error}</div>}
// // // // // //       {output && (
// // // // // //         <div>
// // // // // //           <h2>Result:</h2>
// // // // // //           <p>{output}</p>
// // // // // //         </div>
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // }
// // // // // // export default URLEncoder2;
// // // // // 'use client'
// // // // // import { useState, useEffect } from 'react';

// // // // // export default function URLEncoder() {
// // // // //   const [input, setInput] = useState('');
// // // // //   const [output, setOutput] = useState('');
// // // // //   const [error, setError] = useState('');

// // // // //   useEffect(() => {
// // // // //     setError('');
// // // // //     setOutput('');
// // // // //   }, [input]);

// // // // //   const encodeURL = () => {
// // // // //     if (!input.trim()) {
// // // // //       setError('Input cannot be empty');
// // // // //       return;
// // // // //     }
// // // // //     setOutput(encodeURIComponent(input));
// // // // //   };

// // // // //   const decodeURL = () => {
// // // // //     if (!input.trim()) {
// // // // //       setError('Input cannot be empty');
// // // // //       return;
// // // // //     }
// // // // //     try {
// // // // //       const decoded = decodeURIComponent(input);
// // // // //       new URL(decoded); // Validate decoded URL
// // // // //       setOutput(decoded);
// // // // //     } catch {
// // // // //       setError('Failed to decode or result is not a valid URL');
// // // // //     }
// // // // //   };

// // // // //   const copyToClipboard = () => {
// // // // //     navigator.clipboard.writeText(output).catch(err => {
// // // // //       setError('Failed to copy');
// // // // //     });
// // // // //   };

// // // // //   return (
// // // // //     <div>
// // // // //       <h1>URL Encoder/Decoder</h1>
// // // // //       <textarea
// // // // //         value={input}
// // // // //         onChange={(e) => setInput(e.target.value)}
// // // // //         placeholder="Enter URL here"
// // // // //       />
// // // // //       <button onClick={encodeURL} disabled={!input.trim()}>Encode</button>
// // // // //       <button onClick={decodeURL} disabled={!input.trim()}>Decode</button>
// // // // //       {error && <div style={{color: 'red'}}>{error}</div>}
// // // // //       {output && (
// // // // //         <div>
// // // // //           <h2>Result:</h2>
// // // // //           <p>{output}</p>
// // // // //           <button onClick={copyToClipboard}>Copy</button>
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // 'use client'
// // // // import { useState, useEffect } from 'react';

// // // // export default function URLEncoder2() {
// // // //   const [input, setInput] = useState('');
// // // //   const [output, setOutput] = useState('');
// // // //   const [error, setError] = useState('');

// // // //   useEffect(() => {
// // // //     setError('');
// // // //     setOutput('');
// // // //   }, [input]);

// // // //   const looksLikeURL = (str) => {
// // // //     // Basic check for patterns that resemble a URL
// // // //     return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(str);
// // // //   }

// // // //   const encodeURL = () => {
// // // //     if (!input.trim()) {
// // // //       setError('Input cannot be empty');
// // // //       return;
// // // //     }
// // // //     if (!looksLikeURL(input)) {
// // // //       setError('Input does not look like a URL');
// // // //       return;
// // // //     }
// // // //     setOutput(encodeURIComponent(input));
// // // //   };

// // // //   const decodeURL = () => {
// // // //     if (!input.trim()) {
// // // //       setError('Input cannot be empty');
// // // //       return;
// // // //     }
// // // //     try {
// // // //       const decoded = decodeURIComponent(input);
// // // //       if (looksLikeURL(decoded)) {
// // // //         setOutput(decoded);
// // // //       } else {
// // // //         setError('Decoded string does not look like a valid URL');
// // // //       }
// // // //     } catch {
// // // //       setError('Failed to decode URL');
// // // //     }
// // // //   };

// // // //   const copyToClipboard = () => {
// // // //     if (!output) {
// // // //       setError('No output to copy');
// // // //       return;
// // // //     }
// // // //     navigator.clipboard.writeText(output).catch(err => {
// // // //       setError('Failed to copy');
// // // //     });
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <h1>URL Encoder/Decoder</h1>
// // // //       <textarea
// // // //         value={input}
// // // //         onChange={(e) => setInput(e.target.value)}
// // // //         placeholder="Enter URL here"
// // // //       />
// // // //       <button onClick={encodeURL} disabled={!input.trim()}>Encode</button>
// // // //       <button onClick={decodeURL} disabled={!input.trim()}>Decode</button>
// // // //       {error && <div style={{color: 'red'}}>{error}</div>}
// // // //       {output && (
// // // //         <div>
// // // //           <h2>Result:</h2>
// // // //           <p>{output}</p>
// // // //           <button onClick={copyToClipboard}>Copy</button>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }
// // // 'use client'
// // // import { useState, useEffect } from 'react';
// // // import styles from './URLEncoder.module.css';

// // // export default function URLEncoder() {
// // //   const [input, setInput] = useState('');
// // //   const [output, setOutput] = useState('');
// // //   const [error, setError] = useState('');

// // //   useEffect(() => {
// // //     setError('');
// // //     setOutput('');
// // //   }, [input]);

// // //   const encodeURL = () => {
// // //     if (!input.trim()) {
// // //       setError('Input cannot be empty');
// // //       return;
// // //     }
// // //     setOutput(encodeURIComponent(input));
// // //   };

// // //   const decodeURL = () => {
// // //     if (!input.trim()) {
// // //       setError('Input cannot be empty');
// // //       return;
// // //     }
// // //     try {
// // //       const decoded = decodeURIComponent(input);
// // //       new URL(decoded);
// // //       setOutput(decoded);
// // //     } catch {
// // //       setError('Failed to decode or result is not a valid URL');
// // //     }
// // //   };

// // //   const copyToClipboard = () => {
// // //     navigator.clipboard.writeText(output).catch(err => {
// // //       setError('Failed to copy');
// // //     });
// // //   };

// // //   return (
// // //     <div className={styles.outerContainer}>
// // //       <div className={styles.container}>
// // //         <textarea
// // //           className={styles.inputArea}
// // //           value={input}
// // //           onChange={(e) => setInput(e.target.value)}
// // //           placeholder="Enter URL here"
// // //         />
// // //         <div className={styles.buttonGroup}>
// // //           <button onClick={encodeURL} disabled={!input.trim()}>Encode</button>
// // //           <button onClick={decodeURL} disabled={!input.trim()}>Decode</button>
// // //         </div>
// // //         {error && <div className={styles.errorMessage}>{error}</div>}
// // //         {output && (
// // //           <div className={styles.outputContainer}>
// // //             <p>{output}</p>
// // //             <button className={styles.copyButton} onClick={copyToClipboard}>Copy</button>
// // //           </div>
// // //         )}
// // //       </div>
// // //       <div>
// // //         {/* Right Column for future explanations */}
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // 'use client'
// // import { useState, useEffect } from 'react';
// // import styles from './URLEncoder.module.css';

// // export default function URLEncoder() {
// //   const [input, setInput] = useState('');
// //   const [output, setOutput] = useState('');
// //   const [error, setError] = useState('');

// //   useEffect(() => {
// //     setError('');
// //     setOutput('');
// //   }, [input]);

// //   const looksLikeURL = (str) => {
// //     // More stringent URL-like pattern
// //     return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(str);
// //   };

// //   const encodeURL = () => {
// //     if (!input.trim()) {
// //       setError('Input cannot be empty');
// //       return;
// //     }
// //     if (!looksLikeURL(input)) {
// //       setError('Input does not look like a URL');
// //       return;
// //     }
// //     setOutput(encodeURIComponent(input));
// //   };

// //   const decodeURL = () => {
// //     if (!input.trim()) {
// //       setError('Input cannot be empty');
// //       return;
// //     }
// //     try {
// //       const decoded = decodeURIComponent(input);
// //       if (looksLikeURL(decoded)) {
// //         setOutput(decoded);
// //       } else {
// //         setError('Decoded string does not look like a valid URL');
// //       }
// //     } catch {
// //       setError('Failed to decode URL');
// //     }
// //   };

// //   const copyToClipboard = () => {
// //     navigator.clipboard.writeText(output).catch(err => {
// //       setError('Failed to copy');
// //     });
// //   };

// //   return (
// //     <div className={styles.outerContainer}>
// //       <div className={styles.container}>
// //         <textarea
// //           className={styles.inputArea}
// //           value={input}
// //           onChange={(e) => setInput(e.target.value)}
// //           placeholder="Enter URL here"
// //         />
// //         <div className={styles.buttonGroup}>
// //           <button onClick={encodeURL} disabled={!input.trim()}>Encode</button>
// //           <button onClick={decodeURL} disabled={!input.trim()}>Decode</button>
// //         </div>
// //         {error && <div className={styles.errorMessage}>{error}</div>}
// //         {output && (
// //           <div className={styles.outputContainer}>
// //             <p>{output}</p>
// //             <button className={styles.copyButton} onClick={copyToClipboard}>Copy</button>
// //           </div>
// //         )}
// //       </div>
// //       <div>
// //         {/* Right Column for future explanations */}
// //       </div>
// //     </div>
// //   );
// // }

// // 'use client';  

// // import { useState, useEffect } from 'react';
// // import styles from './URLEncoder.module.css';

// // export default function URLEncoder() {
// //   const [input, setInput] = useState('');
// //   const [output, setOutput] = useState('');
// //   const [error, setError] = useState('');

// //   useEffect(() => {
// //     setError('');
// //     setOutput('');
// //   }, [input]);

// //   const looksLikeURL = (str) => {
// //     // This regex checks for a scheme, followed by "://", a domain name, and optional paths or queries
// //     return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ;,./?%&=]*)?(#[\w-]*)?$/i.test(str);
// //   };

// //   const encodeURL = () => {
// //     if (!input.trim()) {
// //       setError('Input cannot be empty');
// //       return;
// //     }
// //     if (!looksLikeURL(input)) {
// //       setError('Input does not look like a URL');
// //       return;
// //     }
// //     setOutput(encodeURIComponent(input));
// //   };

// //   const decodeURL = () => {
// //     if (!input.trim()) {
// //       setError('Input cannot be empty');
// //       return;
// //     }
// //     try {
// //       const decoded = decodeURIComponent(input);
// //       if (!looksLikeURL(decoded)) {
// //         setError('Decoded string does not look like a valid URL');
// //         return;
// //       }
// //       setOutput(decoded);
// //     } catch {
// //       setError('Failed to decode URL');
// //     }
// //   };

// //   const reset = () => {
// //     setInput('');
// //     setOutput('');
// //     setError('');
// //   };

// //   const copyToClipboard = () => {
// //     navigator.clipboard.writeText(output).catch(err => {
// //       setError('Failed to copy');
// //     });
// //   };

// //   return (
// //     <div className={styles.outerContainer}>
// //       <div className={styles.container}>
// //         <textarea
// //           className={styles.inputArea}
// //           value={input}
// //           onChange={(e) => setInput(e.target.value)}
// //           placeholder="Enter URL here"
// //         />
// //         <div className={styles.buttonGroup}>
// //           <button onClick={encodeURL} disabled={!input.trim()}>Encode</button>
// //           <button onClick={decodeURL} disabled={!input.trim()}>Decode</button>
// //           <button onClick={reset}>Reset</button>
// //         </div>
// //         {error && <div className={styles.errorMessage}>{error}</div>}
// //         {output && (
// //           <div className={styles.outputContainer}>
// //             <p>{output}</p>
// //             <button className={styles.copyButton} onClick={copyToClipboard}>Copy</button>
// //           </div>
// //         )}
// //       </div>
// //       <div>
// //         {/* Right Column for future explanations or additional content */}
// //       </div>
// //     </div>
// //   );
// // }
// 'use client';

// import { useState, useEffect } from 'react';
// import styles from './URLEncoder.module.css';

// export default function URLEncoder() {
//   const [input, setInput] = useState('');
//   const [output, setOutput] = useState('');
//   const [error, setError] = useState('');
//   const [copyButtonText, setCopyButtonText] = useState('Copy');  // State to manage copy button text

//   useEffect(() => {
//     setError('');
//     setOutput('');
//   }, [input]);

//   const looksLikeURL = (str) => {
//     // return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ;,./?%&=]*)?(#[\w-]*)?$/i.test(str);
//     // return /^(https?:\/\/)?(localhost|([\w-]+\.)+[\w-]+)(\/[\w- ;,./?%&=]*)?$/i.test(str);
//     // return /^(https?:\/\/)?(localhost|([\w-]+\.)+[\w-]+)(:\d+)?(\/[\w- ;,./?%&=]*)?$/i.test(str);
//      return /^(https?:\/\/)?((localhost|([\w-]+\.)+[\w-]+)(:\d+)?)?(\/[\w- .\/?%&=]*)?(\#[\w-]*)?$/i.test(str);

//   };


//   const validateInput = (input) => {
//     if (!input || input.trim() === '') {
//       setError('Input cannot be empty');
//       setOutput('');
//       return false;
//     }
//     setError('');
//     return true;
//   };

//   const encodeURL = () => {
//     if (!validateInput(input)) return;

//     if (!looksLikeURL(input)) {
//       setError('Input does not look like a URL');
//       setOutput('');
//       return;
//     }
//     setOutput(encodeURIComponent(input));
//   };

//   const decodeURL = () => {
//     if (!validateInput(input)) return;

//     try {
//       const decoded = decodeURIComponent(input);
//       if (!looksLikeURL(decoded)) {
//         setError('Decoded string does not look like a valid URL');
//         setOutput('');
//         return;
//       }
//       setOutput(decoded);
//     } catch {
//       setError('Failed to decode URL');
//       setOutput('');
//     }
//   };

//   // const validateInput = (input) => {
//   //   if (!input || input.trim() === '') {
//   //     setError('Input cannot be empty');
//   //     setOutput('');
//   //     return false;
//   //   }
//   //   setError('');
//   //   return true;
//   // };
  
//   // const encodeURL = () => {
//   //   if (!validateInput(input)) return;
    
//   //   if (!looksLikeURL(input)) {
//   //     setError('Input does not look like a URL');
//   //     setOutput('');
//   //     return;
//   //   }
//   //   setOutput(encodeURIComponent(input));
//   // };
  
//   // const decodeURL = () => {
//   //   if (!validateInput(input)) return;
    
//   //   try {
//   //     const decoded = decodeURIComponent(input);
//   //     if (!looksLikeURL(decoded)) {
//   //       setError('Decoded string does not look like a valid URL');
//   //       setOutput('');
//   //       return;
//   //     }
//   //     setOutput(decoded);
//   //   } catch {
//   //     setError('Failed to decode URL');
//   //     setOutput('');
//   //   }
//   // };



//   // const encodeURL = () => {
//   //   if (!input.trim()) {
//   //     setError('Input cannot be empty');
//   //     setOutput('');
//   //     return;
//   //   }
//   //   if (!looksLikeURL(input)) {
//   //     setError('Input does not look like a URL');
//   //     setOutput('');
//   //     return;
//   //   }
//   //   setError('');
//   //   setOutput(encodeURIComponent(input));
//   // };
  
//   // const decodeURL = () => {
//   //   if (!input.trim()) {
//   //     setError('Input cannot be empty');
//   //     setOutput('');
//   //     return;
//   //   }
//   //   try {
//   //     const decoded = decodeURIComponent(input);
//   //     if (!looksLikeURL(decoded)) {
//   //       setError('Decoded string does not look like a valid URL');
//   //       setOutput('');
//   //       return;
//   //     }
//   //     setError('');
//   //     setOutput(decoded);
//   //   } catch {
//   //     setError('Failed to decode URL');
//   //     setOutput('');
//   //   }
//   // };


//   // const encodeURL = () => {
//   //   const trimmedInput = input.trim();
//   //   if (trimmedInput ===' ') {
//   //     setError('Input cannot be empty');
//   //     setOutput('');
//   //     return;
//   //   }
//   //   if (!looksLikeURL(trimmedInput)) {
//   //     setError('Input does not look like a URL');
//   //     setOutput('');
//   //     return;
//   //   }
//   //   setError('');
//   //   setOutput(encodeURIComponent(trimmedInput));
//   // };
  
//   // const decodeURL = () => {
//   //   const trimmedInput = input.trim();
//   //   if (trimmedInput ===' ') {
//   //     setError('Input cannot be empty');
//   //     setOutput('');
//   //     return;
//   //   }
//   //   try {
//   //     const decoded = decodeURIComponent(trimmedInput);
//   //     if (!looksLikeURL(decoded)) {
//   //       setError('Decoded string does not look like a valid URL');
//   //       setOutput('');
//   //       return;
//   //     }
//   //     setError('');
//   //     setOutput(decoded);
//   //   } catch {
//   //     setError('Failed to decode URL');
//   //     setOutput('');
//   //   }
//   // };

//   // const encodeURL = () => {
//   //   const trimmedInput = input.trim();
//   //   if (!trimmedInput) {
//   //     setError('Input cannot be empty');
//   //     return;
//   //   }
//   //   if (!looksLikeURL(trimmedInput)) {
//   //     setError('Input does not look like a URL');
//   //     return;
//   //   }
//   //   setOutput(encodeURIComponent(trimmedInput));
//   // };
  
//   // const decodeURL = () => {
//   //   const trimmedInput = input.trim();
//   //   if (!trimmedInput) {
//   //     setError('Input cannot be empty');
//   //     return;
//   //   }
//   //   try {
//   //     const decoded = decodeURIComponent(trimmedInput);
//   //     if (!looksLikeURL(decoded)) {
//   //       setError('Decoded string does not look like a valid URL');
//   //       return;
//   //     }
//   //     setOutput(decoded);
//   //   } catch {
//   //     setError('Failed to decode URL');
//   //   }
//   // };

//   // const encodeURL = () => {
//   //   if (!input.trim()) {
//   //     setError('Input cannot be empty');
//   //     return;
//   //   }
//   //   if (!looksLikeURL(input)) {
//   //     setError('Input does not look like a URL');
//   //     return;
//   //   }
//   //   setOutput(encodeURIComponent(input));
//   // };

//   // const decodeURL = () => {
//   //   if (!input.trim()) {
//   //     setError('Input cannot be empty');
//   //     return;
//   //   }
//   //   try {
//   //     const decoded = decodeURIComponent(input);
//   //     if (!looksLikeURL(decoded)) {
//   //       setError('Decoded string does not look like a valid URL');
//   //       return;
//   //     }
//   //     setOutput(decoded);
//   //   } catch {
//   //     setError('Failed to decode URL');
//   //   }
//   // };

//   const reset = () => {
//     setInput('');
//     setOutput('');
//     setError('');
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(output).then(() => {
//       setCopyButtonText('Copied!');  // Change button text to 'Copied!'
//       setTimeout(() => {
//         setCopyButtonText('Copy');  // Revert back to 'Copy' after 5 seconds
//       }, 5000);
//     }).catch(err => {
//       setError('Failed to copy');
//     });
//   };

//   return (
//     <div className={styles.outerContainer}>
//       <div className={styles.container}>
//         <textarea
//           className={styles.inputArea}
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Enter URL here"
//         />
//         <div className={styles.buttonGroup}>
//           {/* <button onClick={encodeURL} disabled={!input.trim() } className={styles.convertButton}>Encode</button>
//           <button onClick={decodeURL} disabled={!input.trim()} className={styles.convertButton}>Decode</button> */}
//           <button 
//           onClick={encodeURL} 
//           disabled={input.trim() === ''} 
//           className={styles.convertButton}
//         >
//           Encode
//         </button>
//         <button 
//           onClick={decodeURL} 
//           disabled={input.trim() === ''} 
//           className={styles.convertButton}
//         >
//           Decode
//         </button>
//           <button onClick={reset} className={styles.resetButton}>Reset</button>
//         </div>
//         {error && <div className={styles.errorMessage}>{error}</div>}
//         {output && (
//           <div className={styles.outputContainer}>
//             <p>{output}</p>
//             <button className={styles.copyButton} onClick={copyToClipboard}>{copyButtonText}</button>
//           </div>
//         )}
//       </div>
//       <div className={styles.rightSide}>
//       <div className={styles.container}>
//       <h1 className={styles.title}>Understanding URL Encoding and Decoding</h1>
//       <h2 className={styles.subtitle}>What is URL Encoding?</h2>
//       <p className={styles.text}>
//         URL encoding, also known as percent-encoding, is a mechanism that encodes information in a Uniform Resource Identifier (URI) by replacing certain characters with one or more character triplets that consist of the percent character % followed by two hexadecimal digits. These digits represent the numeric value of the replaced character.
//       </p>
//       <h2 className={styles.subtitle}>Why is URL Encoding Necessary?</h2>
//       <p className={styles.text}>
//         URLs can only be sent over the Internet using the ASCII character set. Since URLs often contain characters outside the ASCII set, URL encoding is necessary to convert these characters into a format that can be transmitted over the Internet.
//       </p>
//       <h2 className={styles.subtitle}>What is URL Decoding?</h2>
//       <p className={styles.text}>
//         URL decoding is the inverse process of URL encoding. It converts percent-encoded characters back to their original form, essential for correct data interpretation.
//       </p>
//       <h2 className={styles.subtitle}>Common Use Cases</h2>
//       <ul className={styles.text}>
//         <li className={styles.listItem}>
//           <strong>Preparing data for HTTP GET parameters:</strong> Data included in URL parameters must be URL encoded.
//         </li>
//         <li className={styles.listItem}>
//           <strong>Embedding URLs within URLs:</strong> URL encoding prevents misinterpretation when a URL is included as part of another URL.
//         </li>
//       </ul>
//     </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import styles from './URLEncoder.module.css';

export default function URLEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy');  // State to manage copy button text

  useEffect(() => {
    setError('');
    setOutput('');
  }, [input]);

  const looksLikeURL = (str) => {
    return /^(https?:\/\/)?((localhost|([\w-]+\.)+[\w-]+)(:\d+)?)?(\/[\w- .\/?%&=]*)?(\#[\w-]*)?$/i.test(str);
  };

  const validateInput = (input) => {
    if (!input.trim() || input.trim() ==' ') {
      setError('Input cannot be empty');
      setOutput('');
      return false;
    }
    setError('');
    return true;
  };

  const encodeURL = () => {

    if (!validateInput(input)) return;

    if (!looksLikeURL(input)) {
      setError('Input does not look like a URL');
      setOutput('');
      return;
    }
    setOutput(encodeURIComponent(input));
  };

  const decodeURL = () => {
    if (!validateInput(input)) return;

    try {
      const decoded = decodeURIComponent(input);
      if (!looksLikeURL(decoded)) {
        setError('Decoded string does not look like a valid URL');
        setOutput('');
        return;
      }
      setOutput(decoded);
    } catch {
      setError('Failed to decode URL');
      setOutput('');
    }
  };

  const reset = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopyButtonText('Copied!');  // Change button text to 'Copied!'
      setTimeout(() => {
        setCopyButtonText('Copy');  // Revert back to 'Copy' after 5 seconds
      }, 5000);
    }).catch(err => {
      setError('Failed to copy');
    });
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <textarea
          className={styles.inputArea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter URL here"
        />
        <div className={styles.buttonGroup}>
          <button 
            onClick={encodeURL} 
            // disabled={input.trim() === ''} 
            className={styles.convertButton}
          >
            Encode
          </button>
          <button 
            onClick={decodeURL} 
            // disabled={input.trim() === ''} 
            className={styles.convertButton}
          >
            Decode
          </button>
          <button onClick={reset} className={styles.resetButton}>Reset</button>
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {output && (
          <div className={styles.outputContainer}>
            <p>{output}</p>
            <button className={styles.copyButton} onClick={copyToClipboard}>{copyButtonText}</button>
          </div>
        )}
      </div>
      <div className={styles.rightSide}>
        <div className={styles.container}>
          <h1 className={styles.title}>Understanding URL Encoding and Decoding</h1>
          <h2 className={styles.subtitle}>What is URL Encoding?</h2>
          <p className={styles.text}>
            URL encoding, also known as percent-encoding, is a mechanism that encodes information in a Uniform Resource Identifier (URI) by replacing certain characters with one or more character triplets that consist of the percent character % followed by two hexadecimal digits. These digits represent the numeric value of the replaced character.
          </p>
          <h2 className={styles.subtitle}>Why is URL Encoding Necessary?</h2>
          <p className={styles.text}>
            URLs can only be sent over the Internet using the ASCII character set. Since URLs often contain characters outside the ASCII set, URL encoding is necessary to convert these characters into a format that can be transmitted over the Internet.
          </p>
          <h2 className={styles.subtitle}>What is URL Decoding?</h2>
          <p className={styles.text}>
            URL decoding is the inverse process of URL encoding. It converts percent-encoded characters back to their original form, essential for correct data interpretation.
          </p>
          <h2 className={styles.subtitle}>Common Use Cases</h2>
          <ul className={styles.text}>
            <li className={styles.listItem}>
              <strong>Preparing data for HTTP GET parameters:</strong> Data included in URL parameters must be URL encoded.
            </li>
            <li className={styles.listItem}>
              <strong>Embedding URLs within URLs:</strong> URL encoding prevents misinterpretation when a URL is included as part of another URL.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
