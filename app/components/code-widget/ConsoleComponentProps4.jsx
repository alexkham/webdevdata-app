import React, { useState, useEffect } from 'react';

const ConsoleComponentProps4 = ({ code }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Check if the code is non-empty and not just whitespace
        if (code && code.trim()) {
            executeCode();
        }
    }, [code]);

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
        } catch (err) {
            capturedOutput = `Error: ${err.message}`;
        } finally {
            console.log = originalConsoleLog;  // Restore the original console.log
        }

        // Update the history only if there's captured output
        if (capturedOutput) {
            setHistory(history => [...history, { input: code, result: capturedOutput }]);
        }
    };

    return (
        <div className="console">
            <div className="console-history">
                {history.map((entry, index) => (
                    <div key={index}>
                        <div className="console-input-log">{`> ${entry.input}`}</div>
                        <div className="console-output-log">{entry.result}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConsoleComponentProps4;
