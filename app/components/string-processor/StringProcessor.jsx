// // // // // // import React, { useState } from 'react';
// // // // // // import styles from './StringProcessor.module.css';

// // // // // // const STRING_PREVIEW_LENGTH = 50;

// // // // // // const ResetIcon = () => (
// // // // // //   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
// // // // // //     <path d="M3.5 7.5C3.5 5.01472 5.51472 3 8 3C10.4853 3 12.5 5.01472 12.5 7.5C12.5 9.98528 10.4853 12 8 12" 
// // // // // //           stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// // // // // //     <path d="M8 1V3M8 12V14M2 8H4M12 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// // // // // //     <path d="M6 12L8 14L6 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
// // // // // //   </svg>
// // // // // // );

// // // // // // const StringProcessor = ({ 
// // // // // //   language = 'Python',
// // // // // //   defaultString = 'Hello, World!',
// // // // // //   operations = [],
// // // // // //   title = 'String Operations'
// // // // // // }) => {
// // // // // //   const [inputString, setInputString] = useState(defaultString);
// // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // //   const [tempString, setTempString] = useState('');

// // // // // //   const getPreviewText = (text) => {
// // // // // //     if (text.length <= STRING_PREVIEW_LENGTH) return text;
// // // // // //     return `${text.slice(0, STRING_PREVIEW_LENGTH)}...`;
// // // // // //   };

// // // // // //   const handleModalClick = (e) => {
// // // // // //     if (e.target === e.currentTarget) {
// // // // // //       handleCloseModal();
// // // // // //     }
// // // // // //   };

// // // // // //   const handleOpenModal = () => {
// // // // // //     setTempString(inputString);
// // // // // //     setIsModalOpen(true);
// // // // // //   };

// // // // // //   const handleCloseModal = () => {
// // // // // //     setTempString('');
// // // // // //     setIsModalOpen(false);
// // // // // //   };

// // // // // //   const handleDone = () => {
// // // // // //     setInputString(tempString);
// // // // // //     setIsModalOpen(false);
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className={styles.container}>
// // // // // //       <div className={styles.card}>
// // // // // //         <div className={styles.cardHeader}>
// // // // // //           <h2 className={styles.cardTitle}>{language} {title}</h2>
// // // // // //         </div>
// // // // // //         <div className={styles.cardContent}>
// // // // // //           <div className={styles.inputContainer}>
// // // // // //             <label className={styles.label} htmlFor="input">Input String:</label>
// // // // // //             <div className={styles.inputWrapper}>
// // // // // //               <input
// // // // // //                 id="input"
// // // // // //                 className={styles.input}
// // // // // //                 value={getPreviewText(inputString)}
// // // // // //                 readOnly
// // // // // //                 onClick={handleOpenModal}
// // // // // //                 placeholder="Enter a string..."
// // // // // //               />
// // // // // //               <button 
// // // // // //                 className={`${styles.button} ${styles.resetButton}`}
// // // // // //                 onClick={() => setInputString(defaultString)}
// // // // // //               >
// // // // // //                 <ResetIcon /> Reset
// // // // // //               </button>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           <div className={styles.operationsGrid}>
// // // // // //             {operations.map((op) => (
// // // // // //               <div key={op.name} className={styles.operationCard}>
// // // // // //                 <div className={styles.operationHeader}>
// // // // // //                   <span className={styles.operationName}>{op.name}</span>
// // // // // //                   <span className={styles.operationDescription}>{op.description}</span>
// // // // // //                 </div>
// // // // // //                 <div className={styles.operationResult}>
// // // // // //                   {op.operation(inputString)}
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             ))}
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {isModalOpen && (
// // // // // //         <div className={styles.modal} onClick={handleModalClick}>
// // // // // //           <div className={styles.modalContent}>
// // // // // //             <div className={styles.modalHeader}>
// // // // // //               <h3 className={styles.modalTitle}>Edit Input String</h3>
// // // // // //             </div>
// // // // // //             <textarea
// // // // // //               value={tempString}
// // // // // //               onChange={(e) => setTempString(e.target.value)}
// // // // // //               className={styles.textarea}
// // // // // //               placeholder="Enter your text here..."
// // // // // //               autoFocus
// // // // // //             />
// // // // // //             <div className={styles.charCount}>
// // // // // //               Current length: {tempString.length} characters
// // // // // //             </div>
// // // // // //             <div className={styles.modalActions}>
// // // // // //               <button 
// // // // // //                 className={`${styles.button} ${styles.resetButton}`}
// // // // // //                 onClick={handleCloseModal}
// // // // // //               >
// // // // // //                 Cancel
// // // // // //               </button>
// // // // // //               <button 
// // // // // //                 className={`${styles.button} ${styles.doneButton}`}
// // // // // //                 onClick={handleDone}
// // // // // //               >
// // // // // //                 Done
// // // // // //               </button>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default StringProcessor;

// // // // // // StringProcessor/index.jsx
// // // // // // import React, { useState, useCallback } from 'react';
// // // // // // import styles from './StringProcessor.module.css';
// // // // // // import { examplePythonOperations } from './operations';

// // // // // // const ResetIcon = () => (
// // // // // //   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
// // // // // //     <path d="M3.5 7.5C3.5 5.01472 5.51472 3 8 3C10.4853 3 12.5 5.01472 12.5 7.5C12.5 9.98528 10.4853 12 8 12" 
// // // // // //           stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// // // // // //     <path d="M8 1V3M8 12V14M2 8H4M12 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// // // // // //     <path d="M6 12L8 14L6 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
// // // // // //   </svg>
// // // // // // );

// // // // // // const OperationCard = ({ operation, inputString }) => {
// // // // // //   const { name, format, description, operation: operationFn } = operation;

// // // // // //   const formatOperation = useCallback((op, str) => {
// // // // // //     switch (op.format) {
// // // // // //       case 'dot':
// // // // // //         return `${str}.${op.name}`;
// // // // // //       case 'function':
// // // // // //         return `${op.name}(${str})`;
// // // // // //       default:
// // // // // //         return op.name;
// // // // // //     }
// // // // // //   }, []);

// // // // // //   return (
// // // // // //     <div className={styles.operationCard}>
// // // // // //       <div className={styles.operationHeader}>
// // // // // //         <div className={styles.operationInfo}>
// // // // // //           <span className={styles.operationName}>
// // // // // //             {name}
// // // // // //           </span>
// // // // // //           <span className={styles.operationFormat}>
// // // // // //             Format: {formatOperation(operation, 'str')}
// // // // // //           </span>
// // // // // //         </div>
// // // // // //         <span className={styles.operationDescription}>{description}</span>
// // // // // //       </div>
// // // // // //       <div className={styles.operationResult}>
// // // // // //         {operationFn(inputString)}
// // // // // //       </div>
// // // // // //       <div className={styles.operationExample}>
// // // // // //         Example with current input: {formatOperation(operation, `"${inputString}"`)}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // const Modal = ({ isOpen, onClose, onDone, value, onChange }) => {
// // // // // //   if (!isOpen) return null;

// // // // // //   const handleModalClick = (e) => {
// // // // // //     if (e.target === e.currentTarget) {
// // // // // //       onClose();
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className={styles.modal} onClick={handleModalClick}>
// // // // // //       <div className={styles.modalContent}>
// // // // // //         <div className={styles.modalHeader}>
// // // // // //           <h3 className={styles.modalTitle}>Edit Input String</h3>
// // // // // //         </div>
// // // // // //         <textarea
// // // // // //           value={value}
// // // // // //           onChange={e => onChange(e.target.value)}
// // // // // //           className={styles.textarea}
// // // // // //           placeholder="Enter your text here..."
// // // // // //           autoFocus
// // // // // //         />
// // // // // //         <div className={styles.charCount}>
// // // // // //           Current length: {value.length} characters
// // // // // //         </div>
// // // // // //         <div className={styles.modalActions}>
// // // // // //           <button 
// // // // // //             className={`${styles.button} ${styles.resetButton}`}
// // // // // //             onClick={onClose}
// // // // // //           >
// // // // // //             Cancel
// // // // // //           </button>
// // // // // //           <button 
// // // // // //             className={`${styles.button} ${styles.doneButton}`}
// // // // // //             onClick={onDone}
// // // // // //           >
// // // // // //             Done
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // const StringProcessor = ({ 
// // // // // //   language = 'Python',
// // // // // //   defaultString = 'Hello, World!',
// // // // // //   operations = examplePythonOperations,
// // // // // //   title = 'String Operations'
// // // // // // }) => {
// // // // // //   const [inputString, setInputString] = useState(defaultString);
// // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // //   const [tempString, setTempString] = useState('');

// // // // // //   const STRING_PREVIEW_LENGTH = 50;

// // // // // //   const getPreviewText = useCallback((text) => {
// // // // // //     if (text.length <= STRING_PREVIEW_LENGTH) return text;
// // // // // //     return `${text.slice(0, STRING_PREVIEW_LENGTH)}...`;
// // // // // //   }, []);

// // // // // //   const handleOpenModal = () => {
// // // // // //     setTempString(inputString);
// // // // // //     setIsModalOpen(true);
// // // // // //   };

// // // // // //   const handleCloseModal = () => {
// // // // // //     setTempString('');
// // // // // //     setIsModalOpen(false);
// // // // // //   };

// // // // // //   const handleDone = () => {
// // // // // //     setInputString(tempString);
// // // // // //     setIsModalOpen(false);
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className={styles.container}>
// // // // // //       <div className={styles.card}>
// // // // // //         <div className={styles.cardHeader}>
// // // // // //           <h2 className={styles.cardTitle}>{language} {title}</h2>
// // // // // //         </div>
// // // // // //         <div className={styles.cardContent}>
// // // // // //           <div className={styles.inputContainer}>
// // // // // //             <label className={styles.label} htmlFor="input">Input String:</label>
// // // // // //             <div className={styles.inputWrapper}>
// // // // // //               <input
// // // // // //                 id="input"
// // // // // //                 className={styles.input}
// // // // // //                 value={getPreviewText(inputString)}
// // // // // //                 readOnly
// // // // // //                 onClick={handleOpenModal}
// // // // // //                 placeholder="Enter a string..."
// // // // // //               />
// // // // // //               <button 
// // // // // //                 className={`${styles.button} ${styles.resetButton}`}
// // // // // //                 onClick={() => setInputString(defaultString)}
// // // // // //               >
// // // // // //                 <ResetIcon /> Reset
// // // // // //               </button>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           <div className={styles.operationsGrid}>
// // // // // //             {operations.map((op) => (
// // // // // //               <OperationCard 
// // // // // //                 key={op.name} 
// // // // // //                 operation={op} 
// // // // // //                 inputString={inputString}
// // // // // //               />
// // // // // //             ))}
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       <Modal 
// // // // // //         isOpen={isModalOpen}
// // // // // //         onClose={handleCloseModal}
// // // // // //         onDone={handleDone}
// // // // // //         value={tempString}
// // // // // //         onChange={setTempString}
// // // // // //       />
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default StringProcessor;

// // // // // // import React, { useState, useCallback } from 'react';
// // // // // // import styles from './StringProcessor.module.css';

// // // // // // const ResetIcon = () => (
// // // // // //   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
// // // // // //     <path d="M3.5 7.5C3.5 5.01472 5.51472 3 8 3C10.4853 3 12.5 5.01472 12.5 7.5C12.5 9.98528 10.4853 12 8 12" 
// // // // // //           stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// // // // // //     <path d="M8 1V3M8 12V14M2 8H4M12 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// // // // // //     <path d="M6 12L8 14L6 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
// // // // // //   </svg>
// // // // // // );

// // // // // // const OperationCard = ({ operation, inputString }) => {
// // // // // //   const { name, format, description, operation: operationFn } = operation;

// // // // // //   const formatOperation = useCallback((op, str) => {
// // // // // //     switch (op.format) {
// // // // // //       case 'dot':
// // // // // //         return `${str}.${op.name}`;
// // // // // //       case 'function':
// // // // // //         return `${op.name}(${str})`;
// // // // // //       default:
// // // // // //         return op.name;
// // // // // //     }
// // // // // //   }, []);

// // // // // //   return (
// // // // // //     <div className={styles.operationCard}>
// // // // // //       <div className={styles.operationHeader}>
// // // // // //         <div className={styles.operationInfo}>
// // // // // //           <span className={styles.operationName}>
// // // // // //             {name}
// // // // // //           </span>
// // // // // //           <span className={styles.operationFormat}>
// // // // // //             Format: {formatOperation(operation, 'str')}
// // // // // //           </span>
// // // // // //         </div>
// // // // // //         <span className={styles.operationDescription}>{description}</span>
// // // // // //       </div>
// // // // // //       <div className={styles.operationResult}>
// // // // // //         {operationFn(inputString)}
// // // // // //       </div>
// // // // // //       <div className={styles.operationExample}>
// // // // // //         Example with current input: {formatOperation(operation, `"${inputString}"`)}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // const Modal = ({ isOpen, onClose, onDone, value, onChange }) => {
// // // // // //   if (!isOpen) return null;

// // // // // //   const handleModalClick = (e) => {
// // // // // //     if (e.target === e.currentTarget) {
// // // // // //       onClose();
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className={styles.modal} onClick={handleModalClick}>
// // // // // //       <div className={styles.modalContent}>
// // // // // //         <div className={styles.modalHeader}>
// // // // // //           <h3 className={styles.modalTitle}>Edit Input String</h3>
// // // // // //         </div>
// // // // // //         <textarea
// // // // // //           value={value}
// // // // // //           onChange={e => onChange(e.target.value)}
// // // // // //           className={styles.textarea}
// // // // // //           placeholder="Enter your text here..."
// // // // // //           autoFocus
// // // // // //         />
// // // // // //         <div className={styles.charCount}>
// // // // // //           Current length: {value.length} characters
// // // // // //         </div>
// // // // // //         <div className={styles.modalActions}>
// // // // // //           <button 
// // // // // //             className={`${styles.button} ${styles.resetButton}`}
// // // // // //             onClick={onClose}
// // // // // //           >
// // // // // //             Cancel
// // // // // //           </button>
// // // // // //           <button 
// // // // // //             className={`${styles.button} ${styles.doneButton}`}
// // // // // //             onClick={onDone}
// // // // // //           >
// // // // // //             Done
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // const StringProcessor = ({ 
// // // // // //   language = 'Python',
// // // // // //   defaultString = 'Hello, World!',
// // // // // //   operations = [],
// // // // // //   title = 'String Operations'
// // // // // // }) => {
// // // // // //   const [inputString, setInputString] = useState(defaultString);
// // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // //   const [tempString, setTempString] = useState('');

// // // // // //   const STRING_PREVIEW_LENGTH = 50;

// // // // // //   const getPreviewText = useCallback((text) => {
// // // // // //     if (text.length <= STRING_PREVIEW_LENGTH) return text;
// // // // // //     return `${text.slice(0, STRING_PREVIEW_LENGTH)}...`;
// // // // // //   }, []);

// // // // // //   const handleOpenModal = () => {
// // // // // //     setTempString(inputString);
// // // // // //     setIsModalOpen(true);
// // // // // //   };

// // // // // //   const handleCloseModal = () => {
// // // // // //     setTempString('');
// // // // // //     setIsModalOpen(false);
// // // // // //   };

// // // // // //   const handleDone = () => {
// // // // // //     setInputString(tempString);
// // // // // //     setIsModalOpen(false);
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className={styles.container}>
// // // // // //       <div className={styles.card}>
// // // // // //         <div className={styles.cardHeader}>
// // // // // //           <h2 className={styles.cardTitle}>{language} {title}</h2>
// // // // // //         </div>
// // // // // //         <div className={styles.cardContent}>
// // // // // //           <div className={styles.inputContainer}>
// // // // // //             <label className={styles.label} htmlFor="input">Input String:</label>
// // // // // //             <div className={styles.inputWrapper}>
// // // // // //               <input
// // // // // //                 id="input"
// // // // // //                 className={styles.input}
// // // // // //                 value={getPreviewText(inputString)}
// // // // // //                 readOnly
// // // // // //                 onClick={handleOpenModal}
// // // // // //                 placeholder="Enter a string..."
// // // // // //               />
// // // // // //               <button 
// // // // // //                 className={`${styles.button} ${styles.resetButton}`}
// // // // // //                 onClick={() => setInputString(defaultString)}
// // // // // //               >
// // // // // //                 <ResetIcon /> Reset
// // // // // //               </button>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           <div className={styles.operationsGrid}>
// // // // // //             {operations.map((op) => (
// // // // // //               <OperationCard 
// // // // // //                 key={op.name} 
// // // // // //                 operation={op} 
// // // // // //                 inputString={inputString}
// // // // // //               />
// // // // // //             ))}
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       <Modal 
// // // // // //         isOpen={isModalOpen}
// // // // // //         onClose={handleCloseModal}
// // // // // //         onDone={handleDone}
// // // // // //         value={tempString}
// // // // // //         onChange={setTempString}
// // // // // //       />
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default StringProcessor;

// // // // // import React, { useState, useCallback } from 'react';
// // // // // import styles from './StringProcessor.module.css';

// // // // // const ResetIcon = () => (
// // // // //   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
// // // // //     <path d="M3.5 7.5C3.5 5.01472 5.51472 3 8 3C10.4853 3 12.5 5.01472 12.5 7.5C12.5 9.98528 10.4853 12 8 12" 
// // // // //           stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// // // // //     <path d="M8 1V3M8 12V14M2 8H4M12 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// // // // //     <path d="M6 12L8 14L6 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
// // // // //   </svg>
// // // // // );

// // // // // const OperationCard = ({ operation, inputString }) => {
// // // // //   const { name, format, description, operation: operationFn } = operation;

// // // // //   const formatOperation = useCallback((op, str) => {
// // // // //     switch (op.format) {
// // // // //       case 'dot':
// // // // //         return `${str}.${op.name}`;
// // // // //       case 'function':
// // // // //         return `${op.name}(${str})`;
// // // // //       default:
// // // // //         return op.name;
// // // // //     }
// // // // //   }, []);

// // // // //   return (
// // // // //     <div className={styles.operationCard}>
// // // // //       <div className={styles.operationHeader}>
// // // // //         <div className={styles.operationInfo}>
// // // // //           <span className={styles.operationName}>
// // // // //             {name} <code>{formatOperation(operation, 'str')}</code>
// // // // //           </span>
// // // // //         </div>
// // // // //         <span className={styles.operationDescription}>{description}</span>
// // // // //       </div>
// // // // //       <div className={styles.operationResult}>
// // // // //         {operationFn(inputString)}
// // // // //       </div>
// // // // //       <div className={styles.operationExample}>
// // // // //         Example with current input: {formatOperation(operation, `"${inputString}"`)}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // const Modal = ({ isOpen, onClose, onDone, value, onChange }) => {
// // // // //   if (!isOpen) return null;

// // // // //   const handleModalClick = (e) => {
// // // // //     if (e.target === e.currentTarget) {
// // // // //       onClose();
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className={styles.modal} onClick={handleModalClick}>
// // // // //       <div className={styles.modalContent}>
// // // // //         <div className={styles.modalHeader}>
// // // // //           <h3 className={styles.modalTitle}>Edit Input String</h3>
// // // // //         </div>
// // // // //         <textarea
// // // // //           value={value}
// // // // //           onChange={e => onChange(e.target.value)}
// // // // //           className={styles.textarea}
// // // // //           placeholder="Enter your text here..."
// // // // //           autoFocus
// // // // //         />
// // // // //         <div className={styles.charCount}>
// // // // //           Current length: {value.length} characters
// // // // //         </div>
// // // // //         <div className={styles.modalActions}>
// // // // //           <button 
// // // // //             className={`${styles.button} ${styles.resetButton}`}
// // // // //             onClick={onClose}
// // // // //           >
// // // // //             Cancel
// // // // //           </button>
// // // // //           <button 
// // // // //             className={`${styles.button} ${styles.doneButton}`}
// // // // //             onClick={onDone}
// // // // //           >
// // // // //             Done
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // const StringProcessor = ({ 
// // // // //   language = 'Python',
// // // // //   defaultString = 'Hello, World!',
// // // // //   operations = [],
// // // // //   title = 'String Operations'
// // // // // }) => {
// // // // //   const [inputString, setInputString] = useState(defaultString);
// // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // //   const [tempString, setTempString] = useState('');

// // // // //   const STRING_PREVIEW_LENGTH = 50;

// // // // //   const getPreviewText = useCallback((text) => {
// // // // //     if (text.length <= STRING_PREVIEW_LENGTH) return text;
// // // // //     return `${text.slice(0, STRING_PREVIEW_LENGTH)}...`;
// // // // //   }, []);

// // // // //   const handleOpenModal = () => {
// // // // //     setTempString(inputString);
// // // // //     setIsModalOpen(true);
// // // // //   };

// // // // //   const handleCloseModal = () => {
// // // // //     setTempString('');
// // // // //     setIsModalOpen(false);
// // // // //   };

// // // // //   const handleDone = () => {
// // // // //     setInputString(tempString);
// // // // //     setIsModalOpen(false);
// // // // //   };

// // // // //   return (
// // // // //     <div className={styles.container}>
// // // // //       <div className={styles.card}>
// // // // //         <div className={styles.cardHeader}>
// // // // //           <h2 className={styles.cardTitle}>{language} {title}</h2>
// // // // //         </div>
// // // // //         <div className={styles.cardContent}>
// // // // //           <div className={styles.inputContainer}>
// // // // //             <label className={styles.label} htmlFor="input">Input String:</label>
// // // // //             <div className={styles.inputWrapper}>
// // // // //               <input
// // // // //                 id="input"
// // // // //                 className={styles.input}
// // // // //                 value={getPreviewText(inputString)}
// // // // //                 readOnly
// // // // //                 onClick={handleOpenModal}
// // // // //                 placeholder="Enter a string..."
// // // // //               />
// // // // //               <button 
// // // // //                 className={`${styles.button} ${styles.resetButton}`}
// // // // //                 onClick={() => setInputString(defaultString)}
// // // // //               >
// // // // //                 <ResetIcon /> Reset
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>

// // // // //           <div className={styles.operationsGrid}>
// // // // //             {operations.map((op) => (
// // // // //               <OperationCard 
// // // // //                 key={op.name} 
// // // // //                 operation={op} 
// // // // //                 inputString={inputString}
// // // // //               />
// // // // //             ))}
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       <Modal 
// // // // //         isOpen={isModalOpen}
// // // // //         onClose={handleCloseModal}
// // // // //         onDone={handleDone}
// // // // //         value={tempString}
// // // // //         onChange={setTempString}
// // // // //       />
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default StringProcessor;

// // // // import React, { useState, useCallback } from 'react';
// // // // import styles from './StringProcessor.module.css';

// // // // const ResetIcon = () => (
// // // //   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
// // // //     <path d="M3.5 7.5C3.5 5.01472 5.51472 3 8 3C10.4853 3 12.5 5.01472 12.5 7.5C12.5 9.98528 10.4853 12 8 12" 
// // // //           stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// // // //     <path d="M8 1V3M8 12V14M2 8H4M12 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// // // //     <path d="M6 12L8 14L6 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
// // // //   </svg>
// // // // );

// // // // // const OperationCard = ({ operation, inputString }) => {
// // // // //   const { name, format, description, operation: operationFn } = operation;

// // // // //   const formatOperation = useCallback((op, str) => {
// // // // //     switch (op.format) {
// // // // //       case 'dot':
// // // // //         return `${str}.${op.name}`;
// // // // //       case 'function':
// // // // //         return `${op.name}(${str})`;
// // // // //       default:
// // // // //         return op.name;
// // // // //     }
// // // // //   }, []);

// // // // //   return (
// // // // //     <div className={styles.operationCard}>
// // // // //       <div className={styles.operationHeader}>
// // // // //         <div className={styles.operationInfo}>
// // // // //           <span className={styles.operationName}>
// // // // //              <code>{formatOperation(operation, 'str')}</code>
// // // // //           </span>
// // // // //         </div>
// // // // //         <span className={styles.operationDescription}>{description}</span>
// // // // //       </div>
// // // // //       <div className={styles.operationResult}>
// // // // //         {operationFn(inputString)}
// // // // //       </div>
// // // // //       <div className={styles.operationExample}>
// // // // //         Example with current input: {formatOperation(operation, `"${inputString}"`)}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // const OperationCard = ({ operation, inputString }) => {
// // // //     const { format, description, operation: operationFn, args = [] } = operation;
// // // //     const [argValues, setArgValues] = useState(args.map(arg => arg.default || ''));
  
// // // //     const formatOperation = useCallback((op, str) => {
// // // //       const argStr = args.length > 0 
// // // //         ? `, ${argValues.join(', ')}` 
// // // //         : '';
  
// // // //       switch (op.format) {
// // // //         case 'dot':
// // // //           return `${str}.${op.name}${argStr ? `(${argStr.slice(2)})` : ''}`;
// // // //         case 'function':
// // // //           return `${op.name}(${str}${argStr})`;
// // // //         default:
// // // //           return op.name;
// // // //       }
// // // //     }, [args, argValues]);
  
// // // //     const handleArgChange = (index, value) => {
// // // //       const newArgs = [...argValues];
// // // //       newArgs[index] = value;
// // // //       setArgValues(newArgs);
// // // //     };
  
// // // //     return (
// // // //       <div className={styles.operationCard}>
// // // //         <div className={styles.operationHeader}>
// // // //           <div className={styles.operationInfo}>
// // // //             <span className={styles.operationName}>
// // // //               <code>{formatOperation(operation, 'str')}</code>
// // // //             </span>
// // // //             {args.length > 0 && (
// // // //               <div className={styles.argsContainer}>
// // // //                 {args.map((arg, index) => (
// // // //                   <div key={arg.name} className={styles.argInput}>
// // // //                     <label>{arg.name}:</label>
// // // //                     <input
// // // //                       type={arg.type}
// // // //                       value={argValues[index]}
// // // //                       onChange={(e) => handleArgChange(index, e.target.value)}
// // // //                       placeholder={arg.placeholder || arg.type}
// // // //                     />
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //           <span className={styles.operationDescription}>{description}</span>
// // // //         </div>
// // // //         <div className={styles.operationResult}>
// // // //           {operationFn(inputString, ...argValues)}
// // // //         </div>
// // // //         <div className={styles.operationExample}>
// // // //           Example with current input: {formatOperation(operation, `"${inputString}"`)}
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   };

// // // // const Modal = ({ isOpen, onClose, onDone, value, onChange }) => {
// // // //   if (!isOpen) return null;

// // // //   const handleModalClick = (e) => {
// // // //     if (e.target === e.currentTarget) {
// // // //       onClose();
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className={styles.modal} onClick={handleModalClick}>
// // // //       <div className={styles.modalContent}>
// // // //         <div className={styles.modalHeader}>
// // // //           <h3 className={styles.modalTitle}>Edit Input String</h3>
// // // //         </div>
// // // //         <textarea
// // // //           value={value}
// // // //           onChange={e => onChange(e.target.value)}
// // // //           className={styles.textarea}
// // // //           placeholder="Enter your text here..."
// // // //           autoFocus
// // // //         />
// // // //         <div className={styles.charCount}>
// // // //           Current length: {value.length} characters
// // // //         </div>
// // // //         <div className={styles.modalActions}>
// // // //           <button 
// // // //             className={`${styles.button} ${styles.resetButton}`}
// // // //             onClick={onClose}
// // // //           >
// // // //             Cancel
// // // //           </button>
// // // //           <button 
// // // //             className={`${styles.button} ${styles.doneButton}`}
// // // //             onClick={onDone}
// // // //           >
// // // //             Done
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // const StringProcessor = ({ 
// // // //   language = 'Python',
// // // //   defaultString = 'Hello, World!',
// // // //   operations = [],
// // // //   title = 'String Operations'
// // // // }) => {
// // // //   const [inputString, setInputString] = useState(defaultString);
// // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // //   const [tempString, setTempString] = useState('');

// // // //   const STRING_PREVIEW_LENGTH = 50;

// // // //   const getPreviewText = useCallback((text) => {
// // // //     if (text.length <= STRING_PREVIEW_LENGTH) return text;
// // // //     return `${text.slice(0, STRING_PREVIEW_LENGTH)}...`;
// // // //   }, []);

// // // //   const handleOpenModal = () => {
// // // //     setTempString(inputString);
// // // //     setIsModalOpen(true);
// // // //   };

// // // //   const handleCloseModal = () => {
// // // //     setTempString('');
// // // //     setIsModalOpen(false);
// // // //   };

// // // //   const handleDone = () => {
// // // //     setInputString(tempString);
// // // //     setIsModalOpen(false);
// // // //   };

// // // //   return (
// // // //     <div className={styles.container}>
// // // //       <div className={styles.card}>
// // // //         <div className={styles.cardHeader}>
// // // //           <h2 className={styles.cardTitle}>{language} {title}</h2>
// // // //         </div>
// // // //         <div className={styles.cardContent}>
// // // //           <div className={styles.inputContainer}>
// // // //             <label className={styles.label} htmlFor="input">Input String:</label>
// // // //             <div className={styles.inputWrapper}>
// // // //               <input
// // // //                 id="input"
// // // //                 className={styles.input}
// // // //                 value={getPreviewText(inputString)}
// // // //                 readOnly
// // // //                 onClick={handleOpenModal}
// // // //                 placeholder="Enter a string..."
// // // //               />
// // // //               <button 
// // // //                 className={`${styles.button} ${styles.resetButton}`}
// // // //                 onClick={() => setInputString(defaultString)}
// // // //               >
// // // //                 <ResetIcon /> Reset
// // // //               </button>
// // // //             </div>
// // // //           </div>

// // // //           <div className={styles.operationsGrid}>
// // // //             {operations.map((op) => (
// // // //               <OperationCard 
// // // //                 key={op.name} 
// // // //                 operation={op} 
// // // //                 inputString={inputString}
// // // //               />
// // // //             ))}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <Modal 
// // // //         isOpen={isModalOpen}
// // // //         onClose={handleCloseModal}
// // // //         onDone={handleDone}
// // // //         value={tempString}
// // // //         onChange={setTempString}
// // // //       />
// // // //     </div>
// // // //   );
// // // // };

// // // // export default StringProcessor;

// // // import React, { useState, useCallback } from 'react';
// // // import styles from './StringProcessor.module.css';

// // // const ResetIcon = () => (
// // //   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
// // //     <path d="M3.5 7.5C3.5 5.01472 5.51472 3 8 3C10.4853 3 12.5 5.01472 12.5 7.5C12.5 9.98528 10.4853 12 8 12" 
// // //           stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// // //     <path d="M8 1V3M8 12V14M2 8H4M12 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// // //     <path d="M6 12L8 14L6 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
// // //   </svg>
// // // );

// // // const OperationCard = ({ operation, inputString }) => {
// // //   const { format, description, operation: operationFn, args = [] } = operation;
// // //   const [argValues, setArgValues] = useState(args.map(arg => arg.default || ''));

// // //   const formatOperation = useCallback((op, str) => {
// // //     const argStr = args.length > 0 
// // //       ? `, ${argValues.join(', ')}` 
// // //       : '';

// // //     switch (op.format) {
// // //       case 'dot':
// // //         return `${str}.${op.name}${argStr ? `(${argStr.slice(2)})` : ''}`;
// // //       case 'function':
// // //         return `${op.name}(${str}${argStr})`;
// // //       default:
// // //         return op.name;
// // //     }
// // //   }, [args, argValues]);

// // //   const handleArgChange = (index, value) => {
// // //     const newArgs = [...argValues];
// // //     newArgs[index] = value;
// // //     setArgValues(newArgs);
// // //   };

// // //   return (
// // //     <div className={styles.operationCard}>
// // //       <div className={styles.operationHeader}>
// // //         <div className={styles.operationInfo}>
// // //           <span className={styles.operationName}>
// // //             <code>{formatOperation(operation, 'str')}</code>
// // //           </span>
// // //           {args.length > 0 && (
// // //             <div className={styles.argsContainer}>
// // //               {args.map((arg, index) => (
// // //                 <div key={arg.name} className={styles.argInput}>
// // //                   <label>{arg.name}:</label>
// // //                   <input
// // //                     type={arg.type}
// // //                     value={argValues[index]}
// // //                     onChange={(e) => handleArgChange(index, e.target.value)}
// // //                     placeholder={arg.placeholder || arg.type}
// // //                   />
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}
// // //         </div>
// // //         <span className={styles.operationDescription}>{description}</span>
// // //       </div>
// // //       <div className={styles.operationResult}>
// // //         {operationFn(inputString, ...argValues)}
// // //       </div>
// // //       <div className={styles.operationExample}>
// // //         Example with current input: {formatOperation(operation, `"${inputString}"`)}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // const Modal = ({ isOpen, onClose, onDone, value, onChange }) => {
// // //   if (!isOpen) return null;

// // //   const handleModalClick = (e) => {
// // //     if (e.target === e.currentTarget) {
// // //       onClose();
// // //     }
// // //   };

// // //   return (
// // //     <div className={styles.modal} onClick={handleModalClick}>
// // //       <div className={styles.modalContent}>
// // //         <div className={styles.modalHeader}>
// // //           <h3 className={styles.modalTitle}>Edit Input String</h3>
// // //         </div>
// // //         <textarea
// // //           value={value}
// // //           onChange={e => onChange(e.target.value)}
// // //           className={styles.textarea}
// // //           placeholder="Enter your text here..."
// // //           autoFocus
// // //         />
// // //         <div className={styles.charCount}>
// // //           Current length: {value.length} characters
// // //         </div>
// // //         <div className={styles.modalActions}>
// // //           <button 
// // //             className={`${styles.button} ${styles.resetButton}`}
// // //             onClick={onClose}
// // //           >
// // //             Cancel
// // //           </button>
// // //           <button 
// // //             className={`${styles.button} ${styles.doneButton}`}
// // //             onClick={onDone}
// // //           >
// // //             Done
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // const StringProcessor = ({ 
// // //   language = 'Python',
// // //   defaultString = 'Hello, World!',
// // //   operations = [
// // //     // Simple operations
// // //     {
// // //       name: 'upper',
// // //       format: 'dot',
// // //       description: 'Convert to uppercase',
// // //       operation: str => str.toUpperCase()
// // //     },
// // //     {
// // //       name: 'lower',
// // //       format: 'dot',
// // //       description: 'Convert to lowercase',
// // //       operation: str => str.toLowerCase()
// // //     },
// // //     // Operations with args
// // //     {
// // //       name: 'slice',
// // //       format: 'dot',
// // //       description: 'Extract part of string',
// // //       args: [
// // //         {name: 'start', type: 'number', default: 0},
// // //         {name: 'end', type: 'number', default: 1}
// // //       ],
// // //       operation: (str, start, end) => str.slice(start, end)
// // //     },
// // //     {
// // //       name: 'repeat',
// // //       format: 'dot',
// // //       description: 'Repeat string n times',
// // //       args: [{name: 'count', type: 'number', default: 2}],
// // //       operation: (str, count) => str.repeat(count)
// // //     },
// // //     {
// // //       name: 'padStart',
// // //       format: 'dot',
// // //       description: 'Pad string start to length',
// // //       args: [
// // //         {name: 'length', type: 'number', default: 10},
// // //         {name: 'pad', type: 'text', default: ' '}
// // //       ],
// // //       operation: (str, len, pad) => str.padStart(len, pad)
// // //     }
// // //   ],
// // //   title = 'String Operations'
// // // }) => {
// // //   const [inputString, setInputString] = useState(defaultString);
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [tempString, setTempString] = useState('');

// // //   const STRING_PREVIEW_LENGTH = 50;

// // //   const getPreviewText = useCallback((text) => {
// // //     if (text.length <= STRING_PREVIEW_LENGTH) return text;
// // //     return `${text.slice(0, STRING_PREVIEW_LENGTH)}...`;
// // //   }, []);

// // //   const handleOpenModal = () => {
// // //     setTempString(inputString);
// // //     setIsModalOpen(true);
// // //   };

// // //   const handleCloseModal = () => {
// // //     setTempString('');
// // //     setIsModalOpen(false);
// // //   };

// // //   const handleDone = () => {
// // //     setInputString(tempString);
// // //     setIsModalOpen(false);
// // //   };

// // //   return (
// // //     <div className={styles.container}>
// // //       <div className={styles.card}>
// // //         <div className={styles.cardHeader}>
// // //           <h2 className={styles.cardTitle}>{language} {title}</h2>
// // //         </div>
// // //         <div className={styles.cardContent}>
// // //           <div className={styles.inputContainer}>
// // //             <label className={styles.label} htmlFor="input">Input String:</label>
// // //             <div className={styles.inputWrapper}>
// // //               <input
// // //                 id="input"
// // //                 className={styles.input}
// // //                 value={getPreviewText(inputString)}
// // //                 readOnly
// // //                 onClick={handleOpenModal}
// // //                 placeholder="Enter a string..."
// // //               />
// // //               <button 
// // //                 className={`${styles.button} ${styles.resetButton}`}
// // //                 onClick={() => setInputString(defaultString)}
// // //               >
// // //                 <ResetIcon /> Reset
// // //               </button>
// // //             </div>
// // //           </div>

// // //           <div className={styles.operationsGrid}>
// // //             {operations.map((op) => (
// // //               <OperationCard 
// // //                 key={op.name} 
// // //                 operation={op} 
// // //                 inputString={inputString}
// // //               />
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <Modal 
// // //         isOpen={isModalOpen}
// // //         onClose={handleCloseModal}
// // //         onDone={handleDone}
// // //         value={tempString}
// // //         onChange={setTempString}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default StringProcessor;


// // import React, { useState, useCallback } from 'react';
// // import styles from './StringProcessor.module.css';

// // const ResetIcon = () => (
// //   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
// //     <path d="M3.5 7.5C3.5 5.01472 5.51472 3 8 3C10.4853 3 12.5 5.01472 12.5 7.5C12.5 9.98528 10.4853 12 8 12" 
// //           stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// //     <path d="M8 1V3M8 12V14M2 8H4M12 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
// //     <path d="M6 12L8 14L6 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
// //   </svg>
// // );

// // const OperationCard = ({ operation, inputString, baseUrl = '/' }) => {
// //   const { name, format, description, operation: operationFn, args = [] } = operation;
// //   const [argValues, setArgValues] = useState(args.map(arg => arg.default || ''));

// //   const formatOperation = useCallback((op, str) => {
// //     const argStr = args.length > 0 
// //       ? `, ${argValues.join(', ')}` 
// //       : '';

// //     switch (op.format) {
// //       case 'dot':
// //         return `${str}.${op.name}${argStr ? `(${argStr.slice(2)})` : ''}`;
// //       case 'function':
// //         return `${op.name}(${str}${argStr})`;
// //       default:
// //         return op.name;
// //     }
// //   }, [args, argValues]);

// //   const handleArgChange = (index, value) => {
// //     const newArgs = [...argValues];
// //     newArgs[index] = value;
// //     setArgValues(newArgs);
// //   };

// //   return (
// //     <div className={styles.operationCard}>
// //       <div className={styles.operationHeader}>
// //         <div className={styles.operationInfo}>
// //           <span className={styles.operationName}>
// //             <code>{formatOperation(operation, 'str')}</code>
// //           </span>
// //           {args.length > 0 && (
// //             <div className={styles.argsContainer}>
// //               {args.map((arg, index) => (
// //                 <div key={arg.name} className={styles.argInput}>
// //                   <label>{arg.name}:</label>
// //                   <input
// //                     type={arg.type}
// //                     value={argValues[index]}
// //                     onChange={(e) => handleArgChange(index, e.target.value)}
// //                     placeholder={arg.placeholder || arg.type}
// //                   />
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //         <span className={styles.operationDescription}>{description}</span>
// //       </div>
// //       <div className={styles.operationResult}>
// //         {operationFn(inputString, ...argValues)}
// //       </div>
// //       <div className={styles.operationExample}>
// //         Example with current input: {formatOperation(operation, `"${inputString}"`)}
// //       </div>
// //       <div className={styles.readMoreContainer}>
// //         <a href={`${baseUrl}${name}`} className={styles.readMoreButton}>
// //           Read More about {name}
// //         </a>
// //       </div>
// //     </div>
// //   );
// // };

// // const Modal = ({ isOpen, onClose, onDone, value, onChange }) => {
// //   if (!isOpen) return null;

// //   const handleModalClick = (e) => {
// //     if (e.target === e.currentTarget) {
// //       onClose();
// //     }
// //   };

// //   return (
// //     <div className={styles.modal} onClick={handleModalClick}>
// //       <div className={styles.modalContent}>
// //         <div className={styles.modalHeader}>
// //           <h3 className={styles.modalTitle}>Edit Input String</h3>
// //         </div>
// //         <textarea
// //           value={value}
// //           onChange={e => onChange(e.target.value)}
// //           className={styles.textarea}
// //           placeholder="Enter your text here..."
// //           autoFocus
// //         />
// //         <div className={styles.charCount}>
// //           Current length: {value.length} characters
// //         </div>
// //         <div className={styles.modalActions}>
// //           <button 
// //             className={`${styles.button} ${styles.resetButton}`}
// //             onClick={onClose}
// //           >
// //             Cancel
// //           </button>
// //           <button 
// //             className={`${styles.button} ${styles.doneButton}`}
// //             onClick={onDone}
// //           >
// //             Done
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const StringProcessor = ({ 
// //   language = 'Python',
// //   defaultString = 'Hello, World!',
// //   baseUrl = '/',
// //   operations = [
// //     // Simple operations
// //     {
// //       name: 'upper',
// //       format: 'dot',
// //       description: 'Convert to uppercase',
// //       operation: str => str.toUpperCase()
// //     },
// //     {
// //       name: 'lower',
// //       format: 'dot',
// //       description: 'Convert to lowercase',
// //       operation: str => str.toLowerCase()
// //     },
// //     // Operations with args
// //     {
// //       name: 'slice',
// //       format: 'dot',
// //       description: 'Extract part of string',
// //       args: [
// //         {name: 'start', type: 'number', default: 0},
// //         {name: 'end', type: 'number', default: 1}
// //       ],
// //       operation: (str, start, end) => str.slice(start, end)
// //     },
// //     {
// //       name: 'repeat',
// //       format: 'dot',
// //       description: 'Repeat string n times',
// //       args: [{name: 'count', type: 'number', default: 2}],
// //       operation: (str, count) => str.repeat(count)
// //     },
// //     {
// //       name: 'padStart',
// //       format: 'dot',
// //       description: 'Pad string start to length',
// //       args: [
// //         {name: 'length', type: 'number', default: 10},
// //         {name: 'pad', type: 'text', default: ' '}
// //       ],
// //       operation: (str, len, pad) => str.padStart(len, pad)
// //     }
// //   ],
// //   title = 'String Operations'
// // }) => {
// //   const [inputString, setInputString] = useState(defaultString);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [tempString, setTempString] = useState('');

// //   const STRING_PREVIEW_LENGTH = 50;

// //   const getPreviewText = useCallback((text) => {
// //     if (text.length <= STRING_PREVIEW_LENGTH) return text;
// //     return `${text.slice(0, STRING_PREVIEW_LENGTH)}...`;
// //   }, []);

// //   const handleOpenModal = () => {
// //     setTempString(inputString);
// //     setIsModalOpen(true);
// //   };

// //   const handleCloseModal = () => {
// //     setTempString('');
// //     setIsModalOpen(false);
// //   };

// //   const handleDone = () => {
// //     setInputString(tempString);
// //     setIsModalOpen(false);
// //   };

// //   return (
// //     <div className={styles.container}>
// //       <div className={styles.card}>
// //         <div className={styles.cardHeader}>
// //           <h2 className={styles.cardTitle}>{language} {title}</h2>
// //         </div>
// //         <div className={styles.cardContent}>
// //           <div className={styles.inputContainer}>
// //             <label className={styles.label} htmlFor="input">Input String:</label>
// //             <div className={styles.inputWrapper}>
// //               <input
// //                 id="input"
// //                 className={styles.input}
// //                 value={getPreviewText(inputString)}
// //                 readOnly
// //                 onClick={handleOpenModal}
// //                 placeholder="Enter a string..."
// //               />
// //               <button 
// //                 className={`${styles.button} ${styles.resetButton}`}
// //                 onClick={() => setInputString(defaultString)}
// //               >
// //                 <ResetIcon /> Reset
// //               </button>
// //             </div>
// //           </div>

// //           <div className={styles.operationsGrid}>
// //             {operations.map((op) => (
// //               <OperationCard 
// //                 key={op.name} 
// //                 operation={op} 
// //                 inputString={inputString}
// //                 baseUrl={baseUrl}
// //               />
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       <Modal 
// //         isOpen={isModalOpen}
// //         onClose={handleCloseModal}
// //         onDone={handleDone}
// //         value={tempString}
// //         onChange={setTempString}
// //       />
// //     </div>
// //   );
// // };

// // export default StringProcessor;

// import React, { useState, useCallback } from 'react';
// import styles from './StringProcessor.module.css';

// const ResetIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M3.5 7.5C3.5 5.01472 5.51472 3 8 3C10.4853 3 12.5 5.01472 12.5 7.5C12.5 9.98528 10.4853 12 8 12" 
//           stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//     <path d="M8 1V3M8 12V14M2 8H4M12 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//     <path d="M6 12L8 14L6 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

// const OperationCard = ({ operation, inputString, baseUrl = '/' }) => {
//   const { name, format, description, operation: operationFn, args = [] } = operation;
//   const [argValues, setArgValues] = useState(args.map(arg => arg.default || ''));

// //   const formatOperation = useCallback((op, str) => {
// //     const argStr = args.length > 0 
// //       ? ` ${argValues.join(' ')}` 
// //       : '';

// //     switch (op.format) {
// //       case 'dot':
// //         return `${str}.${op.name}${argStr}`;
// //       case 'function':
// //         return `${op.name} ${str}${argStr}`;
// //       default:
// //         return op.name;
// //     }
// //   }, [args, argValues]);

// const formatOperation = useCallback((op, str) => {
//     const argStr = args.length > 0 
//       ? ` ${argValues.join(' ')}` 
//       : '';
  
//     switch (op.format) {
//       case 'dot':
//         return `${str}.${op.name}${argStr}`;
//       case 'function':
//         return `${op.name} ${str}${argStr}`;
//       default:
//         return op.name;
//     }
//   }, [args, argValues]);  


// const handleArgChange = (index, value) => {
//     const newArgs = [...argValues];
//     newArgs[index] = value;
//     setArgValues(newArgs);
//   };

//   return (
//     <div className={styles.operationCard}>
//       <div className={styles.operationHeader}>
//         <div className={styles.operationInfo}>
//           <span className={styles.operationName}>
//             <code>{formatOperation(operation, 'str')}</code>
//           </span>
//           {args.length > 0 && (
//             <div className={styles.argsContainer}>
//               {args.map((arg, index) => (
//                 <div key={arg.name} className={styles.argInput}>
//                   <label>{arg.name}:</label>
//                   <input
//                     type={arg.type}
//                     value={argValues[index]}
//                     onChange={(e) => handleArgChange(index, e.target.value)}
//                     placeholder={arg.placeholder || arg.type}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <span className={styles.operationDescription}>{description}</span>
//       </div>
//       <div className={styles.operationResult}>
//         {operationFn(inputString, ...argValues)}
//       </div>
//       <div className={styles.operationExample}>
//         Example with current input: {formatOperation(operation, `"${inputString}"`)}
//       </div>
//       <div className={styles.readMoreContainer}>
//         <a href={`${baseUrl}${name}`} className={styles.readMoreButton}>
//           Read More about {name}
//         </a>
//       </div>
//     </div>
//   );
// };

// const Modal = ({ isOpen, onClose, onDone, value, onChange }) => {
//   if (!isOpen) return null;

//   const handleModalClick = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <div className={styles.modal} onClick={handleModalClick}>
//       <div className={styles.modalContent}>
//         <div className={styles.modalHeader}>
//           <h3 className={styles.modalTitle}>Edit Input String</h3>
//         </div>
//         <textarea
//           value={value}
//           onChange={e => onChange(e.target.value)}
//           className={styles.textarea}
//           placeholder="Enter your text here..."
//           autoFocus
//         />
//         <div className={styles.charCount}>
//           Current length: {value.length} characters
//         </div>
//         <div className={styles.modalActions}>
//           <button 
//             className={`${styles.button} ${styles.resetButton}`}
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button 
//             className={`${styles.button} ${styles.doneButton}`}
//             onClick={onDone}
//           >
//             Done
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const StringProcessor = ({ 
//   language = 'Python',
//   defaultString = 'Hello, World!',
//   baseUrl = '/',
//   operations = [
//     // Simple operations
//     {
//       name: 'upper',
//       format: 'dot',
//       description: 'Convert to uppercase',
//       operation: str => str.toUpperCase()
//     },
//     {
//       name: 'lower',
//       format: 'dot',
//       description: 'Convert to lowercase',
//       operation: str => str.toLowerCase()
//     },
//     // Operations with args
//     {
//       name: 'slice',
//       format: 'dot',
//       description: 'Extract part of string',
//       args: [
//         {name: 'start', type: 'number', default: 0},
//         {name: 'end', type: 'number', default: 1}
//       ],
//       operation: (str, start, end) => str.slice(start, end)
//     },
//     {
//       name: 'repeat',
//       format: 'dot',
//       description: 'Repeat string n times',
//       args: [{name: 'count', type: 'number', default: 2}],
//       operation: (str, count) => str.repeat(count)
//     },
//     {
//       name: 'padStart',
//       format: 'dot',
//       description: 'Pad string start to length',
//       args: [
//         {name: 'length', type: 'number', default: 10},
//         {name: 'pad', type: 'text', default: ' '}
//       ],
//       operation: (str, len, pad) => str.padStart(len, pad)
//     }
//   ],
//   title = 'String Operations'
// }) => {
//   const [inputString, setInputString] = useState(defaultString);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [tempString, setTempString] = useState('');

//   const STRING_PREVIEW_LENGTH = 50;

//   const getPreviewText = useCallback((text) => {
//     if (text.length <= STRING_PREVIEW_LENGTH) return text;
//     return `${text.slice(0, STRING_PREVIEW_LENGTH)}...`;
//   }, []);

//   const handleOpenModal = () => {
//     setTempString(inputString);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setTempString('');
//     setIsModalOpen(false);
//   };

//   const handleDone = () => {
//     setInputString(tempString);
//     setIsModalOpen(false);
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <div className={styles.cardHeader}>
//           <h2 className={styles.cardTitle}>{language} {title}</h2>
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
//                 onClick={handleOpenModal}
//                 placeholder="Enter a string..."
//               />
//               <button 
//                 className={`${styles.button} ${styles.resetButton}`}
//                 onClick={() => setInputString(defaultString)}
//               >
//                 <ResetIcon /> Reset
//               </button>
//             </div>
//           </div>

//           <div className={styles.operationsGrid}>
//             {operations.map((op) => (
//               <OperationCard 
//                 key={op.name} 
//                 operation={op} 
//                 inputString={inputString}
//                 baseUrl={baseUrl}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       <Modal 
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onDone={handleDone}
//         value={tempString}
//         onChange={setTempString}
//       />
//     </div>
//   );
// };

// export default StringProcessor;

// import React, { useState, useCallback } from 'react';
// import styles from './StringProcessor.module.css';

// const ResetIcon = () => (
//  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//    <path d="M3.5 7.5C3.5 5.01472 5.51472 3 8 3C10.4853 3 12.5 5.01472 12.5 7.5C12.5 9.98528 10.4853 12 8 12" 
//          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//    <path d="M8 1V3M8 12V14M2 8H4M12 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//    <path d="M6 12L8 14L6 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//  </svg>
// );

// const OperationCard = ({ operation, inputString, baseUrl = '/' }) => {
//  const { name, format, description, operation: operationFn, args = [] } = operation;
//  const [argValues, setArgValues] = useState(args.map(arg => arg.default || ''));

// //  const formatOperation = useCallback((op, str, isExample = false) => {
// //    const argStr = args.length > 0 
// //      ? ` ${argValues.join(' ')}` 
// //      : '';

// //    const input = isExample ? `"${str}"` : str;
     
// //    switch (op.format) {
// //      case 'dot':
// //        return `${input}.${op.name}${argStr}`;
// //      case 'function':
// //        return `${op.name} ${input}${argStr}`;
// //      default:
// //        return op.name;
// //    }
// //  }, [args, argValues]);

// const formatOperation = useCallback((op, str, isExample = false) => {
//     const argStr = args.length > 0 
//       ? `(${argValues.join(', ')})` 
//       : '()';
  
//     const input = isExample ? `"${str}"` : str;
        
//     switch (op.format) {
//       case 'dot':
//         return `${input}.${op.name}${argStr}`;
//       case 'function':
//         return `${op.name}(${input}${argStr})`;
//       default:
//         return op.name;
//     }
//   }, [args, argValues]); 


// const handleArgChange = (index, value) => {
//    const newArgs = [...argValues];
//    newArgs[index] = value;
//    setArgValues(newArgs);
//  };

//  return (
//    <div className={styles.operationCard}>
//      <div className={styles.operationHeader}>
//        <div className={styles.operationInfo}>
//          <span className={styles.operationName}>
//            <code>{formatOperation(operation, 'str')}</code>
//          </span>
//          {args.length > 0 && (
//            <div className={styles.argsContainer}>
//              {args.map((arg, index) => (
//                <div key={arg.name} className={styles.argInput}>
//                  <label>{arg.name}:</label>
//                  <input
//                    type={arg.type}
//                    value={argValues[index]}
//                    onChange={(e) => handleArgChange(index, e.target.value)}
//                    placeholder={arg.placeholder || arg.type}
//                  />
//                </div>
//              ))}
//            </div>
//          )}
//        </div>
//        <span className={styles.operationDescription}>{description}</span>
//      </div>
//      <div className={styles.operationResult}>
//        {operationFn(inputString, ...argValues)}
//      </div>
//      <div className={styles.operationExample}>
//        Example with current input: {formatOperation(operation, inputString, true)}
//      </div>
//      <div className={styles.readMoreContainer}>
//        <a href={`${baseUrl}${name.split('(')[0]}`} className={styles.readMoreButton}>
//          Read More about {name.split('(')[0]}
//        </a>
//      </div>
//    </div>
//  );
// };

// const Modal = ({ isOpen, onClose, onDone, value, onChange }) => {
//  if (!isOpen) return null;

//  const handleModalClick = (e) => {
//    if (e.target === e.currentTarget) {
//      onClose();
//    }
//  };

//  return (
//    <div className={styles.modal} onClick={handleModalClick}>
//      <div className={styles.modalContent}>
//        <div className={styles.modalHeader}>
//          <h3 className={styles.modalTitle}>Edit Input String</h3>
//        </div>
//        <textarea
//          value={value}
//          onChange={e => onChange(e.target.value)}
//          className={styles.textarea}
//          placeholder="Enter your text here..."
//          autoFocus
//        />
//        <div className={styles.charCount}>
//          Current length: {value.length} characters
//        </div>
//        <div className={styles.modalActions}>
//          <button 
//            className={`${styles.button} ${styles.resetButton}`}
//            onClick={onClose}
//          >
//            Cancel
//          </button>
//          <button 
//            className={`${styles.button} ${styles.doneButton}`}
//            onClick={onDone}
//          >
//            Done
//          </button>
//        </div>
//      </div>
//    </div>
//  );
// };

// const StringProcessor = ({ 
//  language = 'Python',
//  defaultString = 'Hello, World!',
//  baseUrl = '/',
//  operations = [
//    {
//      name: 'length',
//      format: 'dot',
//      description: 'Get string length',
//      operation: str => str.length
//    },
//    {
//      name: 'charAt 0',
//      format: 'dot',
//      description: 'Get first character',  
//      operation: str => str.charAt(0)
//    },
//    {
//      name: 'slice 0 5',
//      format: 'dot',
//      description: 'Get first 5 characters',
//      operation: str => str.slice(0, 5)
//    },
//    {
//      name: 'split " "',
//      format: 'dot',
//      description: 'Splits string by space',
//      operation: str => JSON.stringify(str.split(" "))
//    },
//    {
//      name: 'indexOf "o"',
//      format: 'dot',
//      description: 'Finds first index of "o"',
//      operation: str => str.indexOf("o")
//    }
//  ],
//  title = 'String Operations'
// }) => {
//  const [inputString, setInputString] = useState(defaultString);
//  const [isModalOpen, setIsModalOpen] = useState(false);
//  const [tempString, setTempString] = useState('');

//  const STRING_PREVIEW_LENGTH = 50;

//  const getPreviewText = useCallback((text) => {
//    if (text.length <= STRING_PREVIEW_LENGTH) return text;
//    return `${text.slice(0, STRING_PREVIEW_LENGTH)}...`;
//  }, []);

//  const handleOpenModal = () => {
//    setTempString(inputString);
//    setIsModalOpen(true);
//  };

//  const handleCloseModal = () => {
//    setTempString('');
//    setIsModalOpen(false);
//  };

//  const handleDone = () => {
//    setInputString(tempString);
//    setIsModalOpen(false);
//  };

//  return (
//    <div className={styles.container}>
//      <div className={styles.card}>
//        <div className={styles.cardHeader}>
//          {/* <h2 className={styles.cardTitle}>{language} {title}</h2> */}
//        </div>
//        <div className={styles.cardContent}>
//          <div className={styles.inputContainer}>
//            <label className={styles.label} htmlFor="input">Input String:</label>
//            <div className={styles.inputWrapper}>
//              <input
//                id="input"
//                className={styles.input}
//                value={getPreviewText(inputString)}
//                readOnly
//                onClick={handleOpenModal}
//                placeholder="Enter a string..."
//              />
//              <button 
//                className={`${styles.button} ${styles.resetButton}`}
//                onClick={() => setInputString(defaultString)}
//              >
//                <ResetIcon /> Reset
//              </button>
//            </div>
//          </div>

//          <div className={styles.operationsGrid}>
//            {operations.map((op) => (
//              <OperationCard 
//                key={op.name} 
//                operation={op} 
//                inputString={inputString}
//                baseUrl={baseUrl}
//              />
//            ))}
//          </div>
//        </div>
//      </div>

//      <Modal 
//        isOpen={isModalOpen}
//        onClose={handleCloseModal}
//        onDone={handleDone}
//        value={tempString}
//        onChange={setTempString}
//      />
//    </div>
//  );
// };

// export default StringProcessor;

import React, { useState, useCallback } from 'react';
import styles from './StringProcessor.module.css';

const ResetIcon = () => (
 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
   <path d="M3.5 7.5C3.5 5.01472 5.51472 3 8 3C10.4853 3 12.5 5.01472 12.5 7.5C12.5 9.98528 10.4853 12 8 12" 
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
   <path d="M8 1V3M8 12V14M2 8H4M12 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
   <path d="M6 12L8 14L6 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
);

const OperationCard = ({ operation, inputString, baseUrl = '/' }) => {
 const { name, format, description, operation: operationFn, args = [] } = operation;
 const [argValues, setArgValues] = useState(args.map(arg => arg.default || ''));

 const formatOperation = useCallback((op, str, isExample = false) => {
   const argStr = args.length > 0 
     ? `(${argValues.join(', ')})` 
     : '()';
 
   const input = isExample ? `"${str}"` : str;
       
   switch (op.format) {
     case 'dot':
       return `${input}.${op.name}${argStr}`;
     case 'function':
       return `${op.name}(${input})`;
     default:
       return op.name;
   }
 }, [args, argValues]);

 const handleArgChange = (index, value) => {
   const newArgs = [...argValues];
   newArgs[index] = value;
   setArgValues(newArgs);
 };

 const executeOperation = () => {
   try {
     return operationFn(inputString, ...argValues);
   } catch (error) {
     return error.message; 
   }
 };

 return (
   <div className={styles.operationCard}>
     <div className={styles.operationHeader}>
       <div className={styles.operationInfo}>
         <span className={styles.operationName}>
           <code>{formatOperation(operation, 'str')}</code>
         </span>
         {args.length > 0 && (
           <div className={styles.argsContainer}>
             {args.map((arg, index) => (
               <div key={arg.name} className={styles.argInput}>
                 <label>{arg.name}:</label>
                 <input
                   type={arg.type}
                   value={argValues[index]}
                   onChange={(e) => handleArgChange(index, e.target.value)}
                   placeholder={arg.placeholder || arg.type}
                 />
               </div>
             ))}
           </div>
         )}
       </div>
       <span className={styles.operationDescription}>{description}</span>
     </div>
     <div className={styles.operationResult}>
       {executeOperation()}
     </div>
     <div className={styles.operationExample}>
       Example with current input: {formatOperation(operation, inputString, true)}
     </div>
     <div className={styles.readMoreContainer}>
       <a href={`${baseUrl}${name.split('(')[0]}`} className={styles.readMoreButton}>
         Read More about {name.split('(')[0]}
       </a>
     </div>
   </div>
 );
};

const Modal = ({ isOpen, onClose, onDone, value, onChange }) => {
 if (!isOpen) return null;

 const handleModalClick = (e) => {
   if (e.target === e.currentTarget) {
     onClose();
   }
 };

 return (
   <div className={styles.modal} onClick={handleModalClick}>
     <div className={styles.modalContent}>
       <div className={styles.modalHeader}>
         <h3 className={styles.modalTitle}>Edit Input String</h3>
       </div>
       <textarea
         value={value}
         onChange={e => onChange(e.target.value)}
         className={styles.textarea}
         placeholder="Enter your text here..."
         autoFocus
       />
       <div className={styles.charCount}>
         Current length: {value.length} characters
       </div>
       <div className={styles.modalActions}>
         <button 
           className={`${styles.button} ${styles.resetButton}`}
           onClick={onClose}
         >
           Cancel
         </button>
         <button 
           className={`${styles.button} ${styles.doneButton}`}
           onClick={onDone}
         >
           Done
         </button>
       </div>
     </div>
   </div>
 );
};

const StringProcessor = ({ 
 language = 'Python',
 defaultString = 'Hello, World!',
 baseUrl = '/',
 operations = [
   {
     name: 'length',
     format: 'dot',
     description: 'Get string length',
     operation: str => str.length
   },
   {
     name: 'charAt 0',
     format: 'dot', 
     description: 'Get first character',
     operation: str => str.charAt(0)
   },
   {
     name: 'slice 0 5',
     format: 'dot',
     description: 'Get first 5 characters',
     operation: str => str.slice(0, 5)
   },
   {
     name: 'split " "',
     format: 'dot',
     description: 'Splits string by space',
     operation: str => JSON.stringify(str.split(" "))
   },
   {
     name: 'indexOf "o"',
     format: 'dot',
     description: 'Finds first index of "o"',
     operation: str => str.indexOf("o")
   }
 ],
 title = 'String Operations'
}) => {
 const [inputString, setInputString] = useState(defaultString);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [tempString, setTempString] = useState('');

 const STRING_PREVIEW_LENGTH = 50;

 const getPreviewText = useCallback((text) => {
   if (text.length <= STRING_PREVIEW_LENGTH) return text;
   return `${text.slice(0, STRING_PREVIEW_LENGTH)}...`;
 }, []);

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
         {/* <h2 className={styles.cardTitle}>{language} {title}</h2> */}
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
               onClick={() => setInputString(defaultString)}
             >
               <ResetIcon /> Reset
             </button>
           </div>
         </div>

         <div className={styles.operationsGrid}>
           {operations.map((op) => (
             <OperationCard 
               key={op.name} 
               operation={op} 
               inputString={inputString}
               baseUrl={baseUrl}
             />
           ))}
         </div>
       </div>
     </div>

     <Modal 
       isOpen={isModalOpen}
       onClose={handleCloseModal}
       onDone={handleDone}
       value={tempString}
       onChange={setTempString}
     />
   </div>
 );
};

export default StringProcessor;