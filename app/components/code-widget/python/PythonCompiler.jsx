// // // // // // // // components/PythonCompiler.js
// // // // // // // import { useState } from 'react';

// // // // // // // export default function PythonCompiler() {
// // // // // // //   const [code, setCode] = useState('');
// // // // // // //   const [output, setOutput] = useState('');
// // // // // // //   const [error, setError] = useState('');

// // // // // // //   const runCode = async () => {
// // // // // // //     try {
// // // // // // //       const response = await fetch('/api/python', {
// // // // // // //         method: 'POST',
// // // // // // //         headers: {
// // // // // // //           'Content-Type': 'application/json',
// // // // // // //         },
// // // // // // //         body: JSON.stringify({ code }),
// // // // // // //       });

// // // // // // //       const data = await response.json();

// // // // // // //       if (!response.ok) {
// // // // // // //         throw new Error(data.error);
// // // // // // //       }

// // // // // // //       setOutput(data.output);
// // // // // // //       setError('');
// // // // // // //     } catch (err) {
// // // // // // //       setError(err.message);
// // // // // // //       setOutput('');
// // // // // // //     }
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div>
// // // // // // //       <textarea
// // // // // // //         value={code}
// // // // // // //         onChange={(e) => setCode(e.target.value)}
// // // // // // //         rows="10"
// // // // // // //         cols="50"
// // // // // // //         placeholder="Enter Python code here"
// // // // // // //       />
// // // // // // //       <button onClick={runCode}>Run Code</button>
      
// // // // // // //       {output && (
// // // // // // //         <div>
// // // // // // //           <h3>Output:</h3>
// // // // // // //           <pre>{output}</pre>
// // // // // // //         </div>
// // // // // // //       )}
      
// // // // // // //       {error && (
// // // // // // //         <div>
// // // // // // //           <h3>Error:</h3>
// // // // // // //           <pre style={{ color: 'red' }}>{error}</pre>
// // // // // // //         </div>
// // // // // // //       )}
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }


// // // // // // // components/PythonCompiler.js
// // // // // // import { useState } from 'react';
// // // // // // import styles from './PythonCompiler.css';

// // // // // // export default function PythonCompiler() {
// // // // // //   const [code, setCode] = useState('');
// // // // // //   const [output, setOutput] = useState('');
// // // // // //   const [error, setError] = useState('');

// // // // // //   const runCode = async () => {
// // // // // //     try {
// // // // // //       const response = await fetch('/api/python', {
// // // // // //         method: 'POST',
// // // // // //         headers: {
// // // // // //           'Content-Type': 'application/json',
// // // // // //         },
// // // // // //         body: JSON.stringify({ code }),
// // // // // //       });

// // // // // //       const data = await response.json();

// // // // // //       if (!response.ok) {
// // // // // //         throw new Error(data.error);
// // // // // //       }

// // // // // //       setOutput(data.output);
// // // // // //       setError('');
// // // // // //     } catch (err) {
// // // // // //       setError(err.message);
// // // // // //       setOutput('');
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className="compiler-container">
// // // // // //       <textarea
// // // // // //         className="code-textarea"
// // // // // //         value={code}
// // // // // //         onChange={(e) => setCode(e.target.value)}
// // // // // //         rows="10"
// // // // // //         cols="50"
// // // // // //         placeholder="Enter Python code here"
// // // // // //       />
// // // // // //       <button className="run-button" onClick={runCode}>
// // // // // //         Run Code
// // // // // //       </button>
      
// // // // // //       {output && (
// // // // // //         <div className="output-container">
// // // // // //           <h3>Output:</h3>
// // // // // //           <pre>{output}</pre>
// // // // // //         </div>
// // // // // //       )}
      
// // // // // //       {error && (
// // // // // //         <div className="error-container">
// // // // // //           <h3>Error:</h3>
// // // // // //           <pre>{error}</pre>
// // // // // //         </div>
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // }


// // // // // // components/PythonCompiler.js
// // // // // import { useState } from 'react';
// // // // // import styles from './PythonCompiler.module.css';

// // // // // export default function PythonCompiler() {
// // // // //   const [code, setCode] = useState('');
// // // // //   const [output, setOutput] = useState('');
// // // // //   const [error, setError] = useState('');
// // // // //   const [isLoading, setIsLoading] = useState(false);

// // // // //   const runCode = async () => {
// // // // //     if (!code.trim()) {
// // // // //       setError('Please enter some code');
// // // // //       return;
// // // // //     }

// // // // //     setIsLoading(true);
// // // // //     setError('');
// // // // //     setOutput('');

// // // // //     try {
// // // // //       const response = await fetch('/api/python', {
// // // // //         method: 'POST',
// // // // //         headers: {
// // // // //           'Content-Type': 'application/json',
// // // // //         },
// // // // //         body: JSON.stringify({ code }),
// // // // //       });

// // // // //       // const response = await fetch('/api/hello', {
// // // // //       //   method: 'POST',
// // // // //       //   headers: {
// // // // //       //     'Content-Type': 'application/json',
// // // // //       //   },
// // // // //       //   body: JSON.stringify({ code }),
// // // // //       // });
      
// // // // //       const data = await response.json();

// // // // //       if (!response.ok) {
// // // // //         throw new Error(data.error || 'Failed to execute code');
// // // // //       }

// // // // //       setOutput(data.output || 'No output');
      
// // // // //     } catch (err) {
// // // // //       setError(err.message || 'An error occurred');
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className={styles['compiler-container']}>
// // // // //       <textarea
// // // // //         className={styles['code-textarea']}
// // // // //         value={code}
// // // // //         onChange={(e) => setCode(e.target.value)}
// // // // //         rows="10"
// // // // //         cols="50"
// // // // //         placeholder="Enter Python code here"
// // // // //         disabled={isLoading}
// // // // //       />
// // // // //       <button 
// // // // //         className={styles['run-button']}
// // // // //         onClick={runCode}
// // // // //         disabled={isLoading}
// // // // //       >
// // // // //         {isLoading ? 'Running...' : 'Run Code'}
// // // // //       </button>
      
// // // // //       {output && (
// // // // //         <div className={styles['output-container']}>
// // // // //           <h3>Output:</h3>
// // // // //           <pre>{output}</pre>
// // // // //         </div>
// // // // //       )}
      
// // // // //       {error && (
// // // // //         <div className={styles['error-container']}>
// // // // //           <h3>Error:</h3>
// // // // //           <pre>{error}</pre>
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }


// // // // // import { useState } from 'react';
// // // // // import AceEditor from 'react-ace';

// // // // // // Import themes and languages
// // // // // import "ace-builds/src-noconflict/mode-python";
// // // // // import "ace-builds/src-noconflict/theme-monokai";
// // // // // import "ace-builds/src-noconflict/ext-language_tools";

// // // // // import styles from './PythonCompiler.module.css';

// // // // // export default function PythonCompiler() {
// // // // //   const [code, setCode] = useState('');
// // // // //   const [output, setOutput] = useState('');
// // // // //   const [error, setError] = useState('');
// // // // //   const [isLoading, setIsLoading] = useState(false);

// // // // //   const runCode = async () => {
// // // // //     if (!code.trim()) {
// // // // //       setError('Please enter some code');
// // // // //       return;
// // // // //     }

// // // // //     setIsLoading(true);
// // // // //     setError('');
// // // // //     setOutput('');

// // // // //     try {
// // // // //       const response = await fetch('/api/python', {
// // // // //         method: 'POST',
// // // // //         headers: {
// // // // //           'Content-Type': 'application/json',
// // // // //         },
// // // // //         body: JSON.stringify({ code }),
// // // // //       });

// // // // //       const data = await response.json();

// // // // //       if (!response.ok) {
// // // // //         throw new Error(data.error || 'Failed to execute code');
// // // // //       }

// // // // //       setOutput(data.output || 'No output');
      
// // // // //     } catch (err) {
// // // // //       setError(err.message || 'An error occurred');
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className={styles['compiler-container']}>
// // // // //       {/* <AceEditor
// // // // //         mode="python"
// // // // //         theme="monokai"
// // // // //         onChange={setCode}
// // // // //         value={code}
// // // // //         name="python-editor"
// // // // //         editorProps={{ $blockScrolling: true }}
// // // // //         setOptions={{
// // // // //           enableBasicAutocompletion: true,
// // // // //           enableLiveAutocompletion: true,
// // // // //           showLineNumbers: true,
// // // // //           tabSize: 4,
// // // // //         }}
// // // // //         style={{ width: '100%', height: '400px' }}
// // // // //       /> */}
// // // // // <div style={{paddingTop:'50px'}}>
// // // // // <AceEditor
// // // // //  mode="python"
// // // // //  theme="monokai"
// // // // //  onChange={setCode}
// // // // //  value={code}
// // // // //  name="python-editor"
// // // // //  editorProps={{ $blockScrolling: true }}
// // // // //  setOptions={{
// // // // //    enableBasicAutocompletion: true,
// // // // //    enableLiveAutocompletion: true,
// // // // //    showLineNumbers: true, 
// // // // //    tabSize: 4,
// // // // //    fontSize: '16px',
// // // // //    firstLineNumber: 1,
// // // // //  }}
// // // // //  style={{ 
// // // // //    width: '60%', 
// // // // //    height: '300px',
// // // // //    padding: '20px',
// // // // //    marginBottom: '20px',
// // // // //    paddingTop:'50px'
// // // // //  }}
// // // // //  wrapEnabled={true}
// // // // //   onLoad={(editor) => {
// // // // //     editor.renderer.setScrollMargin(20, 20, 20, 20);
// // // // //   }}
// // // // // />
// // // // // </div>
// // // // //       <button 
// // // // //         className={styles['run-button']}
// // // // //         onClick={runCode}
// // // // //         disabled={isLoading}
// // // // //       >
// // // // //         {isLoading ? 'Running...' : 'Run Code'}
// // // // //       </button>
      
// // // // //       {output && (
// // // // //         <div className={styles['output-container']}>
// // // // //           <h3>Output:</h3>
// // // // //           <pre>{output}</pre>
// // // // //         </div>
// // // // //       )}
      
// // // // //       {error && (
// // // // //         <div className={styles['error-container']}>
// // // // //           <h3>Error:</h3>
// // // // //           <pre>{error}</pre>
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }


// // // // import { useState } from 'react';
// // // // import AceEditor from 'react-ace';

// // // // import "ace-builds/src-noconflict/mode-python";
// // // // import "ace-builds/src-noconflict/theme-monokai";
// // // // import "ace-builds/src-noconflict/ext-language_tools";

// // // // import styles from './PythonCompiler.module.css';

// // // // export default function PythonCompiler() {
// // // //   const [code, setCode] = useState('');
// // // //   const [output, setOutput] = useState('');
// // // //   const [error, setError] = useState('');
// // // //   const [isLoading, setIsLoading] = useState(false);

// // // //   const runCode = async () => {
// // // //     if (!code || typeof code !== 'string') {
// // // //       setError('Invalid code input');
// // // //       return;
// // // //     }

// // // //     if (code.length > 5000) {
// // // //       setError('Code exceeds maximum length (5000 characters)');
// // // //       return;
// // // //     }

// // // //     if (!code.trim()) {
// // // //       setError('Please enter some code');
// // // //       return;
// // // //     }

// // // //     setIsLoading(true);
// // // //     setError('');
// // // //     setOutput('');

// // // //     const controller = new AbortController();
// // // //     const timeout = setTimeout(() => controller.abort(), 10000);

// // // //     try {
// // // //       const response = await fetch('/api/python', {
// // // //         method: 'POST',
// // // //         headers: {
// // // //           'Content-Type': 'application/json',
// // // //         },
// // // //         body: JSON.stringify({ code }),
// // // //         signal: controller.signal
// // // //       });

// // // //       const data = await response.json();

// // // //       if (!response.ok) {
// // // //         throw new Error(data.error || 'Failed to execute code');
// // // //       }

// // // //       setOutput(data.output || 'No output');
      
// // // //     } catch (err) {
// // // //       if (err.name === 'AbortError') {
// // // //         setError('Request timeout - execution took too long');
// // // //       } else {
// // // //         setError(err.message || 'An error occurred');
// // // //       }
// // // //     } finally {
// // // //       clearTimeout(timeout);
// // // //       setIsLoading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className={styles['compiler-container']}>
// // // //       <div style={{paddingTop:'50px'}}>
// // // //         <AceEditor 
// // // //           mode="python"
// // // //           theme="monokai"
// // // //           onChange={setCode}
// // // //           value={code}
// // // //           name="python-editor"
// // // //           editorProps={{ $blockScrolling: true }}
// // // //           setOptions={{
// // // //             enableBasicAutocompletion: true,
// // // //             enableLiveAutocompletion: true,
// // // //             showLineNumbers: true, 
// // // //             tabSize: 4,
// // // //             fontSize: '16px',
// // // //             firstLineNumber: 1,
// // // //           }}
// // // //           style={{ 
// // // //             width: '60%', 
// // // //             height: '300px',
// // // //             padding: '20px',
// // // //             marginBottom: '20px',
// // // //             paddingTop:'50px'
// // // //           }}
// // // //           wrapEnabled={true}
// // // //           onLoad={(editor) => {
// // // //             editor.renderer.setScrollMargin(20, 20, 20, 20);
// // // //           }}
// // // //         />
// // // //       </div>

// // // //       <button 
// // // //         className={styles['run-button']}
// // // //         onClick={runCode}
// // // //         disabled={isLoading}
// // // //       >
// // // //         {isLoading ? 'Running...' : 'Run Code'}
// // // //       </button>
      
// // // //       {output && (
// // // //         <div className={styles['output-container']}>
// // // //           <h3>Output:</h3>
// // // //           <pre>{output}</pre>
// // // //         </div>
// // // //       )}
      
// // // //       {error && (
// // // //         <div className={styles['error-container']}>
// // // //           <h3>Error:</h3>
// // // //           <pre>{error}</pre>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }


// // // import { useState } from 'react';
// // // import AceEditor from 'react-ace';

// // // import "ace-builds/src-noconflict/mode-python";
// // // import "ace-builds/src-noconflict/theme-monokai";
// // // import "ace-builds/src-noconflict/ext-language_tools";

// // // import styles from './PythonCompiler.module.css';

// // // export default function PythonCompiler() {
// // //   const [code, setCode] = useState('');
// // //   const [output, setOutput] = useState('');
// // //   const [error, setError] = useState('');
// // //   const [isLoading, setIsLoading] = useState(false);

// // //   const runCode = async () => {
// // //     if (!code || typeof code !== 'string') {
// // //       setError('Invalid code input');
// // //       return;
// // //     }

// // //     if (code.length > 5000) {
// // //       setError('Code exceeds maximum length (5000 characters)');
// // //       return;
// // //     }

// // //     if (!code.trim()) {
// // //       setError('Please enter some code');
// // //       return;
// // //     }

// // //     setIsLoading(true);
// // //     setError('');
// // //     setOutput('');

// // //     const controller = new AbortController();
// // //     const timeout = setTimeout(() => controller.abort(), 10000);

// // //     try {
// // //       const response = await fetch('/api/python', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify({ code }),
// // //         signal: controller.signal
// // //       });

// // //       const data = await response.json();

// // //       if (!response.ok) {
// // //         throw new Error(data.error || 'Failed to execute code');
// // //       }

// // //       setOutput(data.output || 'No output');
      
// // //     } catch (err) {
// // //       if (err.name === 'AbortError') {
// // //         setError('Request timeout - execution took too long');
// // //       } else {
// // //         setError(err.message || 'An error occurred');
// // //       }
// // //     } finally {
// // //       clearTimeout(timeout);
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className={styles['compiler-container']}>
// // //       <div className={styles.toolbar}>
// // //         <div className={styles.toolbarLeft}>
// // //           <button className={styles.toolbarButton}>
// // //             New
// // //           </button>
// // //           <button className={styles.toolbarButton}>
// // //             Save
// // //           </button>
// // //           <button className={styles.toolbarButton}>
// // //             Examples
// // //           </button>
// // //         </div>
// // //         <div className={styles.toolbarRight}>
// // //           <button className={styles.toolbarButton}>
// // //             Settings
// // //           </button>
// // //         </div>
// // //       </div>

// // //       <div style={{paddingTop:'20px'}}>
// // //         <AceEditor 
// // //           mode="python"
// // //           theme="monokai"
// // //           onChange={setCode}
// // //           value={code}
// // //           name="python-editor"
// // //           editorProps={{ $blockScrolling: true }}
// // //           setOptions={{
// // //             enableBasicAutocompletion: true,
// // //             enableLiveAutocompletion: true,
// // //             showLineNumbers: true, 
// // //             tabSize: 4,
// // //             fontSize: '16px',
// // //             firstLineNumber: 1,
// // //           }}
// // //           style={{ 
// // //             width: '60%', 
// // //             height: '300px',
// // //             padding: '20px',
// // //             marginBottom: '20px',
// // //           }}
// // //           wrapEnabled={true}
// // //           onLoad={(editor) => {
// // //             editor.renderer.setScrollMargin(20, 20, 20, 20);
// // //           }}
// // //         />
// // //       </div>

// // //       <button 
// // //         className={styles['run-button']}
// // //         onClick={runCode}
// // //         disabled={isLoading}
// // //       >
// // //         {isLoading ? 'Running...' : 'Run Code'}
// // //       </button>
      
// // //       {output && (
// // //         <div className={styles['output-container']}>
// // //           <h3>Output:</h3>
// // //           <pre>{output}</pre>
// // //         </div>
// // //       )}
      
// // //       {error && (
// // //         <div className={styles['error-container']}>
// // //           <h3>Error:</h3>
// // //           <pre>{error}</pre>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }


// // import { useState } from 'react';
// // import AceEditor from 'react-ace';

// // import "ace-builds/src-noconflict/mode-python";
// // import "ace-builds/src-noconflict/theme-monokai";
// // import "ace-builds/src-noconflict/ext-language_tools";

// // import styles from './PythonCompiler.module.css';

// // export default function PythonCompiler() {
// //  const [code, setCode] = useState('');
// //  const [output, setOutput] = useState('');
// //  const [error, setError] = useState('');
// //  const [isLoading, setIsLoading] = useState(false);

// //  const runCode = async () => {
// //    if (!code || typeof code !== 'string') {
// //      setError('Invalid code input');
// //      return;
// //    }

// //    if (code.length > 5000) {
// //      setError('Code exceeds maximum length (5000 characters)');
// //      return;
// //    }

// //    if (!code.trim()) {
// //      setError('Please enter some code');
// //      return;
// //    }

// //    setIsLoading(true);
// //    setError('');
// //    setOutput('');

// //    const controller = new AbortController();
// //    const timeout = setTimeout(() => controller.abort(), 10000);

// //    try {
// //      const response = await fetch('/api/python', {
// //        method: 'POST',
// //        headers: {
// //          'Content-Type': 'application/json',
// //        },
// //        body: JSON.stringify({ code }),
// //        signal: controller.signal
// //      });

// //      const data = await response.json();

// //      if (!response.ok) {
// //        throw new Error(data.error || 'Failed to execute code');
// //      }

// //      setOutput(data.output || 'No output');
     
// //    } catch (err) {
// //      if (err.name === 'AbortError') {
// //        setError('Request timeout - execution took too long');
// //      } else {
// //        setError(err.message || 'An error occurred');
// //      }
// //    } finally {
// //      clearTimeout(timeout);
// //      setIsLoading(false);
// //    }
// //  };

// //  return (
// //    <div className={styles['compiler-container']}>
// //      <div className={styles.toolbar}>
// //        <button className={styles['toolbar-button']}>New</button>
// //        <button className={styles['toolbar-button']}>Save</button>
// //        <button className={styles['toolbar-button']}>Examples</button>
// //        <button 
// //        className={styles['run-button']}
// //        onClick={runCode}
// //        disabled={isLoading}
// //      >
// //        {isLoading ? 'Running...' : 'Run '}
// //        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg>
// //      </button>
// //        <div className={styles['toolbar-right']}>
        
// //          <button className={styles['toolbar-button']}>Settings</button>
// //        </div>
// //      </div>

// //      <AceEditor 
// //        mode="python"
// //        theme="monokai"
// //        onChange={setCode}
// //        value={code}
// //        name="python-editor"
// //        editorProps={{ $blockScrolling: true }}
// //        setOptions={{
// //          enableBasicAutocompletion: true,
// //          enableLiveAutocompletion: true,
// //          showLineNumbers: true, 
// //          tabSize: 4,
// //          fontSize: '16px',
// //          firstLineNumber: 1,
// //        }}
// //        style={{ 
// //          width: '100%',
// //          height: '300px',
// //          marginBottom: '0px',
// //        }}
// //        wrapEnabled={true}
// //        onLoad={(editor) => {
// //          editor.renderer.setScrollMargin(20, 20, 20, 20);
// //        }}
// //      />

// //      {/* <button 
// //        className={styles['run-button']}
// //        onClick={runCode}
// //        disabled={isLoading}
// //      >
// //        {isLoading ? 'Running...' : 'Run Code'}
// //      </button> */}
     
// //      {output && (
// //       <>
// //         <h3 style={{marginLeft:'20px'}}>Output:</h3>
// //        <div className={styles['output-container']}>
// //          {/* <h3>Output:</h3> */}
// //          <pre>{output}</pre>
// //        </div>
// //        </>
// //      )}
     
// //      {error && (
// //        <div className={styles['error-container']}>
// //          <h3>Error:</h3>
// //          <pre>{error}</pre>
// //        </div>
// //      )}
// //    </div>
// //  );
// // }


// import { useState } from 'react';
// import AceEditor from 'react-ace';
// import "ace-builds/src-noconflict/mode-python";
// import "ace-builds/src-noconflict/theme-monokai";
// import "ace-builds/src-noconflict/ext-language_tools";
// import styles from './PythonCompiler.module.css';


// export default function PythonCompiler() {
//   const [code, setCode] = useState('');
//   const [output, setOutput] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState('');
//   const [copySuccess, setCopySuccess] = useState('');
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);

//   const handleClear = () => {
//     setCode('');
//     setOutput('');
//     setError('');
//   };

//   const handleUndo = () => {
//     // Get the editor instance from Ace
//     const editor = window.ace.edit("python-editor");
//     if (editor) {
//       editor.undo();
//     }
//   };


//   const handleRedo = () => {
//     const editor = window.ace.edit("python-editor");
//     if (editor) {
//       editor.redo();
//     }
//   };

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(code);
//       setCopySuccess('Copied!');
//       setTimeout(() => setCopySuccess(''), 2000);
//     } catch (err) {
//       setCopySuccess('Failed to copy!');
//       setTimeout(() => setCopySuccess(''), 2000);
//     }
//   };

//   const runCode = async () => {
//     if (!code || typeof code !== 'string') {
//       setError('Invalid code input');
//       return;
//     }

//     if (code.length > 5000) {
//       setError('Code exceeds maximum length (5000 characters)');
//       return;
//     }

//     if (!code.trim()) {
//       setError('Please enter some code');
//       return;
//     }

//     setIsLoading(true);
//     setError('');
//     setOutput('');

//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 10000);

//     try {
//       const response = await fetch('/api/python', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ code }),
//         signal: controller.signal
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to execute code');
//       }

//       setOutput(data.output || 'No output');
//     } catch (err) {
//       if (err.name === 'AbortError') {
//         setError('Request timeout - execution took too long');
//       } else {
//         setError(err.message || 'An error occurred');
//       }
//     } finally {
//       clearTimeout(timeout);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={styles['compiler-container']}>
//       <div className={styles.toolbar}>
//         <button 
//           className={styles['toolbar-button']} 
//           onClick={handleClear}
//         >
//           Clear
//           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
//         </button>
//         <button 
//           className={styles['toolbar-button']} 
//           onClick={handleCopy}
//         >
//           {copySuccess || 'Copy'}
//           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
//         </button>
//         <button 
//   className={styles['toolbar-button']} 
//   onClick={handleUndo}
// >
//   Undo
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-undo-2"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
// </button>
// <button 
//   className={styles['toolbar-button']} 
//   onClick={handleRedo}
// >
//   Redo
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-redo-2"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"/></svg>
// </button>
//         <button
//           className={styles['run-button']}
//           onClick={runCode}
//           disabled={isLoading}
//         >
//           {isLoading ? 'Running...' : 'Run '}
//           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play">
//             <polygon points="6 3 20 12 6 21 6 3"/>
//           </svg>
//         </button>

//         <div className={styles['toolbar-right']}>
//   <div className={styles['settings-dropdown']}>
//     <button 
//       className={styles['toolbar-button']} 
//       onClick={() => setIsSettingsOpen(!isSettingsOpen)}
//     >
//       Settings
//       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
//     </button>
//     {isSettingsOpen && (
//       <div className={styles['dropdown-menu']}>
//         <button className={styles['dropdown-item']}>Oriented Horizontal</button>
//         <button className={styles['dropdown-item']}>Oriented Vertical</button>
//       </div>
//     )}
//   </div>
// </div>
        
//         {/* <div className={styles['toolbar-right']}>
//           <button className={styles['toolbar-button']}>Settings</button>
//         </div> */}
//       </div>

//       <AceEditor
//         mode="python"
//         theme="monokai"
//         onChange={setCode}
//         value={code}
//         name="python-editor"
//         editorProps={{ $blockScrolling: true }}
//         setOptions={{
//           enableBasicAutocompletion: true,
//           enableLiveAutocompletion: true,
//           showLineNumbers: true,
//           tabSize: 4,
//           fontSize: '16px',
//           firstLineNumber: 1,
//         }}
//         style={{
//           width: '100%',
//           height: '300px',
//           marginBottom: '0px',
//         }}
//         wrapEnabled={true}
//         onLoad={(editor) => {
//           editor.renderer.setScrollMargin(20, 20, 20, 20);
//         }}
//       />

//       {/* {output && (
//         <>
//           <h3 style={{marginLeft:'20px'}}>Output:</h3>
//           <div className={styles['output-container']}>
//             <pre>{output}</pre>
//           </div>
//         </>
//       )}

//       {error && (
//         <div className={styles['error-container']}>
//           <h3>Error:</h3>
//           <pre>{error}</pre>
//         </div>
//       )} */}

// {output && (
//   <>
//     <h3 className={styles.heading}>Output:</h3>
//     <div className={styles['output-container']}>
//       <pre className={styles['output-pre']}>{output}</pre>
//     </div>
//   </>
// )}

// {error && (
//   <div className={styles['error-container']}>
//     <h3 className={styles.heading}>Error:</h3>
//     <pre className={styles['output-pre']}>{error}</pre>
//   </div>
// )}
//     </div>
//   );
// }


import { useState } from 'react';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import styles from './PythonCompiler.module.css';

export default function PythonCompiler() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);

  const handleClear = () => {
    setCode('');
    setOutput('');
    setError('');
  };

  const handleUndo = () => {
    const editor = window.ace.edit("python-editor");
    if (editor) {
      editor.undo();
    }
  };

  const handleRedo = () => {
    const editor = window.ace.edit("python-editor");
    if (editor) {
      editor.redo();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy!');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const runCode = async () => {
    if (!code || typeof code !== 'string') {
      setError('Invalid code input');
      return;
    }

    if (code.length > 5000) {
      setError('Code exceeds maximum length (5000 characters)');
      return;
    }

    if (!code.trim()) {
      setError('Please enter some code');
      return;
    }

    setIsLoading(true);
    setError('');
    setOutput('');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('/api/python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
        signal: controller.signal
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute code');
      }

      setOutput(data.output || 'No output');
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timeout - execution took too long');
      } else {
        setError(err.message || 'An error occurred');
      }
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['compiler-container']}>
      <div className={styles.toolbar}>
        <button 
          className={styles['toolbar-button']} 
          onClick={handleClear}
        >
          Clear
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <button 
          className={styles['toolbar-button']} 
          onClick={handleCopy}
        >
          {copySuccess || 'Copy'}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>
        <button 
          className={styles['toolbar-button']} 
          onClick={handleUndo}
        >
          Undo
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-undo-2"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
        </button>
        <button 
          className={styles['toolbar-button']} 
          onClick={handleRedo}
        >
          Redo
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-redo-2"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"/></svg>
        </button>
        <button
          className={styles['run-button']}
          onClick={runCode}
          disabled={isLoading}
        >
          {isLoading ? 'Running...' : 'Run '}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play">
            <polygon points="6 3 20 12 6 21 6 3"/>
          </svg>
        </button>
        
        <div className={styles['toolbar-right']}>
          <div className={styles['settings-dropdown']}>
            <button 
              className={styles['toolbar-button']} 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              Settings
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            {isSettingsOpen && (
              <div className={styles['dropdown-menu']}>
                <button 
                  className={styles['dropdown-item']}
                  onClick={() => {
                    setIsVerticalLayout(false);
                    setIsSettingsOpen(false);
                  }}
                >
                  Oriented Horizontal
                </button>
                <button 
                  className={styles['dropdown-item']}
                  onClick={() => {
                    setIsVerticalLayout(true);
                    setIsSettingsOpen(false);
                  }}
                >
                  Oriented Vertical
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`${styles['editor-output-container']} ${isVerticalLayout ? styles.vertical : styles.horizontal}`}>
        <div className={styles['editor-section']}>
          <AceEditor
            mode="python"
            theme="monokai"
            onChange={setCode}
            value={code}
            name="python-editor"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              showLineNumbers: true,
              tabSize: 4,
              fontSize: '16px',
              firstLineNumber: 1,
            }}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '300px'
            }}
            wrapEnabled={true}
            onLoad={(editor) => {
              editor.renderer.setScrollMargin(20, 20, 20, 20);
            }}
          />
        </div>

        <div className={styles['output-section']}>
          {output && (
            <>
              <h3 className={styles.heading}>Output:</h3>
              <div className={styles['output-container']}>
                <pre className={styles['output-pre']}>{output}</pre>
              </div>
            </>
          )}

          {error && (
            <>
             <h3 className={styles.heading}>Error:</h3>
            <div className={styles['error-container']}>             
              <pre className={styles['output-pre']}>{error}</pre>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}