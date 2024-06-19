'use client';
import React, { useState, useEffect } from 'react';
import TwoDimArray2 from './TwoDimArray2';
import TwoDimSlicingInputs from './TwoDimSlicingInputs';
import './MyArrayComponent.css';

function TwoDimListSplitVisualizer() {
  // Initial 2-D array
  const [data, setData] = useState(Array.from({ length: 10 }, (_, i) =>
    Array.from({ length: 10 }, (_, j) => 10 * (i + 1) + (j + 1))
  ));

  // Slicing parameters for both dimensions
  const [startRow, setStartRow] = useState('');
  const [stopRow, setStopRow] = useState('');
  const [stepRow, setStepRow] = useState('');

  const [startCol, setStartCol] = useState('');
  const [stopCol, setStopCol] = useState('');
  const [stepCol, setStepCol] = useState('');

  // Handle reset to the default 2-D array
  const handleReset = () => {
    setData(Array.from({ length: 10 }, (_, i) =>
      Array.from({ length: 10 }, (_, j) => 10 * (i + 1) + (j + 1))
    ));
    setStartRow('');
    setStopRow('');
    setStepRow('');
    setStartCol('');
    setStopCol('');
    setStepCol('');
  };

  return (
    <div className='outer-container-two-dim'>
      
      <div className='array-visualization-container'>
        <TwoDimArray2 data={data} highlightedIndices={[]} shouldHighlight={false} />
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
      <div className='btn-group'>
        <button onClick={handleReset}>Reset to Default 2-D Array</button>
      </div>

    </div>
  );
}

export default TwoDimListSplitVisualizer;
