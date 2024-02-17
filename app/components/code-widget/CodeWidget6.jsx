import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import './CodeWidget.css';

const CodeWidget6 = ({ message, className }) => {
    const [codeContent, setCodeContent] = useState('');
    const [doneTyping, setDoneTyping] = useState(false);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        let i = 0;
        let typingTimeout;
        setCodeContent('');
        setDoneTyping(false);
        setLogs([]);

        const typeWriter = () => {
            if (message && i < message.length) {
                setCodeContent(prev => prev + message.charAt(i));
                i++;
                typingTimeout = setTimeout(typeWriter, 10);
            } else {
                setDoneTyping(true);
                executeCode();
            }
        };

        typeWriter();

        return () => clearTimeout(typingTimeout);
    }, [message,executeCode]);

    const executeCode = () => {
        const originalConsoleLog = console.log;
        let capturedLogs = [];

        console.log = (...args) => {
            capturedLogs.push(args.join(' '));
            originalConsoleLog(...args);
        };

        try {
            new Function(codeContent)();
        } catch (error) {
            capturedLogs.push(`Error: ${error.message}`);
        }

        console.log = originalConsoleLog;
        setLogs(capturedLogs);
    };

    return (
        <div className='container' style={{ minHeight: '600px' }}>
            <pre style={{ minHeight: '300px', overflow: 'hidden' }}>
                <code className={className}>
                    {codeContent}
                </code>
            </pre>
            <div className="console-logs">
                {logs.map((log, index) => <div key={index}>{log}</div>)}
            </div>
        </div>
    );
};

export default CodeWidget6;
