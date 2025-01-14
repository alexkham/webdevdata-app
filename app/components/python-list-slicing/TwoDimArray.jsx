// // // // // // // 'use client';
// // // // // // // import React from 'react';
// // // // // // // import './MyArrayComponent.css';

// // // // // // // function TwoDimArray({ data, highlightedIndices, shouldHighlight }) {
// // // // // // //   const cellStyle = {
// // // // // // //     border: 'solid 1px black',
// // // // // // //     padding: '2px',
// // // // // // //     margin: '1px',
// // // // // // //     minHeight: '20px',
// // // // // // //     minWidth: '20px', 
// // // // // // //     display: 'flex',
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //     borderRadius: '3px',
// // // // // // //     backgroundColor: 'lightgrey',
// // // // // // //     color: 'black',
// // // // // // //     fontSize: 'small',
// // // // // // //     whiteSpace: 'nowrap',
// // // // // // //     overflow: 'hidden',
// // // // // // //     textOverflow: 'ellipsis',
// // // // // // //   };

// // // // // // //   const highlightedCellStyle = {
// // // // // // //     ...cellStyle,
// // // // // // //     backgroundColor: 'yellow',
// // // // // // //   };

// // // // // // //   const bracketStyle = {
// // // // // // //     fontSize: '25px',
// // // // // // //     fontWeight: '300',
// // // // // // //     display: 'flex',
// // // // // // //     alignItems: 'baseline',
// // // // // // //     justifyContent: 'center',
// // // // // // //     height: '52px',
// // // // // // //     marginBottom: '5px'
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div className='python-list' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // // // // // //       <span style={bracketStyle}>[</span>
// // // // // // //       {data.map((row, rowIndex) => (
// // // // // // //         <div key={rowIndex} style={{ display: 'flex', alignItems: 'center' }}>
// // // // // // //           <span style={bracketStyle}>[</span>
// // // // // // //           <div style={{ display: 'flex', flexDirection: 'row' }}>
// // // // // // //             {row.map((item, colIndex) => (
// // // // // // //               <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // // // // // //                 <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
// // // // // // //                   {item}
// // // // // // //                 </div>
// // // // // // //                 <div style={{ fontSize: '10px' }}>{colIndex}</div>
// // // // // // //                 <div style={{ fontSize: '10px' }}>{colIndex - row.length}</div>
// // // // // // //               </div>
// // // // // // //             ))}
// // // // // // //           </div>
// // // // // // //           <span style={bracketStyle}>]</span>
// // // // // // //         </div>
// // // // // // //       ))}
// // // // // // //       <span style={bracketStyle}>]</span>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }

// // // // // // // export default TwoDimArray;
// // // // // // 'use client';
// // // // // // import React from 'react';
// // // // // // import './MyArrayComponent.css';

// // // // // // function TwoDimArray({ data, highlightedIndices, shouldHighlight }) {
// // // // // //   const cellStyle = {
// // // // // //     border: 'solid 1px black',
// // // // // //     padding: '2px',
// // // // // //     margin: '1px',
// // // // // //     minHeight: '20px',
// // // // // //     minWidth: '20px',
// // // // // //     display: 'flex',
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     borderRadius: '3px',
// // // // // //     backgroundColor: 'lightgrey',
// // // // // //     color: 'black',
// // // // // //     fontSize: 'small',
// // // // // //     whiteSpace: 'nowrap',
// // // // // //     overflow: 'hidden',
// // // // // //     textOverflow: 'ellipsis',
// // // // // //   };

// // // // // //   const highlightedCellStyle = {
// // // // // //     ...cellStyle,
// // // // // //     backgroundColor: 'yellow',
// // // // // //   };

// // // // // //   const rowBracketStyle = {
// // // // // //     fontSize: '30px',
// // // // // //     fontWeight: '200',
// // // // // //     display: 'flex',
// // // // // //     alignItems: 'baseline',
// // // // // //     justifyContent: 'center',
// // // // // //     height: '32px', // Adjusted for the cell height plus padding
// // // // // //   };

// // // // // //   const mainBracketHeight = data.length * 52; // 52 is the height of each row bracket + marginBottom

// // // // // //   const mainBracketStyle = {
// // // // // //     fontSize: '50px',
// // // // // //     fontWeight: '200',
// // // // // //     display: 'flex',
// // // // // //     alignItems: 'baseline',
// // // // // //     justifyContent: 'center',
// // // // // //     height: `${mainBracketHeight}px`,
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className='python-list' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // // // // //       <span style={mainBracketStyle}>[</span>
// // // // // //       <div>
// // // // // //         {data.map((row, rowIndex) => (
// // // // // //           <div key={rowIndex} style={{ display: 'flex', alignItems: 'center' }}>
// // // // // //             <span style={rowBracketStyle}>[</span>
// // // // // //             <div style={{ display: 'flex', flexDirection: 'row' }}>
// // // // // //               {row.map((item, colIndex) => (
// // // // // //                 <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // // // // //                   <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
// // // // // //                     {item}
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //               ))}
// // // // // //             </div>
// // // // // //             <span style={rowBracketStyle}>]</span>
// // // // // //           </div>
// // // // // //         ))}
// // // // // //       </div>
// // // // // //       <span style={mainBracketStyle}>]</span>
// // // // // //       <div style={{ display: 'flex', flexDirection: 'row' }}>
// // // // // //         {data[0].map((_, colIndex) => (
// // // // // //           <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // // // // //             <div style={{ fontSize: '10px' }}>{colIndex}</div>
// // // // // //             <div style={{ fontSize: '10px' }}>{colIndex - data[0].length}</div>
// // // // // //           </div>
// // // // // //         ))}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // // export default TwoDimArray;
// // // // // 'use client';
// // // // // import React from 'react';
// // // // // import './MyArrayComponent.css';

// // // // // function TwoDimArray({ data, highlightedIndices, shouldHighlight }) {
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

// // // // //   const rowBracketStyle = {
// // // // //     fontSize: '25px',
// // // // //     fontWeight: '300',
// // // // //     display: 'flex',
// // // // //     alignItems: 'baseline',
// // // // //     justifyContent: 'center',
// // // // //     height: '52px',
// // // // //     marginBottom: '5px'
// // // // //   };

// // // // //   const mainBracketHeight = data.length * 52; // 52 is the height of each row bracket + marginBottom

// // // // //   const mainBracketStyle = {
// // // // //     fontSize: '50px',
// // // // //     fontWeight: '200',
// // // // //     display: 'flex',
// // // // //     alignItems: 'baseline',
// // // // //     justifyContent: 'center',
// // // // //     height: `${mainBracketHeight}px`,
// // // // //   };

// // // // //   return (
// // // // //     <div className='python-list' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // // // //       <span style={mainBracketStyle}>[</span>
// // // // //       <div>
// // // // //         {data.map((row, rowIndex) => (
// // // // //           <div key={rowIndex} style={{ display: 'flex', alignItems: 'center' }}>
// // // // //             <span style={rowBracketStyle}>[</span>
// // // // //             <div style={{ display: 'flex', flexDirection: 'row' }}>
// // // // //               {row.map((item, colIndex) => (
// // // // //                 <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // // // //                   <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
// // // // //                     {item}
// // // // //                   </div>
// // // // //                 </div>
// // // // //               ))}
// // // // //             </div>
// // // // //             <span style={rowBracketStyle}>]</span>
// // // // //           </div>
// // // // //         ))}
// // // // //       </div>
// // // // //       <span style={mainBracketStyle}>]</span>
// // // // //       <div style={{ display: 'flex', flexDirection: 'row' }}>
// // // // //         {data[0].map((_, colIndex) => (
// // // // //           <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // // // //             <div style={{ fontSize: '10px' }}>{colIndex}</div>
// // // // //             <div style={{ fontSize: '10px' }}>{colIndex - data[0].length}</div>
// // // // //           </div>
// // // // //         ))}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default TwoDimArray;
// // // // 'use client';
// // // // import React from 'react';
// // // // import './MyArrayComponent.css';

// // // // function TwoDimArray({ data, highlightedIndices, shouldHighlight }) {
// // // //   const cellStyle = {
// // // //     border: 'solid 1px black',
// // // //     padding: '2px',
// // // //     margin: '1px',
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
// // // //     alignItems: 'baseline',
// // // //     justifyContent: 'center',
// // // //     height: '52px',
// // // //     marginBottom: '5px'
// // // //   };

// // // //   return (
// // // //     <div className='python-list' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // // //       <span style={bracketStyle}>[</span>
// // // //       {data.map((row, rowIndex) => (
// // // //         <div key={rowIndex} style={{ display: 'flex', alignItems: 'center' }}>
// // // //           <span style={bracketStyle}>[</span>
// // // //           <div style={{ display: 'flex', flexDirection: 'row' }}>
// // // //             {row.map((item, colIndex) => (
// // // //               <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // // //                 <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
// // // //                   {item}
// // // //                 </div>
// // // //                 {rowIndex === data.length - 1 && (
// // // //                   <>
// // // //                     <div style={{ fontSize: '10px' }}>{colIndex}</div>
// // // //                     <div style={{ fontSize: '10px' }}>{colIndex - row.length}</div>
// // // //                   </>
// // // //                 )}
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //           <span style={bracketStyle}>]</span>
// // // //         </div>
// // // //       ))}
// // // //       <span style={bracketStyle}>]</span>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default TwoDimArray;
// // // 'use client';
// // // import React from 'react';
// // // import './MyArrayComponent.css';

// // // function TwoDimArray({ data, highlightedIndices, shouldHighlight }) {
// // //   const cellStyle = {
// // //     border: 'solid 1px black',
// // //     padding: '2px',
// // //     margin: '1px',
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
// // //     alignItems: 'baseline',
// // //     justifyContent: 'center',
// // //     height: '52px',
// // //     marginBottom: '5px'
// // //   };

// // //   // Variable to adjust the vertical offset of the brackets
// // //   const bracketOffset = '5px'; // Change this value to increase or decrease the offset

// // //   return (
// // //     <div className='python-list' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // //       <span style={bracketStyle}>[</span>
// // //       {data.map((row, rowIndex) => (
// // //         <div key={rowIndex} style={{ display: 'flex', alignItems: 'center' }}>
// // //           <span style={rowIndex !== data.length - 1 ? {...bracketStyle, marginBottom: bracketOffset} : bracketStyle}>[</span>
// // //           <div style={{ display: 'flex', flexDirection: 'row' }}>
// // //             {row.map((item, colIndex) => (
// // //               <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// // //                 <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
// // //                   {item}
// // //                 </div>
// // //                 {rowIndex === data.length - 1 && (
// // //                   <>
// // //                     <div style={{ fontSize: '10px' }}>{colIndex}</div>
// // //                     <div style={{ fontSize: '10px' }}>{colIndex - row.length}</div>
// // //                   </>
// // //                 )}
// // //               </div>
// // //             ))}
// // //           </div>
// // //           <span style={rowIndex !== data.length - 1 ? {...bracketStyle, marginTop: bracketOffset} : bracketStyle}>]</span>
// // //         </div>
// // //       ))}
// // //       <span style={bracketStyle}>]</span>
// // //     </div>
// // //   );
// // // }

// // // export default TwoDimArray;
// // 'use client';
// // import React from 'react';
// // import './MyArrayComponent.css';

// // function TwoDimArray({ data, highlightedIndices, shouldHighlight }) {
// //   const cellStyle = {
// //     border: 'solid 1px black',
// //     padding: '2px',
// //     margin: '1px',
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
// //     alignItems: 'baseline',
// //     justifyContent: 'center',
// //     height: '52px',
// //     marginBottom: '5px'
// //   };

// //   // Variable to adjust the vertical offset of the indices
// //   const indexOffset = '-5px'; // Change this value to increase or decrease the offset

// //   return (
// //     <div className='python-list' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// //       <span style={bracketStyle}>[</span>
// //       {data.map((row, rowIndex) => (
// //         <div key={rowIndex} style={{ display: 'flex', alignItems: 'center' }}>
// //           <span style={bracketStyle}>[</span>
// //           <div style={{ display: 'flex', flexDirection: 'row' }}>
// //             {row.map((item, colIndex) => (
// //               <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// //                 <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
// //                   {item}
// //                 </div>
// //                 <div style={{ fontSize: '10px', marginTop: rowIndex !== data.length - 1 ? indexOffset : '0px' }}>{colIndex}</div>
// //                 <div style={{ fontSize: '10px', marginTop: rowIndex !== data.length - 1 ? indexOffset : '0px' }}>{colIndex - row.length}</div>
// //               </div>
// //             ))}
// //           </div>
// //           <span style={bracketStyle}>]</span>
// //         </div>
// //       ))}
// //       <span style={bracketStyle}>]</span>
// //     </div>
// //   );
// // }

// // export default TwoDimArray;
// // 'use client';
// // import React from 'react';
// // import './MyArrayComponent.css';

// // function TwoDimArray({ data, highlightedIndices, shouldHighlight }) {
// //   const cellStyle = {
// //     border: 'solid 1px black',
// //     padding: '2px',
// //     margin: '1px',
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
// //     alignItems: 'baseline',
// //     justifyContent: 'center',
// //     height: '52px',
// //     marginBottom: '5px' // Bracket vertical spacing for the last row
// //   };

// //   // Change this value to adjust the bracket offset for non-last rows
// //   const bracketOffset = '20px';

// //   return (
// //     <div className='python-list' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// //       <span style={bracketStyle}>[</span>
// //       {data.map((row, rowIndex) => (
// //         <div  className='row-class' key={rowIndex} style={{ display: 'flex', alignItems: 'center' }}>
// //           <span style={rowIndex === data.length - 1 ? bracketStyle : {...bracketStyle, marginTop: bracketOffset}}>[</span>
// //           <div style={{ display: 'flex', flexDirection: 'row' }}>
// //             {row.map((item, colIndex) => (
// //               <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// //                 <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
// //                   {item}
// //                 </div>
// //                 {rowIndex === data.length - 1 && (
// //                   <div className='indices'>
// //                     <div style={{ fontSize: '10px' }}>{colIndex}</div>
// //                     <div style={{ fontSize: '10px' }}>{colIndex - row.length}</div>
// //                   </div>
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //           <span style={rowIndex === data.length - 1 ? bracketStyle : {...bracketStyle, marginTop: bracketOffset}}>]</span>
// //         </div>
// //       ))}
// //       <span style={bracketStyle}>]</span>
// //     </div>
// //   );
// // }

// // export default TwoDimArray;
// 'use client';
// import React from 'react';
// import './MyArrayComponent.css';

// function TwoDimArray({ data, highlightedIndices, shouldHighlight }) {
//   const cellStyle = {
//     border: 'solid 1px black',
//     padding: '2px',
//     margin: '1px',
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
//     fontSize: '25px',
//     fontWeight: '300',
//     display: 'flex',
//     alignItems: 'baseline',
//     justifyContent: 'center',
//     height: '52px',
//     marginBottom: '5px' // Bracket vertical spacing for the last row
//   };

//   const bracketOffset = '23px';

//   return (
//     <div className='python-list' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <span style={bracketStyle}>[</span>
//       {data.map((row, rowIndex) => (
//         <div className='row-class' key={rowIndex} style={{
//           display: 'flex',
//           alignItems: 'center',
//           marginBottom: rowIndex === data.length - 2 ? '10px' : '0px' // Add 5px gap before the last row
//         }}>
//           <span style={rowIndex === data.length - 1 ? bracketStyle : {...bracketStyle, marginTop: bracketOffset}}>[</span>
//           <div style={{ display: 'flex', flexDirection: 'row' }}>
//             {row.map((item, colIndex) => (
//               <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                 <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
//                   {item}
//                 </div>
//                 {rowIndex === data.length - 1 && (
//                   <div className='indices'>
//                     <div style={{ fontSize: '10px',marginLeft: '3px' }}>{colIndex}</div>
//                     <div style={{ fontSize: '10px' }}>{colIndex - row.length}</div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <span style={rowIndex === data.length - 1 ? bracketStyle : {...bracketStyle, marginTop: bracketOffset}}>]</span>
//         </div>
//       ))}
//       <span style={bracketStyle}>]</span>
//     </div>
//   );
// }

// export default TwoDimArray;
'use client';
import React from 'react';
import './MyArrayComponent.css';

function TwoDimArray({ data, highlightedIndices, shouldHighlight }) {
  const cellStyle = {
    border: 'solid 1px black',
    padding: '2px',
    margin: '1px',
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
    fontSize: '25px',
    fontWeight: '300',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    height: '52px',
    marginBottom: '5px', // Bracket vertical spacing for the last row
  };

  const bracketOffset = '20px';

  return (
    <div className='python-list' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span style={bracketStyle}>[</span>
      {data.map((row, rowIndex) => (
        <div
          className='row-class'
          key={rowIndex}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: rowIndex === data.length - 2 ? '10px' : '0px', // Adjusted to 10px gap before the last row
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '5px' }}>
            <div style={{display:'flex',flexDirection:'row'}}>
              <div style={{ fontSize: '12px',marginRight:'5px' }}>{-data.length + rowIndex}</div>
              <div style={{ fontSize: '12px' }}>{rowIndex}</div>
            </div>
          </div>
          <span style={rowIndex === data.length - 1 ? bracketStyle : { ...bracketStyle, marginTop: bracketOffset }}>[</span>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {row.map((item, colIndex) => (
              <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={shouldHighlight && highlightedIndices?.includes(`${rowIndex}-${colIndex}`) ? highlightedCellStyle : cellStyle}>
                  {item}
                </div>
                {rowIndex === data.length - 1 && (
                  <div className='indices'>
                    <div style={{ fontSize: '12px',marginLeft:'5px' }}>{colIndex}</div>
                    <div style={{ fontSize: '12px',marginRight:'5px' }}>{colIndex - row.length}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <span style={rowIndex === data.length - 1 ? bracketStyle : { ...bracketStyle, marginTop: bracketOffset }}>]</span>
        </div>
      ))}
      <span style={bracketStyle}>]</span>
    </div>
  );
}

export default TwoDimArray;
