// // // 'use client'
// // // import React, { useState, useMemo } from 'react';
// // // import styles from './PythonFunctionsList.module.css';

// // // const PythonFunctionsList = ({ data }) => {
// // //   const [filter, setFilter] = useState('');
// // //   const [filterType, setFilterType] = useState('');
// // //   const [filterOptions, setFilterOptions] = useState([]);

// // //   const filterTypes = [
// // //     { value: "", label: "Select filter type" },
// // //     { value: "name", label: "Function Name" },
// // //     { value: "module", label: "Module" },
// // //     { value: "class_name", label: "Class" },
// // //     { value: "return_type", label: "Return Type" },
// // //     { value: "main_category", label: "Main Category" },
// // //     { value: "sub_category", label: "Sub Category" },
// // //     { value: "data_type_manipulated", label: "Data Type" },
// // //   ];

// // //   const handleFilterTypeChange = (e) => {
// // //     const selectedType = e.target.value;
// // //     setFilterType(selectedType);
// // //     setFilter('');

// // //     if (selectedType && selectedType !== 'name') {
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
// // //       const firstLetter = func.name[0].toUpperCase();
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
// // //             {filterTypes.map(type => (
// // //               <option key={type.value} value={type.value}>{type.label}</option>
// // //             ))}
// // //           </select>

// // //           {filterType && (
// // //             filterType === 'name' ? (
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
// // //                 <option value="">Select {filterType.replace(/_/g, ' ')}</option>
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
// // //                     <h4>{func.name}</h4>
// // //                     <p>Module: {func.module}</p>
// // //                     {func.class_name && <p>Class: {func.class_name}</p>}
// // //                     <p>Description: {func.docstring}</p>
// // //                     {func.decorators.length > 0 && (
// // //                       <p>Decorators: {func.decorators.join(', ')}</p>
// // //                     )}
// // //                     <p>Parameters: {func.parameters.map(p => `${p.name}: ${p.type}`).join(', ')}</p>
// // //                     {func.return_type && <p>Return Type: {func.return_type}</p>}
// // //                     <p>Category: {func.main_category} - {func.sub_category}</p>
// // //                     {func.deprecated && <p className={styles.deprecated}>Deprecated</p>}
// // //                     {func.examples && func.examples.length > 0 && (
// // //                       <div className={styles.examples}>
// // //                         <h5>Examples:</h5>
// // //                         {func.examples.map((example, i) => (
// // //                           <pre key={i}>{example}</pre>
// // //                         ))}
// // //                       </div>
// // //                     )}
// // //                     <span className={styles.tooltip}>{func.docstring}</span>
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

// // // export default PythonFunctionsList;
// // // 'use client'
// // // import React, { useState, useMemo } from 'react';
// // // import styles from './PythonFunctionsList.module.css';

// // // const PythonFunctionsList = ({ data }) => {
// // //   const [filter, setFilter] = useState('');
// // //   const [filterType, setFilterType] = useState('');
// // //   const [filterOptions, setFilterOptions] = useState([]);

// // //   const filterTypes = [
// // //     { value: "", label: "Select filter type" },
// // //     { value: "name", label: "Function Name" },
// // //     { value: "module", label: "Module" },
// // //     { value: "return_type", label: "Return Type" },
// // //     { value: "main_category", label: "Main Category" },
// // //     { value: "sub_category", label: "Sub Category" },
// // //     { value: "data_type_manipulated", label: "Data Type" },
// // //   ];

// // //   const handleFilterTypeChange = (e) => {
// // //     const selectedType = e.target.value;
// // //     setFilterType(selectedType);
// // //     setFilter('');

// // //     if (selectedType && selectedType !== 'name') {
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
// // //       const firstLetter = func.name[0].toUpperCase();
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
// // //             {filterTypes.map(type => (
// // //               <option key={type.value} value={type.value}>{type.label}</option>
// // //             ))}
// // //           </select>

// // //           {filterType && (
// // //             filterType === 'name' ? (
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
// // //                 <option value="">Select {filterType.replace(/_/g, ' ')}</option>
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
// // //                     {func.name}
// // //                     <span className={styles.tooltip}>{func.docstring}</span>
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

// // // export default PythonFunctionsList;
// // 'use client'
// // import React, { useState, useMemo } from 'react';
// // import styles from './PythonFunctionsList.module.css';

// // const PythonFunctionsList = ({ data }) => {
// //   const [filter, setFilter] = useState('');
// //   const [filterType, setFilterType] = useState('');
// //   const [filterOptions, setFilterOptions] = useState([]);
// //   const [mainCategory, setMainCategory] = useState('');
// //   const [subCategory, setSubCategory] = useState('');

// //   const filterTypes = [
// //     { value: "", label: "Select filter type" },
// //     { value: "name", label: "Function Name" },
// //     { value: "module", label: "Module" },
// //     { value: "return_type", label: "Return Type" },
// //     { value: "data_type_manipulated", label: "Data Type" },
// //     { value: "action", label: "Action" },
// //   ];

// //   const categories = useMemo(() => {
// //     const cats = {};
// //     data.forEach(item => {
// //       if (item.main_category) {
// //         if (!cats[item.main_category]) {
// //           cats[item.main_category] = new Set();
// //         }
// //         if (item.sub_category) {
// //           cats[item.main_category].add(item.sub_category);
// //         }
// //       }
// //     });
// //     Object.keys(cats).forEach(key => {
// //       cats[key] = Array.from(cats[key]).sort();
// //     });
// //     return cats;
// //   }, [data]);

// //   const mainCategories = useMemo(() => Object.keys(categories).sort(), [categories]);

// //   const handleFilterTypeChange = (e) => {
// //     const selectedType = e.target.value;
// //     setFilterType(selectedType);
// //     setFilter('');
// //     setMainCategory('');
// //     setSubCategory('');

// //     if (selectedType && selectedType !== 'name' && selectedType !== 'action') {
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

// //   const handleMainCategoryChange = (e) => {
// //     setMainCategory(e.target.value);
// //     setSubCategory('');
// //   };

// //   const filteredData = useMemo(() => {
// //     return data.filter(item => {
// //       if (filterType === 'action') {
// //         return (!mainCategory || item.main_category === mainCategory) &&
// //                (!subCategory || item.sub_category === subCategory);
// //       } else if (filterType && filter) {
// //         const value = item[filterType];
// //         if (value === undefined || value === null) return false;
        
// //         const normalizeString = (str) => str.toString().toLowerCase().trim();
// //         const normalizedFilter = normalizeString(filter);
        
// //         if (Array.isArray(value)) {
// //           return value.some(v => normalizeString(v).includes(normalizedFilter));
// //         } else {
// //           return normalizeString(value).includes(normalizedFilter);
// //         }
// //       }
// //       return true;
// //     });
// //   }, [filterType, filter, mainCategory, subCategory, data]);

// //   const handleReset = () => {
// //     setFilter('');
// //     setFilterType('');
// //     setMainCategory('');
// //     setSubCategory('');
// //     setFilterOptions([]);
// //   };

// //   const alphabeticalGroups = useMemo(() => {
// //     const groups = {};
// //     filteredData.forEach(func => {
// //       const firstLetter = func.name[0].toUpperCase();
// //       if (!groups[firstLetter]) groups[firstLetter] = [];
// //       groups[firstLetter].push(func);
// //     });
// //     return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
// //   }, [filteredData]);

// //   return (
// //     <div className={styles.functionsContainer}>
// //       <div className={styles.leftSide}>
// //         <div className={styles.controls}>
// //           <select 
// //             onChange={handleFilterTypeChange} 
// //             value={filterType}
// //             className={styles.filterSelect}
// //           >
// //             {filterTypes.map(type => (
// //               <option key={type.value} value={type.value}>{type.label}</option>
// //             ))}
// //           </select>

// //           {filterType && filterType !== 'action' && (
// //             filterType === 'name' ? (
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
// //                 <option value="">Select {filterType.replace(/_/g, ' ')}</option>
// //                 {filterOptions.map((option, index) => (
// //                   <option key={index} value={option}>{option}</option>
// //                 ))}
// //               </select>
// //             )
// //           )}

// //           {filterType === 'action' && (
// //             <>
// //               <select 
// //                 onChange={handleMainCategoryChange} 
// //                 value={mainCategory}
// //                 className={styles.filterSelect}
// //               >
// //                 <option value="">Select Main Category</option>
// //                 {mainCategories.map(category => (
// //                   <option key={category} value={category}>{category}</option>
// //                 ))}
// //               </select>

// //               {mainCategory && (
// //                 <select
// //                   onChange={(e) => setSubCategory(e.target.value)}
// //                   value={subCategory}
// //                   className={styles.filterSelect}
// //                 >
// //                   <option value="">Select Sub Category</option>
// //                   {categories[mainCategory].map(subCat => (
// //                     <option key={subCat} value={subCat}>{subCat}</option>
// //                   ))}
// //                 </select>
// //               )}
// //             </>
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
// //                     {func.name}
// //                     <span className={styles.tooltip}>{func.docstring}</span>
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

// // export default PythonFunctionsList;
// // 'use client'
// // import React, { useState, useMemo } from 'react';
// // import styles from './PythonFunctionsList.module.css';

// // const PythonFunctionsList = ({ data }) => {
// //   const [filter, setFilter] = useState('');
// //   const [filterType, setFilterType] = useState('');
// //   const [filterOptions, setFilterOptions] = useState([]);
// //   const [actionType, setActionType] = useState('');
// //   const [actionDetails, setActionDetails] = useState('');

// //   const filterTypes = [
// //     { value: "", label: "Select filter type" },
// //     { value: "name", label: "Function Name" },
// //     { value: "module", label: "Module" },
// //     { value: "return_type", label: "Return Type" },
// //     { value: "data_type_manipulated", label: "Data Type" },
// //     { value: "action", label: "Action" },
// //   ];

// //   const categories = useMemo(() => {
// //     const cats = {};
// //     data.forEach(item => {
// //       if (item.main_category) {
// //         if (!cats[item.main_category]) {
// //           cats[item.main_category] = new Set();
// //         }
// //         if (item.sub_category) {
// //           cats[item.main_category].add(item.sub_category);
// //         }
// //       }
// //     });
// //     Object.keys(cats).forEach(key => {
// //       cats[key] = Array.from(cats[key]).sort();
// //     });
// //     return cats;
// //   }, [data]);

// //   const actionTypes = useMemo(() => Object.keys(categories).sort(), [categories]);

// //   const handleFilterTypeChange = (e) => {
// //     const selectedType = e.target.value;
// //     setFilterType(selectedType);
// //     setFilter('');
// //     setActionType('');
// //     setActionDetails('');

// //     if (selectedType && selectedType !== 'name' && selectedType !== 'action') {
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

// //   const handleActionTypeChange = (e) => {
// //     setActionType(e.target.value);
// //     setActionDetails('');
// //   };

// //   const filteredData = useMemo(() => {
// //     return data.filter(item => {
// //       if (filterType === 'action') {
// //         return (!actionType || item.main_category === actionType) &&
// //                (!actionDetails || item.sub_category === actionDetails);
// //       } else if (filterType && filter) {
// //         const value = item[filterType];
// //         if (value === undefined || value === null) return false;
        
// //         const normalizeString = (str) => str.toString().toLowerCase().trim();
// //         const normalizedFilter = normalizeString(filter);
        
// //         if (Array.isArray(value)) {
// //           return value.some(v => normalizeString(v).includes(normalizedFilter));
// //         } else {
// //           return normalizeString(value).includes(normalizedFilter);
// //         }
// //       }
// //       return true;
// //     });
// //   }, [filterType, filter, actionType, actionDetails, data]);

// //   const handleReset = () => {
// //     setFilter('');
// //     setFilterType('');
// //     setActionType('');
// //     setActionDetails('');
// //     setFilterOptions([]);
// //   };

// //   const alphabeticalGroups = useMemo(() => {
// //     const groups = {};
// //     filteredData.forEach(func => {
// //       const firstLetter = func.name[0].toUpperCase();
// //       if (!groups[firstLetter]) groups[firstLetter] = [];
// //       groups[firstLetter].push(func);
// //     });
// //     return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
// //   }, [filteredData]);

// //   return (
// //     <div className={styles.functionsContainer}>
// //       <div className={styles.leftSide}>
// //         <div className={styles.controls}>
// //           <select 
// //             onChange={handleFilterTypeChange} 
// //             value={filterType}
// //             className={styles.filterSelect}
// //           >
// //             {filterTypes.map(type => (
// //               <option key={type.value} value={type.value}>{type.label}</option>
// //             ))}
// //           </select>

// //           {filterType && filterType !== 'action' && (
// //             filterType === 'name' ? (
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
// //                 <option value="">Select {filterType.replace(/_/g, ' ')}</option>
// //                 {filterOptions.map((option, index) => (
// //                   <option key={index} value={option}>{option}</option>
// //                 ))}
// //               </select>
// //             )
// //           )}

// //           {filterType === 'action' && (
// //             <>
// //               <select 
// //                 onChange={handleActionTypeChange} 
// //                 value={actionType}
// //                 className={styles.filterSelect}
// //               >
// //                 <option value="">Select Action Type</option>
// //                 {actionTypes.map(type => (
// //                   <option key={type} value={type}>{type}</option>
// //                 ))}
// //               </select>

// //               {actionType && (
// //                 <select
// //                   onChange={(e) => setActionDetails(e.target.value)}
// //                   value={actionDetails}
// //                   className={styles.filterSelect}
// //                 >
// //                   <option value="">Select Action Details</option>
// //                   {categories[actionType].map(detail => (
// //                     <option key={detail} value={detail}>{detail}</option>
// //                   ))}
// //                 </select>
// //               )}
// //             </>
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
// //                     {func.name}
// //                     <span className={styles.tooltip}>{func.docstring}</span>
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

// // export default PythonFunctionsList;
// 'use client'
// import React, { useState, useMemo } from 'react';
// import styles from './PythonFunctionsList.module.css';

// const PythonFunctionsList = ({ data }) => {
//   const [filter, setFilter] = useState('');
//   const [filterType, setFilterType] = useState('');
//   const [filterOptions, setFilterOptions] = useState([]);
//   const [actionType, setActionType] = useState('');
//   const [actionDetails, setActionDetails] = useState('');

//   const filterTypes = [
//     { value: "", label: "Select filter type" },
//     { value: "name", label: "Function Name" },
//     { value: "module", label: "Module" },
//     { value: "return_type", label: "Return Type" },
//     { value: "data_type_manipulated", label: "Data Type" },
//     { value: "action", label: "Action" },
//   ];

//   const categories = useMemo(() => {
//     const cats = {};
//     data.forEach(item => {
//       if (item.main_category) {
//         if (!cats[item.main_category]) {
//           cats[item.main_category] = new Set();
//         }
//         if (item.sub_category) {
//           cats[item.main_category].add(item.sub_category);
//         }
//       }
//     });
//     Object.keys(cats).forEach(key => {
//       cats[key] = Array.from(cats[key]).sort();
//     });
//     return cats;
//   }, [data]);

//   const actionTypes = useMemo(() => Object.keys(categories).sort(), [categories]);

//   const handleFilterTypeChange = (e) => {
//     const selectedType = e.target.value;
//     setFilterType(selectedType);
//     setFilter('');
//     setActionType('');
//     setActionDetails('');

//     if (selectedType && selectedType !== 'name' && selectedType !== 'action') {
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

//   const handleActionTypeChange = (e) => {
//     setActionType(e.target.value);
//     setActionDetails('');
//   };

//   const filteredData = useMemo(() => {
//     return data.filter(item => {
//       if (filterType === 'action') {
//         return (!actionType || item.main_category === actionType) &&
//                (!actionDetails || item.sub_category === actionDetails);
//       } else if (filterType && filter) {
//         const value = item[filterType];
//         if (value === undefined || value === null) return false;
        
//         const normalizeString = (str) => str.toString().toLowerCase().trim();
//         const normalizedFilter = normalizeString(filter);
        
//         if (Array.isArray(value)) {
//           return value.some(v => normalizeString(v).includes(normalizedFilter));
//         } else {
//           return normalizeString(value).includes(normalizedFilter);
//         }
//       }
//       return true;
//     });
//   }, [filterType, filter, actionType, actionDetails, data]);

//   const handleReset = () => {
//     setFilter('');
//     setFilterType('');
//     setActionType('');
//     setActionDetails('');
//     setFilterOptions([]);
//   };

//   const functionCounts = useMemo(() => {
//     const counts = {};
//     data.forEach(func => {
//       counts[func.name] = (counts[func.name] || 0) + 1;
//     });
//     return counts;
//   }, [data]);

//   const alphabeticalGroups = useMemo(() => {
//     const groups = {};
//     filteredData.forEach(func => {
//       const firstLetter = func.name[0].toUpperCase();
//       if (!groups[firstLetter]) groups[firstLetter] = [];
//       groups[firstLetter].push(func);
//     });
//     return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
//   }, [filteredData]);

//   return (
//     <div className={styles.functionsContainer}>
//       <div className={styles.leftSide}>
//         <div className={styles.controls}>
//           <select 
//             onChange={handleFilterTypeChange} 
//             value={filterType}
//             className={styles.filterSelect}
//           >
//             {filterTypes.map(type => (
//               <option key={type.value} value={type.value}>{type.label}</option>
//             ))}
//           </select>

//           {filterType && filterType !== 'action' && (
//             filterType === 'name' ? (
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

//           {filterType === 'action' && (
//             <>
//               <select 
//                 onChange={handleActionTypeChange} 
//                 value={actionType}
//                 className={styles.filterSelect}
//               >
//                 <option value="">Select Action Type</option>
//                 {actionTypes.map(type => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>

//               {actionType && (
//                 <select
//                   onChange={(e) => setActionDetails(e.target.value)}
//                   value={actionDetails}
//                   className={styles.filterSelect}
//                 >
//                   <option value="">Select Action Details</option>
//                   {categories[actionType].map(detail => (
//                     <option key={detail} value={detail}>{detail}</option>
//                   ))}
//                 </select>
//               )}
//             </>
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
//                     {func.name}
//                     {functionCounts[func.name] > 1 && (
//                       <span className={styles.dataTypeIndicator}>
//                         ({func.data_type_manipulated[0]})
//                       </span>
//                     )}
//                     <span className={styles.tooltip}>{func.docstring}</span>
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

// export default PythonFunctionsList;
'use client'
import React, { useState, useMemo } from 'react';
import styles from './PythonFunctionsList.module.css';

const PythonFunctionsList = ({ data }) => {
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterOptions, setFilterOptions] = useState([]);
  const [actionType, setActionType] = useState('');
  const [actionDetails, setActionDetails] = useState('');

  const filterTypes = [
    { value: "", label: "Select filter type" },
    { value: "name", label: "Function Name" },
    { value: "module", label: "Module" },
    { value: "return_type", label: "Return Type" },
    { value: "data_type_manipulated", label: "Data Type" },
    { value: "action", label: "Action" },
  ];

  const categories = useMemo(() => {
    const cats = {};
    data.forEach(item => {
      if (item.main_category) {
        if (!cats[item.main_category]) {
          cats[item.main_category] = new Set();
        }
        if (item.sub_category) {
          cats[item.main_category].add(item.sub_category);
        }
      }
    });
    Object.keys(cats).forEach(key => {
      cats[key] = Array.from(cats[key]).sort();
    });
    return cats;
  }, [data]);

  const actionTypes = useMemo(() => Object.keys(categories).sort(), [categories]);

  const handleFilterTypeChange = (e) => {
    const selectedType = e.target.value;
    setFilterType(selectedType);
    setFilter('');
    setActionType('');
    setActionDetails('');

    if (selectedType && selectedType !== 'name' && selectedType !== 'action') {
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

  const handleActionTypeChange = (e) => {
    setActionType(e.target.value);
    setActionDetails('');
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (filterType === 'action') {
        return (!actionType || item.main_category === actionType) &&
               (!actionDetails || item.sub_category === actionDetails);
      } else if (filterType && filter) {
        const value = item[filterType];
        if (value === undefined || value === null) return false;
        
        const normalizeString = (str) => str.toString().toLowerCase().trim();
        const normalizedFilter = normalizeString(filter);
        
        if (Array.isArray(value)) {
          return value.some(v => normalizeString(v).includes(normalizedFilter));
        } else {
          return normalizeString(value).includes(normalizedFilter);
        }
      }
      return true;
    });
  }, [filterType, filter, actionType, actionDetails, data]);

  const handleReset = () => {
    setFilter('');
    setFilterType('');
    setActionType('');
    setActionDetails('');
    setFilterOptions([]);
  };

  const functionCounts = useMemo(() => {
    const counts = {};
    data.forEach(func => {
      counts[func.name] = (counts[func.name] || 0) + 1;
    });
    return counts;
  }, [data]);

  const alphabeticalGroups = useMemo(() => {
    const groups = {};
    filteredData.forEach(func => {
      const firstLetter = func.name[0].toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(func);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredData]);

  const columns = useMemo(() => {
    const cols = [[], [], []];
    let totalFunctions = filteredData.length;
    let functionsPerColumn = Math.ceil(totalFunctions / 3);
    
    let currentColumn = 0;
    alphabeticalGroups.forEach(([letter, functions]) => {
      if (cols[currentColumn].length >= functionsPerColumn && currentColumn < 2) {
        currentColumn++;
      }
      cols[currentColumn].push([letter, functions]);
    });
    
    return cols;
  }, [alphabeticalGroups, filteredData]);

  return (
    <div className={styles.functionsContainer}>
      <div className={styles.leftSide}>
        <div className={styles.controls}>
          <select 
            onChange={handleFilterTypeChange} 
            value={filterType}
            className={styles.filterSelect}
          >
            {filterTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {filterType && filterType !== 'action' && (
            filterType === 'name' ? (
              <input
                type="text"
                placeholder="Type function name..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={styles.filterInput}
              />
            ) : (
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
            )
          )}

          {filterType === 'action' && (
            <>
              <select 
                onChange={handleActionTypeChange} 
                value={actionType}
                className={styles.filterSelect}
              >
                <option value="">Select Action Type</option>
                {actionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {actionType && (
                <select
                  onChange={(e) => setActionDetails(e.target.value)}
                  value={actionDetails}
                  className={styles.filterSelect}
                >
                  <option value="">Select Action Details</option>
                  {categories[actionType].map(detail => (
                    <option key={detail} value={detail}>{detail}</option>
                  ))}
                </select>
              )}
            </>
          )}

          <button onClick={handleReset} className={styles.resetButton}>Reset</button>
        </div>

        <div className={styles.functionColumns}>
          {columns.map((column, colIndex) => (
            <div key={colIndex} className={styles.functionColumn}>
              {column.map(([letter, functions]) => (
                <div key={letter} className={styles.letterGroup}>
                  <h3 className={styles.letterHeading}>{letter}</h3>
                  <ul className={styles.functionList}>
                    {functions.map((func, index) => (
                      <li key={index} className={styles.listItem}>
                        {func.name}
                        {functionCounts[func.name] > 1 && (
                          <span className={styles.dataTypeIndicator}>
                            ({func.data_type_manipulated[0]})
                          </span>
                        )}
                        <span className={styles.tooltip}>{func.docstring}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.rightSide}></div>
    </div>
  );
};

export default PythonFunctionsList;