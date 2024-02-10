import React, { useState, useEffect } from 'react';

const ConsoleComponentProps = ({ code }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Function to execute the code and update the history
        const executeCode = () => {
            try {
                // Evaluate the code and add both code and result to the history
                const result = eval(code);
                setHistory(history => [...history, { input: code, result }]);
            } catch (err) {
                // In case of an error, add the code and error message to the history
                setHistory(history => [...history, { input: code, error: err.message }]);
            }
        };

        // Execute the code when the 'code' prop changes
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
                            {entry.result !== undefined ? entry.result.toString() : entry.error}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConsoleComponentProps;
