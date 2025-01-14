'use client'
import React, { useEffect, useRef, useState } from 'react';
import './GenericTable2.css';
import { capitalizeWords } from '@/utils/functions';

const GenericTable = ({ data }) => {
    const headerRef = useRef(null);
    const [sticky, setSticky] = useState(false);

    const checkSticky = () => {
        const headerTop = headerRef.current.getBoundingClientRect().top;
        setSticky(headerTop <= -30);  // Set sticky based on scroll position
    };

    useEffect(() => {
        window.addEventListener('scroll', checkSticky);
        return () => {
            window.removeEventListener('scroll', checkSticky);
        };
    }, []);

    if (!data || !Array.isArray(data) || data.length === 0) {
        return <p>No data available</p>;
    }

    const columnHeaders = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <div className="table-container">
            <table className="my-table">
                <thead ref={headerRef}>
                    <tr>
                        {columnHeaders.map((header, index) => (
                            <th key={index} className={sticky ? 'sticky' : ''}>
                                {capitalizeWords(header.replaceAll('_',' '))}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columnHeaders.map((col, colIndex) => (
                                <td key={colIndex}>{row[col]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GenericTable;
