// // // // 'use'
// // // // import { useState } from 'react';

// // // // function CSSMinifier() {
// // // //     const [inputCss, setInputCss] = useState('');
// // // //     const [minifiedCss, setMinifiedCss] = useState('');

// // // //     const handleMinify = () => {
// // // //         const minified = inputCss
// // // //             .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
// // // //             .replace(/\s{2,}/g, ' ') // Reduce whitespace
// // // //             .replace(/\s*([:;{}])\s*/g, '$1') // Remove space before and after specific characters
// // // //             .replace(/\;}/g, '}'); // Remove unnecessary semicolons
// // // //         setMinifiedCss(minified);
// // // //     };

// // // //     return (
// // // //         <div>
// // // //             <textarea
// // // //                 placeholder="Enter your CSS here..."
// // // //                 value={inputCss}
// // // //                 onChange={(e) => setInputCss(e.target.value)}
// // // //                 style={{ width: '300px', height: '100px', margin: '10px' }}
// // // //             />
// // // //             <button onClick={handleMinify}>Minify CSS</button>
// // // //             <textarea
// // // //                 value={minifiedCss}
// // // //                 readOnly
// // // //                 style={{ width: '300px', height: '100px', margin: '10px' }}
// // // //             />
// // // //         </div>
// // // //     );
// // // // }

// // // // export default CSSMinifier;
// // // 'use client'
// // // import { useState } from 'react';

// // // function CSSMinifier() {
// // //     const [inputCss, setInputCss] = useState('');
// // //     const [minifiedCss, setMinifiedCss] = useState('');
// // //     const [copySuccess, setCopySuccess] = useState('');  // State to track copy status

// // //     const handleMinify = () => {
// // //         const minified = inputCss
// // //             .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
// // //             .replace(/\s{2,}/g, ' ') // Reduce whitespace
// // //             .replace(/\s*([:;{}])\s*/g, '$1') // Remove space before and after specific characters
// // //             .replace(/\;}/g, '}'); // Remove unnecessary semicolons
// // //         setMinifiedCss(minified);
// // //         setCopySuccess(''); // Reset copy status on new minification
// // //     };

// // //     const handleCopy = () => {
// // //         navigator.clipboard.writeText(minifiedCss)
// // //             .then(() => {
// // //                 setCopySuccess('Copied!');
// // //                 setTimeout(() => setCopySuccess(''), 2000);  // Reset status after 2 seconds
// // //             })
// // //             .catch(err => console.error('Failed to copy text: ', err));
// // //     };

// // //     return (
// // //         <div>
// // //             <textarea
// // //                 placeholder="Enter your CSS here..."
// // //                 value={inputCss}
// // //                 onChange={(e) => setInputCss(e.target.value)}
// // //                 style={{ width: '300px', height: '100px', margin: '10px' }}
// // //             />
// // //             <button onClick={handleMinify}>Minify CSS</button>
// // //             <textarea
// // //                 value={minifiedCss}
// // //                 readOnly
// // //                 style={{ width: '300px', height: '100px', margin: '10px' }}
// // //             />
// // //             <button onClick={handleCopy}>Copy to Clipboard</button>
// // //             {copySuccess && <p style={{ color: 'green' }}>{copySuccess}</p>}
// // //         </div>
// // //     );
// // // }

// // // export default CSSMinifier;
// 'use client';

// import { useState } from 'react';
// import styles from './CSSMinifier.module.css';

// function CSSMinifier() {
//     const [inputCss, setInputCss] = useState('');
//     const [minifiedCss, setMinifiedCss] = useState('');
//     const [buttonText, setButtonText] = useState('Copy'); // Button text state

//     const handleMinify = () => {
//         const minified = inputCss
//             .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
//             .replace(/\s{2,}/g, ' ')
//             .replace(/\s*([:;{}])\s*/g, '$1')
//             .replace(/\;}/g, '}');
//         setMinifiedCss(minified);
//     };

//     const handleCopy = () => {
//         navigator.clipboard.writeText(minifiedCss)
//             .then(() => {
//                 setButtonText('Copied!');
//                 setTimeout(() => setButtonText('Copy'), 2000); // Change back after 2 seconds
//             })
//             .catch(err => console.error('Failed to copy text: ', err));
//     };

//     return (
//         <div className={styles.container}>
//             <textarea
//                 className={styles.textarea}
//                 placeholder="Enter your CSS here..."
//                 value={inputCss}
//                 onChange={(e) => setInputCss(e.target.value)}
//             />
//             <button className={styles.button} onClick={handleMinify}>Minify CSS</button>
//             <textarea
//                 className={styles.textarea}
//                 value={minifiedCss}
//                 readOnly
//             />
//             <button className={styles.button} onClick={handleCopy}>{buttonText}</button>
//         </div>
//     );
// }

// export default CSSMinifier;
// 'use client';

// import { useState } from 'react';
// import styles from './CSSMinifier.module.css';

// function CSSMinifier() {
//     const [inputCss, setInputCss] = useState('');
//     const [minifiedCss, setMinifiedCss] = useState('');
//     const [buttonText, setButtonText] = useState('Copy');

//     const handleMinify = () => {
//         try {
//             const minified = inputCss
//                 .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
//                 .replace(/\s{2,}/g, ' ') // Reduce whitespace
//                 .replace(/\s*([:;{}])\s*/g, '$1') // Remove space before and after specific characters
//                 .replace(/\;}/g, '}'); // Remove unnecessary semicolons
//             setMinifiedCss(minified);
//             setButtonText('Copy'); // Reset button text if previously copied
//         } catch (err) {
//             console.error('Error during minification:', err);
//             setMinifiedCss('Error in CSS syntax or minification process.');
//         }
//     };

//     const handleCopy = () => {
//         navigator.clipboard.writeText(minifiedCss)
//             .then(() => {
//                 setButtonText('Copied!');
//                 setTimeout(() => setButtonText('Copy'), 2000);
//             })
//             .catch(err => console.error('Failed to copy text:', err));
//     };

//     const handleReset = () => {
//         setInputCss('');
//         setMinifiedCss('');
//         setButtonText('Copy');
//     };

//     return (
//         <div className={styles.container}>
//             <textarea
//                 className={styles.textarea}
//                 placeholder="Enter your CSS here..."
//                 value={inputCss}
//                 onChange={(e) => setInputCss(e.target.value)}
//             />
//             <button className={styles.button} onClick={handleMinify}>Minify CSS</button>
//             <textarea
//                 className={styles.textarea}
//                 value={minifiedCss}
//                 readOnly
//             />
//             <div>
//                 <button className={styles.button} onClick={handleCopy}>{buttonText}</button>
//                 <button className={styles.button} onClick={handleReset}>Reset</button>
//             </div>
//         </div>
//     );
// }

// export default CSSMinifier;
//last version
'use client';

import { useState } from 'react';
import styles from './CSSMinifier.module.css';

function CSSMinifier() {
    const [inputCss, setInputCss] = useState('');
    const [minifiedCss, setMinifiedCss] = useState('');
    const [buttonText, setButtonText] = useState('Copy');
    const [error, setError] = useState(''); 

    const handleMinify = () => {
        try {
            if (!inputCss.trim()) {
                setError('Please enter some CSS to minify.');
                setMinifiedCss('');
                return;
            }
            // More robust regex validation to check for properly formatted CSS blocks
            if (!/\{[\s\S]*?\:.*\;[\s\S]*?\}/.test(inputCss)) {
                setError('Invalid CSS: No valid CSS properties or declarations found.');
                setMinifiedCss('');
                return;
            }
            const minified = inputCss
                .replace(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, '') // Remove comments
                .replace(/\s{2,}/g, ' ') // Reduce whitespace
                .replace(/\s*([:;{}])\s*/g, '$1') // Remove space before and after specific characters
                .replace(/\;}/g, '}'); // Remove unnecessary semicolons
            setMinifiedCss(minified);
            setError(''); // Clear any previous errors
        } catch (err) {
            console.error('Error during minification:', err);
            setError('Error in CSS syntax or minification process.');
            setMinifiedCss('');
        }
    };
    
    // const handleMinify = () => {
    //     try {
    //         if (!inputCss.trim()) {
    //             setError('Please enter some CSS to minify.');
    //             setMinifiedCss('');
    //             return;
    //         }
    //         const minified = inputCss
    //             .replace(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, '') // Improved regex for comments
    //             .replace(/\s{2,}/g, ' ')
    //             .replace(/\s*([:;{}])\s*/g, '$1')
    //             .replace(/\;}/g, '}'); // Remove unnecessary semicolons
    //         setMinifiedCss(minified);
    //         setError(''); // Clear any previous errors
    //     } catch (err) {
    //         console.error('Error during minification:', err);
    //         setError('Error in CSS syntax or minification process.');
    //         setMinifiedCss('');
    //     }
    // };

    const handleCopy = () => {
        if (!minifiedCss) {
            setError('Nothing to copy.');
            return;
        }
        navigator.clipboard.writeText(minifiedCss)
            .then(() => {
                setButtonText('Copied!');
                setTimeout(() => setButtonText('Copy'), 2000);
            })
            .catch(err => {
                setError('Failed to copy text.');
                console.error('Failed to copy text:', err);
            });
    };

    const handleReset = () => {
        setInputCss('');
        setMinifiedCss('');
        setError('');
        setButtonText('Copy');
    };

    // return (
    //     <div className={styles.container}>
    //         <textarea
    //             className={styles.textarea}
    //             placeholder="Enter your CSS here..."
    //             value={inputCss}
    //             onChange={(e) => setInputCss(e.target.value)}
    //         />
    //         <button className={styles.button} onClick={handleMinify}>Minify CSS</button>
    //         <textarea
    //             className={styles.textarea}
    //             value={minifiedCss}
    //             readOnly
    //         />
    //         <div>
    //             <button className={styles.button} onClick={handleCopy}>{buttonText}</button>
    //             <button className={styles.button} onClick={handleReset}>Reset</button>
    //         </div>
    //         {error && <p className={styles.error}>{error}</p>}
    //     </div>
    // );
    // return (
    //     <div className={styles.container}>
    //         <div className={styles.leftPanel}>
    //             <textarea
    //                 className={styles.textarea}
    //                 placeholder="Enter your CSS here..."
    //                 value={inputCss}
    //                 onChange={(e) => setInputCss(e.target.value)}
    //             />
    //             <button className={styles.button} onClick={handleMinify}>Minify CSS</button>
    //             <textarea
    //                 className={styles.textarea}
    //                 value={minifiedCss}
    //                 readOnly
    //             />
    //             <div>
    //                 <button className={styles.button} onClick={handleCopy}>{buttonText}</button>
    //                 <button className={styles.button} onClick={handleReset}>Reset</button>
    //             </div>
    //             {error && <p className={styles.error}>{error}</p>}
    //         </div>
    //         <div className={styles.rightPanel}>
    //             <h2>CSS Minifier Explained</h2>
    //             <p>This tool helps you to compress your CSS code by removing unnecessary spaces, comments, and formatting. The minification process makes your stylesheets lighter and reduces loading time, which is beneficial for website performance.</p>
    //             <p><strong>Features:</strong></p>
    //             <ul>
    //                 <li>Removes comments and unnecessary whitespace.</li>
    //                 <li>Condenses multiple spaces into a single space where appropriate.</li>
    //                 <li>Optimizes CSS for better performance.</li>
    //             </ul>
    //             <p>Simply enter your CSS in the left panel and click "Minify CSS". You can then copy the result or reset to start over.</p>
    //         </div>
    //     </div>
    // );
    
    // return (
    //     <div className={styles.container}>
    //         <div className={styles.leftPanel}>
    //             <div className={styles.leftInput}>
    //             <textarea
    //                 className={styles.textarea}
    //                 placeholder="Enter your CSS here..."
    //                 value={inputCss}
    //                 onChange={(e) => setInputCss(e.target.value)}
    //             />
    //             <button className={styles.button} onClick={handleMinify}>Minify CSS</button>
    //             </div>
                
    //             <div className={styles.rightInput}>
    //             <textarea
    //                 className={styles.textarea}
    //                 value={minifiedCss}
    //                 readOnly
    //             />
    //             <div className={styles.buttonGroup}>
                                 
    //              <button className={styles.button} onClick={handleCopy}>{buttonText}</button>
    //              <button className={styles.button} onClick={handleReset}>Reset</button>
    //              </div>
                
    //             </div>
    //             {error && <p className={styles.error}>{error}</p>}
    //         </div>
    //         <div className={styles.rightPanel}>
    //             <h2>CSS Minifier Explained</h2>
    //             <p>This tool helps you to compress your CSS code by removing unnecessary spaces, comments, and formatting. The minification process makes your stylesheets lighter and reduces loading time, which is beneficial for website performance.</p>
    //             <ul>
    //                 <li>Removes comments and unnecessary whitespace.</li>
    //                 <li>Condenses multiple spaces into a single space where appropriate.</li>
    //                 <li>Optimizes CSS for better performance.</li>
    //             </ul>
    //             <p>Simply enter your CSS in the left panel and click "Minify CSS". You can then copy the result or reset to start over.</p>
    //         </div>
    //     </div>
    // );
    
    return (
        <div className={styles.container}>
            <div className={styles.leftOuter}>
            <div className={styles.leftPanel}>
                <div className={styles.leftInput}>
                    <textarea
                        className={styles.textarea}
                        placeholder="Enter your CSS here..."
                        value={inputCss}
                        onChange={(e) => setInputCss(e.target.value)}
                    />
                    <button className={styles.button} onClick={handleMinify}>Minify CSS</button>
                </div>
                <div className={styles.rightInput}>
                    <textarea
                        className={styles.textarea}
                        value={minifiedCss}
                        readOnly
                    />
                    <div className={styles.buttonGroup}>
                        <button className={styles.button} onClick={handleCopy}>{buttonText}</button>
                        <button className={styles.buttonReset} onClick={handleReset}>Reset</button>
                    </div>
                </div>
                
            </div>
           
            {error && <p className={styles.error}>{error}</p>}  
            </div>
            {/* <div className={styles.rightPanel}>
                <h2>CSS Minifier Explained</h2>
                <p>This tool helps you to compress your CSS code by removing unnecessary spaces, comments, and formatting. The minification process makes your stylesheets lighter and reduces loading time, which is beneficial for website performance.</p>
                <ul>
                    <li>Removes comments and unnecessary whitespace.</li>
                    <li>Condenses multiple spaces into a single space where appropriate.</li>
                    <li>Optimizes CSS for better performance.</li>
                </ul>
                <p>Simply enter your CSS in the left panel and click "Minify CSS". You can then copy the result or reset to start over.</p>
            </div> */}
        </div>
    );
    
}

export default CSSMinifier;
