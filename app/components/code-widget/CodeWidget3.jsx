'use client'
import React, { useState, useEffect, cloneElement } from 'react';
import Prism from 'prismjs';
import './CodeWidget.css';

const CodeWidget3 = ({ code, className, children }) => {
    const [codeContent, setCodeContent] = useState('');
    const [doneTyping, setDoneTyping] = useState(false);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        let i = 0;
        let typingTimeout;
        setDoneTyping(false);
        setLogs([]); // Reset logs on new code input

        function typeWriter() {
            if (i < code.length) {
                setCodeContent(prev => prev + code.charAt(i));
                i++;
                typingTimeout = setTimeout(typeWriter, 10);
            } else {
                setDoneTyping(true);
                executeAndCaptureCode();
            }
        }

        typeWriter();

        return () => clearTimeout(typingTimeout); // Cleanup on unmount
    }, [code]);

    const executeAndCaptureCode = () => {
        const originalConsoleLog = console.log;
        let capturedLogs = [];

        console.log = (...args) => {
            capturedLogs.push(args.join(' '));
            originalConsoleLog(...args);
        };

        try {
            eval(codeContent); // Execute the code
        } catch (error) {
            capturedLogs.push(`Error in execution: ${error.message}`);
        }

        console.log = originalConsoleLog;
        setLogs(capturedLogs); // Update logs state
    };

    const consoleChild = children ? cloneElement(children, { logs }) : null;

    return (
        <div className='container' style={{minHeight:'600px'}}>
            <pre style={{minHeight:'300px', overflow:'hidden'}}>
                <code className={className}>
                    {codeContent}
                </code>
            </pre>
            {consoleChild}
        </div>
    );
};

export default CodeWidget3;
