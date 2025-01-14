'use client';
import React, { useState } from 'react';
import PythonList from './PythonList';

function RandomArrayGenerator({ setData }) {
  const [length, setLength] = useState(5); // Default length for the random list
  const [dataType, setDataType] = useState('number'); // Default data type
  const [list, setList] = useState([]); // State variable to store the generated list
  const [error, setError] = useState(''); // State variable to store error message

  const generateRandomList = () => {
    if (length > 30) {
      setError('Length cannot be more than 30');
      return;
    }
    setError('');
    let newList = [];
    for (let i = 0; i < length; i++) {
      if (dataType === 'number') {
        newList.push(Math.floor(Math.random() * 100)); // Generate random numbers between 0 and 99
      } else {
        newList.push(Math.random().toString(36).substring(2, 7)); // Generate random strings
      }
    }
    setList(newList); // Save the generated list into the state variable
    setData(newList); // Update the parent component's state with the generated list
  };

  const handleReset = () => {
    setList([]); // Reset the list to an empty array
    setError(''); // Clear the error message
    setLength(5); // Reset the length to the default value
  };

  const handleLengthChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value <= 30) {
      setLength(value);
      setError('');
    } else {
      setError('Length cannot be more than 30');
    }
  };

  return (
    <div>
      <label>
        Length:
        <br></br>
        <input
          className='select'
          type="number"
          value={length}
          onChange={handleLengthChange}
        />
      </label>
      {error && <div style={{ color: 'red', fontSize: '12px' }}>{error}</div>}
      <br></br>
      <label>
        Data Type:
        <select
          className='select'
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
        >
          <option value="number">Number</option>
          <option value="string">String</option>
        </select>
      </label>
      <button onClick={generateRandomList}>Generate Random List</button>
      <button onClick={handleReset}>Reset List</button>
      {list.length > 0 && <PythonList data={list} />}
    </div>
  );
}

export default RandomArrayGenerator;
