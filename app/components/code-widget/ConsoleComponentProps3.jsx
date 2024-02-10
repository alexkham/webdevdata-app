import React, { useState, useEffect } from 'react';

const ConsoleComponentProps3 = ({ code }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const executeCode = () => {
            let capturedOutput = '';
            const originalConsoleLog = console.log;

            console.log = (...args) => {
                capturedOutput += args.join(' ') + '\n';
                originalConsoleLog(...args);
            };

            try {
                // Execute the code
                const result = eval(code);

                // If there's no console.log output, use the eval result
                if (capturedOutput === '') {
                    capturedOutput = result !== undefined ? result.toString() : '';
                }

                setHistory(history => [...history, { input: code, result: capturedOutput }]);
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

export default ConsoleComponentProps3;
