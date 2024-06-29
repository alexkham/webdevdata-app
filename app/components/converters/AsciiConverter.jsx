// // // 'use client'
// // // import React, { useState } from 'react';

// // // const AsciiConverter = () => {
// // //   const [input, setInput] = useState('');
// // //   const [decimal, setDecimal] = useState('');
// // //   const [binary, setBinary] = useState('');
// // //   const [octal, setOctal] = useState('');
// // //   const [hexadecimal, setHexadecimal] = useState('');

// // //   const handleInputChange = (value, base) => {
// // //     let decimalValue = parseInt(value, base);
// // //     if (isNaN(decimalValue)) {
// // //       setDecimal('');
// // //       setBinary('');
// // //       setOctal('');
// // //       setHexadecimal('');
// // //       return;
// // //     }

// // //     setDecimal(decimalValue.toString(10));
// // //     setBinary(decimalValue.toString(2));
// // //     setOctal(decimalValue.toString(8));
// // //     setHexadecimal(decimalValue.toString(16).toUpperCase());
// // //   };

// // //   return (
// // //     <div>
// // //       <h1>ASCII Converter</h1>
// // //       <input
// // //         type="text"
// // //         placeholder="Enter text"
// // //         onChange={(e) => handleInputChange(e.target.value.charCodeAt(0) || '', 10)}
// // //       />
// // //       <input
// // //         type="text"
// // //         placeholder="Decimal"
// // //         value={decimal}
// // //         onChange={(e) => handleInputChange(e.target.value, 10)}
// // //       />
// // //       <input
// // //         type="text"
// // //         placeholder="Binary"
// // //         value={binary}
// // //         onChange={(e) => handleInputChange(e.target.value, 2)}
// // //       />
// // //       <input
// // //         type="text"
// // //         placeholder="Octal"
// // //         value={octal}
// // //         onChange={(e) => handleInputChange(e.target.value, 8)}
// // //       />
// // //       <input
// // //         type="text"
// // //         placeholder="Hexadecimal"
// // //         value={hexadecimal}
// // //         onChange={(e) => handleInputChange(e.target.value, 16)}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default AsciiConverter;
// // 'use client';
// // import React, { useState } from 'react';

// // const AsciiConverter = () => {
// //   const [input, setInput] = useState('');
// //   const [decimal, setDecimal] = useState('');
// //   const [binary, setBinary] = useState('');
// //   const [octal, setOctal] = useState('');
// //   const [hexadecimal, setHexadecimal] = useState('');
// //   const [base64, setBase64] = useState('');

// //   const handleInputChange = (value) => {
// //     setInput(value);
// //     const code = value.charCodeAt(0) || '';
// //     updateConversions(code, value);
// //   };

// //   const updateConversions = (decimalValue, fullString) => {
// //     if (decimalValue === '') {
// //       setDecimal('');
// //       setBinary('');
// //       setOctal('');
// //       setHexadecimal('');
// //       setBase64('');
// //       return;
// //     }
// //     setDecimal(decimalValue.toString(10));
// //     setBinary(decimalValue.toString(2));
// //     setOctal(decimalValue.toString(8));
// //     setHexadecimal(decimalValue.toString(16).toUpperCase());
// //     setBase64(btoa(fullString)); // Convert the whole string to Base64
// //   };

// //   const reset = () => {
// //     setInput('');
// //     setDecimal('');
// //     setBinary('');
// //     setOctal('');
// //     setHexadecimal('');
// //     setBase64('');
// //   };

// //   return (
// //     <div>
// //       <h1>ASCII Converter</h1>
// //       <label>Text Input:</label>
// //       <input
// //         type="text"
// //         placeholder="Enter text"
// //         value={input}
// //         onChange={(e) => handleInputChange(e.target.value)}
// //       />
// //       <label>Decimal:</label>
// //       <input
// //         type="text"
// //         placeholder="Decimal"
// //         value={decimal}
// //         readOnly
// //       />
// //       <label>Binary:</label>
// //       <input
// //         type="text"
// //         placeholder="Binary"
// //         value={binary}
// //         readOnly
// //       />
// //       <label>Octal:</label>
// //       <input
// //         type="text"
// //         placeholder="Octal"
// //         value={octal}
// //         readOnly
// //       />
// //       <label>Hexadecimal:</label>
// //       <input
// //         type="text"
// //         placeholder="Hexadecimal"
// //         value={hexadecimal}
// //         readOnly
// //       />
// //       <label>Base64:</label>
// //       <input
// //         type="text"
// //         placeholder="Base64"
// //         value={base64}
// //         readOnly
// //       />
// //       <button onClick={reset}>Reset</button>
// //     </div>
// //   );
// // };

// // export default AsciiConverter;
// 'use client';
// import React, { useState } from 'react';

// const AsciiConverter = () => {
//   const [input, setInput] = useState('');
//   const [output, setOutput] = useState({
//     asciiValues: '',
//     binary: '',
//     octal: '',
//     hexadecimal: '',
//     base64: ''
//   });

//   const handleInputChange = (value) => {
//     setInput(value);
//     processConversions(value);
//   };

//   const processConversions = (value) => {
//     // Reset outputs first
//     setOutput({
//       asciiValues: '',
//       binary: '',
//       octal: '',
//       hexadecimal: '',
//       base64: ''
//     });

//     // Process ASCII values for the whole string
//     const asciiValues = value.split('').map(char => char.charCodeAt(0)).join(' ');
//     const base64Value = btoa(value);

//     // Attempt to interpret the input as a number for binary, octal, and hexadecimal conversions
//     const numericValue = parseInt(value);
//     const isNumeric = !isNaN(numericValue);

//     setOutput({
//       asciiValues: asciiValues,
//       binary: isNumeric ? numericValue.toString(2) : '',
//       octal: isNumeric ? numericValue.toString(8) : '',
//       hexadecimal: isNumeric ? numericValue.toString(16).toUpperCase() : '',
//       base64: base64Value
//     });
//   };

//   const reset = () => {
//     setInput('');
//     setOutput({
//       asciiValues: '',
//       binary: '',
//       octal: '',
//       hexadecimal: '',
//       base64: ''
//     });
//   };

//   return (
//     <div>
//       <h1>ASCII Converter</h1>
//       <label>Input:</label>
//       <input
//         type="text"
//         placeholder="Enter text or number"
//         value={input}
//         onChange={(e) => handleInputChange(e.target.value)}
//       />
//       <label>ASCII Values:</label>
//       <input
//         type="text"
//         placeholder="ASCII Values"
//         value={output.asciiValues}
//         readOnly
//       />
//       <label>Binary:</label>
//       <input
//         type="text"
//         placeholder="Binary"
//         value={output.binary}
//         readOnly
//       />
//       <label>Octal:</label>
//       <input
//         type="text"
//         placeholder="Octal"
//         value={output.octal}
//         readOnly
//       />
//       <label>Hexadecimal:</label>
//       <input
//         type="text"
//         placeholder="Hexadecimal"
//         value={output.hexadecimal}
//         readOnly
//       />
//       <label>Base64:</label>
//       <input
//         type="text"
//         placeholder="Base64"
//         value={output.base64}
//         readOnly
//       />
//       <button onClick={reset}>Reset</button>
//     </div>
//   );
// };

// export default AsciiConverter;
'use client';
import React, { useState, useCallback } from 'react';

const AsciiConverter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState({
    asciiValues: '',
    binary: '',
    octal: '',
    hexadecimal: '',
    base64: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = useCallback((value) => {
    setInput(value);
    processConversions(value);
  }, []);

  const processConversions = useCallback((value) => {
    setError('');
    setOutput({
      asciiValues: '',
      binary: '',
      octal: '',
      hexadecimal: '',
      base64: ''
    });

    if (value === '') return;

    try {
      // ASCII values for the whole string
      const asciiValues = value.split('').map(char => char.charCodeAt(0)).join(' ');

      // Base64 encoding that handles Unicode
      const base64Value = btoa(unescape(encodeURIComponent(value)));

      // Binary, octal, and hexadecimal for each character
      const binary = value.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      const octal = value.split('').map(char => char.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');
      const hexadecimal = value.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join(' ');

      setOutput({
        asciiValues,
        binary,
        octal,
        hexadecimal,
        base64: base64Value
      });
    } catch (err) {
      setError('An error occurred during conversion. Please check your input.');
    }
  }, []);

  const reset = useCallback(() => {
    setInput('');
    setOutput({
      asciiValues: '',
      binary: '',
      octal: '',
      hexadecimal: '',
      base64: ''
    });
    setError('');
  }, []);

  return (
    <div className="ascii-converter">
      <h1>ASCII Converter</h1>
      <div className="input-group">
        <label htmlFor="input">Input:</label>
        <input
          id="input"
          type="text"
          placeholder="Enter text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          aria-describedby="inputHelp"
        />
        <small id="inputHelp">Enter text to convert to various formats</small>
      </div>
      {error && <div className="error" role="alert">{error}</div>}
      <div className="output-group">
        <OutputField label="ASCII Values" value={output.asciiValues} />
        <OutputField label="Binary" value={output.binary} />
        <OutputField label="Octal" value={output.octal} />
        <OutputField label="Hexadecimal" value={output.hexadecimal} />
        <OutputField label="Base64" value={output.base64} />
      </div>
      <button onClick={reset} className="reset-button">Reset</button>
    </div>
  );
};

const OutputField = ({ label, value }) => (
  <div className="output-field">
    <label>{label}:</label>
    <input type="text" value={value} readOnly aria-label={`${label} output`} />
  </div>
);

export default AsciiConverter;