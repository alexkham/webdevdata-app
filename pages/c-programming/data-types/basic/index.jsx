// // // // // import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// // // // // import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
// // // // // import React from 'react'

// // // // // export default function BasicDataTypesPage() {
// // // // //   return (
// // // // //     <>
// // // // //     
// // // // //     <br/>
// // // // //     <br/>
// // // // //     <br/>
// // // // //     <Breadcrumb/>
// // // // //     <h1>Basic Data Types in C language</h1>

// // // // //     </>
// // // // //   )
// // // // // }


// // // // import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// // // // import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
// // // // import React from 'react'
// // // // import './styles.css'
// // // // import '../../../pages.css'

// // // // export default function BasicDataTypesPage() {
// // // //   const tableData = {
// // // //     headers: [
// // // //       { text: 'Signed', description: 'Negative and positive' },
// // // //       { text: 'Unsigned', description: 'Only non-negative' }
// // // //     ],
// // // //     rows: [
// // // //       {
// // // //         modifier: 'No Length',
// // // //         description: 'Default sizes: int(32), char(8), float(32), double(64)',
// // // //         cells: [
// // // //           [
// // // //             { text: 'int', tooltip: '32-bit signed integer' },
// // // //             { text: 'char', tooltip: '8-bit signed character' },
// // // //             { text: 'float', tooltip: 'Single precision float' },
// // // //             { text: 'double', tooltip: 'Double precision float' },
// // // //             { text: 'void', tooltip: 'No type' }
// // // //           ],
// // // //           [
// // // //             { text: 'unsigned int', tooltip: '32-bit unsigned integer' },
// // // //             { text: 'unsigned char', tooltip: '8-bit unsigned character' }
// // // //           ]
// // // //         ]
// // // //       },
// // // //       {
// // // //         modifier: 'short',
// // // //         description: 'For 16-bit integers',
// // // //         cells: [
// // // //           [{ text: 'short int', tooltip: '16-bit signed integer' }],
// // // //           [{ text: 'unsigned short int', tooltip: '16-bit unsigned integer' }]
// // // //         ]
// // // //       },
// // // //       {
// // // //         modifier: 'long',
// // // //         description: 'For extended size integers/doubles',
// // // //         cells: [
// // // //           [
// // // //             { text: 'long int', tooltip: '32/64-bit signed integer' },
// // // //             { text: 'long double', tooltip: 'Extended precision float' }
// // // //           ],
// // // //           [{ text: 'unsigned long int', tooltip: '32/64-bit unsigned integer' }]
// // // //         ]
// // // //       }
// // // //     ]
// // // //   };

// // // //   return (
// // // //     <>
// // // //       
// // // //       <br/>
// // // //       <br/>
      
// // // //           <Breadcrumb/>
// // // //       <h1 className='title' style={{marginTop:'-40px', marginBottom:'-30px'}}>Basic Data Types in C language</h1>
      
// // // //       <div className="variable-table">
// // // //         <table>
// // // //           <thead>
// // // //             <tr>
// // // //               <th style={{ width: 180 }}>
// // // //                 Length/Sign
// // // //               </th>
// // // //               {tableData.headers.map((header, index) => (
// // // //                 <th key={index} className="scope-col">
// // // //                   {header.text}<br />
// // // //                   <span className="small">{header.description}</span>
// // // //                 </th>
// // // //               ))}
// // // //             </tr>
// // // //           </thead>
// // // //           <tbody>
// // // //             {tableData.rows.map((row, rowIndex) => (
// // // //               <tr key={rowIndex}>
// // // //                 <td className="scope-col">
// // // //                   {row.modifier}<br />
// // // //                   <span className="small">{row.description}</span>
// // // //                 </td>
// // // //                 {row.cells.map((cell, cellIndex) => (
// // // //                   <td key={cellIndex}>
// // // //                     {cell === 'N/A' ? (
// // // //                       <span className="na">N/A</span>
// // // //                     ) : (
// // // //                       cell.map((type, typeIndex) => (
// // // //                         <div key={typeIndex} className="modifier">
// // // //                           <span className="text">{type.text}</span>
// // // //                           <div className="tooltip">{type.tooltip}</div>
// // // //                         </div>
// // // //                       ))
// // // //                     )}
// // // //                   </td>
// // // //                 ))}
// // // //               </tr>
// // // //             ))}
// // // //           </tbody>
// // // //         </table>
// // // //       </div>
// // // //     </>
// // // //   )
// // // // }

// // // import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// // // import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
// // // import React from 'react'
// // // import '../../variables/styles.css'
// // // import '../../../pages.css'
// // // import './styles.css'

// // // export default function BasicDataTypesPage() {
// // //   return (
// // //     <>
// // //       
// // //       <br/>
// // //       <br/>
// // //       <br/>
// // //       <Breadcrumb/>
// // //       <h1 className='title' style={{marginTop:'-40px', marginBottom:'-30px'}}>Basic Data Types in C language</h1>
      
// // //       <div className="variable-table">
// // //         <table>
// // //           <thead>
// // //             <tr>
// // //               <th style={{ width: 180 }}>Length/Sign</th>
// // //               <th className="scope-col">
// // //                 Negative and positive
// // //               </th>
// // //               <th className="scope-col">
// // //                 Only non-negative
// // //               </th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             <tr>
// // //               <td className="scope-col">
// // //                 No Length<br/>
// // //                 <span className="small">Default sizes: int(32), char(8), float(32), double(64)</span>
// // //               </td>
// // //               <td>
// // //                 <div className="modifier">
// // //                   <span className="text">int</span>
// // //                   <div className="tooltip">32-bit signed integer</div>
// // //                 </div>
// // //                 <div className="modifier">
// // //                   <span className="text">char</span>
// // //                   <div className="tooltip">8-bit signed character</div>
// // //                 </div>
// // //                 <div className="modifier">
// // //                   <span className="text">float</span>
// // //                   <div className="tooltip">Single precision float</div>
// // //                 </div>
// // //                 <div className="modifier">
// // //                   <span className="text">double</span>
// // //                   <div className="tooltip">Double precision float</div>
// // //                 </div>
// // //                 <div className="modifier">
// // //                   <span className="text">void</span>
// // //                   <div className="tooltip">No type</div>
// // //                 </div>
// // //               </td>
// // //               <td>
// // //                 <div className="modifier">
// // //                   <span className="text">unsigned int</span>
// // //                   <div className="tooltip">32-bit unsigned integer</div>
// // //                 </div>
// // //                 <div className="modifier">
// // //                   <span className="text">unsigned char</span>
// // //                   <div className="tooltip">8-bit unsigned character</div>
// // //                 </div>
// // //               </td>
// // //             </tr>
// // //             <tr>
// // //               <td className="scope-col">
// // //                 short<br/>
// // //                 <span className="small">For 16-bit integers</span>
// // //               </td>
// // //               <td>
// // //                 <div className="modifier">
// // //                   <span className="text">short int</span>
// // //                   <div className="tooltip">16-bit signed integer</div>
// // //                 </div>
// // //               </td>
// // //               <td>
// // //                 <div className="modifier">
// // //                   <span className="text">unsigned short int</span>
// // //                   <div className="tooltip">16-bit unsigned integer</div>
// // //                 </div>
// // //               </td>
// // //             </tr>
// // //             <tr>
// // //               <td className="scope-col">
// // //                 long<br/>
// // //                 <span className="small">For extended size integers/doubles</span>
// // //               </td>
// // //               <td>
// // //                 <div className="modifier">
// // //                   <span className="text">long int</span>
// // //                   <div className="tooltip">32/64-bit signed integer</div>
// // //                 </div>
// // //                 <div className="modifier">
// // //                   <span className="text">long double</span>
// // //                   <div className="tooltip">Extended precision float</div>
// // //                 </div>
// // //               </td>
// // //               <td>
// // //                 <div className="modifier">
// // //                   <span className="text">unsigned long int</span>
// // //                   <div className="tooltip">32/64-bit unsigned integer</div>
// // //                 </div>
// // //               </td>
// // //             </tr>
// // //           </tbody>
// // //         </table>
// // //       </div>
// // //     </>
// // //   )
// // // }

// // import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// // import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
// // import React from 'react'
// // import './styles.css'
// // import '../../../pages.css'
// // import '../../variables/styles.css'

// // export default function BasicDataTypesPage() {
// //   const tableData = {
// //     headers: [
// //       { text: 'Signed', description: 'Negative and positive' },
// //       { text: 'Unsigned', description: 'Only non-negative' }
// //     ],
// //     rows: [
// //       {
// //         modifier: 'No Length',
// //         description: 'Default sizes: int(32), char(8), float(32), double(64)',
// //         cells: [
// //           [
// //             { text: 'int', tooltip: '32-bit signed integer' },
// //             { text: 'char', tooltip: '8-bit signed character' },
// //             { text: 'float', tooltip: 'Single precision float' },
// //             { text: 'double', tooltip: 'Double precision float' },
// //             { text: 'void', tooltip: 'No type' }
// //           ],
// //           [
// //             { text: 'unsigned int', tooltip: '32-bit unsigned integer' },
// //             { text: 'unsigned char', tooltip: '8-bit unsigned character' }
// //           ]
// //         ]
// //       },
// //       {
// //         modifier: 'short',
// //         description: 'For 16-bit integers',
// //         cells: [
// //           [{ text: 'short int', tooltip: '16-bit signed integer' }],
// //           [{ text: 'unsigned short int', tooltip: '16-bit unsigned integer' }]
// //         ]
// //       },
// //       {
// //         modifier: 'long',
// //         description: 'For extended size integers/doubles',
// //         cells: [
// //           [
// //             { text: 'long int', tooltip: '32/64-bit signed integer' },
// //             { text: 'long double', tooltip: 'Extended precision float' }
// //           ],
// //           [{ text: 'unsigned long int', tooltip: '32/64-bit unsigned integer' }]
// //         ]
// //       }
// //     ]
// //   };

// //   return (
// //     <>
// //       
// //       <br/>
// //       <br/>
// //       <br/>
// //       <Breadcrumb/>
// //       <h1 className='title' style={{marginTop:'-40px', marginBottom:'-30px'}}>Basic Data Types in C language</h1>
      
// //       <div className="variable-table">
// //         <table>
// //           <thead>
// //             <tr>
// //               <th style={{ width: 180 }}>Length/Sign</th>
// //               {tableData.headers.map((header, index) => (
// //                 <th key={index} className="scope-col">
// //                   {header.text}<br />
// //                   <span className="small">{header.description}</span>
// //                 </th>
// //               ))}
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {tableData.rows.map((row, rowIndex) => (
// //               <tr key={rowIndex}>
// //                 <td className="scope-col">
// //                   {row.modifier}<br />
// //                   <span className="small">{row.description}</span>
// //                 </td>
// //                 {row.cells.map((cell, cellIndex) => (
// //                   <td key={cellIndex}>
// //                     {cell === 'N/A' ? (
// //                       <span className="na">N/A</span>
// //                     ) : (
// //                       cell.map((type, typeIndex) => (
// //                         <div key={typeIndex} className="modifier">
// //                           <span className="text">{type.text}</span>
// //                           <div className="tooltip">{type.tooltip}</div>
// //                         </div>
// //                       ))
// //                     )}
// //                   </td>
// //                 ))}
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </>
// //   )
// // }


// import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
// import MyNavbar2 from '@/app/components/nav-bar/MyNavbar2'
// import React from 'react'

// import ContentBlock from '@/app/components/page-components/ContentBlock'
// import NavigationButtons from '@/app/components/page-components/NavigationButtons'
// import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
// import './styles.css'
// import '../../../pages.css'
// import '../../variables/styles.css'

// export default function BasicDataTypesPage() {
//   const tableData = {
//     headers: [
//       { text: 'Signed', description: 'Negative and positive' },
//       { text: 'Unsigned', description: 'Only non-negative' }
//     ],
//     rows: [
//       {
//         modifier: 'No Length',
//         description: 'Default sizes: int(32), char(8), float(32), double(64)',
//         cells: [
//           [
//             { text: 'int', tooltip: '32-bit signed integer', link: '#int' },
//             { text: 'char', tooltip: '8-bit signed character', link: '#char' },
//             { text: 'float', tooltip: 'Single precision float', link: '#float' },
//             { text: 'double', tooltip: 'Double precision float', link: '#double' },
//             { text: 'void', tooltip: 'No type', link: '#void' }
//           ],
//           [
//             { text: 'unsigned int', tooltip: '32-bit unsigned integer', link: '#uint' },
//             { text: 'unsigned char', tooltip: '8-bit unsigned character', link: '#uchar' }
//           ]
//         ]
//       },
//       {
//         modifier: 'short',
//         description: 'For 16-bit integers',
//         cells: [
//           [{ text: 'short int', tooltip: '16-bit signed integer', link: '#short' }],
//           [{ text: 'unsigned short int', tooltip: '16-bit unsigned integer', link: '#ushort' }]
//         ]
//       },
//       {
//         modifier: 'long',
//         description: 'For extended size integers/doubles',
//         cells: [
//           [
//             { text: 'long int', tooltip: '32/64-bit signed integer', link: '#long' },
//             { text: 'long double', tooltip: 'Extended precision float', link: '#ldouble' }
//           ],
//           [{ text: 'unsigned long int', tooltip: '32/64-bit unsigned integer', link: '#ulong' }]
//         ]
//       }
//     ]
//   };

//   return (
//     <>
//       
//       <br/>
//       <br/>
//       <br/>
//       <Breadcrumb/>
//       <h1 className='title' style={{marginTop:'-40px', marginBottom:'-30px'}}>Basic Data Types in C language</h1>
      
//       <div className="variable-table">
//         <table>
//           <thead>
//             <tr>
//               <th style={{ width: 180 }}>Length/Sign</th>
//               {tableData.headers.map((header, index) => (
//                 <th key={index} className="scope-col">
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
//                   {row.modifier}<br />
//                   <span className="small">{row.description}</span>
//                 </td>
//                 {row.cells.map((cell, cellIndex) => (
//                   <td key={cellIndex}>
//                     {cell === 'N/A' ? (
//                       <span className="na">N/A</span>
//                     ) : (
//                       cell.map((type, typeIndex) => (
//                         <div key={typeIndex} className="modifier">
//                           <a href={type.link} style={{ textDecoration: 'none', color: 'inherit' }}>
//                             <span className="text">{type.text}</span>
//                             <div className="tooltip">{type.tooltip}</div>
//                           </a>
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

//       <div id="types" className="variable-section">
//         <br/>
//         <br/>
//         <h2>Basic Types in C</h2>
//         <p className='section-content'>
//           C provides several fundamental data types that serve as building blocks for more complex types. 
//           These types define how data is stored and manipulated at the lowest level.
//         </p>

//         <ContentBlock 
//           id="int"
//           content="**Integer (int)**: The basic integer type, typically 32 bits. Stores whole numbers from -2,147,483,648 to 2,147,483,647. Default signed allows both positive and negative values."
//           boxed={true}
//           color="gray"
//         />
//         <br/>
        
//         <ContentBlock 
//           id="uint"
//           content="**Unsigned Integer**: Modified int that only stores non-negative values from 0 to 4,294,967,295. Uses the sign bit for value, doubling the positive range."
//           boxed={true}
//           color="gray"
//         />
//         <br/>

//         <ContentBlock 
//           id="char"
//           content="**Character (char)**: 8-bit type for storing single characters or small integers. Signed range -128 to 127. Commonly used for ASCII characters and byte values."
//           boxed={true}
//           color="gray"
//         />
//         <br/>

//         <ContentBlock 
//           id="uchar"
//           content="**Unsigned Character**: 8-bit type storing values 0 to 255. Often used for byte manipulations and when full positive range is needed."
//           boxed={true}
//           color="gray"
//         />
//         <br/>

//         <ContentBlock 
//           id="float"
//           content="**Float**: Single-precision floating-point type (32 bits). Stores decimal numbers with approximately 7 digits of precision. Always signed."
//           boxed={true}
//           color="gray"
//         />
//         <br/>

//         <ContentBlock 
//           id="double"
//           content="**Double**: Double-precision floating-point type (64 bits). Stores decimal numbers with approximately 15-17 digits of precision. Always signed."
//           boxed={true}
//           color="gray"
//         />
//         <br/>

//         <ContentBlock 
//           id="short"
//           content="**Short Integer**: Smaller integer type, typically 16 bits. Range -32,768 to 32,767. Used when memory conservation is important."
//           boxed={true}
//           color="gray"
//         />
//         <br/>

//         <ContentBlock 
//           id="ushort"
//           content="**Unsigned Short Integer**: 16-bit type storing values 0 to 65,535. Used for small positive numbers when memory is constrained."
//           boxed={true}
//           color="gray"
//         />
//         <br/>

//         <ContentBlock 
//           id="long"
//           content="**Long Integer**: Extended integer type, 32 or 64 bits depending on system. Minimum range -2,147,483,648 to 2,147,483,647."
//           boxed={true}
//           color="gray"
//         />
//         <br/>

//         <ContentBlock 
//           id="ulong"
//           content="**Unsigned Long Integer**: Extended unsigned type, storing only non-negative values. Minimum range 0 to 4,294,967,295."
//           boxed={true}
//           color="gray"
//         />
//         <br/>

//         <ContentBlock 
//           id="ldouble"
//           content="**Long Double**: Extended precision floating-point type. Size and precision are platform dependent but typically larger than double."
//           boxed={true}
//           color="gray"
//         />
//         <br/>

//         <ContentBlock 
//           id="void"
//           content="**Void**: Special type representing no type. Used for functions that return nothing and generic pointers. Cannot declare variables of void type."
//           boxed={true}
//           color="gray"
//         />
//         <br/>
//       </div>

//       <NavigationButtons nextLink="#modifiers" />
//       <br/>
//       <br/>
//       <br/>
//       <ScrollUpButton/>
//     </>
//   )
// }


import Breadcrumb from '@/app/components/breadcrumb/Breadcrumb'
import React from 'react'

import ContentBlock from '@/app/components/page-components/ContentBlock'
import NavigationButtons from '@/app/components/page-components/NavigationButtons'
import ScrollUpButton from '@/app/components/scroll-up-button/ScrollUpButton'
import './styles.css'
import '../../../pages.css'
import '../../variables/styles.css'
// import './new.css'
import { processContent } from '@/utils/contentProcessor'


export default function BasicDataTypesPage() {
  const tableData = {
    headers: [
      { text: 'Signed', description: 'Negative and positive' },
      { text: 'Unsigned', description: 'Only non-negative' }
    ],
    rows: [
      {
        modifier: 'No Length',
        description: 'Default sizes: int(32), char(8), float(32), double(64)',
        cells: [
          [
            { text: 'int', tooltip: '32-bit signed integer', link: '#basic-type-int' },
            { text: 'char', tooltip: '8-bit signed character', link: '#basic-type-char' },
            { text: 'float', tooltip: 'Single precision float', link: '#basic-type-float' },
            { text: 'double', tooltip: 'Double precision float', link: '#basic-type-double' },
            { text: 'void', tooltip: 'No type', link: '#basic-type-void' }
          ],
          [
            { text: 'unsigned int', tooltip: '32-bit unsigned integer', link: '#basic-type-unsigned-int' },
            { text: 'unsigned char', tooltip: '8-bit unsigned character', link: '#basic-type-unsigned-char' }
          ]
        ]
      },
      {
        modifier: 'short',
        description: 'For 16-bit integers',
        cells: [
          [{ text: 'short int', tooltip: '16-bit signed integer', link: '#basic-type-short-int' }],
          [{ text: 'unsigned short int', tooltip: '16-bit unsigned integer', link: '#basic-type-unsigned-short-int' }]
        ]
      },
      {
        modifier: 'long',
        description: 'For extended size integers/doubles',
        cells: [
          [
            { text: 'long int', tooltip: '32/64-bit signed integer', link: '#basic-type-long-int' },
            { text: 'long double', tooltip: 'Extended precision float', link: '#basic-type-long-double' }
          ],
          [{ text: 'unsigned long int', tooltip: '32/64-bit unsigned integer', link: '#basic-type-unsigned-long-int' }]
        ]
      },
      {
        modifier: 'long long',
        description: '64-bit',
        cells: [
          [{ text: 'long long int', tooltip: '64-bit signed integer' ,link:'#long-long-int'}],
          [{ text: 'unsigned long long int', tooltip: '64-bit unsigned integer',link:'#unsigned-long-long-int' }]
        ]
      }
    ]
  };

  const tableExplanation=`
    The table outlines C language primitive data types and their modifiers.
    The key feature is the systematic way the table shows how four primitive types (int, char, float, double) can be modified with length and sign qualifiers to create different variations with specific memory sizes and value ranges. 
    The signed/unsigned distinction is just one aspect of this broader classification system.
    The main axis shows how the basic types (int, char, float, double, void) can be modified using length qualifiers (short, long, long long) and sign qualifiers (signed/unsigned). The left column categorizes these by bit length, from default sizes through 16-bit (short), extended size (long), to 64-bit (long long). 
    Hover over and click on each specific data type to read more.
    
  `

const voidRemark=`
   * The [void](!/c-programming/data-types/basic#basic-type-void) type is not signed or unsigned because it doesn't represent a value at all. This type in C is a special type used to indicate no data.
`

const charRemark=`
    ** [char](!/c-programming/data-types/basic#basic-type-char) can be either signed or unsigned by default, depending on the platform or compiler.
    If you need to ensure signedness, use signed char or unsigned char.
`

const int=`
    The int type in C is the most widely used core type for working with whole numbers. It is the first go-to for most numeric operations—flexible, reliable, and simple. 
    By default, it’s signed, meaning it can handle both positive and negative values, making it versatile for most tasks.
    In terms of size, int is typically 4 bytes (32 bits) on modern systems, but keep in mind that its size can vary depending on the platform. For instance, it could be 2 bytes on older 16-bit systems. This variability means you should always be mindful when writing cross-platform code.
   
    **General Properties**:
    •Usually 32 bits (4 bytes) on modern systems;
    •Default signed (-2,147,483,648 to 2,147,483,647);
    •Can be unsigned (0 to 4,294,967,295);

    @[int]@ **is perfect for everyday use cases like**:
    **Counting**: Keeping track of loops, iterations, or indices,size measurements and Error codes.
    **Arithmetic**: Adding, subtracting, or doing any kind of number crunching.
    **Flags**: Representing states or options with small values.
   
    **Best practices**:
    •Use for general integer arithmetic
    •Prefer over other types unless specific size needed
    •Check for overflow in critical calculations
    •Consider unsigned for array sizes/positive-only values
    •When working with int, always check its actual size on the target platform

    The int type in C is at the core of understanding how other primitive types function. It serves as the reference point for variations like short, long, and unsigned. These are all essentially just tweaks to int—adjusting its size or the way it handles positive and negative values. For instance, short gives you a smaller range to save memory, while unsigned drops negatives altogether to double the positive range.

But the importance of int goes beyond its relation to other primitive types. It’s deeply tied to how more complex types like pointers, arrays, and structs operate. For example, when working with arrays, the size and indexing of elements are typically handled using int. Similarly, when you pass a pointer to a function, it’s often an int pointer when dealing with numeric data. Even structures, which are used to create complex data models, often contain int members as fields to represent quantities, counters, or status codes.

In many ways, int is the building block that bridges the gap between primitive simplicity and the complexity of higher-level constructs. By mastering its properties—its size, range, signedness, and behavior—you’re laying a solid foundation for understanding how data is stored, accessed, and manipulated in C. Whether it’s managing an array of integers or navigating a memory block with pointers, a firm grasp of int will make everything else much clearer. It’s not just a type—it’s a fundamental part of how C works.
`
  const char=`
    The char type in C is the smallest data type, typically occupying 1 byte (8 bits). It is primarily designed to store characters (like letters, digits, or symbols) using their corresponding numeric values in character encoding standards like ASCII. However, it can also be used as a small integer type due to its numerical representation.
  `

  const float=`
    
  `
  const double=`
    
  `

  const voidContent=`
    
  `

  const modifiedSvg=`
    
<svg aria-roledescription="flowchart-v2" role="graphics-document document" viewBox="0 0 1123.3958740234375 370" style="max-width: 1123.3958740234375px;" class="flowchart" xmlns="http://www.w3.org/2000/svg" width="100%" id="export-svg"><style xmlns="http://www.w3.org/1999/xhtml">@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"); p {margin: 0;}</style><style>#export-svg{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:14px;fill:#000000;}#export-svg .error-icon{fill:#552222;}#export-svg .error-text{fill:#552222;stroke:#552222;}#export-svg .edge-thickness-normal{stroke-width:1px;}#export-svg .edge-thickness-thick{stroke-width:3.5px;}#export-svg .edge-pattern-solid{stroke-dasharray:0;}#export-svg .edge-thickness-invisible{stroke-width:0;fill:none;}#export-svg .edge-pattern-dashed{stroke-dasharray:3;}#export-svg .edge-pattern-dotted{stroke-dasharray:2;}#export-svg .marker{fill:#666;stroke:#666;}#export-svg .marker.cross{stroke:#666;}#export-svg svg{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:14px;}#export-svg p{margin:0;}#export-svg .label{font-family:"trebuchet ms",verdana,arial,sans-serif;color:#000000;}#export-svg .cluster-label text{fill:#333;}#export-svg .cluster-label span{color:#333;}#export-svg .cluster-label span p{background-color:transparent;}#export-svg .label text,#export-svg span{fill:#000000;color:#000000;}#export-svg .node rect,#export-svg .node circle,#export-svg .node ellipse,#export-svg .node polygon,#export-svg .node path{fill:#eee;stroke:#999;stroke-width:1px;}#export-svg .rough-node .label text,#export-svg .node .label text,#export-svg .image-shape .label,#export-svg .icon-shape .label{text-anchor:middle;}#export-svg .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#export-svg .rough-node .label,#export-svg .node .label,#export-svg .image-shape .label,#export-svg .icon-shape .label{text-align:center;}#export-svg .node.clickable{cursor:pointer;}#export-svg .root .anchor path{fill:#666!important;stroke-width:0;stroke:#666;}#export-svg .arrowheadPath{fill:#333333;}#export-svg .edgePath .path{stroke:#666;stroke-width:2.0px;}#export-svg .flowchart-link{stroke:#666;fill:none;}#export-svg .edgeLabel{background-color:white;text-align:center;}#export-svg .edgeLabel p{background-color:white;}#export-svg .edgeLabel rect{opacity:0.5;background-color:white;fill:white;}#export-svg .labelBkg{background-color:rgba(255, 255, 255, 0.5);}#export-svg .cluster rect{fill:hsl(0, 0%, 98.9215686275%);stroke:#707070;stroke-width:1px;}#export-svg .cluster text{fill:#333;}#export-svg .cluster span{color:#333;}#export-svg div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:12px;background:hsl(-160, 0%, 93.3333333333%);border:1px solid #707070;border-radius:2px;pointer-events:none;z-index:100;}#export-svg .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#000000;}#export-svg rect.text{fill:none;stroke-width:0;}#export-svg .icon-shape,#export-svg .image-shape{background-color:white;text-align:center;}#export-svg .icon-shape p,#export-svg .image-shape p{background-color:white;padding:2px;}#export-svg .icon-shape rect,#export-svg .image-shape rect{opacity:0.5;background-color:white;fill:white;}#export-svg .node .neo-node{stroke:#999;}#export-svg [data-look="neo"].node rect,#export-svg [data-look="neo"].cluster rect,#export-svg [data-look="neo"].node polygon{stroke:url(#export-svg-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#export-svg [data-look="neo"].node rect,#export-svg [data-look="neo"].node polygon,#export-svg [data-look="neo"].node path{stroke:url(#export-svg-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#export-svg [data-look="neo"].node .neo-line path{stroke:hsl(0, 0%, 83.3333333333%);filter:none;}#export-svg [data-look="neo"].node circle{stroke:url(#export-svg-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#export-svg [data-look="neo"].node circle .state-start{fill:#000000;}#export-svg [data-look="neo"].statediagram-cluster rect{fill:#eee;stroke:url(#export-svg-gradient);stroke-width:1px;}#export-svg [data-look="neo"].icon-shape .icon{fill:url(#export-svg-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#export-svg [data-look="neo"].icon-shape .icon-neo path{stroke:url(#export-svg-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#export-svg :root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}</style><g><marker orient="auto" markerHeight="8" markerWidth="8" markerUnits="userSpaceOnUse" refY="5" refX="5" viewBox="0 0 10 10" class="marker flowchart-v2" id="export-svg_flowchart-v2-pointEnd"><path style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 0 0 L 10 5 L 0 10 z"/></marker><marker orient="auto" markerHeight="8" markerWidth="8" markerUnits="userSpaceOnUse" refY="5" refX="4.5" viewBox="0 0 10 10" class="marker flowchart-v2" id="export-svg_flowchart-v2-pointStart"><path style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 0 5 L 10 10 L 10 0 z"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5" refX="11" viewBox="0 0 10 10" class="marker flowchart-v2" id="export-svg_flowchart-v2-circleEnd"><circle style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" r="5" cy="5" cx="5"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5" refX="-1" viewBox="0 0 10 10" class="marker flowchart-v2" id="export-svg_flowchart-v2-circleStart"><circle style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" r="5" cy="5" cx="5"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5.2" refX="12" viewBox="0 0 11 11" class="marker cross flowchart-v2" id="export-svg_flowchart-v2-crossEnd"><path style="stroke-width: 2; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 1,1 l 9,9 M 10,1 l -9,9"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5.2" refX="-1" viewBox="0 0 11 11" class="marker cross flowchart-v2" id="export-svg_flowchart-v2-crossStart"><path style="stroke-width: 2; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 1,1 l 9,9 M 10,1 l -9,9"/></marker><g class="root"><g class="clusters"/><g class="edgePaths"><path marker-end="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6NjIzLjI2MzAyMzM3NjQ2NDgsInkiOjM4Ljc3MjIzNDA5NDk5ODc3fSx7IngiOjMwMi40NjM1NDY3NTI5Mjk3LCJ5Ijo4NH0seyJ4IjozMDIuNDYzNTQ2NzUyOTI5NywieSI6MTA5fV0=" data-id="L_INT_LQ_0" data-et="edge" data-edge="true" style="" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_INT_LQ_0" d="M623.2630233764648,38.77223409499877L308.65234314840444,83.12747540128714Q302.4635467529297,84 302.4635467529297,90.25L302.4635467529297,96.5L302.4635467529297,105"/><path marker-end="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6Njk4LjA1NDY4NzUsInkiOjQxLjUzNjAzNjY0ODQxMzU3fSx7IngiOjg5NS42NjE0NTcwNjE3Njc2LCJ5Ijo4NH0seyJ4Ijo4OTUuNjYxNDU3MDYxNzY3NiwieSI6MTA5fV0=" data-id="L_INT_SQ_1" data-et="edge" data-edge="true" style="" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_INT_SQ_1" d="M698.0546875,41.53603664841357L889.5509510580238,82.68690579994771Q895.6614570617676,84 895.6614570617676,90.25L895.6614570617676,96.5L895.6614570617676,105"/><path marker-end="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6MjE5LjU0MTY3MTc1MjkyOTcsInkiOjE1My45MzY5NzU0NzQ2NTk0OH0seyJ4Ijo4Ny4wMjA4MzU4NzY0NjQ4NCwieSI6MTg1fSx7IngiOjg3LjAyMDgzNTg3NjQ2NDg0LCJ5IjoyMTB9XQ==" data-id="L_LQ_Short_2" data-et="edge" data-edge="true" style="" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_LQ_Short_2" d="M219.5416717529297,153.93697547465948L93.10590258325168,183.5736539080733Q87.02083587646484,185 87.02083587646484,191.25L87.02083587646484,197.5L87.02083587646484,206"/><path marker-end="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6MzAyLjQ2MzU0Njc1MjkyOTcsInkiOjE2MH0seyJ4IjozMDIuNDYzNTQ2NzUyOTI5NywieSI6MTg1fSx7IngiOjMwMi40NjM1NDY3NTI5Mjk3LCJ5IjoyMTB9XQ==" data-id="L_LQ_Long_3" data-et="edge" data-edge="true" style="" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_LQ_Long_3" d="M302.4635467529297,160L302.4635467529297,185L302.4635467529297,197.5L302.4635467529297,206"/><path marker-end="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6Mzg1LjM4NTQyMTc1MjkyOTcsInkiOjE1Mi44NDMwMDMwMzMzMjE0Mn0seyJ4Ijo1MzAuNzU1MjEwODc2NDY0OCwieSI6MTg1fSx7IngiOjUzMC43NTUyMTA4NzY0NjQ4LCJ5IjoyMTB9XQ==" data-id="L_LQ_LongLong_4" data-et="edge" data-edge="true" style="" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_LQ_LongLong_4" d="M385.3854217529297,152.84300303332142L524.652734257158,183.65008181328852Q530.7552108764648,185 530.7552108764648,191.25L530.7552108764648,197.5L530.7552108764648,206"/><path marker-end="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6ODMzLjQ1NTIzODY0NDQzOTQsInkiOjE2MH0seyJ4Ijo3NzIuNDY4NzUsInkiOjE4NX0seyJ4Ijo3NzIuNDY4NzUsInkiOjIxMH1d" data-id="L_SQ_Signed_5" data-et="edge" data-edge="true" style="" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_SQ_Signed_5" d="M833.4552386444394,160L778.2517228494748,182.62940407866793Q772.46875,185 772.46875,191.25L772.46875,197.5L772.46875,206"/><path marker-end="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6OTU3Ljg2NzY3NTQ3OTA5NTcsInkiOjE2MH0seyJ4IjoxMDE4Ljg1NDE2NDEyMzUzNTIsInkiOjE4NX0seyJ4IjoxMDE4Ljg1NDE2NDEyMzUzNTIsInkiOjIxMH1d" data-id="L_SQ_Unsigned_6" data-et="edge" data-edge="true" style="" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_SQ_Unsigned_6" d="M957.8676754790957,160L1013.0711912740603,182.62940407866793Q1018.8541641235352,185 1018.8541641235352,191.25L1018.8541641235352,197.5L1018.8541641235352,206"/><path marker-end="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6ODcuMDIwODM1ODc2NDY0ODQsInkiOjI2MX0seyJ4Ijo4Ny4wMjA4MzU4NzY0NjQ4NCwieSI6Mjg2fSx7IngiOjg3LjAyMDgzNTg3NjQ2NDg0LCJ5IjozMTF9XQ==" data-id="L_Short_ShortInt_7" data-et="edge" data-edge="true" style="" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_Short_ShortInt_7" d="M87.02083587646484,261L87.02083587646484,286L87.02083587646484,298.5L87.02083587646484,307"/><path marker-end="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6MzAyLjQ2MzU0Njc1MjkyOTcsInkiOjI2MX0seyJ4IjozMDIuNDYzNTQ2NzUyOTI5NywieSI6Mjg2fSx7IngiOjMwMi40NjM1NDY3NTI5Mjk3LCJ5IjozMTF9XQ==" data-id="L_Long_LongInt_8" data-et="edge" data-edge="true" style="" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_Long_LongInt_8" d="M302.4635467529297,261L302.4635467529297,286L302.4635467529297,298.5L302.4635467529297,307"/><path marker-end="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6NTMwLjc1NTIxMDg3NjQ2NDgsInkiOjI2MX0seyJ4Ijo1MzAuNzU1MjEwODc2NDY0OCwieSI6Mjg2fSx7IngiOjUzMC43NTUyMTA4NzY0NjQ4LCJ5IjozMTF9XQ==" data-id="L_LongLong_LLongInt_9" data-et="edge" data-edge="true" style="" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_LongLong_LLongInt_9" d="M530.7552108764648,261L530.7552108764648,286L530.7552108764648,298.5L530.7552108764648,307"/><path marker-end="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6NzcyLjQ2ODc1LCJ5IjoyNjF9LHsieCI6NzcyLjQ2ODc1LCJ5IjoyODZ9LHsieCI6NzcyLjQ2ODc1LCJ5IjozMTF9XQ==" data-id="L_Signed_SignedInt_10" data-et="edge" data-edge="true" style="" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_Signed_SignedInt_10" d="M772.46875,261L772.46875,286L772.46875,298.5L772.46875,307"/><path marker-end="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6MTAxOC44NTQxNjQxMjM1MzUyLCJ5IjoyNjF9LHsieCI6MTAxOC44NTQxNjQxMjM1MzUyLCJ5IjoyODZ9LHsieCI6MTAxOC44NTQxNjQxMjM1MzUyLCJ5IjozMTF9XQ==" data-id="L_Unsigned_UnsignedInt_11" data-et="edge" data-edge="true" style="" class="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_Unsigned_UnsignedInt_11" d="M1018.8541641235352,261L1018.8541641235352,286L1018.8541641235352,298.5L1018.8541641235352,307"/></g><g class="edgeLabels"><g class="edgeLabel"><g transform="translate(0, 0)" data-id="L_INT_LQ_0" class="label"><foreignObject height="0" width="0"><div class="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" data-id="L_INT_SQ_1" class="label"><foreignObject height="0" width="0"><div class="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" data-id="L_LQ_Short_2" class="label"><foreignObject height="0" width="0"><div class="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" data-id="L_LQ_Long_3" class="label"><foreignObject height="0" width="0"><div class="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" data-id="L_LQ_LongLong_4" class="label"><foreignObject height="0" width="0"><div class="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" data-id="L_SQ_Signed_5" class="label"><foreignObject height="0" width="0"><div class="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" data-id="L_SQ_Unsigned_6" class="label"><foreignObject height="0" width="0"><div class="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" data-id="L_Short_ShortInt_7" class="label"><foreignObject height="0" width="0"><div class="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" data-id="L_Long_LongInt_8" class="label"><foreignObject height="0" width="0"><div class="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" data-id="L_LongLong_LLongInt_9" class="label"><foreignObject height="0" width="0"><div class="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" data-id="L_Signed_SignedInt_10" class="label"><foreignObject height="0" width="0"><div class="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="edgeLabel"></span></div></foreignObject></g></g><g class="edgeLabel"><g transform="translate(0, 0)" data-id="L_Unsigned_UnsignedInt_11" class="label"><foreignObject height="0" width="0"><div class="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="edgeLabel"></span></div></foreignObject></g></g></g><g class="nodes"><g transform="translate(660.6588554382324, 33.5)" data-look="neo" data-et="node" data-node="true" data-id="INT" id="flowchart-INT-558" class="node default"><rect stroke="url(#gradient)" height="51" width="74.7916669845581" y="-25.5" x="-37.39583349227905" data-id="INT" style="" class="basic label-container"/><g transform="translate(-7.395833492279053, -10.5)" style="" class="label"><rect/><foreignObject height="21" width="14.791666984558105"><div xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="nodeLabel"><p>int</p></span></div></foreignObject></g></g><g transform="translate(302.4635467529297, 134.5)" data-look="neo" data-et="node" data-node="true" data-id="LQ" id="flowchart-LQ-559" class="node default"><rect stroke="url(#gradient)" height="51" width="165.84375" y="-25.5" x="-82.921875" data-id="LQ" style="" class="basic label-container"/><g transform="translate(-52.921875, -10.5)" style="" class="label"><rect/><foreignObject height="21" width="105.84375"><div xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="nodeLabel"><p>Length Qualifiers</p></span></div></foreignObject></g></g><g transform="translate(895.6614570617676, 134.5)" data-look="neo" data-et="node" data-node="true" data-id="SQ" id="flowchart-SQ-561" class="node default"><rect stroke="url(#gradient)" height="51" width="151.0416717529297" y="-25.5" x="-75.52083587646484" data-id="SQ" style="" class="basic label-container"/><g transform="translate(-45.520835876464844, -10.5)" style="" class="label"><rect/><foreignObject height="21" width="91.04167175292969"><div xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="nodeLabel"><p>Sign Qualifiers</p></span></div></foreignObject></g></g><g transform="translate(87.02083587646484, 235.5)" data-look="neo" data-et="node" data-node="true" data-id="Short" id="flowchart-Short-563" class="node default"><rect stroke="url(#gradient)" height="51" width="93.46875" y="-25.5" x="-46.734375" data-id="Short" style="" class="basic label-container"/><g transform="translate(-16.734375, -10.5)" style="" class="label"><rect/><foreignObject height="21" width="33.46875"><div xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="nodeLabel"><p>Short</p></span></div></foreignObject></g></g><g transform="translate(302.4635467529297, 235.5)" data-look="neo" data-et="node" data-node="true" data-id="Long" id="flowchart-Long-565" class="node default"><rect stroke="url(#gradient)" height="51" width="91.14583396911621" y="-25.5" x="-45.572916984558105" data-id="Long" style="" class="basic label-container"/><g transform="translate(-15.572916984558105, -10.5)" style="" class="label"><rect/><foreignObject height="21" width="31.14583396911621"><div xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="nodeLabel"><p>Long</p></span></div></foreignObject></g></g><g transform="translate(530.7552108764648, 235.5)" data-look="neo" data-et="node" data-node="true" data-id="LongLong" id="flowchart-LongLong-567" class="node default"><rect stroke="url(#gradient)" height="51" width="126.1875" y="-25.5" x="-63.09375" data-id="LongLong" style="" class="basic label-container"/><g transform="translate(-33.09375, -10.5)" style="" class="label"><rect/><foreignObject height="21" width="66.1875"><div xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="nodeLabel"><p>Long Long</p></span></div></foreignObject></g></g><g transform="translate(772.46875, 235.5)" data-look="neo" data-et="node" data-node="true" data-id="Signed" id="flowchart-Signed-569" class="node default"><rect stroke="url(#gradient)" height="51" width="103.59375" y="-25.5" x="-51.796875" data-id="Signed" style="" class="basic label-container"/><g transform="translate(-21.796875, -10.5)" style="" class="label"><rect/><foreignObject height="21" width="43.59375"><div xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="nodeLabel"><p>Signed</p></span></div></foreignObject></g></g><g transform="translate(1018.8541641235352, 235.5)" data-look="neo" data-et="node" data-node="true" data-id="Unsigned" id="flowchart-Unsigned-571" class="node default"><rect stroke="url(#gradient)" height="51" width="119.15625" y="-25.5" x="-59.578125" data-id="Unsigned" style="" class="basic label-container"/><g transform="translate(-29.578125, -10.5)" style="" class="label"><rect/><foreignObject height="21" width="59.15625"><div xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="nodeLabel"><p>Unsigned</p></span></div></foreignObject></g></g><g transform="translate(87.02083587646484, 336.5)" data-look="neo" data-et="node" data-node="true" data-id="ShortInt" id="flowchart-ShortInt-573" class="node default"><rect stroke="url(#gradient)" height="51" width="158.0416717529297" y="-25.5" x="-79.02083587646484" data-id="ShortInt" style="" class="basic label-container"/><g transform="translate(-49.020835876464844, -10.5)" style="" class="label"><rect/><foreignObject height="21" width="98.04167175292969"><div xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="nodeLabel"><p>short int (16-bit)</p></span></div></foreignObject></g></g><g transform="translate(302.4635467529297, 336.5)" data-look="neo" data-et="node" data-node="true" data-id="LongInt" id="flowchart-LongInt-575" class="node default"><rect stroke="url(#gradient)" height="51" width="172.84375" y="-25.5" x="-86.421875" data-id="LongInt" style="" class="basic label-container"/><g transform="translate(-56.421875, -10.5)" style="" class="label"><rect/><foreignObject height="21" width="112.84375"><div xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="nodeLabel"><p>long int (32/64-bit)</p></span></div></foreignObject></g></g><g transform="translate(530.7552108764648, 336.5)" data-look="neo" data-et="node" data-node="true" data-id="LLongInt" id="flowchart-LLongInt-577" class="node default"><rect stroke="url(#gradient)" height="51" width="183.73958587646484" y="-25.5" x="-91.86979293823242" data-id="LLongInt" style="" class="basic label-container"/><g transform="translate(-61.86979293823242, -10.5)" style="" class="label"><rect/><foreignObject height="21" width="123.73958587646484"><div xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="nodeLabel"><p>long long int (64-bit)</p></span></div></foreignObject></g></g><g transform="translate(772.46875, 336.5)" data-look="neo" data-et="node" data-node="true" data-id="SignedInt" id="flowchart-SignedInt-579" class="node default"><rect stroke="url(#gradient)" height="51" width="199.6875" y="-25.5" x="-99.84375" data-id="SignedInt" style="" class="basic label-container"/><g transform="translate(-69.84375, -10.5)" style="" class="label"><rect/><foreignObject height="21" width="139.6875"><div xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="nodeLabel"><p>signed int (-2B to +2B)</p></span></div></foreignObject></g></g><g transform="translate(1018.8541641235352, 336.5)" data-look="neo" data-et="node" data-node="true" data-id="UnsignedInt" id="flowchart-UnsignedInt-581" class="node default"><rect stroke="url(#gradient)" height="51" width="193.08334350585938" y="-25.5" x="-96.54167175292969" data-id="UnsignedInt" style="" class="basic label-container"/><g transform="translate(-66.54167175292969, -10.5)" style="" class="label"><rect/><foreignObject height="21" width="133.08334350585938"><div xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; white-space: normal; line-height: 1.5; max-width: 200px; text-align: center;"><span class="nodeLabel"><p>unsigned int (0 to 4B)</p></span></div></foreignObject></g></g></g></g></g><linearGradient y2="0%" x2="100%" y1="0%" x1="0%" gradientUnits="objectBoundingBox" id="export-svg-gradient"><stop stop-opacity="1" stop-color="hsl(0, 0%, 83.3333333333%)" offset="0%"/><stop stop-opacity="1" stop-color="hsl(0, 0%, 88.9215686275%)" offset="100%"/></linearGradient></svg>
  `
// const tableData = {
//     headers: [
//       { text: 'Signed', description: 'Negative and positive' },
//       { text: 'Unsigned', description: 'Only non-negative' }
//     ],
//     rows: [
//       {
//         modifier: 'No Length',
//         description: '32-bit typically',
//         cells: [
//           [
//             { text: 'int', tooltip: '32-bit signed integer' },
//             { text: 'char', tooltip: '8-bit signed character' },
//             { text: 'float', tooltip: 'Single precision float' },
//             { text: 'double', tooltip: 'Double precision float' },
//             { text: 'void', tooltip: 'No type' }
//           ],
//           [
//             { text: 'unsigned int', tooltip: '32-bit unsigned integer' },
//             { text: 'unsigned char', tooltip: '8-bit unsigned character' }
//           ]
//         ]
//       },
//       {
//         modifier: 'short',
//         description: '16-bit typically',
//         cells: [
//           [{ text: 'short int', tooltip: '16-bit signed integer' }],
//           [{ text: 'unsigned short int', tooltip: '16-bit unsigned integer' }]
//         ]
//       },
//       {
//         modifier: 'long',
//         description: '32/64-bit',
//         cells: [
//           [
//             { text: 'long int', tooltip: '32/64-bit signed integer' },
//             { text: 'long double', tooltip: 'Extended precision float' }
//           ],
//           [{ text: 'unsigned long int', tooltip: '32/64-bit unsigned integer' }]
//         ]
//       },
//       {
//         modifier: 'long long',
//         description: '64-bit',
//         cells: [
//           [{ text: 'long long int', tooltip: '64-bit signed integer' }],
//           [{ text: 'unsigned long long int', tooltip: '64-bit unsigned integer' }]
//         ]
//       }
//     ]
//   };

return (
    <>
      
      <br/>
      <br/>
      <br/>
      <Breadcrumb/>
      <h1 className='title' style={{marginTop:'-40px', marginBottom:'-30px'}}>Basic Data Types in C language</h1>
      <div className='table-container'>
      <div className="variable-table" style={{marginTop:'0px'}} >
        <table>
          <thead>
            <tr>
              <th style={{ width: 180 }}>Length/Sign</th>
              {tableData.headers.map((header, index) => (
                <th key={index} className="scope-col">
                  {header.text}<br />
                  <span className="small">{header.description}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="scope-col">
                  {row.modifier}<br />
                  <span className="small">{row.description}</span>
                </td>
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    {cell === 'N/A' ? (
                      <span className="na">N/A</span>
                    ) : (
                      cell.map((type, typeIndex) => (
                        <div key={typeIndex} className="modifier">
                          <a href={type.link}>
                            <span className="text code-type">{type.text}</span>
                            <div className="tooltip">{type.tooltip}</div>
                          </a>
                        </div>
                      ))
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>       
           
      <span >{processContent(voidRemark)}</span>
      <span >{processContent(charRemark)}</span>
    
      </div>
     
      <div style={{width:'90%',marginRight:'30px'}}>
      <ContentBlock 
          id="none"
          content={tableExplanation}
          boxed={true}
          color="gray"
         
        />
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <div id="types" className="variable-section">
        <br/>
        <br/>
        <h2>Basic Types in C</h2>
        <p className='section-content'>
          C programming language provides several fundamental data types that serve as building blocks for more complex types. 
          They define how data is stored and manipulated at the lowest level.
        </p>

        <ContentBlock 
          id="basic-type-int"
          content={int}
          boxed={true}
          color="gray"
         
        />
        <svg aria-roledescription="flowchart-v2" role="graphics-document document" viewBox="0 0 1123.3958740234375 370" style={{width:'70%', maxWidth: '1123.3958740234375px'}} className="flowchart" xmlns="http://www.w3.org/2000/svg" width="100%" id="export-svg"><style xmlns="http://www.w3.org/1999/xhtml" dangerouslySetInnerHTML={{__html: "@import url(\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css\"); p {margin: 0;}" }} /><style dangerouslySetInnerHTML={{__html: "#export-svg{font-family:\"trebuchet ms\",verdana,arial,sans-serif;font-size:14px;fill:#000000;}#export-svg .error-icon{fill:#552222;}#export-svg .error-text{fill:#552222;stroke:#552222;}#export-svg .edge-thickness-normal{stroke-width:1px;}#export-svg .edge-thickness-thick{stroke-width:3.5px;}#export-svg .edge-pattern-solid{stroke-dasharray:0;}#export-svg .edge-thickness-invisible{stroke-width:0;fill:none;}#export-svg .edge-pattern-dashed{stroke-dasharray:3;}#export-svg .edge-pattern-dotted{stroke-dasharray:2;}#export-svg .marker{fill:#666;stroke:#666;}#export-svg .marker.cross{stroke:#666;}#export-svg svg{font-family:\"trebuchet ms\",verdana,arial,sans-serif;font-size:14px;}#export-svg p{margin:0;}#export-svg .label{font-family:\"trebuchet ms\",verdana,arial,sans-serif;color:#000000;}#export-svg .cluster-label text{fill:#333;}#export-svg .cluster-label span{color:#333;}#export-svg .cluster-label span p{background-color:transparent;}#export-svg .label text,#export-svg span{fill:#000000;color:#000000;}#export-svg .node rect,#export-svg .node circle,#export-svg .node ellipse,#export-svg .node polygon,#export-svg .node path{fill:#eee;stroke:#999;stroke-width:1px;}#export-svg .rough-node .label text,#export-svg .node .label text,#export-svg .image-shape .label,#export-svg .icon-shape .label{text-anchor:middle;}#export-svg .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#export-svg .rough-node .label,#export-svg .node .label,#export-svg .image-shape .label,#export-svg .icon-shape .label{text-align:center;}#export-svg .node.clickable{cursor:pointer;}#export-svg .root .anchor path{fill:#666!important;stroke-width:0;stroke:#666;}#export-svg .arrowheadPath{fill:#333333;}#export-svg .edgePath .path{stroke:#666;stroke-width:2.0px;}#export-svg .flowchart-link{stroke:#666;fill:none;}#export-svg .edgeLabel{background-color:white;text-align:center;}#export-svg .edgeLabel p{background-color:white;}#export-svg .edgeLabel rect{opacity:0.5;background-color:white;fill:white;}#export-svg .labelBkg{background-color:rgba(255, 255, 255, 0.5);}#export-svg .cluster rect{fill:hsl(0, 0%, 98.9215686275%);stroke:#707070;stroke-width:1px;}#export-svg .cluster text{fill:#333;}#export-svg .cluster span{color:#333;}#export-svg div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:\"trebuchet ms\",verdana,arial,sans-serif;font-size:12px;background:hsl(-160, 0%, 93.3333333333%);border:1px solid #707070;border-radius:2px;pointer-events:none;z-index:100;}#export-svg .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#000000;}#export-svg rect.text{fill:none;stroke-width:0;}#export-svg .icon-shape,#export-svg .image-shape{background-color:white;text-align:center;}#export-svg .icon-shape p,#export-svg .image-shape p{background-color:white;padding:2px;}#export-svg .icon-shape rect,#export-svg .image-shape rect{opacity:0.5;background-color:white;fill:white;}#export-svg .node .neo-node{stroke:#999;}#export-svg [data-look=\"neo\"].node rect,#export-svg [data-look=\"neo\"].cluster rect,#export-svg [data-look=\"neo\"].node polygon{stroke:url(#export-svg-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#export-svg [data-look=\"neo\"].node rect,#export-svg [data-look=\"neo\"].node polygon,#export-svg [data-look=\"neo\"].node path{stroke:url(#export-svg-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#export-svg [data-look=\"neo\"].node .neo-line path{stroke:hsl(0, 0%, 83.3333333333%);filter:none;}#export-svg [data-look=\"neo\"].node circle{stroke:url(#export-svg-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#export-svg [data-look=\"neo\"].node circle .state-start{fill:#000000;}#export-svg [data-look=\"neo\"].statediagram-cluster rect{fill:#eee;stroke:url(#export-svg-gradient);stroke-width:1px;}#export-svg [data-look=\"neo\"].icon-shape .icon{fill:url(#export-svg-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#export-svg [data-look=\"neo\"].icon-shape .icon-neo path{stroke:url(#export-svg-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#export-svg :root{--mermaid-font-family:\"trebuchet ms\",verdana,arial,sans-serif;}" }} /><g><marker orient="auto" markerHeight={8} markerWidth={8} markerUnits="userSpaceOnUse" refY={5} refX={5} viewBox="0 0 10 10" className="marker flowchart-v2" id="export-svg_flowchart-v2-pointEnd"><path style={{strokeWidth: 1, strokeDasharray: '1, 0'}} className="arrowMarkerPath" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker orient="auto" markerHeight={8} markerWidth={8} markerUnits="userSpaceOnUse" refY={5} refX="4.5" viewBox="0 0 10 10" className="marker flowchart-v2" id="export-svg_flowchart-v2-pointStart"><path style={{strokeWidth: 1, strokeDasharray: '1, 0'}} className="arrowMarkerPath" d="M 0 5 L 10 10 L 10 0 z" /></marker><marker orient="auto" markerHeight={11} markerWidth={11} markerUnits="userSpaceOnUse" refY={5} refX={11} viewBox="0 0 10 10" className="marker flowchart-v2" id="export-svg_flowchart-v2-circleEnd"><circle style={{strokeWidth: 1, strokeDasharray: '1, 0'}} className="arrowMarkerPath" r={5} cy={5} cx={5} /></marker><marker orient="auto" markerHeight={11} markerWidth={11} markerUnits="userSpaceOnUse" refY={5} refX={-1} viewBox="0 0 10 10" className="marker flowchart-v2" id="export-svg_flowchart-v2-circleStart"><circle style={{strokeWidth: 1, strokeDasharray: '1, 0'}} className="arrowMarkerPath" r={5} cy={5} cx={5} /></marker><marker orient="auto" markerHeight={11} markerWidth={11} markerUnits="userSpaceOnUse" refY="5.2" refX={12} viewBox="0 0 11 11" className="marker cross flowchart-v2" id="export-svg_flowchart-v2-crossEnd"><path style={{strokeWidth: 2, strokeDasharray: '1, 0'}} className="arrowMarkerPath" d="M 1,1 l 9,9 M 10,1 l -9,9" /></marker><marker orient="auto" markerHeight={11} markerWidth={11} markerUnits="userSpaceOnUse" refY="5.2" refX={-1} viewBox="0 0 11 11" className="marker cross flowchart-v2" id="export-svg_flowchart-v2-crossStart"><path style={{strokeWidth: 2, strokeDasharray: '1, 0'}} className="arrowMarkerPath" d="M 1,1 l 9,9 M 10,1 l -9,9" /></marker><g className="root"><g className="clusters" /><g className="edgePaths"><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6NjIzLjI2MzAyMzM3NjQ2NDgsInkiOjM4Ljc3MjIzNDA5NDk5ODc3fSx7IngiOjMwMi40NjM1NDY3NTI5Mjk3LCJ5Ijo4NH0seyJ4IjozMDIuNDYzNTQ2NzUyOTI5NywieSI6MTA5fV0=" data-id="L_INT_LQ_0" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_INT_LQ_0" d="M623.2630233764648,38.77223409499877L308.65234314840444,83.12747540128714Q302.4635467529297,84 302.4635467529297,90.25L302.4635467529297,96.5L302.4635467529297,105" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6Njk4LjA1NDY4NzUsInkiOjQxLjUzNjAzNjY0ODQxMzU3fSx7IngiOjg5NS42NjE0NTcwNjE3Njc2LCJ5Ijo4NH0seyJ4Ijo4OTUuNjYxNDU3MDYxNzY3NiwieSI6MTA5fV0=" data-id="L_INT_SQ_1" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_INT_SQ_1" d="M698.0546875,41.53603664841357L889.5509510580238,82.68690579994771Q895.6614570617676,84 895.6614570617676,90.25L895.6614570617676,96.5L895.6614570617676,105" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6MjE5LjU0MTY3MTc1MjkyOTcsInkiOjE1My45MzY5NzU0NzQ2NTk0OH0seyJ4Ijo4Ny4wMjA4MzU4NzY0NjQ4NCwieSI6MTg1fSx7IngiOjg3LjAyMDgzNTg3NjQ2NDg0LCJ5IjoyMTB9XQ==" data-id="L_LQ_Short_2" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_LQ_Short_2" d="M219.5416717529297,153.93697547465948L93.10590258325168,183.5736539080733Q87.02083587646484,185 87.02083587646484,191.25L87.02083587646484,197.5L87.02083587646484,206" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6MzAyLjQ2MzU0Njc1MjkyOTcsInkiOjE2MH0seyJ4IjozMDIuNDYzNTQ2NzUyOTI5NywieSI6MTg1fSx7IngiOjMwMi40NjM1NDY3NTI5Mjk3LCJ5IjoyMTB9XQ==" data-id="L_LQ_Long_3" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_LQ_Long_3" d="M302.4635467529297,160L302.4635467529297,185L302.4635467529297,197.5L302.4635467529297,206" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6Mzg1LjM4NTQyMTc1MjkyOTcsInkiOjE1Mi44NDMwMDMwMzMzMjE0Mn0seyJ4Ijo1MzAuNzU1MjEwODc2NDY0OCwieSI6MTg1fSx7IngiOjUzMC43NTUyMTA4NzY0NjQ4LCJ5IjoyMTB9XQ==" data-id="L_LQ_LongLong_4" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_LQ_LongLong_4" d="M385.3854217529297,152.84300303332142L524.652734257158,183.65008181328852Q530.7552108764648,185 530.7552108764648,191.25L530.7552108764648,197.5L530.7552108764648,206" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6ODMzLjQ1NTIzODY0NDQzOTQsInkiOjE2MH0seyJ4Ijo3NzIuNDY4NzUsInkiOjE4NX0seyJ4Ijo3NzIuNDY4NzUsInkiOjIxMH1d" data-id="L_SQ_Signed_5" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_SQ_Signed_5" d="M833.4552386444394,160L778.2517228494748,182.62940407866793Q772.46875,185 772.46875,191.25L772.46875,197.5L772.46875,206" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6OTU3Ljg2NzY3NTQ3OTA5NTcsInkiOjE2MH0seyJ4IjoxMDE4Ljg1NDE2NDEyMzUzNTIsInkiOjE4NX0seyJ4IjoxMDE4Ljg1NDE2NDEyMzUzNTIsInkiOjIxMH1d" data-id="L_SQ_Unsigned_6" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_SQ_Unsigned_6" d="M957.8676754790957,160L1013.0711912740603,182.62940407866793Q1018.8541641235352,185 1018.8541641235352,191.25L1018.8541641235352,197.5L1018.8541641235352,206" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6ODcuMDIwODM1ODc2NDY0ODQsInkiOjI2MX0seyJ4Ijo4Ny4wMjA4MzU4NzY0NjQ4NCwieSI6Mjg2fSx7IngiOjg3LjAyMDgzNTg3NjQ2NDg0LCJ5IjozMTF9XQ==" data-id="L_Short_ShortInt_7" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_Short_ShortInt_7" d="M87.02083587646484,261L87.02083587646484,286L87.02083587646484,298.5L87.02083587646484,307" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6MzAyLjQ2MzU0Njc1MjkyOTcsInkiOjI2MX0seyJ4IjozMDIuNDYzNTQ2NzUyOTI5NywieSI6Mjg2fSx7IngiOjMwMi40NjM1NDY3NTI5Mjk3LCJ5IjozMTF9XQ==" data-id="L_Long_LongInt_8" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_Long_LongInt_8" d="M302.4635467529297,261L302.4635467529297,286L302.4635467529297,298.5L302.4635467529297,307" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6NTMwLjc1NTIxMDg3NjQ2NDgsInkiOjI2MX0seyJ4Ijo1MzAuNzU1MjEwODc2NDY0OCwieSI6Mjg2fSx7IngiOjUzMC43NTUyMTA4NzY0NjQ4LCJ5IjozMTF9XQ==" data-id="L_LongLong_LLongInt_9" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_LongLong_LLongInt_9" d="M530.7552108764648,261L530.7552108764648,286L530.7552108764648,298.5L530.7552108764648,307" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6NzcyLjQ2ODc1LCJ5IjoyNjF9LHsieCI6NzcyLjQ2ODc1LCJ5IjoyODZ9LHsieCI6NzcyLjQ2ODc1LCJ5IjozMTF9XQ==" data-id="L_Signed_SignedInt_10" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_Signed_SignedInt_10" d="M772.46875,261L772.46875,286L772.46875,298.5L772.46875,307" /><path markerEnd="url(#export-svg_flowchart-v2-pointEnd)" data-points="W3sieCI6MTAxOC44NTQxNjQxMjM1MzUyLCJ5IjoyNjF9LHsieCI6MTAxOC44NTQxNjQxMjM1MzUyLCJ5IjoyODZ9LHsieCI6MTAxOC44NTQxNjQxMjM1MzUyLCJ5IjozMTF9XQ==" data-id="L_Unsigned_UnsignedInt_11" data-et="edge" data-edge="true" style={{}} className="edge-thickness-normal edge-pattern-solid edge-thickness-normal edge-pattern-solid flowchart-link" id="L_Unsigned_UnsignedInt_11" d="M1018.8541641235352,261L1018.8541641235352,286L1018.8541641235352,298.5L1018.8541641235352,307" /></g><g className="edgeLabels"><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_INT_LQ_0" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_INT_SQ_1" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_LQ_Short_2" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_LQ_Long_3" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_LQ_LongLong_4" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_SQ_Signed_5" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_SQ_Unsigned_6" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_Short_ShortInt_7" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_Long_LongInt_8" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_LongLong_LLongInt_9" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_Signed_SignedInt_10" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g><g className="edgeLabel"><g transform="translate(0, 0)" data-id="L_Unsigned_UnsignedInt_11" className="label"><foreignObject height={0} width={0}><div className="labelBkg" xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="edgeLabel" /></div></foreignObject></g></g></g><g className="nodes"><g transform="translate(660.6588554382324, 33.5)" data-look="neo" data-et="node" data-node="true" data-id="INT" id="flowchart-INT-558" className="node default"><rect stroke="url(#gradient)" height={51} width="74.7916669845581" y="-25.5" x="-37.39583349227905" data-id="INT" style={{}} className="basic label-container" /><g transform="translate(-7.395833492279053, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="14.791666984558105"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>int</p></span></div></foreignObject></g></g><g transform="translate(302.4635467529297, 134.5)" data-look="neo" data-et="node" data-node="true" data-id="LQ" id="flowchart-LQ-559" className="node default"><rect stroke="url(#gradient)" height={51} width="165.84375" y="-25.5" x="-82.921875" data-id="LQ" style={{}} className="basic label-container" /><g transform="translate(-52.921875, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="105.84375"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>Length Qualifiers</p></span></div></foreignObject></g></g><g transform="translate(895.6614570617676, 134.5)" data-look="neo" data-et="node" data-node="true" data-id="SQ" id="flowchart-SQ-561" className="node default"><rect stroke="url(#gradient)" height={51} width="151.0416717529297" y="-25.5" x="-75.52083587646484" data-id="SQ" style={{}} className="basic label-container" /><g transform="translate(-45.520835876464844, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="91.04167175292969"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>Sign Qualifiers</p></span></div></foreignObject></g></g><g transform="translate(87.02083587646484, 235.5)" data-look="neo" data-et="node" data-node="true" data-id="Short" id="flowchart-Short-563" className="node default"><rect stroke="url(#gradient)" height={51} width="93.46875" y="-25.5" x="-46.734375" data-id="Short" style={{}} className="basic label-container" /><g transform="translate(-16.734375, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="33.46875"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>Short</p></span></div></foreignObject></g></g><g transform="translate(302.4635467529297, 235.5)" data-look="neo" data-et="node" data-node="true" data-id="Long" id="flowchart-Long-565" className="node default"><rect stroke="url(#gradient)" height={51} width="91.14583396911621" y="-25.5" x="-45.572916984558105" data-id="Long" style={{}} className="basic label-container" /><g transform="translate(-15.572916984558105, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="31.14583396911621"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>Long</p></span></div></foreignObject></g></g><g transform="translate(530.7552108764648, 235.5)" data-look="neo" data-et="node" data-node="true" data-id="LongLong" id="flowchart-LongLong-567" className="node default"><rect stroke="url(#gradient)" height={51} width="126.1875" y="-25.5" x="-63.09375" data-id="LongLong" style={{}} className="basic label-container" /><g transform="translate(-33.09375, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="66.1875"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>Long Long</p></span></div></foreignObject></g></g><g transform="translate(772.46875, 235.5)" data-look="neo" data-et="node" data-node="true" data-id="Signed" id="flowchart-Signed-569" className="node default"><rect stroke="url(#gradient)" height={51} width="103.59375" y="-25.5" x="-51.796875" data-id="Signed" style={{}} className="basic label-container" /><g transform="translate(-21.796875, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="43.59375"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>Signed</p></span></div></foreignObject></g></g><g transform="translate(1018.8541641235352, 235.5)" data-look="neo" data-et="node" data-node="true" data-id="Unsigned" id="flowchart-Unsigned-571" className="node default"><rect stroke="url(#gradient)" height={51} width="119.15625" y="-25.5" x="-59.578125" data-id="Unsigned" style={{}} className="basic label-container" /><g transform="translate(-29.578125, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="59.15625"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>Unsigned</p></span></div></foreignObject></g></g><g transform="translate(87.02083587646484, 336.5)" data-look="neo" data-et="node" data-node="true" data-id="ShortInt" id="flowchart-ShortInt-573" className="node default"><rect stroke="url(#gradient)" height={51} width="158.0416717529297" y="-25.5" x="-79.02083587646484" data-id="ShortInt" style={{}} className="basic label-container" /><g transform="translate(-49.020835876464844, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="98.04167175292969"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>short int (16-bit)</p></span></div></foreignObject></g></g><g transform="translate(302.4635467529297, 336.5)" data-look="neo" data-et="node" data-node="true" data-id="LongInt" id="flowchart-LongInt-575" className="node default"><rect stroke="url(#gradient)" height={51} width="172.84375" y="-25.5" x="-86.421875" data-id="LongInt" style={{}} className="basic label-container" /><g transform="translate(-56.421875, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="112.84375"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>long int (32/64-bit)</p></span></div></foreignObject></g></g><g transform="translate(530.7552108764648, 336.5)" data-look="neo" data-et="node" data-node="true" data-id="LLongInt" id="flowchart-LLongInt-577" className="node default"><rect stroke="url(#gradient)" height={51} width="183.73958587646484" y="-25.5" x="-91.86979293823242" data-id="LLongInt" style={{}} className="basic label-container" /><g transform="translate(-61.86979293823242, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="123.73958587646484"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>long long int (64-bit)</p></span></div></foreignObject></g></g><g transform="translate(772.46875, 336.5)" data-look="neo" data-et="node" data-node="true" data-id="SignedInt" id="flowchart-SignedInt-579" className="node default"><rect stroke="url(#gradient)" height={51} width="199.6875" y="-25.5" x="-99.84375" data-id="SignedInt" style={{}} className="basic label-container" /><g transform="translate(-69.84375, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="139.6875"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>signed int (-2B to +2B)</p></span></div></foreignObject></g></g><g transform="translate(1018.8541641235352, 336.5)" data-look="neo" data-et="node" data-node="true" data-id="UnsignedInt" id="flowchart-UnsignedInt-581" className="node default"><rect stroke="url(#gradient)" height={51} width="193.08334350585938" y="-25.5" x="-96.54167175292969" data-id="UnsignedInt" style={{}} className="basic label-container" /><g transform="translate(-66.54167175292969, -10.5)" style={{}} className="label"><rect /><foreignObject height={21} width="133.08334350585938"><div xmlns="http://www.w3.org/1999/xhtml" style={{display: 'table-cell', whiteSpace: 'normal', lineHeight: '1.5', maxWidth: 200, textAlign: 'center'}}><span className="nodeLabel"><p>unsigned int (0 to 4B)</p></span></div></foreignObject></g></g></g></g></g><linearGradient y2="0%" x2="100%" y1="0%" x1="0%" gradientUnits="objectBoundingBox" id="export-svg-gradient"><stop stopOpacity={1} stopColor="hsl(0, 0%, 83.3333333333%)" offset="0%" /><stop stopOpacity={1} stopColor="hsl(0, 0%, 88.9215686275%)" offset="100%" /></linearGradient></svg>

        <br/>
        <ContentBlock 
          id="basic-type-char"
          content={char}
          boxed={true}
          color="gray"
        />
        <br/>
        <ContentBlock 
          id="basic-type-float"
          content={float}
          boxed={true}
          color="gray"
        />
        <br/>
        <ContentBlock 
          id="basic-type-double"
          content={double}
          boxed={true}
          color="gray"
        />
        <br/>
        <ContentBlock 
          id="basic-type-void"
          content={voidContent}
          boxed={true}
          color="gray"
        />
        <br/>


        
        <ContentBlock 
          id="basic-type-unsigned-int"
          content="**Unsigned Integer**: Modified int that only stores non-negative values from 0 to 4,294,967,295. Uses the sign bit for value, doubling the positive range."
          boxed={true}
          color="gray"
        />
        <br/>

        
        <ContentBlock 
          id="basic-type-unsigned-char"
          content="**Unsigned Character**: 8-bit type storing values 0 to 255. Often used for byte manipulations and when full positive range is needed."
          boxed={true}
          color="gray"
        />
        <br/>

       

       
        <ContentBlock 
          id="basic-type-short-int"
          content="**Short Integer**: Smaller integer type, typically 16 bits. Range -32,768 to 32,767. Used when memory conservation is important."
          boxed={true}
          color="gray"
        />
        <br/>

        <ContentBlock 
          id="basic-type-unsigned-short-int"
          content="**Unsigned Short Integer**: 16-bit type storing values 0 to 65,535. Used for small positive numbers when memory is constrained."
          boxed={true}
          color="gray"
        />
        <br/>

        <ContentBlock 
          id="basic-type-long-int"
          content="**Long Integer**: Extended integer type, 32 or 64 bits depending on system. Minimum range -2,147,483,648 to 2,147,483,647."
          boxed={true}
          color="gray"
        />
        <br/>

        <ContentBlock 
          id="basic-type-unsigned-long-int"
          content="**Unsigned Long Integer**: Extended unsigned type, storing only non-negative values. Minimum range 0 to 4,294,967,295."
          boxed={true}
          color="gray"
        />
        <br/>

        <ContentBlock 
          id="basic-type-long-double"
          content="**Long Double**: Extended precision floating-point type. Size and precision are platform dependent but typically larger than double."
          boxed={true}
          color="gray"
        />
        <br/>

        
        <ContentBlock 
          id="long-long-int"
          content="long-long-int."
          boxed={true}
          color="gray"
        />
        <br/>
        <ContentBlock 
          id="unsigned-long-long-int"
          content="unsigned-long-long-int"
          boxed={true}
          color="gray"
        />
        <br/>
      </div>

      <NavigationButtons nextLink="#modifiers" />
      <br/>
      <br/>
      <br/>
      <ScrollUpButton/>
    </>
  )
}