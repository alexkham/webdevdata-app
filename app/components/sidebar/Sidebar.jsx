// import React from 'react';
// import styles from './MySidebar.module.css';
// import Link from 'next/link';

// const MySidebar = ({title, data ,baseUrl}) => {
//   return (
//     <>
//       <input type="checkbox" id="sidebar-toggle" className={styles.sidebarToggle} />
//       <div className={styles.sidebar}>
//         <label htmlFor="sidebar-toggle" className={styles.toggleBtn}>{title}</label>
//         <div className={styles.content} style={{height:'300px',zIndex:'10000',overflow:'scroll'}}>
//           <div className={styles.scrollIndicator}>
//             Scroll Down to See All
//             <span className={styles.chevron}>&#9662;</span>
//           </div>
//           {data && data.map((functionName, index) => (
//             <Link className={styles.link} key={index} href={`${baseUrl}/${functionName}`}>{functionName}</Link>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default MySidebar;

import React from 'react';
import styles from './MySidebar.module.css';
import Link from 'next/link';

const MySidebar = ({title, data, baseUrl}) => {
  // Remove trailing slash from baseUrl if it exists
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  return (
    <>
      <input type="checkbox" id="sidebar-toggle" className={styles.sidebarToggle} />
      <div className={styles.sidebar}>
        <label htmlFor="sidebar-toggle" className={styles.toggleBtn}>{title}</label>
        <div className={styles.content} style={{height:'300px',zIndex:'10000',overflow:'scroll'}}>
          <div className={styles.scrollIndicator}>
            Scroll Down to See All
            <span className={styles.chevron}>&#9662;</span>
          </div>
          {data && data.map((functionName, index) => (
            <Link 
              className={styles.link} 
              key={index} 
              href={`${cleanBaseUrl}/${functionName.trim()}`}
            >
              {functionName}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MySidebar;