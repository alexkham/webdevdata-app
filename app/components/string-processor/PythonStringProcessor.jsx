// import React, { useState } from 'react';
// import styles from './StringProcessor.module.css';

// const STRING_PREVIEW_LENGTH = 50;

// const StringProcessor = () => {
//   const [inputString, setInputString] = useState('Hello, World!');
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const stringOperations = [
//     {
//       name: 'upper()',
//       description: 'Converts string to uppercase',
//       result: inputString.toUpperCase()
//     },
//     {
//       name: 'lower()',
//       description: 'Converts string to lowercase',
//       result: inputString.toLowerCase()
//     },
//     {
//       name: 'strip()',
//       description: 'Removes leading and trailing whitespace',
//       result: inputString.trim()
//     },
//     {
//       name: 'len()',
//       description: 'Returns string length',
//       result: inputString.length.toString()
//     },
//     {
//       name: 'capitalize()',
//       description: 'Capitalizes first character',
//       result: inputString.charAt(0).toUpperCase() + inputString.slice(1)
//     },
//     {
//       name: 'split()',
//       description: 'Splits string into list by whitespace',
//       result: JSON.stringify(inputString.split(' '))
//     }
//   ];

//   const getPreviewText = (text) => {
//     if (text.length <= STRING_PREVIEW_LENGTH) return text;
//     return `${text.slice(0, STRING_PREVIEW_LENGTH)}...`;
//   };

//   const handleModalClick = (e) => {
//     if (e.target === e.currentTarget) {
//       setIsModalOpen(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <div className={styles.cardHeader}>
//           <h2 className={styles.cardTitle}>Python String Operations</h2>
//         </div>
//         <div className={styles.cardContent}>
//           <div className={styles.inputContainer}>
//             <label className={styles.label} htmlFor="input">Input String:</label>
//             <div className={styles.inputWrapper}>
//               <input
//                 id="input"
//                 className={styles.input}
//                 value={getPreviewText(inputString)}
//                 readOnly
//                 onClick={() => setIsModalOpen(true)}
//                 placeholder="Enter a string..."
//               />
//               <button 
//                 className={styles.button}
//                 onClick={() => setInputString('Hello, World!')}
//               >
//                 Reset
//               </button>
//             </div>
//           </div>

//           <div className={styles.operationsGrid}>
//             {stringOperations.map((op) => (
//               <div key={op.name} className={styles.operationCard}>
//                 <div className={styles.operationHeader}>
//                   <span className={styles.operationName}>{op.name}</span>
//                   <span className={styles.operationDescription}>{op.description}</span>
//                 </div>
//                 <div className={styles.operationResult}>
//                   {op.result}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className={styles.modal} onClick={handleModalClick}>
//           <div className={styles.modalContent}>
//             <div className={styles.modalHeader}>
//               <h3 className={styles.modalTitle}>Edit Input String</h3>
//             </div>
//             <textarea
//               value={inputString}
//               onChange={(e) => setInputString(e.target.value)}
//               className={styles.textarea}
//               placeholder="Enter your text here..."
//             />
//             <div className={styles.charCount}>
//               Current length: {inputString.length} characters
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StringProcessor;


import React, { useState } from 'react';
import styles from './StringProcessor.module.css';

const STRING_PREVIEW_LENGTH = 50;

const ResetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 7.5C3.5 5.01472 5.51472 3 8 3C10.4853 3 12.5 5.01472 12.5 7.5C12.5 9.98528 10.4853 12 8 12" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 1V3M8 12V14M2 8H4M12 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 12L8 14L6 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PythonStringProcessor = () => {
  const [inputString, setInputString] = useState('Hello, World!');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempString, setTempString] = useState('');

  const stringOperations = [
    {
      name: 'upper()',
      description: 'Converts string to uppercase',
      result: inputString.toUpperCase()
    },
    {
      name: 'lower()',
      description: 'Converts string to lowercase',
      result: inputString.toLowerCase()
    },
    {
      name: 'strip()',
      description: 'Removes leading and trailing whitespace',
      result: inputString.trim()
    },
    {
      name: 'len()',
      description: 'Returns string length',
      result: inputString.length.toString()
    },
    {
      name: 'capitalize()',
      description: 'Capitalizes first character',
      result: inputString.charAt(0).toUpperCase() + inputString.slice(1)
    },
    {
      name: 'split()',
      description: 'Splits string into list by whitespace',
      result: JSON.stringify(inputString.split(' '))
    }
  ];

  const getPreviewText = (text) => {
    if (text.length <= STRING_PREVIEW_LENGTH) return text;
    return `${text.slice(0, STRING_PREVIEW_LENGTH)}...`;
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleOpenModal = () => {
    setTempString(inputString);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setTempString('');
    setIsModalOpen(false);
  };

  const handleDone = () => {
    setInputString(tempString);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Python String Operations</h2>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="input">Input String:</label>
            <div className={styles.inputWrapper}>
              <input
                id="input"
                className={styles.input}
                value={getPreviewText(inputString)}
                readOnly
                onClick={handleOpenModal}
                placeholder="Enter a string..."
              />
              <button 
                className={`${styles.button} ${styles.resetButton}`}
                onClick={() => setInputString('Hello, World!')}
              >
                <ResetIcon /> Reset
              </button>
            </div>
          </div>

          <div className={styles.operationsGrid}>
            {stringOperations.map((op) => (
              <div key={op.name} className={styles.operationCard}>
                <div className={styles.operationHeader}>
                  <span className={styles.operationName}>{op.name}</span>
                  <span className={styles.operationDescription}>{op.description}</span>
                </div>
                <div className={styles.operationResult}>
                  {op.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal} onClick={handleModalClick}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Input String</h3>
            </div>
            <textarea
              value={tempString}
              onChange={(e) => setTempString(e.target.value)}
              className={styles.textarea}
              placeholder="Enter your text here..."
              autoFocus
            />
            <div className={styles.charCount}>
              Current length: {tempString.length} characters
            </div>
            <div className={styles.modalActions}>
              <button 
                className={`${styles.button} ${styles.resetButton}`}
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button 
                className={`${styles.button} ${styles.doneButton}`}
                onClick={handleDone}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PythonStringProcessor;