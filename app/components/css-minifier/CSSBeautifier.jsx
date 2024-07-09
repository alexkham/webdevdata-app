// // // 'use client';

// // // import { useState } from 'react';
// // // import styles from './CSSBeautifier.module.css';

// // // function CSSBeautifier() {
// // //     const [inputCss, setInputCss] = useState('');
// // //     const [beautifiedCss, setBeautifiedCss] = useState('');
// // //     const [error, setError] = useState('');

// // //     const handleBeautify = () => {
// // //         try {
// // //             if (!inputCss.trim()) {
// // //                 setError('Please enter some CSS to beautify.');
// // //                 setBeautifiedCss('');
// // //                 return;
// // //             }
    
// // //             // Improved CSS beautification logic
// // //             const beautified = inputCss
// // //                 .replace(/\/\*[\s\S]*?\*\//g, match => match.replace(/\n/g, '')) // Preserve multiline comments
// // //                 .replace(/([{}:;])\s*/g, '$1\n') // Add newline after {, }, :, and ;
// // //                 .replace(/;\s*([^}\s])/g, ';\n$1') // Ensure newline after ; except before }
// // //                 .replace(/,\s*/g, ',\n') // Add newline after commas
// // //                 .replace(/\n\s*\n/g, '\n') // Remove extra blank lines
// // //                 .replace(/^\s+/gm, '    ') // Add 4 spaces indentation
// // //                 .replace(/\}\s*(.+)/g, '}\n\n$1') // Add extra newline between rules
// // //                 .trim();
    
// // //             setBeautifiedCss(beautified);
// // //             setError('');
// // //         } catch (err) {
// // //             console.error('Error during beautification:', err);
// // //             setError('Error in CSS syntax or beautification process.');
// // //             setBeautifiedCss('');
// // //         }
// // //     };

// // //     // const handleBeautify = () => {
// // //     //     try {
// // //     //         if (!inputCss.trim()) {
// // //     //             setError('Please enter some CSS to beautify.');
// // //     //             setBeautifiedCss('');
// // //     //             return;
// // //     //         }

// // //     //         // Basic CSS beautification logic
// // //     //         const beautified = inputCss
// // //     //             .replace(/\s*{\s*/g, ' {\n    ') // Add newline after opening brace
// // //     //             .replace(/;\s*/g, ';\n    ') // Add newline after semicolons
// // //     //             .replace(/\s*}\s*/g, '\n}\n\n') // Add newlines around closing brace
// // //     //             .replace(/\n\s*\n/g, '\n') // Remove extra blank lines
// // //     //             .trim(); // Remove leading/trailing whitespace

// // //     //         setBeautifiedCss(beautified);
// // //     //         setError('');
// // //     //     } catch (err) {
// // //     //         console.error('Error during beautification:', err);
// // //     //         setError('Error in CSS syntax or beautification process.');
// // //     //         setBeautifiedCss('');
// // //     //     }
// // //     // };

// // //     const handleCopy = () => {
// // //         if (!beautifiedCss) {
// // //             setError('Nothing to copy.');
// // //             return;
// // //         }
// // //         navigator.clipboard.writeText(beautifiedCss)
// // //             .then(() => {
// // //                 setError('Copied to clipboard!');
// // //                 setTimeout(() => setError(''), 2000);
// // //             })
// // //             .catch(err => {
// // //                 setError('Failed to copy text.');
// // //                 console.error('Failed to copy text:', err);
// // //             });
// // //     };

// // //     const handleReset = () => {
// // //         setInputCss('');
// // //         setBeautifiedCss('');
// // //         setError('');
// // //     };

// // //     return (
// // //         <div className={styles.container}>
// // //             <h1>CSS Beautifier</h1>
// // //             <div className={styles.inputContainer}>
// // //                 <textarea
// // //                     className={styles.textarea}
// // //                     placeholder="Enter your CSS here..."
// // //                     value={inputCss}
// // //                     onChange={(e) => setInputCss(e.target.value)}
// // //                 />
// // //                 <button className={styles.button} onClick={handleBeautify}>Beautify CSS</button>
// // //             </div>
// // //             <div className={styles.outputContainer}>
// // //                 <textarea
// // //                     className={styles.textarea}
// // //                     value={beautifiedCss}
// // //                     readOnly
// // //                 />
// // //                 <div className={styles.buttonGroup}>
// // //                     <button className={styles.button} onClick={handleCopy}>Copy</button>
// // //                     <button className={styles.button} onClick={handleReset}>Reset</button>
// // //                 </div>
// // //             </div>
// // //             {error && <p className={styles.error}>{error}</p>}
// // //         </div>
// // //     );
// // // }

// // // export default CSSBeautifier;
// // 'use client';

// // import { useState } from 'react';
// // import styles from './CSSBeautifier.module.css';

// // function CSSBeautifier() {
// //     const [inputCss, setInputCss] = useState('');
// //     const [beautifiedCss, setBeautifiedCss] = useState('');
// //     const [error, setError] = useState('');

// //     const beautifyCSS = (css) => {
// //         const rules = css.split('}');
// //         return rules.map(rule => {
// //             if (!rule.trim()) return '';
// //             const [selector, declarations] = rule.split('{');
// //             if (!declarations) return rule + '}';
// //             const formattedDeclarations = declarations.split(';')
// //                 .map(decl => decl.trim())
// //                 .filter(decl => decl)
// //                 .map(decl => `    ${decl};`)
// //                 .join('\n');
// //             return `${selector.trim()} {\n${formattedDeclarations}\n}\n`;
// //         }).join('\n').trim();
// //     };

// //     const handleBeautify = () => {
// //         try {
// //             if (!inputCss.trim()) {
// //                 setError('Please enter some CSS to beautify.');
// //                 setBeautifiedCss('');
// //                 return;
// //             }
// //             const beautified = beautifyCSS(inputCss);
// //             setBeautifiedCss(beautified);
// //             setError('');
// //         } catch (err) {
// //             console.error('Error during beautification:', err);
// //             setError('Error in CSS syntax or beautification process.');
// //             setBeautifiedCss('');
// //         }
// //     };

// //     const handleCopy = () => {
// //         if (!beautifiedCss) {
// //             setError('Nothing to copy.');
// //             return;
// //         }
// //         navigator.clipboard.writeText(beautifiedCss)
// //             .then(() => {
// //                 setError('Copied to clipboard!');
// //                 setTimeout(() => setError(''), 2000);
// //             })
// //             .catch(err => {
// //                 setError('Failed to copy text.');
// //                 console.error('Failed to copy text:', err);
// //             });
// //     };

// //     const handleReset = () => {
// //         setInputCss('');
// //         setBeautifiedCss('');
// //         setError('');
// //     };

// //     return (
// //         <div className={styles.container}>
// //             <h1>CSS Beautifier</h1>
// //             <div className={styles.inputContainer}>
// //                 <textarea
// //                     className={styles.textarea}
// //                     placeholder="Enter your CSS here..."
// //                     value={inputCss}
// //                     onChange={(e) => setInputCss(e.target.value)}
// //                 />
// //                 <button className={styles.button} onClick={handleBeautify}>Beautify CSS</button>
// //             </div>
// //             <div className={styles.outputContainer}>
// //                 <textarea
// //                     className={styles.textarea}
// //                     value={beautifiedCss}
// //                     readOnly
// //                 />
// //                 <div className={styles.buttonGroup}>
// //                     <button className={styles.button} onClick={handleCopy}>Copy</button>
// //                     <button className={styles.button} onClick={handleReset}>Reset</button>
// //                 </div>
// //             </div>
// //             {error && <p className={styles.error}>{error}</p>}
// //         </div>
// //     );
// // }

// // export default CSSBeautifier;
// 'use client';

// import { useState } from 'react';
// import styles from './CSSBeautifier.module.css';

// function CSSBeautifier() {
//     const [inputCss, setInputCss] = useState('');
//     const [beautifiedCss, setBeautifiedCss] = useState('');
//     const [error, setError] = useState('');

//     // const beautifyCSS = (css) => {
//     //     // Remove all existing whitespace
//     //     css = css.replace(/\s+/g, ' ').trim();

//     //     // Add newlines and indentation
//     //     css = css.replace(/\s*{\s*/g, ' {\n    ');
//     //     css = css.replace(/;\s*/g, ';\n    ');
//     //     css = css.replace(/\s*}\s*/g, '\n}\n\n');

//     //     // Handle pseudo-classes and media queries
//     //     css = css.replace(/(@media[^{]+){\s*/g, '$1{\n    ');
//     //     css = css.replace(/([:]+[a-zA-Z-]+)\s*{/g, '$1 {');

//     //     // Clean up extra whitespace
//     //     css = css.replace(/^\s+/gm, '');
        
//     //     return css.trim();
//     // };

//     // const beautifyCSS = (css) => {
//     //     // Remove multiple spaces and newlines
//     //     css = css.replace(/\s+/g, ' ').trim();
    
//     //     // Add newlines after specific characters and indent
//     //     css = css.replace(/([{}])/g, '$1\n')
//     //              .replace(/;(?!})/g, ';\n')
//     //              .replace(/\/\*.*?\*\//g, match => `\n${match}\n`)
//     //              .replace(/\s*([{}:;])\s*/g, '$1')
//     //              .replace(/\n+/g, '\n')
//     //              .split('\n')
//     //              .map(line => line.trim())
//     //              .filter(line => line)
//     //              .map(line => line.startsWith('}') ? line : '    ' + line)
//     //              .join('\n');
    
//     //     // Handle pseudo-classes
//     //     css = css.replace(/([a-z-]+:)([a-z-]+)({)/gi, '$1$2 $3');
    
//     //     return css.trim();
//     // };
    
//     // const beautifyCSS = (css) => {
//     //     // Remove newlines and extra spaces
//     //     css = css.replace(/\s+/g, ' ').trim();
    
//     //     // Split into rules
//     //     const rules = css.split('}');
    
//     //     return rules.map(rule => {
//     //         if (!rule.trim()) return '';
    
//     //         // Split selector from declarations
//     //         const [selector, declarations] = rule.split('{');
    
//     //         if (!declarations) return rule + '}';
    
//     //         // Format declarations
//     //         const formattedDeclarations = declarations.split(';')
//     //             .map(decl => decl.trim())
//     //             .filter(decl => decl)
//     //             .map(decl => `    ${decl};`)
//     //             .join('\n');
    
//     //         // Reassemble the rule
//     //         return `${selector.trim()} {\n${formattedDeclarations}\n}\n`;
//     //     }).join('\n').trim();
//     // };
    
//     // const beautifyCSS = (css) => {
//     //     // Remove extra whitespace and line breaks
//     //     css = css.replace(/\s+/g, ' ').trim();
    
//     //     // Split into rules
//     //     const rules = css.split('}');
    
//     //     return rules.map(rule => {
//     //         if (!rule.trim()) return '';
    
//     //         // Handle comments
//     //         const commentRegex = /\/\*[\s\S]*?\*\//g;
//     //         const comments = rule.match(commentRegex) || [];
//     //         rule = rule.replace(commentRegex, '@@COMMENT@@');
    
//     //         // Split selector from declarations
//     //         let [selector, declarations] = rule.split('{');
    
//     //         if (!declarations) return rule + '}';
    
//     //         // Format declarations
//     //         declarations = declarations.split(';')
//     //             .map(decl => decl.trim())
//     //             .filter(decl => decl)
//     //             .map(decl => `    ${decl};`)
//     //             .join('\n');
    
//     //         // Reinsert comments
//     //         let commentIndex = 0;
//     //         declarations = declarations.replace(/@@COMMENT@@/g, () => `\n    ${comments[commentIndex++]}\n`);
    
//     //         // Reassemble the rule
//     //         return `${selector.trim()} {\n${declarations}\n}\n`;
//     //     }).join('\n').trim();
//     // };

//     // function beautifyCSS(css) {
//     //     // Remove all whitespace
//     //     css = css.replace(/\s+/g, ' ').trim();
    
//     //     // Function to handle indentation
//     //     const indent = (str, spaces) => str.split('\n').map(line => ' '.repeat(spaces) + line).join('\n');
    
//     //     // Process the CSS
//     //     let beautified = '';
//     //     let depth = 0;
//     //     let inComment = false;
//     //     let inSelector = true;
    
//     //     for (let i = 0; i < css.length; i++) {
//     //         let char = css[i];
//     //         let nextChar = css[i + 1] || '';
    
//     //         if (inComment) {
//     //             beautified += char;
//     //             if (char === '*' && nextChar === '/') {
//     //                 inComment = false;
//     //                 beautified += '/\n';
//     //                 i++;
//     //             }
//     //         } else if (char === '/' && nextChar === '*') {
//     //             inComment = true;
//     //             beautified += '\n' + indent('/*', depth * 4);
//     //         } else if (char === '{') {
//     //             inSelector = false;
//     //             beautified += ' {\n';
//     //             depth++;
//     //         } else if (char === '}') {
//     //             depth--;
//     //             beautified += '\n' + indent('}', depth * 4) + '\n';
//     //             inSelector = true;
//     //         } else if (char === ';') {
//     //             beautified += ';\n';
//     //         } else if (char === ':' && !inSelector) {
//     //             beautified += ': ';
//     //         } else {
//     //             if (inSelector && beautified.endsWith('\n')) {
//     //                 beautified += indent('', depth * 4);
//     //             }
//     //             beautified += char;
//     //         }
//     //     }
    
//     //     // Clean up extra newlines
//     //     beautified = beautified.replace(/\n\s*\n/g, '\n');
    
//     //     return beautified.trim();
//     // }
    
//     // function beautifyCSS(css) {
//     //     // Remove all whitespace
//     //     css = css.replace(/\s+/g, ' ').trim();
    
//     //     // Function to handle indentation
//     //     const indent = (str, spaces) => ' '.repeat(spaces) + str;
    
//     //     // Process the CSS
//     //     let beautified = '';
//     //     let depth = 0;
//     //     let inComment = false;
//     //     let buffer = '';
    
//     //     for (let i = 0; i < css.length; i++) {
//     //         let char = css[i];
//     //         let nextChar = css[i + 1] || '';
    
//     //         if (inComment) {
//     //             buffer += char;
//     //             if (char === '*' && nextChar === '/') {
//     //                 beautified += indent(buffer + '/', depth * 4) + '\n';
//     //                 buffer = '';
//     //                 inComment = false;
//     //                 i++;
//     //             }
//     //         } else if (char === '/' && nextChar === '*') {
//     //             inComment = true;
//     //             if (buffer.trim()) {
//     //                 beautified += indent(buffer.trim(), depth * 4) + '\n';
//     //                 buffer = '';
//     //             }
//     //             buffer += '/*';
//     //             i++;
//     //         } else if (char === '{') {
//     //             beautified += indent(buffer.trim() + ' {', depth * 4) + '\n';
//     //             buffer = '';
//     //             depth++;
//     //         } else if (char === '}') {
//     //             if (buffer.trim()) {
//     //                 beautified += indent(buffer.trim() + ';', depth * 4) + '\n';
//     //                 buffer = '';
//     //             }
//     //             depth--;
//     //             beautified += indent('}', depth * 4) + '\n\n';
//     //         } else if (char === ';') {
//     //             beautified += indent(buffer.trim() + ';', depth * 4) + '\n';
//     //             buffer = '';
//     //         } else {
//     //             buffer += char;
//     //         }
//     //     }
    
//     //     // Add any remaining buffer content
//     //     if (buffer.trim()) {
//     //         beautified += indent(buffer.trim(), depth * 4);
//     //     }
    
//     //     return beautified.trim();
//     // }
    
//     function beautifyCSS(css) {
//         // Remove all whitespace and deduplicate the content
//         css = [...new Set(css.replace(/\s+/g, ' ').trim().split('}'))].join('}');
    
//         const indent = (str, spaces) => ' '.repeat(spaces) + str;
    
//         let beautified = '';
//         let depth = 0;
//         let inComment = false;
//         let buffer = '';
    
//         for (let i = 0; i < css.length; i++) {
//             let char = css[i];
//             let nextChar = css[i + 1] || '';
    
//             if (inComment) {
//                 buffer += char;
//                 if (char === '*' && nextChar === '/') {
//                     beautified += indent('/* ' + buffer.slice(2, -1).trim() + ' */', depth * 4) + '\n';
//                     buffer = '';
//                     inComment = false;
//                     i++;
//                 }
//             } else if (char === '/' && nextChar === '*') {
//                 inComment = true;
//                 if (buffer.trim()) {
//                     beautified += indent(buffer.trim(), depth * 4) + '\n';
//                     buffer = '';
//                 }
//                 buffer = '/*';
//                 i++;
//             } else if (char === '{') {
//                 beautified += indent(buffer.trim() + ' {', depth * 4) + '\n';
//                 buffer = '';
//                 depth++;
//             } else if (char === '}') {
//                 if (buffer.trim()) {
//                     beautified += indent(buffer.trim() + ';', depth * 4) + '\n';
//                     buffer = '';
//                 }
//                 depth--;
//                 beautified += indent('}', depth * 4) + '\n\n';
//             } else if (char === ';') {
//                 beautified += indent(buffer.trim() + ';', depth * 4) + '\n';
//                 buffer = '';
//             } else {
//                 buffer += char;
//             }
//         }
    
//         // Add any remaining buffer content
//         if (buffer.trim()) {
//             beautified += indent(buffer.trim(), depth * 4);
//         }
    
//         // Fix pseudo-class selectors
//         beautified = beautified.replace(/(\w+)\s*:\s*(\w+)/g, '$1:$2');
    
//         return beautified.trim();
//     }
    
//     const handleBeautify = () => {
//         try {
//             if (!inputCss.trim()) {
//                 setError('Please enter some CSS to beautify.');
//                 setBeautifiedCss('');
//                 return;
//             }
//             const beautified = beautifyCSS(inputCss);
//             setBeautifiedCss(beautified);
//             setError('');
//         } catch (err) {
//             console.error('Error during beautification:', err);
//             setError('Error in CSS syntax or beautification process.');
//             setBeautifiedCss('');
//         }
//     };

//     const handleCopy = () => {
//         if (!beautifiedCss) {
//             setError('Nothing to copy.');
//             return;
//         }
//         navigator.clipboard.writeText(beautifiedCss)
//             .then(() => {
//                 setError('Copied to clipboard!');
//                 setTimeout(() => setError(''), 2000);
//             })
//             .catch(err => {
//                 setError('Failed to copy text.');
//                 console.error('Failed to copy text:', err);
//             });
//     };

//     const handleReset = () => {
//         setInputCss('');
//         setBeautifiedCss('');
//         setError('');
//     };

//     return (
//         <div className={styles.container}>
//             <h1>CSS Beautifier</h1>
//             <div className={styles.inputContainer}>
//                 <textarea
//                     className={styles.textarea}
//                     placeholder="Enter your CSS here..."
//                     value={inputCss}
//                     onChange={(e) => setInputCss(e.target.value)}
//                 />
//                 <button className={styles.button} onClick={handleBeautify}>Beautify CSS</button>
//             </div>
//             <div className={styles.outputContainer}>
//                 <textarea
//                     className={styles.textarea}
//                     value={beautifiedCss}
//                     readOnly
//                 />
//                 <div className={styles.buttonGroup}>
//                     <button className={styles.button} onClick={handleCopy}>Copy</button>
//                     <button className={styles.button} onClick={handleReset}>Reset</button>
//                 </div>
//             </div>
//             {error && <p className={styles.error}>{error}</p>}
//         </div>
//     );
// }

// export default CSSBeautifier;
'use client';

import { useState } from 'react';
import styles from './CSSBeautifier.module.css';

// function beautifyCSS(css) {
//     // Preserve initial comments
//     const initialComments = css.match(/^\/\*[\s\S]*?\*\//);
//     let beautified = initialComments ? initialComments[0] + '\n\n' : '';
    
//     // Remove comments temporarily
//     css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    
//     // Split into rules
//     const rules = css.split(/(?<=})/);
    
//     rules.forEach(rule => {
//         rule = rule.trim();
//         if (!rule) return;

//         const [selector, declarations] = rule.split('{');
//         if (!declarations) return;

//         beautified += `${selector.trim()} {\n`;

//         declarations.split(';').forEach(declaration => {
//             declaration = declaration.trim();
//             if (!declaration) return;
//             if (declaration.endsWith('}')) declaration = declaration.slice(0, -1).trim();
            
//             const [property, value] = declaration.split(':');
//             if (!value) return;
            
//             beautified += `    ${property.trim()}: ${value.trim()};\n`;
//         });

//         beautified += '}\n\n';
//     });

//     return beautified.trim();
// }

// function beautifyCSS(css) {
//     // Remove all line breaks and extra spaces
//     css = css.replace(/\s+/g, ' ').trim();

//     // Split into rules
//     const rules = css.split('}');

//     let beautified = '';

//     rules.forEach(rule => {
//         if (!rule.trim()) return;

//         const [selector, declarations] = rule.split('{');

//         // Add selector
//         beautified += `${selector.trim()} {\n`;

//         // Process declarations
//         const declarationList = declarations.split(';');
//         declarationList.forEach(declaration => {
//             declaration = declaration.trim();
//             if (!declaration) return;

//             const [property, value] = declaration.split(':');
//             if (!value) return;

//             // Handle multi-value properties like font-family
//             const formattedValue = value.trim().replace(/,\s+/g, ', ');
//             beautified += `    ${property.trim()}: ${formattedValue};\n`;
//         });

//         beautified += '}\n\n';
//     });

//     // Fix pseudo-class selectors
//     beautified = beautified.replace(/(\w+)\s*:\s*(\w+)/g, '$1:$2');

//     return beautified.trim();
// }

// function beautifyCSS(css) {
//     // Preserve initial comments
//     const initialComments = css.match(/^\/\*[\s\S]*?\*\//);
//     let beautified = initialComments ? initialComments[0] + '\n\n' : '';

//     // Remove all comments temporarily
//     css = css.replace(/\/\*[\s\S]*?\*\//g, '');

//     // Split into rules
//     const rules = css.split('}');

//     rules.forEach(rule => {
//         rule = rule.trim();
//         if (!rule) return;

//         const [selector, declarations] = rule.split('{');
//         if (!declarations) return;

//         beautified += `${selector.trim()} {\n`;

//         const declarationList = declarations.split(';');
//         declarationList.forEach(declaration => {
//             declaration = declaration.trim();
//             if (!declaration) return;

//             const [property, value] = declaration.split(':');
//             if (!value) return;

//             beautified += `    ${property.trim()}: ${value.trim()};\n`;
//         });

//         beautified += '}\n\n';
//     });

//     // Reinsert comments
//     const comments = css.match(/\/\*[\s\S]*?\*\//g) || [];
//     comments.forEach(comment => {
//         beautified = beautified.replace(/}\n\n/, `}\n\n${comment}\n`);
//     });

//     // Fix pseudo-class selectors
//     beautified = beautified.replace(/(\w+)\s*:\s*(\w+)/g, '$1:$2');

//     return beautified.trim();
// }


// function beautifyCSS(css) {
//     // Remove all line breaks and extra spaces
//     css = css.replace(/\s+/g, ' ').trim();

//     // Split into rules
//     const rules = css.split('}');

//     let beautified = '';

//     rules.forEach(rule => {
//         if (!rule.trim()) return;

//         const [selector, declarations] = rule.split('{');

//         // Add selector
//         beautified += `${selector.trim()} {\n`;

//         // Process declarations
//         const declarationList = declarations.split(';');
//         declarationList.forEach(declaration => {
//             declaration = declaration.trim();
//             if (!declaration) return;

//             const [property, value] = declaration.split(':');
//             if (!value) return;

//             beautified += `    ${property.trim()}: ${value.trim()};\n`;
//         });

//         beautified += '}\n\n';
//     });

//     // Remove extra newline at the end
//     beautified = beautified.trim();

//     return beautified;
// }


// function beautifyCSS(css) {
//     // Preserve whitespace in certain values
//     css = css.replace(/: *([^;]*)\b(url\([^)]*\))\b([^;]*)/g, ': $1\u0000$2\u0000$3');

//     // Remove existing line breaks and extra spaces
//     css = css.replace(/\s+/g, ' ');

//     // Preserve comments
//     const comments = [];
//     css = css.replace(/\/\*[\s\S]*?\*\//g, match => {
//         comments.push(match);
//         return '\u0001';
//     });

//     let depth = 0;
//     let beautified = '';

//     // Process each character
//     for (let i = 0; i < css.length; i++) {
//         const char = css[i];

//         switch (char) {
//             case '{':
//                 beautified += ' {\n' + '    '.repeat(++depth);
//                 break;
//             case '}':
//                 beautified = beautified.trim() + '\n' + '    '.repeat(--depth) + '}\n\n';
//                 break;
//             case ';':
//                 beautified += ';\n' + '    '.repeat(depth);
//                 break;
//             case '\u0001':
//                 beautified += comments.shift() + '\n' + '    '.repeat(depth);
//                 break;
//             default:
//                 beautified += char;
//         }
//     }

//     // Fix pseudo-class and pseudo-element syntax
//     beautified = beautified.replace(/([a-z-]+(:\S+)?)(\s+)(?=:)/g, '$1');

//     // Restore preserved whitespace
//     beautified = beautified.replace(/\u0000/g, ' ');

//     // Add space after property colon
//     beautified = beautified.replace(/:\s*/g, ': ');

//     // Handle at-rules
//     beautified = beautified.replace(/@(media|keyframes|supports|document)([^{]+){\s*/g, '@$1$2 {\n');

//     // Remove extra newlines
//     beautified = beautified.replace(/\n{3,}/g, '\n\n');

//     return beautified.trim();
// }

// function beautifyCSS(css) {
//     // Preserve comments
//     const comments = [];
//     css = css.replace(/\/\*[\s\S]*?\*\//g, match => {
//         comments.push(match);
//         return '/*COMMENT*/';
//     });

//     // Remove all line breaks and extra spaces, but preserve spaces in selectors
//     css = css.replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').trim();

//     // Split into rules
//     const rules = css.split('}');

//     let beautified = '';
//     let indentLevel = 0;

//     rules.forEach(rule => {
//         if (!rule.trim()) return;

//         const [selector, declarations] = rule.split('{');

//         // Handle at-rules
//         if (selector.trim().startsWith('@')) {
//             beautified += `${selector.trim()} {\n`;
//             indentLevel++;
//         } else {
//             // Add selector
//             beautified += `${'    '.repeat(indentLevel)}${selector.trim()} {\n`;
//         }

//         // Process declarations
//         const declarationList = declarations.split(';');
//         declarationList.forEach(declaration => {
//             declaration = declaration.trim();
//             if (!declaration) return;

//             const [property, value] = declaration.split(':');
//             if (!value) return;

//             beautified += `${'    '.repeat(indentLevel + 1)}${property.trim()}: ${value.trim()};\n`;
//         });

//         beautified += `${'    '.repeat(indentLevel)}}\n\n`;

//         // Close at-rule block if necessary
//         if (selector.trim().startsWith('@') && !selector.trim().startsWith('@font-face')) {
//             indentLevel--;
//             beautified += '}\n\n';
//         }
//     });

//     // Fix pseudo-class and pseudo-element selectors
//     beautified = beautified.replace(/([a-z-]+)\s*(:+)\s*([a-z-]+)/g, '$1$2$3');

//     // Reinsert comments
//     beautified = beautified.replace(/\/\*COMMENT\*\//g, () => comments.shift() + '\n');

//     return beautified.trim();
// }

// function beautifyCSS(css) {
//     // Remove all line breaks and extra spaces
//     css = css.replace(/\s+/g, ' ').trim();

//     // Split into rules
//     const rules = css.split('}');

//     let beautified = '';
//     let indentLevel = 0;

//     rules.forEach(rule => {
//         if (!rule.trim()) return;

//         const [selector, declarations] = rule.split('{');

//         // Handle media queries and other at-rules
//         if (selector.trim().startsWith('@')) {
//             beautified += `${selector.trim()} {\n`;
//             indentLevel++;
//         } else {
//             beautified += `${'    '.repeat(indentLevel)}${selector.trim()} {\n`;
//         }

//         // Process declarations
//         if (declarations) {
//             const declarationList = declarations.split(';');
//             declarationList.forEach(declaration => {
//                 declaration = declaration.trim();
//                 if (!declaration) return;

//                 const [property, value] = declaration.split(':');
//                 if (!value) return;

//                 beautified += `${'    '.repeat(indentLevel + 1)}${property.trim()}: ${value.trim()};\n`;
//             });
//         }

//         beautified += `${'    '.repeat(indentLevel)}}\n\n`;

//         // Close at-rule block if necessary
//         if (selector.trim().startsWith('@') && !selector.trim().startsWith('@font-face')) {
//             indentLevel--;
//         }
//     });

//     // Fix pseudo-class and pseudo-element selectors
//     beautified = beautified.replace(/([a-z-]+)\s*(:+)\s*([a-z-]+)/g, '$1$2$3');

//     return beautified.trim();
// }

// function beautifyCSS(css) {
//     // Preserve comments
//     const comments = [];
//     css = css.replace(/\/\*[\s\S]*?\*\//g, match => {
//         comments.push(match);
//         return '/*COMMENT*/';
//     });

//     // Remove all line breaks and extra spaces
//     css = css.replace(/\s+/g, ' ').trim();

//     // Split into rules
//     const rules = css.split('}');

//     let beautified = '';
//     let indentLevel = 0;

//     rules.forEach(rule => {
//         if (!rule.trim()) return;

//         let [selector, declarations] = rule.split('{');
//         selector = selector.trim();

//         if (selector.startsWith('@media')) {
//             beautified += `${selector} {\n`;
//             indentLevel++;
//         } else {
//             beautified += `${'    '.repeat(indentLevel)}${selector} {\n`;
//         }

//         if (declarations) {
//             declarations.split(';').forEach(declaration => {
//                 declaration = declaration.trim();
//                 if (!declaration) return;
                
//                 let [property, value] = declaration.split(':');
//                 if (!value) return;
                
//                 beautified += `${'    '.repeat(indentLevel + 1)}${property.trim()}: ${value.trim()};\n`;
//             });
//         }

//         beautified += `${'    '.repeat(indentLevel)}}\n\n`;

//         if (selector.startsWith('@media')) {
//             indentLevel--;
//         }
//     });

//     // Fix pseudo-class selectors
//     beautified = beautified.replace(/([a-z-]+)\s*:\s*([a-z-]+)/g, '$1:$2');

//     // Reinsert comments
//     beautified = beautified.replace(/\/\*COMMENT\*\//g, () => comments.shift() + '\n');

//     return beautified.trim();
// }


// function beautifyCSS(css) {
//     const lines = css.split('\n');
//     let beautified = '';
//     let indentLevel = 0;
//     let inMedia = false;

//     lines.forEach(line => {
//         line = line.trim();
//         if (!line) return;

//         if (line.startsWith('/*')) {
//             beautified += line + '\n';
//             return;
//         }

//         if (line.includes('{')) {
//             if (line.startsWith('@media')) {
//                 inMedia = true;
//                 beautified += line + '\n';
//             } else {
//                 beautified += '    '.repeat(indentLevel) + line + '\n';
//             }
//             indentLevel++;
//         } else if (line.includes('}')) {
//             indentLevel--;
//             beautified += '    '.repeat(indentLevel) + line + '\n';
//             if (inMedia && indentLevel === 0) {
//                 inMedia = false;
//                 beautified += '\n';
//             }
//         } else {
//             const [prop, value] = line.split(':');
//             beautified += '    '.repeat(indentLevel) + prop.trim() + ': ' + value.trim() + ';\n';
//         }
//     });

//     return beautified.trim();
// }

// function beautifyCSS(css) {
//     // Preserve comments
//     const comments = [];
//     css = css.replace(/\/\*[\s\S]*?\*\//g, match => {
//         comments.push(match);
//         return '/*COMMENT*/';
//     });

//     // Remove all newlines and extra spaces
//     css = css.replace(/\s+/g, ' ').trim();

//     // Split into rules
//     const rules = css.split('}');

//     let beautified = '';
//     let indentLevel = 0;

//     rules.forEach(rule => {
//         if (!rule.trim()) return;

//         let [selector, declarations] = rule.split('{');
//         selector = selector.trim();

//         if (selector.startsWith('@media')) {
//             beautified += `${selector} {\n`;
//             indentLevel++;
//         } else {
//             beautified += `${'    '.repeat(indentLevel)}${selector} {\n`;
//         }

//         if (declarations) {
//             declarations.split(';').forEach(declaration => {
//                 declaration = declaration.trim();
//                 if (!declaration) return;
                
//                 let [property, value] = declaration.split(':');
//                 if (!value) return;
                
//                 beautified += `${'    '.repeat(indentLevel + 1)}${property.trim()}: ${value.trim()};\n`;
//             });
//         }

//         beautified += `${'    '.repeat(indentLevel)}}\n\n`;

//         if (selector.startsWith('@media')) {
//             indentLevel--;
//         }
//     });

//     // Fix pseudo-class and pseudo-element selectors
//     beautified = beautified.replace(/([a-z-]+)\s*(:+)\s*([a-z-]+)/g, '$1$2$3');

//     // Reinsert comments
//     beautified = beautified.replace(/\/\*COMMENT\*\//g, () => comments.shift() + '\n');

//     return beautified.trim();
// }


function beautifyCSS(css) {
    // Remove newlines and extra spaces, but keep spaces after colons
    css = css.replace(/\s*([{}:;,])\s*/g, '$1').replace(/;\s*}/g, '}').replace(/:\s+/g, ': ');
    
    let beautified = '';
    let indentLevel = 0;
    let inMediaQuery = false;
    
    for (let i = 0; i < css.length; i++) {
        let char = css[i];
        
        if (char === '{') {
            if (css.substring(i - 7, i).includes('@media')) {
                inMediaQuery = true;
                beautified += ' {\n';
            } else {
                beautified += ' {\n';
                indentLevel++;
            }
        } else if (char === '}') {
            indentLevel = Math.max(0, indentLevel - 1);
            if (inMediaQuery && indentLevel === 0) {
                inMediaQuery = false;
            }
            beautified += '\n' + '    '.repeat(indentLevel) + '}\n\n';
        } else if (char === ';') {
            beautified += ';\n';
        } else {
            if (beautified.endsWith('\n') && char !== '@') {
                beautified += '    '.repeat(indentLevel);
            }
            beautified += char;
        }
    }
    
    // Fix pseudo-classes and media queries
    beautified = beautified.replace(/([a-z-]+):/g, '$1:')
                           .replace(/@media[^{]+{/g, match => match.trim() + '\n');
    
    return beautified.trim();
}

function CSSBeautifier() {
    const [inputCss, setInputCss] = useState('');
    const [beautifiedCss, setBeautifiedCss] = useState('');
    const [error, setError] = useState('');

    const handleBeautify = () => {
        try {
            if (!inputCss.trim()) {
                setError('Please enter some CSS to beautify.');
                setBeautifiedCss('');
                return;
            }
            const beautified = beautifyCSS(inputCss);
            setBeautifiedCss(beautified);
            setError('');
        } catch (err) {
            console.error('Error during beautification:', err);
            setError('Error in CSS syntax or beautification process: ' + err.message);
            setBeautifiedCss('');
        }
    };

    const handleCopy = () => {
        if (!beautifiedCss) {
            setError('Nothing to copy.');
            return;
        }
        navigator.clipboard.writeText(beautifiedCss)
            .then(() => {
                setError('Copied to clipboard!');
                setTimeout(() => setError(''), 2000);
            })
            .catch(err => {
                setError('Failed to copy text: ' + err.message);
                console.error('Failed to copy text:', err);
            });
    };

    const handleReset = () => {
        setInputCss('');
        setBeautifiedCss('');
        setError('');
    };

    return (
        <div className={styles.container}>
            <h1>CSS Beautifier</h1>
            <div className={styles.inputContainer}>
                <textarea
                    className={styles.textarea}
                    placeholder="Enter your CSS here..."
                    value={inputCss}
                    onChange={(e) => setInputCss(e.target.value)}
                />
                <button className={styles.button} onClick={handleBeautify}>Beautify CSS</button>
            </div>
            <div className={styles.outputContainer}>
                <textarea
                    className={styles.textarea}
                    value={beautifiedCss}
                    readOnly
                />
                <div className={styles.buttonGroup}>
                    <button className={styles.button} onClick={handleCopy}>Copy</button>
                    <button className={styles.button} onClick={handleReset}>Reset</button>
                </div>
            </div>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}

export default CSSBeautifier;