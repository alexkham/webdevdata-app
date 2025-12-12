// // // import React from 'react';
// // // import Link from 'next/link';
// // // import styles from './ModernCardsGroup.module.css';

// // // const ModernCardsGroup = ({ items = [] }) => {
// // //   if (!Array.isArray(items)) return null;

// // //   return (
// // //     <div className={styles.grid}>
// // //       {items.map((item, index) => (
// // //         <div key={index} className={styles.card}>
// // //           {item.image && (
// // //             <div className={styles.imageContainer}>
// // //               <img
// // //                 src={item.image}
// // //                 alt={item.title}
// // //                 className={styles.image}
// // //               />
// // //             </div>
// // //           )}
          
// // //           <div className={`${styles.contentContainer} ${item.image ? styles.withImage : styles.fullWidth}`}>
// // //             <div>
// // //               <h2 className={styles.title}>{item.title}</h2>
// // //               <p className={styles.description}>{item.description}</p>
// // //             </div>
            
// // //             <div className={styles.footer}>
// // //               <Link href={item.href || '#'} className={styles.viewButton}>
// // //                 View Details
// // //               </Link>
// // //               <button className={styles.menuButton}>
// // //                 <span className={styles.menuDot}></span>
// // //                 <span className={styles.menuDot}></span>
// // //                 <span className={styles.menuDot}></span>
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       ))}
// // //     </div>
// // //   );
// // // };

// // // export default ModernCardsGroup;

// // import React from 'react';
// // import Link from 'next/link';
// // import styles from './ModernCardsGroup.module.css';

// // const ModernCardsGroup = ({ items = [] }) => {
// //   if (!Array.isArray(items)) return null;

// //   return (
// //     <div className={styles.grid}>
// //       {items.map((item, index) => (
// //         <div 
// //           key={index} 
// //           className={styles.card}
// //           style={{ backgroundColor: item.backgroundColor || 'white' }}
// //         >
// //           {item.image && (
// //             <div className={styles.imageContainer}>
// //               <img
// //                 src={item.image}
// //                 alt={item.title}
// //                 className={styles.image}
// //               />
// //             </div>
// //           )}
          
// //           <div className={`${styles.contentContainer} ${item.image ? styles.withImage : styles.fullWidth}`}>
// //             <div>
// //               <h2 className={styles.title}>{item.title}</h2>
// //               <p className={styles.description}>{item.description}</p>
// //             </div>
            
// //             <div className={styles.footer}>
// //               <Link href={item.href || '#'} className={styles.viewButton}>
// //                 View Details
// //               </Link>
// //               <button className={styles.menuButton}>
// //                 <span className={styles.menuDot}></span>
// //                 <span className={styles.menuDot}></span>
// //                 <span className={styles.menuDot}></span>
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default ModernCardsGroup;
// import React from 'react';
// import Link from 'next/link';
// import styles from './ModernCardsGroup.module.css';

// const ModernCardsGroup = ({ items = [] }) => {
//   if (!Array.isArray(items)) return null;

//   return (
//     <div className={styles.grid}>
//       {items.map((item, index) => (
//         <div 
//           key={index} 
//           className={styles.card}
//           style={{ backgroundColor: item.backgroundColor || 'white' }}
//         >
//           {item.image && (
//             <div className={styles.imageContainer}>
//               <img
//                 src={item.image}
//                 alt={item.title}
//                 className={styles.image}
//               />
//             </div>
//           )}
          
//           <div className={`${styles.contentContainer} ${item.image ? styles.withImage : styles.fullWidth}`}>
//             <div>
//               <div className={styles.titleRow}>
//                 {item.icon && (
//                   <div className={styles.iconContainer}>
//                     <item.icon className={styles.icon} />
//                   </div>
//                 )}
//                 <h2 className={styles.title}>{item.title}</h2>
//               </div>
//               <p className={styles.description}>{item.description}</p>
//             </div>
            
//             <div className={styles.footer}>
//               <Link href={item.href || '#'} className={styles.viewButton}>
//                 View Details
//               </Link>
//               <button className={styles.menuButton}>
//                 <span className={styles.menuDot}></span>
//                 <span className={styles.menuDot}></span>
//                 <span className={styles.menuDot}></span>
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ModernCardsGroup;
// import React from 'react';
// import Link from 'next/link';
// import styles from './ModernCardsGroup.module.css';

// const ModernCardsGroup = ({ items = [] }) => {
//   if (!Array.isArray(items)) return null;

//   return (
//     <div className={styles.grid}>
//       {items.map((item, index) => (
//         <div 
//           key={index} 
//           className={styles.card}
//           style={{ 
//             backgroundColor: item.backgroundColor || 'white',
//             width: item.width || '100%',
//             color: item.textColor || '#1a1f36'
//           }}
//         >
//           {item.image && (
//             <div className={styles.imageContainer}>
//               <img
//                 src={item.image}
//                 alt={item.title}
//                 className={styles.image}
//               />
//             </div>
//           )}
          
//           <div className={`${styles.contentContainer} ${item.image ? styles.withImage : styles.fullWidth}`}>
//             <div>
//               <div className={styles.titleRow}>
//                 {item.icon && (
//                   <div className={styles.iconContainer}>
//                     <item.icon className={styles.icon} style={{ color: item.textColor || '#4F46E5' }} />
//                   </div>
//                 )}
//                 <h2 className={styles.title} style={{ color: item.textColor || '#1a1f36' }}>
//                   {item.title}
//                 </h2>
//               </div>
//               <p className={styles.description} style={{ color: item.textColor || '#64748b' }}>
//                 {item.description}
//               </p>
//             </div>
            
//             <div className={styles.footer}>
//               <Link 
//                 href={item.href || '#'} 
//                 className={styles.viewButton}
//                 style={{ 
//                   color: item.textColor || '#4F46E5',
//                   borderColor: item.textColor || '#4F46E5'
//                 }}
//               >
//                 View Details
//               </Link>
//               <button className={styles.menuButton}>
//                 <span className={styles.menuDot} style={{ background: item.textColor || '#64748b' }}></span>
//                 <span className={styles.menuDot} style={{ background: item.textColor || '#64748b' }}></span>
//                 <span className={styles.menuDot} style={{ background: item.textColor || '#64748b' }}></span>
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ModernCardsGroup;
import React from 'react';
import Link from 'next/link';
import styles from './ModernCardsGroup.module.css';

const ModernCardsGroup = ({ items = [] }) => {
  if (!Array.isArray(items)) return null;

  return (
    <div className={styles.grid}>
      {items.map((item, index) => {
        // Only apply ratio style if both items in a pair have ratios
        const nextItem = items[index + 1];
        const prevItem = items[index - 1];
        const isPair = index % 2 === 0;
        
        let widthStyle = {};
        if (item.ratio && ((isPair && nextItem?.ratio) || (!isPair && prevItem?.ratio))) {
          widthStyle = { flexBasis: `${(item.ratio / (item.ratio + (isPair ? nextItem.ratio : prevItem.ratio))) * 100}%` };
        }

        return (
          <div 
            key={index} 
            className={styles.card}
            style={{
              backgroundColor: item.backgroundColor || 'white',
              color: item.textColor || '#1a1f36',
              ...widthStyle
            }}
          >
            {item.image && (
              <div className={styles.imageContainer}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.image}
                />
              </div>
            )}
            
            <div className={`${styles.contentContainer} ${item.image ? styles.withImage : styles.fullWidth}`}>
              <div>
                <div className={styles.titleRow}>
                  {item.icon && (
                    <div className={styles.iconContainer}>
                      <item.icon className={styles.icon} style={{ color: item.textColor || '#4F46E5' }} />
                    </div>
                  )}
                  <h2 className={styles.title} style={{ color: item.textColor || '#1a1f36' }}>
                    {item.title}
                  </h2>
                </div>
                <p className={styles.description} style={{ color: item.textColor || '#64748b' }}>
                  {item.description}
                </p>
              </div>
              
              <div className={styles.footer}>
                <Link 
                  href={item.href || '#'} 
                  className={styles.viewButton}
                  style={{ 
                    color: item.textColor || '#4F46E5',
                    borderColor: item.textColor || '#4F46E5'
                  }}
                >
                  View Details
                </Link>
                <button className={styles.menuButton}>
                  <span className={styles.menuDot} style={{ background: item.textColor || '#64748b' }}></span>
                  <span className={styles.menuDot} style={{ background: item.textColor || '#64748b' }}></span>
                  <span className={styles.menuDot} style={{ background: item.textColor || '#64748b' }}></span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ModernCardsGroup;