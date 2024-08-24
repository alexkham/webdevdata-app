// // 'use client'
// // import React, { useState } from 'react';
// // import Link from 'next/link';
// // import { ChevronDown, ChevronUp, Search, Code } from 'lucide-react';
// // import styles from './ExamplesPage.module.css';

// // const ExamplesPage = ({ categories }) => {
// //   const [expandedCategory, setExpandedCategory] = useState(null);

// //   const toggleCategory = (index) => {
// //     setExpandedCategory(expandedCategory === index ? null : index);
// //   };

// //   return (
// //     <div className={styles.container}>
// //       <h1 className={styles.title}>Programming Examples</h1>
// //       <div className={styles.categoryGrid}>
// //         {categories.map((category, index) => (
// //           <div key={category.id} className={styles.categoryCard}>
// //             <div 
// //               className={styles.categoryHeader}
// //               onClick={() => toggleCategory(index)}
// //             >
// //               <div className={styles.categoryInfo}>
// //                 <div className={styles.categoryIcon}>
// //                   {category.icon}
// //                 </div>
// //                 <div>
// //                   <h2 className={styles.categoryTitle}>{category.category}</h2>
// //                   <p className={styles.categoryExplanation}>{category.explanation}</p>
// //                 </div>
// //               </div>
// //               {expandedCategory === index ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
// //             </div>
// //             {expandedCategory === index && (
// //               <div className={styles.subcategoriesContainer}>
// //                 <h3 className={styles.subcategoriesTitle}>Subcategories:</h3>
// //                 <ul className={styles.subcategoriesList}>
// //                   {category.subcategories.map((subcat) => (
// //                     <li key={subcat.id} className={styles.subcategoryItem}>
// //                       <Search size={20} className={styles.subcategoryIcon} />
// //                       <div>
// //                         <Link href={`/examples/${category.id}/${subcat.id}`} className={styles.subcategoryLink}>
// //                           {subcat.name}
// //                         </Link>
// //                         <p className={styles.subcategoryDescription}>{subcat.description}</p>
// //                       </div>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ExamplesPage;
// import React, { useState } from 'react';
// import Link from 'next/link';
// import { ChevronDown, ChevronUp, Search } from 'lucide-react';
// import styles from './ExamplesPage.module.css';

// const ExamplesPage = ({ categories = [] }) => {
//   const [expandedCategory, setExpandedCategory] = useState(null);

//   const toggleCategory = (index) => {
//     setExpandedCategory(expandedCategory === index ? null : index);
//   };

//   if (!categories || categories.length === 0) {
//     return <div className={styles.container}>No categories available.</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Programming Examples</h1>
//       <div className={styles.categoryGrid}>
//         {categories.map((category, index) => (
//           <div key={category.id || index} className={styles.categoryCard}>
//             <div 
//               className={styles.categoryHeader}
//               onClick={() => toggleCategory(index)}
//             >
//               <div className={styles.categoryInfo}>
//                 <div className={styles.categoryIcon}>
//                   {category.icon || <Search size={24} />} {/* Fallback icon */}
//                 </div>
//                 <div>
//                   <h2 className={styles.categoryTitle}>{category.category || 'Unnamed Category'}</h2>
//                   <p className={styles.categoryExplanation}>{category.explanation || 'No explanation provided'}</p>
//                 </div>
//               </div>
//               {expandedCategory === index ? <ChevronUp className={styles.chevron} /> : <ChevronDown className={styles.chevron} />}
//             </div>
//             {expandedCategory === index && (
//               <div className={styles.subcategoriesContainer}>
//                 <h3 className={styles.subcategoriesTitle}>Subcategories:</h3>
//                 {category.subcategories && category.subcategories.length > 0 ? (
//                   <ul className={styles.subcategoriesList}>
//                     {category.subcategories.map((subcat, subIndex) => (
//                       <li key={subcat.id || subIndex} className={styles.subcategoryItem}>
//                         <Search className={styles.subcategoryIcon} />
//                         <div>
//                           <Link 
//                             href={`${category.base_url || ''}${subcat.end_point || ''}`} 
//                             className={styles.subcategoryLink}
//                           >
//                             {subcat.name || 'Unnamed Subcategory'}
//                           </Link>
//                           <p className={styles.subcategoryDescription}>
//                             {subcat.description || 'No description provided'}
//                           </p>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No subcategories available.</p>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ExamplesPage;
'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import styles from './ExamplesPage.module.css';

const ExamplesPage = ({ categories = [] }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  if (!categories || categories.length === 0) {
    return <div className={styles.container}>No categories available.</div>;
  }

  return (
    <div className={styles.container}>
      {/* <h1 className={styles.title}>Programming Examples</h1> */}
      <div className={styles.categoryGrid}>
        {categories.map((category, index) => (
          <div key={category?.id || index} className={styles.categoryCard}>
            <div 
              className={styles.categoryHeader}
              
            >
              <div className={styles.categoryInfo}>
                <div className={styles.categoryIcon}>
                  {category?.icon ? category.icon : <Search size={24} />}
                </div>
                <div>
                  <Link href={category?.base_url || '#'} className={styles.categoryTitle}>
                    {category?.category || 'Unnamed Category'}
                  </Link>
                  <p className={styles.categoryExplanation}>
                    {category?.explanation || 'No explanation provided'}
                  </p>
                </div>
              </div>
              {expandedCategory === index 
              ? <ChevronUp className={styles.chevron} onClick={() => toggleCategory(index)}/>
               : <ChevronDown className={styles.chevron} onClick={() => toggleCategory(index)} />}
            </div>
            {expandedCategory === index && (
              <div className={styles.subcategoriesContainer}>
                <h3 className={styles.subcategoriesTitle}>Subcategories:</h3>
                {category?.subcategories && category.subcategories.length > 0 ? (
                  <ul className={styles.subcategoriesList}>
                    {category.subcategories.map((subcat, subIndex) => (
                      <li key={subcat?.id || subIndex} className={styles.subcategoryItem}>
                        <Search className={styles.subcategoryIcon} />
                        <div>
                          <Link 
                            href={`${category.base_url || ''}#${subcat?.id || ''}`}
                            className={styles.subcategoryLink}
                          >
                            {subcat?.name || 'Unnamed Subcategory'}
                          </Link>
                          <p className={styles.subcategoryDescription}>
                            {subcat?.description || 'No description provided'}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No subcategories available.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamplesPage;