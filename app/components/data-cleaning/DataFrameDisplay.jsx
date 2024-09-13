// // 'use client'
// // import { useState, useEffect } from 'react';


// // function DataFrameDisplay() {
// //     const [dataFrame, setDataFrame] = useState({ columns: [], data: [] });

// //     useEffect(() => {
// //         fetch('/data.json')
// //             .then(response => response.json())
// //             .then(data => setDataFrame(data));
// //     }, []);

// //     return (
// //         <div>
// //             <table>
// //                 <thead>
// //                     <tr>
// //                         {dataFrame.columns.map((column, index) => (
// //                             <th key={index}>{column}</th>
// //                         ))}
// //                     </tr>
// //                 </thead>
// //                 <tbody>
// //                     {dataFrame.data.map((row, index) => (
// //                         <tr key={index}>
// //                             {row.map((cell, idx) => (
// //                                 <td key={idx}>{cell}</td>
// //                             ))}
// //                         </tr>
// //                     ))}
// //                 </tbody>
// //             </table>
// //         </div>
// //     );
// // }

// // export default DataFrameDisplay;
// // 'use client'
// // import { useState, useEffect } from 'react';
// // import styles from './DataFrameDisplay.module.css';

// // function DataFrameDisplay() {
// //     const [dataFrame, setDataFrame] = useState({ columns: [], data: [] });

// //     useEffect(() => {
// //         fetch('/data.json')
// //             .then(response => response.json())
// //             .then(data => setDataFrame(data));
// //     }, []);

// //     return (
// //         <div className={styles.tableContainer}>
// //             <table className={styles.table}>
// //                 <thead>
// //                     <tr className={styles.tr}>
// //                         {dataFrame.columns.map((column, index) => (
// //                             <th key={index} className={styles.th}>{column}</th>
// //                         ))}
// //                     </tr>
// //                 </thead>
// //                 <tbody>
// //                     {dataFrame.data.map((row, index) => (
// //                         <tr key={index} className={styles.tr}>
// //                             {row.map((cell, idx) => (
// //                                 <td key={idx} className={styles.td}>{cell}</td>
// //                             ))}
// //                         </tr>
// //                     ))}
// //                 </tbody>
// //             </table>
// //         </div>
// //     );
// // }

// // export default DataFrameDisplay;
// 'use client'
// import { useState, useEffect } from 'react';
// import styles from './DataFrameDisplay.module.css';

// function DataFrameDisplay({ dataFrame }) {
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (dataFrame) {
//             setIsLoading(false);
//         }
//     }, [dataFrame]);

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     if (!dataFrame || !dataFrame.columns || !dataFrame.data || dataFrame.data.length === 0) {
//         return <div>No data available</div>;
//     }

//     return (
//         <div className={styles.tableContainer}>
//             <table className={styles.table}>
//                 <thead>
//                     <tr className={styles.tr}>
//                         {dataFrame.columns.map((column, index) => (
//                             <th key={index} className={styles.th}>{column}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {dataFrame.data.map((row, index) => (
//                         <tr key={index} className={styles.tr}>
//                             {row.map((cell, idx) => (
//                                 <td key={idx} className={styles.td}>{cell}</td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }

// export default DataFrameDisplay;
'use client'
import { useState, useEffect } from 'react';
import styles from './DataFrameDisplay.module.css';

function DataFrameDisplay2({ dataFrame }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (dataFrame) {
            setIsLoading(false);
        }
    }, [dataFrame]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!dataFrame || !dataFrame.columns || !dataFrame.data || dataFrame.data.length === 0) {
        return <div>No data available</div>;
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tr}>
                        {dataFrame.columns.map((column, index) => (
                            <th key={index} className={styles.th}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dataFrame.data.map((row, index) => (
                        <tr key={index} className={styles.tr}>
                            {row.map((cell, idx) => (
                                <td key={idx} className={styles.td}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataFrameDisplay2;