// // 'use client';

// // import React from 'react';

// // export default function CodeIllustration({ code }) {
// //   if (!code) return null;
  
// //   const lines = code.split('\n');
// //   const lineHeight = 28;
// //   const padding = 40;
// //   const width = 500;
// //   const height = lines.length * lineHeight + padding * 2;

// //   return (
// //     <div style={{ width, height, position: 'relative' }}>
// //       <svg 
// //         width={width} 
// //         height={height}
// //         viewBox={`0 0 ${width} ${height}`}
// //         style={{ background: 'white' }}
// //       >
// //         {/* Simple white background */}
// //         <rect 
// //           x="0" 
// //           y="0" 
// //           width={width} 
// //           height={height} 
// //           fill="white" 
// //         />

// //         {/* Code lines */}
// //         {lines.map((line, index) => (
// //           <text
// //             key={index}
// //             x={padding}
// //             y={padding + index * lineHeight}
// //             fill="#2F2F2F"
// //             fontSize="16"
// //             fontFamily="monospace"
// //             style={{ whiteSpace: 'pre' }}
// //           >
// //             {line}
// //           </text>
// //         ))}
// //       </svg>
// //     </div>
// //   );
// // }


// 'use client';

// import React from 'react';

// export default function CodeIllustration({ 
//   code,
//   title,
//   explanation,
//   bgColor = '#e6e6e6'  // Default background color
// }) {
//   if (!code) return null;
  
//   const lines = code.split('\n');
//   const lineHeight = 28;
//   const padding = 40;
//   const width = 500;
  
//   // Calculate additional height for title and explanation
//   const titleHeight = title ? 40 : 0;
//   const explanationHeight = explanation ? 40 : 0;
//   const height = lines.length * lineHeight + padding * 2 + titleHeight + explanationHeight;

//   return (
//     <div style={{ width, height, position: 'relative' }}>
//       <svg 
//         width={width} 
//         height={height}
//         viewBox={`0 0 ${width} ${height}`}
//         style={{ background: bgColor }}
//       >
//         {/* Background */}
//         <rect 
//           x="0" 
//           y="0" 
//           width={width} 
//           height={height} 
//           fill={bgColor} 
//         />

//         {/* Title if provided */}
//         {title && (
//           <text
//             x={padding}
//             y={padding}
//             fill="#1a1a1a"
//             fontSize="20"
//             fontWeight="bold"
//             fontFamily="system-ui"
//           >
//             {title}
//           </text>
//         )}

//         {/* Code lines */}
//         {lines.map((line, index) => (
//           <text
//             key={index}
//             x={padding}
//             y={padding + titleHeight + index * lineHeight}
//             fill="#2F2F2F"
//             fontSize="16"
//             fontFamily="monospace"
//             style={{ whiteSpace: 'pre' }}
//           >
//             {line}
//           </text>
//         ))}

//         {/* Explanation if provided */}
//         {explanation && (
//           <text
//             x={padding}
//             y={height - padding}
//             fill="#404040"
//             fontSize="14"
//             fontFamily="system-ui"
//           >
//             {explanation}
//           </text>
//         )}
//       </svg>
//     </div>
//   );
// }

'use client';

import React from 'react';

export default function CodeIllustration({ 
  code,
  title,
  explanation,
  bgColor = '#e6e6e6',            // Default main background
  headerBgColor = '#2C3E50',      // Default header background (dark blue)
  explanationBgColor = '#f5f5f5'  // Default explanation background (lighter than main)
}) {
  if (!code) return null;
  
  const lines = code.split('\n');
  const lineHeight = 28;
  const padding = 40;
  const width = '100%';
  
  const titleHeight = title ? 50 : 0;
  const explanationHeight = explanation ? 100 : 0;
  const codeHeight = lines.length * lineHeight + padding * 2;
  const height = codeHeight + titleHeight + explanationHeight;

  return (
    <div style={{ width, height, position: 'relative' }}>
      <svg 
        width={width} 
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Header section if title provided */}
        {title && (
          <rect 
            x="0" 
            y="0" 
            width={width} 
            height={titleHeight} 
            fill={headerBgColor} 
          />
        )}

        {/* Main code section background */}
        <rect 
          x="0" 
          y={titleHeight} 
          width={width} 
          height={codeHeight} 
          fill={bgColor} 
        />

        {/* Explanation section if provided */}
        {explanation && (
          <rect 
            x="0" 
            y={titleHeight + codeHeight} 
            width={width} 
            height={explanationHeight} 
            fill={explanationBgColor} 
          />
        )}

        {/* Title text if provided */}
        {title && (
          <text
            x={padding}
            y={titleHeight/2}
            fill="white"
            fontSize="18"
            fontWeight="bold"
            fontFamily="system-ui"
            dominantBaseline="middle"
          >
            {title}
          </text>
        )}

        {/* Code lines */}
        {lines.map((line, index) => (
          <text
            key={index}
            x={padding}
            y={titleHeight + padding + index * lineHeight}
            fill="#2F2F2F"
            fontSize="16"
            fontFamily="monospace"
            style={{ whiteSpace: 'pre' }}
          >
            {line}
          </text>
        ))}

        {/* Explanation text if provided */}
        {explanation && (
          <text
            x={padding}
            y={titleHeight + codeHeight + explanationHeight/2}
            fill="#404040"
            fontSize="18"
            fontFamily="system-ui"
            dominantBaseline="middle"
          >
            {explanation}
          </text>
        )}
      </svg>
    </div>
  );
}