import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import './CodeWidget.css'; // Your CSS file for additional styling
import 'prismjs/themes/prism-tomorrow.css'; // Example theme
import 'prismjs/components/prism-python';
//import 'prismjs/themes/prism-dark.css'; 



const CodeWidget = ({message,className}) => {
    const [codeContent, setCodeContent] = useState('');
    const [doneTyping,setDoneTyping]=useState(false);
    const [copied, setCopied]=useState(false);

    
//     useEffect(() => {
//     let i = 0;
//     let typingTimeout;
//     setDoneTyping(false);
//     setCopied(false);
    
   
//     function typeWriter() {
//         console.log('Message:', message);
//         if (!message) {
//             return;  // Skip the typing effect if message is undefined or null
//         }
    
//         message=message.replace(/\\n/g, '\n');
//         if (i < message.length) {
//             setCodeContent(prev => prev + message.charAt(i));
//             i++;
//             typingTimeout = setTimeout(typeWriter, 1);
//         } else {
//             Prism.highlightAll();
//             setDoneTyping(true);
//         }
       
//     }
    
    
//     typeWriter();

//     return () => clearTimeout(typingTimeout); // Cleanup on unmount or when dependencies change
    
// }, []);

// useEffect(() => {
//     // Directly set message to state for debugging
//     setCodeContent(message.replace(/\\n/g, '\n'));
//     Prism.highlightAll();
// }, [message]);


// useEffect(() => {
//     let i = 0;
//     let typingTimeout;
//     setDoneTyping(false);
//     setCopied(false);
    
//     function typeWriter() {
//         if (!message) {
//             return;  // Skip the typing effect if message is undefined or null
//         }
    
//         message = message.replace(/\\n/g, '\n');
//         console.log('Typing:', message.charAt(i)); // Debugging log
//         if (i < message.length) {
//             setCodeContent(prev => prev + message.charAt(i));
//             i++;
//             typingTimeout = setTimeout(typeWriter, 50); // Slightly increased delay
//         } else {
//             Prism.highlightAll();
//             setDoneTyping(true);
//         }
//     }
    
//     typeWriter();

//     return () => clearTimeout(typingTimeout); // Cleanup on unmount or when dependencies change
    
// }, [message]); // Consider adding `message` as a dependency if it can change
useEffect(() => {
    setCodeContent(message.replace(/\\n/g, '\n'));
    // Ensure Prism.highlightAll() is called after state update and DOM has been updated
    setTimeout(() => Prism.highlightAll(), 0);
}, [message]);


useEffect(() => {
    let i = 0;
    const messageWithNewLines = message.replace(/\\n/g, '\n');
    setCodeContent(''); // Reset code content
    setDoneTyping(false);

    const typeWriter = () => {
        if (i < messageWithNewLines.length) {
            setCodeContent(prev => {
                // Update content and highlight
                const updatedContent = prev + messageWithNewLines.charAt(i);
                i++;
                // Call Prism.highlightAll() with slight delay
                setTimeout(() => Prism.highlightAll(), 0);
                return updatedContent;
            });
            setTimeout(typeWriter, 20); // Adjust typing speed if necessary
        } else {
            setDoneTyping(true); // Typing done
        }
    };

    typeWriter();

    // Cleanup function to stop the effect if the component unmounts
    return () => clearTimeout(typeWriter);
}, [message]); // Rerun effect if message changes


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
// const x= `kjnj


// nijkjnjn`



    return (
        <div className='container' style={{minHeight:'600px'}}>
        {/* <div><button onClick={copyToClipboard}>Copy</button></div> */}
        <pre style={{minHeight:'300px'}}>
        <div className='btn-container'><button onClick={copyToClipboard} 
        style={{marginRight:'30px',border:'solid white 1px',
        background:'none',borderRadius:'5px',color:'white',padding:'10px'}}
        className={  doneTyping?'visible':'invisible' } >{copied?"Copied!":"Copy Code"}
            </button></div>
            <code className={className} >
                {codeContent} 
            </code>
            
        </pre>
        </div>
        
        
    );
};

export default CodeWidget;
