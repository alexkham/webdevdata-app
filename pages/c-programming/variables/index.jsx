// import React from 'react'
// import './styles.css'
// import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2';
// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
// import '../../pages.css'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
// import NavigationButtons from '@/app/components/page-components/NavigationButtons';
// import MyList from '@/app/components/page-components/MyList';
// import ContentBlock from '@/app/components/page-components/ContentBlock';

// export default function VariablesPage({ tableData ,scopeList,scopePyramid,lifeSpan ,scopeTarget}) {
//   return (
//     <>
//       
//       <br/>
//       <br/>
//       <br/>
//       <Breadcrumb/>
//       <h1 className='title' style={{marginTop:'-40px', marginBottom:'-30px'}}>Variables in C Language</h1>
     
//       <div className="variable-table">
//         <table>
//           <thead>
//             <tr>
//               <th style={{ width: 180 }}>
//                 <svg width={180} height={80}>
//                   <line x1={0} y1={0} x2={180} y2={80} stroke="#ccc" />
//                   <text x={20} y={60}>Scope</text>
//                   <text x={20} y={72} fontSize={11}>(visibility)</text>
//                   <text x={110} y={25}>Lifetime</text>
//                   <text x={110} y={37} fontSize={11}>(duration)</text>
//                 </svg>
//               </th>
//               {tableData.headers.map((header, index) => (
//                 <th key={index}>
//                   {header.text}<br />
//                   <span className="small">{header.description}</span>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {tableData.rows.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 <td className="scope-col">
//                   <a href="#scope" style={{ textDecoration: 'none', color: 'inherit' }}>
//                     {row.scope}<br />
//                     <span className="small">{row.description}</span>
//                   </a>
//                 </td>
//                 {row.cells.map((cell, cellIndex) => (
//                   <td key={cellIndex}>
//                     {cell === 'N/A' ? (
//                       <span className="na">N/A</span>
//                     ) : (
//                       cell.map((modifier, modIndex) => (
//                         <div key={modIndex} className="modifier">
//                           <span className="text">{modifier.text}</span>
//                           <div className="tooltip">{modifier.tooltip}</div>
//                         </div>
//                       ))
//                     )}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//      <br/>
//      <br/>
//      <br/>

//       <div id="scope" className="variable-section">
//         <br/>
//         <br/>
//         <h2>Variable Scope in C</h2>
//         <p className='section-content'>
//           Variable scope in C determines where in the program a variable can be accessed. C provides several levels of scope:
//           local (function) scope, block scope, file scope, and program scope. Understanding scope is crucial for writing
//           maintainable and bug-free code, as it helps prevent naming conflicts and ensures proper variable lifetime management.
//         </p>
//         <div style={{display:'flex',flexDirection:'row'}}>
//         {/* <div style={{width:'60%',margin:'auto'}}>
//         <MyList
//          data={scopeList}
//          type="number" 
//         color="gray" 
//         boxed={true}/>
//         </div> */}
//         <div style={{width:'60%',margin:'auto'}}>
//   <ContentBlock 
//     content={scopeList[0]}
//     boxed={true}
//     color="gray"
//   />

//   <ContentBlock 
//     content={scopeList[1]}
//     boxed={true}
//     color="gray"
//   />

//   <ContentBlock 
//     content={scopeList[2]}
//     boxed={true}
//     color="gray"
//   />

//   <ContentBlock 
//     content={scopeList[3]}
//     boxed={true}
//     color="gray"
//   />

//   <ContentBlock 
//     content={scopeList[4]}
//     boxed={true}
//     color="gray"
//   />
// </div>
// <div style={{display:'flex',flexDirection:'column'}}>
//         <div 
//   className="scope-pyramid" 
//   style={{ width: '100%', maxWidth: '530px', margin: 'auto',marginTop:'0px' }}
//   dangerouslySetInnerHTML={{ __html: scopePyramid }}
// />
// <br/>
// <div 
//   className="scope-pyramid" 
//   style={{ width: '100%', maxWidth: '530px', margin: 'auto',marginTop:'0px',transform:'scale(0.7)' }}
//   dangerouslySetInnerHTML={{ __html: scopeTarget }}
// />
// </div>

// </div>



//         <NavigationButtons nextLink="#lifetime" />
//       </div>

//       <div 
//   className="scope-pyramid" 
//   style={{ width: '100%', maxWidth: '530px', margin: 'auto',marginTop:'0px',transform:'scale(1.5)' }}
//   dangerouslySetInnerHTML={{ __html: lifeSpan }}
// />
     

//       <br/>
//       <br/>
//       <br/>
//       <ScrollUpButton/>
//     </>
//   )
// }


import React from 'react'
import './styles.css'
import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb';
import '../../pages.css'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton';
import NavigationButtons from '@/app/components/page-components/NavigationButtons';
import MyList from '@/app/components/page-components/lists/MyList';
import ContentBlock from '@/app/components/page-components/ContentBlock';
import CodeIllustration from '@/app/components/code-example/code-illustration/CodeIllustration';

export default function VariablesPage({ tableData, scopeList, scopePyramid, 
  lifeSpan, scopeTarget,blockScopeExample ,lifetimeList}) {
 return (
   <>
     
     <br/>
     <br/>
     <br/>
     <Breadcrumb/>
     <h1 className='title' style={{marginTop:'-40px', marginBottom:'-30px'}}>Variables in C Language</h1>
    
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
             {/* {tableData.headers.map((header, index) => (
               <th key={index}>
                 {header.text}<br />
                 <span className="small">{header.description}</span>
               </th>
             ))} */}

          {tableData.headers.map((header, index) => (
            <th key={index} className="scope-col">
              <a href={header.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                {header.text}<br />
                <span className="small">{header.description}</span>
              </a>
            </th>
          ))}
           </tr>
         </thead>
         <tbody>
           {tableData.rows.map((row, rowIndex) => (
             <tr key={rowIndex}>
               <td className="scope-col">
                 <a href={`#${row.scope.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                   {row.scope}<br />
                   <span className="small">{row.description}</span>
                 </a>
               </td>
               {row.cells.map((cell, cellIndex) => (
                 <td key={cellIndex}>
                   {cell === 'N/A' ? (
                     <span className="na">N/A</span>
                   ) : (
                     cell.map((modifier, modIndex) => (
                       <div key={modIndex} className="modifier">
                         <span className="text">{modifier.text}</span>
                         <div className="tooltip">{modifier.tooltip}</div>
                       </div>
                     ))
                   )}
                 </td>
               ))}
             </tr>
           ))}
         </tbody>
       </table>
     </div>
    <br/>
    <br/>
    <br/>

     <div id="scope" className="variable-section">
       <br/>
       <br/>
       <h2>Variable Scope in C</h2>
       <p className='section-content'>
         Variable scope in C determines where in the program a variable can be accessed. C provides several levels of scope:
         local (function) scope, block scope, file scope, and program scope. Understanding scope is crucial for writing
         maintainable and bug-free code, as it helps prevent naming conflicts and ensures proper variable lifetime management.
       </p>
       <div style={{display:'flex',flexDirection:'row'}}>
       <div style={{width:'60%',margin:'auto'}}>
         <ContentBlock 
           id="block"
           content={scopeList[0]}
           boxed={true}
           color="gray"
         />
         <CodeIllustration
         code={blockScopeExample}
         title="Block-Scope Variables"
          explanation="Block scoped variables exist only within its block and are deallocated after"
          bgColor="#f0f0f0"
          explanationBgColor = '#fdfdea'
         />

         <ContentBlock 
           id="local"
           content={scopeList[1]}
           boxed={true}
           color="gray"
         />

         <ContentBlock 
           id="file-scope"
           content={scopeList[2]}
           boxed={true}
           color="gray"
         />

         <ContentBlock 
           id="extern"
           content={scopeList[3]}
           boxed={true}
           color="gray"
         />

         <ContentBlock 
           id="global"
           content={scopeList[4]}
           boxed={true}
           color="gray"
         />
       </div>
       <div style={{display:'flex',flexDirection:'column'}}>
         <div 
           className="scope-pyramid" 
           style={{ width: '100%', maxWidth: '530px', margin: 'auto',marginTop:'0px' }}
           dangerouslySetInnerHTML={{ __html: scopePyramid }}
         />
         <br/>
         <div 
           className="scope-pyramid" 
           style={{ width: '100%', maxWidth: '530px', margin: 'auto',marginTop:'0px',transform:'scale(0.7)' }}
           dangerouslySetInnerHTML={{ __html: scopeTarget }}
         />
       </div>
     </div>

     <NavigationButtons nextLink="#lifetime" />
   </div>


   <div id="lifetime" className="variable-section">
  <br/>
  <br/>
  <h2>Variable Lifetime in C</h2>
  <p className='section-content'>
    Variable lifetime in C determines how long a variable maintains its value and exists in memory. Different storage classes 
    provide different lifetimes, from short-lived automatic variables to program-wide static storage.
  </p>
  <br/>
  <br/>
  <br/>
  <div 
    className="scope-pyramid" 
    style={{ width: '100%', maxWidth: '530px', margin: 'auto', marginTop:'0px', transform:'scale(1.5)' }}
    dangerouslySetInnerHTML={{ __html: lifeSpan }}
  />
  <br/>
  <ContentBlock 
        id="automatic"
        content={lifetimeList[0]}
        boxed={true}
        color="yellow"
      />
  <br/>
  <ContentBlock 
        id="register"
        content={lifetimeList[1]}
        boxed={true}
        color="yellow"
      />
  <br/>
  <ContentBlock 
        id="static"
        content={lifetimeList[2]}
        boxed={true}
        color="yellow"
      />
  <br/>
  <ContentBlock 
        id="program"
        content={lifetimeList[3]}
        boxed={true}
        color="yellow"
      />
  <br/>
   <NavigationButtons nextLink="#modifiers" />
</div>

   {/* <div 
     className="scope-pyramid" 
     style={{ width: '100%', maxWidth: '530px', margin: 'auto',marginTop:'0px',transform:'scale(1.5)' }}
     dangerouslySetInnerHTML={{ __html: lifeSpan }}
   /> */}
    
   <br/>
   <br/>
   <br/>
   <ScrollUpButton/>
 </>
 )
}


export async function getStaticProps() {

  const lifetimeList = [
    `**Automatic Variables**: A variable with automatic lifetime exists only within its block of declaration and is automatically deallocated when the block execution ends. Each time the block is entered, the variable is recreated, and its value must be reinitialized. It&apos;s the default lifetime for local variables and provides efficient memory management for temporary data.`,
    
    `**Register Variables**: A register variable has automatic lifetime but suggests storage in CPU registers rather than main memory for faster access. Like automatic variables, they exist only during block execution and are deallocated upon exit. However, their physical storage location (whether actually in a register or not) is ultimately determined by the compiler&apos;s optimization decisions.`,
    
    `**Static Variables**: A static variable persists between function calls, maintaining its value throughout program execution once initialized. Unlike automatic variables, it is initialized only once when program execution begins and retains its memory location even when out of scope. This provides a way to maintain state information between function invocations.`,
    
    `**Program Variables**: A program variable exists for the entire runtime of the program, from start to finish. It is allocated when the program begins execution and deallocated only when the program terminates. These variables, typically global or extern, provide program-wide data storage and maintain their values throughout the entire program execution.`
];

  const blockScopeExample = `#include <stdio.h>

void main() {
   // Regular block variable:
   // - Lives only in this block
   // - Can be modified
   // - Stored in memory
   {
       int count = 0;
       count++;        // Can change value
       ... ... ...
   }   // Value lost here
   
   // Constant block variable:
   // - Lives only in this block
   // - Cannot be modified after initialization
   // - Compiler error if try to change
   {
       const int MAX = 100;
       MAX = 200;     // Error! Cannot modify
       ... ... ...
   }   // Value lost here

   // Register block variable:
   // - Lives only in this block
   // - May be stored in CPU register (faster access)
   // - Cannot get its address with &
   {
       register int idx = 0;
       &idx;          // Error! Cannot get address
       ... ... ...
   }   // Value lost here

   // Volatile block variable:
   // - Lives only in this block
   // - Tells compiler value can change externally
   // - Must read from memory each time
   {
       volatile int status = 1;
       while(status) {  // Will check memory each time
           ... ... ...
       }
   }   // Value lost here
}`;

  const scopeTarget=`
  
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="746" height="638" viewBox="0 0 746 638" style="fill:none;stroke:none;fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style id="fontImports">@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&amp;display=block");</style><rect id="" x="0" y="0" width="746" height="638" style="fill: #ffffff;"></rect><g id="items" style="isolation: isolate"><g id="blend" style="mix-blend-mode: normal"><g id="g-root-tf_vcce931367dhj-fill" data-item-order="-473184" transform="translate(-9, -9)"><g id="tf_vcce931367dhj-fill" stroke="none" fill="#ffffff"><g><path d="M 10 10L 754 10L 754 646L 10 646Z"></path></g></g></g><g id="g-root-5.cu_sy_8nxj135tedn-fill" data-item-order="-264954" transform="translate(231, 99)"><g id="5.cu_sy_8nxj135tedn-fill" stroke="none" fill="#3cc583"><g><path d="M 490 250C 490 382.548 382.548 490 250 490C 117.452 490 10 382.548 10 250C 10 117.452 117.452 10 250 10C 382.548 10 490 117.452 490 250ZM 250 442C 356.039 442 442 356.039 442 250C 442 143.961 356.039 58 250 58C 143.961 58 58 143.961 58 250C 58 356.039 143.961 442 250 442Z"></path></g></g></g><g id="g-root-5.line_sy_1hap6hz135tddw-fill" data-item-order="-264949" transform="translate(159, 170.998046875)"></g><g id="g-root-4.cu_sy_13zv57r135tbt1-fill" data-item-order="-264946" transform="translate(279, 147)"><g id="4.cu_sy_13zv57r135tbt1-fill" stroke="none" fill="#4e88e7"><g><path d="M 394 202C 394 308.039 308.039 394 202 394C 95.9613 394 10 308.039 10 202C 10 95.9613 95.9613 10 202 10C 308.039 10 394 95.9613 394 202ZM 202 346C 281.529 346 346 281.529 346 202C 346 122.471 281.529 58 202 58C 122.471 58 58 122.471 58 202C 58 281.529 122.471 346 202 346Z"></path></g></g></g><g id="g-root-4.line_sy_v484yv135tclq-fill" data-item-order="-264941" transform="translate(159, 254.99993896484375)"></g><g id="g-root-3.cu_sy_hsrmlj135te6n-fill" data-item-order="-264938" transform="translate(327, 195)"><g id="3.cu_sy_hsrmlj135te6n-fill" stroke="none" fill="#e55753"><g><path d="M 298 154C 298 233.529 233.529 298 154 298C 74.471 298 10 233.529 10 154C 10 74.471 74.471 10 154 10C 233.529 10 298 74.471 298 154ZM 154 250C 207.019 250 250 207.019 250 154C 250 100.9807 207.019 58 154 58C 100.9807 58 58 100.9807 58 154C 58 207.019 100.9807 250 154 250Z"></path></g></g></g><g id="g-root-3.line_sy_ddklk7135tbt4-fill" data-item-order="-264933" transform="translate(159, 338.99896240234375)"></g><g id="g-root-2.cu_sy_1unen1j135tdz5-fill" data-item-order="-264930" transform="translate(375, 242.99993896484375)"><g id="2.cu_sy_1unen1j135tdz5-fill" stroke="none" fill="#de8431"><g><path d="M 202 106C 202 159.019 159.019 202 106 202C 52.9807 202 10 159.019 10 106C 10 52.9807 52.9807 10 106 10C 159.019 10 202 52.9807 202 106ZM 106 154C 132.51 154 154 132.51 154 106C 154 79.4903 132.51 58 106 58C 79.4903 58 58 79.4903 58 106C 58 132.51 79.4903 154 106 154Z"></path></g></g></g><g id="g-root-2.line_sy_18gxlif135td6y-fill" data-item-order="-264925" transform="translate(159, 363.94281005859375)"></g><g id="g-root-1.cu_sy_v63k87135tbm3-fill" data-item-order="-264922" transform="translate(423, 290.99993896484375)"><g id="1.cu_sy_v63k87135tbm3-fill" stroke="none" fill="#e0cb15"><g><path d="M 106 58C 106 84.5097 84.5097 106 58 106C 31.4903 106 10 84.5097 10 58C 10 31.4903 31.4903 10 58 10C 84.5097 10 106 31.4903 106 58Z"></path></g></g></g><g id="g-root-1.line_sy_qqa23r135tcec-fill" data-item-order="-264917" transform="translate(159, 361.77215576171875)"></g><g id="g-root-tx_variable_4jt0kn135tbm5-fill" data-item-order="0" transform="translate(153, 39)"><g id="tx_variable_4jt0kn135tbm5-fill" stroke="none" fill="#484848"><g><text style="font: 20px Roboto, sans-serif; white-space: pre;" font-size="20px" font-family="Roboto, sans-serif"><tspan x="14.95" y="34" dominant-baseline="ideographic">Variable Scopes in C</tspan></text></g></g></g><g id="g-root-tx_global_zp1fs7135tc0a-fill" data-item-order="0" transform="translate(15, 159)"><g id="tx_global_zp1fs7135tc0a-fill" stroke="none" fill="#374840"><g><text style="font: 20px Roboto, sans-serif; white-space: pre;" font-size="20px" font-family="Roboto, sans-serif"><tspan x="23.13" y="34" dominant-baseline="ideographic">Global</tspan></text></g></g></g><g id="g-root-2_vagyzr1367eha-fill" data-item-order="0" transform="translate(99, 147)"></g><g id="g-root-tx_extern_1lvihbb135tcsh-fill" data-item-order="0" transform="translate(27, 242.99993896484375)"><g id="tx_extern_1lvihbb135tcsh-fill" stroke="none" fill="#3a4455"><g><text style="font: 20px Roboto, sans-serif; white-space: pre;" font-size="20px" font-family="Roboto, sans-serif"><tspan x="11.74" y="34" dominant-baseline="ideographic">Extern</tspan></text></g></g></g><g id="g-root-2_zko7c713635ky-fill" data-item-order="0" transform="translate(99, 231)"></g><g id="g-root-tx_file_4l1yqv135tds8-fill" data-item-order="0" transform="translate(51, 326.99993896484375)"><g id="tx_file_4l1yqv135tds8-fill" stroke="none" fill="#543a3a"><g><text style="font: 20px Roboto, sans-serif; white-space: pre;" font-size="20px" font-family="Roboto, sans-serif"><tspan x="12.6" y="34" dominant-baseline="ideographic">File</tspan></text></g></g></g><g id="g-root-info_4j6mnb135xkwe-fill" data-item-order="0" transform="translate(99, 314.99993896484375)"></g><g id="g-root-tx_local_mcbz8n135tbf3-fill" data-item-order="0" transform="translate(27, 410.99993896484375)"><g id="tx_local_mcbz8n135tbf3-fill" stroke="none" fill="#4c4034"><g><text style="font: 20px Roboto, sans-serif; white-space: pre;" font-size="20px" font-family="Roboto, sans-serif"><tspan x="19.6" y="34" dominant-baseline="ideographic">Local</tspan></text></g></g></g><g id="g-root-cint_1d2dgkn135rx8g-fill" data-item-order="0" transform="translate(99, 398.99993896484375)"></g><g id="g-root-tx_block_1cymiw7135tbf2-fill" data-item-order="0" transform="translate(27, 494.99993896484375)"><g id="tx_block_1cymiw7135tbf2-fill" stroke="none" fill="#46432d"><g><text style="font: 20px Roboto, sans-serif; white-space: pre;" font-size="20px" font-family="Roboto, sans-serif"><tspan x="18.66" y="34" dominant-baseline="ideographic">Block</tspan></text></g></g></g><g id="g-root-bloc_zmjjfr1368u8f-fill" data-item-order="0" transform="translate(99, 482.99993896484375)"></g><g id="g-root-tf_vcce931367dhj-stroke" data-item-order="-473184" transform="translate(-9, -9)"></g><g id="g-root-5.cu_sy_8nxj135tedn-stroke" data-item-order="-264954" transform="translate(231, 99)"><g id="5.cu_sy_8nxj135tedn-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#ffffff" stroke-width="2"><g><path d="M 490 250C 490 382.5483 382.5483 490 250 490C 117.4517 490 10 382.5483 10 250C 10 117.4517 117.4517 10 250 10C 382.5483 10 490 117.4517 490 250ZM 250 442C 356.0387 442 442 356.0387 442 250C 442 143.9613 356.0387 58 250 58C 143.9613 58 58 143.9613 58 250C 58 356.0387 143.9613 442 250 442Z"></path></g></g></g><g id="g-root-5.line_sy_1hap6hz135tddw-stroke" data-item-order="-264949" transform="translate(159, 170.998046875)"><g id="5.line_sy_1hap6hz135tddw-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#484848" stroke-width="2"><g><path d="M 10 10.001953L 108.99 63.301953"></path><path d="M 100.6 66.201953L 109.4 63.501953L 106.8 54.701953" stroke-dasharray="none"></path></g></g></g><g id="g-root-4.cu_sy_13zv57r135tbt1-stroke" data-item-order="-264946" transform="translate(279, 147)"><g id="4.cu_sy_13zv57r135tbt1-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#ffffff" stroke-width="2"><g><path d="M 394 202C 394 308.0387 308.0387 394 202 394C 95.9613 394 10 308.0387 10 202C 10 95.9613 95.9613 10 202 10C 308.0387 10 394 95.9613 394 202ZM 202 346C 281.529 346 346 281.529 346 202C 346 122.471 281.529 58 202 58C 122.471 58 58 122.471 58 202C 58 281.529 122.471 346 202 346Z"></path></g></g></g><g id="g-root-4.line_sy_v484yv135tclq-stroke" data-item-order="-264941" transform="translate(159, 254.99993896484375)"><g id="4.line_sy_v484yv135tclq-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#484848" stroke-width="2"><g><path d="M 10 10.000061L 134.57 43.540061"></path><path d="M 127.1 48.300061L 135.1 43.700061L 130.5 35.700061" stroke-dasharray="none"></path></g></g></g><g id="g-root-3.cu_sy_hsrmlj135te6n-stroke" data-item-order="-264938" transform="translate(327, 195)"><g id="3.cu_sy_hsrmlj135te6n-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#ffffff" stroke-width="2"><g><path d="M 298 154C 298 233.529 233.529 298 154 298C 74.471 298 10 233.529 10 154C 10 74.471 74.471 10 154 10C 233.529 10 298 74.471 298 154ZM 154 250C 207.0193 250 250 207.0193 250 154C 250 100.9807 207.0193 58 154 58C 100.9807 58 58 100.9807 58 154C 58 207.0193 100.9807 250 154 250Z"></path></g></g></g><g id="g-root-3.line_sy_ddklk7135tbt4-stroke" data-item-order="-264933" transform="translate(159, 338.99896240234375)"><g id="3.line_sy_ddklk7135tbt4-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#484848" stroke-width="2"><g><path d="M 10 10.001038L 176 10.001038"></path><path d="M 170 16.501038L 176.5 10.001038L 170 3.501038" stroke-dasharray="none"></path></g></g></g><g id="g-root-2.cu_sy_1unen1j135tdz5-stroke" data-item-order="-264930" transform="translate(375, 242.99993896484375)"><g id="2.cu_sy_1unen1j135tdz5-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#ffffff" stroke-width="2"><g><path d="M 202 106C 202 159.0193 159.0193 202 106 202C 52.9807 202 10 159.0193 10 106C 10 52.9807 52.9807 10 106 10C 159.0193 10 202 52.9807 202 106ZM 106 154C 132.5097 154 154 132.5097 154 106C 154 79.4903 132.5097 58 106 58C 79.4903 58 58 79.4903 58 106C 58 132.5097 79.4903 154 106 154Z"></path></g></g></g><g id="g-root-2.line_sy_18gxlif135td6y-stroke" data-item-order="-264925" transform="translate(159, 363.94281005859375)"><g id="2.line_sy_18gxlif135td6y-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#484848" stroke-width="2"><g><path d="M 10 69.05719L 227.42 10.51719"></path><path d="M 223.3 18.35719L 227.9 10.35719L 219.9 5.75719" stroke-dasharray="none"></path></g></g></g><g id="g-root-1.cu_sy_v63k87135tbm3-stroke" data-item-order="-264922" transform="translate(423, 290.99993896484375)"><g id="1.cu_sy_v63k87135tbm3-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#ffffff" stroke-width="2"><g><path d="M 106 58C 106 84.5097 84.5097 106 58 106C 31.4903 106 10 84.5097 10 58C 10 31.4903 31.4903 10 58 10C 84.5097 10 106 31.4903 106 58Z"></path></g></g></g><g id="g-root-1.line_sy_qqa23r135tcec-stroke" data-item-order="-264917" transform="translate(159, 361.77215576171875)"><g id="1.line_sy_qqa23r135tcec-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#484848" stroke-width="2"><g><path d="M 10 155.227844L 277.95 10.947844"></path><path d="M 275.7 19.527844L 278.4 10.727844L 269.6 8.027844" stroke-dasharray="none"></path></g></g></g><g id="g-root-tx_variable_4jt0kn135tbm5-stroke" data-item-order="0" transform="translate(153, 39)"></g><g id="g-root-tx_global_zp1fs7135tc0a-stroke" data-item-order="0" transform="translate(15, 159)"></g><g id="g-root-2_vagyzr1367eha-stroke" data-item-order="0" transform="translate(99, 147)"><g id="2_vagyzr1367eha-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#374840" stroke-width="2"><g><path d="M 52 29.969999C 52 43.970001 34 56.970001 34 56.970001C 34 56.970001 16 43.970001 16 29.969999C 16 19.478001 23.506001 10.97 34 10.97C 44.493999 10.97 52 19.478001 52 29.969999ZM 22 28.969999C 22 35.59742 27.372583 40.970001 34 40.970001C 40.627419 40.970001 46 35.59742 46 28.970001C 46 22.342583 40.627419 16.970001 34 16.970001C 27.372583 16.970001 22 22.342583 22 28.970001ZM 23.088001 23.970001L 25 23.970001C 26.656855 23.970001 28 25.313147 28 26.970001C 28 28.07457 28.89543 28.969999 30 28.969999C 31.10457 28.969999 32 29.865431 32 30.969999C 32 33.731422 29.761423 35.970001 27 35.970001L 24.251999 35.970001M 45.622002 31.969999L 44 31.969999C 42.343147 31.970001 41 30.626854 41 28.970001C 41 27.865431 40.104568 26.969999 39 26.969999C 37.895432 26.969999 37 26.07457 37 24.970001C 36.985588 23.650295 37.499218 22.379562 38.426605 21.440531C 39.353996 20.501499 40.618217 19.972057 41.938004 19.970001"></path></g></g></g><g id="g-root-tx_extern_1lvihbb135tcsh-stroke" data-item-order="0" transform="translate(27, 242.99993896484375)"></g><g id="g-root-2_zko7c713635ky-stroke" data-item-order="0" transform="translate(99, 231)"><g id="2_zko7c713635ky-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#3a4455" stroke-width="2"><g><path d="M 29 38.545998L 57 11M 57 26.742001L 57 11L 41 11M 45.147999 33.954002C 47.696949 41.5989 44.703499 49.996662 37.893547 54.305508C 31.083591 58.614353 22.212891 57.723362 16.395905 52.14624C 10.578917 46.569118 9.315392 37.743774 13.333824 30.758516C 17.352257 23.77326 25.616602 20.429045 33.362 22.653999"></path></g></g></g><g id="g-root-tx_file_4l1yqv135tds8-stroke" data-item-order="0" transform="translate(51, 326.99993896484375)"></g><g id="g-root-info_4j6mnb135xkwe-stroke" data-item-order="0" transform="translate(99, 314.99993896484375)"><g id="info_4j6mnb135xkwe-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#543a3a" stroke-width="2"><g><path d="M 31 57L 13 57C 11.895431 57 11 56.104568 11 55L 11 13C 11 11.895431 11.895431 11 13 11L 39.580002 11C 40.111607 10.996926 40.622562 11.205627 41 11.58L 48.419998 19C 48.794373 19.377438 49.003075 19.888393 49 20.42L 49 27M 24.5 26C 24.5 25.723858 24.723858 25.5 25 25.5C 25.276142 25.5 25.5 25.723858 25.5 26C 25.5 26.276142 25.276142 26.5 25 26.5C 24.723858 26.5 24.5 26.276142 24.5 26M 24.5 31C 24.5 30.723858 24.723858 30.5 25 30.5C 25.276142 30.5 25.5 30.723858 25.5 31C 25.5 31.276142 25.276142 31.5 25 31.5C 24.723858 31.5 24.5 31.276142 24.5 31M 24.5 36C 24.5 35.723858 24.723858 35.5 25 35.5C 25.276142 35.5 25.5 35.723858 25.5 36C 25.5 36.276142 25.276142 36.5 25 36.5C 24.723858 36.5 24.5 36.276142 24.5 36M 24.5 41C 24.5 40.723858 24.723858 40.5 25 40.5C 25.276142 40.5 25.5 40.723858 25.5 41C 25.5 41.276142 25.276142 41.5 25 41.5C 24.723858 41.5 24.5 41.276142 24.5 41M 24.5 46C 24.5 45.723858 24.723858 45.5 25 45.5C 25.276142 45.5 25.5 45.723858 25.5 46C 25.5 46.276142 25.276142 46.5 25 46.5C 24.723858 46.5 24.5 46.276142 24.5 46M 24.5 51.119999C 24.5 50.843857 24.723858 50.619999 25 50.619999C 25.276142 50.619999 25.5 50.843857 25.5 51.119999C 25.5 51.396141 25.276142 51.619999 25 51.619999C 24.723858 51.619999 24.5 51.396141 24.5 51.119999M 28 18.220001C 28.102993 19.06073 27.840885 19.905302 27.280001 20.540001C 26.703474 21.180828 25.882 21.546776 25.02 21.546776C 24.158001 21.546776 23.336525 21.180828 22.759998 20.540001C 22.184704 19.912014 21.907776 19.066658 22 18.220001L 22.74 11L 27 11ZM 33 45C 33 51.627419 38.372581 57 45 57C 51.627419 57 57 51.627419 57 45C 57 38.372581 51.627419 33 45 33C 38.372581 33 33 38.372581 33 45M 45 51L 45 44C 45 43.447716 44.552284 43 44 43L 42 43M 43.5 38C 43.776142 38 44 38.223858 44 38.5C 44 38.776142 43.776142 39 43.5 39C 43.223858 39 43 38.776142 43 38.5C 43 38.223858 43.223858 38 43.5 38M 42 51L 48 51"></path></g></g></g><g id="g-root-tx_local_mcbz8n135tbf3-stroke" data-item-order="0" transform="translate(27, 410.99993896484375)"></g><g id="g-root-cint_1d2dgkn135rx8g-stroke" data-item-order="0" transform="translate(99, 398.99993896484375)"><g id="cint_1d2dgkn135rx8g-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#4c4034" stroke-width="2"><g><path d="M 47.830002 45.444C 49.486855 45.444 50.830002 44.100857 50.830002 42.444C 50.830002 40.787148 49.486855 39.444 47.830002 39.444C 46.173145 39.444 44.830002 40.787148 44.830002 42.444C 44.830002 44.100857 46.173145 45.444 47.830002 45.444ZM 56.830002 42.444C 56.830002 47.396 50.700001 54.389999 48.557999 56.683998C 48.369034 56.884659 48.105629 56.998425 47.830002 56.998425C 47.554371 56.998425 47.290966 56.884659 47.102001 56.683998C 44.959999 54.389999 38.830002 47.402 38.830002 42.444C 38.830002 37.473438 42.859436 33.444 47.830002 33.444C 52.800564 33.444 56.830002 37.473438 56.830002 42.444ZM 37.115997 33.877998L 33.916 25.858C 33.515999 24.836 32.799999 24.82 32.346001 25.821999L 28.164 35L 24.445999 30.538C 24.176559 30.142788 23.716394 29.921778 23.239491 29.958525C 22.762585 29.995274 22.341713 30.284176 22.136 30.716L 17.164 39M 34.164001 45L 13.164 45C 12.059431 45 11.164 44.104568 11.164 43L 11.164 13C 11.164 11.895431 12.059431 11 13.164 11L 43.164001 11C 44.26857 11 45.164001 11.895431 45.164001 13L 45.164001 29M 11.164 39L 34.164001 39M 20.164 23C 21.820854 23 23.164001 21.656855 23.164001 20C 23.164001 18.343147 21.820854 17 20.164001 17C 18.507145 17 17.164 18.343147 17.164 20C 17.164 21.656855 18.507145 23 20.164001 23Z"></path></g></g></g><g id="g-root-tx_block_1cymiw7135tbf2-stroke" data-item-order="0" transform="translate(27, 494.99993896484375)"></g><g id="g-root-bloc_zmjjfr1368u8f-stroke" data-item-order="0" transform="translate(99, 482.99993896484375)"><g id="bloc_zmjjfr1368u8f-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#46432d" stroke-width="2"><g><path d="M 11.714286 34C 11.714287 46.308064 21.69194 56.285713 34 56.285713C 46.308064 56.285713 56.285713 46.308064 56.285713 34C 56.285713 21.69194 46.308064 11.714287 34 11.714287C 21.69194 11.714287 11.714287 21.69194 11.714287 34M 18.228571 49.771431L 49.771431 18.228571"></path></g></g></g></g></g></svg>  

  `
 const lifeSpan=`
  <svg viewBox="0 0 800 400">
  <!-- Background -->
  <rect width="800" height="400" fill="white"/>
  
  <!-- Time axis -->
  <line x1="50" y1="350" x2="750" y2="350" stroke="black" stroke-width="2"/>
  <path d="M 750 350 L 740 345 L 740 355 Z" fill="black"/>
  <text x="760" y="355" font-family="Arial" font-size="14">Time →</text>

  <!-- Program Runtime Bar -->
  <rect x="50" y="50" width="700" height="40" fill="#4A90E2" opacity="0.2"/>
  <text x="55" y="75" font-family="Arial" font-size="14" fill="#2C5282">Program Runtime</text>

  <!-- Function Calls -->
  <rect x="150" y="120" width="200" height="40" fill="#48BB78" opacity="0.2"/>
  <text x="155" y="145" font-family="Arial" font-size="14" fill="#2F855A">Function Call 1</text>
  <rect x="400" y="120" width="200" height="40" fill="#48BB78" opacity="0.2"/>
  <text x="405" y="145" font-family="Arial" font-size="14" fill="#2F855A">Function Call 2</text>

  <!-- Blocks -->
  <rect x="170" y="190" width="80" height="40" fill="#F6AD55" opacity="0.2"/>
  <text x="175" y="215" font-family="Arial" font-size="12" fill="#C05621">Block 1</text>
  <rect x="270" y="190" width="60" height="40" fill="#F6AD55" opacity="0.2"/>
  <text x="275" y="215" font-family="Arial" font-size="12" fill="#C05621">Block 2</text>
  <rect x="420" y="190" width="70" height="40" fill="#F6AD55" opacity="0.2"/>
  <text x="425" y="215" font-family="Arial" font-size="12" fill="#C05621">Block 3</text>
  <rect x="510" y="190" width="70" height="40" fill="#F6AD55" opacity="0.2"/>
  <text x="515" y="215" font-family="Arial" font-size="12" fill="#C05621">Block 4</text>

  <!-- Variable Lifetimes -->
  <!-- Program Variables -->
  <line x1="50" y1="270" x2="750" y2="270" stroke="#4A90E2" stroke-width="3"/>
  <text x="55" y="265" font-family="Arial" font-size="14">Program Variables</text>

  <!-- Static Variables -->
  <line x1="150" y1="300" x2="600" y2="300" stroke="#48BB78" stroke-width="3"/>
  <text x="155" y="295" font-family="Arial" font-size="14">Static Variables</text>

  <!-- Register Variables -->
  <line x1="170" y1="330" x2="250" y2="330" stroke="#F6AD55" stroke-width="3"/>
  <line x1="270" y1="330" x2="330" y2="330" stroke="#F6AD55" stroke-width="3"/>
  <line x1="420" y1="330" x2="490" y2="330" stroke="#F6AD55" stroke-width="3"/>
  <line x1="510" y1="330" x2="580" y2="330" stroke="#F6AD55" stroke-width="3"/>
  <text x="175" y="325" font-family="Arial" font-size="14">Register/Auto Variables</text>

  <!-- Legend -->
  <rect x="600" y="100" width="180" height="120" fill="white" stroke="black"/>
  <text x="610" y="120" font-family="Arial" font-size="12" font-weight="bold">Variable Types:</text>
  
  <circle cx="620" cy="140" r="5" fill="#4A90E2"/>
  <text x="635" y="145" font-family="Arial" font-size="12">Program (Entire runtime)</text>
  
  <circle cx="620" cy="165" r="5" fill="#48BB78"/>
  <text x="635" y="170" font-family="Arial" font-size="12">Static (Between calls)</text>
  
  <circle cx="620" cy="190" r="5" fill="#F6AD55"/>
  <text x="635" y="195" font-family="Arial" font-size="12">Register/Auto (Block)</text>
</svg>
 `
 

  const scopePyramid=`
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="530" height="518" viewBox="0 0 530 518" style="fill:none;stroke:none;fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style id="fontImports">@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&amp;display=block");</style><rect id="" x="0" y="0" width="530" height="518" style="fill: #ffffff;"></rect><g id="items" style="isolation: isolate"><g id="blend" style="mix-blend-mode: normal"><g id="g-root-tf_dikkmqzu12bm-fill" data-item-order="-272448" transform="translate(-9, -9)"><g id="tf_dikkmqzu12bm-fill" stroke="none" fill="#ffffff"><g><path d="M 10 10L 538 10L 538 526L 10 526Z"></path></g></g></g><g id="g-root-5.cu_sy_8xr9tezu12x3-fill" data-item-order="-172794" transform="translate(15, 374.14404296875)"><g id="5.cu_sy_8xr9tezu12x3-fill" stroke="none" fill="#4e88e7"><g><path d="M 490 94.855957L 58 94.855957L 86.8 40.855957L 454 40.855957L 490 94.855957ZM 58 94.856L 10 58.856L 46.1896 10L 86.8 40.856L 58 94.856Z"></path></g></g></g><g id="g-root-4.cu_sy_1q87sduzu11xc-fill" data-item-order="-172790" transform="translate(51.189453125, 325.0457763671875)"><g id="4.cu_sy_1q87sduzu11xc-fill" stroke="none" fill="#1eabda"><g><path d="M 381.719352 35.954224L 417.810352 89.954224L 50.610352 89.954224L 79.483452 35.954224L 381.719352 35.954224ZM 79.4835 35.9542L 50.6104 89.9542L 10 59.0983L 46.3691 10L 79.4835 35.9542Z"></path></g></g></g><g id="g-root-3.cu_sy_qqa8hezu12q1-fill" data-item-order="-172786" transform="translate(87.55859375, 277)"><g id="3.cu_sy_qqa8hezu12q1-fill" stroke="none" fill="#3cc583"><g><path d="M 309.609258 30L 345.350258 84L 43.114258 84L 71.707058 30L 309.609258 30ZM 71.7072 30L 43.1144 84L 10 57.9731L 45.5356 10L 71.7072 30Z"></path></g></g></g><g id="g-root-2.cu_sy_8zmp2qzu11xe-fill" data-item-order="-172782" transform="translate(123.0947265625, 228.8590087890625)"><g id="2.cu_sy_8zmp2qzu11xe-fill" stroke="none" fill="#92bd39"><g><path d="M 237.980898 24.140991L 274.072898 78.140991L 36.170898 78.140991L 65.043998 24.140991L 237.980898 24.140991ZM 65.0447 24.141L 36.1716 78.141L 10 58.2137L 45.7138 10L 65.0447 24.141Z"></path></g></g></g><g id="g-root-1.cu_sy_1upwprmzu105f-fill" data-item-order="-172778" transform="translate(158.80859375, 99)"><g id="1.cu_sy_1upwprmzu105f-fill" stroke="none" fill="#e0cb15"><g><path d="M 106.191078 10L 202.267078 154L 29.330078 154L 106.191078 10ZM 106.1919 10L 29.3309 154L 10 139.859L 106.1919 10Z"></path></g></g></g><g id="g-root-tx_cvariabl_18komeqzu11jd-fill" data-item-order="0" transform="translate(129, 39)"><g id="tx_cvariabl_18komeqzu11jd-fill" stroke="none" fill="#484848"><g><text style="font: 20px Roboto, sans-serif; white-space: pre;" font-size="20px" font-family="Roboto, sans-serif"><tspan x="15.79" y="34" dominant-baseline="ideographic">C Variable Scope Hierarchy</tspan></text></g></g></g><g id="g-root-tx_block_1lw54s2zu0zyg-fill" data-item-order="0" transform="translate(231, 204)"><g id="tx_block_1lw54s2zu0zyg-fill" stroke="none" fill="#ffffff"><g><text style="font: 20px Roboto, sans-serif; white-space: pre;" font-size="20px" font-family="Roboto, sans-serif"><tspan x="15.33" y="34" dominant-baseline="ideographic">Block</tspan></text></g></g></g><g id="g-root-tx_local_5v436zu11qf-fill" data-item-order="0" transform="translate(237, 258)"><g id="tx_local_5v436zu11qf-fill" stroke="none" fill="#ffffff"><g><text style="font: 20px Roboto, sans-serif; white-space: pre;" font-size="20px" font-family="Roboto, sans-serif"><tspan x="15.8" y="34" dominant-baseline="ideographic">Local</tspan></text></g></g></g><g id="g-root-tx_file_hwinhuzu12j2-fill" data-item-order="0" transform="translate(249, 312)"><g id="tx_file_hwinhuzu12j2-fill" stroke="none" fill="#ffffff"><g><text style="font: 20px Roboto, sans-serif; white-space: pre;" font-size="20px" font-family="Roboto, sans-serif"><tspan x="12.3" y="34" dominant-baseline="ideographic">File</tspan></text></g></g></g><g id="g-root-tx_extern_143m642zu105h-fill" data-item-order="0" transform="translate(243, 366)"><g id="tx_extern_143m642zu105h-fill" stroke="none" fill="#ffffff"><g><text style="font: 20px Roboto, sans-serif; white-space: pre;" font-size="20px" font-family="Roboto, sans-serif"><tspan x="11.87" y="34" dominant-baseline="ideographic">Extern</tspan></text></g></g></g><g id="g-root-tx_global_1lu9piqzu10y4-fill" data-item-order="0" transform="translate(237, 420)"><g id="tx_global_1lu9piqzu10y4-fill" stroke="none" fill="#ffffff"><g><text style="font: 20px Roboto, sans-serif; white-space: pre;" font-size="20px" font-family="Roboto, sans-serif"><tspan x="17.56" y="34" dominant-baseline="ideographic">Global</tspan></text></g></g></g><g id="g-root-tf_dikkmqzu12bm-stroke" data-item-order="-272448" transform="translate(-9, -9)"></g><g id="g-root-5.cu_sy_8xr9tezu12x3-stroke" data-item-order="-172794" transform="translate(15, 374.14404296875)"><g id="5.cu_sy_8xr9tezu12x3-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#ffffff" stroke-width="2"><g><path d="M 58 94.855957L 490 94.855957L 454 40.855957L 86.8 40.855957L 58 94.855957ZM 58 94.856L 10 58.856L 46.1896 10L 86.8 40.856L 58 94.856Z"></path></g></g></g><g id="g-root-4.cu_sy_1q87sduzu11xc-stroke" data-item-order="-172790" transform="translate(51.189453125, 325.0457763671875)"><g id="4.cu_sy_1q87sduzu11xc-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#ffffff" stroke-width="2"><g><path d="M 417.810352 89.954224L 381.718952 35.954224L 79.483452 35.954224L 50.610352 89.954224L 417.810352 89.954224ZM 79.4835 35.9542L 50.6104 89.9542L 10 59.0983L 46.3691 10L 79.4835 35.9542Z"></path></g></g></g><g id="g-root-3.cu_sy_qqa8hezu12q1-stroke" data-item-order="-172786" transform="translate(87.55859375, 277)"><g id="3.cu_sy_qqa8hezu12q1-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#ffffff" stroke-width="2"><g><path d="M 345.349758 84L 309.608758 30L 71.707058 30L 43.114258 84L 345.349758 84ZM 71.7072 30L 43.1144 84L 10 57.9731L 45.5356 10L 71.7072 30Z"></path></g></g></g><g id="g-root-2.cu_sy_8zmp2qzu11xe-stroke" data-item-order="-172782" transform="translate(123.0947265625, 228.8590087890625)"><g id="2.cu_sy_8zmp2qzu11xe-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#ffffff" stroke-width="2"><g><path d="M 274.072598 78.140991L 237.981198 24.140991L 65.043998 24.140991L 36.170898 78.140991L 274.072598 78.140991ZM 65.0447 24.141L 36.1716 78.141L 10 58.2137L 45.7138 10L 65.0447 24.141Z"></path></g></g></g><g id="g-root-1.cu_sy_1upwprmzu105f-stroke" data-item-order="-172778" transform="translate(158.80859375, 99)"><g id="1.cu_sy_1upwprmzu105f-stroke" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="4" stroke="#ffffff" stroke-width="2"><g><path d="M 106.191078 10L 202.267278 154L 29.330078 154L 106.191078 10ZM 106.1919 10L 29.3309 154L 10 139.859L 106.1919 10Z"></path></g></g></g><g id="g-root-tx_cvariabl_18komeqzu11jd-stroke" data-item-order="0" transform="translate(129, 39)"></g><g id="g-root-tx_block_1lw54s2zu0zyg-stroke" data-item-order="0" transform="translate(231, 204)"></g><g id="g-root-tx_local_5v436zu11qf-stroke" data-item-order="0" transform="translate(237, 258)"></g><g id="g-root-tx_file_hwinhuzu12j2-stroke" data-item-order="0" transform="translate(249, 312)"></g><g id="g-root-tx_extern_143m642zu105h-stroke" data-item-order="0" transform="translate(243, 366)"></g><g id="g-root-tx_global_1lu9piqzu10y4-stroke" data-item-order="0" transform="translate(237, 420)"></g></g></g></svg>`

  const scopeList=[
    `**Block variable** in C is a variable declared inside a block (delimited by curly braces) and visible only within that block. 
    It's scope starts at the point of declaration and continues until the closing brace of the block containing the declaration. 
    The variable cannot be accessed from outside the containing block, regardless of it's storage duration or other attributes.`,
    `**Local variable** (also known as a function variable) in C is a variable declared inside a function and visible throughout that function.
     Its scope begins at the point of declaration and extends to the end of the function, including any blocks nested within the function where it is not shadowed by a block variable of the same name. 
     The function variable is not accessible from outside its containing function, including from other functions in the same file.
    `,
    `**File variable** (also known as file-scope variable) in C is a variable declared outside any function in a source file and visible from it's point of declaration to the end of that file. 
     The scope of file variable extends through all functions in the file, but it is not accessible from other source files unless explicitly declared as extern.
     File scope represents a broader visibility than function scope but remains contained within its translation unit.
    `,
   
    `<p id='end'></p>**Extern variable** in C has program-wide scope, meaning it can be accessed across multiple source files. 
    Its scope extends throughout the entire program, making it visible to any source file that declares it with the extern keyword, though the actual variable must be defined (storage allocated) in exactly one source file. 
    This represents the almost broadest possible scope in C, allowing shared access to the variable across the program's translation units.
    `,
    `**Global variable** (also known as program variable) in C has program-wide scope, making it accessible throughout the entire program. 
    It's scope begins at the point of declaration and continues through all functions and files in the program. 
    Like extern variables, it represents the broadest scope level in C, but unlike extern variables, it is both defined and declared in the same place, making it directly accessible without additional extern declarations.`

  ]


  const tableData = {
    headers: [
      { text: 'Automatic', description: 'deallocated after block', link: '#automatic' },
      { text: 'Register', description: 'stored in CPU register', link: '#register' },
      { text: 'Static', description: 'persists between calls', link: '#static' },
      { text: 'Program', description: 'exists entire runtime', link: '#program' }
    ],
    rows: [
      {
        scope: 'Block',
        description: 'within {} only',
        cells: [
          [
            { text: 'no modifier', tooltip: 'Block-local variable' },
            { text: 'const', tooltip: 'Block-local constant' },
            { text: 'volatile', tooltip: 'Can change externally' },
            { text: 'restrict', tooltip: 'No pointer aliasing' }
          ],
          [
            { text: 'no modifier', tooltip: 'Block register' },
            { text: 'const', tooltip: 'Constant register' },
            { text: 'restrict', tooltip: 'No pointer aliasing' }
          ],
          'N/A',
          'N/A'
        ]
      },
      {
        scope: 'Local',
        description: 'function scope',
        cells: [
          [
            { text: 'no modifier', tooltip: 'Basic local variable' },
            { text: 'const', tooltip: 'Immutable local value' },
            { text: 'volatile', tooltip: 'Can change unexpectedly' },
            { text: 'restrict', tooltip: 'No pointer aliasing' }
          ],
          [
            { text: 'no modifier', tooltip: 'Basic register variable' },
            { text: 'const', tooltip: 'Read-only register' },
            { text: 'restrict', tooltip: 'No pointer aliasing' }
          ],
          [
            { text: 'no modifier', tooltip: 'Retains value between calls' },
            { text: 'const', tooltip: 'Immutable static value' },
            { text: 'volatile', tooltip: 'Can change externally' },
            { text: 'restrict', tooltip: 'No pointer aliasing' }
          ],
          'N/A'
        ]
      },
      {
        scope: 'File-scope',
        description: 'current file only',
        cells: [
          'N/A',
          'N/A',
          [
            { text: 'no modifier', tooltip: 'File-wide access' },
            { text: 'const', tooltip: 'File constant' },
            { text: 'volatile', tooltip: 'Can change externally' },
            { text: 'restrict', tooltip: 'No pointer aliasing' }
          ],
          'N/A'
        ]
      },
      {
        scope: 'Extern',
        description: 'other files',
        cells: [
          'N/A',
          'N/A',
          'N/A',
          [
            { text: 'no modifier', tooltip: 'External linkage' },
            { text: 'const', tooltip: 'External constant' },
            { text: 'volatile', tooltip: 'External changes' },
            { text: 'restrict', tooltip: 'No pointer aliasing' }
          ]
        ]
      },
      {
        scope: 'Global',
        description: 'other files',
        cells: [
          'N/A',
          'N/A',
          'N/A',
          [
            { text: 'no modifier', tooltip: 'External linkage' },
            { text: 'const', tooltip: 'External constant' },
            { text: 'volatile', tooltip: 'External changes' },
            { text: 'restrict', tooltip: 'No pointer aliasing' }
          ]
        ]
      }
    ]
  };


//   const tableData = {
//     headers: [
//       { text: 'Automatic', description: 'deallocated after block' },
//       { text: 'Register', description: 'stored in CPU register' },
//       { text: 'Static', description: 'persists between calls' },
//       { text: 'Program', description: 'exists entire runtime' }
//     ],
//     rows: [
//       {
//         scope: 'Local',
//         description: 'function scope',
//         cells: [
//           [
//             { text: 'no modifier', tooltip: 'Basic local variable' },
//             { text: 'const', tooltip: 'Immutable local value' },
//             { text: 'volatile', tooltip: 'Can change unexpectedly' },
//             { text: 'restrict', tooltip: 'No pointer aliasing' }
//           ],
//           [
//             { text: 'no modifier', tooltip: 'Basic register variable' },
//             { text: 'const', tooltip: 'Read-only register' },
//             { text: 'restrict', tooltip: 'No pointer aliasing' }
//           ],
//           [
//             { text: 'no modifier', tooltip: 'Retains value between calls' },
//             { text: 'const', tooltip: 'Immutable static value' },
//             { text: 'volatile', tooltip: 'Can change externally' },
//             { text: 'restrict', tooltip: 'No pointer aliasing' }
//           ],
//           'N/A'
//         ]
//       },
//       {
//         scope: 'Global',
//         description: 'entire program',
//         cells: [
//           'N/A',
//           'N/A',
//           [
//             { text: 'no modifier', tooltip: 'Basic global static' },
//             { text: 'const', tooltip: 'Global constant' },
//             { text: 'volatile', tooltip: 'Can change externally' },
//             { text: 'restrict', tooltip: 'No pointer aliasing' }
//           ],
//           [
//             { text: 'no modifier', tooltip: 'Program-wide access' },
//             { text: 'const', tooltip: 'Program constant' },
//             { text: 'volatile', tooltip: 'External changes' },
//             { text: 'restrict', tooltip: 'No pointer aliasing' }
//           ]
//         ]
//       },
//       {
//         scope: 'Extern',
//         description: 'other files',
//         cells: [
//           'N/A',
//           'N/A',
//           'N/A',
//           [
//             { text: 'no modifier', tooltip: 'External linkage' },
//             { text: 'const', tooltip: 'External constant' },
//             { text: 'volatile', tooltip: 'External changes' },
//             { text: 'restrict', tooltip: 'No pointer aliasing' }
//           ]
//         ]
//       },
//       {
//         scope: 'Block',
//         description: 'within {} only',
//         cells: [
//           [
//             { text: 'no modifier', tooltip: 'Block-local variable' },
//             { text: 'const', tooltip: 'Block-local constant' },
//             { text: 'volatile', tooltip: 'Can change externally' },
//             { text: 'restrict', tooltip: 'No pointer aliasing' }
//           ],
//           [
//             { text: 'no modifier', tooltip: 'Block register' },
//             { text: 'const', tooltip: 'Constant register' },
//             { text: 'restrict', tooltip: 'No pointer aliasing' }
//           ],
//           'N/A',
//           'N/A'
//         ]
//       },
//       {
//         scope: 'File-scope',
//         description: 'current file only',
//         cells: [
//           'N/A',
//           'N/A',
//           [
//             { text: 'no modifier', tooltip: 'File-wide access' },
//             { text: 'const', tooltip: 'File constant' },
//             { text: 'volatile', tooltip: 'Can change externally' },
//             { text: 'restrict', tooltip: 'No pointer aliasing' }
//           ],
//           'N/A'
//         ]
//       }
//     ]
//   };

  return {
    props: {
      tableData,
      scopeList,
      scopePyramid,
      lifeSpan,
      scopeTarget,
      blockScopeExample,
      lifetimeList
      
    }
  }
}