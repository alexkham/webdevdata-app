// // FunctionComparison.js
// import React, { useState } from 'react';
// import { X, Check, Search } from 'lucide-react';
// import styles from './FunctionComparison.module.css';

// const ComparisonTable = ({ data, leftTitle, rightTitle }) => (
//   <div className={styles.tableContainer}>
//     <div className={styles.titleRow}>
//       <h2>{leftTitle}</h2>
//       <span>VS</span>
//       <h2>{rightTitle}</h2>
//     </div>

//     {data.categories.map((category, index) => (
//       <div key={index} className={styles.categoryContainer}>
//         <div className={styles.categoryHeader}>{category.title}</div>
//         <div className={styles.contentRow}>
//           <div className={styles.columnLeft}>
//             {category.left.points.map((point, idx) => (
//               <div key={idx} className={styles.point}>
//                 <div className={point.included ? styles.checkIcon : styles.crossIcon}>
//                   {point.included ? <Check /> : <X />}
//                 </div>
//                 <span>{point.text}</span>
//               </div>
//             ))}
//           </div>
//           <div className={styles.columnRight}>
//             {category.right.points.map((point, idx) => (
//               <div key={idx} className={styles.point}>
//                 <div className={point.included ? styles.checkIcon : styles.crossIcon}>
//                   {point.included ? <Check /> : <X />}
//                 </div>
//                 <span>{point.text}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// const FunctionComparison = ({ functionData }) => {
//   const [selectedFunction, setSelectedFunction] = useState(null);
//   const [comparedFunction, setComparedFunction] = useState(null);

//   const renderComparison = () => {
//     if (!selectedFunction || !comparedFunction) return null;
//     const comparison = functionData[selectedFunction]?.comparisons[comparedFunction];
//     if (!comparison) return null;

//     return <ComparisonTable 
//       data={comparison}
//       leftTitle={selectedFunction}
//       rightTitle={comparedFunction}
//     />;
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.content}>
//         <div className={styles.sidebar}>
//           <div className={styles.searchContainer}>
//             <input
//               type="text"
//               placeholder="Search functions..."
//               className={styles.searchInput}
//             />
//             <Search className={styles.searchIcon} />
//           </div>
//           <div className={styles.functionList}>
//             {Object.entries(functionData).map(([funcName, func]) => (
//               <div
//                 key={funcName}
//                 className={`${styles.functionItem} ${selectedFunction === funcName ? styles.selected : ''}`}
//                 onClick={() => {
//                   setSelectedFunction(funcName);
//                   setComparedFunction(null);
//                 }}
//               >
//                 <div className={styles.functionName}>{funcName}</div>
//                 <div className={styles.functionDesc}>{func.description}</div>
//                 <div className={styles.functionCategory}>{func.category}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className={styles.mainContent}>
//           {selectedFunction && !comparedFunction && (
//             <div className={styles.similarFunctions}>
//               <h2>Similar to {selectedFunction}</h2>
//               <div className={styles.similarGrid}>
//                 {functionData[selectedFunction].similar.map(funcName => (
//                   <div
//                     key={funcName}
//                     className={styles.similarItem}
//                     onClick={() => setComparedFunction(funcName)}
//                   >
//                     <div className={styles.similarName}>{funcName}</div>
//                     {functionData[funcName] && (
//                       <div className={styles.similarDesc}>
//                         {functionData[funcName].description}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//           {renderComparison()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FunctionComparison;


// ComparisonTable.js
// import React, { useState } from 'react';
// import { X, Check,Search } from 'lucide-react';
// import styles from './FunctionComparison.module.css';

// export const ComparisonTable = ({ functionName, comparisonData }) => {
//   const [selectedComparison, setSelectedComparison] = useState(null);

//   if (!selectedComparison) {
//     return (
//       <div className={styles.similarFunctions}>
//         <h2>Similar to {functionName}</h2>
//         <div className={styles.similarGrid}>
//           {Object.keys(comparisonData).map(funcName => (
//             <div
//               key={funcName}
//               className={styles.similarItem}
//               onClick={() => setSelectedComparison(funcName)}
//             >
//               <div className={styles.similarName}>{funcName}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   const comparison = comparisonData[selectedComparison];
  
//   return (
//     <div className={styles.container}>
//       <button 
//         className={styles.backButton}
//         onClick={() => setSelectedComparison(null)}
//       >
//         ← Back to similar functions
//       </button>
//       <div className={styles.tableContainer}>
//         <div className={styles.titleRow}>
//           <h2>{functionName}</h2>
//           <span>VS</span>
//           <h2>{selectedComparison}</h2>
//         </div>

//         {comparison.categories.map((category, index) => (
//           <div key={index} className={styles.categoryContainer}>
//             <div className={styles.categoryHeader}>
//               {category.title}
//             </div>
//             <div className={styles.contentRow}>
//               <div className={styles.columnLeft}>
//                 {category.left.points.map((point, idx) => (
//                   <div key={idx} className={styles.point}>
//                     <div className={point.included ? styles.checkIcon : styles.crossIcon}>
//                       {point.included ? <Check /> : <X />}
//                     </div>
//                     <span>{point.text}</span>
//                   </div>
//                 ))}
//               </div>
//               <div className={styles.columnRight}>
//                 {category.right.points.map((point, idx) => (
//                   <div key={idx} className={styles.point}>
//                     <div className={point.included ? styles.checkIcon : styles.crossIcon}>
//                       {point.included ? <Check /> : <X />}
//                     </div>
//                     <span>{point.text}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // FunctionComparison.js
// const FunctionComparison = ({ functionData }) => {
//   const [selectedFunction, setSelectedFunction] = useState(null);

//   return (
//     <div className={styles.container}>
//       <div className={styles.content}>
//         <div className={styles.sidebar}>
//           <div className={styles.searchContainer}>
//             <input
//               type="text"
//               placeholder="Search functions..."
//               className={styles.searchInput}
//             />
//             <Search className={styles.searchIcon} />
//           </div>
//           <div className={styles.functionList}>
//             {Object.entries(functionData).map(([funcName, func]) => (
//               <div
//                 key={funcName}
//                 className={`${styles.functionItem} ${selectedFunction === funcName ? styles.selected : ''}`}
//                 onClick={() => setSelectedFunction(funcName)}
//               >
//                 <div className={styles.functionName}>{funcName}</div>
//                 <div className={styles.functionDesc}>{func.description}</div>
//                 <div className={styles.functionCategory}>{func.category}</div>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         <div className={styles.mainContent}>
//           {selectedFunction && (
//             <ComparisonTable 
//               functionName={selectedFunction}
//               comparisonData={functionData[selectedFunction].comparisons}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FunctionComparison;

import React, { useState } from 'react';
import { X, Check, Search } from 'lucide-react';
import styles from './FunctionComparison.module.css';
import Link from 'next/link';

export const ComparisonTable = ({ functionName, comparisonData,base_url }) => {
  const [selectedComparison, setSelectedComparison] = useState(null);

  if (!selectedComparison) {
    return (
      <div className={styles.similarFunctions}>
        <h2>Similar to {functionName}</h2>
        <div className={styles.similarGrid}>
          {Object.keys(comparisonData).map(funcName => (
            <div
              key={funcName}
              className={styles.similarItem}
              onClick={() => setSelectedComparison(funcName)}
            >
              <div className={styles.similarName}>{funcName}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const comparison = comparisonData[selectedComparison];
  
  return (
    <div className={styles.container}>
      <button 
        className={styles.backButton}
        onClick={() => setSelectedComparison(null)}
      >
        ← Back to similar functions
      </button>
      <div className={styles.tableContainer}>
        <div className={styles.titleRow}>
          <h2 className={styles.functionTitle}>
             {/* {base_url ? (
    <Link href={`${base_url}/${functionName}`}>
      {functionName}
    </Link>
  ) : (
    functionName
  )} */}
  {functionName}
</h2>
          <span>VS</span>
          <h2 className={styles.functionTitle}> {base_url ? (
    <Link href={`${base_url}/${selectedComparison}`}>
      {selectedComparison}
    </Link>
  ) : (
    selectedComparison
  )}</h2>
        </div>

        {comparison.categories.map((category, index) => (
          <div key={index} className={styles.categoryContainer}>
            <div className={styles.categoryHeader}>
              {category.title}
            </div>
            <div className={styles.contentRow}>
              <div className={styles.columnLeft}>
                {category.left.points.map(point => (
                  <div key={point.text} className={styles.point}>
                    {point.included !== undefined && (
                      <div className={point.included ? styles.checkIcon : styles.crossIcon}>
                        {point.included ? <Check /> : <X />}
                      </div>
                    )}
                    <span>{point.text}</span>
                  </div>
                ))}
              </div>
              <div className={styles.columnRight}>
                {category.right.points.map(point => (
                  <div key={point.text} className={styles.point}>
                    {point.included !== undefined && (
                      <div className={point.included ? styles.checkIcon : styles.crossIcon}>
                        {point.included ? <Check /> : <X />}
                      </div>
                    )}
                    <span>{point.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FunctionComparison = ({ functionData ,base_url}) => {
  const [selectedFunction, setSelectedFunction] = useState(null);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search functions..."
              className={styles.searchInput}
            />
            <Search className={styles.searchIcon} />
          </div>
          <div className={styles.functionList}>
            {Object.entries(functionData).map(([funcName, func]) => (
              <div
                key={funcName}
                className={`${styles.functionItem} ${selectedFunction === funcName ? styles.selected : ''}`}
                onClick={() => setSelectedFunction(funcName)}
              >
                <div className={styles.functionName}>{funcName}</div>
                <div className={styles.functionDesc}>{func.description}</div>
                <div className={styles.functionCategory}>{func.category}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.mainContent}>
          {selectedFunction && (
            <ComparisonTable 
              functionName={selectedFunction}
              comparisonData={functionData[selectedFunction].comparisons}
              base_url={base_url}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FunctionComparison;