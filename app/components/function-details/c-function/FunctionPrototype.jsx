// // // // // // // // function-prototype/function-prototype.js
// // // // // // // import React from 'react'
// // // // // // // import styles from './FunctionPrototype.module.css'
// // // // // // // import { colorSchemes } from './FunctionPrototypeColors.js'

// // // // // // // export default function FunctionPrototype({ prototype, colorScheme = 'default' }) {
// // // // // // //  return (
// // // // // // //    <div className={styles.container}>
// // // // // // //      <div className={styles.function}>
// // // // // // //        <span className={styles.block} style={colorSchemes[colorScheme].returnType}>
// // // // // // //          {prototype.returnType}
// // // // // // //        </span>
// // // // // // //        <span className={styles.funcName} style={{color: colorSchemes[colorScheme].funcName}}>
// // // // // // //          {prototype.funcName}
// // // // // // //        </span>
// // // // // // //       <span className={styles.coma}>(</span> 
// // // // // // //        {prototype.parameters.map((param, index) => (
// // // // // // //          <React.Fragment key={index}>
// // // // // // //            <span className={styles.block} style={colorSchemes[colorScheme][`type${index + 1}`]}>
// // // // // // //              {param.type}
// // // // // // //            </span>{' '}
// // // // // // //            <span className={styles.block} style={colorSchemes[colorScheme].paramName}>
// // // // // // //              {param.name}
// // // // // // //            </span>
// // // // // // //            {index < prototype.parameters.length - 1 ? <span className={styles.coma}>,</span> : ''}
// // // // // // //          </React.Fragment>
// // // // // // //        ))}
// // // // // // //         <span className={styles.coma}>)</span> ;
// // // // // // //      </div>

// // // // // // //      <div className={styles.legend}>
// // // // // // //        <div className={styles.legendItem}>
// // // // // // //          <div className={styles.colorBox} style={colorSchemes[colorScheme].returnType} />
// // // // // // //          Return type
// // // // // // //        </div>
// // // // // // //        {prototype.parameters.map((_, i) => (
// // // // // // //          <div key={i} className={styles.legendItem}>
// // // // // // //            <div className={styles.colorBox} style={colorSchemes[colorScheme][`type${i + 1}`]} />
// // // // // // //            {`${i + 1}${i + 1 === 1 ? 'st' : i + 1 === 2 ? 'nd' : i + 1 === 3 ? 'rd' : 'th'} parameter type`}
// // // // // // //          </div>
// // // // // // //        ))}
// // // // // // //        <div className={styles.legendItem}>
// // // // // // //          <div className={styles.colorBox} style={colorSchemes[colorScheme].paramName} />
// // // // // // //          Parameter names
// // // // // // //        </div>
// // // // // // //      </div>
// // // // // // //    </div>
// // // // // // //  )
// // // // // // // }

// // // // // // import React from 'react'
// // // // // // import styles from './FunctionPrototype.module.css'
// // // // // // import { colorSchemes } from './FunctionPrototypeColors.js'

// // // // // // export default function FunctionPrototype({ prototype, colorScheme = 'default' }) {
// // // // // //   if (!prototype || !prototype.parameters) {
// // // // // //     return null;
// // // // // //   }

// // // // // //   return (
// // // // // //     <div className={styles.container}>
// // // // // //       <div className={styles.function}>
// // // // // //         <span className={styles.block} style={colorSchemes[colorScheme].returnType}>
// // // // // //           {prototype.returnType || 'void'}
// // // // // //         </span>
// // // // // //         <span className={styles.funcName} style={{color: colorSchemes[colorScheme].funcName}}>
// // // // // //           {prototype.funcName || 'unnamed'}
// // // // // //         </span>
// // // // // //         <span className={styles.coma}>(</span> 
// // // // // //         {Array.isArray(prototype.parameters) && prototype.parameters.map((param, index) => (
// // // // // //           <React.Fragment key={index}>
// // // // // //             <span className={styles.block} style={colorSchemes[colorScheme][`type${index + 1}`]}>
// // // // // //               {param?.type || 'unknown'}
// // // // // //             </span>{' '}
// // // // // //             <span className={styles.block} style={colorSchemes[colorScheme].paramName}>
// // // // // //               {param?.name || `param${index + 1}`}
// // // // // //             </span>
// // // // // //             {index < prototype.parameters.length - 1 ? <span className={styles.coma}>,</span> : ''}
// // // // // //           </React.Fragment>
// // // // // //         ))}
// // // // // //         <span className={styles.coma}>)</span> ;
// // // // // //       </div>

// // // // // //       <div className={styles.legend}>
// // // // // //         <div className={styles.legendItem}>
// // // // // //           <div className={styles.colorBox} style={colorSchemes[colorScheme].returnType} />
// // // // // //           Return type
// // // // // //         </div>
// // // // // //         {Array.isArray(prototype.parameters) && prototype.parameters.map((_, i) => (
// // // // // //           <div key={i} className={styles.legendItem}>
// // // // // //             <div className={styles.colorBox} style={colorSchemes[colorScheme][`type${i + 1}`]} />
// // // // // //             {`${i + 1}${i + 1 === 1 ? 'st' : i + 1 === 2 ? 'nd' : i + 1 === 3 ? 'rd' : 'th'} parameter type`}
// // // // // //           </div>
// // // // // //         ))}
// // // // // //         <div className={styles.legendItem}>
// // // // // //           <div className={styles.colorBox} style={colorSchemes[colorScheme].paramName} />
// // // // // //           Parameter names
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   )
// // // // // // }

// // // // // import React from 'react'
// // // // // import styles from './FunctionPrototype.module.css'
// // // // // import { colorSchemes } from './FunctionPrototypeColors.js'

// // // // // export default function FunctionPrototype({ prototype, colorScheme = 'default' }) {
// // // // //   if (!prototype || !prototype.parameters) {
// // // // //     return null;
// // // // //   }

// // // // //   return (
// // // // //     <div className={styles.container}>
// // // // //       <div className={styles.function}>
// // // // //         <span className={styles.block} style={colorSchemes[colorScheme].returnType}>
// // // // //           {prototype.returnType || 'void'}
// // // // //         </span>
// // // // //         <span className={styles.funcName} style={{color: colorSchemes[colorScheme].funcName}}>
// // // // //           {prototype.funcName || 'unnamed'}
// // // // //         </span>
// // // // //         <span className={styles.coma}>(</span> 
// // // // //         {Array.isArray(prototype.parameters) && prototype.parameters.map((param, index) => (
// // // // //           <React.Fragment key={index}>
// // // // //             <span className={styles.block} style={colorSchemes[colorScheme][`type${index + 1}`]}>
// // // // //               {param?.type || 'unknown'}
// // // // //             </span>{' '}
// // // // //             <span className={styles.block} style={colorSchemes[colorScheme].paramName}>
// // // // //               {param?.name || `param${index + 1}`}
// // // // //             </span>
// // // // //             {index < prototype.parameters.length - 1 ? <span className={styles.coma}>,</span> : ''}
// // // // //           </React.Fragment>
// // // // //         ))}
// // // // //         <span className={styles.coma}>)</span> ;
// // // // //       </div>

// // // // //       <div className={styles.legend}>
// // // // //         <div className={styles.legendItem}>
// // // // //           <div className={styles.colorBox} style={colorSchemes[colorScheme].returnType} />
// // // // //           Return type
// // // // //         </div>
// // // // //         {Array.isArray(prototype.parameters) && prototype.parameters.length > 0 && (
// // // // //           <>
// // // // //             {prototype.parameters.map((_, i) => (
// // // // //               <div key={i} className={styles.legendItem}>
// // // // //                 <div className={styles.colorBox} style={colorSchemes[colorScheme][`type${i + 1}`]} />
// // // // //                 {`${i + 1}${i + 1 === 1 ? 'st' : i + 1 === 2 ? 'nd' : i + 1 === 3 ? 'rd' : 'th'} parameter type`}
// // // // //               </div>
// // // // //             ))}
// // // // //             <div className={styles.legendItem}>
// // // // //               <div className={styles.colorBox} style={colorSchemes[colorScheme].paramName} />
// // // // //               Parameter names
// // // // //             </div>
// // // // //           </>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   )
// // // // // }


// // // // import React from 'react'
// // // // import styles from './FunctionPrototype.module.css'
// // // // import { colorSchemes } from './FunctionPrototypeColors.js'
// // // // import { processContent } from '@/utils/contentProcessor'

// // // // export default function FunctionPrototype({ prototype, colorScheme = 'default' }) {
// // // //   if (!prototype || !prototype.parameters) {
// // // //     return null;
// // // //   }

// // // //   return (
// // // //     <div className={styles.container}>
// // // //       <div className={styles.function}>
// // // //         <span className={styles.block} style={colorSchemes[colorScheme].returnType}>
// // // //           {prototype.returnType || 'void'}
// // // //         </span>
// // // //         <span className={styles.funcName} style={{color: colorSchemes[colorScheme].funcName}}>
// // // //           {prototype.funcName || 'unnamed'}
// // // //         </span>
// // // //         <span className={styles.coma}>(</span> 
// // // //         {Array.isArray(prototype.parameters) && prototype.parameters.map((param, index) => (
// // // //           <React.Fragment key={index}>
// // // //             <span className={styles.block} style={colorSchemes[colorScheme][`type${index + 1}`]}>
// // // //               {param?.type || 'unknown'}
// // // //             </span>{' '}
// // // //             <span className={styles.block} style={colorSchemes[colorScheme].paramName}>
// // // //               {param?.name || `param${index + 1}`}
// // // //             </span>
// // // //             {index < prototype.parameters.length - 1 ? <span className={styles.coma}>,</span> : ''}
// // // //           </React.Fragment>
// // // //         ))}
// // // //         <span className={styles.coma}>)</span> ;
// // // //       </div>

// // // //       <div className={styles.legend}>
// // // //         <div className={styles.legendItem}>
// // // //           <div className={styles.colorBox} style={colorSchemes[colorScheme].returnType} />
// // // //           Return type
// // // //         </div>
// // // //         {Array.isArray(prototype.parameters) && prototype.parameters.length > 0 && (
// // // //           <>
// // // //             {prototype.parameters.map((_, i) => (
// // // //               <div key={i} className={styles.legendItem}>
// // // //                 <div className={styles.colorBox} style={colorSchemes[colorScheme][`type${i + 1}`]} />
// // // //                 {`${i + 1}${i + 1 === 1 ? 'st' : i + 1 === 2 ? 'nd' : i + 1 === 3 ? 'rd' : 'th'} parameter type`}
// // // //               </div>
// // // //             ))}
// // // //             <div className={styles.legendItem}>
// // // //               <div className={styles.colorBox} style={colorSchemes[colorScheme].paramName} />
// // // //               Parameter names
// // // //             </div>
// // // //           </>
// // // //         )}
// // // //       </div>

// // // //       {prototype.content && (
// // // //         <div className={styles.content}>
// // // //           {processContent(prototype.content)}
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   )
// // // // }


// // // import React from 'react'
// // // import styles from './FunctionPrototype.module.css'
// // // import { colorSchemes } from './FunctionPrototypeColors.js'
// // // import { processContent } from '@/utils/contentProcessor'

// // // export default function FunctionPrototype({ prototype, colorScheme = 'default' }) {
// // //   if (!prototype || !prototype.parameters) return null;

// // //   return (
// // //     <div className={styles.container}>
// // //       <div className={styles.function}>
// // //         <span className={styles.block} style={colorSchemes[colorScheme].returnType}>
// // //           {prototype.returnType || 'void'}
// // //         </span>
// // //         <span className={styles.funcName} style={{color: colorSchemes[colorScheme].funcName}}>
// // //           {prototype.funcName || 'unnamed'}
// // //         </span>
// // //         <span className={styles.coma}>(</span> 
// // //         {Array.isArray(prototype.parameters) && prototype.parameters.map((param, index) => (
// // //           <React.Fragment key={index}>
// // //             <span className={styles.block} style={colorSchemes[colorScheme][`type${index + 1}`]}>
// // //               {param?.type || 'unknown'}
// // //             </span>{' '}
// // //             <span className={styles.block} style={colorSchemes[colorScheme].paramName}>
// // //               {param?.name || `param${index + 1}`}
// // //             </span>
// // //             {index < prototype.parameters.length - 1 ? <span className={styles.coma}>,</span> : ''}
// // //           </React.Fragment>
// // //         ))}
// // //         <span className={styles.coma}>)</span> ;
// // //       </div>

// // //       <div className={styles.legend}>
// // //         <div className={styles.legendItem}>
// // //           <div className={styles.colorBox} style={colorSchemes[colorScheme].returnType} />
// // //           <div>
// // //             <div>Return type</div>
// // //             {prototype.returnTypeExplanation && (
// // //               <div className={styles.explanation}>
// // //                 {processContent(prototype.returnTypeExplanation)}
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>

// // //         {Array.isArray(prototype.parameters) && prototype.parameters.map((param, i) => (
// // //           <React.Fragment key={i}>
// // //             <div className={styles.legendItem}>
// // //               <div className={styles.colorBox} style={colorSchemes[colorScheme][`type${i + 1}`]} />
// // //               <div>
// // //                 <div>{`${i + 1}${i + 1 === 1 ? 'st' : i + 1 === 2 ? 'nd' : i + 1 === 3 ? 'rd' : 'th'} parameter type`}</div>
// // //                 {param.typeExplanation && (
// // //                   <div className={styles.explanation}>
// // //                     {processContent(param.typeExplanation)}
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //             <div className={styles.legendItem}>
// // //               <div className={styles.colorBox} style={colorSchemes[colorScheme].paramName} />
// // //               <div>
// // //                 <div>Parameter name</div>
// // //                 {param.nameExplanation && (
// // //                   <div className={styles.explanation}>
// // //                     {processContent(param.nameExplanation)}
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </React.Fragment>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   )
// // // }


// // import React from 'react'
// // import styles from './FunctionPrototype.module.css'
// // import { colorSchemes } from './FunctionPrototypeColors.js'
// // import { processContent } from '@/utils/contentProcessor'

// // export default function FunctionPrototype({ prototype, colorScheme = 'default' }) {
// //   if (!prototype || !prototype.parameters) return null;

// //   return (
// //     <div className={styles.container}>
// //       <div className={styles.function}>
// //         <span className={styles.block} style={colorSchemes[colorScheme].returnType}>
// //           {prototype.returnType || 'void'}
// //         </span>
// //         <span className={styles.funcName} style={{color: colorSchemes[colorScheme].funcName}}>
// //           {prototype.funcName || 'unnamed'}
// //         </span>
// //         <span className={styles.coma}>(</span> 
// //         {Array.isArray(prototype.parameters) && prototype.parameters.map((param, index) => (
// //           <React.Fragment key={index}>
// //             <span className={styles.block} style={colorSchemes[colorScheme][`type${index + 1}`]}>
// //               {param?.type || 'unknown'}
// //             </span>{' '}
// //             <span className={styles.block} style={colorSchemes[colorScheme].paramName}>
// //               {param?.name || `param${index + 1}`}
// //             </span>
// //             {index < prototype.parameters.length - 1 ? <span className={styles.coma}>,</span> : ''}
// //           </React.Fragment>
// //         ))}
// //         <span className={styles.coma}>)</span> ;
// //       </div>

// //       <div className={styles.legend}>
// //         <div className={styles.legendItem}>
// //           <div className={styles.colorBox} style={colorSchemes[colorScheme].returnType} />
// //           <div>
// //             <div>Return type</div>
// //             {prototype.returnTypeExplanation && (
// //               <div className={styles.explanation}>
// //                 {processContent(prototype.returnTypeExplanation)}
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {Array.isArray(prototype.parameters) && prototype.parameters.map((param, i) => {
// //           const nth = String(i + 1) + (i + 1 === 1 ? 'st' : i + 1 === 2 ? 'nd' : i + 1 === 3 ? 'rd' : 'th');
// //           return (
// //             <React.Fragment key={i}>
// //               <div className={styles.legendItem}>
// //                 <div className={styles.colorBox} style={colorSchemes[colorScheme][`type${i + 1}`]} />
// //                 <div>
// //                   <div>{`${nth} parameter type`}</div>
// //                   {param.typeExplanation && (
// //                     <div className={styles.explanation}>
// //                       {processContent(param.typeExplanation)}
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //               <div className={styles.legendItem}>
// //                 <div className={styles.colorBox} style={colorSchemes[colorScheme].paramName} />
// //                 <div>
// //                   <div>{`${nth} parameter`}</div>
// //                   {param.nameExplanation && (
// //                     <div className={styles.explanation}>
// //                       {processContent(param.nameExplanation)}
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </React.Fragment>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   )
// // }


// import React from 'react'
// import styles from './FunctionPrototype.module.css'
// import { colorSchemes } from './FunctionPrototypeColors.js'
// import { processContent } from '@/utils/contentProcessor'

// export default function FunctionPrototype({ prototype, colorScheme = 'default' }) {
//   if (!prototype || !prototype.parameters) return null;

//   return (
//     <div className={styles.container}>
//       <div className={styles.function}>
//         <span className={styles.block} style={colorSchemes[colorScheme].returnType}>
//           {prototype.returnType || 'void'}
//         </span>
//         <span className={styles.funcName} style={{color: colorSchemes[colorScheme].funcName}}>
//           {prototype.funcName || 'unnamed'}
//         </span>
//         <span className={styles.coma}>(</span> 
//         {Array.isArray(prototype.parameters) && prototype.parameters.map((param, index) => (
//           <React.Fragment key={index}>
//             <span className={styles.block} style={colorSchemes[colorScheme][`type${index + 1}`]}>
//               {param?.type || 'unknown'}
//             </span>{' '}
//             <span className={styles.block} style={colorSchemes[colorScheme].paramName}>
//               {param?.name || `param${index + 1}`}
//             </span>
//             {index < prototype.parameters.length - 1 ? <span className={styles.coma}>,</span> : ''}
//           </React.Fragment>
//         ))}
//         <span className={styles.coma}>)</span> ;
//       </div>

//       <div className={styles.legend}>
//         <div className={styles.legendItem}>
//           <div className={styles.colorBox} style={colorSchemes[colorScheme].returnType} />
//           <div>
//             <div>Return type</div>
//             {prototype.returnTypeExplanation && (
//               <div className={styles.explanation}>
//                 {processContent(prototype.returnTypeExplanation)}
//               </div>
//             )}
//           </div>
//         </div>

//         {Array.isArray(prototype.parameters) && prototype.parameters.map((param, i) => {
//           const nth = String(i + 1) + (i + 1 === 1 ? 'st' : i + 1 === 2 ? 'nd' : i + 1 === 3 ? 'rd' : 'th');
//           return (
//             <React.Fragment key={i}>
//               <div className={styles.legendItem}>
//                 <div className={styles.colorBox} style={colorSchemes[colorScheme][`type${i + 1}`]} />
//                 <div>
//                   <div>{`${nth} parameter type`}</div>
//                   {param.typeExplanation && (
//                     <div className={styles.explanation}>
//                       {processContent(param.typeExplanation)}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className={styles.legendItem}>
//                 <div className={styles.colorBox} style={colorSchemes[colorScheme].paramName} />
//                 <div>
//                   <div>{`${nth} parameter`}</div>
//                   {param.nameExplanation && (
//                     <div className={styles.explanation}>
//                       {processContent(param.nameExplanation)}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </React.Fragment>
//           );
//         })}
//       </div>
//     </div>
//   )
// }

// import React from 'react'
// import styles from './FunctionPrototype.module.css'
// import { colorSchemes } from './FunctionPrototypeColors.js'
// import { processContent } from '@/utils/contentProcessor'

// export default function FunctionPrototype({ prototype, colorScheme = 'default' }) {
//   if (!prototype || !prototype.parameters) return null;

//   const getOrdinalSuffix = (i) => {
//     const nth = String(i + 1) + (i + 1 === 1 ? 'st' : i + 1 === 2 ? 'nd' : i + 1 === 3 ? 'rd' : 'th');
//     return nth;
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.function}>
//         <span className={styles.block} style={colorSchemes[colorScheme].returnType}>
//           {prototype.returnType || 'void'}
//         </span>
//         <span className={styles.funcName} style={{color: colorSchemes[colorScheme].funcName}}>
//           {prototype.funcName || 'unnamed'}
//         </span>
//         <span className={styles.coma}>(</span> 
//         {Array.isArray(prototype.parameters) && prototype.parameters.map((param, index) => (
//           <React.Fragment key={index}>
//             <span className={styles.block} style={colorSchemes[colorScheme][`type${index + 1}`]}>
//               {param?.type || 'unknown'}
//             </span>{' '}
//             <span className={styles.block} style={colorSchemes[colorScheme].paramName}>
//               {param?.name || `param${index + 1}`}
//             </span>
//             {index < prototype.parameters.length - 1 ? <span className={styles.coma}>,</span> : ''}
//           </React.Fragment>
//         ))}
//         <span className={styles.coma}>)</span> ;
//       </div>

//       <div className={styles.legendContainer}>
//         {/* <h3 className={styles.legendTitle}>Function Details</h3> */}
//         <div className={styles.legend}>
//           <div className={styles.legendGroup}>
//             <div className={styles.legendItem}>
//               <div className={styles.colorBox} style={colorSchemes[colorScheme].returnType} />
//               <div className={styles.legendContent}>
//                 <h4 className={styles.itemTitle}>Return Type</h4>
//                 {prototype.returnTypeExplanation && (
//                   <div className={styles.explanation}>
//                     {processContent(prototype.returnTypeExplanation)}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {Array.isArray(prototype.parameters) && prototype.parameters.map((param, i) => (
//             <div key={i} className={styles.legendGroup}>
//               <div className={styles.legendItem}>
//                 <div className={styles.colorBox} style={colorSchemes[colorScheme][`type${i + 1}`]} />
//                 <div className={styles.legendContent}>
//                   <h4 className={styles.itemTitle}>{`${getOrdinalSuffix(i)} Parameter Type`}</h4>
//                   {param.typeExplanation && (
//                     <div className={styles.explanation}>
//                       {processContent(param.typeExplanation)}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className={styles.legendItem}>
//                 <div className={styles.colorBox} style={colorSchemes[colorScheme].paramName} />
//                 <div className={styles.legendContent}>
//                   <h4 className={styles.itemTitle}>{`${getOrdinalSuffix(i)} Parameter`}</h4>
//                   {param.nameExplanation && (
//                     <div className={styles.explanation}>
//                       {processContent(param.nameExplanation)}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }


import React from 'react'
import styles from './FunctionPrototype.module.css'
import { colorSchemes } from './FunctionPrototypeColors.js'
import { processContent } from '@/utils/contentProcessor'
import { typeExplanations } from './types'

export default function FunctionPrototype({ prototype, colorScheme = 'default' }) {
 if (!prototype || !prototype.parameters) return null;

 const getOrdinalSuffix = (i) => {
   const nth = String(i + 1) + (i + 1 === 1 ? 'st' : i + 1 === 2 ? 'nd' : i + 1 === 3 ? 'rd' : 'th');
   return nth;
 };

 return (
   <div className={styles.container}>
     <div className={styles.function}>
       <span className={styles.block} style={colorSchemes[colorScheme].returnType}>
         {prototype.returnType || 'void'}
        
       </span>
      
       <span className={styles.funcName} style={{color: colorSchemes[colorScheme].funcName}}>
         {prototype.funcName || 'unnamed'}
       </span>
       <span className={styles.coma}>(</span> 
       {Array.isArray(prototype.parameters) && prototype.parameters.map((param, index) => (
         <React.Fragment key={index}>
           <span className={styles.block} style={colorSchemes[colorScheme][`type${index + 1}`]}>
             {param?.type || 'unknown'}
           </span>{' '}
           <span className={styles.block} style={colorSchemes[colorScheme].paramName}>
             {param?.name || `param${index + 1}`}
           </span>
           {index < prototype.parameters.length - 1 ? <span className={styles.coma}>,</span> : ''}
         </React.Fragment>
       ))}
       <span className={styles.coma}>)</span> ;
     </div>

     <div className={styles.legendContainer}>
       <div className={styles.legend}>
         <div className={styles.legendGroup}>
           <div className={styles.legendItem}>
             <div className={styles.colorBox} style={colorSchemes[colorScheme].returnType} />
             <div className={styles.legendContent}>
               <h4 className={styles.itemTitle}>Return Type :{'  '+prototype.returnType}</h4>
               <div className={styles.explanation}>
                 {processContent(typeExplanations[prototype.returnType] || `Type ${prototype.returnType} #tab:parameters#`)}
                 
                 {/* {processContent(`\n [Read More](!/c-programming/${prototype.returnType})`)} */}
               </div>
               <div className={styles.linkedNote}>
                 {processContent(`Read about #tab:return# values of <span style='font-weight:bold;'>${prototype.funcName}</span> function .`)}

               </div>
             </div>
           </div>
         </div>

         {Array.isArray(prototype.parameters) && prototype.parameters.map((param, i) => (
           <div key={i} className={styles.legendGroup}>
             <div className={styles.legendItem}>
               <div className={styles.colorBox} style={colorSchemes[colorScheme][`type${i + 1}`]} />
               <div className={styles.legendContent}>
                 <h4 className={styles.itemTitle}>{`${getOrdinalSuffix(i)} Parameter Type : ${param.type}`}</h4>
                 <div className={styles.explanation}>
                   {processContent(typeExplanations[param.type] || `Type ${param.type} #tab:parameters#`)}
                 </div>
               </div>
             </div>
             <div className={styles.legendItem}>
               <div className={styles.colorBox} style={colorSchemes[colorScheme].paramName} />
               <div className={styles.legendContent}>
                 <h4 className={styles.itemTitle}>{`${getOrdinalSuffix(i)} Parameter`}</h4>
                 {param.nameExplanation && (
                   <div className={styles.explanation}>
                     {processContent(param.nameExplanation)}
                   </div>
                 )}
               </div>
             </div>
           </div>
         ))}
       </div>
     </div>
   </div>
 )
}