'use client';
import React, { useState, useEffect } from 'react';
import ArrayVisualizerWithProps from './ArrayVisualizerWithProps';
import PythonList from './PythonList';
import RandomArrayGenerator from './RandomArrayGenerator';
import SlicingInputs from './SlicingInputs';
import './MyArrayComponent.css';
import ExplanationBox from './ExplanationBox';

function ListSplitVisualizer() {
  const [data, setData] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // Initial array
  const [start, setStart] = useState('');
  const [stop, setStop] = useState('');
  const [step, setStep] = useState('');
  const [customizing, setCustomizing] = useState(false); // State to determine if user is customizing
  const [method, setMethod] = useState(''); // User choice for array generation method
  const [order, setOrder] = useState(null); // default to original order
  const [error, setError] = useState('');
  const [indexCode, setIndexCode] = useState('');
  const [result, setResult] = useState([]);



  
  const handleCustomArray = () => {
    setCustomizing(true);
    setData([]); // Clear the existing array when customizing starts
  };

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
  };


  const categorizeIndex = (index, length) => {
    if (index === '') return '1'; // Default/missing
    const num = parseInt(index, 10);
    if (isNaN(num)) return '1'; // Treat non-integer as missing
    if (num < 0) {
        return Math.abs(num) <= length ? '3' : '4'; // Negative in range or out of range
    }
    return num < length ? '2' : '4'; // Positive in range or out of range
};




  const handleDataChange = (newData) => {
    setData(newData);
    setCustomizing(false); // Exit customization mode after setting new data
  };

  const handleReset = () => {
    setData([1, 2, 3, 4, 5,6,7,8,9,10]); // Reset to the default array
    setStart('');
    setStop('');
    setStep('');
    setCustomizing(false);
    setMethod('');
  };

  useEffect(() => {
    if (step < 0) {
      setOrder('reverse');
    } else{
      setOrder('original');
    }
  }, [start, stop, step]); // React to changes in start, stop, or step
  
  useEffect(()=>{
    // resetIndeces()
    setStart('');
   setStop('');
   setStep('')  ;
   setIndexCode('')
  },[data]);

  useEffect(()=>{
    setIndexCode('');
  },[customizing,method,data])



const validateIndices = (start, stop, step, length) => {
  const startCode = categorizeIndex(start, length);
  const stopCode = categorizeIndex(stop, length);
  const stepCode = (step < 0) ? 2 : ((step > 0 || step === '') ? 1 : 0);

  // Determine the combination code for start and stop indices
  let combinationCode;
  const startValue = start === '' ? 0 : parseInt(start, 10);
  const stopValue = stop === '' ? length : parseInt(stop, 10);

  if (startValue < stopValue) {
    combinationCode = 1;
  } else if (startValue === stopValue) {
    combinationCode = 2;
  } else {
    combinationCode = 3;
  }

  // Calculate a four-digit code
  const code = parseInt(startCode) * 1000 + parseInt(stopCode) * 100 + combinationCode * 10 + parseInt(stepCode);

  setIndexCode(code);
};

useEffect(() => {
  validateIndices(start, stop, step, data.length);
}, [start, stop, step, data.length]);



const getHighlightedIndices = () => {
  const len = data.length;
  const stepValue = step === '' ? 1 : parseInt(step, 10);

  if (stepValue < 0) {
      return getHighlightedIndicesNegative(len, stepValue);
  } else {
      return getHighlightedIndicesPositive(len, stepValue);
  }
};

const getHighlightedIndicesPositive = (len, stepValue) => {
  // Handle default indices when start or stop values are empty
  let startIndex = start === '' ? 0 : parseInt(start, 10);
  let stopIndex = stop === '' ? len : parseInt(stop, 10);

  // Ensure the indices are within the array bounds
  startIndex = Math.max(0, Math.min(len, startIndex));
  stopIndex = Math.max(0, Math.min(len, stopIndex));

  let indices = [];
  if(stepValue !== 0) {
    for (let i = startIndex; i < stopIndex; i += stepValue) {
      if (i >= 0 && i < len) {
        indices.push(i);
      }
    }
  }
  return indices;
};


const getHighlightedIndicesNegative = (len, stepValue) => {
  // Explicitly set default values for start and stop based on the step
  
  let startIndex = start === '' ? - 1 : parseInt(start, 10);
  let stopIndex = stop === '' ? -(len+1) : parseInt(stop, 10);

  // Adjust indices that are negative to positive based on the array length
  startIndex = adjustIndex(startIndex, len);
  stopIndex = adjustIndex(stopIndex, len);

  let indices = [];
  // Iterate from start to stop, stepping by the negative step value
  for (let i = startIndex; i > stopIndex; i += stepValue) {
      // Only include indices that are within the array bounds
      if (i >= 0 && i < len) {
          indices.push(i);
      }
  }
  return indices;
};


const adjustIndex = (index, length) => {
  return index < 0 ? length + index : index;
};


 const resetIndeces=()=>{
   setStart('');
   setStop(data.length-1);
   setStep(1);
 }

 const toggleCustomizing=()=>{
  setCustomizing(!customizing);
  handleReset();
 }


// const getSlicedData = () => {
//   // Defaulting start, stop, and step according to Python's rules for negative steps
//   let startIndex = start !== '' ? parseInt(start, 10) : (step < 0 ? data.length - 1 : 0);
//   let stopIndex = stop !== '' ? parseInt(stop, 10) : (step < 0 ? -1 : data.length);
//   const stepValue = step !== '' ? parseInt(step, 10) : 1;

//   if(startIndex<0){
//     startIndex=data.length+startIndex
//   }
//   if(stopIndex<0){
//     stopIndex=data.length+stopIndex
//   }
//   const result = [];
//   if (stepValue > 0) {
//     // Normal positive step handling
//     for (let i = startIndex; i < stopIndex && i < data.length; i += stepValue) {
//       if (i >= 0) result.push(data[i]);
//     }
//   } else if (stepValue < 0) {
//     // Handling for negative steps
//     if (start === '' && stop === ''||start<0&&stop === ''||start>0&&stop === '') {
//       // Special case for [::-1]
//       for (let i = data.length-1; i >= 0; i += stepValue) {
//         result.push(data[i]);
//       }
//     }else if (stop===''&&start>0){
//         for (let i = start; i >= 0; i += stepValue) {
//             result.push(data[i]);}

//     } else {
//       // General case for negative steps with specified start or stop
//       for (let i = startIndex; i > stopIndex && i >= 0 && i < data.length; i += stepValue) {
//         result.push(data[i]);
//       }
//     }
//   }
//   return result;
// };

// const getSlicedData = () => {
//     const len = data.length;
//     let stepValue = step !== '' ? parseInt(step, 10) : 1;
//     let startIndex = start !== '' ? parseInt(start, 10) : (stepValue < 0 ? len - 1 : 0);
//     let stopIndex = stop !== '' ? parseInt(stop, 10) : (stepValue < 0 ? -1 : len);
  
//     // Standardize indices: converting any negative indices to positive based on the array length
//     startIndex = startIndex < 0 ? len + startIndex : startIndex;
//     stopIndex = stopIndex < 0 ? len + stopIndex : stopIndex;
  
//     // Handling the step value of zero as an error case
//     if (stepValue === 0) {
//       console.error("Step cannot be zero.");
//       return [];
//     }
  
//     const result = [];
//     if (stepValue > 0) {
//       // Positive step: slicing from start to stop (or the end if not specified)
//       for (let i = startIndex; i < stopIndex && i < len; i += stepValue) {
//         result.push(data[i]);
//       }
//     } else {
//       // Negative step: slicing from start to stop in reverse (from the end if start is not specified)
//       for (let i = startIndex; i > stopIndex && i >= 0; i += stepValue) {
//         result.push(data[i]);
//       }
//     }
  
//     return result;
//   };
  
const getSlicedData = () => {
    const len = data.length;
    let stepValue = step !== '' ? parseInt(step, 10) : 1;  // Default step to 1 if not specified

    

    let startIndex = start !== '' ? parseInt(start, 10) : (stepValue < 0 ? len - 1 : 0);
    let stopIndex = stop !== '' ? parseInt(stop, 10) : (stepValue < 0 ? -(len+1) : len);
  
    // Correct adjustment for negative indices
    startIndex = startIndex < 0 ? len + startIndex : startIndex;
    stopIndex = stopIndex < 0 ? len + stopIndex : stopIndex;

    console.log('startIndex  '+startIndex)
    console.log('stopIndex   '+stopIndex)
  
    // Validate step to ensure it is not zero
    if (stepValue === 0) {
      console.error("Step cannot be zero.");
      return [];
    }
  
    const result = [];
    if (stepValue > 0) {
        
      for (let i = startIndex; i < stopIndex && i < len; i += stepValue) {
        result.push(data[i]);
      }
    } else {
      for (let i = startIndex; i > stopIndex && i >= 0; i += stepValue) {
        result.push(data[i]);
      }
    }
  
    return result;
  };
  
  // Depend on data, start, stop, and step to update the result array
  
  
console.log(getSlicedData());


useEffect(() => {
  const newResult = getSlicedData(); // Use the slicing function discussed earlier
  setResult(newResult);
}, [start, stop, step, data]); // Dependencies array


  return (
    <div className='outer-container'>
          {/* <div>{customizing?'yes':'no'}</div> */}
          {/* <div>{indexCode}</div> */}
          <button onClick={toggleCustomizing}>Use Default List</button>
          {!customizing&&<button onClick={handleCustomArray}>Create Custom List</button>}
          <hr></hr>
          <br></br>
         
      
      {!customizing ? (
        <>
        <div className='list-container'>
          {data.length > 0 && <PythonList data={data} highlightedIndices={getHighlightedIndices() }  shouldHighlight={true}/>}
          
          <div className='result'> {' Result→'}</div>
          <br></br>
          
          {data.length > 0 && <PythonList data={result} highlightedIndices={getHighlightedIndices()} shouldHighlight={false} />}
          </div>
          {error && <div className="error-message">{error}</div>}
         {order && <div className='order' style={{fontSize:'300'}}>
          {order === 'original' ? 'Original Order →' : '← Reverse Order'}
        </div>}
          {data.length > 0 && (
            <SlicingInputs
              start={start}
              stop={stop}
              step={step}
              setStart={setStart}
              setStop={setStop}
              setStep={setStep}
              className='slicing-inputs'
              
            />
          )}
          
          <ExplanationBox indexCode={indexCode} 
          start={start} stop={stop} 
          step={step} data={data} ></ExplanationBox>
          
          {/* <button onClick={handleCustomArray}>Create Custom Array</button> */}
        </>
      ) : (
        <>
          <label>
            Choose Method:
            <select  className='select' value={method} onChange={handleMethodChange}>
              <option value="">Select Method</option>
              <option value="input">Input Values Directly</option>
              <option value="random">Generate Random List</option>
            </select>
          </label>

          {method === 'input' && (
            <>
              <ArrayVisualizerWithProps setData={handleDataChange} />
            </>
          )}
          {method === 'random' && (
            <>
              <RandomArrayGenerator setData={handleDataChange} />
            </>
          )}
        </>
      )}
      {data.length > 0 && customizing && (
        <>
        <div>
          <PythonList data={data} highlightedIndices={getHighlightedIndices()} />
          {error && <div className="error-message">{error}</div>}
          {order && <div className='order' style={{fontSize:'300'}}>
          {order === 'original' ? 'Original Order →' : '← Reverse Order'}
        </div>}
          <SlicingInputs
            start={start}
            stop={stop}
            step={step}
            setStart={setStart}
            setStop={setStop}
            setStep={setStep}
            className='slicing-inputs'
          />
          <button onClick={handleReset}>Reset All</button>
          
         {method&&data&& <ExplanationBox 
         indexCode={indexCode} start={start} 
         stop={stop} step={step} data={data} ></ExplanationBox>}
        </div>
        
         </>
      )}
     
    </div>
  );
}

export default ListSplitVisualizer;
