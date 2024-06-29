// // // 'use client'
// // // import React, { useState } from "react";
// // // import './GenericTable2.css';
// // // import { capitalizeWords } from "@/utils/functions";

// // // const GenericTable = ({ data }) => {
// // //     if (!data || !Array.isArray(data) || data.length === 0) {
// // //         return <p>No data available</p>;
// // //     }

// // //     // Dynamically determine column headers from the keys of the first object in the array
// // //     const columnHeaders = data.length > 0 ? Object.keys(data[0]) : [];

// // //     return (
// // //         <div className="table-container">
// // //             <table className="my-table">
// // //                 <thead>
// // //                     <tr>
// // //                         {columnHeaders.map((header, index) => (
// // //                             <th key={index}>{capitalizeWords(header.replaceAll('_', ' '))}</th>
// // //                         ))}
// // //                     </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                     {data.map((row, rowIndex) => (
// // //                         <tr key={rowIndex}>
// // //                             {columnHeaders.map((col, colIndex) => (
// // //                                 <TableCell key={colIndex} content={row[col]} />
// // //                             ))}
// // //                         </tr>
// // //                     ))}
// // //                 </tbody>
// // //             </table>
// // //         </div>
// // //     );
// // // };

// // // // Separate TableCell component to manage the copy state individually
// // // const TableCell = ({ content }) => {
// // //     const [buttonText, setButtonText] = useState("Copy");

// // //     const copyToClipboard = (text) => {
// // //         navigator.clipboard.writeText(text).then(() => {
// // //             setButtonText("Copied!");
// // //             setTimeout(() => {
// // //                 setButtonText("Copy"); // Reset button text after 5 seconds
// // //             }, 5000);
// // //         }).catch(err => {
// // //             console.error('Could not copy text: ', err);
// // //         });
// // //     };

// // //     const renderCellContent = (item) => {
// // //         if (typeof item === 'object' && item !== null) {
// // //             return JSON.stringify(item, null, 2);
// // //         }
// // //         return item;
// // //     };

// // //     const displayedContent = renderCellContent(content);

// // //     return (
// // //         <td>
// // //             {displayedContent}
// // //             {/* <button onClick={() => copyToClipboard(displayedContent)} style={{ marginLeft: '10px' }}>
// // //                 {buttonText}
// // //             </button> */}
// // //         </td>
// // //     );
// // // };

// // // export default GenericTable;

// // 'use client'
// // import React, { useState } from "react";
// // import './GenericTable2.css';
// // import { capitalizeWords } from "@/utils/functions";

// // const GenericTable = ({ data }) => {
// //     if (!data || !Array.isArray(data) || data.length === 0) {
// //         return <p>No data available</p>;
// //     }

// //     // Dynamically determine column headers from the keys of the first object in the array
// //     const columnHeaders = data.length > 0 ? Object.keys(data[0]) : [];

// //     return (
// //         <div className="table-container">
// //             <table className="my-table">
// //                 <thead>
// //                     <tr>
// //                         {columnHeaders.map((header, index) => (
// //                             <th key={index}>{capitalizeWords(header.replaceAll('_', ' '))}</th>
// //                         ))}
// //                     </tr>
// //                 </thead>
// //                 <tbody>
// //                     {data.map((row, rowIndex) => (
// //                         <tr key={rowIndex}>
// //                             {columnHeaders.map((col, colIndex) => (
// //                                 <TableCell key={colIndex} content={row[col]} />
// //                             ))}
// //                         </tr>
// //                     ))}
// //                 </tbody>
// //             </table>
// //         </div>
// //     );
// // };

// // // Separate TableCell component to manage the copy state individually
// // const TableCell = ({ content }) => {
// //     const [buttonText, setButtonText] = useState("Copy");

// //     const copyToClipboard = (text) => {
// //         navigator.clipboard.writeText(text).then(() => {
// //             setButtonText("Copied!");
// //             setTimeout(() => {
// //                 setButtonText("Copy"); // Reset button text after 5 seconds
// //             }, 5000);
// //         }).catch(err => {
// //             console.error('Could not copy text: ', err);
// //         });
// //     };

// //     const renderCellContent = (item) => {
// //         if (typeof item === 'object' && item !== null) {
// //             return JSON.stringify(item, null, 2);
// //         }
// //         return item;
// //     };

// //     const displayedContent = renderCellContent(content);

// //     return (
// //         <td>
// //             {displayedContent}
// //             {/* <button onClick={() => copyToClipboard(displayedContent)} style={{ marginLeft: '10px' }}>
// //                 {buttonText}
// //             </button> */}
// //         </td>
// //     );
// // };

// // export default GenericTable;
// 'use client'
// import React, { useEffect, useRef, useState } from 'react';
// import './GenericTable2.css';

// const GenericTable = ({ data }) => {
//     const [isSticky, setIsSticky] = useState(false);
//     const tableRef = useRef(null);

//     useEffect(() => {
//         const handleScroll = () => {
//             const top = tableRef.current.getBoundingClientRect().top;
//             setIsSticky(top <= -30);
//         };

//         window.addEventListener('scroll', handleScroll);

//         return () => {
//             window.removeEventListener('scroll', handleScroll);
//         };
//     }, []);

//     if (!data || !Array.isArray(data) || data.length === 0) {
//         return <p>No data available</p>;
//     }

//     const columnHeaders = data.length > 0 ? Object.keys(data[0]) : [];

//     return (
//         <div className="table-container" ref={tableRef}>
//             <table className="my-table">
//                 <thead>
//                     <tr>
//                         {columnHeaders.map((header, index) => (
//                             <th key={index} className={isSticky ? 'sticky' : ''}>
//                                 {header}
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data.map((row, rowIndex) => (
//                         <tr key={rowIndex}>
//                             {columnHeaders.map((col, colIndex) => (
//                                 <td key={colIndex}>{row[col]}</td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default GenericTable;
'use client'
import React, { useEffect, useRef, useState } from 'react';
import './GenericTable2.css';

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
                                {header}
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
