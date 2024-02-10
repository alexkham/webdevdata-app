// import React from 'react';
// import CodeWidget from './CodeWidget'; // Import your existing CodeWidget
// import ConsoleOutput from './ConsoleOutput'; // Import the new ConsoleOutput component

// const CodeAndConsole = ({ message, className }) => {
//     return (
//         <div>
//             <CodeWidget message={message} className={className} />
//             <ConsoleOutput logs={logs}/>
//         </div>
//     );
// };

// export default CodeAndConsole;

import React, { useState } from 'react';
import CodeWidget2 from './CodeWidget2';
import ConsoleOutput from './ConsoleOutput';

const CodeAndConsole = ({ initialCode ,className}) => {
    const [logs, setLogs] = useState([]);

    // const handleExecuteCode = (capturedLogs) => {
    //     setLogs(capturedLogs);
    // };

    const handleExecuteCode = (capturedLogs) => {
        console.log('Captured Logs:', capturedLogs); // For debugging
        setLogs(capturedLogs);
    };
    

    return (
        <div>
            <CodeWidget2 code={initialCode} className={className} onExecuteCode={handleExecuteCode} />
            <ConsoleOutput logs={logs} />
        </div>
    );
};
export default CodeAndConsole;