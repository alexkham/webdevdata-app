// // // // // 'use client';

// // // // // import React from 'react';
// // // // // import { tokenize } from './tokenizer';
// // // // // import { themes } from './themes';

// // // // // export default function ScopeIllustration({ 
// // // // //   code = `int x = 10;  // Global scope

// // // // // void main() {
// // // // //     int y = 20;  // Function scope
    
// // // // //     if (y > 0) {
// // // // //         int z = 30;  // Block scope
// // // // //         x = z + y;
// // // // //     }
    
// // // // //     // z not visible here
// // // // //     y = x + 5;
// // // // // }`,
// // // // //   title = "Variable Scope Visualization",
// // // // //   explanation = "Different levels of variable visibility in C"
// // // // // }) {
// // // // //   const tokens = tokenize(code);
// // // // //   const lines = code.split('\n');
// // // // //   const lineHeight = 28;
// // // // //   const padding = 40;
// // // // //   const width = 600;
// // // // //   const titleHeight = 50;
// // // // //   const explanationHeight = 50;
// // // // //   const codeHeight = lines.length * lineHeight + padding * 2;
// // // // //   const height = codeHeight + titleHeight + explanationHeight;

// // // // //   // Calculate scope levels for each line
// // // // //   const scopeLevels = lines.map(line => {
// // // // //     return (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
// // // // //   });

// // // // //   let currentLevel = 0;
// // // // //   const scopeDepths = scopeLevels.map(level => {
// // // // //     currentLevel += level;
// // // // //     return currentLevel;
// // // // //   });

// // // // //   const scopeColors = [
// // // // //     'rgba(44, 62, 80, 0.1)',   // Global scope
// // // // //     'rgba(52, 152, 219, 0.1)', // Function scope
// // // // //     'rgba(155, 89, 182, 0.1)', // Block scope
// // // // //     'rgba(46, 204, 113, 0.1)'  // Deeper nested scopes
// // // // //   ];

// // // // //   return (
// // // // //     <div style={{ width, height, position: 'relative' }}>
// // // // //       <svg 
// // // // //         width={width} 
// // // // //         height={height}
// // // // //         viewBox={`0 0 ${width} ${height}`}
// // // // //       >
// // // // //         {/* Header */}
// // // // //         <rect 
// // // // //           x="0" 
// // // // //           y="0" 
// // // // //           width={width} 
// // // // //           height={titleHeight} 
// // // // //           fill="#2C3E50" 
// // // // //         />
// // // // //         <text
// // // // //           x={padding}
// // // // //           y={titleHeight/2}
// // // // //           fill="white"
// // // // //           fontSize="18"
// // // // //           fontWeight="bold"
// // // // //           fontFamily="system-ui"
// // // // //           dominantBaseline="middle"
// // // // //         >
// // // // //           {title}
// // // // //         </text>

// // // // //         {/* Code section background */}
// // // // //         <rect 
// // // // //           x="0" 
// // // // //           y={titleHeight} 
// // // // //           width={width} 
// // // // //           height={codeHeight} 
// // // // //           fill="#e6e6e6" 
// // // // //         />

// // // // //         {/* Scope level backgrounds */}
// // // // //         {scopeDepths.map((depth, lineIndex) => {
// // // // //           if (depth > 0) {
// // // // //             return (
// // // // //               <rect
// // // // //                 key={`scope-${lineIndex}`}
// // // // //                 x={padding * (depth)}
// // // // //                 y={titleHeight + lineIndex * lineHeight}
// // // // //                 width={width - (padding * depth) - padding}
// // // // //                 height={lineHeight}
// // // // //                 fill={scopeColors[depth - 1] || scopeColors[scopeColors.length - 1]}
// // // // //               />
// // // // //             );
// // // // //           }
// // // // //           return null;
// // // // //         })}

// // // // //         {/* Code with syntax highlighting */}
// // // // //         {lines.map((line, lineIndex) => (
// // // // //           <text
// // // // //             key={lineIndex}
// // // // //             x={padding}
// // // // //             y={titleHeight + padding + lineIndex * lineHeight - padding/2}
// // // // //             fill="#2F2F2F"
// // // // //             fontSize="16"
// // // // //             fontFamily="monospace"
// // // // //             style={{ whiteSpace: 'pre' }}
// // // // //           >
// // // // //             {line}
// // // // //           </text>
// // // // //         ))}

// // // // //         {/* Explanation section */}
// // // // //         <rect 
// // // // //           x="0" 
// // // // //           y={titleHeight + codeHeight} 
// // // // //           width={width} 
// // // // //           height={explanationHeight} 
// // // // //           fill="#f5f5f5" 
// // // // //         />
// // // // //         <text
// // // // //           x={padding}
// // // // //           y={titleHeight + codeHeight + explanationHeight/2}
// // // // //           fill="#404040"
// // // // //           fontSize="14"
// // // // //           fontFamily="system-ui"
// // // // //           dominantBaseline="middle"
// // // // //         >
// // // // //           {explanation}
// // // // //         </text>
// // // // //       </svg>
// // // // //     </div>
// // // // //   );
// // // // // }


// // // // 'use client';

// // // // import React from 'react';
// // // // import { tokenize } from './tokenizer';
// // // // import { themes } from './themes';

// // // // export default function ScopeIllustration({ 
// // // //   code = `int x = 10;  // Global scope

// // // // void main() {
// // // //     int y = 20;  // Function scope
    
// // // //     if (y > 0) {
// // // //         int z = 30;  // Block scope
// // // //         x = z + y;
// // // //     }
    
// // // //     // z not visible here
// // // //     y = x + 5;
// // // // }`,
// // // //   title = "Variable Scope Visualization",
// // // //   explanation = "Different levels of variable visibility in C"
// // // // }) {
// // // //   const lines = code.split('\n');
// // // //   const lineHeight = 28;
// // // //   const padding = 40;
// // // //   const leftPadding = 20;  // Added left padding
// // // //   const width = 600;
// // // //   const titleHeight = 50;
// // // //   const explanationHeight = 50;
// // // //   const codeHeight = lines.length * lineHeight + padding * 2;
// // // //   const height = codeHeight + titleHeight + explanationHeight;

// // // //   // More vivid scope colors
// // // //   const scopeColors = [
// // // //     'rgba(52, 152, 219, 0.2)',  // Blue for global
// // // //     'rgba(155, 89, 182, 0.2)',  // Purple for first level
// // // //     'rgba(46, 204, 113, 0.2)',  // Green for second level
// // // //     'rgba(231, 76, 60, 0.2)'    // Red for third level
// // // //   ];

// // // //   // Calculate scope blocks
// // // //   const scopeBlocks = [];
// // // //   let currentLevel = 0;
// // // //   let blockStart = null;

// // // //   lines.forEach((line, index) => {
// // // //     const openBraces = (line.match(/{/g) || []).length;
// // // //     const closeBraces = (line.match(/}/g) || []).length;

// // // //     if (openBraces > 0) {
// // // //       blockStart = index;
// // // //       currentLevel += openBraces;
// // // //     }

// // // //     if (closeBraces > 0 && blockStart !== null) {
// // // //       scopeBlocks.push({
// // // //         start: blockStart,
// // // //         end: index,
// // // //         level: currentLevel
// // // //       });
// // // //       currentLevel -= closeBraces;
// // // //       blockStart = null;
// // // //     }
// // // //   });

// // // //   return (
// // // //     <div style={{ width, height, position: 'relative' }}>
// // // //       <svg 
// // // //         width={width} 
// // // //         height={height}
// // // //         viewBox={`0 0 ${width} ${height}`}
// // // //       >
// // // //         {/* Header */}
// // // //         <rect 
// // // //           x="0" 
// // // //           y="0" 
// // // //           width={width} 
// // // //           height={titleHeight} 
// // // //           fill="#2C3E50" 
// // // //         />
// // // //         <text
// // // //           x={padding}
// // // //           y={titleHeight/2}
// // // //           fill="white"
// // // //           fontSize="18"
// // // //           fontWeight="bold"
// // // //           fontFamily="system-ui"
// // // //           dominantBaseline="middle"
// // // //         >
// // // //           {title}
// // // //         </text>

// // // //         {/* Code section background */}
// // // //         <rect 
// // // //           x="0" 
// // // //           y={titleHeight} 
// // // //           width={width} 
// // // //           height={codeHeight} 
// // // //           fill="#e6e6e6" 
// // // //         />

// // // //         {/* Scope blocks */}
// // // //         {scopeBlocks.map((block, index) => (
// // // //           <rect
// // // //             key={`scope-${index}`}
// // // //             x={leftPadding + (block.level * 20)}  // Indent based on nesting level
// // // //             y={titleHeight + block.start * lineHeight}
// // // //             width={width - (block.level * 20) - padding}
// // // //             height={(block.end - block.start + 1) * lineHeight}
// // // //             fill={scopeColors[block.level - 1] || scopeColors[scopeColors.length - 1]}
// // // //           />
// // // //         ))}

// // // //         {/* Code */}
// // // //         {lines.map((line, lineIndex) => (
// // // //           <text
// // // //             key={lineIndex}
// // // //             x={padding}
// // // //             y={titleHeight + padding + lineIndex * lineHeight - padding/2}
// // // //             fill="#2F2F2F"
// // // //             fontSize="16"
// // // //             fontFamily="monospace"
// // // //             style={{ whiteSpace: 'pre' }}
// // // //           >
// // // //             {line}
// // // //           </text>
// // // //         ))}

// // // //         {/* Explanation section */}
// // // //         <rect 
// // // //           x="0" 
// // // //           y={titleHeight + codeHeight} 
// // // //           width={width} 
// // // //           height={explanationHeight} 
// // // //           fill="#f5f5f5" 
// // // //         />
// // // //         <text
// // // //           x={padding}
// // // //           y={titleHeight + codeHeight + explanationHeight/2}
// // // //           fill="#404040"
// // // //           fontSize="14"
// // // //           fontFamily="system-ui"
// // // //           dominantBaseline="middle"
// // // //         >
// // // //           {explanation}
// // // //         </text>
// // // //       </svg>
// // // //     </div>
// // // //   );
// // // // }

// // // 'use client';

// // // import React from 'react';

// // // export default function ScopeIllustration({ 
// // //   code = `int x = 10;  // Global scope

// // // void main() {
// // //     int y = 20;  // Function scope
    
// // //     if (y > 0) {
// // //         int z = 30;  // Block scope
// // //         x = z + y;
// // //     }

// // //      else if (y > 0) {
// // //         int z = 30;  // Block scope
// // //         x = z + y;
// // //     }
    
// // //     // z not visible here
// // //     y = x + 5;
// // // }`,
// // //   title = "Variable Scope Visualization",
// // //   explanation = "Different levels of variable visibility in C"
// // // }) {
// // //   const lines = code.split('\n');
// // //   const lineHeight = 28;
// // //   const padding = 40;
// // //   const leftPadding = 20;
// // //   const width = 600;
// // //   const titleHeight = 50;
// // //   const explanationHeight = 50;
// // //   const codeHeight = lines.length * lineHeight + padding * 2;
// // //   const height = codeHeight + titleHeight + explanationHeight;

// // //   // More distinct scope colors
// // //   const scopeColors = {
// // //     global: 'rgba(200, 200, 200, 0.5)',      // Light gray for global
// // //     function: 'rgba(176, 196, 222, 0.5)',    // Light steel blue for function
// // //     block: 'rgba(216, 191, 216, 0.5)'        // Light purple for blocks
// // //   };

// // //   // Find scope boundaries
// // //   const functionScope = {
// // //     start: lines.findIndex(line => line.includes('main()')),
// // //     end: lines.length - 1
// // //   };

// // //   const blockScopes = [];
// // //   let currentLevel = 0;
// // //   let blockStart = null;

// // //   lines.forEach((line, index) => {
// // //     if (line.includes('{')) {
// // //       if (currentLevel > 0) { // Skip function opening brace
// // //         blockStart = index;
// // //       }
// // //       currentLevel++;
// // //     }
// // //     if (line.includes('}')) {
// // //       currentLevel--;
// // //       if (blockStart !== null && currentLevel > 0) {
// // //         blockScopes.push({
// // //           start: blockStart,
// // //           end: index
// // //         });
// // //         blockStart = null;
// // //       }
// // //     }
// // //   });

// // //   return (
// // //     <div style={{ width, height, position: 'relative' }}>
// // //       <svg 
// // //         width={width} 
// // //         height={height}
// // //         viewBox={`0 0 ${width} ${height}`}
// // //       >
// // //         {/* Header */}
// // //         <rect 
// // //           x="0" 
// // //           y="0" 
// // //           width={width} 
// // //           height={titleHeight} 
// // //           fill="#2C3E50" 
// // //         />
// // //         <text
// // //           x={padding}
// // //           y={titleHeight/2}
// // //           fill="white"
// // //           fontSize="18"
// // //           fontWeight="bold"
// // //           fontFamily="system-ui"
// // //           dominantBaseline="middle"
// // //         >
// // //           {title}
// // //         </text>

// // //         {/* Global scope background */}
// // //         <rect 
// // //           x={leftPadding}
// // //           y={titleHeight} 
// // //           width={width - leftPadding * 2}
// // //           height={codeHeight} 
// // //           fill={scopeColors.global}
// // //           rx={4}
// // //         />

// // //         {/* Function scope */}
// // //         <rect
// // //           x={leftPadding * 2}
// // //           y={titleHeight + functionScope.start * lineHeight}
// // //           width={width - leftPadding * 4}
// // //           height={(functionScope.end - functionScope.start + 1) * lineHeight}
// // //           fill={scopeColors.function}
// // //           rx={4}
// // //         />

// // //         {/* Block scopes */}
// // //         {blockScopes.map((block, index) => (
// // //           <rect
// // //             key={`block-${index}`}
// // //             x={leftPadding * 3}
// // //             y={titleHeight + block.start * lineHeight}
// // //             width={width - leftPadding * 6}
// // //             height={(block.end - block.start + 1) * lineHeight}
// // //             fill={scopeColors.block}
// // //             rx={4}
// // //           />
// // //         ))}

// // //         {/* Code */}
// // //         {lines.map((line, lineIndex) => (
// // //           <text
// // //             key={lineIndex}
// // //             x={padding}
// // //             y={titleHeight + padding + lineIndex * lineHeight - padding/2}
// // //             fill="#2F2F2F"
// // //             fontSize="16"
// // //             fontFamily="monospace"
// // //             style={{ whiteSpace: 'pre' }}
// // //           >
// // //             {line}
// // //           </text>
// // //         ))}

// // //         {/* Explanation */}
// // //         <rect 
// // //           x="0" 
// // //           y={titleHeight + codeHeight} 
// // //           width={width} 
// // //           height={explanationHeight} 
// // //           fill="#f5f5f5" 
// // //         />
// // //         <text
// // //           x={padding}
// // //           y={titleHeight + codeHeight + explanationHeight/2}
// // //           fill="#404040"
// // //           fontSize="14"
// // //           fontFamily="system-ui"
// // //           dominantBaseline="middle"
// // //         >
// // //           {explanation}
// // //         </text>
// // //       </svg>
// // //     </div>
// // //   );
// // // }


// // 'use client';

// // import React from 'react';

// // export default function ScopeIllustration({ 
// //   codeConfig,
// //   title = "Scope Example",
// //   explanation
// // }) {
// //   if (!codeConfig?.code) return null;

// //   const lines = codeConfig.code.split('\n');
// //   const lineHeight = 28;
// //   const padding = 40;
// //   const width = 600;
// //   const titleHeight = title ? 50 : 0;
// //   const explanationHeight = explanation ? 50 : 0;
// //   const codeHeight = lines.length * lineHeight + padding * 2;
// //   const height = codeHeight + titleHeight + explanationHeight;

// //   // Dynamically find blocks in code
// //   const findBlocks = (code) => {
// //     const blocks = [];
// //     const stack = [];
// //     let blockCount = 0;
    
// //     const codeLines = code.split('\n');
// //     codeLines.forEach((line, index) => {
// //       if (line.includes('{')) {
// //         blockCount++;
// //         stack.push({
// //           start: index,
// //           blockNumber: blockCount
// //         });
// //       }
// //       if (line.includes('}') && stack.length > 0) {
// //         const startInfo = stack.pop();
// //         blocks.push({
// //           start: startInfo.start,
// //           end: index,
// //           color: codeConfig.blockColors?.[startInfo.blockNumber]
// //         });
// //       }
// //     });

// //     return blocks;
// //   };

// //   const blocks = findBlocks(codeConfig.code);

// //   return (
// //     <div style={{ width, height, position: 'relative' }}>
// //       <svg 
// //         width={width} 
// //         height={height}
// //         viewBox={`0 0 ${width} ${height}`}
// //       >
// //         {/* Header */}
// //         {title && (
// //           <>
// //             <rect 
// //               x="0" 
// //               y="0" 
// //               width={width} 
// //               height={titleHeight} 
// //               fill="#2C3E50" 
// //             />
// //             <text
// //               x={padding}
// //               y={titleHeight/2}
// //               fill="white"
// //               fontSize="18"
// //               fontWeight="bold"
// //               fontFamily="system-ui"
// //               dominantBaseline="middle"
// //             >
// //               {title}
// //             </text>
// //           </>
// //         )}

// //         {/* Blocks backgrounds */}
// //         {blocks.map((block, index) => {
// //           if (!block.color) return null;
          
// //           return (
// //             <rect
// //               key={`block-${index}`}
// //               x={padding/2}
// //               y={titleHeight + block.start * lineHeight}
// //               width={width - padding}
// //               height={(block.end - block.start + 1) * lineHeight}
// //               fill={block.color}
// //               rx={4}
// //             />
// //           );
// //         })}

// //         {/* Code */}
// //         {lines.map((line, lineIndex) => (
// //           <text
// //             key={lineIndex}
// //             x={padding}
// //             y={titleHeight + padding + lineIndex * lineHeight - padding/2}
// //             fill="#2F2F2F"
// //             fontSize="16"
// //             fontFamily="monospace"
// //             style={{ whiteSpace: 'pre' }}
// //           >
// //             {line}
// //           </text>
// //         ))}

// //         {/* Explanation */}
// //         {explanation && (
// //           <>
// //             <rect 
// //               x="0" 
// //               y={titleHeight + codeHeight} 
// //               width={width} 
// //               height={explanationHeight} 
// //               fill="#f5f5f5" 
// //             />
// //             <text
// //               x={padding}
// //               y={titleHeight + codeHeight + explanationHeight/2}
// //               fill="#404040"
// //               fontSize="14"
// //               fontFamily="system-ui"
// //               dominantBaseline="middle"
// //             >
// //               {explanation}
// //             </text>
// //           </>
// //         )}
// //       </svg>
// //     </div>
// //   );
// // }


// 'use client';

// import React from 'react';

// export default function ScopeIllustration({ 
//   codeConfig,
//   title,
//   explanation 
// }) {
//   if (!codeConfig?.code) return null;

//   const lines = codeConfig.code.split('\n');
//   const lineHeight = 28;
//   const padding = 40;
//   const width = 600;
//   const titleHeight = title ? 50 : 0;
//   const explanationHeight = explanation ? 50 : 0;
//   const codeHeight = lines.length * lineHeight + padding * 2;
//   const height = codeHeight + titleHeight + explanationHeight;

//   const findBlocks = (code) => {
//     const blocks = [];
//     const stack = [];
//     let blockCount = 0;
//     let level = 0;
    
//     const codeLines = code.split('\n');
//     codeLines.forEach((line, index) => {
//       if (line.includes('{')) {
//         blockCount++;
//         level++;
//         stack.push({
//           start: index,
//           blockNumber: blockCount,
//           level
//         });
//       }
//       if (line.includes('}') && stack.length > 0) {
//         const startInfo = stack.pop();
//         blocks.push({
//           start: startInfo.start,
//           end: index,
//           level: startInfo.level,
//           color: codeConfig.blockColors?.[startInfo.blockNumber]
//         });
//         level--;
//       }
//     });
//     return blocks;
//   };

//   const blocks = findBlocks(codeConfig.code);

//   return (
//     <div style={{ width, height, position: 'relative' }}>
//       <svg 
//         width={width} 
//         height={height}
//         viewBox={`0 0 ${width} ${height}`}
//       >
//         {title && (
//           <>
//             <rect 
//               x="0" 
//               y="0" 
//               width={width} 
//               height={titleHeight} 
//               fill="#2C3E50" 
//             />
//             <text
//               x={padding}
//               y={titleHeight/2}
//               fill="white"
//               fontSize="18"
//               fontWeight="bold"
//               fontFamily="system-ui"
//               dominantBaseline="middle"
//             >
//               {title}
//             </text>
//           </>
//         )}

//         {blocks.map((block, index) => {
//           if (!block.color) return null;
//           const indent = block.level * 20;
          
//           return (
//             <rect
//               key={`block-${index}`}
//               x={padding/2 + indent}
//               y={titleHeight + block.start * lineHeight}
//               width={width - padding - (indent * 2)}
//               height={(block.end - block.start + 1) * lineHeight}
//               fill={block.color}
//               rx={4}
//             />
//           );
//         })}

//         {lines.map((line, lineIndex) => (
//           <text
//             key={lineIndex}
//             x={padding}
//             y={titleHeight + padding + lineIndex * lineHeight - padding/2}
//             fill="#2F2F2F"
//             fontSize="16"
//             fontFamily="monospace"
//             style={{ whiteSpace: 'pre' }}
//           >
//             {line}
//           </text>
//         ))}

//         {explanation && (
//           <>
//             <rect 
//               x="0" 
//               y={titleHeight + codeHeight} 
//               width={width} 
//               height={explanationHeight} 
//               fill="#f5f5f5" 
//             />
//             <text
//               x={padding}
//               y={titleHeight + codeHeight + explanationHeight/2}
//               fill="#404040"
//               fontSize="14"
//               fontFamily="system-ui"
//               dominantBaseline="middle"
//             >
//               {explanation}
//             </text>
//           </>
//         )}
//       </svg>
//     </div>
//   );
// }


'use client';

import React from 'react';

export default function ScopeIllustration({ codeConfig }) {
  const lines = codeConfig.code.split('\n');
  const lineHeight = 28;
  const basePadding = 40;
  const width = 600;
  const height = lines.length * lineHeight + basePadding * 2;

  const findBlocks = () => {
    let currentCount = 0;
    const blocks = [];
    const stack = [];
    
    lines.forEach((line, index) => {
      const openBrace = line.indexOf('{');
      if (openBrace !== -1) {
        currentCount++;
        const level = stack.length;
        stack.push({ start: index, count: currentCount });
        blocks.push({
          start: index,
          level,
          count: currentCount,
          indent: level * 20,
        });
      }
      
      const closeBrace = line.indexOf('}');
      if (closeBrace !== -1 && stack.length) {
        const openBlock = stack.pop();
        const block = blocks.find(b => b.count === openBlock.count);
        if (block) block.end = index;
      }
    });

    return blocks;
  };

  const blocks = findBlocks().map(block => ({
    ...block,
    color: codeConfig.blockColors[block.count]
  }));

  return (
    <div style={{ width, height, position: 'relative' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {blocks.map((block, index) => (
          <rect
            key={index}
            x={basePadding + block.indent}
            y={block.start * lineHeight}
            width={width - (basePadding * 2) - (block.indent * 2)}
            height={(block.end - block.start + 1) * lineHeight}
            fill={block.color}
            rx={4}
          />
        ))}
        {lines.map((line, index) => (
          <text
            key={index}
            x={basePadding}
            y={basePadding + index * lineHeight - basePadding/2}
            fill="#2F2F2F"
            fontSize="16"
            fontFamily="monospace"
            style={{ whiteSpace: 'pre' }}
          >
            {line}
          </text>
        ))}
      </svg>
    </div>
  );
}