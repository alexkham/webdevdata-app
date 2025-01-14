
'use client'

import React, { useReducer, useEffect, useState } from 'react';
import styles from './CssUnitsConverter.module.css';
import UnitExplanations from './UnitExplanations';
import { initialState, units, requiredFields, tooltips } from './data';

function reducer(state, action) {
  switch (action.type) {
    case 'SET_INPUT_VALUE':
      return { ...state, inputValue: action.payload };
    case 'SET_FROM_UNIT':
      return { ...state, fromUnit: action.payload };
    case 'SET_TO_UNIT':
      return { ...state, toUnit: action.payload };
    case 'SET_RESULT':
      return { ...state, result: action.payload };
    case 'SET_ADDITIONAL_FIELDS':
      return { ...state, additionalFields: { ...state.additionalFields, ...action.payload } };
    case 'UPDATE_ADDITIONAL_FIELD':
      return { 
        ...state, 
        additionalFields: {
          ...state.additionalFields, 
          [action.payload.field]: action.payload.value
        }
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const CssUnitsConverter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [copyButtonText, setCopyButtonText] = useState('Copy Result');

  const getRequiredFields = (from, to) => {
    return requiredFields[`${from}-to-${to}`] || [];
  };

  useEffect(() => {
    const newFields = getRequiredFields(state.fromUnit, state.toUnit);
    dispatch({ 
      type: 'SET_ADDITIONAL_FIELDS', 
      payload: newFields.reduce((acc, field) => ({
        ...acc, 
        [field]: state.additionalFields[field] || initialState.additionalFields[field] || ''
      }), {})
    });
  }, [state.fromUnit, state.toUnit]);

  const handleConvert = () => {
    if (!state.inputValue || state.fromUnit === 'Select Unit' || state.toUnit === 'Select Unit') return;

    const value = parseFloat(state.inputValue);
    const { 
      'Parent Size (emSize)': emSize, 
      'Root Size (remSize)': remSize, 
      'Base Size for %': baseSize,
      'Viewport Width': viewportWidth,
      'Viewport Height': viewportHeight
    } = state.additionalFields;

    let result;
    const pxValue = convertToPx(value, state.fromUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);
    result = convertFromPx(pxValue, state.toUnit, emSize, remSize, baseSize, viewportWidth, viewportHeight);

    dispatch({ type: 'SET_RESULT', payload: `${result.toFixed(4)} ${state.toUnit}` });
  };

  const convertToPx = (value, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
    switch (unit) {
      case 'px': return value;
      case 'em': return value * parseFloat(emSize);
      case 'rem': return value * parseFloat(remSize);
      case 'pt': return value * (96 / 72);
      case 'pc': return value * 16;
      case 'in': return value * 96;
      case 'cm': return value * (96 / 2.54);
      case 'mm': return value * (96 / 25.4);
      case '%': return (value / 100) * parseFloat(baseSize);
      case 'vw': return (value / 100) * parseFloat(viewportWidth);
      case 'vh': return (value / 100) * parseFloat(viewportHeight);
      default: return value;
    }
  };

  const convertFromPx = (px, unit, emSize, remSize, baseSize, viewportWidth, viewportHeight) => {
    switch (unit) {
      case 'px': return px;
      case 'em': return px / parseFloat(emSize);
      case 'rem': return px / parseFloat(remSize);
      case 'pt': return px * (72 / 96);
      case 'pc': return px / 16;
      case 'in': return px / 96;
      case 'cm': return px * (2.54 / 96);
      case 'mm': return px * (25.4 / 96);
      case '%': return (px / parseFloat(baseSize)) * 100;
      case 'vw': return (px / parseFloat(viewportWidth)) * 100;
      case 'vh': return (px / parseFloat(viewportHeight)) * 100;
      default: return px;
    }
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(state.result)
      .then(() => {
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy Result'), 5000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };


  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="inputValue">Value: </label>
          <input
            id="inputValue"
            type="number"
            value={state.inputValue}
            onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value })}
            placeholder="Enter value"
            className={styles.inputWide}
          />
        </div>
        <div className={styles.unitGroup}>
          <div className={styles.unitSubGroup}>
            <label className={styles.label} htmlFor="fromUnit">From: </label>
            <select 
              id="fromUnit"
              value={state.fromUnit} 
              onChange={(e) => dispatch({ type: 'SET_FROM_UNIT', payload: e.target.value })}
              className={styles.select}
            >
              {units?.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
          <div className={styles.unitSubGroup}>
            <label className={styles.label} htmlFor="toUnit">To: </label>
            <select 
              id="toUnit"
              value={state.toUnit} 
              onChange={(e) => dispatch({ type: 'SET_TO_UNIT', payload: e.target.value })}
              className={styles.select}
            >
              {units?.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
        <br />
        <div className={styles.additionalFields}>
          {getRequiredFields(state.fromUnit, state.toUnit).map(field => (
            <div key={field} className={styles.inputGroup}>
              <label className={styles.label} htmlFor={field}>{field}</label>
              <input
                id={field}
                type="number"
                placeholder={field}
                value={state.additionalFields?.[field] || ''}
                onChange={(e) => dispatch({ 
                  type: 'UPDATE_ADDITIONAL_FIELD', 
                  payload: { field, value: e.target.value } 
                })}
                className={styles.input}
              />
              <span className={styles.tooltip}>
                ?
                <span className={styles.tooltipText}>{tooltips?.[field] || 'No tooltip available.'}</span>
              </span>
            </div>
          ))}
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handleConvert} className={styles.convertButton}>Convert</button>
          <button onClick={() => dispatch({ type: 'RESET' })} className={styles.resetButton}>Reset</button>
        </div>
        <div className={styles.result}>
          <p>Result: {state.result}</p>
          <button onClick={handleCopyResult} className={styles.copyButton}>
            {copyButtonText}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="black" className={styles.svg}>
              <path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className={styles.rightSide}>
        <UnitExplanations 
          fromUnit={state.fromUnit !== 'Select Unit' ? state.fromUnit : null} 
          toUnit={state.toUnit !== 'Select Unit' ? state.toUnit : null} 
        />
      </div>
    </div>
  );

};

export default CssUnitsConverter;