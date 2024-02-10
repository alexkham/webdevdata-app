import React, { useState, useEffect } from 'react';
import './CodeWidget.css'

const ConsoleComponentProps5 = ({ code }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        executeCode();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]); // Only re-run the effect if 'code' changes

    const executeCode = () => {
        // Clearing previous console logs if any
        let capturedOutput = '';
        const originalConsoleLog = console.log;

        // Overriding console.log to capture output
        console.log = (...args) => {
            capturedOutput += args.join(' ') + '\n';
            originalConsoleLog(...args);
        };

        try {
            // Executing the code
            const result = eval(code);

            // Handling non-console.log output
            if (!capturedOutput.trim() && result !== undefined) {
                capturedOutput = result.toString();
            }
        } catch (err) {
            // Handling execution errors
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
    );
};

export default ConsoleComponentProps5;
