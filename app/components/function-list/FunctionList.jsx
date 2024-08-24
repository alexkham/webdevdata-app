
'use client'
import React, { useState, useMemo, useEffect } from 'react';
import styles from './FunctionList.module.css';
import Link from 'next/link';

const FunctionList = ({ data }) => {
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterOptions, setFilterOptions] = useState([]);
  const [actionCategories, setActionCategories] = useState([]);
  const [specificActions, setSpecificActions] = useState({});
  const [selectedActionCategory, setSelectedActionCategory] = useState('');
  const [selectedSpecificAction, setSelectedSpecificAction] = useState('');

  useEffect(() => {
    const categories = [...new Set(data.map(item => item.main_category))];
    setActionCategories(categories);

    const actions = {};
    categories.forEach(category => {
      actions[category] = [...new Set(data
        .filter(item => item.main_category === category)
        .map(item => item.sub_category))];
    });
    setSpecificActions(actions);
  }, [data]);

  const handleFilterTypeChange = (e) => {
    const selectedType = e.target.value;
    setFilterType(selectedType);
    setFilter('');
    setSelectedActionCategory('');
    setSelectedSpecificAction('');

    if (selectedType && selectedType !== 'function_name' && selectedType !== 'action') {
      let options = new Set();
      
      data.forEach(item => {
        const values = item[selectedType];
        if (Array.isArray(values)) {
          values.forEach(value => {
            if (value !== undefined && value !== null) {
              options.add(value.toString().trim());
            }
          });
        } else if (values !== undefined && values !== null) {
          options.add(values.toString().trim());
        }
      });

      setFilterOptions([...options].sort((a, b) => a.localeCompare(b)));
    } else {
      setFilterOptions([]);
    }
  };

  const filteredData = useMemo(() => {
    if (!filterType) return data;
    if (filterType === 'action') {
      if (!selectedActionCategory) return data;
      return data.filter(item => 
        item.main_category === selectedActionCategory &&
        (!selectedSpecificAction || item.sub_category === selectedSpecificAction)
      );
    }
    if (!filter) return data;
    return data.filter(item => {
      const value = item[filterType];
      if (value === undefined || value === null) return false;
      
      const normalizeString = (str) => str.toString().toLowerCase().trim();
      const normalizedFilter = normalizeString(filter);
      
      if (Array.isArray(value)) {
        return value.some(v => normalizeString(v).includes(normalizedFilter));
      } else {
        return normalizeString(value).includes(normalizedFilter);
      }
    });
  }, [filter, filterType, data, selectedActionCategory, selectedSpecificAction]);

  const alphabeticalGroups = useMemo(() => {
    const groups = {};
    filteredData.forEach(func => {
      const firstLetter = func.function_name[0].toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(func);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredData]);

  const handleReset = () => {
    setFilter('');
    setFilterType('');
    setFilterOptions([]);
    setSelectedActionCategory('');
    setSelectedSpecificAction('');
  };

  return (
    <div className={styles.functionsContainer}>
       
      <div className={styles.leftSide}>
        <div className={styles.controlsOuter}>
        <div className={styles.controls}>
        {/* <p>{data.length}</p> */}
          <select 
            onChange={handleFilterTypeChange} 
            value={filterType}
            className={styles.filterSelect}
          >
            <option value="">Select filter type</option>
            <option value="function_name">Function Name</option>
            <option value="return_type">Return Type</option>
            <option value="parameter_types">Parameter Types</option>
            <option value="include_file">Header File</option>
            <option value="data_type_manipulated">Data Type Manipulated</option>
            <option value="action">Action</option>
          </select>

          {filterType === 'action' ? (
            <>
              <select
                value={selectedActionCategory}
                onChange={(e) => setSelectedActionCategory(e.target.value)}
                className={styles.filterInput}
              >
                <option value="">Select Action Category</option>
                {actionCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              {selectedActionCategory && (
                <select
                  value={selectedSpecificAction}
                  onChange={(e) => setSelectedSpecificAction(e.target.value)}
                  className={styles.filterInput}
                >
                  <option value="">Select Specific Action</option>
                  {specificActions[selectedActionCategory].map((action, index) => (
                    <option key={index} value={action}>{action}</option>
                  ))}
                </select>
              )}
            </>
          ) : filterType && filterType !== 'function_name' ? (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterInput}
            >
              <option value="">Select {filterType.replace(/_/g, ' ')}</option>
              {filterOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          ) : filterType === 'function_name' ? (
            <input
              type="text"
              placeholder="Type function name..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterInput}
            />
          ) : null}
        </div>
          <button onClick={handleReset} className={styles.resetButton}>Reset Search</button>
          </div>

        <div className={styles.functionGroups}>
          {alphabeticalGroups.map(([letter, functions]) => (
            <div key={letter} className={styles.letterGroup}>
              <h3 className={styles.letterHeading}>{letter}</h3>
              <ul className={styles.functionList}>
                {functions.map((func, index) => (
                  <li key={index} className={styles.listItem}>
                    <Link href={`functions/${func.function_name}`}>
                    {func.function_name}
                    </Link>
                    <span className={styles.tooltip}>{func.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Right Side */}
      <div className={styles.rightSide}></div>
    </div>
  );
};

export default FunctionList;