
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './CardsGroup.module.css';
import { capitalizeWords } from '@/app/utils/utils-functions';

const CardsGroup = ({ items = [] }) => {
  const [expandedStates, setExpandedStates] = useState({});

  if (!Array.isArray(items)) return null;

  const toggleExpand = (id) => {
    setExpandedStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className={styles.grid}>
      {items.map((item, index) => {
        if (!item || typeof item !== 'object') return null;

        const {
          id = index,
          category,
          content,
          icon: Icon,
          image,
          href,
          subcategories = []
        } = item;

        const isExpanded = !!expandedStates[id];
        const hasSubcategories = Array.isArray(subcategories) && subcategories.length > 0;

        return (
          <div key={id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.headerContent}>
                <div className={styles.iconContainer}>
                  {image ? (
                    <Image
                      src={image}
                      alt={category || 'Category image'}
                      width={64}  // Adjust these values based on your needs
                      height={64} // Adjust these values based on your needs
                      className={styles.categoryImage}
                    />
                  ) : Icon ? (
                    <Icon className={styles.icon} />
                  ) : null}
                </div>

                <div className={styles.titleContainer}>
                  <h2 className={styles.title}>{category}</h2>
                  <br/>
                  <br/>
                  <p className={styles.description}>
                    {content ? capitalizeWords(content) : `Explore ${category?.toLowerCase()} Concepts`}
                  </p>
                </div>
              </div>

              {hasSubcategories && (
                <button
                  onClick={() => toggleExpand(id)}
                  className={styles.expandButton}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Show less' : 'Show more'}
                >
                  <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                  {isExpanded ? (
                    <ChevronUp className={styles.chevron} />
                  ) : (
                    <ChevronDown className={styles.chevron} />
                  )}
                </button>
              )}
            </div>

            {hasSubcategories && (
              <div 
                className={`${styles.subcategoriesContainer} ${
                  isExpanded ? styles.expanded : ''
                }`}
              >
                <div className={styles.subcategoriesList}>
                  {subcategories.map((sub, subIndex) => (
                    <Link
                      key={`${id}-${subIndex}`}
                      href={sub.href || '#'}
                      className={styles.subcategoryLink}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.footer}>
              {href && (
                <Link href={href} className={styles.footerContent}>
                  Learn More  →
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardsGroup;