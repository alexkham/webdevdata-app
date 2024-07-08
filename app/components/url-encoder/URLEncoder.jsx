'use client'
import { useState } from 'react';

 function URLEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const validateURL = (str) => {
    if (!str.trim()) {
      throw new Error('Input cannot be empty');
    }
    try {
      new URL(str);
      return true;
    } catch {
      throw new Error('Invalid URL');
    }
  };

  const encodeURL = () => {
    try {
      validateURL(input);
      setOutput(encodeURIComponent(input));
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  const decodeURL = () => {
    try {
      // For decoding, we don't validate as URL because the input is encoded
      if (!input.trim()) {
        throw new Error('Input cannot be empty');
      }
      const decoded = decodeURIComponent(input);
      // Validate the decoded string is a valid URL
      validateURL(decoded);
      setOutput(decoded);
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  return (
    <div>
      <h1>URL Encoder/Decoder</h1>
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setError('');
        }}
        placeholder="Enter URL here"
      />
      <button onClick={encodeURL}>Encode</button>
      <button onClick={decodeURL}>Decode</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {output && (
        <div>
          <h2>Result:</h2>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
}
export default URLEncoder;