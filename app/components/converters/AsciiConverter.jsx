// // // // // // // // // 'use client'
// // // // // // // // // import React, { useState } from 'react';

// // // // // // // // // const AsciiConverter = () => {
// // // // // // // // //   const [input, setInput] = useState('');
// // // // // // // // //   const [decimal, setDecimal] = useState('');
// // // // // // // // //   const [binary, setBinary] = useState('');
// // // // // // // // //   const [octal, setOctal] = useState('');
// // // // // // // // //   const [hexadecimal, setHexadecimal] = useState('');

// // // // // // // // //   const handleInputChange = (value, base) => {
// // // // // // // // //     let decimalValue = parseInt(value, base);
// // // // // // // // //     if (isNaN(decimalValue)) {
// // // // // // // // //       setDecimal('');
// // // // // // // // //       setBinary('');
// // // // // // // // //       setOctal('');
// // // // // // // // //       setHexadecimal('');
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     setDecimal(decimalValue.toString(10));
// // // // // // // // //     setBinary(decimalValue.toString(2));
// // // // // // // // //     setOctal(decimalValue.toString(8));
// // // // // // // // //     setHexadecimal(decimalValue.toString(16).toUpperCase());
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <div>
// // // // // // // // //       <h1>ASCII Converter</h1>
// // // // // // // // //       <input
// // // // // // // // //         type="text"
// // // // // // // // //         placeholder="Enter text"
// // // // // // // // //         onChange={(e) => handleInputChange(e.target.value.charCodeAt(0) || '', 10)}
// // // // // // // // //       />
// // // // // // // // //       <input
// // // // // // // // //         type="text"
// // // // // // // // //         placeholder="Decimal"
// // // // // // // // //         value={decimal}
// // // // // // // // //         onChange={(e) => handleInputChange(e.target.value, 10)}
// // // // // // // // //       />
// // // // // // // // //       <input
// // // // // // // // //         type="text"
// // // // // // // // //         placeholder="Binary"
// // // // // // // // //         value={binary}
// // // // // // // // //         onChange={(e) => handleInputChange(e.target.value, 2)}
// // // // // // // // //       />
// // // // // // // // //       <input
// // // // // // // // //         type="text"
// // // // // // // // //         placeholder="Octal"
// // // // // // // // //         value={octal}
// // // // // // // // //         onChange={(e) => handleInputChange(e.target.value, 8)}
// // // // // // // // //       />
// // // // // // // // //       <input
// // // // // // // // //         type="text"
// // // // // // // // //         placeholder="Hexadecimal"
// // // // // // // // //         value={hexadecimal}
// // // // // // // // //         onChange={(e) => handleInputChange(e.target.value, 16)}
// // // // // // // // //       />
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default AsciiConverter;
// // // // // // // // 'use client';
// // // // // // // // import React, { useState } from 'react';

// // // // // // // // const AsciiConverter = () => {
// // // // // // // //   const [input, setInput] = useState('');
// // // // // // // //   const [decimal, setDecimal] = useState('');
// // // // // // // //   const [binary, setBinary] = useState('');
// // // // // // // //   const [octal, setOctal] = useState('');
// // // // // // // //   const [hexadecimal, setHexadecimal] = useState('');
// // // // // // // //   const [base64, setBase64] = useState('');

// // // // // // // //   const handleInputChange = (value) => {
// // // // // // // //     setInput(value);
// // // // // // // //     const code = value.charCodeAt(0) || '';
// // // // // // // //     updateConversions(code, value);
// // // // // // // //   };

// // // // // // // //   const updateConversions = (decimalValue, fullString) => {
// // // // // // // //     if (decimalValue === '') {
// // // // // // // //       setDecimal('');
// // // // // // // //       setBinary('');
// // // // // // // //       setOctal('');
// // // // // // // //       setHexadecimal('');
// // // // // // // //       setBase64('');
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     setDecimal(decimalValue.toString(10));
// // // // // // // //     setBinary(decimalValue.toString(2));
// // // // // // // //     setOctal(decimalValue.toString(8));
// // // // // // // //     setHexadecimal(decimalValue.toString(16).toUpperCase());
// // // // // // // //     setBase64(btoa(fullString)); // Convert the whole string to Base64
// // // // // // // //   };

// // // // // // // //   const reset = () => {
// // // // // // // //     setInput('');
// // // // // // // //     setDecimal('');
// // // // // // // //     setBinary('');
// // // // // // // //     setOctal('');
// // // // // // // //     setHexadecimal('');
// // // // // // // //     setBase64('');
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <div>
// // // // // // // //       <h1>ASCII Converter</h1>
// // // // // // // //       <label>Text Input:</label>
// // // // // // // //       <input
// // // // // // // //         type="text"
// // // // // // // //         placeholder="Enter text"
// // // // // // // //         value={input}
// // // // // // // //         onChange={(e) => handleInputChange(e.target.value)}
// // // // // // // //       />
// // // // // // // //       <label>Decimal:</label>
// // // // // // // //       <input
// // // // // // // //         type="text"
// // // // // // // //         placeholder="Decimal"
// // // // // // // //         value={decimal}
// // // // // // // //         readOnly
// // // // // // // //       />
// // // // // // // //       <label>Binary:</label>
// // // // // // // //       <input
// // // // // // // //         type="text"
// // // // // // // //         placeholder="Binary"
// // // // // // // //         value={binary}
// // // // // // // //         readOnly
// // // // // // // //       />
// // // // // // // //       <label>Octal:</label>
// // // // // // // //       <input
// // // // // // // //         type="text"
// // // // // // // //         placeholder="Octal"
// // // // // // // //         value={octal}
// // // // // // // //         readOnly
// // // // // // // //       />
// // // // // // // //       <label>Hexadecimal:</label>
// // // // // // // //       <input
// // // // // // // //         type="text"
// // // // // // // //         placeholder="Hexadecimal"
// // // // // // // //         value={hexadecimal}
// // // // // // // //         readOnly
// // // // // // // //       />
// // // // // // // //       <label>Base64:</label>
// // // // // // // //       <input
// // // // // // // //         type="text"
// // // // // // // //         placeholder="Base64"
// // // // // // // //         value={base64}
// // // // // // // //         readOnly
// // // // // // // //       />
// // // // // // // //       <button onClick={reset}>Reset</button>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default AsciiConverter;
// // // // // // // 'use client';
// // // // // // // import React, { useState } from 'react';

// // // // // // // const AsciiConverter = () => {
// // // // // // //   const [input, setInput] = useState('');
// // // // // // //   const [output, setOutput] = useState({
// // // // // // //     asciiValues: '',
// // // // // // //     binary: '',
// // // // // // //     octal: '',
// // // // // // //     hexadecimal: '',
// // // // // // //     base64: ''
// // // // // // //   });

// // // // // // //   const handleInputChange = (value) => {
// // // // // // //     setInput(value);
// // // // // // //     processConversions(value);
// // // // // // //   };

// // // // // // //   const processConversions = (value) => {
// // // // // // //     // Reset outputs first
// // // // // // //     setOutput({
// // // // // // //       asciiValues: '',
// // // // // // //       binary: '',
// // // // // // //       octal: '',
// // // // // // //       hexadecimal: '',
// // // // // // //       base64: ''
// // // // // // //     });

// // // // // // //     // Process ASCII values for the whole string
// // // // // // //     const asciiValues = value.split('').map(char => char.charCodeAt(0)).join(' ');
// // // // // // //     const base64Value = btoa(value);

// // // // // // //     // Attempt to interpret the input as a number for binary, octal, and hexadecimal conversions
// // // // // // //     const numericValue = parseInt(value);
// // // // // // //     const isNumeric = !isNaN(numericValue);

// // // // // // //     setOutput({
// // // // // // //       asciiValues: asciiValues,
// // // // // // //       binary: isNumeric ? numericValue.toString(2) : '',
// // // // // // //       octal: isNumeric ? numericValue.toString(8) : '',
// // // // // // //       hexadecimal: isNumeric ? numericValue.toString(16).toUpperCase() : '',
// // // // // // //       base64: base64Value
// // // // // // //     });
// // // // // // //   };

// // // // // // //   const reset = () => {
// // // // // // //     setInput('');
// // // // // // //     setOutput({
// // // // // // //       asciiValues: '',
// // // // // // //       binary: '',
// // // // // // //       octal: '',
// // // // // // //       hexadecimal: '',
// // // // // // //       base64: ''
// // // // // // //     });
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div>
// // // // // // //       <h1>ASCII Converter</h1>
// // // // // // //       <label>Input:</label>
// // // // // // //       <input
// // // // // // //         type="text"
// // // // // // //         placeholder="Enter text or number"
// // // // // // //         value={input}
// // // // // // //         onChange={(e) => handleInputChange(e.target.value)}
// // // // // // //       />
// // // // // // //       <label>ASCII Values:</label>
// // // // // // //       <input
// // // // // // //         type="text"
// // // // // // //         placeholder="ASCII Values"
// // // // // // //         value={output.asciiValues}
// // // // // // //         readOnly
// // // // // // //       />
// // // // // // //       <label>Binary:</label>
// // // // // // //       <input
// // // // // // //         type="text"
// // // // // // //         placeholder="Binary"
// // // // // // //         value={output.binary}
// // // // // // //         readOnly
// // // // // // //       />
// // // // // // //       <label>Octal:</label>
// // // // // // //       <input
// // // // // // //         type="text"
// // // // // // //         placeholder="Octal"
// // // // // // //         value={output.octal}
// // // // // // //         readOnly
// // // // // // //       />
// // // // // // //       <label>Hexadecimal:</label>
// // // // // // //       <input
// // // // // // //         type="text"
// // // // // // //         placeholder="Hexadecimal"
// // // // // // //         value={output.hexadecimal}
// // // // // // //         readOnly
// // // // // // //       />
// // // // // // //       <label>Base64:</label>
// // // // // // //       <input
// // // // // // //         type="text"
// // // // // // //         placeholder="Base64"
// // // // // // //         value={output.base64}
// // // // // // //         readOnly
// // // // // // //       />
// // // // // // //       <button onClick={reset}>Reset</button>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default AsciiConverter;
// // // // // // // 'use client';
// // // // // // // import React, { useState, useCallback } from 'react';

// // // // // // // const AsciiConverter = () => {
// // // // // // //   const [input, setInput] = useState('');
// // // // // // //   const [output, setOutput] = useState({
// // // // // // //     asciiValues: '',
// // // // // // //     binary: '',
// // // // // // //     octal: '',
// // // // // // //     hexadecimal: '',
// // // // // // //     base64: ''
// // // // // // //   });
// // // // // // //   const [error, setError] = useState('');

// // // // // // //   const handleInputChange = useCallback((value) => {
// // // // // // //     setInput(value);
// // // // // // //     processConversions(value);
// // // // // // //   }, []);

// // // // // // //   const processConversions = useCallback((value) => {
// // // // // // //     setError('');
// // // // // // //     setOutput({
// // // // // // //       asciiValues: '',
// // // // // // //       binary: '',
// // // // // // //       octal: '',
// // // // // // //       hexadecimal: '',
// // // // // // //       base64: ''
// // // // // // //     });

// // // // // // //     if (value === '') return;

// // // // // // //     try {
// // // // // // //       // ASCII values for the whole string
// // // // // // //       const asciiValues = value.split('').map(char => char.charCodeAt(0)).join(' ');

// // // // // // //       // Base64 encoding that handles Unicode
// // // // // // //       const base64Value = btoa(unescape(encodeURIComponent(value)));

// // // // // // //       // Binary, octal, and hexadecimal for each character
// // // // // // //       const binary = value.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
// // // // // // //       const octal = value.split('').map(char => char.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');
// // // // // // //       const hexadecimal = value.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join(' ');

// // // // // // //       setOutput({
// // // // // // //         asciiValues,
// // // // // // //         binary,
// // // // // // //         octal,
// // // // // // //         hexadecimal,
// // // // // // //         base64: base64Value
// // // // // // //       });
// // // // // // //     } catch (err) {
// // // // // // //       setError('An error occurred during conversion. Please check your input.');
// // // // // // //     }
// // // // // // //   }, []);

// // // // // // //   const reset = useCallback(() => {
// // // // // // //     setInput('');
// // // // // // //     setOutput({
// // // // // // //       asciiValues: '',
// // // // // // //       binary: '',
// // // // // // //       octal: '',
// // // // // // //       hexadecimal: '',
// // // // // // //       base64: ''
// // // // // // //     });
// // // // // // //     setError('');
// // // // // // //   }, []);

// // // // // // //   return (
// // // // // // //     <div className="ascii-converter">
// // // // // // //       <h1>ASCII Converter</h1>
// // // // // // //       <div className="input-group">
// // // // // // //         <label htmlFor="input">Input:</label>
// // // // // // //         <input
// // // // // // //           id="input"
// // // // // // //           type="text"
// // // // // // //           placeholder="Enter text"
// // // // // // //           value={input}
// // // // // // //           onChange={(e) => handleInputChange(e.target.value)}
// // // // // // //           aria-describedby="inputHelp"
// // // // // // //         />
// // // // // // //         <small id="inputHelp">Enter text to convert to various formats</small>
// // // // // // //       </div>
// // // // // // //       {error && <div className="error" role="alert">{error}</div>}
// // // // // // //       <div className="output-group">
// // // // // // //         <OutputField label="ASCII Values" value={output.asciiValues} />
// // // // // // //         <OutputField label="Binary" value={output.binary} />
// // // // // // //         <OutputField label="Octal" value={output.octal} />
// // // // // // //         <OutputField label="Hexadecimal" value={output.hexadecimal} />
// // // // // // //         <OutputField label="Base64" value={output.base64} />
// // // // // // //       </div>
// // // // // // //       <button onClick={reset} className="reset-button">Reset</button>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // const OutputField = ({ label, value }) => (
// // // // // // //   <div className="output-field">
// // // // // // //     <label>{label}:</label>
// // // // // // //     <input type="text" value={value} readOnly aria-label={`${label} output`} />
// // // // // // //   </div>
// // // // // // // );

// // // // // // // export default AsciiConverter;
// // // // // // 'use client';
// // // // // // import React, { useState, useCallback } from 'react';

// // // // // // const AsciiConverter = () => {
// // // // // //   const [input, setInput] = useState('');
// // // // // //   const [inputFormat, setInputFormat] = useState('text');
// // // // // //   const [output, setOutput] = useState({
// // // // // //     text: '',
// // // // // //     asciiValues: '',
// // // // // //     binary: '',
// // // // // //     octal: '',
// // // // // //     hexadecimal: '',
// // // // // //     base64: ''
// // // // // //   });
// // // // // //   const [error, setError] = useState('');

// // // // // //   const handleInputChange = useCallback((value) => {
// // // // // //     setInput(value);
// // // // // //   }, []);

// // // // // //   const processConversions = useCallback(() => {
// // // // // //     setError('');
// // // // // //     setOutput({
// // // // // //       text: '',
// // // // // //       asciiValues: '',
// // // // // //       binary: '',
// // // // // //       octal: '',
// // // // // //       hexadecimal: '',
// // // // // //       base64: ''
// // // // // //     });

// // // // // //     if (input === '') return;

// // // // // //     try {
// // // // // //       let text = input;
// // // // // //       if (inputFormat !== 'text') {
// // // // // //         // Convert input to text based on input format
// // // // // //         switch (inputFormat) {
// // // // // //           case 'ascii':
// // // // // //             text = String.fromCharCode(...input.split(' ').map(Number));
// // // // // //             break;
// // // // // //           case 'binary':
// // // // // //             text = input.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
// // // // // //             break;
// // // // // //           case 'octal':
// // // // // //             text = input.split(' ').map(oct => String.fromCharCode(parseInt(oct, 8))).join('');
// // // // // //             break;
// // // // // //           case 'hexadecimal':
// // // // // //             text = input.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
// // // // // //             break;
// // // // // //           case 'base64':
// // // // // //             text = atob(input);
// // // // // //             break;
// // // // // //         }
// // // // // //       }

// // // // // //       // ASCII values for the whole string
// // // // // //       const asciiValues = text.split('').map(char => char.charCodeAt(0)).join(' ');

// // // // // //       // Base64 encoding that handles Unicode
// // // // // //       const base64Value = btoa(unescape(encodeURIComponent(text)));

// // // // // //       // Binary, octal, and hexadecimal for each character
// // // // // //       const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
// // // // // //       const octal = text.split('').map(char => char.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');
// // // // // //       const hexadecimal = text.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join(' ');

// // // // // //       setOutput({
// // // // // //         text,
// // // // // //         asciiValues,
// // // // // //         binary,
// // // // // //         octal,
// // // // // //         hexadecimal,
// // // // // //         base64: base64Value
// // // // // //       });
// // // // // //     } catch (err) {
// // // // // //       setError('An error occurred during conversion. Please check your input.');
// // // // // //     }
// // // // // //   }, [input, inputFormat]);

// // // // // //   const reset = useCallback(() => {
// // // // // //     setInput('');
// // // // // //     setInputFormat('text');
// // // // // //     setOutput({
// // // // // //       text: '',
// // // // // //       asciiValues: '',
// // // // // //       binary: '',
// // // // // //       octal: '',
// // // // // //       hexadecimal: '',
// // // // // //       base64: ''
// // // // // //     });
// // // // // //     setError('');
// // // // // //   }, []);

// // // // // //   const copyToClipboard = (text) => {
// // // // // //     navigator.clipboard.writeText(text).then(() => {
// // // // // //       // You can add a temporary success message here if you want
// // // // // //     }).catch(err => {
// // // // // //       console.error('Failed to copy text: ', err);
// // // // // //     });
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className="ascii-converter">
// // // // // //       <h1>ASCII Converter</h1>
// // // // // //       <div className="input-group">
// // // // // //         <label htmlFor="inputFormat">Input Format:</label>
// // // // // //         <select
// // // // // //           id="inputFormat"
// // // // // //           value={inputFormat}
// // // // // //           onChange={(e) => setInputFormat(e.target.value)}
// // // // // //         >
// // // // // //           <option value="text">Text</option>
// // // // // //           <option value="ascii">ASCII</option>
// // // // // //           <option value="binary">Binary</option>
// // // // // //           <option value="octal">Octal</option>
// // // // // //           <option value="hexadecimal">Hexadecimal</option>
// // // // // //           <option value="base64">Base64</option>
// // // // // //         </select>
// // // // // //       </div>
// // // // // //       <div className="input-group">
// // // // // //         <label htmlFor="input">Input:</label>
// // // // // //         <textarea
// // // // // //           id="input"
// // // // // //           placeholder="Enter text or selected format"
// // // // // //           value={input}
// // // // // //           onChange={(e) => handleInputChange(e.target.value)}
// // // // // //           aria-describedby="inputHelp"
// // // // // //           rows={5}
// // // // // //         />
// // // // // //         <small id="inputHelp">Enter text or selected format to convert</small>
// // // // // //       </div>
// // // // // //       <button onClick={processConversions} className="convert-button">Convert</button>
// // // // // //       {error && <div className="error" role="alert">{error}</div>}
// // // // // //       <div className="output-group">
// // // // // //         <OutputField label="Text" value={output.text} onCopy={copyToClipboard} />
// // // // // //         <OutputField label="ASCII Values" value={output.asciiValues} onCopy={copyToClipboard} />
// // // // // //         <OutputField label="Binary" value={output.binary} onCopy={copyToClipboard} />
// // // // // //         <OutputField label="Octal" value={output.octal} onCopy={copyToClipboard} />
// // // // // //         <OutputField label="Hexadecimal" value={output.hexadecimal} onCopy={copyToClipboard} />
// // // // // //         <OutputField label="Base64" value={output.base64} onCopy={copyToClipboard} />
// // // // // //       </div>
// // // // // //       <button onClick={reset} className="reset-button">Reset</button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // const OutputField = ({ label, value, onCopy }) => (
// // // // // //   <div className="output-field">
// // // // // //     <label>{label}:</label>
// // // // // //     <input type="text" value={value} readOnly aria-label={`${label} output`} />
// // // // // //     <button onClick={() => onCopy(value)} className="copy-button">Copy</button>
// // // // // //   </div>
// // // // // // );

// // // // // // export default AsciiConverter;
// // // // // 'use client';
// // // // // import React, { useState, useCallback } from 'react';
// // // // // import styles from './AsciiConverter.module.css';

// // // // // const AsciiConverter = () => {
// // // // //   const [input, setInput] = useState('');
// // // // //   const [inputFormat, setInputFormat] = useState('text');
// // // // //   const [output, setOutput] = useState({
// // // // //     text: '',
// // // // //     asciiValues: '',
// // // // //     binary: '',
// // // // //     octal: '',
// // // // //     hexadecimal: '',
// // // // //     base64: ''
// // // // //   });
// // // // //   const [error, setError] = useState('');
// // // // //   const [copyStates, setCopyStates] = useState({
// // // // //     text: false,
// // // // //     asciiValues: false,
// // // // //     binary: false,
// // // // //     octal: false,
// // // // //     hexadecimal: false,
// // // // //     base64: false
// // // // //   });

// // // // //   const handleInputChange = useCallback((value) => {
// // // // //     setInput(value);
// // // // //   }, []);

// // // // //   const processConversions = useCallback(() => {
// // // // //     setError('');
// // // // //     setOutput({
// // // // //       text: '',
// // // // //       asciiValues: '',
// // // // //       binary: '',
// // // // //       octal: '',
// // // // //       hexadecimal: '',
// // // // //       base64: ''
// // // // //     });

// // // // //     if (input === '') return;

// // // // //     try {
// // // // //       let text = input;
// // // // //       if (inputFormat !== 'text') {
// // // // //         switch (inputFormat) {
// // // // //           case 'ascii':
// // // // //             text = String.fromCharCode(...input.split(' ').map(Number));
// // // // //             break;
// // // // //           case 'binary':
// // // // //             text = input.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
// // // // //             break;
// // // // //           case 'octal':
// // // // //             text = input.split(' ').map(oct => String.fromCharCode(parseInt(oct, 8))).join('');
// // // // //             break;
// // // // //           case 'hexadecimal':
// // // // //             text = input.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
// // // // //             break;
// // // // //           case 'base64':
// // // // //             text = atob(input);
// // // // //             break;
// // // // //         }
// // // // //       }

// // // // //       const asciiValues = text.split('').map(char => char.charCodeAt(0)).join(' ');
// // // // //       const base64Value = btoa(unescape(encodeURIComponent(text)));
// // // // //       const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
// // // // //       const octal = text.split('').map(char => char.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');
// // // // //       const hexadecimal = text.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join(' ');

// // // // //       setOutput({
// // // // //         text,
// // // // //         asciiValues,
// // // // //         binary,
// // // // //         octal,
// // // // //         hexadecimal,
// // // // //         base64: base64Value
// // // // //       });
// // // // //     } catch (err) {
// // // // //       setError('An error occurred during conversion. Please check your input.');
// // // // //     }
// // // // //   }, [input, inputFormat]);

// // // // //   const reset = useCallback(() => {
// // // // //     setInput('');
// // // // //     setInputFormat('text');
// // // // //     setOutput({
// // // // //       text: '',
// // // // //       asciiValues: '',
// // // // //       binary: '',
// // // // //       octal: '',
// // // // //       hexadecimal: '',
// // // // //       base64: ''
// // // // //     });
// // // // //     setError('');
// // // // //   }, []);

// // // // //   const copyToClipboard = (text, field) => {
// // // // //     navigator.clipboard.writeText(text).then(() => {
// // // // //       setCopyStates(prev => ({ ...prev, [field]: true }));
// // // // //       setTimeout(() => {
// // // // //         setCopyStates(prev => ({ ...prev, [field]: false }));
// // // // //       }, 5000);
// // // // //     }).catch(err => {
// // // // //       console.error('Failed to copy text: ', err);
// // // // //     });
// // // // //   };

// // // // //   const OutputField = ({ label, value, field }) => (
// // // // //     <div className={styles.outputField}>
// // // // //       <label>{label}:</label>
// // // // //       <input type="text" value={value} readOnly aria-label={`${label} output`} />
// // // // //       <button onClick={() => copyToClipboard(value, field)} className={styles.copyButton}>
// // // // //         {copyStates[field] ? 'Copied!' : 'Copy'}
// // // // //       </button>
// // // // //     </div>
// // // // //   );

// // // // //   return (
// // // // //     <div className={styles.container}>
// // // // //       <div className={styles.leftColumn}>
// // // // //         <h1>ASCII Converter</h1>
// // // // //         <div className={styles.inputGroup}>
// // // // //           <label htmlFor="inputFormat">Input Format:</label>
// // // // //           <select
// // // // //             id="inputFormat"
// // // // //             value={inputFormat}
// // // // //             onChange={(e) => setInputFormat(e.target.value)}
// // // // //           >
// // // // //             <option value="text">Text</option>
// // // // //             <option value="ascii">ASCII</option>
// // // // //             <option value="binary">Binary</option>
// // // // //             <option value="octal">Octal</option>
// // // // //             <option value="hexadecimal">Hexadecimal</option>
// // // // //             <option value="base64">Base64</option>
// // // // //           </select>
// // // // //         </div>
// // // // //         <div className={styles.inputGroup}>
// // // // //           <label htmlFor="input">Input:</label>
// // // // //           <textarea
// // // // //             id="input"
// // // // //             placeholder="Enter text or selected format"
// // // // //             value={input}
// // // // //             onChange={(e) => handleInputChange(e.target.value)}
// // // // //             aria-describedby="inputHelp"
// // // // //             rows={5}
// // // // //           />
// // // // //           <small id="inputHelp">Enter text or selected format to convert</small>
// // // // //         </div>
// // // // //         <button onClick={processConversions} className={styles.button}>Convert</button>
// // // // //         <button onClick={reset} className={styles.button}>Reset</button>
// // // // //         {error && <div className={styles.error} role="alert">{error}</div>}
// // // // //       </div>
// // // // //       <div className={styles.rightColumn}>
// // // // //         <OutputField label="Text" value={output.text} field="text" />
// // // // //         <OutputField label="ASCII Values" value={output.asciiValues} field="asciiValues" />
// // // // //         <OutputField label="Binary" value={output.binary} field="binary" />
// // // // //         <OutputField label="Octal" value={output.octal} field="octal" />
// // // // //         <OutputField label="Hexadecimal" value={output.hexadecimal} field="hexadecimal" />
// // // // //         <OutputField label="Base64" value={output.base64} field="base64" />
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default AsciiConverter;
// // // // 'use client';
// // // // import React, { useState, useCallback } from 'react';
// // // // import styles from './AsciiConverter.module.css';

// // // // const AsciiConverter = () => {
// // // //   const [input, setInput] = useState('');
// // // //   const [inputFormat, setInputFormat] = useState('text');
// // // //   const [output, setOutput] = useState({
// // // //     text: '',
// // // //     asciiValues: '',
// // // //     binary: '',
// // // //     octal: '',
// // // //     hexadecimal: '',
// // // //     base64: ''
// // // //   });
// // // //   const [error, setError] = useState('');
// // // //   const [copyStates, setCopyStates] = useState({
// // // //     text: false,
// // // //     asciiValues: false,
// // // //     binary: false,
// // // //     octal: false,
// // // //     hexadecimal: false,
// // // //     base64: false
// // // //   });

// // // //   const handleInputChange = useCallback((value) => {
// // // //     setInput(value);
// // // //   }, []);

// // // //   const processConversions = useCallback(() => {
// // // //     setError('');
// // // //     setOutput({
// // // //       text: '',
// // // //       asciiValues: '',
// // // //       binary: '',
// // // //       octal: '',
// // // //       hexadecimal: '',
// // // //       base64: ''
// // // //     });

// // // //     if (input === '') return;

// // // //     try {
// // // //       let text = input;
// // // //       if (inputFormat !== 'text') {
// // // //         switch (inputFormat) {
// // // //           case 'ascii':
// // // //             text = String.fromCharCode(...input.split(' ').map(Number));
// // // //             break;
// // // //           case 'binary':
// // // //             text = input.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
// // // //             break;
// // // //           case 'octal':
// // // //             text = input.split(' ').map(oct => String.fromCharCode(parseInt(oct, 8))).join('');
// // // //             break;
// // // //           case 'hexadecimal':
// // // //             text = input.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
// // // //             break;
// // // //           case 'base64':
// // // //             text = atob(input);
// // // //             break;
// // // //         }
// // // //       }

// // // //       const asciiValues = text.split('').map(char => char.charCodeAt(0)).join(' ');
// // // //       const base64Value = btoa(unescape(encodeURIComponent(text)));
// // // //       const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
// // // //       const octal = text.split('').map(char => char.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');
// // // //       const hexadecimal = text.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join(' ');

// // // //       setOutput({
// // // //         text,
// // // //         asciiValues,
// // // //         binary,
// // // //         octal,
// // // //         hexadecimal,
// // // //         base64: base64Value
// // // //       });
// // // //     } catch (err) {
// // // //       setError('An error occurred during conversion. Please check your input.');
// // // //     }
// // // //   }, [input, inputFormat]);

// // // //   const reset = useCallback(() => {
// // // //     setInput('');
// // // //     setInputFormat('text');
// // // //     setOutput({
// // // //       text: '',
// // // //       asciiValues: '',
// // // //       binary: '',
// // // //       octal: '',
// // // //       hexadecimal: '',
// // // //       base64: ''
// // // //     });
// // // //     setError('');
// // // //   }, []);

// // // //   const copyToClipboard = (text, field) => {
// // // //     navigator.clipboard.writeText(text).then(() => {
// // // //       setCopyStates(prev => ({ ...prev, [field]: true }));
// // // //       setTimeout(() => {
// // // //         setCopyStates(prev => ({ ...prev, [field]: false }));
// // // //       }, 5000);
// // // //     }).catch(err => {
// // // //       console.error('Failed to copy text: ', err);
// // // //     });
// // // //   };

// // // //   const OutputField = ({ label, value, field }) => (
// // // //     <div className={styles.outputField}>
// // // //       <label>{label}:</label>
// // // //       <input type="text" value={value} readOnly aria-label={`${label} output`} />
// // // //       <button onClick={() => copyToClipboard(value, field)} className={styles.copyButton}>
// // // //         {copyStates[field] ? 'Copied!' : 'Copy'}
// // // //       </button>
// // // //     </div>
// // // //   );

// // // //   return (
// // // //     <div className={styles.container}>
// // // //       <div className={styles.leftColumn}>
// // // //         <div className={styles.inputGroup}>
// // // //           <label htmlFor="inputFormat">Input Format:</label>
// // // //           <select
// // // //             id="inputFormat"
// // // //             value={inputFormat}
// // // //             onChange={(e) => setInputFormat(e.target.value)}
// // // //           >
// // // //             <option value="text">Text</option>
// // // //             <option value="ascii">ASCII</option>
// // // //             <option value="binary">Binary</option>
// // // //             <option value="octal">Octal</option>
// // // //             <option value="hexadecimal">Hexadecimal</option>
// // // //             <option value="base64">Base64</option>
// // // //           </select>
// // // //         </div>
// // // //         <div className={styles.inputGroup}>
// // // //           <label htmlFor="input">Input:</label>
// // // //           <textarea
// // // //             id="input"
// // // //             placeholder="Enter text or selected format"
// // // //             value={input}
// // // //             onChange={(e) => handleInputChange(e.target.value)}
// // // //             aria-describedby="inputHelp"
// // // //             rows={5}
// // // //           />
// // // //           <small id="inputHelp">Enter text or selected format to convert</small>
// // // //         </div>
// // // //         <div className={styles.buttonGroup}>
// // // //           <button onClick={processConversions} className={`${styles.button} ${styles.convertButton}`}>Convert</button>
// // // //           <button onClick={reset} className={`${styles.button} ${styles.resetButton}`}>Reset</button>
// // // //         </div>
// // // //         {error && <div className={styles.error} role="alert">{error}</div>}
// // // //       </div>
// // // //       <div className={styles.rightColumn}>
// // // //         <OutputField label="Text" value={output.text} field="text" />
// // // //         <OutputField label="ASCII Values" value={output.asciiValues} field="asciiValues" />
// // // //         <OutputField label="Binary" value={output.binary} field="binary" />
// // // //         <OutputField label="Octal" value={output.octal} field="octal" />
// // // //         <OutputField label="Hexadecimal" value={output.hexadecimal} field="hexadecimal" />
// // // //         <OutputField label="Base64" value={output.base64} field="base64" />
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default AsciiConverter;
// // // 'use client';
// // // import React, { useState, useCallback } from 'react';
// // // import styles from './AsciiConverter.module.css';

// // // const AsciiConverter = () => {
// // //   const [input, setInput] = useState('');
// // //   const [inputFormat, setInputFormat] = useState('text');
// // //   const [output, setOutput] = useState({
// // //     text: '',
// // //     asciiValues: '',
// // //     binary: '',
// // //     octal: '',
// // //     hexadecimal: '',
// // //     base64: ''
// // //   });
// // //   const [error, setError] = useState('');
// // //   const [copyStates, setCopyStates] = useState({
// // //     text: false,
// // //     asciiValues: false,
// // //     binary: false,
// // //     octal: false,
// // //     hexadecimal: false,
// // //     base64: false
// // //   });

// // //   const handleInputChange = useCallback((value) => {
// // //     setInput(value);
// // //   }, []);

// // //   // const validateInput = (input, format) => {
// // //   //   switch (format) {
// // //   //     case 'text':
// // //   //       return true; // All input is valid for text
// // //   //     case 'ascii':
// // //   //       return /^(\d{1,3}\s)*\d{1,3}$/.test(input) && input.split(' ').every(num => parseInt(num) <= 255);
// // //   //     case 'binary':
// // //   //       return /^([01]{8}\s)*[01]{8}$/.test(input);
// // //   //     case 'octal':
// // //   //       return /^([0-7]{3}\s)*[0-7]{3}$/.test(input);
// // //   //     case 'hexadecimal':
// // //   //       return /^([0-9A-Fa-f]{2}\s)*[0-9A-Fa-f]{2}$/.test(input);
// // //   //     case 'base64':
// // //   //       return /^[A-Za-z0-9+/]*={0,2}$/.test(input);
// // //   //     default:
// // //   //       return false;
// // //   //   }
// // //   // };

// // //   const validateInput = (input, format) => {
// // //     setError(''); // Clear any previous errors
// // //     switch (format) {
// // //       case 'text':
// // //         if (/\d/.test(input)) {
// // //           setError('Warning: Numeric characters detected in text input. This may lead to unexpected results in some conversions.');
// // //         }
// // //         return true; // Still allow all input for text
// // //       case 'ascii':
// // //         if (!/^(\d{1,3}\s)*\d{1,3}$/.test(input) || !input.split(' ').every(num => parseInt(num) <= 255)) {
// // //           setError('Invalid ASCII input. Please enter space-separated numbers between 0 and 255.');
// // //           return false;
// // //         }
// // //         return true;
// // //       case 'binary':
// // //         if (!/^([01]{8}\s)*[01]{8}$/.test(input)) {
// // //           setError('Invalid binary input. Please enter space-separated 8-bit binary numbers.');
// // //           return false;
// // //         }
// // //         return true;
// // //       case 'octal':
// // //         if (!/^([0-7]{3}\s)*[0-7]{3}$/.test(input)) {
// // //           setError('Invalid octal input. Please enter space-separated 3-digit octal numbers.');
// // //           return false;
// // //         }
// // //         return true;
// // //       case 'hexadecimal':
// // //         if (!/^([0-9A-Fa-f]{2}\s)*[0-9A-Fa-f]{2}$/.test(input)) {
// // //           setError('Invalid hexadecimal input. Please enter space-separated 2-digit hexadecimal numbers.');
// // //           return false;
// // //         }
// // //         return true;
// // //       case 'base64':
// // //         if (!/^[A-Za-z0-9+/]*={0,2}$/.test(input)) {
// // //           setError('Invalid Base64 input. Please enter a valid Base64 string.');
// // //           return false;
// // //         }
// // //         return true;
// // //       default:
// // //         setError('Invalid input format selected.');
// // //         return false;
// // //     }
// // //   };

// // //   const processConversions = useCallback(() => {
// // //     setError('');
// // //     setOutput({
// // //       text: '',
// // //       asciiValues: '',
// // //       binary: '',
// // //       octal: '',
// // //       hexadecimal: '',
// // //       base64: ''
// // //     });

// // //     if (input === '') return;

// // //     if (!validateInput(input, inputFormat)) {
// // //       setError(`Invalid input for ${inputFormat} format. Please check your input.`);
// // //       return;
// // //     }

// // //     try {
// // //       let text = input;
// // //       if (inputFormat !== 'text') {
// // //         switch (inputFormat) {
// // //           case 'ascii':
// // //             text = String.fromCharCode(...input.split(' ').map(Number));
// // //             break;
// // //           case 'binary':
// // //             text = input.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
// // //             break;
// // //           case 'octal':
// // //             text = input.split(' ').map(oct => String.fromCharCode(parseInt(oct, 8))).join('');
// // //             break;
// // //           case 'hexadecimal':
// // //             text = input.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
// // //             break;
// // //           case 'base64':
// // //             text = atob(input);
// // //             break;
// // //         }
// // //       }

// // //       const asciiValues = text.split('').map(char => char.charCodeAt(0)).join(' ');
// // //       const base64Value = btoa(unescape(encodeURIComponent(text)));
// // //       const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
// // //       const octal = text.split('').map(char => char.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');
// // //       const hexadecimal = text.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join(' ');

// // //       setOutput({
// // //         text,
// // //         asciiValues,
// // //         binary,
// // //         octal,
// // //         hexadecimal,
// // //         base64: base64Value
// // //       });
// // //     } catch (err) {
// // //       setError('An error occurred during conversion. Please check your input.');
// // //     }
// // //   }, [input, inputFormat]);

// // //   const reset = useCallback(() => {
// // //     setInput('');
// // //     setInputFormat('text');
// // //     setOutput({
// // //       text: '',
// // //       asciiValues: '',
// // //       binary: '',
// // //       octal: '',
// // //       hexadecimal: '',
// // //       base64: ''
// // //     });
// // //     setError('');
// // //   }, []);

// // //   const copyToClipboard = (text, field) => {
// // //     navigator.clipboard.writeText(text).then(() => {
// // //       setCopyStates(prev => ({ ...prev, [field]: true }));
// // //       setTimeout(() => {
// // //         setCopyStates(prev => ({ ...prev, [field]: false }));
// // //       }, 5000);
// // //     }).catch(err => {
// // //       console.error('Failed to copy text: ', err);
// // //     });
// // //   };

// // //   const OutputField = ({ label, value, field }) => (
// // //     <div className={styles.outputField}>
// // //       <label>{label}:</label>
// // //       <input type="text" value={value} readOnly aria-label={`${label} output`} />
// // //       <button onClick={() => copyToClipboard(value, field)} className={styles.copyButton}>
// // //         {copyStates[field] ? 'Copied!' : 'Copy'}
// // //       </button>
// // //     </div>
// // //   );

// // //   return (
// // //     <div className={styles.container}>
// // //       <div className={styles.leftColumn}>
// // //         <div className={styles.inputGroup}>
// // //           <label htmlFor="inputFormat">Input Format:</label>
// // //           <select
// // //             id="inputFormat"
// // //             value={inputFormat}
// // //             onChange={(e) => setInputFormat(e.target.value)}
// // //           >
// // //             <option value="text">Text</option>
// // //             <option value="ascii">ASCII</option>
// // //             <option value="binary">Binary</option>
// // //             <option value="octal">Octal</option>
// // //             <option value="hexadecimal">Hexadecimal</option>
// // //             <option value="base64">Base64</option>
// // //           </select>
// // //         </div>
// // //         <div className={styles.inputGroup}>
// // //           <label htmlFor="input">Input:</label>
// // //           <textarea
// // //             id="input"
// // //             placeholder="Enter text or selected format"
// // //             value={input}
// // //             onChange={(e) => handleInputChange(e.target.value)}
// // //             aria-describedby="inputHelp"
// // //             rows={5}
// // //           />
// // //           <small id="inputHelp">Enter text or selected format to convert</small>
// // //         </div>
// // //         <div className={styles.buttonGroup}>
// // //           <button onClick={processConversions} className={`${styles.button} ${styles.convertButton}`}>Convert</button>
// // //           <button onClick={reset} className={`${styles.button} ${styles.resetButton}`}>Reset</button>
// // //         </div>
// // //         {error && <div className={styles.error} role="alert">{error}</div>}
// // //       </div>
// // //       <div className={styles.rightColumn}>
// // //         <OutputField label="Text" value={output.text} field="text" />
// // //         <OutputField label="ASCII Values" value={output.asciiValues} field="asciiValues" />
// // //         <OutputField label="Binary" value={output.binary} field="binary" />
// // //         <OutputField label="Octal" value={output.octal} field="octal" />
// // //         <OutputField label="Hexadecimal" value={output.hexadecimal} field="hexadecimal" />
// // //         <OutputField label="Base64" value={output.base64} field="base64" />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AsciiConverter;
// // 'use client';
// // import React, { useState, useCallback, useEffect } from 'react';
// // import styles from './AsciiConverter.module.css';

// // const AsciiConverter = () => {
// //   const [input, setInput] = useState('');
// //   const [inputFormat, setInputFormat] = useState('text');
// //   const [output, setOutput] = useState({
// //     text: '',
// //     asciiValues: '',
// //     binary: '',
// //     octal: '',
// //     hexadecimal: '',
// //     base64: ''
// //   });
// //   const [validationMessage, setValidationMessage] = useState('');
// //   const [copyStates, setCopyStates] = useState({
// //     text: false,
// //     asciiValues: false,
// //     binary: false,
// //     octal: false,
// //     hexadecimal: false,
// //     base64: false
// //   });

// //   const validateInput = useCallback((input, format) => {
// //     switch (format) {
// //       case 'text':
// //         if (/\d/.test(input)) {
// //           return 'Warning: Numeric characters detected in text input. This may lead to unexpected results in some conversions.';
// //         }
// //         return '';
// //       case 'ascii':
// //         if (!/^(\d{1,3}\s)*\d{1,3}$/.test(input) || !input.split(' ').every(num => parseInt(num) <= 255)) {
// //           return 'Invalid ASCII input. Please enter space-separated numbers between 0 and 255.';
// //         }
// //         return '';
// //       case 'binary':
// //         if (!/^([01]{8}\s)*[01]{8}$/.test(input)) {
// //           return 'Invalid binary input. Please enter space-separated 8-bit binary numbers.';
// //         }
// //         return '';
// //       case 'octal':
// //         if (!/^([0-7]{3}\s)*[0-7]{3}$/.test(input)) {
// //           return 'Invalid octal input. Please enter space-separated 3-digit octal numbers.';
// //         }
// //         return '';
// //       case 'hexadecimal':
// //         if (!/^([0-9A-Fa-f]{2}\s)*[0-9A-Fa-f]{2}$/.test(input)) {
// //           return 'Invalid hexadecimal input. Please enter space-separated 2-digit hexadecimal numbers.';
// //         }
// //         return '';
// //       case 'base64':
// //         if (!/^[A-Za-z0-9+/]*={0,2}$/.test(input)) {
// //           return 'Invalid Base64 input. Please enter a valid Base64 string.';
// //         }
// //         return '';
// //       default:
// //         return 'Invalid input format selected.';
// //     }
// //   }, []);

// //   const handleInputChange = useCallback((value) => {
// //     setInput(value);
// //     const message = validateInput(value, inputFormat);
// //     setValidationMessage(message);
// //   }, [inputFormat, validateInput]);

// //   const handleFormatChange = useCallback((format) => {
// //     setInputFormat(format);
// //     const message = validateInput(input, format);
// //     setValidationMessage(message);
// //   }, [input, validateInput]);

// //   useEffect(() => {
// //     const message = validateInput(input, inputFormat);
// //     setValidationMessage(message);
// //   }, [input, inputFormat, validateInput]);

// //   const processConversions = useCallback(() => {
// //     if (input === '' || validationMessage !== '') return;

// //     try {
// //       let text = input;
// //       if (inputFormat !== 'text') {
// //         switch (inputFormat) {
// //           case 'ascii':
// //             text = String.fromCharCode(...input.split(' ').map(Number));
// //             break;
// //           case 'binary':
// //             text = input.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
// //             break;
// //           case 'octal':
// //             text = input.split(' ').map(oct => String.fromCharCode(parseInt(oct, 8))).join('');
// //             break;
// //           case 'hexadecimal':
// //             text = input.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
// //             break;
// //           case 'base64':
// //             text = atob(input);
// //             break;
// //         }
// //       }

// //       const asciiValues = text.split('').map(char => char.charCodeAt(0)).join(' ');
// //       const base64Value = btoa(unescape(encodeURIComponent(text)));
// //       const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
// //       const octal = text.split('').map(char => char.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');
// //       const hexadecimal = text.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join(' ');

// //       setOutput({
// //         text,
// //         asciiValues,
// //         binary,
// //         octal,
// //         hexadecimal,
// //         base64: base64Value
// //       });
// //     } catch (err) {
// //       setValidationMessage('An error occurred during conversion. Please check your input.');
// //     }
// //   }, [input, inputFormat, validationMessage]);

// //   const reset = useCallback(() => {
// //     setInput('');
// //     setInputFormat('text');
// //     setOutput({
// //       text: '',
// //       asciiValues: '',
// //       binary: '',
// //       octal: '',
// //       hexadecimal: '',
// //       base64: ''
// //     });
// //     setValidationMessage('');
// //   }, []);

// //   const copyToClipboard = (text, field) => {
// //     navigator.clipboard.writeText(text).then(() => {
// //       setCopyStates(prev => ({ ...prev, [field]: true }));
// //       setTimeout(() => {
// //         setCopyStates(prev => ({ ...prev, [field]: false }));
// //       }, 5000);
// //     }).catch(err => {
// //       console.error('Failed to copy text: ', err);
// //     });
// //   };

// //   const OutputField = ({ label, value, field }) => (
// //     <div className={styles.outputField}>
// //       <label>{label}:</label>
// //       <input type="text" value={value} readOnly aria-label={`${label} output`} />
// //       <button onClick={() => copyToClipboard(value, field)} className={styles.copyButton}>
// //         {copyStates[field] ? 'Copied!' : 'Copy'}
// //       </button>
// //     </div>
// //   );

// //   return (
// //     <div className={styles.container}>
// //       <div className={styles.leftColumn}>
// //         <div className={styles.inputGroup}>
// //           <label htmlFor="inputFormat">Input Format:</label>
// //           <select
// //             id="inputFormat"
// //             value={inputFormat}
// //             onChange={(e) => handleFormatChange(e.target.value)}
// //           >
// //             <option value="text">Text</option>
// //             <option value="ascii">ASCII</option>
// //             <option value="binary">Binary</option>
// //             <option value="octal">Octal</option>
// //             <option value="hexadecimal">Hexadecimal</option>
// //             <option value="base64">Base64</option>
// //           </select>
// //         </div>
// //         <div className={styles.inputGroup}>
// //           <label htmlFor="input">Input:</label>
// //           <textarea
// //             id="input"
// //             placeholder="Enter text or selected format"
// //             value={input}
// //             onChange={(e) => handleInputChange(e.target.value)}
// //             aria-describedby="inputHelp"
// //             rows={5}
// //           />
// //           <small id="inputHelp">Enter text or selected format to convert</small>
// //         </div>
// //         {validationMessage && <div className={validationMessage.startsWith('Warning') ? styles.warning : styles.error} role="alert">{validationMessage}</div>}
// //         <div className={styles.buttonGroup}>
// //           <button onClick={processConversions} className={`${styles.button} ${styles.convertButton}`} disabled={validationMessage !== '' && !validationMessage.startsWith('Warning')}>Convert</button>
// //           <button onClick={reset} className={`${styles.button} ${styles.resetButton}`}>Reset</button>
// //         </div>
// //       </div>
// //       <div className={styles.rightColumn}>
// //         <OutputField label="Text" value={output.text} field="text" />
// //         <OutputField label="ASCII Values" value={output.asciiValues} field="asciiValues" />
// //         <OutputField label="Binary" value={output.binary} field="binary" />
// //         <OutputField label="Octal" value={output.octal} field="octal" />
// //         <OutputField label="Hexadecimal" value={output.hexadecimal} field="hexadecimal" />
// //         <OutputField label="Base64" value={output.base64} field="base64" />
// //       </div>
// //     </div>
// //   );
// // };

// // export default AsciiConverter;
// 'use client';
// import React, { useState, useCallback, useEffect } from 'react';
// import styles from './AsciiConverter.module.css';

// const AsciiConverter = () => {
//   const [input, setInput] = useState('');
//   const [inputFormat, setInputFormat] = useState('text');
//   const [output, setOutput] = useState({
//     text: '',
//     asciiValues: '',
//     binary: '',
//     octal: '',
//     hexadecimal: '',
//     base64: ''
//   });
//   const [validationMessage, setValidationMessage] = useState('');
//   const [messageType, setMessageType] = useState('');
//   const [copyStates, setCopyStates] = useState({
//     text: false,
//     asciiValues: false,
//     binary: false,
//     octal: false,
//     hexadecimal: false,
//     base64: false
//   });

//   const validateInput = useCallback((input, format) => {
//     if (input === '') {
//       setMessageType('');
//       return '';
//     }
//     switch (format) {
//       case 'text':
//         if (/\d/.test(input)) {
//           setMessageType('warning');
//           return 'Warning: Numeric characters detected in text input. This may lead to unexpected results in some conversions.';
//         }
//         setMessageType('');
//         return '';
//       case 'ascii':
//         if (!/^(\d{1,3}\s)*\d{1,3}$/.test(input) || !input.split(' ').every(num => parseInt(num) <= 255)) {
//           setMessageType('error');
//           return 'Invalid ASCII input. Please enter space-separated numbers between 0 and 255.';
//         }
//         setMessageType('');
//         return '';
//       case 'binary':
//         if (!/^([01]{8}\s)*[01]{8}$/.test(input)) {
//           setMessageType('error');
//           return 'Invalid binary input. Please enter space-separated 8-bit binary numbers.';
//         }
//         setMessageType('');
//         return '';
//       case 'octal':
//         if (!/^([0-7]{3}\s)*[0-7]{3}$/.test(input)) {
//           setMessageType('error');
//           return 'Invalid octal input. Please enter space-separated 3-digit octal numbers.';
//         }
//         setMessageType('');
//         return '';
//       case 'hexadecimal':
//         if (!/^([0-9A-Fa-f]{2}\s)*[0-9A-Fa-f]{2}$/.test(input)) {
//           setMessageType('error');
//           return 'Invalid hexadecimal input. Please enter space-separated 2-digit hexadecimal numbers.';
//         }
//         setMessageType('');
//         return '';
//       case 'base64':
//         if (!/^[A-Za-z0-9+/]*={0,2}$/.test(input)) {
//           setMessageType('error');
//           return 'Invalid Base64 input. Please enter a valid Base64 string.';
//         }
//         setMessageType('');
//         return '';
//       default:
//         setMessageType('error');
//         return 'Invalid input format selected.';
//     }
//   }, []);

//   const handleInputChange = useCallback((value) => {
//     setInput(value);
//     const message = validateInput(value, inputFormat);
//     setValidationMessage(message);
//   }, [inputFormat, validateInput]);

//   const handleFormatChange = useCallback((format) => {
//     setInputFormat(format);
//     const message = validateInput(input, format);
//     setValidationMessage(message);
//   }, [input, validateInput]);

//   useEffect(() => {
//     const message = validateInput(input, inputFormat);
//     setValidationMessage(message);
//   }, [input, inputFormat, validateInput]);

//   const processConversions = useCallback(() => {
//     if (input === '' || (validationMessage !== '' && messageType === 'error')) return;

//     try {
//       let text = input;
//       if (inputFormat !== 'text') {
//         switch (inputFormat) {
//           case 'ascii':
//             text = String.fromCharCode(...input.split(' ').map(Number));
//             break;
//           case 'binary':
//             text = input.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
//             break;
//           case 'octal':
//             text = input.split(' ').map(oct => String.fromCharCode(parseInt(oct, 8))).join('');
//             break;
//           case 'hexadecimal':
//             text = input.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
//             break;
//           case 'base64':
//             text = atob(input);
//             break;
//         }
//       }

//       const asciiValues = text.split('').map(char => char.charCodeAt(0)).join(' ');
//       const base64Value = btoa(unescape(encodeURIComponent(text)));
//       const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
//       const octal = text.split('').map(char => char.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');
//       const hexadecimal = text.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join(' ');

//       setOutput({
//         text,
//         asciiValues,
//         binary,
//         octal,
//         hexadecimal,
//         base64: base64Value
//       });
//     } catch (err) {
//       setValidationMessage('An error occurred during conversion. Please check your input.');
//       setMessageType('error');
//     }
//   }, [input, inputFormat, validationMessage, messageType]);

//   const reset = useCallback(() => {
//     setInput('');
//     setInputFormat('text');
//     setOutput({
//       text: '',
//       asciiValues: '',
//       binary: '',
//       octal: '',
//       hexadecimal: '',
//       base64: ''
//     });
//     setValidationMessage('');
//     setMessageType('');
//   }, []);

//   const copyToClipboard = (text, field) => {
//     navigator.clipboard.writeText(text).then(() => {
//       setCopyStates(prev => ({ ...prev, [field]: true }));
//       setTimeout(() => {
//         setCopyStates(prev => ({ ...prev, [field]: false }));
//       }, 5000);
//     }).catch(err => {
//       console.error('Failed to copy text: ', err);
//     });
//   };

//   const OutputField = ({ label, value, field }) => (
//     <div className={styles.outputField}>
//       <label>{label}:</label>
//       <input type="text" value={value} readOnly aria-label={`${label} output`} />
//       <button onClick={() => copyToClipboard(value, field)} className={styles.copyButton}>
//         {copyStates[field] ? 'Copied!' : 'Copy'}
//       </button>
//     </div>
//   );

//   return (
//     <div className={styles.container}>
//       <div className={styles.leftColumn}>
//         <div className={styles.inputGroup}>
//           <label htmlFor="inputFormat">Input Format:</label>
//           <select
//             id="inputFormat"
//             value={inputFormat}
//             onChange={(e) => handleFormatChange(e.target.value)}
//           >
//             <option value="text">Text</option>
//             <option value="ascii">ASCII</option>
//             <option value="binary">Binary</option>
//             <option value="octal">Octal</option>
//             <option value="hexadecimal">Hexadecimal</option>
//             <option value="base64">Base64</option>
//           </select>
//         </div>
//         <div className={styles.inputGroup}>
//           <label htmlFor="input">Input:</label>
//           <textarea
//             id="input"
//             placeholder="Enter text or selected format"
//             value={input}
//             onChange={(e) => handleInputChange(e.target.value)}
//             aria-describedby="inputHelp"
//             rows={5}
//           />
//           <small id="inputHelp">Enter text or selected format to convert</small>
//         </div>
//         {validationMessage && (
//           <div 
//             className={messageType === 'warning' ? styles.warning : styles.error} 
//             role="alert"
//           >
//             {validationMessage}
//           </div>
//         )}
//         <div className={styles.buttonGroup}>
//           <button 
//             onClick={processConversions} 
//             className={`${styles.button} ${styles.convertButton}`} 
//             disabled={messageType === 'error'}
//           >
//             Convert
//           </button>
//           <button onClick={reset} className={`${styles.button} ${styles.resetButton}`}>Reset</button>
//         </div>
//       </div>
//       <div className={styles.rightColumn}>
//         <OutputField label="Text" value={output.text} field="text" />
//         <OutputField label="ASCII Values" value={output.asciiValues} field="asciiValues" />
//         <OutputField label="Binary" value={output.binary} field="binary" />
//         <OutputField label="Octal" value={output.octal} field="octal" />
//         <OutputField label="Hexadecimal" value={output.hexadecimal} field="hexadecimal" />
//         <OutputField label="Base64" value={output.base64} field="base64" />
//       </div>
//     </div>
//   );
// };

// export default AsciiConverter;
'use client';
import React, { useState, useCallback } from 'react';
import styles from './AsciiConverter.module.css';

const AsciiConverter = () => {
  const [input, setInput] = useState('');
  const [inputFormat, setInputFormat] = useState('text');
  const [output, setOutput] = useState({
    text: '',
    asciiValues: '',
    binary: '',
    octal: '',
    hexadecimal: '',
    base64: ''
  });
  const [validationMessage, setValidationMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [copyStates, setCopyStates] = useState({
    text: false,
    asciiValues: false,
    binary: false,
    octal: false,
    hexadecimal: false,
    base64: false
  });

  const validateInput = useCallback((input, format) => {
    if (input === '') {
      setMessageType('');
      return '';
    }
    switch (format) {
      case 'text':
        if (/\d/.test(input)) {
          setMessageType('warning');
          return 'Warning: Numeric characters detected in text input. This may lead to unexpected results in some conversions.';
        }
        break;
      case 'ascii':
        if (!/^\d+(\s\d+)*$/.test(input) || !input.split(' ').every(num => parseInt(num) <= 255)) {
          setMessageType('error');
          return 'Invalid ASCII input. Please enter space-separated numbers between 0 and 255.';
        }
        break;
      case 'binary':
        if (!/^[01]+(\s[01]+)*$/.test(input)) {
          setMessageType('error');
          return 'Invalid binary input. Please enter space-separated binary numbers.';
        }
        break;
      case 'octal':
        if (!/^[0-7]+(\s[0-7]+)*$/.test(input)) {
          setMessageType('error');
          return 'Invalid octal input. Please enter space-separated octal numbers.';
        }
        break;
      case 'hexadecimal':
        if (!/^[0-9A-Fa-f]+(\s[0-9A-Fa-f]+)*$/.test(input)) {
          setMessageType('error');
          return 'Invalid hexadecimal input. Please enter space-separated hexadecimal numbers.';
        }
        break;
      case 'base64':
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(input)) {
          setMessageType('error');
          return 'Invalid Base64 input. Please enter a valid Base64 string.';
        }
        break;
    }
    setMessageType('');
    return '';
  }, []);

  const handleInputChange = useCallback((value) => {
    setInput(value);
    const message = validateInput(value, inputFormat);
    setValidationMessage(message);
  }, [inputFormat, validateInput]);

  const handleFormatChange = useCallback((format) => {
    setInputFormat(format);
    const message = validateInput(input, format);
    setValidationMessage(message);
  }, [input, validateInput]);

  const processConversions = useCallback(() => {
    if (input === '' || messageType === 'error') return;

    try {
      let text = input;
      if (inputFormat !== 'text') {
        switch (inputFormat) {
          case 'ascii':
            text = input.split(' ').map(num => String.fromCharCode(parseInt(num))).join('');
            break;
          case 'binary':
            text = input.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
            break;
          case 'octal':
            text = input.split(' ').map(oct => String.fromCharCode(parseInt(oct, 8))).join('');
            break;
          case 'hexadecimal':
            text = input.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
            break;
          case 'base64':
            text = atob(input);
            break;
        }
      }

      const asciiValues = text.split('').map(char => char.charCodeAt(0)).join(' ');
      const base64Value = btoa(unescape(encodeURIComponent(text)));
      const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      const octal = text.split('').map(char => char.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');
      const hexadecimal = text.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join(' ');

      setOutput({
        text,
        asciiValues,
        binary,
        octal,
        hexadecimal,
        base64: base64Value
      });
    } catch (err) {
      setValidationMessage('An error occurred during conversion. Please check your input.');
      setMessageType('error');
    }
  }, [input, inputFormat, messageType]);

  const reset = useCallback(() => {
    setInput('');
    setInputFormat('text');
    setOutput({
      text: '',
      asciiValues: '',
      binary: '',
      octal: '',
      hexadecimal: '',
      base64: ''
    });
    setValidationMessage('');
    setMessageType('');
  }, []);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStates(prev => ({ ...prev, [field]: true }));
      setTimeout(() => {
        setCopyStates(prev => ({ ...prev, [field]: false }));
      }, 5000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const OutputField = ({ label, value, field }) => (
    <div className={styles.outputField}>
      <label>{label}:</label>
      <input type="text" value={value} readOnly aria-label={`${label} output`} />
      <button onClick={() => copyToClipboard(value, field)} className={styles.copyButton}>
        {copyStates[field] ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.inputGroup}>
          <label htmlFor="inputFormat">Input Format:</label>
          <select
            id="inputFormat"
            value={inputFormat}
            onChange={(e) => handleFormatChange(e.target.value)}
          >
            <option value="text">Text</option>
            <option value="ascii">ASCII</option>
            <option value="binary">Binary</option>
            <option value="octal">Octal</option>
            <option value="hexadecimal">Hexadecimal</option>
            <option value="base64">Base64</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="input">Input:</label>
          <textarea
            id="input"
            placeholder="Enter text or selected format"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            aria-describedby="inputHelp"
            rows={5}
          />
          <small id="inputHelp">Enter text or selected format to convert</small>
        </div>
        <div className={styles.messageContainer}>
          {validationMessage && (
            <div 
              className={messageType === 'warning' ? styles.warning : styles.error} 
              role="alert"
            >
              {validationMessage}
            </div>
          )}
        </div>
        <div className={styles.buttonGroup}>
          <button 
            onClick={processConversions} 
            className={`${styles.button} ${styles.convertButton}`} 
            disabled={messageType === 'error'}
          >
            Convert
          </button>
          <button onClick={reset} className={`${styles.button} ${styles.resetButton}`}>Reset</button>
        </div>
      </div>
      <div className={styles.rightColumn}>
        <OutputField label="Text" value={output.text} field="text" />
        <OutputField label="ASCII Values" value={output.asciiValues} field="asciiValues" />
        <OutputField label="Binary" value={output.binary} field="binary" />
        <OutputField label="Octal" value={output.octal} field="octal" />
        <OutputField label="Hexadecimal" value={output.hexadecimal} field="hexadecimal" />
        <OutputField label="Base64" value={output.base64} field="base64" />
      </div>
    </div>
  );
};

export default AsciiConverter;