// 'use client'
// import React, { useState, useMemo } from 'react';
// import styles from './PythonFunctionsList.module.css';

// const PythonFunctionsList = ({ data }) => {
//   const [filter, setFilter] = useState('');
//   const [filterType, setFilterType] = useState('');
//   const [filterOptions, setFilterOptions] = useState([]);

//   const filterTypes = [
//     { value: "", label: "Select filter type" },
//     { value: "name", label: "Function Name" },
//     { value: "module", label: "Module" },
//     { value: "class_name", label: "Class" },
//     { value: "return_type", label: "Return Type" },
//     { value: "main_category", label: "Main Category" },
//     { value: "sub_category", label: "Sub Category" },
//     { value: "data_type_manipulated", label: "Data Type" },
//   ];

//   const handleFilterTypeChange = (e) => {
//     const selectedType = e.target.value;
//     setFilterType(selectedType);
//     setFilter('');

//     if (selectedType && selectedType !== 'name') {
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
//       const firstLetter = func.name[0].toUpperCase();
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
//             {filterTypes.map(type => (
//               <option key={type.value} value={type.value}>{type.label}</option>
//             ))}
//           </select>

//           {filterType && (
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

//           <button onClick={handleReset} className={styles.resetButton}>Reset</button>
//         </div>

//         <div className={styles.functionGroups}>
//           {alphabeticalGroups.map(([letter, functions]) => (
//             <div key={letter} className={styles.letterGroup}>
//               <h3 className={styles.letterHeading}>{letter}</h3>
//               <ul className={styles.functionList}>
//                 {functions.map((func, index) => (
//                   <li key={index} className={styles.listItem}>
//                     <h4>{func.name}</h4>
//                     <p>Module: {func.module}</p>
//                     {func.class_name && <p>Class: {func.class_name}</p>}
//                     <p>Description: {func.docstring}</p>
//                     {func.decorators.length > 0 && (
//                       <p>Decorators: {func.decorators.join(', ')}</p>
//                     )}
//                     <p>Parameters: {func.parameters.map(p => `${p.name}: ${p.type}`).join(', ')}</p>
//                     {func.return_type && <p>Return Type: {func.return_type}</p>}
//                     <p>Category: {func.main_category} - {func.sub_category}</p>
//                     {func.deprecated && <p className={styles.deprecated}>Deprecated</p>}
//                     {func.examples && func.examples.length > 0 && (
//                       <div className={styles.examples}>
//                         <h5>Examples:</h5>
//                         {func.examples.map((example, i) => (
//                           <pre key={i}>{example}</pre>
//                         ))}
//                       </div>
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

  const filterTypes = [
    { value: "", label: "Select filter type" },
    { value: "name", label: "Function Name" },
    { value: "module", label: "Module" },
    { value: "return_type", label: "Return Type" },
    { value: "main_category", label: "Main Category" },
    { value: "sub_category", label: "Sub Category" },
    { value: "data_type_manipulated", label: "Data Type" },
  ];

  const handleFilterTypeChange = (e) => {
    const selectedType = e.target.value;
    setFilterType(selectedType);
    setFilter('');

    if (selectedType && selectedType !== 'name') {
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
    if (!filterType || !filter) return data;
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
  }, [filter, filterType, data]);

  const alphabeticalGroups = useMemo(() => {
    const groups = {};
    filteredData.forEach(func => {
      const firstLetter = func.name[0].toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(func);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredData]);

  const handleReset = () => {
    setFilter('');
    setFilterType('');
    setFilterOptions([]);
  };

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

          {filterType && (
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

          <button onClick={handleReset} className={styles.resetButton}>Reset</button>
        </div>

        <div className={styles.functionGroups}>
          {alphabeticalGroups.map(([letter, functions]) => (
            <div key={letter} className={styles.letterGroup}>
              <h3 className={styles.letterHeading}>{letter}</h3>
              <ul className={styles.functionList}>
                {functions.map((func, index) => (
                  <li key={index} className={styles.listItem}>
                    {func.name}
                    <span className={styles.tooltip}>{func.docstring}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.rightSide}>Right Side</div>
    </div>
  );
};

export default PythonFunctionsList;