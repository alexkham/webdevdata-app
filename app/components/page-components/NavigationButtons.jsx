// NavigationButtons.jsx
import React from 'react';

const styles = {
  sectionNav: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 40px'
  },
  navBtn: {
    padding: '6px 12px',
    background: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '4px',
    color: '#333',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'background-color 0.2s'
  }
};

const NavigationButtons = ({ prevLink, nextLink }) => {
  return (
    <div style={styles.sectionNav}>
      {prevLink && (
        <a href={prevLink} style={styles.navBtn}>← Previous</a>
      )}
      <a href="#" style={styles.navBtn}>↑ Top</a>
      {nextLink && (
        <a href={nextLink} style={styles.navBtn}>Next →</a>
      )}
    </div>
  );
};

export default NavigationButtons;