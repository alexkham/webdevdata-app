
// // // // // // // // import styles from './MySidebar.module.css';

// // // // // // // // const MySidebar = () => {
// // // // // // // //   return (
// // // // // // // //     <>
// // // // // // // //       <input type="checkbox" id="sidebar-toggle" className={styles.sidebarToggle} />
// // // // // // // //       <nav className={styles.sidebar}>
// // // // // // // //         <label htmlFor="sidebar-toggle" className={styles.toggleBtn}>Toggle</label>
// // // // // // // //         <div className={styles.content}>
// // // // // // // //           <p>Sidebar Content</p>
// // // // // // // //           <p>More Content</p>
// // // // // // // //           <p>Even More</p>
// // // // // // // //         </div>
// // // // // // // //       </nav>
// // // // // // // //     </>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default MySidebar;
// // // // // // // // components/MySidebar.js
// // // // // // // import styles from './MySidebar.module.css';

// // // // // // // const MySidebar = () => {
// // // // // // //   return (
// // // // // // //     <>
// // // // // // //       <input type="checkbox" id="sidebar-toggle" className={styles.sidebarToggle} />
// // // // // // //       <nav className={styles.sidebar}>
// // // // // // //         <div className={styles.content}>
// // // // // // //           <p>Sidebar Content</p>
// // // // // // //           <p>More Content</p>
// // // // // // //           <p>Even More</p>
// // // // // // //         </div>
// // // // // // //         <label htmlFor="sidebar-toggle" className={styles.toggleBtn}>Toggle Button For Content</label>
// // // // // // //       </nav>
// // // // // // //     </>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default MySidebar;
// // // // // // // components/MySidebar.js
// // // // // // import styles from './MySidebar.module.css';

// // // // // // const MySidebar = () => {
// // // // // //   return (
// // // // // //     <>
     
// // // // // //       <input type="checkbox" id="sidebar-toggle" className={styles.sidebarToggle} />
// // // // // //       <nav className={styles.sidebar}>
// // // // // //         <div className={styles.content}>
// // // // // //           <p>Sidebar Content</p>
// // // // // //           <p>More Content</p>
// // // // // //           <p>Even More</p>
// // // // // //         </div>
// // // // // //         <label htmlFor="sidebar-toggle" className={styles.toggleBtn}></label>
// // // // // //       </nav>
// // // // // //     </>
// // // // // //   );
// // // // // // };

// // // // // // export default MySidebar;
// // // // // // In your MySidebar.js component

// // // // // // import styles from './MySidebar.module.css';

// // // // // const MySidebar = () => {
// // // // //   return (
// // // // //     <div className={styles.sidebarContainer}>
// // // // //       <input type="checkbox" id="sidebar-toggle" className={styles.sidebarToggle} />
// // // // //       <nav className={styles.sidebar}>
// // // // //         <div className={styles.content}>
// // // // //           <p>Sidebar Content</p>
// // // // //           <p>More Content</p>
// // // // //           <p>Even More</p>
// // // // //         </div>
// // // // //         <label htmlFor="sidebar-toggle" className={styles.toggleBtn}>Check More Functions</label>
// // // // //       </nav>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default MySidebar;
// // // // import styles from './MySidebar.module.css';

// // // // const MySidebar = () => {
// // // //   return (
// // // //     <>
// // // //       <input type="checkbox" id="sidebar-toggle" className={styles.sidebarToggle} />
// // // //       <div className={styles.sidebar}>
// // // //         <label htmlFor="sidebar-toggle" className={styles.toggleBtn}>Check More Functions</label>
// // // //         <div className={styles.content}>
// // // //           <p>Sidebar Content</p>
// // // //           <p>More Content</p>
// // // //           <p>Even More</p>
// // // //         </div>
// // // //       </div>
// // // //     </>
// // // //   );
// // // // };

// // // // export default MySidebar;
// // // import styles from './MySidebar.module.css';

// // // const MySidebar = () => {
// // //   return (
// // //     <>
// // //       <input type="checkbox" id="sidebar-toggle" className={styles.sidebarToggle} />
// // //       <div className={styles.sidebar}>
// // //         <label htmlFor="sidebar-toggle" className={styles.toggleBtn}>Check More Functions</label>
// // //         <div className={styles.content}>
// // //           <p>Sidebar Content</p>
// // //           <p>More Content</p>
// // //           <p>Even More</p>
// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default MySidebar;
// // import styles from './MySidebar.module.css';

// // const MySidebar = () => {
// //   return (
// //     <>
// //       <input type="checkbox" id="sidebar-toggle" className={styles.sidebarToggle} />
// //       <div className={styles.sidebar}>
// //         <label htmlFor="sidebar-toggle" className={styles.toggleBtn}></label>
// //         <div className={styles.content}>
// //           <p>Sidebar Content</p>
// //           <p>More Content</p>
// //           <p>Even More</p>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default MySidebar;
// // import React from 'react';
// // import styles from './MySidebar.module.css';

// // const MySidebar = ({title, data}) => {
// //   return (
// //     <>
// //       <input type="checkbox" id="sidebar-toggle" className={styles.sidebarToggle} />
// //       <div className={styles.sidebar}>
// //         <label htmlFor="sidebar-toggle" className={styles.toggleBtn}>{title}</label>
// //         <div className={styles.content}>
// //         {data && data.map((functionName, index) => (
// //                 <div key={index}>{functionName}</div>
// //             ))}
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default MySidebar;
// import React from 'react';
// import styles from './MySidebar.module.css';
// import Link from 'next/link';

// const MySidebar = ({title, data}) => {
//   return (
//     <>
//       <input type="checkbox" id="sidebar-toggle" className={styles.sidebarToggle} />
//       <div className={styles.sidebar}>
//         <label htmlFor="sidebar-toggle" className={styles.toggleBtn}>{title}</label>
//         <div className={styles.content}>
//           <p>Scroll Down</p>
//          {data && data.map((functionName, index) => (
//                 <Link className={styles.link} key={index} href={`/c-programming/functions/${functionName}`}>{functionName}</Link>
//             ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default MySidebar;
import React from 'react';
import styles from './MySidebar.module.css';
import Link from 'next/link';

const MySidebar = ({title, data}) => {
  return (
    <>
      <input type="checkbox" id="sidebar-toggle" className={styles.sidebarToggle} />
      <div className={styles.sidebar}>
        <label htmlFor="sidebar-toggle" className={styles.toggleBtn}>{title}</label>
        <div className={styles.content}>
          <div className={styles.scrollIndicator}>
            Scroll Down to See All
            <span className={styles.chevron}>&#9662;</span>
          </div>
          {data && data.map((functionName, index) => (
            <Link className={styles.link} key={index} href={`/c-programming/functions/${functionName}`}>{functionName}</Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default MySidebar;