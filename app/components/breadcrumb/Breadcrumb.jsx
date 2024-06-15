// // components/Breadcrumb.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Breadcrumb.module.css';

const Breadcrumb = () => {
  const pathname = usePathname();
  const pathnames = pathname.split('/').filter(x => x);

  return (
    <nav aria-label="breadcrumb">
      <ol className={styles.breadcrumb}>
        <li className={styles['breadcrumb-item']}>
          <Link href="/">Home</Link>
        </li>
        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <li key={index} className={`${styles['breadcrumb-item']} ${styles.active}`} aria-current="page">
              {pathname}
            </li>
          ) : (
            <li key={index} className={styles['breadcrumb-item']}>
              <Link href={routeTo}>{pathname}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
