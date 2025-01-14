// import React, { useState } from 'react';
// import { Copy } from 'lucide-react';
// import { tokenize } from './tokenizer';
// import { themes } from './themes';
// import styles from './CodeSnippet.module.css';

// const CodeSnippet = ({ code, theme = 'oneDark' }) => {
//   const [copied, setCopied] = useState(false);
//   const currentTheme = themes[theme];

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(code);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };

//   const tokens = tokenize(code);
  
//   return (
//     <div className={styles.container}>
//       <div 
//         className={styles.codeBlock}
//         style={{
//           '--background': currentTheme.ui.background,
//           '--header': currentTheme.ui.header,
//           '--border': currentTheme.ui.border
//         }}
//       >
//         <div className={styles.header}>
//           <span className={styles.language}>C</span>
//           <button 
//             className={styles.copyButton}
//             onClick={copyToClipboard}
//             style={{ color: currentTheme.token.text }}
//           >
//             <Copy size={18} />
//             {copied && <span className={styles.tooltip}>Copied!</span>}
//           </button>
//         </div>
//         <pre className={styles.pre}>
//           <code className={styles.code}>
//             {tokens.map((token, index) => (
//               <span 
//                 key={index}
//                 style={{ color: currentTheme.token[token.type] || currentTheme.token.text }}
//               >
//                 {token.content}
//               </span>
//             ))}
//           </code>
//         </pre>
//       </div>
//     </div>
//   );
// };

// export default CodeSnippet;


// CodeSnippet.js
'use client';

import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { tokenize } from './tokenizer';
import { themes } from './themes';
import styles from './CodeSnippet.module.css';

export default function CodeSnippet({ code, theme = 'oneDark' }) {
  const [copied, setCopied] = useState(false);
  const currentTheme = themes[theme];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const tokens = tokenize(code);
  
  return (
    <div className={styles.container}>
      <div 
        className={styles.codeBlock}
        style={{
          '--background': currentTheme.ui.background,
          '--header': currentTheme.ui.header,
          '--border': currentTheme.ui.border
        }}
      >
        <div className={styles.header}>
          <span className={styles.language}>C</span>
          <button 
            className={styles.copyButton}
            onClick={copyToClipboard}
            style={{ color: currentTheme.token.text }}
          >
            <Copy size={18} />
            {copied && <span className={styles.tooltip}>Copied!</span>}
          </button>
        </div>
        <pre className={styles.pre}>
          <code className={styles.code}>
            {tokens.map((token, index) => (
              <span 
                key={index}
                style={{ color: currentTheme.token[token.type] || currentTheme.token.text }}
              >
                {token.content}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}