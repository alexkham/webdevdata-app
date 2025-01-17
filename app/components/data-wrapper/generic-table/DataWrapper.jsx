

// // // import React, { useState, useMemo } from 'react';
// // // import ExpandableTable from './ExpandableTable';
// // // import { ChevronDown, ChevronUp } from 'lucide-react';
// // // import styles from './DataWrapper.module.css';

// // // export default function DataWrapper({ data }) {
// // //   const [selectedSections, setSelectedSections] = useState([]);
// // //   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
// // //   const [searchQuery, setSearchQuery] = useState('');

// // //   // Extract section keys
// // //   const sections = useMemo(
// // //     () => Object.keys(data).filter((key) => Array.isArray(data[key])),
// // //     [data]
// // //   );

// // //   // Process data based on selected sections and search query
// // //   const processedData = useMemo(() => {
// // //     let result = [];
// // //     const sectionsToProcess =
// // //       selectedSections.length > 0 ? selectedSections : sections;

// // //     sectionsToProcess.forEach((section) => {
// // //       if (data[section]) {
// // //         result = result.concat(data[section]);
// // //       }
// // //     });

// // //     // Ensure `result` has the structure expected by `ExpandableTable`
// // //     return result
// // //       .filter((item) =>
// // //         Object.values(item).some((value) =>
// // //           String(value).toLowerCase().includes(searchQuery.toLowerCase())
// // //         )
// // //       )
// // //       .map((row) => ({
// // //         id: row.id || Math.random().toString(36).substr(2, 9), // Ensure unique IDs
// // //         ...row,
// // //       }));
// // //   }, [data, selectedSections, sections, searchQuery]);

// // //   const toggleSection = (section) => {
// // //     setSelectedSections((prev) =>
// // //       prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
// // //     );
// // //   };

// // //   const deselectSection = (section) => {
// // //     setSelectedSections((prev) => prev.filter((s) => s !== section));
// // //   };

// // //   const selectAll = () => setSelectedSections(sections);

// // //   const clearAll = () => {
// // //     setSelectedSections([]);
// // //     setSearchQuery('');
// // //   };

// // //   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

// // //   const clearSearch = () => setSearchQuery('');

// // //   return (
// // //     <div className={styles.container}>
// // //       {/* Controls Section */}
// // //       <div className={styles.topControls}>
// // //         {/* Search Bar */}
// // //         <div className={styles.searchWrapper}>
// // //           <input
// // //             type="text"
// // //             placeholder="Search..."
// // //             value={searchQuery}
// // //             onChange={(e) => setSearchQuery(e.target.value)}
// // //             className={styles.searchBar}
// // //           />
// // //           {searchQuery && (
// // //             <button
// // //               className={styles.clearSearchButton}
// // //               onClick={clearSearch}
// // //               aria-label="Clear Search"
// // //             >
// // //               ✖
// // //             </button>
// // //           )}
// // //         </div>

// // //         {/* Main Buttons */}
// // //         <button
// // //           onClick={selectAll}
// // //           className={`${styles.controlButton} ${styles.selectButton}`}
// // //         >
// // //           Select All
// // //         </button>
// // //         <button
// // //           onClick={clearAll}
// // //           className={`${styles.controlButton} ${styles.clearButton}`}
// // //         >
// // //           Clear All
// // //         </button>
// // //         <button onClick={toggleDropdown} className={styles.chevronButton}>
// // //           {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
// // //           {isDropdownOpen ?'Hide Categories':'Show Categories'}
// // //         </button>
// // //       </div>

// // //       {/* Dropdown Section */}
// // //       <div
// // //         className={`${styles.sectionButtons} ${
// // //           isDropdownOpen ? styles.show : ''
// // //         }`}
// // //       >
// // //         {sections.map((section) => (
// // //           <button
// // //             key={section}
// // //             onClick={() => toggleSection(section)}
// // //             className={`${styles.sectionButton} ${
// // //               selectedSections.includes(section) ? styles.active : ''
// // //             }`}
// // //           >
// // //             <span className={styles.sectionText}>
// // //               {section.replace(/_/g, ' ')}
// // //             </span>
// // //             {selectedSections.includes(section) && (
// // //               <span
// // //                 className={styles.closeButton}
// // //                 onClick={(e) => {
// // //                   e.stopPropagation(); // Prevent parent button toggle
// // //                   deselectSection(section);
// // //                 }}
// // //               >
// // //                 ✖
// // //               </span>
// // //             )}
// // //           </button>
// // //         ))}
// // //       </div>

// // //       {/* Table Section */}
// // //       <div className={styles.tableWrapper}>
// // //         <ExpandableTable
// // //           data={processedData}
// // //           includedFields={['symbol', 'latex_code', 'explanation', 'content']} // Ensure fields align with child expectations
// // //           copyableFields={['symbol', 'latex_code']}
// // //           nestedCopyableFields={['content']}
// // //         />
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // import React, { useState, useMemo } from 'react';
// // import ExpandableTable from './ExpandableTable';
// // import { ChevronDown, ChevronUp } from 'lucide-react';
// // import styles from './DataWrapper.module.css';

// // export default function DataWrapper({ 
// //   data,
// //   excludeFromDisplay = ['id', 'content'], // Fields to never show in main table
// //   copyableFields = [], // Optional - fields that can be copied
// //   nestedCopyableFields = [] // Optional - expandable content fields that can be copied
// // }) {
// //   const [selectedSections, setSelectedSections] = useState([]);
// //   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState('');

// //   // Get all sections that contain arrays
// //   const sections = useMemo(
// //     () => Object.keys(data).filter((key) => Array.isArray(data[key])),
// //     [data]
// //   );

// //   // Dynamically determine available fields from the data
// //   const availableFields = useMemo(() => {
// //     const fields = new Set();
// //     sections.forEach(section => {
// //       if (data[section] && data[section].length > 0) {
// //         Object.keys(data[section][0] || {}).forEach(field => {
// //           if (!excludeFromDisplay.includes(field)) {
// //             fields.add(field);
// //           }
// //         });
// //       }
// //     });
// //     return Array.from(fields);
// //   }, [data, sections, excludeFromDisplay]);

// //   // Process data based on selected sections and search
// //   const processedData = useMemo(() => {
// //     let result = [];
// //     const sectionsToProcess = selectedSections.length > 0 ? selectedSections : sections;

// //     sectionsToProcess.forEach((section) => {
// //       if (data[section] && Array.isArray(data[section])) {
// //         result = result.concat(data[section]);
// //       }
// //     });

// //     if (searchQuery) {
// //       result = result.filter((item) =>
// //         availableFields.some((field) => {
// //           const value = item[field];
// //           return value != null && 
// //             String(value).toLowerCase().includes(searchQuery.toLowerCase());
// //         })
// //       );
// //     }

// //     return result;
// //   }, [data, selectedSections, sections, searchQuery, availableFields]);

// //   const toggleSection = (section) => {
// //     setSelectedSections((prev) =>
// //       prev.includes(section) 
// //         ? prev.filter((s) => s !== section) 
// //         : [...prev, section]
// //     );
// //   };

// //   if (!sections.length || !availableFields.length) {
// //     return <div className={styles.noData}>No valid data available</div>;
// //   }

// //   return (
// //     <div className={styles.container}>
// //       <div className={styles.topControls}>
// //         <div className={styles.searchWrapper}>
// //           <input
// //             type="text"
// //             placeholder="Search..."
// //             value={searchQuery}
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //             className={styles.searchBar}
// //           />
// //           {searchQuery && (
// //             <button
// //               className={styles.clearSearchButton}
// //               onClick={() => setSearchQuery('')}
// //               aria-label="Clear Search"
// //             >
// //               ✖
// //             </button>
// //           )}
// //         </div>
        

// //         <button
// //           onClick={() => setSelectedSections(sections)}
// //           className={`${styles.controlButton} ${styles.selectButton}`}
// //         >
// //           Select All
// //         </button>
// //         <button
// //           onClick={() => {
// //             setSelectedSections([]);
// //             setSearchQuery('');
// //           }}
// //           className={`${styles.controlButton} ${styles.clearButton}`}
// //         >
// //           Clear All
// //         </button>
// //         <button 
// //           onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
// //           className={styles.chevronButton}
// //         >
// //           {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
// //           {isDropdownOpen ? 'Hide Categories' : 'Show Categories'}
// //         </button>
// //       </div>

// //       <div
// //         className={`${styles.sectionButtons} ${
// //           isDropdownOpen ? styles.show : ''
// //         }`}
// //       >
// //         {sections.map((section) => (
// //           <button
// //             key={section}
// //             onClick={() => toggleSection(section)}
// //             className={`${styles.sectionButton} ${
// //               selectedSections.includes(section) ? styles.active : ''
// //             }`}
// //           >
// //             <span className={styles.sectionText}>
// //               {section.replace(/_/g, ' ')}
// //             </span>
// //             {selectedSections.includes(section) && (
// //               <span
// //                 className={styles.closeButton}
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   setSelectedSections(prev => 
// //                     prev.filter(s => s !== section)
// //                   );
// //                 }}
// //               >
// //                 ✖
// //               </span>
// //             )}
// //           </button>
// //         ))}
// //       </div>

// //       <div className={styles.tableWrapper}>
// //         <ExpandableTable
// //           data={processedData}
// //           includedFields={availableFields}
// //           copyableFields={copyableFields}
// //           nestedCopyableFields={nestedCopyableFields}
// //         />
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useState, useMemo } from 'react';
// import ExpandableTable from './ExpandableTable';
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import styles from './DataWrapper.module.css';

// export default function DataWrapper({ 
//   data,
//   config = {
//     displayColumns: [], // Controls what columns are shown - REQUIRED
//     copyableFields: [], // Fields that can be copied
//     nestedCopyableFields: [], // Content fields that can be copied
//     searchableFields: [] // Fields to search in
//   }
// }) {
//   const [selectedSections, setSelectedSections] = useState([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   // Extract valid section keys (must be arrays)
//   const sections = useMemo(
//     () => Object.keys(data).filter((key) => Array.isArray(data[key])),
//     [data]
//   );

//   // Process data based on selected sections and search query
//   const processedData = useMemo(() => {
//     if (!sections.length) return [];
    
//     let result = [];
//     const sectionsToProcess = selectedSections.length > 0 ? selectedSections : sections;

//     // Combine data from selected sections
//     sectionsToProcess.forEach((section) => {
//       if (data[section] && Array.isArray(data[section])) {
//         result = result.concat(
//           data[section].map(item => ({
//             id: item.id || Math.random().toString(36).substr(2, 9),
//             ...item
//           }))
//         );
//       }
//     });

//     if (!result.length) return [];

//     // Filter based on search query - use ONLY searchableFields from config
//     return searchQuery && config.searchableFields.length > 0
//       ? result.filter((item) =>
//           config.searchableFields.some((field) => {
//             const value = item[field];
//             return value != null && 
//               String(value).toLowerCase().includes(searchQuery.toLowerCase());
//           })
//         )
//       : result;
//   }, [data, selectedSections, sections, searchQuery, config.searchableFields]);

//   const toggleSection = (section) => {
//     setSelectedSections((prev) =>
//       prev.includes(section) 
//         ? prev.filter((s) => s !== section) 
//         : [...prev, section]
//     );
//   };

//   const deselectSection = (section) => {
//     setSelectedSections((prev) => prev.filter((s) => s !== section));
//   };

//   const selectAll = () => setSelectedSections(sections);
//   const clearAll = () => {
//     setSelectedSections([]);
//     setSearchQuery('');
//   };

//   // Don't render if no data or no display columns specified
//   if (!sections.length || !config.displayColumns.length) {
//     return <div className={styles.noData}>
//       {!sections.length ? 'No data available' : 'No columns specified for display'}
//     </div>;
//   }

//   return (
//     <div className={styles.container}>
//       {/* Controls Section */}
//       <div className={styles.topControls}>
//         <div className={styles.searchWrapper}>
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className={styles.searchBar}
//           />
//           {searchQuery && (
//             <button
//               className={styles.clearSearchButton}
//               onClick={() => setSearchQuery('')}
//               aria-label="Clear Search"
//             >
//               ✖
//             </button>
//           )}
//         </div>

//         <button
//           onClick={selectAll}
//           className={`${styles.controlButton} ${styles.selectButton}`}
//         >
//           Select All
//         </button>
//         <button
//           onClick={clearAll}
//           className={`${styles.controlButton} ${styles.clearButton}`}
//         >
//           Clear All
//         </button>
//         <button 
//           onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
//           className={styles.chevronButton}
//         >
//           {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//           {isDropdownOpen ? 'Hide Categories' : 'Show Categories'}
//         </button>
//       </div>

//       {/* Dropdown Section */}
//       <div
//         className={`${styles.sectionButtons} ${
//           isDropdownOpen ? styles.show : ''
//         }`}
//       >
//         {sections.map((section) => (
//           <button
//             key={section}
//             onClick={() => toggleSection(section)}
//             className={`${styles.sectionButton} ${
//               selectedSections.includes(section) ? styles.active : ''
//             }`}
//           >
//             <span className={styles.sectionText}>
//               {section.replace(/_/g, ' ')}
//             </span>
//             {selectedSections.includes(section) && (
//               <span
//                 className={styles.closeButton}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   deselectSection(section);
//                 }}
//               >
//                 ✖
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Table Section */}
//       <div className={styles.tableWrapper}>
//         <ExpandableTable
//           data={processedData}
//           includedFields={config.displayColumns}
//           copyableFields={config.copyableFields || []}
//           nestedCopyableFields={config.nestedCopyableFields || []}
//         />
//       </div>
//     </div>
//   );
// }


import React, { useState, useMemo } from 'react';
import ExpandableTable from './ExpandableTable';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './DataWrapper.module.css';

export default function DataWrapper({ 
  data,
  config = {
    displayColumns: [], // Controls what columns are shown
    copyableFields: [], // Fields that can be copied
    nestedCopyableFields: [], // Content fields that can be copied
    searchableFields: [] // Fields to search in
  }
}) {
  const [selectedSections, setSelectedSections] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract valid section keys (must be arrays)
  const sections = useMemo(
    () => Object.keys(data).filter((key) => Array.isArray(data[key])),
    [data]
  );

  // Process data based on selected sections and search query
  const processedData = useMemo(() => {
    if (!sections.length) return [];
    
    let result = [];
    const sectionsToProcess = selectedSections.length > 0 ? selectedSections : sections;

    // Combine data from selected sections
    sectionsToProcess.forEach((section) => {
      if (data[section] && Array.isArray(data[section])) {
        result = result.concat(
          data[section].map(item => ({
            id: item.id || Math.random().toString(36).substr(2, 9),
            ...item
          }))
        );
      }
    });

    if (!result.length) return [];

    // Filter based on search query - use ONLY searchableFields from config
    return searchQuery && config.searchableFields.length > 0
      ? result.filter((item) =>
          config.searchableFields.some((field) => {
            const value = item[field];
            return value != null && 
              String(value).toLowerCase().includes(searchQuery.toLowerCase());
          })
        )
      : result;
  }, [data, selectedSections, sections, searchQuery, config.searchableFields]);

  const toggleSection = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section) 
        ? prev.filter((s) => s !== section) 
        : [...prev, section]
    );
  };

  const deselectSection = (section) => {
    setSelectedSections((prev) => prev.filter((s) => s !== section));
  };

  const selectAll = () => setSelectedSections(sections);
  const clearAll = () => {
    setSelectedSections([]);
    setSearchQuery('');
  };

  // Don't render if no data or no display columns specified
  if (!sections.length || !config.displayColumns.length) {
    return <div className={styles.noData}>
      {!sections.length ? 'No data available' : 'No columns specified for display'}
    </div>;
  }

  return (
    <div className={styles.container}>
      {/* Controls Section */}
      <div className={styles.topControls}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchBar}
          />
          {searchQuery && (
            <button
              className={styles.clearSearchButton}
              onClick={() => setSearchQuery('')}
              aria-label="Clear Search"
            >
              ✖
            </button>
          )}
        </div>

        <button
          onClick={selectAll}
          className={`${styles.controlButton} ${styles.selectButton}`}
        >
          Select All
        </button>
        <button
          onClick={clearAll}
          className={`${styles.controlButton} ${styles.clearButton}`}
        >
          Clear All
        </button>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
          className={styles.chevronButton}
        >
          {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isDropdownOpen ? 'Hide Categories' : 'Show Categories'}
        </button>
      </div>

      {/* Dropdown Section */}
      <div
        className={`${styles.sectionButtons} ${
          isDropdownOpen ? styles.show : ''
        }`}
      >
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => toggleSection(section)}
            className={`${styles.sectionButton} ${
              selectedSections.includes(section) ? styles.active : ''
            }`}
          >
            <span className={styles.sectionText}>
              {section.replace(/_/g, ' ')}
            </span>
            {selectedSections.includes(section) && (
              <span
                className={styles.closeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  deselectSection(section);
                }}
              >
                ✖
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className={styles.tableWrapper}>
        <ExpandableTable
          data={processedData}
          includedFields={config.displayColumns}
          copyableFields={config.copyableFields || []}
          nestedCopyableFields={config.nestedCopyableFields || []}
        />
      </div>
    </div>
  );
}