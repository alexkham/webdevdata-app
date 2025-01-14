'use client';
import React, { useState, useRef, useEffect } from 'react';
import MyArrayTable from './MyArrayTable';
import './MyArrayComponent.css';

function ArrayVisualizer({ setData }) {
  const [numbers, setNumbers] = useState([]);
  const [done, setDone] = useState(false);
  const inputRefs = useRef([]); // Array to store references to input fields

  const handleAddNumber = () => {
    const updatedNumbers = [...numbers, ''];
    setNumbers(updatedNumbers);
    // Add a new ref for the new input
    inputRefs.current = [...inputRefs.current, React.createRef()];
  };

  const handleRemoveNumber = (indexToRemove) => {
    setNumbers(numbers.filter((_, index) => index !== indexToRemove));
    inputRefs.current = inputRefs.current.filter((_, index) => index !== indexToRemove);
  };

  const handleInputChange = (e, index) => {
    const newNumbers = [...numbers];
    newNumbers[index] = e.target.value;
    setNumbers(newNumbers);
  };

  const handleDone = () => {
    const filteredNumbers = numbers.map(num => (num === '' ? 0 : parseInt(num, 10)));
    setData(filteredNumbers);
    setDone(true);
  };

  const handleResetAll = () => {
    setNumbers([]);
    setDone(false);
    inputRefs.current = [];
  };

  useEffect(() => {
    // Focus the last input field whenever a new input is added
    if (inputRefs.current.length > 0) {
      inputRefs.current[inputRefs.current.length - 1].current.focus();
    }
  }, [numbers]);

  return (
    <>
      <div className='aggregation-main'>
        <div className='output-container'>
          <MyArrayTable data={numbers} />
        </div>
        {!done && (
          <div className='aggregation-container'>
            {numbers.map((number, index) => (
              <div key={index} className='input-wrapper'>
                <input
                  type="number"
                  placeholder='Enter number ...'
                  value={number}
                  onChange={(event) => handleInputChange(event, index)}
                  className='select'
                  ref={inputRefs.current[index]} // Assign ref to input
                  style={{maxWidth:'100px'}}

                />
                <button className='delete-button' onClick={() => handleRemoveNumber(index)}>Remove</button>
              </div>
            ))}
            <div>
              <button className='add-button' onClick={handleAddNumber}>Add Input Field</button>
              <button className='reset-button' onClick={handleResetAll}>Reset All</button>
              <button className='done-button' onClick={handleDone}>Done</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ArrayVisualizer;
