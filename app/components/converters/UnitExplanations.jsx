
import React from 'react';
import styles from './CssUnitsConverter.module.css';
import { unitExplanations, conversionExplanations } from './data';

const UnitExplanations = ({ fromUnit, toUnit }) => {
  const relevantUnits = Array.from(new Set([fromUnit, toUnit].filter(unit => unit && unit !== 'Select Unit')));
  const conversionKey = `${fromUnit}-to-${toUnit}`;
  const showConversionExplanation = fromUnit && toUnit && 
                                    fromUnit !== 'Select Unit' && 
                                    toUnit !== 'Select Unit' && 
                                    fromUnit !== toUnit &&
                                    conversionExplanations?.[conversionKey];

  return (
    <div className={styles.explanations}>
      {relevantUnits.length > 0 && (
        <>
          <h3 className={styles.conversionTitle}>Unit Explanations</h3>
          {relevantUnits.map((unit) => (
            <div key={unit} className={styles.explanationItem}>
              <h4>{unit}</h4>
              <p>{unitExplanations?.[unit] || 'No explanation available.'}</p>
            </div>
          ))}
        </>
      )}
      
      {showConversionExplanation && (
        <>
          <h3 className={styles.conversionTitle}>Conversion Explanation</h3>
          <div className={styles.explanationItem}>
            <h4>{`${fromUnit} to ${toUnit}`}</h4>
            <p>{conversionExplanations[conversionKey]}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default UnitExplanations;