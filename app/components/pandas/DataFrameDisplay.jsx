// import React from 'react';
// import styles from './DataFrameDisplay.module.css';

// const DataFrameDisplay = ({ data }) => {
//   if (!data || !data.columns || !data.data) {
//     return <p>No data to display</p>;
//   }

//   return (
//     <div className={styles.dataFrameContainer}>
//       <table className={styles.dataFrameTable}>
//         <thead>
//           <tr>
//             {data.columns.map((column, index) => (
//               <th key={index}>{column}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.data.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {row.map((cell, cellIndex) => (
//                 <td key={cellIndex}>{cell}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DataFrameDisplay;
import React from 'react';
import styles from './DataFrameDisplay.module.css';

const DataFrameDisplay = ({ data }) => {
  if (!data || !data.columns || !data.data) {
    return <p>No data to display</p>;
  }

  return (
    <div className={styles.dataFrameContainer}>
      <table className={styles.dataFrameTable}>
        <thead>
          <tr>
            <th></th> {/* Empty corner cell */}
            {data.columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow}>
              <td className={styles.indexCell}>{rowIndex}</td>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataFrameDisplay;