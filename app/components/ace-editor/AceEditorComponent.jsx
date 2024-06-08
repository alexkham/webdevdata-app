'use client'
import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { themesMap } from './ThemesMap';
import { modesMap } from './ModesMap';
import './AceEditor.css'
import SelectComponent2 from '../SelectComponent/SelectComponent2';

const AceEditorComponent = ({ code, fontSize, theme, mode, onChange,width }) => {
    const [editorTheme, setEditorTheme] = useState('textmate'); // Default theme
    const [editorMode, setEditorMode] = useState('text'); // Default mode
    const [copied, setCopied]=useState(false);

    useEffect(() => {
        // Check and load the theme
        if (themesMap[theme]) {
            import(`ace-builds/src-noconflict/theme-${theme}`)
                .then(() => setEditorTheme(theme))
                .catch((err) => console.error(`Error loading theme: ${theme}`, err));
        }

        // Check and load the mode
        if (modesMap[mode]) {
            import(`ace-builds/src-noconflict/mode-${mode}`)
                .then(() => setEditorMode(mode))
                .catch((err) => console.error(`Error loading mode: ${mode}`, err));
        }
    }, [theme, mode]);
    const themes=Object.keys(themesMap)
     
    const copyToClipboard = () => {
        // Create a temporary textarea element to hold the code
        const textarea = document.createElement('textarea');
        textarea.value = code;
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
        <div className='ace-container' style={{width:`${width}`}}>
        {/* <div className='btn-container'><button onClick={copyToClipboard} 
        style={{marginRight:'30px',border:'solid white 1px',
        background:'none',borderRadius:'5px',color:'white',padding:'5px'}}
        className='visible'>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z" fill="currentColor"></path></svg>
            {copied?"Copied!":"Copy Code"}
            </button></div>
             */}
             
            <button 
            onClick={copyToClipboard}
            className='copy-btn'>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z" fill="currentColor"></path></svg>
            {copied?"Copied!":"Copy Code"}
            </button>
           
           
        </div>
        <AceEditor
            style={{maxHeight:'200px'}}
            className='ace-editor'
            mode={editorMode}
            theme={editorTheme}
            value={code}
            onChange={onChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            fontSize={fontSize}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
            }}
        />
         {/* <SelectComponent2 
         size={'200px'}
         label={'Theme'} options={themes} ></SelectComponent2> */}
         {/* <div className='btn-container'><button onClick={copyToClipboard} 
        style={{marginRight:'30px',border:'solid white 1px',
        background:'none',borderRadius:'5px',color:'white',padding:'5px'}}
        >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z" fill="currentColor"></path></svg>
            {copied?"Copied!":"Copy Code"}
            </button></div> */}
            
        </>
        
    );
};

export default AceEditorComponent;
