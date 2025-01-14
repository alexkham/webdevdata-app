// 'use client'

// import { useState } from 'react';

// export default function FileUploader({ onFileProcessed }) {
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     setIsProcessing(true);
//     try {
//       await onFileProcessed(file);
//     } catch (error) {
//       console.error('Error processing file:', error);
//       // TODO: Add error handling
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileUpload} accept=".csv,.json" disabled={isProcessing} />
//       {isProcessing && <p>Processing file...</p>}
//     </div>
//   );
// }
'use client'

import { useState } from 'react';

export default function FileUploader({ onFileProcessed }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      await onFileProcessed(file);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} accept=".csv,.json" disabled={isProcessing} />
      {isProcessing && <p>Processing file...</p>}
    </div>
  );
}