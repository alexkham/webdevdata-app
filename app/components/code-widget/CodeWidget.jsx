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
            setTimeout(typeWriter, 0.5); // Adjust typing speed if necessary
        } else {
            setDoneTyping(true); // Typing done
        }
    };

    typeWriter();

    // Cleanup function to stop the effect if the component unmounts
    return () => clearTimeout(typeWriter);
}, [message]); // Rerun effect if message changes


// const copyToClipboard = () => {
//     // Create a temporary textarea element to hold the code
//     const textarea = document.createElement('textarea');
//     textarea.value = codeContent;
//     document.body.appendChild(textarea);

//     // Select the text and copy it to the clipboard
//     textarea.select();
//     document.execCommand('copy');

//     // Clean up: remove the temporary textarea
//     document.body.removeChild(textarea);
//     setCopied(true);

//     // Optionally, you can display a message to the user indicating the code was copied
//     // alert('Code copied to clipboard!');
// };
// const x= `kjnj


// nijkjnjn`

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

    // Reset the copied state after a delay (e.g., 2000 milliseconds = 2 seconds)
    setTimeout(() => {
        setCopied(false);
    }, 2000); // Adjust the time as needed
};




    return (
        <>
        <div className='container' >
        {/* <div><button onClick={copyToClipboard}>Copy</button></div> */}
        <pre style={{minHeight:'250px',marginBottom:'10px'}}>
        <div className='btn-container'><button onClick={copyToClipboard} 
        style={{marginRight:'30px',border:'solid white 1px',
        background:'none',borderRadius:'5px',color:'white',padding:'5px'}}
        className={  doneTyping?'visible':'invisible' } >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z" fill="currentColor"></path></svg>
            {copied?"Copied!":"Copy Code"}
            </button></div>
            <code className={className} style={{height:'50px'}}>
                {codeContent} 
            </code>
        
        </pre>
        
        <div>
        
        </div>
       
        </div>
        
        
        </>
    );
};

export default CodeWidget;
