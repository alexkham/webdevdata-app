// // 'use client'

// // import { useState } from 'react';
// // import { encode, decode } from 'html-entities';

// // export default function HtmlEntityConverter() {
// //   const [input, setInput] = useState('');
// //   const [output, setOutput] = useState('');
// //   const [action, setAction] = useState('encode');

// //   const handleConvert = () => {
// //     if (action === 'encode') {
// //       setOutput(encode(input, { level: 'html5', mode: 'extensive' }));
// //     } else {
// //       setOutput(decode(input));
// //     }
// //   };

// //   return (
// //     <div>
// //       <h1 className="text-2xl font-bold mb-4">HTML Entities Converter</h1>
// //       <div className="mb-4">
// //         <label className="block mb-2">
// //           <input
// //             type="radio"
// //             value="encode"
// //             checked={action === 'encode'}
// //             onChange={(e) => setAction(e.target.value)}
// //             className="mr-2"
// //           />
// //           Encode (Text to HTML Entities)
// //         </label>
// //         <label className="block">
// //           <input
// //             type="radio"
// //             value="decode"
// //             checked={action === 'decode'}
// //             onChange={(e) => setAction(e.target.value)}
// //             className="mr-2"
// //           />
// //           Decode (HTML Entities to Text)
// //         </label>
// //       </div>
// //       <textarea
// //         className="w-full p-2 border rounded mb-4"
// //         rows="4"
// //         value={input}
// //         onChange={(e) => setInput(e.target.value)}
// //         placeholder={action === 'encode' ? "Enter text to convert to HTML entities" : "Enter HTML entities to convert to text"}
// //       ></textarea>
// //       <button
// //         className="bg-blue-500 text-white px-4 py-2 rounded"
// //         onClick={handleConvert}
// //       >
// //         Convert
// //       </button>
// //       <div className="mt-4">
// //         <h2 className="text-xl font-bold mb-2">Result:</h2>
// //         <pre className="bg-gray-100 p-2 rounded break-words whitespace-pre-wrap">{output}</pre>
// //       </div>
// //     </div>
// //   );
// // }
// 'use client'

// import { useState, useEffect } from 'react';
// import { encode, decode } from 'html-entities';

// export default function HtmlEntityConverter() {
//   const [input, setInput] = useState('');
//   const [output, setOutput] = useState('');
//   const [action, setAction] = useState('encode');
//   const [entityType, setEntityType] = useState('named');
//   const [copyButtonText, setCopyButtonText] = useState('Copy');

//   const handleConvert = () => {
//     if (action === 'encode') {
//       let result;
//       switch (entityType) {
//         case 'named':
//           result = encode(input, { level: 'html5', mode: 'extensive' });
//           break;
//         case 'decimal':
//           result = input.split('').map(char => `&#${char.charCodeAt(0)};`).join('');
//           break;
//         case 'hexadecimal':
//           result = input.split('').map(char => `&#x${char.charCodeAt(0).toString(16)};`).join('');
//           break;
//         default:
//           result = encode(input, { level: 'html5', mode: 'extensive' });
//       }
//       setOutput(result);
//     } else {
//       setOutput(decode(input));
//     }
//   };

//   const handleReset = () => {
//     setInput('');
//     setOutput('');
//     setAction('')
//     setEntityType('')
//   };

//   const handleCopy = () => {
//     navigator.clipboard.writeText(output);
//     setCopyButtonText('Copied!');
//     setTimeout(() => setCopyButtonText('Copy'), 5000);
//   };

//   useEffect(() => {
//     handleConvert();
//   }, [input, action, entityType]);

//   return (
//     <div>
//       <h1>HTML Entities Converter</h1>
//       <div>
//         <label>
//           <input
//             type="radio"
//             value="encode"
//             checked={action === 'encode'}
//             onChange={(e) => setAction(e.target.value)}
//           />
//           Encode (Text to HTML Entities)
//         </label>
//         <label>
//           <input
//             type="radio"
//             value="decode"
//             checked={action === 'decode'}
//             onChange={(e) => setAction(e.target.value)}
//           />
//           Decode (HTML Entities to Text)
//         </label>
//       </div>
//       {action === 'encode' && (
//         <div>
//           <label>
//             <input
//               type="radio"
//               value="named"
//               checked={entityType === 'named'}
//               onChange={(e) => setEntityType(e.target.value)}
//             />
//             Named Entities
//           </label>
//           <label>
//             <input
//               type="radio"
//               value="decimal"
//               checked={entityType === 'decimal'}
//               onChange={(e) => setEntityType(e.target.value)}
//             />
//             Decimal Entities
//           </label>
//           <label>
//             <input
//               type="radio"
//               value="hexadecimal"
//               checked={entityType === 'hexadecimal'}
//               onChange={(e) => setEntityType(e.target.value)}
//             />
//             Hexadecimal Entities
//           </label>
//         </div>
//       )}
//       <textarea
//         rows="4"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder={action === 'encode' ? "Enter text to convert to HTML entities" : "Enter HTML entities to convert to text"}
//       ></textarea>
//       <button onClick={handleReset}>Reset</button>
//       <div>
//         <h2>Result:</h2>
//         <pre>{output}</pre>
//         <button onClick={handleCopy}>
//         <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
//             <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
//         </svg>
//             {copyButtonText}</button>
//       </div>
//     </div>
//   );
// }
'use client'

import { useState, useCallback, useEffect } from 'react';
import styles from './HtmlEntityConverter.module.css';

export default function HtmlEntityConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [action, setAction] = useState('encode');
  const [entityType, setEntityType] = useState('named');
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const [error, setError] = useState('');

  const MAX_INPUT_LENGTH = 100000;

  const handleConvert = useCallback(() => {
    try {
      if (!input.trim()) {
        throw new Error('Input cannot be empty');
      }

      let result;
      if (action === 'encode') {
        switch (entityType) {
          case 'named':
            result = input.replace(/[\u00A0-\u9999<>\&]/gim, (i) => `&#${i.charCodeAt(0)};`);
            break;
          case 'decimal':
            result = input.split('').map(char => `&#${char.charCodeAt(0)};`).join('');
            break;
          case 'hexadecimal':
            result = input.split('').map(char => `&#x${char.charCodeAt(0).toString(16)};`).join('');
            break;
          default:
            result = input.replace(/[\u00A0-\u9999<>\&]/gim, (i) => `&#${i.charCodeAt(0)};`);
        }
      } else {
        result = input.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
                      .replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
                      .replace(/&([a-z]+);/gi, (match, entity) => {
                        const entities = {'amp': '&', 'lt': '<', 'gt': '>', 'quot': '"', 'apos': "'"};
                        return entities[entity] || match;
                      });
      }
      setOutput(result);
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  }, [input, action, entityType]);

  const handleReset = () => {
    setInput('');
    setOutput('');
    setError('');
    setCopyButtonText('Copy');
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
//               placeholder={action === 'encode' ? "Enter text to convert to HTML entities" : "Enter HTML entities to convert to text"}
//             />
//             <div className={styles.charCount}>
//               {input.length} / {MAX_INPUT_LENGTH}
//               {input.length > MAX_INPUT_LENGTH * 0.9 && 
//                 <span className={styles.warning}> (Approaching limit)</span>}
//             </div>
//             <div className={styles.buttonGroup}>
//               <div className={styles.buttonContainer}>
//                 <button 
//                   className={`${styles.button} ${styles.convertButton}`} 
//                   onClick={handleConvert}
//                 >
//                   Convert
//                 </button>
//                 <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
//               </div>
              
//               <div className={styles.encodingContainer}>
//                 <select 
//                   className={styles.encodingSelect}
//                   value={action}
//                   onChange={(e) => setAction(e.target.value)}
//                 >
//                   <option value="encode">Encode</option>
//                   <option value="decode">Decode</option>
//                 </select>
//                 {action === 'encode' && (
//                   <select 
//                     className={styles.encodingSelect}
//                     value={entityType}
//                     onChange={(e) => setEntityType(e.target.value)}
//                     style={{minWidth:'130px',maxWidth:'130px'}}
//                   >
//                     <option value="named">Named Entities</option>
//                     <option value="decimal">Decimal Entities</option>
//                     <option value="hexadecimal">Hexadecimal Entities</option>
//                   </select>
//                 )}
//               </div>
//             </div>
//             {error && <div className={styles.errorMessage}>{error}</div>}
//           </div>
          
//           <div className={styles.column}>
//             <h2 className={styles.subtitle}>Output</h2>
//             <div className={styles.outputContainer}>
//               <button 
//                 className={styles.copyButton} 
//                 onClick={handleCopy}
//                 disabled={!output}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
//                   <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
//                 </svg>
//                 {copyButtonText}
//               </button>
//               <pre className={styles.text}>{output}</pre>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );



// }return (
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
//               placeholder={action === 'encode' ? "Enter text to convert to HTML entities" : "Enter HTML entities to convert to text"}
//             />
//             <div className={styles.charCount}>
//               {input.length} / {MAX_INPUT_LENGTH}
//               {input.length > MAX_INPUT_LENGTH * 0.9 && 
//                 <span className={styles.warning}> (Approaching limit)</span>}
//             </div>
//             <div className={styles.buttonGroup}>
//               <div className={styles.buttonContainer}>
//                 <button 
//                   className={`${styles.button} ${styles.convertButton}`} 
//                   onClick={handleConvert}
//                 >
//                   Convert
//                 </button>
//                 <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
//               </div>
              
//               <div className={styles.selectContainer}>
//                 <select 
//                   className={styles.selectField}
//                   value={action}
//                   onChange={(e) => setAction(e.target.value)}
//                   style={{minWidth:'100%',width:'200px'}}
//                 >
//                   <option value="encode">Encode</option>
//                   <option value="decode">Decode</option>
//                 </select>
//                 {action === 'encode' && (
//                   <select 
//                     className={styles.selectField}
//                     value={entityType}
//                     onChange={(e) => setEntityType(e.target.value)}
//                   >
//                     <option value="named">Named Entities</option>
//                     <option value="decimal">Decimal Entities</option>
//                     <option value="hexadecimal">Hexadecimal Entities</option>
//                   </select>
//                 )}
//               </div>
              
//             </div>
//             {error && <div className={styles.errorMessage}>{error}</div>}
//           </div>
          
//           {/* <div className={styles.chevronContainer}>
//             <div className={styles.chevron}>&gt;</div>
//           </div> */}
          
//           <div className={styles.column}>
//             <h2 className={styles.subtitle}>Output</h2>
//             <div className={styles.outputContainer}>
//               <button 
//                 className={styles.copyButton} 
//                 onClick={handleCopy}
//                 disabled={!output}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
//                   <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
//                 </svg>
//                 {copyButtonText}
//               </button>
//               <pre className={styles.text}>{output}</pre>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

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
              placeholder={action === 'encode' ? "Enter text to convert to HTML entities" : "Enter HTML entities to convert to text"}
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
                  onClick={handleConvert}
                >
                  Convert
                </button>
                <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
              </div>
              
              <div className={styles.selectContainer}>
                <div className={styles.selectWithTooltip}>
                  <select 
                    className={styles.selectField}
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    // style={{minWidth:'100%',width:'200px'}}
                  >
                    <option value="encode">Encode</option>
                    <option value="decode">Decode</option>
                  </select>
                  <div className={styles.tooltipContainer}>
                    <span className={styles.tooltipIcon}>?</span>
                    <span className={styles.tooltipText}>Choose whether to encode text to HTML entities or decode HTML entities to text</span>
                  </div>
                </div>
                {action === 'encode' && (
                  <div className={styles.selectWithTooltip}>
                    
                    <select 
                      className={styles.selectField}
                      value={entityType}
                      onChange={(e) => setEntityType(e.target.value)}
                    >
                      <option value="named">Named Entities</option>
                      <option value="decimal">Decimal Entities</option>
                      <option value="hexadecimal">Hexadecimal Entities</option>
                    </select>
                    <div className={styles.tooltipContainer}>
                      <span className={styles.tooltipIcon}>?</span>
                      <span className={styles.tooltipText}>
                        Choose the type of HTML entities to use for encoding:
                        Named: Use named entities where possible (e.g., &amp;)
                        Decimal: Use decimal numeric character references (e.g., &#38;)
                        Hexadecimal: Use hexadecimal numeric character references (e.g., &#x26;)
                      </span>
                    </div>
                </div>
                 
                )}
              </div>
            </div>
            {error && <div className={styles.errorMessage}>{error}</div>}
          </div>
          
          <div className={styles.column}>
            <h2 className={styles.subtitle}>Output</h2>
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
          </div>
        </div>
      </div>
    </div>
  );

 }