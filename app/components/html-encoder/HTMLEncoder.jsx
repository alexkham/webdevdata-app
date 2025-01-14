'use client'
import { useState } from 'react';
import styles from './HTMLEncoder.module.css';

function HTMLEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copyText, setCopyText] = useState('Copy');

  const MAX_INPUT_LENGTH = 50000;

  const validateInput = (str) => {
    if (!str.trim()) {
      throw new Error('Input cannot be empty');
    }
    if (str.length > MAX_INPUT_LENGTH) {
      throw new Error(`Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
    }
  };

  const encodeHTML = () => {
    try {
      validateInput(input);
      const encoded = input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
      setOutput(encoded);
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  const decodeHTML = () => {
    try {
      validateInput(input);
      const decoded = input
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
      
      if (decoded === input) {
        throw new Error('Input does not contain any encoded HTML entities');
      }
      
      setOutput(decoded);
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  const resetFields = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopyText('Copied!');
      setTimeout(() => setCopyText('Copy'), 5000);
    }).catch(() => {
      setError('Failed to copy to clipboard');
    });
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        {/* <h1 className={styles.title}>HTML Encoder/Decoder</h1> */}
        <div className={styles.columnsContainer}>
          <div className={styles.column}>
            <h2 className={styles.subtitle}>Input</h2>
            <textarea
              className={styles.inputArea}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
                if (e.target.value.length > MAX_INPUT_LENGTH) {
                  setError(`Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
                }
              }}
              placeholder="Enter HTML here"
            />
            <div className={styles.charCount}>
              {input.length} / {MAX_INPUT_LENGTH}
              {input.length > MAX_INPUT_LENGTH * 0.9 && 
                <span className={styles.warning}> (Approaching limit)</span>}
            </div>
            <div className={styles.buttonGroup}>
              <div  className={styles.buttonContainer}>
              <button className={`${styles.button} ${styles.convertButton}`} onClick={encodeHTML}>Encode</button>
              <button className={`${styles.button} ${styles.convertButton}`} onClick={decodeHTML}>Decode</button>
              <button className={`${styles.button} ${styles.resetButton}`} onClick={resetFields}>Reset</button>
              </div>
              {error && <div className={styles.errorMessage}>{error}</div>}
            </div>
          </div>
          <div className={styles.column}>
            <h2 className={styles.subtitle}>Output</h2>
            <div className={styles.outputContainer}>
            {/* {output && ( */}
                <button className={styles.copyButton} onClick={copyToClipboard}>{copyText}</button>
              {/* )} */}
              <p className={styles.text}>{output}</p>
              {/* {output && (
                <button className={styles.copyButton} onClick={copyToClipboard}>{copyText}</button>
              )} */}
            </div>
          </div>
        </div>
        {/* {error && <div className={styles.errorMessage}>{error}</div>} */}
      </div>
    </div>
  );
}

export default HTMLEncoder;