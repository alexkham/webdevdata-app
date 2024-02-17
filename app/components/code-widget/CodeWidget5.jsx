'use client'
import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import './CodeWidget.css';

const CodeWidget5 = ({ message, className }) => {
    const [codeContent, setCodeContent] = useState('');
    const [doneTyping, setDoneTyping] = useState(false);
    const [copied, setCopied] = useState(false);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        let i = 0;
        let typingTimeout;
        setDoneTyping(false);
        setLogs([]);

        const typeWriter = () => {
            if (i < message.length) {
                setCodeContent(prev => prev + message.charAt(i));
                i++;
                typingTimeout = setTimeout(typeWriter, 10);
            } else {
                setDoneTyping(true);
                executeCode();
            }
        };

        if (message) {
            typeWriter();
        }

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
            // eslint-disable-next-line no-eval
            eval(codeContent);
        } catch (error) {
            capturedLogs.push(`Error: ${error.message}`);
        }

        console.log = originalConsoleLog;
        setLogs(capturedLogs);
    };

    const copyToClipboard = () => {
        const textarea = document.createElement('textarea');
        textarea.value = codeContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
    };

    return (
        <div className='container' style={{ minHeight: '600px' }}>
            <pre style={{ minHeight: '300px', overflow: 'hidden' }}>
                <div className='btn-container'>
                    <button onClick={copyToClipboard} 
                        style={{ marginRight: '30px', border: 'solid white 1px',
                                background: 'none', borderRadius: '5px', 
                                color: 'white', padding: '10px' }}
                        className={doneTyping ? 'visible' : 'invisible'}>
                        {copied ? "Copied!" : "Copy Code"}
                    </button>
                </div>
                <code className={className}>
                    {codeContent}
                </code>
            </pre>
            <div className="console-logs">
                {logs.map((log, index) => (
                    <div key={index}>{log}</div>
                ))}
            </div>
        </div>
    );
};

export default CodeWidget5;
