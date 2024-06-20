// // // 'use client';
// // // import React, { useState, useEffect } from 'react';
// // // import TwoDimArray2 from './TwoDimArray2';
// // // import TwoDimSlicingInputs from './TwoDimSlicingInputs';
// // // import './MyArrayComponent.css';

// // // function TwoDimListSplitVisualizer() {
// // //   // Initial 2-D array
// // //   const [data, setData] = useState(Array.from({ length: 10 }, (_, i) =>
// // //     Array.from({ length: 10 }, (_, j) => 10 * (i + 1) + (j + 1))
// // //   ));

// // //   // Slicing parameters for both dimensions
// // //   const [startRow, setStartRow] = useState('');
// // //   const [stopRow, setStopRow] = useState('');
// // //   const [stepRow, setStepRow] = useState('');

// // //   const [startCol, setStartCol] = useState('');
// // //   const [stopCol, setStopCol] = useState('');
// // //   const [stepCol, setStepCol] = useState('');

// // //   // Handle reset to the default 2-D array
// // //   const handleReset = () => {
// // //     setData(Array.from({ length: 10 }, (_, i) =>
// // //       Array.from({ length: 10 }, (_, j) => 10 * (i + 1) + (j + 1))
// // //     ));
// // //     setStartRow('');
// // //     setStopRow('');
// // //     setStepRow('');
// // //     setStartCol('');
// // //     setStopCol('');
// // //     setStepCol('');
// // //   };

// // //   return (
// // //     <div className='outer-container-two-dim'>
      
// // //       <div className='array-visualization-container'>
// // //         <TwoDimArray2 data={data} highlightedIndices={[]} shouldHighlight={false} />
// // //       </div>

// // //       <div className='slicing-inputs-container'>
// // //         <TwoDimSlicingInputs
// // //           startRow={startRow} setStartRow={setStartRow}
// // //           stopRow={stopRow} setStopRow={setStopRow}
// // //           stepRow={stepRow} setStepRow={setStepRow}
// // //           startCol={startCol} setStartCol={setStartCol}
// // //           stopCol={stopCol} setStopCol={setStopCol}
// // //           stepCol={stepCol} setStepCol={setStepCol}
// // //         />
// // //       </div>
// // //       <div className='btn-group'>
// // //         <button onClick={handleReset}>Reset to Default 2-D Array</button>
// // //       </div>

// // //     </div>
// // //   );
// // // }

// // // export default TwoDimListSplitVisualizer;
// // 'use client';

// // import React, { useState } from 'react';
// // import TwoDimArray2 from './TwoDimArray2';
// // import TwoDimSlicingInputs from './TwoDimSlicingInputs';
// // import './MyArrayComponent.css';

// // function TwoDimListSplitVisualizer() {
// //   const [data, setData] = useState(Array.from({ length: 10 }, (_, i) =>
// //     Array.from({ length: 10 }, (_, j) => 10 * (i + 1) + (j + 1))
// //   ));

// //   const [startRow, setStartRow] = useState('');
// //   const [stopRow, setStopRow] = useState('');
// //   const [stepRow, setStepRow] = useState('');

// //   const [startCol, setStartCol] = useState('');
// //   const [stopCol, setStopCol] = useState('');
// //   const [stepCol, setStepCol] = useState('');

// //   const handleReset = () => {
// //     setData(Array.from({ length: 10 }, (_, i) =>
// //       Array.from({ length: 10 }, (_, j) => 10 * (i + 1) + (j + 1))
// //     ));
// //     setStartRow('');
// //     setStopRow('');
// //     setStepRow('');
// //     setStartCol('');
// //     setStopCol('');
// //     setStepCol('');
// //   };

// //   return (
// //     <div className='outer-container-two-dim'>
// //       <div className='array-visualization-container'>
// //         <TwoDimArray2 data={data} highlightedIndices={[]} shouldHighlight={false} />
// //       </div>

// //       <div className='slicing-inputs-container'>
// //         <TwoDimSlicingInputs
// //           startRow={startRow} setStartRow={setStartRow}
// //           stopRow={stopRow} setStopRow={setStopRow}
// //           stepRow={stepRow} setStepRow={setStepRow}
// //           startCol={startCol} setStartCol={setStartCol}
// //           stopCol={stopCol} setStopCol={setStopCol}
// //           stepCol={stepCol} setStepCol={setStepCol}
// //         />
// //       </div>
// //       <div className='btn-group'>
// //         <button onClick={handleReset}>Reset to Default 2-D Array</button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default TwoDimListSplitVisualizer;
// 'use client';

// import React, { useState, useEffect } from 'react';
// import TwoDimArray2 from './TwoDimArray2';
// import TwoDimSlicingInputs from './TwoDimSlicingInputs';
// import './MyArrayComponent.css';

// function TwoDimListSplitVisualizer() {

//     const highlightedIndices2 = ['0-1', '1-1', '2-1'];

//     const [data, setData] = useState(Array.from({ length: 10 }, (_, i) =>
//         Array.from({ length: 10 }, (_, j) => 10 * (i + 1) + (j + 1))
//     ));

//     const [startRow, setStartRow] = useState('');
//     const [stopRow, setStopRow] = useState('');
//     const [stepRow, setStepRow] = useState('');
//     const [startCol, setStartCol] = useState('');
//     const [stopCol, setStopCol] = useState('');
//     const [stepCol, setStepCol] = useState('');
//     const [highlightedIndices, setHighlightedIndices] = useState([]);

//     useEffect(() => {
//         calculateHighlightedIndices();
//         console.log(highlightedIndices)
//     }, [startRow, stopRow, stepRow, startCol, stopCol, stepCol]);

//     function calculateHighlightedIndices() {
//         const rowIndices = getIndices(startRow, stopRow, stepRow, data.length);
//         const colIndices = getIndices(startCol, stopCol, stepCol, data[0].length);
//         const newHighlightedIndices = [];

//         rowIndices.forEach(r => {
//             colIndices.forEach(c => {
//                 newHighlightedIndices.push([r, c]);
//             });
//         });

//         setHighlightedIndices(newHighlightedIndices);
//     }

//     function getIndices(start, stop, step, length) {
//         start = start !== '' ? parseInt(start) : (step < 0 ? length - 1 : 0);
//         stop = stop !== '' ? parseInt(stop) : (step < 0 ? -1 : length);
//         step = step !== '' ? parseInt(step) : 1;

//         if (step === 0) throw new Error("Step cannot be zero.");

//         const indices = [];
//         if (step > 0) {
//             for (let i = start; i < stop && i < length; i += step) {
//                 indices.push(normalizeIndex(i, length));
//             }
//         } else {
//             for (let i = start; i > stop && i >= -length; i += step) {
//                 indices.push(normalizeIndex(i, length));
//             }
//         }
//         return indices;
//     }

//     function normalizeIndex(index, length) {
//         return index < 0 ? length + index : index;
//     }

//     const handleReset = () => {
//         setData(Array.from({ length: 10 }, (_, i) =>
//             Array.from({ length: 10 }, (_, j) => 10 * (i + 1) + (j + 1))
//         ));
//         setStartRow('');
//         setStopRow('');
//         setStepRow('');
//         setStartCol('');
//         setStopCol('');
//         setStepCol('');
//         setHighlightedIndices([]);
//     };

//     return (
//         <div className='outer-container-two-dim'>
//             <div className='array-visualization-container'>
//                 <TwoDimArray2 data={data} highlightedIndices={highlightedIndices2} shouldHighlight={true} />
//             </div>

//             <div className='slicing-inputs-container'>
//                 <TwoDimSlicingInputs
//                     startRow={startRow} setStartRow={setStartRow}
//                     stopRow={stopRow} setStopRow={setStopRow}
//                     stepRow={stepRow} setStepRow={setStepRow}
//                     startCol={startCol} setStartCol={setStartCol}
//                     stopCol={stopCol} setStopCol={setStopCol}
//                     stepCol={stepCol} setStepCol={setStepCol}
//                 />
//             </div>
//             <div className='btn-group'>
//                 <button onClick={handleReset}>Reset to Default 2-D Array</button>
//             </div>
//         </div>
//     );
// }

// export default TwoDimListSplitVisualizer;
'use client';
import React, { useState, useEffect } from 'react';
import TwoDimArray2 from './TwoDimArray2';
import TwoDimSlicingInputs from './TwoDimSlicingInputs';
import './MyArrayComponent.css';


const exampleData = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [7, 8, 9],
    [7, 8, 9],
    [7, 8, 9],
    
    
  ];


function TwoDimListSplitVisualizer() {
    const [data, setData] = useState([]);
    const [startRow, setStartRow] = useState('');
    const [stopRow, setStopRow] = useState('');
    const [stepRow, setStepRow] = useState('');
    const [startCol, setStartCol] = useState('');
    const [stopCol, setStopCol] = useState('');
    const [stepCol, setStepCol] = useState('');
    const [highlightedIndices, setHighlightedIndices] = useState([]);
    const [orderHorizontal,setOrderHorizontal]=useState(null);
    const [orderVertical,setOrderVertical]=useState(null);
    const [result,setResult]=useState(exampleData);

    
    useEffect(() => {
        if (stepCol < 0) {
          setOrderHorizontal('reverse');
        } else{
          setOrderHorizontal('original');
        }
      }, [ stepCol]);

      useEffect(() => {
        if (stepRow < 0) {
          setOrderVertical('reverse');
        } else{
          setOrderVertical('original');
        }
      }, [ stepRow]);

    useEffect(() => {
        // Initialize the default data when the component mounts
        const defaultData = Array.from({ length: 10 }, (_, i) =>
            Array.from({ length: 10 }, (_, j) => 10 * (i + 1) + (j + 1))
        );
        setData(defaultData);
    }, []);

    useEffect(() => {
        calculateHighlightedIndices();
    }, [startRow, stopRow, stepRow, startCol, stopCol, stepCol, data]);

    function calculateHighlightedIndices() {
        const rowIndices = getIndices(startRow, stopRow, stepRow, data.length);
        const colIndices = data.length > 0 ? getIndices(startCol, stopCol, stepCol, data[0].length) : [];
        const newHighlightedIndices = rowIndices.flatMap(r =>
            colIndices.map(c => [r, c])
        );
        setHighlightedIndices(newHighlightedIndices);
    }

    function getIndices(start, stop, step, length) {
        start = start !== '' ? parseInt(start) : (step < 0 ? length - 1 : 0);
        stop = stop !== '' ? parseInt(stop) : (step < 0 ? -1 : length);
        step = step !== '' ? parseInt(step) : 1;

        if (step === 0) throw new Error("Step cannot be zero.");

        const indices = [];
        if (step > 0) {
            for (let i = start; i < stop && i < length; i += step) {
                indices.push(i);
            }
        } else {
            for (let i = start; i > stop && i >= 0; i += step) {
                indices.push(i);
            }
        }
        return indices;
    }

    const handleReset = () => {
        const defaultData = Array.from({ length: 10 }, (_, i) =>
            Array.from({ length: 10 }, (_, j) => 10 * (i + 1) + (j + 1))
        );
        setData(defaultData);
        setStartRow('');
        setStopRow('');
        setStepRow('');
        setStartCol('');
        setStopCol('');
        setStepCol('');
        setHighlightedIndices([]);
    };

    return (
        <div className='outer-container-two-dim'>
            <div className='array-visualization-container'>
                <div className='row-block'>
                {orderVertical && <div className='order-vertical' style={{fontSize:'300'}}>
                {orderVertical === 'original' ? <><p>Original Order</p><p className='arrow'>↓</p></> 
                : <><p>Reverse Order</p><p className='arrow'>↑</p></>}
                </div>}  
                <TwoDimArray2
                    data={data}
                    highlightedIndices={highlightedIndices}
                    shouldHighlight={true}
                />
                 <br></br>
                <div style={{marginTop:'150px'}} className='result'> {' Result→'}</div>
                 <TwoDimArray2
                   data={result}
                   shouldHighlight={false}
                 ></TwoDimArray2>
                </div>
               
          {orderHorizontal && <div className='order' style={{fontSize:'100'}}>
          {orderHorizontal === 'original' ? `         Original Order →` : '← Reverse Order'}
        </div>}
            </div>
            <div className='slicing-inputs-container'>
                <TwoDimSlicingInputs
                    startRow={startRow} setStartRow={setStartRow}
                    stopRow={stopRow} setStopRow={setStopRow}
                    stepRow={stepRow} setStepRow={setStepRow}
                    startCol={startCol} setStartCol={setStartCol}
                    stopCol={stopCol} setStopCol={setStopCol}
                    stepCol={stepCol} setStepCol={setStepCol}
                />
            </div>
            {/* <div className='btn-group'>
                <button onClick={handleReset}>Reset to Default 2-D Array</button>
            </div> */}
        </div>
    );
}

export default TwoDimListSplitVisualizer;