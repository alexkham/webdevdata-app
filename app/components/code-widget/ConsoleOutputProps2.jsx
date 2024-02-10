import React, { useState, useEffect } from 'react';

const ConsoleComponentProps2 = ({ code }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const executeCode = () => {
            const originalConsoleLog = console.log;
            let logOutput = '';

            console.log = (...args) => {
                logOutput += args.join(' ') + '\n';  // Capture console.log output
                originalConsoleLog(...args);
            };

            try {
                eval(code);  // Execute the code
                setHistory(history => [...history, { input: code, result: logOutput }]);
            } catch (err) {
                setHistory(history => [...history, { input: code, error: err.message }]);
            } finally {
                console.log = originalConsoleLog;  // Restore the original console.log
            }
        };

        if (code) {
            executeCode();
        }
    }, [code]);

    return (
        <div className="console">
            <div className="console-history">
                {history.map((entry, index) => (
                    <div key={index}>
                        <div className="console-input-log">{`> ${entry.input}`}</div>
                        <div className="console-output-log">
                            {entry.error || entry.result}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConsoleComponentProps2;
