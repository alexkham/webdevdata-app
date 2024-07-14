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
// // // // //   const [validationMessage, setValidationMessage] = useState('');
// // // // //   const [messageType, setMessageType] = useState('');
// // // // //   const [copyStates, setCopyStates] = useState({
// // // // //     text: false,
// // // // //     asciiValues: false,
// // // // //     binary: false,
// // // // //     octal: false,
// // // // //     hexadecimal: false,
// // // // //     base64: false
// // // // //   });

// // // // //   const validateInput = useCallback((input, format) => {
// // // // //     switch (format) {
// // // // //       case 'text':
// // // // //         break;
// // // // //       case 'ascii':
// // // // //         if (!/^(\d+\s)*\d+$/.test(input) || input.split(' ').some(num => parseInt(num) > 255)) {
// // // // //           setMessageType('error');
// // // // //           return 'Invalid ASCII input. Please enter space-separated numbers between 0 and 255.';
// // // // //         }
// // // // //         break;
// // // // //       case 'binary':
// // // // //         if (!/^([01]+\s)*[01]+$/.test(input)) {
// // // // //           setMessageType('error');
// // // // //           return 'Invalid binary input. Please enter space-separated binary numbers.';
// // // // //         }
// // // // //         break;
// // // // //       case 'octal':
// // // // //         if (!/^([0-7]+\s)*[0-7]+$/.test(input)) {
// // // // //           setMessageType('error');
// // // // //           return 'Invalid octal input. Please enter space-separated octal numbers.';
// // // // //         }
// // // // //         break;
// // // // //       case 'hexadecimal':
// // // // //         if (!/^([0-9A-Fa-f]+\s)*[0-9A-Fa-f]+$/.test(input)) {
// // // // //           setMessageType('error');
// // // // //           return 'Invalid hexadecimal input. Please enter space-separated hexadecimal numbers.';
// // // // //         }
// // // // //         break;
// // // // //       case 'base64':
// // // // //         if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(input)) {
// // // // //           setMessageType('error');
// // // // //           return 'Invalid Base64 input. Please enter a valid Base64 string.';
// // // // //         }
// // // // //         break;
// // // // //       default:
// // // // //         setMessageType('error');
// // // // //         return 'Unsupported input format.';
// // // // //     }
// // // // //     setMessageType('');
// // // // //     return '';
// // // // //   }, []);

// // // // //   const handleInputChange = useCallback((value) => {
// // // // //     setInput(value);
// // // // //     if (value.trim() !== '') {
// // // // //       const message = validateInput(value, inputFormat);
// // // // //       setValidationMessage(message);
// // // // //     } else {
// // // // //       setValidationMessage('');
// // // // //       setMessageType('');
// // // // //     }
// // // // //   }, [inputFormat, validateInput]);

// // // // //   const handleFormatChange = useCallback((format) => {
// // // // //     setInputFormat(format);
// // // // //     if (input.trim() !== '') {
// // // // //       const message = validateInput(input, format);
// // // // //       setValidationMessage(message);
// // // // //     } else {
// // // // //       setValidationMessage('');
// // // // //       setMessageType('');
// // // // //     }
// // // // //   }, [input, validateInput]);

// // // // //   const processConversions = useCallback(() => {
// // // // //     if (input.trim() === '') {
// // // // //       setValidationMessage('Input cannot be empty.');
// // // // //       setMessageType('error');
// // // // //       return;
// // // // //     }

// // // // //     if (messageType === 'error') return;

// // // // //     try {
// // // // //       let text = input;
// // // // //       if (inputFormat !== 'text') {
// // // // //         switch (inputFormat) {
// // // // //           case 'ascii':
// // // // //             text = input.split(' ').map(num => String.fromCharCode(parseInt(num))).join('');
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

// // // // //       const asciiValues = Array.from(text).map(char => char.charCodeAt(0)).join(' ');
// // // // //       const base64Value = btoa(unescape(encodeURIComponent(text)));
// // // // //       const binary = Array.from(text).map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
// // // // //       const octal = Array.from(text).map(char => char.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');
// // // // //       const hexadecimal = Array.from(text).map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join(' ');

// // // // //       setOutput({
// // // // //         text,
// // // // //         asciiValues,
// // // // //         binary,
// // // // //         octal,
// // // // //         hexadecimal,
// // // // //         base64: base64Value
// // // // //       });
// // // // //     } catch (err) {
// // // // //       setValidationMessage('An error occurred during conversion. Please check your input.');
// // // // //       setMessageType('error');
// // // // //     }
// // // // //   }, [input, inputFormat, messageType]);

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
// // // // //     setValidationMessage('');
// // // // //     setMessageType('');
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
// // // // //         <div className={styles.inputGroup}>
// // // // //           <label htmlFor="inputFormat">Input Format:</label>
// // // // //           <select
// // // // //             id="inputFormat"
// // // // //             value={inputFormat}
// // // // //             onChange={(e) => handleFormatChange(e.target.value)}
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
// // // // //         <div className={styles.messageContainer}>
// // // // //           {validationMessage && (
// // // // //             <div 
// // // // //               className={messageType === 'warning' ? styles.warning : styles.error} 
// // // // //               role="alert"
// // // // //             >
// // // // //               {validationMessage}
// // // // //             </div>
// // // // //           )}
// // // // //         </div>
// // // // //         <div className={styles.buttonGroup}>
// // // // //           <button 
// // // // //             onClick={processConversions} 
// // // // //             className={`${styles.button} ${styles.convertButton}`} 
// // // // //             disabled={messageType === 'error'}
// // // // //           >
// // // // //             Convert
// // // // //           </button>
// // // // //           <button onClick={reset} className={`${styles.button} ${styles.resetButton}`}>Reset</button>
// // // // //         </div>
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
// // // //   const [validationMessage, setValidationMessage] = useState('');
// // // //   const [messageType, setMessageType] = useState('');
// // // //   const [copyStates, setCopyStates] = useState({
// // // //     text: false,
// // // //     asciiValues: false,
// // // //     binary: false,
// // // //     octal: false,
// // // //     hexadecimal: false,
// // // //     base64: false
// // // //   });

// // // //   const validateInput = useCallback((input, format) => {
// // // //     if (input === '') {
// // // //       setMessageType('');
// // // //       return '';
// // // //     }
// // // //     switch (format) {
// // // //       case 'text':
// // // //         // No validation needed for text input
// // // //         break;
// // // //       case 'ascii':
// // // //         if (!/^\d+(\s\d+)*$/.test(input) || !input.split(' ').every(num => parseInt(num) <= 0x10FFFF)) {
// // // //           setMessageType('error');
// // // //           return 'Invalid ASCII input. Please enter space-separated numbers between 0 and 1114111 (0x10FFFF).';
// // // //         }
// // // //         break;
// // // //       case 'binary':
// // // //         if (!/^[01]+(\s[01]+)*$/.test(input)) {
// // // //           setMessageType('error');
// // // //           return 'Invalid binary input. Please enter space-separated binary numbers.';
// // // //         }
// // // //         break;
// // // //       case 'octal':
// // // //         if (!/^[0-7]+(\s[0-7]+)*$/.test(input)) {
// // // //           setMessageType('error');
// // // //           return 'Invalid octal input. Please enter space-separated octal numbers.';
// // // //         }
// // // //         break;
// // // //       case 'hexadecimal':
// // // //         if (!/^[0-9A-Fa-f]+(\s[0-9A-Fa-f]+)*$/.test(input)) {
// // // //           setMessageType('error');
// // // //           return 'Invalid hexadecimal input. Please enter space-separated hexadecimal numbers.';
// // // //         }
// // // //         break;
// // // //       case 'base64':
// // // //         if (!/^[A-Za-z0-9+/]*={0,2}$/.test(input)) {
// // // //           setMessageType('error');
// // // //           return 'Invalid Base64 input. Please enter a valid Base64 string.';
// // // //         }
// // // //         break;
// // // //       default:
// // // //         setMessageType('error');
// // // //         return 'Unsupported input format.';
// // // //     }
// // // //     setMessageType('');
// // // //     return '';
// // // //   }, []);

// // // //   const handleInputChange = useCallback((value) => {
// // // //     setInput(value);
// // // //     const message = validateInput(value, inputFormat);
// // // //     setValidationMessage(message);
// // // //   }, [inputFormat, validateInput]);

// // // //   const handleFormatChange = useCallback((format) => {
// // // //     setInputFormat(format);
// // // //     const message = validateInput(input, format);
// // // //     setValidationMessage(message);
// // // //   }, [input, validateInput]);

// // // //   const processConversions = useCallback(() => {
// // // //     if (input === '' || messageType === 'error') return;

// // // //     try {
// // // //       let text = '';
// // // //       let hexValues = [];
// // // //       switch (inputFormat) {
// // // //         case 'text':
// // // //           text = input;
// // // //           hexValues = Array.from(input).map(char => char.charCodeAt(0).toString(16).padStart(4, '0'));
// // // //           break;
// // // //         case 'ascii':
// // // //           text = input.split(' ').map(num => {
// // // //             const code = parseInt(num);
// // // //             if (code > 0x10FFFF) {
// // // //               throw new Error('Invalid Unicode code point');
// // // //             }
// // // //             return String.fromCodePoint(code);
// // // //           }).join('');
// // // //           hexValues = input.split(' ').map(num => parseInt(num).toString(16).padStart(4, '0'));
// // // //           break;
// // // //         case 'binary':
// // // //           text = input.split(' ').map(bin => String.fromCodePoint(parseInt(bin, 2))).join('');
// // // //           hexValues = input.split(' ').map(bin => parseInt(bin, 2).toString(16).padStart(4, '0'));
// // // //           break;
// // // //         case 'octal':
// // // //           text = input.split(' ').map(oct => String.fromCodePoint(parseInt(oct, 8))).join('');
// // // //           hexValues = input.split(' ').map(oct => parseInt(oct, 8).toString(16).padStart(4, '0'));
// // // //           break;
// // // //         case 'hexadecimal':
// // // //           hexValues = input.split(' ');
// // // //           text = hexValues.map(hex => String.fromCodePoint(parseInt(hex, 16))).join('');
// // // //           break;
// // // //         case 'base64':
// // // //           text = decodeURIComponent(escape(atob(input)));
// // // //           hexValues = Array.from(text).map(char => char.charCodeAt(0).toString(16).padStart(4, '0'));
// // // //           break;
// // // //         default:
// // // //           setValidationMessage('Unsupported input format.');
// // // //           setMessageType('error');
// // // //           return;
// // // //       }

// // // //       const asciiValues = Array.from(text).map(char => char.charCodeAt(0)).join(' ');
// // // //       const base64Value = btoa(unescape(encodeURIComponent(text)));
// // // //       const binary = Array.from(text).map(char => char.charCodeAt(0).toString(2).padStart(16, '0')).join(' ');
// // // //       const octal = Array.from(text).map(char => char.charCodeAt(0).toString(8).padStart(6, '0')).join(' ');
// // // //       const hexadecimal = hexValues.join(' ');

// // // //       setOutput({
// // // //         text,
// // // //         asciiValues,
// // // //         binary,
// // // //         octal,
// // // //         hexadecimal,
// // // //         base64: base64Value
// // // //       });
// // // //     } catch (err) {
// // // //       setValidationMessage('An error occurred during conversion. Please check your input.');
// // // //       setMessageType('error');
// // // //     }
// // // //   }, [input, inputFormat, messageType]);

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
// // // //     setValidationMessage('');
// // // //     setMessageType('');
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
// // // //             onChange={(e) => handleFormatChange(e.target.value)}
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
// // // //             value={input}
// // // //             onChange={(e) => handleInputChange(e.target.value)}
// // // //             aria-describedby="inputHelp"
// // // //             rows={5}
// // // //           />
// // // //           <small id="inputHelp">Enter text or selected format to convert</small>
// // // //         </div>
// // // //         <div className={styles.messageContainer}>
// // // //           {validationMessage && (
// // // //             <div 
// // // //               className={messageType === 'warning' ? styles.warning : styles.error} 
// // // //               role="alert"
// // // //             >
// // // //               {validationMessage}
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //         <br></br>
// // // //         <div className={styles.buttonGroup}>
// // // //           <button 
// // // //             onClick={processConversions} 
// // // //             className={`${styles.button} ${styles.convertButton}`} 
// // // //             disabled={messageType === 'error'}
// // // //           >
// // // //             Convert
// // // //           </button>
// // // //           <button onClick={reset} className={`${styles.button} ${styles.resetButton}`}>Reset</button>
// // // //         </div>
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
// // //   const [validationMessage, setValidationMessage] = useState('');
// // //   const [messageType, setMessageType] = useState('');
// // //   const [copyStates, setCopyStates] = useState({
// // //     text: false,
// // //     asciiValues: false,
// // //     binary: false,
// // //     octal: false,
// // //     hexadecimal: false,
// // //     base64: false
// // //   });

// // //   const validateInput = useCallback((input, format) => {
// // //     switch (format) {
// // //       case 'text':
// // //         if (/\d/.test(input)) {
// // //           setMessageType('warning');
// // //           return 'Warning: Numeric characters detected in text input. This may lead to unexpected results in some conversions.';
// // //         }
// // //         break;
// // //       case 'ascii':
// // //         if (!/^(\d+\s)*\d+$/.test(input) || input.split(' ').some(num => parseInt(num) > 255)) {
// // //           setMessageType('error');
// // //           return 'Invalid ASCII input. Please enter space-separated numbers between 0 and 255.';
// // //         }
// // //         break;
// // //       case 'binary':
// // //         if (!/^([01]{8}\s)*[01]{8}$/.test(input)) {
// // //           setMessageType('error');
// // //           return 'Invalid binary input. Please enter space-separated 8-bit binary numbers.';
// // //         }
// // //         break;
// // //       case 'octal':
// // //         if (!/^([0-7]{1,3}\s)*[0-7]{1,3}$/.test(input)) {
// // //           setMessageType('error');
// // //           return 'Invalid octal input. Please enter space-separated octal numbers (1 to 3 digits each).';
// // //         }
// // //         break;
// // //       case 'hexadecimal':
// // //         if (!/^([0-9A-Fa-f]{2}\s)*[0-9A-Fa-f]{2}$/.test(input)) {
// // //           setMessageType('error');
// // //           return 'Invalid hexadecimal input. Please enter space-separated 2-digit hexadecimal numbers.';
// // //         }
// // //         break;
// // //       case 'base64':
// // //         if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(input)) {
// // //           setMessageType('error');
// // //           return 'Invalid Base64 input. Please enter a valid Base64 string.';
// // //         }
// // //         break;
// // //       default:
// // //         setMessageType('error');
// // //         return 'Unsupported input format.';
// // //     }
// // //     setMessageType('');
// // //     return '';
// // //   }, []);

// // //   const handleInputChange = useCallback((value) => {
// // //     setInput(value);
// // //     if (value.trim() !== '') {
// // //       const message = validateInput(value, inputFormat);
// // //       setValidationMessage(message);
// // //     } else {
// // //       setValidationMessage('');
// // //       setMessageType('');
// // //     }
// // //   }, [inputFormat, validateInput]);

// // //   const handleFormatChange = useCallback((format) => {
// // //     setInputFormat(format);
// // //     if (input.trim() !== '') {
// // //       const message = validateInput(input, format);
// // //       setValidationMessage(message);
// // //     } else {
// // //       setValidationMessage('');
// // //       setMessageType('');
// // //     }
// // //   }, [input, validateInput]);

// // //   const processConversions = useCallback(() => {
// // //     if (input.trim() === '') {
// // //       setValidationMessage('Input cannot be empty.');
// // //       setMessageType('error');
// // //       return;
// // //     }

// // //     if (messageType === 'error') return;

// // //     try {
// // //       let text = input;
// // //       if (inputFormat !== 'text') {
// // //         switch (inputFormat) {
// // //           case 'ascii':
// // //             text = input.split(' ').map(num => String.fromCharCode(parseInt(num))).join('');
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
// // //       setValidationMessage('An error occurred during conversion. Please check your input.');
// // //       setMessageType('error');
// // //     }
// // //   }, [input, inputFormat, messageType]);

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
// // //     setValidationMessage('');
// // //     setMessageType('');
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
// // //             onChange={(e) => handleFormatChange(e.target.value)}
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
// // //         <div className={styles.messageContainer}>
// // //           {validationMessage && (
// // //             <div 
// // //               className={messageType === 'warning' ? styles.warning : styles.error} 
// // //               role="alert"
// // //             >
// // //               {validationMessage}
// // //             </div>
// // //           )}
// // //         </div>
// // //         <div className={styles.buttonGroup}>
// // //           <button 
// // //             onClick={processConversions} 
// // //             className={`${styles.button} ${styles.convertButton}`} 
// // //             disabled={messageType === 'error'}
// // //           >
// // //             Convert
// // //           </button>
// // //           <button onClick={reset} className={`${styles.button} ${styles.resetButton}`}>Reset</button>
// // //         </div>
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
// // import React, { useState, useCallback } from 'react';
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
// //   const [messageType, setMessageType] = useState('');
// //   const [copyStates, setCopyStates] = useState({
// //     text: false,
// //     asciiValues: false,
// //     binary: false,
// //     octal: false,
// //     hexadecimal: false,
// //     base64: false
// //   });


// //   const validateInput = useCallback((input, format) => {
// //     if (input.trim() === '') {
// //       setMessageType('error');
// //       return 'Input cannot be empty.';
// //     }
    
// //     switch (format) {
// //       case 'text':
// //         if (!/^[\u0000-\u{10FFFF}]*$/u.test(input)) {
// //           setMessageType('error');
// //           return 'Invalid text input. Please enter valid Unicode characters.';
// //         }
// //         break;
// //       case 'ascii':
// //         if (!/^(\d+\s)*\d+$/.test(input)) {
// //           setMessageType('error');
// //           return 'Invalid ASCII input. Please enter space-separated decimal numbers.';
// //         }
// //         if (input.split(' ').some(num => parseInt(num) > 0x10FFFF)) {
// //           setMessageType('error');
// //           return 'ASCII values must be between 0 and 1114111 (0x10FFFF).';
// //         }
// //         break;
// //       case 'binary':
// //         if (!/^([01]+\s)*[01]+$/.test(input)) {
// //           setMessageType('error');
// //           return 'Invalid binary input. Please enter space-separated binary numbers.';
// //         }
// //         break;
// //       case 'octal':
// //         if (!/^([0-7]+\s)*[0-7]+$/.test(input)) {
// //           setMessageType('error');
// //           return 'Invalid octal input. Please enter space-separated octal numbers.';
// //         }
// //         break;
// //       case 'hexadecimal':
// //         if (!/^([0-9A-Fa-f]+\s)*[0-9A-Fa-f]+$/.test(input)) {
// //           setMessageType('error');
// //           return 'Invalid hexadecimal input. Please enter space-separated hexadecimal numbers.';
// //         }
// //         break;
// //       case 'base64':
// //         if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(input)) {
// //           setMessageType('error');
// //           return 'Invalid Base64 input. Please enter a valid Base64 string.';
// //         }
// //         break;
// //       default:
// //         setMessageType('error');
// //         return 'Unsupported input format.';
// //     }
    
// //     setMessageType('');
// //     return '';
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

// //   const processConversions = useCallback(() => {
// //     if (input === '' || messageType === 'error') return;
  
// //     try {
// //       let text = '';
// //       let hexValues = [];
// //       switch (inputFormat) {
// //         case 'text':
// //           text = input;
// //           hexValues = Array.from(input).map(char => char.codePointAt(0).toString(16).padStart(4, '0'));
// //           break;
// //         case 'unicode':
// //           text = input.split(' ').map(num => {
// //             const code = parseInt(num);
// //             if (code > 0x10FFFF) {
// //               throw new Error('Invalid Unicode code point');
// //             }
// //             return String.fromCodePoint(code);
// //           }).join('');
// //           hexValues = input.split(' ').map(num => parseInt(num).toString(16).padStart(4, '0'));
// //           break;
// //         case 'binary':
// //           text = input.split(' ').map(bin => String.fromCodePoint(parseInt(bin, 2))).join('');
// //           hexValues = input.split(' ').map(bin => parseInt(bin, 2).toString(16).padStart(4, '0'));
// //           break;
// //         case 'octal':
// //           text = input.split(' ').map(oct => String.fromCodePoint(parseInt(oct, 8))).join('');
// //           hexValues = input.split(' ').map(oct => parseInt(oct, 8).toString(16).padStart(4, '0'));
// //           break;
// //         case 'hexadecimal':
// //           hexValues = input.split(' ');
// //           text = hexValues.map(hex => String.fromCodePoint(parseInt(hex, 16))).join('');
// //           break;
// //         case 'base64':
// //           text = decodeURIComponent(escape(atob(input)));
// //           hexValues = Array.from(text).map(char => char.codePointAt(0).toString(16).padStart(4, '0'));
// //           break;
// //         default:
// //           setValidationMessage('Unsupported input format.');
// //           setMessageType('error');
// //           return;
// //       }
  
// //       const unicodeValues = Array.from(text).map(char => char.codePointAt(0)).join(' ');
// //       const base64Value = btoa(unescape(encodeURIComponent(text)));
// //       const binary = Array.from(text).map(char => char.codePointAt(0).toString(2).padStart(16, '0')).join(' ');
// //       const octal = Array.from(text).map(char => char.codePointAt(0).toString(8).padStart(6, '0')).join(' ');
// //       const hexadecimal = hexValues.join(' ');
  
// //       // ASCII calculation
// //       const asciiValues = Array.from(text).map(char => {
// //         const code = char.charCodeAt(0);
// //         return code >= 0 && code <= 127 ? code.toString() : 'No ASCII value';
// //       }).join(' ');
  
// //       setOutput({
// //         text,
// //         unicodeValues,
// //         asciiValues,  // Add this line
// //         binary,
// //         octal,
// //         hexadecimal,
// //         base64: base64Value
// //       });
// //     } catch (err) {
// //       setValidationMessage('An error occurred during conversion. Please check your input.');
// //       setMessageType('error');
// //     }
// //   }, [input, inputFormat, messageType]);
  
 
// // //   const processConversions = useCallback(() => {
// // //   if (input === '' || messageType === 'error') return;

// // //   try {
// // //     let text = '';
// // //     let hexValues = [];
// // //     switch (inputFormat) {
// // //       case 'text':
// // //         text = input;
// // //         hexValues = Array.from(input).map(char => char.codePointAt(0).toString(16).padStart(4, '0'));
// // //         break;
// // //       case 'unicode':
// // //         text = input.split(' ').map(num => {
// // //           const code = parseInt(num);
// // //           if (code > 0x10FFFF) {
// // //             throw new Error('Invalid Unicode code point');
// // //           }
// // //           return String.fromCodePoint(code);
// // //         }).join('');
// // //         hexValues = input.split(' ').map(num => parseInt(num).toString(16).padStart(4, '0'));
// // //         break;
// // //       case 'binary':
// // //         text = input.split(' ').map(bin => String.fromCodePoint(parseInt(bin, 2))).join('');
// // //         hexValues = input.split(' ').map(bin => parseInt(bin, 2).toString(16).padStart(4, '0'));
// // //         break;
// // //       case 'octal':
// // //         text = input.split(' ').map(oct => String.fromCodePoint(parseInt(oct, 8))).join('');
// // //         hexValues = input.split(' ').map(oct => parseInt(oct, 8).toString(16).padStart(4, '0'));
// // //         break;
// // //       case 'hexadecimal':
// // //         hexValues = input.split(' ');
// // //         text = hexValues.map(hex => String.fromCodePoint(parseInt(hex, 16))).join('');
// // //         break;
// // //       case 'base64':
// // //         text = decodeURIComponent(escape(atob(input)));
// // //         hexValues = Array.from(text).map(char => char.codePointAt(0).toString(16).padStart(4, '0'));
// // //         break;
// // //       default:
// // //         setValidationMessage('Unsupported input format.');
// // //         setMessageType('error');
// // //         return;
// // //     }

// // //     const unicodeValues = Array.from(text).map(char => char.codePointAt(0)).join(' ');
// // //     const base64Value = btoa(unescape(encodeURIComponent(text)));
// // //     const binary = Array.from(text).map(char => char.codePointAt(0).toString(2).padStart(16, '0')).join(' ');
// // //     const octal = Array.from(text).map(char => char.codePointAt(0).toString(8).padStart(6, '0')).join(' ');
// // //     const hexadecimal = hexValues.join(' ');

// // //     setOutput({
// // //       text,
// // //       unicodeValues,
// // //       binary,
// // //       octal,
// // //       hexadecimal,
// // //       base64: base64Value
// // //     });
// // //   } catch (err) {
// // //     setValidationMessage('An error occurred during conversion. Please check your input.');
// // //     setMessageType('error');
// // //   }
// // // }, [input, inputFormat, messageType]);  


// // const reset = useCallback(() => {
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
// //     setMessageType('');
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
// //         <div class Name={styles.inputGroup}>
// //           <label htmlFor="inputFormat">Input Format:</label>
// //           <select
// //             id="inputFormat"
// //             value={inputFormat}
// //             onChange={(e) => handleFormatChange(e.target.value)}
// //             className={styles.selectField}
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
// //             value={input}
// //             onChange={(e) => handleInputChange(e.target.value)}
// //             aria-describedby="inputHelp"
// //             rows={5}
// //           />
// //           <small id="inputHelp">Enter text or selected format to convert</small>
// //         </div>
// //         <div className={styles.messageContainer}>
// //           {validationMessage && (
// //             <div 
// //               className={messageType === 'warning' ? styles.warning : styles.error} 
// //               role="alert"
// //             >
// //               {validationMessage}
// //             </div>
// //           )}
// //         </div>
// //         <br></br>
// //         <div className={styles.buttonGroup}>
// //           <button 
// //             onClick={processConversions} 
// //             className={`${styles.button} ${styles.convertButton}`} 
// //             disabled={messageType === 'error'}
// //           >
// //             Convert
// //           </button>
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
// import React, { useState, useCallback } from 'react';
// import styles from './AsciiConverter.module.css';

// const AsciiConverter = () => {
//   const [input, setInput] = useState('');
//   const [inputFormat, setInputFormat] = useState('text');
//   const [output, setOutput] = useState({
//     text: '',
//     unicodeValues: '',
//     asciiValues: '',
//     binary: '',
//     octal: '',
//     hexadecimal: '',
//     base64: ''
//   });
//   const [validationMessage, setValidationMessage] = useState('');
//   const [messageType, setMessageType] = useState('');
//   const [hasAttemptedConversion, setHasAttemptedConversion] = useState(false);
//   const [copyStates, setCopyStates] = useState({
//     text: false,
//     unicodeValues: false,
//     asciiValues: false,
//     binary: false,
//     octal: false,
//     hexadecimal: false,
//     base64: false
//   });

//   const handleInputChange = useCallback((value) => {
//     setInput(value);
//     setHasAttemptedConversion(false);

//     if (inputFormat === 'text' && /\d/.test(value)) {
//       setValidationMessage('Warning: You are entering numbers in text mode.');
//       setMessageType('warning');
//     } else {
//       setValidationMessage('');
//       setMessageType('');
//     }
//   }, [inputFormat]);

//   const validateInput = useCallback(() => {
//     if (input.trim() === '') {
//       setValidationMessage('Input cannot be empty.');
//       setMessageType('error');
//       return false;
//     }

//     switch (inputFormat) {
//       case 'text':
//         // No additional validation needed for text
//         break;
//       case 'unicode':
//         if (!/^(\d+\s)*\d+$/.test(input)) {
//           setValidationMessage('Invalid Unicode input. Please enter space-separated decimal numbers.');
//           setMessageType('error');
//           return false;
//         }
//         break;
//       case 'binary':
//         if (!/^([01]+\s)*[01]+$/.test(input)) {
//           setValidationMessage('Invalid binary input. Please enter space-separated binary numbers.');
//           setMessageType('error');
//           return false;
//         }
//         break;
//       case 'octal':
//         if (!/^([0-7]+\s)*[0-7]+$/.test(input)) {
//           setValidationMessage('Invalid octal input. Please enter space-separated octal numbers.');
//           setMessageType('error');
//           return false;
//         }
//         break;
//       case 'hexadecimal':
//         if (!/^([0-9A-Fa-f]+\s)*[0-9A-Fa-f]+$/.test(input)) {
//           setValidationMessage('Invalid hexadecimal input. Please enter space-separated hexadecimal numbers.');
//           setMessageType('error');
//           return false;
//         }
//         break;
//       case 'base64':
//         if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(input)) {
//           setValidationMessage('Invalid Base64 input. Please enter a valid Base64 string.');
//           setMessageType('error');
//           return false;
//         }
//         break;
//       default:
//         setValidationMessage('Unsupported input format.');
//         setMessageType('error');
//         return false;
//     }

//     return true;
//   }, [input, inputFormat]);

//   const processConversions = useCallback(() => {
//     if (input === '' || messageType === 'error') return;

//     try {
//       let text = '';
//       let hexValues = [];
//       switch (inputFormat) {
//         case 'text':
//           text = input;
//           hexValues = Array.from(input).map(char => char.codePointAt(0).toString(16).padStart(4, '0'));
//           break;
//         case 'unicode':
//           text = input.split(' ').map(num => {
//             const code = parseInt(num);
//             if (code > 0x10FFFF) {
//               throw new Error('Invalid Unicode code point');
//             }
//             return String.fromCodePoint(code);
//           }).join('');
//           hexValues = input.split(' ').map(num => parseInt(num).toString(16).padStart(4, '0'));
//           break;
//         case 'binary':
//           text = input.split(' ').map(bin => String.fromCodePoint(parseInt(bin, 2))).join('');
//           hexValues = input.split(' ').map(bin => parseInt(bin, 2).toString(16).padStart(4, '0'));
//           break;
//         case 'octal':
//           text = input.split(' ').map(oct => String.fromCodePoint(parseInt(oct, 8))).join('');
//           hexValues = input.split(' ').map(oct => parseInt(oct, 8).toString(16).padStart(4, '0'));
//           break;
//         case 'hexadecimal':
//           hexValues = input.split(' ');
//           text = hexValues.map(hex => String.fromCodePoint(parseInt(hex, 16))).join('');
//           break;
//         case 'base64':
//           text = decodeURIComponent(escape(atob(input)));
//           hexValues = Array.from(text).map(char => char.codePointAt(0).toString(16).padStart(4, '0'));
//           break;
//         default:
//           setValidationMessage('Unsupported input format.');
//           setMessageType('error');
//           return;
//       }

//       const unicodeValues = Array.from(text).map(char => char.codePointAt(0)).join(' ');
//       const base64Value = btoa(unescape(encodeURIComponent(text)));
//       const binary = Array.from(text).map(char => char.codePointAt(0).toString(2).padStart(16, '0')).join(' ');
//       const octal = Array.from(text).map(char => char.codePointAt(0).toString(8).padStart(6, '0')).join(' ');
//       const hexadecimal = hexValues.join(' ');

//       // ASCII calculation
//       const asciiValues = Array.from(text).map(char => {
//         const code = char.charCodeAt(0);
//         return code >= 0 && code <= 127 ? code.toString() : 'No ASCII value';
//       }).join(' ');

//       setOutput({
//         text,
//         unicodeValues,
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
//   }, [input, inputFormat, messageType]);

//   const handleConvert = useCallback(() => {
//     setHasAttemptedConversion(true);
//     if (validateInput()) {
//       processConversions();
//     }
//   }, [validateInput, processConversions]);

//   const handleFormatChange = useCallback((format) => {
//     setInputFormat(format);
//     setValidationMessage('');
//     setMessageType('');
//     setHasAttemptedConversion(false);
//   }, []);

//   const reset = useCallback(() => {
//     setInput('');
//     setInputFormat('text');
//     setOutput({
//       text: '',
//       unicodeValues: '',
//       asciiValues: '',
//       binary: '',
//       octal: '',
//       hexadecimal: '',
//       base64: ''
//     });
//     setValidationMessage('');
//     setMessageType('');
//     setHasAttemptedConversion(false);
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
//             className={styles.selectField}
//           >
//             <option value="text">Text</option>
//             <option value="unicode">Unicode</option>
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
//             value={input}
//             onChange={(e) => handleInputChange(e.target.value)}
//             aria-describedby="inputHelp"
//             rows={5}
//           />
//           <small id="inputHelp">Enter text or selected format to convert</small>
//         </div>
//         <div className={styles.messageContainer}>
//           {hasAttemptedConversion && validationMessage && (
//             <div 
//               className={messageType === 'warning' ? styles.warning : styles.error} 
//               role="alert"
//             >
//               {validationMessage}
//             </div>
//           )}
//         </div>
//         <br></br>
//         <div className={styles.buttonGroup}>
//           <button 
//             onClick={handleConvert} 
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
//         <OutputField label="Unicode Values" value={output.unicodeValues} field="unicodeValues" />
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
    unicodeValues: '',
    asciiValues: '',
    binary: '',
    octal: '',
    hexadecimal: '',
    base64: ''
  });
  const [validationMessage, setValidationMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [hasAttemptedConversion, setHasAttemptedConversion] = useState(false);
  const [copyStates, setCopyStates] = useState({
    text: false,
    unicodeValues: false,
    asciiValues: false,
    binary: false,
    octal: false,
    hexadecimal: false,
    base64: false
  });

  const validateInput = useCallback((value, format) => {
    if (value.trim() === '') {
      setValidationMessage('');
      setMessageType('');
      return;
    }

    switch (format) {
      case 'text':
        if (/\d/.test(value)) {
          setValidationMessage('Warning: You are entering numbers in text mode.Be aware that the numbers will be parsed as strings.');
          setMessageType('warning');
        } else {
          setValidationMessage('');
          setMessageType('');
        }
        break;
      case 'unicode':
        if (!/^(\d+\s)*\d+$/.test(value)) {
          setValidationMessage('Invalid Unicode input. Please enter space-separated decimal numbers.');
          setMessageType('error');
        } else {
          setValidationMessage('');
          setMessageType('');
        }
        break;
      case 'binary':
        if (!/^([01]+\s)*[01]+$/.test(value)) {
          setValidationMessage('Invalid binary input. Please enter space-separated binary numbers.');
          setMessageType('error');
        } else {
          setValidationMessage('');
          setMessageType('');
        }
        break;
      case 'octal':
        if (!/^([0-7]+\s)*[0-7]+$/.test(value)) {
          setValidationMessage('Invalid octal input. Please enter space-separated octal numbers.');
          setMessageType('error');
        } else {
          setValidationMessage('');
          setMessageType('');
        }
        break;
      case 'hexadecimal':
        if (!/^([0-9A-Fa-f]+\s)*[0-9A-Fa-f]+$/.test(value)) {
          setValidationMessage('Invalid hexadecimal input. Please enter space-separated hexadecimal numbers.');
          setMessageType('error');
        } else {
          setValidationMessage('');
          setMessageType('');
        }
        break;
      case 'base64':
        if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) {
          setValidationMessage('Invalid Base64 input. Please enter a valid Base64 string.');
          setMessageType('error');
        } else {
          setValidationMessage('');
          setMessageType('');
        }
        break;
      default:
        setValidationMessage('Unsupported input format.');
        setMessageType('error');
    }
  }, []);

  const handleInputChange = useCallback((value) => {
    setInput(value);
    setHasAttemptedConversion(false);
    validateInput(value, inputFormat);
  }, [inputFormat, validateInput]);

  const processConversions = useCallback(() => {
    if (input === '' || messageType === 'error') return;

    try {
      let text = '';
      let hexValues = [];
      switch (inputFormat) {
        case 'text':
          text = input;
          hexValues = Array.from(input).map(char => char.codePointAt(0).toString(16).padStart(4, '0'));
          break;
        case 'unicode':
          text = input.split(' ').map(num => {
            const code = parseInt(num);
            if (code > 0x10FFFF) {
              throw new Error('Invalid Unicode code point');
            }
            return String.fromCodePoint(code);
          }).join('');
          hexValues = input.split(' ').map(num => parseInt(num).toString(16).padStart(4, '0'));
          break;
        case 'binary':
          text = input.split(' ').map(bin => String.fromCodePoint(parseInt(bin, 2))).join('');
          hexValues = input.split(' ').map(bin => parseInt(bin, 2).toString(16).padStart(4, '0'));
          break;
        case 'octal':
          text = input.split(' ').map(oct => String.fromCodePoint(parseInt(oct, 8))).join('');
          hexValues = input.split(' ').map(oct => parseInt(oct, 8).toString(16).padStart(4, '0'));
          break;
        case 'hexadecimal':
          hexValues = input.split(' ');
          text = hexValues.map(hex => String.fromCodePoint(parseInt(hex, 16))).join('');
          break;
        case 'base64':
          text = decodeURIComponent(escape(atob(input)));
          hexValues = Array.from(text).map(char => char.codePointAt(0).toString(16).padStart(4, '0'));
          break;
        default:
          setValidationMessage('Unsupported input format.');
          setMessageType('error');
          return;
      }

      const unicodeValues = Array.from(text).map(char => char.codePointAt(0)).join(' ');
      const base64Value = btoa(unescape(encodeURIComponent(text)));
      const binary = Array.from(text).map(char => char.codePointAt(0).toString(2).padStart(16, '0')).join(' ');
      const octal = Array.from(text).map(char => char.codePointAt(0).toString(8).padStart(6, '0')).join(' ');
      const hexadecimal = hexValues.join(' ');

      const asciiValues = Array.from(text).map(char => {
        const code = char.charCodeAt(0);
        return code >= 0 && code <= 127 ? code.toString() : 'No ASCII value';
      }).join(' ');

      setOutput({
        text,
        unicodeValues,
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

  const handleConvert = useCallback(() => {
    setHasAttemptedConversion(true);
    if (input.trim() === '') {
      setValidationMessage('Input cannot be empty.');
      setMessageType('error');
    } else {
      processConversions();
    }
  }, [input, processConversions]);

  const handleFormatChange = useCallback((format) => {
    setInputFormat(format);
    validateInput(input, format);
  }, [input, validateInput]);

  const reset = useCallback(() => {
    setInput('');
    setInputFormat('text');
    setOutput({
      text: '',
      unicodeValues: '',
      asciiValues: '',
      binary: '',
      octal: '',
      hexadecimal: '',
      base64: ''
    });
    setValidationMessage('');
    setMessageType('');
    setHasAttemptedConversion(false);
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
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
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
            className={styles.selectField}
          >
            <option value="text">Text</option>
            <option value="unicode">Unicode</option>
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
        <br />
        <div className={styles.buttonGroup}>
          <button 
            onClick={handleConvert} 
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
        {/* <OutputField label="Unicode Values" value={output.unicodeValues} field="unicodeValues" /> */}
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