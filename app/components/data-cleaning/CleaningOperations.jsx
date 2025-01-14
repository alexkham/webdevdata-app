// 'use client'

// import { useState } from 'react';

// export default function CleaningOperations({ onCleaningOperation }) {
//   const [naFillValue, setNaFillValue] = useState('');

//   return (
//     <div>
//       <button onClick={() => onCleaningOperation('removeDuplicates')}>Remove Duplicates</button>
//       <div>
//         <input 
//           type="text" 
//           value={naFillValue} 
//           onChange={(e) => setNaFillValue(e.target.value)}
//           placeholder="Fill NA with..."
//         />
//         <button onClick={() => onCleaningOperation('fillNa', naFillValue)}>Fill NA</button>
//       </div>
//     </div>
//   );
// }
'use client'

import { useState } from 'react';

export default function CleaningOperations({ onCleaningOperation }) {
  const [naFillValue, setNaFillValue] = useState('');

  return (
    <div>
      <button onClick={() => onCleaningOperation('removeDuplicates')}>Remove Duplicates</button>
      <div>
        <input 
          type="text" 
          value={naFillValue} 
          onChange={(e) => setNaFillValue(e.target.value)}
          placeholder="Fill NA with..."
        />
        <button onClick={() => onCleaningOperation('fillNa', naFillValue)}>Fill NA</button>
      </div>
    </div>
  );
}