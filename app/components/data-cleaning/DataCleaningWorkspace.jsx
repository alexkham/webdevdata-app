// 'use client'

// import { useState } from 'react';
// import FileUploader from './FileUploader';
// import CleaningOperations from './CleaningOperations';
// import DataFrameDisplay from './DataFrameDisplay';
// import { processFile ,removeDuplicates, fillNaValues } from '@/utils/dataProcessing';
// // { processFile, removeDuplicates, fillNaValues } from '../utils/dataProcessing';

// export default function DataCleaningWorkspace() {
//   const [dataFrame, setDataFrame] = useState(null);

//   const handleFileProcessed = async (file) => {
//     const processedData = await processFile(file);
//     setDataFrame(processedData);
//   };

//   const handleCleaningOperation = (operation, value) => {
//     if (!dataFrame) return;

//     let newDataFrame;
//     switch (operation) {
//       case 'removeDuplicates':
//         newDataFrame = removeDuplicates(dataFrame);
//         break;
//       case 'fillNa':
//         newDataFrame = fillNaValues(dataFrame, value);
//         break;
//       default:
//         console.error('Unknown operation:', operation);
//         return;
//     }
//     setDataFrame(newDataFrame);
//   };

//   return (
//     <div>
//       <FileUploader onFileProcessed={handleFileProcessed} />
//       {dataFrame && (
//         <>
//           <CleaningOperations onCleaningOperation={handleCleaningOperation} />
//           <DataFrameDisplay dataFrame={dataFrame} />
//         </>
//       )}
//     </div>
//   );
// }
'use client'

import { useState } from 'react';
import FileUploader from './FileUploader';
import CleaningOperations from './CleaningOperations';
import DataFrameDisplay from './DataFrameDisplay';
import { processFile,removeDuplicates,fillNaValues } from '@/utils/dataProcessing';
// { processFile, removeDuplicates, fillNaValues } from '../utils/dataProcessing';

export default function DataCleaningWorkspace() {
  const [dataFrame, setDataFrame] = useState(null);

  const handleFileProcessed = async (file) => {
    const processedData = await processFile(file);
    setDataFrame(processedData);
  };

  const handleCleaningOperation = (operation, value) => {
    if (!dataFrame) return;

    let newDataFrame;
    switch (operation) {
      case 'removeDuplicates':
        newDataFrame = removeDuplicates(dataFrame);
        break;
      case 'fillNa':
        newDataFrame = fillNaValues(dataFrame, value);
        break;
      default:
        console.error('Unknown operation:', operation);
        return;
    }
    setDataFrame(newDataFrame);
  };

  return (
    <div>
      <FileUploader onFileProcessed={handleFileProcessed} />
      {dataFrame && (
        <>
          <CleaningOperations onCleaningOperation={handleCleaningOperation} />
          <DataFrameDisplay dataFrame={dataFrame} />
        </>
      )}
    </div>
  );
}