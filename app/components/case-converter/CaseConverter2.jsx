// // // // // // // // 'use client'

// // // // // // // // import { useState } from 'react'
// // // // // // // // import styles from './CaseConverter.module.css'

// // // // // // // // const CaseConverter2 = () => {
// // // // // // // //   const [text, setText] = useState('')
// // // // // // // //   const [buttonText, setButtonText] = useState('Copy')
// // // // // // // //   const [error, setError] = useState('')

// // // // // // // //   const handleInput = (e) => {
// // // // // // // //     setText(e.target.value)
// // // // // // // //     setError('')
// // // // // // // //   }

// // // // // // // //   const convertCase = (type) => {
// // // // // // // //     if (!text.trim()) {
// // // // // // // //       setError('Please enter some text to convert.')
// // // // // // // //       return
// // // // // // // //     }
// // // // // // // //     let result = ''
// // // // // // // //     switch(type) {
// // // // // // // //       case 'upper':
// // // // // // // //         result = text.toUpperCase()
// // // // // // // //         break
// // // // // // // //       case 'lower':
// // // // // // // //         result = text.toLowerCase()
// // // // // // // //         break
// // // // // // // //       case 'capitalize':
// // // // // // // //         result = text.replace(/\b\w/g, letter => letter.toUpperCase())
// // // // // // // //         break
// // // // // // // //       case 'title':
// // // // // // // //         const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i
// // // // // // // //         result = text.toLowerCase().split(' ').map((word, index, array) => {
// // // // // // // //           if (index === 0 || index === array.length - 1 || !smallWords.test(word)) {
// // // // // // // //             return word.charAt(0).toUpperCase() + word.substr(1)
// // // // // // // //           }
// // // // // // // //           return word
// // // // // // // //         }).join(' ')
// // // // // // // //         break
// // // // // // // //       case 'sentence':
// // // // // // // //         result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
// // // // // // // //         break
// // // // // // // //       case 'alternating':
// // // // // // // //         result = text.split('').map((char, index) => 
// // // // // // // //           index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
// // // // // // // //         ).join('')
// // // // // // // //         break
// // // // // // // //       case 'inverse':
// // // // // // // //         result = text.split('').map(char => 
// // // // // // // //           char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
// // // // // // // //         ).join('')
// // // // // // // //         break
// // // // // // // //       case 'snake':
// // // // // // // //         result = text.toLowerCase().replace(/\s+/g, '_')
// // // // // // // //         break
// // // // // // // //       case 'kebab':
// // // // // // // //         result = text.toLowerCase().replace(/\s+/g, '-')
// // // // // // // //         break
// // // // // // // //       case 'camel':
// // // // // // // //         result = text.toLowerCase()
// // // // // // // //           .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase())
// // // // // // // //         break
// // // // // // // //       case 'pascal':
// // // // // // // //         result = text.toLowerCase()
// // // // // // // //           .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (match, sep, char) => char.toUpperCase())
// // // // // // // //         break
// // // // // // // //       default:
// // // // // // // //         result = text
// // // // // // // //     }
// // // // // // // //     setText(result)
// // // // // // // //     setError('')
// // // // // // // //   }

// // // // // // // //   const handleReset = () => {
// // // // // // // //     setText('')
// // // // // // // //     setError('')
// // // // // // // //     setButtonText('Copy')
// // // // // // // //   }

// // // // // // // //   const handleCopy = () => {
// // // // // // // //     if (!text) {
// // // // // // // //       setError('Nothing to copy.')
// // // // // // // //       return
// // // // // // // //     }
// // // // // // // //     navigator.clipboard.writeText(text)
// // // // // // // //       .then(() => {
// // // // // // // //         setButtonText('Copied!')
// // // // // // // //         setTimeout(() => setButtonText('Copy'), 2000)
// // // // // // // //       })
// // // // // // // //       .catch(err => {
// // // // // // // //         setError('Failed to copy text.')
// // // // // // // //         console.error('Failed to copy text:', err)
// // // // // // // //       })
// // // // // // // //   }

// // // // // // // //   return (
// // // // // // // //     <div className={styles.outerContainer}>
// // // // // // // //       <div className={styles.container}>
// // // // // // // //         <div className={styles.textAreaContainer}>
// // // // // // // //           <textarea 
// // // // // // // //             className={styles.textArea}
// // // // // // // //             value={text} 
// // // // // // // //             onChange={handleInput}
// // // // // // // //             placeholder="Enter text"
// // // // // // // //             rows="8"
// // // // // // // //           />
// // // // // // // //           <button className={`${styles.button} ${styles.copyButton}`} onClick={handleCopy}>{buttonText}</button>
// // // // // // // //         </div>
// // // // // // // //         <div className={styles.buttonGroup}>
// // // // // // // //           <button className={styles.button} onClick={() => convertCase('upper')}>Uppercase</button>
// // // // // // // //           <button className={styles.button} onClick={() => convertCase('lower')}>Lowercase</button>
// // // // // // // //           <button className={styles.button} onClick={() => convertCase('capitalize')}>Capitalize Words</button>
// // // // // // // //           <button className={styles.button} onClick={() => convertCase('title')}>Title Case</button>
// // // // // // // //           <button className={styles.button} onClick={() => convertCase('sentence')}>Sentence case</button>
// // // // // // // //           <button className={styles.button} onClick={() => convertCase('alternating')}>AlTeRnAtInG</button>
// // // // // // // //           <button className={styles.button} onClick={() => convertCase('inverse')}>InVeRsE</button>
// // // // // // // //           <button className={styles.button} onClick={() => convertCase('snake')}>snake_case</button>
// // // // // // // //           <button className={styles.button} onClick={() => convertCase('kebab')}>kebab-case</button>
// // // // // // // //           <button className={styles.button} onClick={() => convertCase('camel')}>camelCase</button>
// // // // // // // //           <button className={styles.button} onClick={() => convertCase('pascal')}>PascalCase</button>
// // // // // // // //           <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
// // // // // // // //         </div>
// // // // // // // //         {error && <p className={styles.errorMessage}>{error}</p>}
// // // // // // // //       </div>
// // // // // // // //     </div>
// // // // // // // //   )
// // // // // // // // }

// // // // // // // // export default CaseConverter2
// // // // // // // 'use client'

// // // // // // // import { useState } from 'react'
// // // // // // // import styles from './CaseConverter.module.css'

// // // // // // // const CaseConverter2 = () => {
// // // // // // //   const [text, setText] = useState('')
// // // // // // //   const [buttonText, setButtonText] = useState('Copy')
// // // // // // //   const [error, setError] = useState('')

// // // // // // //   const handleInput = (e) => {
// // // // // // //     setText(e.target.value)
// // // // // // //     setError('')
// // // // // // //   }

// // // // // // //   const convertCase = (type) => {
// // // // // // //     if (!text.trim()) {
// // // // // // //       setError('Please enter some text to convert.')
// // // // // // //       return
// // // // // // //     }
// // // // // // //     let result = ''
// // // // // // //     switch(type) {
// // // // // // //       case 'upper':
// // // // // // //         result = text.toUpperCase()
// // // // // // //         break
// // // // // // //       case 'lower':
// // // // // // //         result = text.toLowerCase()
// // // // // // //         break
// // // // // // //       case 'capitalize':
// // // // // // //         result = text.replace(/\b\w/g, letter => letter.toUpperCase())
// // // // // // //         break
// // // // // // //       case 'title':
// // // // // // //         const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i
// // // // // // //         result = text.toLowerCase().split(' ').map((word, index, array) => {
// // // // // // //           if (index === 0 || index === array.length - 1 || !smallWords.test(word)) {
// // // // // // //             return word.charAt(0).toUpperCase() + word.substr(1)
// // // // // // //           }
// // // // // // //           return word
// // // // // // //         }).join(' ')
// // // // // // //         break
// // // // // // //       case 'sentence':
// // // // // // //         result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
// // // // // // //         break
// // // // // // //       case 'alternating':
// // // // // // //         result = text.split('').map((char, index) => 
// // // // // // //           index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
// // // // // // //         ).join('')
// // // // // // //         break
// // // // // // //       case 'inverse':
// // // // // // //         result = text.split('').map(char => 
// // // // // // //           char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
// // // // // // //         ).join('')
// // // // // // //         break
// // // // // // //       case 'snake':
// // // // // // //         result = text.toLowerCase().replace(/\s+/g, '_')
// // // // // // //         break
// // // // // // //       case 'kebab':
// // // // // // //         result = text.toLowerCase().replace(/\s+/g, '-')
// // // // // // //         break
// // // // // // //       case 'camel':
// // // // // // //         result = text.toLowerCase()
// // // // // // //           .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase())
// // // // // // //         break
// // // // // // //       case 'pascal':
// // // // // // //         result = text.toLowerCase()
// // // // // // //           .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (match, sep, char) => char.toUpperCase())
// // // // // // //         break
// // // // // // //       default:
// // // // // // //         result = text
// // // // // // //     }
// // // // // // //     setText(result)
// // // // // // //     setError('')
// // // // // // //   }

// // // // // // //   const handleReset = () => {
// // // // // // //     setText('')
// // // // // // //     setError('')
// // // // // // //     setButtonText('Copy')
// // // // // // //   }

// // // // // // //   const handleCopy = () => {
// // // // // // //     if (!text) {
// // // // // // //       setError('Nothing to copy.')
// // // // // // //       return
// // // // // // //     }
// // // // // // //     navigator.clipboard.writeText(text)
// // // // // // //       .then(() => {
// // // // // // //         setButtonText('Copied!')
// // // // // // //         setTimeout(() => setButtonText('Copy'), 2000)
// // // // // // //       })
// // // // // // //       .catch(err => {
// // // // // // //         setError('Failed to copy text.')
// // // // // // //         console.error('Failed to copy text:', err)
// // // // // // //       })
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <div className={styles.outerContainer}>
// // // // // // //       <div className={styles.container}>
// // // // // // //         <div className={styles.textAreaContainer}>
// // // // // // //           <textarea 
// // // // // // //             className={styles.textArea}
// // // // // // //             value={text} 
// // // // // // //             onChange={handleInput}
// // // // // // //             placeholder="Enter text"
// // // // // // //             rows="8"
// // // // // // //           />
// // // // // // //           <button className={`${styles.button} ${styles.copyButton}`} onClick={handleCopy}>{buttonText}</button>
// // // // // // //         </div>
// // // // // // //         <div className={styles.buttonGroup}>
// // // // // // //           <button className={styles.button} onClick={() => convertCase('upper')}>Uppercase</button>
// // // // // // //           <button className={styles.button} onClick={() => convertCase('lower')}>Lowercase</button>
// // // // // // //           <button className={styles.button} onClick={() => convertCase('capitalize')}>Capitalize Words</button>
// // // // // // //           <button className={styles.button} onClick={() => convertCase('title')}>Title Case</button>
// // // // // // //           <button className={styles.button} onClick={() => convertCase('sentence')}>Sentence case</button>
// // // // // // //           <button className={styles.button} onClick={() => convertCase('alternating')}>AlTeRnAtInG</button>
// // // // // // //           <button className={styles.button} onClick={() => convertCase('inverse')}>InVeRsE</button>
// // // // // // //           <button className={styles.button} onClick={() => convertCase('snake')}>snake_case</button>
// // // // // // //           <button className={styles.button} onClick={() => convertCase('kebab')}>kebab-case</button>
// // // // // // //           <button className={styles.button} onClick={() => convertCase('camel')}>camelCase</button>
// // // // // // //           <button className={styles.button} onClick={() => convertCase('pascal')}>PascalCase</button>
// // // // // // //           <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
// // // // // // //         </div>
// // // // // // //         {error && <p className={styles.errorMessage}>{error}</p>}
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   )
// // // // // // // }

// // // // // // // export default CaseConverter2
// // // // // // 'use client'

// // // // // // import { useState } from 'react'
// // // // // // import styles from './CaseConverter.module.css'

// // // // // // const CaseConverter2 = () => {
// // // // // //   const [input, setInput] = useState('')
// // // // // //   const [output, setOutput] = useState('')
// // // // // //   const [buttonText, setButtonText] = useState('Copy')
// // // // // //   const [error, setError] = useState('')

// // // // // //   const handleInput = (e) => {
// // // // // //     setInput(e.target.value)
// // // // // //     setOutput(e.target.value)
// // // // // //     setError('')
// // // // // //   }

// // // // // //   const convertCase = (type) => {
// // // // // //     if (!input.trim()) {
// // // // // //       setError('Please enter some text to convert.')
// // // // // //       return
// // // // // //     }
// // // // // //     let result = ''
// // // // // //     switch(type) {
// // // // // //       case 'upper':
// // // // // //         result = input.toUpperCase()
// // // // // //         break
// // // // // //       case 'lower':
// // // // // //         result = input.toLowerCase()
// // // // // //         break
// // // // // //       case 'capitalize':
// // // // // //         result = input.replace(/\b\w/g, letter => letter.toUpperCase())
// // // // // //         break
// // // // // //       case 'title':
// // // // // //         const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i
// // // // // //         result = input.toLowerCase().split(' ').map((word, index, array) => {
// // // // // //           if (index === 0 || index === array.length - 1 || !smallWords.test(word)) {
// // // // // //             return word.charAt(0).toUpperCase() + word.substr(1)
// // // // // //           }
// // // // // //           return word
// // // // // //         }).join(' ')
// // // // // //         break
// // // // // //       case 'sentence':
// // // // // //         result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
// // // // // //         break
// // // // // //       case 'alternating':
// // // // // //         result = input.split('').map((char, index) => 
// // // // // //           index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
// // // // // //         ).join('')
// // // // // //         break
// // // // // //       case 'inverse':
// // // // // //         result = input.split('').map(char => 
// // // // // //           char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
// // // // // //         ).join('')
// // // // // //         break
// // // // // //       case 'snake':
// // // // // //         result = input.toLowerCase().replace(/\s+/g, '_')
// // // // // //         break
// // // // // //       case 'kebab':
// // // // // //         result = input.toLowerCase().replace(/\s+/g, '-')
// // // // // //         break
// // // // // //       case 'camel':
// // // // // //         result = input.toLowerCase()
// // // // // //           .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase())
// // // // // //         break
// // // // // //       case 'pascal':
// // // // // //         result = input.toLowerCase()
// // // // // //           .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (match, sep, char) => char.toUpperCase())
// // // // // //         break
// // // // // //       default:
// // // // // //         result = input
// // // // // //     }
// // // // // //     setOutput(result)
// // // // // //     setError('')
// // // // // //   }

// // // // // //   const handleReset = () => {
// // // // // //     setInput('')
// // // // // //     setOutput('')
// // // // // //     setError('')
// // // // // //     setButtonText('Copy')
// // // // // //   }

// // // // // //   const handleCopy = () => {
// // // // // //     if (!output) {
// // // // // //       setError('Nothing to copy.')
// // // // // //       return
// // // // // //     }
// // // // // //     navigator.clipboard.writeText(output)
// // // // // //       .then(() => {
// // // // // //         setButtonText('Copied!')
// // // // // //         setTimeout(() => setButtonText('Copy'), 5000)
// // // // // //       })
// // // // // //       .catch(err => {
// // // // // //         setError('Failed to copy text.')
// // // // // //         console.error('Failed to copy text:', err)
// // // // // //       })
// // // // // //   }

// // // // // //   return (
// // // // // //     <div className={styles.outerContainer}>
// // // // // //       <div className={styles.container}>
// // // // // //         <textarea 
// // // // // //           className={styles.textArea}
// // // // // //           value={output} 
// // // // // //           onChange={handleInput}
// // // // // //           placeholder="Enter text"
// // // // // //           rows="8"
// // // // // //         />
// // // // // //         <div className={styles.buttonGroup}>
// // // // // //           <button className={styles.button} onClick={() => convertCase('upper')}>Uppercase</button>
// // // // // //           <button className={styles.button} onClick={() => convertCase('lower')}>Lowercase</button>
// // // // // //           <button className={styles.button} onClick={() => convertCase('capitalize')}>Capitalize Words</button>
// // // // // //           <button className={styles.button} onClick={() => convertCase('title')}>Title Case</button>
// // // // // //           <button className={styles.button} onClick={() => convertCase('sentence')}>Sentence case</button>
// // // // // //           <button className={styles.button} onClick={() => convertCase('alternating')}>AlTeRnAtInG</button>
// // // // // //           <button className={styles.button} onClick={() => convertCase('inverse')}>InVeRsE</button>
// // // // // //           <button className={styles.button} onClick={() => convertCase('snake')}>snake_case</button>
// // // // // //           <button className={styles.button} onClick={() => convertCase('kebab')}>kebab-case</button>
// // // // // //           <button className={styles.button} onClick={() => convertCase('camel')}>camelCase</button>
// // // // // //           <button className={styles.button} onClick={() => convertCase('pascal')}>PascalCase</button>
// // // // // //           <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
// // // // // //         </div>
// // // // // //         <button className={`${styles.button} ${styles.copyButton}`} onClick={handleCopy}>{buttonText}</button>
// // // // // //         {error && <p className={styles.errorMessage}>{error}</p>}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   )
// // // // // // }

// // // // // // export default CaseConverter2
// // // // // 'use client'

// // // // // import { useState } from 'react'
// // // // // import styles from './CaseConverter.module.css'

// // // // // const CaseConverter2 = () => {
// // // // //   const [input, setInput] = useState('')
// // // // //   const [output, setOutput] = useState('')
// // // // //   const [buttonText, setButtonText] = useState('Copy')
// // // // //   const [error, setError] = useState('')

// // // // //   const handleInput = (e) => {
// // // // //     setInput(e.target.value)
// // // // //     setOutput(e.target.value)
// // // // //     setError('')
// // // // //   }

// // // // //   const convertCase = (type) => {
// // // // //     if (!input.trim()) {
// // // // //       setError('Please enter some text to convert.')
// // // // //       return
// // // // //     }
// // // // //     let result = ''
// // // // //     switch(type) {
// // // // //       case 'upper':
// // // // //         result = input.toUpperCase()
// // // // //         break
// // // // //       case 'lower':
// // // // //         result = input.toLowerCase()
// // // // //         break
// // // // //       case 'capitalize':
// // // // //         result = input.replace(/\b\w/g, letter => letter.toUpperCase())
// // // // //         break
// // // // //       case 'title':
// // // // //         const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i
// // // // //         result = input.toLowerCase().split(' ').map((word, index, array) => {
// // // // //           if (index === 0 || index === array.length - 1 || !smallWords.test(word)) {
// // // // //             return word.charAt(0).toUpperCase() + word.substr(1)
// // // // //           }
// // // // //           return word
// // // // //         }).join(' ')
// // // // //         break
// // // // //       case 'sentence':
// // // // //         result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
// // // // //         break
// // // // //       case 'alternating':
// // // // //         result = input.split('').map((char, index) => 
// // // // //           index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
// // // // //         ).join('')
// // // // //         break
// // // // //       case 'inverse':
// // // // //         result = input.split('').map(char => 
// // // // //           char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
// // // // //         ).join('')
// // // // //         break
// // // // //       case 'snake':
// // // // //         result = input.toLowerCase().replace(/\s+/g, '_')
// // // // //         break
// // // // //       case 'kebab':
// // // // //         result = input.toLowerCase().replace(/\s+/g, '-')
// // // // //         break
// // // // //       case 'camel':
// // // // //         result = input.toLowerCase()
// // // // //           .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase())
// // // // //         break
// // // // //       case 'pascal':
// // // // //         result = input.toLowerCase()
// // // // //           .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (match, sep, char) => char.toUpperCase())
// // // // //         break
// // // // //       default:
// // // // //         result = input
// // // // //     }
// // // // //     setOutput(result)
// // // // //     setError('')
// // // // //   }

// // // // //   const handleReset = () => {
// // // // //     setInput('')
// // // // //     setOutput('')
// // // // //     setError('')
// // // // //     setButtonText('Copy')
// // // // //   }

// // // // //   const handleCopy = () => {
// // // // //     if (!output) {
// // // // //       setError('Nothing to copy.')
// // // // //       return
// // // // //     }
// // // // //     navigator.clipboard.writeText(output)
// // // // //       .then(() => {
// // // // //         setButtonText('Copied!')
// // // // //         setTimeout(() => setButtonText('Copy'), 5000)
// // // // //       })
// // // // //       .catch(err => {
// // // // //         setError('Failed to copy text.')
// // // // //         console.error('Failed to copy text:', err)
// // // // //       })
// // // // //   }

// // // // //   return (
// // // // //     <div className={styles.outerContainer}>
// // // // //       <div className={styles.container}>
// // // // //         <div className={styles.textAreaContainer}>
// // // // //           <textarea 
// // // // //             className={styles.textArea}
// // // // //             value={output} 
// // // // //             onChange={handleInput}
// // // // //             placeholder="Enter text"
// // // // //             rows="8"
// // // // //           />
// // // // //           <button className={`${styles.button} ${styles.copyButton}`} onClick={handleCopy}>{buttonText}</button>
// // // // //         </div>
// // // // //         <div className={styles.buttonGroup}>
// // // // //           <button className={styles.button} onClick={() => convertCase('upper')}>Uppercase</button>
// // // // //           <button className={styles.button} onClick={() => convertCase('lower')}>Lowercase</button>
// // // // //           <button className={styles.button} onClick={() => convertCase('capitalize')}>Capitalize Words</button>
// // // // //           <button className={styles.button} onClick={() => convertCase('title')}>Title Case</button>
// // // // //           <button className={styles.button} onClick={() => convertCase('sentence')}>Sentence case</button>
// // // // //           <button className={styles.button} onClick={() => convertCase('alternating')}>AlTeRnAtInG</button>
// // // // //           <button className={styles.button} onClick={() => convertCase('inverse')}>InVeRsE</button>
// // // // //           <button className={styles.button} onClick={() => convertCase('snake')}>snake_case</button>
// // // // //           <button className={styles.button} onClick={() => convertCase('kebab')}>kebab-case</button>
// // // // //           <button className={styles.button} onClick={() => convertCase('camel')}>camelCase</button>
// // // // //           <button className={styles.button} onClick={() => convertCase('pascal')}>PascalCase</button>
// // // // //           <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
// // // // //         </div>
// // // // //         {error && <p className={styles.errorMessage}>{error}</p>}
// // // // //       </div>
// // // // //     </div>
// // // // //   )
// // // // // }

// // // // // export default CaseConverter2
// // // // 'use client'

// // // // import { useState } from 'react'
// // // // import styles from './CaseConverter.module.css'

// // // // const CaseConverter2 = () => {
// // // //   const [input, setInput] = useState('')
// // // //   const [output, setOutput] = useState('')
// // // //   const [buttonText, setButtonText] = useState('Copy')
// // // //   const [error, setError] = useState('')

// // // //   const handleInput = (e) => {
// // // //     setInput(e.target.value)
// // // //     setOutput(e.target.value)
// // // //     setError('')
// // // //   }

// // // //   const convertCase = (type) => {
// // // //     if (!input.trim()) {
// // // //       setError('Please enter some text to convert.')
// // // //       return
// // // //     }
// // // //     let result = ''
// // // //     switch(type) {
// // // //       case 'upper':
// // // //         result = input.toUpperCase()
// // // //         break
// // // //       case 'lower':
// // // //         result = input.toLowerCase()
// // // //         break
// // // //       case 'capitalize':
// // // //         result = input.replace(/\b\w/g, letter => letter.toUpperCase())
// // // //         break
// // // //       case 'title':
// // // //         const minorWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if', 'in', 'of', 'on', 'or', 'the', 'to', 'v', 'v.', 'via', 'vs', 'vs.']
// // // //         result = input.toLowerCase().split(' ').map((word, index, array) => {
// // // //           if (index === 0 || index === array.length - 1 || !minorWords.includes(word)) {
// // // //             return word.charAt(0).toUpperCase() + word.slice(1)
// // // //           }
// // // //           return word
// // // //         }).join(' ')
// // // //         break
// // // //       case 'sentence':
// // // //         result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
// // // //         break
// // // //       case 'alternating':
// // // //         result = input.split('').map((char, index) => 
// // // //           index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
// // // //         ).join('')
// // // //         break
// // // //       case 'inverse':
// // // //         result = input.split('').map(char => 
// // // //           char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
// // // //         ).join('')
// // // //         break
// // // //       case 'snake':
// // // //         result = input.toLowerCase().replace(/\s+/g, '_')
// // // //         break
// // // //       case 'kebab':
// // // //         result = input.toLowerCase().replace(/\s+/g, '-')
// // // //         break
// // // //       case 'camel':
// // // //         result = input.toLowerCase()
// // // //           .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase())
// // // //         break
// // // //       case 'pascal':
// // // //         result = input.toLowerCase()
// // // //           .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (match, sep, char) => char.toUpperCase())
// // // //         break
// // // //       default:
// // // //         result = input
// // // //     }
// // // //     setOutput(result)
// // // //     setError('')
// // // //   }

// // // //   const handleReset = () => {
// // // //     setInput('')
// // // //     setOutput('')
// // // //     setError('')
// // // //     setButtonText('Copy')
// // // //   }

// // // //   const handleCopy = () => {
// // // //     if (!output) {
// // // //       setError('Nothing to copy.')
// // // //       return
// // // //     }
// // // //     navigator.clipboard.writeText(output)
// // // //       .then(() => {
// // // //         setButtonText('Copied!')
// // // //         setTimeout(() => setButtonText('Copy'), 5000)
// // // //       })
// // // //       .catch(err => {
// // // //         setError('Failed to copy text.')
// // // //         console.error('Failed to copy text:', err)
// // // //       })
// // // //   }

// // // //   return (
// // // //     <div className={styles.outerContainer}>
// // // //       <div className={styles.container}>
// // // //         <div className={styles.textAreaContainer}>
// // // //           <textarea 
// // // //             className={styles.textArea}
// // // //             value={output} 
// // // //             onChange={handleInput}
// // // //             placeholder="Enter text"
// // // //             rows="8"
// // // //           />
// // // //           <button className={`${styles.button} ${styles.copyButton}`} onClick={handleCopy}>{buttonText}</button>
// // // //         </div>
// // // //         <div className={styles.buttonGroup}>
// // // //           <button className={styles.button} onClick={() => convertCase('upper')}>Uppercase</button>
// // // //           <button className={styles.button} onClick={() => convertCase('lower')}>Lowercase</button>
// // // //           <button className={styles.button} onClick={() => convertCase('capitalize')}>Capitalize Words</button>
// // // //           <button className={styles.button} onClick={() => convertCase('title')}>Title Case</button>
// // // //           <button className={styles.button} onClick={() => convertCase('sentence')}>Sentence case</button>
// // // //           <button className={styles.button} onClick={() => convertCase('alternating')}>AlTeRnAtInG</button>
// // // //           <button className={styles.button} onClick={() => convertCase('inverse')}>InVeRsE</button>
// // // //           <button className={styles.button} onClick={() => convertCase('snake')}>snake_case</button>
// // // //           <button className={styles.button} onClick={() => convertCase('kebab')}>kebab-case</button>
// // // //           <button className={styles.button} onClick={() => convertCase('camel')}>camelCase</button>
// // // //           <button className={styles.button} onClick={() => convertCase('pascal')}>PascalCase</button>
// // // //           <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
// // // //         </div>
// // // //         {error && <p className={styles.errorMessage}>{error}</p>}
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }

// // // // export default CaseConverter2
// // // 'use client'

// // // import { useState } from 'react'
// // // import styles from './CaseConverter.module.css'

// // // const CaseConverter2 = () => {
// // //   const [input, setInput] = useState('')
// // //   const [output, setOutput] = useState('')
// // //   const [buttonText, setButtonText] = useState('Copy')
// // //   const [error, setError] = useState('')

// // //   const handleInput = (e) => {
// // //     setInput(e.target.value)
// // //     setOutput(e.target.value)
// // //     setError('')
// // //   }

// // //   const convertCase = (type) => {
// // //     if (!input.trim()) {
// // //       setError('Please enter some text to convert.')
// // //       return
// // //     }
// // //     let result = ''
// // //     switch(type) {
// // //       case 'upper':
// // //         result = input.toUpperCase()
// // //         break
// // //       case 'lower':
// // //         result = input.toLowerCase()
// // //         break
// // //       case 'capitalize':
// // //         result = input.replace(/\b\w/g, letter => letter.toUpperCase())
// // //         break
// // //       case 'title':
// // //         const minorWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if', 'in', 'of', 'on', 'or', 'the', 'to', 'v', 'v.', 'via', 'vs', 'vs.']
// // //         result = input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, (word, index, title) => {
// // //           if (index > 0 && index < title.length - 1 && minorWords.includes(word.toLowerCase())) {
// // //             return word.toLowerCase();
// // //           }
// // //           return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
// // //         });
// // //         // Capitalize the first and last word
// // //         result = result.replace(/^[a-z]/, c => c.toUpperCase());
// // //         result = result.replace(/[a-z]$/, c => c.toUpperCase());
// // //         break
// // //       case 'sentence':
// // //         result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
// // //         break
// // //       case 'alternating':
// // //         result = input.split('').map((char, index) => 
// // //           index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
// // //         ).join('')
// // //         break
// // //       case 'inverse':
// // //         result = input.split('').map(char => 
// // //           char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
// // //         ).join('')
// // //         break
// // //       case 'snake':
// // //         result = input.toLowerCase().replace(/\s+/g, '_')
// // //         break
// // //       case 'kebab':
// // //         result = input.toLowerCase().replace(/\s+/g, '-')
// // //         break
// // //       case 'camel':
// // //         result = input.toLowerCase()
// // //           .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase())
// // //         break
// // //       case 'pascal':
// // //         result = input.toLowerCase()
// // //           .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (match, sep, char) => char.toUpperCase())
// // //         break
// // //       default:
// // //         result = input
// // //     }
// // //     setOutput(result)
// // //     setError('')
// // //   }

// // //   const handleReset = () => {
// // //     setInput('')
// // //     setOutput('')
// // //     setError('')
// // //     setButtonText('Copy')
// // //   }

// // //   const handleCopy = () => {
// // //     if (!output) {
// // //       setError('Nothing to copy.')
// // //       return
// // //     }
// // //     navigator.clipboard.writeText(output)
// // //       .then(() => {
// // //         setButtonText('Copied!')
// // //         setTimeout(() => setButtonText('Copy'), 5000)
// // //       })
// // //       .catch(err => {
// // //         setError('Failed to copy text.')
// // //         console.error('Failed to copy text:', err)
// // //       })
// // //   }

// // //   return (
// // //     <div className={styles.outerContainer}>
// // //       <div className={styles.container}>
// // //         <div className={styles.textAreaContainer}>
// // //           <textarea 
// // //             className={styles.textArea}
// // //             value={output} 
// // //             onChange={handleInput}
// // //             placeholder="Enter text"
// // //             rows="8"
// // //           />
// // //           <button className={`${styles.button} ${styles.copyButton}`} onClick={handleCopy}>{buttonText}</button>
// // //         </div>
// // //         <div className={styles.buttonGroup}>
// // //           <button className={styles.button} onClick={() => convertCase('upper')}>Uppercase</button>
// // //           <button className={styles.button} onClick={() => convertCase('lower')}>Lowercase</button>
// // //           <button className={styles.button} onClick={() => convertCase('capitalize')}>Capitalize Words</button>
// // //           <button className={styles.button} onClick={() => convertCase('title')}>Title Case</button>
// // //           <button className={styles.button} onClick={() => convertCase('sentence')}>Sentence case</button>
// // //           <button className={styles.button} onClick={() => convertCase('alternating')}>AlTeRnAtInG</button>
// // //           <button className={styles.button} onClick={() => convertCase('inverse')}>InVeRsE</button>
// // //           <button className={styles.button} onClick={() => convertCase('snake')}>snake_case</button>
// // //           <button className={styles.button} onClick={() => convertCase('kebab')}>kebab-case</button>
// // //           <button className={styles.button} onClick={() => convertCase('camel')}>camelCase</button>
// // //           <button className={styles.button} onClick={() => convertCase('pascal')}>PascalCase</button>
// // //           <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
// // //         </div>
// // //         {error && <p className={styles.errorMessage}>{error}</p>}
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // export default CaseConverter2
// // 'use client'

// // import { useState } from 'react'
// // import styles from './CaseConverter.module.css'

// // const CaseConverter2 = ({ explanations }) => {
// //   const [input, setInput] = useState('')
// //   const [output, setOutput] = useState('')
// //   const [buttonText, setButtonText] = useState('Copy')
// //   const [error, setError] = useState('')
// //   const [selectedCase, setSelectedCase] = useState('')

// //   const handleInput = (e) => {
// //     setInput(e.target.value)
// //     setOutput(e.target.value)
// //     setError('')
// //   }

// //   const convertCase = (type) => {
// //     if (!input.trim()) {
// //       setError('Please enter some text to convert.')
// //       return
// //     }
// //     let result = ''
// //     switch(type) {
// //       case 'upper':
// //         result = input.toUpperCase()
// //         break
// //       case 'lower':
// //         result = input.toLowerCase()
// //         break
// //       case 'capitalize':
// //         result = input.replace(/\b\w/g, letter => letter.toUpperCase())
// //         break
// //       case 'title':
// //         const minorWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if', 'in', 'of', 'on', 'or', 'the', 'to', 'v', 'v.', 'via', 'vs', 'vs.']
// //         result = input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, (word, index, title) => {
// //           if (index > 0 && index < title.length - 1 && minorWords.includes(word.toLowerCase())) {
// //             return word.toLowerCase();
// //           }
// //           return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
// //         });
// //         result = result.replace(/^[a-z]/, c => c.toUpperCase());
// //         result = result.replace(/[a-z]$/, c => c.toUpperCase());
// //         break
// //       case 'sentence':
// //         result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
// //         break
// //       case 'alternating':
// //         result = input.split('').map((char, index) => 
// //           index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
// //         ).join('')
// //         break
// //       case 'inverse':
// //         result = input.split('').map(char => 
// //           char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
// //         ).join('')
// //         break
// //       case 'snake':
// //         result = input.toLowerCase().replace(/\s+/g, '_')
// //         break
// //       case 'kebab':
// //         result = input.toLowerCase().replace(/\s+/g, '-')
// //         break
// //       case 'camel':
// //         result = input.toLowerCase()
// //           .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase())
// //         break
// //       case 'pascal':
// //         result = input.toLowerCase()
// //           .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (match, sep, char) => char.toUpperCase())
// //         break
// //       default:
// //         result = input
// //     }
// //     setOutput(result)
// //     setError('')
// //   }

// //   const handleReset = () => {
// //     setInput('')
// //     setOutput('')
// //     setError('')
// //     setButtonText('Copy')
// //     setSelectedCase('')
// //   }

// //   const handleCopy = () => {
// //     if (!output) {
// //       setError('Nothing to copy.')
// //       return
// //     }
// //     navigator.clipboard.writeText(output)
// //       .then(() => {
// //         setButtonText('Copied!')
// //         setTimeout(() => setButtonText('Copy'), 5000)
// //       })
// //       .catch(err => {
// //         setError('Failed to copy text.')
// //         console.error('Failed to copy text:', err)
// //       })
// //   }

// //   const handleCaseSelection = (type) => {
// //     convertCase(type)
// //     setSelectedCase(type)
// //   }

// //   return (
// //     <div className={styles.pageContainer}>
// //       <div className={styles.converterColumn}>
// //         <div className={styles.textAreaContainer}>
// //           <textarea 
// //             className={styles.textArea}
// //             value={output} 
// //             onChange={handleInput}
// //             placeholder="Enter text"
// //             rows="8"
// //           />
// //           <button className={`${styles.button} ${styles.copyButton}`} onClick={handleCopy}>{buttonText}</button>
// //         </div>
// //         <div className={styles.buttonGroup}>
// //           <button className={styles.button} onClick={() => handleCaseSelection('upper')}>Uppercase</button>
// //           <button className={styles.button} onClick={() => handleCaseSelection('lower')}>Lowercase</button>
// //           <button className={styles.button} onClick={() => handleCaseSelection('capitalize')}>Capitalize Words</button>
// //           <button className={styles.button} onClick={() => handleCaseSelection('title')}>Title Case</button>
// //           <button className={styles.button} onClick={() => handleCaseSelection('sentence')}>Sentence case</button>
// //           <button className={styles.button} onClick={() => handleCaseSelection('alternating')}>AlTeRnAtInG</button>
// //           <button className={styles.button} onClick={() => handleCaseSelection('inverse')}>InVeRsE</button>
// //           <button className={styles.button} onClick={() => handleCaseSelection('snake')}>snake_case</button>
// //           <button className={styles.button} onClick={() => handleCaseSelection('kebab')}>kebab-case</button>
// //           <button className={styles.button} onClick={() => handleCaseSelection('camel')}>camelCase</button>
// //           <button className={styles.button} onClick={() => handleCaseSelection('pascal')}>PascalCase</button>
// //           <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
// //         </div>
// //         {error && <p className={styles.errorMessage}>{error}</p>}
// //       </div>
// //       <div className={styles.explanationColumn}>
// //         {Object.entries(explanations).map(([caseType, explanation]) => (
// //           <div key={caseType} className={styles.explanation} style={{display: selectedCase === caseType ? 'block' : 'none'}}>
// //             <h2>{caseType.charAt(0).toUpperCase() + caseType.slice(1)} Case</h2>
// //             <p>{explanation}</p>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   )
// // }

// // export default CaseConverter2
// 'use client'

// import { useState } from 'react'
// import styles from './CaseConverter.module.css'

// const CaseConverter2 = ({ explanations }) => {
//   const [input, setInput] = useState('')
//   const [output, setOutput] = useState('')
//   const [buttonText, setButtonText] = useState('Copy')
//   const [error, setError] = useState('')
//   const [selectedCase, setSelectedCase] = useState('')

//   const handleInput = (e) => {
//     setInput(e?.target?.value ?? '')
//     setOutput(e?.target?.value ?? '')
//     setError('')
//   }

//   const convertCase = (type) => {
//     if (!input?.trim()) {
//       setError('Please enter some text to convert.')
//       return
//     }
//     let result = ''
//     switch(type) {
//       case 'upper':
//         result = input?.toUpperCase() ?? ''
//         break
//       case 'lower':
//         result = input?.toLowerCase() ?? ''
//         break
//       case 'capitalize':
//         result = input?.replace(/\b\w/g, letter => letter?.toUpperCase() ?? '') ?? ''
//         break
//       case 'title':
//         const minorWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if', 'in', 'of', 'on', 'or', 'the', 'to', 'v', 'v.', 'via', 'vs', 'vs.']
//         result = input?.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, (word, index, title) => {
//           if (index > 0 && index < title?.length - 1 && minorWords?.includes(word?.toLowerCase())) {
//             return word?.toLowerCase() ?? ''
//           }
//           return (word?.charAt(0)?.toUpperCase() ?? '') + (word?.substr(1)?.toLowerCase() ?? '')
//         }) ?? ''
//         result = result?.replace(/^[a-z]/, c => c?.toUpperCase() ?? '') ?? ''
//         result = result?.replace(/[a-z]$/, c => c?.toUpperCase() ?? '') ?? ''
//         break
//       case 'sentence':
//         result = input?.toLowerCase()?.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c?.toUpperCase() ?? '') ?? ''
//         break
//       case 'alternating':
//         result = input?.split('')?.map((char, index) => 
//           index % 2 === 0 ? char?.toUpperCase() : char?.toLowerCase()
//         )?.join('') ?? ''
//         break
//       case 'inverse':
//         result = input?.split('')?.map(char => 
//           char === char?.toUpperCase() ? char?.toLowerCase() : char?.toUpperCase()
//         )?.join('') ?? ''
//         break
//       case 'snake':
//         result = input?.toLowerCase()?.replace(/\s+/g, '_') ?? ''
//         break
//       case 'kebab':
//         result = input?.toLowerCase()?.replace(/\s+/g, '-') ?? ''
//         break
//       case 'camel':
//         result = input?.toLowerCase()
//           ?.replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char?.toUpperCase() ?? '') ?? ''
//         break
//       case 'pascal':
//         result = input?.toLowerCase()
//           ?.replace(/(^|[^a-zA-Z0-9]+)(.)/g, (match, sep, char) => char?.toUpperCase() ?? '') ?? ''
//         break
//       default:
//         result = input ?? ''
//     }
//     setOutput(result)
//     setError('')
//   }

//   const handleReset = () => {
//     setInput('')
//     setOutput('')
//     setError('')
//     setButtonText('Copy')
//     setSelectedCase('')
//   }

//   const handleCopy = () => {
//     if (!output) {
//       setError('Nothing to copy.')
//       return
//     }
//     navigator.clipboard?.writeText(output)
//       .then(() => {
//         setButtonText('Copied!')
//         setTimeout(() => setButtonText('Copy'), 5000)
//       })
//       .catch(err => {
//         setError('Failed to copy text.')
//         console.error('Failed to copy text:', err)
//       })
//   }

//   const handleCaseSelection = (type) => {
//     convertCase(type)
//     setSelectedCase(type)
//   }

//   return (
//     <div className={styles?.outerContainer}>
//       <div className={styles?.container}>
//         <div className={styles?.textAreaContainer}>
//           <textarea 
//             className={styles?.textArea}
//             value={output} 
//             onChange={handleInput}
//             placeholder="Enter text"
//             rows="8"
//           />
//           <button className={`${styles?.button} ${styles?.copyButton}`} onClick={handleCopy}>{buttonText}</button>
//         </div>
//         <div className={styles?.buttonGroup}>
//           <button className={styles?.button} onClick={() => handleCaseSelection('upper')}>Uppercase</button>
//           <button className={styles?.button} onClick={() => handleCaseSelection('lower')}>Lowercase</button>
//           <button className={styles?.button} onClick={() => handleCaseSelection('capitalize')}>Capitalize Words</button>
//           <button className={styles?.button} onClick={() => handleCaseSelection('title')}>Title Case</button>
//           <button className={styles?.button} onClick={() => handleCaseSelection('sentence')}>Sentence case</button>
//           <button className={styles?.button} onClick={() => handleCaseSelection('alternating')}>AlTeRnAtInG</button>
//           <button className={styles?.button} onClick={() => handleCaseSelection('inverse')}>InVeRsE</button>
//           <button className={styles?.button} onClick={() => handleCaseSelection('snake')}>snake_case</button>
//           <button className={styles?.button} onClick={() => handleCaseSelection('kebab')}>kebab-case</button>
//           <button className={styles?.button} onClick={() => handleCaseSelection('camel')}>camelCase</button>
//           <button className={styles?.button} onClick={() => handleCaseSelection('pascal')}>PascalCase</button>
//           <button className={`${styles?.button} ${styles?.resetButton}`} onClick={handleReset}>Reset</button>
//         </div>
//         {error && <p className={styles?.errorMessage}>{error}</p>}
//       </div>
//       <div className={styles?.explanationColumn}>
//         {explanations && Object.entries(explanations)?.map(([caseType, explanation]) => (
//           <div key={caseType} className={styles?.explanation} style={{display: selectedCase === caseType ? 'block' : 'none'}}>
//             <h2>{caseType?.charAt(0)?.toUpperCase() ?? ''}{caseType?.slice(1) ?? ''} Case</h2>
//             <p>{explanation}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default CaseConverter2
'use client'

import { useState } from 'react'
import styles from './CaseConverter.module.css'

const CaseConverter2 = ({ explanations }) => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [buttonText, setButtonText] = useState('Copy')
  const [error, setError] = useState('')
  const [selectedCase, setSelectedCase] = useState('');


  const MAX_FILE_SIZE = 100 * 1024; // 100 KB limit

  const handleInput = (e) => {
    setInput(e?.target?.value ?? '')
    setOutput(e?.target?.value ?? '')
    setError('')
  }

  const convertCase = (type) => {
    if (!input?.trim()) {
      setError('Please enter some text to convert.')
      return
    }
    let result = ''
    switch(type) {
      case 'upper':
        result = input?.toUpperCase() ?? ''
        break
      case 'lower':
        result = input?.toLowerCase() ?? ''
        break
      case 'capitalize':
        result = input?.replace(/\b\w/g, letter => letter?.toUpperCase() ?? '') ?? ''
        break
      case 'title':
        const minorWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if', 'in', 'of', 'on', 'or', 'the', 'to', 'v', 'v.', 'via', 'vs', 'vs.']
        result = input?.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, (word, index, title) => {
          if (index > 0 && index < title?.length - 1 && minorWords?.includes(word?.toLowerCase())) {
            return word?.toLowerCase() ?? ''
          }
          return (word?.charAt(0)?.toUpperCase() ?? '') + (word?.substr(1)?.toLowerCase() ?? '')
        }) ?? ''
        result = result?.replace(/^[a-z]/, c => c?.toUpperCase() ?? '') ?? ''
        result = result?.replace(/[a-z]$/, c => c?.toUpperCase() ?? '') ?? ''
        break
      case 'sentence':
        result = input?.toLowerCase()?.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c?.toUpperCase() ?? '') ?? ''
        break
      case 'alternating':
        result = input?.split('')?.map((char, index) => 
          index % 2 === 0 ? char?.toUpperCase() : char?.toLowerCase()
        )?.join('') ?? ''
        break
      case 'inverse':
        result = input?.split('')?.map(char => 
          char === char?.toUpperCase() ? char?.toLowerCase() : char?.toUpperCase()
        )?.join('') ?? ''
        break
      case 'snake':
        result = input?.toLowerCase()?.replace(/\s+/g, '_') ?? ''
        break
      case 'kebab':
        result = input?.toLowerCase()?.replace(/\s+/g, '-') ?? ''
        break
      case 'camel':
        result = input?.toLowerCase()
          ?.replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char?.toUpperCase() ?? '') ?? ''
        break
      case 'pascal':
        result = input?.toLowerCase()
          ?.replace(/(^|[^a-zA-Z0-9]+)(.)/g, (match, sep, char) => char?.toUpperCase() ?? '') ?? ''
        break
      default:
        result = input ?? ''
    }
    setOutput(result)
    setError('')
  }

  const handleReset = () => {
    setInput('')
    setOutput('')
    setError('')
    setButtonText('Copy')
    setSelectedCase('')
  }

  const handleCopy = () => {
    if (!output) {
      setError('Nothing to copy.')
      return
    }
    navigator.clipboard?.writeText(output)
      .then(() => {
        setButtonText('Copied!')
        setTimeout(() => setButtonText('Copy'), 5000)
      })
      .catch(err => {
        setError('Failed to copy text.')
        console.error('Failed to copy text:', err)
      })
  }

  const handleCaseSelection = (type) => {
    convertCase(type)
    setSelectedCase(type)
  }


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File size exceeds the limit of ${MAX_FILE_SIZE / 1024} KB`);
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (e) => {
        setInput(e.target.result);
        setOutput(e.target.result);
        setError('');
      };
      reader.onerror = () => {
        setError('Error reading file');
      };
      reader.readAsText(file);
    }
  };


//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > MAX_FILE_SIZE) {
//         setError(`File size exceeds the limit of ${MAX_FILE_SIZE / 1024} KB`);
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setText(e.target.result);
//         setError('');
//       };
//       reader.onerror = () => {
//         setError('Error reading file');
//       };
//       reader.readAsText(file);
//     }
//   };

  return (
    <div className={styles?.outerContainer}>
      <div className={styles?.converterColumn}>
        <div className={styles?.container}>
          <div className={styles?.textAreaContainer}>
          
            <textarea 
              className={styles?.textArea}
              value={output} 
              onChange={handleInput}
              placeholder="Enter text"
              rows="8"
            />
            <button className={`${styles?.button} ${styles?.copyButton}`} onClick={handleCopy}>{buttonText}</button>
          </div>
          <div className={styles.fileInputWrapper}>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className={styles.fileInput}
              id="fileInput"
            />
            <label htmlFor="fileInput" className={styles.fileInputLabel}>
              Choose File
            </label>
           
          </div>
          <div className={styles?.buttonGroup}>
            <button className={styles?.button} onClick={() => handleCaseSelection('upper')}>Uppercase</button>
            <button className={styles?.button} onClick={() => handleCaseSelection('lower')}>Lowercase</button>
            <button className={styles?.button} onClick={() => handleCaseSelection('capitalize')}>Capitalize Words</button>
            <button className={styles?.button} onClick={() => handleCaseSelection('title')}>Title Case</button>
            <button className={styles?.button} onClick={() => handleCaseSelection('sentence')}>Sentence case</button>
            <button className={styles?.button} onClick={() => handleCaseSelection('alternating')}>AlTeRnAtInG</button>
            <button className={styles?.button} onClick={() => handleCaseSelection('inverse')}>InVeRsE</button>
            <button className={styles?.button} onClick={() => handleCaseSelection('snake')}>snake_case</button>
            <button className={styles?.button} onClick={() => handleCaseSelection('kebab')}>kebab-case</button>
            <button className={styles?.button} onClick={() => handleCaseSelection('camel')}>camelCase</button>
            <button className={styles?.button} onClick={() => handleCaseSelection('pascal')}>PascalCase</button>
            <button className={`${styles?.button} ${styles?.resetButton}`} onClick={handleReset}>Reset</button>
          </div>
          {error && <p className={styles?.errorMessage}>{error}</p>}
        </div>
      </div>
      <div className={styles?.explanationColumn}>
        {explanations && Object.entries(explanations)?.map(([caseType, explanation]) => (
          <div key={caseType} className={styles?.explanation} style={{display: selectedCase === caseType ? 'block' : 'none'}}>
            <h2>{caseType?.charAt(0)?.toUpperCase() ?? ''}{caseType?.slice(1) ?? ''} Case</h2>
            <p>{explanation}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CaseConverter2