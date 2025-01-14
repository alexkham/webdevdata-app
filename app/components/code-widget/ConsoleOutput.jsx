// import React, { useEffect, useState } from 'react';

// const ConsoleOutput = () => {
//     const [logs, setLogs] = useState([]);

//     useEffect(() => {
//         const originalConsoleLog = console.log;

//         console.log = (...args) => {
//             setLogs(prevLogs => [...prevLogs, ...args.map(arg => String(arg))]);
//             originalConsoleLog(...args);
//         };

//         return () => {
//             console.log = originalConsoleLog; // Reset console.log to its original state on unmount
//         };
//     }, []);

//     return (
//         <div className="console-output">
//             {logs.map((log, index) => (
//                 <div key={index}>{log}</div>
//             ))}
//         </div>
//     );
// };

// export default ConsoleOutput;
import React from 'react';

const ConsoleOutput = ({ logs }) => {
    return (
        <div className="console-output">
            {logs.map((log, index) => (
                <div key={index}>{log}</div>
            ))}
        </div>
    );
};
export default ConsoleOutput;