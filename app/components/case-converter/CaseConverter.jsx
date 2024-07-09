// // // // 'use client'

// // // // import { useState } from 'react'

// // // // const CaseConverter = () => {
// // // //   const [input, setInput] = useState('')
// // // //   const [output, setOutput] = useState('')

// // // //   const handleInput = (e) => {
// // // //     setInput(e.target.value)
// // // //   }

// // // //   const convertCase = (type) => {
// // // //     switch(type) {
// // // //       case 'upper':
// // // //         setOutput(input.toUpperCase())
// // // //         break
// // // //       case 'lower':
// // // //         setOutput(input.toLowerCase())
// // // //         break
// // // //       case 'capitalize':
// // // //         setOutput(input.replace(/\b\w/g, c => c.toUpperCase()))
// // // //         break
// // // //       default:
// // // //         setOutput(input)
// // // //     }
// // // //   }

// // // //   return (
// // // //     <div>
// // // //       <input 
// // // //         type="text" 
// // // //         value={input} 
// // // //         onChange={handleInput}
// // // //         placeholder="Enter text"
// // // //       />
// // // //       <button onClick={() => convertCase('upper')}>Uppercase</button>
// // // //       <button onClick={() => convertCase('lower')}>Lowercase</button>
// // // //       <button onClick={() => convertCase('capitalize')}>Capitalize</button>
// // // //       <div>{output}</div>
// // // //     </div>
// // // //   )
// // // // }

// // // // export default CaseConverter
// // // 'use client'

// // // import { useState } from 'react'

// // // const CaseConverter = () => {
// // //   const [input, setInput] = useState('')
// // //   const [output, setOutput] = useState('')

// // //   const handleInput = (e) => {
// // //     setInput(e.target.value)
// // //   }

// // //   const convertCase = (type) => {
// // //     switch(type) {
// // //       case 'upper':
// // //         setOutput(input.toUpperCase())
// // //         break
// // //       case 'lower':
// // //         setOutput(input.toLowerCase())
// // //         break
// // //       case 'capitalize':
// // //         setOutput(input.replace(/\b\w/g, c => c.toUpperCase()))
// // //         break
// // //       default:
// // //         setOutput(input)
// // //     }
// // //   }

// // //   const handleReset = () => {
// // //     setInput('')
// // //     setOutput('')
// // //   }

// // //   const handleCopy = () => {
// // //     navigator.clipboard.writeText(output)
// // //       .then(() => alert('Copied to clipboard!'))
// // //       .catch(err => console.error('Failed to copy: ', err))
// // //   }

// // //   return (
// // //     <div>
// // //       <textarea 
// // //         value={input} 
// // //         onChange={handleInput}
// // //         placeholder="Enter text"
// // //         rows="4"
// // //         cols="50"
// // //       />
// // //       <div>
// // //         <button onClick={() => convertCase('upper')}>Uppercase</button>
// // //         <button onClick={() => convertCase('lower')}>Lowercase</button>
// // //         <button onClick={() => convertCase('capitalize')}>Capitalize</button>
// // //         <button onClick={handleReset}>Reset</button>
// // //       </div>
// // //       <div>
// // //         <textarea 
// // //           value={output} 
// // //           readOnly 
// // //           rows="4" 
// // //           cols="50"
// // //         />
// // //       </div>
// // //       <button onClick={handleCopy}>Copy</button>
// // //     </div>
// // //   )
// // // }

// // // export default CaseConverter
// // 'use client'

// // import { useState } from 'react'

// // const CaseConverter = () => {
// //   const [input, setInput] = useState('')
// //   const [output, setOutput] = useState('')
// //   const [buttonText, setButtonText] = useState('Copy')
// //   const [error, setError] = useState('')

// //   const handleInput = (e) => {
// //     setInput(e.target.value)
// //   }

// //   const convertCase = (type) => {
// //     if (!input.trim()) {
// //       setError('Please enter some text to convert.')
// //       setOutput('')
// //       return
// //     }
// //     switch(type) {
// //       case 'upper':
// //         setOutput(input.toUpperCase())
// //         break
// //       case 'lower':
// //         setOutput(input.toLowerCase())
// //         break
// //       case 'capitalize':
// //         setOutput(input.replace(/\b\w/g, c => c.toUpperCase()))
// //         break
// //       default:
// //         setOutput(input)
// //     }
// //     setError('')
// //   }

// //   const handleReset = () => {
// //     setInput('')
// //     setOutput('')
// //     setError('')
// //     setButtonText('Copy')
// //   }

// //   const handleCopy = () => {
// //     if (!output) {
// //       setError('Nothing to copy.')
// //       return
// //     }
// //     navigator.clipboard.writeText(output)
// //       .then(() => {
// //         setButtonText('Copied!')
// //         setTimeout(() => setButtonText('Copy'), 2000)
// //       })
// //       .catch(err => {
// //         setError('Failed to copy text.')
// //         console.error('Failed to copy text:', err)
// //       })
// //   }

// //   return (
// //     <div>
// //       <textarea 
// //         value={input} 
// //         onChange={handleInput}
// //         placeholder="Enter text"
// //         rows="4"
// //         cols="50"
// //       />
// //       <div>
// //         <button onClick={() => convertCase('upper')}>Uppercase</button>
// //         <button onClick={() => convertCase('lower')}>Lowercase</button>
// //         <button onClick={() => convertCase('capitalize')}>Capitalize</button>
// //         <button onClick={handleReset}>Reset</button>
// //       </div>
// //       <textarea 
// //         value={output} 
// //         readOnly 
// //         rows="4" 
// //         cols="50"
// //       />
// //       <button onClick={handleCopy}>{buttonText}</button>
// //       {error && <p>{error}</p>}
// //     </div>
// //   )
// // }

// // export default CaseConverter
// 'use client'

// import { useState } from 'react'

// const CaseConverter = () => {
//   const [input, setInput] = useState('')
//   const [output, setOutput] = useState('')
//   const [buttonText, setButtonText] = useState('Copy')
//   const [error, setError] = useState('')

//   const handleInput = (e) => {
//     setInput(e.target.value)
//   }

//   const convertCase = (type) => {
//     if (!input.trim()) {
//       setError('Please enter some text to convert.')
//       setOutput('')
//       return
//     }
//     switch(type) {
//       case 'upper':
//         setOutput(input.toUpperCase())
//         break
//       case 'lower':
//         setOutput(input.toLowerCase())
//         break
//       case 'capitalize':
//         setOutput(input.replace(/\b\w/g, c => c.toUpperCase()))
//         break
//       case 'title':
//         setOutput(input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()))
//         break
//       case 'sentence':
//         setOutput(input.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()))
//         break
//       case 'alternating':
//         setOutput(input.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join(''))
//         break
//       case 'inverse':
//         setOutput(input.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''))
//         break
//       case 'snake':
//         setOutput(input.replace(/\s+/g, '_').toLowerCase())
//         break
//       case 'kebab':
//         setOutput(input.replace(/\s+/g, '-').toLowerCase())
//         break
//       case 'camel':
//         setOutput(input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, ''))
//         break
//       case 'pascal':
//         setOutput(input.replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase()).replace(/\s+/g, ''))
//         break
//       default:
//         setOutput(input)
//     }
//     setError('')
//   }

//   const handleReset = () => {
//     setInput('')
//     setOutput('')
//     setError('')
//     setButtonText('Copy')
//   }

//   const handleCopy = () => {
//     if (!output) {
//       setError('Nothing to copy.')
//       return
//     }
//     navigator.clipboard.writeText(output)
//       .then(() => {
//         setButtonText('Copied!')
//         setTimeout(() => setButtonText('Copy'), 2000)
//       })
//       .catch(err => {
//         setError('Failed to copy text.')
//         console.error('Failed to copy text:', err)
//       })
//   }

//   return (
//     <div>
//       <textarea 
//         value={input} 
//         onChange={handleInput}
//         placeholder="Enter text"
//         rows="4"
//         cols="50"
//       />
//       <div>
//         <button onClick={() => convertCase('upper')}>Uppercase</button>
//         <button onClick={() => convertCase('lower')}>Lowercase</button>
//         <button onClick={() => convertCase('capitalize')}>Capitalize Words</button>
//         <button onClick={() => convertCase('title')}>Title Case</button>
//         <button onClick={() => convertCase('sentence')}>Sentence case</button>
//         <button onClick={() => convertCase('alternating')}>AlTeRnAtInG</button>
//         <button onClick={() => convertCase('inverse')}>InVeRsE</button>
//         <button onClick={() => convertCase('snake')}>snake_case</button>
//         <button onClick={() => convertCase('kebab')}>kebab-case</button>
//         <button onClick={() => convertCase('camel')}>camelCase</button>
//         <button onClick={() => convertCase('pascal')}>PascalCase</button>
//         <button onClick={handleReset}>Reset</button>
//       </div>
//       <textarea 
//         value={output} 
//         readOnly 
//         rows="4" 
//         cols="50"
//       />
//       <button onClick={handleCopy}>{buttonText}</button>
//       {error && <p>{error}</p>}
//     </div>
//   )
// }

// export default CaseConverter
'use client'

import { useState } from 'react'

const CaseConverter = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [buttonText, setButtonText] = useState('Copy')
  const [error, setError] = useState('')

  const handleInput = (e) => {
    setInput(e.target.value)
  }

//   const convertCase = (type) => {
//     if (!input.trim()) {
//       setError('Please enter some text to convert.')
//       setOutput('')
//       return
//     }
//     let result = ''
//     switch(type) {
//       case 'upper':
//         result = input.toUpperCase()
//         break
//       case 'lower':
//         result = input.toLowerCase()
//         break
//       case 'capitalize':
//         result = input.replace(/\b\w/g, c => c.toUpperCase())
//         break
//       case 'title':
//         result = input.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
//         break
//       case 'sentence':
//         result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
//         break
//       case 'alternating':
//         result = input.split('').map((char, index) => 
//           index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
//         ).join('')
//         break
//       case 'inverse':
//         result = input.split('').map(char => 
//           char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
//         ).join('')
//         break
//       case 'snake':
//         result = input.toLowerCase().replace(/\s+/g, '_')
//         break
//       case 'kebab':
//         result = input.toLowerCase().replace(/\s+/g, '-')
//         break
//       case 'camel':
//         result = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase())
//         break
//       case 'pascal':
//         result = input.toLowerCase().replace(/(^|[^a-zA-Z0-9]+)(.)/g, (match, sep, char) => char.toUpperCase())
//         break
//       default:
//         result = input
//     }
//     setOutput(result)
//     setError('')
//   }

// const convertCase = (type) => {
//     if (!input.trim()) {
//       setError('Please enter some text to convert.')
//       setOutput('')
//       return
//     }
//     let result = ''
//     switch(type) {
//       case 'upper':
//         result = input.toUpperCase()
//         break
//       case 'lower':
//         result = input.toLowerCase()
//         break
//       case 'capitalize':
//         // Capitalize the first letter of each word, leaving the rest unchanged
//         result = input.replace(/\b\w/g, c => c.toUpperCase())
//         break
//       case 'title':
//         // Capitalize the first letter of each word, lowercase the rest
//         result = input.toLowerCase().replace(/(?:^|\s)\S/g, c => c.toUpperCase())
//         break
//       case 'sentence':
//         result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
//         break
//       case 'alternating':
//         result = input.split('').map((char, index) => 
//           index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
//         ).join('')
//         break
//       case 'inverse':
//         result = input.split('').map(char => 
//           char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
//         ).join('')
//         break
//       case 'snake':
//         result = input.toLowerCase().replace(/\s+/g, '_')
//         break
//       case 'kebab':
//         result = input.toLowerCase().replace(/\s+/g, '-')
//         break
//       case 'camel':
//         // First word lowercase, subsequent words capitalized, no spaces
//         result = input.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
//           return index === 0 ? word.toLowerCase() : word.toUpperCase()
//         }).replace(/\s+/g, '')
//         break
//       case 'pascal':
//         // All words capitalized, no spaces
//         result = input.toLowerCase().replace(/(?:^\w|\b\w)/g, c => c.toUpperCase()).replace(/\s+/g, '')
//         break
//       default:
//         result = input
//     }
//     setOutput(result)
//     setError('')
//   }  


const convertCase = (type) => {
    if (!input.trim()) {
      setError('Please enter some text to convert.')
      setOutput('')
      return
    }
    let result = ''
    switch(type) {
      case 'upper':
        result = input.toUpperCase()
        break
      case 'lower':
        result = input.toLowerCase()
        break
      case 'capitalize':
        // Capitalize the first letter of each word, including small words
        result = input.replace(/\b\w/g, letter => letter.toUpperCase())
        break
      case 'title':
        // List of words to keep lowercase in title case (unless they're the first or last word)
        const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i
        result = input.toLowerCase().split(' ').map((word, index, array) => {
          if (index === 0 || index === array.length - 1 || !smallWords.test(word)) {
            return word.charAt(0).toUpperCase() + word.substr(1)
          }
          return word
        }).join(' ')
        break
      case 'sentence':
        result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
        break
      case 'alternating':
        result = input.split('').map((char, index) => 
          index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
        ).join('')
        break
      case 'inverse':
        result = input.split('').map(char => 
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        ).join('')
        break
      case 'snake':
        result = input.toLowerCase().replace(/\s+/g, '_')
        break
      case 'kebab':
        result = input.toLowerCase().replace(/\s+/g, '-')
        break
      case 'camel':
        result = input.toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase())
        break
      case 'pascal':
        result = input.toLowerCase()
          .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (match, sep, char) => char.toUpperCase())
        break
      default:
        result = input
    }
    setOutput(result)
    setError('')
  }

const handleReset = () => {
    setInput('')
    setOutput('')
    setError('')
    setButtonText('Copy')
  }

  const handleCopy = () => {
    if (!output) {
      setError('Nothing to copy.')
      return
    }
    navigator.clipboard.writeText(output)
      .then(() => {
        setButtonText('Copied!')
        setTimeout(() => setButtonText('Copy'), 2000)
      })
      .catch(err => {
        setError('Failed to copy text.')
        console.error('Failed to copy text:', err)
      })
  }

  return (
    <div>
      <textarea 
        value={input} 
        onChange={handleInput}
        placeholder="Enter text"
        rows="4"
        cols="50"
      />
      <div>
        <button onClick={() => convertCase('upper')}>Uppercase</button>
        <button onClick={() => convertCase('lower')}>Lowercase</button>
        <button onClick={() => convertCase('capitalize')}>Capitalize Words</button>
        <button onClick={() => convertCase('title')}>Title Case</button>
        <button onClick={() => convertCase('sentence')}>Sentence case</button>
        <button onClick={() => convertCase('alternating')}>AlTeRnAtInG</button>
        <button onClick={() => convertCase('inverse')}>InVeRsE</button>
        <button onClick={() => convertCase('snake')}>snake_case</button>
        <button onClick={() => convertCase('kebab')}>kebab-case</button>
        <button onClick={() => convertCase('camel')}>camelCase</button>
        <button onClick={() => convertCase('pascal')}>PascalCase</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <textarea 
        value={output} 
        readOnly 
        rows="4" 
        cols="50"
      />
      <button onClick={handleCopy}>{buttonText}</button>
      {error && <p>{error}</p>}
    </div>
  )
}

export default CaseConverter