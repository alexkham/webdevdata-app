'use client'

import React, { useState } from 'react';

const ConsoleComponent = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            try {
                // Evaluate the input and add both input and result to the history
                const result = eval(input);
                setHistory(history => [...history, { input, result }]);
            } catch (err) {
                // In case of an error, add the input and error message to the history
                setHistory(history => [...history, { input, error: err.message }]);
            }
            setInput(''); // Clear the input field
        }
    };

    const handleChange = (e) => {
        setInput(e.target.value);
    };

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
            <input
                className="console-input"
                type="text"
                value={input}
                onChange={handleChange}
                onKeyUp={handleKeyUp}
                autoFocus
                spellCheck="false"
            />
        </div>
    );
};

export default ConsoleComponent;
