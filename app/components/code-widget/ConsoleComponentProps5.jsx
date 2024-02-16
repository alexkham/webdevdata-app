'use client'
import React, { useState, useEffect } from 'react';
import './CodeWidget.css'

const ConsoleComponentProps5 = ({ code }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        setHistory([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]); // Only re-run the effect if 'code' changes

    const executeCode = () => {
        //Showing one last output only.Delete this to get the whole history
        setHistory([])
        let capturedOutput = '';
        const originalConsoleLog = console.log;
    
        // console.log = (...args) => {
        //     capturedOutput += args.map(arg =>
        //         typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
        //     ).join(' ') + '\n';
        //     originalConsoleLog.apply(console, args);
        // };

        console.log = (...args) => {
            capturedOutput += args.map(arg => {
                if (arg instanceof Set) {
                    // Convert Set to an array for display
                    return '{'+`${JSON.stringify(Array.from(arg))}`.replace('[','').replace(']','')+'}';
                } else if (typeof arg === 'object') {
                    return JSON.stringify(arg, null, 2);
                } else {
                    return arg;
                }
            }).join(' ') + '\n';
            originalConsoleLog.apply(console, args);
        };
        
    
        try {
            // Directly evaluate the code string without JSON parsing
            let result = eval(code); // Assuming `code` is the JavaScript code string to be evaluated
    
            if (result !== undefined && capturedOutput.trim() === '') {
                capturedOutput += typeof result === 'object' ? JSON.stringify(result, null, 2) : result.toString();
            }
        } catch (err) {
            capturedOutput = `Error: ${err.message}`;
        } finally {
            // Restoring the original console.log
            console.log = originalConsoleLog;
        }
    
        // Updating the history state with the new log
        if (capturedOutput.trim()) {
            setHistory(history => [...history, { input: code, result: capturedOutput }]);
        }
    };
    

    return (
        <>
        <div className="console">
             <button className='run-btn' onClick={executeCode}>Run Code</button>
              {history&& <label>Output : </label>}
            
            <div className="console-history">
                {history.map((entry, index) => (
                    <div key={index}>
                        {/* <div className="console-input-log">{`> ${entry.input}`}</div> */}
                        <div className="console-output-log">{entry.result}</div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default ConsoleComponentProps5;
//'use client'
// import React, { useState, useEffect } from 'react';
// import './CodeWidget.css';

// const ConsoleComponentProps5 = ({ code }) => {
//     const [history, setHistory] = useState([]);

//     useEffect(() => {
//         setHistory([]);
//     }, [code]); // Only re-run the effect if 'code' changes

//     const executeCode = () => {
//         // Reset history for each execution
//         setHistory([]);
//         let capturedOutput = '';
//         const originalConsoleLog = console.log;

//         console.log = (...args) => {
//             capturedOutput += args.map(arg => {
//                 if (arg instanceof Set) {
//                     return `{${JSON.stringify(Array.from(arg)).replace('[', '').replace(']', '')}}`;
//                 } else if (typeof arg === 'object') {
//                     return JSON.stringify(arg, null, 2);
//                 } else {
//                     return arg;
//                 }
//             }).join(' ') + '\n'; // Keep using '\n' for actual line breaks in capturedOutput
//             originalConsoleLog.apply(console, args);
//         };

//         try {
//             let result = eval(code);
//             if (result !== undefined && capturedOutput.trim() === '') {
//                 capturedOutput += typeof result === 'object' ? JSON.stringify(result, null, 2) : result.toString();
//             }
//         } catch (err) {
//             capturedOutput = `Error: ${err.message}`;
//         } finally {
//             console.log = originalConsoleLog; // Restoring original console.log
//         }

//         if (capturedOutput.trim()) {
//             // Replace '\n' with '<br>' for HTML rendering
//             const outputWithLineBreaks = capturedOutput.replace(/\n/g, '<br>');
//             setHistory(history => [...history, { input: code, result: outputWithLineBreaks }]);
//         }
//     };

//     // const executeCode = () => {
//     //     setHistory([]); // Reset history for each execution
//     //     let capturedOutputs = []; // Use an array to capture each log separately
//     //     const originalConsoleLog = console.log;
    
//     //     console.log = (...args) => {
//     //         const output = args.map(arg => {
//     //             if (arg instanceof Set) {
//     //                 // Convert Set to an array and then to string for display
//     //                 return `{${JSON.stringify(Array.from(arg)).replace('[', '').replace(']', '')}}`;
//     //             } else if (typeof arg === 'object') {
//     //                 // Use JSON.stringify for objects, replacing '\n' with '<br>' for HTML line breaks
//     //                 return JSON.stringify(arg, null, 2).replace(/\n/g, '<br>');
//     //             } else {
//     //                 return arg.toString();
//     //             }
//     //         }).join(' '); // Join multiple arguments with a space
    
//     //         capturedOutputs.push(output); // Push the formatted output to the array
//     //         originalConsoleLog.apply(console, args);
//     //     };
    
//     //     try {
//     //         let result = eval(code);
//     //         if (result !== undefined && capturedOutputs.length === 0) {
//     //             // Directly push non-logged outputs (if any)
//     //             capturedOutputs.push(typeof result === 'object' ? JSON.stringify(result, null, 2).replace(/\n/g, '<br>') : result.toString());
//     //         }
//     //     } catch (err) {
//     //         capturedOutputs.push(`Error: ${err.message}`);
//     //     } finally {
//     //         console.log = originalConsoleLog; // Restore original console.log
//     //     }
    
//     //     // Update history with the captured outputs
//     //     if (capturedOutputs.length) {
//     //         setHistory([{ input: code, result: capturedOutputs.join('<br>') }]); // Join captured outputs with line breaks for display
//     //     }
//     // };
    

//     return (
//         <>
            
//             <div className="console">
//             <button className='run-btn' onClick={executeCode}>Run Code</button>
//             {history && <label>Output:</label>}
//                 <div className="console-history">
//                     {history.map((entry, index) => (
//                         <div key={index} className="console-output-log" dangerouslySetInnerHTML={{ __html: entry.result }}>
//                             {/* Rendered as HTML via dangerouslySetInnerHTML */}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
   
// };

// export default ConsoleComponentProps5;
