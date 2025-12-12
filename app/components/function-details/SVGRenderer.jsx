// New SVG component
import React from 'react';
import styles from './FunctionDetails.module.css';

const SVGRenderer = ({ svg_data }) => {
  if (!svg_data || !Array.isArray(svg_data)) return null;

  return (
    <div className={styles.svgContainer}>
      {svg_data.map((item, index) => {
        if (!item || typeof item !== 'object') return null;
        
        const { tab, svg_diagram, explanation } = item;
        if (!tab || !svg_diagram) return null;

        return (
          <div key={index} className={styles.svgWrapper}>
            <div dangerouslySetInnerHTML={{ __html: svg_diagram }} />
            {explanation && <p className={styles.svgExplanation}>{explanation}</p>}
          </div>
        );
      })}
    </div>
  );
};

export default SVGRenderer;