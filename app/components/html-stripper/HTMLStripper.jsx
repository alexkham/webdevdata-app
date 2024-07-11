// // // // // // 'use client'

// // // // // // import { useState } from 'react'

// // // // // // const HTMLStripper = () => {
// // // // // //   const [input, setInput] = useState('')
// // // // // //   const [output, setOutput] = useState('')
// // // // // //   const [error, setError] = useState('')

// // // // // //   const stripHTMLTags = (html) => {
// // // // // //     // Remove all HTML tags
// // // // // //     let text = html.replace(/<[^>]*>/g, '')
// // // // // //     // Decode HTML entities
// // // // // //     text = text.replace(/&nbsp;/g, ' ')
// // // // // //     text = text.replace(/&amp;/g, '&')
// // // // // //     text = text.replace(/&lt;/g, '<')
// // // // // //     text = text.replace(/&gt;/g, '>')
// // // // // //     text = text.replace(/&quot;/g, '"')
// // // // // //     text = text.replace(/&#39;/g, "'")
// // // // // //     // Remove extra whitespace
// // // // // //     text = text.replace(/\s+/g, ' ').trim()
// // // // // //     return text
// // // // // //   }

// // // // // //   const handleStrip = () => {
// // // // // //     if (!input.trim()) {
// // // // // //       setError('Please enter some HTML to strip.')
// // // // // //       return
// // // // // //     }
// // // // // //     try {
// // // // // //       const strippedText = stripHTMLTags(input)
// // // // // //       setOutput(strippedText)
// // // // // //       setError('')
// // // // // //     } catch (err) {
// // // // // //       setError('An error occurred while stripping HTML tags.')
// // // // // //       console.error('Error stripping HTML tags:', err)
// // // // // //     }
// // // // // //   }

// // // // // //   const handleCopy = () => {
// // // // // //     if (!output) {
// // // // // //       setError('Nothing to copy.')
// // // // // //       return
// // // // // //     }
// // // // // //     navigator.clipboard.writeText(output)
// // // // // //       .then(() => {
// // // // // //         setError('Copied to clipboard!')
// // // // // //         setTimeout(() => setError(''), 3000)
// // // // // //       })
// // // // // //       .catch(err => {
// // // // // //         setError('Failed to copy text.')
// // // // // //         console.error('Failed to copy text:', err)
// // // // // //       })
// // // // // //   }

// // // // // //   const handleClear = () => {
// // // // // //     setInput('');
// // // // // //     setOutput('');
// // // // // //     setError('');
// // // // // //   }
  

// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h1>HTML Tag Stripper</h1>
// // // // // //       <div>
// // // // // //         <textarea
// // // // // //           value={input}
// // // // // //           onChange={(e) => setInput(e.target.value)}
// // // // // //           placeholder="Enter HTML here"
// // // // // //           rows="10"
// // // // // //           cols="50"
// // // // // //         />
// // // // // //       </div>
// // // // // //       <div>
// // // // // //         <button onClick={handleStrip}>Strip HTML Tags</button>
// // // // // //       </div>
// // // // // //       <div>
// // // // // //         <textarea
// // // // // //           value={output}
// // // // // //           readOnly
// // // // // //           placeholder="Stripped text will appear here"
// // // // // //           rows="10"
// // // // // //           cols="50"
// // // // // //         />
// // // // // //       </div>
// // // // // //       <div>
// // // // // //         <button onClick={handleCopy}>Copy Stripped Text</button>
// // // // // //         <button onClick={handleClear}>Clear</button>

// // // // // //       </div>
// // // // // //       {error && <p style={{ color: 'red' }}>{error}</p>}
// // // // // //     </div>
// // // // // //   )
// // // // // // }

// // // // // // export default HTMLStripper
// // // // // 'use client';

// // // // // import { useState } from 'react';

// // // // // const HTMLStripper = () => {
// // // // //   const [input, setInput] = useState('');  // Holds the input HTML/Text from user
// // // // //   const [output, setOutput] = useState('');  // Holds the stripped text
// // // // //   const [error, setError] = useState('');  // Holds error messages

// // // // //   // Function to remove HTML tags and decode HTML entities
// // // // //   const stripHTMLTags = (html) => {
// // // // //     console.log("Input to strip:", html);  // Debug: Log input
// // // // //     let text = html.replace(/<[^>]*>/g, '');  // Remove HTML tags
// // // // //     text = text.replace(/&nbsp;/g, ' ')       // Decode spaces
// // // // //                .replace(/&amp;/g, '&')        // Decode ampersands
// // // // //                .replace(/&lt;/g, '<')         // Decode less than signs
// // // // //                .replace(/&gt;/g, '>')         // Decode greater than signs
// // // // //                .replace(/&quot;/g, '"')       // Decode double quotes
// // // // //                .replace(/&#39;/g, "'");       // Decode single quotes
// // // // //     text = text.replace(/\s+/g, ' ').trim();  // Normalize whitespace
// // // // //     console.log("Output after strip:", text);  // Debug: Log output
// // // // //     return text;
// // // // //   }

// // // // //   // Handles the strip button click
// // // // //   const handleStrip = () => {
// // // // //     if (!input.trim()) {
// // // // //       setError('Please enter some HTML to strip.');
// // // // //       return;
// // // // //     }
// // // // //     try {
// // // // //       const strippedText = stripHTMLTags(input);
// // // // //       setOutput(strippedText);
// // // // //       setError('');
// // // // //     } catch (err) {
// // // // //       setError('An error occurred while stripping HTML tags.');
// // // // //       console.error('Error stripping HTML tags:', err);
// // // // //     }
// // // // //   }

// // // // //   // Handles the copy button click
// // // // //   const handleCopy = () => {
// // // // //     if (!output) {
// // // // //       setError('Nothing to copy.');
// // // // //       return;
// // // // //     }
// // // // //     navigator.clipboard.writeText(output)
// // // // //       .then(() => {
// // // // //         setError('Copied to clipboard!');
// // // // //         setTimeout(() => setError(''), 3000);
// // // // //       })
// // // // //       .catch(err => {
// // // // //         setError('Failed to copy text.');
// // // // //         console.error('Failed to copy text:', err);
// // // // //       });
// // // // //   }

// // // // //   // Handles the clear button click
// // // // //   const handleClear = () => {
// // // // //     setInput('');
// // // // //     setOutput('');
// // // // //     setError('');
// // // // //   }

// // // // //   return (
// // // // //     <div>
// // // // //       <h1>HTML Tag Stripper</h1>
// // // // //       <div>
// // // // //         <textarea
// // // // //           value={input}
// // // // //           onChange={(e) => setInput(e.target.value)}
// // // // //           placeholder="Enter HTML here"
// // // // //           rows="10"
// // // // //           cols="50"
// // // // //         />
// // // // //       </div>
// // // // //       <button onClick={handleStrip}>Strip HTML Tags</button>
// // // // //       <div>
// // // // //         <textarea
// // // // //           value={output}
// // // // //           readOnly
// // // // //           placeholder="Stripped text will appear here"
// // // // //           rows="10"
// // // // //           cols="50"
// // // // //         />
// // // // //       </div>
// // // // //       <button onClick={handleCopy}>Copy Stripped Text</button>
// // // // //       <button onClick={handleClear}>Clear</button>
// // // // //       {error && <p style={{ color: 'red' }}>{error}</p>}
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default HTMLStripper;
// // // // 'use client';

// // // // import { useState } from 'react';

// // // // const HTMLStripper = () => {
// // // //   const [input, setInput] = useState('');  // Holds the input HTML/Text from the user
// // // //   const [output, setOutput] = useState('');  // Holds the stripped text
// // // //   const [error, setError] = useState('');  // Holds error messages

// // // //   // Function to remove HTML tags and decode HTML entities
// // // //   const stripHTMLTags = (html) => {
// // // //     console.log("Input to strip:", html);  // Debug: Log input
// // // //     let text = html.replace(/<[^>]*>/g, '');  // Remove HTML tags
// // // //     text = text.replace(/&nbsp;/g, ' ')        // Decode spaces
// // // //                 .replace(/&amp;/g, '&')        // Decode ampersands
// // // //                 .replace(/&lt;/g, '<')         // Decode less than signs
// // // //                 .replace(/&gt;/g, '>')         // Decode greater than signs
// // // //                 .replace(/&quot;/g, '"')       // Decode double quotes
// // // //                 .replace(/&#39;/g, "'");       // Decode single quotes
// // // //     text = text.replace(/\s+/g, ' ').trim();  // Normalize whitespace
// // // //     console.log("Output after strip:", text);  // Debug: Log output
// // // //     return text;
// // // //   }

// // // //   // Handles the strip button click
// // // //   const handleStrip = () => {
// // // //     if (!input.trim()) {
// // // //       setError('Please enter some HTML to strip.');
// // // //       return;
// // // //     }
// // // //     try {
// // // //       const strippedText = stripHTMLTags(input);
// // // //       setOutput(strippedText);
// // // //       setError('');
// // // //     } catch (err) {
// // // //       setError('An error occurred while stripping HTML tags.');
// // // //       console.error('Error stripping HTML tags:', err);
// // // //     }
// // // //   }

// // // //   // Handles the copy button click
// // // //   const handleCopy = () => {
// // // //     if (!output) {
// // // //       setError('Nothing to copy.');
// // // //       return;
// // // //     }
// // // //     navigator.clipboard.writeText(output)
// // // //       .then(() => {
// // // //         setError('Copied to clipboard!');
// // // //         setTimeout(() => setError(''), 3000);
// // // //       })
// // // //       .catch(err => {
// // // //         setError('Failed to copy text.');
// // // //         console.error('Failed to copy text:', err);
// // // //       });
// // // //   }

// // // //   // Handles the clear button click
// // // //   const handleClear = () => {
// // // //     setInput('');
// // // //     setOutput('');
// // // //     setError('');
// // // //   }

// // // //   return (
// // // //     <div>
// // // //       <h1>HTML Tag Stripper</h1>
// // // //       <div>
// // // //         <textarea
// // // //           value={input}
// // // //           onChange={(e) => setInput(e.target.value)}
// // // //           placeholder="Enter HTML here"
// // // //           rows="10"
// // // //           cols="50"
// // // //         />
// // // //       </div>
// // // //       <button onClick={handleStrip}>Strip HTML Tags</button>
// // // //       <div>
// // // //         <textarea
// // // //           value={output}
// // // //           readOnly
// // // //           placeholder="Stripped text will appear here"
// // // //           rows="10"
// // // //           cols="50"
// // // //         />
// // // //       </div>
// // // //       <button onClick={handleCopy}>Copy Stripped Text</button>
// // // //       <button onClick={handleClear}>Clear</button>
// // // //       {error && <p style={{ color: 'red' }}>{error}</p>}
// // // //     </div>
// // // //   );
// // // // }

// // // // export default HTMLStripper;
// // // 'use client'

// // // import { useState } from 'react'

// // // const HTMLStripper = () => {
// // //   const [input, setInput] = useState('')
// // //   const [output, setOutput] = useState('')
// // //   const [error, setError] = useState('')

// // //   const stripHTMLTags = (html) => {
// // //     // Remove all HTML tags
// // //     let text = html.replace(/<[^>]*>/g, '')
// // //     // Decode HTML entities
// // //     text = text.replace(/&nbsp;/g, ' ')
// // //     text = text.replace(/&amp;/g, '&')
// // //     text = text.replace(/&lt;/g, '<')
// // //     text = text.replace(/&gt;/g, '>')
// // //     text = text.replace(/&quot;/g, '"')
// // //     text = text.replace(/&#39;/g, "'")
// // //     // Remove extra whitespace
// // //     text = text.replace(/\s+/g, ' ').trim()
// // //     return text
// // //   }

// // //   const handleStrip = () => {
// // //     if (!input.trim()) {
// // //       setError('Please enter some HTML to strip.')
// // //       return
// // //     }
// // //     try {
// // //       const strippedText = stripHTMLTags(input)
// // //       setOutput(strippedText)
// // //       setError('')
// // //     } catch (err) {
// // //       setError('An error occurred while stripping HTML tags.')
// // //       console.error('Error stripping HTML tags:', err)
// // //     }
// // //   }

// // //   const handleCopy = () => {
// // //     if (!output) {
// // //       setError('Nothing to copy.')
// // //       return
// // //     }
// // //     navigator.clipboard.writeText(output)
// // //       .then(() => {
// // //         setError('Copied to clipboard!')
// // //         setTimeout(() => setError(''), 3000)
// // //       })
// // //       .catch(err => {
// // //         setError('Failed to copy text.')
// // //         console.error('Failed to copy text:', err)
// // //       })
// // //   }

// // //   return (
// // //     <div>
// // //       <h1>HTML Tag Stripper</h1>
// // //       <div>
// // //         <textarea
// // //           value={input}
// // //           onChange={(e) => setInput(e.target.value)}
// // //           placeholder="Enter HTML here"
// // //           rows="10"
// // //           cols="50"
// // //         />
// // //       </div>
// // //       <div>
// // //         <button onClick={handleStrip}>Strip HTML Tags</button>
// // //       </div>
// // //       <div>
// // //         <textarea
// // //           value={output}
// // //           readOnly
// // //           placeholder="Stripped text will appear here"
// // //           rows="10"
// // //           cols="50"
// // //         />
// // //       </div>
// // //       <div>
// // //         <button onClick={handleCopy}>Copy Stripped Text</button>
// // //       </div>
// // //       {error && <p style={{ color: 'red' }}>{error}</p>}
// // //     </div>
// // //   )
// // // }

// // // export default HTMLStripper
// // 'use client';

// // import { useState } from 'react';

// // const HTMLStripper = () => {
// //   const [input, setInput] = useState('');
// //   const [output, setOutput] = useState('');
// //   const [error, setError] = useState('');

// //   const stripHTMLTags = (html) => {
// //     console.log("Input to strip:", html);  // Debug: Log input
// //     let text = html.replace(/<[^>]*>/g, ''); // Remove HTML tags
// //     text = text.replace(/&nbsp;/g, ' ')
// //                .replace(/&amp;/g, '&')
// //                .replace(/&lt;/g, '<')
// //                .replace(/&gt;/g, '>')
// //                .replace(/&quot;/g, '"')
// //                .replace(/&#39;/g, "'");
// //     text = text.replace(/\s+/g, ' ').trim(); // Normalize whitespace
// //     console.log("Output after strip:", text);  // Debug: Log output
// //     text=text.replaceAll('/>','')
// //     return text;
// //   };

// //   const handleStrip = () => {
// //     if (!input.trim()) {
// //       setError('Please enter some HTML to strip.');
// //       return;
// //     }
// //     try {
// //       const strippedText = stripHTMLTags(input);
// //       setOutput(strippedText);
// //       setError('');
// //     } catch (err) {
// //       setError('An error occurred while stripping HTML tags.');
// //       console.error('Error stripping HTML tags:', err);
// //     }
// //   };

// //   const handleCopy = () => {
// //     if (!output) {
// //       setError('Nothing to copy.');
// //       return;
// //     }
// //     navigator.clipboard.writeText(output)
// //       .then(() => {
// //         setError('Copied to clipboard!');
// //         setTimeout(() => setError(''), 3000);
// //       })
// //       .catch(err => {
// //         setError('Failed to copy text.');
// //         console.error('Failed to copy text:', err);
// //       });
// //   };

// //   const handleClear = () => {
// //     setInput('');
// //     setOutput('');
// //     setError('');
// //   };

// //   return (
// //     <div>
// //       <h1>HTML Tag Stripper</h1>
// //       <textarea
// //         value={input}
// //         onChange={(e) => setInput(e.target.value)}
// //         placeholder="Enter HTML here"
// //         rows="10"
// //         cols="50"
// //       />
// //       <button onClick={handleStrip}>Strip HTML Tags</button>
// //       <textarea
// //         value={output}
// //         readOnly
// //         placeholder="Stripped text will appear here"
// //         rows="10"
// //         cols="50"
// //       />
// //       <button onClick={handleCopy}>Copy Stripped Text</button>
// //       <button onClick={handleClear}>Clear</button>
// //       {error && <p style={{ color: 'red' }}>{error}</p>}
// //     </div>
// //   );
// // };

// // export default HTMLStripper;
// 'use client';

// import { useState } from 'react';

// const HTMLStripper = () => {
//   const [input, setInput] = useState('');
//   const [output, setOutput] = useState('');
//   const [error, setError] = useState('');

//   const stripHTMLTags = (html) => {
//     console.log("Input to strip:", html);  // Debug: Log input
//     let text = html.replace(/<[^>]*>/g, ''); // Remove HTML tags
//     text = text.replaceAll('&nbsp;', ' ')
//                .replaceAll('&amp;', '&')
//                .replaceAll('&lt;', '<')
//                .replaceAll('&gt;', '>')
//                .replaceAll('&quot;', '"')
//                .replaceAll('&#39;', "'");
//     text = text.replace(/\s+/g, ' ').trim(); // Normalize whitespace
//     console.log("Output after strip:", text);  // Debug: Log output
//     text=text.replaceAll('/>','')
    
//     text=text.replaceAll('</','')
//     return text;
//   };

//   const handleStrip = () => {
//     if (!input.trim()) {
//       setError('Please enter some HTML to strip.');
//       return;
//     }
//     try {
//       const strippedText = stripHTMLTags(input);
//       setOutput(strippedText);
//       setError('');
//     } catch (err) {
//       setError('An error occurred while stripping HTML tags.');
//       console.error('Error stripping HTML tags:', err);
//     }
//   };

//   const handleCopy = () => {
//     if (!output) {
//       setError('Nothing to copy.');
//       return;
//     }
//     navigator.clipboard.writeText(output)
//       .then(() => {
//         setError('Copied to clipboard!');
//         setTimeout(() => setError(''), 3000);
//       })
//       .catch(err => {
//         setError('Failed to copy text.');
//         console.error('Failed to copy text:', err);
//       });
//   };

//   const handleClear = () => {
//     setInput('');
//     setOutput('');
//     setError('');
//   };

//   return (
//     <div>
//       <h1>HTML Tag Stripper</h1>
//       <textarea
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Enter HTML here"
//         rows="10"
//         cols="50"
//       />
//       <button onClick={handleStrip}>Strip HTML Tags</button>
//       <textarea
//         value={output}
//         readOnly
//         placeholder="Stripped text will appear here"
//         rows="10"
//         cols="50"
//       />
//       <button onClick={handleCopy}>Copy Stripped Text</button>
//       <button onClick={handleClear}>Clear</button>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// };

// export default HTMLStripper;
'use client';

import { useState } from 'react';

// List of common HTML tags including doctype for completeness
const HTML_TAGS = [
  'a', 'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'body', 'html',
  'head', 'title', 'meta', 'link', 'script', 'style', 'ul', 'li', 'table',
  'tr', 'td', 'th', 'tbody', 'thead', 'tfoot', 'br', 'hr', 'strong', 'em',
  'blockquote', 'b', 'i', 'u', 'small', 'big', 'doctype' // Explicitly including doctype
];

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape regex characters
};

const buildTagRegex = () => {
  const tagPatterns = HTML_TAGS.map(tag => {
    const escapedTag = escapeRegex(tag);
    return `(</?${escapedTag}[^>]*>)|(<${escapedTag}[^>]*>)`; // Matches complete and malformed tags
  });
  tagPatterns.push('<!DOCTYPE [^>]*>'); // Explicit handling for doctype
  return new RegExp(tagPatterns.join('|'), 'gi');
};

const HTMLStripper = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const stripHTMLTags = (html) => {
    const regex = buildTagRegex();
    let text = html.replace(regex, ''); // Remove HTML tags using the regex
    text = text.replaceAll('&nbsp;', ' ')
               .replaceAll('&amp;', '&')
               .replaceAll('&lt;', '<')
               .replaceAll('&gt;', '>')
               .replaceAll('&quot;', '"')
               .replaceAll('&#39;', "'");
    text = text.trim().replace(/\s{2,}/g, ' '); // Normalize whitespace
    text=text.replaceAll('/>','')
    text=text.replaceAll('</','')
    return text;
  };

  const handleStrip = () => {
    if (!input.trim()) {
      setError('Please enter some HTML to strip.');
      return;
    }
    try {
      const strippedText = stripHTMLTags(input);
      setOutput(strippedText);
      setError('');
    } catch (err) {
      setError('An error occurred while stripping HTML tags.');
      console.error('Error stripping HTML tags:', err);
    }
  };

  const handleCopy = () => {
    if (!output) {
      setError('Nothing to copy.');
      return;
    }
    navigator.clipboard.writeText(output)
      .then(() => {
        setError('Copied to clipboard!');
        setTimeout(() => setError(''), 3000);
      })
      .catch(err => {
        setError('Failed to copy text.');
        console.error('Failed to copy text:', err);
      });
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div>
      <h1>HTML Tag Stripper</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter HTML here"
        rows="10"
        cols="50"
      />
      <button onClick={handleStrip}>Strip HTML Tags</button>
      <textarea
        value={output}
        readOnly
        placeholder="Stripped text will appear here"
        rows="10"
        cols="50"
      />
      <button onClick={handleCopy}>Copy Stripped Text</button>
      <button onClick={handleClear}>Clear</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default HTMLStripper;
