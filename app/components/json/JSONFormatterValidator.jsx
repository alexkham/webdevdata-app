// // // // // // // // // // // 'use client'
// // // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // // import JSON5 from 'json5';
// // // // // // // // // // // import prettier from 'prettier';

// // // // // // // // // // // const JSONFormatterValidator = () => {
// // // // // // // // // // //   const [input, setInput] = useState('');
// // // // // // // // // // //   const [output, setOutput] = useState('');
// // // // // // // // // // //   const [isValid, setIsValid] = useState(true);
// // // // // // // // // // //   const [error, setError] = useState('');

// // // // // // // // // // //   const formatAndValidateJSON = (input) => {
// // // // // // // // // // //     try {
// // // // // // // // // // //       // Parse the input (this also validates the JSON)
// // // // // // // // // // //       const parsed = JSON5.parse(input);
      
// // // // // // // // // // //       // Format the parsed JSON
// // // // // // // // // // //       const formatted = prettier.format(JSON.stringify(parsed), {
// // // // // // // // // // //         parser: "json",
// // // // // // // // // // //         printWidth: 80
// // // // // // // // // // //       });

// // // // // // // // // // //       setOutput(formatted);
// // // // // // // // // // //       setIsValid(true);
// // // // // // // // // // //       setError('');
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       setOutput('');
// // // // // // // // // // //       setIsValid(false);
// // // // // // // // // // //       setError(error.message);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   const handleInputChange = (e) => {
// // // // // // // // // // //     setInput(e.target.value);
// // // // // // // // // // //   };

// // // // // // // // // // //   const handleSubmit = (e) => {
// // // // // // // // // // //     e.preventDefault();
// // // // // // // // // // //     formatAndValidateJSON(input);
// // // // // // // // // // //   };

// // // // // // // // // // //   return (
// // // // // // // // // // //     <div className="json-formatter-validator">
// // // // // // // // // // //       <h1>JSON Formatter and Validator</h1>
// // // // // // // // // // //       <form onSubmit={handleSubmit}>
// // // // // // // // // // //         <textarea
// // // // // // // // // // //           value={input}
// // // // // // // // // // //           onChange={handleInputChange}
// // // // // // // // // // //           placeholder="Paste your JSON here..."
// // // // // // // // // // //           rows={10}
// // // // // // // // // // //           cols={50}
// // // // // // // // // // //         />
// // // // // // // // // // //         <button type="submit">Format and Validate</button>
// // // // // // // // // // //       </form>
// // // // // // // // // // //       {isValid ? (
// // // // // // // // // // //         <pre className="output">{output}</pre>
// // // // // // // // // // //       ) : (
// // // // // // // // // // //         <div className="error">{error}</div>
// // // // // // // // // // //       )}
// // // // // // // // // // //       <style jsx>{`
// // // // // // // // // // //         .json-formatter-validator {
// // // // // // // // // // //           font-family: Arial, sans-serif;
// // // // // // // // // // //           max-width: 800px;
// // // // // // // // // // //           margin: 0 auto;
// // // // // // // // // // //           padding: 20px;
// // // // // // // // // // //         }
// // // // // // // // // // //         textarea {
// // // // // // // // // // //           width: 100%;
// // // // // // // // // // //           margin-bottom: 10px;
// // // // // // // // // // //         }
// // // // // // // // // // //         button {
// // // // // // // // // // //           padding: 10px 20px;
// // // // // // // // // // //           background-color: #007bff;
// // // // // // // // // // //           color: white;
// // // // // // // // // // //           border: none;
// // // // // // // // // // //           cursor: pointer;
// // // // // // // // // // //         }
// // // // // // // // // // //         .output {
// // // // // // // // // // //           background-color: #f4f4f4;
// // // // // // // // // // //           padding: 10px;
// // // // // // // // // // //           white-space: pre-wrap;
// // // // // // // // // // //           word-wrap: break-word;
// // // // // // // // // // //         }
// // // // // // // // // // //         .error {
// // // // // // // // // // //           color: red;
// // // // // // // // // // //           margin-top: 10px;
// // // // // // // // // // //         }
// // // // // // // // // // //       `}</style>
// // // // // // // // // // //     </div>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // export default JSONFormatterValidator;
// // // // // // // // // // 'use client'
// // // // // // // // // // import React, { useState, useCallback } from 'react';
// // // // // // // // // // import JSON5 from 'json5';
// // // // // // // // // // import prettier from 'prettier';

// // // // // // // // // // const JSONFormatterValidator = () => {
// // // // // // // // // //   const [input, setInput] = useState('');
// // // // // // // // // //   const [output, setOutput] = useState('');
// // // // // // // // // //   const [isValid, setIsValid] = useState(true);
// // // // // // // // // //   const [error, setError] = useState('');

// // // // // // // // // //   const formatAndValidateJSON = useCallback((inputJSON) => {
// // // // // // // // // //     try {
// // // // // // // // // //       // Parse the input (this also validates the JSON)
// // // // // // // // // //       const parsed = JSON5.parse(inputJSON);
      
// // // // // // // // // //       // Format the parsed JSON
// // // // // // // // // //       const formatted = prettier.format(JSON.stringify(parsed), {
// // // // // // // // // //         parser: "json",
// // // // // // // // // //         printWidth: 80
// // // // // // // // // //       });

// // // // // // // // // //       setOutput(formatted);
// // // // // // // // // //       setIsValid(true);
// // // // // // // // // //       setError('');
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       setOutput('');
// // // // // // // // // //       setIsValid(false);
// // // // // // // // // //       setError(error.message);
// // // // // // // // // //     }
// // // // // // // // // //   }, []);

// // // // // // // // // //   const handleInputChange = useCallback((e) => {
// // // // // // // // // //     setInput(e.target.value);
// // // // // // // // // //   }, []);

// // // // // // // // // //   const handleSubmit = useCallback((e) => {
// // // // // // // // // //     e.preventDefault();
// // // // // // // // // //     formatAndValidateJSON(input);
// // // // // // // // // //   }, [input, formatAndValidateJSON]);

// // // // // // // // // //   return (
// // // // // // // // // //     <div className="json-formatter-validator">
// // // // // // // // // //       <h1>JSON Formatter and Validator</h1>
// // // // // // // // // //       <form onSubmit={handleSubmit}>
// // // // // // // // // //         <textarea
// // // // // // // // // //           value={input}
// // // // // // // // // //           onChange={handleInputChange}
// // // // // // // // // //           placeholder="Paste your JSON here..."
// // // // // // // // // //           rows={10}
// // // // // // // // // //         />
// // // // // // // // // //         <button type="submit">Format and Validate</button>
// // // // // // // // // //       </form>
// // // // // // // // // //       {isValid ? (
// // // // // // // // // //         <pre className="output">{output}</pre>
// // // // // // // // // //       ) : (
// // // // // // // // // //         <div className="error">{error}</div>
// // // // // // // // // //       )}
// // // // // // // // // //       <style jsx>{`
// // // // // // // // // //         .json-formatter-validator {
// // // // // // // // // //           font-family: Arial, sans-serif;
// // // // // // // // // //           max-width: 800px;
// // // // // // // // // //           margin: 0 auto;
// // // // // // // // // //           padding: 20px;
// // // // // // // // // //         }
// // // // // // // // // //         textarea {
// // // // // // // // // //           width: 100%;
// // // // // // // // // //           margin-bottom: 10px;
// // // // // // // // // //           padding: 10px;
// // // // // // // // // //         }
// // // // // // // // // //         button {
// // // // // // // // // //           padding: 10px 20px;
// // // // // // // // // //           background-color: #007bff;
// // // // // // // // // //           color: white;
// // // // // // // // // //           border: none;
// // // // // // // // // //           cursor: pointer;
// // // // // // // // // //         }
// // // // // // // // // //         .output {
// // // // // // // // // //           background-color: #f4f4f4;
// // // // // // // // // //           padding: 10px;
// // // // // // // // // //           white-space: pre-wrap;
// // // // // // // // // //           word-wrap: break-word;
// // // // // // // // // //         }
// // // // // // // // // //         .error {
// // // // // // // // // //           color: red;
// // // // // // // // // //           margin-top: 10px;
// // // // // // // // // //         }
// // // // // // // // // //       `}</style>
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // export default JSONFormatterValidator;
// // // // // // // // // 'use client'
// // // // // // // // // import React, { useState, useCallback } from 'react';
// // // // // // // // // import JSON5 from 'json5';
// // // // // // // // // import prettier from 'prettier/standalone';
// // // // // // // // // import parserBabel from 'prettier/parser-babel';

// // // // // // // // // const JSONFormatterValidator = () => {
// // // // // // // // //   const [input, setInput] = useState('');
// // // // // // // // //   const [output, setOutput] = useState('');
// // // // // // // // //   const [isValid, setIsValid] = useState(true);
// // // // // // // // //   const [error, setError] = useState('');

// // // // // // // // //   const formatAndValidateJSON = useCallback(async (inputJSON) => {
// // // // // // // // //     try {
// // // // // // // // //       // Parse the input (this also validates the JSON)
// // // // // // // // //       const parsed = JSON5.parse(inputJSON);
      
// // // // // // // // //       // Format the parsed JSON
// // // // // // // // //       const formatted = await prettier.format(JSON.stringify(parsed), {
// // // // // // // // //         parser: "json",
// // // // // // // // //         plugins: [parserBabel],
// // // // // // // // //       });

// // // // // // // // //       setOutput(formatted);
// // // // // // // // //       setIsValid(true);
// // // // // // // // //       setError('');
// // // // // // // // //     } catch (error) {
// // // // // // // // //       setOutput('');
// // // // // // // // //       setIsValid(false);
// // // // // // // // //       setError(error.message);
// // // // // // // // //     }
// // // // // // // // //   }, []);

// // // // // // // // //   const handleInputChange = useCallback((e) => {
// // // // // // // // //     setInput(e.target.value);
// // // // // // // // //   }, []);

// // // // // // // // //   const handleSubmit = useCallback((e) => {
// // // // // // // // //     e.preventDefault();
// // // // // // // // //     formatAndValidateJSON(input);
// // // // // // // // //   }, [input, formatAndValidateJSON]);

// // // // // // // // //   return (
// // // // // // // // //     <div className="json-formatter-validator">
// // // // // // // // //       <h1>JSON Formatter and Validator</h1>
// // // // // // // // //       <form onSubmit={handleSubmit}>
// // // // // // // // //         <textarea
// // // // // // // // //           value={input}
// // // // // // // // //           onChange={handleInputChange}
// // // // // // // // //           placeholder="Paste your JSON here..."
// // // // // // // // //           rows={10}
// // // // // // // // //         />
// // // // // // // // //         <button type="submit">Format and Validate</button>
// // // // // // // // //       </form>
// // // // // // // // //       {isValid ? (
// // // // // // // // //         <pre className="output">{output}</pre>
// // // // // // // // //       ) : (
// // // // // // // // //         <div className="error">{error}</div>
// // // // // // // // //       )}
// // // // // // // // //       <style jsx>{`
// // // // // // // // //         .json-formatter-validator {
// // // // // // // // //           font-family: Arial, sans-serif;
// // // // // // // // //           max-width: 800px;
// // // // // // // // //           margin: 0 auto;
// // // // // // // // //           padding: 20px;
// // // // // // // // //         }
// // // // // // // // //         textarea {
// // // // // // // // //           width: 100%;
// // // // // // // // //           margin-bottom: 10px;
// // // // // // // // //           padding: 10px;
// // // // // // // // //         }
// // // // // // // // //         button {
// // // // // // // // //           padding: 10px 20px;
// // // // // // // // //           background-color: #007bff;
// // // // // // // // //           color: white;
// // // // // // // // //           border: none;
// // // // // // // // //           cursor: pointer;
// // // // // // // // //         }
// // // // // // // // //         .output {
// // // // // // // // //           background-color: #f4f4f4;
// // // // // // // // //           padding: 10px;
// // // // // // // // //           white-space: pre-wrap;
// // // // // // // // //           word-wrap: break-word;
// // // // // // // // //         }
// // // // // // // // //         .error {
// // // // // // // // //           color: red;
// // // // // // // // //           margin-top: 10px;
// // // // // // // // //         }
// // // // // // // // //       `}</style>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default JSONFormatterValidator;
// // // // // // // // 'use client'
// // // // // // // // import React, { useState, useCallback } from 'react';
// // // // // // // // import JSON5 from 'json5';

// // // // // // // // const JSONFormatterValidator = () => {
// // // // // // // //   const [input, setInput] = useState('');
// // // // // // // //   const [output, setOutput] = useState('');
// // // // // // // //   const [isValid, setIsValid] = useState(true);
// // // // // // // //   const [error, setError] = useState('');

// // // // // // // //   const formatAndValidateJSON = useCallback((inputJSON) => {
// // // // // // // //     try {
// // // // // // // //       // Parse the input (this also validates the JSON)
// // // // // // // //       const parsed = JSON5.parse(inputJSON);
      
// // // // // // // //       // Format the parsed JSON
// // // // // // // //       const formatted = JSON.stringify(parsed, null, 2);

// // // // // // // //       setOutput(formatted);
// // // // // // // //       setIsValid(true);
// // // // // // // //       setError('');
// // // // // // // //     } catch (error) {
// // // // // // // //       setOutput('');
// // // // // // // //       setIsValid(false);
// // // // // // // //       setError(error.message);
// // // // // // // //     }
// // // // // // // //   }, []);

// // // // // // // //   const handleInputChange = useCallback((e) => {
// // // // // // // //     setInput(e.target.value);
// // // // // // // //   }, []);

// // // // // // // //   const handleSubmit = useCallback((e) => {
// // // // // // // //     e.preventDefault();
// // // // // // // //     formatAndValidateJSON(input);
// // // // // // // //   }, [input, formatAndValidateJSON]);

// // // // // // // //   return (
// // // // // // // //     <div className="json-formatter-validator">
// // // // // // // //       <h1>JSON Formatter and Validator</h1>
// // // // // // // //       <form onSubmit={handleSubmit}>
// // // // // // // //         <textarea
// // // // // // // //           value={input}
// // // // // // // //           onChange={handleInputChange}
// // // // // // // //           placeholder="Paste your JSON here..."
// // // // // // // //           rows={10}
// // // // // // // //         />
// // // // // // // //         <button type="submit">Format and Validate</button>
// // // // // // // //       </form>
// // // // // // // //       {isValid ? (
// // // // // // // //         <pre className="output">{output}</pre>
// // // // // // // //       ) : (
// // // // // // // //         <div className="error">{error}</div>
// // // // // // // //       )}
// // // // // // // //       <style jsx>{`
// // // // // // // //         .json-formatter-validator {
// // // // // // // //           font-family: Arial, sans-serif;
// // // // // // // //           max-width: 800px;
// // // // // // // //           margin: 0 auto;
// // // // // // // //           padding: 20px;
// // // // // // // //         }
// // // // // // // //         textarea {
// // // // // // // //           width: 100%;
// // // // // // // //           margin-bottom: 10px;
// // // // // // // //           padding: 10px;
// // // // // // // //         }
// // // // // // // //         button {
// // // // // // // //           padding: 10px 20px;
// // // // // // // //           background-color: #007bff;
// // // // // // // //           color: white;
// // // // // // // //           border: none;
// // // // // // // //           cursor: pointer;
// // // // // // // //         }
// // // // // // // //         .output {
// // // // // // // //           background-color: #f4f4f4;
// // // // // // // //           padding: 10px;
// // // // // // // //           white-space: pre-wrap;
// // // // // // // //           word-wrap: break-word;
// // // // // // // //         }
// // // // // // // //         .error {
// // // // // // // //           color: red;
// // // // // // // //           margin-top: 10px;
// // // // // // // //         }
// // // // // // // //       `}</style>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default JSONFormatterValidator;
// // // // // // // 'use client'

// // // // // // // import React, { useState, useCallback } from 'react';
// // // // // // // import JSON5 from 'json5';

// // // // // // // const JSONFormatterValidator = () => {
// // // // // // //   const [input, setInput] = useState('');
// // // // // // //   const [output, setOutput] = useState('');
// // // // // // //   const [isValid, setIsValid] = useState(true);
// // // // // // //   const [error, setError] = useState('');


// // // // // // //   const formatAndValidateJSON = useCallback((inputJSON) => {
// // // // // // //     try {
// // // // // // //       const parsed = JSON5.parse(inputJSON);
// // // // // // //       const formatted = JSON.stringify(parsed, null, 2);
// // // // // // //       setOutput(formatted);
// // // // // // //       setIsValid(true);
// // // // // // //       setError('');
// // // // // // //     } catch (error) {
// // // // // // //       setOutput('');
// // // // // // //       setIsValid(false);
// // // // // // //       setError(error.message);
// // // // // // //     }
// // // // // // //   }, []);

// // // // // // // //   const formatAndValidateJSON = useCallback((inputJSON) => {
// // // // // // // //     try {
// // // // // // // //       const parsed = JSON5.parse(inputJSON);
// // // // // // // //       const formatted = JSON.stringify(parsed, null, 2);
// // // // // // // //       setOutput(formatted);
// // // // // // // //       setIsValid(true);
// // // // // // // //       setError('');
// // // // // // // //     } catch (error) {
// // // // // // // //       setOutput('');
// // // // // // // //       setIsValid(false);
// // // // // // // //       setError(error.message);
// // // // // // // //     }
// // // // // // // //   }, []);

// // // // // // //   const handleInputChange = useCallback((e) => {
// // // // // // //     setInput(e.target.value);
// // // // // // //   }, []);

// // // // // // //   const handleSubmit = useCallback((e) => {
// // // // // // //     e.preventDefault();
// // // // // // //     formatAndValidateJSON(input);
// // // // // // //   }, [input, formatAndValidateJSON]);

// // // // // // //   const handleReset = useCallback(() => {
// // // // // // //     setInput('');
// // // // // // //     setOutput('');
// // // // // // //     setIsValid(true);
// // // // // // //     setError('');
// // // // // // //   }, []);

// // // // // // //   return (
// // // // // // //     <div className="json-formatter-validator">
// // // // // // //       <h1>JSON Formatter and Validator</h1>
// // // // // // //       <form onSubmit={handleSubmit}>
// // // // // // //         <textarea
// // // // // // //           value={input}
// // // // // // //           onChange={handleInputChange}
// // // // // // //           placeholder="Paste your JSON here..."
// // // // // // //           rows={10}
// // // // // // //         />
// // // // // // //         <div className="button-group">
// // // // // // //           <button type="submit">Format and Validate</button>
// // // // // // //           <button type="button" onClick={handleReset}>Reset</button>
// // // // // // //         </div>
// // // // // // //       </form>
// // // // // // //       {isValid ? (
// // // // // // //         <pre className="output">{output}</pre>
// // // // // // //       ) : (
// // // // // // //         <div className="error">{error}</div>
// // // // // // //       )}
// // // // // // //       <style jsx>{`
// // // // // // //         .json-formatter-validator {
// // // // // // //           font-family: Arial, sans-serif;
// // // // // // //           max-width: 800px;
// // // // // // //           margin: 0 auto;
// // // // // // //           padding: 20px;
// // // // // // //         }
// // // // // // //         textarea {
// // // // // // //           width: 100%;
// // // // // // //           margin-bottom: 10px;
// // // // // // //           padding: 10px;
// // // // // // //         }
// // // // // // //         .button-group {
// // // // // // //           display: flex;
// // // // // // //           gap: 10px;
// // // // // // //         }
// // // // // // //         button {
// // // // // // //           padding: 10px 20px;
// // // // // // //           background-color: #007bff;
// // // // // // //           color: white;
// // // // // // //           border: none;
// // // // // // //           cursor: pointer;
// // // // // // //         }
// // // // // // //         .output {
// // // // // // //           background-color: #f4f4f4;
// // // // // // //           padding: 10px;
// // // // // // //           white-space: pre-wrap;
// // // // // // //           word-wrap: break-word;
// // // // // // //         }
// // // // // // //         .error {
// // // // // // //           color: red;
// // // // // // //           margin-top: 10px;
// // // // // // //         }
// // // // // // //       `}</style>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default JSONFormatterValidator;
// // // // // // 'use client'
// // // // // // import React, { useState, useCallback } from 'react';
// // // // // // import JSON5 from 'json5';

// // // // // // const JSONFormatterValidator = () => {
// // // // // //   const [input, setInput] = useState('');
// // // // // //   const [output, setOutput] = useState('');
// // // // // //   const [isValid, setIsValid] = useState(true);
// // // // // //   const [error, setError] = useState('');
  
// // // // // //   const formatAndValidateJSON = useCallback((inputJSON) => {
// // // // // //     try {
// // // // // //       const parsed = JSON5.parse(inputJSON);
// // // // // //       const formatted = JSON.stringify(parsed, null, 2);
// // // // // //       setOutput(formatted);
// // // // // //       setIsValid(true);
// // // // // //       setError('');
// // // // // //     } catch (error) {
// // // // // //       setOutput('');
// // // // // //       setIsValid(false);
// // // // // //       setError(error.message);
// // // // // //     }
// // // // // //   }, []);

// // // // // //   const handleInputChange = useCallback((e) => {
// // // // // //     setInput(e.target.value);
// // // // // //   }, []);

// // // // // //   const handleSubmit = useCallback((e) => {
// // // // // //     e.preventDefault();
// // // // // //     formatAndValidateJSON(input);
// // // // // //   }, [input, formatAndValidateJSON]);

// // // // // //   const handleReset = useCallback(() => {
// // // // // //     setInput('');
// // // // // //     setOutput('');
// // // // // //     setIsValid(true);
// // // // // //     setError('');
// // // // // //   }, []);

// // // // // //   return (
// // // // // //     <div className="json-formatter-validator">
// // // // // //       <h1>JSON Formatter and Validator</h1>
// // // // // //       <form onSubmit={handleSubmit}>
// // // // // //         <textarea
// // // // // //           value={input}
// // // // // //           onChange={handleInputChange}
// // // // // //           placeholder="Paste your JSON here..."
// // // // // //           rows={10}
// // // // // //         />
// // // // // //         <div className="button-group">
// // // // // //           <button type="submit">Format and Validate</button>
// // // // // //           <button type="button" onClick={handleReset}>Reset</button>
// // // // // //         </div>
// // // // // //       </form>
// // // // // //       {isValid ? (
// // // // // //         <pre className="output">{output}</pre>
// // // // // //       ) : (
// // // // // //         <div className="error">{error}</div>
// // // // // //       )}
// // // // // //       <style jsx>{`
// // // // // //         .json-formatter-validator {
// // // // // //           font-family: Arial, sans-serif;
// // // // // //           max-width: 800px;
// // // // // //           margin: 0 auto;
// // // // // //           padding: 20px;
// // // // // //         }
// // // // // //         textarea {
// // // // // //           width: 100%;
// // // // // //           margin-bottom: 10px;
// // // // // //           padding: 10px;
// // // // // //         }
// // // // // //         .button-group {
// // // // // //           display: flex;
// // // // // //           gap: 10px;
// // // // // //         }
// // // // // //         button {
// // // // // //           padding: 10px 20px;
// // // // // //           background-color: #007bff;
// // // // // //           color: white;
// // // // // //           border: none;
// // // // // //           cursor: pointer;
// // // // // //         }
// // // // // //         .output {
// // // // // //           background-color: #f4f4f4;
// // // // // //           padding: 10px;
// // // // // //           white-space: pre-wrap;
// // // // // //           word-wrap: break-word;
// // // // // //         }
// // // // // //         .error {
// // // // // //           color: red;
// // // // // //           margin-top: 10px;
// // // // // //         }
// // // // // //       `}</style>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default JSONFormatterValidator;
// // // // // 'use client'
// // // // // import React, { useState, useCallback } from 'react';
// // // // // import jsonlint from 'jsonlint';

// // // // // const JSONFormatterValidator = () => {
// // // // //   const [input, setInput] = useState('');
// // // // //   const [output, setOutput] = useState('');
// // // // //   const [isValid, setIsValid] = useState(true);
// // // // //   const [error, setError] = useState('');
  
// // // // //   const formatAndValidateJSON = useCallback((inputJSON) => {
// // // // //     try {
// // // // //       const parsed = jsonlint.parse(inputJSON);
// // // // //       const formatted = JSON.stringify(parsed, null, 2);
// // // // //       setOutput(formatted);
// // // // //       setIsValid(true);
// // // // //       setError('');
// // // // //     } catch (error) {
// // // // //       setOutput('');
// // // // //       setIsValid(false);
// // // // //       setError(error.message);
// // // // //     }
// // // // //   }, []);

// // // // //   const handleInputChange = useCallback((e) => {
// // // // //     setInput(e.target.value);
// // // // //   }, []);

// // // // //   const handleSubmit = useCallback((e) => {
// // // // //     e.preventDefault();
// // // // //     formatAndValidateJSON(input);
// // // // //   }, [input, formatAndValidateJSON]);

// // // // //   const handleReset = useCallback(() => {
// // // // //     setInput('');
// // // // //     setOutput('');
// // // // //     setIsValid(true);
// // // // //     setError('');
// // // // //   }, []);

// // // // //   return (
// // // // //     <div>
// // // // //       <h1></h1>
// // // // //       <form onSubmit={handleSubmit}>
// // // // //         <textarea
// // // // //           value={input}
// // // // //           onChange={handleInputChange}
// // // // //           rows={10}
// // // // //         />
// // // // //         <div>
// // // // //           <button type="submit"></button>
// // // // //           <button type="button" onClick={handleReset}></button>
// // // // //         </div>
// // // // //       </form>
// // // // //       {isValid ? (
// // // // //         <pre>{output}</pre>
// // // // //       ) : (
// // // // //         <div>{error}</div>
// // // // //       )}
// // // // //       <style jsx>{`
// // // // //         div {
// // // // //           font-family: Arial, sans-serif;
// // // // //           max-width: 800px;
// // // // //           margin: 0 auto;
// // // // //           padding: 20px;
// // // // //         }
// // // // //         textarea {
// // // // //           width: 100%;
// // // // //           margin-bottom: 10px;
// // // // //           padding: 10px;
// // // // //         }
// // // // //         div {
// // // // //           display: flex;
// // // // //           gap: 10px;
// // // // //         }
// // // // //         button {
// // // // //           padding: 10px 20px;
// // // // //           background-color: #007bff;
// // // // //           color: white;
// // // // //           border: none;
// // // // //           cursor: pointer;
// // // // //         }
// // // // //         pre {
// // // // //           background-color: #f4f4f4;
// // // // //           padding: 10px;
// // // // //           white-space: pre-wrap;
// // // // //           word-wrap: break-word;
// // // // //         }
// // // // //         div {
// // // // //           color: red;
// // // // //           margin-top: 10px;
// // // // //         }
// // // // //       `}</style>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default JSONFormatterValidator;
// // // // 'use client'
// // // // import React, { useState } from 'react';
// // // // import jsonlint from 'jsonlint-mod';

// // // // const JSONFormatterValidator = () => {
// // // //   const [input, setInput] = useState('');
// // // //   const [output, setOutput] = useState('');
// // // //   const [error, setError] = useState('');



// // // //   const translateError = (error) => {
// // // //     const match = error.match(/Parse error on line (\d+):/);
// // // //     const lineNumber = match ? match[1] : 'unknown';
  
// // // //     if (error.includes("Expecting 'EOF', '}', ':', ',', ']'")) {
// // // //       return `Line ${lineNumber}: Missing punctuation. You might be missing a comma between properties or a closing bracket/brace.`;
// // // //     }
// // // //     if (error.includes("Unexpected string")) {
// // // //       return `Line ${lineNumber}: Unexpected string found. Ensure all property names are in double quotes and separated by commas.`;
// // // //     }
// // // //     if (error.includes("Unexpected token")) {
// // // //       const tokenMatch = error.match(/Unexpected token (\S+)/);
// // // //       const token = tokenMatch ? tokenMatch[1] : 'unknown';
// // // //       return `Line ${lineNumber}: Unexpected character '${token}' found. Check for misplaced punctuation or unquoted strings.`;
// // // //     }
// // // //     if (error.includes("Expecting 'STRING'")) {
// // // //       return `Line ${lineNumber}: Expected a property name (in double quotes) or a closing brace '}'.`;
// // // //     }
// // // //     if (error.includes("Unexpected number")) {
// // // //       return `Line ${lineNumber}: Unexpected number found. Ensure it's part of a property value and not misplaced.`;
// // // //     }
// // // //     if (error.includes("Unexpected '}'")) {
// // // //       return `Line ${lineNumber}: Unexpected closing brace. You might have an extra closing brace or a missing opening brace.`;
// // // //     }
  
// // // //     return `Line ${lineNumber}: ${error}. Please check this line for syntax errors.`;
// // // //   };

// // // // //   const translateError = (error) => {
// // // // //     if (error.includes("Expecting 'EOF', '}', ':', ',', ']'")) {
// // // // //       return "There's likely a missing comma or closing bracket. Check the line mentioned for syntax errors.";
// // // // //     }
// // // // //     if (error.includes("Unexpected string")) {
// // // // //       return "Found an unexpected string. Make sure all property names are in double quotes.";
// // // // //     }
// // // // //     if (error.includes("Unexpected token")) {
// // // // //       return "Found an unexpected character. Check for misplaced commas or quotes.";
// // // // //     }
// // // // //     return "There's a syntax error in your JSON. Please check for missing commas, quotes, or brackets.";
// // // // //   };

// // // //   const handleValidateFormat = () => {
// // // //     try {
// // // //       const parsed = jsonlint.parse(input);
// // // //       const formatted = JSON.stringify(parsed, null, 2);
// // // //       setOutput(formatted);
// // // //       setError('');
// // // //     } catch (err) {
// // // //       setError(translateError(err.message));
// // // //       setOutput('');
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <textarea
// // // //         value={input}
// // // //         onChange={(e) => setInput(e.target.value)}
// // // //         rows={10}
// // // //         cols={50}
// // // //       />
// // // //       <br />
// // // //       <button onClick={handleValidateFormat}>Format and Validate</button>
// // // //       {error && <div style={{color: 'red'}}>{error}</div>}
// // // //       {output && <pre>{output}</pre>}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default JSONFormatterValidator;
// // // 'use client'
// // // import React, { useState, useRef, useEffect } from 'react';
// // // import jsonlint from 'jsonlint-mod';

// // // const JSONFormatterValidator = () => {
// // //   const [input, setInput] = useState('');
// // //   const [output, setOutput] = useState('');
// // //   const [error, setError] = useState('');
// // //   const textareaRef = useRef(null);

// // //   useEffect(() => {
// // //     if (textareaRef.current) {
// // //       const lineNumbers = input.split('\n').map((_, index) => index + 1).join('\n');
// // //       textareaRef.current.style.backgroundImage = `linear-gradient(transparent 50%, #f0f0f0 50%), linear-gradient(90deg, #999 10px, transparent 10px)`;
// // //       textareaRef.current.style.backgroundSize = `100% 3rem, 3rem 3rem`;
// // //       textareaRef.current.style.backgroundPosition = `0 0, 0 0.8rem`;
// // //       textareaRef.current.style.backgroundRepeat = `repeat-y`;
// // //       textareaRef.current.style.backgroundAttachment = `local`;
// // //       textareaRef.current.style.paddingLeft = '3.5rem';
// // //       textareaRef.current.style.lineHeight = '1.5rem';
// // //     }
// // //   }, [input]);

// // //   const translateError = (error) => {
// // //     const match = error.match(/Parse error on line (\d+):/);
// // //     const lineNumber = match ? match[1] : 'unknown';

// // //     if (error.includes("Expecting 'EOF', '}', ':', ',', ']'")) {
// // //       return `Error on line ${lineNumber}: Missing punctuation. You might be missing a comma between properties or a closing bracket/brace.`;
// // //     }
// // //     if (error.includes("Unexpected string")) {
// // //       return `Error on line ${lineNumber}: Unexpected string found. Ensure all property names are in double quotes and separated by commas.`;
// // //     }
// // //     if (error.includes("Unexpected token")) {
// // //       const tokenMatch = error.match(/Unexpected token (\S+)/);
// // //       const token = tokenMatch ? tokenMatch[1] : 'unknown';
// // //       return `Error on line ${lineNumber}: Unexpected character '${token}' found. Check for misplaced punctuation or unquoted strings.`;
// // //     }
// // //     if (error.includes("Expecting 'STRING'")) {
// // //       return `Error on line ${lineNumber}: Expected a property name (in double quotes) or a closing brace '}'.`;
// // //     }
// // //     if (error.includes("Unexpected number")) {
// // //       return `Error on line ${lineNumber}: Unexpected number found. Ensure it's part of a property value and not misplaced.`;
// // //     }
// // //     if (error.includes("Unexpected '}'")) {
// // //       return `Error on line ${lineNumber}: Unexpected closing brace. You might have an extra closing brace or a missing opening brace.`;
// // //     }

// // //     return `Error on line ${lineNumber}: ${error}. Please check this line for syntax errors.`;
// // //   };

// // //   const handleValidateFormat = () => {
// // //     try {
// // //       const parsed = jsonlint.parse(input);
// // //       const formatted = JSON.stringify(parsed, null, 2);
// // //       setOutput(formatted);
// // //       setError('');
// // //     } catch (err) {
// // //       setError(translateError(err.message));
// // //       setOutput('');
// // //     }
// // //   };

// // //   const handleReset = () => {
// // //     setInput('');
// // //     setOutput('');
// // //     setError('');
// // //   };

// // //   return (
// // //     <div>
// // //       <textarea
// // //         ref={textareaRef}
// // //         value={input}
// // //         onChange={(e) => setInput(e.target.value)}
// // //         rows={10}
// // //         cols={50}
// // //         style={{
// // //           fontFamily: 'monospace',
// // //           fontSize: '14px',
// // //           whiteSpace: 'pre',
// // //           overflowWrap: 'normal',
// // //           overflowX: 'scroll',
// // //         }}
// // //       />
// // //       <br />
// // //       <button onClick={handleValidateFormat}>Format and Validate</button>
// // //       <button onClick={handleReset}>Reset</button>
// // //       {error && <div style={{color: 'red'}}>{error}</div>}
// // //       {output && <pre>{output}</pre>}
// // //     </div>
// // //   );
// // // };

// // // export default JSONFormatterValidator;
// // 'use client'
// // import React, { useState } from 'react';
// // import jsonlint from 'jsonlint-mod';

// // const JSONFormatterValidator = () => {
// //   const [input, setInput] = useState('');
// //   const [output, setOutput] = useState('');
// //   const [error, setError] = useState('');

// //   const translateError = (error) => {
// //     if (error.includes("Expecting 'EOF', '}', ':', ',', ']'")) {
// //       return "Missing punctuation. You might be missing a comma between properties or a closing bracket/brace.";
// //     }
// //     if (error.includes("Unexpected string")) {
// //       return "Unexpected string found. Ensure all property names are in double quotes and separated by commas.";
// //     }
// //     if (error.includes("Unexpected token")) {
// //       const tokenMatch = error.match(/Unexpected token (\S+)/);
// //       const token = tokenMatch ? tokenMatch[1] : 'unknown';
// //       return `Unexpected character '${token}' found. Check for misplaced punctuation or unquoted strings.`;
// //     }
// //     if (error.includes("Expecting 'STRING'")) {
// //       return "Expected a property name (in double quotes) or a closing brace '}'.";
// //     }
// //     if (error.includes("Unexpected number")) {
// //       return "Unexpected number found. Ensure it's part of a property value and not misplaced.";
// //     }
// //     if (error.includes("Unexpected '}'")) {
// //       return "Unexpected closing brace. You might have an extra closing brace or a missing opening brace.";
// //     }

// //     return `JSON syntax error: ${error}`;
// //   };

// //   const handleValidateFormat = () => {
// //     try {
// //       const parsed = jsonlint.parse(input);
// //       const formatted = JSON.stringify(parsed, null, 2);
// //       setOutput(formatted);
// //       setError('');
// //     } catch (err) {
// //       setError(translateError(err.message));
// //       setOutput('');
// //     }
// //   };

// //   const handleReset = () => {
// //     setInput('');
// //     setOutput('');
// //     setError('');
// //   };

// //   return (
// //     <div>
// //       <textarea
// //         value={input}
// //         onChange={(e) => setInput(e.target.value)}
// //         rows={10}
// //         cols={50}
// //       />
// //       <br />
// //       <button onClick={handleValidateFormat}>Format and Validate</button>
// //       <button onClick={handleReset}>Reset</button>
// //       {error && <div style={{color: 'red'}}>{error}</div>}
// //       {output && <pre>{output}</pre>}
// //     </div>
// //   );
// // };

// // export default JSONFormatterValidator;
// 'use client'
// import React, { useState, useRef, useEffect } from 'react';
// import jsonlint from 'jsonlint-mod';

// const JSONFormatterValidator = () => {
//   const [input, setInput] = useState('');
//   const [output, setOutput] = useState('');
//   const [error, setError] = useState('');
//   const [inputLineCount, setInputLineCount] = useState(1);
//   const [outputLineCount, setOutputLineCount] = useState(1);
//   const textareaRef = useRef(null);

//   useEffect(() => {
//     updateInputLineCount();
//   }, [input]);

//   useEffect(() => {
//     updateOutputLineCount();
//   }, [output]);

//   const updateInputLineCount = () => {
//     const lines = input.split('\n').length;
//     setInputLineCount(lines);
//   };

//   const updateOutputLineCount = () => {
//     const lines = output.split('\n').length;
//     setOutputLineCount(lines);
//   };

//   const translateError = (error) => {
//     if (error.includes("Expecting 'EOF', '}', ':', ',', ']'")) {
//       return "Missing punctuation. You might be missing a comma between properties or a closing bracket/brace.";
//     }
//     if (error.includes("Unexpected string")) {
//       return "Unexpected string found. Ensure all property names are in double quotes and separated by commas.";
//     }
//     if (error.includes("Unexpected token")) {
//       const tokenMatch = error.match(/Unexpected token (\S+)/);
//       const token = tokenMatch ? tokenMatch[1] : 'unknown';
//       return `Unexpected character '${token}' found. Check for misplaced punctuation or unquoted strings.`;
//     }
//     if (error.includes("Expecting 'STRING'")) {
//       return "Expected a property name (in double quotes) or a closing brace '}'.";
//     }
//     if (error.includes("Unexpected number")) {
//       return "Unexpected number found. Ensure it's part of a property value and not misplaced.";
//     }
//     if (error.includes("Unexpected '}'")) {
//       return "Unexpected closing brace. You might have an extra closing brace or a missing opening brace.";
//     }
//     return `JSON syntax error: ${error}`;
//   };

//   const handleValidateFormat = () => {
//     try {
//       const parsed = jsonlint.parse(input);
//       const formatted = JSON.stringify(parsed, null, 2);
//       setOutput(formatted);
//       setError('');
//     } catch (err) {
//       setError(translateError(err.message));
//       setOutput('');
//     }
//   };

//   const handleReset = () => {
//     setInput('');
//     setOutput('');
//     setError('');
//     setInputLineCount(1);
//     setOutputLineCount(1);
//   };

//   const renderLineNumbers = (count) => {
//     return Array.from({ length: count }, (_, i) => (
//       <div key={i + 1}>{i + 1}</div>
//     ));
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column' }}>
//       <div style={{ display: 'flex' }}>
//         <div style={{ 
//           marginRight: '10px', 
//           paddingRight: '5px', 
//           borderRight: '1px solid #ccc',
//           textAlign: 'right',
//           userSelect: 'none',
//           color: '#999'
//         }}>
//           {renderLineNumbers(inputLineCount)}
//         </div>
//         <textarea
//           ref={textareaRef}
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           rows={10}
//           cols={50}
//           style={{ resize: 'vertical' }}
//         />
//       </div>
//       <div>
//         <button onClick={handleValidateFormat}>Format and Validate</button>
//         <button onClick={handleReset}>Reset</button>
//       </div>
//       {error && <div style={{color: 'red'}}>{error}</div>}
//       {output && (
//         <div style={{ display: 'flex' }}>
//           <div style={{ 
//             marginRight: '10px', 
//             paddingRight: '5px', 
//             borderRight: '1px solid #ccc',
//             textAlign: 'right',
//             userSelect: 'none',
//             color: '#999'
//           }}>
//             {renderLineNumbers(outputLineCount)}
//           </div>
//           <pre>{output}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JSONFormatterValidator;
'use client'
import React, { useState, useRef, useEffect } from 'react';
import jsonlint from 'jsonlint-mod';
import styles from './JSONFormatterValidator.module.css';

// const LineNumbers = ({ content, textareaRef }) => {
//   const [lineCount, setLineCount] = useState(1);

//   useEffect(() => {
//     if (textareaRef.current) {
//       const lineHeight = parseFloat(getComputedStyle(textareaRef.current).lineHeight);
//       const lines = Math.floor(textareaRef.current.scrollHeight / lineHeight);
//       setLineCount(lines);
//     }
//   }, [content, textareaRef]);

//   return (
//     <div className={styles.lineNumbers}>
//       {Array.from({ length: lineCount }, (_, i) => (
//         <div key={i + 1}>{i + 1}</div>
//       ))}
//     </div>
//   );
// };


const LineNumbers = ({ content }) => {
    const lines = content.split('\n');
    return (
      <div className={styles.lineNumbers}>
        {lines.map((_, index) => (
          <div key={index + 1}>{index + 1}</div>
        ))}
      </div>
    );
  };

  
const JSONFormatterValidator = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  
      const translateError = (error) => {
    if (error.includes("Expecting 'EOF', '}', ':', ',', ']'")) {
      return "Missing punctuation. You might be missing a comma between properties or a closing bracket/brace.";
    }
    if (error.includes("Unexpected string")) {
      return "Unexpected string found. Ensure all property names are in double quotes and separated by commas.";
    }
    if (error.includes("Unexpected token")) {
      const tokenMatch = error.match(/Unexpected token (\S+)/);
      const token = tokenMatch ? tokenMatch[1] : 'unknown';
      return `Unexpected character '${token}' found. Check for misplaced punctuation or unquoted strings.`;
    }
    if (error.includes("Expecting 'STRING'")) {
      return "Expected a property name (in double quotes) or a closing brace '}'.";
    }
    if (error.includes("Unexpected number")) {
      return "Unexpected number found. Ensure it's part of a property value and not misplaced.";
    }
    if (error.includes("Unexpected '}'")) {
      return "Unexpected closing brace. You might have an extra closing brace or a missing opening brace.";
    }
    return `JSON syntax error: ${error}`;
  };
  

  const handleValidateFormat = () => {
    try {
      const parsed = jsonlint.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  const handleReset = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className={styles.jsonFormatter}>
      <div className={styles.textareaContainer}>
        <LineNumbers content={input} textareaRef={textareaRef} />
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={10}
          cols={50}
        />
      </div>
      <div>
        <button onClick={handleValidateFormat}>Format and Validate</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {output && (
        <div className={styles.outputContainer}>
          <LineNumbers content={output} textareaRef={textareaRef} />
          <pre className={styles.output}>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default JSONFormatterValidator;