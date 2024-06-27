// // // import React from 'react';
// // // import Link from 'next/link';
// // // import styles from './SectionLinkGroup.module.css';
// // // import { capitalizeWords } from '@/app/utils/utils-functions';


// // // const SectionLinkGroup = ({ sections }) => {
// // //   return (
// // //     <div className={styles.grid}>
// // //       {sections.map((section, index) => (
// // //         <Link key={index} href={`/c-programming/${section.link}`} className={styles.card}>
// // //           <div className={styles.cardContent}>
// // //             {section.image && <img src={section.image} alt={capitalizeWords(section.link.replaceAll('_', ' '))} className={styles.cardImage} />}
// // //             <h2 className={styles.cardTitle}>{capitalizeWords(section.link.replaceAll('_', ' '))}</h2>
// // //             <p className={styles.cardText}>{capitalizeWords(section.text)}</p>
// // //           </div>
// // //         </Link>
// // //       ))}
// // //     </div>
// // //   );
// // // };

// // // export default SectionLinkGroup;
// // import React from 'react';
// // import Link from 'next/link';
// // import styles from './SectionLinkGroup.module.css';
// // import { capitalizeWords } from '@/app/utils/utils-functions';

// // const SectionLinkGroup = ({ sections }) => {
// //   return (
// //     <div className={styles.grid}>
// //       {sections.map((section, index) => (
// //         <div key={index} className={styles.card}>
// //           <div className={styles.cardContent}>
// //             {section.image && <img src={section.image} alt={capitalizeWords(section.link.replace('_', ' '))} className={styles.cardImage} />}
// //             <h2 className={styles.cardTitle}>{capitalizeWords(section.link.replace('_', ' '))}</h2>
// //             <p className={styles.cardText}>{capitalizeWords(section.text)}</p>
// //             <Link href={`/c-programming/${section.link}`} passHref>
// //               <a className={styles.readMore}>Read More</a>
// //             </Link>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default SectionLinkGroup;
// import React from 'react';
// import Link from 'next/link';
// import styles from './SectionLinkGroup.module.css';
// import { capitalizeWords } from '@/app/utils/utils-functions';

// const SectionLinkGroup = ({ sections }) => {
//   return (
//     <div className={styles.grid}>
//       {sections.map((section, index) => (
//         <div key={index} className={styles.card}>
//           <div className={styles.cardContent}>
//             {section.image && <img src={section.image} alt={capitalizeWords(section.link.replaceAll('_', ' '))} className={styles.cardImage} />}
//             <h2 className={styles.cardTitle}>{capitalizeWords(section.link.replaceAll('_', ' '))}</h2>
//             <p className={styles.cardText}>{capitalizeWords(section.text)}</p>
//             <Link href={`/c-programming/${section.link}`} legacyBehavior>
//               <a className={styles.readMore}>Read More</a>
//             </Link>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SectionLinkGroup;
import React from 'react';
import Link from 'next/link';
import styles from './SectionLinkGroup2.module.css';

import { capitalizeWords } from '@/utils/functions';
const SectionLinkGroup = ({ sections }) => {
  return (
    <div className={styles.grid}>
      {sections.map((section, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.cardContent}>
            {section.image ? <img src={section.image} className={styles.cardImage} alt="" /> : null}
            <h2 className={styles.cardTitle}>{capitalizeWords(section.title?.replaceAll('_', ' '))}</h2>
            <p className={styles.cardText}>{capitalizeWords(section.text)}</p>
            <Link href={`/${section.link}`} legacyBehavior>
              <a className={styles.readMore}>Learn More</a>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionLinkGroup;
