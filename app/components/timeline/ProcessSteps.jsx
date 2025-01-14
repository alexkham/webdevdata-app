// import React from 'react'
// import styles from './ProcessSteps.module.css'

// export default function ProcessSteps() {
//   return (
//     <div className={styles.wrap}>
//       <span className={styles.step}>
//         VIEW JOB POST
//       </span>
//       <span className={styles.step}>
//         INVITE FREELANCERS
//       </span>
//       <span className={`${styles.step} ${styles.current}`}>
//         <div>REVIEW PROPOSALS (6)</div>
//         <small>Shortlisted (0)</small>
//       </span>
//       <span className={styles.step}>
//         HIRE (0)
//       </span>
//     </div>
//   )
// }

import React from 'react'
import styles from './ProcessSteps.module.css'

export default function ProcessSteps() {
  return (
    <div className={styles.wrap}>
      <span className={styles.step}>
        VIEW JOB POST
      </span>
      <span className={styles.step}>
        INVITE FREELANCERS
      </span>
      <span className={`${styles.step} ${styles.current}`}>
        <div>REVIEW PROPOSALS (6)</div>
        <small>Shortlisted (0)</small>
      </span>
      <span className={styles.step}>
        HIRE (0)
      </span>
    </div>
  )
}