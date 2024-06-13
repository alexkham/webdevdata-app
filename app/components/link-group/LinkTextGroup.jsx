import React from 'react';
import Link from 'next/link';
import styles from './LinkGroup.module.css';
import { capitalizeWords } from '@/utils/functions';

const LinkTextGroup = ({ items }) => {
  return (
    <div className={styles.grid}>
      {items.map((item, index) => (
        <Link key={index} href={`/c-programming/things-not-to-do/${item.link}`} className={styles.card}>
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>{capitalizeWords(item.link.replace('_', ' '))}</h2>
            <p className={styles.cardText}>{capitalizeWords(item.text)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LinkTextGroup;
