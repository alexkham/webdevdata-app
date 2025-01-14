// // // import React, { useState } from 'react';
// // // import styles from './JsonToJsConverter.module.css';

// // // export default function JsonToJsConverter() {
// // //   const [input, setInput] = useState('');
// // //   const [output, setOutput] = useState('');
// // //   const [error, setError] = useState('');

// // //   const handleInputChange = (e) => {
// // //     setInput(e.target.value);
// // //     try {
// // //       if (!e.target.value.trim()) {
// // //         setOutput('');
// // //         setError('');
// // //         return;
// // //       }
// // //       const parsed = JSON.parse(e.target.value);
// // //       setOutput(JSON.stringify(parsed, null, 2));
// // //       setError('');
// // //     } catch (err) {
// // //       setError(err.message);
// // //     }
// // //   };

// // //   const handleUpload = async (e) => {
// // //     const file = e.target.files?.[0];
// // //     if (file) {
// // //       const text = await file.text();
// // //       setInput(text);
// // //       try {
// // //         const parsed = JSON.parse(text);
// // //         setOutput(JSON.stringify(parsed, null, 2));
// // //         setError('');
// // //       } catch (err) {
// // //         setError(err.message);
// // //       }
// // //     }
// // //   };

// // //   const handleDownload = () => {
// // //     const blob = new Blob([output], { type: 'application/json' });
// // //     const url = URL.createObjectURL(blob);
// // //     const a = document.createElement('a');
// // //     a.href = url;
// // //     a.download = 'converted.js';
// // //     document.body.appendChild(a);
// // //     a.click();
// // //     document.body.removeChild(a);
// // //     URL.revokeObjectURL(url);
// // //   };

// // //   const handleCopy = () => {
// // //     navigator.clipboard.writeText(output);
// // //   };

// // //   return (
// // //     <div className={styles.container}>
// // //       <h1 className={styles.title}>JSON to JavaScript Object Converter</h1>
      
// // //       <div className={styles.grid}>
// // //         <div className={styles.inputGroup}>
// // //           <label className={styles.label}>Input (JSON) - Paste your JSON here</label>
// // //           <textarea
// // //             className={styles.textarea}
// // //             value={input}
// // //             onChange={handleInputChange}
// // //             placeholder="Paste your JSON here"
// // //           />
// // //         </div>
        
// // //         <div className={styles.inputGroup}>
// // //           <label className={styles.label}>Output (JavaScript Object)</label>
// // //           <textarea
// // //             className={`${styles.textarea} ${styles.output}`}
// // //             value={output}
// // //             readOnly
// // //             placeholder="Converted JavaScript object will appear here"
// // //           />
// // //         </div>
// // //       </div>

// // //       {error && (
// // //         <div className={styles.error}>{error}</div>
// // //       )}

// // //       <div className={styles.buttonGroup}>
// // //         <label className={styles.button}>
// // //           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// // //             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
// // //             <polyline points="17 8 12 3 7 8" />
// // //             <line x1="12" y1="3" x2="12" y2="15" />
// // //           </svg>
// // //           Upload
// // //           <input type="file" hidden onChange={handleUpload} accept=".json" />
// // //         </label>
        
// // //         <button
// // //           onClick={handleDownload}
// // //           disabled={!output}
// // //           className={styles.button}
// // //         >
// // //           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// // //             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
// // //             <polyline points="7 10 12 15 17 10" />
// // //             <line x1="12" y1="15" x2="12" y2="3" />
// // //           </svg>
// // //           Download
// // //         </button>
        
// // //         <button
// // //           onClick={handleCopy}
// // //           disabled={!output}
// // //           className={styles.button}
// // //         >
// // //           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// // //             <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
// // //             <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
// // //           </svg>
// // //           Copy to Clipboard
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import { useState } from 'react'
// // import s from './JsonToJsConverter.module.css'

// // export default function JsonToJsConverter() {
// //   const [input, setInput] = useState('')
// //   const [output, setOutput] = useState('')
// //   const [error, setError] = useState('')
// //   const [stripQuotes, setStripQuotes] = useState(false)

// //   const convert = (text) => {
// //     if (!text.trim()) {
// //       setError('')
// //       return ''
// //     }

// //     try {
// //       const parsed = JSON.parse(text)
// //       const formatted = JSON.stringify(parsed, null, 2)
// //       setError('')
// //       return stripQuotes ? formatted.replace(/"([^"]+)":/g, '$1:') : formatted
// //     } catch (err) {
// //       setError(err.message)
// //       return ''
// //     }
// //   }

// //   const handleInput = (e) => {
// //     const text = e.target.value
// //     setInput(text)
// //     setOutput(convert(text))
// //   }

// //   const handleUpload = async (e) => {
// //     try {
// //       const file = e.target.files?.[0]
// //       if (!file) return
      
// //       const text = await file.text()
// //       setInput(text)
// //       setOutput(convert(text))
// //     } catch (err) {
// //       setError('Failed to read file')
// //     }
// //   }

// //   return (
// //     <div className={s.container}>
// //       <div className={s.grid}>
// //         <textarea 
// //           value={input}
// //           onChange={handleInput}
// //           placeholder="Paste JSON here"
// //           className={s.area}
// //         />
// //         <textarea
// //           value={output}
// //           readOnly
// //           placeholder="JS object will appear here" 
// //           className={s.area}
// //         />
// //       </div>

// //       {error && <div className={s.error}>{error}</div>}

// //       <div className={s.controls}>
// //         <label>
// //           <input
// //             type="checkbox"
// //             checked={stripQuotes}
// //             onChange={(e) => setStripQuotes(e.target.checked)}
// //           />
// //           Remove quotes from keys
// //         </label>

// //         <label className={s.upload}>
// //           Upload JSON
// //           <input 
// //             type="file"
// //             onChange={handleUpload}
// //             accept=".json"
// //             hidden 
// //           />
// //         </label>
// //       </div>
// //     </div>
// //   )
// // }

// // JsonToJsConverter.js
// import { useState } from 'react'
// import s from './JsonToJsConverter.module.css'

// export default function JsonToJsConverter() {
//  const [input, setInput] = useState('')
//  const [output, setOutput] = useState('')
//  const [error, setError] = useState('')
//  const [stripQuotes, setStripQuotes] = useState(false)

//  const convert = (text) => {
//    if (!text.trim()) {
//      setError('')
//      return ''
//    }

//    try {
//      const parsed = JSON.parse(text)
//      const formatted = JSON.stringify(parsed, null, 2)
//      setError('')
//      return stripQuotes ? formatted.replace(/"([^"]+)":/g, '$1:') : formatted
//    } catch (err) {
//      setError(err.message)
//      return ''
//    }
//  }

//  const handleInput = (e) => {
//    const text = e.target.value
//    setInput(text)
//    setOutput(convert(text))
//  }

//  const handleUpload = async (e) => {
//    try {
//      const file = e.target.files?.[0]
//      if (!file) return
     
//      const text = await file.text()
//      setInput(text)
//      setOutput(convert(text))
//    } catch (err) {
//      setError('Failed to read file')
//    }
//  }

//  const handleReset = () => {
//    setInput('')
//    setOutput('')
//    setError('')
//    setStripQuotes(false)
//  }

//  const handleCopy = () => {
//    navigator.clipboard.writeText(output)
//  }

//  const handleDownload = () => {
//    const blob = new Blob([output], { type: 'text/plain' })
//    const url = URL.createObjectURL(blob)
//    const a = document.createElement('a')
//    a.href = url
//    a.download = 'converted.js'
//    document.body.appendChild(a)
//    a.click()
//    document.body.removeChild(a)
//    URL.revokeObjectURL(url)
//  }

//  return (
//    <div className={s.container}>
//      <div className={s.grid}>
//        <div>
//          <textarea
//            value={input}
//            onChange={handleInput}
//            placeholder="Paste JSON here"
//            className={s.area}
//          />
//          <div className={s.controls}>
//            <label>
//              <input
//                type="checkbox"
//                checked={stripQuotes}
//                onChange={(e) => setStripQuotes(e.target.checked)}
//              />
//              Remove quotes from keys
//            </label>
//            <button onClick={handleReset} className={s.upload}>Reset</button>
//            <label className={s.upload}>
//              Upload JSON
//              <input
//                type="file"
//                onChange={handleUpload}
//                accept=".json"
//                hidden
//              />
//            </label>
//          </div>
//        </div>
//        <div>
//          <textarea
//            value={output}
//            readOnly
//            placeholder="JS object will appear here"
//            className={s.area}
//          />
//          <div className={s.controls}>
//            <button onClick={handleCopy} className={s.upload}>Copy</button>
//            <button onClick={handleDownload} className={s.upload}>Download</button>
//          </div>
//        </div>
//      </div>

//      {error && <div className={s.error}>{error}</div>}
//    </div>
//  )
// }


// JsonToJsConverter.js 
import { useState } from 'react'
import s from './JsonToJsConverter.module.css'

export default function JsonToJsConverter() {
 const [input, setInput] = useState('')
 const [output, setOutput] = useState('')
 const [error, setError] = useState('')
 const [stripQuotes, setStripQuotes] = useState(false)

 const convert = (text) => {
   if (!text.trim()) {
     setError('')
     return ''
   }

   try {
     const parsed = JSON.parse(text)
     const formatted = JSON.stringify(parsed, null, 2)
     setError('')
     return stripQuotes ? formatted.replace(/"([^"]+)":/g, '$1:') : formatted
   } catch (err) {
     setError(err.message)
     return ''
   }
 }

 const handleInput = (e) => {
   const text = e.target.value
   setInput(text)
   setOutput(convert(text))
 }

 const handleUpload = async (e) => {
   try {
     const file = e.target.files?.[0]
     if (!file) return
     
     const text = await file.text()
     setInput(text)
     setOutput(convert(text))
   } catch (err) {
     setError('Failed to read file')
   }
 }

 const handleReset = () => {
   setInput('')
   setOutput('')
   setError('')
   setStripQuotes(false)
 }

 const handleCopy = () => {
   navigator.clipboard.writeText(output)
 }

 const handleDownload = () => {
   const blob = new Blob([output], { type: 'text/plain' })
   const url = URL.createObjectURL(blob)
   const a = document.createElement('a')
   a.href = url
   a.download = 'converted.js'
   document.body.appendChild(a)
   a.click()
   document.body.removeChild(a)
   URL.revokeObjectURL(url)
 }

 return (
   <div className={s.container}>
     <div className={s.grid}>
       <div>
         <textarea
           value={input}
           onChange={handleInput}
           placeholder="Paste JSON here"
           className={s.area}
         />
         <div className={s.controls}>
           <label>
             <input
               type="checkbox"
               checked={stripQuotes}
               onChange={(e) => setStripQuotes(e.target.checked)}
             />
             Remove quotes from keys
           </label>
           <div className={s.buttonGroup}>
             <button onClick={handleReset} className={s.upload}>Reset</button>
             <label className={s.uploadLabel}>
               Upload JSON
               <input
                 type="file"
                 onChange={handleUpload}
                 accept=".json"
                 hidden
               />
             </label>
           </div>
         </div>
       </div>
       <div>
         <textarea
           value={output}
           readOnly
           placeholder="JS object will appear here"
           className={s.area}
         />
         <div className={s.controls}>
           <div className={s.buttonGroup}>
             <button onClick={handleCopy} className={s.upload}>Copy</button>
             <button onClick={handleDownload} className={s.upload}>Download</button>
           </div>
         </div>
       </div>
     </div>

     {error && <div className={s.error}>{error}</div>}
   </div>
 )
}