// // 'use client'

// // import { useState, useEffect } from 'react'
// // import ReactMarkdown from 'react-markdown'

// // export default function MarkdownEditor({ maxCharacters = 5000 }) {
// //   //const defaultMarkdown = '# Hello\n\nWrite your markdown here'
// //   const [markdown, setMarkdown] = useState(' ')
// //   const [error, setError] = useState(null)
// //   const [copyButtonText, setCopyButtonText] = useState('Copy ')

// //   useEffect(() => {
// //     validateMarkdown(markdown)
// //   }, [markdown])

// //   const validateMarkdown = (text) => {
// //     setError(null)
// //     if (text.length > maxCharacters) {
// //       setError(`Error: Exceeds ${maxCharacters} characters.`)
// //     }
// //   }

// //   const handleChange = (e) => {
// //     setMarkdown(e.target.value)
// //   }

// //   const handleReset = () => {
    
// //       setMarkdown('')
    
// //   }

// //   const handleCopy = () => {
// //     navigator.clipboard.writeText(markdown).then(() => {
// //       setCopyButtonText('Copied!')
// //       setTimeout(() => {
// //         setCopyButtonText('Copy Markdown')
// //       }, 5000)
// //     }).catch(err => {
// //       console.error('Failed to copy: ', err)
// //     })
// //   }

// //   return (
// //     <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
// //       <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
// //         <button onClick={handleReset}>Reset</button>
// //         <button onClick={handleCopy}>{copyButtonText}</button>
// //       </div>
// //       <div style={{ display: 'flex', flex: 1 }}>
// //         <textarea
// //           placeholder='Paste ot Type Your Markdown Here'
// //           style={{ width: '50%', height: '100%', resize: 'none' }}
// //           value={markdown}
// //           onChange={handleChange}
          
// //         />
// //         <div style={{ width: '50%', padding: '20px', overflow: 'auto' }}>
// //           {error ? (
// //             <div style={{ color: 'red' }}>{error}</div>
// //           ) : (
// //             <ReactMarkdown>{markdown}</ReactMarkdown>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// 'use client'

// import { useState, useEffect } from 'react'
// import ReactMarkdown from 'react-markdown'
// import styles from './MarkdownEditor.module.css'

// export default function MarkdownEditor({ maxCharacters = 5000 }) {
//   const [markdown, setMarkdown] = useState('')
//   const [error, setError] = useState(null)
//   const [copyButtonText, setCopyButtonText] = useState('Copy')

//   useEffect(() => {
//     validateMarkdown(markdown)
//   }, [markdown])

//   const validateMarkdown = (text) => {
//     setError(null)
//     if (text.length > maxCharacters) {
//       setError(`Error: Exceeds ${maxCharacters} characters.`)
//     }
//   }

//   const handleChange = (e) => {
//     setMarkdown(e.target.value)
//   }

//   const handleReset = () => {
//     setMarkdown('')
//   }

//   const handleCopy = () => {
//     navigator.clipboard.writeText(markdown).then(() => {
//       setCopyButtonText('Copied!')
//       setTimeout(() => {
//         setCopyButtonText('Copy')
//       }, 5000)
//     }).catch(err => {
//       console.error('Failed to copy: ', err)
//     })
//   }

//   return (
//     <div className={styles.outerContainer}>
//       <div className={styles.container}>
//         <div className={styles.buttonGroup}>
//           <div className={styles.buttonContainer}>
//             <button className={`${styles.button} ${styles.resetButton}`} onClick={handleReset}>Reset</button>
//             <button className={`${styles.button} ${styles.copyButton}`} onClick={handleCopy}>{copyButtonText}</button>
//           </div>
//           {error && <div className={styles.errorMessage}>{error}</div>}
//         </div>
//         <div className={styles.columnsContainer}>
//           <div className={styles.column}>
//             <textarea
//               className={styles.inputArea}
//               placeholder='Paste or Type Your Markdown Here'
//               value={markdown}
//               onChange={handleChange}
//             />
//           </div>
//           <div className={styles.column}>
//             <div className={styles.outputContainer}>
//               <ReactMarkdown>{markdown}</ReactMarkdown>
//             </div>
//           </div>
//         </div>
//         <div className={styles.charCount}>
//           Characters: {markdown.length} / {maxCharacters}
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './MarkdownEditor.module.css'

export default function MarkdownEditor({ maxCharacters = 5000 }) {
  const [markdown, setMarkdown] = useState('')
  const [error, setError] = useState(null)
  const [copyButtonText, setCopyButtonText] = useState('Copy')

  useEffect(() => {
    validateMarkdown(markdown)
  }, [markdown])

  const validateMarkdown = (text) => {
    setError(null)
    if (text.length > maxCharacters) {
      setError(`Error: Exceeds ${maxCharacters} characters.`)
    }
  }

  const handleChange = (e) => {
    setMarkdown(e.target.value)
  }

  const handleReset = () => {
    setMarkdown('')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopyButtonText('Copied!')
      setTimeout(() => {
        setCopyButtonText('Copy')
      }, 5000)
    }).catch(err => {
      console.error('Failed to copy: ', err)
    })
  }

  return (
    <div className={styles.outerContainer}>
      <div className={styles.editorContainer}>
        <textarea
          className={styles.inputArea}
          placeholder='Paste or Type Your Markdown Here'
          value={markdown}
          onChange={handleChange}
        />
      </div>
      <div className={styles.outputContainer}>
        <button className={styles.copyButton} onClick={handleCopy}>{copyButtonText}</button>
        <div className={styles.markdownOutput}>
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <button className={styles.resetButton} onClick={handleReset}>Reset</button>
        {/* {error && <div className={styles.errorMessage}>{error}</div>} */}
        <div className={styles.charCount}>
          Characters: {markdown.length} / {maxCharacters}
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    </div>
  )
}