import React from 'react';
import './MyArrayComponent.css';

export default function MyArrayTable({ data }) {
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
        fontSize:'small',
        marginTop:'20px',
        whiteSpace: 'nowrap', // Ensures text stays in a single line
        overflow: 'hidden', // Hide overflow
        textOverflow: 'ellipsis' // Add ellipsis to text that overflows
    };

    const bracketStyle = {
        fontSize: '50px', // Size adjusted for visual
        fontWeight:'200',
        display: 'flex',
        alignItems: 'center', // Center align the brackets
        justifyContent: 'center',
        height: '52px', // Adjusted for the cell height plus padding
    };

    return (
        <div className='main' style={{ display: 'flex', alignItems: 'center' ,marginBottom:'30px'}}>
            <span style={bracketStyle}>[</span>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {data.map((item, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={cellStyle}>{item}</div>
                        <div style={{ fontSize: '10px' }}>{index}</div>
                    </div>
                ))}
            </div>
            <span style={bracketStyle}>]</span>
        </div>
    );
}
