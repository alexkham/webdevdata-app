// // // // // // // // // // // // 'use client'
// // // // // // // // // // // // import { useState } from 'react';
// // // // // // // // // // // // import styles from './PixelsConverter.module.css'

// // // // // // // // // // // // export default function PixelsConverter() {
// // // // // // // // // // // //   const [pixels, setPixels] = useState('');
// // // // // // // // // // // //   const [basePixels, setBasePixels] = useState(16);
// // // // // // // // // // // //   const [emValue, setEmValue] = useState('');
// // // // // // // // // // // //   const [remValue, setRemValue] = useState('');

// // // // // // // // // // // //   const handleConvert = () => {
// // // // // // // // // // // //     if (pixels && basePixels) {
// // // // // // // // // // // //       const pxValue = parseFloat(pixels);
// // // // // // // // // // // //       const baseValue = parseFloat(basePixels);
      
// // // // // // // // // // // //       if (!isNaN(pxValue) && !isNaN(baseValue) && baseValue !== 0) {
// // // // // // // // // // // //         const emResult = (pxValue / baseValue).toFixed(4);
// // // // // // // // // // // //         const remResult = (pxValue / 16).toFixed(4);
        
// // // // // // // // // // // //         setEmValue(emResult);
// // // // // // // // // // // //         setRemValue(remResult);
// // // // // // // // // // // //       } else {
// // // // // // // // // // // //         setEmValue('Invalid input');
// // // // // // // // // // // //         setRemValue('Invalid input');
// // // // // // // // // // // //       }
// // // // // // // // // // // //     } else {
// // // // // // // // // // // //       setEmValue('');
// // // // // // // // // // // //       setRemValue('');
// // // // // // // // // // // //     }
// // // // // // // // // // // //   };
 

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <div className={styles.container}>
// // // // // // // // // // // //       <div className={styles.inputGroup}>
// // // // // // // // // // // //         <label htmlFor="pixels">Pixels: </label>
// // // // // // // // // // // //         <input
// // // // // // // // // // // //           type="number"
// // // // // // // // // // // //           id="pixels"
// // // // // // // // // // // //           value={pixels}
// // // // // // // // // // // //           onChange={(e) => setPixels(e.target.value)}
// // // // // // // // // // // //           placeholder="Enter pixel value"
// // // // // // // // // // // //         />
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //       <div className={styles.inputGroup}>
// // // // // // // // // // // //         <label htmlFor="basePixels">Base pixel size (default 16px): </label>
// // // // // // // // // // // //         <input
// // // // // // // // // // // //           type="number"
// // // // // // // // // // // //           id="basePixels"
// // // // // // // // // // // //           value={basePixels}
// // // // // // // // // // // //           onChange={(e) => setBasePixels(e.target.value)}
// // // // // // // // // // // //         />
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //       <button className={styles.button} onClick={handleConvert}>Convert</button>
// // // // // // // // // // // //       <div className={styles.result}>
// // // // // // // // // // // //         <p>EM value: {emValue}</p>
// // // // // // // // // // // //         <p>REM value: {remValue}</p>
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //     </div>
// // // // // // // // // // // //   );
// // // // // // // // // // // // }

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <div>
// // // // // // // // // // // // //       <div>
// // // // // // // // // // // // //         <label htmlFor="pixels">Pixels: </label>
// // // // // // // // // // // // //         <input
// // // // // // // // // // // // //           type="number"
// // // // // // // // // // // // //           id="pixels"
// // // // // // // // // // // // //           value={pixels}
// // // // // // // // // // // // //           onChange={(e) => setPixels(e.target.value)}
// // // // // // // // // // // // //           placeholder="Enter pixel value"
// // // // // // // // // // // // //         />
// // // // // // // // // // // // //       </div>
// // // // // // // // // // // // //       <div>
// // // // // // // // // // // // //         <label htmlFor="basePixels">Base pixel size (default 16px): </label>
// // // // // // // // // // // // //         <input
// // // // // // // // // // // // //           type="number"
// // // // // // // // // // // // //           id="basePixels"
// // // // // // // // // // // // //           value={basePixels}
// // // // // // // // // // // // //           onChange={(e) => setBasePixels(e.target.value)}
// // // // // // // // // // // // //         />
// // // // // // // // // // // // //       </div>
// // // // // // // // // // // // //       <button onClick={handleConvert}>Convert</button>
// // // // // // // // // // // // //       <div>
// // // // // // // // // // // // //         <p>EM value: {emValue}</p>
// // // // // // // // // // // // //         <p>REM value: {remValue}</p>
// // // // // // // // // // // // //       </div>
// // // // // // // // // // // // //     </div>
// // // // // // // // // // // // //   );
// // // // // // // // // // // 'use client'
// // // // // // // // // // // import { useState } from 'react';
// // // // // // // // // // // import styles from './AsciiConverter.module.css';

// // // // // // // // // // // const units = ['px', 'em', 'rem', '%', 'vw', 'vh'];

// // // // // // // // // // // const convertUnits = (value, fromUnit, toUnit, baseSize = 16) => {
// // // // // // // // // // //   // Convert to pixels first
// // // // // // // // // // //   let px;
// // // // // // // // // // //   switch (fromUnit) {
// // // // // // // // // // //     case 'px':
// // // // // // // // // // //       px = value;
// // // // // // // // // // //       break;
// // // // // // // // // // //     case 'em':
// // // // // // // // // // //     case 'rem':
// // // // // // // // // // //       px = value * baseSize;
// // // // // // // // // // //       break;
// // // // // // // // // // //     case '%':
// // // // // // // // // // //       px = (value / 100) * baseSize;
// // // // // // // // // // //       break;
// // // // // // // // // // //     case 'vw':
// // // // // // // // // // //       px = (value / 100) * window.innerWidth;
// // // // // // // // // // //       break;
// // // // // // // // // // //     case 'vh':
// // // // // // // // // // //       px = (value / 100) * window.innerHeight;
// // // // // // // // // // //       break;
// // // // // // // // // // //     default:
// // // // // // // // // // //       return 'Invalid unit';
// // // // // // // // // // //   }

// // // // // // // // // // //   // Convert pixels to target unit
// // // // // // // // // // //   switch (toUnit) {
// // // // // // // // // // //     case 'px':
// // // // // // // // // // //       return px.toFixed(2) + 'px';
// // // // // // // // // // //     case 'em':
// // // // // // // // // // //       return (px / baseSize).toFixed(4) + 'em';
// // // // // // // // // // //     case 'rem':
// // // // // // // // // // //       return (px / 16).toFixed(4) + 'rem';
// // // // // // // // // // //     case '%':
// // // // // // // // // // //       return ((px / baseSize) * 100).toFixed(2) + '%';
// // // // // // // // // // //     case 'vw':
// // // // // // // // // // //       return ((px / window.innerWidth) * 100).toFixed(2) + 'vw';
// // // // // // // // // // //     case 'vh':
// // // // // // // // // // //       return ((px / window.innerHeight) * 100).toFixed(2) + 'vh';
// // // // // // // // // // //     default:
// // // // // // // // // // //       return 'Invalid unit';
// // // // // // // // // // //   }
// // // // // // // // // // // };

// // // // // // // // // // // export default function CssUnitsConverter() {
// // // // // // // // // // //   const [inputValue, setInputValue] = useState('');
// // // // // // // // // // //   const [fromUnit, setFromUnit] = useState('px');
// // // // // // // // // // //   const [toUnit, setToUnit] = useState('em');
// // // // // // // // // // //   const [baseSize, setBaseSize] = useState(16);
// // // // // // // // // // //   const [result, setResult] = useState('');

// // // // // // // // // // //   const handleConvert = () => {
// // // // // // // // // // //     if (inputValue) {
// // // // // // // // // // //       const convertedValue = convertUnits(parseFloat(inputValue), fromUnit, toUnit, baseSize);
// // // // // // // // // // //       setResult(convertedValue);
// // // // // // // // // // //     } else {
// // // // // // // // // // //       setResult('');
// // // // // // // // // // //     }
// // // // // // // // // // //   };
 
// // // // // // // // // // //   return (
// // // // // // // // // // //     <div className={styles.container}>
// // // // // // // // // // //       <div className={styles.inputGroup}>
// // // // // // // // // // //         <label htmlFor="inputValue">Value:</label>
// // // // // // // // // // //         <input
// // // // // // // // // // //           id="inputValue"
// // // // // // // // // // //           type="number"
// // // // // // // // // // //           value={inputValue}
// // // // // // // // // // //           onChange={(e) => setInputValue(e.target.value)}
// // // // // // // // // // //           placeholder="Enter value"
// // // // // // // // // // //         />
// // // // // // // // // // //       </div>
// // // // // // // // // // //       <div className={styles.inputGroup}>
// // // // // // // // // // //         <label htmlFor="fromUnit">From:</label>
// // // // // // // // // // //         <select id="fromUnit" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
// // // // // // // // // // //           {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
// // // // // // // // // // //         </select>
// // // // // // // // // // //       </div>
// // // // // // // // // // //       <div className={styles.inputGroup}>
// // // // // // // // // // //         <label htmlFor="toUnit">To:</label>
// // // // // // // // // // //         <select id="toUnit" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
// // // // // // // // // // //           {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
// // // // // // // // // // //         </select>
// // // // // // // // // // //       </div>
// // // // // // // // // // //       <div className={styles.inputGroup}>
// // // // // // // // // // //         <label htmlFor="baseSize">Base size (px):</label>
// // // // // // // // // // //         <input
// // // // // // // // // // //           id="baseSize"
// // // // // // // // // // //           type="number"
// // // // // // // // // // //           value={baseSize}
// // // // // // // // // // //           onChange={(e) => setBaseSize(parseInt(e.target.value))}
// // // // // // // // // // //         />
// // // // // // // // // // //       </div>
// // // // // // // // // // //       <button className={styles.button} onClick={handleConvert}>Convert</button>
// // // // // // // // // // //       <div className={styles.result}>
// // // // // // // // // // //         <p>Result: {result}</p>
// // // // // // // // // // //       </div>
// // // // // // // // // // //     </div>
// // // // // // // // // // //   );
// // // // // // // // // // // }
// // // // // // // // // // 'use client'
// // // // // // // // // // import { useState, useEffect } from 'react';
// // // // // // // // // // import styles from './CssUnitsConverter.module.css';

// // // // // // // // // // const units = ['px', 'rem', 'em', 'vw', 'vh', 'pt', 'in', 'pc', 'cm', 'mm', '%'];

// // // // // // // // // // const convertUnits = (value, fromUnit, toUnit, baseSize = 16, parentSize = 16, viewportWidth = 1920, viewportHeight = 1080) => {
// // // // // // // // // //   // Convert to pixels first
// // // // // // // // // //   let px;
// // // // // // // // // //   switch (fromUnit) {
// // // // // // // // // //     case 'px': px = value; break;
// // // // // // // // // //     case 'rem': px = value * baseSize; break;
// // // // // // // // // //     case 'em': px = value * parentSize; break;
// // // // // // // // // //     case 'vw': px = (value / 100) * viewportWidth; break;
// // // // // // // // // //     case 'vh': px = (value / 100) * viewportHeight; break;
// // // // // // // // // //     case 'pt': px = value * (96 / 72); break;
// // // // // // // // // //     case 'in': px = value * 96; break;
// // // // // // // // // //     case 'pc': px = value * 16; break;
// // // // // // // // // //     case 'cm': px = value * 37.8; break;
// // // // // // // // // //     case 'mm': px = value * 3.78; break;
// // // // // // // // // //     case '%': px = (value / 100) * parentSize; break;
// // // // // // // // // //     default: return 'Invalid unit';
// // // // // // // // // //   }

// // // // // // // // // //   // Convert pixels to target unit
// // // // // // // // // //   switch (toUnit) {
// // // // // // // // // //     case 'px': return px.toFixed(2) + 'px';
// // // // // // // // // //     case 'rem': return (px / baseSize).toFixed(4) + 'rem';
// // // // // // // // // //     case 'em': return (px / parentSize).toFixed(4) + 'em';
// // // // // // // // // //     case 'vw': return ((px / viewportWidth) * 100).toFixed(2) + 'vw';
// // // // // // // // // //     case 'vh': return ((px / viewportHeight) * 100).toFixed(2) + 'vh';
// // // // // // // // // //     case 'pt': return ((px * 72) / 96).toFixed(2) + 'pt';
// // // // // // // // // //     case 'in': return (px / 96).toFixed(2) + 'in';
// // // // // // // // // //     case 'pc': return (px / 16).toFixed(2) + 'pc';
// // // // // // // // // //     case 'cm': return (px / 37.8).toFixed(2) + 'cm';
// // // // // // // // // //     case 'mm': return (px / 3.78).toFixed(2) + 'mm';
// // // // // // // // // //     case '%': return ((px / parentSize) * 100).toFixed(2) + '%';
// // // // // // // // // //     default: return 'Invalid unit';
// // // // // // // // // //   }
// // // // // // // // // // };

// // // // // // // // // // export default function CssUnitConverter() {
// // // // // // // // // //   const [inputValue, setInputValue] = useState('');
// // // // // // // // // //   const [fromUnit, setFromUnit] = useState('px');
// // // // // // // // // //   const [toUnit, setToUnit] = useState('rem');
// // // // // // // // // //   const [baseSize, setBaseSize] = useState(16);
// // // // // // // // // //   const [parentSize, setParentSize] = useState(16);
// // // // // // // // // //   const [viewportWidth, setViewportWidth] = useState(1920);
// // // // // // // // // //   const [viewportHeight, setViewportHeight] = useState(1080);
// // // // // // // // // //   const [result, setResult] = useState('');

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     if (typeof window !== 'undefined') {
// // // // // // // // // //       setViewportWidth(window.innerWidth);
// // // // // // // // // //       setViewportHeight(window.innerHeight);
// // // // // // // // // //     }
// // // // // // // // // //   }, []);

// // // // // // // // // //   const handleConvert = () => {
// // // // // // // // // //     if (inputValue) {
// // // // // // // // // //       const convertedValue = convertUnits(parseFloat(inputValue), fromUnit, toUnit, baseSize, parentSize, viewportWidth, viewportHeight);
// // // // // // // // // //       setResult(convertedValue);
// // // // // // // // // //     } else {
// // // // // // // // // //       setResult('');
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   return (
// // // // // // // // // //     <div className={styles.container}>
// // // // // // // // // //       <div className={styles.inputGroup}>
// // // // // // // // // //         <label htmlFor="inputValue">Value:</label>
// // // // // // // // // //         <input
// // // // // // // // // //           id="inputValue"
// // // // // // // // // //           type="number"
// // // // // // // // // //           value={inputValue}
// // // // // // // // // //           onChange={(e) => setInputValue(e.target.value)}
// // // // // // // // // //           placeholder="Enter value"
// // // // // // // // // //         />
// // // // // // // // // //       </div>
// // // // // // // // // //       <div className={styles.inputGroup}>
// // // // // // // // // //         <label htmlFor="fromUnit">From:</label>
// // // // // // // // // //         <select id="fromUnit" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
// // // // // // // // // //           {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
// // // // // // // // // //         </select>
// // // // // // // // // //       </div>
// // // // // // // // // //       <div className={styles.inputGroup}>
// // // // // // // // // //         <label htmlFor="toUnit">To:</label>
// // // // // // // // // //         <select id="toUnit" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
// // // // // // // // // //           {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
// // // // // // // // // //         </select>
// // // // // // // // // //       </div>
// // // // // // // // // //       <div className={styles.inputGroup}>
// // // // // // // // // //         <label htmlFor="baseSize">Base font size (px):</label>
// // // // // // // // // //         <input
// // // // // // // // // //           id="baseSize"
// // // // // // // // // //           type="number"
// // // // // // // // // //           value={baseSize}
// // // // // // // // // //           onChange={(e) => setBaseSize(parseInt(e.target.value))}
// // // // // // // // // //         />
// // // // // // // // // //       </div>
// // // // // // // // // //       <div className={styles.inputGroup}>
// // // // // // // // // //         <label htmlFor="parentSize">Parent element size (px):</label>
// // // // // // // // // //         <input
// // // // // // // // // //           id="parentSize"
// // // // // // // // // //           type="number"
// // // // // // // // // //           value={parentSize}
// // // // // // // // // //           onChange={(e) => setParentSize(parseInt(e.target.value))}
// // // // // // // // // //         />
// // // // // // // // // //       </div>
// // // // // // // // // //       <button className={styles.button} onClick={handleConvert}>Convert</button>
// // // // // // // // // //       <div className={styles.result}>
// // // // // // // // // //         <p>Result: {result}</p>
// // // // // // // // // //       </div>
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // }
// // // // // // // // // 'use client'

// // // // // // // // // import React, { useState, useEffect } from 'react';

// // // // // // // // // const CssUnitsConverter = () => {
// // // // // // // // //   const [inputValue, setInputValue] = useState('');
// // // // // // // // //   const [fromUnit, setFromUnit] = useState('px');
// // // // // // // // //   const [toUnit, setToUnit] = useState('em');
// // // // // // // // //   const [result, setResult] = useState('');
// // // // // // // // //   const [additionalFields, setAdditionalFields] = useState({});

// // // // // // // // //   const units = ['px', 'em', 'rem'];

// // // // // // // // //   const requiredFields = {
// // // // // // // // //     'px-to-em': ['parentSize'],
// // // // // // // // //     'px-to-rem': ['rootSize'],
// // // // // // // // //     'em-to-px': ['parentSize'],
// // // // // // // // //     'em-to-rem': ['parentSize', 'rootSize'],
// // // // // // // // //     'rem-to-px': ['rootSize'],
// // // // // // // // //     'rem-to-em': ['rootSize', 'parentSize'],
// // // // // // // // //   };

// // // // // // // // //   const getRequiredFields = (from, to) => {
// // // // // // // // //     return requiredFields[`${from}-to-${to}`] || [];
// // // // // // // // //   };

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const newFields = getRequiredFields(fromUnit, toUnit);
// // // // // // // // //     setAdditionalFields(prevFields => {
// // // // // // // // //       const updatedFields = {};
// // // // // // // // //       newFields.forEach(field => {
// // // // // // // // //         updatedFields[field] = prevFields[field] || '';
// // // // // // // // //       });
// // // // // // // // //       return updatedFields;
// // // // // // // // //     });
// // // // // // // // //   }, [fromUnit, toUnit]);

// // // // // // // // //   const handleConvert = () => {
// // // // // // // // //     if (!inputValue) return;

// // // // // // // // //     const value = parseFloat(inputValue);
// // // // // // // // //     const { parentSize, rootSize } = additionalFields;

// // // // // // // // //     let result;
// // // // // // // // //     switch (`${fromUnit}-to-${toUnit}`) {
// // // // // // // // //       case 'px-to-em':
// // // // // // // // //         result = value / parseFloat(parentSize);
// // // // // // // // //         break;
// // // // // // // // //       case 'px-to-rem':
// // // // // // // // //         result = value / parseFloat(rootSize);
// // // // // // // // //         break;
// // // // // // // // //       case 'em-to-px':
// // // // // // // // //         result = value * parseFloat(parentSize);
// // // // // // // // //         break;
// // // // // // // // //       case 'em-to-rem':
// // // // // // // // //         result = (value * parseFloat(parentSize)) / parseFloat(rootSize);
// // // // // // // // //         break;
// // // // // // // // //       case 'rem-to-px':
// // // // // // // // //         result = value * parseFloat(rootSize);
// // // // // // // // //         break;
// // // // // // // // //       case 'rem-to-em':
// // // // // // // // //         result = (value * parseFloat(rootSize)) / parseFloat(parentSize);
// // // // // // // // //         break;
// // // // // // // // //       default:
// // // // // // // // //         result = value; // Same unit conversion
// // // // // // // // //     }

// // // // // // // // //     setResult(`${result.toFixed(4)} ${toUnit}`);
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <div>
// // // // // // // // //       <h2>CSS Units Converter</h2>
// // // // // // // // //       <div>
// // // // // // // // //         <input
// // // // // // // // //           type="number"
// // // // // // // // //           value={inputValue}
// // // // // // // // //           onChange={(e) => setInputValue(e.target.value)}
// // // // // // // // //           placeholder="Enter value"
// // // // // // // // //         />
// // // // // // // // //         <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
// // // // // // // // //           {units.map(unit => (
// // // // // // // // //             <option key={unit} value={unit}>{unit}</option>
// // // // // // // // //           ))}
// // // // // // // // //         </select>
// // // // // // // // //         <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
// // // // // // // // //           {units.map(unit => (
// // // // // // // // //             <option key={unit} value={unit}>{unit}</option>
// // // // // // // // //           ))}
// // // // // // // // //         </select>
// // // // // // // // //       </div>
// // // // // // // // //       {getRequiredFields(fromUnit, toUnit).map(field => (
// // // // // // // // //         <div key={field}>
// // // // // // // // //           <input
// // // // // // // // //             type="number"
// // // // // // // // //             placeholder={field}
// // // // // // // // //             value={additionalFields[field] || ''}
// // // // // // // // //             onChange={(e) => setAdditionalFields({...additionalFields, [field]: e.target.value})}
// // // // // // // // //           />
// // // // // // // // //         </div>
// // // // // // // // //       ))}
// // // // // // // // //       <button onClick={handleConvert}>Convert</button>
// // // // // // // // //       <div>
// // // // // // // // //         <p>Result: {result}</p>
// // // // // // // // //       </div>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default CssUnitsConverter;
// // // // // // // // 'use client'

// // // // // // // // import React, { useReducer, useEffect } from 'react';

// // // // // // // // const initialState = {
// // // // // // // //   inputValue: '',
// // // // // // // //   fromUnit: 'Select Unit',
// // // // // // // //   toUnit: 'Select Unit',
// // // // // // // //   result: '',
// // // // // // // //   additionalFields: {}
// // // // // // // // };

// // // // // // // // const units = ['Select Unit', 'px', 'em', 'rem'];

// // // // // // // // const requiredFields = {
// // // // // // // //   'px-to-em': ['Parent Size (emSize)'],
// // // // // // // //   'px-to-rem': ['Root Size (remSize)'],
// // // // // // // //   'em-to-px': ['Parent Size (emSize)'],
// // // // // // // //   'em-to-rem': ['Parent Size (emSize)', 'Root Size (remSize)'],
// // // // // // // //   'rem-to-px': ['Root Size (remSize)'],
// // // // // // // //   'rem-to-em': ['Root Size (remSize)', 'Parent Size (emSize)'],
// // // // // // // // };

// // // // // // // // function reducer(state, action) {
// // // // // // // //   switch (action.type) {
// // // // // // // //     case 'SET_INPUT_VALUE':
// // // // // // // //       return { ...state, inputValue: action.payload };
// // // // // // // //     case 'SET_FROM_UNIT':
// // // // // // // //       return { ...state, fromUnit: action.payload };
// // // // // // // //     case 'SET_TO_UNIT':
// // // // // // // //       return { ...state, toUnit: action.payload };
// // // // // // // //     case 'SET_RESULT':
// // // // // // // //       return { ...state, result: action.payload };
// // // // // // // //     case 'SET_ADDITIONAL_FIELDS':
// // // // // // // //       return { ...state, additionalFields: action.payload };
// // // // // // // //     case 'UPDATE_ADDITIONAL_FIELD':
// // // // // // // //       return { 
// // // // // // // //         ...state, 
// // // // // // // //         additionalFields: {
// // // // // // // //           ...state.additionalFields, 
// // // // // // // //           [action.payload.field]: action.payload.value
// // // // // // // //         }
// // // // // // // //       };
// // // // // // // //     case 'RESET':
// // // // // // // //       return initialState;
// // // // // // // //     default:
// // // // // // // //       return state;
// // // // // // // //   }
// // // // // // // // }

// // // // // // // // const CssUnitsConverter = () => {
// // // // // // // //   const [state, dispatch] = useReducer(reducer, initialState);

// // // // // // // //   const getRequiredFields = (from, to) => {
// // // // // // // //     return requiredFields[`${from}-to-${to}`] || [];
// // // // // // // //   };

// // // // // // // //   useEffect(() => {
// // // // // // // //     const newFields = getRequiredFields(state.fromUnit, state.toUnit);
// // // // // // // //     dispatch({ 
// // // // // // // //       type: 'SET_ADDITIONAL_FIELDS', 
// // // // // // // //       payload: newFields.reduce((acc, field) => ({...acc, [field]: ''}), {})
// // // // // // // //     });
// // // // // // // //   }, [state.fromUnit, state.toUnit]);

// // // // // // // //   const handleConvert = () => {
// // // // // // // //     if (!state.inputValue || state.fromUnit === 'Select Unit' || state.toUnit === 'Select Unit') return;

// // // // // // // //     const value = parseFloat(state.inputValue);
// // // // // // // //     const { 'Parent Size (emSize)': emSize, 'Root Size (remSize)': remSize } = state.additionalFields;

// // // // // // // //     let result;
// // // // // // // //     switch (`${state.fromUnit}-to-${state.toUnit}`) {
// // // // // // // //       case 'px-to-em':
// // // // // // // //         result = value / parseFloat(emSize);
// // // // // // // //         break;
// // // // // // // //       case 'px-to-rem':
// // // // // // // //         result = value / parseFloat(remSize);
// // // // // // // //         break;
// // // // // // // //       case 'em-to-px':
// // // // // // // //         result = value * parseFloat(emSize);
// // // // // // // //         break;
// // // // // // // //       case 'em-to-rem':
// // // // // // // //         result = (value * parseFloat(emSize)) / parseFloat(remSize);
// // // // // // // //         break;
// // // // // // // //       case 'rem-to-px':
// // // // // // // //         result = value * parseFloat(remSize);
// // // // // // // //         break;
// // // // // // // //       case 'rem-to-em':
// // // // // // // //         result = (value * parseFloat(remSize)) / parseFloat(emSize);
// // // // // // // //         break;
// // // // // // // //       default:
// // // // // // // //         result = value;
// // // // // // // //     }

// // // // // // // //     dispatch({ type: 'SET_RESULT', payload: `${result.toFixed(4)} ${state.toUnit}` });
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <div>
// // // // // // // //       <h2>CSS Units Converter</h2>
// // // // // // // //       <div>
// // // // // // // //         <label htmlFor="inputValue">Value: </label>
// // // // // // // //         <input
// // // // // // // //           id="inputValue"
// // // // // // // //           type="number"
// // // // // // // //           value={state.inputValue}
// // // // // // // //           onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value })}
// // // // // // // //           placeholder="Enter value"
// // // // // // // //         />
// // // // // // // //       </div>
// // // // // // // //       <div>
// // // // // // // //         <label htmlFor="fromUnit">From: </label>
// // // // // // // //         <select 
// // // // // // // //           id="fromUnit"
// // // // // // // //           value={state.fromUnit} 
// // // // // // // //           onChange={(e) => dispatch({ type: 'SET_FROM_UNIT', payload: e.target.value })}>
// // // // // // // //           {units.map(unit => (
// // // // // // // //             <option key={unit} value={unit}>{unit}</option>
// // // // // // // //           ))}
// // // // // // // //         </select>
// // // // // // // //       </div>
// // // // // // // //       <div>
// // // // // // // //         <label htmlFor="toUnit">To: </label>
// // // // // // // //         <select 
// // // // // // // //           id="toUnit"
// // // // // // // //           value={state.toUnit} 
// // // // // // // //           onChange={(e) => dispatch({ type: 'SET_TO_UNIT', payload: e.target.value })}>
// // // // // // // //           {units.map(unit => (
// // // // // // // //             <option key={unit} value={unit}>{unit}</option>
// // // // // // // //           ))}
// // // // // // // //         </select>
// // // // // // // //       </div>
// // // // // // // //       {getRequiredFields(state.fromUnit, state.toUnit).map(field => (
// // // // // // // //         <div key={field}>
// // // // // // // //           <label htmlFor={field}>{field}: </label>
// // // // // // // //           <input
// // // // // // // //             id={field}
// // // // // // // //             type="number"
// // // // // // // //             placeholder={field}
// // // // // // // //             value={state.additionalFields[field] || ''}
// // // // // // // //             onChange={(e) => dispatch({ 
// // // // // // // //               type: 'UPDATE_ADDITIONAL_FIELD', 
// // // // // // // //               payload: { field, value: e.target.value } 
// // // // // // // //             })}
// // // // // // // //           />
// // // // // // // //         </div>
// // // // // // // //       ))}
// // // // // // // //       <button onClick={handleConvert}>Convert</button>
// // // // // // // //       <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
// // // // // // // //       <div>
// // // // // // // //         <p>Result: {state.result}</p>
// // // // // // // //       </div>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default CssUnitsConverter;
// // // // // // // 'use client'

// // // // // // // import React, { useReducer, useEffect } from 'react';

// // // // // // // const initialState = {
// // // // // // //   inputValue: '',
// // // // // // //   fromUnit: 'Select Unit',
// // // // // // //   toUnit: 'Select Unit',
// // // // // // //   result: '',
// // // // // // //   additionalFields: {}
// // // // // // // };

// // // // // // // const units = ['Select Unit', 'px', 'em', 'rem', 'pt', 'in', 'cm', 'mm'];

// // // // // // // const requiredFields = {
// // // // // // //   'em-to-px': ['Parent Size (emSize)'],
// // // // // // //   'em-to-rem': ['Parent Size (emSize)', 'Root Size (remSize)'],
// // // // // // //   'em-to-pt': ['Parent Size (emSize)'],
// // // // // // //   'em-to-in': ['Parent Size (emSize)'],
// // // // // // //   'em-to-cm': ['Parent Size (emSize)'],
// // // // // // //   'em-to-mm': ['Parent Size (emSize)'],
// // // // // // //   'rem-to-px': ['Root Size (remSize)'],
// // // // // // //   'rem-to-em': ['Root Size (remSize)', 'Parent Size (emSize)'],
// // // // // // //   'rem-to-pt': ['Root Size (remSize)'],
// // // // // // //   'rem-to-in': ['Root Size (remSize)'],
// // // // // // //   'rem-to-cm': ['Root Size (remSize)'],
// // // // // // //   'rem-to-mm': ['Root Size (remSize)'],
// // // // // // //   'px-to-em': ['Parent Size (emSize)'],
// // // // // // //   'px-to-rem': ['Root Size (remSize)'],
// // // // // // //   'pt-to-em': ['Parent Size (emSize)'],
// // // // // // //   'pt-to-rem': ['Root Size (remSize)'],
// // // // // // //   'in-to-em': ['Parent Size (emSize)'],
// // // // // // //   'in-to-rem': ['Root Size (remSize)'],
// // // // // // //   'cm-to-em': ['Parent Size (emSize)'],
// // // // // // //   'cm-to-rem': ['Root Size (remSize)'],
// // // // // // //   'mm-to-em': ['Parent Size (emSize)'],
// // // // // // //   'mm-to-rem': ['Root Size (remSize)'],
// // // // // // // };

// // // // // // // function reducer(state, action) {
// // // // // // //   switch (action.type) {
// // // // // // //     case 'SET_INPUT_VALUE':
// // // // // // //       return { ...state, inputValue: action.payload };
// // // // // // //     case 'SET_FROM_UNIT':
// // // // // // //       return { ...state, fromUnit: action.payload };
// // // // // // //     case 'SET_TO_UNIT':
// // // // // // //       return { ...state, toUnit: action.payload };
// // // // // // //     case 'SET_RESULT':
// // // // // // //       return { ...state, result: action.payload };
// // // // // // //     case 'SET_ADDITIONAL_FIELDS':
// // // // // // //       return { ...state, additionalFields: action.payload };
// // // // // // //     case 'UPDATE_ADDITIONAL_FIELD':
// // // // // // //       return { 
// // // // // // //         ...state, 
// // // // // // //         additionalFields: {
// // // // // // //           ...state.additionalFields, 
// // // // // // //           [action.payload.field]: action.payload.value
// // // // // // //         }
// // // // // // //       };
// // // // // // //     case 'RESET':
// // // // // // //       return initialState;
// // // // // // //     default:
// // // // // // //       return state;
// // // // // // //   }
// // // // // // // }

// // // // // // // const CssUnitsConverter = () => {
// // // // // // //   const [state, dispatch] = useReducer(reducer, initialState);

// // // // // // //   const getRequiredFields = (from, to) => {
// // // // // // //     return requiredFields[`${from}-to-${to}`] || [];
// // // // // // //   };

// // // // // // //   useEffect(() => {
// // // // // // //     const newFields = getRequiredFields(state.fromUnit, state.toUnit);
// // // // // // //     dispatch({ 
// // // // // // //       type: 'SET_ADDITIONAL_FIELDS', 
// // // // // // //       payload: newFields.reduce((acc, field) => ({...acc, [field]: ''}), {})
// // // // // // //     });
// // // // // // //   }, [state.fromUnit, state.toUnit]);

// // // // // // //   const handleConvert = () => {
// // // // // // //     if (!state.inputValue || state.fromUnit === 'Select Unit' || state.toUnit === 'Select Unit') return;

// // // // // // //     const value = parseFloat(state.inputValue);
// // // // // // //     const { 'Parent Size (emSize)': emSize, 'Root Size (remSize)': remSize } = state.additionalFields;

// // // // // // //     let result;
// // // // // // //     const pxValue = convertToPx(value, state.fromUnit, emSize, remSize);
// // // // // // //     result = convertFromPx(pxValue, state.toUnit, emSize, remSize);

// // // // // // //     dispatch({ type: 'SET_RESULT', payload: `${result.toFixed(4)} ${state.toUnit}` });
// // // // // // //   };

// // // // // // //   const convertToPx = (value, unit, emSize, remSize) => {
// // // // // // //     switch (unit) {
// // // // // // //       case 'px': return value;
// // // // // // //       case 'em': return value * parseFloat(emSize);
// // // // // // //       case 'rem': return value * parseFloat(remSize);
// // // // // // //       case 'pt': return value * (96 / 72);
// // // // // // //       case 'in': return value * 96;
// // // // // // //       case 'cm': return value * (96 / 2.54);
// // // // // // //       case 'mm': return value * (96 / 25.4);
// // // // // // //       default: return value;
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const convertFromPx = (px, unit, emSize, remSize) => {
// // // // // // //     switch (unit) {
// // // // // // //       case 'px': return px;
// // // // // // //       case 'em': return px / parseFloat(emSize);
// // // // // // //       case 'rem': return px / parseFloat(remSize);
// // // // // // //       case 'pt': return px * (72 / 96);
// // // // // // //       case 'in': return px / 96;
// // // // // // //       case 'cm': return px * (2.54 / 96);
// // // // // // //       case 'mm': return px * (25.4 / 96);
// // // // // // //       default: return px;
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleCopyResult = () => {
// // // // // // //     navigator.clipboard.writeText(state.result)
// // // // // // //       .then(() => alert('Result copied to clipboard!'))
// // // // // // //       .catch(err => console.error('Failed to copy: ', err));
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div>
// // // // // // //       <h2>CSS Units Converter</h2>
// // // // // // //       <div>
// // // // // // //         <label htmlFor="inputValue">Value: </label>
// // // // // // //         <input
// // // // // // //           id="inputValue"
// // // // // // //           type="number"
// // // // // // //           value={state.inputValue}
// // // // // // //           onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value })}
// // // // // // //           placeholder="Enter value"
// // // // // // //         />
// // // // // // //       </div>
// // // // // // //       <div>
// // // // // // //         <label htmlFor="fromUnit">From: </label>
// // // // // // //         <select 
// // // // // // //           id="fromUnit"
// // // // // // //           value={state.fromUnit} 
// // // // // // //           onChange={(e) => dispatch({ type: 'SET_FROM_UNIT', payload: e.target.value })}>
// // // // // // //           {units.map(unit => (
// // // // // // //             <option key={unit} value={unit}>{unit}</option>
// // // // // // //           ))}
// // // // // // //         </select>
// // // // // // //       </div>
// // // // // // //       <div>
// // // // // // //         <label htmlFor="toUnit">To: </label>
// // // // // // //         <select 
// // // // // // //           id="toUnit"
// // // // // // //           value={state.toUnit} 
// // // // // // //           onChange={(e) => dispatch({ type: 'SET_TO_UNIT', payload: e.target.value })}>
// // // // // // //           {units.map(unit => (
// // // // // // //             <option key={unit} value={unit}>{unit}</option>
// // // // // // //           ))}
// // // // // // //         </select>
// // // // // // //       </div>
// // // // // // //       {getRequiredFields(state.fromUnit, state.toUnit).map(field => (
// // // // // // //         <div key={field}>
// // // // // // //           <label htmlFor={field}>{field}: </label>
// // // // // // //           <input
// // // // // // //             id={field}
// // // // // // //             type="number"
// // // // // // //             placeholder={field}
// // // // // // //             value={state.additionalFields[field] || ''}
// // // // // // //             onChange={(e) => dispatch({ 
// // // // // // //               type: 'UPDATE_ADDITIONAL_FIELD', 
// // // // // // //               payload: { field, value: e.target.value } 
// // // // // // //             })}
// // // // // // //           />
// // // // // // //         </div>
// // // // // // //       ))}
// // // // // // //       <button onClick={handleConvert}>Convert</button>
// // // // // // //       <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
// // // // // // //       <div>
// // // // // // //         <p>Result: {state.result}</p>
// // // // // // //         <button onClick={handleCopyResult}>Copy Result</button>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default CssUnitsConverter;
// // // // // // 'use client'

// // // // // // import React, { useReducer, useEffect, useState } from 'react';

// // // // // // const initialState = {
// // // // // //   inputValue: '',
// // // // // //   fromUnit: 'Select Unit',
// // // // // //   toUnit: 'Select Unit',
// // // // // //   result: '',
// // // // // //   additionalFields: {}
// // // // // // };

// // // // // // const units = ['Select Unit', 'px', 'em', 'rem', 'pt', 'in', 'cm', 'mm', '%'];

// // // // // // const requiredFields = {
// // // // // //   'em-to-px': ['Parent Size (emSize)'],
// // // // // //   'em-to-rem': ['Parent Size (emSize)', 'Root Size (remSize)'],
// // // // // //   'em-to-%': ['Parent Size (emSize)', 'Base Size for %'],
// // // // // //   'rem-to-px': ['Root Size (remSize)'],
// // // // // //   'rem-to-em': ['Root Size (remSize)', 'Parent Size (emSize)'],
// // // // // //   'rem-to-%': ['Root Size (remSize)', 'Base Size for %'],
// // // // // //   'px-to-em': ['Parent Size (emSize)'],
// // // // // //   'px-to-rem': ['Root Size (remSize)'],
// // // // // //   'px-to-%': ['Base Size for %'],
// // // // // //   'pt-to-em': ['Parent Size (emSize)'],
// // // // // //   'pt-to-rem': ['Root Size (remSize)'],
// // // // // //   'pt-to-%': ['Base Size for %'],
// // // // // //   'in-to-em': ['Parent Size (emSize)'],
// // // // // //   'in-to-rem': ['Root Size (remSize)'],
// // // // // //   'in-to-%': ['Base Size for %'],
// // // // // //   'cm-to-em': ['Parent Size (emSize)'],
// // // // // //   'cm-to-rem': ['Root Size (remSize)'],
// // // // // //   'cm-to-%': ['Base Size for %'],
// // // // // //   'mm-to-em': ['Parent Size (emSize)'],
// // // // // //   'mm-to-rem': ['Root Size (remSize)'],
// // // // // //   'mm-to-%': ['Base Size for %'],
// // // // // //   '%-to-px': ['Base Size for %'],
// // // // // //   '%-to-em': ['Base Size for %', 'Parent Size (emSize)'],
// // // // // //   '%-to-rem': ['Base Size for %', 'Root Size (remSize)'],
// // // // // //   '%-to-pt': ['Base Size for %'],
// // // // // //   '%-to-in': ['Base Size for %'],
// // // // // //   '%-to-cm': ['Base Size for %'],
// // // // // //   '%-to-mm': ['Base Size for %'],
// // // // // // };

// // // // // // function reducer(state, action) {
// // // // // //   switch (action.type) {
// // // // // //     case 'SET_INPUT_VALUE':
// // // // // //       return { ...state, inputValue: action.payload };
// // // // // //     case 'SET_FROM_UNIT':
// // // // // //       return { ...state, fromUnit: action.payload };
// // // // // //     case 'SET_TO_UNIT':
// // // // // //       return { ...state, toUnit: action.payload };
// // // // // //     case 'SET_RESULT':
// // // // // //       return { ...state, result: action.payload };
// // // // // //     case 'SET_ADDITIONAL_FIELDS':
// // // // // //       return { ...state, additionalFields: action.payload };
// // // // // //     case 'UPDATE_ADDITIONAL_FIELD':
// // // // // //       return { 
// // // // // //         ...state, 
// // // // // //         additionalFields: {
// // // // // //           ...state.additionalFields, 
// // // // // //           [action.payload.field]: action.payload.value
// // // // // //         }
// // // // // //       };
// // // // // //     case 'RESET':
// // // // // //       return initialState;
// // // // // //     default:
// // // // // //       return state;
// // // // // //   }
// // // // // // }

// // // // // // const CssUnitsConverter = () => {
// // // // // //   const [state, dispatch] = useReducer(reducer, initialState);
// // // // // //   const [copyButtonText, setCopyButtonText] = useState('Copy Result');

// // // // // //   const getRequiredFields = (from, to) => {
// // // // // //     return requiredFields[`${from}-to-${to}`] || [];
// // // // // //   };

// // // // // //   useEffect(() => {
// // // // // //     const newFields = getRequiredFields(state.fromUnit, state.toUnit);
// // // // // //     dispatch({ 
// // // // // //       type: 'SET_ADDITIONAL_FIELDS', 
// // // // // //       payload: newFields.reduce((acc, field) => ({...acc, [field]: ''}), {})
// // // // // //     });
// // // // // //   }, [state.fromUnit, state.toUnit]);

// // // // // //   const handleConvert = () => {
// // // // // //     if (!state.inputValue || state.fromUnit === 'Select Unit' || state.toUnit === 'Select Unit') return;

// // // // // //     const value = parseFloat(state.inputValue);
// // // // // //     const { 'Parent Size (emSize)': emSize, 'Root Size (remSize)': remSize, 'Base Size for %': baseSize } = state.additionalFields;

// // // // // //     let result;
// // // // // //     const pxValue = convertToPx(value, state.fromUnit, emSize, remSize, baseSize);
// // // // // //     result = convertFromPx(pxValue, state.toUnit, emSize, remSize, baseSize);

// // // // // //     dispatch({ type: 'SET_RESULT', payload: `${result.toFixed(4)} ${state.toUnit}` });
// // // // // //   };

// // // // // //   const convertToPx = (value, unit, emSize, remSize, baseSize) => {
// // // // // //     switch (unit) {
// // // // // //       case 'px': return value;
// // // // // //       case 'em': return value * parseFloat(emSize);
// // // // // //       case 'rem': return value * parseFloat(remSize);
// // // // // //       case 'pt': return value * (96 / 72);
// // // // // //       case 'in': return value * 96;
// // // // // //       case 'cm': return value * (96 / 2.54);
// // // // // //       case 'mm': return value * (96 / 25.4);
// // // // // //       case '%': return (value / 100) * parseFloat(baseSize);
// // // // // //       default: return value;
// // // // // //     }
// // // // // //   };

// // // // // //   const convertFromPx = (px, unit, emSize, remSize, baseSize) => {
// // // // // //     switch (unit) {
// // // // // //       case 'px': return px;
// // // // // //       case 'em': return px / parseFloat(emSize);
// // // // // //       case 'rem': return px / parseFloat(remSize);
// // // // // //       case 'pt': return px * (72 / 96);
// // // // // //       case 'in': return px / 96;
// // // // // //       case 'cm': return px * (2.54 / 96);
// // // // // //       case 'mm': return px * (25.4 / 96);
// // // // // //       case '%': return (px / parseFloat(baseSize)) * 100;
// // // // // //       default: return px;
// // // // // //     }
// // // // // //   };

// // // // // //   const handleCopyResult = () => {
// // // // // //     navigator.clipboard.writeText(state.result)
// // // // // //       .then(() => {
// // // // // //         setCopyButtonText('Copied!');
// // // // // //         setTimeout(() => setCopyButtonText('Copy Result'), 5000);
// // // // // //       })
// // // // // //       .catch(err => console.error('Failed to copy: ', err));
// // // // // //   };

// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2>CSS Units Converter</h2>
// // // // // //       <div>
// // // // // //         <label htmlFor="inputValue">Value: </label>
// // // // // //         <input
// // // // // //           id="inputValue"
// // // // // //           type="number"
// // // // // //           value={state.inputValue}
// // // // // //           onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value })}
// // // // // //           placeholder="Enter value"
// // // // // //         />
// // // // // //       </div>
// // // // // //       <div>
// // // // // //         <label htmlFor="fromUnit">From: </label>
// // // // // //         <select 
// // // // // //           id="fromUnit"
// // // // // //           value={state.fromUnit} 
// // // // // //           onChange={(e) => dispatch({ type: 'SET_FROM_UNIT', payload: e.target.value })}>
// // // // // //           {units.map(unit => (
// // // // // //             <option key={unit} value={unit}>{unit}</option>
// // // // // //           ))}
// // // // // //         </select>
// // // // // //       </div>
// // // // // //       <div>
// // // // // //         <label htmlFor="toUnit">To: </label>
// // // // // //         <select 
// // // // // //           id="toUnit"
// // // // // //           value={state.toUnit} 
// // // // // //           onChange={(e) => dispatch({ type: 'SET_TO_UNIT', payload: e.target.value })}>
// // // // // //           {units.map(unit => (
// // // // // //             <option key={unit} value={unit}>{unit}</option>
// // // // // //           ))}
// // // // // //         </select>
// // // // // //       </div>
// // // // // //       {getRequiredFields(state.fromUnit, state.toUnit).map(field => (
// // // // // //         <div key={field}>
// // // // // //           <label htmlFor={field}>{field}: </label>
// // // // // //           <input
// // // // // //             id={field}
// // // // // //             type="number"
// // // // // //             placeholder={field}
// // // // // //             value={state.additionalFields[field] || ''}
// // // // // //             onChange={(e) => dispatch({ 
// // // // // //               type: 'UPDATE_ADDITIONAL_FIELD', 
// // // // // //               payload: { field, value: e.target.value } 
// // // // // //             })}
// // // // // //           />
// // // // // //         </div>
// // // // // //       ))}
// // // // // //       <button onClick={handleConvert}>Convert</button>
// // // // // //       <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
// // // // // //       <div>
// // // // // //         <p>Result: {state.result}</p>
// // // // // //         <button onClick={handleCopyResult}>{copyButtonText}</button>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default CssUnitsConverter;
// // // // // 'use client'

// // // // // import React, { useReducer, useEffect, useState } from 'react';

// // // // // const initialState = {
// // // // //   inputValue: '',
// // // // //   fromUnit: 'Select Unit',
// // // // //   toUnit: 'Select Unit',
// // // // //   result: '',
// // // // //   additionalFields: {}
// // // // // };

// // // // // const units = ['Select Unit', 'px', 'em', 'rem', 'pt', 'in', 'cm', 'mm', '%', 'vw', 'vh'];

// // // // // const requiredFields = {
// // // // //   'em-to-px': ['Parent Size (emSize)'],
// // // // //   'em-to-rem': ['Parent Size (emSize)', 'Root Size (remSize)'],
// // // // //   'em-to-%': ['Parent Size (emSize)', 'Base Size for %'],
// // // // //   'em-to-vw': ['Parent Size (emSize)', 'Viewport Width'],
// // // // //   'em-to-vh': ['Parent Size (emSize)', 'Viewport Height'],
// // // // //   'rem-to-px': ['Root Size (remSize)'],
// // // // //   'rem-to-em': ['Root Size (remSize)', 'Parent Size (emSize)'],
// // // // //   'rem-to-%': ['Root Size (remSize)', 'Base Size for %'],
// // // // //   'rem-to-vw': ['Root Size (remSize)', 'Viewport Width'],
// // // // //   'rem-to-vh': ['Root Size (remSize)', 'Viewport Height'],
// // // // //   'px-to-em': ['Parent Size (emSize)'],
// // // // //   'px-to-rem': ['Root Size (remSize)'],
// // // // //   'px-to-%': ['Base Size for %'],
// // // // //   'px-to-vw': ['Viewport Width'],
// // // // //   'px-to-vh': ['Viewport Height'],
// // // // //   'pt-to-em': ['Parent Size (emSize)'],
// // // // //   'pt-to-rem': ['Root Size (remSize)'],
// // // // //   'pt-to-%': ['Base Size for %'],
// // // // //   'pt-to-vw': ['Viewport Width'],
// // // // //   'pt-to-vh': ['Viewport Height'],
// // // // //   'in-to-em': ['Parent Size (emSize)'],
// // // // //   'in-to-rem': ['Root Size (remSize)'],
// // // // //   'in-to-%': ['Base Size for %'],
// // // // //   'in-to-vw': ['Viewport Width'],
// // // // //   'in-to-vh': ['Viewport Height'],
// // // // //   'cm-to-em': ['Parent Size (emSize)'],
// // // // //   'cm-to-rem': ['Root Size (remSize)'],
// // // // //   'cm-to-%': ['Base Size for %'],
// // // // //   'cm-to-vw': ['Viewport Width'],
// // // // //   'cm-to-vh': ['Viewport Height'],
// // // // //   'mm-to-em': ['Parent Size (emSize)'],
// // // // //   'mm-to-rem': ['Root Size (remSize)'],
// // // // //   'mm-to-%': ['Base Size for %'],
// // // // //   'mm-to-vw': ['Viewport Width'],
// // // // //   'mm-to-vh': ['Viewport Height'],
// // // // //   '%-to-px': ['Base Size for %'],
// // // // //   '%-to-em': ['Base Size for %', 'Parent Size (emSize)'],
// // // // //   '%-to-rem': ['Base Size for %', 'Root Size (remSize)'],
// // // // //   '%-to-pt': ['Base Size for %'],
// // // // //   '%-to-in': ['Base Size for %'],
// // // // //   '%-to-cm': ['Base Size for %'],
// // // // //   '%-to-mm': ['Base Size for %'],
// // // // //   '%-to-vw': ['Base Size for %', 'Viewport Width'],
// // // // //   '%-to-vh': ['Base Size for %', 'Viewport Height'],
// // // // //   'vw-to-px': ['Viewport Width'],
// // // // //   'vw-to-em': ['Viewport Width', 'Parent Size (emSize)'],
// // // // //   'vw-to-rem': ['Viewport Width', 'Root Size (remSize)'],
// // // // //   'vw-to-pt': ['Viewport Width'],
// // // // //   'vw-to-in': ['Viewport Width'],
// // // // //   'vw-to-cm': ['Viewport Width'],
// // // // //   'vw-to-mm': ['Viewport Width'],
// // // // //   'vw-to-%': ['Viewport Width', 'Base Size for %'],
// // // // //   'vw-to-vh': ['Viewport Width', 'Viewport Height'],
// // // // //   'vh-to-px': ['Viewport Height'],
// // // // //   'vh-to-em': ['Viewport Height', 'Parent Size (emSize)'],
// // // // //   'vh-to-rem': ['Viewport Height', 'Root Size (remSize)'],
// // // // //   'vh-to-pt': ['Viewport Height'],
// // // // //   'vh-to-in': ['Viewport Height'],
// // // // //   'vh-to-cm': ['Viewport Height'],
// // // // //   'vh-to-mm': ['Viewport Height'],
// // // // //   'vh-to-%': ['Viewport Height', 'Base Size for %'],
// // // // //   'vh-to-vw': ['Viewport Height', 'Viewport Width'],
// // // // // };

// // // // // function reducer(state, action) {
// // // // //   switch (action.type) {
// // // // //     case 'SET_INPUT_VALUE':
// // // // //       return { ...state, inputValue: action.payload };
// // // // //     case 'SET_FROM_UNIT':
// // // // //       return { ...state, fromUnit: action.payload };
// // // // //     case 'SET_TO_UNIT':
// // // // //       return { ...state, toUnit: action.payload };
// // // // //     case 'SET_RESULT':
// // // // //       return { ...state, result: action.payload };
// // // // //     case 'SET_ADDITIONAL_FIELDS':
// // // // //       return { ...state, additionalFields: action.payload };
// // // // //     case 'UPDATE_ADDITIONAL_FIELD':
// // // // //       return { 
// // // // //         ...state, 
// // // // //         additionalFields: {
// // // // //           ...state.additionalFields, 
// // // // //           [action.payload.field]: action.payload.value
// // // // //         }
// // // // //       };
// // // // //     case 'RESET':
// // // // //       return initialState;
// // // // //     default:
// // // // //       return state;
// // // // //   }
// // // // // }

// // // // // const CssUnitsConverter = () => {
// // // // //   const [state, dispatch] = useReducer(reducer, initialState);
// // // // //   const [copyButtonText, setCopyButtonText] = useState('Copy Result');

// // // // //   const getRequiredFields = (from, to) => {
// // // // //     return requiredFields[`${from}-to-${to}`] || [];
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     const newFields = getRequiredFields(state.fromUnit, state.toUnit);
// // // // //     dispatch({ 
// // // // //       type: 'SET_ADDITIONAL_FIELDS', 
// // // // //       payload: newFields.reduce((acc, field) => ({...acc, [field]: ''}), {})
// // // // //     });
// // // // //   }, [state.fromUnit, state.toUnit]);

// // // // //   const handleConvert = () => {
// // // // //     if (!state.inputValue || state.fromUnit === 'Select Unit' || state.toUnit === 'Select Unit') return;

// // // // //     const value = parseFloat(state.inputValue);
// // // // //     const { 
// // // // //       'Parent Size (emSize)': emSize, 
// // // // //       'Root Size (remSize)': remSize, 
// // // // //       'Base Size for %': baseSize,
// // // // //       'Viewport Width': viewportWidth,
// // // // //       'Viewport Height': viewportHeight
// // // // //     } = state.additionalFields;

// // // // //     let result;
// // // // //     const pxValue = convertToPx(value, state.fromUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);
// // // // //     result = convertFromPx(pxValue, state.toUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);

// // // // //     dispatch({ type: 'SET_RESULT', payload: `${result.toFixed(4)} ${state.toUnit}` });
// // // // //   };

// // // // //   const convertToPx = (value, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
// // // // //     switch (unit) {
// // // // //       case 'px': return value;
// // // // //       case 'em': return value * parseFloat(emSize);
// // // // //       case 'rem': return value * parseFloat(remSize);
// // // // //       case 'pt': return value * (96 / 72);
// // // // //       case 'in': return value * 96;
// // // // //       case 'cm': return value * (96 / 2.54);
// // // // //       case 'mm': return value * (96 / 25.4);
// // // // //       case '%': return (value / 100) * parseFloat(baseSize);
// // // // //       case 'vw': return (value / 100) * parseFloat(viewportWidth);
// // // // //       case 'vh': return (value / 100) * parseFloat(viewportHeight);
// // // // //       default: return value;
// // // // //     }
// // // // //   };

// // // // //   const convertFromPx = (px, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
// // // // //     switch (unit) {
// // // // //       case 'px': return px;
// // // // //       case 'em': return px / parseFloat(emSize);
// // // // //       case 'rem': return px / parseFloat(remSize);
// // // // //       case 'pt': return px * (72 / 96);
// // // // //       case 'in': return px / 96;
// // // // //       case 'cm': return px * (2.54 / 96);
// // // // //       case 'mm': return px * (25.4 / 96);
// // // // //       case '%': return (px / parseFloat(baseSize)) * 100;
// // // // //       case 'vw': return (px / parseFloat(viewportWidth)) * 100;
// // // // //       case 'vh': return (px / parseFloat(viewportHeight)) * 100;
// // // // //       default: return px;
// // // // //     }
// // // // //   };

// // // // //   const handleCopyResult = () => {
// // // // //     navigator.clipboard.writeText(state.result)
// // // // //       .then(() => {
// // // // //         setCopyButtonText('Copied!');
// // // // //         setTimeout(() => setCopyButtonText('Copy Result'), 5000);
// // // // //       })
// // // // //       .catch(err => console.error('Failed to copy: ', err));
// // // // //   };

// // // // //   return (
// // // // //     <div>
// // // // //       <h2>CSS Units Converter</h2>
// // // // //       <div>
// // // // //         <label htmlFor="inputValue">Value: </label>
// // // // //         <input
// // // // //           id="inputValue"
// // // // //           type="number"
// // // // //           value={state.inputValue}
// // // // //           onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value })}
// // // // //           placeholder="Enter value"
// // // // //         />
// // // // //       </div>
// // // // //       <div>
// // // // //         <label htmlFor="fromUnit">From: </label>
// // // // //         <select 
// // // // //           id="fromUnit"
// // // // //           value={state.fromUnit} 
// // // // //           onChange={(e) => dispatch({ type: 'SET_FROM_UNIT', payload: e.target.value })}>
// // // // //           {units.map(unit => (
// // // // //             <option key={unit} value={unit}>{unit}</option>
// // // // //           ))}
// // // // //         </select>
// // // // //       </div>
// // // // //       <div>
// // // // //         <label htmlFor="toUnit">To: </label>
// // // // //         <select 
// // // // //           id="toUnit"
// // // // //           value={state.toUnit} 
// // // // //           onChange={(e) => dispatch({ type: 'SET_TO_UNIT', payload: e.target.value })}>
// // // // //           {units.map(unit => (
// // // // //             <option key={unit} value={unit}>{unit}</option>
// // // // //           ))}
// // // // //         </select>
// // // // //       </div>
// // // // //       {getRequiredFields(state.fromUnit, state.toUnit).map(field => (
// // // // //         <div key={field}>
// // // // //           <label htmlFor={field}>{field}: </label>
// // // // //           <input
// // // // //             id={field}
// // // // //             type="number"
// // // // //             placeholder={field}
// // // // //             value={state.additionalFields[field] || ''}
// // // // //             onChange={(e) => dispatch({ 
// // // // //               type: 'UPDATE_ADDITIONAL_FIELD', 
// // // // //               payload: { field, value: e.target.value } 
// // // // //             })}
// // // // //           />
// // // // //         </div>
// // // // //       ))}
// // // // //       <button onClick={handleConvert}>Convert</button>
// // // // //       <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
// // // // //       <div>
// // // // //         <p>Result: {state.result}</p>
// // // // //         <button onClick={handleCopyResult}>{copyButtonText}</button>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CssUnitsConverter;
// // // // // 'use client'

// // // // // import React, { useReducer, useEffect, useState } from 'react';

// // // // // const initialState = {
// // // // //   inputValue: '',
// // // // //   fromUnit: 'Select Unit',
// // // // //   toUnit: 'Select Unit',
// // // // //   result: '',
// // // // //   additionalFields: {
// // // // //     'Parent Size (emSize)': '16',
// // // // //     'Root Size (remSize)': '16',
// // // // //     'Base Size for %': '100',
// // // // //     'Viewport Width': '1920',
// // // // //     'Viewport Height': '1080'
// // // // //   }
// // // // // };

// // // // // const units = ['Select Unit', 'px', 'em', 'rem', 'pt', 'pc', 'in', 'cm', 'mm', '%', 'vw', 'vh'];

// // // // // const requiredFields = {
// // // // //   'em-to-px': ['Parent Size (emSize)'],
// // // // //   'em-to-rem': ['Parent Size (emSize)', 'Root Size (remSize)'],
// // // // //   'em-to-%': ['Parent Size (emSize)', 'Base Size for %'],
// // // // //   'em-to-vw': ['Parent Size (emSize)', 'Viewport Width'],
// // // // //   'em-to-vh': ['Parent Size (emSize)', 'Viewport Height'],
// // // // //   'rem-to-px': ['Root Size (remSize)'],
// // // // //   'rem-to-em': ['Root Size (remSize)', 'Parent Size (emSize)'],
// // // // //   'rem-to-%': ['Root Size (remSize)', 'Base Size for %'],
// // // // //   'rem-to-vw': ['Root Size (remSize)', 'Viewport Width'],
// // // // //   'rem-to-vh': ['Root Size (remSize)', 'Viewport Height'],
// // // // //   'px-to-em': ['Parent Size (emSize)'],
// // // // //   'px-to-rem': ['Root Size (remSize)'],
// // // // //   'px-to-%': ['Base Size for %'],
// // // // //   'px-to-vw': ['Viewport Width'],
// // // // //   'px-to-vh': ['Viewport Height'],
// // // // //   'pt-to-em': ['Parent Size (emSize)'],
// // // // //   'pt-to-rem': ['Root Size (remSize)'],
// // // // //   'pt-to-%': ['Base Size for %'],
// // // // //   'pt-to-vw': ['Viewport Width'],
// // // // //   'pt-to-vh': ['Viewport Height'],
// // // // //   'pc-to-em': ['Parent Size (emSize)'],
// // // // //   'pc-to-rem': ['Root Size (remSize)'],
// // // // //   'pc-to-%': ['Base Size for %'],
// // // // //   'pc-to-vw': ['Viewport Width'],
// // // // //   'pc-to-vh': ['Viewport Height'],
// // // // //   'in-to-em': ['Parent Size (emSize)'],
// // // // //   'in-to-rem': ['Root Size (remSize)'],
// // // // //   'in-to-%': ['Base Size for %'],
// // // // //   'in-to-vw': ['Viewport Width'],
// // // // //   'in-to-vh': ['Viewport Height'],
// // // // //   'cm-to-em': ['Parent Size (emSize)'],
// // // // //   'cm-to-rem': ['Root Size (remSize)'],
// // // // //   'cm-to-%': ['Base Size for %'],
// // // // //   'cm-to-vw': ['Viewport Width'],
// // // // //   'cm-to-vh': ['Viewport Height'],
// // // // //   'mm-to-em': ['Parent Size (emSize)'],
// // // // //   'mm-to-rem': ['Root Size (remSize)'],
// // // // //   'mm-to-%': ['Base Size for %'],
// // // // //   'mm-to-vw': ['Viewport Width'],
// // // // //   'mm-to-vh': ['Viewport Height'],
// // // // //   '%-to-px': ['Base Size for %'],
// // // // //   '%-to-em': ['Base Size for %', 'Parent Size (emSize)'],
// // // // //   '%-to-rem': ['Base Size for %', 'Root Size (remSize)'],
// // // // //   '%-to-pt': ['Base Size for %'],
// // // // //   '%-to-pc': ['Base Size for %'],
// // // // //   '%-to-in': ['Base Size for %'],
// // // // //   '%-to-cm': ['Base Size for %'],
// // // // //   '%-to-mm': ['Base Size for %'],
// // // // //   '%-to-vw': ['Base Size for %', 'Viewport Width'],
// // // // //   '%-to-vh': ['Base Size for %', 'Viewport Height'],
// // // // //   'vw-to-px': ['Viewport Width'],
// // // // //   'vw-to-em': ['Viewport Width', 'Parent Size (emSize)'],
// // // // //   'vw-to-rem': ['Viewport Width', 'Root Size (remSize)'],
// // // // //   'vw-to-pt': ['Viewport Width'],
// // // // //   'vw-to-pc': ['Viewport Width'],
// // // // //   'vw-to-in': ['Viewport Width'],
// // // // //   'vw-to-cm': ['Viewport Width'],
// // // // //   'vw-to-mm': ['Viewport Width'],
// // // // //   'vw-to-%': ['Viewport Width', 'Base Size for %'],
// // // // //   'vw-to-vh': ['Viewport Width', 'Viewport Height'],
// // // // //   'vh-to-px': ['Viewport Height'],
// // // // //   'vh-to-em': ['Viewport Height', 'Parent Size (emSize)'],
// // // // //   'vh-to-rem': ['Viewport Height', 'Root Size (remSize)'],
// // // // //   'vh-to-pt': ['Viewport Height'],
// // // // //   'vh-to-pc': ['Viewport Height'],
// // // // //   'vh-to-in': ['Viewport Height'],
// // // // //   'vh-to-cm': ['Viewport Height'],
// // // // //   'vh-to-mm': ['Viewport Height'],
// // // // //   'vh-to-%': ['Viewport Height', 'Base Size for %'],
// // // // //   'vh-to-vw': ['Viewport Height', 'Viewport Width'],
// // // // // };

// // // // // function reducer(state, action) {
// // // // //   switch (action.type) {
// // // // //     case 'SET_INPUT_VALUE':
// // // // //       return { ...state, inputValue: action.payload };
// // // // //     case 'SET_FROM_UNIT':
// // // // //       return { ...state, fromUnit: action.payload };
// // // // //     case 'SET_TO_UNIT':
// // // // //       return { ...state, toUnit: action.payload };
// // // // //     case 'SET_RESULT':
// // // // //       return { ...state, result: action.payload };
// // // // //     case 'SET_ADDITIONAL_FIELDS':
// // // // //       return { ...state, additionalFields: { ...state.additionalFields, ...action.payload } };
// // // // //     case 'UPDATE_ADDITIONAL_FIELD':
// // // // //       return { 
// // // // //         ...state, 
// // // // //         additionalFields: {
// // // // //           ...state.additionalFields, 
// // // // //           [action.payload.field]: action.payload.value
// // // // //         }
// // // // //       };
// // // // //     case 'RESET':
// // // // //       return initialState;
// // // // //     default:
// // // // //       return state;
// // // // //   }
// // // // // }

// // // // // const CssUnitsConverter = () => {
// // // // //   const [state, dispatch] = useReducer(reducer, initialState);
// // // // //   const [copyButtonText, setCopyButtonText] = useState('Copy Result');

// // // // //   const getRequiredFields = (from, to) => {
// // // // //     return requiredFields[`${from}-to-${to}`] || [];
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     const newFields = getRequiredFields(state.fromUnit, state.toUnit);
// // // // //     dispatch({ 
// // // // //       type: 'SET_ADDITIONAL_FIELDS', 
// // // // //       payload: newFields.reduce((acc, field) => ({...acc, [field]: state.additionalFields[field] || ''}), {})
// // // // //     });
// // // // //   }, [state.fromUnit, state.toUnit]);

// // // // //   const handleConvert = () => {
// // // // //     if (!state.inputValue || state.fromUnit === 'Select Unit' || state.toUnit === 'Select Unit') return;

// // // // //     const value = parseFloat(state.inputValue);
// // // // //     const { 
// // // // //       'Parent Size (emSize)': emSize, 
// // // // //       'Root Size (remSize)': remSize, 
// // // // //       'Base Size for %': baseSize,
// // // // //       'Viewport Width': viewportWidth,
// // // // //       'Viewport Height': viewportHeight
// // // // //     } = state.additionalFields;

// // // // //     let result;
// // // // //     const pxValue = convertToPx(value, state.fromUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);
// // // // //     result = convertFromPx(pxValue, state.toUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);

// // // // //     dispatch({ type: 'SET_RESULT', payload: `${result.toFixed(4)} ${state.toUnit}` });
// // // // //   };

// // // // //   const convertToPx = (value, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
// // // // //     switch (unit) {
// // // // //       case 'px': return value;
// // // // //       case 'em': return value * parseFloat(emSize);
// // // // //       case 'rem': return value * parseFloat(remSize);
// // // // //       case 'pt': return value * (96 / 72);
// // // // //       case 'pc': return value * 16;
// // // // //       case 'in': return value * 96;
// // // // //       case 'cm': return value * (96 / 2.54);
// // // // //       case 'mm': return value * (96 / 25.4);
// // // // //       case '%': return (value / 100) * parseFloat(baseSize);
// // // // //       case 'vw': return (value / 100) * parseFloat(viewportWidth);
// // // // //       case 'vh': return (value / 100) * parseFloat(viewportHeight);
// // // // //       default: return value;
// // // // //     }
// // // // //   };

// // // // //   const convertFromPx = (px, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
// // // // //     switch (unit) {
// // // // //       case 'px': return px;
// // // // //       case 'em': return px / parseFloat(emSize);
// // // // //       case 'rem': return px / parseFloat(remSize);
// // // // //       case 'pt': return px * (72 / 96);
// // // // //       case 'pc': return px / 16;
// // // // //       case 'in': return px / 96;
// // // // //       case 'cm': return px * (2.54 / 96);
// // // // //       case 'mm': return px * (25.4 / 96);
// // // // //       case '%': return (px / parseFloat(baseSize)) * 100;
// // // // //       case 'vw': return (px / parseFloat(viewportWidth)) * 100;
// // // // //       case 'vh': return (px / parseFloat(viewportHeight)) * 100;
// // // // //       default: return px;
// // // // //     }
// // // // //   };

// // // // //   const handleCopyResult = () => {
// // // // //     navigator.clipboard.writeText(state.result)
// // // // //       .then(() => {
// // // // //         setCopyButtonText('Copied!');
// // // // //         setTimeout(() => setCopyButtonText('Copy Result'), 5000);
// // // // //       })
// // // // //       .catch(err => console.error('Failed to copy: ', err));
// // // // //   };

// // // // //   return (
// // // // //     <div>
// // // // //       <h2>CSS Units Converter</h2>
// // // // //       <div>
// // // // //         <label htmlFor="inputValue">Value: </label>
// // // // //         <input
// // // // //           id="inputValue"
// // // // //           type="number"
// // // // //           value={state.inputValue}
// // // // //           onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value })}
// // // // //           placeholder="Enter value"
// // // // //         />
// // // // //       </div>
// // // // //       <div>
// // // // //         <label htmlFor="fromUnit">From: </label>
// // // // //         <select 
// // // // //           id="fromUnit"
// // // // //           value={state.fromUnit} 
// // // // //           onChange={(e) => dispatch({ type: 'SET_FROM_UNIT', payload: e.target.value })}>
// // // // //           {units.map(unit => (
// // // // //             <option key={unit} value={unit}>{unit}</option>
// // // // //           ))}
// // // // //         </select>
// // // // //       </div>
// // // // //       <div>
// // // // //         <label htmlFor="toUnit">To: </label>
// // // // //         <select 
// // // // //           id="toUnit"
// // // // //           value={state.toUnit} 
// // // // //           onChange={(e) => dispatch({ type: 'SET_TO_UNIT', payload: e.target.value })}>
// // // // //           {units.map(unit => (
// // // // //             <option key={unit} value={unit}>{unit}</option>
// // // // //           ))}
// // // // //         </select>
// // // // //       </div>
// // // // //       {getRequiredFields(state.fromUnit, state.toUnit).map(field => (
// // // // //         <div key={field}>
// // // // //           <label htmlFor={field}>{field}: </label>
// // // // //           <input
// // // // //             id={field}
// // // // //             type="number"
// // // // //             placeholder={field}
// // // // //             value={state.additionalFields[field] || ''}
// // // // //             onChange={(e) => dispatch({ 
// // // // //               type: 'UPDATE_ADDITIONAL_FIELD', 
// // // // //               payload: { field, value: e.target.value } 
// // // // //             })}
// // // // //           />
// // // // //         </div>
// // // // //       ))}
// // // // //       <button onClick={handleConvert}>Convert</button>
// // // // //       <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
// // // // //       <div>
// // // // //         <p>Result: {state.result}</p>
// // // // //         <button onClick={handleCopyResult}>{copyButtonText}</button>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CssUnitsConverter;
// // // // 'use client'

// // // // import React, { useReducer, useEffect, useState } from 'react';

// // // // const initialState = {
// // // //   inputValue: '',
// // // //   fromUnit: 'Select Unit',
// // // //   toUnit: 'Select Unit',
// // // //   result: '',
// // // //   additionalFields: {
// // // //     'Parent Size (emSize)': '16',
// // // //     'Root Size (remSize)': '16',
// // // //     'Base Size for %': '100',
// // // //     'Viewport Width': '1920',
// // // //     'Viewport Height': '1080'
// // // //   }
// // // // };

// // // // const units = ['Select Unit', 'px', 'em', 'rem', 'pt', 'pc', 'in', 'cm', 'mm', '%', 'vw', 'vh'];

// // // // const requiredFields = {
// // // //   'em-to-px': ['Parent Size (emSize)'],
// // // //   'em-to-rem': ['Parent Size (emSize)', 'Root Size (remSize)'],
// // // //   'em-to-%': ['Parent Size (emSize)', 'Base Size for %'],
// // // //   'em-to-vw': ['Parent Size (emSize)', 'Viewport Width'],
// // // //   'em-to-vh': ['Parent Size (emSize)', 'Viewport Height'],
// // // //   'rem-to-px': ['Root Size (remSize)'],
// // // //   'rem-to-em': ['Root Size (remSize)', 'Parent Size (emSize)'],
// // // //   'rem-to-%': ['Root Size (remSize)', 'Base Size for %'],
// // // //   'rem-to-vw': ['Root Size (remSize)', 'Viewport Width'],
// // // //   'rem-to-vh': ['Root Size (remSize)', 'Viewport Height'],
// // // //   'px-to-em': ['Parent Size (emSize)'],
// // // //   'px-to-rem': ['Root Size (remSize)'],
// // // //   'px-to-%': ['Base Size for %'],
// // // //   'px-to-vw': ['Viewport Width'],
// // // //   'px-to-vh': ['Viewport Height'],
// // // //   'pt-to-em': ['Parent Size (emSize)'],
// // // //   'pt-to-rem': ['Root Size (remSize)'],
// // // //   'pt-to-%': ['Base Size for %'],
// // // //   'pt-to-vw': ['Viewport Width'],
// // // //   'pt-to-vh': ['Viewport Height'],
// // // //   'pc-to-em': ['Parent Size (emSize)'],
// // // //   'pc-to-rem': ['Root Size (remSize)'],
// // // //   'pc-to-%': ['Base Size for %'],
// // // //   'pc-to-vw': ['Viewport Width'],
// // // //   'pc-to-vh': ['Viewport Height'],
// // // //   'in-to-em': ['Parent Size (emSize)'],
// // // //   'in-to-rem': ['Root Size (remSize)'],
// // // //   'in-to-%': ['Base Size for %'],
// // // //   'in-to-vw': ['Viewport Width'],
// // // //   'in-to-vh': ['Viewport Height'],
// // // //   'cm-to-em': ['Parent Size (emSize)'],
// // // //   'cm-to-rem': ['Root Size (remSize)'],
// // // //   'cm-to-%': ['Base Size for %'],
// // // //   'cm-to-vw': ['Viewport Width'],
// // // //   'cm-to-vh': ['Viewport Height'],
// // // //   'mm-to-em': ['Parent Size (emSize)'],
// // // //   'mm-to-rem': ['Root Size (remSize)'],
// // // //   'mm-to-%': ['Base Size for %'],
// // // //   'mm-to-vw': ['Viewport Width'],
// // // //   'mm-to-vh': ['Viewport Height'],
// // // //   '%-to-px': ['Base Size for %'],
// // // //   '%-to-em': ['Base Size for %', 'Parent Size (emSize)'],
// // // //   '%-to-rem': ['Base Size for %', 'Root Size (remSize)'],
// // // //   '%-to-pt': ['Base Size for %'],
// // // //   '%-to-pc': ['Base Size for %'],
// // // //   '%-to-in': ['Base Size for %'],
// // // //   '%-to-cm': ['Base Size for %'],
// // // //   '%-to-mm': ['Base Size for %'],
// // // //   '%-to-vw': ['Base Size for %', 'Viewport Width'],
// // // //   '%-to-vh': ['Base Size for %', 'Viewport Height'],
// // // //   'vw-to-px': ['Viewport Width'],
// // // //   'vw-to-em': ['Viewport Width', 'Parent Size (emSize)'],
// // // //   'vw-to-rem': ['Viewport Width', 'Root Size (remSize)'],
// // // //   'vw-to-pt': ['Viewport Width'],
// // // //   'vw-to-pc': ['Viewport Width'],
// // // //   'vw-to-in': ['Viewport Width'],
// // // //   'vw-to-cm': ['Viewport Width'],
// // // //   'vw-to-mm': ['Viewport Width'],
// // // //   'vw-to-%': ['Viewport Width', 'Base Size for %'],
// // // //   'vw-to-vh': ['Viewport Width', 'Viewport Height'],
// // // //   'vh-to-px': ['Viewport Height'],
// // // //   'vh-to-em': ['Viewport Height', 'Parent Size (emSize)'],
// // // //   'vh-to-rem': ['Viewport Height', 'Root Size (remSize)'],
// // // //   'vh-to-pt': ['Viewport Height'],
// // // //   'vh-to-pc': ['Viewport Height'],
// // // //   'vh-to-in': ['Viewport Height'],
// // // //   'vh-to-cm': ['Viewport Height'],
// // // //   'vh-to-mm': ['Viewport Height'],
// // // //   'vh-to-%': ['Viewport Height', 'Base Size for %'],
// // // //   'vh-to-vw': ['Viewport Height', 'Viewport Width'],
// // // // };

// // // // function reducer(state, action) {
// // // //   switch (action.type) {
// // // //     case 'SET_INPUT_VALUE':
// // // //       return { ...state, inputValue: action.payload };
// // // //     case 'SET_FROM_UNIT':
// // // //       return { ...state, fromUnit: action.payload };
// // // //     case 'SET_TO_UNIT':
// // // //       return { ...state, toUnit: action.payload };
// // // //     case 'SET_RESULT':
// // // //       return { ...state, result: action.payload };
// // // //     case 'SET_ADDITIONAL_FIELDS':
// // // //       return { ...state, additionalFields: { ...state.additionalFields, ...action.payload } };
// // // //     case 'UPDATE_ADDITIONAL_FIELD':
// // // //       return { 
// // // //         ...state, 
// // // //         additionalFields: {
// // // //           ...state.additionalFields, 
// // // //           [action.payload.field]: action.payload.value
// // // //         }
// // // //       };
// // // //     case 'RESET':
// // // //       return initialState;
// // // //     default:
// // // //       return state;
// // // //   }
// // // // }

// // // // const CssUnitsConverter = () => {
// // // //   const [state, dispatch] = useReducer(reducer, initialState);
// // // //   const [copyButtonText, setCopyButtonText] = useState('Copy Result');

// // // //   const getRequiredFields = (from, to) => {
// // // //     return requiredFields[`${from}-to-${to}`] || [];
// // // //   };

// // // //   useEffect(() => {
// // // //     const newFields = getRequiredFields(state.fromUnit, state.toUnit);
// // // //     dispatch({ 
// // // //       type: 'SET_ADDITIONAL_FIELDS', 
// // // //       payload: newFields.reduce((acc, field) => ({
// // // //         ...acc, 
// // // //         [field]: state.additionalFields[field] || initialState.additionalFields[field] || ''
// // // //       }), {})
// // // //     });
// // // //   }, [state.fromUnit, state.toUnit]);

// // // //   const handleConvert = () => {
// // // //     if (!state.inputValue || state.fromUnit === 'Select Unit' || state.toUnit === 'Select Unit') return;

// // // //     const value = parseFloat(state.inputValue);
// // // //     const { 
// // // //       'Parent Size (emSize)': emSize, 
// // // //       'Root Size (remSize)': remSize, 
// // // //       'Base Size for %': baseSize,
// // // //       'Viewport Width': viewportWidth,
// // // //       'Viewport Height': viewportHeight
// // // //     } = state.additionalFields;

// // // //     let result;
// // // //     const pxValue = convertToPx(value, state.fromUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);
// // // //     result = convertFromPx(pxValue, state.toUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);

// // // //     dispatch({ type: 'SET_RESULT', payload: `${result.toFixed(4)} ${state.toUnit}` });
// // // //   };

// // // //   const convertToPx = (value, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
// // // //     switch (unit) {
// // // //       case 'px': return value;
// // // //       case 'em': return value * parseFloat(emSize);
// // // //       case 'rem': return value * parseFloat(remSize);
// // // //       case 'pt': return value * (96 / 72);
// // // //       case 'pc': return value * 16;
// // // //       case 'in': return value * 96;
// // // //       case 'cm': return value * (96 / 2.54);
// // // //       case 'mm': return value * (96 / 25.4);
// // // //       case '%': return (value / 100) * parseFloat(baseSize);
// // // //       case 'vw': return (value / 100) * parseFloat(viewportWidth);
// // // //       case 'vh': return (value / 100) * parseFloat(viewportHeight);
// // // //       default: return value;
// // // //     }
// // // //   };

// // // //   const convertFromPx = (px, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
// // // //     switch (unit) {
// // // //       case 'px': return px;
// // // //       case 'em': return px / parseFloat(emSize);
// // // //       case 'rem': return px / parseFloat(remSize);
// // // //       case 'pt': return px * (72 / 96);
// // // //       case 'pc': return px / 16;
// // // //       case 'in': return px / 96;
// // // //       case 'cm': return px * (2.54 / 96);
// // // //       case 'mm': return px * (25.4 / 96);
// // // //       case '%': return (px / parseFloat(baseSize)) * 100;
// // // //       case 'vw': return (px / parseFloat(viewportWidth)) * 100;
// // // //       case 'vh': return (px / parseFloat(viewportHeight)) * 100;
// // // //       default: return px;
// // // //     }
// // // //   };

// // // //   const handleCopyResult = () => {
// // // //     navigator.clipboard.writeText(state.result)
// // // //       .then(() => {
// // // //         setCopyButtonText('Copied!');
// // // //         setTimeout(() => setCopyButtonText('Copy Result'), 5000);
// // // //       })
// // // //       .catch(err => console.error('Failed to copy: ', err));
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <h2>CSS Units Converter</h2>
// // // //       <div>
// // // //         <label htmlFor="inputValue">Value: </label>
// // // //         <input
// // // //           id="inputValue"
// // // //           type="number"
// // // //           value={state.inputValue}
// // // //           onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value })}
// // // //           placeholder="Enter value"
// // // //         />
// // // //       </div>
// // // //       <div>
// // // //         <label htmlFor="fromUnit">From: </label>
// // // //         <select 
// // // //           id="fromUnit"
// // // //           value={state.fromUnit} 
// // // //           onChange={(e) => dispatch({ type: 'SET_FROM_UNIT', payload: e.target.value })}>
// // // //           {units.map(unit => (
// // // //             <option key={unit} value={unit}>{unit}</option>
// // // //           ))}
// // // //         </select>
// // // //       </div>
// // // //       <div>
// // // //         <label htmlFor="toUnit">To: </label>
// // // //         <select 
// // // //           id="toUnit"
// // // //           value={state.toUnit} 
// // // //           onChange={(e) => dispatch({ type: 'SET_TO_UNIT', payload: e.target.value })}>
// // // //           {units.map(unit => (
// // // //             <option key={unit} value={unit}>{unit}</option>
// // // //           ))}
// // // //         </select>
// // // //       </div>
// // // //       {getRequiredFields(state.fromUnit, state.toUnit).map(field => (
// // // //         <div key={field}>
// // // //           <label htmlFor={field}>{field}: </label>
// // // //           <input
// // // //             id={field}
// // // //             type="number"
// // // //             placeholder={field}
// // // //             value={state.additionalFields[field]}
// // // //             onChange={(e) => dispatch({ 
// // // //               type: 'UPDATE_ADDITIONAL_FIELD', 
// // // //               payload: { field, value: e.target.value } 
// // // //             })}
// // // //           />
// // // //         </div>
// // // //       ))}
// // // //       <button onClick={handleConvert}>Convert</button>
// // // //       <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
// // // //       <div>
// // // //         <p>Result: {state.result}</p>
// // // //         <button onClick={handleCopyResult}>{copyButtonText}</button>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default CssUnitsConverter;
// // // 'use client'

// // // import React, { useReducer, useEffect, useState } from 'react';
// // // import styles from './CssUnitsConverter.module.css';

// // // const initialState = {
// // //   inputValue: '',
// // //   fromUnit: 'Select Unit',
// // //   toUnit: 'Select Unit',
// // //   result: '',
// // //   additionalFields: {
// // //     'Parent Size (emSize)': '16',
// // //     'Root Size (remSize)': '16',
// // //     'Base Size for %': '100',
// // //     'Viewport Width': '1920',
// // //     'Viewport Height': '1080'
// // //   }
// // // };

// // // const units = ['Select Unit', 'px', 'em', 'rem', 'pt', 'pc', 'in', 'cm', 'mm', '%', 'vw', 'vh'];

// // // const requiredFields = {
// // //   'em-to-px': ['Parent Size (emSize)'],
// // //   'em-to-rem': ['Parent Size (emSize)', 'Root Size (remSize)'],
// // //   'em-to-%': ['Parent Size (emSize)', 'Base Size for %'],
// // //   'em-to-vw': ['Parent Size (emSize)', 'Viewport Width'],
// // //   'em-to-vh': ['Parent Size (emSize)', 'Viewport Height'],
// // //   'rem-to-px': ['Root Size (remSize)'],
// // //   'rem-to-em': ['Root Size (remSize)', 'Parent Size (emSize)'],
// // //   'rem-to-%': ['Root Size (remSize)', 'Base Size for %'],
// // //   'rem-to-vw': ['Root Size (remSize)', 'Viewport Width'],
// // //   'rem-to-vh': ['Root Size (remSize)', 'Viewport Height'],
// // //   'px-to-em': ['Parent Size (emSize)'],
// // //   'px-to-rem': ['Root Size (remSize)'],
// // //   'px-to-%': ['Base Size for %'],
// // //   'px-to-vw': ['Viewport Width'],
// // //   'px-to-vh': ['Viewport Height'],
// // //   'pt-to-em': ['Parent Size (emSize)'],
// // //   'pt-to-rem': ['Root Size (remSize)'],
// // //   'pt-to-%': ['Base Size for %'],
// // //   'pt-to-vw': ['Viewport Width'],
// // //   'pt-to-vh': ['Viewport Height'],
// // //   'pc-to-em': ['Parent Size (emSize)'],
// // //   'pc-to-rem': ['Root Size (remSize)'],
// // //   'pc-to-%': ['Base Size for %'],
// // //   'pc-to-vw': ['Viewport Width'],
// // //   'pc-to-vh': ['Viewport Height'],
// // //   'in-to-em': ['Parent Size (emSize)'],
// // //   'in-to-rem': ['Root Size (remSize)'],
// // //   'in-to-%': ['Base Size for %'],
// // //   'in-to-vw': ['Viewport Width'],
// // //   'in-to-vh': ['Viewport Height'],
// // //   'cm-to-em': ['Parent Size (emSize)'],
// // //   'cm-to-rem': ['Root Size (remSize)'],
// // //   'cm-to-%': ['Base Size for %'],
// // //   'cm-to-vw': ['Viewport Width'],
// // //   'cm-to-vh': ['Viewport Height'],
// // //   'mm-to-em': ['Parent Size (emSize)'],
// // //   'mm-to-rem': ['Root Size (remSize)'],
// // //   'mm-to-%': ['Base Size for %'],
// // //   'mm-to-vw': ['Viewport Width'],
// // //   'mm-to-vh': ['Viewport Height'],
// // //   '%-to-px': ['Base Size for %'],
// // //   '%-to-em': ['Base Size for %', 'Parent Size (emSize)'],
// // //   '%-to-rem': ['Base Size for %', 'Root Size (remSize)'],
// // //   '%-to-pt': ['Base Size for %'],
// // //   '%-to-pc': ['Base Size for %'],
// // //   '%-to-in': ['Base Size for %'],
// // //   '%-to-cm': ['Base Size for %'],
// // //   '%-to-mm': ['Base Size for %'],
// // //   '%-to-vw': ['Base Size for %', 'Viewport Width'],
// // //   '%-to-vh': ['Base Size for %', 'Viewport Height'],
// // //   'vw-to-px': ['Viewport Width'],
// // //   'vw-to-em': ['Viewport Width', 'Parent Size (emSize)'],
// // //   'vw-to-rem': ['Viewport Width', 'Root Size (remSize)'],
// // //   'vw-to-pt': ['Viewport Width'],
// // //   'vw-to-pc': ['Viewport Width'],
// // //   'vw-to-in': ['Viewport Width'],
// // //   'vw-to-cm': ['Viewport Width'],
// // //   'vw-to-mm': ['Viewport Width'],
// // //   'vw-to-%': ['Viewport Width', 'Base Size for %'],
// // //   'vw-to-vh': ['Viewport Width', 'Viewport Height'],
// // //   'vh-to-px': ['Viewport Height'],
// // //   'vh-to-em': ['Viewport Height', 'Parent Size (emSize)'],
// // //   'vh-to-rem': ['Viewport Height', 'Root Size (remSize)'],
// // //   'vh-to-pt': ['Viewport Height'],
// // //   'vh-to-pc': ['Viewport Height'],
// // //   'vh-to-in': ['Viewport Height'],
// // //   'vh-to-cm': ['Viewport Height'],
// // //   'vh-to-mm': ['Viewport Height'],
// // //   'vh-to-%': ['Viewport Height', 'Base Size for %'],
// // //   'vh-to-vw': ['Viewport Height', 'Viewport Width'],
// // // };

// // // const tooltips = {
// // //   'Parent Size (emSize)': "The font size of the parent element in pixels. Default is 16px, which is the standard browser default font size.",
// // //   'Root Size (remSize)': "The font size of the root element (html) in pixels. Default is 16px, which is the standard browser default font size.",
// // //   'Base Size for %': "The reference size for percentage calculations in pixels. Default is 100px for easier mental math.",
// // //   'Viewport Width': "The width of the viewport in pixels. Default is 1920px, a common screen width.",
// // //   'Viewport Height': "The height of the viewport in pixels. Default is 1080px, a common screen height."
// // // };

// // // function reducer(state, action) {
// // //   switch (action.type) {
// // //     case 'SET_INPUT_VALUE':
// // //       return { ...state, inputValue: action.payload };
// // //     case 'SET_FROM_UNIT':
// // //       return { ...state, fromUnit: action.payload };
// // //     case 'SET_TO_UNIT':
// // //       return { ...state, toUnit: action.payload };
// // //     case 'SET_RESULT':
// // //       return { ...state, result: action.payload };
// // //     case 'SET_ADDITIONAL_FIELDS':
// // //       return { ...state, additionalFields: { ...state.additionalFields, ...action.payload } };
// // //     case 'UPDATE_ADDITIONAL_FIELD':
// // //       return { 
// // //         ...state, 
// // //         additionalFields: {
// // //           ...state.additionalFields, 
// // //           [action.payload.field]: action.payload.value
// // //         }
// // //       };
// // //     case 'RESET':
// // //       return initialState;
// // //     default:
// // //       return state;
// // //   }
// // // }

// // // const CssUnitsConverter = () => {
// // //   const [state, dispatch] = useReducer(reducer, initialState);
// // //   const [copyButtonText, setCopyButtonText] = useState('Copy Result');

// // //   const getRequiredFields = (from, to) => {
// // //     return requiredFields[`${from}-to-${to}`] || [];
// // //   };

// // //   useEffect(() => {
// // //     const newFields = getRequiredFields(state.fromUnit, state.toUnit);
// // //     dispatch({ 
// // //       type: 'SET_ADDITIONAL_FIELDS', 
// // //       payload: newFields.reduce((acc, field) => ({
// // //         ...acc, 
// // //         [field]: state.additionalFields[field] || initialState.additionalFields[field] || ''
// // //       }), {})
// // //     });
// // //   }, [state.fromUnit, state.toUnit]);

// // //   const handleConvert = () => {
// // //     if (!state.inputValue || state.fromUnit === 'Select Unit' || state.toUnit === 'Select Unit') return;

// // //     const value = parseFloat(state.inputValue);
// // //     const { 
// // //       'Parent Size (emSize)': emSize, 
// // //       'Root Size (remSize)': remSize, 
// // //       'Base Size for %': baseSize,
// // //       'Viewport Width': viewportWidth,
// // //       'Viewport Height': viewportHeight
// // //     } = state.additionalFields;

// // //     let result;
// // //     const pxValue = convertToPx(value, state.fromUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);
// // //     result = convertFromPx(pxValue, state.toUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);

// // //     dispatch({ type: 'SET_RESULT', payload: `${result.toFixed(4)} ${state.toUnit}` });
// // //   };

// // //   const convertToPx = (value, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
// // //     switch (unit) {
// // //       case 'px': return value;
// // //       case 'em': return value * parseFloat(emSize);
// // //       case 'rem': return value * parseFloat(remSize);
// // //       case 'pt': return value * (96 / 72);
// // //       case 'pc': return value * 16;
// // //       case 'in': return value * 96;
// // //       case 'cm': return value * (96 / 2.54);
// // //       case 'mm': return value * (96 / 25.4);
// // //       case '%': return (value / 100) * parseFloat(baseSize);
// // //       case 'vw': return (value / 100) * parseFloat(viewportWidth);
// // //       case 'vh': return (value / 100) * parseFloat(viewportHeight);
// // //       default: return value;
// // //     }
// // //   };

// // //   const convertFromPx = (px, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
// // //     switch (unit) {
// // //       case 'px': return px;
// // //       case 'em': return px / parseFloat(emSize);
// // //       case 'rem': return px / parseFloat(remSize);
// // //       case 'pt': return px * (72 / 96);
// // //       case 'pc': return px / 16;
// // //       case 'in': return px / 96;
// // //       case 'cm': return px * (2.54 / 96);
// // //       case 'mm': return px * (25.4 / 96);
// // //       case '%': return (px / parseFloat(baseSize)) * 100;
// // //       case 'vw': return (px / parseFloat(viewportWidth)) * 100;
// // //       case 'vh': return (px / parseFloat(viewportHeight)) * 100;
// // //       default: return px;
// // //     }
// // //   };

// // //   const handleCopyResult = () => {
// // //     navigator.clipboard.writeText(state.result)
// // //       .then(() => {
// // //         setCopyButtonText('Copied!');
// // //         setTimeout(() => setCopyButtonText('Copy Result'), 5000);
// // //       })
// // //       .catch(err => console.error('Failed to copy: ', err));
// // //   };

// // //   return (
// // //     <div className={styles.container}>
// // //       <h2 className={styles.title}>CSS Units Converter</h2>
// // //       <div className={styles.inputGroup}>
// // //         <label className={styles.label} htmlFor="inputValue">Value: </label>
// // //         <input
// // //           id="inputValue"
// // //           type="number"
// // //           value={state.inputValue}
// // //           onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value })}
// // //           placeholder="Enter value"
// // //           className={styles.input}
// // //         />
// // //       </div>
// // //       <div className={styles.inputGroup}>
// // //         <label className={styles.label} htmlFor="fromUnit">From: </label>
// // //         <select 
// // //           id="fromUnit"
// // //           value={state.fromUnit} 
// // //           onChange={(e) => dispatch({ type: 'SET_FROM_UNIT', payload: e.target.value })}
// // //           className={styles.select}>
// // //           {units.map(unit => (
// // //             <option key={unit} value={unit}>{unit}</option>
// // //           ))}
// // //         </select>
// // //       </div>
// // //       <div className={styles.inputGroup}>
// // //         <label className={styles.label} htmlFor="toUnit">To: </label>
// // //         <select 
// // //           id="toUnit"
// // //           value={state.toUnit} 
// // //           onChange={(e) => dispatch({ type: 'SET_TO_UNIT', payload: e.target.value })}
// // //           className={styles.select}>
// // //           {units.map(unit => (
// // //             <option key={unit} value={unit}>{unit}</option>
// // //           ))}
// // //         </select>
// // //       </div>
// // //       {getRequiredFields(state.fromUnit, state.toUnit).map(field => (
// // //         <div key={field} className={styles.inputGroup}>
// // //           <label className={styles.label} htmlFor={field}>
// // //             <span className={styles.tooltip}>
// // //               {field}
// // //               <span className={styles.tooltipText}>{tooltips[field]}</span>
// // //             </span>
// // //           </label>
// // //           <input
// // //             id={field}
// // //             type="number"
// // //             placeholder={field}
// // //             value={state.additionalFields[field]}
// // //             onChange={(e) => dispatch({ 
// // //               type: 'UPDATE_ADDITIONAL_FIELD', 
// // //               payload: { field, value: e.target.value } 
// // //             })}
// // //             className={styles.input}
// // //           />
// // //         </div>
// // //       ))}
// // //       <button onClick={handleConvert} className={styles.button}>Convert</button>
// // //       <button onClick={() => dispatch({ type: 'RESET' })} className={styles.button}>Reset</button>
// // //       <div className={styles.result}>
// // //         <p>Result: {state.result}</p>
// // //         <button onClick={handleCopyResult} className={styles.button}>{copyButtonText}</button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default CssUnitsConverter;
// // 'use client'

// // import React, { useReducer, useEffect, useState } from 'react';
// // import styles from './CssUnitsConverter.module.css';

// // const initialState = {
// //   inputValue: '',
// //   fromUnit: 'Select Unit',
// //   toUnit: 'Select Unit',
// //   result: '',
// //   additionalFields: {
// //     'Parent Size (emSize)': '16',
// //     'Root Size (remSize)': '16',
// //     'Base Size for %': '100',
// //     'Viewport Width': '1920',
// //     'Viewport Height': '1080'
// //   }
// // };

// // const units = ['Select Unit', 'px', 'em', 'rem', 'pt', 'pc', 'in', 'cm', 'mm', '%', 'vw', 'vh'];

// // const requiredFields = {
// //   'em-to-px': ['Parent Size (emSize)'],
// //   'em-to-rem': ['Parent Size (emSize)', 'Root Size (remSize)'],
// //   'em-to-%': ['Parent Size (emSize)', 'Base Size for %'],
// //   'em-to-vw': ['Parent Size (emSize)', 'Viewport Width'],
// //   'em-to-vh': ['Parent Size (emSize)', 'Viewport Height'],
// //   'rem-to-px': ['Root Size (remSize)'],
// //   'rem-to-em': ['Root Size (remSize)', 'Parent Size (emSize)'],
// //   'rem-to-%': ['Root Size (remSize)', 'Base Size for %'],
// //   'rem-to-vw': ['Root Size (remSize)', 'Viewport Width'],
// //   'rem-to-vh': ['Root Size (remSize)', 'Viewport Height'],
// //   'px-to-em': ['Parent Size (emSize)'],
// //   'px-to-rem': ['Root Size (remSize)'],
// //   'px-to-%': ['Base Size for %'],
// //   'px-to-vw': ['Viewport Width'],
// //   'px-to-vh': ['Viewport Height'],
// //   'pt-to-em': ['Parent Size (emSize)'],
// //   'pt-to-rem': ['Root Size (remSize)'],
// //   'pt-to-%': ['Base Size for %'],
// //   'pt-to-vw': ['Viewport Width'],
// //   'pt-to-vh': ['Viewport Height'],
// //   'pc-to-em': ['Parent Size (emSize)'],
// //   'pc-to-rem': ['Root Size (remSize)'],
// //   'pc-to-%': ['Base Size for %'],
// //   'pc-to-vw': ['Viewport Width'],
// //   'pc-to-vh': ['Viewport Height'],
// //   'in-to-em': ['Parent Size (emSize)'],
// //   'in-to-rem': ['Root Size (remSize)'],
// //   'in-to-%': ['Base Size for %'],
// //   'in-to-vw': ['Viewport Width'],
// //   'in-to-vh': ['Viewport Height'],
// //   'cm-to-em': ['Parent Size (emSize)'],
// //   'cm-to-rem': ['Root Size (remSize)'],
// //   'cm-to-%': ['Base Size for %'],
// //   'cm-to-vw': ['Viewport Width'],
// //   'cm-to-vh': ['Viewport Height'],
// //   'mm-to-em': ['Parent Size (emSize)'],
// //   'mm-to-rem': ['Root Size (remSize)'],
// //   'mm-to-%': ['Base Size for %'],
// //   'mm-to-vw': ['Viewport Width'],
// //   'mm-to-vh': ['Viewport Height'],
// //   '%-to-px': ['Base Size for %'],
// //   '%-to-em': ['Base Size for %', 'Parent Size (emSize)'],
// //   '%-to-rem': ['Base Size for %', 'Root Size (remSize)'],
// //   '%-to-pt': ['Base Size for %'],
// //   '%-to-pc': ['Base Size for %'],
// //   '%-to-in': ['Base Size for %'],
// //   '%-to-cm': ['Base Size for %'],
// //   '%-to-mm': ['Base Size for %'],
// //   '%-to-vw': ['Base Size for %', 'Viewport Width'],
// //   '%-to-vh': ['Base Size for %', 'Viewport Height'],
// //   'vw-to-px': ['Viewport Width'],
// //   'vw-to-em': ['Viewport Width', 'Parent Size (emSize)'],
// //   'vw-to-rem': ['Viewport Width', 'Root Size (remSize)'],
// //   'vw-to-pt': ['Viewport Width'],
// //   'vw-to-pc': ['Viewport Width'],
// //   'vw-to-in': ['Viewport Width'],
// //   'vw-to-cm': ['Viewport Width'],
// //   'vw-to-mm': ['Viewport Width'],
// //   'vw-to-%': ['Viewport Width', 'Base Size for %'],
// //   'vw-to-vh': ['Viewport Width', 'Viewport Height'],
// //   'vh-to-px': ['Viewport Height'],
// //   'vh-to-em': ['Viewport Height', 'Parent Size (emSize)'],
// //   'vh-to-rem': ['Viewport Height', 'Root Size (remSize)'],
// //   'vh-to-pt': ['Viewport Height'],
// //   'vh-to-pc': ['Viewport Height'],
// //   'vh-to-in': ['Viewport Height'],
// //   'vh-to-cm': ['Viewport Height'],
// //   'vh-to-mm': ['Viewport Height'],
// //   'vh-to-%': ['Viewport Height', 'Base Size for %'],
// //   'vh-to-vw': ['Viewport Height', 'Viewport Width'],
// // };

// // const tooltips = {
// //   'Parent Size (emSize)': "The font size of the parent element in pixels. Default is 16px, which is the standard browser default font size.",
// //   'Root Size (remSize)': "The font size of the root element (html) in pixels. Default is 16px, which is the standard browser default font size.",
// //   'Base Size for %': "The reference size for percentage calculations in pixels. Default is 100px for easier mental math.",
// //   'Viewport Width': "The width of the viewport in pixels. Default is 1920px, a common screen width.",
// //   'Viewport Height': "The height of the viewport in pixels. Default is 1080px, a common screen height."
// // };

// // function reducer(state, action) {
// //   switch (action.type) {
// //     case 'SET_INPUT_VALUE':
// //       return { ...state, inputValue: action.payload };
// //     case 'SET_FROM_UNIT':
// //       return { ...state, fromUnit: action.payload };
// //     case 'SET_TO_UNIT':
// //       return { ...state, toUnit: action.payload };
// //     case 'SET_RESULT':
// //       return { ...state, result: action.payload };
// //     case 'SET_ADDITIONAL_FIELDS':
// //       return { ...state, additionalFields: { ...state.additionalFields, ...action.payload } };
// //     case 'UPDATE_ADDITIONAL_FIELD':
// //       return { 
// //         ...state, 
// //         additionalFields: {
// //           ...state.additionalFields, 
// //           [action.payload.field]: action.payload.value
// //         }
// //       };
// //     case 'RESET':
// //       return initialState;
// //     default:
// //       return state;
// //   }
// // }

// // const CssUnitsConverter = () => {
// //   const [state, dispatch] = useReducer(reducer, initialState);
// //   const [copyButtonText, setCopyButtonText] = useState('Copy Result');

// //   const getRequiredFields = (from, to) => {
// //     return requiredFields[`${from}-to-${to}`] || [];
// //   };

// //   useEffect(() => {
// //     const newFields = getRequiredFields(state.fromUnit, state.toUnit);
// //     dispatch({ 
// //       type: 'SET_ADDITIONAL_FIELDS', 
// //       payload: newFields.reduce((acc, field) => ({
// //         ...acc, 
// //         [field]: state.additionalFields[field] || initialState.additionalFields[field] || ''
// //       }), {})
// //     });
// //   }, [state.fromUnit, state.toUnit]);

// //   const handleConvert = () => {
// //     if (!state.inputValue || state.fromUnit === 'Select Unit' || state.toUnit === 'Select Unit') return;

// //     const value = parseFloat(state.inputValue);
// //     const { 
// //       'Parent Size (emSize)': emSize, 
// //       'Root Size (remSize)': remSize, 
// //       'Base Size for %': baseSize,
// //       'Viewport Width': viewportWidth,
// //       'Viewport Height': viewportHeight
// //     } = state.additionalFields;

// //     let result;
// //     const pxValue = convertToPx(value, state.fromUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);
// //     result = convertFromPx(pxValue, state.toUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);

// //     dispatch({ type: 'SET_RESULT', payload: `${result.toFixed(4)} ${state.toUnit}` });
// //   };

// //   const convertToPx = (value, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
// //     switch (unit) {
// //       case 'px': return value;
// //       case 'em': return value * parseFloat(emSize);
// //       case 'rem': return value * parseFloat(remSize);
// //       case 'pt': return value * (96 / 72);
// //       case 'pc': return value * 16;
// //       case 'in': return value * 96;
// //       case 'cm': return value * (96 / 2.54);
// //       case 'mm': return value * (96 / 25.4);
// //       case '%': return (value / 100) * parseFloat(baseSize);
// //       case 'vw': return (value / 100) * parseFloat(viewportWidth);
// //       case 'vh': return (value / 100) * parseFloat(viewportHeight);
// //       default: return value;
// //     }
// //   };

// //   const convertFromPx = (px, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
// //     switch (unit) {
// //       case 'px': return px;
// //       case 'em': return px / parseFloat(emSize);
// //       case 'rem': return px / parseFloat(remSize);
// //       case 'pt': return px * (72 / 96);
// //       case 'pc': return px / 16;
// //       case 'in': return px / 96;
// //       case 'cm': return px * (2.54 / 96);
// //       case 'mm': return px * (25.4 / 96);
// //       case '%': return (px / parseFloat(baseSize)) * 100;
// //       case 'vw': return (px / parseFloat(viewportWidth)) * 100;
// //       case 'vh': return (px / parseFloat(viewportHeight)) * 100;
// //       default: return px;
// //     }
// //   };

// //   const handleCopyResult = () => {
// //     navigator.clipboard.writeText(state.result)
// //       .then(() => {
// //         setCopyButtonText('Copied!');
// //         setTimeout(() => setCopyButtonText('Copy Result'), 5000);
// //       })
// //       .catch(err => console.error('Failed to copy: ', err));
// //   };

// //   return (
// //     <div className={styles.container}>
// //       <h2 className={styles.title}>CSS Units Converter</h2>
// //       <div className={styles.inputGroup}>
// //         <label className={styles.label} htmlFor="inputValue">Value: </label>
// //         <input
// //           id="inputValue"
// //           type="number"
// //           value={state.inputValue}
// //           onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value })}
// //           placeholder="Enter value"
// //           className={styles.inputWide}
// //         />
// //       </div>
// //       <div className={styles.unitGroup}>
// //         <div className={styles.unitSubGroup}>
// //           <label className={styles.label} htmlFor="fromUnit">From: </label>
// //           <select 
// //             id="fromUnit"
// //             value={state.fromUnit} 
// //             onChange={(e) => dispatch({ type: 'SET_FROM_UNIT', payload: e.target.value })}
// //             className={styles.select}>
// //             {units.map(unit => (
// //               <option key={unit} value={unit}>{unit}</option>
// //             ))}
// //           </select>
// //         </div>
// //         <div className={styles.unitSubGroup}>
// //           <label className={styles.label} htmlFor="toUnit">To: </label>
// //           <select 
// //             id="toUnit"
// //             value={state.toUnit} 
// //             onChange={(e) => dispatch({ type: 'SET_TO_UNIT', payload: e.target.value })}
// //             className={styles.select}>
// //             {units.map(unit => (
// //               <option key={unit} value={unit}>{unit}</option>
// //             ))}
// //           </select>
// //         </div>
// //       </div>
// //       <div className={styles.additionalFields}>
// //         {getRequiredFields(state.fromUnit, state.toUnit).map(field => (
// //           <div key={field} className={styles.inputGroup}>
// //             <label className={styles.label} htmlFor={field}>{field}</label>
// //             <input
// //               id={field}
// //               type="number"
// //               placeholder={field}
// //               value={state.additionalFields[field]}
// //               onChange={(e) => dispatch({ 
// //                 type: 'UPDATE_ADDITIONAL_FIELD', 
// //                 payload: { field, value: e.target.value } 
// //               })}
// //               className={styles.input}
// //             />
// //             <span className={styles.tooltip}>
// //               ?
// //               <span className={styles.tooltipText}>{tooltips[field]}</span>
// //             </span>
// //           </div>
// //         ))}
// //       </div>
// //       <div className={styles.buttonGroup}>
// //         <button onClick={handleConvert} className={styles.button}>Convert</button>
// //         <button onClick={() => dispatch({ type: 'RESET' })} className={styles.button}>Reset</button>
// //       </div>
// //       <div className={styles.result}>
// //         <p>Result: {state.result}</p>
// //         <button onClick={handleCopyResult} className={styles.button}>{copyButtonText}</button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CssUnitsConverter;
// 'use client'

// import React, { useReducer, useEffect, useState } from 'react';
// import styles from './CssUnitsConverter.module.css';

// const initialState = {
//   inputValue: '',
//   fromUnit: 'Select Unit',
//   toUnit: 'Select Unit',
//   result: '',
//   additionalFields: {
//     'Parent Size (emSize)': '16',
//     'Root Size (remSize)': '16',
//     'Base Size for %': '100',
//     'Viewport Width': '1920',
//     'Viewport Height': '1080'
//   }
// };

// const units = ['Select Unit', 'px', 'em', 'rem', 'pt', 'pc', 'in', 'cm', 'mm', '%', 'vw', 'vh'];

// const requiredFields = {
//   'em-to-px': ['Parent Size (emSize)'],
//   'em-to-rem': ['Parent Size (emSize)', 'Root Size (remSize)'],
//   'em-to-%': ['Parent Size (emSize)', 'Base Size for %'],
//   'em-to-vw': ['Parent Size (emSize)', 'Viewport Width'],
//   'em-to-vh': ['Parent Size (emSize)', 'Viewport Height'],
//   'rem-to-px': ['Root Size (remSize)'],
//   'rem-to-em': ['Root Size (remSize)', 'Parent Size (emSize)'],
//   'rem-to-%': ['Root Size (remSize)', 'Base Size for %'],
//   'rem-to-vw': ['Root Size (remSize)', 'Viewport Width'],
//   'rem-to-vh': ['Root Size (remSize)', 'Viewport Height'],
//   'px-to-em': ['Parent Size (emSize)'],
//   'px-to-rem': ['Root Size (remSize)'],
//   'px-to-%': ['Base Size for %'],
//   'px-to-vw': ['Viewport Width'],
//   'px-to-vh': ['Viewport Height'],
//   'pt-to-em': ['Parent Size (emSize)'],
//   'pt-to-rem': ['Root Size (remSize)'],
//   'pt-to-%': ['Base Size for %'],
//   'pt-to-vw': ['Viewport Width'],
//   'pt-to-vh': ['Viewport Height'],
//   'pc-to-em': ['Parent Size (emSize)'],
//   'pc-to-rem': ['Root Size (remSize)'],
//   'pc-to-%': ['Base Size for %'],
//   'pc-to-vw': ['Viewport Width'],
//   'pc-to-vh': ['Viewport Height'],
//   'in-to-em': ['Parent Size (emSize)'],
//   'in-to-rem': ['Root Size (remSize)'],
//   'in-to-%': ['Base Size for %'],
//   'in-to-vw': ['Viewport Width'],
//   'in-to-vh': ['Viewport Height'],
//   'cm-to-em': ['Parent Size (emSize)'],
//   'cm-to-rem': ['Root Size (remSize)'],
//   'cm-to-%': ['Base Size for %'],
//   'cm-to-vw': ['Viewport Width'],
//   'cm-to-vh': ['Viewport Height'],
//   'mm-to-em': ['Parent Size (emSize)'],
//   'mm-to-rem': ['Root Size (remSize)'],
//   'mm-to-%': ['Base Size for %'],
//   'mm-to-vw': ['Viewport Width'],
//   'mm-to-vh': ['Viewport Height'],
//   '%-to-px': ['Base Size for %'],
//   '%-to-em': ['Base Size for %', 'Parent Size (emSize)'],
//   '%-to-rem': ['Base Size for %', 'Root Size (remSize)'],
//   '%-to-pt': ['Base Size for %'],
//   '%-to-pc': ['Base Size for %'],
//   '%-to-in': ['Base Size for %'],
//   '%-to-cm': ['Base Size for %'],
//   '%-to-mm': ['Base Size for %'],
//   '%-to-vw': ['Base Size for %', 'Viewport Width'],
//   '%-to-vh': ['Base Size for %', 'Viewport Height'],
//   'vw-to-px': ['Viewport Width'],
//   'vw-to-em': ['Viewport Width', 'Parent Size (emSize)'],
//   'vw-to-rem': ['Viewport Width', 'Root Size (remSize)'],
//   'vw-to-pt': ['Viewport Width'],
//   'vw-to-pc': ['Viewport Width'],
//   'vw-to-in': ['Viewport Width'],
//   'vw-to-cm': ['Viewport Width'],
//   'vw-to-mm': ['Viewport Width'],
//   'vw-to-%': ['Viewport Width', 'Base Size for %'],
//   'vw-to-vh': ['Viewport Width', 'Viewport Height'],
//   'vh-to-px': ['Viewport Height'],
//   'vh-to-em': ['Viewport Height', 'Parent Size (emSize)'],
//   'vh-to-rem': ['Viewport Height', 'Root Size (remSize)'],
//   'vh-to-pt': ['Viewport Height'],
//   'vh-to-pc': ['Viewport Height'],
//   'vh-to-in': ['Viewport Height'],
//   'vh-to-cm': ['Viewport Height'],
//   'vh-to-mm': ['Viewport Height'],
//   'vh-to-%': ['Viewport Height', 'Base Size for %'],
//   'vh-to-vw': ['Viewport Height', 'Viewport Width'],
// };

// const tooltips = {
//   'Parent Size (emSize)': "The font size of the parent element in pixels. Default is 16px, which is the standard browser default font size.",
//   'Root Size (remSize)': "The font size of the root element (html) in pixels. Default is 16px, which is the standard browser default font size.",
//   'Base Size for %': "The reference size for percentage calculations in pixels. Default is 100px for easier mental math.",
//   'Viewport Width': "The width of the viewport in pixels. Default is 1920px, a common screen width.",
//   'Viewport Height': "The height of the viewport in pixels. Default is 1080px, a common screen height."
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case 'SET_INPUT_VALUE':
//       return { ...state, inputValue: action.payload };
//     case 'SET_FROM_UNIT':
//       return { ...state, fromUnit: action.payload };
//     case 'SET_TO_UNIT':
//       return { ...state, toUnit: action.payload };
//     case 'SET_RESULT':
//       return { ...state, result: action.payload };
//     case 'SET_ADDITIONAL_FIELDS':
//       return { ...state, additionalFields: { ...state.additionalFields, ...action.payload } };
//     case 'UPDATE_ADDITIONAL_FIELD':
//       return { 
//         ...state, 
//         additionalFields: {
//           ...state.additionalFields, 
//           [action.payload.field]: action.payload.value
//         }
//       };
//     case 'RESET':
//       return initialState;
//     default:
//       return state;
//   }
// }

// const CssUnitsConverter = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const [copyButtonText, setCopyButtonText] = useState('Copy Result');

//   const getRequiredFields = (from, to) => {
//     return requiredFields[`${from}-to-${to}`] || [];
//   };

//   useEffect(() => {
//     const newFields = getRequiredFields(state.fromUnit, state.toUnit);
//     dispatch({ 
//       type: 'SET_ADDITIONAL_FIELDS', 
//       payload: newFields.reduce((acc, field) => ({
//         ...acc, 
//         [field]: state.additionalFields[field] || initialState.additionalFields[field] || ''
//       }), {})
//     });
//   }, [state.fromUnit, state.toUnit]);

//   const handleConvert = () => {
//     if (!state.inputValue || state.fromUnit === 'Select Unit' || state.toUnit === 'Select Unit') return;

//     const value = parseFloat(state.inputValue);
//     const { 
//       'Parent Size (emSize)': emSize, 
//       'Root Size (remSize)': remSize, 
//       'Base Size for %': baseSize,
//       'Viewport Width': viewportWidth,
//       'Viewport Height': viewportHeight
//     } = state.additionalFields;

//     let result;
//     const pxValue = convertToPx(value, state.fromUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);
//     result = convertFromPx(pxValue, state.toUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);

//     dispatch({ type: 'SET_RESULT', payload: `${result.toFixed(4)} ${state.toUnit}` });
//   };

//   const convertToPx = (value, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
//     switch (unit) {
//       case 'px': return value;
//       case 'em': return value * parseFloat(emSize);
//       case 'rem': return value * parseFloat(remSize);
//       case 'pt': return value * (96 / 72);
//       case 'pc': return value * 16;
//       case 'in': return value * 96;
//       case 'cm': return value * (96 / 2.54);
//       case 'mm': return value * (96 / 25.4);
//       case '%': return (value / 100) * parseFloat(baseSize);
//       case 'vw': return (value / 100) * parseFloat(viewportWidth);
//       case 'vh': return (value / 100) * parseFloat(viewportHeight);
//       default: return value;
//     }
//   };

//   const convertFromPx = (px, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
//     switch (unit) {
//       case 'px': return px;
//       case 'em': return px / parseFloat(emSize);
//       case 'rem': return px / parseFloat(remSize);
//       case 'pt': return px * (72 / 96);
//       case 'pc': return px / 16;
//       case 'in': return px / 96;
//       case 'cm': return px * (2.54 / 96);
//       case 'mm': return px * (25.4 / 96);
//       case '%': return (px / parseFloat(baseSize)) * 100;
//       case 'vw': return (px / parseFloat(viewportWidth)) * 100;
//       case 'vh': return (px / parseFloat(viewportHeight)) * 100;
//       default: return px;
//     }
//   };

//   const handleCopyResult = () => {
//     navigator.clipboard.writeText(state.result)
//       .then(() => {
//         setCopyButtonText('Copied!');
//         setTimeout(() => setCopyButtonText('Copy Result'), 5000);
//       })
//       .catch(err => console.error('Failed to copy: ', err));
//   };

//   return (
//     <div className={styles.outerContainer}>
//     <div className={styles.container}>
//       {/* <h2 className={styles.title}>CSS Units Converter</h2> */}
//       <div className={styles.inputGroup}>
//         <label className={styles.label} htmlFor="inputValue">Value: </label>
//         <input
//           id="inputValue"
//           type="number"
//           value={state.inputValue}
//           onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value })}
//           placeholder="Enter value"
//           className={styles.inputWide}
//         />
//       </div>
//       <div className={styles.unitGroup}>
//         <div className={styles.unitSubGroup}>
//           <label className={styles.label} htmlFor="fromUnit">From: </label>
//           <select 
//             id="fromUnit"
//             value={state.fromUnit} 
//             onChange={(e) => dispatch({ type: 'SET_FROM_UNIT', payload: e.target.value })}
//             className={styles.select}>
//             {units.map(unit => (
//               <option key={unit} value={unit}>{unit}</option>
//             ))}
//           </select>
//         </div>
//         <div className={styles.unitSubGroup}>
//           <label className={styles.label} htmlFor="toUnit">To: </label>
//           <select 
//             id="toUnit"
//             value={state.toUnit} 
//             onChange={(e) => dispatch({ type: 'SET_TO_UNIT', payload: e.target.value })}
//             className={styles.select}>
//             {units.map(unit => (
//               <option key={unit} value={unit}>{unit}</option>
//             ))}
//           </select>
//         </div>
        
//       </div>
//       <br></br>
//       <div className={styles.additionalFields}>
//         {getRequiredFields(state.fromUnit, state.toUnit).map(field => (
//           <div key={field} className={styles.inputGroup}>
//             <label className={styles.label} htmlFor={field}>{field}</label>
//             <input
//               id={field}
//               type="number"
//               placeholder={field}
//               value={state.additionalFields[field]}
//               onChange={(e) => dispatch({ 
//                 type: 'UPDATE_ADDITIONAL_FIELD', 
//                 payload: { field, value: e.target.value } 
//               })}
//               className={styles.input}
//             />
//             <span className={styles.tooltip}>
//               ?
//               <span className={styles.tooltipText}>{tooltips[field]}</span>
//             </span>
//           </div>
//         ))}
//       </div>
//       <div className={styles.buttonGroup}>
//         <button onClick={handleConvert} className={styles.convertButton}>Convert</button>
//         <button onClick={() => dispatch({ type: 'RESET' })} className={styles.resetButton}>Reset</button>
//       </div>
//       <div className={styles.result}>
//         <p>Result: {state.result}</p>
//         <button onClick={handleCopyResult} className={styles.copyButton}>{copyButtonText}
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="black" className={styles.svg}><path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path></svg></button>
//       </div>
//     </div>
//     <div className={styles.rightSide}>Right Side </div>
//   </div>
//   );
// };

// export default CssUnitsConverter;
'use client'

import React, { useReducer, useEffect, useState } from 'react';
import styles from './CssUnitsConverter.module.css';
import UnitExplanations from './UnitExplanations';
import { initialState, units, requiredFields, tooltips } from './data';

function reducer(state, action) {
  switch (action.type) {
    case 'SET_INPUT_VALUE':
      return { ...state, inputValue: action.payload };
    case 'SET_FROM_UNIT':
      return { ...state, fromUnit: action.payload };
    case 'SET_TO_UNIT':
      return { ...state, toUnit: action.payload };
    case 'SET_RESULT':
      return { ...state, result: action.payload };
    case 'SET_ADDITIONAL_FIELDS':
      return { ...state, additionalFields: { ...state.additionalFields, ...action.payload } };
    case 'UPDATE_ADDITIONAL_FIELD':
      return { 
        ...state, 
        additionalFields: {
          ...state.additionalFields, 
          [action.payload.field]: action.payload.value
        }
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const CssUnitsConverter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [copyButtonText, setCopyButtonText] = useState('Copy Result');

  const getRequiredFields = (from, to) => {
    return requiredFields[`${from}-to-${to}`] || [];
  };

  useEffect(() => {
    const newFields = getRequiredFields(state.fromUnit, state.toUnit);
    dispatch({ 
      type: 'SET_ADDITIONAL_FIELDS', 
      payload: newFields.reduce((acc, field) => ({
        ...acc, 
        [field]: state.additionalFields[field] || initialState.additionalFields[field] || ''
      }), {})
    });
  }, [state.fromUnit, state.toUnit]);

  const handleConvert = () => {
    if (!state.inputValue || state.fromUnit === 'Select Unit' || state.toUnit === 'Select Unit') return;

    const value = parseFloat(state.inputValue);
    const { 
      'Parent Size (emSize)': emSize, 
      'Root Size (remSize)': remSize, 
      'Base Size for %': baseSize,
      'Viewport Width': viewportWidth,
      'Viewport Height': viewportHeight
    } = state.additionalFields;

    let result;
    const pxValue = convertToPx(value, state.fromUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);
    result = convertFromPx(pxValue, state.toUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);

    dispatch({ type: 'SET_RESULT', payload: `${result.toFixed(4)} ${state.toUnit}` });
  };

  const convertToPx = (value, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
    switch (unit) {
      case 'px': return value;
      case 'em': return value * parseFloat(emSize);
      case 'rem': return value * parseFloat(remSize);
      case 'pt': return value * (96 / 72);
      case 'pc': return value * 16;
      case 'in': return value * 96;
      case 'cm': return value * (96 / 2.54);
      case 'mm': return value * (96 / 25.4);
      case '%': return (value / 100) * parseFloat(baseSize);
      case 'vw': return (value / 100) * parseFloat(viewportWidth);
      case 'vh': return (value / 100) * parseFloat(viewportHeight);
      default: return value;
    }
  };

  const convertFromPx = (px, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
    switch (unit) {
      case 'px': return px;
      case 'em': return px / parseFloat(emSize);
      case 'rem': return px / parseFloat(remSize);
      case 'pt': return px * (72 / 96);
      case 'pc': return px / 16;
      case 'in': return px / 96;
      case 'cm': return px * (2.54 / 96);
      case 'mm': return px * (25.4 / 96);
      case '%': return (px / parseFloat(baseSize)) * 100;
      case 'vw': return (px / parseFloat(viewportWidth)) * 100;
      case 'vh': return (px / parseFloat(viewportHeight)) * 100;
      default: return px;
    }
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(state.result)
      .then(() => {
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy Result'), 5000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  // return (
  //   <div className={styles.outerContainer}>
  //     <div className={styles.container}>
  //       <div className={styles.inputGroup}>
  //         <label className={styles.label} htmlFor="inputValue">Value: </label>
  //         <input
  //           id="inputValue"
  //           type="number"
  //           value={state.inputValue}
  //           onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value })}
  //           placeholder="Enter value"
  //           className={styles.inputWide}
  //         />
  //       </div>
  //       <div className={styles.unitGroup}>
  //         <div className={styles.unitSubGroup}>
  //           <label className={styles.label} htmlFor="fromUnit">From: </label>
  //           <select 
  //             id="fromUnit"
  //             value={state.fromUnit} 
  //             onChange={(e) => dispatch({ type: 'SET_FROM_UNIT', payload: e.target.value })}
  //             className={styles.select}>
  //             {units.map(unit => (
  //               <option key={unit} value={unit}>{unit}</option>
  //             ))}
  //           </select>
  //         </div>
  //         <div className={styles.unitSubGroup}>
  //           <label className={styles.label} htmlFor="toUnit">To: </label>
  //           <select 
  //             id="toUnit"
  //             value={state.toUnit} 
  //             onChange={(e) => dispatch({ type: 'SET_TO_UNIT', payload: e.target.value })}
  //             className={styles.select}>
  //             {units.map(unit => (
  //               <option key={unit} value={unit}>{unit}</option>
  //             ))}
  //           </select>
  //         </div>
  //       </div>
  //       <br />
  //       <div className={styles.additionalFields}>
  //         {getRequiredFields(state.fromUnit, state.toUnit).map(field => (
  //           <div key={field} className={styles.inputGroup}>
  //             <label className={styles.label} htmlFor={field}>{field}</label>
  //             <input
  //               id={field}
  //               type="number"
  //               placeholder={field}
  //               value={state.additionalFields[field]}
  //               onChange={(e) => dispatch({ 
  //                 type: 'UPDATE_ADDITIONAL_FIELD', 
  //                 payload: { field, value: e.target.value } 
  //               })}
  //               className={styles.input}
  //             />
  //             <span className={styles.tooltip}>
  //               ?
  //               <span className={styles.tooltipText}>{tooltips[field]}</span>
  //             </span>
  //           </div>
  //         ))}
  //       </div>
  //       <div className={styles.buttonGroup}>
  //         <button onClick={handleConvert} className={styles.convertButton}>Convert</button>
  //         <button onClick={() => dispatch({ type: 'RESET' })} className={styles.resetButton}>Reset</button>
  //       </div>
  //       <div className={styles.result}>
  //         <p>Result: {state.result}</p>
  //         <button onClick={handleCopyResult} className={styles.copyButton}>
  //           {copyButtonText}
  //           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="black" className={styles.svg}>
  //             <path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"/>
  //           </svg>
  //         </button>
  //       </div>
  //     </div>
  //     <div className={styles.rightSide}>
  //       <UnitExplanations fromUnit={state.fromUnit} toUnit={state.toUnit} />
  //     </div>
  //   </div>
  // );

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="inputValue">Value: </label>
          <input
            id="inputValue"
            type="number"
            value={state.inputValue}
            onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value })}
            placeholder="Enter value"
            className={styles.inputWide}
          />
        </div>
        <div className={styles.unitGroup}>
          <div className={styles.unitSubGroup}>
            <label className={styles.label} htmlFor="fromUnit">From: </label>
            <select 
              id="fromUnit"
              value={state.fromUnit} 
              onChange={(e) => dispatch({ type: 'SET_FROM_UNIT', payload: e.target.value })}
              className={styles.select}
            >
              {units?.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
          <div className={styles.unitSubGroup}>
            <label className={styles.label} htmlFor="toUnit">To: </label>
            <select 
              id="toUnit"
              value={state.toUnit} 
              onChange={(e) => dispatch({ type: 'SET_TO_UNIT', payload: e.target.value })}
              className={styles.select}
            >
              {units?.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
        <br />
        <div className={styles.additionalFields}>
          {getRequiredFields(state.fromUnit, state.toUnit).map(field => (
            <div key={field} className={styles.inputGroup}>
              <label className={styles.label} htmlFor={field}>{field}</label>
              <input
                id={field}
                type="number"
                placeholder={field}
                value={state.additionalFields?.[field] || ''}
                onChange={(e) => dispatch({ 
                  type: 'UPDATE_ADDITIONAL_FIELD', 
                  payload: { field, value: e.target.value } 
                })}
                className={styles.input}
              />
              <span className={styles.tooltip}>
                ?
                <span className={styles.tooltipText}>{tooltips?.[field] || 'No tooltip available.'}</span>
              </span>
            </div>
          ))}
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handleConvert} className={styles.convertButton}>Convert</button>
          <button onClick={() => dispatch({ type: 'RESET' })} className={styles.resetButton}>Reset</button>
        </div>
        <div className={styles.result}>
          <p>Result: {state.result}</p>
          <button onClick={handleCopyResult} className={styles.copyButton}>
            {copyButtonText}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="black" className={styles.svg}>
              <path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className={styles.rightSide}>
        <UnitExplanations 
          fromUnit={state.fromUnit !== 'Select Unit' ? state.fromUnit : null} 
          toUnit={state.toUnit !== 'Select Unit' ? state.toUnit : null} 
        />
      </div>
    </div>
  );

};

export default CssUnitsConverter;