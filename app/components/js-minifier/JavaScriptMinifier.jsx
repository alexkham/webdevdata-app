// // // // // // // 'use client'
// // // // // // // import { useState, useCallback } from 'react';
// // // // // // // import { minify } from 'terser';

// // // // // // // export default function JavaScriptMinifier() {
// // // // // // //   const [input, setInput] = useState('');
// // // // // // //   const [output, setOutput] = useState('');
// // // // // // //   const [error, setError] = useState('');
// // // // // // //   const [copyButtonText, setCopyButtonText] = useState('Copy');

// // // // // // //   const handleMinify = async () => {
// // // // // // //     try {
// // // // // // //       const result = await minify(input, {
// // // // // // //         mangle: true,
// // // // // // //         compress: true
// // // // // // //       });
// // // // // // //       setOutput(result.code);
// // // // // // //       setError('');
// // // // // // //     } catch (err) {
// // // // // // //       setError('Error minifying JavaScript: ' + err.message);
// // // // // // //       setOutput('');
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleReset = () => {
// // // // // // //     setInput('');
// // // // // // //     setOutput('');
// // // // // // //     setError('');
// // // // // // //   };

// // // // // // //   const handleCopy = useCallback(() => {
// // // // // // //     navigator.clipboard.writeText(output).then(() => {
// // // // // // //       setCopyButtonText('Copied!');
// // // // // // //       setTimeout(() => setCopyButtonText('Copy'), 5000);
// // // // // // //     });
// // // // // // //   }, [output]);

// // // // // // //   return (
// // // // // // //     <div>
// // // // // // //       <h1>JavaScript Minifier</h1>
// // // // // // //       <textarea
// // // // // // //         rows="10"
// // // // // // //         cols="50"
// // // // // // //         value={input}
// // // // // // //         onChange={(e) => setInput(e.target.value)}
// // // // // // //         placeholder="Paste your JavaScript code here"
// // // // // // //       />
// // // // // // //       <br />
// // // // // // //       <button onClick={handleMinify}>Minify</button>
// // // // // // //       <button onClick={handleReset}>Reset</button>
// // // // // // //       <br />
// // // // // // //       {error && <p style={{ color: 'red' }}>{error}</p>}
// // // // // // //       {output && (
// // // // // // //         <>
// // // // // // //           <h2>Minified Output:</h2>
// // // // // // //           <textarea rows="10" cols="50" value={output} readOnly />
// // // // // // //           <br />
// // // // // // //           <button onClick={handleCopy}>{copyButtonText}</button>
// // // // // // //         </>
// // // // // // //       )}
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }
// // // // // // 'use client'

// // // // // // import { useState, useCallback } from 'react';
// // // // // // import { minify } from 'terser';

// // // // // // export default function JavaScriptMinifier() {
// // // // // //   const [input, setInput] = useState('');
// // // // // //   const [output, setOutput] = useState('');
// // // // // //   const [error, setError] = useState('');
// // // // // //   const [copyButtonText, setCopyButtonText] = useState('Copy');
// // // // // //   const [encoding, setEncoding] = useState('UTF-8');

// // // // // //   const handleMinify = async () => {
// // // // // //     try {
// // // // // //       const result = await minify(input, {
// // // // // //         mangle: true,
// // // // // //         compress: true
// // // // // //       });
      
// // // // // //       // This is where the encoding was supposed to be used, but it's not effective
// // // // // //       const encoder = new TextEncoder(encoding);
// // // // // //       const encodedOutput = encoder.encode(result.code);
// // // // // //       setOutput(new TextDecoder(encoding).decode(encodedOutput));
      
// // // // // //       setError('');
// // // // // //     } catch (err) {
// // // // // //       setError('Error minifying JavaScript: ' + err.message);
// // // // // //       setOutput('');
// // // // // //     }
// // // // // //   };

// // // // // //   const handleReset = () => {
// // // // // //     setInput('');
// // // // // //     setOutput('');
// // // // // //     setError('');
// // // // // //   };

// // // // // //   const handleCopy = useCallback(() => {
// // // // // //     navigator.clipboard.writeText(output).then(() => {
// // // // // //       setCopyButtonText('Copied!');
// // // // // //       setTimeout(() => setCopyButtonText('Copy'), 5000);
// // // // // //     });
// // // // // //   }, [output]);

// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h1>JavaScript Minifier</h1>
// // // // // //       <select value={encoding} onChange={(e) => setEncoding(e.target.value)}>
// // // // // //         <option value="UTF-8">UTF-8</option>
// // // // // //         <option value="UTF-16">UTF-16</option>
// // // // // //         <option value="ASCII">ASCII</option>
// // // // // //       </select>
// // // // // //       <br />
// // // // // //       <textarea
// // // // // //         rows="10"
// // // // // //         cols="50"
// // // // // //         value={input}
// // // // // //         onChange={(e) => setInput(e.target.value)}
// // // // // //         placeholder="Paste your JavaScript code here"
// // // // // //       />
// // // // // //       <br />
// // // // // //       <button onClick={handleMinify}>Minify</button>
// // // // // //       <button onClick={handleReset}>Reset</button>
// // // // // //       <br />
// // // // // //       {error && <p style={{ color: 'red' }}>{error}</p>}
// // // // // //       {output && (
// // // // // //         <>
// // // // // //           <h2>Minified Output:</h2>
// // // // // //           <textarea rows="10" cols="50" value={output} readOnly />
// // // // // //           <br />
// // // // // //           <button onClick={handleCopy}>{copyButtonText}</button>
// // // // // //         </>
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // 'use client'

// // // // // import { useState, useCallback } from 'react';
// // // // // import { minify } from 'terser';

// // // // // export default function JavaScriptMinifier() {
// // // // //   const [input, setInput] = useState('');
// // // // //   const [output, setOutput] = useState('');
// // // // //   const [error, setError] = useState('');
// // // // //   const [copyButtonText, setCopyButtonText] = useState('Copy');
// // // // //   const [encoding, setEncoding] = useState('UTF-8');

// // // // //   const handleMinify = async () => {
// // // // //     try {
// // // // //       const result = await minify(input, {
// // // // //         mangle: true,
// // // // //         compress: true
// // // // //       });
// // // // //       setOutput(result.code);
// // // // //       setError('');
// // // // //     } catch (err) {
// // // // //       setError('Error minifying JavaScript: ' + err.message);
// // // // //       setOutput('');
// // // // //     }
// // // // //   };

// // // // //   const handleReset = () => {
// // // // //     setInput('');
// // // // //     setOutput('');
// // // // //     setError('');
// // // // //   };

// // // // //   const handleCopy = useCallback(() => {
// // // // //     navigator.clipboard.writeText(output).then(() => {
// // // // //       setCopyButtonText('Copied!');
// // // // //       setTimeout(() => setCopyButtonText('Copy'), 5000);
// // // // //     });
// // // // //   }, [output]);

// // // // //   return (
// // // // //     <div>
// // // // //       <h1>JavaScript Minifier</h1>
// // // // //       <select 
// // // // //         id="encoding" 
// // // // //         name="encoding" 
// // // // //         className="form-select"
// // // // //         value={encoding}
// // // // //         onChange={(e) => setEncoding(e.target.value)}
// // // // //       >
// // // // //         <option value="ISO-8859-1">ISO-8859-1 (Latin Alphabet No. 1)</option>
// // // // //         <option value="ISO-8859-2">ISO-8859-2 (Latin Alphabet No. 2)</option>
// // // // //         <option value="ISO-8859-3">ISO-8859-3 (Latin Alphabet No. 3)</option>
// // // // //         <option value="ISO-8859-4">ISO-8859-4 (Latin Alphabet No. 4)</option>
// // // // //         <option value="ISO-8859-5">ISO-8859-5 (Latin/Cyrillic Alphabet)</option>
// // // // //         <option value="ISO-8859-6">ISO-8859-6 (Latin/Arabic Alphabet)</option>
// // // // //         <option value="ISO-8859-7">ISO-8859-7 (Latin/Greek Alphabet)</option>
// // // // //         <option value="ISO-8859-8">ISO-8859-8 (Latin/Hebrew Alphabet)</option>
// // // // //         <option value="ISO-8859-9">ISO-8859-9 (Latin Alphabet No. 5)</option>
// // // // //         <option value="ISO-8859-13">ISO-8859-13 (Latin Alphabet No. 7)</option>
// // // // //         <option value="ISO-8859-15">ISO-8859-15 (Latin Alphabet No. 9)</option>
// // // // //         <option value="UTF-8" selected="selected">UTF-8</option>
// // // // //         <option value="UTF-16">UTF-16</option>
// // // // //         <option value="UTF-16BE">UTF-16 (Big-Endian)</option>
// // // // //         <option value="UTF-16LE">UTF-16 (Little-Endian)</option>
// // // // //         <option value="UTF-32">UTF-32</option>
// // // // //         <option value="UTF-32BE">UTF-32 (Big-Endian)</option>
// // // // //         <option value="UTF-32LE">UTF-32 (Little-Endian)</option>
// // // // //         <option value="US-ASCII">US-ASCII</option>
// // // // //         <option value="windows-1250">windows-1250 (Windows Eastern European)</option>
// // // // //         <option value="windows-1251">windows-1251 (Windows Cyrillic)</option>
// // // // //         <option value="windows-1252">windows-1252 (Windows Latin-1)</option>
// // // // //         <option value="windows-1253">windows-1253 (Windows Greek)</option>
// // // // //         <option value="windows-1254">windows-1254 (Windows Turkish)</option>
// // // // //         <option value="windows-1255">windows-1255 (Windows Hebrew)</option>
// // // // //         <option value="windows-1256">windows-1256 (Windows Arabic)</option>
// // // // //         <option value="windows-1257">windows-1257 (Windows Baltic)</option>
// // // // //         <option value="windows-1258">windows-1257 (Windows Vietnamese)</option>
// // // // //       </select>
// // // // //       <br />
// // // // //       <textarea
// // // // //         rows="10"
// // // // //         cols="50"
// // // // //         value={input}
// // // // //         onChange={(e) => setInput(e.target.value)}
// // // // //         placeholder="Paste your JavaScript code here"
// // // // //       />
// // // // //       <br />
// // // // //       <button onClick={handleMinify}>Minify</button>
// // // // //       <button onClick={handleReset}>Reset</button>
// // // // //       <br />
// // // // //       {error && <p style={{ color: 'red' }}>{error}</p>}
// // // // //       {output && (
// // // // //         <>
// // // // //           <h2>Minified Output:</h2>
// // // // //           <textarea rows="10" cols="50" value={output} readOnly />
// // // // //           <br />
// // // // //           <button onClick={handleCopy}>{copyButtonText}</button>
// // // // //         </>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // 'use client'

// // // // import { useState, useCallback } from 'react';
// // // // import { minify } from 'terser';
// // // // import iconv from 'iconv-lite';

// // // // export default function JavaScriptMinifier() {
// // // //   const [input, setInput] = useState('');
// // // //   const [output, setOutput] = useState('');
// // // //   const [error, setError] = useState('');
// // // //   const [copyButtonText, setCopyButtonText] = useState('Copy');
// // // //   const [encoding, setEncoding] = useState('UTF-8');

// // // //   const handleMinify = async () => {
// // // //     try {
// // // //       const result = await minify(input, {
// // // //         mangle: true,
// // // //         compress: true
// // // //       });
      
// // // //       // Convert the minified code to the selected encoding
// // // //       const buffer = iconv.encode(result.code, encoding);
// // // //       // Convert back to a string for display
// // // //       const encodedOutput = iconv.decode(buffer, encoding);
      
// // // //       setOutput(encodedOutput);
// // // //       setError('');
// // // //     } catch (err) {
// // // //       setError('Error minifying JavaScript: ' + err.message);
// // // //       setOutput('');
// // // //     }
// // // //   };

// // // //   const handleReset = () => {
// // // //     setInput('');
// // // //     setOutput('');
// // // //     setError('');
// // // //   };

// // // //   const handleCopy = useCallback(() => {
// // // //     navigator.clipboard.writeText(output).then(() => {
// // // //       setCopyButtonText('Copied!');
// // // //       setTimeout(() => setCopyButtonText('Copy'), 5000);
// // // //     });
// // // //   }, [output]);

// // // //   const handleDownload = () => {
// // // //     const blob = new Blob([iconv.encode(output, encoding)], { type: 'application/javascript' });
// // // //     const url = URL.createObjectURL(blob);
// // // //     const a = document.createElement('a');
// // // //     a.href = url;
// // // //     a.download = `minified_${encoding}.js`;
// // // //     document.body.appendChild(a);
// // // //     a.click();
// // // //     document.body.removeChild(a);
// // // //     URL.revokeObjectURL(url);
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <h1>JavaScript Minifier</h1>
// // // //       <select 
// // // //         id="encoding" 
// // // //         name="encoding" 
// // // //         className="form-select"
// // // //         value={encoding}
// // // //         onChange={(e) => setEncoding(e.target.value)}
// // // //       >
// // // //         <option value="ISO-8859-1">ISO-8859-1 (Latin Alphabet No. 1)</option>
// // // //         <option value="ISO-8859-2">ISO-8859-2 (Latin Alphabet No. 2)</option>
// // // //         <option value="ISO-8859-3">ISO-8859-3 (Latin Alphabet No. 3)</option>
// // // //         <option value="ISO-8859-4">ISO-8859-4 (Latin Alphabet No. 4)</option>
// // // //         <option value="ISO-8859-5">ISO-8859-5 (Latin/Cyrillic Alphabet)</option>
// // // //         <option value="ISO-8859-6">ISO-8859-6 (Latin/Arabic Alphabet)</option>
// // // //         <option value="ISO-8859-7">ISO-8859-7 (Latin/Greek Alphabet)</option>
// // // //         <option value="ISO-8859-8">ISO-8859-8 (Latin/Hebrew Alphabet)</option>
// // // //         <option value="ISO-8859-9">ISO-8859-9 (Latin Alphabet No. 5)</option>
// // // //         <option value="ISO-8859-13">ISO-8859-13 (Latin Alphabet No. 7)</option>
// // // //         <option value="ISO-8859-15">ISO-8859-15 (Latin Alphabet No. 9)</option>
// // // //         <option value="UTF-8" selected="selected">UTF-8</option>
// // // //         <option value="UTF-16">UTF-16</option>
// // // //         <option value="UTF-16BE">UTF-16 (Big-Endian)</option>
// // // //         <option value="UTF-16LE">UTF-16 (Little-Endian)</option>
// // // //         <option value="UTF-32">UTF-32</option>
// // // //         <option value="UTF-32BE">UTF-32 (Big-Endian)</option>
// // // //         <option value="UTF-32LE">UTF-32 (Little-Endian)</option>
// // // //         <option value="US-ASCII">US-ASCII</option>
// // // //         <option value="windows-1250">windows-1250 (Windows Eastern European)</option>
// // // //         <option value="windows-1251">windows-1251 (Windows Cyrillic)</option>
// // // //         <option value="windows-1252">windows-1252 (Windows Latin-1)</option>
// // // //         <option value="windows-1253">windows-1253 (Windows Greek)</option>
// // // //         <option value="windows-1254">windows-1254 (Windows Turkish)</option>
// // // //         <option value="windows-1255">windows-1255 (Windows Hebrew)</option>
// // // //         <option value="windows-1256">windows-1256 (Windows Arabic)</option>
// // // //         <option value="windows-1257">windows-1257 (Windows Baltic)</option>
// // // //         <option value="windows-1258">windows-1257 (Windows Vietnamese)</option>
// // // //       </select>
// // // //       <br />
// // // //       <textarea
// // // //         rows="10"
// // // //         cols="50"
// // // //         value={input}
// // // //         onChange={(e) => setInput(e.target.value)}
// // // //         placeholder="Paste your JavaScript code here"
// // // //       />
// // // //       <br />
// // // //       <button onClick={handleMinify}>Minify</button>
// // // //       <button onClick={handleReset}>Reset</button>
// // // //       <br />
// // // //       {error && <p style={{ color: 'red' }}>{error}</p>}
// // // //       {output && (
// // // //         <>
// // // //           <h2>Minified Output:</h2>
// // // //           <textarea rows="10" cols="50" value={output} readOnly />
// // // //           <br />
// // // //           <button onClick={handleCopy}>{copyButtonText}</button>
// // // //           <button onClick={handleDownload}>Download</button>
// // // //         </>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }
// // // 'use client'

// // // import { useState, useCallback } from 'react';
// // // import { minify } from 'terser';
// // // import iconv from 'iconv-lite';

// // // export default function JavaScriptMinifier() {
// // //   const [input, setInput] = useState('');
// // //   const [output, setOutput] = useState('');
// // //   const [error, setError] = useState('');
// // //   const [copyButtonText, setCopyButtonText] = useState('Copy');
// // //   const [encoding, setEncoding] = useState('UTF-8');

// // //   const handleMinify = async () => {
// // //     try {
// // //       const result = await minify(input, {
// // //         mangle: true,
// // //         compress: true
// // //       });
      
// // //       const buffer = iconv.encode(result.code, encoding);
// // //       const encodedOutput = iconv.decode(buffer, encoding);
      
// // //       setOutput(encodedOutput);
// // //       setError('');
// // //     } catch (err) {
// // //       setError('Error minifying JavaScript: ' + err.message);
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
// // //     });
// // //   }, [output]);

// // //   const handleDownload = () => {
// // //     const blob = new Blob([iconv.encode(output, encoding)], { type: 'application/javascript' });
// // //     const url = URL.createObjectURL(blob);
// // //     const a = document.createElement('a');
// // //     a.href = url;
// // //     a.download = `minified_${encoding}.js`;
// // //     document.body.appendChild(a);
// // //     a.click();
// // //     document.body.removeChild(a);
// // //     URL.revokeObjectURL(url);
// // //   };

// // //   return (
// // //     <div>
// // //       <h1>JavaScript Minifier</h1>
// // //       <div title="Select the character encoding for the output. This determines how characters are represented in the minified code.">
// // //         <select 
// // //           id="encoding" 
// // //           name="encoding" 
// // //           className="form-select"
// // //           value={encoding}
// // //           onChange={(e) => setEncoding(e.target.value)}
// // //         >
// // //           <option value="ISO-8859-1">ISO-8859-1 (Latin Alphabet No. 1)</option>
// // //           <option value="ISO-8859-2">ISO-8859-2 (Latin Alphabet No. 2)</option>
// // //           <option value="ISO-8859-3">ISO-8859-3 (Latin Alphabet No. 3)</option>
// // //           <option value="ISO-8859-4">ISO-8859-4 (Latin Alphabet No. 4)</option>
// // //           <option value="ISO-8859-5">ISO-8859-5 (Latin/Cyrillic Alphabet)</option>
// // //           <option value="ISO-8859-6">ISO-8859-6 (Latin/Arabic Alphabet)</option>
// // //           <option value="ISO-8859-7">ISO-8859-7 (Latin/Greek Alphabet)</option>
// // //           <option value="ISO-8859-8">ISO-8859-8 (Latin/Hebrew Alphabet)</option>
// // //           <option value="ISO-8859-9">ISO-8859-9 (Latin Alphabet No. 5)</option>
// // //           <option value="ISO-8859-13">ISO-8859-13 (Latin Alphabet No. 7)</option>
// // //           <option value="ISO-8859-15">ISO-8859-15 (Latin Alphabet No. 9)</option>
// // //           <option value="UTF-8">UTF-8</option>
// // //           <option value="UTF-16">UTF-16</option>
// // //           <option value="UTF-16BE">UTF-16 (Big-Endian)</option>
// // //           <option value="UTF-16LE">UTF-16 (Little-Endian)</option>
// // //           <option value="UTF-32">UTF-32</option>
// // //           <option value="UTF-32BE">UTF-32 (Big-Endian)</option>
// // //           <option value="UTF-32LE">UTF-32 (Little-Endian)</option>
// // //           <option value="US-ASCII">US-ASCII</option>
// // //           <option value="windows-1250">windows-1250 (Windows Eastern European)</option>
// // //           <option value="windows-1251">windows-1251 (Windows Cyrillic)</option>
// // //           <option value="windows-1252">windows-1252 (Windows Latin-1)</option>
// // //           <option value="windows-1253">windows-1253 (Windows Greek)</option>
// // //           <option value="windows-1254">windows-1254 (Windows Turkish)</option>
// // //           <option value="windows-1255">windows-1255 (Windows Hebrew)</option>
// // //           <option value="windows-1256">windows-1256 (Windows Arabic)</option>
// // //           <option value="windows-1257">windows-1257 (Windows Baltic)</option>
// // //           <option value="windows-1258">windows-1257 (Windows Vietnamese)</option>
// // //         </select>
// // //       </div>
      
// // //       <textarea
// // //         rows="10"
// // //         cols="50"
// // //         value={input}
// // //         onChange={(e) => setInput(e.target.value)}
// // //         placeholder="Paste your JavaScript code here"
// // //       />
// // //       <br />
// // //       <button onClick={handleMinify}>Minify</button>
// // //       <button onClick={handleReset}>Reset</button>
// // //       <br />
// // //       {error && <p style={{ color: 'red' }}>{error}</p>}
// // //       {output && (
// // //         <>
// // //           <h2>Minified Output:</h2>
// // //           <textarea rows="10" cols="50" value={output} readOnly />
// // //           <br />
// // //           <button onClick={handleCopy}>{copyButtonText}</button>
// // //           <button onClick={handleDownload}>Download</button>
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // }
// // 'use client'

// // import { useState, useCallback } from 'react';
// // import { minify } from 'terser';
// // import iconv from 'iconv-lite';
// // import styles from './JavaScriptMinifier.module.css';

// // export default function JavaScriptMinifier() {
// //   const [input, setInput] = useState('');
// //   const [output, setOutput] = useState('');
// //   const [error, setError] = useState('');
// //   const [copyButtonText, setCopyButtonText] = useState('Copy');
// //   const [encoding, setEncoding] = useState('UTF-8');

// //   const MAX_INPUT_LENGTH = 50000;

// //   const handleMinify = async () => {
// //     try {
// //       if (!input.trim()) {
// //         throw new Error('Input cannot be empty');
// //       }
// //       if (input.length > MAX_INPUT_LENGTH) {
// //         throw new Error(`Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
// //       }

// //       const result = await minify(input, {
// //         mangle: true,
// //         compress: true
// //       });
      
// //       const buffer = iconv.encode(result.code, encoding);
// //       const encodedOutput = iconv.decode(buffer, encoding);
      
// //       setOutput(encodedOutput);
// //       setError('');
// //     } catch (err) {
// //       setError('Error minifying JavaScript: ' + err.message);
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
// //               placeholder="Enter JavaScript code here"
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
// //                   <option value="UTF-8">UTF-8</option>
// //                   <option value="UTF-16">UTF-16</option>
// //                   <option value="ASCII">ASCII</option>
// //                   {/* Add more encoding options as needed */}
// //                 </select>
// //                 <span className={styles.tooltipIcon} title="Select the character encoding for the output. This determines how characters are represented in the minified code.">?</span>
// //               </div>
// //               {error && <div className={styles.errorMessage}>{error}</div>}
// //             </div>
// //           </div>
// //           <div className={styles.column}>
// //             <h2 className={styles.subtitle}>Output</h2>
// //             <div className={styles.outputContainer}>
// //               <button className={styles.copyButton} onClick={handleCopy}>{copyButtonText}</button>
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
// import { minify } from 'terser';
// import iconv from 'iconv-lite';
// import styles from './JavaScriptMinifier.module.css';

// export default function JavaScriptMinifier() {
//   const [input, setInput] = useState('');
//   const [output, setOutput] = useState('');
//   const [error, setError] = useState('');
//   const [copyButtonText, setCopyButtonText] = useState('Copy');
//   const [encoding, setEncoding] = useState('UTF-8');

//   const MAX_INPUT_LENGTH = 50000;

//   const handleMinify = async () => {
//     try {
//       if (!input.trim()) {
//         throw new Error('Input cannot be empty');
//       }
//       if (input.length > MAX_INPUT_LENGTH) {
//         throw new Error(`Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
//       }

//       const result = await minify(input, {
//         mangle: true,
//         compress: true
//       });
      
//       const buffer = iconv.encode(result.code, encoding);
//       const encodedOutput = iconv.decode(buffer, encoding);
      
//       setOutput(encodedOutput);
//       setError('');
//     } catch (err) {
//       setError('Error minifying JavaScript: ' + err.message);
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
//               placeholder="Enter JavaScript code here"
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
//                   <option value="UTF-8" selected="selected">UTF-8</option>
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
//                   <option value="windows-1258">windows-1257 (Windows Vietnamese)</option>
//                 </select>
//                 <div className={styles.tooltipContainer}>
//                   <span className={styles.tooltipIcon}>?</span>
//                   <span className={styles.tooltipText}>Select the character encoding for the output. This determines how characters are represented in the minified code.</span>
//                 </div>
//               </div>
//               {/* {error && <div className={styles.errorMessage}>{error}</div>} */}
//             </div>
//             {error && <div className={styles.errorMessage}>{error}</div>}
//           </div>
//           <div className={styles.column}>
//             <h2 className={styles.subtitle}>Output</h2>
//             <div className={styles.outputContainer}>
//               <button className={styles.copyButton} onClick={handleCopy}>{copyButtonText}</button>
//               <p className={styles.text}>{output}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client'

import { useState, useCallback } from 'react';
import { minify } from 'terser';
import iconv from 'iconv-lite';
import styles from './JavaScriptMinifier.module.css';

export default function JavaScriptMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const [encoding, setEncoding] = useState('UTF-8');

  const MAX_INPUT_LENGTH = 50000;

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
      validateInput(input);
      const result = await minify(input, {
        mangle: true,
        compress: true
      });
      
      const buffer = iconv.encode(result.code, encoding);
      const encodedOutput = iconv.decode(buffer, encoding);
      
      setOutput(encodedOutput);
      setError('');
    } catch (err) {
      setError('Error minifying JavaScript: ' + err.message);
      setOutput('');
    }
  };

  const handleReset = () => {
    setInput('');
    setOutput('');
    setError('');
    setCopyButtonText('Copy');
    setEncoding('UTF-8');
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy'), 5000);
    }).catch(() => {
      setError('Failed to copy to clipboard');
    });
  }, [output]);

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <div className={styles.columnsContainer}>
          <div className={styles.column}>
            <h2 className={styles.subtitle}>Input</h2>
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
              placeholder="Enter JavaScript code here"
            />
            <div className={styles.charCount}>
              {input.length} / {MAX_INPUT_LENGTH}
              {input.length > MAX_INPUT_LENGTH * 0.9 && 
                <span className={styles.warning}> (Approaching limit)</span>}
            </div>
            <div className={styles.buttonGroup}>
              <div className={styles.buttonContainer}>
                <button className={`${styles.button} ${styles.convertButton}`} onClick={handleMinify}>Minify</button>
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
                  <option value="ISO-8859-1">ISO-8859-1 (Latin Alphabet No. 1)</option>
                  <option value="ISO-8859-2">ISO-8859-2 (Latin Alphabet No. 2)</option>
                  <option value="ISO-8859-3">ISO-8859-3 (Latin Alphabet No. 3)</option>
                  <option value="ISO-8859-4">ISO-8859-4 (Latin Alphabet No. 4)</option>
                  <option value="ISO-8859-5">ISO-8859-5 (Latin/Cyrillic Alphabet)</option>
                  <option value="ISO-8859-6">ISO-8859-6 (Latin/Arabic Alphabet)</option>
                  <option value="ISO-8859-7">ISO-8859-7 (Latin/Greek Alphabet)</option>
                  <option value="ISO-8859-8">ISO-8859-8 (Latin/Hebrew Alphabet)</option>
                  <option value="ISO-8859-9">ISO-8859-9 (Latin Alphabet No. 5)</option>
                  <option value="ISO-8859-13">ISO-8859-13 (Latin Alphabet No. 7)</option>
                  <option value="ISO-8859-15">ISO-8859-15 (Latin Alphabet No. 9)</option>
                  <option value="UTF-8" selected="selected">UTF-8</option>
                  <option value="UTF-16">UTF-16</option>
                  <option value="UTF-16BE">UTF-16 (Big-Endian)</option>
                  <option value="UTF-16LE">UTF-16 (Little-Endian)</option>
                  <option value="UTF-32">UTF-32</option>
                  <option value="UTF-32BE">UTF-32 (Big-Endian)</option>
                  <option value="UTF-32LE">UTF-32 (Little-Endian)</option>
                  <option value="US-ASCII">US-ASCII</option>
                  <option value="windows-1250">windows-1250 (Windows Eastern European)</option>
                  <option value="windows-1251">windows-1251 (Windows Cyrillic)</option>
                  <option value="windows-1252">windows-1252 (Windows Latin-1)</option>
                  <option value="windows-1253">windows-1253 (Windows Greek)</option>
                  <option value="windows-1254">windows-1254 (Windows Turkish)</option>
                  <option value="windows-1255">windows-1255 (Windows Hebrew)</option>
                  <option value="windows-1256">windows-1256 (Windows Arabic)</option>
                  <option value="windows-1257">windows-1257 (Windows Baltic)</option>
                  <option value="windows-1258">windows-1257 (Windows Vietnamese)</option>
                </select>
                <div className={styles.tooltipContainer}>
                  <span className={styles.tooltipIcon}>?</span>
                  <span className={styles.tooltipText}>Select the character encoding for the output. This determines how characters are represented in the minified code.</span>
                </div>
              </div>
              {/* {error && <div className={styles.errorMessage}>{error}</div>} */}
            </div>
            {error && <div className={styles.errorMessage}>{error}</div>}
          </div>
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="13 17 18 12 13 7"></polyline>
            <polyline points="6 17 11 12 6 7"></polyline>
          </svg> */}
          <div className={styles.column}>
            <h2 className={styles.subtitle}>Output</h2>
            <div className={styles.outputContainer}>
              <button className={styles.copyButton} onClick={handleCopy}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>{copyButtonText}</button>
              <p  className={styles.text}>{output}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}