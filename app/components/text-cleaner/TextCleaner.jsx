// // // // // // // // import React, { useState } from 'react';

// // // // // // // // const TextCleaner = () => {
// // // // // // // //   const [inputText, setInputText] = useState('');
// // // // // // // //   const [outputText, setOutputText] = useState('');

// // // // // // // //   const cleanText = () => {
// // // // // // // //     let cleaned = inputText
// // // // // // // //       // Remove extra spaces
// // // // // // // //       .replace(/\s+/g, ' ')
// // // // // // // //       // Trim lines
// // // // // // // //       .split('\n')
// // // // // // // //       .map(line => line.trim())
// // // // // // // //       .join('\n')
// // // // // // // //       // Remove empty lines
// // // // // // // //       .replace(/^\s*[\r\n]/gm, '')
// // // // // // // //       // Remove duplicate lines
// // // // // // // //       .split('\n')
// // // // // // // //       .filter((line, index, self) => self.indexOf(line) === index)
// // // // // // // //       .join('\n');

// // // // // // // //     setOutputText(cleaned);
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <div>
// // // // // // // //       <h2>Text Cleaner</h2>
// // // // // // // //       <textarea
// // // // // // // //         value={inputText}
// // // // // // // //         onChange={(e) => setInputText(e.target.value)}
// // // // // // // //         placeholder="Paste your text here"
// // // // // // // //         rows="10"
// // // // // // // //         cols="50"
// // // // // // // //       />
// // // // // // // //       <br />
// // // // // // // //       <button onClick={cleanText}>Clean Text</button>
// // // // // // // //       <br />
// // // // // // // //       <textarea
// // // // // // // //         value={outputText}
// // // // // // // //         readOnly
// // // // // // // //         placeholder="Cleaned text will appear here"
// // // // // // // //         rows="10"
// // // // // // // //         cols="50"
// // // // // // // //       />
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default TextCleaner;
// // // // // // // 'use client'

// // // // // // // import React, { useState, useRef, useEffect } from 'react';

// // // // // // // const TextCleaner = () => {
// // // // // // //   const [inputText, setInputText] = useState('');
// // // // // // //   const [outputText, setOutputText] = useState('');
// // // // // // //   const [copyButtonText, setCopyButtonText] = useState('Copy');
// // // // // // //   const fileInputRef = useRef(null);

// // // // // // //   const cleanText = () => {
// // // // // // //     let cleaned = inputText
// // // // // // //       .replace(/\s+/g, ' ')
// // // // // // //       .split('\n')
// // // // // // //       .map(line => line.trim())
// // // // // // //       .join('\n')
// // // // // // //       .replace(/^\s*[\r\n]/gm, '')
// // // // // // //       .split('\n')
// // // // // // //       .filter((line, index, self) => self.indexOf(line) === index)
// // // // // // //       .join('\n');

// // // // // // //     setOutputText(cleaned);
// // // // // // //   };

// // // // // // //   const resetFields = () => {
// // // // // // //     setInputText('');
// // // // // // //     setOutputText('');
// // // // // // //     if (fileInputRef.current) {
// // // // // // //       fileInputRef.current.value = '';
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleFileUpload = (event) => {
// // // // // // //     const file = event.target.files[0];
// // // // // // //     if (file) {
// // // // // // //       const reader = new FileReader();
// // // // // // //       reader.onload = (e) => {
// // // // // // //         setInputText(e.target.result);
// // // // // // //       };
// // // // // // //       reader.readAsText(file);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleCopy = () => {
// // // // // // //     navigator.clipboard.writeText(outputText).then(() => {
// // // // // // //       setCopyButtonText('Copied!');
// // // // // // //       setTimeout(() => {
// // // // // // //         setCopyButtonText('Copy');
// // // // // // //       }, 5000);
// // // // // // //     });
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div>
// // // // // // //       <h2>Text Cleaner</h2>
// // // // // // //       <textarea
// // // // // // //         value={inputText}
// // // // // // //         onChange={(e) => setInputText(e.target.value)}
// // // // // // //         placeholder="Paste your text here"
// // // // // // //         rows="10"
// // // // // // //         cols="50"
// // // // // // //       />
// // // // // // //       <br />
// // // // // // //       <input 
// // // // // // //         type="file" 
// // // // // // //         onChange={handleFileUpload} 
// // // // // // //         accept=".txt"
// // // // // // //         ref={fileInputRef}
// // // // // // //       />
// // // // // // //       <br />
// // // // // // //       <button onClick={cleanText}>Clean Text</button>
// // // // // // //       <button onClick={resetFields}>Reset</button>
// // // // // // //       <br />
// // // // // // //       <textarea
// // // // // // //         value={outputText}
// // // // // // //         readOnly
// // // // // // //         placeholder="Cleaned text will appear here"
// // // // // // //         rows="10"
// // // // // // //         cols="50"
// // // // // // //       />
// // // // // // //       <br />
// // // // // // //       <button onClick={handleCopy}>{copyButtonText}</button>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default TextCleaner;
// // // // // // 'use client'

// // // // // // import React, { useState } from 'react';

// // // // // // const TextProcessor = () => {
// // // // // //   const [inputText, setInputText] = useState('');
// // // // // //   const [outputText, setOutputText] = useState('');
// // // // // //   const [findText, setFindText] = useState('');
// // // // // //   const [replaceText, setReplaceText] = useState('');
// // // // // //   const [caseSensitive, setCaseSensitive] = useState(false);
// // // // // //   const [message, setMessage] = useState('');

// // // // // //   const handleFindReplace = () => {
// // // // // //     if (!findText) {
// // // // // //       setMessage('Please enter text to find.');
// // // // // //       return;
// // // // // //     }

// // // // // //     let newText = inputText;
// // // // // //     const regex = caseSensitive ? new RegExp(findText, 'g') : new RegExp(findText, 'gi');
// // // // // //     if (inputText.match(regex)) {
// // // // // //       newText = inputText.replace(regex, replaceText);
// // // // // //       setOutputText(newText);
// // // // // //       setMessage('Replacement complete.');
// // // // // //     } else {
// // // // // //       setMessage('Text not found.');
// // // // // //     }
// // // // // //   };

// // // // // //   const handleReset = () => {
// // // // // //     setInputText('');
// // // // // //     setOutputText('');
// // // // // //     setFindText('');
// // // // // //     setReplaceText('');
// // // // // //     setCaseSensitive(false);
// // // // // //     setMessage('');
// // // // // //   };

// // // // // //   const handleCopy = () => {
// // // // // //     navigator.clipboard.writeText(outputText).then(() => {
// // // // // //       setMessage('Text copied to clipboard.');
// // // // // //     });
// // // // // //   };

// // // // // //   return (
// // // // // //     <div>
// // // // // //       <textarea
// // // // // //         value={inputText}
// // // // // //         onChange={(e) => setInputText(e.target.value)}
// // // // // //         placeholder="Enter your text here"
// // // // // //         rows="10"
// // // // // //         cols="50"
// // // // // //       />
// // // // // //       <br />
// // // // // //       <input
// // // // // //         type="text"
// // // // // //         value={findText}
// // // // // //         onChange={(e) => setFindText(e.target.value)}
// // // // // //         placeholder="Find"
// // // // // //       />
// // // // // //       <input
// // // // // //         type="text"
// // // // // //         value={replaceText}
// // // // // //         onChange={(e) => setReplaceText(e.target.value)}
// // // // // //         placeholder="Replace with"
// // // // // //       />
// // // // // //       <button onClick={handleFindReplace}>Replace</button>
// // // // // //       <button onClick={handleReset}>Reset</button>
// // // // // //       <br />
// // // // // //       <label>
// // // // // //         <input
// // // // // //           type="checkbox"
// // // // // //           checked={caseSensitive}
// // // // // //           onChange={(e) => setCaseSensitive(e.target.checked)}
// // // // // //         />
// // // // // //         Case sensitive
// // // // // //       </label>
// // // // // //       <br />
// // // // // //       <textarea
// // // // // //         value={outputText}
// // // // // //         readOnly
// // // // // //         placeholder="Processed text will appear here"
// // // // // //         rows="10"
// // // // // //         cols="50"
// // // // // //       />
// // // // // //       <br />
// // // // // //       <button onClick={handleCopy}>Copy Processed Text</button>
// // // // // //       {message && <p>{message}</p>}
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default TextProcessor;
// // // // // 'use client'

// // // // // import React, { useState } from 'react';

// // // // // const TextProcessor = () => {
// // // // //   const [inputText, setInputText] = useState('');
// // // // //   const [outputText, setOutputText] = useState('');
// // // // //   const [findText, setFindText] = useState('');
// // // // //   const [replaceText, setReplaceText] = useState('');
// // // // //   const [caseSensitive, setCaseSensitive] = useState(false);
// // // // //   const [message, setMessage] = useState('');
// // // // //   const [showFindReplace, setShowFindReplace] = useState(false);

// // // // //   const cleanText = () => {
// // // // //     let cleaned = inputText
// // // // //       .replace(/\s+/g, ' ')
// // // // //       .split('\n')
// // // // //       .map(line => line.trim())
// // // // //       .join('\n')
// // // // //       .replace(/^\s*[\r\n]/gm, '')
// // // // //       .split('\n')
// // // // //       .filter((line, index, self) => self.indexOf(line) === index)
// // // // //       .join('\n');

// // // // //     setOutputText(cleaned);
// // // // //     setMessage('Text cleaned successfully.');
// // // // //   };

// // // // // //   const handleFindReplace = () => {
// // // // // //     if (!findText) {
// // // // // //       setMessage('Please enter text to find.');
// // // // // //       return;
// // // // // //     }

// // // // // //     let newText = inputText;
// // // // // //     const regex = caseSensitive ? new RegExp(findText, 'g') : new RegExp(findText, 'gi');
// // // // // //     if (inputText.match(regex)) {
// // // // // //       newText = inputText.replace(regex, replaceText);
// // // // // //       setOutputText(newText);
// // // // // //       setMessage('Replacement complete.');
// // // // // //     } else {
// // // // // //       setMessage('Text not found.');
// // // // // //     }
// // // // // //   };

// // // // // const handleFindReplace = () => {
// // // // //     if (!findText) {
// // // // //       setMessage('Please enter text to find.');
// // // // //       return;
// // // // //     }
  
// // // // //     let newText = inputText;
// // // // //     let regex;
    
// // // // //     try {
// // // // //       if (caseSensitive) {
// // // // //         regex = new RegExp(findText, 'g');
// // // // //       } else {
// // // // //         regex = new RegExp(findText, 'gi');
// // // // //       }
      
// // // // //       newText = newText.replace(regex, replaceText);
      
// // // // //       if (newText !== inputText) {
// // // // //         setOutputText(newText);
// // // // //         setMessage('Replacement complete.');
// // // // //       } else {
// // // // //         setMessage('Text not found.');
// // // // //       }
// // // // //     } catch (error) {
// // // // //       setMessage('Invalid search pattern. Please check your input.');
// // // // //     }
// // // // //   };  

// // // // // const handleReset = () => {
// // // // //     setInputText('');
// // // // //     setOutputText('');
// // // // //     setFindText('');
// // // // //     setReplaceText('');
// // // // //     setCaseSensitive(false);
// // // // //     setMessage('');
// // // // //     setShowFindReplace(false)
// // // // //   };

// // // // //   const handleCopy = () => {
// // // // //     navigator.clipboard.writeText(outputText).then(() => {
// // // // //       setMessage('Text copied to clipboard.');
// // // // //     });
// // // // //   };

// // // // //   return (
// // // // //     <div>
// // // // //       <textarea
// // // // //         value={inputText}
// // // // //         onChange={(e) => setInputText(e.target.value)}
// // // // //         placeholder="Enter your text here"
// // // // //         rows="10"
// // // // //         cols="50"
// // // // //       />
// // // // //       <br />
// // // // //       <button onClick={cleanText}>Clean Text</button>
// // // // //       <button onClick={() => setShowFindReplace(!showFindReplace)}>
// // // // //         {showFindReplace ? 'Hide Find & Replace' : 'Show Find & Replace'}
// // // // //       </button>
// // // // //       <button onClick={handleReset}>Reset</button>
// // // // //       <br />
// // // // //       {showFindReplace && (
// // // // //         <div>
// // // // //           <input
// // // // //             type="text"
// // // // //             value={findText}
// // // // //             onChange={(e) => setFindText(e.target.value)}
// // // // //             placeholder="Find"
// // // // //           />
// // // // //           <input
// // // // //             type="text"
// // // // //             value={replaceText}
// // // // //             onChange={(e) => setReplaceText(e.target.value)}
// // // // //             placeholder="Replace with"
// // // // //           />
// // // // //           <button onClick={handleFindReplace}>Replace</button>
// // // // //           <br />
// // // // //           <label>
// // // // //             <input
// // // // //               type="checkbox"
// // // // //               checked={caseSensitive}
// // // // //               onChange={(e) => setCaseSensitive(e.target.checked)}
// // // // //             />
// // // // //             Case sensitive
// // // // //           </label>
// // // // //         </div>
// // // // //       )}
// // // // //       <br />
// // // // //       <textarea
// // // // //         value={outputText}
// // // // //         readOnly
// // // // //         placeholder="Processed text will appear here"
// // // // //         rows="10"
// // // // //         cols="50"
// // // // //       />
// // // // //       <br />
// // // // //       <button onClick={handleCopy}>Copy Processed Text</button>
// // // // //       {message && <p>{message}</p>}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default TextProcessor;
// // // // 'use client'

// // // // import React, { useState, useEffect, useRef } from 'react';

// // // // const TextProcessor = () => {
// // // //   const [inputText, setInputText] = useState('');
// // // //   const [outputText, setOutputText] = useState('');
// // // //   const [findText, setFindText] = useState('');
// // // //   const [replaceText, setReplaceText] = useState('');
// // // //   const [caseSensitive, setCaseSensitive] = useState(false);
// // // //   const [message, setMessage] = useState('');
// // // //   const [showFindReplace, setShowFindReplace] = useState(false);
// // // //   const [highlightedText, setHighlightedText] = useState('');
// // // //   const inputRef = useRef(null);
// // // //   const fileInputRef = useRef(null);

// // // //   useEffect(() => {
// // // //     highlightMatches();
// // // //   }, [inputText, findText, caseSensitive]);

// // // //   const highlightMatches = () => {
// // // //     if (!findText) {
// // // //       setHighlightedText(inputText);
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const regex = new RegExp(findText, caseSensitive ? 'g' : 'gi');
// // // //       const highlighted = inputText.replace(regex, match => `<mark>${match}</mark>`);
// // // //       setHighlightedText(highlighted);
// // // //     } catch (error) {
// // // //       setHighlightedText(inputText);
// // // //     }
// // // //   };

// // // //   const handleInputChange = () => {
// // // //     if (inputRef.current) {
// // // //       setInputText(inputRef.current.innerText);
// // // //     }
// // // //   };

// // // //   const handleFileUpload = (event) => {
// // // //     const file = event.target.files[0];
// // // //     if (file) {
// // // //       const reader = new FileReader();
// // // //       reader.onload = (e) => {
// // // //         setInputText(e.target.result);
// // // //         if (inputRef.current) {
// // // //           inputRef.current.innerText = e.target.result;
// // // //         }
// // // //       };
// // // //       reader.readAsText(file);
// // // //     }
// // // //   };

// // // //   const cleanText = () => {
// // // //     let cleaned = inputText
// // // //       .replace(/\s+/g, ' ')
// // // //       .split('\n')
// // // //       .map(line => line.trim())
// // // //       .join('\n')
// // // //       .replace(/^\s*[\r\n]/gm, '')
// // // //       .split('\n')
// // // //       .filter((line, index, self) => self.indexOf(line) === index)
// // // //       .join('\n');

// // // //     setOutputText(cleaned);
// // // //     setMessage('Text cleaned successfully.');
// // // //   };

// // // //   const handleFindReplace = () => {
// // // //     if (!findText) {
// // // //       setMessage('Please enter text to find.');
// // // //       return;
// // // //     }

// // // //     try {
// // // //       const regex = new RegExp(findText, caseSensitive ? 'g' : 'gi');
// // // //       const newText = inputText.replace(regex, replaceText);
      
// // // //       if (newText !== inputText) {
// // // //         setOutputText(newText);
// // // //         setMessage('Replacement complete.');
// // // //       } else {
// // // //         setMessage('Text not found.');
// // // //       }
// // // //     } catch (error) {
// // // //       setMessage('Invalid search pattern. Please check your input.');
// // // //     }
// // // //   };

// // // //   const handleReset = () => {
// // // //     setInputText('');
// // // //     setOutputText('');
// // // //     setFindText('');
// // // //     setReplaceText('');
// // // //     setCaseSensitive(false);
// // // //     setMessage('');
// // // //     setHighlightedText('');
// // // //     if (inputRef.current) {
// // // //       inputRef.current.innerText = '';
// // // //     }
// // // //     if (fileInputRef.current) {
// // // //       fileInputRef.current.value = '';
// // // //     }
// // // //   };

// // // //   const handleCopy = () => {
// // // //     navigator.clipboard.writeText(outputText).then(() => {
// // // //       setMessage('Text copied to clipboard.');
// // // //     });
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <div
// // // //         ref={inputRef}
// // // //         contentEditable
// // // //         dangerouslySetInnerHTML={{ __html: highlightedText }}
// // // //         onInput={handleInputChange}
// // // //         style={{ 
// // // //           whiteSpace: 'pre-wrap', 
// // // //           border: '1px solid black', 
// // // //           minHeight: '150px',
// // // //           padding: '5px',
// // // //           overflowY: 'auto'
// // // //         }} 
// // // //       />
// // // //       <br />
// // // //       <input 
// // // //         type="file" 
// // // //         onChange={handleFileUpload} 
// // // //         accept=".txt"
// // // //         ref={fileInputRef}
// // // //       />
// // // //       <br />
// // // //       <button onClick={cleanText}>Clean Text</button>
// // // //       <button onClick={() => setShowFindReplace(!showFindReplace)}>
// // // //         {showFindReplace ? 'Hide Find & Replace' : 'Show Find & Replace'}
// // // //       </button>
// // // //       <button onClick={handleReset}>Reset</button>
// // // //       <br />
// // // //       {showFindReplace && (
// // // //         <div>
// // // //           <input
// // // //             type="text"
// // // //             value={findText}
// // // //             onChange={(e) => setFindText(e.target.value)}
// // // //             placeholder="Find"
// // // //           />
// // // //           <input
// // // //             type="text"
// // // //             value={replaceText}
// // // //             onChange={(e) => setReplaceText(e.target.value)}
// // // //             placeholder="Replace with"
// // // //           />
// // // //           <button onClick={handleFindReplace}>Replace</button>
// // // //           <br />
// // // //           <label>
// // // //             <input
// // // //               type="checkbox"
// // // //               checked={caseSensitive}
// // // //               onChange={(e) => setCaseSensitive(e.target.checked)}
// // // //             />
// // // //             Case sensitive
// // // //           </label>
// // // //         </div>
// // // //       )}
// // // //       <br />
// // // //       <textarea
// // // //         value={outputText}
// // // //         readOnly
// // // //         placeholder="Processed text will appear here"
// // // //         rows="10"
// // // //         cols="50"
// // // //       />
// // // //       <br />
// // // //       <button onClick={handleCopy}>Copy Processed Text</button>
// // // //       {message && <p>{message}</p>}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default TextProcessor;
// // // 'use client'

// // // import React, { useState, useEffect, useRef } from 'react';

// // // const TextProcessor = () => {
// // //   const [inputText, setInputText] = useState('');
// // //   const [outputText, setOutputText] = useState('');
// // //   const [findText, setFindText] = useState('');
// // //   const [replaceText, setReplaceText] = useState('');
// // //   const [caseSensitive, setCaseSensitive] = useState(false);
// // //   const [wholeWord, setWholeWord] = useState(false);
// // //   const [wordStart, setWordStart] = useState(false);
// // //   const [wordEnd, setWordEnd] = useState(false);
// // //   const [inWord, setInWord] = useState(false);
// // //   const [message, setMessage] = useState('');
// // //   const [showFindReplace, setShowFindReplace] = useState(false);
// // //   const [highlightedText, setHighlightedText] = useState('');
// // //   const inputRef = useRef(null);
// // //   const fileInputRef = useRef(null);

// // //   useEffect(() => {
// // //     highlightMatches();
// // //   }, [inputText, findText, caseSensitive, wholeWord, wordStart, wordEnd, inWord]);

// // //   const highlightMatches = () => {
// // //     if (!findText) {
// // //       setHighlightedText(inputText);
// // //       return;
// // //     }

// // //     try {
// // //       const regex = createSearchRegex();
// // //       const highlighted = inputText.replace(regex, match => `<mark>${match}</mark>`);
// // //       setHighlightedText(highlighted);
// // //     } catch (error) {
// // //       setHighlightedText(inputText);
// // //     }
// // //   };

// // //   const createSearchRegex = () => {
// // //     let pattern = escapeRegExp(findText);
// // //     if (wholeWord) pattern = `\\b${pattern}\\b`;
// // //     else if (wordStart) pattern = `\\b${pattern}`;
// // //     else if (wordEnd) pattern = `${pattern}\\b`;
// // //     else if (inWord) pattern = `(?<=\\w)${pattern}(?=\\w)`;
// // //     return new RegExp(pattern, caseSensitive ? 'g' : 'gi');
// // //   };

// // //   const escapeRegExp = (string) => {
// // //     return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// // //   };

// // //   const handleInputChange = () => {
// // //     if (inputRef.current) {
// // //       setInputText(inputRef.current.innerText);
// // //     }
// // //   };

// // //   const handleFileUpload = (event) => {
// // //     const file = event.target.files[0];
// // //     if (file) {
// // //       const reader = new FileReader();
// // //       reader.onload = (e) => {
// // //         setInputText(e.target.result);
// // //         if (inputRef.current) {
// // //           inputRef.current.innerText = e.target.result;
// // //         }
// // //       };
// // //       reader.readAsText(file);
// // //     }
// // //   };

// // //   const cleanText = () => {
// // //     let cleaned = inputText
// // //       .replace(/\s+/g, ' ')
// // //       .split('\n')
// // //       .map(line => line.trim())
// // //       .join('\n')
// // //       .replace(/^\s*[\r\n]/gm, '')
// // //       .split('\n')
// // //       .filter((line, index, self) => self.indexOf(line) === index)
// // //       .join('\n');

// // //     setOutputText(cleaned);
// // //     setMessage('Text cleaned successfully.');
// // //   };

// // //   const handleFindReplace = () => {
// // //     if (!findText) {
// // //       setMessage('Please enter text to find.');
// // //       return;
// // //     }

// // //     try {
// // //       const regex = createSearchRegex();
// // //       const newText = inputText.replace(regex, replaceText);
      
// // //       if (newText !== inputText) {
// // //         setOutputText(newText);
// // //         setInputText(newText);
// // //         if (inputRef.current) {
// // //           inputRef.current.innerText = newText;
// // //         }
// // //         setMessage('Replacement complete.');
// // //       } else {
// // //         setMessage('Text not found.');
// // //       }
// // //     } catch (error) {
// // //       setMessage('Invalid search pattern. Please check your input.');
// // //     }
// // //   };

// // //   const handleReset = () => {
// // //     setInputText('');
// // //     setOutputText('');
// // //     setFindText('');
// // //     setReplaceText('');
// // //     setCaseSensitive(false);
// // //     setWholeWord(false);
// // //     setWordStart(false);
// // //     setWordEnd(false);
// // //     setInWord(false);
// // //     setMessage('');
// // //     setHighlightedText('');
// // //     setShowFindReplace(false);
// // //     if (inputRef.current) {
// // //       inputRef.current.innerText = '';
// // //     }
// // //     if (fileInputRef.current) {
// // //       fileInputRef.current.value = '';
// // //     }
// // //   };

// // //   const handleCopy = () => {
// // //     navigator.clipboard.writeText(outputText).then(() => {
// // //       setMessage('Text copied to clipboard.');
// // //     });
// // //   };

// // //   const handleCheckboxChange = (setter) => (e) => {
// // //     setter(e.target.checked);
// // //     setWholeWord(false);
// // //     setWordStart(false);
// // //     setWordEnd(false);
// // //     setInWord(false);
// // //     setter(e.target.checked);
// // //   };

// // //   return (
// // //     <div>
// // //       <div
// // //         ref={inputRef}
// // //         contentEditable
// // //         dangerouslySetInnerHTML={{ __html: highlightedText }}
// // //         onInput={handleInputChange}
// // //         style={{ 
// // //           whiteSpace: 'pre-wrap', 
// // //           border: '1px solid black', 
// // //           minHeight: '150px',
// // //           padding: '5px',
// // //           overflowY: 'auto'
// // //         }} 
// // //       />
// // //       <br />
// // //       <input 
// // //         type="file" 
// // //         onChange={handleFileUpload} 
// // //         accept=".txt"
// // //         ref={fileInputRef}
// // //       />
// // //       <br />
// // //       <button onClick={cleanText}>Clean Text</button>
// // //       <button onClick={() => setShowFindReplace(!showFindReplace)}>
// // //         {showFindReplace ? 'Hide Find & Replace' : 'Show Find & Replace'}
// // //       </button>
// // //       <button onClick={handleReset}>Reset</button>
// // //       <br />
// // //       {showFindReplace && (
// // //         <div>
// // //           <input
// // //             type="text"
// // //             value={findText}
// // //             onChange={(e) => setFindText(e.target.value)}
// // //             placeholder="Find"
// // //           />
// // //           <input
// // //             type="text"
// // //             value={replaceText}
// // //             onChange={(e) => setReplaceText(e.target.value)}
// // //             placeholder="Replace with"
// // //           />
// // //           <button onClick={handleFindReplace}>Replace</button>
// // //           <br />
// // //           <label>
// // //             <input
// // //               type="checkbox"
// // //               checked={caseSensitive}
// // //               onChange={(e) => setCaseSensitive(e.target.checked)}
// // //             />
// // //             Case sensitive
// // //           </label>
// // //           <label>
// // //             <input
// // //               type="checkbox"
// // //               checked={wholeWord}
// // //               onChange={handleCheckboxChange(setWholeWord)}
// // //             />
// // //             Whole word
// // //           </label>
// // //           <label>
// // //             <input
// // //               type="checkbox"
// // //               checked={wordStart}
// // //               onChange={handleCheckboxChange(setWordStart)}
// // //             />
// // //             Word start
// // //           </label>
// // //           <label>
// // //             <input
// // //               type="checkbox"
// // //               checked={wordEnd}
// // //               onChange={handleCheckboxChange(setWordEnd)}
// // //             />
// // //             Word end
// // //           </label>
// // //           <label>
// // //             <input
// // //               type="checkbox"
// // //               checked={inWord}
// // //               onChange={handleCheckboxChange(setInWord)}
// // //             />
// // //             In word
// // //           </label>
// // //         </div>
// // //       )}
// // //       <br />
// // //       <textarea
// // //         value={outputText}
// // //         readOnly
// // //         placeholder="Processed text will appear here"
// // //         rows="10"
// // //         cols="50"
// // //       />
// // //       <br />
// // //       <button onClick={handleCopy}>Copy Processed Text</button>
// // //       {message && <p>{message}</p>}
// // //     </div>
// // //   );
// // // };

// // // export default TextProcessor;
// // 'use client'

// // import React, { useState, useEffect, useRef } from 'react';

// // const TextProcessor = () => {
// //   const [inputText, setInputText] = useState('');
// //   const [outputText, setOutputText] = useState('');
// //   const [findText, setFindText] = useState('');
// //   const [replaceText, setReplaceText] = useState('');
// //   const [caseSensitive, setCaseSensitive] = useState(false);
// //   const [wholeWord, setWholeWord] = useState(false);
// //   const [wordStart, setWordStart] = useState(false);
// //   const [wordEnd, setWordEnd] = useState(false);
// //   const [inWord, setInWord] = useState(false);
// //   const [message, setMessage] = useState('');
// //   const [showFindReplace, setShowFindReplace] = useState(false);
// //   const inputRef = useRef(null);
// //   const fileInputRef = useRef(null);

// //   useEffect(() => {
// //     highlightMatches();
// //   }, [inputText, findText, caseSensitive, wholeWord, wordStart, wordEnd, inWord]);

// //   const highlightMatches = () => {
// //     if (!findText || !inputRef.current) return;
  
// //     const regex = createSearchRegex();
// //     const text = inputRef.current.innerText;
// //     const highlightedText = text.replace(regex, match => `<mark>${match}</mark>`);
    
// //     // Save current selection
// //     const selection = window.getSelection();
// //     const range = selection.getRangeAt(0);
// //     const startOffset = range.startOffset;
// //     const endOffset = range.endOffset;
  
// //     // Update content
// //     inputRef.current.innerHTML = highlightedText;
  
// //     // Restore selection
// //     try {
// //       const newRange = document.createRange();
// //       const textNode = inputRef.current.firstChild;
      
// //       if (textNode && textNode.nodeType === Node.TEXT_NODE) {
// //         const length = textNode.length;
// //         newRange.setStart(textNode, Math.min(startOffset, length));
// //         newRange.setEnd(textNode, Math.min(endOffset, length));
// //         selection.removeAllRanges();
// //         selection.addRange(newRange);
// //       }
// //     } catch (error) {
// //       console.error('Error restoring selection:', error);
// //     }
// //   };

// // //   const highlightMatches = () => {
// // //     if (!findText || !inputRef.current) return;

// // //     const regex = createSearchRegex();
// // //     const text = inputRef.current.innerText;
// // //     const highlightedText = text.replace(regex, match => `<mark>${match}</mark>`);
    
// // //     // Save current selection
// // //     const selection = window.getSelection();
// // //     const range = selection.getRangeAt(0);
// // //     const startOffset = range.startOffset;
// // //     const endOffset = range.endOffset;

// // //     // Update content
// // //     inputRef.current.innerHTML = highlightedText;

// // //     // Restore selection
// // //     const newRange = document.createRange();
// // //     newRange.setStart(inputRef.current.firstChild, startOffset);
// // //     newRange.setEnd(inputRef.current.firstChild, endOffset);
// // //     selection.removeAllRanges();
// // //     selection.addRange(newRange);
// // //   };

// //   const createSearchRegex = () => {
// //     let pattern = escapeRegExp(findText);
// //     if (wholeWord) pattern = `\\b${pattern}\\b`;
// //     else if (wordStart) pattern = `\\b${pattern}`;
// //     else if (wordEnd) pattern = `${pattern}\\b`;
// //     else if (inWord) pattern = `(?<=\\w)${pattern}(?=\\w)`;
// //     return new RegExp(pattern, caseSensitive ? 'g' : 'gi');
// //   };

// //   const escapeRegExp = (string) => {
// //     return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// //   };

// //   const handleInputChange = () => {
// //     if (inputRef.current) {
// //       setInputText(inputRef.current.innerText);
// //       highlightMatches();
// //     }
// //   };

// // //   const handleInputChange = () => {
// // //     if (inputRef.current) {
// // //       setInputText(inputRef.current.innerText);
// // //     }
// // //   };

// //   const handleFileUpload = (event) => {
// //     const file = event.target.files[0];
// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onload = (e) => {
// //         setInputText(e.target.result);
// //         if (inputRef.current) {
// //           inputRef.current.innerText = e.target.result;
// //         }
// //       };
// //       reader.readAsText(file);
// //     }
// //   };

// //   const cleanText = () => {
// //     let cleaned = inputText
// //       .replace(/\s+/g, ' ')
// //       .split('\n')
// //       .map(line => line.trim())
// //       .join('\n')
// //       .replace(/^\s*[\r\n]/gm, '')
// //       .split('\n')
// //       .filter((line, index, self) => self.indexOf(line) === index)
// //       .join('\n');

// //     setOutputText(cleaned);
// //     setMessage('Text cleaned successfully.');
// //   };

// //   const handleFindReplace = () => {
// //     if (!findText) {
// //       setMessage('Please enter text to find.');
// //       return;
// //     }

// //     try {
// //       const regex = createSearchRegex();
// //       const newText = inputText.replace(regex, replaceText);
      
// //       if (newText !== inputText) {
// //         setOutputText(newText);
// //         setInputText(newText);
// //         if (inputRef.current) {
// //           inputRef.current.innerText = newText;
// //         }
// //         setMessage('Replacement complete.');
// //       } else {
// //         setMessage('Text not found.');
// //       }
// //     } catch (error) {
// //       setMessage('Invalid search pattern. Please check your input.');
// //     }
// //   };

// //   const handleReset = () => {
// //     setInputText('');
// //     setOutputText('');
// //     setFindText('');
// //     setReplaceText('');
// //     setCaseSensitive(false);
// //     setWholeWord(false);
// //     setWordStart(false);
// //     setWordEnd(false);
// //     setInWord(false);
// //     setMessage('');
// //     setShowFindReplace(false);
// //     if (inputRef.current) {
// //       inputRef.current.innerText = '';
// //     }
// //     if (fileInputRef.current) {
// //       fileInputRef.current.value = '';
// //     }
// //   };

// //   const handleCopy = () => {
// //     navigator.clipboard.writeText(outputText).then(() => {
// //       setMessage('Text copied to clipboard.');
// //     });
// //   };

// //   const handleCheckboxChange = (setter) => (e) => {
// //     setter(e.target.checked);
// //     setWholeWord(false);
// //     setWordStart(false);
// //     setWordEnd(false);
// //     setInWord(false);
// //     setter(e.target.checked);
// //   };

// //   return (
// //     <div>
// //       <div
// //         ref={inputRef}
// //         contentEditable
// //         onInput={handleInputChange}
// //         style={{ 
// //           whiteSpace: 'pre-wrap', 
// //           border: '1px solid black', 
// //           minHeight: '150px',
// //           padding: '5px',
// //           overflowY: 'auto'
// //         }} 
// //       />
// //       <br />
// //       <input 
// //         type="file" 
// //         onChange={handleFileUpload} 
// //         accept=".txt"
// //         ref={fileInputRef}
// //       />
// //       <br />
// //       <button onClick={cleanText}>Clean Text</button>
// //       <button onClick={() => setShowFindReplace(!showFindReplace)}>
// //         {showFindReplace ? 'Hide Find & Replace' : 'Show Find & Replace'}
// //       </button>
// //       <button onClick={handleReset}>Reset</button>
// //       <br />
// //       {showFindReplace && (
// //         <div>
// //           <input
// //             type="text"
// //             value={findText}
// //             onChange={(e) => setFindText(e.target.value)}
// //             placeholder="Find"
// //           />
// //           <input
// //             type="text"
// //             value={replaceText}
// //             onChange={(e) => setReplaceText(e.target.value)}
// //             placeholder="Replace with"
// //           />
// //           <button onClick={handleFindReplace}>Replace</button>
// //           <br />
// //           <label>
// //             <input
// //               type="checkbox"
// //               checked={caseSensitive}
// //               onChange={(e) => setCaseSensitive(e.target.checked)}
// //             />
// //             Case sensitive
// //           </label>
// //           <label>
// //             <input
// //               type="checkbox"
// //               checked={wholeWord}
// //               onChange={handleCheckboxChange(setWholeWord)}
// //             />
// //             Whole word
// //           </label>
// //           <label>
// //             <input
// //               type="checkbox"
// //               checked={wordStart}
// //               onChange={handleCheckboxChange(setWordStart)}
// //             />
// //             Word start
// //           </label>
// //           <label>
// //             <input
// //               type="checkbox"
// //               checked={wordEnd}
// //               onChange={handleCheckboxChange(setWordEnd)}
// //             />
// //             Word end
// //           </label>
// //           <label>
// //             <input
// //               type="checkbox"
// //               checked={inWord}
// //               onChange={handleCheckboxChange(setInWord)}
// //             />
// //             In word
// //           </label>
// //         </div>
// //       )}
// //       <br />
// //       <textarea
// //         value={outputText}
// //         readOnly
// //         placeholder="Processed text will appear here"
// //         rows="10"
// //         cols="50"
// //       />
// //       <br />
// //       <button onClick={handleCopy}>Copy Processed Text</button>
// //       {message && <p>{message}</p>}
// //     </div>
// //   );
// // };

// // export default TextProcessor;
// 'use client'

// import React, { useState, useEffect, useRef } from 'react';

// const TextProcessor = () => {
//   const [inputText, setInputText] = useState('');
//   const [outputText, setOutputText] = useState('');
//   const [findText, setFindText] = useState('');
//   const [findInputText, setFindInputText] = useState('');
//   const [replaceText, setReplaceText] = useState('');
//   const [caseSensitive, setCaseSensitive] = useState(false);
//   const [wholeWord, setWholeWord] = useState(false);
//   const [wordStart, setWordStart] = useState(false);
//   const [wordEnd, setWordEnd] = useState(false);
//   const [inWord, setInWord] = useState(false);
//   const [message, setMessage] = useState('');
//   const [showFindReplace, setShowFindReplace] = useState(false);
//   const inputRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const findInputRef = useRef(null);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       setFindText(findInputText);
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [findInputText]);

//   useEffect(() => {
//     highlightMatches();
//   }, [inputText, findText, caseSensitive, wholeWord, wordStart, wordEnd, inWord]);

//   const highlightMatches = () => {
//     if (!findText || !inputRef.current) return;

//     const regex = createSearchRegex();
//     const text = inputRef.current.innerText;
//     const highlightedText = text.replace(regex, match => `<mark>${match}</mark>`);
    
//     // Save current selection
//     const selection = window.getSelection();
//     const range = selection.getRangeAt(0);
//     const startOffset = range.startOffset;
//     const endOffset = range.endOffset;

//     // Update content
//     inputRef.current.innerHTML = highlightedText;

//     // Restore selection
//     try {
//       const newRange = document.createRange();
//       const textNode = inputRef.current.firstChild;
      
//       if (textNode && textNode.nodeType === Node.TEXT_NODE) {
//         const length = textNode.length;
//         newRange.setStart(textNode, Math.min(startOffset, length));
//         newRange.setEnd(textNode, Math.min(endOffset, length));
//         selection.removeAllRanges();
//         selection.addRange(newRange);
//       }
//     } catch (error) {
//       console.error('Error restoring selection:', error);
//     }
//   };

//   const createSearchRegex = () => {
//     let pattern = escapeRegExp(findText);
//     if (wholeWord) pattern = `\\b${pattern}\\b`;
//     else if (wordStart) pattern = `\\b${pattern}`;
//     else if (wordEnd) pattern = `${pattern}\\b`;
//     else if (inWord) pattern = `(?<=\\w)${pattern}(?=\\w)`;
//     return new RegExp(pattern, caseSensitive ? 'g' : 'gi');
//   };

//   const escapeRegExp = (string) => {
//     return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//   };

//   const handleInputChange = () => {
//     if (inputRef.current) {
//       setInputText(inputRef.current.innerText);
//     }
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setInputText(e.target.result);
//         if (inputRef.current) {
//           inputRef.current.innerText = e.target.result;
//         }
//       };
//       reader.readAsText(file);
//     }
//   };

//   const cleanText = () => {
//     let cleaned = inputText
//       .replace(/\s+/g, ' ')
//       .split('\n')
//       .map(line => line.trim())
//       .join('\n')
//       .replace(/^\s*[\r\n]/gm, '')
//       .split('\n')
//       .filter((line, index, self) => self.indexOf(line) === index)
//       .join('\n');

//     setOutputText(cleaned);
//     setMessage('Text cleaned successfully.');
//   };

//   const handleFindReplace = () => {
//     if (!findText) {
//       setMessage('Please enter text to find.');
//       return;
//     }

//     try {
//       const regex = createSearchRegex();
//       const newText = inputText.replace(regex, replaceText);
      
//       if (newText !== inputText) {
//         setOutputText(newText);
//         setInputText(newText);
//         if (inputRef.current) {
//           inputRef.current.innerText = newText;
//         }
//         setMessage('Replacement complete.');
//       } else {
//         setMessage('Text not found.');
//       }
//     } catch (error) {
//       setMessage('Invalid search pattern. Please check your input.');
//     }
//   };

//   const handleReset = () => {
//     setInputText('');
//     setOutputText('');
//     setFindText('');
//     setFindInputText('');
//     setReplaceText('');
//     setCaseSensitive(false);
//     setWholeWord(false);
//     setWordStart(false);
//     setWordEnd(false);
//     setInWord(false);
//     setMessage('');
//     setShowFindReplace(false);
//     if (inputRef.current) {
//       inputRef.current.innerText = '';
//     }
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleCopy = () => {
//     navigator.clipboard.writeText(outputText).then(() => {
//       setMessage('Text copied to clipboard.');
//     });
//   };

//   const handleCheckboxChange = (setter) => (e) => {
//     setter(e.target.checked);
//     setWholeWord(false);
//     setWordStart(false);
//     setWordEnd(false);
//     setInWord(false);
//     setter(e.target.checked);
//   };

//   return (
//     <div>
//       <div
//         ref={inputRef}
//         contentEditable
//         onInput={handleInputChange}
//         style={{ 
//           whiteSpace: 'pre-wrap', 
//           border: '1px solid black', 
//           minHeight: '150px',
//           padding: '5px',
//           overflowY: 'auto'
//         }} 
//       />
//       <br />
//       <input 
//         type="file" 
//         onChange={handleFileUpload} 
//         accept=".txt"
//         ref={fileInputRef}
//       />
//       <br />
//       <button onClick={cleanText}>Clean Text</button>
//       <button onClick={() => setShowFindReplace(!showFindReplace)}>
//         {showFindReplace ? 'Hide Find & Replace' : 'Show Find & Replace'}
//       </button>
//       <button onClick={handleReset}>Reset</button>
//       <br />
//       {showFindReplace && (
//         <div>
//           <input
//             ref={findInputRef}
//             type="text"
//             value={findInputText}
//             onChange={(e) => setFindInputText(e.target.value)}
//             placeholder="Find"
//           />
//           <input
//             type="text"
//             value={replaceText}
//             onChange={(e) => setReplaceText(e.target.value)}
//             placeholder="Replace with"
//           />
//           <button onClick={handleFindReplace}>Replace</button>
//           <br />
//           <label>
//             <input
//               type="checkbox"
//               checked={caseSensitive}
//               onChange={(e) => setCaseSensitive(e.target.checked)}
//             />
//             Case sensitive
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               checked={wholeWord}
//               onChange={handleCheckboxChange(setWholeWord)}
//             />
//             Whole word
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               checked={wordStart}
//               onChange={handleCheckboxChange(setWordStart)}
//             />
//             Word start
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               checked={wordEnd}
//               onChange={handleCheckboxChange(setWordEnd)}
//             />
//             Word end
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               checked={inWord}
//               onChange={handleCheckboxChange(setInWord)}
//             />
//             In word
//           </label>
//         </div>
//       )}
//       <br />
//       <textarea
//         value={outputText}
//         readOnly
//         placeholder="Processed text will appear here"
//         rows="10"
//         cols="50"
//       />
//       <br />
//       <button onClick={handleCopy}>Copy Processed Text</button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default TextProcessor;
'use client'

import React, { useState, useEffect, useRef } from 'react';

const TextProcessor = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [wordStart, setWordStart] = useState(false);
  const [wordEnd, setWordEnd] = useState(false);
  const [inWord, setInWord] = useState(false);
  const [message, setMessage] = useState('');
  const [showFindReplace, setShowFindReplace] = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    highlightMatches();
  }, [findText, caseSensitive, wholeWord, wordStart, wordEnd, inWord]);

  const highlightMatches = () => {
    if (!findText || !inputRef.current) return;

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;

    const regex = createSearchRegex();
    const text = inputRef.current.innerText;
    const highlightedText = text.replace(regex, match => `<mark>${match}</mark>`);
    
    inputRef.current.innerHTML = highlightedText;

    if (startContainer.nodeType === Node.TEXT_NODE) {
      const newRange = document.createRange();
      const newStartContainer = [...inputRef.current.childNodes].find(node => 
        node.nodeType === Node.TEXT_NODE && node.textContent.length >= startOffset
      );
      if (newStartContainer) {
        newRange.setStart(newStartContainer, startOffset);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  };

  const createSearchRegex = () => {
    let pattern = escapeRegExp(findText);
    if (wholeWord) pattern = `\\b${pattern}\\b`;
    else if (wordStart) pattern = `\\b${pattern}`;
    else if (wordEnd) pattern = `${pattern}\\b`;
    else if (inWord) pattern = `(?<=\\w)${pattern}(?=\\w)`;
    return new RegExp(pattern, caseSensitive ? 'g' : 'gi');
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const handleInputChange = (e) => {
    setInputText(e.target.innerText);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputText(e.target.result);
        if (inputRef.current) {
          inputRef.current.innerText = e.target.result;
        }
      };
      reader.readAsText(file);
    }
  };

  const cleanText = () => {
    let cleaned = inputText
      .replace(/\s+/g, ' ')
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      .replace(/^\s*[\r\n]/gm, '')
      .split('\n')
      .filter((line, index, self) => self.indexOf(line) === index)
      .join('\n');

    setOutputText(cleaned);
    setMessage('Text cleaned successfully.');
  };

  const handleFindReplace = () => {
    if (!findText) {
      setMessage('Please enter text to find.');
      return;
    }

    try {
      const regex = createSearchRegex();
      const newText = inputText.replace(regex, replaceText);
      
      if (newText !== inputText) {
        setOutputText(newText);
        setInputText(newText);
        if (inputRef.current) {
          inputRef.current.innerText = newText;
        }
        setMessage('Replacement complete.');
      } else {
        setMessage('Text not found.');
      }
    } catch (error) {
      setMessage('Invalid search pattern. Please check your input.');
    }
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
    setFindText('');
    setReplaceText('');
    setCaseSensitive(false);
    setWholeWord(false);
    setWordStart(false);
    setWordEnd(false);
    setInWord(false);
    setMessage('');
    setShowFindReplace(false);
    if (inputRef.current) {
      inputRef.current.innerText = '';
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText).then(() => {
      setMessage('Text copied to clipboard.');
    });
  };

  const handleCheckboxChange = (setter) => (e) => {
    setter(e.target.checked);
    setWholeWord(false);
    setWordStart(false);
    setWordEnd(false);
    setInWord(false);
    setter(e.target.checked);
  };

  return (
    <div>
      <div
        ref={inputRef}
        contentEditable
        onInput={handleInputChange}
        style={{ 
          whiteSpace: 'pre-wrap', 
          border: '1px solid black', 
          minHeight: '150px',
          padding: '5px',
          overflowY: 'auto'
        }} 
      />
      <br />
      <input 
        type="file" 
        onChange={handleFileUpload} 
        accept=".txt"
        ref={fileInputRef}
      />
      <br />
      <button onClick={cleanText}>Clean Text</button>
      <button onClick={() => setShowFindReplace(!showFindReplace)}>
        {showFindReplace ? 'Hide Find & Replace' : 'Show Find & Replace'}
      </button>
      <button onClick={handleReset}>Reset</button>
      <br />
      {showFindReplace && (
        <div>
          <input
            type="text"
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            placeholder="Find"
          />
          <input
            type="text"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replace with"
          />
          <button onClick={handleFindReplace}>Replace</button>
          <br />
          <label>
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
            Case sensitive
          </label>
          <label>
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={handleCheckboxChange(setWholeWord)}
            />
            Whole word
          </label>
          <label>
            <input
              type="checkbox"
              checked={wordStart}
              onChange={handleCheckboxChange(setWordStart)}
            />
            Word start
          </label>
          <label>
            <input
              type="checkbox"
              checked={wordEnd}
              onChange={handleCheckboxChange(setWordEnd)}
            />
            Word end
          </label>
          <label>
            <input
              type="checkbox"
              checked={inWord}
              onChange={handleCheckboxChange(setInWord)}
            />
            In word
          </label>
        </div>
      )}
      <br />
      <textarea
        value={outputText}
        readOnly
        placeholder="Processed text will appear here"
        rows="10"
        cols="50"
      />
      <br />
      <button onClick={handleCopy}>Copy Processed Text</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TextProcessor;