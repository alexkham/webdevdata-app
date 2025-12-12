import React from 'react';
import Link from 'next/link';
import styles from './NewCardGroup.module.css';
import { capitalizeWords } from '@/app/utils/utils-functions';

const NewCardGroup = ({ title, cards }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.grid}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link href={card.path} key={card.name} className={styles.card}>
              <div className={styles.cardHeader}>
                <Icon className={styles.icon} />
                <h2 className={styles.tableTitle}>{capitalizeWords(card.name)}</h2>
              </div>
              <p className={styles.description}>{capitalizeWords(card.description)}</p>
              <div className={styles.cardFooter}>
                <span className={styles.viewText}>Explore Table</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NewCardGroup;