// import React, { useState } from 'react';
// import { Check, Copy } from 'lucide-react';
// import styles from './CodeWidget.module.css';

// const CodeWidget = ({ code, language }) => {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(code);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className={styles.codeWidgetContainer}>
//       <pre className={styles.codeBlock}>
//         <code className={`language-${language}`}>{code}</code>
//       </pre>
//       <button
//         onClick={handleCopy}
//         className={styles.copyButton}
//         aria-label="Copy to clipboard"
//       >
//         {copied ? (
//           <Check className={styles.icon} />
//         ) : (
//           <Copy className={styles.icon} />
//         )}
//       </button>
//     </div>
//   );
// };

// export default CodeWidget;
import React, { useEffect, useRef } from 'react';
import { Check, Copy } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';  // You can choose a different theme if you prefer
import 'prismjs/components/prism-python';  // Import language support for Python
import styles from './CodeWidget.module.css';

const CodeWidget = ({ code, language }) => {
  const [copied, setCopied] = React.useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.codeWidgetContainer}>
      <pre className={styles.codeBlock}>
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
      <button
        onClick={handleCopy}
        className={styles.copyButton}
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Check className={styles.icon} />
        ) : (
          <Copy className={styles.icon} />
        )}
      </button>
    </div>
  );
};

export default CodeWidget;