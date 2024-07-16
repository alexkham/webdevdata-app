'use client'

import { useState } from 'react';
import styles from './JsonConverter.module.css';

export default function YamlJsonConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [conversionType, setConversionType] = useState('yaml2json');
  const [copyText, setCopyText] = useState('Copy');
  const [selectedFileName, setSelectedFileName] = useState('');

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setInput(e.target.result);
    };
    reader.readAsText(file);
  }
};

  const handleConvert = async () => {
    if (!input.trim()) {
        setOutput('Error: Input is empty. Please enter some text to convert.');
        return;
      }

    try {
      const response = await fetch('/api/convert-yaml-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: input, conversionType }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setOutput(data.result);
    } catch (error) {
      console.error('Conversion failed:', error);
      setOutput('Conversion failed: ' + error.message);
    }
  };

  const handleReset = () => {
    setInput('');
    setOutput('');
    setSelectedFileName('')
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopyText('Copied!');
    setTimeout(() => setCopyText('Copy'), 5000);
  };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setInput(e.target.result);
//       };
//       reader.readAsText(file);
//     }
//   };

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <textarea
          className={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter ${conversionType === 'yaml2json' ? 'YAML' : 'JSON'} here`}
        />
      </div>
      <div className={styles.controlsColumn}>
        <select
          className={styles.select}
          style={{marginBottom:'30px'}}
          value={conversionType}
          onChange={(e) => setConversionType(e.target.value)}
        >
          <option value="yaml2json">YAML to JSON</option>
          <option value="json2yaml">JSON to YAML</option>
        </select>
        <br></br>
        <br></br>
       
        <button className={styles.convertButton} onClick={handleConvert}>Convert</button>
        <button className={styles.resetButton} onClick={handleReset}>Reset</button>
        {/* <input
          type="file"
          onChange={handleFileUpload}
          accept=".yaml,.yml,.json"
          className={styles.fileInput}
        /> */}
        <div className={styles.fileInputContainer}>
        <input
            type="file"
            id="file-upload"
            onChange={handleFileUpload}
            accept=".yaml,.yml,.json"
            className={styles.fileInput}
        />
        <label htmlFor="file-upload" className={styles.fileInputLabel}>
            Choose File
        </label>
        {selectedFileName && <div className={styles.fileName}>{selectedFileName}</div>}
        </div>
        </div>
      <div className={styles.column}>
        <div className={styles.outputWrapper}>
          <textarea
            className={styles.textarea}
            value={output}
            readOnly
            placeholder="Converted output will appear here"
          />
          <button className={styles.copyButton} onClick={handleCopy}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            {copyText}
          </button>
        </div>
      </div>
    </div>
  );
}