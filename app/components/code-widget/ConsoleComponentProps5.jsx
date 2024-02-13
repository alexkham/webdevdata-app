'use client'
import React, { useState, useEffect } from 'react';
import './CodeWidget.css'

const ConsoleComponentProps5 = ({ code }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        setHistory([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]); // Only re-run the effect if 'code' changes

    // const executeCode = () => {
    //     // Clearing previous console logs if any
    //     let capturedOutput = '';
    //     const originalConsoleLog = console.log;

    //     // Overriding console.log to capture output
    //     console.log = (...args) => {
    //         capturedOutput += args.join(' ') + '\n';
    //         originalConsoleLog(...args);
    //     };

    //     try {
    //         // Executing the code
    //         const result = eval(code);

    //         // Handling non-console.log output
    //         if (!capturedOutput.trim() && result !== undefined) {
    //             capturedOutput = result.toString();
    //         }
    //     } catch (err) {
    //         // Handling execution errors
    //         capturedOutput = `Error: ${err.message}`;
    //     } finally {
    //         // Restoring the original console.log
    //         console.log = originalConsoleLog;
    //     }

    //     // Updating the history state with the new log
    //     if (capturedOutput.trim()) {
    //         setHistory(history => [...history, { input: code, result: capturedOutput }]);
    //     }
    // };


    // const executeCode = () => {
    //     let capturedOutput = '';
    //     const originalConsoleLog = console.log;
    
    //     console.log = (...args) => {
    //         capturedOutput += args.map(arg => 
    //             typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    //         ).join(' ') + '\n';
    //         originalConsoleLog(...args);
    //     };
    
    //     try {
    //         const result = eval(code);
    //         if (!capturedOutput.trim() && result !== undefined) {
    //             capturedOutput = typeof result === 'object' ? JSON.stringify(result, null, 2) : result.toString();
    //         }
    //     } catch (err) {
    //         capturedOutput = `Error: ${err.message}`;
    //     } finally {
    //         console.log = originalConsoleLog;
    //     }
    
    //     if (capturedOutput.trim()) {
    //         setHistory(history => [...history, { input: code, result: capturedOutput }]);
    //     }
    // };


    // const executeCode = () => {
    //     let capturedOutput = '';
    //     const originalConsoleLog = console.log;
    
    //     console.log = (...args) => {
    //         capturedOutput += args.map(arg =>
    //             typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    //         ).join(' ') + '\n';
    //         originalConsoleLog.apply(console, args);
    //     };
    
    //     try {
    //         // Use `eval` to execute the code and capture the last expression's result
    //         let result = eval(code);
            
    //         // If result is defined and not already appended to capturedOutput
    //         if (result !== undefined && capturedOutput.trim() === '') {
    //             capturedOutput += typeof result === 'object' ? JSON.stringify(result, null, 2) : result.toString();
    //         }
    //     } catch (err) {
    //         capturedOutput = `Error: ${err.message}`;
    //     } finally {
    //         // Restoring the original console.log
    //         console.log = originalConsoleLog;
    //     }
    
    //     // Updating the history state with the new log
    //     if (capturedOutput.trim()) {
    //         setHistory(history => [...history, { input: code, result: capturedOutput }]);
    //     }
    // };
    
    // const executeCode = () => {
    //     let capturedOutput = '';
    //     const originalConsoleLog = console.log;
    
    //     // Assuming `code` is a JSON string that needs parsing.
    //     // Skip JSON.parse if `code` is already an object with a `code` property.
    //     let codeToExecute;
    //     try {
    //         const parsed = typeof code === 'string' ? JSON.parse(code) : code;
    //         codeToExecute = parsed.code;
    //     } catch (err) {
    //         // Handle JSON parsing errors or issues extracting the code property
    //         codeToExecute = '';
    //         capturedOutput = `Error parsing code: ${err.message}`;
    //     }
    
    //     console.log = (...args) => {
    //         capturedOutput += args.map(arg => 
    //             typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    //         ).join(' ') + '\n';
    //         originalConsoleLog.apply(console, args);
    //     };
    
    //     if (codeToExecute) {
    //         try {
    //             // Use `eval` to execute the extracted code
    //             let result = eval(codeToExecute);
    //             if (result !== undefined && capturedOutput.trim() === '') {
    //                 capturedOutput += typeof result === 'object' ? JSON.stringify(result, null, 2) : result.toString();
    //             }
    //         } catch (err) {
    //             capturedOutput = capturedOutput || `Error: ${err.message}`;
    //         } finally {
    //             // Restoring the original console.log
    //             console.log = originalConsoleLog;
    //         }
    //     }
    
    //     // Updating the history state with the new log
    //     if (capturedOutput.trim()) {
    //         setHistory(history => [...history, { input: codeToExecute, result: capturedOutput }]);
    //     }
    // };
    
    const executeCode = () => {
        //Showing one last output only.Delete this to get the whole history
        setHistory([])
        let capturedOutput = '';
        const originalConsoleLog = console.log;
    
        console.log = (...args) => {
            capturedOutput += args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
            ).join(' ') + '\n';
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
        <> <button className='run-btn' onClick={executeCode}>Run Code</button>
       {history&& <label>Output : </label>}
        <div className="console">
            
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
