'use client'
import { useState } from 'react';

export default function JsonConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [conversionType, setConversionType] = useState('json');

  const handleConvert = async () => {
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: input, from: conversionType }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setOutput(data.result);
    } catch (error) {
      console.error('Conversion failed:', error);
      setOutput('Conversion failed: ' + error.message);
    }
  };

  return (
    <div>
      <select 
        value={conversionType} 
        onChange={(e) => setConversionType(e.target.value)}
      >
        <option value="json">JSON to XML</option>
        <option value="xml">XML to JSON</option>
      </select>
      <br /><br />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Enter ${conversionType.toUpperCase()} here`}
        rows={10}
        cols={50}
      />
      <br />
      <button onClick={handleConvert}>Convert</button>
      <br />
      <textarea
        value={output}
        readOnly
        placeholder="Converted output will appear here"
        rows={10}
        cols={50}
      />
    </div>
  );
}