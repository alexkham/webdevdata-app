// 'use client'
// import React, { useEffect, useRef } from 'react';
// import mermaid from 'mermaid';
// import './MermaidDiagram.css'

// const MermaidDiagram = ({ chartDefinition }) => {
//     const mermaidRef = useRef(null);
    
    
// useEffect(() => {
//     if (typeof window !== "undefined") {
//       mermaid.initialize({ 
//         startOnLoad: false,
//         theme:'default',
//         themeVariables:{
//             textColor:'blue',
//             fontSize:'18px',
//             lineColor: '#7155cc',

//         }
//      });
//       setTimeout(() => {
//         mermaid.init(undefined, mermaidRef.current);
  
//         // Adjust font size for all text elements in the SVG
//         const textElements = mermaidRef.current.querySelectorAll('svg text');
//         textElements.forEach(text => {
//           text.style.fontSize = '36px'; // Or any other font size
//         });
//       }, 0);
//     }
//   }, []);
  
//     return (
//       <div className="mermaidDiagramContainer" ref={mermaidRef}>
//         {chartDefinition}
//       </div>
//     );
//   };
//   export default MermaidDiagram;
'use client'
import React, { useEffect, useRef } from 'react';
import './MermaidDiagram.css'

const MermaidDiagram = ({ chartDefinition }) => {
    const mermaidRef = useRef(null);

    useEffect(() => {
        let isMounted = true; // Guard to ensure component is mounted during async operations

        const loadMermaidAndRenderChart = async () => {
            if (typeof window === "undefined") return;

            const mermaid = (await import('mermaid')).default; // Adjust the import to access the default export
            mermaid.initialize({
                startOnLoad: false,
                theme: 'default',
                themeVariables: {
                    textColor: 'blue',
                    fontSize: '18px',
                    lineColor: '#7155cc',
                }
            });

            // Use requestAnimationFrame to ensure DOM is ready
            window.requestAnimationFrame(() => {
                if (isMounted && mermaidRef.current) {
                    mermaid.init(undefined, mermaidRef.current);
                    const textElements = mermaidRef.current.querySelectorAll('svg text');
                    textElements.forEach(text => {
                        text.style.fontSize = '36px'; // Adjust the font size
                    });
                }
            });
        };

        loadMermaidAndRenderChart();

        return () => {
            isMounted = false; // Set isMounted to false when the component unmounts
        };
    }, []);

    return (
        <div className="mermaidDiagramContainer" ref={mermaidRef}>
            {chartDefinition}
        </div>
    );
};

export default MermaidDiagram;