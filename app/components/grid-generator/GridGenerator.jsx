'use client'
import React, { useState } from 'react';
import './GridGenerator.css'; // Ensure you have a corresponding CSS file

function GridGenerator() {
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);
  const [gap, setGap] = useState(10);

  const gridStyle = {
    display: 'grid',
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
  };

  return (
    <div className="grid-generator">
        <div className="controls">
        <label>
          Rows:
          <input type="number" value={rows} onChange={e => setRows(e.target.value)} />
        </label>
        <label>
          Columns:
          <input type="number" value={columns} onChange={e => setColumns(e.target.value)} />
        </label>
        <label>
          Gap (px):
          <input type="number" value={gap} onChange={e => setGap(e.target.value)} />
        </label>
      </div>
      <div style={gridStyle}>
        {[...Array(rows * columns)].map((_, idx) => (
          <div key={idx} className="grid-item">Item {idx + 1}</div>
        ))}
      </div>
      
    </div>
  );
}

export default GridGenerator;
