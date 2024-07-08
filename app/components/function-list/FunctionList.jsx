// // // // // // // // // // // // // 'use client'
// // // // // // // // // // // // // import React, { useState, useMemo } from 'react';

// // // // // // // // // // // // // const FunctionList = ({ data }) => {
// // // // // // // // // // // // //   const [filter, setFilter] = useState('');
// // // // // // // // // // // // //   const [filterType, setFilterType] = useState('function_name'); // Default filter type

// // // // // // // // // // // // //   // Memoized filtered data
// // // // // // // // // // // // //   const filteredData = useMemo(() => {
// // // // // // // // // // // // //     return data.filter(item =>
// // // // // // // // // // // // //       item[filterType].toString().toLowerCase().includes(filter.toLowerCase())
// // // // // // // // // // // // //     );
// // // // // // // // // // // // //   }, [filter, filterType, data]);

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <div>
// // // // // // // // // // // // //         <p>{data.length}</p>
// // // // // // // // // // // // //       <input
// // // // // // // // // // // // //         type="text"
// // // // // // // // // // // // //         placeholder="Search functions..."
// // // // // // // // // // // // //         value={filter}
// // // // // // // // // // // // //         onChange={(e) => setFilter(e.target.value)}
// // // // // // // // // // // // //       />
// // // // // // // // // // // // //       <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
// // // // // // // // // // // // //         <option value="function_name">Function Name</option>
// // // // // // // // // // // // //         <option value="return_type">Return Type</option>
// // // // // // // // // // // // //         <option value="parameter_types">Parameter Types</option>
// // // // // // // // // // // // //       </select>

// // // // // // // // // // // // //       <ul>
// // // // // // // // // // // // //         {filteredData.map((func, index) => (
// // // // // // // // // // // // //           <li key={index} title={func.description}>
// // // // // // // // // // // // //             {func.function_name}
// // // // // // // // // // // // //           </li>
// // // // // // // // // // // // //         ))}
// // // // // // // // // // // // //       </ul>
// // // // // // // // // // // // //     </div>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // };

// // // // // // // // // // // // // export default FunctionList;
// // // // // // // // // // // // // 'use client'
// // // // // // // // // // // // // import React, { useState, useMemo } from 'react';

// // // // // // // // // // // // // const FunctionList = ({ data }) => {
// // // // // // // // // // // // //   const [filter, setFilter] = useState('');
// // // // // // // // // // // // //   const [filterType, setFilterType] = useState('function_name'); // Default filter type

// // // // // // // // // // // // //   // Memoized filtered data
// // // // // // // // // // // // //   const filteredData = useMemo(() => {
// // // // // // // // // // // // //     return data.filter(item =>
// // // // // // // // // // // // //       item[filterType].toString().toLowerCase().includes(filter.toLowerCase())
// // // // // // // // // // // // //     );
// // // // // // // // // // // // //   }, [filter, filterType, data]);

// // // // // // // // // // // // //   // Reset the filter
// // // // // // // // // // // // //   const handleReset = () => {
// // // // // // // // // // // // //     setFilter('');
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <div>
// // // // // // // // // // // // //       <input
// // // // // // // // // // // // //         type="text"
// // // // // // // // // // // // //         placeholder="Search functions..."
// // // // // // // // // // // // //         value={filter}
// // // // // // // // // // // // //         onChange={(e) => setFilter(e.target.value)}
// // // // // // // // // // // // //       />
// // // // // // // // // // // // //       <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
// // // // // // // // // // // // //         <option value="function_name">Function Name</option>
// // // // // // // // // // // // //         <option value="return_type">Return Type</option>
// // // // // // // // // // // // //         <option value="parameter_types">Parameter Types</option>
// // // // // // // // // // // // //       </select>
// // // // // // // // // // // // //       <button onClick={handleReset}>Reset</button>

// // // // // // // // // // // // //       <ul>
// // // // // // // // // // // // //         {filteredData.map((func, index) => (
// // // // // // // // // // // // //           <li key={index} title={func.description}>
// // // // // // // // // // // // //             {func.function_name}
// // // // // // // // // // // // //             <span className="tooltip">{func.description}</span>
// // // // // // // // // // // // //           </li>
// // // // // // // // // // // // //         ))}
// // // // // // // // // // // // //       </ul>
// // // // // // // // // // // // //       <style jsx>{`
// // // // // // // // // // // // //         .tooltip {
// // // // // // // // // // // // //           visibility: hidden;
// // // // // // // // // // // // //           width: 120px;
// // // // // // // // // // // // //           background-color: black;
// // // // // // // // // // // // //           color: white;
// // // // // // // // // // // // //           text-align: center;
// // // // // // // // // // // // //           border-radius: 6px;
// // // // // // // // // // // // //           padding: 5px 0;
// // // // // // // // // // // // //           position: absolute;
// // // // // // // // // // // // //           z-index: 1;
// // // // // // // // // // // // //         }

// // // // // // // // // // // // //         li:hover .tooltip {
// // // // // // // // // // // // //           visibility: visible;
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //       `}</style>
// // // // // // // // // // // // //     </div>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // };

// // // // // // // // // // // // // export default FunctionList;
// // // // // // // // // // // // 'use client'
// // // // // // // // // // // // import React, { useState, useMemo } from 'react';

// // // // // // // // // // // // const FunctionList = ({ data }) => {
// // // // // // // // // // // //   const [filter, setFilter] = useState('');
// // // // // // // // // // // //   const [filterType, setFilterType] = useState(''); // Default to empty string

// // // // // // // // // // // //   // Memoized filtered data
// // // // // // // // // // // //   const filteredData = useMemo(() => {
// // // // // // // // // // // //     if (!filterType) return data; // If no filter type is selected, return all data
// // // // // // // // // // // //     return data.filter(item =>
// // // // // // // // // // // //       item[filterType].toString().toLowerCase().includes(filter.toLowerCase())
// // // // // // // // // // // //     );
// // // // // // // // // // // //   }, [filter, filterType, data]);

// // // // // // // // // // // //   // Reset the filter and filter type
// // // // // // // // // // // //   const handleReset = () => {
// // // // // // // // // // // //     setFilter('');
// // // // // // // // // // // //     setFilterType('');
// // // // // // // // // // // //   };

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <div>
// // // // // // // // // // // //       <input
// // // // // // // // // // // //         type="text"
// // // // // // // // // // // //         placeholder="Search functions..."
// // // // // // // // // // // //         value={filter}
// // // // // // // // // // // //         onChange={(e) => setFilter(e.target.value)}
// // // // // // // // // // // //       />
// // // // // // // // // // // //       <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
// // // // // // // // // // // //         <option value="">Select filter type</option>
// // // // // // // // // // // //         <option value="function_name">Function Name</option>
// // // // // // // // // // // //         <option value="return_type">Return Type</option>
// // // // // // // // // // // //         <option value="parameter_types">Parameter Types</option>
// // // // // // // // // // // //       </select>
// // // // // // // // // // // //       <button onClick={handleReset}>Reset</button>

// // // // // // // // // // // //       <ul>
// // // // // // // // // // // //         {filteredData.map((func, index) => (
// // // // // // // // // // // //           <li key={index}>
// // // // // // // // // // // //             {func.function_name}
// // // // // // // // // // // //             <span className="tooltip">{func.description}</span>
// // // // // // // // // // // //           </li>
// // // // // // // // // // // //         ))}
// // // // // // // // // // // //       </ul>
// // // // // // // // // // // //       <style jsx>{`
// // // // // // // // // // // //         ul {
// // // // // // // // // // // //           list-style-type: none;
// // // // // // // // // // // //           padding: 0;
// // // // // // // // // // // //         }
// // // // // // // // // // // //         li {
// // // // // // // // // // // //           position: relative;
// // // // // // // // // // // //           padding: 5px;
// // // // // // // // // // // //           cursor: pointer;
// // // // // // // // // // // //         }
// // // // // // // // // // // //         .tooltip {
// // // // // // // // // // // //           visibility: hidden;
// // // // // // // // // // // //           width: 200px;
// // // // // // // // // // // //           background-color: #555;
// // // // // // // // // // // //           color: #fff;
// // // // // // // // // // // //           text-align: center;
// // // // // // // // // // // //           border-radius: 6px;
// // // // // // // // // // // //           padding: 5px;
// // // // // // // // // // // //           position: absolute;
// // // // // // // // // // // //           z-index: 1;
// // // // // // // // // // // //           bottom: 125%;
// // // // // // // // // // // //           left: 50%;
// // // // // // // // // // // //           margin-left: -100px;
// // // // // // // // // // // //           opacity: 0;
// // // // // // // // // // // //           transition: opacity 0.3s;
// // // // // // // // // // // //         }
// // // // // // // // // // // //         .tooltip::after {
// // // // // // // // // // // //           content: "";
// // // // // // // // // // // //           position: absolute;
// // // // // // // // // // // //           top: 100%;
// // // // // // // // // // // //           left: 50%;
// // // // // // // // // // // //           margin-left: -5px;
// // // // // // // // // // // //           border-width: 5px;
// // // // // // // // // // // //           border-style: solid;
// // // // // // // // // // // //           border-color: #555 transparent transparent transparent;
// // // // // // // // // // // //         }
// // // // // // // // // // // //         li:hover .tooltip {
// // // // // // // // // // // //           visibility: visible;
// // // // // // // // // // // //           opacity: 1;
// // // // // // // // // // // //         }
// // // // // // // // // // // //       `}</style>
// // // // // // // // // // // //     </div>
// // // // // // // // // // // //   );
// // // // // // // // // // // // };

// // // // // // // // // // // // export default FunctionList;
// // // // // // // // // // // 'use client'
// // // // // // // // // // // import React, { useState, useMemo } from 'react';

// // // // // // // // // // // const FunctionList = ({ data }) => {
// // // // // // // // // // //   const [filter, setFilter] = useState('');
// // // // // // // // // // //   const [filterType, setFilterType] = useState('');

// // // // // // // // // // //   const filteredData = useMemo(() => {
// // // // // // // // // // //     if (!filterType) return data;
// // // // // // // // // // //     return data.filter(item =>
// // // // // // // // // // //       item[filterType].toString().toLowerCase().includes(filter.toLowerCase())
// // // // // // // // // // //     );
// // // // // // // // // // //   }, [filter, filterType, data]);

// // // // // // // // // // //   const handleReset = () => {
// // // // // // // // // // //     setFilter('');
// // // // // // // // // // //     setFilterType('');
// // // // // // // // // // //   };

// // // // // // // // // // //   return (
// // // // // // // // // // //     <div>
// // // // // // // // // // //       <input
// // // // // // // // // // //         type="text"
// // // // // // // // // // //         placeholder="Search functions..."
// // // // // // // // // // //         value={filter}
// // // // // // // // // // //         onChange={(e) => setFilter(e.target.value)}
// // // // // // // // // // //       />
// // // // // // // // // // //       <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
// // // // // // // // // // //         <option value="">Select filter type</option>
// // // // // // // // // // //         <option value="function_name">Function Name</option>
// // // // // // // // // // //         <option value="return_type">Return Type</option>
// // // // // // // // // // //         <option value="parameter_types">Parameter Types</option>
// // // // // // // // // // //       </select>
// // // // // // // // // // //       <button onClick={handleReset}>Reset</button>

// // // // // // // // // // //       <ul>
// // // // // // // // // // //         {filteredData.map((func, index) => (
// // // // // // // // // // //           <li key={index}>
// // // // // // // // // // //             {func.function_name}
// // // // // // // // // // //             <span className="tooltip">{func.description}</span>
// // // // // // // // // // //           </li>
// // // // // // // // // // //         ))}
// // // // // // // // // // //       </ul>
// // // // // // // // // // //       <style jsx>{`
// // // // // // // // // // //         ul {
// // // // // // // // // // //           list-style-type: none;
// // // // // // // // // // //           padding: 0;
// // // // // // // // // // //         }
// // // // // // // // // // //         li {
// // // // // // // // // // //           position: relative;
// // // // // // // // // // //           padding: 5px;
// // // // // // // // // // //           cursor: pointer;
// // // // // // // // // // //         }
// // // // // // // // // // //         .tooltip {
// // // // // // // // // // //           visibility: hidden;
// // // // // // // // // // //           width: 200px;
// // // // // // // // // // //           background-color: #555;
// // // // // // // // // // //           color: #fff;
// // // // // // // // // // //           text-align: center;
// // // // // // // // // // //           border-radius: 6px;
// // // // // // // // // // //           padding: 5px 5px 10px 5px; /* Added more padding to the bottom */
// // // // // // // // // // //           position: absolute;
// // // // // // // // // // //           z-index: 1;
// // // // // // // // // // //           bottom: 125%;
// // // // // // // // // // //           left: 50%;
// // // // // // // // // // //           margin-left: -100px;
// // // // // // // // // // //           opacity: 0;
// // // // // // // // // // //           transition: opacity 0.3s;
// // // // // // // // // // //         }
// // // // // // // // // // //         li:hover .tooltip {
// // // // // // // // // // //           visibility: visible;
// // // // // // // // // // //           opacity: 1;
// // // // // // // // // // //         }
// // // // // // // // // // //       `}</style>
// // // // // // // // // // //     </div>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // export default FunctionList;
// // // // // // // // // // 'use client'
// // // // // // // // // // import React, { useState, useMemo } from 'react';

// // // // // // // // // // const FunctionList = ({ data }) => {
// // // // // // // // // //   const [filter, setFilter] = useState('');
// // // // // // // // // //   const [filterType, setFilterType] = useState('');

// // // // // // // // // //   const filteredData = useMemo(() => {
// // // // // // // // // //     if (!filterType) return data;
// // // // // // // // // //     return data.filter(item =>
// // // // // // // // // //       item[filterType].toString().toLowerCase().includes(filter.toLowerCase())
// // // // // // // // // //     );
// // // // // // // // // //   }, [filter, filterType, data]);

// // // // // // // // // //   const handleReset = () => {
// // // // // // // // // //     setFilter('');
// // // // // // // // // //     setFilterType('');
// // // // // // // // // //   };

// // // // // // // // // //   return (
// // // // // // // // // //     <div>
// // // // // // // // // //       <input
// // // // // // // // // //         type="text"
// // // // // // // // // //         placeholder="Search functions..."
// // // // // // // // // //         value={filter}
// // // // // // // // // //         onChange={(e) => setFilter(e.target.value)}
// // // // // // // // // //       />
// // // // // // // // // //       <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
// // // // // // // // // //         <option value="">Select filter type</option>
// // // // // // // // // //         <option value="function_name">Function Name</option>
// // // // // // // // // //         <option value="return_type">Return Type</option>
// // // // // // // // // //         <option value="parameter_types">Parameter Types</option>
// // // // // // // // // //       </select>
// // // // // // // // // //       <button onClick={handleReset}>Reset</button>

// // // // // // // // // //       <ul>
// // // // // // // // // //         {filteredData.map((func, index) => (
// // // // // // // // // //           <li key={index}>
// // // // // // // // // //             {func.function_name}
// // // // // // // // // //             <span className="tooltip">{func.description}</span>
// // // // // // // // // //           </li>
// // // // // // // // // //         ))}
// // // // // // // // // //       </ul>
// // // // // // // // // //       <style jsx>{`
// // // // // // // // // //         ul {
// // // // // // // // // //           list-style-type: none;
// // // // // // // // // //           padding: 0;
// // // // // // // // // //         }
// // // // // // // // // //         li {
// // // // // // // // // //           position: relative;
// // // // // // // // // //           padding: 5px;
// // // // // // // // // //           cursor: pointer;
// // // // // // // // // //           margin-bottom: 20px; /* Add space between list items */
// // // // // // // // // //         }
// // // // // // // // // //         .tooltip {
// // // // // // // // // //           visibility: hidden;
// // // // // // // // // //           width: 200px;
// // // // // // // // // //           background-color: #555;
// // // // // // // // // //           color: #fff;
// // // // // // // // // //           text-align: center;
// // // // // // // // // //           border-radius: 6px;
// // // // // // // // // //           padding: 10px;
// // // // // // // // // //           position: absolute;
// // // // // // // // // //           z-index: 1;
// // // // // // // // // //           bottom: 150%; /* Increased to create more space */
// // // // // // // // // //           left: 50%;
// // // // // // // // // //           transform: translateX(-50%);
// // // // // // // // // //           opacity: 0;
// // // // // // // // // //           transition: opacity 0.3s;
// // // // // // // // // //         }
// // // // // // // // // //         li:hover .tooltip {
// // // // // // // // // //           visibility: visible;
// // // // // // // // // //           opacity: 1;
// // // // // // // // // //         }
// // // // // // // // // //       `}</style>
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // export default FunctionList;
// // // // // // // // // 'use client'
// // // // // // // // // import React, { useState, useMemo } from 'react';

// // // // // // // // // const FunctionList = ({ data }) => {
// // // // // // // // //   const [filter, setFilter] = useState('');
// // // // // // // // //   const [filterType, setFilterType] = useState('');

// // // // // // // // //   const filteredData = useMemo(() => {
// // // // // // // // //     if (!filterType) return data;
// // // // // // // // //     return data.filter(item =>
// // // // // // // // //       item[filterType].toString().toLowerCase().includes(filter.toLowerCase())
// // // // // // // // //     );
// // // // // // // // //   }, [filter, filterType, data]);

// // // // // // // // //   const handleReset = () => {
// // // // // // // // //     setFilter('');
// // // // // // // // //     setFilterType('');
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <div>
// // // // // // // // //       <input
// // // // // // // // //         type="text"
// // // // // // // // //         placeholder="Search functions..."
// // // // // // // // //         value={filter}
// // // // // // // // //         onChange={(e) => setFilter(e.target.value)}
// // // // // // // // //       />
// // // // // // // // //       <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
// // // // // // // // //         <option value="">Select filter type</option>
// // // // // // // // //         <option value="function_name">Function Name</option>
// // // // // // // // //         <option value="return_type">Return Type</option>
// // // // // // // // //         <option value="parameter_types">Parameter Types</option>
// // // // // // // // //       </select>
// // // // // // // // //       <button onClick={handleReset}>Reset</button>

// // // // // // // // //       <ul>
// // // // // // // // //         {filteredData.map((func, index) => (
// // // // // // // // //           <li key={index}>
// // // // // // // // //             {func.function_name}
// // // // // // // // //             <span className="tooltip">{func.description}</span>
// // // // // // // // //           </li>
// // // // // // // // //         ))}
// // // // // // // // //       </ul>
// // // // // // // // //       <style jsx>{`
// // // // // // // // //         ul {
// // // // // // // // //           list-style-type: none;
// // // // // // // // //           padding: 0;
// // // // // // // // //         }
// // // // // // // // //         li {
// // // // // // // // //           position: relative;
// // // // // // // // //           padding: 5px;
// // // // // // // // //           cursor: pointer;
// // // // // // // // //         }
// // // // // // // // //         /* .tooltip {
// // // // // // // // //           visibility: hidden;
// // // // // // // // //           width: 250px;
// // // // // // // // //           min-height: 100px;
// // // // // // // // //           background-color: #555;
// // // // // // // // //           color: #fff;
// // // // // // // // //           text-align: center;
// // // // // // // // //           border-radius: 6px;
// // // // // // // // //           padding: 15px;
// // // // // // // // //           position: absolute;
// // // // // // // // //           z-index: 1;
// // // // // // // // //           bottom: 125%;
// // // // // // // // //           left: 50%;
// // // // // // // // //           transform: translateX(-50%);
// // // // // // // // //           opacity: 0;
// // // // // // // // //           transition: opacity 0.3s;
// // // // // // // // //           padding-bottom:20px;
// // // // // // // // //         }
// // // // // // // // //         li:hover .tooltip {
// // // // // // // // //           visibility: visible;
// // // // // // // // //           opacity: 1;
// // // // // // // // //         } */

// // // // // // // // //         .tooltip {
// // // // // // // // //   visibility: hidden;
// // // // // // // // //   width: 250px;
// // // // // // // // //   /* min-height: 100px; */
// // // // // // // // //   height:fit-content;
// // // // // // // // //   background-color: #555;
// // // // // // // // //   color: #fff;
// // // // // // // // //   text-align: center;
// // // // // // // // //   border-radius: 6px;
// // // // // // // // //   padding: 15px;
// // // // // // // // //   position: absolute;
// // // // // // // // //   z-index: 1;
// // // // // // // // //   bottom: 125%;
// // // // // // // // //   left: 50%;
// // // // // // // // //   transform: translateX(-50%);
// // // // // // // // //   opacity: 0;
// // // // // // // // //   transition: opacity 0.3s;
// // // // // // // // //   padding-bottom: 20px;
// // // // // // // // // }

// // // // // // // // // li:hover .tooltip {
// // // // // // // // //   visibility: visible;
// // // // // // // // //   opacity: 1;
// // // // // // // // // }

// // // // // // // // //       `}</style>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default FunctionList;
// // // // // // // // // 'use client'
// // // // // // // // // import React, { useState, useMemo } from 'react';
// // // // // // // // // import styles from './FunctionList.module.css';

// // // // // // // // // const FunctionList = ({ data }) => {
// // // // // // // // //   const [filter, setFilter] = useState('');
// // // // // // // // //   const [filterType, setFilterType] = useState('');

// // // // // // // // //   const filteredData = useMemo(() => {
// // // // // // // // //     if (!filterType) return data;
// // // // // // // // //     return data.filter(item =>
// // // // // // // // //       item[filterType].toString().toLowerCase().includes(filter.toLowerCase())
// // // // // // // // //     );
// // // // // // // // //   }, [filter, filterType, data]);

// // // // // // // // //   const handleReset = () => {
// // // // // // // // //     setFilter('');
// // // // // // // // //     setFilterType('');
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <div className='functions-container'>
// // // // // // // // //         <div>
// // // // // // // // //       <input
// // // // // // // // //         type="text"
// // // // // // // // //         placeholder="Search functions..."
// // // // // // // // //         value={filter}
// // // // // // // // //         onChange={(e) => setFilter(e.target.value)}
// // // // // // // // //       />
// // // // // // // // //       <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
// // // // // // // // //         <option value="">Select filter type</option>
// // // // // // // // //         <option value="function_name">Function Name</option>
// // // // // // // // //         <option value="return_type">Return Type</option>
// // // // // // // // //         <option value="parameter_types">Parameter Types</option>
// // // // // // // // //       </select>
// // // // // // // // //       <button onClick={handleReset}>Reset</button>
// // // // // // // // //       <br></br>
// // // // // // // // //       <br></br>
// // // // // // // // //       <br></br>

// // // // // // // // //       <ul className={styles.functionList}>
// // // // // // // // //         {filteredData.map((func, index) => (
// // // // // // // // //           <li key={index} className={styles.listItem}>
// // // // // // // // //             {func.function_name}
// // // // // // // // //             <span className={styles.tooltip}>{func.description}</span>
// // // // // // // // //           </li>
// // // // // // // // //         ))}
// // // // // // // // //       </ul>
// // // // // // // // //       </div>

// // // // // // // // //       <div className='right-side'>Right Side</div>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default FunctionList;
// // // // // // // // 'use client'
// // // // // // // // import React, { useState, useMemo } from 'react';
// // // // // // // // import styles from './FunctionList.module.css';

// // // // // // // // const FunctionList = ({ data }) => {
// // // // // // // //   const [filter, setFilter] = useState('');
// // // // // // // //   const [filterType, setFilterType] = useState('');

// // // // // // // //   const filteredData = useMemo(() => {
// // // // // // // //     if (!filterType) return data;
// // // // // // // //     return data.filter(item =>
// // // // // // // //       item[filterType].toString().toLowerCase().includes(filter.toLowerCase())
// // // // // // // //     );
// // // // // // // //   }, [filter, filterType, data]);

// // // // // // // //   const handleReset = () => {
// // // // // // // //     setFilter('');
// // // // // // // //     setFilterType('');
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <div className={styles.functionsContainer}>
// // // // // // // //       <div className={styles.leftSide}>
// // // // // // // //         <div className={styles.inputsContainer}>
// // // // // // // //         <input
// // // // // // // //           type="text"
// // // // // // // //           placeholder="Search functions..."
// // // // // // // //           value={filter}
// // // // // // // //           onChange={(e) => setFilter(e.target.value)}
// // // // // // // //         />
// // // // // // // //         <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
// // // // // // // //           <option value="">Select filter type</option>
// // // // // // // //           <option value="function_name">Function Name</option>
// // // // // // // //           <option value="return_type">Return Type</option>
// // // // // // // //           <option value="parameter_types">Parameter Types</option>
// // // // // // // //         </select>
// // // // // // // //         <button onClick={handleReset}>Reset</button>
// // // // // // // //         </div>
// // // // // // // //          <br />
// // // // // // // //         <br />
// // // // // // // //         <br />
// // // // // // // //         <ul className={styles.functionList}>
// // // // // // // //           {filteredData.map((func, index) => (
// // // // // // // //             <li key={index} className={styles.listItem}>
// // // // // // // //               {func.function_name}
// // // // // // // //               <span className={styles.tooltip}>{func.description}</span>
// // // // // // // //             </li>
// // // // // // // //           ))}
// // // // // // // //         </ul>
// // // // // // // //       </div>
// // // // // // // //       <div className={styles.rightSide}>Right Side</div>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default FunctionList;
// // // // // // // 'use client'
// // // // // // // import React, { useState, useMemo } from 'react';
// // // // // // // import styles from './FunctionList.module.css';

// // // // // // // const FunctionList = ({ data }) => {
// // // // // // //   const [filter, setFilter] = useState('');
// // // // // // //   const [filterType, setFilterType] = useState('');

// // // // // // //   const filteredData = useMemo(() => {
// // // // // // //     if (!filterType) return data;
// // // // // // //     return data.filter(item =>
// // // // // // //       item[filterType].toString().toLowerCase().includes(filter.toLowerCase())
// // // // // // //     );
// // // // // // //   }, [filter, filterType, data]);

// // // // // // //   const alphabeticalGroups = useMemo(() => {
// // // // // // //     const groups = {};
// // // // // // //     filteredData.forEach(func => {
// // // // // // //       const firstLetter = func.function_name[0].toUpperCase();
// // // // // // //       if (!groups[firstLetter]) groups[firstLetter] = [];
// // // // // // //       groups[firstLetter].push(func);
// // // // // // //     });
// // // // // // //     return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
// // // // // // //   }, [filteredData]);

// // // // // // //   const handleReset = () => {
// // // // // // //     setFilter('');
// // // // // // //     setFilterType('');
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div className={styles.functionsContainer}>
// // // // // // //       <div className={styles.leftSide}>
// // // // // // //         <input
// // // // // // //           type="text"
// // // // // // //           placeholder="Search functions..."
// // // // // // //           value={filter}
// // // // // // //           onChange={(e) => setFilter(e.target.value)}
// // // // // // //         />
// // // // // // //         <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
// // // // // // //           <option value="">Select filter type</option>
// // // // // // //           <option value="function_name">Function Name</option>
// // // // // // //           <option value="return_type">Return Type</option>
// // // // // // //           <option value="parameter_types">Parameter Types</option>
// // // // // // //         </select>
// // // // // // //         <button onClick={handleReset}>Reset</button>
// // // // // // //         <br /><br /><br />
// // // // // // //         {alphabeticalGroups.map(([letter, functions]) => (
// // // // // // //           <div key={letter}>
// // // // // // //             <h3>{letter}</h3>
// // // // // // //             <ul className={styles.functionList}>
// // // // // // //               {functions.map((func, index) => (
// // // // // // //                 <li key={index} className={styles.listItem}>
// // // // // // //                   {func.function_name}
// // // // // // //                   <span className={styles.tooltip}>{func.description}</span>
// // // // // // //                 </li>
// // // // // // //               ))}
// // // // // // //             </ul>
// // // // // // //           </div>
// // // // // // //         ))}
// // // // // // //       </div>
// // // // // // //       <div className={styles.rightSide}>Right Side</div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default FunctionList;

// // // // // // 'use client'
// // // // // // import React, { useState, useMemo } from 'react';
// // // // // // import styles from './FunctionList.module.css';

// // // // // // const FunctionList = ({ data }) => {
// // // // // //   const [filter, setFilter] = useState('');
// // // // // //   const [filterType, setFilterType] = useState('');

// // // // // //   const filteredData = useMemo(() => {
// // // // // //     if (!filterType) return data;
// // // // // //     return data.filter(item =>
// // // // // //       item[filterType].toString().toLowerCase().includes(filter.toLowerCase())
// // // // // //     );
// // // // // //   }, [filter, filterType, data]);

// // // // // //   const alphabeticalGroups = useMemo(() => {
// // // // // //     const groups = {};
// // // // // //     filteredData.forEach(func => {
// // // // // //       const firstLetter = func.function_name[0].toUpperCase();
// // // // // //       if (!groups[firstLetter]) groups[firstLetter] = [];
// // // // // //       groups[firstLetter].push(func);
// // // // // //     });
// // // // // //     return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
// // // // // //   }, [filteredData]);

// // // // // //   const handleReset = () => {
// // // // // //     setFilter('');
// // // // // //     setFilterType('');
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className={styles.functionsContainer}>
// // // // // //       <div className={styles.leftSide}>
// // // // // //         <div className={styles.controls}>
// // // // // //           <input
// // // // // //             type="text"
// // // // // //             placeholder="Search functions..."
// // // // // //             value={filter}
// // // // // //             onChange={(e) => setFilter(e.target.value)}
// // // // // //             className={styles.searchInput}
// // // // // //           />
// // // // // //           <select 
// // // // // //             onChange={(e) => setFilterType(e.target.value)} 
// // // // // //             value={filterType}
// // // // // //             className={styles.filterSelect}
// // // // // //           >
// // // // // //             <option value="">Select filter type</option>
// // // // // //             <option value="function_name">Function Name</option>
// // // // // //             <option value="return_type">Return Type</option>
// // // // // //             <option value="parameter_types">Parameter Types</option>
// // // // // //           </select>
// // // // // //           <button onClick={handleReset} className={styles.resetButton}>Reset</button>
// // // // // //         </div>
// // // // // //         <div className={styles.functionGroups}>
// // // // // //           {alphabeticalGroups.map(([letter, functions]) => (
// // // // // //             <div key={letter} className={styles.letterGroup}>
// // // // // //               <h3 className={styles.letterHeading}>{letter}</h3>
// // // // // //               <ul className={styles.functionList}>
// // // // // //                 {functions.map((func, index) => (
// // // // // //                   <li key={index} className={styles.listItem}>
// // // // // //                     {func.function_name}
// // // // // //                     <span className={styles.tooltip}>{func.description}</span>
// // // // // //                   </li>
// // // // // //                 ))}
// // // // // //               </ul>
// // // // // //             </div>
// // // // // //           ))}
// // // // // //         </div>
// // // // // //       </div>
// // // // // //       <div className={styles.rightSide}>Right Side</div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default FunctionList;
// // // // // 'use client'
// // // // // import React, { useState, useMemo } from 'react';
// // // // // import styles from './FunctionList.module.css';

// // // // // const FunctionList = ({ data }) => {
// // // // //   const [filter, setFilter] = useState('');
// // // // //   const [filterType, setFilterType] = useState('');
// // // // //   const [filterOptions, setFilterOptions] = useState([]);

// // // // //   const handleFilterTypeChange = (e) => {
// // // // //     const selectedType = e.target.value;
// // // // //     setFilterType(selectedType);
    
// // // // //     if (selectedType) {
// // // // //       const options = [...new Set(data.map(item => item[selectedType]))];
// // // // //       setFilterOptions(options);
// // // // //     } else {
// // // // //       setFilterOptions([]);
// // // // //     }
// // // // //     setFilter('');
// // // // //   };

// // // // //   const filteredData = useMemo(() => {
// // // // //     if (!filterType || !filter) return data;
// // // // //     return data.filter(item =>
// // // // //       item[filterType].toString().toLowerCase().includes(filter.toLowerCase())
// // // // //     );
// // // // //   }, [filter, filterType, data]);

// // // // //   const alphabeticalGroups = useMemo(() => {
// // // // //     const groups = {};
// // // // //     filteredData.forEach(func => {
// // // // //       const firstLetter = func.function_name[0].toUpperCase();
// // // // //       if (!groups[firstLetter]) groups[firstLetter] = [];
// // // // //       groups[firstLetter].push(func);
// // // // //     });
// // // // //     return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
// // // // //   }, [filteredData]);

// // // // //   const handleReset = () => {
// // // // //     setFilter('');
// // // // //     setFilterType('');
// // // // //     setFilterOptions([]);
// // // // //   };

// // // // //   return (
// // // // //     <div className={styles.functionsContainer}>
// // // // //       <div className={styles.leftSide}>
// // // // //         <div className={styles.controls}>
// // // // //           <select 
// // // // //             onChange={handleFilterTypeChange} 
// // // // //             value={filterType}
// // // // //             className={styles.filterSelect}
// // // // //           >
// // // // //             <option value="">Select filter type</option>
// // // // //             <option value="function_name">Function Name</option>
// // // // //             <option value="return_type">Return Type</option>
// // // // //             <option value="parameter_types">Parameter Types</option>
// // // // //           </select>

// // // // //           {filterType && (
// // // // //             <div>
// // // // //               <input
// // // // //                 type="text"
// // // // //                 list="filterOptions"
// // // // //                 placeholder={`Type or select ${filterType}...`}
// // // // //                 value={filter}
// // // // //                 onChange={(e) => setFilter(e.target.value)}
// // // // //                 className={styles.filterInput}
// // // // //               />
// // // // //               <datalist id="filterOptions">
// // // // //                 {filterOptions.map((option, index) => (
// // // // //                   <option key={index} value={option} />
// // // // //                 ))}
// // // // //               </datalist>
// // // // //             </div>
// // // // //           )}

// // // // //           <button onClick={handleReset} className={styles.resetButton}>Reset</button>
// // // // //         </div>

// // // // //         <div className={styles.functionGroups}>
// // // // //           {alphabeticalGroups.map(([letter, functions]) => (
// // // // //             <div key={letter} className={styles.letterGroup}>
// // // // //               <h3 className={styles.letterHeading}>{letter}</h3>
// // // // //               <ul className={styles.functionList}>
// // // // //                 {functions.map((func, index) => (
// // // // //                   <li key={index} className={styles.listItem}>
// // // // //                     {func.function_name}
// // // // //                     <span className={styles.tooltip}>{func.description}</span>
// // // // //                   </li>
// // // // //                 ))}
// // // // //               </ul>
// // // // //             </div>
// // // // //           ))}
// // // // //         </div>
// // // // //       </div>
// // // // //       <div className={styles.rightSide}>Right Side</div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default FunctionList;
// // // // 'use client'
// // // // import React, { useState, useMemo } from 'react';
// // // // import styles from './FunctionList.module.css';

// // // // const FunctionList = ({ data }) => {
// // // //   const [filter, setFilter] = useState('');
// // // //   const [filterType, setFilterType] = useState('');
// // // //   const [filterOptions, setFilterOptions] = useState([]);

// // // // //   const handleFilterTypeChange = (e) => {
// // // // //     const selectedType = e.target.value;
// // // // //     setFilterType(selectedType);
    
// // // // //     if (selectedType && selectedType !== 'function_name') {
// // // // //       const options = [...new Set(data.map(item => item[selectedType]))];
// // // // //       setFilterOptions(options);
// // // // //     } else {
// // // // //       setFilterOptions([]);
// // // // //     }
// // // // //     setFilter('');
// // // // //   };
// // // // const handleFilterTypeChange = (e) => {
// // // //     const selectedType = e.target.value;
// // // //     setFilterType(selectedType.replaceAll('_',' '));
    
// // // //     if (selectedType && selectedType !== 'function_name') {
// // // //       let options = new Set();
      
// // // //       if (selectedType === 'parameter_types') {
// // // //         data.forEach(item => {
// // // //           const params = item[selectedType];
// // // //           if (Array.isArray(params)) {
// // // //             params.forEach(param => {
// // // //               if (typeof param === 'string') {
// // // //                 options.add(param.trim());
// // // //               } else if (typeof param === 'object') {
// // // //                 // If param is an object, add each key-value pair
// // // //                 Object.entries(param).forEach(([key, value]) => {
// // // //                   options.add(`${key}: ${value}`.trim());
// // // //                 });
// // // //               }
// // // //             });
// // // //           }
// // // //         });
// // // //       } else {
// // // //         // Handle return_type and other fields
// // // //         data.forEach(item => {
// // // //           const value = item[selectedType];
// // // //           if (value !== undefined && value !== null) {
// // // //             options.add(value.toString().trim());
// // // //           }
// // // //         });
// // // //       }
  
// // // //       // Convert Set to sorted array
// // // //       const sortedOptions = [...options].sort((a, b) => a.localeCompare(b));
// // // //       setFilterOptions(sortedOptions);
// // // //     } else {
// // // //       setFilterOptions([]);
// // // //     }
// // // //     setFilter('');
// // // //   };


// // // // //   const filteredData = useMemo(() => {
// // // // //     if (!filterType || !filter) return data;
// // // // //     return data.filter(item =>
// // // // //       item[filterType].toString().toLowerCase().includes(filter.toLowerCase())
// // // // //     );
// // // // //   }, [filter, filterType, data]);

// // // // const filteredData = useMemo(() => {
// // // //     if (!filterType || !filter) return data;
// // // //     return data.filter(item => {
// // // //       const value = item[filterType];
// // // //       if (value === undefined || value === null) return false;
      
// // // //       if (Array.isArray(value)) {
// // // //         // For array values (like parameter_types), check if any element includes the filter
// // // //         return value.some(v => 
// // // //           v && v.toString().toLowerCase().includes(filter.toLowerCase())
// // // //         );
// // // //       } else {
// // // //         // For non-array values
// // // //         return value.toString().toLowerCase().includes(filter.toLowerCase());
// // // //       }
// // // //     });
// // // //   }, [filter, filterType, data]);

// // // //   const alphabeticalGroups = useMemo(() => {
// // // //     const groups = {};
// // // //     filteredData.forEach(func => {
// // // //       const firstLetter = func.function_name[0].toUpperCase();
// // // //       if (!groups[firstLetter]) groups[firstLetter] = [];
// // // //       groups[firstLetter].push(func);
// // // //     });
// // // //     return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
// // // //   }, [filteredData]);

// // // //   const handleReset = () => {
// // // //     setFilter('');
// // // //     setFilterType('');
// // // //     setFilterOptions([]);
// // // //   };

// // // //   return (
// // // //     <div className={styles.functionsContainer}>
// // // //       <div className={styles.leftSide}>
// // // //         <div className={styles.controls}>
// // // //           <select 
// // // //             onChange={handleFilterTypeChange} 
// // // //             value={filterType}
// // // //             className={styles.filterSelect}
// // // //           >
// // // //             <option value="">Select filter type</option>
// // // //             <option value="function_name">Function Name</option>
// // // //             <option value="return_type">Return Type</option>
// // // //             <option value="parameter_types">Parameter Types</option>
// // // //           </select>

// // // //           {filterType && (
// // // //             filterType === 'function_name' ? (
// // // //               <input
// // // //                 type="text"
// // // //                 placeholder="Type function name..."
// // // //                 value={filter}
// // // //                 onChange={(e) => setFilter(e.target.value)}
// // // //                 className={styles.filterInput}
// // // //               />
// // // //             ) : (
// // // //               <select
// // // //                 value={filter}
// // // //                 onChange={(e) => setFilter(e.target.value)}
// // // //                 className={styles.filterInput}
// // // //               >
// // // //                 <option value="">Select {filterType}</option>
// // // //                 {filterOptions.map((option, index) => (
// // // //                   <option key={index} value={option}>{option}</option>
// // // //                 ))}
// // // //               </select>
// // // //             )
// // // //           )}

// // // //           <button onClick={handleReset} className={styles.resetButton}>Reset</button>
// // // //         </div>

// // // //         <div className={styles.functionGroups}>
// // // //           {alphabeticalGroups.map(([letter, functions]) => (
// // // //             <div key={letter} className={styles.letterGroup}>
// // // //               <h3 className={styles.letterHeading}>{letter}</h3>
// // // //               <ul className={styles.functionList}>
// // // //                 {functions.map((func, index) => (
// // // //                   <li key={index} className={styles.listItem}>
// // // //                     {func.function_name}
// // // //                     <span className={styles.tooltip}>{func.description}</span>
// // // //                   </li>
// // // //                 ))}
// // // //               </ul>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       </div>
// // // //       <div className={styles.rightSide}>Right Side</div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default FunctionList;

// // // 'use client'
// // // import React, { useState, useMemo } from 'react';
// // // import styles from './FunctionList.module.css';

// // // const FunctionList = ({ data }) => {
// // //   const [filter, setFilter] = useState('');
// // //   const [filterType, setFilterType] = useState('');
// // //   const [filterOptions, setFilterOptions] = useState([]);

// // //   const handleFilterTypeChange = (e) => {
// // //     const selectedType = e.target.value;
// // //     setFilterType(selectedType);
// // //     setFilter('');

// // //     if (selectedType && selectedType !== 'function_name') {
// // //       let options = new Set();
      
// // //       data.forEach(item => {
// // //         const values = item[selectedType];
// // //         if (Array.isArray(values)) {
// // //           values.forEach(value => {
// // //             if (value !== undefined && value !== null) {
// // //               options.add(value.toString().trim());
// // //             }
// // //           });
// // //         } else if (values !== undefined && values !== null) {
// // //           options.add(values.toString().trim());
// // //         }
// // //       });

// // //       setFilterOptions([...options].sort((a, b) => a.localeCompare(b)));
// // //     } else {
// // //       setFilterOptions([]);
// // //     }
// // //   };

// // //   const filteredData = useMemo(() => {
// // //     if (!filterType || !filter) return data;
// // //     return data.filter(item => {
// // //       const value = item[filterType];
// // //       if (value === undefined || value === null) return false;
      
// // //       const normalizeString = (str) => str.toString().toLowerCase().trim();
// // //       const normalizedFilter = normalizeString(filter);
      
// // //       if (Array.isArray(value)) {
// // //         return value.some(v => normalizeString(v).includes(normalizedFilter));
// // //       } else {
// // //         return normalizeString(value).includes(normalizedFilter);
// // //       }
// // //     });
// // //   }, [filter, filterType, data]);

// // //   const alphabeticalGroups = useMemo(() => {
// // //     const groups = {};
// // //     filteredData.forEach(func => {
// // //       const firstLetter = func.function_name[0].toUpperCase();
// // //       if (!groups[firstLetter]) groups[firstLetter] = [];
// // //       groups[firstLetter].push(func);
// // //     });
// // //     return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
// // //   }, [filteredData]);

// // //   const handleReset = () => {
// // //     setFilter('');
// // //     setFilterType('');
// // //     setFilterOptions([]);
// // //   };

// // //   return (
// // //     <div className={styles.functionsContainer}>
// // //       <div className={styles.leftSide}>
// // //         <div className={styles.controls}>
// // //           <select 
// // //             onChange={handleFilterTypeChange} 
// // //             value={filterType}
// // //             className={styles.filterSelect}
// // //           >
// // //             <option value="">Select filter type</option>
// // //             <option value="function_name">Function Name</option>
// // //             <option value="return_type">Return Type</option>
// // //             <option value="parameter_types">Parameter Types</option>
// // //           </select>

// // //           {filterType && (
// // //             filterType === 'function_name' ? (
// // //               <input
// // //                 type="text"
// // //                 placeholder="Type function name..."
// // //                 value={filter}
// // //                 onChange={(e) => setFilter(e.target.value)}
// // //                 className={styles.filterInput}
// // //               />
// // //             ) : (
// // //               <select
// // //                 value={filter}
// // //                 onChange={(e) => setFilter(e.target.value)}
// // //                 className={styles.filterInput}
// // //               >
// // //                 <option value="">Select {filterType}</option>
// // //                 {filterOptions.map((option, index) => (
// // //                   <option key={index} value={option}>{option}</option>
// // //                 ))}
// // //               </select>
// // //             )
// // //           )}

// // //           <button onClick={handleReset} className={styles.resetButton}>Reset</button>
// // //         </div>

// // //         <div className={styles.functionGroups}>
// // //           {alphabeticalGroups.map(([letter, functions]) => (
// // //             <div key={letter} className={styles.letterGroup}>
// // //               <h3 className={styles.letterHeading}>{letter}</h3>
// // //               <ul className={styles.functionList}>
// // //                 {functions.map((func, index) => (
// // //                   <li key={index} className={styles.listItem}>
// // //                     {func.function_name}
// // //                     <span className={styles.tooltip}>{func.description}</span>
// // //                   </li>
// // //                 ))}
// // //               </ul>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>
// // //       <div className={styles.rightSide}>Right Side</div>
// // //     </div>
// // //   );
// // // };

// // // export default FunctionList;
// // 'use client'
// // import React, { useState, useMemo } from 'react';
// // import styles from './FunctionList.module.css';

// // const FunctionList = ({ data }) => {
// //   const [filter, setFilter] = useState('');
// //   const [filterType, setFilterType] = useState('');
// //   const [filterOptions, setFilterOptions] = useState([]);

// //   const handleFilterTypeChange = (e) => {
// //     const selectedType = e.target.value;
// //     setFilterType(selectedType);
// //     setFilter('');

// //     if (selectedType && selectedType !== 'function_name') {
// //       let options = new Set();
      
// //       data.forEach(item => {
// //         const values = item[selectedType];
// //         if (Array.isArray(values)) {
// //           values.forEach(value => {
// //             if (value !== undefined && value !== null) {
// //               options.add(value.toString().trim());
// //             }
// //           });
// //         } else if (values !== undefined && values !== null) {
// //           options.add(values.toString().trim());
// //         }
// //       });

// //       setFilterOptions([...options].sort((a, b) => a.localeCompare(b)));
// //     } else {
// //       setFilterOptions([]);
// //     }
// //   };

// //   const filteredData = useMemo(() => {
// //     if (!filterType || !filter) return data;
// //     return data.filter(item => {
// //       const value = item[filterType];
// //       if (value === undefined || value === null) return false;
      
// //       const normalizeString = (str) => str.toString().toLowerCase().trim();
// //       const normalizedFilter = normalizeString(filter);
      
// //       if (Array.isArray(value)) {
// //         return value.some(v => normalizeString(v).includes(normalizedFilter));
// //       } else {
// //         return normalizeString(value).includes(normalizedFilter);
// //       }
// //     });
// //   }, [filter, filterType, data]);

// //   const alphabeticalGroups = useMemo(() => {
// //     const groups = {};
// //     filteredData.forEach(func => {
// //       const firstLetter = func.function_name[0].toUpperCase();
// //       if (!groups[firstLetter]) groups[firstLetter] = [];
// //       groups[firstLetter].push(func);
// //     });
// //     return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
// //   }, [filteredData]);

// //   const handleReset = () => {
// //     setFilter('');
// //     setFilterType('');
// //     setFilterOptions([]);
// //   };

// //   return (
// //     <div className={styles.functionsContainer}>
// //       <div className={styles.leftSide}>
// //         <div className={styles.controls}>
// //           <select 
// //             onChange={handleFilterTypeChange} 
// //             value={filterType}
// //             className={styles.filterSelect}
// //           >
// //             <option value="">Select filter type</option>
// //             <option value="function_name">Function Name</option>
// //             <option value="return_type">Return Type</option>
// //             <option value="parameter_types">Parameter Types</option>
// //             <option value="include_file">Header File</option>
// //           </select>

// //           {filterType && (
// //             filterType === 'function_name' ? (
// //               <input
// //                 type="text"
// //                 placeholder="Type function name..."
// //                 value={filter}
// //                 onChange={(e) => setFilter(e.target.value)}
// //                 className={styles.filterInput}
// //               />
// //             ) : (
// //               <select
// //                 value={filter}
// //                 onChange={(e) => setFilter(e.target.value)}
// //                 className={styles.filterInput}
// //               >
// //                 <option value="">Select {filterType}</option>
// //                 {filterOptions.map((option, index) => (
// //                   <option key={index} value={option}>{option}</option>
// //                 ))}
// //               </select>
// //             )
// //           )}

// //           <button onClick={handleReset} className={styles.resetButton}>Reset</button>
// //         </div>

// //         <div className={styles.functionGroups}>
// //           {alphabeticalGroups.map(([letter, functions]) => (
// //             <div key={letter} className={styles.letterGroup}>
// //               <h3 className={styles.letterHeading}>{letter}</h3>
// //               <ul className={styles.functionList}>
// //                 {functions.map((func, index) => (
// //                   <li key={index} className={styles.listItem}>
// //                     {func.function_name}
// //                     <span className={styles.tooltip}>
// //                       {func.description}<br/>
// //                       Header: {func.include_file}
// //                     </span>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //       <div className={styles.rightSide}>Right Side</div>
// //     </div>
// //   );
// // };

// // export default FunctionList;
// 'use client'
// import React, { useState, useMemo } from 'react';
// import styles from './FunctionList.module.css';

// const FunctionList = ({ data }) => {
//   const [filter, setFilter] = useState('');
//   const [filterType, setFilterType] = useState('');
//   const [filterOptions, setFilterOptions] = useState([]);

//   const handleFilterTypeChange = (e) => {
//     const selectedType = e.target.value;
//     setFilterType(selectedType);
//     setFilter('');

//     if (selectedType && selectedType !== 'function_name') {
//       let options = new Set();
      
//       data.forEach(item => {
//         const values = item[selectedType];
//         if (Array.isArray(values)) {
//           values.forEach(value => {
//             if (value !== undefined && value !== null) {
//               options.add(value.toString().trim());
//             }
//           });
//         } else if (values !== undefined && values !== null) {
//           options.add(values.toString().trim());
//         }
//       });

//       setFilterOptions([...options].sort((a, b) => a.localeCompare(b)));
//     } else {
//       setFilterOptions([]);
//     }
//   };

//   const filteredData = useMemo(() => {
//     if (!filterType || !filter) return data;
//     return data.filter(item => {
//       const value = item[filterType];
//       if (value === undefined || value === null) return false;
      
//       const normalizeString = (str) => str.toString().toLowerCase().trim();
//       const normalizedFilter = normalizeString(filter);
      
//       if (Array.isArray(value)) {
//         return value.some(v => normalizeString(v).includes(normalizedFilter));
//       } else {
//         return normalizeString(value).includes(normalizedFilter);
//       }
//     });
//   }, [filter, filterType, data]);

//   const alphabeticalGroups = useMemo(() => {
//     const groups = {};
//     filteredData.forEach(func => {
//       const firstLetter = func.function_name[0].toUpperCase();
//       if (!groups[firstLetter]) groups[firstLetter] = [];
//       groups[firstLetter].push(func);
//     });
//     return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
//   }, [filteredData]);

//   const handleReset = () => {
//     setFilter('');
//     setFilterType('');
//     setFilterOptions([]);
//   };

//   return (
//     <div className={styles.functionsContainer}>
//       <div className={styles.leftSide}>
//         <div className={styles.controls}>
//           <select 
//             onChange={handleFilterTypeChange} 
//             value={filterType}
//             className={styles.filterSelect}
//           >
//             <option value="">Select filter type</option>
//             <option value="function_name">Function Name</option>
//             <option value="return_type">Return Type</option>
//             <option value="parameter_types">Parameter Types</option>
//             <option value="include_file">Header File</option>
//             <option value="data_type_manipulated">Data Type Manipulated</option>
//           </select>

//           {filterType && (
//             filterType === 'function_name' ? (
//               <input
//                 type="text"
//                 placeholder="Type function name..."
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 className={styles.filterInput}
//               />
//             ) : (
//               <select
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 className={styles.filterInput}
//               >
//                 <option value="">Select {filterType.replace(/_/g, ' ')}</option>
//                 {filterOptions.map((option, index) => (
//                   <option key={index} value={option}>{option}</option>
//                 ))}
//               </select>
//             )
//           )}

//           <button onClick={handleReset} className={styles.resetButton}>Reset</button>
//         </div>

//         <div className={styles.functionGroups}>
//           {alphabeticalGroups.map(([letter, functions]) => (
//             <div key={letter} className={styles.letterGroup}>
//               <h3 className={styles.letterHeading}>{letter}</h3>
//               <ul className={styles.functionList}>
//                 {functions.map((func, index) => (
//                   <li key={index} className={styles.listItem}>
//                     {func.function_name}
//                     <span className={styles.tooltip}>{func.description}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className={styles.rightSide}>Right Side</div>
//     </div>
//   );
// };

// export default FunctionList;
'use client'
import React, { useState, useMemo, useEffect } from 'react';
import styles from './FunctionList.module.css';
import Link from 'next/link';

const FunctionList = ({ data }) => {
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterOptions, setFilterOptions] = useState([]);
  const [actionCategories, setActionCategories] = useState([]);
  const [specificActions, setSpecificActions] = useState({});
  const [selectedActionCategory, setSelectedActionCategory] = useState('');
  const [selectedSpecificAction, setSelectedSpecificAction] = useState('');

  useEffect(() => {
    const categories = [...new Set(data.map(item => item.main_category))];
    setActionCategories(categories);

    const actions = {};
    categories.forEach(category => {
      actions[category] = [...new Set(data
        .filter(item => item.main_category === category)
        .map(item => item.sub_category))];
    });
    setSpecificActions(actions);
  }, [data]);

  const handleFilterTypeChange = (e) => {
    const selectedType = e.target.value;
    setFilterType(selectedType);
    setFilter('');
    setSelectedActionCategory('');
    setSelectedSpecificAction('');

    if (selectedType && selectedType !== 'function_name' && selectedType !== 'action') {
      let options = new Set();
      
      data.forEach(item => {
        const values = item[selectedType];
        if (Array.isArray(values)) {
          values.forEach(value => {
            if (value !== undefined && value !== null) {
              options.add(value.toString().trim());
            }
          });
        } else if (values !== undefined && values !== null) {
          options.add(values.toString().trim());
        }
      });

      setFilterOptions([...options].sort((a, b) => a.localeCompare(b)));
    } else {
      setFilterOptions([]);
    }
  };

  const filteredData = useMemo(() => {
    if (!filterType) return data;
    if (filterType === 'action') {
      if (!selectedActionCategory) return data;
      return data.filter(item => 
        item.main_category === selectedActionCategory &&
        (!selectedSpecificAction || item.sub_category === selectedSpecificAction)
      );
    }
    if (!filter) return data;
    return data.filter(item => {
      const value = item[filterType];
      if (value === undefined || value === null) return false;
      
      const normalizeString = (str) => str.toString().toLowerCase().trim();
      const normalizedFilter = normalizeString(filter);
      
      if (Array.isArray(value)) {
        return value.some(v => normalizeString(v).includes(normalizedFilter));
      } else {
        return normalizeString(value).includes(normalizedFilter);
      }
    });
  }, [filter, filterType, data, selectedActionCategory, selectedSpecificAction]);

  const alphabeticalGroups = useMemo(() => {
    const groups = {};
    filteredData.forEach(func => {
      const firstLetter = func.function_name[0].toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(func);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredData]);

  const handleReset = () => {
    setFilter('');
    setFilterType('');
    setFilterOptions([]);
    setSelectedActionCategory('');
    setSelectedSpecificAction('');
  };

  return (
    <div className={styles.functionsContainer}>
       
      <div className={styles.leftSide}>
        <div className={styles.controlsOuter}>
        <div className={styles.controls}>
        {/* <p>{data.length}</p> */}
          <select 
            onChange={handleFilterTypeChange} 
            value={filterType}
            className={styles.filterSelect}
          >
            <option value="">Select filter type</option>
            <option value="function_name">Function Name</option>
            <option value="return_type">Return Type</option>
            <option value="parameter_types">Parameter Types</option>
            <option value="include_file">Header File</option>
            <option value="data_type_manipulated">Data Type Manipulated</option>
            <option value="action">Action</option>
          </select>

          {filterType === 'action' ? (
            <>
              <select
                value={selectedActionCategory}
                onChange={(e) => setSelectedActionCategory(e.target.value)}
                className={styles.filterInput}
              >
                <option value="">Select Action Category</option>
                {actionCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              {selectedActionCategory && (
                <select
                  value={selectedSpecificAction}
                  onChange={(e) => setSelectedSpecificAction(e.target.value)}
                  className={styles.filterInput}
                >
                  <option value="">Select Specific Action</option>
                  {specificActions[selectedActionCategory].map((action, index) => (
                    <option key={index} value={action}>{action}</option>
                  ))}
                </select>
              )}
            </>
          ) : filterType && filterType !== 'function_name' ? (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterInput}
            >
              <option value="">Select {filterType.replace(/_/g, ' ')}</option>
              {filterOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          ) : filterType === 'function_name' ? (
            <input
              type="text"
              placeholder="Type function name..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterInput}
            />
          ) : null}
        </div>
          <button onClick={handleReset} className={styles.resetButton}>Reset Search</button>
          </div>

        <div className={styles.functionGroups}>
          {alphabeticalGroups.map(([letter, functions]) => (
            <div key={letter} className={styles.letterGroup}>
              <h3 className={styles.letterHeading}>{letter}</h3>
              <ul className={styles.functionList}>
                {functions.map((func, index) => (
                  <li key={index} className={styles.listItem}>
                    <Link href={`functions/${func.function_name}`}>
                    {func.function_name}
                    </Link>
                    <span className={styles.tooltip}>{func.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Right Side */}
      <div className={styles.rightSide}></div>
    </div>
  );
};

export default FunctionList;