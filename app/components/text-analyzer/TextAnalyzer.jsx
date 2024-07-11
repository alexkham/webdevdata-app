// // // // // // // // // // 'use client'
// // // // // // // // // // import React, { useState, useEffect } from 'react';

// // // // // // // // // // const TextAnalyzer = () => {
// // // // // // // // // //   const [text, setText] = useState('');
// // // // // // // // // //   const [stats, setStats] = useState({
// // // // // // // // // //     wordCount: 0,
// // // // // // // // // //     charCount: 0,
// // // // // // // // // //     charCountNoSpaces: 0,
// // // // // // // // // //     sentenceCount: 0,
// // // // // // // // // //     paragraphCount: 0,
// // // // // // // // // //     readingTime: 0,
// // // // // // // // // //     speakingTime: 0,
// // // // // // // // // //     avgWordLength: 0,
// // // // // // // // // //     longestWord: '',
// // // // // // // // // //   });

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     analyzeText(text);
// // // // // // // // // //   }, [text]);

// // // // // // // // // //   const analyzeText = (inputText) => {
// // // // // // // // // //     const words = inputText.trim().split(/\s+/);
// // // // // // // // // //     const sentences = inputText.split(/[.!?]+/);
// // // // // // // // // //     const paragraphs = inputText.split(/\n\s*\n/);
// // // // // // // // // //     const charCountNoSpaces = inputText.replace(/\s/g, '').length;
// // // // // // // // // //     const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
// // // // // // // // // //     const longestWord = words.reduce((longest, word) => 
// // // // // // // // // //       word.length > longest.length ? word : longest, '');

// // // // // // // // // //     setStats({
// // // // // // // // // //       wordCount: words.length,
// // // // // // // // // //       charCount: inputText.length,
// // // // // // // // // //       charCountNoSpaces: charCountNoSpaces,
// // // // // // // // // //       sentenceCount: sentences.length,
// // // // // // // // // //       paragraphCount: paragraphs.length,
// // // // // // // // // //       readingTime: Math.ceil(words.length / 200), // Assuming 200 words per minute
// // // // // // // // // //       speakingTime: Math.ceil(words.length / 130), // Assuming 130 words per minute
// // // // // // // // // //       avgWordLength: words.length ? (totalWordLength / words.length).toFixed(2) : 0,
// // // // // // // // // //       longestWord: longestWord,
// // // // // // // // // //     });
// // // // // // // // // //   };

// // // // // // // // // //   return (
// // // // // // // // // //     <div>
// // // // // // // // // //       <textarea
// // // // // // // // // //         rows="10"
// // // // // // // // // //         cols="50"
// // // // // // // // // //         value={text}
// // // // // // // // // //         onChange={(e) => setText(e.target.value)}
// // // // // // // // // //         placeholder="Enter your text here..."
// // // // // // // // // //       />
// // // // // // // // // //       <div>
// // // // // // // // // //         <h3>Text Analysis:</h3>
// // // // // // // // // //         <p>Word Count: {stats.wordCount}</p>
// // // // // // // // // //         <p>Character Count: {stats.charCount}</p>
// // // // // // // // // //         <p>Character Count (no spaces): {stats.charCountNoSpaces}</p>
// // // // // // // // // //         <p>Sentence Count: {stats.sentenceCount}</p>
// // // // // // // // // //         <p>Paragraph Count: {stats.paragraphCount}</p>
// // // // // // // // // //         <p>Estimated Reading Time: {stats.readingTime} minute(s)</p>
// // // // // // // // // //         <p>Estimated Speaking Time: {stats.speakingTime} minute(s)</p>
// // // // // // // // // //         <p>Average Word Length: {stats.avgWordLength}</p>
// // // // // // // // // //         <p>Longest Word: {stats.longestWord}</p>
// // // // // // // // // //       </div>
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // export default TextAnalyzer;
// // // // // // // // // 'use client';

// // // // // // // // // import React, { useState, useEffect } from 'react';

// // // // // // // // // const TextAnalyzer = () => {
// // // // // // // // //   const initialStats = {
// // // // // // // // //     wordCount: 0,
// // // // // // // // //     charCount: 0,
// // // // // // // // //     charCountNoSpaces: 0,
// // // // // // // // //     sentenceCount: 0,
// // // // // // // // //     paragraphCount: 0,
// // // // // // // // //     readingTime: 0,
// // // // // // // // //     speakingTime: 0,
// // // // // // // // //     avgWordLength: 0,
// // // // // // // // //     longestWord: '',
// // // // // // // // //   };

// // // // // // // // //   const [text, setText] = useState('');
// // // // // // // // //   const [stats, setStats] = useState(initialStats);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     analyzeText(text);
// // // // // // // // //   }, [text]);

// // // // // // // // //   const analyzeText = (inputText) => {
// // // // // // // // //     if (!inputText.trim()) {
// // // // // // // // //       setStats(initialStats);
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     const words = inputText.trim().split(/\s+/);
// // // // // // // // //     const sentences = inputText.trim().split(/[.!?]+/).filter(Boolean);
// // // // // // // // //     const paragraphs = inputText.trim().split(/\n\s*\n/).filter(Boolean);
// // // // // // // // //     const charCountNoSpaces = inputText.replace(/\s/g, '').length;
// // // // // // // // //     const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
// // // // // // // // //     const longestWord = words.reduce((longest, word) => 
// // // // // // // // //       word.length > longest.length ? word : longest, '');

// // // // // // // // //     setStats({
// // // // // // // // //       wordCount: words.length,
// // // // // // // // //       charCount: inputText.length,
// // // // // // // // //       charCountNoSpaces: charCountNoSpaces,
// // // // // // // // //       sentenceCount: sentences.length,
// // // // // // // // //       paragraphCount: paragraphs.length,
// // // // // // // // //       readingTime: Math.max(1, Math.ceil(words.length / 200)), // Minimum 1 minute
// // // // // // // // //       speakingTime: Math.max(1, Math.ceil(words.length / 130)), // Minimum 1 minute
// // // // // // // // //       avgWordLength: words.length ? (totalWordLength / words.length).toFixed(2) : 0,
// // // // // // // // //       longestWord: longestWord,
// // // // // // // // //     });
// // // // // // // // //   };

// // // // // // // // //   const handleReset = () => {
// // // // // // // // //     setText('');
// // // // // // // // //     setStats(initialStats);
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <div>
// // // // // // // // //       <textarea
// // // // // // // // //         rows="10"
// // // // // // // // //         cols="50"
// // // // // // // // //         value={text}
// // // // // // // // //         onChange={(e) => setText(e.target.value)}
// // // // // // // // //         placeholder="Enter your text here..."
// // // // // // // // //       />
// // // // // // // // //       <button onClick={handleReset}>Reset</button>
// // // // // // // // //       <div>
// // // // // // // // //         <h3>Text Analysis:</h3>
// // // // // // // // //         <p>Word Count: {stats.wordCount}</p>
// // // // // // // // //         <p>Character Count: {stats.charCount}</p>
// // // // // // // // //         <p>Character Count (no spaces): {stats.charCountNoSpaces}</p>
// // // // // // // // //         <p>Sentence Count: {stats.sentenceCount}</p>
// // // // // // // // //         <p>Paragraph Count: {stats.paragraphCount}</p>
// // // // // // // // //         <p>Estimated Reading Time: {stats.readingTime} minute(s)</p>
// // // // // // // // //         <p>Estimated Speaking Time: {stats.speakingTime} minute(s)</p>
// // // // // // // // //         <p>Average Word Length: {stats.avgWordLength}</p>
// // // // // // // // //         <p>Longest Word: {stats.longestWord}</p>
// // // // // // // // //       </div>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default TextAnalyzer;
// // // // // // // // 'use client';

// // // // // // // // import React, { useState, useEffect } from 'react';

// // // // // // // // const TextAnalyzer = () => {
// // // // // // // //   const initialStats = {
// // // // // // // //     wordCount: 0,
// // // // // // // //     charCount: 0,
// // // // // // // //     charCountNoSpaces: 0,
// // // // // // // //     sentenceCount: 0,
// // // // // // // //     paragraphCount: 0,
// // // // // // // //     readingTime: 0,
// // // // // // // //     speakingTime: 0,
// // // // // // // //     avgWordLength: 0,
// // // // // // // //     longestWord: '',
// // // // // // // //     shortestWord: '',
// // // // // // // //     uniqueWords: 0,
// // // // // // // //   };

// // // // // // // //   const [text, setText] = useState('');
// // // // // // // //   const [stats, setStats] = useState(initialStats);

// // // // // // // //   useEffect(() => {
// // // // // // // //     analyzeText(text);
// // // // // // // //   }, [text]);

// // // // // // // //   const analyzeText = (inputText) => {
// // // // // // // //     if (!inputText.trim()) {
// // // // // // // //       setStats(initialStats);
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     const words = inputText.trim().split(/\s+/);
// // // // // // // //     const paragraphs = inputText.trim().split(/\n\s*\n/).filter(Boolean);
// // // // // // // //     const sentencesRaw = inputText.trim().split(/[.!?]+/).filter(Boolean);
// // // // // // // //     const charCountNoSpaces = inputText.replace(/\s/g, '').length;
// // // // // // // //     const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
    
// // // // // // // //     const longestWord = words.reduce((longest, word) => 
// // // // // // // //       word.length > longest.length ? word : longest, '');
// // // // // // // //     const shortestWord = words.reduce((shortest, word) => 
// // // // // // // //       word.length < shortest.length ? word : shortest, words[0] || '');
// // // // // // // //     const uniqueWords = new Set(words.map(word => word.toLowerCase())).size;

// // // // // // // //     // Ensure sentence count is at least equal to paragraph count
// // // // // // // //     const sentenceCount = Math.max(sentencesRaw.length, paragraphs.length);

// // // // // // // //     setStats({
// // // // // // // //       wordCount: words.length,
// // // // // // // //       charCount: inputText.length,
// // // // // // // //       charCountNoSpaces: charCountNoSpaces,
// // // // // // // //       sentenceCount: sentenceCount,
// // // // // // // //       paragraphCount: paragraphs.length,
// // // // // // // //       readingTime: Math.max(1, Math.ceil(words.length / 200)), // Minimum 1 minute
// // // // // // // //       speakingTime: Math.max(1, Math.ceil(words.length / 130)), // Minimum 1 minute
// // // // // // // //       avgWordLength: words.length ? (totalWordLength / words.length).toFixed(2) : 0,
// // // // // // // //       longestWord: longestWord,
// // // // // // // //       shortestWord: shortestWord,
// // // // // // // //       uniqueWords: uniqueWords,
// // // // // // // //     });
// // // // // // // //   };

// // // // // // // //   const handleReset = () => {
// // // // // // // //     setText('');
// // // // // // // //     setStats(initialStats);
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <div>
// // // // // // // //       <textarea
// // // // // // // //         rows="10"
// // // // // // // //         cols="50"
// // // // // // // //         value={text}
// // // // // // // //         onChange={(e) => setText(e.target.value)}
// // // // // // // //         placeholder="Enter your text here..."
// // // // // // // //       />
// // // // // // // //       <button onClick={handleReset}>Reset</button>
// // // // // // // //       <div>
// // // // // // // //         <h3>Text Analysis:</h3>
// // // // // // // //         <p>Word Count: {stats.wordCount}</p>
// // // // // // // //         <p>Character Count: {stats.charCount}</p>
// // // // // // // //         <p>Character Count (no spaces): {stats.charCountNoSpaces}</p>
// // // // // // // //         <p>Sentence Count: {stats.sentenceCount}</p>
// // // // // // // //         <p>Paragraph Count: {stats.paragraphCount}</p>
// // // // // // // //         <p>Estimated Reading Time: {stats.readingTime} minute(s)</p>
// // // // // // // //         <p>Estimated Speaking Time: {stats.speakingTime} minute(s)</p>
// // // // // // // //         <p>Average Word Length: {stats.avgWordLength}</p>
// // // // // // // //         <p>Longest Word: {stats.longestWord}</p>
// // // // // // // //         <p>Shortest Word: {stats.shortestWord}</p>
// // // // // // // //         <p>Unique Words: {stats.uniqueWords}</p>
// // // // // // // //       </div>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default TextAnalyzer;
// // // // // // // 'use client';

// // // // // // // import React, { useState, useEffect } from 'react';

// // // // // // // const TextAnalyzer = () => {
// // // // // // //   const initialStats = {
// // // // // // //     wordCount: 0,
// // // // // // //     charCount: 0,
// // // // // // //     charCountNoSpaces: 0,
// // // // // // //     sentenceCount: 0,
// // // // // // //     paragraphCount: 0,
// // // // // // //     readingTime: 0,
// // // // // // //     speakingTime: 0,
// // // // // // //     avgWordLength: 0,
// // // // // // //     longestWord: '',
// // // // // // //     shortestWord: '',
// // // // // // //     uniqueWords: 0,
// // // // // // //   };

// // // // // // //   const [text, setText] = useState('');
// // // // // // //   const [stats, setStats] = useState(initialStats);

// // // // // // //   useEffect(() => {
// // // // // // //     analyzeText(text);
// // // // // // //   }, [text]);

// // // // // // //   const analyzeText = (inputText) => {
// // // // // // //     if (!inputText.trim()) {
// // // // // // //       setStats(initialStats);
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
// // // // // // //     const paragraphs = inputText.trim().split(/\n\s*\n/).filter(Boolean);
// // // // // // //     const sentencesRaw = inputText.trim().split(/[.!?]+/).filter(Boolean);
// // // // // // //     const charCountNoSpaces = inputText.replace(/\s/g, '').length;
// // // // // // //     const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
    
// // // // // // //     let longestWord = '';
// // // // // // //     let shortestWord = words[0] || '';
    
// // // // // // //     for (const word of words) {
// // // // // // //       if (word.length > longestWord.length) {
// // // // // // //         longestWord = word;
// // // // // // //       }
// // // // // // //       if (word.length < shortestWord.length) {
// // // // // // //         shortestWord = word;
// // // // // // //       }
// // // // // // //     }

// // // // // // //     const uniqueWords = new Set(words.map(word => word.toLowerCase())).size;

// // // // // // //     // Ensure sentence count is at least equal to paragraph count
// // // // // // //     const sentenceCount = Math.max(sentencesRaw.length, paragraphs.length);

// // // // // // //     setStats({
// // // // // // //       wordCount: words.length,
// // // // // // //       charCount: inputText.length,
// // // // // // //       charCountNoSpaces: charCountNoSpaces,
// // // // // // //       sentenceCount: sentenceCount,
// // // // // // //       paragraphCount: paragraphs.length,
// // // // // // //       readingTime: Math.max(1, Math.ceil(words.length / 200)), // Minimum 1 minute
// // // // // // //       speakingTime: Math.max(1, Math.ceil(words.length / 130)), // Minimum 1 minute
// // // // // // //       avgWordLength: words.length ? (totalWordLength / words.length).toFixed(2) : 0,
// // // // // // //       longestWord: longestWord,
// // // // // // //       shortestWord: shortestWord,
// // // // // // //       uniqueWords: uniqueWords,
// // // // // // //     });
// // // // // // //   };

// // // // // // //   const handleReset = () => {
// // // // // // //     setText('');
// // // // // // //     setStats(initialStats);
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div>
// // // // // // //       <textarea
// // // // // // //         rows="10"
// // // // // // //         cols="50"
// // // // // // //         value={text}
// // // // // // //         onChange={(e) => setText(e.target.value)}
// // // // // // //         placeholder="Enter your text here..."
// // // // // // //       />
// // // // // // //       <button onClick={handleReset}>Reset</button>
// // // // // // //       <div>
// // // // // // //         <h3>Text Analysis:</h3>
// // // // // // //         <p>Word Count: {stats.wordCount}</p>
// // // // // // //         <p>Character Count: {stats.charCount}</p>
// // // // // // //         <p>Character Count (no spaces): {stats.charCountNoSpaces}</p>
// // // // // // //         <p>Sentence Count: {stats.sentenceCount}</p>
// // // // // // //         <p>Paragraph Count: {stats.paragraphCount}</p>
// // // // // // //         <p>Estimated Reading Time: {stats.readingTime} minute(s)</p>
// // // // // // //         <p>Estimated Speaking Time: {stats.speakingTime} minute(s)</p>
// // // // // // //         <p>Average Word Length: {stats.avgWordLength}</p>
// // // // // // //         <p>Longest Word: {stats.longestWord}</p>
// // // // // // //         <p>Shortest Word: {stats.shortestWord}</p>
// // // // // // //         <p>Unique Words: {stats.uniqueWords}</p>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default TextAnalyzer;
// // // // // // 'use client';

// // // // // // import React, { useState, useEffect } from 'react';

// // // // // // const TextAnalyzer = () => {
// // // // // //   const initialStats = {
// // // // // //     wordCount: 0,
// // // // // //     charCount: 0,
// // // // // //     charCountNoSpaces: 0,
// // // // // //     sentenceCount: 0,
// // // // // //     paragraphCount: 0,
// // // // // //     readingTime: 0,
// // // // // //     speakingTime: 0,
// // // // // //     avgWordLength: 0,
// // // // // //     longestWord: '',
// // // // // //     shortestWord: '',
// // // // // //     uniqueWords: 0,
// // // // // //   };

// // // // // //   const [text, setText] = useState('');
// // // // // //   const [stats, setStats] = useState(initialStats);

// // // // // //   useEffect(() => {
// // // // // //     analyzeText(text);
// // // // // //   }, [text]);

// // // // // //   const analyzeText = (inputText) => {
// // // // // //     if (!inputText.trim()) {
// // // // // //       setStats(initialStats);
// // // // // //       return;
// // // // // //     }

// // // // // //     const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
// // // // // //     const paragraphs = inputText.trim().split(/\n\s*\n/).filter(Boolean);
// // // // // //     const sentencesRaw = inputText.trim().split(/[.!?]+/).filter(Boolean);
// // // // // //     const charCountNoSpaces = inputText.replace(/\s/g, '').length;
// // // // // //     const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
    
// // // // // //     let longestWord = '';
// // // // // //     let shortestWord = words[0] || '';
    
// // // // // //     for (const word of words) {
// // // // // //       if (word.length > longestWord.length) {
// // // // // //         longestWord = word;
// // // // // //       }
// // // // // //       if (word.length < shortestWord.length) {
// // // // // //         shortestWord = word;
// // // // // //       }
// // // // // //     }

// // // // // //     const uniqueWords = new Set(words.map(word => word.toLowerCase())).size;

// // // // // //     // Ensure sentence count is at least equal to paragraph count
// // // // // //     const sentenceCount = Math.max(sentencesRaw.length, paragraphs.length);

// // // // // //     setStats({
// // // // // //       wordCount: words.length,
// // // // // //       charCount: inputText.length,
// // // // // //       charCountNoSpaces: charCountNoSpaces,
// // // // // //       sentenceCount: sentenceCount,
// // // // // //       paragraphCount: paragraphs.length,
// // // // // //       readingTime: Math.max(1, Math.ceil(words.length / 200)), // Minimum 1 minute
// // // // // //       speakingTime: Math.max(1, Math.ceil(words.length / 130)), // Minimum 1 minute
// // // // // //       avgWordLength: words.length ? (totalWordLength / words.length).toFixed(2) : 0,
// // // // // //       longestWord: longestWord,
// // // // // //       shortestWord: shortestWord,
// // // // // //       uniqueWords: uniqueWords,
// // // // // //     });
// // // // // //   };

// // // // // //   const handleReset = () => {
// // // // // //     setText('');
// // // // // //     setStats(initialStats);
// // // // // //   };

// // // // // //   return (
// // // // // //     <div>
// // // // // //       <textarea
// // // // // //         rows="10"
// // // // // //         cols="50"
// // // // // //         value={text}
// // // // // //         onChange={(e) => setText(e.target.value)}
// // // // // //         placeholder="Enter your text here..."
// // // // // //       />
// // // // // //       <button onClick={handleReset}>Reset</button>
// // // // // //       <div>
// // // // // //         <h3>Text Analysis:</h3>
// // // // // //         <p>Word Count: {stats.wordCount}</p>
// // // // // //         <p>Character Count: {stats.charCount}</p>
// // // // // //         <p>Character Count (no spaces): {stats.charCountNoSpaces}</p>
// // // // // //         <p>Sentence Count: {stats.sentenceCount}</p>
// // // // // //         <p>Paragraph Count: {stats.paragraphCount}</p>
// // // // // //         <p>Estimated Reading Time: {stats.readingTime} minute(s)</p>
// // // // // //         <p>Estimated Speaking Time: {stats.speakingTime} minute(s)</p>
// // // // // //         <p>Average Word Length: {stats.avgWordLength}</p>
// // // // // //         <p>Longest Word: {stats.longestWord}</p>
// // // // // //         <p>Shortest Word: {stats.shortestWord}</p>
// // // // // //         <p>Unique Words: {stats.uniqueWords}</p>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default TextAnalyzer;
// // // // // 'use client';

// // // // // import React, { useState, useEffect } from 'react';

// // // // // const TextAnalyzer = () => {
// // // // //   const initialStats = {
// // // // //     wordCount: 0,
// // // // //     charCount: 0,
// // // // //     charCountNoSpaces: 0,
// // // // //     sentenceCount: 0,
// // // // //     paragraphCount: 0,
// // // // //     readingTime: 0,
// // // // //     speakingTime: 0,
// // // // //     avgWordLength: 0,
// // // // //     longestWord: '',
// // // // //     shortestWord: '',
// // // // //     uniqueWords: 0,
// // // // //   };

// // // // //   const [text, setText] = useState('');
// // // // //   const [stats, setStats] = useState(initialStats);

// // // // //   useEffect(() => {
// // // // //     analyzeText(text);
// // // // //   }, [text]);

// // // // //   const analyzeText = (inputText) => {
// // // // //     if (!inputText.trim()) {
// // // // //       setStats(initialStats);
// // // // //       return;
// // // // //     }

// // // // //     const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
// // // // //     const paragraphs = inputText.trim().split(/\n\s*\n/).filter(Boolean);
// // // // //     const sentencesRaw = inputText.trim().split(/[.!?]+/).filter(Boolean);
// // // // //     const charCountNoSpaces = inputText.replace(/\s/g, '').length;
// // // // //     const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
    
// // // // //     let longestWord = '';
// // // // //     let shortestWord = words[0] || '';
    
// // // // //     for (const word of words) {
// // // // //       if (word.length > longestWord.length) {
// // // // //         longestWord = word;
// // // // //       }
// // // // //       if (word.length < shortestWord.length) {
// // // // //         shortestWord = word;
// // // // //       }
// // // // //     }

// // // // //     const uniqueWords = new Set(words.map(word => word.toLowerCase())).size;

// // // // //     const sentenceCount = Math.max(sentencesRaw.length, paragraphs.length);

// // // // //     setStats({
// // // // //       wordCount: words.length,
// // // // //       charCount: inputText.length,
// // // // //       charCountNoSpaces: charCountNoSpaces,
// // // // //       sentenceCount: sentenceCount,
// // // // //       paragraphCount: paragraphs.length,
// // // // //       readingTime: Math.max(1, Math.ceil(words.length / 200)),
// // // // //       speakingTime: Math.max(1, Math.ceil(words.length / 130)),
// // // // //       avgWordLength: words.length ? (totalWordLength / words.length).toFixed(2) : 0,
// // // // //       longestWord: longestWord,
// // // // //       shortestWord: shortestWord,
// // // // //       uniqueWords: uniqueWords,
// // // // //     });
// // // // //   };

// // // // //   const handleReset = () => {
// // // // //     setText('');
// // // // //     setStats(initialStats);
// // // // //   };

// // // // //   return (
// // // // //     <div>
// // // // //       <textarea
// // // // //         rows="10"
// // // // //         cols="50"
// // // // //         value={text}
// // // // //         onChange={(e) => setText(e.target.value)}
// // // // //         placeholder="Enter your text here..."
// // // // //       />
// // // // //       <button onClick={handleReset}>Reset</button>
// // // // //       <div>
// // // // //         <h3>Text Analysis:</h3>
// // // // //         <p>Word Count: {stats.wordCount}</p>
// // // // //         <p>Character Count: {stats.charCount}</p>
// // // // //         <p>Character Count (no spaces): {stats.charCountNoSpaces}</p>
// // // // //         <p>Sentence Count: {stats.sentenceCount}</p>
// // // // //         <p>Paragraph Count: {stats.paragraphCount}</p>
// // // // //         <p>Estimated Reading Time: {stats.readingTime} minute(s)</p>
// // // // //         <p>Estimated Speaking Time: {stats.speakingTime} minute(s)</p>
// // // // //         <p>Average Word Length: {stats.avgWordLength}</p>
// // // // //         <p>Longest Word: {stats.longestWord}</p>
// // // // //         <p>Shortest Word: {stats.shortestWord}</p>
// // // // //         <p>Unique Words: {stats.uniqueWords}</p>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default TextAnalyzer;
// // // // 'use client';

// // // // import React, { useState, useEffect } from 'react';

// // // // const TextAnalyzer = () => {
// // // //   const initialStats = {
// // // //     wordCount: 0,
// // // //     charCount: 0,
// // // //     charCountNoSpaces: 0,
// // // //     sentenceCount: 0,
// // // //     paragraphCount: 0,
// // // //     readingTime: 0,
// // // //     speakingTime: 0,
// // // //     avgWordLength: 0,
// // // //     longestWord: '',
// // // //     shortestWord: '',
// // // //     uniqueWords: 0,
// // // //   };

// // // //   const [text, setText] = useState('');
// // // //   const [stats, setStats] = useState(initialStats);

// // // //   useEffect(() => {
// // // //     analyzeText(text);
// // // //   }, [text]);

// // // //   const analyzeText = (inputText) => {
// // // //     if (!inputText.trim()) {
// // // //       setStats(initialStats);
// // // //       return;
// // // //     }

// // // //     const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
// // // //     const paragraphs = inputText.trim().split(/\n\s*\n/).filter(Boolean);
// // // //     const sentencesRaw = inputText.trim().split(/[.!?]+/).filter(Boolean);
// // // //     const charCountNoSpaces = inputText.replace(/\s/g, '').length;
// // // //     const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
    
// // // //     let longestWord = '';
// // // //     let shortestWord = words[0] || '';
    
// // // //     for (const word of words) {
// // // //       if (word.length > longestWord.length) {
// // // //         longestWord = word;
// // // //       }
// // // //       if (word.length < shortestWord.length) {
// // // //         shortestWord = word;
// // // //       }
// // // //     }

// // // //     const uniqueWords = new Set(words.map(word => word.toLowerCase())).size;

// // // //     const sentenceCount = Math.max(sentencesRaw.length, paragraphs.length);

// // // //     setStats({
// // // //       wordCount: words.length,
// // // //       charCount: inputText.length,
// // // //       charCountNoSpaces: charCountNoSpaces,
// // // //       sentenceCount: sentenceCount,
// // // //       paragraphCount: paragraphs.length,
// // // //       readingTime: Math.max(1, Math.ceil(words.length / 200)),
// // // //       speakingTime: Math.max(1, Math.ceil(words.length / 130)),
// // // //       avgWordLength: words.length ? (totalWordLength / words.length).toFixed(2) : 0,
// // // //       longestWord: longestWord,
// // // //       shortestWord: shortestWord,
// // // //       uniqueWords: uniqueWords,
// // // //     });
// // // //   };

// // // //   const handleReset = () => {
// // // //     setText('');
// // // //     setStats(initialStats);
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <textarea
// // // //         rows="10"
// // // //         cols="50"
// // // //         value={text}
// // // //         onChange={(e) => setText(e.target.value)}
// // // //         placeholder="Enter your text here..."
// // // //       />
// // // //       <button onClick={handleReset}>Reset</button>
// // // //       <div>
// // // //         <h3>Text Analysis:</h3>
// // // //         <p>Word Count: {stats.wordCount}</p>
// // // //         <p>Character Count: {stats.charCount}</p>
// // // //         <p>Character Count (no spaces): {stats.charCountNoSpaces}</p>
// // // //         <p>Sentence Count: {stats.sentenceCount}</p>
// // // //         <p>Paragraph Count: {stats.paragraphCount}</p>
// // // //         <p>Estimated Reading Time: {stats.readingTime} minute(s)</p>
// // // //         <p>Estimated Speaking Time: {stats.speakingTime} minute(s)</p>
// // // //         <p>Average Word Length: {stats.avgWordLength}</p>
// // // //         <p>Longest Word: {stats.longestWord}</p>
// // // //         <p>Shortest Word: {stats.shortestWord}</p>
// // // //         <p>Unique Words: {stats.uniqueWords}</p>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default TextAnalyzer;
// // // 'use client';

// // // import React, { useState, useEffect } from 'react';

// // // const TextAnalyzer = () => {
// // //   const initialStats = {
// // //     wordCount: 0,
// // //     charCount: 0,
// // //     charCountNoSpaces: 0,
// // //     sentenceCount: 0,
// // //     paragraphCount: 0,
// // //     readingTime: 0,
// // //     speakingTime: 0,
// // //     avgWordLength: 0,
// // //     longestWord: '',
// // //     shortestWord: '',
// // //     uniqueWords: 0,
// // //   };

// // //   const [text, setText] = useState('');
// // //   const [stats, setStats] = useState(initialStats);

// // //   useEffect(() => {
// // //     analyzeText(text);
// // //   }, [text]);

// // //   const analyzeText = (inputText) => {
// // //     if (!inputText.trim()) {
// // //       setStats(initialStats);
// // //       return;
// // //     }

// // //     // Split words without modifying the original text
// // //     const words = inputText.trim().split(/\s+/);
// // //     const wordPattern = /^[a-zA-Z0-9''-]+$/;

// // //     const validWords = words.filter(word => wordPattern.test(word));
// // //     const paragraphs = inputText.trim().split(/\n\s*\n/);
// // //     const sentences = inputText.trim().split(/[.!?]+\s*/);
// // //     const charCountNoSpaces = inputText.replace(/\s/g, '').length;
    
// // //     let longestWord = '';
// // //     let shortestWord = validWords[0] || '';
    
// // //     for (const word of validWords) {
// // //       if (word.length > longestWord.length) {
// // //         longestWord = word;
// // //       }
// // //       if (word.length < shortestWord.length) {
// // //         shortestWord = word;
// // //       }
// // //     }

// // //     const uniqueWords = new Set(validWords.map(word => word.toLowerCase())).size;

// // //     setStats({
// // //       wordCount: validWords.length,
// // //       charCount: inputText.length,
// // //       charCountNoSpaces: charCountNoSpaces,
// // //       sentenceCount: sentences.length,
// // //       paragraphCount: paragraphs.length,
// // //       readingTime: Math.max(1, Math.ceil(validWords.length / 200)),
// // //       speakingTime: Math.max(1, Math.ceil(validWords.length / 130)),
// // //       avgWordLength: validWords.length ? (validWords.join('').length / validWords.length).toFixed(2) : 0,
// // //       longestWord: longestWord,
// // //       shortestWord: shortestWord,
// // //       uniqueWords: uniqueWords,
// // //     });
// // //   };

// // //   const handleReset = () => {
// // //     setText('');
// // //     setStats(initialStats);
// // //   };

// // //   return (
// // //     <div>
// // //       <textarea
// // //         rows="10"
// // //         cols="50"
// // //         value={text}
// // //         onChange={(e) => setText(e.target.value)}
// // //         placeholder="Enter your text here..."
// // //       />
// // //       <button onClick={handleReset}>Reset</button>
// // //       <div>
// // //         <h3>Text Analysis:</h3>
// // //         <p>Word Count: {stats.wordCount}</p>
// // //         <p>Character Count: {stats.charCount}</p>
// // //         <p>Character Count (no spaces): {stats.charCountNoSpaces}</p>
// // //         <p>Sentence Count: {stats.sentenceCount}</p>
// // //         <p>Paragraph Count: {stats.paragraphCount}</p>
// // //         <p>Estimated Reading Time: {stats.readingTime} minute(s)</p>
// // //         <p>Estimated Speaking Time: {stats.speakingTime} minute(s)</p>
// // //         <p>Average Word Length: {stats.avgWordLength}</p>
// // //         <p>Longest Word: {stats.longestWord}</p>
// // //         <p>Shortest Word: {stats.shortestWord}</p>
// // //         <p>Unique Words: {stats.uniqueWords}</p>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default TextAnalyzer;
// // 'use client';

// // import React, { useState, useEffect } from 'react';

// // const MAX_FILE_SIZE = 100 * 1024; // 100 KB limit

// // const TextAnalyzer = () => {
// //   const initialStats = {
// //     wordCount: 0,
// //     charCount: 0,
// //     charCountNoSpaces: 0,
// //     sentenceCount: 0,
// //     paragraphCount: 0,
// //     readingTime: '',
// //     speakingTime: '',
// //     avgWordLength: 0,
// //     longestWord: '',
// //     shortestWord: '',
// //     uniqueWords: 0,
// //   };

// //   const [text, setText] = useState('');
// //   const [stats, setStats] = useState(initialStats);
// //   const [error, setError] = useState('');

// //   useEffect(() => {
// //     analyzeText(text);
// //   }, [text]);

// //   const analyzeText = (inputText) => {
// //     if (!inputText.trim()) {
// //       setStats(initialStats);
// //       return;
// //     }

// //     const words = inputText.trim().split(/\s+/);
// //     const wordPattern = /^[a-zA-Z0-9''-]+$/;
// //     const validWords = words.filter(word => wordPattern.test(word));
// //     const paragraphs = inputText.trim().split(/\n\s*\n/);
// //     const sentences = inputText.trim().split(/[.!?]+\s*/);
// //     const charCountNoSpaces = inputText.replace(/\s/g, '').length;
    
// //     let longestWord = '';
// //     let shortestWord = validWords[0] || '';
    
// //     for (const word of validWords) {
// //       if (word.length > longestWord.length) {
// //         longestWord = word;
// //       }
// //       if (word.length < shortestWord.length) {
// //         shortestWord = word;
// //       }
// //     }

// //     const uniqueWords = new Set(validWords.map(word => word.toLowerCase())).size;

// //     setStats({
// //       wordCount: validWords.length,
// //       charCount: inputText.length,
// //       charCountNoSpaces: charCountNoSpaces,
// //       sentenceCount: sentences.length,
// //       paragraphCount: paragraphs.length,
// //       readingTime: calculateTime(validWords.length, 200),
// //       speakingTime: calculateTime(validWords.length, 130),
// //       avgWordLength: validWords.length ? (validWords.join('').length / validWords.length).toFixed(2) : 0,
// //       longestWord: longestWord,
// //       shortestWord: shortestWord,
// //       uniqueWords: uniqueWords,
// //     });
// //   };

// //   const calculateTime = (wordCount, wordsPerMinute) => {
// //     const minutes = wordCount / wordsPerMinute;
// //     if (minutes < 1) {
// //       return "Less than a minute";
// //     } else if (minutes < 60) {
// //       return `${Math.round(minutes)} minute(s)`;
// //     } else {
// //       const hours = Math.floor(minutes / 60);
// //       const remainingMinutes = Math.round(minutes % 60);
// //       return `${hours} hour(s) and ${remainingMinutes} minute(s)`;
// //     }
// //   };

// //   const handleTextChange = (e) => {
// //     setText(e.target.value);
// //     setError('');
// //   };

// //   const handleFileUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       if (file.size > MAX_FILE_SIZE) {
// //         setError(`File size exceeds the limit of ${MAX_FILE_SIZE / 1024} KB`);
// //         return;
// //       }

// //       const reader = new FileReader();
// //       reader.onload = (e) => {
// //         setText(e.target.result);
// //         setError('');
// //       };
// //       reader.onerror = () => {
// //         setError('Error reading file');
// //       };
// //       reader.readAsText(file);
// //     }
// //   };

// //   const handleReset = () => {
// //     setText('');
// //     setStats(initialStats);
// //     setError('');
// //   };

// //   return (
// //     <div>
// //       <textarea
// //         rows="10"
// //         cols="50"
// //         value={text}
// //         onChange={handleTextChange}
// //         placeholder="Enter your text here..."
// //       />
// //       <input
// //         type="file"
// //         accept=".txt"
// //         onChange={handleFileUpload}
// //       />
// //       {error && <p style={{color: 'red'}}>{error}</p>}
// //       <button onClick={handleReset}>Reset</button>
// //       {stats.wordCount>0&&<div>
// //         <h3>Text Analysis:</h3>
// //         <p>Word Count: {stats.wordCount}</p>
// //         <p>Character Count: {stats.charCount}</p>
// //         <p>Character Count (no spaces): {stats.charCountNoSpaces}</p>
// //         <p>Sentence Count: {stats.sentenceCount}</p>
// //         <p>Paragraph Count: {stats.paragraphCount}</p>
// //         <p>Estimated Reading Time: {stats.readingTime}</p>
// //         <p>Estimated Speaking Time: {stats.speakingTime}</p>
// //         <p>Average Word Length: {stats.avgWordLength}</p>
// //         <p>Longest Word: {stats.longestWord}</p>
// //         <p>Shortest Word: {stats.shortestWord}</p>
// //         <p>Unique Words: {stats.uniqueWords}</p>
// //       </div>}
// //     </div>
// //   );
// // };

// // export default TextAnalyzer;
// 'use client';

// import React, { useState, useEffect } from 'react';
// import styles from './TextAnalyzer.module.css';

// const MAX_FILE_SIZE = 100 * 1024; // 100 KB limit

// const TextAnalyzer = () => {
//   const initialStats = {
//     wordCount: 0,
//     charCount: 0,
//     charCountNoSpaces: 0,
//     sentenceCount: 0,
//     paragraphCount: 0,
//     readingTime: '',
//     speakingTime: '',
//     avgWordLength: 0,
//     longestWord: '',
//     shortestWord: '',
//     uniqueWords: 0,
//   };

//   const [text, setText] = useState('');
//   const [stats, setStats] = useState(initialStats);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     analyzeText(text);
//   }, [text]);

//   const analyzeText = (inputText) => {
//     if (!inputText.trim()) {
//       setStats(initialStats);
//       return;
//     }

//     const words = inputText.trim().split(/\s+/);
//     const wordPattern = /^[a-zA-Z0-9''-]+$/;
//     const validWords = words.filter(word => wordPattern.test(word));
//     const paragraphs = inputText.trim().split(/\n\s*\n/);
//     const sentences = inputText.trim().split(/[.!?]+\s*/);
//     const charCountNoSpaces = inputText.replace(/\s/g, '').length;
    
//     let longestWord = '';
//     let shortestWord = validWords[0] || '';
    
//     for (const word of validWords) {
//       if (word.length > longestWord.length) {
//         longestWord = word;
//       }
//       if (word.length < shortestWord.length) {
//         shortestWord = word;
//       }
//     }

//     const uniqueWords = new Set(validWords.map(word => word.toLowerCase())).size;

//     setStats({
//       wordCount: validWords.length,
//       charCount: inputText.length,
//       charCountNoSpaces: charCountNoSpaces,
//       sentenceCount: sentences.length,
//       paragraphCount: paragraphs.length,
//       readingTime: calculateTime(validWords.length, 200),
//       speakingTime: calculateTime(validWords.length, 130),
//       avgWordLength: validWords.length ? (validWords.join('').length / validWords.length).toFixed(2) : 0,
//       longestWord: longestWord,
//       shortestWord: shortestWord,
//       uniqueWords: uniqueWords,
//     });
//   };

//   const calculateTime = (wordCount, wordsPerMinute) => {
//     const minutes = wordCount / wordsPerMinute;
//     if (minutes < 1) {
//       return "Less than a minute";
//     } else if (minutes < 60) {
//       return `${Math.round(minutes)} minute(s)`;
//     } else {
//       const hours = Math.floor(minutes / 60);
//       const remainingMinutes = Math.round(minutes % 60);
//       return `${hours} hour(s) and ${remainingMinutes} minute(s)`;
//     }
//   };

//   const handleTextChange = (e) => {
//     setText(e.target.value);
//     setError('');
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > MAX_FILE_SIZE) {
//         setError(`File size exceeds the limit of ${MAX_FILE_SIZE / 1024} KB`);
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setText(e.target.result);
//         setError('');
//       };
//       reader.onerror = () => {
//         setError('Error reading file');
//       };
//       reader.readAsText(file);
//     }
//   };

//   const handleReset = () => {
//     setText('');
//     setStats(initialStats);
//     setError('');
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.column}>
//         <textarea
//           className={styles.textArea}
//           value={text}
//           onChange={handleTextChange}
//           placeholder="Enter your text here..."
//         />
//         <div className={styles.controls}>
//           <input
//             type="file"
//             accept=".txt"
//             onChange={handleFileUpload}
//             className={styles.fileInput}
//           />
//           <button onClick={handleReset} className={styles.resetButton}>Reset</button>
//         </div>
//         {error && <p className={styles.error}>{error}</p>}
//       </div>
//       <div className={styles.column}>
//         {stats.wordCount > 0 && (
//           <div className={styles.analysis}>
//             <h3>Text Analysis:</h3>
//             <p className={styles.analysisItem}>Word Count: {stats.wordCount}</p>
//             <p className={styles.analysisItem}>Character Count: {stats.charCount}</p>
//             <p className={styles.analysisItem}>Character Count (no spaces): {stats.charCountNoSpaces}</p>
//             <p className={styles.analysisItem}>Sentence Count: {stats.sentenceCount}</p>
//             <p className={styles.analysisItem}>Paragraph Count: {stats.paragraphCount}</p>
//             <p className={styles.analysisItem}>Estimated Reading Time: {stats.readingTime}</p>
//             <p className={styles.analysisItem}>Estimated Speaking Time: {stats.speakingTime}</p>
//             <p className={styles.analysisItem}>Average Word Length: {stats.avgWordLength}</p>
//             <p className={styles.analysisItem}>Longest Word: {stats.longestWord}</p>
//             <p className={styles.analysisItem}>Shortest Word: {stats.shortestWord}</p>
//             <p className={styles.analysisItem}>Unique Words: {stats.uniqueWords}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TextAnalyzer;
'use client';

import React, { useState, useEffect } from 'react';
import styles from './TextAnalyzer.module.css';

const MAX_FILE_SIZE = 100 * 1024; // 100 KB limit

const TextAnalyzer = () => {
  const initialStats = {
    wordCount: 0,
    charCount: 0,
    charCountNoSpaces: 0,
    sentenceCount: 0,
    paragraphCount: 0,
    readingTime: '',
    speakingTime: '',
    avgWordLength: 0,
    longestWord: '',
    shortestWord: '',
    uniqueWords: 0,
  };

  const [text, setText] = useState('');
  const [stats, setStats] = useState(initialStats);
  const [error, setError] = useState('');

  useEffect(() => {
    analyzeText(text);
  }, [text]);

  const analyzeText = (inputText) => {
    if (!inputText.trim()) {
      setStats(initialStats);
      return;
    }
  
    const words = inputText.trim().split(/[^a-zA-Z0-9''-]+/).filter(word => word.length > 0);
    const paragraphs = inputText.trim().split(/\n\s*\n/).filter(Boolean);
    const sentences = inputText.trim().split(/[.!?]+(?=\s+|$)/).filter(Boolean);
    const charCountNoSpaces = inputText.replace(/\s/g, '').length;
    
    let longestWord = '';
    let shortestWord = words[0] || '';
    
    // Calculate keyword density
    const wordFrequency = {};
    words.forEach(word => {
      const lowercaseWord = word.toLowerCase();
      wordFrequency[lowercaseWord] = (wordFrequency[lowercaseWord] || 0) + 1;
    });
  
    const keywordDensity = Object.entries(wordFrequency)
      .map(([word, count]) => ({
        word,
        count,
        density: (count / words.length * 100).toFixed(2)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);  // Get top 5 keywords
  
    for (const word of words) {
      if (word.length > longestWord.length) {
        longestWord = word;
      }
      if (word.length < shortestWord.length) {
        shortestWord = word;
      }
    }
  
    const uniqueWords = new Set(words.map(word => word.toLowerCase())).size;
  
    setStats({
      wordCount: words.length,
      charCount: inputText.length,
      charCountNoSpaces: charCountNoSpaces,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      readingTime: calculateTime(words.length, 200),
      speakingTime: calculateTime(words.length, 130),
      avgWordLength: words.length ? (words.join('').length / words.length).toFixed(2) : 0,
      longestWord: longestWord,
      shortestWord: shortestWord,
      uniqueWords: uniqueWords,
      keywordDensity: keywordDensity
    });
  };

//   const analyzeText = (inputText) => {
//     if (!inputText.trim()) {
//       setStats(initialStats);
//       return;
//     }
  
//     const words = inputText.trim().split(/[^a-zA-Z0-9''-]+/).filter(word => word.length > 0);
//     const paragraphs = inputText.trim().split(/\n\s*\n/).filter(Boolean);
//     // Improved sentence counting regex
//     const sentences = inputText.trim().split(/[.!?]+(?=\s+|$)/).filter(Boolean);
//     const charCountNoSpaces = inputText.replace(/\s/g, '').length;
    
//     let longestWord = '';
//     let shortestWord = words[0] || '';
    
//     for (const word of words) {
//       if (word.length > longestWord.length) {
//         longestWord = word;
//       }
//       if (word.length < shortestWord.length) {
//         shortestWord = word;
//       }
//     }
  
//     const uniqueWords = new Set(words.map(word => word.toLowerCase())).size;
  
//     setStats({
//       wordCount: words.length,
//       charCount: inputText.length,
//       charCountNoSpaces: charCountNoSpaces,
//       sentenceCount: sentences.length,
//       paragraphCount: paragraphs.length,
//       readingTime: calculateTime(words.length, 200),
//       speakingTime: calculateTime(words.length, 130),
//       avgWordLength: words.length ? (words.join('').length / words.length).toFixed(2) : 0,
//       longestWord: longestWord,
//       shortestWord: shortestWord,
//       uniqueWords: uniqueWords,
//     });
//   };

//   const analyzeText = (inputText) => {
//     if (!inputText.trim()) {
//       setStats(initialStats);
//       return;
//     }

//     const words = inputText.trim().split(/[^a-zA-Z0-9''-]+/).filter(word => word.length > 0);
//     const paragraphs = inputText.trim().split(/\n\s*\n/).filter(Boolean);
//     const sentences = inputText.trim().split(/[.!?]+\s*/).filter(Boolean);
//     const charCountNoSpaces = inputText.replace(/\s/g, '').length;
    
//     let longestWord = '';
//     let shortestWord = words[0] || '';
    
//     for (const word of words) {
//       if (word.length > longestWord.length) {
//         longestWord = word;
//       }
//       if (word.length < shortestWord.length) {
//         shortestWord = word;
//       }
//     }

//     const uniqueWords = new Set(words.map(word => word.toLowerCase())).size;

//     setStats({
//       wordCount: words.length,
//       charCount: inputText.length,
//       charCountNoSpaces: charCountNoSpaces,
//       sentenceCount: sentences.length,
//       paragraphCount: paragraphs.length,
//       readingTime: calculateTime(words.length, 200),
//       speakingTime: calculateTime(words.length, 130),
//       avgWordLength: words.length ? (words.join('').length / words.length).toFixed(2) : 0,
//       longestWord: longestWord,
//       shortestWord: shortestWord,
//       uniqueWords: uniqueWords,
//     });
//   };

  const calculateTime = (wordCount, wordsPerMinute) => {
    const minutes = wordCount / wordsPerMinute;
    if (minutes < 1) {
      return "Less than a minute";
    } else if (minutes < 60) {
      return `${Math.round(minutes)} minute(s)`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      return `${hours} hour(s) and ${remainingMinutes} minute(s)`;
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setError('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File size exceeds the limit of ${MAX_FILE_SIZE / 1024} KB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target.result);
        setError('');
      };
      reader.onerror = () => {
        setError('Error reading file');
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    setText('');
    setStats(initialStats);
    setError('');
  };

//   return (
//     <div className={styles.container}>
//       <div className={styles.column}>
//         <textarea
//           className={styles.textarea}
//           value={text}
//           onChange={handleTextChange}
//           placeholder="Enter your text here..."
//         />
//         <div className={styles.controls}>
//         <div className={styles.fileInputWrapper}>
//           <input
//             type="file"
//             accept=".txt"
//             onChange={handleFileUpload}
//             className={styles.fileInput}
//             id="fileInput"
//           />
//         <label htmlFor="fileInput" className={styles.fileInputLabel}>
//             Choose File
//         </label>
       
//         </div>
//         <button onClick={handleReset} className={styles.resetButton}>Reset</button>
//       </div>
      
//         {error && <p className={styles.error}>{error}</p>}
//       </div>
//       <div className={styles.column}>
//         {stats.wordCount > 0 && (
//           <div className={styles.analysis}>
//             <h3>Text Analysis:</h3>
//             <br></br>
//             {Object.entries(stats).map(([key, value]) => (
//               <p key={key} className={styles.analysisItem}>
//                 {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}
//               </p>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );

// return (
//     <div className={styles.container}>
//       <div className={styles.column}>
//         <textarea
//           className={styles.textarea}
//           value={text}
//           onChange={handleTextChange}
//           placeholder="Enter your text here..."
//         />
//         <div className={styles.controls}>
//           <div className={styles.fileInputWrapper}>
//             <input
//               type="file"
//               accept=".txt"
//               onChange={handleFileUpload}
//               className={styles.fileInput}
//               id="fileInput"
//             />
//             <label htmlFor="fileInput" className={styles.fileInputLabel}>
//               Choose File
//             </label>
//           </div>
//           <button onClick={handleReset} className={styles.resetButton}>Reset</button>
//         </div>
//         {error && <p className={styles.error}>{error}</p>}
//       </div>
//       <div className={styles.rightColumn}>
//         {stats.wordCount > 0 && (
//           <div className={styles.analysis}>
//             <h3>Text Analysis:</h3>
//             <br />
//             {Object.entries(stats).map(([key, value]) => {
//               if (key === 'keywordDensity') {
//                 return (
//                   <div key={key} className={styles.analysisItem}>
//                     <h3>Keyword Density (Top 5):</h3>
//                     <ul>
//                       {value.map((item, index) => (
//                         <li key={index}>
//                           {item.word}: {item.count} ({item.density}%)
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 );
//               }
//               return (
//                 <p key={key} className={styles.analysisItem}>
//                   {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}
//                 </p>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );

return (
    <div className={styles.container}>
      <div className={styles.column}>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={handleTextChange}
          placeholder="Enter your text here..."
        />
        <div className={styles.controls}>
          <div className={styles.fileInputWrapper}>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className={styles.fileInput}
              id="fileInput"
            />
            <label htmlFor="fileInput" className={styles.fileInputLabel}>
              Choose File
            </label>
            <button onClick={handleReset} className={styles.resetButton}>Reset</button>
          </div>
          
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
      <div className={styles.column}>
        {stats.wordCount > 0 && (
          <div className={styles.analysisGrid}>
            <div className={styles.analysisColumn}>
              <h3>Text Analysis:</h3>
             
              {Object.entries(stats).map(([key, value]) => {
                if (key !== 'keywordDensity') {
                  return (
                    <p key={key} className={styles.analysisItem}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value}
                    </p>
                  );
                }
                return null;
              })}
            </div>
            <div className={styles.analysisColumn}>
              <h3>Keyword Density:</h3>
              <br />
              {stats.keywordDensity && (
                <ul className={styles.keywordList}>
                  {stats.keywordDensity.map((item, index) => (
                    <li key={index} className={styles.keywordItem}>
                      {item.word}: {item.count} ({item.density}%)
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default TextAnalyzer;