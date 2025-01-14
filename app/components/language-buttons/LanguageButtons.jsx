// // // // import React from 'react';
// // // // import styles from './LanguageButtons.module.css';

// // // // const LanguageButtons = ({ languages }) => {
// // // //   return (
// // // //     <div className={styles.languageButtonContainer}>
// // // //       {languages.map((lang, index) => (
// // // //         <button 
// // // //           key={index} 
// // // //           className={styles.languageButton} 
// // // //           style={{ backgroundColor: lang.color }}
// // // //         >
// // // //           {lang.logo && <img src={lang.logo} alt={lang.title} className={styles.languageLogo} />}
// // // //           <span>{lang.title}</span>
// // // //         </button>
// // // //       ))}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default LanguageButtons;
// // // import React from 'react';
// // // import styles from './LanguageButtons.module.css';

// // // const LanguageButtons = ({ languages }) => {
// // //   return (
// // //     <div className={styles.languageButtonWrapper}>
// // //       <div className={styles.languageButtonContainer}>
// // //         {languages.map((lang, index) => (
// // //           <a 
// // //             key={index} 
// // //             href={lang.url} 
// // //             className={styles.languageLink}
// // //             style={{ backgroundColor: lang.color }}
// // //           >
// // //             <button className={styles.languageButton}>
// // //               {lang.logo && <img src={lang.logo} alt={lang.title} className={styles.languageLogo} />}
// // //               <span>{lang.title}</span>
// // //             </button>
// // //           </a>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default LanguageButtons;
// // import React from 'react';
// // import styles from './LanguageButtons.module.css';

// // const LanguageButtons = ({ languages }) => {
// //   return (
// //     <div className={styles.languageButtonWrapper}>
// //       <div className={styles.languageButtonContainer}>
// //         {languages.map((lang, index) => (
// //           <a 
// //             key={index} 
// //             href={lang.url} 
// //             className={styles.languageLink}
// //             style={{ backgroundColor: lang.color }}
// //           >
// //             <button 
// //               className={`${styles.languageButton} ${!lang.logo ? styles.noLogo : ''}`}
// //             >
// //               {lang.logo && (
// //                 <img src={lang.logo} alt={lang.title} className={styles.languageLogo} />
// //               )}
// //               <span>{lang.title}</span>
// //             </button>
// //           </a>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default LanguageButtons;
// import React from 'react';
// import styles from './LanguageButtons.module.css';

// const LanguageButtons = ({ languages }) => {
//   return (
//     <div className={styles.languageButtonWrapper}>
//       <div className={styles.languageButtonContainer}>
//         {languages.map((lang, index) => (
//           <a 
//             key={index} 
//             href={lang.url} 
//             className={styles.languageLink}
//             style={{ backgroundColor: lang.color }}
//           >
//             <button 
//               className={`${styles.languageButton} ${!lang.logo ? styles.noLogo : ''}`}
//             >
//               {lang.logo ? (
//                 <img src={lang.logo} alt={lang.title} className={styles.languageLogo} />
//               ) : null}
//               <span>{lang.title}</span>
//             </button>
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LanguageButtons;
import React from 'react';
import styles from './LanguageButtons.module.css';

const LanguageButtons = ({ languages }) => {
  return (
    <div className={styles.languageButtonWrapper}>
      <div className={styles.languageButtonContainer}>
        {languages.map((lang, index) => (
          <a 
            key={index} 
            href={lang.url} 
            className={styles.languageLink}
            style={{ backgroundColor: lang.color }}
          >
            <button className={styles.languageButton}>
              {lang.logo ? (
                <img src={lang.logo} alt={lang.title} className={styles.languageLogo} />
              ) : (
                <div style={{ width: '25px', height: '25px', marginBottom: '5px' }}></div> // Inline style for the placeholder
              )}
              <span>{lang.title}</span>
            </button>
          </a>
        ))}
      </div>
    </div>
  );
};

export default LanguageButtons;
