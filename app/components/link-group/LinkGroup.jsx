import React from 'react';
import Link from 'next/link';
import styles from './LinkGroup.module.css';

const LinkGroup = ({ items }) => {
  return (
    <div className={styles.grid}>
      {items.map((item, index) => (
        <Link key={index} href={`/c-programming/things-not-to-do/${item}`} className={styles.card}>
          <div className={styles.cardContent}>
            {item.replace('_', ' ')}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LinkGroup;
