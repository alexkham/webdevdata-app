// // // import React, { useState } from 'react';
// // // import styles from './AdvancedDataFrameDisplay.module.css';

// // // const AdvancedDataFrameDisplay = ({ data, info }) => {
// // //   const [showFull, setShowFull] = useState(false);
  
// // //   if (!data || !data.columns || !data.data) {
// // //     return <p>No data to display</p>;
// // //   }

// // //   const displayData = showFull ? data.data : data.data.slice(0, 5);

// // //   const renderTable = (tableData) => (
// // //     <table className={styles.dataFrameTable}>
// // //       <thead>
// // //         <tr>
// // //           <th></th>
// // //           {data.columns.map((column, index) => (
// // //             <th key={index}>{column}</th>
// // //           ))}
// // //         </tr>
// // //       </thead>
// // //       <tbody>
// // //         {tableData.map((row, rowIndex) => (
// // //           <tr key={rowIndex} className={styles.dataRow}>
// // //             <td className={styles.indexCell}>{rowIndex}</td>
// // //             {row.map((cell, cellIndex) => (
// // //               <td key={cellIndex}>{cell}</td>
// // //             ))}
// // //           </tr>
// // //         ))}
// // //       </tbody>
// // //     </table>
// // //   );

// // //   return (
// // //     <div className={styles.advancedDataFrameContainer}>
// // //       {renderTable(displayData)}
// // //       {!showFull && data.data.length > 5 && (
// // //         <button onClick={() => setShowFull(true)} className={styles.showMoreButton}>
// // //           Show all {data.data.length} rows
// // //         </button>
// // //       )}
      
// // //       <pre className={styles.infoBox}>
// // //         <code>
// // //           {info}
// // //         </code>
// // //       </pre>
// // //     </div>
// // //   );
// // // };

// // // export default AdvancedDataFrameDisplay;
// // import React, { useState, useEffect } from 'react';
// // import styles from './AdvancedDataFrameDisplay.module.css';

// // const AdvancedDataFrameDisplay = ({ data, info }) => {
// //   const [showFull, setShowFull] = useState(false);
// //   const [clientData, setClientData] = useState(null);

// //   useEffect(() => {
// //     // Ensure consistent data between server and client
// //     setClientData(data);
// //   }, [data]);

// //   if (!clientData || !clientData.columns || !clientData.data) {
// //     return <p>Loading data...</p>;
// //   }

// //   const displayData = showFull ? clientData.data : clientData.data.slice(0, 5);

// //   const renderTable = (tableData) => (
// //     <table className={styles.dataFrameTable}>
// //       <thead>
// //         <tr>
// //           <th></th>
// //           {clientData.columns.map((column, index) => (
// //             <th key={index}>{column}</th>
// //           ))}
// //         </tr>
// //       </thead>
// //       <tbody>
// //         {tableData.map((row, rowIndex) => (
// //           <tr key={rowIndex} className={styles.dataRow}>
// //             <td className={styles.indexCell}>{rowIndex}</td>
// //             {row.map((cell, cellIndex) => (
// //               <td key={cellIndex}>{cell}</td>
// //             ))}
// //           </tr>
// //         ))}
// //       </tbody>
// //     </table>
// //   );

// //   return (
// //     <div className={styles.advancedDataFrameContainer}>
// //       {renderTable(displayData)}
// //       {!showFull && clientData.data.length > 5 && (
// //         <button onClick={() => setShowFull(true)} className={styles.showMoreButton}>
// //           Show all {clientData.data.length} rows
// //         </button>
// //       )}
      
// //       <pre className={styles.infoBox}>
// //         <code>
// //           {info}
// //         </code>
// //       </pre>
// //     </div>
// //   );
// // };

// // export default AdvancedDataFrameDisplay;
// import React, { useState, useEffect } from 'react';
// import styles from './AdvancedDataFrameDisplay.module.css';

// const AdvancedDataFrameDisplay = ({ data, info }) => {
//   const [showFull, setShowFull] = useState(false);
//   const [clientData, setClientData] = useState(null);

//   useEffect(() => {
//     setClientData(data);
//   }, [data]);

//   if (!clientData || !clientData.columns || !clientData.data) {
//     return <p>Loading data...</p>;
//   }

//   const displayData = showFull ? clientData.data : clientData.data.slice(0, 5);

//   const renderTable = (tableData) => (
//     <table className={styles.dataFrameTable}>
//       <thead>
//         <tr>
//           <th></th>
//           {clientData.columns.map((column, index) => (
//             <th key={index}>{column}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {tableData.map((row, rowIndex) => (
//           <tr key={rowIndex} className={styles.dataRow}>
//             <td className={styles.indexCell}>{rowIndex}</td>
//             {row.map((cell, cellIndex) => (
//               <td key={cellIndex}>{cell}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );

//   const toggleShowFull = () => {
//     setShowFull(!showFull);
//   };

//   return (
//     <div className={styles.advancedDataFrameContainer}>
//       {renderTable(displayData)}
//       {clientData.data.length > 5 && (
//         <button onClick={toggleShowFull} className={styles.toggleButton}>
//           {showFull ? `Show first 5 rows` : `Show all ${clientData.data.length} rows`}
//         </button>
//       )}
      
//       <pre className={styles.infoBox}>
//         <code>
//           {info}
//         </code>
//       </pre>
//     </div>
//   );
// };

// export default AdvancedDataFrameDisplay;
import React, { useState, useEffect } from 'react';
import styles from './AdvancedDataFrameDisplay.module.css';

const AdvancedDataFrameDisplay = ({ data, info }) => {
  const [showFull, setShowFull] = useState(false);
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    setClientData(data);
  }, [data]);

  if (!clientData || !clientData.columns || !clientData.data) {
    return <p>Loading data...</p>;
  }

  const displayData = showFull ? clientData.data : clientData.data.slice(0, 5);

  const renderTable = (tableData) => (
    <table className={styles.dataFrameTable}>
      <thead>
        <tr>
          <th></th>
          {clientData.columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, rowIndex) => (
          <tr key={rowIndex} className={styles.dataRow}>
            <td className={styles.indexCell}>{rowIndex}</td>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const toggleShowFull = () => {
    setShowFull(!showFull);
  };

  return (
    <div className={styles.advancedDataFrameContainer}>
      <div className={styles.tableWrapper}>
        {renderTable(displayData)}
      </div>
      <div className={styles.stickyFooter}>
        <button onClick={toggleShowFull} className={styles.toggleButton}>
          {showFull ? `Show first 5 rows` : `Show all ${clientData.data.length} rows`}
        </button>
      </div>
      <pre className={styles.infoBox}>
        <code>
          {info}
        </code>
      </pre>
    </div>
  );
};

export default AdvancedDataFrameDisplay;