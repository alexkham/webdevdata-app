// // // // // import React from 'react';

// // // // // const CFunctionFlow = ({ functionPrototype }) => {
// // // // //   const { returnType, funcName, parameters = [] } = functionPrototype;

// // // // //   const getArrowPath = (startX, startY, endX, endY) => {
// // // // //     const controlPoint = (startX + endX) / 2;
// // // // //     return `M ${startX} ${startY} C ${controlPoint} ${startY}, ${controlPoint} ${endY}, ${endX} ${endY}`;
// // // // //   };

// // // // //   const ParamBox = ({ param, x, y }) => {
// // // // //     const boxHeight = param.nameExplanation ? 80 : 40;
// // // // //     return (
// // // // //       <>
// // // // //         <text x={x + 60} y={y - 30} textAnchor="middle" className="font-mono text-sm fill-gray-600">
// // // // //           {param.type}
// // // // //         </text>
// // // // //         <rect x={x} y={y} width="120" height={boxHeight} rx="6" 
// // // // //               className="fill-blue-50 stroke-blue-400 stroke-2" />
// // // // //         <text x={x + 60} y={y + 20} textAnchor="middle" className="font-mono fill-blue-600">
// // // // //           {param.name}
// // // // //         </text>
// // // // //         {param.nameExplanation && (
// // // // //           <foreignObject x={x + 10} y={y + 30} width="100" height="40">
// // // // //             <div className="text-center text-xs text-gray-500">{param.nameExplanation}</div>
// // // // //           </foreignObject>
// // // // //         )}
// // // // //       </>
// // // // //     );
// // // // //   };

// // // // //   return (
// // // // //     <div className="w-full max-w-6xl mx-auto p-8">
// // // // //       <svg className="w-full" viewBox="0 0 1000 400">
// // // // //         <defs>
// // // // //           <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
// // // // //             <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
// // // // //           </marker>
// // // // //         </defs>

// // // // //         {parameters.length > 0 && parameters.map((param, index) => {
// // // // //           const y = (index + 1) * (400 / (parameters.length + 1)) - 40;
// // // // //           const yOffset = parameters.length === 1 ? 160 : y;
          
// // // // //           return (
// // // // //             <g key={`param-${index}`}>
// // // // //               <ParamBox param={param} x={20} y={yOffset} />
// // // // //               <path
// // // // //                 d={getArrowPath(140, yOffset + 40, 300, 200)}
// // // // //                 className="fill-none stroke-gray-400 stroke-2"
// // // // //                 markerEnd="url(#arrowhead)"
// // // // //               />
// // // // //             </g>
// // // // //           );
// // // // //         })}

// // // // //         {/* Function box */}
// // // // //         <rect x="300" y="100" width="400" height="200" rx="12" 
// // // // //               className="fill-purple-50 stroke-purple-400 stroke-2" />
// // // // //         <text x="320" y="90" className="font-mono fill-purple-600 text-lg">
// // // // //           {funcName}
// // // // //         </text>

// // // // //         {/* Return section */}
// // // // //         <text x="880" y="170" textAnchor="middle" className="font-mono text-sm fill-gray-600">
// // // // //           {returnType}
// // // // //         </text>
// // // // //         <rect x="820" y="180" width="120" height="40" rx="6" 
// // // // //               className="fill-green-50 stroke-green-400 stroke-2" />
// // // // //         <text x="880" y="200" textAnchor="middle" dominantBaseline="middle" 
// // // // //               className="font-mono fill-green-600">
// // // // //           return
// // // // //         </text>
// // // // //         <path d={getArrowPath(700, 200, 820, 200)} className="fill-none stroke-gray-400 stroke-2" 
// // // // //               markerEnd="url(#arrowhead)" />
// // // // //       </svg>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CFunctionFlow;


// // // // // import React from 'react';

// // // // // const CFunctionFlow = ({ functionPrototype }) => {
// // // // //   const { returnType, funcName, parameters,description = [] } = functionPrototype;

// // // // //   const getArrowPath = (startX, startY, endX, endY) => {
// // // // //     const controlPoint = (startX + endX) / 2;
// // // // //     return `M ${startX} ${startY} C ${controlPoint} ${startY}, ${controlPoint} ${endY}, ${endX} ${endY}`;
// // // // //   };

// // // // //   return (
// // // // //     <div className="w-full max-w-6xl mx-auto p-8">
// // // // //       <svg className="w-full" viewBox="0 0 1000 400" style={{ backgroundColor: 'white' }}>
// // // // //         <defs>
// // // // //           <marker
// // // // //             id="arrowhead"
// // // // //             markerWidth="10"
// // // // //             markerHeight="7"
// // // // //             refX="9"
// // // // //             refY="3.5"
// // // // //             orient="auto"
// // // // //           >
// // // // //             <polygon points="0 0, 10 3.5, 0 7" fill="#4B5563" />
// // // // //           </marker>
// // // // //         </defs>

// // // // //         {parameters.length > 0 && parameters.map((param, index) => {
// // // // //           const y = (index + 1) * (400 / (parameters.length + 1)) - 40;
// // // // //           const yOffset = parameters.length === 1 ? 160 : y;
          
// // // // //           return (
// // // // //             <g key={`param-${index}`}>
// // // // //               <text x="80" y={yOffset - 30} textAnchor="middle" fill="#4B5563" className="font-mono text-sm">
// // // // //                 {param.type}
// // // // //               </text>
// // // // //               <rect
// // // // //                 x="20"
// // // // //                 y={yOffset}
// // // // //                 width="120"
// // // // //                 height="80"
// // // // //                 rx="6"
// // // // //                 fill="white"
// // // // //                 stroke="#3B82F6"
// // // // //                 strokeWidth="2"
// // // // //               />
// // // // //               <text x="80" y={yOffset + 30} textAnchor="middle" fill="#1E40AF" className="font-mono">
// // // // //                 {param.name}
// // // // //               </text>
// // // // //               <text x="80" y={yOffset + 50} textAnchor="middle" fill="#6B7280" className="text-xs">
// // // // //                 {param.nameExplanation}
// // // // //               </text>
// // // // //               <path
// // // // //                 d={getArrowPath(140, yOffset + 40, 300, 200)}
// // // // //                 stroke="#4B5563"
// // // // //                 strokeWidth="2"
// // // // //                 fill="none"
// // // // //                 markerEnd="url(#arrowhead)"
// // // // //               />
// // // // //             </g>
// // // // //           );
// // // // //         })}

// // // // //         {/* Function box */}
// // // // //         <rect
// // // // //           x="300"
// // // // //           y="100"
// // // // //           width="400"
// // // // //           height="200"
// // // // //           rx="12"
// // // // //           fill="white"
// // // // //           stroke="#8B5CF6"
// // // // //           strokeWidth="2"
// // // // //         />
// // // // //         <text
// // // // //           x="320"
// // // // //           y="90"
// // // // //           fill="#7C3AED"
// // // // //           className="font-mono text-lg"
// // // // //         >
// // // // //           {funcName}
// // // // //         </text>
// // // // //         <text
// // // // //          x="320"
// // // // //          y="120"
// // // // //          fill="#7C3AED"
// // // // //          className="font-mono text-lg"
// // // // //         >
// // // // //        {description}

// // // // //         </text>

// // // // //         {/* Return section */}
// // // // //         <text
// // // // //           x="880"
// // // // //           y="170"
// // // // //           textAnchor="middle"
// // // // //           fill="#4B5563"
// // // // //           className="font-mono text-sm"
// // // // //         >
// // // // //           {returnType}
// // // // //         </text>
// // // // //         <rect
// // // // //           x="820"
// // // // //           y="180"
// // // // //           width="120"
// // // // //           height="40"
// // // // //           rx="6"
// // // // //           fill="white"
// // // // //           stroke="#10B981"
// // // // //           strokeWidth="2"
// // // // //         />
// // // // //         <text
// // // // //           x="880"
// // // // //           y="200"
// // // // //           textAnchor="middle"
// // // // //           dominantBaseline="middle"
// // // // //           fill="#047857"
// // // // //           className="font-mono"
// // // // //         >
// // // // //           return
// // // // //         </text>
// // // // //         <path
// // // // //           d={getArrowPath(700, 200, 820, 200)}
// // // // //           stroke="#4B5563"
// // // // //           strokeWidth="2"
// // // // //           fill="none"
// // // // //           markerEnd="url(#arrowhead)"
// // // // //         />
// // // // //       </svg>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CFunctionFlow;


// // // // // import React from 'react';
// // // // // import './CFunctionFlow.css';

// // // // // const CFunctionFlow = ({ functionPrototype }) => {
// // // // //   const { returnType, funcName, parameters, description = [] } = functionPrototype;

// // // // //   const getArrowPath = (startX, startY, endX, endY) => {
// // // // //     const controlPoint = (startX + endX) / 2;
// // // // //     return `M ${startX} ${startY} C ${controlPoint} ${startY}, ${controlPoint} ${endY}, ${endX} ${endY}`;
// // // // //   };

// // // // //   return (
// // // // //     <div className="diagram-container">
// // // // //       <svg className="svg-diagram" viewBox="0 0 1000 400">
// // // // //         <defs>
// // // // //           <marker
// // // // //             id="arrowhead"
// // // // //             markerWidth="10"
// // // // //             markerHeight="7"
// // // // //             refX="9"
// // // // //             refY="3.5"
// // // // //             orient="auto"
// // // // //           >
// // // // //             <polygon points="0 0, 10 3.5, 0 7" className="arrow-marker" />
// // // // //           </marker>
// // // // //         </defs>

// // // // //         {parameters.length > 0 && parameters.map((param, index) => {
// // // // //           const y = (index + 1) * (400 / (parameters.length + 1)) - 40;
// // // // //           const yOffset = parameters.length === 1 ? 160 : y;
          
// // // // //           return (
// // // // //             <g key={`param-${index}`}>
// // // // //               <text x="80" y={yOffset - 30} textAnchor="middle" className="param-type">
// // // // //                 {param.type}
// // // // //               </text>
// // // // //               <rect
// // // // //                 x="20"
// // // // //                 y={yOffset}
// // // // //                 width="120"
// // // // //                 height="80"
// // // // //                 className="param-box"
// // // // //               />
// // // // //               <text x="80" y={yOffset + 30} textAnchor="middle" className="param-text">
// // // // //                 {param.name}
// // // // //               </text>
// // // // //               <text x="80" y={yOffset + 50} textAnchor="middle" className="param-description">
// // // // //                 {param.nameExplanation}
// // // // //               </text>
// // // // //               <path
// // // // //                 d={getArrowPath(140, yOffset + 40, 300, 200)}
// // // // //                 className="arrow-path"
// // // // //                 markerEnd="url(#arrowhead)"
// // // // //               />
// // // // //             </g>
// // // // //           );
// // // // //         })}

// // // // //         <rect
// // // // //           x="300"
// // // // //           y="100"
// // // // //           width="400"
// // // // //           height="200"
// // // // //           rx="12"
// // // // //           className="function-box"
// // // // //         />
// // // // //         <text x="320" y="90" className="function-text">
// // // // //           {funcName}
// // // // //         </text>
// // // // //         <text x="320" y="120" className="function-text">
// // // // //           {description}
// // // // //         </text>

// // // // //         <text x="880" y="170" textAnchor="middle" className="param-type">
// // // // //           {returnType}
// // // // //         </text>
// // // // //         <rect
// // // // //           x="820"
// // // // //           y="180"
// // // // //           width="120"
// // // // //           height="40"
// // // // //           rx="6"
// // // // //           className="return-box"
// // // // //         />
// // // // //         <text x="880" y="200" textAnchor="middle" dominantBaseline="middle" className="return-text">
// // // // //           return
// // // // //         </text>
// // // // //         <path
// // // // //           d={getArrowPath(700, 200, 820, 200)}
// // // // //           className="arrow-path"
// // // // //           markerEnd="url(#arrowhead)"
// // // // //         />
// // // // //       </svg>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CFunctionFlow;


// // // // // import React from 'react';
// // // // // import './CFunctionFlow.css';

// // // // // const CFunctionFlow = ({ functionPrototype }) => {
// // // // //   const { returnType, funcName, parameters, description  } = functionPrototype;

// // // // //   const getArrowPath = (startX, startY, endX, endY) => {
// // // // //     const controlPoint = (startX + endX) / 2;
// // // // //     return `M ${startX} ${startY} C ${controlPoint} ${startY}, ${controlPoint} ${endY}, ${endX} ${endY}`;
// // // // //   };

// // // // //   const wrapText = (text, width) => {
// // // // //     if (!text) return [];
// // // // //     const words = text.toString().split(' ');
// // // // //     const lines = [];
// // // // //     let currentLine = words[0];

// // // // //     for (let i = 1; i < words.length; i++) {
// // // // //       const word = words[i];
// // // // //       const testLine = currentLine + ' ' + word;
// // // // //       if (testLine.length * 7 > width) {
// // // // //         lines.push(currentLine);
// // // // //         currentLine = word;
// // // // //       } else {
// // // // //         currentLine = testLine;
// // // // //       }
// // // // //     }
// // // // //     lines.push(currentLine);
// // // // //     return lines;
// // // // //   };

// // // // //   return (
// // // // //     <div className="diagram-container">
// // // // //       <svg className="svg-diagram" viewBox="0 0 1000 400">
// // // // //         <defs>
// // // // //           <marker
// // // // //             id="arrowhead"
// // // // //             markerWidth="10"
// // // // //             markerHeight="7"
// // // // //             refX="9"
// // // // //             refY="3.5"
// // // // //             orient="auto"
// // // // //           >
// // // // //             <polygon points="0 0, 10 3.5, 0 7" className="arrow-marker" />
// // // // //           </marker>
// // // // //         </defs>

// // // // //         {parameters.length > 0 && parameters.map((param, index) => {
// // // // //           const y = (index + 1) * (400 / (parameters.length + 1)) - 40;
// // // // //           const yOffset = parameters.length === 1 ? 160 : y;

// // // // //           return (
// // // // //             <g key={`param-${index}`}>
// // // // //               <text x="80" y={yOffset - 30} textAnchor="middle" className="param-type">
// // // // //                 {param.type}
// // // // //               </text>
// // // // //               <rect
// // // // //                 x="20"
// // // // //                 y={yOffset}
// // // // //                 width="120"
// // // // //                 height="80"
// // // // //                 className="param-box"
// // // // //               />
// // // // //               {wrapText(param.name, 100).map((line, i) => (
// // // // //                 <text key={i} x="80" y={yOffset + 20 + (i * 20)} textAnchor="middle" className="param-text">
// // // // //                   {line}
// // // // //                 </text>
// // // // //               ))}
// // // // //               {wrapText(param.nameExplanation, 100).map((line, i) => (
// // // // //                 <text key={i} x="80" y={yOffset + 50 + (i * 20)} textAnchor="middle" className="param-description">
// // // // //                   {line}
// // // // //                 </text>
// // // // //               ))}
// // // // //               <path
// // // // //                 d={getArrowPath(140, yOffset + 40, 300, 200)}
// // // // //                 className="arrow-path"
// // // // //                 markerEnd="url(#arrowhead)"
// // // // //               />
// // // // //             </g>
// // // // //           );
// // // // //         })}

// // // // //         <rect
// // // // //           x="300"
// // // // //           y="100"
// // // // //           width="400"
// // // // //           height="200"
// // // // //           rx="12"
// // // // //           className="function-box"
// // // // //         />
// // // // //         <text x="320" y="90" className="function-text">
// // // // //           {funcName}
// // // // //         </text>
// // // // //         {wrapText(description, 380).map((line, i) => (
// // // // //           <text key={i} x="320" y={120 + (i * 20)} className="function-text">
// // // // //             {line}
// // // // //           </text>
// // // // //         ))}

// // // // //         <text x="880" y="170" textAnchor="middle" className="param-type">
// // // // //           {returnType}
// // // // //         </text>
// // // // //         <rect
// // // // //           x="820"
// // // // //           y="180"
// // // // //           width="120"
// // // // //           height="40"
// // // // //           rx="6"
// // // // //           className="return-box"
// // // // //         />
// // // // //         <text
// // // // //           x="880"
// // // // //           y="200"
// // // // //           textAnchor="middle"
// // // // //           dominantBaseline="middle"
// // // // //           className="return-text"
// // // // //         >
// // // // //           return
// // // // //         </text>
// // // // //         <path
// // // // //           d={getArrowPath(700, 200, 820, 200)}
// // // // //           className="arrow-path"
// // // // //           markerEnd="url(#arrowhead)"
// // // // //         />
// // // // //       </svg>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CFunctionFlow;


// // // // // import React from 'react';
// // // // // import './CFunctionFlow.css';

// // // // // const CFunctionFlow = ({ functionPrototype }) => {
// // // // //   const { returnType, funcName, parameters, description } = functionPrototype;

// // // // //   const getArrowPath = (startX, startY, endX, endY) => {
// // // // //     const controlPoint = (startX + endX) / 2;
// // // // //     return `M ${startX} ${startY} C ${controlPoint} ${startY}, ${controlPoint} ${endY}, ${endX} ${endY}`;
// // // // //   };

// // // // //   const wrapText = (text, width) => {
// // // // //     if (!text) return [];
// // // // //     const words = text.toString().split(' ');
// // // // //     const lines = [];
// // // // //     let currentLine = words[0];

// // // // //     for (let i = 1; i < words.length; i++) {
// // // // //       const word = words[i];
// // // // //       const testLine = currentLine + ' ' + word;
// // // // //       if (testLine.length * 7 > width) {
// // // // //         lines.push(currentLine);
// // // // //         currentLine = word;
// // // // //       } else {
// // // // //         currentLine = testLine;
// // // // //       }
// // // // //     }
// // // // //     lines.push(currentLine);
// // // // //     return lines;
// // // // //   };

// // // // //   return (
// // // // //     <div className="diagram-container">
// // // // //       <svg className="svg-diagram" viewBox="0 0 1000 400">
// // // // //         <defs>
// // // // //           <marker
// // // // //             id="arrowhead"
// // // // //             markerWidth="10"
// // // // //             markerHeight="7"
// // // // //             refX="9"
// // // // //             refY="3.5"
// // // // //             orient="auto"
// // // // //           >
// // // // //             <polygon points="0 0, 10 3.5, 0 7" className="arrow-marker" />
// // // // //           </marker>
// // // // //         </defs>

// // // // //         {parameters.length > 0 && parameters.map((param, index) => {
// // // // //           const y = (index + 1) * (400 / (parameters.length + 1)) - 40;
// // // // //           const yOffset = parameters.length === 1 ? 160 : y;

// // // // //           return (
// // // // //             <g key={`param-${index}`}>
// // // // //               <text x="80" y={yOffset - 15} textAnchor="middle" className="param-type">
// // // // //                 {param.type}
// // // // //               </text>
// // // // //               <rect
// // // // //                 x="20"
// // // // //                 y={yOffset}
// // // // //                 width="120"
// // // // //                 height="80"
// // // // //                 rx="6"
// // // // //                 className="param-box"
// // // // //               />
// // // // //               {wrapText(param.name, 100).map((line, i) => (
// // // // //                 <text key={i} x="80" y={yOffset + 20 + (i * 20)} textAnchor="middle" className="param-text">
// // // // //                   {line}
// // // // //                 </text>
// // // // //               ))}
// // // // //               {/* Parameter explanations hidden for now */}
// // // // //               <path
// // // // //                 d={getArrowPath(140, yOffset + 40, 300, 200)}
// // // // //                 className="arrow-path"
// // // // //                 markerEnd="url(#arrowhead)"
// // // // //               />
// // // // //             </g>
// // // // //           );
// // // // //         })}

// // // // //         <rect
// // // // //           x="300"
// // // // //           y="100"
// // // // //           width="400"
// // // // //           height="200"
// // // // //           rx="12"
// // // // //           className="function-box"
// // // // //         />
// // // // //         <text x="320" y="90" className="function-text">
// // // // //           {funcName}
// // // // //         </text>
// // // // //         {wrapText(description, 380).map((line, i) => (
// // // // //           <text key={i} x="320" y={120 + (i * 20)} className="function-text">
// // // // //             {line}
// // // // //           </text>
// // // // //         ))}

// // // // //         <text x="880" y="170" textAnchor="middle" className="param-type">
// // // // //           {returnType}
// // // // //         </text>
// // // // //         <rect
// // // // //           x="820"
// // // // //           y="180"
// // // // //           width="120"
// // // // //           height="40"
// // // // //           rx="6"
// // // // //           className="return-box"
// // // // //         />
// // // // //         <text
// // // // //           x="880"
// // // // //           y="200"
// // // // //           textAnchor="middle"
// // // // //           dominantBaseline="middle"
// // // // //           className="return-text"
// // // // //         >
// // // // //           return
// // // // //         </text>
// // // // //         <path
// // // // //           d={getArrowPath(700, 200, 820, 200)}
// // // // //           className="arrow-path"
// // // // //           markerEnd="url(#arrowhead)"
// // // // //         />
// // // // //       </svg>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CFunctionFlow;


// // // // // import React from 'react';
// // // // // import './CFunctionFlow.css';
// // // // // import { processContent } from '@/utils/contentProcessor';

// // // // // const CFunctionFlow = ({ functionPrototype }) => {
// // // // //   const { returnType, funcName, parameters, description } = functionPrototype;

// // // // //   const getArrowPath = (startX, startY, endX, endY) => {
// // // // //     const controlPoint = (startX + endX) / 2;
// // // // //     return `M ${startX} ${startY} C ${controlPoint} ${startY}, ${controlPoint} ${endY}, ${endX} ${endY}`;
// // // // //   };

// // // // //   const wrapText = (text, width) => {
// // // // //     if (!text) return [];
// // // // //     const words = text.toString().split(' ');
// // // // //     const lines = [];
// // // // //     let currentLine = words[0];

// // // // //     for (let i = 1; i < words.length; i++) {
// // // // //       const word = words[i];
// // // // //       const testLine = currentLine + ' ' + word;
// // // // //       if (testLine.length * 7 > width) {
// // // // //         lines.push(currentLine);
// // // // //         currentLine = word;
// // // // //       } else {
// // // // //         currentLine = testLine;
// // // // //       }
// // // // //     }
// // // // //     lines.push(currentLine);
// // // // //     return lines;
// // // // //   };

// // // // //   return (
// // // // //     <div className="diagram-container">
// // // // //       <svg className="svg-diagram" viewBox="0 0 1000 400">
// // // // //         <defs>
// // // // //           <marker
// // // // //             id="arrowhead"
// // // // //             markerWidth="10"
// // // // //             markerHeight="7"
// // // // //             refX="9"
// // // // //             refY="3.5"
// // // // //             orient="auto"
// // // // //           >
// // // // //             <polygon points="0 0, 10 3.5, 0 7" className="arrow-marker" />
// // // // //           </marker>
// // // // //         </defs>

// // // // //         {parameters.length > 0 && parameters.map((param, index) => {
// // // // //           const y = (index + 1) * (400 / (parameters.length + 1)) - 40;
// // // // //           const yOffset = parameters.length === 1 ? 160 : y;

// // // // //           return (
// // // // //             <g key={`param-${index}`}>
// // // // //               <text x="80" y={yOffset - 15} textAnchor="middle" className="param-type">
// // // // //                 {param.type}
// // // // //               </text>
// // // // //               <rect
// // // // //                 x="20"
// // // // //                 y={yOffset}
// // // // //                 width="120"
// // // // //                 height="80"
// // // // //                 rx="6"
// // // // //                 className="param-box"
// // // // //               />
// // // // //               <g>
// // // // //                 <title>{param.nameExplanation}</title>
// // // // //                 {wrapText(param.name, 100).map((line, i) => (
// // // // //                   <text 
// // // // //                     key={i} 
// // // // //                     x="80" 
// // // // //                     y={yOffset + 20 + (i * 20)} 
// // // // //                     textAnchor="middle" 
// // // // //                     className="param-text"
// // // // //                     style={{ fontSize: '16px' }}
// // // // //                   >
// // // // //                        {processContent(`#tab:${param.name}#`)}
// // // // //                   </text>
// // // // //                 ))}
// // // // //               </g>
// // // // //               <foreignObject x="30" y={yOffset + 45} width="100" height="30">
// // // // //                 <div style={{ textAlign: 'center' }}>
// // // // //                   {processContent(`#tab:${param.name}#`)}
// // // // //                 </div>
// // // // //               </foreignObject>
// // // // //               <path
// // // // //                 d={getArrowPath(140, yOffset + 40, 300, 200)}
// // // // //                 className="arrow-path"
// // // // //                 markerEnd="url(#arrowhead)"
// // // // //               />
// // // // //             </g>
// // // // //           );
// // // // //         })}

// // // // //         <rect
// // // // //           x="300"
// // // // //           y="100"
// // // // //           width="400"
// // // // //           height="200"
// // // // //           rx="12"
// // // // //           className="function-box"
// // // // //         />
// // // // //         <text x="320" y="90" className="function-text" style={{ fontSize: '16px' }}>
// // // // //           {funcName}
// // // // //         </text>
// // // // //         {wrapText(description, 380).map((line, i) => (
// // // // //           <text key={i} x="320" y={120 + (i * 20)} className="function-text" style={{ fontSize: '14px' }}>
// // // // //             {line}
// // // // //           </text>
// // // // //         ))}

// // // // //         <text x="880" y="170" textAnchor="middle" className="param-type">
// // // // //           {returnType}
// // // // //         </text>
// // // // //         <rect
// // // // //           x="820"
// // // // //           y="180"
// // // // //           width="120"
// // // // //           height="40"
// // // // //           rx="6"
// // // // //           className="return-box"
// // // // //         />
// // // // //         <text
// // // // //           x="880"
// // // // //           y="200"
// // // // //           textAnchor="middle"
// // // // //           dominantBaseline="middle"
// // // // //           className="return-text"
// // // // //         >
// // // // //           return
// // // // //         </text>
// // // // //         <path
// // // // //           d={getArrowPath(700, 200, 820, 200)}
// // // // //           className="arrow-path"
// // // // //           markerEnd="url(#arrowhead)"
// // // // //         />
// // // // //       </svg>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default CFunctionFlow;


// // // // import React from 'react';
// // // // import './CFunctionFlow.css';
// // // // import { processContent } from '@/utils/contentProcessor';

// // // // const CFunctionFlow = ({ functionPrototype }) => {
// // // //   const { returnType, funcName, parameters, description } = functionPrototype;

// // // //   const getArrowPath = (startX, startY, endX, endY) => {
// // // //     const controlPoint = (startX + endX) / 2;
// // // //     return `M ${startX} ${startY} C ${controlPoint} ${startY}, ${controlPoint} ${endY}, ${endX} ${endY}`;
// // // //   };

// // // //   const wrapText = (text, width) => {
// // // //     if (!text) return [];
// // // //     const words = text.toString().split(' ');
// // // //     const lines = [];
// // // //     let currentLine = words[0];

// // // //     for (let i = 1; i < words.length; i++) {
// // // //       const word = words[i];
// // // //       const testLine = currentLine + ' ' + word;
// // // //       if (testLine.length * 7 > width) {
// // // //         lines.push(currentLine);
// // // //         currentLine = word;
// // // //       } else {
// // // //         currentLine = testLine;
// // // //       }
// // // //     }
// // // //     lines.push(currentLine);
// // // //     return lines;
// // // //   };

// // // //   return (
// // // //     <div className="diagram-container">
// // // //       <svg className="svg-diagram" viewBox="0 0 1000 400">
// // // //         <defs>
// // // //           <marker
// // // //             id="arrowhead"
// // // //             markerWidth="10"
// // // //             markerHeight="7"
// // // //             refX="9"
// // // //             refY="3.5"
// // // //             orient="auto"
// // // //           >
// // // //             <polygon points="0 0, 10 3.5, 0 7" className="arrow-marker" />
// // // //           </marker>
// // // //         </defs>

// // // //         {parameters.length > 0 && parameters.map((param, index) => {
// // // //           const y = (index + 1) * (400 / (parameters.length + 1)) - 40;
// // // //           const yOffset = parameters.length === 1 ? 160 : y;

// // // //           return (
// // // //             <g key={`param-${index}`}>
// // // //               <text x="80" y={yOffset - 15} textAnchor="middle" className="param-type">
// // // //                 {param.type}
// // // //               </text>
// // // //               <rect
// // // //                 x="20"
// // // //                 y={yOffset}
// // // //                 width="120"
// // // //                 height="80"
// // // //                 rx="6"
// // // //                 className="param-box"
// // // //               />
// // // //               <g>
// // // //                 <title>{param.nameExplanation}</title>
// // // //                 <foreignObject x="30" y={yOffset + 20} width="100" height="40">
// // // //                   <div style={{ textAlign: 'center', fontSize: '16px' }}>
// // // //                     {processContent(`#tab:${param.name}#`)}
// // // //                   </div>
// // // //                 </foreignObject>
// // // //               </g>
// // // //               <path
// // // //                 d={getArrowPath(140, yOffset + 40, 300, 200)}
// // // //                 className="arrow-path"
// // // //                 markerEnd="url(#arrowhead)"
// // // //               />
// // // //             </g>
// // // //           );
// // // //         })}

// // // //         <rect
// // // //           x="300"
// // // //           y="100"
// // // //           width="400"
// // // //           height="200"
// // // //           rx="12"
// // // //           className="function-box"
// // // //         />
// // // //         <text x="320" y="90" className="function-text" style={{ fontSize: '16px' }}>
// // // //           {funcName}
// // // //         </text>
// // // //         {wrapText(description, 380).map((line, i) => (
// // // //           <text key={i} x="320" y={120 + (i * 20)} className="function-text" style={{ fontSize: '14px' }}>
// // // //             {line}
// // // //           </text>
// // // //         ))}

// // // //         <text x="880" y="170" textAnchor="middle" className="param-type">
// // // //           {returnType}
// // // //         </text>
// // // //         <rect
// // // //           x="820"
// // // //           y="180"
// // // //           width="120"
// // // //           height="40"
// // // //           rx="6"
// // // //           className="return-box"
// // // //         />
// // // //         <text
// // // //           x="880"
// // // //           y="200"
// // // //           textAnchor="middle"
// // // //           dominantBaseline="middle"
// // // //           className="return-text"
// // // //         >
// // // //           return
// // // //         </text>
// // // //         <path
// // // //           d={getArrowPath(700, 200, 820, 200)}
// // // //           className="arrow-path"
// // // //           markerEnd="url(#arrowhead)"
// // // //         />
// // // //       </svg>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default CFunctionFlow;

// // // import React from 'react';
// // // import './CFunctionFlow.css';
// // // import { processContent } from '@/utils/contentProcessor';

// // // const CFunctionFlow = ({ functionPrototype }) => {
// // //   const { returnType, funcName, parameters, description } = functionPrototype;

// // //   const getArrowPath = (startX, startY, endX, endY) => {
// // //     const controlPoint = (startX + endX) / 2;
// // //     return `M ${startX} ${startY} C ${controlPoint} ${startY}, ${controlPoint} ${endY}, ${endX} ${endY}`;
// // //   };

// // //   const wrapText = (text, width) => {
// // //     if (!text) return [];
// // //     const words = text.toString().split(' ');
// // //     const lines = [];
// // //     let currentLine = words[0];

// // //     for (let i = 1; i < words.length; i++) {
// // //       const word = words[i];
// // //       const testLine = currentLine + ' ' + word;
// // //       if (testLine.length * 7 > width) {
// // //         lines.push(currentLine);
// // //         currentLine = word;
// // //       } else {
// // //         currentLine = testLine;
// // //       }
// // //     }
// // //     lines.push(currentLine);
// // //     return lines;
// // //   };

// // //   // Calculate vertical spacing based on number of parameters
// // //   const getYOffset = (index, totalParams) => {
// // //     if (totalParams <= 2) {
// // //       return (index + 1) * (400 / (totalParams + 1)) - 40;
// // //     } else {
// // //       // Spread out more vertically when more than 2 parameters
// // //       const totalHeight = 300; // Using more vertical space
// // //       const spacing = totalHeight / (totalParams + 1);
// // //       return spacing * (index + 1);
// // //     }
// // //   };

// // //   return (
// // //     <div className="diagram-container">
// // //       <svg className="svg-diagram" viewBox="0 0 1000 400">
// // //         <defs>
// // //           <marker
// // //             id="arrowhead"
// // //             markerWidth="10"
// // //             markerHeight="7"
// // //             refX="9"
// // //             refY="3.5"
// // //             orient="auto"
// // //           >
// // //             <polygon points="0 0, 10 3.5, 0 7" className="arrow-marker" />
// // //           </marker>
// // //         </defs>

// // //         {parameters.length > 0 && parameters.map((param, index) => {
// // //           const yOffset = getYOffset(index, parameters.length);

// // //           return (
// // //             <g key={`param-${index}`}>
// // //               <text x="80" y={yOffset - 15} textAnchor="middle" className="param-type">
// // //                 {param.type}
// // //               </text>
// // //               <rect
// // //                 x="20"
// // //                 y={yOffset}
// // //                 width="120"
// // //                 height="80"
// // //                 rx="6"
// // //                 className="param-box"
// // //               />
// // //               <g>
// // //                 <title>{param.nameExplanation}</title>
// // //                 <foreignObject x="30" y={yOffset + 20} width="100" height="40">
// // //                   <div style={{ textAlign: 'center', fontSize: '16px' }}>
// // //                     {processContent(`#tab:${param.name}#`)}
// // //                   </div>
// // //                 </foreignObject>
// // //               </g>
// // //               <path
// // //                 d={getArrowPath(140, yOffset + 40, 300, 200)}
// // //                 className="arrow-path"
// // //                 markerEnd="url(#arrowhead)"
// // //               />
// // //             </g>
// // //           );
// // //         })}

// // //         <rect
// // //           x="300"
// // //           y="100"
// // //           width="400"
// // //           height="200"
// // //           rx="12"
// // //           className="function-box"
// // //         />
// // //         <text x="320" y="90" className="function-text" style={{ fontSize: '16px' }}>
// // //           {funcName}
// // //         </text>
// // //         {wrapText(description, 380).map((line, i) => (
// // //           <text key={i} x="320" y={120 + (i * 20)} className="function-text" style={{ fontSize: '14px' }}>
// // //             {line}
// // //           </text>
// // //         ))}

// // //         <text x="880" y="170" textAnchor="middle" className="param-type">
// // //           {returnType}
// // //         </text>
// // //         <rect
// // //           x="820"
// // //           y="180"
// // //           width="120"
// // //           height="40"
// // //           rx="6"
// // //           className="return-box"
// // //         />
// // //         <text
// // //           x="880"
// // //           y="200"
// // //           textAnchor="middle"
// // //           dominantBaseline="middle"
// // //           className="return-text"
// // //         >
// // //           return
// // //         </text>
// // //         <path
// // //           d={getArrowPath(700, 200, 820, 200)}
// // //           className="arrow-path"
// // //           markerEnd="url(#arrowhead)"
// // //         />
// // //       </svg>
// // //     </div>
// // //   );
// // // };

// // // export default CFunctionFlow;

// // import React from 'react';
// // import './CFunctionFlow.css';
// // import { processContent } from '@/utils/contentProcessor';

// // const CFunctionFlow = ({ functionPrototype }) => {
// //   const { returnType, funcName, parameters, description } = functionPrototype;

// //   const getArrowPath = (startX, startY, endX, endY) => {
// //     const controlPoint = (startX + endX) / 2;
// //     return `M ${startX} ${startY} C ${controlPoint} ${startY}, ${controlPoint} ${endY}, ${endX} ${endY}`;
// //   };

// //   const wrapText = (text, width) => {
// //     if (!text) return [];
// //     const words = text.toString().split(' ');
// //     const lines = [];
// //     let currentLine = words[0];

// //     for (let i = 1; i < words.length; i++) {
// //       const word = words[i];
// //       const testLine = currentLine + ' ' + word;
// //       if (testLine.length * 7 > width) {
// //         lines.push(currentLine);
// //         currentLine = word;
// //       } else {
// //         currentLine = testLine;
// //       }
// //     }
// //     lines.push(currentLine);
// //     return lines;
// //   };

// //   // Adjust spacing based on number of parameters
// //   const getYPosition = (index, total) => {
// //     if (total <= 2) {
// //       // For 1-2 parameters, keep original spacing
// //       const y = (index + 1) * (400 / (total + 1)) - 40;
// //       return total === 1 ? 160 : y;
// //     } else {
// //       // For 3+ parameters, space evenly with minimum gap
// //       const startY = 50;  // Start higher up
// //       const gap = 100;    // Minimum gap between boxes
// //       return startY + (index * gap);
// //     }
// //   };

// //   return (
// //     <div className="diagram-container">
// //       <svg className="svg-diagram" viewBox="0 0 1000 400">
// //         <defs>
// //           <marker
// //             id="arrowhead"
// //             markerWidth="10"
// //             markerHeight="7"
// //             refX="9"
// //             refY="3.5"
// //             orient="auto"
// //           >
// //             <polygon points="0 0, 10 3.5, 0 7" className="arrow-marker" />
// //           </marker>
// //         </defs>

// //         {parameters.length > 0 && parameters.map((param, index) => {
// //           const yPos = getYPosition(index, parameters.length);

// //           return (
// //             <g key={`param-${index}`}>
// //               <text x="80" y={yPos - 15} textAnchor="middle" className="param-type">
// //                 {param.type}
// //               </text>
// //               <rect
// //                 x="20"
// //                 y={yPos}
// //                 width="120"
// //                 height="80"
// //                 rx="6"
// //                 className="param-box"
// //               />
// //               <g>
// //                 <title>{param.nameExplanation}</title>
// //                 <foreignObject x="30" y={yPos + 20} width="100" height="40">
// //                   <div style={{ textAlign: 'center', fontSize: '16px' }}>
// //                     {processContent(`#tab:${param.name}#`)}
// //                   </div>
// //                 </foreignObject>
// //               </g>
// //               <path
// //                 d={getArrowPath(140, yPos + 40, 300, 200)}
// //                 className="arrow-path"
// //                 markerEnd="url(#arrowhead)"
// //               />
// //             </g>
// //           );
// //         })}

// //         <rect
// //           x="300"
// //           y="100"
// //           width="400"
// //           height="200"
// //           rx="12"
// //           className="function-box"
// //         />
// //         <text x="320" y="90" className="function-text" style={{ fontSize: '16px' }}>
// //           {funcName}
// //         </text>
// //         {wrapText(description, 380).map((line, i) => (
// //           <text key={i} x="320" y={120 + (i * 20)} className="function-text" style={{ fontSize: '14px' }}>
// //             {line}
// //           </text>
// //         ))}

// //         <text x="880" y="170" textAnchor="middle" className="param-type">
// //           {returnType}
// //         </text>
// //         <rect
// //           x="820"
// //           y="180"
// //           width="120"
// //           height="40"
// //           rx="6"
// //           className="return-box"
// //         />
// //         <text
// //           x="880"
// //           y="200"
// //           textAnchor="middle"
// //           dominantBaseline="middle"
// //           className="return-text"
// //         >
// //           return
// //         </text>
// //         <path
// //           d={getArrowPath(700, 200, 820, 200)}
// //           className="arrow-path"
// //           markerEnd="url(#arrowhead)"
// //         />
// //       </svg>
// //     </div>
// //   );
// // };

// // export default CFunctionFlow;

// // import React from 'react';
// // import './CFunctionFlow.css';
// // import { processContent } from '@/utils/contentProcessor';
// // import Link from 'next/link';

// // const CFunctionFlow = ({ functionPrototype }) => {
// //   const { returnType, funcName, parameters, description } = functionPrototype;

// //   const getArrowPath = (startX, startY, endX, endY) => {
// //     const controlPoint = (startX + endX) / 2;
// //     return `M ${startX} ${startY} C ${controlPoint} ${startY}, ${controlPoint} ${endY}, ${endX} ${endY}`;
// //   };

// //   const wrapText = (text, width) => {
// //     if (!text) return [];
// //     const words = text.toString().split(' ');
// //     const lines = [];
// //     let currentLine = words[0];

// //     for (let i = 1; i < words.length; i++) {
// //       const word = words[i];
// //       const testLine = currentLine + ' ' + word;
// //       if (testLine.length * 7 > width) {
// //         lines.push(currentLine);
// //         currentLine = word;
// //       } else {
// //         currentLine = testLine;
// //       }
// //     }
// //     lines.push(currentLine);
// //     return lines;
// //   };

// //   const getYPosition = (index, total) => {
// //     if (total <= 2) {
// //       // For 1-2 parameters, keep original spacing around center
// //       const y = (index + 1) * (400 / (total + 1)) - 40;
// //       return total === 1 ? 160 : y;
// //     } else {
// //       // For 3+ parameters, center the column around y=200 (middle)
// //       const boxHeight = 80;
// //       const gap = 40;
// //       const totalHeight = (total * boxHeight) + ((total - 1) * gap);
// //       const startY = 200 - (totalHeight / 2);
// //       return startY + (index * (boxHeight + gap));
// //     }
// //   };

// //   return (
// //     <div className="diagram-container">
// //       <svg className="svg-diagram" viewBox="0 0 1000 400">
// //         <defs>
// //           <marker
// //             id="arrowhead"
// //             markerWidth="10"
// //             markerHeight="7"
// //             refX="9"
// //             refY="3.5"
// //             orient="auto"
// //           >
// //             <polygon points="0 0, 10 3.5, 0 7" className="arrow-marker" />
// //           </marker>
// //         </defs>

// //         {parameters.length > 0 && parameters.map((param, index) => {
// //           const yPos = getYPosition(index, parameters.length);

// //           return (
// //             <g key={`param-${index}`}>
// //               <text x="80" y={yPos - 15} textAnchor="middle" className="param-type">
// //                 {param.type}
// //               </text>
// //               <rect
// //                 x="20"
// //                 y={yPos}
// //                 width="120"
// //                 height="80"
// //                 rx="6"
// //                 className="param-box"
// //               />
// //               <g>
// //                 <title>{param.nameExplanation}</title>
// //                 <foreignObject x="30" y={yPos + 20} width="100" height="40">
// //                   <div style={{ textAlign: 'center', fontSize: '16px' }}>
// //                   {processContent(`<a href="#tab-parameters">${param.name}</a>`)}
                   
// //                   </div>
// //                 </foreignObject>
// //               </g>
// //               <path
// //                 d={getArrowPath(140, yPos + 40, 300, 200)}
// //                 className="arrow-path"
// //                 markerEnd="url(#arrowhead)"
// //               />
// //             </g>
// //           );
// //         })}

// //         <rect
// //           x="300"
// //           y="100"
// //           width="400"
// //           height="200"
// //           rx="12"
// //           className="function-box"
// //         />
// //         <text x="320" y="90" className="function-text" style={{ fontSize: '16px' }}>
// //           {funcName}
// //         </text>
// //         {wrapText(description, 380).map((line, i) => (
// //           <text key={i} x="320" y={120 + (i * 20)} className="function-text" style={{ fontSize: '14px' }}>
// //             {line}
// //           </text>
// //         ))}

// //         <text x="880" y="170" textAnchor="middle" className="param-type">
// //           {returnType}
// //         </text>
// //         <rect
// //           x="820"
// //           y="180"
// //           width="120"
// //           height="40"
// //           rx="6"
// //           className="return-box"
// //         />
        
// //         <text
// //           x="880"
// //           y="200"
// //           textAnchor="middle"
// //           dominantBaseline="middle"
// //           className="return-text"
// //         >
           
// //        {/* <foreignObject> */}
// //        {/* <div style={{ textAlign: 'center', fontSize: '16px' }}> */}
// //           {processContent(`<a href="#tab-return">Return Value</a>`)}
// //           {/* </div> */}
// //           {/* </foreignObject> */}
         
// //         </text>
// //         <path
// //           d={getArrowPath(700, 200, 820, 200)}
// //           className="arrow-path"
// //           markerEnd="url(#arrowhead)"
// //         />
// //       </svg>
// //     </div>
// //   );
// // };

// // export default CFunctionFlow;


// // import React from 'react';
// // import './CFunctionFlow.css';
// // import { processContent } from '@/utils/contentProcessor';
// // import Link from 'next/link';


// // const ModifierWithTooltip = ({ text, tooltip }) => (
// //     <div className="modifier">
// //       <span className="text">{text}</span>
// //       <div className="tooltip">{tooltip}</div>
// //     </div>
// //   );

// // const CFunctionFlow = ({ functionPrototype }) => {
// //   const { returnType, funcName, parameters, description } = functionPrototype;

// //   const getArrowPath = (startX, startY, endX, endY) => {
// //     const controlPoint = (startX + endX) / 2;
// //     return `M ${startX} ${startY} C ${controlPoint} ${startY}, ${controlPoint} ${endY}, ${endX} ${endY}`;
// //   };

// //   const wrapText = (text, width) => {
// //     if (!text) return [];
// //     const words = text.toString().split(' ');
// //     const lines = [];
// //     let currentLine = words[0];

// //     for (let i = 1; i < words.length; i++) {
// //       const word = words[i];
// //       const testLine = currentLine + ' ' + word;
// //       if (testLine.length * 7 > width) {
// //         lines.push(currentLine);
// //         currentLine = word;
// //       } else {
// //         currentLine = testLine;
// //       }
// //     }
// //     lines.push(currentLine);
// //     return lines;
// //   };

// //   const getYPosition = (index, total) => {
// //     if (total <= 2) {
// //       const y = (index + 1) * (400 / (total + 1)) - 40;
// //       return total === 1 ? 160 : y;
// //     } else {
// //       const boxHeight = 80;
// //       const gap = 40;
// //       const totalHeight = (total * boxHeight) + ((total - 1) * gap);
// //       const startY = 200 - (totalHeight / 2);
// //       return startY + (index * (boxHeight + gap));
// //     }
// //   };

// //   return (
// //     <div className="diagram-container">
// //       <svg className="svg-diagram" viewBox="0 0 1000 400">
// //         <defs>
// //           <marker
// //             id="arrowhead"
// //             markerWidth="10"
// //             markerHeight="7"
// //             refX="9"
// //             refY="3.5"
// //             orient="auto"
// //           >
// //             <polygon points="0 0, 10 3.5, 0 7" className="arrow-marker" />
// //           </marker>
// //         </defs>

// //         {parameters.length > 0 && parameters.map((param, index) => {
// //           const yPos = getYPosition(index, parameters.length);

// //           return (
// //             <g key={`param-${index}`}>
// //               <text x="80" y={yPos - 15}
// //                textAnchor="middle" 
// //                className="param-type">
// //                 {param.type}
// //               </text>
// //               <rect
// //                 x="20"
// //                 y={yPos}
// //                 width="120"
// //                 height="80"
// //                 rx="6"
// //                 className="param-box"
// //               />
// //               <g>
// //                 {/* <title className='tooltip'>{param.nameExplanation}</title>
// //                 <ModifierWithTooltip tooltip={param.nameExplanation}/> */}
// //                 <foreignObject x="30" y={yPos + 20} width="300" height="300">
                 

// //                 <div className="modifier">
// //                 <div className="text">
// //                     {processContent(`<a href="#tab-parameters">${param.name}</a>`)}
// //                 </div>
// //                 {/* <div className="tooltip">{param.nameExplanation}</div> */}
// //                 </div>
// //                 </foreignObject>
// //               </g>
// //               <path
// //                 d={getArrowPath(140, yPos + 40, 300, 200)}
// //                 className="arrow-path"
// //                 markerEnd="url(#arrowhead)"
// //               />
// //             </g>
// //           );
// //         })}

// //         <rect
// //           x="300"
// //           y="100"
// //           width="400"
// //           height="200"
// //           rx="12"
// //           className="function-box"
// //         />
// //         <text x="320" y="90" className="function-text" style={{ fontSize: '16px' }}>
// //           {funcName}
// //         </text>
// //         {wrapText(description, 380).map((line, i) => (
// //           <text key={i} x="320" y={120 + (i * 20)} className="function-text" style={{ fontSize: '14px' }}>
// //             {line}
// //           </text>
// //         ))}

// //         <text x="880" y="170" textAnchor="middle" className="param-type">
// //           {returnType}
// //         </text>
// //         <rect
// //           x="820"
// //           y="180"
// //           width="120"
// //           height="40"
// //           rx="6"
// //           className="return-box"
// //         />
        
// //         <foreignObject x="820" y="180" width="120" height="40">
// //           <div 
// //           className='return'
// //           style={{ 
// //             width: '100%', 
// //             height: '100%', 
// //             display: 'flex', 
// //             alignItems: 'center', 
// //             justifyContent: 'center',
// //             fontSize: '18px',
// //             color: '#007bff',
// //             fontWeight:'bold'
// //           }}>
// //             {processContent(`<a href="#tab-return">Return Value</a>`)}
// //           </div>
// //         </foreignObject>

// //         <path
// //           d={getArrowPath(700, 200, 820, 200)}
// //           className="arrow-path"
// //           markerEnd="url(#arrowhead)"
// //         />
// //       </svg>
// //     </div>
// //   );
// // };

// // export default CFunctionFlow;


// import React from 'react';
// import './CFunctionFlow.css';
// import { processContent } from '@/utils/contentProcessor';
// import Link from 'next/link';


// const ModifierWithTooltip = ({ text, tooltip }) => (
//     <div className="modifier">
//       <span className="text">{text}</span>
//       <div className="tooltip">{tooltip}</div>
//     </div>
//   );

// const CFunctionFlow = ({ functionPrototype }) => {
//   const { returnType, funcName, parameters, description } = functionPrototype;

//   const getArrowPath = (startX, startY, endX, endY) => {
//     const controlPoint = (startX + endX) / 2;
//     return `M ${startX} ${startY} C ${controlPoint} ${startY}, ${controlPoint} ${endY}, ${endX} ${endY}`;
//   };

//   const wrapText = (text, width) => {
//     if (!text) return [];
//     const words = text.toString().split(' ');
//     const lines = [];
//     let currentLine = words[0];

//     for (let i = 1; i < words.length; i++) {
//       const word = words[i];
//       const testLine = currentLine + ' ' + word;
//       if (testLine.length * 7 > width) {
//         lines.push(currentLine);
//         currentLine = word;
//       } else {
//         currentLine = testLine;
//       }
//     }
//     lines.push(currentLine);
//     return lines;
//   };

//   const getYPosition = (index, total) => {
//     if (total <= 2) {
//       const y = (index + 1) * (400 / (total + 1)) - 40;
//       return total === 1 ? 160 : y;
//     } else {
//       const boxHeight = 80;
//       const gap = 40;
//       const totalHeight = (total * boxHeight) + ((total - 1) * gap);
//       const startY = 200 - (totalHeight / 2);
//       return startY + (index * (boxHeight + gap));
//     }
//   };

//   return (
//     <div className="diagram-container">
//      <svg className="svg-diagram" viewBox="0 0 1000 400" style={{ marginTop: parameters.length <= 2 ? '-100px' : '0px' }}>
//         <defs>
//           <marker
//             id="arrowhead"
//             markerWidth="10"
//             markerHeight="7"
//             refX="9"
//             refY="3.5"
//             orient="auto"
//           >
//             <polygon points="0 0, 10 3.5, 0 7" className="arrow-marker" />
//           </marker>
//         </defs>

//         {parameters.length > 0 && parameters.map((param, index) => {
//           const yPos = getYPosition(index, parameters.length);

//           return (
//             <g key={`param-${index}`}>
//               <text x="80" y={yPos - 15}
//                textAnchor="middle" 
//                className="param-type">
//                 {param.type}
//               </text>
//               <rect
//                 x="20"
//                 y={yPos}
//                 width="120"
//                 height="80"
//                 rx="6"
//                 className="param-box"
//               />
//               <g>
//                 {/* <title className='tooltip'>{param.nameExplanation}</title>
//                 <ModifierWithTooltip tooltip={param.nameExplanation}/> */}
//                 <foreignObject x="30" y={yPos + 20} width="300" height="300">
                 
//                 <div className="modifier">
//                 <div className="text">
//                     {processContent(`<a href="#tab-parameters">${param.name}</a>`)}
//                 </div>
//                 {/* <div className="tooltip">{param.nameExplanation}</div> */}
//                 </div>
//                 </foreignObject>
//               </g>
//               <path
//                 d={getArrowPath(140, yPos + 40, 250, 200)}
//                 className="arrow-path"
//                 markerEnd="url(#arrowhead)"
//               />
//             </g>
//           );
//         })}

//         <rect
//           x="250"
//           y="0"
//           width="500"
//           height="400"
//           rx="12"
//           className="function-box"
//         />
//         <text x="320" y="-10" className="function-text" style={{ fontSize: '20px' }}>
//           {funcName}
//         </text>
//         {wrapText(description, 380).map((line, i) => (
//           <text key={i} x="320" y={120 + (i * 20)} className="function-text" style={{ fontSize: '14px' }}>
//             {line}
//           </text>
//         ))}

//         <text x="880" y="170" textAnchor="middle" className="param-type">
//           {returnType}
//         </text>
//         <rect
//           x="820"
//           y="180"
//           width="120"
//           height="40"
//           rx="6"
//           className="return-box"
//         />
        
//         <foreignObject x="820" y="180" width="120" height="40">
//           <div 
//           className='return'
//           style={{ 
//             width: '100%', 
//             height: '100%', 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'center',
//             fontSize: '18px',
//             color: '#007bff',
//             fontWeight:'bold'
//           }}>
//             {processContent(`<a href="#tab-return">Return Value</a>`)}
//           </div>
//         </foreignObject>

//         <path
//           d={getArrowPath(750, 200, 820, 200)}
//           className="arrow-path"
//           markerEnd="url(#arrowhead)"
//         />
//       </svg>
//     </div>
//   );
// };

// export default CFunctionFlow;


import React from 'react';
import './CFunctionFlow.css';
import { processContent } from '@/utils/contentProcessor';
import Link from 'next/link';

const ModifierWithTooltip = ({ text, tooltip }) => (
   <div className="modifier">
     <span className="text">{text}</span>
     <div className="tooltip">{tooltip}</div>
   </div>
 );

const CFunctionFlow = ({ functionPrototype }) => {
 const { returnType, funcName, parameters, description } = functionPrototype;

 const getArrowPath = (startX, startY, endX, endY) => {
   const controlPoint = (startX + endX) / 2;
   return `M ${startX} ${startY} C ${controlPoint} ${startY}, ${controlPoint} ${endY}, ${endX} ${endY}`;
 };

 const wrapText = (text, width) => {
   if (!text) return [];
   const words = text.toString().split(' ');
   const lines = [];
   let currentLine = words[0];

   for (let i = 1; i < words.length; i++) {
     const word = words[i];
     const testLine = currentLine + ' ' + word;
     if (testLine.length * 7 > width) {
       lines.push(currentLine);
       currentLine = word;
     } else {
       currentLine = testLine;
     }
   }
   lines.push(currentLine);
   return lines;
 };

 const getYPosition = (index, total) => {
   if (total <= 2) {
     const y = (index + 1) * (400 / (total + 1)) - 40;
     return total === 1 ? 160 : y;
   } else {
     const boxHeight = 80;
     const gap = 40;
     const totalHeight = (total * boxHeight) + ((total - 1) * gap);
     const startY = 200 - (totalHeight / 2);
     return startY + (index * (boxHeight + gap));
   }
 };

 return (
   <div className="diagram-container">
    <svg className="svg-diagram" viewBox="0 0 1000 400" style={{ marginTop: parameters.length <= 2 ? '-100px' : '0px' }}>
       <defs>
         <marker
           id="arrowhead"
           markerWidth="10"
           markerHeight="7"
           refX="9"
           refY="3.5"
           orient="auto"
         >
           <polygon points="0 0, 10 3.5, 0 7" className="arrow-marker" />
         </marker>
       </defs>

       {parameters.length > 0 && parameters.map((param, index) => {
         const yPos = getYPosition(index, parameters.length);

         return (
           <g key={`param-${index}`}>
             <text x="80" y={yPos - 15}
              textAnchor="middle" 
              className="param-type">
               {param.type}
             </text>
             <rect
               x="20"
               y={yPos}
               width="120"
               height="80"
               rx="6"
               className="param-box"
             />
             <g>
               <foreignObject x="30" y={yPos + 20} width="300" height="300">
                
               <div className="modifier">
               <div className="text">
                   {processContent(`<a href="#tab-parameters">${param.name}</a>`)}
               </div>
               </div>
               </foreignObject>
             </g>
             <path
               d={getArrowPath(140, yPos + 40, 250, 200)}
               className="arrow-path"
               markerEnd="url(#arrowhead)"
             />
           </g>
         );
       })}

       <rect
         x="250"
         y="0"
         width="500"
         height="400"
         rx="12"
         className="function-box"
       />

       <foreignObject x="270" y="-30" width="460" height="360">
         <div>
           <div style={{ fontSize: '20px', marginBottom: '20px', color: '#7C3AED' }}>{funcName}</div>
           {processContent(description)}
         </div>
       </foreignObject>

       <text x="880" y="170" textAnchor="middle" className="param-type">
         {returnType}
       </text>
       <rect
         x="820"
         y="180"
         width="120"
         height="40"
         rx="6"
         className="return-box"
       />
       
       <foreignObject x="820" y="180" width="120" height="40">
         <div 
         className='return'
         style={{ 
           width: '100%', 
           height: '100%', 
           display: 'flex', 
           alignItems: 'center', 
           justifyContent: 'center',
           fontSize: '18px',
           color: '#007bff',
           fontWeight:'bold'
         }}>
           {processContent(`<a href="#tab-return">Return Value</a>`)}
         </div>
       </foreignObject>

       <path
         d={getArrowPath(750, 200, 820, 200)}
         className="arrow-path"
         markerEnd="url(#arrowhead)"
       />
     </svg>
   </div>
 );
};

export default CFunctionFlow;