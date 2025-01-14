// // // // import React from 'react';

// // // // const ModifierWithTooltip = ({text, tooltip}) => (
// // // //   <div style={{ position: 'relative', display: 'inline-block', margin: '4px ' }}>
// // // //     <span className="mod">{text}</span>
// // // //     <div className="tooltip">{tooltip}</div>
// // // //   </div>
// // // // );

// // // // const VarTable = () => (
// // // //   <div>
// // // //     <style>{`
// // // //       table { width: 80%; border-collapse: collapse; }
// // // //       th, td { border: 1px solid #ddd; padding: 12px; }
// // // //       th, .scope-col { background: #f5f5f5; }
// // // //       .small { font-size: 14px; color: #666; }
// // // //       .mod { background: #eef; padding: 2px 6px; border-radius: 2px; cursor: help; display: block;}
// // // //       .na { color: #999; }
// // // //       .tooltip {
// // // //         display: none;
// // // //         position: absolute;
// // // //         background: #000;
// // // //         color: #fff;
// // // //         padding: 8px;
// // // //         border-radius: 4px;
// // // //         width: 160px;
// // // //         bottom: 100%;
// // // //         left: 50%;
// // // //         transform: translateX(-50%);
// // // //         margin-bottom: 5px;
// // // //         text-align: center;
// // // //         z-index: 1000;
// // // //       }
// // // //       .tooltip::after {
// // // //         content: '';
// // // //         position: absolute;
// // // //         top: 100%;
// // // //         left: 50%;
// // // //         margin-left: -5px;
// // // //         border-width: 5px;
// // // //         border-style: solid;
// // // //         border-color: black transparent transparent transparent;
// // // //       }
// // // //       div:hover .tooltip {
// // // //         display: block;
// // // //       }
// // // //     `}</style>
// // // //     {/* Rest of the table component stays exactly the same */}
// // // //     <table>
// // // //       <tr>
// // // //         <th style={{width: 180}}>
// // // //           <svg width={180} height={80}>
// // // //             <line x1={0} y1={0} x2={180} y2={80} stroke="#ccc"/>
// // // //             <text x={20} y={60}>Scope</text>
// // // //             <text x={20} y={72} fontSize={11}>(visibility)</text>
// // // //             <text x={110} y={25}>Lifetime</text>
// // // //             <text x={110} y={37} fontSize={11}>(duration)</text>
// // // //           </svg>
// // // //         </th>
// // // //         <th>Automatic<br/><span className="small">deallocated after block</span></th>
// // // //         <th>Register<br/><span className="small">stored in CPU register</span></th>
// // // //         <th>Static<br/><span className="small">persists between calls</span></th>
// // // //         <th>Program<br/><span className="small">exists entire runtime</span></th>
// // // //       </tr>
// // // //       <tr>
// // // //         <td className="scope-col">Local<br/><span className="small">function scope</span></td>
// // // //         <td>
// // // //           <ModifierWithTooltip text="no modifier" tooltip="Basic local variable"/>
// // // //           <ModifierWithTooltip text="const" tooltip="Immutable local value"/>
// // // //           <ModifierWithTooltip text="volatile" tooltip="Can change unexpectedly"/>
// // // //           <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // // //         </td>
// // // //         <td>
// // // //           <ModifierWithTooltip text="no modifier" tooltip="Basic register variable"/>
// // // //           <ModifierWithTooltip text="const" tooltip="Read-only register"/>
// // // //           <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // // //         </td>
// // // //         <td>
// // // //           <ModifierWithTooltip text="no modifier" tooltip="Retains value between calls"/>
// // // //           <ModifierWithTooltip text="const" tooltip="Immutable static value"/>
// // // //           <ModifierWithTooltip text="volatile" tooltip="Can change externally"/>
// // // //           <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // // //         </td>
// // // //         <td className="na">N/A</td>
// // // //       </tr>
// // // //       <tr>
// // // //         <td className="scope-col">Global<br/><span className="small">entire program</span></td>
// // // //         <td className="na">N/A</td>
// // // //         <td className="na">N/A</td>
// // // //         <td>
// // // //           <ModifierWithTooltip text="no modifier" tooltip="Basic global static"/>
// // // //           <ModifierWithTooltip text="const" tooltip="Global constant"/>
// // // //           <ModifierWithTooltip text="volatile" tooltip="Can change externally"/>
// // // //           <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // // //         </td>
// // // //         <td>
// // // //           <ModifierWithTooltip text="no modifier" tooltip="Program-wide access"/>
// // // //           <ModifierWithTooltip text="const" tooltip="Program constant"/>
// // // //           <ModifierWithTooltip text="volatile" tooltip="External changes"/>
// // // //           <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // // //         </td>
// // // //       </tr>
// // // //       <tr>
// // // //         <td className="scope-col">Extern<br/><span className="small">other files</span></td>
// // // //         <td className="na">N/A</td>
// // // //         <td className="na">N/A</td>
// // // //         <td className="na">N/A</td>
// // // //         <td>
// // // //           <ModifierWithTooltip text="no modifier" tooltip="External linkage"/>
// // // //           <ModifierWithTooltip text="const" tooltip="External constant"/>
// // // //           <ModifierWithTooltip text="volatile" tooltip="External changes"/>
// // // //           <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // // //         </td>
// // // //       </tr>
// // // //       <tr>
// // // //         <td className="scope-col">Block<br/><span className="small">within {} only</span></td>
// // // //         <td>
// // // //           <ModifierWithTooltip text="no modifier" tooltip="Block-local variable"/>
// // // //           <ModifierWithTooltip text="const" tooltip="Block-local constant"/>
// // // //           <ModifierWithTooltip text="volatile" tooltip="Can change externally"/>
// // // //           <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // // //         </td>
// // // //         <td>
// // // //           <ModifierWithTooltip text="no modifier" tooltip="Block register"/>
// // // //           <ModifierWithTooltip text="const" tooltip="Constant register"/>
// // // //           <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // // //         </td>
// // // //         <td className="na">N/A</td>
// // // //         <td className="na">N/A</td>
// // // //       </tr>
// // // //       <tr>
// // // //         <td className="scope-col">File-scope<br/><span className="small">current file only</span></td>
// // // //         <td className="na">N/A</td>
// // // //         <td className="na">N/A</td>
// // // //         <td>
// // // //           <ModifierWithTooltip text="no modifier" tooltip="File-wide access"/>
// // // //           <ModifierWithTooltip text="const" tooltip="File constant"/>
// // // //           <ModifierWithTooltip text="volatile" tooltip="Can change externally"/>
// // // //           <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // // //         </td>
// // // //         <td className="na">N/A</td>
// // // //       </tr>
// // // //     </table>
// // // //   </div>
// // // // );

// // // // export default VarTable;


// // // import React from 'react';

// // // const ModifierWithTooltip = ({text, tooltip}) => (
// // //   <div className="tooltip-container">
// // //     <span className="mod">{text}</span>
// // //     <span className="tooltip">{tooltip}</span>
// // //   </div>
// // // );

// // // const VarTable = () => (
// // //   <div>
// // //     <style>{`
// // //       table { 
// // //         width: 80%; 
// // //         border-collapse: collapse; 
// // //       }
// // //       th, td { 
// // //         border: 1px solid #ddd; 
// // //         padding: 12px; 
// // //       }
// // //       th, .scope-col { 
// // //         background: #f5f5f5; 
// // //       }
// // //       .small { 
// // //         font-size: 14px; 
// // //         color: #666; 
// // //       }
// // //       .tooltip-container {
// // //         position: relative;
// // //         display: inline-block;
// // //         margin: 4px;
// // //       }
// // //       .mod { 
// // //         background: #eef;
// // //         padding: 2px 6px;
// // //         border-radius: 2px;
// // //         cursor: help;
// // //       }
// // //       .na { 
// // //         color: #999; 
// // //       }
// // //       .tooltip {
// // //         opacity: 0;
// // //         position: absolute;
// // //         background: #333;
// // //         color: white;
// // //         padding: 8px;
// // //         border-radius: 4px;
// // //         width: 160px;
// // //         bottom: 120%;
// // //         left: 50%;
// // //         transform: translateX(-50%);
// // //         pointer-events: none;
// // //         transition: opacity 0.3s;
// // //       }
// // //       .tooltip:after {
// // //         content: "";
// // //         position: absolute;
// // //         top: 100%;
// // //         left: 50%;
// // //         margin-left: -5px;
// // //         border-width: 5px;
// // //         border-style: solid;
// // //         border-color: #333 transparent transparent transparent;
// // //       }
// // //       .tooltip-container:hover .tooltip {
// // //         opacity: 1;
// // //       }
// // //     `}</style>
// // //     <table>
// // //       <thead>
// // //         <tr>
// // //           <th style={{width: 180}}>
// // //             <svg width={180} height={80}>
// // //               <line x1={0} y1={0} x2={180} y2={80} stroke="#ccc"/>
// // //               <text x={20} y={60}>Scope</text>
// // //               <text x={20} y={72} fontSize={11}>(visibility)</text>
// // //               <text x={110} y={25}>Lifetime</text>
// // //               <text x={110} y={37} fontSize={11}>(duration)</text>
// // //             </svg>
// // //           </th>
// // //           <th>Automatic<br/><span className="small">deallocated after block</span></th>
// // //           <th>Register<br/><span className="small">stored in CPU register</span></th>
// // //           <th>Static<br/><span className="small">persists between calls</span></th>
// // //           <th>Program<br/><span className="small">exists entire runtime</span></th>
// // //         </tr>
// // //       </thead>
// // //       <tbody>
// // //         <tr>
// // //           <td className="scope-col">Local<br/><span className="small">function scope</span></td>
// // //           <td>
// // //             <ModifierWithTooltip text="no modifier" tooltip="Basic local variable"/>
// // //             <ModifierWithTooltip text="const" tooltip="Immutable local value"/>
// // //             <ModifierWithTooltip text="volatile" tooltip="Can change unexpectedly"/>
// // //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // //           </td>
// // //           <td>
// // //             <ModifierWithTooltip text="no modifier" tooltip="Basic register variable"/>
// // //             <ModifierWithTooltip text="const" tooltip="Read-only register"/>
// // //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // //           </td>
// // //           <td>
// // //             <ModifierWithTooltip text="no modifier" tooltip="Retains value between calls"/>
// // //             <ModifierWithTooltip text="const" tooltip="Immutable static value"/>
// // //             <ModifierWithTooltip text="volatile" tooltip="Can change externally"/>
// // //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // //           </td>
// // //           <td className="na">N/A</td>
// // //         </tr>
// // //         <tr>
// // //           <td className="scope-col">Global<br/><span className="small">entire program</span></td>
// // //           <td className="na">N/A</td>
// // //           <td className="na">N/A</td>
// // //           <td>
// // //             <ModifierWithTooltip text="no modifier" tooltip="Basic global static"/>
// // //             <ModifierWithTooltip text="const" tooltip="Global constant"/>
// // //             <ModifierWithTooltip text="volatile" tooltip="Can change externally"/>
// // //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // //           </td>
// // //           <td>
// // //             <ModifierWithTooltip text="no modifier" tooltip="Program-wide access"/>
// // //             <ModifierWithTooltip text="const" tooltip="Program constant"/>
// // //             <ModifierWithTooltip text="volatile" tooltip="External changes"/>
// // //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // //           </td>
// // //         </tr>
// // //         <tr>
// // //           <td className="scope-col">Extern<br/><span className="small">other files</span></td>
// // //           <td className="na">N/A</td>
// // //           <td className="na">N/A</td>
// // //           <td className="na">N/A</td>
// // //           <td>
// // //             <ModifierWithTooltip text="no modifier" tooltip="External linkage"/>
// // //             <ModifierWithTooltip text="const" tooltip="External constant"/>
// // //             <ModifierWithTooltip text="volatile" tooltip="External changes"/>
// // //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // //           </td>
// // //         </tr>
// // //         <tr>
// // //           <td className="scope-col">Block<br/><span className="small">within {} only</span></td>
// // //           <td>
// // //             <ModifierWithTooltip text="no modifier" tooltip="Block-local variable"/>
// // //             <ModifierWithTooltip text="const" tooltip="Block-local constant"/>
// // //             <ModifierWithTooltip text="volatile" tooltip="Can change externally"/>
// // //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // //           </td>
// // //           <td>
// // //             <ModifierWithTooltip text="no modifier" tooltip="Block register"/>
// // //             <ModifierWithTooltip text="const" tooltip="Constant register"/>
// // //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // //           </td>
// // //           <td className="na">N/A</td>
// // //           <td className="na">N/A</td>
// // //         </tr>
// // //         <tr>
// // //           <td className="scope-col">File-scope<br/><span className="small">current file only</span></td>
// // //           <td className="na">N/A</td>
// // //           <td className="na">N/A</td>
// // //           <td>
// // //             <ModifierWithTooltip text="no modifier" tooltip="File-wide access"/>
// // //             <ModifierWithTooltip text="const" tooltip="File constant"/>
// // //             <ModifierWithTooltip text="volatile" tooltip="Can change externally"/>
// // //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// // //           </td>
// // //           <td className="na">N/A</td>
// // //         </tr>
// // //       </tbody>
// // //     </table>
// // //   </div>
// // // );

// // // export default VarTable;


// // import React from 'react';

// // const ModifierWithTooltip = ({text, tooltip}) => (
// //   <div className="modifier">
// //     <span className="text">{text}</span>
// //     <span className="tooltip">{tooltip}</span>
// //   </div>
// // );

// // const VarTable = () => (
// //   <div className="variable-table">
// //     <style dangerouslySetInnerHTML={{__html: `
// //       .modifier {
// //         position: relative;
// //         display: inline-block;
// //         margin: 4px;
// //       }
// //       .modifier .text {
// //         display: block;
// //         background: #eef;
// //         padding: 2px 6px;
// //         border-radius: 2px;
// //         cursor: help;
// //       }
// //       .modifier .tooltip {
// //         visibility: hidden;
// //         position: absolute;
// //         z-index: 100;
// //         background-color: #333;
// //         color: white;
// //         padding: 8px;
// //         border-radius: 4px;
// //         width: 160px;
// //         left: 50%;
// //         transform: translateX(-50%);
// //         bottom: 100%;
// //         margin-bottom: 10px;
// //         text-align: center;
// //       }
// //       .modifier:hover .tooltip {
// //         visibility: visible;
// //          background-color: #333;
// //         color: white;
        
// //       }
// //       .modifier .tooltip:before {
// //         content: "";
// //         position: absolute;
// //         top: 100%;
// //         left: 50%;
// //         margin-left: -5px;
// //         border: 5px solid transparent;
// //         border-top-color: #333;
// //       }
// //       table { width: 80%; border-collapse: collapse; }
// //       th, td { border: 1px solid #ddd; padding: 12px; }
// //       th, .scope-col { background: #f5f5f5; }
// //       .small { font-size: 14px; color: #666; }
// //       .na { color: #999; }
// //     `}} />
// //     <table>
// //       <thead>
// //         <tr>
// //           <th style={{width: 180}}>
// //             <svg width={180} height={80}>
// //               <line x1={0} y1={0} x2={180} y2={80} stroke="#ccc"/>
// //               <text x={20} y={60}>Scope</text>
// //               <text x={20} y={72} fontSize={11}>(visibility)</text>
// //               <text x={110} y={25}>Lifetime</text>
// //               <text x={110} y={37} fontSize={11}>(duration)</text>
// //             </svg>
// //           </th>
// //           <th>Automatic<br/><span className="small">deallocated after block</span></th>
// //           <th>Register<br/><span className="small">stored in CPU register</span></th>
// //           <th>Static<br/><span className="small">persists between calls</span></th>
// //           <th>Program<br/><span className="small">exists entire runtime</span></th>
// //         </tr>
// //       </thead>
// //       <tbody>
// //         <tr>
// //           <td className="scope-col">Local<br/><span className="small">function scope</span></td>
// //           <td>
// //             <ModifierWithTooltip text="no modifier" tooltip="Basic local variable"/>
// //             <ModifierWithTooltip text="const" tooltip="Immutable local value"/>
// //             <ModifierWithTooltip text="volatile" tooltip="Can change unexpectedly"/>
// //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// //           </td>
// //           <td>
// //             <ModifierWithTooltip text="no modifier" tooltip="Basic register variable"/>
// //             <ModifierWithTooltip text="const" tooltip="Read-only register"/>
// //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// //           </td>
// //           <td>
// //             <ModifierWithTooltip text="no modifier" tooltip="Retains value between calls"/>
// //             <ModifierWithTooltip text="const" tooltip="Immutable static value"/>
// //             <ModifierWithTooltip text="volatile" tooltip="Can change externally"/>
// //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// //           </td>
// //           <td className="na">N/A</td>
// //         </tr>
// //         <tr>
// //           <td className="scope-col">Global<br/><span className="small">entire program</span></td>
// //           <td className="na">N/A</td>
// //           <td className="na">N/A</td>
// //           <td>
// //             <ModifierWithTooltip text="no modifier" tooltip="Basic global static"/>
// //             <ModifierWithTooltip text="const" tooltip="Global constant"/>
// //             <ModifierWithTooltip text="volatile" tooltip="Can change externally"/>
// //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// //           </td>
// //           <td>
// //             <ModifierWithTooltip text="no modifier" tooltip="Program-wide access"/>
// //             <ModifierWithTooltip text="const" tooltip="Program constant"/>
// //             <ModifierWithTooltip text="volatile" tooltip="External changes"/>
// //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// //           </td>
// //         </tr>
// //         <tr>
// //           <td className="scope-col">Extern<br/><span className="small">other files</span></td>
// //           <td className="na">N/A</td>
// //           <td className="na">N/A</td>
// //           <td className="na">N/A</td>
// //           <td>
// //             <ModifierWithTooltip text="no modifier" tooltip="External linkage"/>
// //             <ModifierWithTooltip text="const" tooltip="External constant"/>
// //             <ModifierWithTooltip text="volatile" tooltip="External changes"/>
// //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// //           </td>
// //         </tr>
// //         <tr>
// //           <td className="scope-col">Block<br/><span className="small">within {} only</span></td>
// //           <td>
// //             <ModifierWithTooltip text="no modifier" tooltip="Block-local variable"/>
// //             <ModifierWithTooltip text="const" tooltip="Block-local constant"/>
// //             <ModifierWithTooltip text="volatile" tooltip="Can change externally"/>
// //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// //           </td>
// //           <td>
// //             <ModifierWithTooltip text="no modifier" tooltip="Block register"/>
// //             <ModifierWithTooltip text="const" tooltip="Constant register"/>
// //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// //           </td>
// //           <td className="na">N/A</td>
// //           <td className="na">N/A</td>
// //         </tr>
// //         <tr>
// //           <td className="scope-col">File-scope<br/><span className="small">current file only</span></td>
// //           <td className="na">N/A</td>
// //           <td className="na">N/A</td>
// //           <td>
// //             <ModifierWithTooltip text="no modifier" tooltip="File-wide access"/>
// //             <ModifierWithTooltip text="const" tooltip="File constant"/>
// //             <ModifierWithTooltip text="volatile" tooltip="Can change externally"/>
// //             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing"/>
// //           </td>
// //           <td className="na">N/A</td>
// //         </tr>
// //       </tbody>
// //     </table>
// //   </div>
// // );

// // export default VarTable;

// import React from "react";
// import './VarTable.css'

// const ModifierWithTooltip = ({ text, tooltip }) => (
//   <div className="modifier">
//     <span className="text">{text}</span>
//     <div className="tooltip">{tooltip}</div>
//   </div>
// );

// const VarTable = () => (
//   <div className="variable-table">
//     <table>
//       <thead>
//         <tr>
//           <th style={{ width: 180 }}>
//             <svg width={180} height={80}>
//               <line x1={0} y1={0} x2={180} y2={80} stroke="#ccc" />
//               <text x={20} y={60}>Scope</text>
//               <text x={20} y={72} fontSize={11}>(visibility)</text>
//               <text x={110} y={25}>Lifetime</text>
//               <text x={110} y={37} fontSize={11}>(duration)</text>
//             </svg>
//           </th>
//           <th>Automatic<br /><span className="small">deallocated after block</span></th>
//           <th>Register<br /><span className="small">stored in CPU register</span></th>
//           <th>Static<br /><span className="small">persists between calls</span></th>
//           <th>Program<br /><span className="small">exists entire runtime</span></th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td className="scope-col">Local<br /><span className="small">function scope</span></td>
//           <td>
//             <ModifierWithTooltip text="no modifier" tooltip="Basic local variable" />
//             <ModifierWithTooltip text="const" tooltip="Immutable local value" />
//             <ModifierWithTooltip text="volatile" tooltip="Can change unexpectedly" />
//             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing" />
//           </td>
//           <td>
//             <ModifierWithTooltip text="no modifier" tooltip="Basic register variable" />
//             <ModifierWithTooltip text="const" tooltip="Read-only register" />
//             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing" />
//           </td>
//           <td>
//             <ModifierWithTooltip text="no modifier" tooltip="Retains value between calls" />
//             <ModifierWithTooltip text="const" tooltip="Immutable static value" />
//             <ModifierWithTooltip text="volatile" tooltip="Can change externally" />
//             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing" />
//           </td>
//           <td className="na">N/A</td>
//         </tr>
//         <tr>
//           <td className="scope-col">Global<br /><span className="small">entire program</span></td>
//           <td className="na">N/A</td>
//           <td className="na">N/A</td>
//           <td>
//             <ModifierWithTooltip text="no modifier" tooltip="Basic global static" />
//             <ModifierWithTooltip text="const" tooltip="Global constant" />
//             <ModifierWithTooltip text="volatile" tooltip="Can change externally" />
//             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing" />
//           </td>
//           <td>
//             <ModifierWithTooltip text="no modifier" tooltip="Program-wide access" />
//             <ModifierWithTooltip text="const" tooltip="Program constant" />
//             <ModifierWithTooltip text="volatile" tooltip="External changes" />
//             <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing" />
//           </td>
//         </tr>
        
//       </tbody>
//     </table>
//   </div>
// );

// export default VarTable;


import React from "react";
import './VarTable.css';

const ModifierWithTooltip = ({ text, tooltip }) => (
  <div className="modifier">
    <span className="text">{text}</span>
    <div className="tooltip">{tooltip}</div>
  </div>
);

const VarTable = () => (
  <div className="variable-table">
    <table>
      <thead>
        <tr>
          <th style={{ width: 180 }}>
            <svg width={180} height={80}>
              <line x1={0} y1={0} x2={180} y2={80} stroke="#ccc" />
              <text x={20} y={60}>Scope</text>
              <text x={20} y={72} fontSize={11}>(visibility)</text>
              <text x={110} y={25}>Lifetime</text>
              <text x={110} y={37} fontSize={11}>(duration)</text>
            </svg>
          </th>
          <th>Automatic<br /><span className="small">deallocated after block</span></th>
          <th>Register<br /><span className="small">stored in CPU register</span></th>
          <th>Static<br /><span className="small">persists between calls</span></th>
          <th>Program<br /><span className="small">exists entire runtime</span></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="scope-col">Local<br /><span className="small">function scope</span></td>
          <td>
            <ModifierWithTooltip text="no modifier" tooltip="Basic local variable" />
            <ModifierWithTooltip text="const" tooltip="Immutable local value" />
            <ModifierWithTooltip text="volatile" tooltip="Can change unexpectedly" />
            <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing" />
          </td>
          <td>
            <ModifierWithTooltip text="no modifier" tooltip="Basic register variable" />
            <ModifierWithTooltip text="const" tooltip="Read-only register" />
            <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing" />
          </td>
          <td>
            <ModifierWithTooltip text="no modifier" tooltip="Retains value between calls" />
            <ModifierWithTooltip text="const" tooltip="Immutable static value" />
            <ModifierWithTooltip text="volatile" tooltip="Can change externally" />
            <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing" />
          </td>
          <td className="na">N/A</td>
        </tr>
        <tr>
          <td className="scope-col">Global<br /><span className="small">entire program</span></td>
          <td className="na">N/A</td>
          <td className="na">N/A</td>
          <td>
            <ModifierWithTooltip text="no modifier" tooltip="Basic global static" />
            <ModifierWithTooltip text="const" tooltip="Global constant" />
            <ModifierWithTooltip text="volatile" tooltip="Can change externally" />
            <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing" />
          </td>
          <td>
            <ModifierWithTooltip text="no modifier" tooltip="Program-wide access" />
            <ModifierWithTooltip text="const" tooltip="Program constant" />
            <ModifierWithTooltip text="volatile" tooltip="External changes" />
            <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing" />
          </td>
        </tr>
        <tr>
          <td className="scope-col">Extern<br /><span className="small">other files</span></td>
          <td className="na">N/A</td>
          <td className="na">N/A</td>
          <td className="na">N/A</td>
          <td>
            <ModifierWithTooltip text="no modifier" tooltip="External linkage" />
            <ModifierWithTooltip text="const" tooltip="External constant" />
            <ModifierWithTooltip text="volatile" tooltip="External changes" />
            <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing" />
          </td>
        </tr>
        <tr>
          <td className="scope-col">Block<br /><span className="small">within {} only</span></td>
          <td>
            <ModifierWithTooltip text="no modifier" tooltip="Block-local variable" />
            <ModifierWithTooltip text="const" tooltip="Block-local constant" />
            <ModifierWithTooltip text="volatile" tooltip="Can change externally" />
            <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing" />
          </td>
          <td>
            <ModifierWithTooltip text="no modifier" tooltip="Block register" />
            <ModifierWithTooltip text="const" tooltip="Constant register" />
            <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing" />
          </td>
          <td className="na">N/A</td>
          <td className="na">N/A</td>
        </tr>
        <tr>
          <td className="scope-col">File-scope<br /><span className="small">current file only</span></td>
          <td className="na">N/A</td>
          <td className="na">N/A</td>
          <td>
            <ModifierWithTooltip text="no modifier" tooltip="File-wide access" />
            <ModifierWithTooltip text="const" tooltip="File constant" />
            <ModifierWithTooltip text="volatile" tooltip="Can change externally" />
            <ModifierWithTooltip text="restrict" tooltip="No pointer aliasing" />
          </td>
          <td className="na">N/A</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default VarTable;
