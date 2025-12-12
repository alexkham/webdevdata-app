
import React from 'react';

const CircularDiagram = ({ data, showCircle = false, radius = 100 }) => {
 const getPosition = (index, total) => {
   const angle = (index * 2 * Math.PI) / total;
   return {
     x: 400 + radius * Math.cos(angle - Math.PI / 2),
     y: 300 + radius * Math.sin(angle - Math.PI / 2),
     angle: angle - Math.PI / 2
   };
 };

 const wrapText = (text, maxWidth) => {
   const words = text.split(' ');
   const lines = [];
   let currentLine = words[0];

   for(let i = 1; i < words.length; i++) {
     const word = words[i];
     if ((currentLine + " " + word).length * 8 < maxWidth) { // Rough estimate of text width
       currentLine += " " + word;
     } else {
       lines.push(currentLine);
       currentLine = word;
     }
   }
   lines.push(currentLine);
   return lines;
 };

 const TextBox = ({ x, y, angle, textBox, nodeSize }) => {
   if (!textBox) return null;

   const boxDistance = radius * 0.7;
   const { text, width = 120, height = 35 } = textBox;
   
   const boxX = x + Math.cos(angle) * boxDistance;
   const boxY = y + Math.sin(angle) * boxDistance;
   
   const lineStartX = x + Math.cos(angle) * nodeSize;
   const lineStartY = y + Math.sin(angle) * nodeSize;
   const lineEndX = x + Math.cos(angle) * (boxDistance - width/2);
   const lineEndY = y + Math.sin(angle) * (boxDistance - height/2);

   const lines = wrapText(text, width - 20); // Account for padding
   const lineHeight = height / (lines.length + 1);

   return (
     <g>
       <line
         x1={lineStartX}
         y1={lineStartY}
         x2={lineEndX}
         y2={lineEndY}
         stroke="#ccc"
         strokeWidth="1"
       />
       <rect
         x={boxX - width/2}
         y={boxY - height/2}
         width={width}
         height={height}
         fill="#fff"
         stroke="#ccc"
         strokeWidth="1"
         rx="4"
       />
       {lines.map((line, i) => (
         <text
           key={i}
           x={boxX}
           y={boxY - (lines.length - 1) * lineHeight / 2 + i * lineHeight}
           textAnchor="middle"
           dominantBaseline="middle"
           style={{ fontSize: '14px', fill: '#666' }}
         >
           {line}
         </text>
       ))}
     </g>
   );
 };

 const NodeContent = ({ x, y, size, color, title, textBox, angle }) => (
   <>
     <circle 
       cx={x} 
       cy={y} 
       r={size} 
       fill={color || '#000000'}
     />
     <text 
       x={x} 
       y={y} 
       textAnchor="middle"
       dominantBaseline="middle"
       style={{ fill: '#fff', fontSize: '12px', pointerEvents: 'none' }}
     >
       {title}
     </text>
     <TextBox x={x} y={y} angle={angle} textBox={textBox} nodeSize={size} />
   </>
 );

 const ClickableNode = ({ x, y, size, color, title, link, textBox, angle }) => {
   const handleClick = () => {
     if (link) window.open(link, '_blank');
   };

   return (
     <g 
       onClick={handleClick} 
       style={{ cursor: 'pointer' }}
     >
       <NodeContent 
         x={x} 
         y={y} 
         size={size} 
         color={color} 
         title={title} 
         textBox={textBox}
         angle={angle}
       />
     </g>
   );
 };

 return (
   <div style={{ width: '100%', height: '600px', backgroundColor: '#fff' }}>
     <svg viewBox="0 0 800 600" style={{ width: '100%', height: '100%' }}>
       {showCircle && (
         <circle
           cx={400}
           cy={300}
           r={radius}
           stroke="lightgray"
           fill="none"
           strokeWidth="6"
         />
       )}

       {data.link ? (
         <ClickableNode 
           x={400}
           y={300}
           size={data.size || 40}
           color={data.color}
           title={data.title}
           link={data.link}
           textBox={data.textBox}
           angle={0}
         />
       ) : (
         <NodeContent 
           x={400}
           y={300}
           size={data.size || 40}
           color={data.color}
           title={data.title}
           textBox={data.textBox}
           angle={0}
         />
       )}

       {data.nested.map((item, index) => {
         const pos = getPosition(index, data.nested.length);
         
         return item.link ? (
           <ClickableNode 
             key={item.title}
             x={pos.x}
             y={pos.y}
             size={item.size || 30}
             color={item.color}
             title={item.title}
             link={item.link}
             textBox={item.textBox}
             angle={pos.angle}
           />
         ) : (
           <g key={item.title}>
             <NodeContent 
               x={pos.x}
               y={pos.y}
               size={item.size || 30}
               color={item.color}
               title={item.title}
               textBox={item.textBox}
               angle={pos.angle}
             />
           </g>
         );
       })}
     </svg>
   </div>
 );
};

export default CircularDiagram;