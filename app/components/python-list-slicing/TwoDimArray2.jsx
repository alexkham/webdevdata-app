// // // // // 'use client';
// // // // // import React from 'react';
// // // // // import './MyArrayComponent.css';

// // // // // function TwoDimArray2({ data, highlightedIndices, shouldHighlight }) {
// // // // //   const cellStyle = {
// // // // //     border: 'solid 1px black',
// // // // //     padding: '2px',
// // // // //     margin: '1px',
// // // // //     minHeight: '20px',
// // // // //     minWidth: '20px',
// // // // //     display: 'flex',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     borderRadius: '3px',
// // // // //     backgroundColor: 'lightgrey',
// // // // //     color: 'black',
// // // // //     fontSize: 'small',
// // // // //     whiteSpace: 'nowrap',
// // // // //     overflow: 'hidden',
// // // // //     textOverflow: 'ellipsis',
// // // // //   };

// // // // //   const highlightedCellStyle = {
// // // // //     ...cellStyle,
// // // // //     backgroundColor: 'yellow',
// // // // //   };

// // // // //   const bracketStyle = {
// // // // //     fontSize: '25px',
// // // // //     fontWeight: '300',
// // // // //     display: 'flex',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     height: '52px',
// // // // //   };

// // // // //   return (
// // // // //     <table className="python-list">
// // // // //       <tbody>
// // // // //         <tr>
// // // // //           <td style={bracketStyle}>[</td>
// // // // //         </tr>
// // // // //         {data.map((row, rowIndex) => (
// // // // //           <tr key={rowIndex}>
// // // // //             <td>
// // // // //               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '5px' }}>
// // // // //                 <div style={{ display: 'flex', flexDirection: 'row' }}>
// // // // //                   <div style={{ fontSize: '12px', marginRight: '5px' }}>{-data.length + rowIndex}</div>
// // // // //                   <div style={{ fontSize: '12px' }}>{rowIndex}</div>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </td>
// // // // //             <td style={bracketStyle}>[</td>
// // // // //             {row.map((item, colIndex) => (
// // // // //               <td key={colIndex}>
// // // // //                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // // // //                   <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
// // // // //                     {item}
// // // // //                   </div>
// // // // //                   {rowIndex === data.length - 1 && (
// // // // //                     <div className="indices">
// // // // //                       <div style={{ fontSize: '12px', marginLeft: '5px' }}>{colIndex}</div>
// // // // //                       <div style={{ fontSize: '12px', marginRight: '5px' }}>{colIndex - row.length}</div>
// // // // //                     </div>
// // // // //                   )}
// // // // //                 </div>
// // // // //               </td>
// // // // //             ))}
// // // // //             <td style={bracketStyle}>]</td>
// // // // //           </tr>
// // // // //         ))}
// // // // //         <tr>
// // // // //           <td style={bracketStyle}>]</td>
// // // // //         </tr>
// // // // //       </tbody>
// // // // //     </table>
// // // // //   );
// // // // // }

// // // // // export default TwoDimArray2;

// // // // 'use client';
// // // // import React from 'react';
// // // // import './MyArrayComponent.css';

// // // // function TwoDimArray2({ data, highlightedIndices, shouldHighlight }) {
// // // //   const cellStyle = {
// // // //     border: 'solid 1px black',
// // // //     padding: '2px',
// // // //     margin: '0px',
// // // //     minHeight: '20px',
// // // //     minWidth: '20px',
// // // //     display: 'flex',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     borderRadius: '3px',
// // // //     backgroundColor: 'lightgrey',
// // // //     color: 'black',
// // // //     fontSize: 'small',
// // // //     whiteSpace: 'nowrap',
// // // //     overflow: 'hidden',
// // // //     textOverflow: 'ellipsis',
// // // //   };

// // // //   const highlightedCellStyle = {
// // // //     ...cellStyle,
// // // //     backgroundColor: 'yellow',
// // // //   };

// // // //   const bracketStyle = {
// // // //     fontSize: '25px',
// // // //     fontWeight: '300',
// // // //     display: 'flex',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     height: '52px',
// // // //   };

// // // //   const lastRowStyle = {
// // // //     height: '82px',
    
// // // //   };

// // // //   return (
// // // //     <table className="python-list" cellSpacing="0">
// // // //       <tbody>
// // // //         <tr>
// // // //           <td style={bracketStyle}>[</td>
// // // //         </tr>
// // // //         {data.map((row, rowIndex) => (
// // // //           <tr key={rowIndex} style={rowIndex === data.length - 1 ? lastRowStyle : {}}>
// // // //             <td>
// // // //               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '5px' }}>
// // // //                 <div style={{ display: 'flex', flexDirection: 'row' }}>
// // // //                   <div style={{ fontSize: '12px', marginRight: '5px' }}>{-data.length + rowIndex}</div>
// // // //                   <div style={{ fontSize: '12px' }}>{rowIndex}</div>
// // // //                 </div>
// // // //               </div>
// // // //             </td>
// // // //             <td style={bracketStyle}>[</td>
// // // //             {row.map((item, colIndex) => (
// // // //               <td key={colIndex} style={{ padding: 0 }}>
// // // //                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // // //                   <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
// // // //                     {item}
// // // //                   </div>
// // // //                   {rowIndex === data.length - 1 && (
// // // //                     <div className="indices">
// // // //                       <div style={{ fontSize: '12px', marginLeft: '5px' }}>{colIndex}</div>
// // // //                       <div style={{ fontSize: '12px', marginRight: '5px' }}>{colIndex - row.length}</div>
// // // //                     </div>
// // // //                   )}
// // // //                 </div>
// // // //               </td>
// // // //             ))}
// // // //             <td style={bracketStyle}>]</td>
// // // //           </tr>
// // // //         ))}
// // // //         <tr>
// // // //           <td style={bracketStyle}>]</td>
// // // //         </tr>
// // // //       </tbody>
// // // //     </table>
// // // //   );
// // // // }

// // // // export default TwoDimArray2;
// // // 'use client';
// // // import React from 'react';
// // // import './MyArrayComponent.css';

// // // function TwoDimArray2({ data, highlightedIndices, shouldHighlight }) {
// // //   const cellStyle = {
// // //     border: 'solid 1px black',
// // //     padding: '2px',
// // //     minHeight: '20px',
// // //     minWidth: '20px',
// // //     display: 'flex',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderRadius: '3px',
// // //     backgroundColor: 'lightgrey',
// // //     color: 'black',
// // //     fontSize: 'small',
// // //     whiteSpace: 'nowrap',
// // //     overflow: 'hidden',
// // //     textOverflow: 'ellipsis',
// // //   };

// // //   const highlightedCellStyle = {
// // //     ...cellStyle,
// // //     backgroundColor: 'yellow',
// // //   };

// // //   const bracketStyle = {
// // //     fontSize: '25px',
// // //     fontWeight: '300',
// // //     display: 'flex',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     height: '52px',
// // //   };

// // //   const lastRowStyle = {
// // //     height: '82px',
// // //   };

// // //   return (
// // //     <table className="python-list" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
// // //       <tbody>
// // //         <tr>
// // //           <td style={bracketStyle}>[</td>
// // //         </tr>
// // //         {data.map((row, rowIndex) => (
// // //           <tr key={rowIndex} style={rowIndex === data.length - 1 ? lastRowStyle : {}}>
// // //             <td style={{ padding: 0 }}>
// // //               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '5px' }}>
// // //                 <div style={{ display: 'flex', flexDirection: 'row' }}>
// // //                   <div style={{ fontSize: '12px', marginRight: '5px' }}>{-data.length + rowIndex}</div>
// // //                   <div style={{ fontSize: '12px' }}>{rowIndex}</div>
// // //                 </div>
// // //               </div>
// // //             </td>
// // //             <td style={{ ...bracketStyle, padding: 0 }}>[</td>
// // //             {row.map((item, colIndex) => (
// // //               <td key={colIndex} style={{ padding: 0 }}>
// // //                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // //                   <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
// // //                     {item}
// // //                   </div>
// // //                   {rowIndex === data.length - 1 && (
// // //                     <div className="indices">
// // //                       <div style={{ fontSize: '12px', marginLeft: '5px' }}>{colIndex}</div>
// // //                       <div style={{ fontSize: '12px', marginRight: '5px' }}>{colIndex - row.length}</div>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               </td>
// // //             ))}
// // //             <td style={{ ...bracketStyle, padding: 0 }}>]</td>
// // //           </tr>
// // //         ))}
// // //         <tr>
// // //           <td style={bracketStyle}>]</td>
// // //         </tr>
// // //       </tbody>
// // //     </table>
// // //   );
// // // }

// // // export default TwoDimArray2;

// // // import React from 'react';
// // // import './MyArrayComponent.css';

// // // function TwoDimArray2({ data, highlightedIndices, shouldHighlight }) {
// // //   const cellStyle = {
// // //     border: 'solid 1px black',
// // //     padding: '1px',
// // //     minHeight: '20px',
// // //     minWidth: '20px',
// // //     display: 'flex',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderRadius: '3px',
// // //     backgroundColor: 'lightgrey',
// // //     color: 'black',
// // //     fontSize: 'small',
// // //     whiteSpace: 'nowrap',
// // //     overflow: 'hidden',
// // //     textOverflow: 'ellipsis',
// // //   };

// // //   const highlightedCellStyle = {
// // //     ...cellStyle,
// // //     backgroundColor: 'yellow',
// // //     padding:'0px'
// // //   };

// // //   const bracketStyle = {
// // //     fontSize: '25px',
// // //     fontWeight: '300',
// // //     display: 'flex',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     height: '25px',
// // //     padding:'-30px'
    
// // //   };

// // //   return (
// // //     <div className='outer-frame'>
// // //         <span className='main-bracket'>[</span>
// // //     <table className="python-list" cellSpacing="0" cellPadding="0" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>

// // //       <tbody>
// // //         {/* <tr>
          
// // //         </tr> */}
// // //         {data.map((row, rowIndex) => (
// // //           <tr key={rowIndex}>
// // //             <td style={{ padding: 0 }}>
// // //               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '5px' }}>
// // //                 <div style={{ display: 'flex', flexDirection: 'row' }}>
// // //                   <div style={{ fontSize: '12px', marginRight: '20px' }}>{-data.length + rowIndex}</div>
// // //                   <div style={{ fontSize: '12px' }}>{rowIndex}</div>
// // //                 </div>
// // //               </div>
// // //             </td>
// // //             <td style={{ ...bracketStyle, padding: 0 }}>[</td>
// // //             {row.map((item, colIndex) => (
// // //               <td key={colIndex} style={{ padding: 0 }}>
// // //                 <div className='td-div' style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
// // //                     {item}
// // //                 </div>
// // //               </td>
// // //             ))}
// // //             <td style={{ ...bracketStyle, padding: 0 }}>]</td>
// // //           </tr>
// // //         ))}
// // //         {/* Indices row */}
// // //         <tr>
// // //           <td></td>
// // //           <td></td>
// // //           {data[data.length - 1].map((_, colIndex) => (
// // //             <td key={colIndex} style={{ textAlign: 'center', padding: '0px 0' }}>
// // //               <div className="indices">
// // //                 <div style={{ fontSize: '12px' }}>{colIndex}</div>
// // //                 <div style={{ fontSize: '12px' }}>{colIndex - data[data.length - 1].length}</div>
// // //               </div>
// // //             </td>
// // //           ))}
// // //           <td></td>
// // //         </tr>
// // //         {/* <tr>
         
// // //         </tr> */}
// // //       </tbody>
// // //     </table>
// // //     <td className='main-bracket'>]</td>
// // //     </div>
// // //   );
// // // }

// // // export default TwoDimArray2;
// // 'use client';

// // import React, { useEffect, useState } from 'react';
// // import './MyArrayComponent.css';

// // function TwoDimArray2({ data, highlightedIndices, shouldHighlight }) {
// //   const [tableHeight, setTableHeight] = useState(0);
// //   const cellStyle = {
// //     border: 'solid 1px black',
// //     padding: '1px',
// //     minHeight: '20px',
// //     minWidth: '20px',
// //     display: 'flex',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: '3px',
// //     backgroundColor: 'lightgrey',
// //     color: 'black',
// //     fontSize: 'small',
// //     whiteSpace: 'nowrap',
// //     overflow: 'hidden',
// //     textOverflow: 'ellipsis',
// //   };

// //   const highlightedCellStyle = {
// //     ...cellStyle,
// //     backgroundColor: 'yellow',
// //   };

// //   const bracketStyle = {
// //     fontSize: '25px',
// //     fontWeight: '300',
// //     display: 'flex',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     padding: '0'
// //   };

// //   // Adjust this based on your actual row height including padding/borders
// //   useEffect(() => {
// //     const rowHeight = 25; 
// //     setTableHeight(data.length * rowHeight);
// //   }, [data]);

// //   return (
// //     <div className='outer-frame' style={{ display: 'flex', alignItems: 'center' }}>
// //         <div className='main-bracket' style={{ fontSize: '25px', height: `${tableHeight}px` }}>[</div>
// //         <table className="python-list" cellSpacing="0" cellPadding="0" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
// //           <tbody>
// //             {data.map((row, rowIndex) => (
// //               <tr key={rowIndex}>
// //                 <td style={{ padding: 0 }}>
// //                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '5px' }}>
// //                     <div style={{ display: 'flex', flexDirection: 'row' }}>
// //                       <div style={{ fontSize: '12px', marginRight: '5px' }}>{-data.length + rowIndex}</div>
// //                       <div style={{ fontSize: '12px' }}>{rowIndex}</div>
// //                     </div>
// //                   </div>
// //                 </td>
// //                 <td style={{ ...bracketStyle }}>[</td>
// //                 {row.map((item, colIndex) => (
// //                   <td key={colIndex} style={{ padding: 0 }}>
// //                     <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
// //                       {item}
// //                     </div>
// //                   </td>
// //                 ))}
// //                 <td style={{ ...bracketStyle }}>]</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //         <div className='main-bracket' style={{ fontSize: '25px', height: `${tableHeight}px` }}>]</div>
// //     </div>
// //   );
// // }

// // export default TwoDimArray2;

// 'use client';

// import React, { useEffect, useState } from 'react';
// import './MyArrayComponent.css';

// function TwoDimArray2({ data, highlightedIndices, shouldHighlight }) {
//   const [tableHeight, setTableHeight] = useState(0);
//   const [bracketFontSize, setBracketFontSize] = useState('25px');

//   const cellStyle = {
//     border: 'solid 1px black',
//     padding: '1px',
//     minHeight: '20px',
//     minWidth: '20px',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: '3px',
//     backgroundColor: 'lightgrey',
//     color: 'black',
//     fontSize: 'small',
//     whiteSpace: 'nowrap',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//   };

//   const highlightedCellStyle = {
//     ...cellStyle,
//     backgroundColor: 'yellow',
//   };

//   const bracketStyle = {
//     fontWeight: '300',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '0'
//   };

//   useEffect(() => {
//     const rowHeight = 25; // Adjust this based on your actual row height including padding/borders
//     const rowCount = data.length;
//     const totalHeight = rowCount * rowHeight;
//     setTableHeight(totalHeight);
//     const calculatedFontSize = Math.max(25, totalHeight / rowCount); // Adjust this ratio based on your design
//     setBracketFontSize(`${calculatedFontSize}px`);
//   }, [data]);

//   return (
//     <div className='outer-frame' style={{ display: 'flex', alignItems: 'center' }}>
//         <div className='main-bracket' style={{ ...bracketStyle, fontSize: bracketFontSize, height: `${tableHeight}px` }}>[</div>
//         <table className="python-list" cellSpacing="0" cellPadding="0" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
//           <tbody>
//             {data.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 <td style={{ padding: 0 }}>
//                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '5px' }}>
//                     <div style={{ display: 'flex', flexDirection: 'row' }}>
//                       <div style={{ fontSize: '12px', marginRight: '5px' }}>{-data.length + rowIndex}</div>
//                       <div style={{ fontSize: '12px' }}>{rowIndex}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td style={{ ...bracketStyle, fontSize: bracketFontSize }}>[</td>
//                 {row.map((item, colIndex) => (
//                   <td key={colIndex} style={{ padding: 0 }}>
//                     <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
//                       {item}
//                     </div>
//                   </td>
//                 ))}
//                 <td style={{ ...bracketStyle, fontSize: bracketFontSize }}>]</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className='main-bracket' style={{ ...bracketStyle, fontSize: bracketFontSize, height: `${tableHeight}px` }}>]</div>
//     </div>
//   );
// }

// export default TwoDimArray2;
// 'use client';

// import React, { useEffect, useState } from 'react';
// import './MyArrayComponent.css';

// function TwoDimArray2({ data, highlightedIndices, shouldHighlight }) {
//   const [tableHeight, setTableHeight] = useState(0);

//   const cellStyle = {
//     border: 'solid 1px black',
//     padding: '1px',
//     minHeight: '20px',
//     minWidth: '20px',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: '3px',
//     backgroundColor: 'lightgrey',
//     color: 'black',
//     fontSize: 'small',
//     whiteSpace: 'nowrap',
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//   };

//   const highlightedCellStyle = {
//     ...cellStyle,
//     backgroundColor: 'yellow',
//   };

//   const bracketStyle = {
//     fontWeight: '300',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '0'
//   };

//   useEffect(() => {
//     const rowHeight = 25; // Base height per row
//     const spacing = 5;  // Additional spacing for between rows
//     const totalHeight = data.length * rowHeight + (data.length - 1) * spacing; // Calculate total height including inter-row space
//     setTableHeight(totalHeight);
//   }, [data]);

//   return (
//     <div className='outer-frame' style={{ display: 'flex', alignItems: 'center' }}>
//         <div className='main-bracket' style={{  fontSize: `${tableHeight}px`, height: `${tableHeight}px` }}>[</div>
//         <table className="python-list" cellSpacing="0" cellPadding="0" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
//           <tbody>
//             {data.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 <td style={{ padding: 0 }}>
//                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '5px' }}>
//                     <div style={{ display: 'flex', flexDirection: 'row' }}>
//                       <div style={{ fontSize: '12px', marginRight: '5px' }}>{-data.length + rowIndex}</div>
//                       <div style={{ fontSize: '12px' }}>{rowIndex}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td style={{ ...bracketStyle }}>[</td>
//                 {row.map((item, colIndex) => (
//                   <td key={colIndex} style={{ padding: 0 }}>
//                     <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
//                       {item}
//                     </div>
//                    </td>
                   
//                 ))}
//                 <td style={{ ...bracketStyle }}>]</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className='main-bracket' style={{ fontSize: `${tableHeight}px`, height: `${tableHeight}px` }}>]</div>
//     </div>
//   );
// }

// export default TwoDimArray2;
'use client';

import React, { useEffect, useState } from 'react';
import './MyArrayComponent.css';

function TwoDimArray2({ data, highlightedIndices, shouldHighlight }) {
  const [tableHeight, setTableHeight] = useState(0);

  const cellStyle = {
    border: 'solid 1px black',
    padding: '1px',
    minHeight: '20px',
    minWidth: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '3px',
    backgroundColor: 'lightgrey',
    color: 'black',
    fontSize: 'small',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const highlightedCellStyle = {
    ...cellStyle,
    backgroundColor: 'yellow',
  };

  const bracketStyle = {
    fontWeight: '300',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0'
  };

  useEffect(() => {
    const rowHeight = 25; // Base height per row
    const spacing = 5;  // Additional spacing for between rows
    const totalHeight = data.length * rowHeight + (data.length - 1) * spacing; // Calculate total height including inter-row space
    setTableHeight(totalHeight);
  }, [data]);

  return (
    <div className='outer-frame' style={{ display: 'flex', alignItems: 'center' }}>
        <div className='main-bracket' style={{  fontSize: `${tableHeight}px`, height: `${tableHeight}px` ,marginBottom:`${data.length*10}px` }}  >[</div>
        <table className="python-list" cellSpacing="0" cellPadding="0" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td style={{ padding: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '5px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div style={{ fontSize: '12px', marginRight: '25px' }}>{-data.length + rowIndex}</div>
                      <div style={{ fontSize: '12px' }}>{rowIndex}</div>
                    </div>
                  </div>
                </td>
                <td style={{ ...bracketStyle }}>[</td>
                {row.map((item, colIndex) => (
                  <td key={colIndex} style={{ padding: 0 }}>
                    <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
                      {item}
                    </div>
                  </td>
                ))}
                <td style={{ ...bracketStyle }}>]</td>
              </tr>
            ))}
            {/* Additional row for indices */}
            <tr>
              <td></td> {/* Empty cell for alignment */}
              <td></td> {/* Empty cell for alignment */}
              {data[data.length - 1].map((_, colIndex) => (
                <td key={colIndex} style={{ textAlign: 'center', padding: '0px' }}>
                  <div className="indices">
                    <div style={{ fontSize: '12px', marginLeft: '0px' }}>{colIndex}</div>
                    <div style={{ fontSize: '12px', marginRight: '5px' }}>{-(data[data.length - 1].length - colIndex - 1)}</div>
                  </div>
                </td>
              ))}
              <td></td> {/* Empty cell for alignment */}
            </tr>
          </tbody>
        </table>
        <div className='main-bracket' style={{ fontSize: `${tableHeight}px`, height: `${tableHeight}px`,marginBottom:`${data.length*10}px` }}>]</div>
    </div>
  );
}

export default TwoDimArray2;
