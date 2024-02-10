import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import './CodeWidget.css'; // Your CSS file for additional styling
import 'prismjs/themes/prism-tomorrow.css'; // Example theme
import 'prismjs/components/prism-python';

const CodeWidget2 = ({ code, onExecuteCode,className }) => {
    const [codeContent, setCodeContent] = useState('');
    const [doneTyping, setDoneTyping] = useState(false);
    const [copied, setCopied]=useState(false);

    useEffect(() => {
        let i = 0;
        let typingTimeout;
        setDoneTyping(false);

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

    // const executeAndCaptureCode = () => {
    //     const originalConsoleLog = console.log;
    //     let capturedLogs = [];

    //     console.log = (...args) => {
    //         capturedLogs.push(args.join(' '));
    //         originalConsoleLog(...args);
    //     };

    //     try {
    //         // Execute the code
    //         eval(codeContent);
    //     } catch (error) {
    //         capturedLogs.push(`Error in execution: ${error.message}`);
    //     }

    //     // Restore the original console.log
    //     console.log = originalConsoleLog;

    //     // Call the callback function with captured logs
    //     if (onExecuteCode) {
    //         onExecuteCode(capturedLogs);
    //     }
    // };
    const copyToClipboard = () => {
        // Create a temporary textarea element to hold the code
        const textarea = document.createElement('textarea');
        textarea.value = codeContent;
        document.body.appendChild(textarea);
    
        // Select the text and copy it to the clipboard
        textarea.select();
        document.execCommand('copy');
    
        // Clean up: remove the temporary textarea
        document.body.removeChild(textarea);
        setCopied(true);
    
        // Optionally, you can display a message to the user indicating the code was copied
        // alert('Code copied to clipboard!');
    };
    
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
        console.log('Debug - Captured Logs:', capturedLogs); // Debugging log
        onExecuteCode(capturedLogs);
    };
    

    return (
        // <div className="code-widget-container">
        //     <pre className={doneTyping ? 'typed-code' : ''}>
        //         <code className={className}>
        //             {codeContent}
        //         </code>
        //     </pre>
        // </div>
        <div className='container' style={{minHeight:'600px'}}>
        {/* <div><button onClick={copyToClipboard}>Copy</button></div> */}
        <pre style={{minHeight:'300px',overflow:'hidden'}}>
        <div className='btn-container'><button onClick={copyToClipboard} 
        style={{marginRight:'30px',border:'solid white 1px',
        background:'none',borderRadius:'5px',color:'white',padding:'10px'}}
        className={  doneTyping?'visible':'invisible' } >{copied?"Copied!":"Copy Code"}
            </button></div>
            <code className={className}>
                {codeContent} 
            </code>
            
        </pre>
        </div>
        
    );
};

export default CodeWidget2;
