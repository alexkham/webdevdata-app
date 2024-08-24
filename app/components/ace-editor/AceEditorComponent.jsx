// 'use client'
// import React, { useEffect, useState } from 'react';
// import AceEditor from 'react-ace';
// import { themesMap } from './ThemesMap';
// import { modesMap } from './ModesMap';
// import './AceEditor.css'

// const AceEditorComponent = ({ code, fontSize, theme, mode, onChange, width }) => {
//     const [editorTheme, setEditorTheme] = useState('twilight');
//     const [editorMode, setEditorMode] = useState('c_cpp');
//     const [copied, setCopied] = useState(false);


//     // useEffect(() => {
//     //     console.log('Theme set to:', theme);
//     //     console.log('Mode set to:', mode);
//     // }, [theme, mode]);


//     useEffect(() => {
//         if (themesMap[theme]) {
//             import(`ace-builds/src-noconflict/theme-${theme}`)
//                 .then(() => setEditorTheme(theme))
//                 .catch((err) => console.error(`Error loading theme: ${theme}`, err));
//         }
//         if (modesMap[mode]) {
//             import(`ace-builds/src-noconflict/mode-${mode}`)
//                 .then(() => setEditorMode(mode))
//                 .catch((err) => console.error(`Error loading mode: ${mode}`, err));
//         }
//     }, [theme, mode]);

//     const copyToClipboard = () => {
//         navigator.clipboard.writeText(code).then(() => {
//             setCopied(true);
//             setTimeout(() => setCopied(false), 2000);
//         });
//     };

//     return (
//         <div className='ace-editor-wrapper' style={{width: width || '100%'}}>
//             <div className='ace-container'>
//                 <button onClick={copyToClipboard} className='copy-btn'>
//                     {copied ? "Copied!" : "Copy Code"}
//                 </button>
//             </div>
//             <AceEditor
//                 style={{width: '100%', height: '250px',padding:'20px',paddingTop:'50px'}}
//                 className='ace-editor'
//                 mode="c_cpp"
//                 theme="twilight"
//                 value={code}
//                 onChange={onChange}
//                 name="UNIQUE_ID_OF_DIV"
//                 editorProps={{ $blockScrolling: true }}
//                 fontSize={fontSize}
//                 setOptions={{
//                     enableBasicAutocompletion: true,
//                     enableLiveAutocompletion: true,
//                     enableSnippets: true,
//                     showLineNumbers: true,
//                     tabSize: 2,
//                 }}
//             />
//         </div>
//     );
// };

// export default AceEditorComponent;


import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';

// Static import for the default theme
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/mode-c_cpp';
import './AceEditor.css';

const AceEditorComponent = ({ code, fontSize, theme, mode, onChange, width }) => {
    const [currentTheme, setCurrentTheme] = useState(theme || "twilight");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Only attempt to dynamically import a theme if it's not the default "twilight"
        if (theme !== "twilight" && theme !== currentTheme) {
            const themePath = `ace-builds/src-noconflict/theme-${theme}`;
            import(themePath)
                .then(() => {
                    setCurrentTheme(theme);  // Set the theme only if import succeeds
                })
                .catch(err => {
                    console.error(`Failed to load theme: ${theme}`, err);
                    setCurrentTheme("twilight");  // Fallback to default theme on error
                });
        }
    }, [theme]);


    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    
    return (
        <div className='ace-editor-wrapper' style={{width: width || '100%'}}>
            <div className='ace-container'>
                <button onClick={copyToClipboard} className='copy-btn'>
                    {copied ? "Copied!" : "Copy Code"}
                </button>
            </div>
            <AceEditor
                style={{width: '100%', height: '250px',padding:'20px',paddingTop:'50px'}}
                className='ace-editor'
                mode="c_cpp"
                theme="twilight"
                value={code}
                onChange={onChange}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
                fontSize={fontSize}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                }}
            />
        </div>
    );

    // return (
    //     <div className='ace-editor-wrapper' style={{width: width || '100%'}}>
    //         <AceEditor
    //             style={{width: '100%', height: '250px', padding: '20px', paddingTop: '50px'}}
    //             className='ace-editor'
    //             mode={mode || "c_cpp"}
    //             theme={currentTheme}
    //             value={code}
    //             onChange={onChange}
    //             fontSize={fontSize}
    //             setOptions={{
    //                 showLineNumbers: true,
    //                 tabSize: 2,
    //             }}
    //         />
    //     </div>
    // );
};

export default AceEditorComponent;
