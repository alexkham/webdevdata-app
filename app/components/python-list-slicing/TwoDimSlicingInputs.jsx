// // // // // // // // 'use client'; 
// // // // // // // // import React from 'react';
// // // // // // // // import './MyArrayComponent.css';

// // // // // // // // function TwoDimSlicingInputs({
// // // // // // // //     startRow, stopRow, stepRow, setStartRow, setStopRow, setStepRow,
// // // // // // // //     startCol, stopCol, stepCol, setStartCol, setStopCol, setStepCol
// // // // // // // // }) {
// // // // // // // //     const resetIndices = () => {
// // // // // // // //         setStartRow('');
// // // // // // // //         setStopRow('');
// // // // // // // //         setStepRow('');
// // // // // // // //         setStartCol('');
// // // // // // // //         setStopCol('');
// // // // // // // //         setStepCol('');
// // // // // // // //     };

// // // // // // // //     return (
// // // // // // // //         <div className='expression'>
// // // // // // // //             <span className='bracket-title'>array </span><span className='bracket-index'>[</span>
// // // // // // // //             <div className='slice-dimension'>
// // // // // // // //                 <div className='index-input-item'>
// // // // // // // //                     <input
// // // // // // // //                         type="number"
// // // // // // // //                         value={startRow}
// // // // // // // //                         onChange={(e) => setStartRow(e.target.value)}
// // // // // // // //                         className='index-input'
// // // // // // // //                     />
// // // // // // // //                     <label>Start Row</label>
// // // // // // // //                     <span className='question-mark'>?</span>
// // // // // // // //                     <span className='tooltip-text'>Defines the starting index of the slice for rows (defaults to 0).</span>
// // // // // // // //                 </div>
// // // // // // // //                 :
// // // // // // // //                 <div className='index-input-item'>
// // // // // // // //                     <input
// // // // // // // //                         type="number"
// // // // // // // //                         value={stopRow}
// // // // // // // //                         onChange={(e) => setStopRow(e.target.value)}
// // // // // // // //                         className='index-input'
// // // // // // // //                     />
// // // // // // // //                     <label>Stop Row</label>
// // // // // // // //                     <span className='question-mark'>?</span>
// // // // // // // //                     <span className='tooltip-text'>Defines the ending index of the slice for rows, exclusive.</span>
// // // // // // // //                 </div>
// // // // // // // //                 :
// // // // // // // //                 <div className='index-input-item'>
// // // // // // // //                     <input
// // // // // // // //                         type="number"
// // // // // // // //                         value={stepRow}
// // // // // // // //                         onChange={(e) => setStepRow(e.target.value)}
// // // // // // // //                         className='index-input'
// // // // // // // //                     />
// // // // // // // //                     <label>Step Row</label>
// // // // // // // //                     <span className='question-mark'>?</span>
// // // // // // // //                     <span className='tooltip-text'>Defines the step count of the slice for rows (defaults to 1).</span>
// // // // // // // //                 </div>
// // // // // // // //             </div>
// // // // // // // //             <span className='bracket-index'>,</span>
// // // // // // // //             <div className='slice-dimension'>
// // // // // // // //                 <div className='index-input-item'>
// // // // // // // //                     <input
// // // // // // // //                         type="number"
// // // // // // // //                         value={startCol}
// // // // // // // //                         onChange={(e) => setStartCol(e.target.value)}
// // // // // // // //                         className='index-input'
// // // // // // // //                     />
// // // // // // // //                     <label>Start Col</label>
// // // // // // // //                     <span className='question-mark'>?</span>
// // // // // // // //                     <span className='tooltip-text'>Defines the starting index of the slice for columns (defaults to 0).</span>
// // // // // // // //                 </div>
// // // // // // // //                 :
// // // // // // // //                 <div className='index-input-item'>
// // // // // // // //                     <input
// // // // // // // //                         type="number"
// // // // // // // //                         value={stopCol}
// // // // // // // //                         onChange={(e) => setStopCol(e.target.value)}
// // // // // // // //                         className='index-input'
// // // // // // // //                     />
// // // // // // // //                     <label>Stop Col</label>
// // // // // // // //                     <span className='question-mark'>?</span>
// // // // // // // //                     <span className='tooltip-text'>Defines the ending index of the slice for columns, exclusive.</span>
// // // // // // // //                 </div>
// // // // // // // //                 :
// // // // // // // //                 <div className='index-input-item'>
// // // // // // // //                     <input
// // // // // // // //                         type="number"
// // // // // // // //                         value={stepCol}
// // // // // // // //                         onChange={(e) => setStepCol(e.target.value)}
// // // // // // // //                         className='index-input'
// // // // // // // //                     />
// // // // // // // //                     <label>Step Col</label>
// // // // // // // //                     <span className='question-mark'>?</span>
// // // // // // // //                     <span className='tooltip-text'>Defines the step count of the slice for columns (defaults to 1).</span>
// // // // // // // //                 </div>
// // // // // // // //             </div>
// // // // // // // //             <span className='bracket-index'>]</span>
// // // // // // // //             <button onClick={resetIndices}>Reset Indices</button>
// // // // // // // //         </div>
// // // // // // // //     );
// // // // // // // // }

// // // // // // // // export default TwoDimSlicingInputs;
// // // // // // // 'use client'; // Make sure to declare this component as a client component

// // // // // // // import React, { useState } from 'react';
// // // // // // // import './MyArrayComponent.css';

// // // // // // // function TwoDimSlicingInputs() {
// // // // // // //     // Internal state for row and column slicing
// // // // // // //     const [startRow, setStartRow] = useState(0);
// // // // // // //     const [stopRow, setStopRow] = useState(10);
// // // // // // //     const [stepRow, setStepRow] = useState(2);
// // // // // // //     const [startCol, setStartCol] = useState(1);
// // // // // // //     const [stopCol, setStopCol] = useState(5);
// // // // // // //     const [stepCol, setStepCol] = useState(1);

// // // // // // //     const resetIndices = () => {
// // // // // // //         setStartRow(0);
// // // // // // //         setStopRow(10);
// // // // // // //         setStepRow(2);
// // // // // // //         setStartCol(1);
// // // // // // //         setStopCol(5);
// // // // // // //         setStepCol(1);
// // // // // // //     };

// // // // // // //     return (
// // // // // // //         <div className='expression'>
// // // // // // //             <span className='bracket-title'>Array </span><span className='bracket-index'>[</span>
// // // // // // //             {/* Row Index Inputs */}
// // // // // // //             <div className='slice-dimension'>
// // // // // // //                 <input type="number" value={startRow} onChange={(e) => setStartRow(parseInt(e.target.value))} className='index-input' />
// // // // // // //                 <input type="number" value={stopRow} onChange={(e) => setStopRow(parseInt(e.target.value))} className='index-input' />
// // // // // // //                 <input type="number" value={stepRow} onChange={(e) => setStepRow(parseInt(e.target.value))} className='index-input' />
// // // // // // //             </div>
// // // // // // //             <span className='bracket-index'>,</span>
// // // // // // //             {/* Column Index Inputs */}
// // // // // // //             <div className='slice-dimension'>
// // // // // // //                 <input type="number" value={startCol} onChange={(e) => setStartCol(parseInt(e.target.value))} className='index-input' />
// // // // // // //                 <input type="number" value={stopCol} onChange={(e) => setStopCol(parseInt(e.target.value))} className='index-input' />
// // // // // // //                 <input type="number" value={stepCol} onChange={(e) => setStepCol(parseInt(e.target.value))} className='index-input' />
// // // // // // //             </div>
// // // // // // //             <span className='bracket-index'>]</span>
// // // // // // //             <button onClick={resetIndices}>Reset Indices</button>
// // // // // // //         </div>
// // // // // // //     );
// // // // // // // }

// // // // // // // export default TwoDimSlicingInputs;
// // // // // // 'use client'; // This directive is important if you're using Next.js 13 or later.

// // // // // // import React, { useState } from 'react';
// // // // // // import './MyArrayComponent.css';

// // // // // // function TwoDimSlicingInputs() {
// // // // // //     // Internal state for row and column slicing indices
// // // // // //     const [startRow, setStartRow] = useState(0);
// // // // // //     const [stopRow, setStopRow] = useState(10);
// // // // // //     const [stepRow, setStepRow] = useState(2);
// // // // // //     const [startCol, setStartCol] = useState(1);
// // // // // //     const [stopCol, setStopCol] = useState(5);
// // // // // //     const [stepCol, setStepCol] = useState(1);

// // // // // //     const resetIndices = () => {
// // // // // //         setStartRow(0);
// // // // // //         setStopRow(10);
// // // // // //         setStepRow(2);
// // // // // //         setStartCol(1);
// // // // // //         setStopCol(5);
// // // // // //         setStepCol(1);
// // // // // //     };

// // // // // //     return (
// // // // // //         <div className='expression'>
// // // // // //             <span className='bracket-title'>Array </span><span className='bracket-index'>[</span>
// // // // // //             <div className='slice-dimension'>
// // // // // //                 <input type="number" value={startRow} onChange={(e) => setStartRow(parseInt(e.target.value) || 0)} className='index-input' />
// // // // // //                 <input type="number" value={stopRow} onChange={(e) => setStopRow(parseInt(e.target.value) || 0)} className='index-input' />
// // // // // //                 <input type="number" value={stepRow} onChange={(e) => setStepRow(parseInt(e.target.value) || 1)} className='index-input' />
// // // // // //             </div>
// // // // // //             <span className='bracket-index'>,</span>
// // // // // //             <div className='slice-dimension'>
// // // // // //                 <input type="number" value={startCol} onChange={(e) => setStartCol(parseInt(e.target.value) || 0)} className='index-input' />
// // // // // //                 <input type="number" value={stopCol} onChange={(e) => setStopCol(parseInt(e.target.value) || 0)} className='index-input' />
// // // // // //                 <input type="number" value={stepCol} onChange={(e) => setStepCol(parseInt(e.target.value) || 1)} className='index-input' />
// // // // // //             </div>
// // // // // //             <span className='bracket-index'>]</span>
// // // // // //             <button onClick={resetIndices}>Reset Indices</button>
// // // // // //         </div>
// // // // // //     );
// // // // // // }

// // // // // // export default TwoDimSlicingInputs;
// // // // // 'use client';

// // // // // import React, { useState } from 'react';
// // // // // import './MyArrayComponent.css'; // Ensure your CSS file provides appropriate styling

// // // // // function TwoDimSlicingInputs() {
// // // // //     const [startRow, setStartRow] = useState('');
// // // // //     const [stopRow, setStopRow] = useState('');
// // // // //     const [stepRow, setStepRow] = useState(1);
// // // // //     const [startCol, setStartCol] = useState('');
// // // // //     const [stopCol, setStopCol] = useState('');
// // // // //     const [stepCol, setStepCol] = useState(1);

// // // // //     const resetIndices = () => {
// // // // //         setStartRow('');
// // // // //         setStopRow('');
// // // // //         setStepRow(1);
// // // // //         setStartCol('');
// // // // //         setStopCol('');
// // // // //         setStepCol(1);
// // // // //     };

// // // // //     return (
// // // // //         <div className='expression'>
// // // // //             <span className='bracket-title'>Array </span>
// // // // //             <span className='bracket-index'>[</span>
// // // // //             {/* Row Index Inputs */}
// // // // //             <div className='slice-dimension'>
// // // // //                 <div className='index-input-item'>
// // // // //                     <input
// // // // //                         type="number"
// // // // //                         value={startRow}
// // // // //                         onChange={(e) => setStartRow(e.target.value)}
// // // // //                         className='index-input'
// // // // //                     />
// // // // //                     <label>Start Row</label>
// // // // //                     <span className='question-mark'>?</span>
// // // // //                     <span className='tooltip-text'>Defines the starting index of the slice for rows (defaults to 0).</span>
// // // // //                 </div>
// // // // //                 :
// // // // //                 <div className='index-input-item'>
// // // // //                     <input
// // // // //                         type="number"
// // // // //                         value={stopRow}
// // // // //                         onChange={(e) => setStopRow(e.target.value)}
// // // // //                         className='index-input'
// // // // //                     />
// // // // //                     <label>Stop Row</label>
// // // // //                     <span className='question-mark'>?</span>
// // // // //                     <span className='tooltip-text'>Defines the ending index of the slice for rows, exclusive.</span>
// // // // //                 </div>
// // // // //                 :
// // // // //                 <div className='index-input-item'>
// // // // //                     <input
// // // // //                         type="number"
// // // // //                         value={stepRow}
// // // // //                         onChange={(e) => setStepRow(e.target.value)}
// // // // //                         className='index-input'
// // // // //                     />
// // // // //                     <label>Step Row</label>
// // // // //                     <span className='question-mark'>?</span>
// // // // //                     <span className='tooltip-text'>Defines the step count of the slice for rows (defaults to 1).</span>
// // // // //                 </div>
// // // // //             </div>
// // // // //             <span className='bracket-index'>,</span>
// // // // //             {/* Column Index Inputs */}
// // // // //             <div className='slice-dimension'>
// // // // //                 <div className='index-input-item'>
// // // // //                     <input
// // // // //                         type="number"
// // // // //                         value={startCol}
// // // // //                         onChange={(e) => setStartCol(e.target.value)}
// // // // //                         className='index-input'
// // // // //                     />
// // // // //                     <label>Start Col</label>
// // // // //                     <span className='question-mark'>?</span>
// // // // //                     <span className='tooltip-text'>Defines the starting index of the slice for columns (defaults to 0).</span>
// // // // //                 </div>
// // // // //                 :
// // // // //                 <div className='index-input-item'>
// // // // //                     <input
// // // // //                         type="number"
// // // // //                         value={stopCol}
// // // // //                         onChange={(e) => setStopCol(e.target.value)}
// // // // //                         className='index-input'
// // // // //                     />
// // // // //                     <label>Stop Col</label>
// // // // //                     <span className='question-mark'>?</span>
// // // // //                     <span className='tooltip-text'>Defines the ending index of the slice for columns, exclusive.</span>
// // // // //                 </div>
// // // // //                 :
// // // // //                 <div className='index-input-item'>
// // // // //                     <input
// // // // //                         type="number"
// // // // //                         value={stepCol}
// // // // //                         onChange={(e) => setStepCol(e.target.value)}
// // // // //                         className='index-input'
// // // // //                     />
// // // // //                     <label>Step Col</label>
// // // // //                     <span className='question-mark'>?</span>
// // // // //                     <span className='tooltip-text'>Defines the step count of the slice for columns (defaults to 1).</span>
// // // // //                 </div>
// // // // //             </div>
// // // // //             <span className='bracket-index'>]</span>
// // // // //             <button onClick={resetIndices}>Reset Indices</button>
// // // // //         </div>
// // // // //     );
// // // // // }

// // // // // export default TwoDimSlicingInputs;
// // // // 'use client'; // Use this directive for Next.js client components

// // // // import React, { useState } from 'react';
// // // // import './MyArrayComponent.css'; // Ensure your CSS is set up to display flexbox styles properly

// // // // function TwoDimSlicingInputs() {
// // // //     // States for the indices
// // // //     const [startRow, setStartRow] = useState('');
// // // //     const [stopRow, setStopRow] = useState('');
// // // //     const [stepRow, setStepRow] = useState('');
// // // //     const [startCol, setStartCol] = useState('');
// // // //     const [stopCol, setStopCol] = useState('');
// // // //     const [stepCol, setStepCol] = useState('');

// // // //     // Function to reset all indices
// // // //     const resetIndices = () => {
// // // //         setStartRow('');
// // // //         setStopRow('');
// // // //         setStepRow('');
// // // //         setStartCol('');
// // // //         setStopCol('');
// // // //         setStepCol('');
// // // //     };

// // // //     return (
// // // //         <div className='expression' style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
// // // //             <span className='bracket-title'>Array:</span>
// // // //             <span className='bracket-index'>[</span>
// // // //             <div className='slice-dimension' style={{ display: 'flex', alignItems: 'center' }}>
// // // //                 <div className='index-input-item'>
// // // //                     <input type="number" value={startRow} onChange={(e) => setStartRow(e.target.value)} placeholder="Start Row" />
// // // //                 </div>
// // // //                 <span>:</span>
// // // //                 <div className='index-input-item'>
// // // //                     <input type="number" value={stopRow} onChange={(e) => setStopRow(e.target.value)} placeholder="Stop Row" />
// // // //                 </div>
// // // //                 <span>:</span>
// // // //                 <div className='index-input-item'>
// // // //                     <input type="number" value={stepRow} onChange={(e) => setStepRow(e.target.value)} placeholder="Step Row" />
// // // //                 </div>
// // // //             </div>
// // // //             <span>,</span>
// // // //             <div className='slice-dimension' style={{ display: 'flex', alignItems: 'center' }}>
// // // //                 <div className='index-input-item'>
// // // //                     <input type="number" value={startCol} onChange={(e) => setStartCol(e.target.value)} placeholder="Start Col" />
// // // //                 </div>
// // // //                 <span>:</span>
// // // //                 <div className='index-input-item'>
// // // //                     <input type="number" value={stopCol} onChange={(e) => setStopCol(e.target.value)} placeholder="Stop Col" />
// // // //                 </div>
// // // //                 <span>:</span>
// // // //                 <div className='index-input-item'>
// // // //                     <input type="number" value={stepCol} onChange={(e) => setStepCol(e.target.value)} placeholder="Step Col" />
// // // //                 </div>
// // // //             </div>
// // // //             <span className='bracket-index'>]</span>
// // // //             <button onClick={resetIndices}>Reset</button>
// // // //         </div>
// // // //     );
// // // // }

// // // // export default TwoDimSlicingInputs;
// // // 'use client'; // Important for Next.js to treat this as a Client Component

// // // import React, { useState } from 'react';
// // // import './MyArrayComponent.css'; // Ensure CSS handles layout and input width

// // // function TwoDimSlicingInputs() {
// // //     const [startRow, setStartRow] = useState('');
// // //     const [stopRow, setStopRow] = useState('');
// // //     const [stepRow, setStepRow] = useState('');
// // //     const [startCol, setStartCol] = useState('');
// // //     const [stopCol, setStopCol] = useState('');
// // //     const [stepCol, setStepCol] = useState('');

// // //     const resetIndices = () => {
// // //         setStartRow('');
// // //         setStopRow('');
// // //         setStepRow('');
// // //         setStartCol('');
// // //         setStopCol('');
// // //         setStepCol('');
// // //     };

// // //     return (
// // //         <div className='expression' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
// // //             <span className='bracket-title'>Array:</span>
// // //             <span className='bracket-index'>[</span>
            
// // //             {/* Row Dimension Inputs */}
// // //             <div className='slice-dimension' style={{ display: 'flex', alignItems: 'center' }}>
// // //                 <label style={{ marginRight: '5px' }}>Start Row:</label>
// // //                 <input type="number" value={startRow} onChange={(e) => setStartRow(e.target.value)} className='index-input' style={{ width: '50px' }} />
// // //                 <label style={{ margin: '0 5px' }}>Stop Row:</label>
// // //                 <input type="number" value={stopRow} onChange={(e) => setStopRow(e.target.value)} className='index-input' style={{ width: '50px' }} />
// // //                 <label style={{ margin: '0 5px' }}>Step Row:</label>
// // //                 <input type="number" value={stepRow} onChange={(e) => setStepRow(e.target.value)} className='index-input' style={{ width: '50px' }} />
// // //             </div>
// // //             <span>,</span>
            
// // //             {/* Column Dimension Inputs */}
// // //             <div className='slice-dimension' style={{ display: 'flex', alignItems: 'center' }}>
// // //                 <label style={{ marginRight: '5px' }}>Start Col:</label>
// // //                 <input type="number" value={startCol} onChange={(e) => setStartCol(e.target.value)} className='index-input' style={{ width: '50px' }} />
// // //                 <label style={{ margin: '0 5px' }}>Stop Col:</label>
// // //                 <input type="number" value={stopCol} onChange={(e) => setStopCol(e.target.value)} className='index-input' style={{ width: '50px' }} />
// // //                 <label style={{ margin: '0 5px' }}>Step Col:</label>
// // //                 <input type="number" value={stepCol} onChange={(e) => setStepCol(e.target.value)} className='index-input' style={{ width: '50px' }} />
// // //             </div>
// // //             <span className='bracket-index'>]</span>
// // //             <button onClick={resetIndices} style={{ marginLeft: '10px' }}>Reset</button>
// // //         </div>
// // //     );
// // // }

// // // export default TwoDimSlicingInputs;
// // 'use client'; // Important for Next.js to treat this as a Client Component

// // import React, { useState } from 'react';
// // import './MyArrayComponent.css'; // Ensure CSS handles layout and input width

// // function TwoDimSlicingInputs() {
// //     const [startRow, setStartRow] = useState('');
// //     const [stopRow, setStopRow] = useState('');
// //     const [stepRow, setStepRow] = useState('');
// //     const [startCol, setStartCol] = useState('');
// //     const [stopCol, setStopCol] = useState('');
// //     const [stepCol, setStepCol] = useState('');

// //     const resetIndices = () => {
// //         setStartRow('');
// //         setStopRow('');
// //         setStepRow('');
// //         setStartCol('');
// //         setStopCol('');
// //         setStepCol('');
// //     };

// //     return (
// //         <div className='expression' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
// //             <span className='bracket-title'>Array:</span>
// //             <span className='bracket-index'>[</span>
            
// //             {/* Row Dimension Inputs */}
// //             <div className='slice-dimension' style={{ display: 'flex', alignItems: 'center' }}>
// //                 <div className='index-input-item'>
// //                     <input type="number" value={startRow} onChange={(e) => setStartRow(e.target.value)} className='index-input' style={{ width: '50px' }} />
// //                     <span className='tooltip'>Start Row</span>
// //                 </div>
// //                 <span>:</span>
// //                 <div className='index-input-item'>
// //                     <input type="number" value={stopRow} onChange={(e) => setStopRow(e.target.value)} className='index-input' style={{ width: '50px' }} />
// //                     <span className='tooltip'>Stop Row</span>
// //                 </div>
// //                 <span>:</span>
// //                 <div className='index-input-item'>
// //                     <input type="number" value={stepRow} onChange={(e) => setStepRow(e.target.value)} className='index-input' style={{ width: '50px' }} />
// //                     <span className='tooltip'>Step Row</span>
// //                 </div>
// //             </div>
// //             <span>,</span>
            
// //             {/* Column Dimension Inputs */}
// //             <div className='slice-dimension' style={{ display: 'flex', alignItems: 'center' }}>
// //                 <div className='index-input-item'>
// //                     <input type="number" value={startCol} onChange={(e) => setStartCol(e.target.value)} className='index-input' style={{ width: '50px' }} />
// //                     <span className='tooltip'>Start Col</span>
// //                 </div>
// //                 <span>:</span>
// //                 <div className='index-input-item'>
// //                     <input type="number" value={stopCol} onChange={(e) => setStopCol(e.target.value)} className='index-input' style={{ width: '50px' }} />
// //                     <span className='tooltip'>Stop Col</span>
// //                 </div>
// //                 <span>:</span>
// //                 <div className='index-input-item'>
// //                     <input type="number" value={stepCol} onChange={(e) => setStepCol(e.target.value)} className='index-input' style={{ width: '50px' }} />
// //                     <span className='tooltip'>Step Col</span>
// //                 </div>
// //             </div>
// //             <span className='bracket-index'>]</span>
// //             <button onClick={resetIndices} style={{ marginLeft: '10px' }}>Reset</button>
// //         </div>
// //     );
// // }

// // export default TwoDimSlicingInputs;
// 'use client'; // Ensuring this component is treated as a client component in Next.js

// import React, { useState } from 'react';
// import './MyArrayComponent.css'; // Make sure your CSS supports tooltip visibility

// function TwoDimSlicingInputs() {
//     const [startRow, setStartRow] = useState('');
//     const [stopRow, setStopRow] = useState('');
//     const [stepRow, setStepRow] = useState('');
//     const [startCol, setStartCol] = useState('');
//     const [stopCol, setStopCol] = useState('');
//     const [stepCol, setStepCol] = useState('');

//     const resetIndices = () => {
//         setStartRow('');
//         setStopRow('');
//         setStepRow('');
//         setStartCol('');
//         setStopCol('');
//         setStepCol('');
//     };

//     return (
//         <div className='expression' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
//             <span className='bracket-title'>Array:</span>
//             <span className='bracket-index'>[</span>
//             <div className='slice-dimension' style={{ display: 'flex', alignItems: 'center' }}>
//                 <label>Start Row:</label>
//                 <input type="number" value={startRow} onChange={(e) => setStartRow(e.target.value)} className='index-input' />
//                 <span className='tooltip'>?</span>
//                 <div className='tooltip-text'>Defines the starting index of the slice for rows.</div>
//                 <span>:</span>
//                 <label>Stop Row:</label>
//                 <input type="number" value={stopRow} onChange={(e) => setStopRow(e.target.value)} className='index-input' />
//                 <span className='tooltip'>?</span>
//                 <div className='tooltip-text'>Defines the ending index of the slice for rows, exclusive.</div>
//                 <span>:</span>
//                 <label>Step Row:</label>
//                 <input type="number" value={stepRow} onChange={(e) => setStepRow(e.target.value)} className='index-input' />
//                 <span className='tooltip'>?</span>
//                 <div className='tooltip-text'>Defines the step count of the slice for rows.</div>
//             </div>
//             <span>,</span>
//             <div className='slice-dimension' style={{ display: 'flex', alignItems: 'center' }}>
//                 <label>Start Col:</label>
//                 <input type="number" value={startCol} onChange={(e) => setStartCol(e.target.value)} className='index-input' />
//                 <span className='tooltip'>?</span>
//                 <div className='tooltip-text'>Defines the starting index of the slice for columns.</div>
//                 <span>:</span>
//                 <label>Stop Col:</label>
//                 <input type="number" value={stopCol} onChange={(e) => setStopCol(e.target.value)} className='index-input' />
//                 <span className='tooltip'>?</span>
//                 <div className='tooltip-text'>Defines the ending index of the slice for columns, exclusive.</div>
//                 <span>:</span>
//                 <label>Step Col:</label>
//                 <input type="number" value={stepCol} onChange={(e) => setStepCol(e.target.value)} className='index-input' />
//                 <span className='tooltip'>?</span>
//                 <div className='tooltip-text'>Defines the step count of the slice for columns.</div>
//             </div>
//             <span className='bracket-index'>]</span>
//             <button onClick={resetIndices} style={{ marginLeft: '10px' }}>Reset</button>
//         </div>
//     );
// }

// export default TwoDimSlicingInputs;
'use client'; // Ensuring this component is treated as a client component in Next.js

import React, { useState } from 'react';
import './MyArrayComponent.css'; // Ensure your CSS supports tooltip visibility on hover

function TwoDimSlicingInputs() {
    const [startRow, setStartRow] = useState('');
    const [stopRow, setStopRow] = useState('');
    const [stepRow, setStepRow] = useState('');
    const [startCol, setStartCol] = useState('');
    const [stopCol, setStopCol] = useState('');
    const [stepCol, setStepCol] = useState('');

    const resetIndices = () => {
        setStartRow('');
        setStopRow('');
        setStepRow('');
        setStartCol('');
        setStopCol('');
        setStepCol('');
    };

    return (
        <div className='expression'>
            <span className='bracket-title'>2-D List </span><span className='bracket-index'>[</span>
            <div className='index-input-item'>
                <input
                    type="number"
                    value={startRow}
                    onChange={(e) => setStartRow(e.target.value)}
                    className='index-input'
                />
                <label>Start Row</label>
                <span className='question-mark'>?</span>
                <span className='tooltip-text'>Defines the starting index for rows .</span>
            </div>
            :
            <div className='index-input-item'>
                <input
                    type="number"
                    value={stopRow}
                    onChange={(e) => setStopRow(e.target.value)}
                    className='index-input'
                />
                <label>Stop Row</label>
                <span className='question-mark'>?</span>
                <span className='tooltip-text'>Defines the ending index for rows (exclusive).</span>
            </div>
            :
            <div className='index-input-item'>
                <input
                    type="number"
                    value={stepRow}
                    onChange={(e) => setStepRow(e.target.value)}
                    className='index-input'
                />
                <label>Step Row</label>
                <span className='question-mark'>?</span>
                <span className='tooltip-text'>Defines the step count for rows (defaults to 1).</span>
            </div>
            <span className='bracket-index'>,</span>
            <div className='index-input-item'>
                <input
                    type="number"
                    value={startCol}
                    onChange={(e) => setStartCol(e.target.value)}
                    className='index-input'
                />
                <label>Start Col</label>
                <span className='question-mark'>?</span>
                <span className='tooltip-text'>Defines the starting index for columns .</span>
            </div>
            :
            <div className='index-input-item'>
                <input
                    type="number"
                    value={stopCol}
                    onChange={(e) => setStopCol(e.target.value)}
                    className='index-input'
                />
                <label>Stop Col</label>
                <span className='question-mark'>?</span>
                <span className='tooltip-text'>Defines the ending index for columns(exclusive).</span>
            </div>
            :
            <div className='index-input-item'>
                <input
                    type="number"
                    value={stepCol}
                    onChange={(e) => setStepCol(e.target.value)}
                    className='index-input'
                />
                <label>Step Col</label>
                <span className='question-mark'>?</span>
                <span className='tooltip-text'>Defines the step count for columns (defaults to 1).</span>
            </div>
            <span className='bracket-index'>]</span>
            <button onClick={resetIndices}>Reset Indices</button>
        </div>
    );
}

export default TwoDimSlicingInputs;
