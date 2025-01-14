// // // // 'use client';

// // // // import React, { useState, useMemo } from 'react';
// // // // import CodeExampleAccordion from './CodeExampleAccordion';

// // // // const CodeExampleWrapper = ({ data, ...props }) => {
// // // //   const [searchTerm, setSearchTerm] = useState('');

// // // //   const groupedAndFilteredData = useMemo(() => {
// // // //     return data.reduce((acc, item) => {
// // // //       const category = item.sub_category;
// // // //       const matchesSearch = 
// // // //         item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //         item.explanation.toLowerCase().includes(searchTerm.toLowerCase());

// // // //       if (matchesSearch) {
// // // //         if (!acc[category]) {
// // // //           acc[category] = [];
// // // //         }
// // // //         acc[category].push(item);
// // // //       }

// // // //       return acc;
// // // //     }, {});
// // // //   }, [data, searchTerm]);

// // // //   return (
// // // //     <div>
// // // //       <input
// // // //         type="text"
// // // //         value={searchTerm}
// // // //         onChange={(e) => setSearchTerm(e.target.value)}
// // // //         placeholder="Search examples..."
// // // //       />

// // // //       {Object.entries(groupedAndFilteredData).map(([category, items]) => (
// // // //         <div key={category}>
// // // //           <h3>{category}</h3>
// // // //           <CodeExampleAccordion data={items} {...props} />
// // // //         </div>
// // // //       ))}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default CodeExampleWrapper;
// // // 'use client';

// // // import React, { useState, useMemo } from 'react';

// // // const CodeExampleWrapper = ({ WrappedComponent, data, groupByField }) => {
// // //   const [searchTerm, setSearchTerm] = useState('');

// // //   const groupedAndFilteredData = useMemo(() => {
// // //     return data.reduce((acc, item) => {
// // //       const matchesSearch = 
// // //         item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         item.explanation.toLowerCase().includes(searchTerm.toLowerCase());

// // //       if (matchesSearch) {
// // //         const key = item[groupByField];
// // //         if (!acc[key]) {
// // //           acc[key] = [];
// // //         }
// // //         acc[key].push(item);
// // //       }

// // //       return acc;
// // //     }, {});
// // //   }, [data, searchTerm, groupByField]);

// // //   return (
// // //     <div>
// // //       <input
// // //         type="text"
// // //         value={searchTerm}
// // //         onChange={(e) => setSearchTerm(e.target.value)}
// // //         placeholder="Search examples..."
// // //       />

// // //       {Object.entries(groupedAndFilteredData).map(([group, items]) => (
// // //         <div key={group}>
// // //           <h3>{group}</h3>
// // //           <WrappedComponent data={items} />
// // //         </div>
// // //       ))}
// // //     </div>
// // //   );
// // // };

// // // export default CodeExampleWrapper;
// // 'use client';

// // import React, { useState, useMemo } from 'react';
// // import styles from './CodeExampleWrapper.module.css';

// // const CodeExampleWrapper = ({ WrappedComponent, data, groupByField }) => {
// //   const [searchTerm, setSearchTerm] = useState('');

// //   const groupedAndFilteredData = useMemo(() => {
// //     return data.reduce((acc, item) => {
// //       const matchesSearch = 
// //         item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         item.explanation.toLowerCase().includes(searchTerm.toLowerCase());

// //       if (matchesSearch) {
// //         const key = item[groupByField];
// //         if (!acc[key]) {
// //           acc[key] = [];
// //         }
// //         acc[key].push(item);
// //       }

// //       return acc;
// //     }, {});
// //   }, [data, searchTerm, groupByField]);

// //   return (
// //     <div className={styles.wrapper}>
// //       <input
// //         type="text"
// //         value={searchTerm}
// //         onChange={(e) => setSearchTerm(e.target.value)}
// //         placeholder="Search examples..."
// //         className={styles.searchInput}
// //       />

// //       {Object.entries(groupedAndFilteredData).map(([group, items]) => (
// //         <div key={group} className={styles.group}>
// //           <h3 className={styles.groupTitle}>{group}</h3>
// //           <div className={styles.groupContent}>
// //             <WrappedComponent data={items} />
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default CodeExampleWrapper;
// 'use client';

// import React, { useState, useMemo } from 'react';
// import styles from './CodeExampleWrapper.module.css';

// const CodeExampleWrapper = ({ WrappedComponent, data, groupByField }) => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const groupedAndFilteredData = useMemo(() => {
//     return data.reduce((acc, item) => {
//       const matchesSearch = 
//         item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.explanation.toLowerCase().includes(searchTerm.toLowerCase());

//       if (matchesSearch) {
//         const key = item[groupByField];
//         if (!acc[key]) {
//           acc[key] = [];
//         }
//         acc[key].push(item);
//       }

//       return acc;
//     }, {});
//   }, [data, searchTerm, groupByField]);

//   return (
//     <div className={styles.wrapper}>
//       <input
//         type="text"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         placeholder="Search examples..."
//         className={styles.searchInput}
//       />

//       {Object.entries(groupedAndFilteredData).map(([group, items]) => (
//         <div key={group} className={styles.group}>
//           <h3 className={styles.groupHeader}>{group}</h3>
//           <div className={styles.groupContent}>
//             <WrappedComponent data={items} />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CodeExampleWrapper;
'use client';

import React, { useState, useMemo } from 'react';
import styles from './CodeExampleWrapper.module.css';
import { capitalizeWords } from '@/utils/functions';
import { X } from 'lucide-react'; 

const CodeExampleWrapper = ({ WrappedComponent, data, groupByField ,link }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const groupedAndFilteredData = useMemo(() => {
    return data.reduce((acc, item) => {
      const matchesSearch =
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.explanation?.toLowerCase().includes(searchTerm.toLowerCase());

      if (matchesSearch) {
        const key = item[groupByField];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
      }

      return acc;
    }, {});
  }, [data, searchTerm, groupByField]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className={styles.wrapper}>
      {/* <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search examples..."
        className={styles.searchInput}
      /> */}

<div className={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search examples..."
          className={styles.searchInput}
        />
        {searchTerm && (
          <button onClick={clearSearch} className={styles.clearButton}>
            <X size={20} className={styles.clearIcon} />
          </button>
        )}
      </div>

      {Object.entries(groupedAndFilteredData).map(([group, items], groupIndex) => (
        <div key={group} className={styles.group} id={group.toLowerCase().replaceAll(' ','-')}>
            <br></br>
            <br></br>
            <br></br>
          <h3 className={styles.groupHeader}>{capitalizeWords(group)}</h3>
          <div className={styles.groupContent}>
            <WrappedComponent 
              data={items} 
              idPrefix={`group${groupIndex}-`} 
              link={link}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CodeExampleWrapper;