// 'use client'
// import React, { useEffect, useRef } from 'react';
// import mermaid from 'mermaid';
// import './MermaidDiagram.css'

// const MermaidDiagram = ({ chartDefinition }) => {
//   const mermaidRef = useRef(null);

//   useEffect(() => {
//     // Ensure this runs only client-side
//     if (typeof window !== "undefined") {
//       mermaid.initialize({
//         startOnLoad: false,
//         theme: 'neutral', // or 'base', 'forest', etc., depending on your preference
//         themeVariables: {
//           // Custom color configurations
//           primaryColor: 'red', // Example: Tomato for primary elements
//           primaryBorderColor: 'gray', // Border color for primary elements
//           lineColor: '#7155cc', // Color for lines (including arrow lines)
//           textColor: 'blue', // Text color
//           nodeBackgroundColor: '#5224bf', // Light yellow background for nodes
//           clusterBkg: '#f0e68c', // Light khaki background for clusters
//           // You might need to adjust secondaryColor or tertiaryColor depending on your diagram
//         },
//       });
//       setTimeout(() => {
//         mermaid.init(undefined, mermaidRef.current);
//       }, 0);
//     }
//   }, [chartDefinition]);

//   return <div className="mermaidDiagramContainer" ref={mermaidRef}>{chartDefinition}</div>;
// };

// export default MermaidDiagram;
'use client'
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './MermaidDiagram.css'

const MermaidDiagram = ({ chartDefinition }) => {
    const mermaidRef = useRef(null);
  
    // useEffect(() => {
    //   if (typeof window !== "undefined") {
    //     mermaid.initialize({
    //       startOnLoad: false,
    //       theme: 'default',
    //       themeVariables:{
    //         textColor:'blue',
    //         fontSize:'50px',
    //         lineColor: '#7155cc',

    //       }
    //     });
    //     setTimeout(() => {
    //       mermaid.init(undefined, mermaidRef.current);
    //     }, 0);
    //   }
    // }, [chartDefinition]);


    // useEffect(() => {
    //     if (typeof window !== "undefined") {
    //       mermaid.initialize({
    //         startOnLoad: false,
    //         theme: 'neutral',
    //       });
    //       setTimeout(() => {
    //         mermaid.init(undefined, mermaidRef.current);
      
    //         // Adjust SVG size after Mermaid initialization
    //         const svgElement = mermaidRef.current.querySelector('svg');
    //         if (svgElement) {
    //           svgElement.style.width = '100%';
    //           svgElement.style.height = 'auto';
    //         }
    //       }, 0);
    //     }
    //   }, [chartDefinition]);
      

    // useEffect(() => {
    //     if (typeof window !== "undefined") {
    //       mermaid.initialize({
    //         startOnLoad: false,
    //         theme: 'base',
    //         themeVariables: {
             
    //           textColor:'blue',
    //           fontSize:"100px",

    //         },
    //       });
    //       setTimeout(() => {
    //         mermaid.init(undefined, mermaidRef.current);
    //       }, 0);
    //     }
    //   }, [chartDefinition]);
      
// useEffect(() => {
//         if (typeof window !== "undefined") {
//           mermaid.initialize({
//             startOnLoad: false,
//             theme: 'neutral',
//             themeVariables:{
//                 textColor:'blue',
//                 fontSize:'100px'
//             }
//           });
//           setTimeout(() => {
//             mermaid.init(undefined, mermaidRef.current);
      
//             // Example of directly manipulating the SVG to adjust node sizes
//             const svgElement = mermaidRef.current.querySelector('svg');
//             if (svgElement) {
//               const nodes = svgElement.querySelectorAll('.node');
//               nodes.forEach(node => {
//                 // Directly manipulate node attributes or styles here
//                 // For example, adjusting the font size or padding around text
//                 const textElements = node.querySelectorAll('text');
//                 textElements.forEach(text => {
//                   text.style.fontSize = '50px'; // Increase text size
//                 });
//                 // This is just an illustrative example; specific attributes will vary
//               });
//             }
//           }, 0);
//         }
//       }, [chartDefinition]);
          
useEffect(() => {
    if (typeof window !== "undefined") {
      mermaid.initialize({ 
        startOnLoad: false,
        theme:'default',
        themeVariables:{
            textColor:'blue',
            fontSize:'36px',
            lineColor: '#7155cc',

        }
     });
      setTimeout(() => {
        mermaid.init(undefined, mermaidRef.current);
  
        // Adjust font size for all text elements in the SVG
        const textElements = mermaidRef.current.querySelectorAll('svg text');
        textElements.forEach(text => {
          text.style.fontSize = '36px'; // Or any other font size
        });
      }, 0);
    }
  }, []);
  
    return (
      <div className="mermaidDiagramContainer" ref={mermaidRef}>
        {chartDefinition}
      </div>
    );
  };
  export default MermaidDiagram;
