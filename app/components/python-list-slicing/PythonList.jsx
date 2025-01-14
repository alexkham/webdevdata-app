'use client';
import React from 'react';
import './MyArrayComponent.css';

function PythonList({ data, highlightedIndices, shouldHighlight }) {
  const cellStyle = {
    border: 'solid 1px black',
    padding: '2px',
    margin: '1px',
    minHeight: '20px',
    minWidth: '20px', // Minimum width to start with
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '3px',
    backgroundColor: 'lightgrey',
    color: 'black',
    fontSize: 'small',
    whiteSpace: 'nowrap', // Ensures text stays in a single line
    overflow: 'hidden', // Hide overflow
    textOverflow: 'ellipsis', // Add ellipsis to text that overflows
  };

  const highlightedCellStyle = {
    ...cellStyle,
    backgroundColor: 'yellow', // Highlight color
  };

  const bracketStyle = {
    fontSize: '50px', // Size adjusted for visual
    fontWeight: '200',
    display: 'flex',
    alignItems: 'baseline', // Align baseline to lift the brackets
    justifyContent: 'center',
    height: '52px', // Adjusted for the cell height plus padding
    marginBottom: '40px'
  };

  return (
    <div className='python-list' style={{ display: 'flex', alignItems: 'center' }}>
      <span style={bracketStyle}>[</span>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={shouldHighlight && highlightedIndices?.includes(index) ? highlightedCellStyle : cellStyle}>
              {item}
            </div>
            <div style={{ fontSize: '10px' }}>{index}</div>
            <div style={{ fontSize: '10px' }}>{index - data.length}</div> {/* Negative index */}
          </div>
        ))}
      </div>
      <span style={bracketStyle}>]</span>
    </div>
  );
}

export default PythonList;
