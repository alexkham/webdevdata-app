'use client'
import React, { useState, useMemo, useEffect } from 'react';
import styles from './FunctionList.module.css';
import Link from 'next/link';

const FilterPanel = ({ options = [], selectedOptions = [], onOptionToggle, onReset, onClearOption }) => (
 <div className={styles.filterPanel}>
   <div className={styles.panelOptions}>
     {options.map((option, index) => (
       <button
         key={index}
         className={styles.optionToggle}
         data-selected={selectedOptions.includes(option)}
         onClick={() => onOptionToggle(option)}
       >
         {option}
         {selectedOptions.includes(option) && (
           <span 
             className={styles.clearIcon}
             onClick={(e) => {
               e.stopPropagation();
               onClearOption(option);
             }}
           >
             ×
           </span>
         )}
       </button>
     ))}
   </div>
   <button 
     className={styles.panelReset}
     onClick={onReset}
   >
     Clear Selection
   </button>
 </div>
);

const FunctionList = ({ data }) => {
 const [filter, setFilter] = useState('');
 const [filterType, setFilterType] = useState('');
 const [filterOptions, setFilterOptions] = useState([]);
 const [actionCategories, setActionCategories] = useState([]);  
 const [specificActions, setSpecificActions] = useState({});
 const [selectedActionCategory, setSelectedActionCategory] = useState('');
 const [selectedSpecificAction, setSelectedSpecificAction] = useState('');
 const [activePanel, setActivePanel] = useState('');
 const [selectedOptions, setSelectedOptions] = useState([]);

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

 const handleFilterTypeClick = (type) => {
   if (activePanel === type) {
     setActivePanel('');
     return;
   }

   setActivePanel(type);
   setFilterType(type);
   setFilter('');
   setSelectedOptions([]);
   setSelectedActionCategory('');
   setSelectedSpecificAction('');

   if (type && type !== 'function_name' && type !== 'action') {
     let options = new Set();
     
     data.forEach(item => {
       const values = item[type];
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

 const handleClearOption = (option) => {
   if (filterType === 'action') {
     if (selectedActionCategory === option) {
       setSelectedActionCategory('');
       setSelectedSpecificAction('');
     }
   } else {
     setSelectedOptions(prev => prev.filter(o => o !== option));
   }
 };

 const handleOptionToggle = (option) => {
   if (filterType === 'action') {
     if (selectedActionCategory === option) {
       setSelectedActionCategory('');
       setSelectedSpecificAction('');
     } else {
       setSelectedActionCategory(option);
     }
   } else {
     setSelectedOptions(prev => 
       prev.includes(option) 
         ? prev.filter(o => o !== option)
         : [...prev, option]
     );
     setFilter(option);
   }
 };

 const handlePanelReset = (type) => {
   if (type === 'action') {
     setSelectedActionCategory('');
     setSelectedSpecificAction('');
   } else if (type === 'function_name') {
     setFilter('');
   } else {
     setSelectedOptions([]);
     setFilter('');
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
  
   if (!selectedOptions.length) {
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
   }
  
   return data.filter(item => {
     const value = item[filterType];
     if (value === undefined || value === null) return false;
  
     const normalizeString = (str) => str.toString().toLowerCase().trim();
     
     if (Array.isArray(value)) {
       return value.some(v => 
         selectedOptions.some(option => 
           normalizeString(v).includes(normalizeString(option))
         )
       );
     } else {
       return selectedOptions.some(option => 
         normalizeString(value).includes(normalizeString(option))
       );
     }
   });
 }, [filter, filterType, data, selectedOptions, selectedActionCategory, selectedSpecificAction]);

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
   setActivePanel('');
   setSelectedOptions([]);
 };

 return (
   <div className={styles.functionsContainer}>
     <div className={styles.leftSide}>
       <div className={styles.controlsOuter}>
         <div className={styles.controls}>
           <div className={styles.filterButtons}>
             <button
               className={`${styles.filterButton} ${filterType === 'function_name' ? styles.active : ''}`}
               onClick={() => handleFilterTypeClick('function_name')}
             >
               Function Name
             </button>
             <button
               className={`${styles.filterButton} ${filterType === 'return_type' ? styles.active : ''}`}
               onClick={() => handleFilterTypeClick('return_type')}
             >
               Return Type
             </button>
             <button
               className={`${styles.filterButton} ${filterType === 'parameter_types' ? styles.active : ''}`}
               onClick={() => handleFilterTypeClick('parameter_types')}
             >
               Parameter Types
             </button>
             <button
               className={`${styles.filterButton} ${filterType === 'include_file' ? styles.active : ''}`}
               onClick={() => handleFilterTypeClick('include_file')}
             >
               Header File
             </button>
             <button
               className={`${styles.filterButton} ${filterType === 'data_type_manipulated' ? styles.active : ''}`}
               onClick={() => handleFilterTypeClick('data_type_manipulated')}
             >
               Data Type
             </button>
             <button
               className={`${styles.filterButton} ${filterType === 'action' ? styles.active : ''}`}
               onClick={() => handleFilterTypeClick('action')}
             >
               Action
             </button>
           </div>

           {activePanel && (
             filterType === 'action' ? (
               <FilterPanel
                 options={actionCategories}
                 selectedOptions={[selectedActionCategory]}
                 onOptionToggle={handleOptionToggle}
                 onReset={() => handlePanelReset('action')}
                 onClearOption={handleClearOption}
               />
             ) : filterType === 'function_name' ? (
               <div className={styles.filterPanel}>
                 <input
                   type="text"
                   placeholder="Type function name..."
                   value={filter}
                   onChange={(e) => setFilter(e.target.value)}
                   className={styles.filterInput}
                 />
                 <button 
                   className={styles.panelReset}
                   onClick={() => handlePanelReset('function_name')}
                 >
                   Clear Input
                 </button>
               </div>
             ) : (
               <FilterPanel
                 options={filterOptions}
                 selectedOptions={selectedOptions}
                 onOptionToggle={handleOptionToggle}
                 onReset={() => handlePanelReset(filterType)}
                 onClearOption={handleClearOption}
               />
             )
           )}
            <button onClick={handleReset} className={styles.resetButton}>Reset Search</button>
         </div>
         {/* <button onClick={handleReset} className={styles.resetButton}>Reset Search</button> */}
       </div>

       <div className={styles.functionGroups}>
         {alphabeticalGroups.map(([letter, functions]) => (
           <div key={letter} className={styles.letterGroup}>
             <h3 className={styles.letterHeading}>{letter}</h3>
             <ul className={styles.functionList}>
               {functions.map((func, index) => (
                 <li key={index} className={styles.listItem}>
                   <Link href={`/c-programming/functions/${func.function_name}`}>
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
     <div className={styles.rightSide}></div>
   </div>
 );
};

export default FunctionList;