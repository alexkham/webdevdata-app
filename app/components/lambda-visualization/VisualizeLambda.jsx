// // // // // // // // // // // // 'use client'
// // // // // // // // // // // // import { useState } from 'react';
// // // // // // // // // // // // import './VisualizeLambda.css'

// // // // // // // // // // // // const FunctionBlock = ({ block, explanation }) => (
// // // // // // // // // // // //   <div className="block" title={explanation} style={{ backgroundColor: block.color }}>
// // // // // // // // // // // //     {block.text}
// // // // // // // // // // // //   </div>
// // // // // // // // // // // // );

// // // // // // // // // // // // const FunctionVisualization = ({ blocks }) => (
// // // // // // // // // // // //   <div className="breakdown">
// // // // // // // // // // // //     {blocks.map((block, index) => (
// // // // // // // // // // // //       <FunctionBlock key={index} block={block} />
// // // // // // // // // // // //     ))}
// // // // // // // // // // // //   </div>
// // // // // // // // // // // // );

// // // // // // // // // // // // const VisualizeLambda = () => {
// // // // // // // // // // // //   const [showLambda, setShowLambda] = useState(false);

// // // // // // // // // // // //   const regularFunctionBlocks = [
// // // // // // // // // // // //     { text: 'def', color: 'lightblue', explanation: 'Keyword defining a function' },
// // // // // // // // // // // //     { text: 'my_func', color: 'lightgreen', explanation: 'Function name' },
// // // // // // // // // // // //     { text: '(a, b)', color: 'lightcoral', explanation: 'Function arguments' },
// // // // // // // // // // // //     { text: 'result', color: 'lightyellow', explanation: 'Variable' },
// // // // // // // // // // // //     { text: 'a + b', color: 'lightpink', explanation: 'Logic' },
// // // // // // // // // // // //     { text: 'return result', color: 'lightgray', explanation: 'Return statement' },
// // // // // // // // // // // //   ];

// // // // // // // // // // // //   const lambdaFunctionBlocks = [
// // // // // // // // // // // //     { text: 'lambda', color: 'lightblue', explanation: 'Keyword defining a lambda function' },
// // // // // // // // // // // //     { text: 'a, b', color: 'lightcoral', explanation: 'Lambda function arguments' },
// // // // // // // // // // // //     { text: 'a + b', color: 'lightpink', explanation: 'Lambda expression' },
// // // // // // // // // // // //   ];

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <div>
// // // // // // // // // // // //       <h2>Regular Function</h2>
// // // // // // // // // // // //       <FunctionVisualization blocks={regularFunctionBlocks} />
// // // // // // // // // // // //       <button onClick={() => setShowLambda(!showLambda)}>Show Lambda Transformation</button>
// // // // // // // // // // // //       {showLambda && (
// // // // // // // // // // // //         <>
// // // // // // // // // // // //           <h2>Lambda Function</h2>
// // // // // // // // // // // //           <FunctionVisualization blocks={lambdaFunctionBlocks} />
// // // // // // // // // // // //         </>
// // // // // // // // // // // //       )}
// // // // // // // // // // // //     </div>
// // // // // // // // // // // //   );
// // // // // // // // // // // // };

// // // // // // // // // // // // export default VisualizeLambda;
// // // // // // // // // // // 'use client'
// // // // // // // // // // // import { useState } from 'react';

// // // // // // // // // // // const FunctionBlock = ({ block }) => (
// // // // // // // // // // //   <div className="block" style={{ backgroundColor: block.color }}>
// // // // // // // // // // //     {block.text}
// // // // // // // // // // //     <span className="tooltip">{block.explanation}</span>
// // // // // // // // // // //   </div>
// // // // // // // // // // // );

// // // // // // // // // // // const FunctionVisualization = ({ blocks }) => (
// // // // // // // // // // //   <div className="breakdown">
// // // // // // // // // // //     {blocks.map((block, index) => (
// // // // // // // // // // //       <FunctionBlock key={index} block={block} />
// // // // // // // // // // //     ))}
// // // // // // // // // // //   </div>
// // // // // // // // // // // );

// // // // // // // // // // // const exampleData = {
// // // // // // // // // // //   regularFunction: [
// // // // // // // // // // //     { text: "def", color: "lightblue", explanation: "Keyword defining a function" },
// // // // // // // // // // //     { text: "my_func", color: "lightgreen", explanation: "Function name" },
// // // // // // // // // // //     { text: "(a, b):", color: "lightcoral", explanation: "Function arguments" },
// // // // // // // // // // //     { text: "result", color: "lightyellow", explanation: "Variable name" },
// // // // // // // // // // //     { text: "= a + b", color: "lightpink", explanation: "Logic" },
// // // // // // // // // // //     { text: "return", color: "lightgray", explanation: "Return statement" },
// // // // // // // // // // //     { text: "result", color: "lightyellow", explanation: "Returned value" }
// // // // // // // // // // //   ],
// // // // // // // // // // //   lambdaFunction: [
// // // // // // // // // // //     { text: "lambda", color: "lightblue", explanation: "Keyword defining a lambda function" },
// // // // // // // // // // //     { text: "a, b:", color: "lightcoral", explanation: "Lambda function arguments" },
// // // // // // // // // // //     { text: "a + b", color: "lightpink", explanation: "Lambda expression" }
// // // // // // // // // // //   ]
// // // // // // // // // // // };

// // // // // // // // // // // const VisualizeLambda = () => {
// // // // // // // // // // //   const [showLambda, setShowLambda] = useState(false);

// // // // // // // // // // //   return (
// // // // // // // // // // //     <div>
// // // // // // // // // // //       <h2>Regular Function</h2>
// // // // // // // // // // //       <FunctionVisualization blocks={exampleData.regularFunction} />
// // // // // // // // // // //       <button onClick={() => setShowLambda(!showLambda)}>Show Lambda Transformation</button>
// // // // // // // // // // //       {showLambda && (
// // // // // // // // // // //         <>
// // // // // // // // // // //           <h2>Lambda Function</h2>
// // // // // // // // // // //           <FunctionVisualization blocks={exampleData.lambdaFunction} />
// // // // // // // // // // //         </>
// // // // // // // // // // //       )}
// // // // // // // // // // //     </div>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // export default VisualizeLambda;
// // // // // // // // // // 'use client';

// // // // // // // // // // import { useState } from 'react';

// // // // // // // // // // const FunctionBlock = ({ block }) => (
// // // // // // // // // //   <div className="block" style={{ backgroundColor: block.color }}>
// // // // // // // // // //     {block.text}
// // // // // // // // // //     <span className="tooltip">{block.explanation}</span>
// // // // // // // // // //   </div>
// // // // // // // // // // );

// // // // // // // // // // const FunctionVisualization = ({ blocks }) => (
// // // // // // // // // //   <div className="breakdown">
// // // // // // // // // //     {blocks.map((block, index) => (
// // // // // // // // // //       <FunctionBlock key={index} block={block} />
// // // // // // // // // //     ))}
// // // // // // // // // //   </div>
// // // // // // // // // // );

// // // // // // // // // // const exampleData = {
// // // // // // // // // //   regularFunction: [
// // // // // // // // // //     { text: "def", color: "lightblue", explanation: "Keyword defining a function" },
// // // // // // // // // //     { text: "my_func", color: "lightgreen", explanation: "Function name" },
// // // // // // // // // //     { text: "(a, b):", color: "lightcoral", explanation: "Function arguments" },
// // // // // // // // // //     { text: "result", color: "lightyellow", explanation: "Variable name" },
// // // // // // // // // //     { text: "= a + b", color: "lightpink", explanation: "Logic" },
// // // // // // // // // //     { text: "return", color: "lightgray", explanation: "Return statement" },
// // // // // // // // // //     { text: "result", color: "lightyellow", explanation: "Returned value" }
// // // // // // // // // //   ],
// // // // // // // // // //   lambdaFunction: [
// // // // // // // // // //     { text: "lambda", color: "lightblue", explanation: "Keyword defining a lambda function" },
// // // // // // // // // //     { text: "a, b:", color: "lightcoral", explanation: "Lambda function arguments" },
// // // // // // // // // //     { text: "a + b", color: "lightpink", explanation: "Lambda expression" }
// // // // // // // // // //   ]
// // // // // // // // // // };

// // // // // // // // // // const VisualizeLambda = () => {
// // // // // // // // // //   const [showLambda, setShowLambda] = useState(false);

// // // // // // // // // //   return (
// // // // // // // // // //     <div>
// // // // // // // // // //       <h2>Regular Function</h2>
// // // // // // // // // //       <FunctionVisualization blocks={exampleData.regularFunction} />
// // // // // // // // // //       <button onClick={() => setShowLambda(!showLambda)}>Show Lambda Transformation</button>
// // // // // // // // // //       {showLambda && (
// // // // // // // // // //         <>
// // // // // // // // // //           <h2>Lambda Function</h2>
// // // // // // // // // //           <FunctionVisualization blocks={exampleData.lambdaFunction} />
// // // // // // // // // //         </>
// // // // // // // // // //       )}
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // export default VisualizeLambda;
// // // // // // // // // 'use client';

// // // // // // // // // import { useState } from 'react';

// // // // // // // // // const FunctionBlock = ({ block }) => (
// // // // // // // // //   <div className="block" style={{ backgroundColor: block.color }}>
// // // // // // // // //     {block.text}
// // // // // // // // //     <span className="tooltip">{block.explanation}</span>
// // // // // // // // //   </div>
// // // // // // // // // );

// // // // // // // // // const FunctionVisualization = ({ blocks }) => (
// // // // // // // // //   <div className="breakdown">
// // // // // // // // //     {blocks.map((block, index) => (
// // // // // // // // //       <FunctionBlock key={index} block={block} />
// // // // // // // // //     ))}
// // // // // // // // //   </div>
// // // // // // // // // );

// // // // // // // // // const exampleData = {
// // // // // // // // //   regularFunction: [
// // // // // // // // //     { text: "def", color: "lightblue", explanation: "Keyword defining a function" },
// // // // // // // // //     { text: "my_func", color: "lightgreen", explanation: "Function name" },
// // // // // // // // //     { text: "(a, b):", color: "lightcoral", explanation: "Function arguments" },
// // // // // // // // //     { text: "result", color: "lightyellow", explanation: "Variable name" },
// // // // // // // // //     { text: "= a + b", color: "lightpink", explanation: "Logic" },
// // // // // // // // //     { text: "return", color: "lightgray", explanation: "Return statement" },
// // // // // // // // //     { text: "result", color: "lightyellow", explanation: "Returned value" }
// // // // // // // // //   ],
// // // // // // // // //   lambdaFunction: [
// // // // // // // // //     { text: "lambda", color: "lightblue", explanation: "Keyword defining a lambda function" },
// // // // // // // // //     { text: "a, b:", color: "lightcoral", explanation: "Lambda function arguments" },
// // // // // // // // //     { text: "a + b", color: "lightpink", explanation: "Lambda expression" }
// // // // // // // // //   ]
// // // // // // // // // };

// // // // // // // // // const VisualizeLambda = () => {
// // // // // // // // //   const [showLambda, setShowLambda] = useState(false);

// // // // // // // // //   return (
// // // // // // // // //     <div>
// // // // // // // // //       <h2>Regular Function</h2>
// // // // // // // // //       <FunctionVisualization blocks={exampleData.regularFunction} />
// // // // // // // // //       <button onClick={() => setShowLambda(!showLambda)}>Show Lambda Transformation</button>
// // // // // // // // //       {showLambda && (
// // // // // // // // //         <>
// // // // // // // // //           <h2>Lambda Function</h2>
// // // // // // // // //           <FunctionVisualization blocks={exampleData.lambdaFunction} />
// // // // // // // // //         </>
// // // // // // // // //       )}
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default VisualizeLambda;
// // // // // // // // 'use client';

// // // // // // // // import { useState } from 'react';

// // // // // // // // const FunctionBlock = ({ block }) => (
// // // // // // // //   <div className="block" style={{ backgroundColor: block.color }}>
// // // // // // // //     {block.text}
// // // // // // // //     <div className="tooltip-container">
// // // // // // // //       <span className="tooltip">{block.explanation}</span>
// // // // // // // //     </div>
// // // // // // // //   </div>
// // // // // // // // );

// // // // // // // // const FunctionVisualization = ({ blocks }) => (
// // // // // // // //   <div className="breakdown">
// // // // // // // //     {blocks.map((block, index) => (
// // // // // // // //       <FunctionBlock key={index} block={block} />
// // // // // // // //     ))}
// // // // // // // //   </div>
// // // // // // // // );

// // // // // // // // const exampleData = {
// // // // // // // //   regularFunction: [
// // // // // // // //     { text: "def", color: "lightblue", explanation: "Keyword defining a function" },
// // // // // // // //     { text: "my_func", color: "lightgreen", explanation: "Function name" },
// // // // // // // //     { text: "(a, b):", color: "lightcoral", explanation: "Function arguments" },
// // // // // // // //     { text: "    result", color: "lightyellow", explanation: "Variable name" },
// // // // // // // //     { text: "= a + b", color: "lightpink", explanation: "Logic" },
// // // // // // // //     { text: "    return", color: "lightgray", explanation: "Return statement" },
// // // // // // // //     { text: "result", color: "lightyellow", explanation: "Returned value" }
// // // // // // // //   ],
// // // // // // // //   lambdaFunction: [
// // // // // // // //     { text: "lambda", color: "lightblue", explanation: "Keyword defining a lambda function" },
// // // // // // // //     { text: "a, b:", color: "lightcoral", explanation: "Lambda function arguments" },
// // // // // // // //     { text: "a + b", color: "lightpink", explanation: "Lambda expression" }
// // // // // // // //   ]
// // // // // // // // };

// // // // // // // // const VisualizeLambda = () => {
// // // // // // // //   const [showLambda, setShowLambda] = useState(false);

// // // // // // // //   return (
// // // // // // // //     <div>
// // // // // // // //       <h2>Regular Function</h2>
// // // // // // // //       <FunctionVisualization blocks={exampleData.regularFunction} />
// // // // // // // //       <button onClick={() => setShowLambda(!showLambda)}>Show Lambda Transformation</button>
// // // // // // // //       {showLambda && (
// // // // // // // //         <>
// // // // // // // //           <h2>Lambda Function</h2>
// // // // // // // //           <FunctionVisualization blocks={exampleData.lambdaFunction} />
// // // // // // // //         </>
// // // // // // // //       )}
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default VisualizeLambda;
// // // // // // // 'use client';
// // // // // // // import { useState } from 'react';

// // // // // // // const FunctionBlock = ({ block }) => (
// // // // // // //   <div className="block" style={{ backgroundColor: block.color }}>
// // // // // // //     {block.text}
// // // // // // //     <div className="tooltip-container">
// // // // // // //       <span className="tooltip">{block.explanation}</span>
// // // // // // //     </div>
// // // // // // //   </div>
// // // // // // // );

// // // // // // // const FunctionVisualization = ({ blocks }) => (
// // // // // // //   <div className="breakdown">
// // // // // // //     {blocks.map((block, index) => (
// // // // // // //       <FunctionBlock key={index} block={block} />
// // // // // // //     ))}
// // // // // // //   </div>
// // // // // // // );

// // // // // // // const exampleData = {
// // // // // // //   regularFunction: [
// // // // // // //     { text: "def", color: "lightblue", explanation: "Keyword defining a function" },
// // // // // // //     { text: "my_func", color: "lightgreen", explanation: "Function name" },
// // // // // // //     { text: "(a, b):", color: "lightcoral", explanation: "Function arguments" },
// // // // // // //     { text: "    result", color: "lightyellow", explanation: "Variable name" },
// // // // // // //     { text: "= a + b", color: "lightpink", explanation: "Logic" },
// // // // // // //     { text: "    return", color: "lightgray", explanation: "Return statement" },
// // // // // // //     { text: "result", color: "lightyellow", explanation: "Returned value" }
// // // // // // //   ],
// // // // // // //   lambdaFunction: [
// // // // // // //     { text: "lambda", color: "lightblue", explanation: "Keyword defining a lambda function" },
// // // // // // //     { text: "a, b:", color: "lightcoral", explanation: "Lambda function arguments" },
// // // // // // //     { text: "a + b", color: "lightpink", explanation: "Lambda expression" }
// // // // // // //   ]
// // // // // // // };

// // // // // // // const VisualizeLambda = () => {
// // // // // // //   const [showLambda, setShowLambda] = useState(false);

// // // // // // //   return (
// // // // // // //     <div>
// // // // // // //       <h2>Regular Function</h2>
// // // // // // //       <FunctionVisualization blocks={exampleData.regularFunction} />
// // // // // // //       <button onClick={() => setShowLambda(!showLambda)}>Show Lambda Transformation</button>
// // // // // // //       {showLambda && (
// // // // // // //         <>
// // // // // // //           <h2>Lambda Function</h2>
// // // // // // //           <FunctionVisualization blocks={exampleData.lambdaFunction} />
// // // // // // //         </>
// // // // // // //       )}
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default VisualizeLambda;
// // // // // // 'use client';

// // // // // // import { useState } from 'react';

// // // // // // const FunctionBlock = ({ block }) => (
// // // // // //   <div className="block" style={{ backgroundColor: block.color }}>
// // // // // //     {block.text}
// // // // // //     <div className="tooltip-container">
// // // // // //       <span className="question-mark">?</span>
// // // // // //       <span className="tooltip-text">{block.explanation}</span>
// // // // // //     </div>
// // // // // //   </div>
// // // // // // );

// // // // // // const FunctionVisualization = ({ blocks }) => (
// // // // // //   <div className="breakdown">
// // // // // //     {blocks.map((block, index) => (
// // // // // //       <FunctionBlock key={index} block={block} />
// // // // // //     ))}
// // // // // //   </div>
// // // // // // );

// // // // // // const exampleData = {
// // // // // //   regularFunction: [
// // // // // //     { text: "def", color: "lightblue", explanation: "Keyword defining a function" },
// // // // // //     { text: "my_func", color: "lightgreen", explanation: "Function name" },
// // // // // //     { text: "(a, b):", color: "lightcoral", explanation: "Function arguments" },
// // // // // //     { text: "    result", color: "lightyellow", explanation: "Variable name" },
// // // // // //     { text: "= a + b", color: "lightpink", explanation: "Logic" },
// // // // // //     { text: "    return", color: "lightgray", explanation: "Return statement" },
// // // // // //     { text: "result", color: "lightyellow", explanation: "Returned value" }
// // // // // //   ],
// // // // // //   lambdaFunction: [
// // // // // //     { text: "lambda", color: "lightblue", explanation: "Keyword defining a lambda function" },
// // // // // //     { text: "a, b:", color: "lightcoral", explanation: "Lambda function arguments" },
// // // // // //     { text: "a + b", color: "lightpink", explanation: "Lambda expression" }
// // // // // //   ]
// // // // // // };

// // // // // // const VisualizeLambda = () => {
// // // // // //   const [showLambda, setShowLambda] = useState(false);

// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2>Regular Function</h2>
// // // // // //       <FunctionVisualization blocks={exampleData.regularFunction} />
// // // // // //       <button onClick={() => setShowLambda(!showLambda)}>Show Lambda Transformation</button>
// // // // // //       {showLambda && (
// // // // // //         <>
// // // // // //           <h2>Lambda Function</h2>
// // // // // //           <FunctionVisualization blocks={exampleData.lambdaFunction} />
// // // // // //         </>
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default VisualizeLambda;
// // // // // 'use client';

// // // // // import { useState } from 'react';

// // // // // const FunctionBlock = ({ block }) => (
// // // // //   <div className="block" style={{ backgroundColor: block.color }}>
// // // // //     {block.text}
// // // // //     <div className="tooltip-container">
// // // // //       <span className="tooltip-text">{block.explanation}</span>
// // // // //     </div>
// // // // //   </div>
// // // // // );

// // // // // const FunctionVisualization = ({ blocks }) => (
// // // // //   <div className="breakdown">
// // // // //     {blocks.map((block, index) => (
// // // // //       <FunctionBlock key={index} block={block} />
// // // // //     ))}
// // // // //   </div>
// // // // // );

// // // // // const exampleData = {
// // // // //   regularFunction: [
// // // // //     { text: "def", color: "lightblue", explanation: "Keyword defining a function" },
// // // // //     { text: "my_func", color: "lightgreen", explanation: "Function name" },
// // // // //     { text: "(a, b):", color: "lightcoral", explanation: "Function arguments" },
// // // // //     { text: "    result", color: "lightyellow", explanation: "Variable name" },
// // // // //     { text: "= a + b", color: "lightpink", explanation: "Logic" },
// // // // //     { text: "    return", color: "lightgray", explanation: "Return statement" },
// // // // //     { text: "result", color: "lightyellow", explanation: "Returned value" }
// // // // //   ],
// // // // //   lambdaFunction: [
// // // // //     { text: "lambda", color: "lightblue", explanation: "Keyword defining a lambda function" },
// // // // //     { text: "a, b:", color: "lightcoral", explanation: "Lambda function arguments" },
// // // // //     { text: "a + b", color: "lightpink", explanation: "Lambda expression" }
// // // // //   ]
// // // // // };

// // // // // const VisualizeLambda = () => {
// // // // //   const [showLambda, setShowLambda] = useState(false);

// // // // //   return (
// // // // //     <div>
// // // // //       <h2>Regular Function</h2>
// // // // //       <FunctionVisualization blocks={exampleData.regularFunction} />
// // // // //       <button onClick={() => setShowLambda(!showLambda)}>Show Lambda Transformation</button>
// // // // //       {showLambda && (
// // // // //         <>
// // // // //           <h2>Lambda Function</h2>
// // // // //           <FunctionVisualization blocks={exampleData.lambdaFunction} />
// // // // //         </>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default VisualizeLambda;
// // // // 'use client';

// // // // import { useState } from 'react';

// // // // const VisualizeLambda = () => {
// // // //   const [showTooltip, setShowTooltip] = useState(null);
// // // //   const [showLambda, setShowLambda] = useState(false);

// // // //   const exampleData = {
// // // //     regularFunction: [
// // // //       { text: "def", color: "lightblue", explanation: "Keyword defining a function" },
// // // //       { text: "my_func", color: "lightgreen", explanation: "Function name" },
// // // //       { text: "(a, b):", color: "lightcoral", explanation: "Function arguments" },
// // // //       { text: "    result", color: "lightyellow", explanation: "Variable name" },
// // // //       { text: "= a + b", color: "lightpink", explanation: "Logic" },
// // // //       { text: "    return", color: "lightgray", explanation: "Return statement" },
// // // //       { text: "result", color: "lightyellow", explanation: "Returned value" }
// // // //     ],
// // // //     lambdaFunction: [
// // // //       { text: "lambda", color: "lightblue", explanation: "Keyword defining a lambda function" },
// // // //       { text: "a, b:", color: "lightcoral", explanation: "Lambda function arguments" },
// // // //       { text: "a + b", color: "lightpink", explanation: "Lambda expression" }
// // // //     ]
// // // //   };

// // // //   const renderBlocks = (blocks) => {
// // // //     return blocks.map((block, index) => (
// // // //         <>
// // // //       <div
// // // //         key={index}
// // // //         className="block"
// // // //         style={{ backgroundColor: block.color }}
// // // //         onMouseEnter={() => setShowTooltip(index)}
// // // //         onMouseLeave={() => setShowTooltip(null)}
// // // //       >
// // // //          {/* {showTooltip === index && (
// // // //           <div className="tooltip-container">
// // // //             <span className="tooltip-text">{block.explanation}</span>
// // // //           </div>
// // // //         )} */}
// // // //         {block.text}
// // // //         <span className="tooltip">{block.explanation}</span>
        
       
       
// // // //       </div>
      
// // // //      </>
// // // //     ));
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <h2>Regular Function</h2>
// // // //       <div className="breakdown">
// // // //         {renderBlocks(exampleData.regularFunction)}
// // // //       </div>
// // // //       <button onClick={() => setShowLambda(!showLambda)}>Show Lambda Transformation</button>
// // // //       {showLambda && (
// // // //         <>
// // // //           <h2>Lambda Function</h2>
// // // //           <div className="breakdown">
// // // //             {renderBlocks(exampleData.lambdaFunction)}
// // // //           </div>
// // // //         </>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default VisualizeLambda;
// // // 'use client';

// // // import { useState } from 'react';

// // // const VisualizeLambda = () => {
// // //   const [showLambda, setShowLambda] = useState(false);

// // //   const exampleData = {
// // //     regularFunction: [
// // //       { text: "def", color: "lightblue", explanation: "Keyword defining a function" },
// // //       { text: "my_func", color: "lightgreen", explanation: "Function name" },
// // //       { text: "(a, b):", color: "lightcoral", explanation: "Function arguments" },
// // //       { text: "    result", color: "lightyellow", explanation: "Variable name" },
// // //       { text: "= a + b", color: "lightpink", explanation: "Logic" },
// // //       { text: "    return", color: "lightgray", explanation: "Return statement" },
// // //       { text: "result", color: "lightyellow", explanation: "Returned value" }
// // //     ],
// // //     lambdaFunction: [
// // //       { text: "lambda", color: "lightblue", explanation: "Keyword defining a lambda function" },
// // //       { text: "a, b:", color: "lightcoral", explanation: "Lambda function arguments" },
// // //       { text: "a + b", color: "lightpink", explanation: "Lambda expression" }
// // //     ]
// // //   };

// // //   const renderBlocks = (blocks) => {
// // //     return blocks.map((block, index) => (
// // //       <div
// // //         key={index}
// // //         className="block"
// // //         style={{ backgroundColor: block.color }}
// // //       >
// // //         {block.text}
// // //         <div className="tooltip-container">
// // //           <span className="tooltip-text">{block.explanation}</span>
// // //         </div>
// // //       </div>
// // //     ));
// // //   };

// // //   return (
// // //     <div>
// // //       <h2>Regular Function</h2>
// // //       <div className="breakdown">
// // //         {renderBlocks(exampleData.regularFunction)}
// // //       </div>
// // //       <button onClick={() => setShowLambda(!showLambda)}>Show Lambda Transformation</button>
// // //       {showLambda && (
// // //         <>
// // //           <h2>Lambda Function</h2>
// // //           <div className="breakdown">
// // //             {renderBlocks(exampleData.lambdaFunction)}
// // //           </div>
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default VisualizeLambda;
// // 'use client';

// // import { useState } from 'react';

// // const VisualizeLambda = () => {
// //   const [showLambda, setShowLambda] = useState(false);

// //   const exampleData = {
// //     regularFunction: [
// //       { text: "def", color: "lightblue", explanation: "Keyword defining a function" },
// //       { text: "my_func", color: "lightgreen", explanation: "Function name" },
// //       { text: "(a, b):", color: "lightcoral", explanation: "Function arguments" },
// //       { text: "    result", color: "lightyellow", explanation: "Variable name" },
// //       { text: "= a + b", color: "lightpink", explanation: "Logic" },
// //       { text: "    return", color: "lightgray", explanation: "Return statement" },
// //       { text: "result", color: "lightyellow", explanation: "Returned value" }
// //     ],
// //     lambdaFunction: [
// //       { text: "lambda", color: "lightblue", explanation: "Keyword defining a lambda function" },
// //       { text: "a, b:", color: "lightcoral", explanation: "Lambda function arguments" },
// //       { text: "a + b", color: "lightpink", explanation: "Lambda expression" }
// //     ]
// //   };

// //   const renderBlocks = (blocks) => {
// //     return blocks.map((block, index) => (
// //       <div
// //         key={index}
// //         className="block"
// //         style={{ backgroundColor: block.color }}
// //         data-tooltip={block.explanation}
// //       >
// //         {block.text}
// //       </div>
// //     ));
// //   };

// //   return (
// //     <div>
// //       <h2>Regular Function</h2>
// //       <div className="breakdown">
// //         {renderBlocks(exampleData.regularFunction)}
// //       </div>
// //       <button onClick={() => setShowLambda(!showLambda)}>Show Lambda Transformation</button>
// //       {showLambda && (
// //         <>
// //           <h2>Lambda Function</h2>
// //           <div className="breakdown">
// //             {renderBlocks(exampleData.lambdaFunction)}
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default VisualizeLambda;
// 'use client';

// import { useState } from 'react';

// const VisualizeLambda = () => {
//   const [showLambda, setShowLambda] = useState(false);

//   const exampleData = {
//     regularFunction: [
//       { text: "def", color: "lightblue", explanation: "Keyword defining a function" },
//       { text: "my_func", color: "lightgreen", explanation: "Function name" },
//       { text: "(a, b):", color: "lightcoral", explanation: "Function arguments" },
//       { text: "    result", color: "lightyellow", explanation: "Variable name" },
//       { text: "= a + b", color: "lightpink", explanation: "Logic" },
//       { text: "    return", color: "lightgray", explanation: "Return statement" },
//       { text: "result", color: "lightyellow", explanation: "Returned value" }
//     ],
//     lambdaFunction: [
//       { text: "lambda", color: "lightblue", explanation: "Keyword defining a lambda function" },
//       { text: "a, b:", color: "lightcoral", explanation: "Lambda function arguments" },
//       { text: "a + b", color: "lightpink", explanation: "Lambda expression" }
//     ]
//   };

//   const renderBlocks = (blocks) => {
//     return blocks.map((block, index) => (
//       <div
//         key={index}
//         className="block"
//         style={{ backgroundColor: block.color }}
//       >
//         {block.text}
//         <span className="tooltip">{block.explanation}</span>
//       </div>
//     ));
//   };

//   return (
//     <div>
//       <h2>Regular Function</h2>
//       <div className="breakdown">
//         {renderBlocks(exampleData.regularFunction)}
//       </div>
//       <button onClick={() => setShowLambda(!showLambda)}>Show Lambda Transformation</button>
//       {showLambda && (
//         <>
//           <h2>Lambda Function</h2>
//           <div className="breakdown">
//             {renderBlocks(exampleData.lambdaFunction)}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default VisualizeLambda;
'use client';

import { useState } from 'react';
import './VisualizeLambda.css'

const TooltipWrapper = ({ children, tooltip }) => (
  <div className="tooltip-wrapper">
    {children}
    <div className="tooltip">{tooltip}</div>
  </div>
);

const FunctionBlock = ({ block }) => (
  <TooltipWrapper tooltip={block.explanation}>
    <div className="block" style={{ backgroundColor: block.color }}>
      {block.text}
    </div>
  </TooltipWrapper>
);

const VisualizeLambda = () => {
  const [showLambda, setShowLambda] = useState(false);

  const exampleData = {
    regularFunction: [
      { text: "def", color: "lightblue", explanation: "Keyword defining a function" },
      { text: "my_func", color: "lightgreen", explanation: "Function name" },
      { text: "(a, b):", color: "lightcoral", explanation: "Function arguments" },
      { text: "    result", color: "lightyellow", explanation: "Variable name" },
      { text: "= a + b", color: "lightpink", explanation: "Logic" },
      { text: "    return", color: "lightgray", explanation: "Return statement" },
      { text: "result", color: "lightyellow", explanation: "Returned value" }
    ],
    lambdaFunction: [
      { text: "lambda", color: "lightblue", explanation: "Keyword defining a lambda function" },
      { text: "a, b:", color: "lightcoral", explanation: "Lambda function arguments" },
      { text: "a + b", color: "lightpink", explanation: "Lambda expression" }
    ]
  };

  const renderBlocks = (blocks) => {
    return blocks.map((block, index) => (
      <FunctionBlock key={index} block={block} />
    ));
  };

  return (
    <div>
      <h2>Regular Function</h2>
      <div className="breakdown">
        {renderBlocks(exampleData.regularFunction)}
      </div>
      <button onClick={() => setShowLambda(!showLambda)}>Show Lambda Transformation</button>
      {showLambda && (
        <>
          <h2>Lambda Function</h2>
          <div className="breakdown">
            {renderBlocks(exampleData.lambdaFunction)}
          </div>
        </>
      )}
    </div>
  );
};

export default VisualizeLambda;
