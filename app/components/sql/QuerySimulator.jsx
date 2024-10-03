// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// // // // // import styles from './QuerySimulator.module.css';

// // // // // // Sample database schema
// // // // // const schema = {
// // // // //   users: {
// // // // //     columns: ['id', 'name', 'age', 'city'],
// // // // //     data: [
// // // // //       { id: 1, name: 'John Doe', age: 30, city: 'New York' },
// // // // //       { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
// // // // //       { id: 3, name: 'Bob Johnson', age: 35, city: 'Chicago' },
// // // // //       { id: 4, name: 'Alice Brown', age: 28, city: 'New York' },
// // // // //     ]
// // // // //   },
// // // // //   orders: {
// // // // //     columns: ['id', 'user_id', 'product', 'amount'],
// // // // //     data: [
// // // // //       { id: 1, user_id: 1, product: 'Widget', amount: 100 },
// // // // //       { id: 2, user_id: 2, product: 'Gadget', amount: 75 },
// // // // //       { id: 3, user_id: 1, product: 'Doohickey', amount: 50 },
// // // // //     ]
// // // // //   }
// // // // // };

// // // // // const aggregateFunctions = ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN'];

// // // // // const QuerySimulator = () => {
// // // // //   const [activeTab, setActiveTab] = useState(Object.keys(schema)[0]);
// // // // //   const [query, setQuery] = useState({
// // // // //     select: ['*'],
// // // // //     from: '',
// // // // //     where: '',
// // // // //     groupBy: '',
// // // // //     having: '',
// // // // //     orderBy: '',
// // // // //     orderDir: 'ASC'
// // // // //   });
// // // // //   const [queryResult, setQueryResult] = useState(null);
// // // // //   const [errors, setErrors] = useState([]);

// // // // //   useEffect(() => {
// // // // //     validateQuery();
// // // // //   }, [query]);

// // // // //   const validateQuery = () => {
// // // // //     const newErrors = [];
// // // // //     if (!query.from) {
// // // // //       newErrors.push("FROM clause is required. Please select a table.");
// // // // //     }
// // // // //     if (query.groupBy && !query.select.some(col => col.includes('('))) {
// // // // //       newErrors.push("When using GROUP BY, at least one aggregate function should be used in SELECT.");
// // // // //     }
// // // // //     if (query.having && !query.groupBy) {
// // // // //       newErrors.push("HAVING clause can only be used with GROUP BY.");
// // // // //     }
// // // // //     setErrors(newErrors);
// // // // //   };

// // // // //   const executeQuery = () => {
// // // // //     // Simplified query execution logic
// // // // //     let result = schema[query.from].data;

// // // // //     // Apply WHERE clause (simplified)
// // // // //     if (query.where) {
// // // // //       result = result.filter(row => {
// // // // //         try {
// // // // //           return eval(query.where.replace(/([a-zA-Z]+)/g, 'row.$1'));
// // // // //         } catch {
// // // // //           return true;
// // // // //         }
// // // // //       });
// // // // //     }

// // // // //     // Apply GROUP BY and aggregate functions (simplified)
// // // // //     if (query.groupBy) {
// // // // //       const grouped = {};
// // // // //       result.forEach(row => {
// // // // //         const key = row[query.groupBy];
// // // // //         if (!grouped[key]) grouped[key] = [];
// // // // //         grouped[key].push(row);
// // // // //       });
// // // // //       result = Object.entries(grouped).map(([key, group]) => {
// // // // //         const aggregated = { [query.groupBy]: key };
// // // // //         query.select.forEach(col => {
// // // // //           if (col.includes('(')) {
// // // // //             const [func, field] = col.split('(');
// // // // //             const cleanField = field.replace(')', '');
// // // // //             aggregated[col] = calculateAggregate(func, group, cleanField);
// // // // //           }
// // // // //         });
// // // // //         return aggregated;
// // // // //       });
// // // // //     }

// // // // //     // Apply HAVING clause (simplified)
// // // // //     if (query.having) {
// // // // //       result = result.filter(row => {
// // // // //         try {
// // // // //           return eval(query.having.replace(/([a-zA-Z]+)/g, 'row.$1'));
// // // // //         } catch {
// // // // //           return true;
// // // // //         }
// // // // //       });
// // // // //     }

// // // // //     // Apply ORDER BY
// // // // //     if (query.orderBy) {
// // // // //       result.sort((a, b) => {
// // // // //         return query.orderDir === 'DESC' ? b[query.orderBy] - a[query.orderBy] : a[query.orderBy] - b[query.orderBy];
// // // // //       });
// // // // //     }

// // // // //     // Select only requested columns
// // // // //     if (!query.select.includes('*')) {
// // // // //       result = result.map(row => {
// // // // //         const newRow = {};
// // // // //         query.select.forEach(col => {
// // // // //           newRow[col] = row[col];
// // // // //         });
// // // // //         return newRow;
// // // // //       });
// // // // //     }

// // // // //     setQueryResult(result);
// // // // //   };

// // // // //   const calculateAggregate = (func, group, field) => {
// // // // //     switch (func) {
// // // // //       case 'COUNT':
// // // // //         return group.length;
// // // // //       case 'SUM':
// // // // //         return group.reduce((sum, row) => sum + row[field], 0);
// // // // //       case 'AVG':
// // // // //         return group.reduce((sum, row) => sum + row[field], 0) / group.length;
// // // // //       case 'MAX':
// // // // //         return Math.max(...group.map(row => row[field]));
// // // // //       case 'MIN':
// // // // //         return Math.min(...group.map(row => row[field]));
// // // // //       default:
// // // // //         return null;
// // // // //     }
// // // // //   };

// // // // //   const handleSelectChange = (value) => {
// // // // //     setQuery(prev => ({
// // // // //       ...prev,
// // // // //       select: prev.select.includes(value)
// // // // //         ? prev.select.filter(item => item !== value)
// // // // //         : [...prev.select.filter(item => item !== '*'), value]
// // // // //     }));
// // // // //   };

// // // // //   const isColumnSelected = (column) => {
// // // // //     return query.select.includes(column) || query.select.includes('*');
// // // // //   };

// // // // //   return (
// // // // //     <div className={styles.container}>
// // // // //       <h1 className={styles.title}>Query Simulator</h1>
      
// // // // //       <div className={styles.tabContainer}>
// // // // //         {Object.keys(schema).map((table, index) => (
// // // // //           <button
// // // // //             key={table}
// // // // //             onClick={() => setActiveTab(table)}
// // // // //             className={`${styles.tab} ${activeTab === table ? styles.activeTab : ''}`}
// // // // //           >
// // // // //             {table}
// // // // //           </button>
// // // // //         ))}
// // // // //       </div>
// // // // //       <div className={styles.tableDisplay}>
// // // // //         <h2 className={styles.tableTitle}>{activeTab} Table</h2>
// // // // //         <div className={styles.tableWrapper}>
// // // // //           <table className={styles.table}>
// // // // //             <thead>
// // // // //               <tr>
// // // // //                 {schema[activeTab].columns.map(column => (
// // // // //                   <th key={column} className={`${styles.th} ${isColumnSelected(column) ? styles.highlightedColumn : ''}`}>
// // // // //                     {column}
// // // // //                   </th>
// // // // //                 ))}
// // // // //               </tr>
// // // // //             </thead>
// // // // //             <tbody>
// // // // //               {schema[activeTab].data.map((row, rowIndex) => (
// // // // //                 <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.evenRow : ''}>
// // // // //                   {schema[activeTab].columns.map(column => (
// // // // //                     <td key={column} className={`${styles.td} ${isColumnSelected(column) ? styles.highlightedColumn : ''}`}>
// // // // //                       {row[column]}
// // // // //                     </td>
// // // // //                   ))}
// // // // //                 </tr>
// // // // //               ))}
// // // // //             </tbody>
// // // // //           </table>
// // // // //         </div>
// // // // //       </div>

// // // // //       <div className={styles.queryBuilder}>
// // // // //         <div className={styles.clause}>
// // // // //           <span className={styles.clauseTitle}>SELECT</span>
// // // // //           <div className={styles.selectOptions}>
// // // // //             <label className={styles.selectOption}>
// // // // //               <input
// // // // //                 type="checkbox"
// // // // //                 checked={query.select.includes('*')}
// // // // //                 onChange={() => handleSelectChange('*')}
// // // // //                 className={styles.checkbox}
// // // // //               />
// // // // //               <span className={styles.optionText}>*</span>
// // // // //             </label>
// // // // //             {schema[activeTab].columns.map(column => (
// // // // //               <label key={column} className={styles.selectOption}>
// // // // //                 <input
// // // // //                   type="checkbox"
// // // // //                   checked={query.select.includes(column)}
// // // // //                   onChange={() => handleSelectChange(column)}
// // // // //                   className={styles.checkbox}
// // // // //                 />
// // // // //                 <span className={styles.optionText}>{column}</span>
// // // // //               </label>
// // // // //             ))}
// // // // //             {aggregateFunctions.map(func => (
// // // // //               schema[activeTab].columns.map(col => (
// // // // //                 <label key={`${func}(${col})`} className={styles.selectOption}>
// // // // //                   <input
// // // // //                     type="checkbox"
// // // // //                     checked={query.select.includes(`${func}(${col})`)}
// // // // //                     onChange={() => handleSelectChange(`${func}(${col})`)}
// // // // //                     className={styles.checkbox}
// // // // //                   />
// // // // //                   <span className={styles.optionText}>{`${func}(${col})`}</span>
// // // // //                 </label>
// // // // //               ))
// // // // //             ))}
// // // // //           </div>
// // // // //         </div>

// // // // //         <div className={styles.clause}>
// // // // //           <span className={styles.clauseTitle}>FROM</span>
// // // // //           <select 
// // // // //             value={query.from}
// // // // //             onChange={(e) => setQuery({...query, from: e.target.value})}
// // // // //             className={styles.select}
// // // // //           >
// // // // //             <option value="">Select a table</option>
// // // // //             {Object.keys(schema).map(table => (
// // // // //               <option key={table} value={table}>{table}</option>
// // // // //             ))}
// // // // //           </select>
// // // // //         </div>

// // // // //         <div className={styles.clause}>
// // // // //           <span className={styles.clauseTitle}>WHERE</span>
// // // // //           <input
// // // // //             value={query.where}
// // // // //             onChange={(e) => setQuery({...query, where: e.target.value})}
// // // // //             placeholder="e.g. age > 25"
// // // // //             className={styles.input}
// // // // //           />
// // // // //         </div>

// // // // //         <div className={styles.clause}>
// // // // //           <span className={styles.clauseTitle}>GROUP BY</span>
// // // // //           <select
// // // // //             value={query.groupBy}
// // // // //             onChange={(e) => setQuery({...query, groupBy: e.target.value})}
// // // // //             className={styles.select}
// // // // //           >
// // // // //             <option value="">Select a column</option>
// // // // //             {schema[activeTab].columns.map(column => (
// // // // //               <option key={column} value={column}>{column}</option>
// // // // //             ))}
// // // // //           </select>
// // // // //         </div>

// // // // //         <div className={styles.clause}>
// // // // //           <span className={styles.clauseTitle}>HAVING</span>
// // // // //           <input
// // // // //             value={query.having}
// // // // //             onChange={(e) => setQuery({...query, having: e.target.value})}
// // // // //             placeholder="e.g. COUNT(*) > 1"
// // // // //             className={styles.input}
// // // // //             disabled={!query.groupBy}
// // // // //           />
// // // // //         </div>

// // // // //         <div className={styles.clause}>
// // // // //           <span className={styles.clauseTitle}>ORDER BY</span>
// // // // //           <select
// // // // //             value={query.orderBy}
// // // // //             onChange={(e) => setQuery({...query, orderBy: e.target.value})}
// // // // //             className={styles.select}
// // // // //           >
// // // // //             <option value="">Select a column</option>
// // // // //             {schema[activeTab].columns.map(column => (
// // // // //               <option key={column} value={column}>{column}</option>
// // // // //             ))}
// // // // //           </select>
// // // // //           <select
// // // // //             value={query.orderDir}
// // // // //             onChange={(e) => setQuery({...query, orderDir: e.target.value})}
// // // // //             className={styles.select}
// // // // //           >
// // // // //             <option value="ASC">ASC</option>
// // // // //             <option value="DESC">DESC</option>
// // // // //           </select>
// // // // //         </div>
// // // // //       </div>

// // // // //       <button 
// // // // //         onClick={executeQuery} 
// // // // //         className={styles.executeButton}
// // // // //         disabled={errors.length > 0}
// // // // //       >
// // // // //         Execute Query
// // // // //       </button>

// // // // //       {errors.length > 0 && (
// // // // //         <Alert variant="destructive" className={styles.alert}>
// // // // //           <AlertTitle>Errors in Query</AlertTitle>
// // // // //           <AlertDescription>
// // // // //             <ul className={styles.errorList}>
// // // // //               {errors.map((error, index) => (
// // // // //                 <li key={index}>{error}</li>
// // // // //               ))}
// // // // //             </ul>
// // // // //           </AlertDescription>
// // // // //         </Alert>
// // // // //       )}

// // // // //       {queryResult && (
// // // // //         <div className={styles.queryResult}>
// // // // //           <h3 className={styles.resultTitle}>Query Result:</h3>
// // // // //           <div className={styles.tableWrapper}>
// // // // //             <table className={styles.table}>
// // // // //               <thead>
// // // // //                 <tr>
// // // // //                   {Object.keys(queryResult[0]).map(key => (
// // // // //                     <th key={key} className={styles.th}>{key}</th>
// // // // //                   ))}
// // // // //                 </tr>
// // // // //               </thead>
// // // // //               <tbody>
// // // // //                 {queryResult.map((row, index) => (
// // // // //                   <tr key={index} className={index % 2 === 0 ? styles.evenRow : ''}>
// // // // //                     {Object.values(row).map((value, i) => (
// // // // //                       <td key={i} className={styles.td}>{value}</td>
// // // // //                     ))}
// // // // //                   </tr>
// // // // //                 ))}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default QuerySimulator;

// // // // import React, { useState, useEffect } from 'react';
// // // // import styles from './QuerySimulator.module.css';

// // // // // Sample database schema
// // // // const schema = {
// // // //   users: {
// // // //     columns: ['id', 'name', 'age', 'city'],
// // // //     data: [
// // // //       { id: 1, name: 'John Doe', age: 30, city: 'New York' },
// // // //       { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
// // // //       { id: 3, name: 'Bob Johnson', age: 35, city: 'Chicago' },
// // // //       { id: 4, name: 'Alice Brown', age: 28, city: 'New York' },
// // // //     ]
// // // //   },
// // // //   orders: {
// // // //     columns: ['id', 'user_id', 'product', 'amount'],
// // // //     data: [
// // // //       { id: 1, user_id: 1, product: 'Widget', amount: 100 },
// // // //       { id: 2, user_id: 2, product: 'Gadget', amount: 75 },
// // // //       { id: 3, user_id: 1, product: 'Doohickey', amount: 50 },
// // // //     ]
// // // //   }
// // // // };

// // // // const aggregateFunctions = ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN'];

// // // // const QuerySimulator = () => {
// // // //   const [activeTab, setActiveTab] = useState(Object.keys(schema)[0]);
// // // //   const [query, setQuery] = useState({
// // // //     select: ['*'],
// // // //     from: '',
// // // //     where: '',
// // // //     groupBy: '',
// // // //     having: '',
// // // //     orderBy: '',
// // // //     orderDir: 'ASC'
// // // //   });
// // // //   const [queryResult, setQueryResult] = useState(null);
// // // //   const [errors, setErrors] = useState([]);

// // // //   useEffect(() => {
// // // //     validateQuery();
// // // //   }, [query]);

// // // //   const validateQuery = () => {
// // // //     const newErrors = [];
// // // //     if (!query.from) {
// // // //       newErrors.push("FROM clause is required. Please select a table.");
// // // //     }
// // // //     if (query.groupBy && !query.select.some(col => col.includes('('))) {
// // // //       newErrors.push("When using GROUP BY, at least one aggregate function should be used in SELECT.");
// // // //     }
// // // //     if (query.having && !query.groupBy) {
// // // //       newErrors.push("HAVING clause can only be used with GROUP BY.");
// // // //     }
// // // //     setErrors(newErrors);
// // // //   };

// // // //   const executeQuery = () => {
// // // //     // Simplified query execution logic
// // // //     let result = schema[query.from].data;

// // // //     // Apply WHERE clause (simplified)
// // // //     if (query.where) {
// // // //       result = result.filter(row => {
// // // //         try {
// // // //           return eval(query.where.replace(/([a-zA-Z]+)/g, 'row.$1'));
// // // //         } catch {
// // // //           return true;
// // // //         }
// // // //       });
// // // //     }

// // // //     // Apply GROUP BY and aggregate functions (simplified)
// // // //     if (query.groupBy) {
// // // //       const grouped = {};
// // // //       result.forEach(row => {
// // // //         const key = row[query.groupBy];
// // // //         if (!grouped[key]) grouped[key] = [];
// // // //         grouped[key].push(row);
// // // //       });
// // // //       result = Object.entries(grouped).map(([key, group]) => {
// // // //         const aggregated = { [query.groupBy]: key };
// // // //         query.select.forEach(col => {
// // // //           if (col.includes('(')) {
// // // //             const [func, field] = col.split('(');
// // // //             const cleanField = field.replace(')', '');
// // // //             aggregated[col] = calculateAggregate(func, group, cleanField);
// // // //           }
// // // //         });
// // // //         return aggregated;
// // // //       });
// // // //     }

// // // //     // Apply HAVING clause (simplified)
// // // //     if (query.having) {
// // // //       result = result.filter(row => {
// // // //         try {
// // // //           return eval(query.having.replace(/([a-zA-Z]+)/g, 'row.$1'));
// // // //         } catch {
// // // //           return true;
// // // //         }
// // // //       });
// // // //     }

// // // //     // Apply ORDER BY
// // // //     if (query.orderBy) {
// // // //       result.sort((a, b) => {
// // // //         return query.orderDir === 'DESC' ? b[query.orderBy] - a[query.orderBy] : a[query.orderBy] - b[query.orderBy];
// // // //       });
// // // //     }

// // // //     // Select only requested columns
// // // //     if (!query.select.includes('*')) {
// // // //       result = result.map(row => {
// // // //         const newRow = {};
// // // //         query.select.forEach(col => {
// // // //           newRow[col] = row[col];
// // // //         });
// // // //         return newRow;
// // // //       });
// // // //     }

// // // //     setQueryResult(result);
// // // //   };

// // // //   const calculateAggregate = (func, group, field) => {
// // // //     switch (func) {
// // // //       case 'COUNT':
// // // //         return group.length;
// // // //       case 'SUM':
// // // //         return group.reduce((sum, row) => sum + row[field], 0);
// // // //       case 'AVG':
// // // //         return group.reduce((sum, row) => sum + row[field], 0) / group.length;
// // // //       case 'MAX':
// // // //         return Math.max(...group.map(row => row[field]));
// // // //       case 'MIN':
// // // //         return Math.min(...group.map(row => row[field]));
// // // //       default:
// // // //         return null;
// // // //     }
// // // //   };

// // // //   const handleSelectChange = (value) => {
// // // //     setQuery(prev => ({
// // // //       ...prev,
// // // //       select: prev.select.includes(value)
// // // //         ? prev.select.filter(item => item !== value)
// // // //         : [...prev.select.filter(item => item !== '*'), value]
// // // //     }));
// // // //   };

// // // //   const isColumnSelected = (column) => {
// // // //     return query.select.includes(column) || query.select.includes('*');
// // // //   };

// // // //   return (
// // // //     <div className={styles.container}>
// // // //       <h1 className={styles.title}>Query Simulator</h1>
      
// // // //       <div className={styles.tabContainer}>
// // // //         {Object.keys(schema).map((table, index) => (
// // // //           <button
// // // //             key={table}
// // // //             onClick={() => setActiveTab(table)}
// // // //             className={`${styles.tab} ${activeTab === table ? styles.activeTab : ''}`}
// // // //           >
// // // //             {table}
// // // //           </button>
// // // //         ))}
// // // //       </div>
// // // //       <div className={styles.tableDisplay}>
// // // //         <h2 className={styles.tableTitle}>{activeTab} Table</h2>
// // // //         <div className={styles.tableWrapper}>
// // // //           <table className={styles.table}>
// // // //             <thead>
// // // //               <tr>
// // // //                 {schema[activeTab].columns.map(column => (
// // // //                   <th key={column} className={`${styles.th} ${isColumnSelected(column) ? styles.highlightedColumn : ''}`}>
// // // //                     {column}
// // // //                   </th>
// // // //                 ))}
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody>
// // // //               {schema[activeTab].data.map((row, rowIndex) => (
// // // //                 <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.evenRow : ''}>
// // // //                   {schema[activeTab].columns.map(column => (
// // // //                     <td key={column} className={`${styles.td} ${isColumnSelected(column) ? styles.highlightedColumn : ''}`}>
// // // //                       {row[column]}
// // // //                     </td>
// // // //                   ))}
// // // //                 </tr>
// // // //               ))}
// // // //             </tbody>
// // // //           </table>
// // // //         </div>
// // // //       </div>

// // // //       <div className={styles.queryBuilder}>
// // // //         <div className={styles.clause}>
// // // //           <span className={styles.clauseTitle}>SELECT</span>
// // // //           <div className={styles.selectOptions}>
// // // //             <label className={styles.selectOption}>
// // // //               <input
// // // //                 type="checkbox"
// // // //                 checked={query.select.includes('*')}
// // // //                 onChange={() => handleSelectChange('*')}
// // // //                 className={styles.checkbox}
// // // //               />
// // // //               <span className={styles.optionText}>*</span>
// // // //             </label>
// // // //             {schema[activeTab].columns.map(column => (
// // // //               <label key={column} className={styles.selectOption}>
// // // //                 <input
// // // //                   type="checkbox"
// // // //                   checked={query.select.includes(column)}
// // // //                   onChange={() => handleSelectChange(column)}
// // // //                   className={styles.checkbox}
// // // //                 />
// // // //                 <span className={styles.optionText}>{column}</span>
// // // //               </label>
// // // //             ))}
// // // //             {aggregateFunctions.map(func => (
// // // //               schema[activeTab].columns.map(col => (
// // // //                 <label key={`${func}(${col})`} className={styles.selectOption}>
// // // //                   <input
// // // //                     type="checkbox"
// // // //                     checked={query.select.includes(`${func}(${col})`)}
// // // //                     onChange={() => handleSelectChange(`${func}(${col})`)}
// // // //                     className={styles.checkbox}
// // // //                   />
// // // //                   <span className={styles.optionText}>{`${func}(${col})`}</span>
// // // //                 </label>
// // // //               ))
// // // //             ))}
// // // //           </div>
// // // //         </div>

// // // //         <div className={styles.clause}>
// // // //           <span className={styles.clauseTitle}>FROM</span>
// // // //           <select 
// // // //             value={query.from}
// // // //             onChange={(e) => setQuery({...query, from: e.target.value})}
// // // //             className={styles.select}
// // // //           >
// // // //             <option value="">Select a table</option>
// // // //             {Object.keys(schema).map(table => (
// // // //               <option key={table} value={table}>{table}</option>
// // // //             ))}
// // // //           </select>
// // // //         </div>

// // // //         <div className={styles.clause}>
// // // //           <span className={styles.clauseTitle}>WHERE</span>
// // // //           <input
// // // //             value={query.where}
// // // //             onChange={(e) => setQuery({...query, where: e.target.value})}
// // // //             placeholder="e.g. age > 25"
// // // //             className={styles.input}
// // // //           />
// // // //         </div>

// // // //         <div className={styles.clause}>
// // // //           <span className={styles.clauseTitle}>GROUP BY</span>
// // // //           <select
// // // //             value={query.groupBy}
// // // //             onChange={(e) => setQuery({...query, groupBy: e.target.value})}
// // // //             className={styles.select}
// // // //           >
// // // //             <option value="">Select a column</option>
// // // //             {schema[activeTab].columns.map(column => (
// // // //               <option key={column} value={column}>{column}</option>
// // // //             ))}
// // // //           </select>
// // // //         </div>

// // // //         <div className={styles.clause}>
// // // //           <span className={styles.clauseTitle}>HAVING</span>
// // // //           <input
// // // //             value={query.having}
// // // //             onChange={(e) => setQuery({...query, having: e.target.value})}
// // // //             placeholder="e.g. COUNT(*) > 1"
// // // //             className={styles.input}
// // // //             disabled={!query.groupBy}
// // // //           />
// // // //         </div>

// // // //         <div className={styles.clause}>
// // // //           <span className={styles.clauseTitle}>ORDER BY</span>
// // // //           <select
// // // //             value={query.orderBy}
// // // //             onChange={(e) => setQuery({...query, orderBy: e.target.value})}
// // // //             className={styles.select}
// // // //           >
// // // //             <option value="">Select a column</option>
// // // //             {schema[activeTab].columns.map(column => (
// // // //               <option key={column} value={column}>{column}</option>
// // // //             ))}
// // // //           </select>
// // // //           <select
// // // //             value={query.orderDir}
// // // //             onChange={(e) => setQuery({...query, orderDir: e.target.value})}
// // // //             className={styles.select}
// // // //           >
// // // //             <option value="ASC">ASC</option>
// // // //             <option value="DESC">DESC</option>
// // // //           </select>
// // // //         </div>
// // // //       </div>

// // // //       <button 
// // // //         onClick={executeQuery} 
// // // //         className={styles.executeButton}
// // // //         disabled={errors.length > 0}
// // // //       >
// // // //         Execute Query
// // // //       </button>

// // // //       {errors.length > 0 && (
// // // //         <div className={styles.errorContainer}>
// // // //           <h3>Errors in Query</h3>
// // // //           <ul className={styles.errorList}>
// // // //             {errors.map((error, index) => (
// // // //               <li key={index}>{error}</li>
// // // //             ))}
// // // //           </ul>
// // // //         </div>
// // // //       )}

// // // //       {queryResult && (
// // // //         <div className={styles.queryResult}>
// // // //           <h3 className={styles.resultTitle}>Query Result:</h3>
// // // //           <div className={styles.tableWrapper}>
// // // //             <table className={styles.table}>
// // // //               <thead>
// // // //                 <tr>
// // // //                   {Object.keys(queryResult[0]).map(key => (
// // // //                     <th key={key} className={styles.th}>{key}</th>
// // // //                   ))}
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody>
// // // //                 {queryResult.map((row, index) => (
// // // //                   <tr key={index} className={index % 2 === 0 ? styles.evenRow : ''}>
// // // //                     {Object.values(row).map((value, i) => (
// // // //                       <td key={i} className={styles.td}>{value}</td>
// // // //                     ))}
// // // //                   </tr>
// // // //                 ))}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default QuerySimulator;
// // // import React, { useState, useEffect } from 'react';
// // // import styles from './QuerySimulator.module.css';

// // // const schema = {
// // //   users: {
// // //     columns: ['id', 'name', 'age', 'city'],
// // //     data: [
// // //       { id: 1, name: 'John Doe', age: 30, city: 'New York' },
// // //       { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
// // //       { id: 3, name: 'Bob Johnson', age: 35, city: 'Chicago' },
// // //       { id: 4, name: 'Alice Brown', age: 28, city: 'New York' },
// // //     ]
// // //   },
// // //   orders: {
// // //     columns: ['id', 'user_id', 'product', 'amount'],
// // //     data: [
// // //       { id: 1, user_id: 1, product: 'Widget', amount: 100 },
// // //       { id: 2, user_id: 2, product: 'Gadget', amount: 75 },
// // //       { id: 3, user_id: 1, product: 'Doohickey', amount: 50 },
// // //     ]
// // //   }
// // // };

// // // const aggregateFunctions = ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN'];

// // // const QuerySimulator = () => {
// // //   const [activeTab, setActiveTab] = useState(Object.keys(schema)[0]);
// // //   const [query, setQuery] = useState({
// // //     select: ['*'],
// // //     from: activeTab,
// // //     where: '',
// // //     groupBy: '',
// // //     having: '',
// // //     orderBy: '',
// // //     orderDir: 'ASC'
// // //   });
// // //   const [queryResult, setQueryResult] = useState(null);
// // //   const [errors, setErrors] = useState([]);

// // //   useEffect(() => {
// // //     validateQuery();
// // //   }, [query]);

// // //   const validateQuery = () => {
// // //     const newErrors = [];
// // //     if (!query.from) {
// // //       newErrors.push("FROM clause is required. Please select a table.");
// // //     }
// // //     if (query.groupBy && !query.select.some(col => col.includes('('))) {
// // //       newErrors.push("When using GROUP BY, at least one aggregate function should be used in SELECT.");
// // //     }
// // //     if (query.having && !query.groupBy) {
// // //       newErrors.push("HAVING clause can only be used with GROUP BY.");
// // //     }
// // //     setErrors(newErrors);
// // //   };

// // //   const executeQuery = () => {
// // //     // ... (keep existing executeQuery logic)
// // //   };

// // //   const handleSelectChange = (value) => {
// // //     setQuery(prev => ({
// // //       ...prev,
// // //       select: prev.select.includes(value)
// // //         ? prev.select.filter(item => item !== value)
// // //         : [...prev.select.filter(item => item !== '*'), value]
// // //     }));
// // //   };

// // //   const isColumnSelected = (column) => {
// // //     return query.select.includes(column) || query.select.includes('*');
// // //   };

// // //   return (
// // //     <div className={styles.container}>
// // //       <h1 className={styles.title}>Query Simulator</h1>
      
// // //       <div className={styles.layout}>
// // //         <div className={styles.tablesSection}>
// // //           <div className={styles.tabContainer}>
// // //             {Object.keys(schema).map((table) => (
// // //               <button
// // //                 key={table}
// // //                 onClick={() => {
// // //                   setActiveTab(table);
// // //                   setQuery(prev => ({ ...prev, from: table }));
// // //                 }}
// // //                 className={`${styles.tab} ${activeTab === table ? styles.activeTab : ''}`}
// // //               >
// // //                 {table}
// // //               </button>
// // //             ))}
// // //           </div>
// // //           <div className={styles.tableDisplay}>
// // //             <h2 className={styles.tableTitle}>{activeTab} Table</h2>
// // //             <div className={styles.tableWrapper}>
// // //               <table className={styles.table}>
// // //                 <thead>
// // //                   <tr>
// // //                     {schema[activeTab].columns.map(column => (
// // //                       <th key={column} className={`${styles.th} ${isColumnSelected(column) ? styles.highlightedColumn : ''}`}>
// // //                         {column}
// // //                       </th>
// // //                     ))}
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {schema[activeTab].data.map((row, rowIndex) => (
// // //                     <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.evenRow : ''}>
// // //                       {schema[activeTab].columns.map(column => (
// // //                         <td key={column} className={`${styles.td} ${isColumnSelected(column) ? styles.highlightedColumn : ''}`}>
// // //                           {row[column]}
// // //                         </td>
// // //                       ))}
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </table>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <div className={styles.queryBuilder}>
// // //           <div className={styles.clause}>
// // //             <h2 className={styles.clauseTitle}>SELECT</h2>
// // //             <div className={styles.checkboxGroup}>
// // //               <label className={styles.label}>
// // //                 <input
// // //                   type="checkbox"
// // //                   checked={query.select.includes('*')}
// // //                   onChange={() => handleSelectChange('*')}
// // //                   className={styles.checkbox}
// // //                 />
// // //                 <span className={styles.columnName}>*</span>
// // //               </label>
// // //               {schema[activeTab].columns.map(column => (
// // //                 <label key={column} className={styles.label}>
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={query.select.includes(column)}
// // //                     onChange={() => handleSelectChange(column)}
// // //                     className={styles.checkbox}
// // //                   />
// // //                   <span className={styles.columnName}>{column}</span>
// // //                 </label>
// // //               ))}
// // //             </div>
// // //             <div className={styles.checkboxGroup}>
// // //               {aggregateFunctions.map(func => (
// // //                 schema[activeTab].columns.map(col => (
// // //                   <label key={`${func}(${col})`} className={styles.label}>
// // //                     <input
// // //                       type="checkbox"
// // //                       checked={query.select.includes(`${func}(${col})`)}
// // //                       onChange={() => handleSelectChange(`${func}(${col})`)}
// // //                       className={styles.checkbox}
// // //                     />
// // //                     <span className={styles.columnName}>{`${func}(${col})`}</span>
// // //                   </label>
// // //                 ))
// // //               ))}
// // //             </div>
// // //             <div className={styles.result}>
// // //               <strong>Current SELECT clause:</strong>
// // //               <pre className={styles.code}>
// // //                 SELECT {query.select.join(', ')}
// // //               </pre>
// // //             </div>
// // //           </div>

// // //           <div className={styles.clause}>
// // //             <span className={styles.clauseTitle}>FROM</span>
// // //             <select 
// // //               value={query.from}
// // //               onChange={(e) => setQuery({...query, from: e.target.value})}
// // //               className={styles.select}
// // //             >
// // //               {Object.keys(schema).map(table => (
// // //                 <option key={table} value={table}>{table}</option>
// // //               ))}
// // //             </select>
// // //           </div>

// // //           <div className={styles.clause}>
// // //             <span className={styles.clauseTitle}>WHERE</span>
// // //             <input
// // //               value={query.where}
// // //               onChange={(e) => setQuery({...query, where: e.target.value})}
// // //               placeholder="e.g. age > 25"
// // //               className={styles.input}
// // //             />
// // //           </div>

// // //           <div className={styles.clause}>
// // //             <span className={styles.clauseTitle}>GROUP BY</span>
// // //             <select
// // //               value={query.groupBy}
// // //               onChange={(e) => setQuery({...query, groupBy: e.target.value})}
// // //               className={styles.select}
// // //             >
// // //               <option value="">Select a column</option>
// // //               {schema[activeTab].columns.map(column => (
// // //                 <option key={column} value={column}>{column}</option>
// // //               ))}
// // //             </select>
// // //           </div>

// // //           <div className={styles.clause}>
// // //             <span className={styles.clauseTitle}>HAVING</span>
// // //             <input
// // //               value={query.having}
// // //               onChange={(e) => setQuery({...query, having: e.target.value})}
// // //               placeholder="e.g. COUNT(*) > 1"
// // //               className={styles.input}
// // //               disabled={!query.groupBy}
// // //             />
// // //           </div>

// // //           <div className={styles.clause}>
// // //             <span className={styles.clauseTitle}>ORDER BY</span>
// // //             <select
// // //               value={query.orderBy}
// // //               onChange={(e) => setQuery({...query, orderBy: e.target.value})}
// // //               className={styles.select}
// // //             >
// // //               <option value="">Select a column</option>
// // //               {schema[activeTab].columns.map(column => (
// // //                 <option key={column} value={column}>{column}</option>
// // //               ))}
// // //             </select>
// // //             <select
// // //               value={query.orderDir}
// // //               onChange={(e) => setQuery({...query, orderDir: e.target.value})}
// // //               className={styles.select}
// // //             >
// // //               <option value="ASC">ASC</option>
// // //               <option value="DESC">DESC</option>
// // //             </select>
// // //           </div>

// // //           <button 
// // //             onClick={executeQuery} 
// // //             className={styles.executeButton}
// // //             disabled={errors.length > 0}
// // //           >
// // //             Execute Query
// // //           </button>

// // //           {errors.length > 0 && (
// // //             <div className={styles.errorContainer}>
// // //               <h3>Errors in Query</h3>
// // //               <ul className={styles.errorList}>
// // //                 {errors.map((error, index) => (
// // //                   <li key={index}>{error}</li>
// // //                 ))}
// // //               </ul>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {queryResult && (
// // //         <div className={styles.queryResult}>
// // //           <h3 className={styles.resultTitle}>Query Result:</h3>
// // //           <div className={styles.tableWrapper}>
// // //             <table className={styles.table}>
// // //               <thead>
// // //                 <tr>
// // //                   {Object.keys(queryResult[0]).map(key => (
// // //                     <th key={key} className={styles.th}>{key}</th>
// // //                   ))}
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {queryResult.map((row, index) => (
// // //                   <tr key={index} className={index % 2 === 0 ? styles.evenRow : ''}>
// // //                     {Object.values(row).map((value, i) => (
// // //                       <td key={i} className={styles.td}>{value}</td>
// // //                     ))}
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default QuerySimulator;
// // import React, { useState, useEffect } from 'react';
// // import styles from './QuerySimulator.module.css';

// // const schema = {
// //   users: {
// //     columns: ['id', 'name', 'age', 'city'],
// //     data: [
// //       { id: 1, name: 'John Doe', age: 30, city: 'New York' },
// //       { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
// //       { id: 3, name: 'Bob Johnson', age: 35, city: 'Chicago' },
// //       { id: 4, name: 'Alice Brown', age: 28, city: 'New York' },
// //     ]
// //   },
// //   orders: {
// //     columns: ['id', 'user_id', 'product', 'amount'],
// //     data: [
// //       { id: 1, user_id: 1, product: 'Widget', amount: 100 },
// //       { id: 2, user_id: 2, product: 'Gadget', amount: 75 },
// //       { id: 3, user_id: 1, product: 'Doohickey', amount: 50 },
// //     ]
// //   }
// // };

// // const aggregateFunctions = ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN'];

// // const QuerySimulator = () => {
// //   const [activeTab, setActiveTab] = useState(Object.keys(schema)[0]);
// //   const [query, setQuery] = useState({
// //     select: ['*'],
// //     from: activeTab,
// //     where: '',
// //     groupBy: '',
// //     having: '',
// //     orderBy: '',
// //     orderDir: 'ASC'
// //   });
// //   const [queryResult, setQueryResult] = useState(null);
// //   const [errors, setErrors] = useState([]);

// //   useEffect(() => {
// //     validateQuery();
// //   }, [query]);

// //   const validateQuery = () => {
// //     const newErrors = [];
// //     if (!query.from) {
// //       newErrors.push("FROM clause is required. Please select a table.");
// //     }
// //     if (query.groupBy && !query.select.some(col => col.includes('('))) {
// //       newErrors.push("When using GROUP BY, at least one aggregate function should be used in SELECT.");
// //     }
// //     if (query.having && !query.groupBy) {
// //       newErrors.push("HAVING clause can only be used with GROUP BY.");
// //     }
// //     setErrors(newErrors);
// //   };

// //   const executeQuery = () => {
// //     // ... (keep existing executeQuery logic)
// //   };

// //   const handleSelectChange = (value) => {
// //     setQuery(prev => ({
// //       ...prev,
// //       select: prev.select.includes(value)
// //         ? prev.select.filter(item => item !== value)
// //         : [...prev.select.filter(item => item !== '*'), value]
// //     }));
// //   };

// //   const isColumnSelected = (column) => {
// //     return query.select.includes(column) || query.select.includes('*');
// //   };

// //   return (
// //     <div className={styles.container}>
// //       <h1 className={styles.title}>Query Simulator</h1>
      
// //       <div className={styles.layout}>
// //         <div className={styles.tablesSection}>
// //           <div className={styles.tabContainer}>
// //             {Object.keys(schema).map((table) => (
// //               <button
// //                 key={table}
// //                 onClick={() => {
// //                   setActiveTab(table);
// //                   setQuery(prev => ({ ...prev, from: table }));
// //                 }}
// //                 className={`${styles.tab} ${activeTab === table ? styles.activeTab : ''}`}
// //               >
// //                 {table}
// //               </button>
// //             ))}
// //           </div>
// //           <div className={styles.tableDisplay}>
// //             <h2 className={styles.tableTitle}>{activeTab} Table</h2>
// //             <div className={styles.tableWrapper}>
// //               <table className={styles.table}>
// //                 <thead>
// //                   <tr>
// //                     {schema[activeTab].columns.map(column => (
// //                       <th key={column} className={`${styles.th} ${isColumnSelected(column) ? styles.highlightedColumn : ''}`}>
// //                         {column}
// //                       </th>
// //                     ))}
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {schema[activeTab].data.map((row, rowIndex) => (
// //                     <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.evenRow : ''}>
// //                       {schema[activeTab].columns.map(column => (
// //                         <td key={column} className={`${styles.td} ${isColumnSelected(column) ? styles.highlightedColumn : ''}`}>
// //                           {row[column]}
// //                         </td>
// //                       ))}
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </div>

// //         <div className={styles.queryBuilder}>
// //           <div className={styles.clause}>
// //             <h2 className={styles.clauseTitle}>SELECT</h2>
// //             <div className={styles.checkboxGroup}>
// //               <label className={styles.label}>
// //                 <input
// //                   type="checkbox"
// //                   checked={query.select.includes('*')}
// //                   onChange={() => handleSelectChange('*')}
// //                   className={styles.checkbox}
// //                 />
// //                 <span className={styles.columnName}>*</span>
// //               </label>
// //               {schema[activeTab].columns.map(column => (
// //                 <label key={column} className={styles.label}>
// //                   <input
// //                     type="checkbox"
// //                     checked={query.select.includes(column)}
// //                     onChange={() => handleSelectChange(column)}
// //                     className={styles.checkbox}
// //                   />
// //                   <span className={styles.columnName}>{column}</span>
// //                 </label>
// //               ))}
// //             </div>
// //             <div className={styles.checkboxGroup}>
// //               {aggregateFunctions.map(func => (
// //                 schema[activeTab].columns.map(col => (
// //                   <label key={`${func}(${col})`} className={styles.label}>
// //                     <input
// //                       type="checkbox"
// //                       checked={query.select.includes(`${func}(${col})`)}
// //                       onChange={() => handleSelectChange(`${func}(${col})`)}
// //                       className={styles.checkbox}
// //                     />
// //                     <span className={styles.columnName}>{`${func}(${col})`}</span>
// //                   </label>
// //                 ))
// //               ))}
// //             </div>
// //             <div className={styles.result}>
// //               <strong>Current SELECT clause:</strong>
// //               <pre className={styles.code}>
// //                 SELECT {query.select.join(', ')}
// //               </pre>
// //             </div>
// //           </div>

// //           <div className={styles.clause}>
// //             <span className={styles.clauseTitle}>FROM</span>
// //             <select 
// //               value={query.from}
// //               onChange={(e) => setQuery({...query, from: e.target.value})}
// //               className={styles.select}
// //             >
// //               {Object.keys(schema).map(table => (
// //                 <option key={table} value={table}>{table}</option>
// //               ))}
// //             </select>
// //           </div>

// //           <div className={styles.clause}>
// //             <span className={styles.clauseTitle}>WHERE</span>
// //             <input
// //               value={query.where}
// //               onChange={(e) => setQuery({...query, where: e.target.value})}
// //               placeholder="e.g. age > 25"
// //               className={styles.input}
// //             />
// //           </div>

// //           <div className={styles.clause}>
// //             <span className={styles.clauseTitle}>GROUP BY</span>
// //             <select
// //               value={query.groupBy}
// //               onChange={(e) => setQuery({...query, groupBy: e.target.value})}
// //               className={styles.select}
// //             >
// //               <option value="">Select a column</option>
// //               {schema[activeTab].columns.map(column => (
// //                 <option key={column} value={column}>{column}</option>
// //               ))}
// //             </select>
// //           </div>

// //           <div className={styles.clause}>
// //             <span className={styles.clauseTitle}>HAVING</span>
// //             <input
// //               value={query.having}
// //               onChange={(e) => setQuery({...query, having: e.target.value})}
// //               placeholder="e.g. COUNT(*) > 1"
// //               className={styles.input}
// //               disabled={!query.groupBy}
// //             />
// //           </div>

// //           <div className={styles.clause}>
// //             <span className={styles.clauseTitle}>ORDER BY</span>
// //             <select
// //               value={query.orderBy}
// //               onChange={(e) => setQuery({...query, orderBy: e.target.value})}
// //               className={styles.select}
// //             >
// //               <option value="">Select a column</option>
// //               {schema[activeTab].columns.map(column => (
// //                 <option key={column} value={column}>{column}</option>
// //               ))}
// //             </select>
// //             <select
// //               value={query.orderDir}
// //               onChange={(e) => setQuery({...query, orderDir: e.target.value})}
// //               className={styles.select}
// //             >
// //               <option value="ASC">ASC</option>
// //               <option value="DESC">DESC</option>
// //             </select>
// //           </div>

// //           <button 
// //             onClick={executeQuery} 
// //             className={styles.executeButton}
// //             disabled={errors.length > 0}
// //           >
// //             Execute Query
// //           </button>

// //           {errors.length > 0 && (
// //             <div className={styles.errorContainer}>
// //               <h3>Errors in Query</h3>
// //               <ul className={styles.errorList}>
// //                 {errors.map((error, index) => (
// //                   <li key={index}>{error}</li>
// //                 ))}
// //               </ul>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {queryResult && (
// //         <div className={styles.queryResult}>
// //           <h3 className={styles.resultTitle}>Query Result:</h3>
// //           <div className={styles.tableWrapper}>
// //             <table className={styles.table}>
// //               <thead>
// //                 <tr>
// //                   {Object.keys(queryResult[0]).map(key => (
// //                     <th key={key} className={styles.th}>{key}</th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {queryResult.map((row, index) => (
// //                   <tr key={index} className={index % 2 === 0 ? styles.evenRow : ''}>
// //                     {Object.values(row).map((value, i) => (
// //                       <td key={i} className={styles.td}>{value}</td>
// //                     ))}
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default QuerySimulator;
// // import React, { useState, useEffect } from 'react';
// // import styles from './QuerySimulator.module.css';

// // const schema = {
// //   users: {
// //     columns: ['id', 'name', 'age', 'city'],
// //     data: [
// //       { id: 1, name: 'John Doe', age: 30, city: 'New York' },
// //       { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
// //       { id: 3, name: 'Bob Johnson', age: 35, city: 'Chicago' },
// //       { id: 4, name: 'Alice Brown', age: 28, city: 'New York' },
// //     ]
// //   },
// //   orders: {
// //     columns: ['id', 'user_id', 'product', 'amount'],
// //     data: [
// //       { id: 1, user_id: 1, product: 'Widget', amount: 100 },
// //       { id: 2, user_id: 2, product: 'Gadget', amount: 75 },
// //       { id: 3, user_id: 1, product: 'Doohickey', amount: 50 },
// //     ]
// //   }
// // };

// // const aggregateFunctions = ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN'];

// // const QuerySimulator = () => {
// //   const [activeTab, setActiveTab] = useState(Object.keys(schema)[0]);
// //   const [query, setQuery] = useState({
// //     select: ['*'],
// //     from: activeTab,
// //     where: '',
// //     groupBy: '',
// //     having: '',
// //     orderBy: '',
// //     orderDir: 'ASC'
// //   });
// //   const [queryResult, setQueryResult] = useState(null);
// //   const [errors, setErrors] = useState([]);
// //   const [showSelectOptions, setShowSelectOptions] = useState(false);

// //   useEffect(() => {
// //     validateQuery();
// //   }, [query]);

// //   const validateQuery = () => {
// //     const newErrors = [];
// //     if (!query.from) newErrors.push("FROM clause is required.");
// //     if (query.groupBy && !query.select.some(col => col.includes('('))) {
// //       newErrors.push("When using GROUP BY, use at least one aggregate function in SELECT.");
// //     }
// //     if (query.having && !query.groupBy) newErrors.push("HAVING requires GROUP BY.");
// //     setErrors(newErrors);
// //   };

// // //   const executeQuery = () => {
// // //     // Simplified query execution
// // //     setQueryResult(schema[query.from].data);
// // //   };

// // // 

// // // const executeQuery = () => {
// // //     // Start with a deep copy of the original data
// // //     let result = JSON.parse(JSON.stringify(schema[query.from].data));
  
// // //     // Apply WHERE clause
// // //     if (query.where) {
// // //       result = result.filter(row => {
// // //         try {
// // //           const condition = query.where.replace(/\b(\w+)\b/g, (match) => {
// // //             return schema[query.from].columns.includes(match) ? `row['${match}']` : match;
// // //           });
// // //           return eval(condition);
// // //         } catch (error) {
// // //           console.error('Error in WHERE clause:', error);
// // //           return true;
// // //         }
// // //       });
// // //     }
  
// // //     // Apply GROUP BY and aggregations
// // //     if (query.groupBy) {
// // //       const groups = {};
// // //       result.forEach(row => {
// // //         const key = row[query.groupBy];
// // //         if (!groups[key]) groups[key] = [];
// // //         groups[key].push(row);
// // //       });
  
// // //       result = Object.entries(groups).map(([key, group]) => {
// // //         const newRow = { [query.groupBy]: key };
// // //         query.select.forEach(col => {
// // //           if (col.includes('(')) {
// // //             const [func, field] = col.split('(');
// // //             const cleanField = field.replace(')', '');
// // //             newRow[col] = calculateAggregate(func, group, cleanField);
// // //           } else if (col !== query.groupBy && col !== '*') {
// // //             newRow[col] = group[0][col];
// // //           }
// // //         });
// // //         return newRow;
// // //       });
// // //     }
  
// // //     // Apply HAVING clause
// // //     if (query.having) {
// // //       result = result.filter(row => {
// // //         try {
// // //           const condition = query.having.replace(/\b(\w+)\b/g, (match) => {
// // //             return Object.keys(row).includes(match) ? `row['${match}']` : match;
// // //           });
// // //           return eval(condition);
// // //         } catch (error) {
// // //           console.error('Error in HAVING clause:', error);
// // //           return true;
// // //         }
// // //       });
// // //     }
  
// // //     // Apply ORDER BY
// // //     if (query.orderBy) {
// // //       result.sort((a, b) => {
// // //         if (a[query.orderBy] < b[query.orderBy]) return query.orderDir === 'ASC' ? -1 : 1;
// // //         if (a[query.orderBy] > b[query.orderBy]) return query.orderDir === 'ASC' ? 1 : -1;
// // //         return 0;
// // //       });
// // //     }
  
// // //     // Apply SELECT (if not *)
// // //     if (!query.select.includes('*')) {
// // //       result = result.map(row => {
// // //         const newRow = {};
// // //         query.select.forEach(col => {
// // //           if (col.includes('(')) {
// // //             newRow[col] = row[col];
// // //           } else {
// // //             newRow[col] = row[col];
// // //           }
// // //         });
// // //         return newRow;
// // //       });
// // //     }
  
// // //     setQueryResult(result);
// // //   };


// // // const executeQuery = () => {
// // //     let result = JSON.parse(JSON.stringify(schema[query.from].data));
  
// // //     // WHERE
// // //     if (query.where) {
// // //       result = result.filter(row => {
// // //         const condition = query.where.replace(/\b(\w+)\b/g, (match) => {
// // //           if (schema[query.from].columns.includes(match)) {
// // //             return typeof row[match] === 'string' ? `'${row[match]}'` : row[match];
// // //           }
// // //           return match;
// // //         });
// // //         try {
// // //           return eval(condition);
// // //         } catch (error) {
// // //           return false;
// // //         }
// // //       });
// // //     }
  
// // //     // GROUP BY and aggregations
// // //     if (query.groupBy) {
// // //       const groups = {};
// // //       result.forEach(row => {
// // //         const key = row[query.groupBy];
// // //         if (!groups[key]) groups[key] = [];
// // //         groups[key].push(row);
// // //       });
  
// // //       result = Object.entries(groups).map(([key, group]) => {
// // //         const newRow = { [query.groupBy]: key };
// // //         query.select.forEach(col => {
// // //           if (col.includes('(')) {
// // //             const [func, field] = col.split('(');
// // //             const cleanField = field.replace(')', '');
// // //             newRow[col] = calculateAggregate(func, group, cleanField);
// // //           } else if (col !== query.groupBy && col !== '*') {
// // //             newRow[col] = group[0][col];
// // //           }
// // //         });
// // //         return newRow;
// // //       });
// // //     }
  
// // //     // HAVING
// // //     if (query.having) {
// // //       result = result.filter(row => {
// // //         const condition = query.having.replace(/\b(\w+)\b/g, (match) => {
// // //           if (match in row) {
// // //             return typeof row[match] === 'string' ? `'${row[match]}'` : row[match];
// // //           }
// // //           return match;
// // //         });
// // //         try {
// // //           return eval(condition);
// // //         } catch (error) {
// // //           return false;
// // //         }
// // //       });
// // //     }
  
// // //     // ORDER BY
// // //     if (query.orderBy) {
// // //       result.sort((a, b) => {
// // //         if (a[query.orderBy] < b[query.orderBy]) return query.orderDir === 'ASC' ? -1 : 1;
// // //         if (a[query.orderBy] > b[query.orderBy]) return query.orderDir === 'ASC' ? 1 : -1;
// // //         return 0;
// // //       });
// // //     }
  
// // //     // SELECT
// // //     if (!query.select.includes('*')) {
// // //       result = result.map(row => {
// // //         const newRow = {};
// // //         query.select.forEach(col => {
// // //           if (col.includes('(')) {
// // //             newRow[col] = row[col];
// // //           } else {
// // //             newRow[col] = row[col];
// // //           }
// // //         });
// // //         return newRow;
// // //       });
// // //     }
  
// // //     setQueryResult(result);
// // //   };



// // const executeQuery = () => {
// //     let result = JSON.parse(JSON.stringify(schema[query.from].data));
  
// //     if (query.where) {
// //       result = result.filter(row => {
// //         const condition = query.where.replace(/([a-zA-Z_]+)\s*([=<>!]+)\s*([^=<>!\s]+)/g, (match, col, op, val) => {
// //           if (schema[query.from].columns.includes(col)) {
// //             const rowVal = row[col];
// //             if (typeof rowVal === 'string') {
// //               return `'${rowVal}' ${op} ${isNaN(val) ? `'${val}'` : val}`;
// //             }
// //             return `${rowVal} ${op} ${val}`;
// //           }
// //           return match;
// //         });
// //         try {
// //           return eval(condition);
// //         } catch (error) {
// //           console.error('Error in WHERE clause:', error);
// //           return false;
// //         }
// //       });
// //     }
  
// //     if (!query.select.includes('*')) {
// //       result = result.map(row => {
// //         const newRow = {};
// //         query.select.forEach(col => {
// //           if (row.hasOwnProperty(col)) {
// //             newRow[col] = row[col];
// //           }
// //         });
// //         return newRow;
// //       });
// //     }
  
// //     setQueryResult(result);
// //   };
  
// //   const calculateAggregate = (func, group, field) => {
// //     switch (func.toUpperCase()) {
// //       case 'COUNT': return group.length;
// //       case 'SUM': return group.reduce((sum, row) => sum + (parseFloat(row[field]) || 0), 0);
// //       case 'AVG': return group.reduce((sum, row) => sum + (parseFloat(row[field]) || 0), 0) / group.length;
// //       case 'MAX': return Math.max(...group.map(row => parseFloat(row[field]) || 0));
// //       case 'MIN': return Math.min(...group.map(row => parseFloat(row[field]) || 0));
// //       default: return null;
// //     }
// //   };


// // const handleSelectChange = (value) => {
// //     setQuery(prev => ({
// //       ...prev,
// //       select: prev.select.includes(value)
// //         ? prev.select.filter(item => item !== value)
// //         : [...prev.select.filter(item => item !== '*'), value]
// //     }));
// //   };

// //   const resetQuery = () => {
// //     setQuery({
// //       select: ['*'],
// //       from: activeTab,
// //       where: '',
// //       groupBy: '',
// //       having: '',
// //       orderBy: '',
// //       orderDir: 'ASC'
// //     });
// //     setQueryResult(null);
// //   };

// //   return (
// //     <div className={styles.container}>
// //       <h1 className={styles.title}>Query Simulator</h1>
      
// //       <div className={styles.layout}>
// //         <div className={styles.tablesSection}>
// //           <div className={styles.tabContainer}>
// //             {Object.keys(schema).map((table) => (
// //               <button
// //                 key={table}
// //                 onClick={() => {
// //                   setActiveTab(table);
// //                   setQuery(prev => ({ ...prev, from: table }));
// //                 }}
// //                 className={`${styles.tab} ${activeTab === table ? styles.activeTab : ''}`}
// //               >
// //                 {table}
// //               </button>
// //             ))}
// //           </div>

// //           <div className={styles.tableDisplay}>
// //   <h2 className={styles.tableTitle}>{activeTab} Table</h2>
// //   <div className={styles.tableWrapper}>
// //     <table className={styles.table}>
// //       <thead>
// //         <tr>
// //           {schema[activeTab].columns.map(column => (
// //             <th 
// //               key={column} 
// //               className={`${styles.th} ${query.select.includes(column) || query.select.includes('*') ? styles.highlightedColumn : ''}`}
// //             >
// //               {column}
// //             </th>
// //           ))}
// //         </tr>
// //       </thead>
// //       <tbody>
// //         {schema[activeTab].data.map((row, rowIndex) => (
// //           <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.evenRow : ''}>
// //             {schema[activeTab].columns.map(column => (
// //               <td 
// //                 key={column} 
// //                 className={`${styles.td} ${query.select.includes(column) || query.select.includes('*') ? styles.highlightedColumn : ''}`}
// //               >
// //                 {row[column]}
// //               </td>
// //             ))}
// //           </tr>
// //         ))}
// //       </tbody>
// //     </table>
// //   </div>
// // </div>
// //          {/* <div className={styles.tableDisplay}>
// //             <h2 className={styles.tableTitle}>{activeTab} Table</h2>
// //             <div className={styles.tableWrapper}>
// //               <table className={styles.table}>
// //                 <thead>
// //                   <tr>
// //                     {schema[activeTab].columns.map(column => (
// //                       <th key={column} className={styles.th}>{column}</th>
// //                     ))}
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {schema[activeTab].data.map((row, rowIndex) => (
// //                     <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.evenRow : ''}>
// //                       {schema[activeTab].columns.map(column => (
// //                         <td key={column} className={styles.td}>{row[column]}</td>
// //                       ))}
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>  */}
// //         </div>

// //         <div className={styles.queryBuilder}>
// //           <div className={styles.clause}>
// //             <span className={styles.clauseTitle}>SELECT</span>
// //             <span className={styles.selectPreview}>{query.select.join(', ')}</span>
// //             <button onClick={() => setShowSelectOptions(!showSelectOptions)} className={styles.toggleButton}>
// //               {showSelectOptions ? 'Hide' : 'Edit'}
// //             </button>
// //           </div>
// //           {showSelectOptions && (
// //             <div className={styles.selectOptions}>
// //               <div className={styles.checkboxGroup}>
// //                 <label className={styles.label}>
// //                   <input
// //                     type="checkbox"
// //                     checked={query.select.includes('*')}
// //                     onChange={() => handleSelectChange('*')}
// //                     className={styles.checkbox}
// //                   />
// //                   <span className={styles.columnName}>*</span>
// //                 </label>
// //                 {schema[activeTab].columns.map(column => (
// //                   <label key={column} className={styles.label}>
// //                     <input
// //                       type="checkbox"
// //                       checked={query.select.includes(column)}
// //                       onChange={() => handleSelectChange(column)}
// //                       className={styles.checkbox}
// //                     />
// //                     <span className={styles.columnName}>{column}</span>
// //                   </label>
// //                 ))}
// //               </div>
// //               <div className={styles.checkboxGroup}>
// //                 {aggregateFunctions.map(func => (
// //                   schema[activeTab].columns.map(col => (
// //                     <label key={`${func}(${col})`} className={styles.label}>
// //                       <input
// //                         type="checkbox"
// //                         checked={query.select.includes(`${func}(${col})`)}
// //                         onChange={() => handleSelectChange(`${func}(${col})`)}
// //                         className={styles.checkbox}
// //                       />
// //                       <span className={styles.columnName}>{`${func}(${col})`}</span>
// //                     </label>
// //                   ))
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           <div className={styles.clause}>
// //             <span className={styles.clauseTitle}>FROM</span>
// //             <select 
// //               value={query.from}
// //               onChange={(e) => setQuery({...query, from: e.target.value})}
// //               className={styles.select}
// //             >
// //               {Object.keys(schema).map(table => (
// //                 <option key={table} value={table}>{table}</option>
// //               ))}
// //             </select>
// //           </div>

// //           <div className={styles.clause}>
// //             <span className={styles.clauseTitle}>WHERE</span>
// //             <input
// //               value={query.where}
// //               onChange={(e) => setQuery({...query, where: e.target.value})}
// //               placeholder="e.g. age > 25"
// //               className={styles.input}
// //             />
// //           </div>

// //           <div className={styles.clause}>
// //             <span className={styles.clauseTitle}>GROUP BY</span>
// //             <select
// //               value={query.groupBy}
// //               onChange={(e) => setQuery({...query, groupBy: e.target.value})}
// //               className={styles.select}
// //             >
// //               <option value="">Select a column</option>
// //               {schema[activeTab].columns.map(column => (
// //                 <option key={column} value={column}>{column}</option>
// //               ))}
// //             </select>
// //           </div>

// //           <div className={styles.clause}>
// //             <span className={styles.clauseTitle}>HAVING</span>
// //             <input
// //               value={query.having}
// //               onChange={(e) => setQuery({...query, having: e.target.value})}
// //               placeholder="e.g. COUNT(*) > 1"
// //               className={styles.input}
// //               disabled={!query.groupBy}
// //             />
// //           </div>

// //           <div className={styles.clause}>
// //             <span className={styles.clauseTitle}>ORDER BY</span>
// //             <select
// //               value={query.orderBy}
// //               onChange={(e) => setQuery({...query, orderBy: e.target.value})}
// //               className={styles.select}
// //             >
// //               <option value="">Select a column</option>
// //               {schema[activeTab].columns.map(column => (
// //                 <option key={column} value={column}>{column}</option>
// //               ))}
// //             </select>
// //             <select
// //               value={query.orderDir}
// //               onChange={(e) => setQuery({...query, orderDir: e.target.value})}
// //               className={styles.select}
// //             >
// //               <option value="ASC">ASC</option>
// //               <option value="DESC">DESC</option>
// //             </select>
// //           </div>

// //           <div className={styles.buttonGroup}>
// //             <button 
// //               onClick={executeQuery} 
// //               className={styles.executeButton}
// //               disabled={errors.length > 0}
// //             >
// //               Execute Query
// //             </button>
// //             <button 
// //               onClick={resetQuery} 
// //               className={styles.resetButton}
// //             >
// //               Reset Query
// //             </button>
// //           </div>

// //           {errors.length > 0 && (
// //             <div className={styles.errorContainer}>
// //               <ul className={styles.errorList}>
// //                 {errors.map((error, index) => (
// //                   <li key={index}>{error}</li>
// //                 ))}
// //               </ul>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// // {/* 
// //       {queryResult && (
// //         <div className={styles.queryResult}>
// //           <h3 className={styles.resultTitle}>Query Result:</h3>
// //           <div className={styles.tableWrapper}>
// //             <table className={styles.table}>
// //               <thead>
// //                 <tr>
// //                   {Object.keys(queryResult[0]).map(key => (
// //                     <th key={key} className={styles.th}>{key}</th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {queryResult.map((row, index) => (
// //                   <tr key={index} className={index % 2 === 0 ? styles.evenRow : ''}>
// //                     {Object.values(row).map((value, i) => (
// //                       <td key={i} className={styles.td}>{value}</td>
// //                     ))}
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       )} */}

// // {queryResult && queryResult.length > 0 && (
// //   <div className={styles.queryResult}>
// //     <h3 className={styles.resultTitle}>Query Result:</h3>
// //     <div className={styles.tableWrapper}>
// //       <table className={styles.table}>
// //         <thead>
// //           <tr>
// //             {Object.keys(queryResult[0]).map(key => (
// //               <th key={key} className={styles.th}>{key}</th>
// //             ))}
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {queryResult.map((row, index) => (
// //             <tr key={index} className={index % 2 === 0 ? styles.evenRow : ''}>
// //               {Object.values(row).map((value, i) => (
// //                 <td key={i} className={styles.td}>{value}</td>
// //               ))}
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   </div>
// // )}
// //     </div>
// //   );
// // };

// // export default QuerySimulator;
// import React, { useState, useEffect } from 'react';
// import styles from './QuerySimulator.module.css';

// const schema = {
//   users: {
//     columns: ['id', 'name', 'age', 'city'],
//     data: [
//       { id: 1, name: 'John Doe', age: 30, city: 'New York' },
//       { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
//       { id: 3, name: 'Bob Johnson', age: 35, city: 'Chicago' },
//       { id: 4, name: 'Alice Brown', age: 28, city: 'New York' },
//     ]
//   },
//   orders: {
//     columns: ['id', 'user_id', 'product', 'amount'],
//     data: [
//       { id: 1, user_id: 1, product: 'Widget', amount: 100 },
//       { id: 2, user_id: 2, product: 'Gadget', amount: 75 },
//       { id: 3, user_id: 1, product: 'Doohickey', amount: 50 },
//     ]
//   }
// };

// const aggregateFunctions = ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN'];

// const QuerySimulator = () => {
//   const [activeTab, setActiveTab] = useState(Object.keys(schema)[0]);
//   const [query, setQuery] = useState({
//     select: ['*'],
//     from: activeTab,
//     where: '',
//     groupBy: '',
//     having: '',
//     orderBy: '',
//     orderDir: 'ASC'
//   });
//   const [queryResult, setQueryResult] = useState(null);
//   const [errors, setErrors] = useState([]);
//   const [showSelectOptions, setShowSelectOptions] = useState(false);

//   useEffect(() => {
//     validateQuery();
//   }, [query]);

//   const validateQuery = () => {
//     const newErrors = [];
//     if (!query.from) newErrors.push("FROM clause is required.");
//     if (query.groupBy && !query.select.some(col => col.includes('('))) {
//       newErrors.push("When using GROUP BY, use at least one aggregate function in SELECT.");
//     }
//     if (query.having && !query.groupBy) newErrors.push("HAVING requires GROUP BY.");
//     setErrors(newErrors);
//   };

//   const executeQuery = () => {
//     let result = JSON.parse(JSON.stringify(schema[query.from].data));
  
//     if (query.where) {
//       result = result.filter(row => {
//         const conditions = query.where.split(/\s+(?:AND|OR)\s+/);
//         return conditions.every(condition => {
//           const [column, operator, value] = condition.split(/\s*(=|!=|>|<|>=|<=)\s*/);
//           if (!schema[query.from].columns.includes(column)) {
//             console.error(`Invalid column: ${column}`);
//             return false;
//           }
//           const rowValue = row[column];
//           const compareValue = isNaN(value) ? value.replace(/^['"](.*)['"]$/, '$1') : Number(value);
          
//           switch (operator) {
//             case '=': return rowValue == compareValue;
//             case '!=': return rowValue != compareValue;
//             case '>': return rowValue > compareValue;
//             case '<': return rowValue < compareValue;
//             case '>=': return rowValue >= compareValue;
//             case '<=': return rowValue <= compareValue;
//             default:
//               console.error(`Invalid operator: ${operator}`);
//               return false;
//           }
//         });
//       });
//     }
  
//     if (query.groupBy) {
//       const groups = {};
//       result.forEach(row => {
//         const key = row[query.groupBy];
//         if (!groups[key]) groups[key] = [];
//         groups[key].push(row);
//       });
  
//       result = Object.entries(groups).map(([key, group]) => {
//         const newRow = { [query.groupBy]: key };
//         query.select.forEach(col => {
//           if (col.includes('(')) {
//             const [func, field] = col.split('(');
//             const cleanField = field.replace(')', '');
//             newRow[col] = calculateAggregate(func, group, cleanField);
//           } else if (col !== query.groupBy && col !== '*') {
//             newRow[col] = group[0][col];
//           }
//         });
//         return newRow;
//       });
//     }
  
//     if (query.having) {
//       result = result.filter(row => {
//         try {
//           const condition = query.having.replace(/\b(\w+)\b/g, (match) => {
//             return Object.keys(row).includes(match) ? `row['${match}']` : match;
//           });
//           return eval(condition);
//         } catch (error) {
//           console.error('Error in HAVING clause:', error);
//           return false;
//         }
//       });
//     }
  
//     if (query.orderBy) {
//       result.sort((a, b) => {
//         if (a[query.orderBy] < b[query.orderBy]) return query.orderDir === 'ASC' ? -1 : 1;
//         if (a[query.orderBy] > b[query.orderBy]) return query.orderDir === 'ASC' ? 1 : -1;
//         return 0;
//       });
//     }
  
//     if (!query.select.includes('*')) {
//       result = result.map(row => {
//         const newRow = {};
//         query.select.forEach(col => {
//           if (col.includes('(')) {
//             newRow[col] = row[col];
//           } else {
//             newRow[col] = row[col];
//           }
//         });
//         return newRow;
//       });
//     }
  
//     setQueryResult(result);
//   };
  
//   const calculateAggregate = (func, group, field) => {
//     switch (func.toUpperCase()) {
//       case 'COUNT': return group.length;
//       case 'SUM': return group.reduce((sum, row) => sum + (parseFloat(row[field]) || 0), 0);
//       case 'AVG': return group.reduce((sum, row) => sum + (parseFloat(row[field]) || 0), 0) / group.length;
//       case 'MAX': return Math.max(...group.map(row => parseFloat(row[field]) || 0));
//       case 'MIN': return Math.min(...group.map(row => parseFloat(row[field]) || 0));
//       default: return null;
//     }
//   };

//   const handleSelectChange = (value) => {
//     setQuery(prev => ({
//       ...prev,
//       select: prev.select.includes(value)
//         ? prev.select.filter(item => item !== value)
//         : [...prev.select.filter(item => item !== '*'), value]
//     }));
//   };

//   const resetQuery = () => {
//     setQuery({
//       select: ['*'],
//       from: activeTab,
//       where: '',
//       groupBy: '',
//       having: '',
//       orderBy: '',
//       orderDir: 'ASC'
//     });
//     setQueryResult(null);
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Query Simulator</h1>
      
//       <div className={styles.layout}>
//         <div className={styles.tablesSection}>
//           <div className={styles.tabContainer}>
//             {Object.keys(schema).map((table) => (
//               <button
//                 key={table}
//                 onClick={() => {
//                   setActiveTab(table);
//                   setQuery(prev => ({ ...prev, from: table }));
//                 }}
//                 className={`${styles.tab} ${activeTab === table ? styles.activeTab : ''}`}
//               >
//                 {table}
//               </button>
//             ))}
//           </div>

//           <div className={styles.tableDisplay}>
//             <h2 className={styles.tableTitle}>{activeTab} Table</h2>
//             <div className={styles.tableWrapper}>
//               <table className={styles.table}>
//                 <thead>
//                   <tr>
//                     {schema[activeTab].columns.map(column => (
//                       <th 
//                         key={column} 
//                         className={`${styles.th} ${query.select.includes(column) || query.select.includes('*') ? styles.highlightedColumn : ''}`}
//                       >
//                         {column}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {schema[activeTab].data.map((row, rowIndex) => (
//                     <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.evenRow : ''}>
//                       {schema[activeTab].columns.map(column => (
//                         <td 
//                           key={column} 
//                           className={`${styles.td} ${query.select.includes(column) || query.select.includes('*') ? styles.highlightedColumn : ''}`}
//                         >
//                           {row[column]}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         <div className={styles.queryBuilder}>
//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>SELECT</span>
//             <span className={styles.selectPreview}>{query.select.join(', ')}</span>
//             <button onClick={() => setShowSelectOptions(!showSelectOptions)} className={styles.toggleButton}>
//               {showSelectOptions ? 'Hide' : 'Edit'}
//             </button>
//           </div>
//           {showSelectOptions && (
//             <div className={styles.selectOptions}>
//               <div className={styles.checkboxGroup}>
//                 <label className={styles.label}>
//                   <input
//                     type="checkbox"
//                     checked={query.select.includes('*')}
//                     onChange={() => handleSelectChange('*')}
//                     className={styles.checkbox}
//                   />
//                   <span className={styles.columnName}>*</span>
//                 </label>
//                 {schema[activeTab].columns.map(column => (
//                   <label key={column} className={styles.label}>
//                     <input
//                       type="checkbox"
//                       checked={query.select.includes(column)}
//                       onChange={() => handleSelectChange(column)}
//                       className={styles.checkbox}
//                     />
//                     <span className={styles.columnName}>{column}</span>
//                   </label>
//                 ))}
//               </div>
//               <div className={styles.checkboxGroup}>
//                 {aggregateFunctions.map(func => (
//                   schema[activeTab].columns.map(col => (
//                     <label key={`${func}(${col})`} className={styles.label}>
//                       <input
//                         type="checkbox"
//                         checked={query.select.includes(`${func}(${col})`)}
//                         onChange={() => handleSelectChange(`${func}(${col})`)}
//                         className={styles.checkbox}
//                       />
//                       <span className={styles.columnName}>{`${func}(${col})`}</span>
//                     </label>
//                   ))
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>FROM</span>
//             <select 
//               value={query.from}
//               onChange={(e) => setQuery({...query, from: e.target.value})}
//               className={styles.select}
//             >
//               {Object.keys(schema).map(table => (
//                 <option key={table} value={table}>{table}</option>
//               ))}
//             </select>
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>WHERE</span>
//             <input
//               value={query.where}
//               onChange={(e) => setQuery({...query, where: e.target.value})}
//               placeholder="e.g. age > 25"
//               className={styles.input}
//             />
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>GROUP BY</span>
//             <select
//               value={query.groupBy}
//               onChange={(e) => setQuery({...query, groupBy: e.target.value})}
//               className={styles.select}
//             >
//               <option value="">Select a column</option>
//               {schema[activeTab].columns.map(column => (
//                 <option key={column} value={column}>{column}</option>
//               ))}
//             </select>
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>HAVING</span>
//             <input
//               value={query.having}
//               onChange={(e) => setQuery({...query, having: e.target.value})}
//               placeholder="e.g. COUNT(*) > 1"
//               className={styles.input}
//               disabled={!query.groupBy}
//             />
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>ORDER BY</span>
//             <select
//               value={query.orderBy}
//               onChange={(e) => setQuery({...query, orderBy: e.target.value})}
//               className={styles.select}
//             >
//               <option value="">Select a column</option>
//               {schema[activeTab].columns.map(column => (
//                 <option key={column} value={column}>{column}</option>
//               ))}
//             </select>
//             <select
//               value={query.orderDir}
//               onChange={(e) => setQuery({...query, orderDir: e.target.value})}
//               className={styles.select}
//             >
//               <option value="ASC">ASC</option>
//               <option value="DESC">DESC</option>
//             </select>
//           </div>

//           <div className={styles.buttonGroup}>
//             <button 
//               onClick={executeQuery} 
//               className={styles.executeButton}
//               disabled={errors.length > 0}
//             >
//               Execute Query
//             </button>
//             <button 
//               onClick={resetQuery} 
//               className={styles.resetButton}
//             >
//               Reset Query
//             </button>
//           </div>

//           {errors.length > 0 && (
//             <div className={styles.errorContainer}>
//               <ul className={styles.errorList}>
//                 {errors.map((error, index) => (
//                   <li key={index}>{error}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       {queryResult && queryResult.length > 0 && (
//         <div className={styles.queryResult}>
//           <h3 className={styles.resultTitle}>Query Result:</h3>
//           <div className={styles.tableWrapper}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   {Object.keys(queryResult[0]).map(key => (
//                     <th key={key} className={styles.th}>{key}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {queryResult.map((row, index) => (
//                   <tr key={index} className={index % 2 === 0 ? styles.evenRow : ''}>
//                     {Object.values(row).map((value, i) => (
//                       <td key={i} className={styles.td}>{value}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//     )};
  

// export default QuerySimulator;
// import React, { useState, useEffect, useRef } from 'react';
// import styles from './QuerySimulator.module.css';

// const schema = {
//   users: {
//     columns: ['id', 'name', 'age', 'city'],
//     data: [
//       { id: 1, name: 'John Doe', age: 30, city: 'New York' },
//       { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
//       { id: 3, name: 'Bob Johnson', age: 35, city: 'Chicago' },
//       { id: 4, name: 'Alice Brown', age: 28, city: 'New York' },
//     ]
//   },
//   orders: {
//     columns: ['id', 'user_id', 'product', 'amount'],
//     data: [
//       { id: 1, user_id: 1, product: 'Widget', amount: 100 },
//       { id: 2, user_id: 2, product: 'Gadget', amount: 75 },
//       { id: 3, user_id: 1, product: 'Doohickey', amount: 50 },
//     ]
//   }
// };

// const aggregateFunctions = ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN'];

// const QuerySimulator = () => {
//   const [activeTab, setActiveTab] = useState(Object.keys(schema)[0]);
//   const [query, setQuery] = useState({
//     select: [' '],
//     from: activeTab,
//     where: '',
//     groupBy: '',
//     having: '',
//     orderBy: '',
//     orderDir: 'ASC'
//   });
//   const [queryResult, setQueryResult] = useState(null);
//   const [errors, setErrors] = useState([]);
//   const [showSelectOptions, setShowSelectOptions] = useState(false);
//   const selectOptionsRef = useRef(null);

//   useEffect(() => {
//     validateQuery();
//   }, [query]);

// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (selectOptionsRef.current && !selectOptionsRef.current.contains(event.target)) {
// //         setShowSelectOptions(false);
// //       }
// //     };

// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, []);

// useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (selectOptionsRef.current && !selectOptionsRef.current.contains(event.target)) {
//         setShowSelectOptions(false);
//       }
//     };
  
//     if (showSelectOptions) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }
  
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showSelectOptions]);  

// const validateQuery = () => {
//     const newErrors = [];
//     if (!query.from) newErrors.push("FROM clause is required.");
//     if (query.groupBy && !query.select.some(col => col.includes('('))) {
//       newErrors.push("When using GROUP BY, use at least one aggregate function in SELECT.");
//     }
//     if (query.having && !query.groupBy) newErrors.push("HAVING requires GROUP BY.");
//     setErrors(newErrors);
//   };

//   const executeQuery = () => {
//     let result = JSON.parse(JSON.stringify(schema[query.from].data));
  
//     if (query.where) {
//       result = result.filter(row => {
//         const conditions = query.where.split(/\s+(?:AND|OR)\s+/);
//         return conditions.every(condition => {
//           const [column, operator, value] = condition.split(/\s*(=|!=|>|<|>=|<=)\s*/);
//           if (!schema[query.from].columns.includes(column)) {
//             console.error(`Invalid column: ${column}`);
//             return false;
//           }
//           const rowValue = row[column];
//           const compareValue = isNaN(value) ? value.replace(/^['"](.*)['"]$/, '$1') : Number(value);
          
//           switch (operator) {
//             case '=': return rowValue == compareValue;
//             case '!=': return rowValue != compareValue;
//             case '>': return rowValue > compareValue;
//             case '<': return rowValue < compareValue;
//             case '>=': return rowValue >= compareValue;
//             case '<=': return rowValue <= compareValue;
//             default:
//               console.error(`Invalid operator: ${operator}`);
//               return false;
//           }
//         });
//       });
//     }
  
//     if (query.groupBy) {
//       const groups = {};
//       result.forEach(row => {
//         const key = row[query.groupBy];
//         if (!groups[key]) groups[key] = [];
//         groups[key].push(row);
//       });
  
//       result = Object.entries(groups).map(([key, group]) => {
//         const newRow = { [query.groupBy]: key };
//         query.select.forEach(col => {
//           if (col.includes('(')) {
//             const [func, field] = col.split('(');
//             const cleanField = field.replace(')', '');
//             newRow[col] = calculateAggregate(func, group, cleanField);
//           } else if (col !== query.groupBy && col !== '*') {
//             newRow[col] = group[0][col];
//           }
//         });
//         return newRow;
//       });
//     }
  
//     if (query.having) {
//       result = result.filter(row => {
//         try {
//           const condition = query.having.replace(/\b(\w+)\b/g, (match) => {
//             return Object.keys(row).includes(match) ? `row['${match}']` : match;
//           });
//           return eval(condition);
//         } catch (error) {
//           console.error('Error in HAVING clause:', error);
//           return false;
//         }
//       });
//     }
  
//     if (query.orderBy) {
//       result.sort((a, b) => {
//         if (a[query.orderBy] < b[query.orderBy]) return query.orderDir === 'ASC' ? -1 : 1;
//         if (a[query.orderBy] > b[query.orderBy]) return query.orderDir === 'ASC' ? 1 : -1;
//         return 0;
//       });
//     }
  
//     if (!query.select.includes('*')) {
//       result = result.map(row => {
//         const newRow = {};
//         query.select.forEach(col => {
//           if (col.includes('(')) {
//             newRow[col] = row[col];
//           } else {
//             newRow[col] = row[col];
//           }
//         });
//         return newRow;
//       });
//     }
  
//     setQueryResult(result);
//   };
  
//   const calculateAggregate = (func, group, field) => {
//     switch (func.toUpperCase()) {
//       case 'COUNT': return group.length;
//       case 'SUM': return group.reduce((sum, row) => sum + (parseFloat(row[field]) || 0), 0);
//       case 'AVG': return group.reduce((sum, row) => sum + (parseFloat(row[field]) || 0), 0) / group.length;
//       case 'MAX': return Math.max(...group.map(row => parseFloat(row[field]) || 0));
//       case 'MIN': return Math.min(...group.map(row => parseFloat(row[field]) || 0));
//       default: return null;
//     }
//   };

//   const handleSelectChange = (value) => {
//     setQuery(prev => ({
//       ...prev,
//       select: prev.select.includes(value)
//         ? prev.select.filter(item => item !== value)
//         : [...prev.select.filter(item => item !== '*'), value]
//     }));
//   };

//   const resetQuery = () => {
//     setQuery({
//       select: [''],
//       from: activeTab,
//       where: '',
//       groupBy: '',
//       having: '',
//       orderBy: '',
//       orderDir: 'ASC'
//     });
//     setQueryResult(null);
//   };

//   const handleFromChange = (table) => {
//     setActiveTab(table);
//     setQuery(prev => ({ ...prev, from: table }));
//   };

// //   const toggleSelectOptions = () => {
// //     showSelectOptions?()=>{} :setShowSelectOptions(!showSelectOptions);
// //   };

// // const toggleSelectOptions = (event) => {
// //     event.preventDefault();
// //     event.stopPropagation();
// //     setShowSelectOptions(!showSelectOptions);
// //   };

// const toggleSelectOptions = (event) => {
//     event.stopPropagation();
//     setShowSelectOptions(prevState => !prevState);
//   };
  

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Query Simulator</h1>
      
//       <div className={styles.layout}>
//         <div className={styles.tablesSection}>
//           <div className={styles.tabContainer}>
//             {Object.keys(schema).map((table) => (
//               <button
//                 key={table}
//                 onClick={() => handleFromChange(table)}
//                 className={`${styles.tab} ${activeTab === table ? styles.activeTab : ''}`}
//               >
//                 {table}
//               </button>
//             ))}
//           </div>

//           <div className={styles.tableDisplay}>
//             <h2 className={styles.tableTitle}>{activeTab} Table</h2>
//             <div className={styles.tableWrapper}>
//               <table className={styles.table}>
//                 <thead>
//                   <tr>
//                     {schema[activeTab].columns.map(column => (
//                       <th 
//                         key={column} 
//                         className={`${styles.th} ${query.select.includes(column) || query.select.includes('*') ? styles.highlightedColumn : ''}`}
//                       >
//                         {column}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {schema[activeTab].data.map((row, rowIndex) => (
//                     <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.evenRow : ''}>
//                       {schema[activeTab].columns.map(column => (
//                         <td 
//                           key={column} 
//                           className={`${styles.td} ${query.select.includes(column) || query.select.includes('*') ? styles.highlightedColumn : ''}`}
//                         >
//                           {row[column]}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         <div className={styles.queryBuilder}>
//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>SELECT</span>
//             <span className={styles.select}>{query.select.join(', ')}</span>
//            {!showSelectOptions&&<button onClick={toggleSelectOptions}
//             className={styles.toggleButton} style={{width:'100px',height:'30px'}}>
//               {showSelectOptions ? 'Hide' : 'Edit'}
//             </button>}
//             {showSelectOptions&&<span 
//             className={styles.toggleButton} style={{width:'100px',
//             height:'30px',textAlign:'center',fontSize:'small'}}>Hide</span>}
//           </div>
//           {showSelectOptions && (
//             <div ref={selectOptionsRef} className={styles.selectOptions}>
//               <div className={styles.checkboxGroup}>
//                 <label className={styles.label}>
//                   <input
//                     type="checkbox"
//                     checked={query.select.includes('*')}
//                     onChange={() => handleSelectChange('*')}
//                     className={styles.checkbox}
//                   />
//                   <span className={styles.columnName}>*</span>
//                 </label>
//                 {schema[activeTab].columns.map(column => (
//                   <label key={column} className={styles.label}>
//                     <input
//                       type="checkbox"
//                       checked={query.select.includes(column)}
//                       onChange={() => handleSelectChange(column)}
//                       className={styles.checkbox}
//                     />
//                     <span className={styles.columnName}>{column}</span>
//                   </label>
//                 ))}
//               </div>
//               <div className={styles.checkboxGroup}>
//                 {aggregateFunctions.map(func => (
//                   schema[activeTab].columns.map(col => (
//                     <label key={`${func}(${col})`} className={styles.label}>
//                       <input
//                         type="checkbox"
//                         checked={query.select.includes(`${func}(${col})`)}
//                         onChange={() => handleSelectChange(`${func}(${col})`)}
//                         className={styles.checkbox}
//                       />
//                       <span className={styles.columnName}>{`${func}(${col})`}</span>
//                     </label>
//                   ))
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>FROM</span>
//             <select 
//               value={query.from}
//               onChange={(e) => handleFromChange(e.target.value)}
//               className={styles.select}
//             >
//               {Object.keys(schema).map(table => (
//                 <option key={table} value={table}>{table}</option>
//               ))}
//             </select>
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>WHERE</span>
//             <input
//               value={query.where}
//               onChange={(e) => setQuery({...query, where: e.target.value})}
//               placeholder="e.g. age > 25"
//               className={styles.input}
//             />
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>GROUP BY</span>
//             <select
//               value={query.groupBy}
//               onChange={(e) => setQuery({...query, groupBy: e.target.value})}
//               className={styles.select}
//             >
//               <option value="">Select a column</option>
//               {schema[activeTab].columns.map(column => (
//                 <option key={column} value={column}>{column}</option>
//               ))}
//             </select>
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>HAVING</span>
//             <input
//               value={query.having}
//               onChange={(e) => setQuery({...query, having: e.target.value})}
//               placeholder="e.g. COUNT(*) > 1"
//               className={styles.input}
//               disabled={!query.groupBy}
//             />
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>ORDER BY</span>
//             <select
//               value={query.orderBy}
//               onChange={(e) => setQuery({...query, orderBy: e.target.value})}
//               className={styles.select}
//             >
//               <option value="">Select a column</option>
//               {schema[activeTab].columns.map(column => (
//                 <option key={column} value={column}>{column}</option>
//               ))}
//             </select>
//             <select
//               value={query.orderDir}
//               onChange={(e) => setQuery({...query, orderDir: e.target.value})}
//               className={styles.select}
//             >
//               <option value="ASC">ASC</option>
//               <option value="DESC">DESC</option>
//             </select>
//           </div>

//           <div className={styles.buttonGroup}>
//             <button 
//               onClick={executeQuery} 
//               className={styles.executeButton}
//               disabled={errors.length > 0}
//             >
//               Execute Query
//             </button>
//             <button 
//               onClick={resetQuery} 
//               className={styles.resetButton}
//             >
//               Reset Query
//             </button>
//           </div>

//           {errors.length > 0 && (
//             <div className={styles.errorContainer}>
//               <ul className={styles.errorList}>
//                 {errors.map((error, index) => (
//                   <li key={index}>{error}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       {queryResult && queryResult.length > 0 && (
//         <div className={styles.queryResult}>
//           <h3 className={styles.resultTitle}>Query Result:</h3>
//           <div className={styles.tableWrapper}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   {Object.keys(queryResult[0]).map(key => (
//                     <th key={key} className={styles.th}>{key}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//               {queryResult.map((row, index) => (
//                   <tr key={index} className={index % 2 === 0 ? styles.evenRow : ''}>
//                     {Object.values(row).map((value, i) => (
//                       <td key={i} className={styles.td}>{value}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuerySimulator;

// import React, { useState, useEffect, useRef } from 'react';
// import styles from './QuerySimulator.module.css';

// const schema = {
//   users: {
//     columns: ['id', 'name', 'age', 'city'],
//     data: [
//       { id: 1, name: 'John Doe', age: 30, city: 'New York' },
//       { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
//       { id: 3, name: 'Bob Johnson', age: 35, city: 'Chicago' },
//       { id: 4, name: 'Alice Brown', age: 28, city: 'New York' },
//     ]
//   },
//   orders: {
//     columns: ['id', 'user_id', 'product', 'amount'],
//     data: [
//       { id: 1, user_id: 1, product: 'Widget', amount: 100 },
//       { id: 2, user_id: 2, product: 'Gadget', amount: 75 },
//       { id: 3, user_id: 1, product: 'Doohickey', amount: 50 },
//     ]
//   }
// };

// const aggregateFunctions = ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN'];

// const QuerySimulator = () => {
//   const [activeTab, setActiveTab] = useState(Object.keys(schema)[0]);
//   const [query, setQuery] = useState({
//     select: [''],
//     from: activeTab,
//     where: '',
//     groupBy: '',
//     having: '',
//     orderBy: '',
//     orderDir: 'ASC'
//   });
//   const [queryResult, setQueryResult] = useState(null);
//   const [errors, setErrors] = useState([]);
//   const [showSelectOptions, setShowSelectOptions] = useState(false);
//   const selectOptionsRef = useRef(null);

//   useEffect(() => {
//     validateQuery();
//   }, [query]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (selectOptionsRef.current && !selectOptionsRef.current.contains(event.target)) {
//         setShowSelectOptions(false);
//       }
//     };
  
//     if (showSelectOptions) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }
  
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showSelectOptions]);  

//   const validateQuery = () => {
//     const newErrors = [];
//     if (!query.from) newErrors.push("FROM clause is required.");
//     if (query.groupBy && !query.select.some(col => col.includes('('))) {
//       newErrors.push("When using GROUP BY, use at least one aggregate function in SELECT.");
//     }
//     if (query.having && !query.groupBy) newErrors.push("HAVING requires GROUP BY.");
//     setErrors(newErrors);
//   };

//   const executeQuery = () => {
//     let result = JSON.parse(JSON.stringify(schema[query.from].data));
  
//     if (query.where) {
//       result = result.filter(row => {
//         const conditions = query.where.split(/\s+(?:AND|OR)\s+/);
//         return conditions.every(condition => {
//           const [column, operator, value] = condition.split(/\s*(=|!=|>|<|>=|<=)\s*/);
//           if (!schema[query.from].columns.includes(column)) {
//             console.error(`Invalid column: ${column}`);
//             return false;
//           }
//           const rowValue = row[column];
//           const compareValue = isNaN(value) ? value.replace(/^['"](.*)['"]$/, '$1') : Number(value);
          
//           switch (operator) {
//             case '=': return rowValue == compareValue;
//             case '!=': return rowValue != compareValue;
//             case '>': return rowValue > compareValue;
//             case '<': return rowValue < compareValue;
//             case '>=': return rowValue >= compareValue;
//             case '<=': return rowValue <= compareValue;
//             default:
//               console.error(`Invalid operator: ${operator}`);
//               return false;
//           }
//         });
//       });
//     }
  
//     if (query.groupBy) {
//       const groups = {};
//       result.forEach(row => {
//         const key = row[query.groupBy];
//         if (!groups[key]) groups[key] = [];
//         groups[key].push(row);
//       });
  
//       result = Object.entries(groups).map(([key, group]) => {
//         const newRow = { [query.groupBy]: key };
//         query.select.forEach(col => {
//           if (col.includes('(')) {
//             const [func, field] = col.split('(');
//             const cleanField = field.replace(')', '');
//             newRow[col] = calculateAggregate(func, group, cleanField);
//           } else if (col !== query.groupBy && col !== '*') {
//             newRow[col] = group[0][col];
//           }
//         });
//         return newRow;
//       });
//     }
  
//     if (query.having) {
//       result = result.filter(row => {
//         try {
//           const condition = query.having.replace(/\b(\w+)\b/g, (match) => {
//             return Object.keys(row).includes(match) ? `row['${match}']` : match;
//           });
//           return eval(condition);
//         } catch (error) {
//           console.error('Error in HAVING clause:', error);
//           return false;
//         }
//       });
//     }
  
//     if (query.orderBy) {
//       result.sort((a, b) => {
//         if (a[query.orderBy] < b[query.orderBy]) return query.orderDir === 'ASC' ? -1 : 1;
//         if (a[query.orderBy] > b[query.orderBy]) return query.orderDir === 'ASC' ? 1 : -1;
//         return 0;
//       });
//     }
  
//     if (!query.select.includes('*')) {
//       result = result.map(row => {
//         const newRow = {};
//         query.select.forEach(col => {
//           if (col.includes('(')) {
//             newRow[col] = row[col];
//           } else {
//             newRow[col] = row[col];
//           }
//         });
//         return newRow;
//       });
//     }
  
//     setQueryResult(result);
//   };
  
//   const calculateAggregate = (func, group, field) => {
//     switch (func.toUpperCase()) {
//       case 'COUNT': return group.length;
//       case 'SUM': return group.reduce((sum, row) => sum + (parseFloat(row[field]) || 0), 0);
//       case 'AVG': return group.reduce((sum, row) => sum + (parseFloat(row[field]) || 0), 0) / group.length;
//       case 'MAX': return Math.max(...group.map(row => parseFloat(row[field]) || 0));
//       case 'MIN': return Math.min(...group.map(row => parseFloat(row[field]) || 0));
//       default: return null;
//     }
//   };

// //   const handleSelectChange = (value) => {
// //     setQuery(prev => ({
// //       ...prev,
// //       select: prev.select.includes(value)
// //         ? prev.select.filter(item => item !== value)
// //         : [...prev.select.filter(item => item !== '*'), value]
// //     }));
// //   };

// // const handleSelectChange = (value) => {
// //     setQuery(prev => {
// //       let newSelect;
// //       if (value === '*') {
// //         newSelect = ['*'];
// //       } else if (prev.select.includes(value)) {
// //         newSelect = prev.select.filter(item => item !== value);
// //       } else {
// //         newSelect = [...prev.select.filter(item => item !== '*'), value];
// //       }
// //       // Ensure we always have at least one column selected
// //       if (newSelect.length === 0) {
// //         newSelect = ['*'];
// //       }
// //       return { ...prev, select: newSelect };
// //     });
// //   }; 


// const handleSelectChange = (value) => {
//     setQuery(prev => {
//       let newSelect;
//       if (value === '*') {
//         newSelect = ['*'];
//       } else if (prev.select.includes(value)) {
//         newSelect = prev.select.filter(item => item !== value);
//       } else {
//         newSelect = [...prev.select.filter(item => item !== '*'), value];
//       }
//       return { ...prev, select: newSelect };
//     });
//   };


// const resetQuery = () => {
//     setQuery({
//       select: [''],
//       from: activeTab,
//       where: '',
//       groupBy: '',
//       having: '',
//       orderBy: '',
//       orderDir: 'ASC'
//     });
//     setQueryResult(null);
//   };

//   const handleFromChange = (table) => {
//     setActiveTab(table);
//     setQuery({
//       select: [''],
//       from: table,
//       where: '',
//       groupBy: '',
//       having: '',
//       orderBy: '',
//       orderDir: 'ASC'
//     });
//   };

//   const toggleSelectOptions = (event) => {
//     event.stopPropagation();
//     setShowSelectOptions(prevState => !prevState);
//   };

//   const resetField = (field) => {
//     setQuery(prev => ({
//       ...prev,
//       [field]: field === 'select' ? [''] : field === 'orderDir' ? 'ASC' : ''
//     }));
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Query Simulator</h1>
      
//       <div className={styles.layout}>
//         <div className={styles.tablesSection}>
//           <div className={styles.tabContainer}>
//             {Object.keys(schema).map((table) => (
//               <button
//                 key={table}
//                 onClick={() => handleFromChange(table)}
//                 className={`${styles.tab} ${activeTab === table ? styles.activeTab : ''}`}
//               >
//                 {table}
//               </button>
//             ))}
//           </div>

//           <div className={styles.tableDisplay}>
//             <h2 className={styles.tableTitle}>{activeTab} Table</h2>
//             <div className={styles.tableWrapper}>
//               <table className={styles.table}>
//                 <thead>
//                   <tr>
//                     {schema[activeTab].columns.map(column => (
//                       <th 
//                         key={column} 
//                         className={`${styles.th} ${query.select.includes(column) || query.select.includes('*') ? styles.highlightedColumn : ''}`}
//                       >
//                         {column}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {schema[activeTab].data.map((row, rowIndex) => (
//                     <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.evenRow : ''}>
//                       {schema[activeTab].columns.map(column => (
//                         <td 
//                           key={column} 
//                           className={`${styles.td} ${query.select.includes(column) || query.select.includes('*') ? styles.highlightedColumn : ''}`}
//                         >
//                           {row[column]}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         <div className={styles.queryBuilder}>
//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>SELECT</span>
//             <span className={styles.select}>{query.select.join(', ')}</span>
//             {!showSelectOptions && 
//               <button onClick={toggleSelectOptions} className={styles.toggleButton} style={{width:'60px',height:'32px',marginRight:'3px'}}>
//                 Edit
//               </button>
//             }
//             {showSelectOptions && 
//               <span className={styles.toggleButton} style={{width:'60px', height:'30px',textAlign:'center',fontSize:'small'}}>
//                 Hide
//               </span>
//             }
//             <button onClick={() => resetField('select')} className={styles.resetButton}>Reset</button>
//           </div>
//           {showSelectOptions && (
//             <div ref={selectOptionsRef} className={styles.selectOptions}>
//               <div className={styles.checkboxGroup}>
//                 <label className={styles.label}>
//                   <input
//                     type="checkbox"
//                     checked={query.select.includes('*')}
//                     onChange={() => handleSelectChange('*')}
//                     className={styles.checkbox}
//                   />
//                   <span className={styles.columnName}>*</span>
//                 </label>
//                 {schema[activeTab].columns.map(column => (
//                   <label key={column} className={styles.label}>
//                     <input
//                       type="checkbox"
//                       checked={query.select.includes(column)}
//                       onChange={() => handleSelectChange(column)}
//                       className={styles.checkbox}
//                     />
//                     <span className={styles.columnName}>{column}</span>
//                   </label>
//                 ))}
//               </div>
//               <div className={styles.checkboxGroup}>
//                 {aggregateFunctions.map(func => (
//                   schema[activeTab].columns.map(col => (
//                     <label key={`${func}(${col})`} className={styles.label}>
//                       <input
//                         type="checkbox"
//                         checked={query.select.includes(`${func}(${col})`)}
//                         onChange={() => handleSelectChange(`${func}(${col})`)}
//                         className={styles.checkbox}
//                       />
//                       <span className={styles.columnName}>{`${func}(${col})`}</span>
//                     </label>
//                   ))
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>FROM</span>
//             <select 
//               value={query.from}
//               onChange={(e) => handleFromChange(e.target.value)}
//               className={styles.select}
//             >
//               {Object.keys(schema).map(table => (
//                 <option key={table} value={table}>{table}</option>
//               ))}
//             </select>
//             <button onClick={() => resetField('from')} className={styles.resetButton}>Reset</button>
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>WHERE</span>
//             <input
//               value={query.where}
//               onChange={(e) => setQuery({...query, where: e.target.value})}
//               placeholder="e.g. age > 25"
//               className={styles.input}
//             />
//             <button onClick={() => resetField('where')} className={styles.resetButton}>Reset</button>
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>GROUP BY</span>
//             <select
//               value={query.groupBy}
//               onChange={(e) => setQuery({...query, groupBy: e.target.value})}
//               className={styles.select}
//             >
//               <option value="">Select a column</option>
//               {schema[activeTab].columns.map(column => (
//                 <option key={column} value={column}>{column}</option>
//               ))}
//             </select>
//             <button onClick={() => resetField('groupBy')} className={styles.resetButton}>Reset</button>
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>HAVING</span>
//             <input
//               value={query.having}
//               onChange={(e) => setQuery({...query, having: e.target.value})}
//               placeholder="e.g. COUNT(*) > 1"
//               className={styles.input}
//               disabled={!query.groupBy}
//             />
//             <button onClick={() => resetField('having')} className={styles.resetButton}>Reset</button>
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>ORDER BY</span>
//             <select
//               value={query.orderBy}
//               onChange={(e) => setQuery({...query, orderBy: e.target.value})}
//               className={styles.select}
//             >
//               <option value="">Select a column</option>
//               {schema[activeTab].columns.map(column => (
//                 <option key={column} value={column}>{column}</option>
//               ))}
//             </select>
//             <button onClick={() => resetField('orderBy')} className={styles.resetButton}>Reset</button>
//             <select
//               value={query.orderDir}
//               onChange={(e) => setQuery({...query, orderDir: e.target.value})}
//               className={styles.select}
//             >
//               <option value="ASC">ASC</option>
//               <option value="DESC">DESC</option>
//             </select>
           
//             <button onClick={() => resetField('orderDir')} className={styles.resetButton}>Reset</button>
//           </div>

//           <div className={styles.buttonGroup}>
//             <button 
//               onClick={executeQuery} 
//               className={styles.executeButton}
//               disabled={errors.length > 0}
//             >
//               Execute Query
//             </button>
//             <button 
//               onClick={resetQuery} 
//               className={styles.resetButton}
//             >
//               Reset Query
//             </button>
//           </div>

//           {errors.length > 0 && (
//             <div className={styles.errorContainer}>
//               <ul className={styles.errorList}>
//                 {errors.map((error, index) => (
//                   <li key={index}>{error}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       {queryResult && queryResult.length > 0 && (
//         <div className={styles.queryResult}>
//           <h3 className={styles.resultTitle}>Query Result:</h3>
//           <div className={styles.tableWrapper}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   {Object.keys(queryResult[0]).map(key => (
//                     <th key={key} className={styles.th}>{key}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {queryResult.map((row, index) => (
//                   <tr key={index} className={index % 2 === 0 ? styles.evenRow : ''}>
//                     {Object.values(row).map((value, i) => (
//                       <td key={i} className={styles.td}>{value}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuerySimulator;
// import React, { useState, useEffect, useRef } from 'react';
// import styles from './QuerySimulator.module.css';

// const schema = {
//   users: {
//     columns: ['id', 'name', 'age', 'city'],
//     data: [
//       { id: 1, name: 'John Doe', age: 30, city: 'New York' },
//       { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
//       { id: 3, name: 'Bob Johnson', age: 35, city: 'Chicago' },
//       { id: 4, name: 'Alice Brown', age: 28, city: 'New York' },
//     ]
//   },
//   orders: {
//     columns: ['id', 'user_id', 'product', 'amount'],
//     data: [
//       { id: 1, user_id: 1, product: 'Widget', amount: 100 },
//       { id: 2, user_id: 2, product: 'Gadget', amount: 75 },
//       { id: 3, user_id: 1, product: 'Doohickey', amount: 50 },
//     ]
//   }
// };

// const aggregateFunctions = ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN'];

// const QuerySimulator = () => {
//   const [activeTab, setActiveTab] = useState(Object.keys(schema)[0]);
//   const [query, setQuery] = useState({
//     select: [''],
//     from: activeTab,
//     where: '',
//     groupBy: '',
//     having: '',
//     orderBy: '',
//     orderDir: 'ASC'
//   });
//   const [queryResult, setQueryResult] = useState(null);
//   const [errors, setErrors] = useState([]);
//   const [showSelectOptions, setShowSelectOptions] = useState(false);
//   const selectOptionsRef = useRef(null);

//   useEffect(() => {
//     validateQuery();
//   }, [query]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (selectOptionsRef.current && !selectOptionsRef.current.contains(event.target)) {
//         setShowSelectOptions(false);
//       }
//     };
  
//     if (showSelectOptions) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }
  
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showSelectOptions]);  

//   const validateQuery = () => {
//     const newErrors = [];
//     if (!query.from) newErrors.push("FROM clause is required.");
//     if (query.select.length === 0 || (query.select.length === 1 && query.select[0] === '')) {
//       newErrors.push("SELECT clause is required. Please select at least one column.");
//     }
//     if (query.groupBy && !query.select.some(col => col.includes('('))) {
//       newErrors.push("When using GROUP BY, use at least one aggregate function in SELECT.");
//     }
//     if (query.having && !query.groupBy) newErrors.push("HAVING requires GROUP BY.");
//     setErrors(newErrors);
//   };

//   const executeQuery = () => {
//     if (errors.length > 0) {
//       return;
//     }

//     let result = JSON.parse(JSON.stringify(schema[query.from].data));
  
//     if (query.where) {
//       result = result.filter(row => {
//         const conditions = query.where.split(/\s+(?:AND|OR)\s+/);
//         return conditions.every(condition => {
//           const [column, operator, value] = condition.split(/\s*(=|!=|>|<|>=|<=)\s*/);
//           if (!schema[query.from].columns.includes(column)) {
//             console.error(`Invalid column: ${column}`);
//             return false;
//           }
//           const rowValue = row[column];
//           const compareValue = isNaN(value) ? value.replace(/^['"](.*)['"]$/, '$1') : Number(value);
          
//           switch (operator) {
//             case '=': return rowValue == compareValue;
//             case '!=': return rowValue != compareValue;
//             case '>': return rowValue > compareValue;
//             case '<': return rowValue < compareValue;
//             case '>=': return rowValue >= compareValue;
//             case '<=': return rowValue <= compareValue;
//             default:
//               console.error(`Invalid operator: ${operator}`);
//               return false;
//           }
//         });
//       });
//     }
  
//     if (query.groupBy) {
//       const groups = {};
//       result.forEach(row => {
//         const key = row[query.groupBy];
//         if (!groups[key]) groups[key] = [];
//         groups[key].push(row);
//       });
  
//       result = Object.entries(groups).map(([key, group]) => {
//         const newRow = { [query.groupBy]: key };
//         query.select.forEach(col => {
//           if (col.includes('(')) {
//             const [func, field] = col.split('(');
//             const cleanField = field.replace(')', '');
//             newRow[col] = calculateAggregate(func, group, cleanField);
//           } else if (col !== query.groupBy && col !== '*') {
//             newRow[col] = group[0][col];
//           }
//         });
//         return newRow;
//       });
//     }
  
//     if (query.having) {
//       result = result.filter(row => {
//         try {
//           const condition = query.having.replace(/\b(\w+)\b/g, (match) => {
//             return Object.keys(row).includes(match) ? `row['${match}']` : match;
//           });
//           return eval(condition);
//         } catch (error) {
//           console.error('Error in HAVING clause:', error);
//           return false;
//         }
//       });
//     }
  
//     if (query.orderBy) {
//       result.sort((a, b) => {
//         if (a[query.orderBy] < b[query.orderBy]) return query.orderDir === 'ASC' ? -1 : 1;
//         if (a[query.orderBy] > b[query.orderBy]) return query.orderDir === 'ASC' ? 1 : -1;
//         return 0;
//       });
//     }
  
//     if (!query.select.includes('*')) {
//       result = result.map(row => {
//         const newRow = {};
//         query.select.forEach(col => {
//           if (col.includes('(')) {
//             newRow[col] = row[col];
//           } else {
//             newRow[col] = row[col];
//           }
//         });
//         return newRow;
//       });
//     }
  
//     setQueryResult(result);
//   };
  
//   const calculateAggregate = (func, group, field) => {
//     switch (func.toUpperCase()) {
//       case 'COUNT': return group.length;
//       case 'SUM': return group.reduce((sum, row) => sum + (parseFloat(row[field]) || 0), 0);
//       case 'AVG': return group.reduce((sum, row) => sum + (parseFloat(row[field]) || 0), 0) / group.length;
//       case 'MAX': return Math.max(...group.map(row => parseFloat(row[field]) || 0));
//       case 'MIN': return Math.min(...group.map(row => parseFloat(row[field]) || 0));
//       default: return null;
//     }
//   };


// const handleSelectChange = (value) => {
//     setQuery(prev => {
//       let newSelect;
//       if (value === '*') {
//         newSelect = ['*'];
//       } else if (prev.select.includes(value)) {
//         newSelect = prev.select.filter(item => item !== value);
//       } else {
//         newSelect = [...prev.select.filter(item => item !== '*'), value];
//       }
//       // Ensure we always have at least one column selected
//       if (newSelect.length === 0) {
//         newSelect = ['*'];
//       }
//       return { ...prev, select: newSelect };
//     });
//   };

// const resetQuery = () => {
//     setQuery({
//       select: [''],
//       from: activeTab,
//       where: '',
//       groupBy: '',
//       having: '',
//       orderBy: '',
//       orderDir: 'ASC'
//     });
//     setQueryResult(null);
//   };

//   const handleFromChange = (table) => {
//     setActiveTab(table);
//     setQuery({
//       select: [''],
//       from: table,
//       where: '',
//       groupBy: '',
//       having: '',
//       orderBy: '',
//       orderDir: 'ASC'
//     });
//   };

//   const toggleSelectOptions = (event) => {
//     event.stopPropagation();
//     setShowSelectOptions(prevState => !prevState);
//   };

//   const resetField = (field) => {
//     setQuery(prev => ({
//       ...prev,
//       [field]: field === 'select' ? [''] : field === 'orderDir' ? 'ASC' : ''
//     }));
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Query Simulator</h1>
      
//       <div className={styles.layout}>
//         <div className={styles.tablesSection}>
//           <div className={styles.tabContainer}>
//             {Object.keys(schema).map((table) => (
//               <button
//                 key={table}
//                 onClick={() => handleFromChange(table)}
//                 className={`${styles.tab} ${activeTab === table ? styles.activeTab : ''}`}
//               >
//                 {table}
//               </button>
//             ))}
//           </div>

//           <div className={styles.tableDisplay}>
//             <h2 className={styles.tableTitle}>{activeTab} Table</h2>
//             <div className={styles.tableWrapper}>
//               <table className={styles.table}>
//                 <thead>
//                   <tr>
//                     {schema[activeTab].columns.map(column => (
//                       <th 
//                         key={column} 
//                         className={`${styles.th} ${query.select.includes(column) || query.select.includes('*') ? styles.highlightedColumn : ''}`}
//                       >
//                         {column}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {schema[activeTab].data.map((row, rowIndex) => (
//                     <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.evenRow : ''}>
//                       {schema[activeTab].columns.map(column => (
//                         <td 
//                           key={column} 
//                           className={`${styles.td} ${query.select.includes(column) || query.select.includes('*') ? styles.highlightedColumn : ''}`}
//                         >
//                           {row[column]}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         <div className={styles.queryBuilder}>
//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>SELECT</span>
//             <span className={styles.select}>{query.select.join(', ')}</span>
//             {!showSelectOptions && 
//               <button onClick={toggleSelectOptions} className={styles.toggleButton} style={{width:'60px',height:'32px',marginRight:'3px'}}>
//                 Edit
//               </button>
//             }
//             {showSelectOptions && 
//               <span className={styles.toggleButton} style={{width:'60px', height:'30px',textAlign:'center',fontSize:'small'}}>
//                 Hide
//               </span>
//             }
//             <button onClick={() => resetField('select')} className={styles.resetButton}>Reset</button>
//           </div>
//           {showSelectOptions && (
//             <div ref={selectOptionsRef} className={styles.selectOptions}>
//               <div className={styles.checkboxGroup}>
//                 <label className={styles.label}>
//                   <input
//                     type="checkbox"
//                     checked={query.select.includes('*')}
//                     onChange={() => handleSelectChange('*')}
//                     className={styles.checkbox}
//                   />
//                   <span className={styles.columnName}>*</span>
//                 </label>
//                 {schema[activeTab].columns.map(column => (
//                   <label key={column} className={styles.label}>
//                     <input
//                       type="checkbox"
//                       checked={query.select.includes(column)}
//                       onChange={() => handleSelectChange(column)}
//                       className={styles.checkbox}
//                     />
//                     <span className={styles.columnName}>{column}</span>
//                   </label>
//                 ))}
//               </div>
//               <div className={styles.checkboxGroup}>
//                 {aggregateFunctions.map(func => (
//                   schema[activeTab].columns.map(col => (
//                     <label key={`${func}(${col})`} className={styles.label}>
//                       <input
//                         type="checkbox"
//                         checked={query.select.includes(`${func}(${col})`)}
//                         onChange={() => handleSelectChange(`${func}(${col})`)}
//                         className={styles.checkbox}
//                       />
//                       <span className={styles.columnName}>{`${func}(${col})`}</span>
//                     </label>
//                   ))
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>FROM</span>
//             <select 
//               value={query.from}
//               onChange={(e) => handleFromChange(e.target.value)}
//               className={styles.select}
//             >
//               {Object.keys(schema).map(table => (
//                 <option key={table} value={table}>{table}</option>
//               ))}
//             </select>
//             <button onClick={() => resetField('from')} className={styles.resetButton}>Reset</button>
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>WHERE</span>
//             <input
//               value={query.where}
//               onChange={(e) => setQuery({...query, where: e.target.value})}
//               placeholder="e.g. age > 25"
//               className={styles.input}
//             />
//             <button onClick={() => resetField('where')} className={styles.resetButton}>Reset</button>
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>GROUP BY</span>
//             <select
//               value={query.groupBy}
//               onChange={(e) => setQuery({...query, groupBy: e.target.value})}
//               className={styles.select}
//             >
//               <option value="">Select a column</option>
//               {schema[activeTab].columns.map(column => (
//                 <option key={column} value={column}>{column}</option>
//               ))}
//             </select>
//             <button onClick={() => resetField('groupBy')} className={styles.resetButton}>Reset</button>
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>HAVING</span>
//             <input
//               value={query.having}
//               onChange={(e) => setQuery({...query, having: e.target.value})}
//               placeholder="e.g. COUNT(*) > 1"
//               className={styles.input}
//               disabled={!query.groupBy}
//             />
//             <button onClick={() => resetField('having')} className={styles.resetButton}>Reset</button>
//           </div>

//           <div className={styles.clause}>
//             <span className={styles.clauseTitle}>ORDER BY</span>
//             <select
//               value={query.orderBy}
//               onChange={(e) => setQuery({...query, orderBy: e.target.value})}
//               className={styles.select}
//             >
//              <option value="">Select a column</option>
//               {schema[activeTab].columns.map(column => (
//                 <option key={column} value={column}>{column}</option>
//               ))}
//             </select>
//             <button onClick={() => resetField('orderBy')} className={styles.resetButton}>Reset</button>
//             <select
//               value={query.orderDir}
//               onChange={(e) => setQuery({...query, orderDir: e.target.value})}
//               className={styles.select}
//             >
//               <option value="ASC">ASC</option>
//               <option value="DESC">DESC</option>
//             </select>
           
//             <button onClick={() => resetField('orderDir')} className={styles.resetButton}>Reset</button>
//           </div>

//           <div className={styles.buttonGroup}>
//             <button 
//               onClick={executeQuery} 
//               className={styles.executeButton}
//               disabled={errors.length > 0}
//             >
//               Execute Query
//             </button>
//             <button 
//               onClick={resetQuery} 
//               className={styles.resetButton}
//             >
//               Reset Query
//             </button>
//           </div>

//           {errors.length > 0 && (
//             <div className={styles.errorContainer}>
//               <ul className={styles.errorList}>
//                 {errors.map((error, index) => (
//                   <li key={index}>{error}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       {queryResult && queryResult.length > 0 && (
//         <div className={styles.queryResult}>
//           <h3 className={styles.resultTitle}>Query Result:</h3>
//           <div className={styles.tableWrapper}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   {Object.keys(queryResult[0]).map(key => (
//                     <th key={key} className={styles.th}>{key}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {queryResult.map((row, index) => (
//                   <tr key={index} className={index % 2 === 0 ? styles.evenRow : ''}>
//                     {Object.values(row).map((value, i) => (
//                       <td key={i} className={styles.td}>{value}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuerySimulator;
import React, { useState, useEffect, useRef } from 'react';
import styles from './QuerySimulator.module.css';

const schema = {
  users: {
    columns: ['id', 'name', 'age', 'city'],
    data: [
      { id: 1, name: 'John Doe', age: 30, city: 'New York' },
      { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
      { id: 3, name: 'Bob Johnson', age: 35, city: 'Chicago' },
      { id: 4, name: 'Alice Brown', age: 28, city: 'New York' },
    ]
  },
  orders: {
    columns: ['id', 'user_id', 'product', 'amount'],
    data: [
      { id: 1, user_id: 1, product: 'Widget', amount: 100 },
      { id: 2, user_id: 2, product: 'Gadget', amount: 75 },
      { id: 3, user_id: 1, product: 'Doohickey', amount: 50 },
    ]
  }
};

const aggregateFunctions = ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN'];

const QuerySimulator = () => {
  const [activeTab, setActiveTab] = useState(Object.keys(schema)[0]);
  const [query, setQuery] = useState({
    select: [''],
    from: activeTab,
    where: '',
    groupBy: '',
    having: '',
    orderBy: '',
    orderDir: 'ASC'
  });
  const [queryResult, setQueryResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [showSelectOptions, setShowSelectOptions] = useState(false);
  const selectOptionsRef = useRef(null);

//   useEffect(() => {
//     validateQuery();
//   }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectOptionsRef.current && !selectOptionsRef.current.contains(event.target)) {
        setShowSelectOptions(false);
      }
    };
  
    if (showSelectOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSelectOptions]);  

  const validateQuery = () => {
    const newErrors = [];
    if (!query.from) newErrors.push("FROM clause is required.");
    if (query.select.length === 0 || (query.select.length === 1 && query.select[0] === '')) {
      newErrors.push("SELECT clause is required. Please select at least one column.");
    }
    if (query.groupBy && !query.select.some(col => col.includes('('))) {
      newErrors.push("When using GROUP BY, use at least one aggregate function in SELECT.");
    }
    if (query.having && !query.groupBy) newErrors.push("HAVING requires GROUP BY.");
    setErrors(newErrors);
  };

//   const executeQuery = () => {
//     if (errors.length > 0) {
//       return;
//     }

//     let result = JSON.parse(JSON.stringify(schema[query.from].data));
  
//     if (query.where) {
//       result = result.filter(row => {
//         const conditions = query.where.split(/\s+(?:AND|OR)\s+/);
//         return conditions.every(condition => {
//           const [column, operator, value] = condition.split(/\s*(=|!=|>|<|>=|<=)\s*/);
//           if (!schema[query.from].columns.includes(column)) {
//             console.error(`Invalid column: ${column}`);
//             return false;
//           }
//           const rowValue = row[column];
//           const compareValue = isNaN(value) ? value.replace(/^['"](.*)['"]$/, '$1') : Number(value);
          
//           switch (operator) {
//             case '=': return rowValue == compareValue;
//             case '!=': return rowValue != compareValue;
//             case '>': return rowValue > compareValue;
//             case '<': return rowValue < compareValue;
//             case '>=': return rowValue >= compareValue;
//             case '<=': return rowValue <= compareValue;
//             default:
//               console.error(`Invalid operator: ${operator}`);
//               return false;
//           }
//         });
//       });
//     }
  
//     if (query.groupBy) {
//       const groups = {};
//       result.forEach(row => {
//         const key = row[query.groupBy];
//         if (!groups[key]) groups[key] = [];
//         groups[key].push(row);
//       });
  
//       result = Object.entries(groups).map(([key, group]) => {
//         const newRow = { [query.groupBy]: key };
//         query.select.forEach(col => {
//           if (col.includes('(')) {
//             const [func, field] = col.split('(');
//             const cleanField = field.replace(')', '');
//             newRow[col] = calculateAggregate(func, group, cleanField);
//           } else if (col !== query.groupBy && col !== '*') {
//             newRow[col] = group[0][col];
//           }
//         });
//         return newRow;
//       });
//     }
  
//     if (query.having) {
//       result = result.filter(row => {
//         try {
//           const condition = query.having.replace(/\b(\w+)\b/g, (match) => {
//             return Object.keys(row).includes(match) ? `row['${match}']` : match;
//           });
//           return eval(condition);
//         } catch (error) {
//           console.error('Error in HAVING clause:', error);
//           return false;
//         }
//       });
//     }
  
//     if (query.orderBy) {
//       result.sort((a, b) => {
//         if (a[query.orderBy] < b[query.orderBy]) return query.orderDir === 'ASC' ? -1 : 1;
//         if (a[query.orderBy] > b[query.orderBy]) return query.orderDir === 'ASC' ? 1 : -1;
//         return 0;
//       });
//     }
  
//     if (!query.select.includes('*')) {
//       result = result.map(row => {
//         const newRow = {};
//         query.select.forEach(col => {
//           if (col.includes('(') || col !== '') {
//             newRow[col] = row[col];
//           }
//         });
//         return newRow;
//       });
//     }
  
//     setQueryResult(result);
//   };
 

// const executeQuery = () => {
//     const newErrors = [];
//     if (!query.from) newErrors.push("FROM clause is required.");
//     if (query.select.length === 0 || (query.select.length === 1 && query.select[0] === '')) {
//       newErrors.push("SELECT clause is required. Please select at least one column.");
//     }
//     if (query.groupBy && !query.select.some(col => col.includes('('))) {
//       newErrors.push("When using GROUP BY, use at least one aggregate function in SELECT.");
//     }
//     if (query.having && !query.groupBy) newErrors.push("HAVING requires GROUP BY.");
  
//     if (newErrors.length > 0) {
//       setErrors(newErrors);
//       return;
//     }
  
//     setErrors([]);
  
//     let result = JSON.parse(JSON.stringify(schema[query.from].data));
  
//     if (query.where) {
//       result = result.filter(row => {
//         const conditions = query.where.split(/\s+(?:AND|OR)\s+/);
//         return conditions.every(condition => {
//           const [column, operator, value] = condition.split(/\s*(=|!=|>|<|>=|<=)\s*/);
//           if (!schema[query.from].columns.includes(column)) {
//             console.error(`Invalid column: ${column}`);
//             return false;
//           }
//           const rowValue = row[column];
//           const compareValue = isNaN(value) ? value.replace(/^['"](.*)['"]$/, '$1') : Number(value);
          
//           switch (operator) {
//             case '=': return rowValue == compareValue;
//             case '!=': return rowValue != compareValue;
//             case '>': return rowValue > compareValue;
//             case '<': return rowValue < compareValue;
//             case '>=': return rowValue >= compareValue;
//             case '<=': return rowValue <= compareValue;
//             default:
//               console.error(`Invalid operator: ${operator}`);
//               return false;
//           }
//         });
//       });
//     }
  
//     if (query.groupBy) {
//       const groups = {};
//       result.forEach(row => {
//         const key = row[query.groupBy];
//         if (!groups[key]) groups[key] = [];
//         groups[key].push(row);
//       });
  
//       result = Object.entries(groups).map(([key, group]) => {
//         const newRow = { [query.groupBy]: key };
//         query.select.forEach(col => {
//           if (col.includes('(')) {
//             const [func, field] = col.split('(');
//             const cleanField = field.replace(')', '');
//             switch (func.toUpperCase()) {
//               case 'COUNT': newRow[col] = group.length; break;
//               case 'SUM': newRow[col] = group.reduce((sum, row) => sum + (parseFloat(row[cleanField]) || 0), 0); break;
//               case 'AVG': newRow[col] = group.reduce((sum, row) => sum + (parseFloat(row[cleanField]) || 0), 0) / group.length; break;
//               case 'MAX': newRow[col] = Math.max(...group.map(row => parseFloat(row[cleanField]) || 0)); break;
//               case 'MIN': newRow[col] = Math.min(...group.map(row => parseFloat(row[cleanField]) || 0)); break;
//               default: newRow[col] = null;
//             }
//           } else if (col !== query.groupBy && col !== '*') {
//             newRow[col] = group[0][col];
//           }
//         });
//         return newRow;
//       });
//     }
  
//     if (query.having) {
//       result = result.filter(row => {
//         try {
//           const condition = query.having.replace(/\b(\w+)\b/g, (match) => {
//             return Object.keys(row).includes(match) ? `row['${match}']` : match;
//           });
//           return eval(condition);
//         } catch (error) {
//           console.error('Error in HAVING clause:', error);
//           return false;
//         }
//       });
//     }
  
//     if (query.orderBy) {
//       result.sort((a, b) => {
//         if (a[query.orderBy] < b[query.orderBy]) return query.orderDir === 'ASC' ? -1 : 1;
//         if (a[query.orderBy] > b[query.orderBy]) return query.orderDir === 'ASC' ? 1 : -1;
//         return 0;
//       });
//     }
  
//     if (!query.select.includes('*')) {
//       result = result.map(row => {
//         const newRow = {};
//         query.select.forEach(col => {
//           if (col.includes('(') || col !== '') {
//             newRow[col] = row[col];
//           }
//         });
//         return newRow;
//       });
//     }
  
//     setQueryResult(result);
//   };


const executeQuery = () => {
    const newErrors = [];
    if (query.select.length === 0 || (query.select.length === 1 && query.select[0] === '')) {
      newErrors.push("SELECT clause is required. Please select at least one column.");
    }
    if (!query.from) newErrors.push("FROM clause is required.");
    if (query.groupBy && !query.select.some(col => col.includes('('))) {
      newErrors.push("When using GROUP BY, use at least one aggregate function in SELECT.");
    }
    if (query.having && !query.groupBy) newErrors.push("HAVING requires GROUP BY.");
  
    setErrors(newErrors);
    if (newErrors.length > 0) return;
  
    let result = JSON.parse(JSON.stringify(schema[query.from].data));
  
    if (query.where) {
      result = result.filter(row => {
        const conditions = query.where.split(/\s+(?:AND|OR)\s+/);
        return conditions.every(condition => {
          const [column, operator, value] = condition.split(/\s*(=|!=|>|<|>=|<=)\s*/);
          if (!schema[query.from].columns.includes(column)) return false;
          const rowValue = row[column];
          const compareValue = isNaN(value) ? value.replace(/^['"](.*)['"]$/, '$1') : Number(value);
          
          switch (operator) {
            case '=': return rowValue == compareValue;
            case '!=': return rowValue != compareValue;
            case '>': return rowValue > compareValue;
            case '<': return rowValue < compareValue;
            case '>=': return rowValue >= compareValue;
            case '<=': return rowValue <= compareValue;
            default: return false;
          }
        });
      });
    }
  
    if (query.groupBy) {
      const groups = {};
      result.forEach(row => {
        const key = row[query.groupBy];
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
      });
  
      result = Object.entries(groups).map(([key, group]) => {
        const newRow = { [query.groupBy]: key };
        query.select.forEach(col => {
          if (col.includes('(')) {
            const [func, field] = col.split('(');
            const cleanField = field.replace(')', '');
            switch (func.toUpperCase()) {
              case 'COUNT': newRow[col] = group.length; break;
              case 'SUM': newRow[col] = group.reduce((sum, row) => sum + (parseFloat(row[cleanField]) || 0), 0); break;
              case 'AVG': newRow[col] = group.reduce((sum, row) => sum + (parseFloat(row[cleanField]) || 0), 0) / group.length; break;
              case 'MAX': newRow[col] = Math.max(...group.map(row => parseFloat(row[cleanField]) || 0)); break;
              case 'MIN': newRow[col] = Math.min(...group.map(row => parseFloat(row[cleanField]) || 0)); break;
              default: newRow[col] = null;
            }
          } else if (col !== query.groupBy && col !== '*') {
            newRow[col] = group[0][col];
          }
        });
        return newRow;
      });
    }
  
    if (query.having) {
      result = result.filter(row => {
        try {
          const condition = query.having.replace(/\b(\w+)\b/g, (match) => {
            return Object.keys(row).includes(match) ? `row['${match}']` : match;
          });
          return eval(condition);
        } catch (error) {
          return false;
        }
      });
    }
  
    if (query.orderBy) {
      result.sort((a, b) => {
        if (a[query.orderBy] < b[query.orderBy]) return query.orderDir === 'ASC' ? -1 : 1;
        if (a[query.orderBy] > b[query.orderBy]) return query.orderDir === 'ASC' ? 1 : -1;
        return 0;
      });
    }
  
    if (!query.select.includes('*')) {
      result = result.map(row => {
        const newRow = {};
        query.select.forEach(col => {
          if (col.includes('(') || col !== '') {
            newRow[col] = row[col];
          }
        });
        return newRow;
      });
    }
  
    setQueryResult(result);
  };
  
  const resetQuery = () => {
    setQuery({
      select: [''],
      from: activeTab,
      where: '',
      groupBy: '',
      having: '',
      orderBy: '',
      orderDir: 'ASC'
    });
    setQueryResult(null);
    setErrors([]);
  };
  
  const resetField = (field) => {
    setQuery(prev => ({
      ...prev,
      [field]: field === 'select' ? [''] : field === 'orderDir' ? 'ASC' : ''
    }));
    setErrors([]);
  };



  const calculateAggregate = (func, group, field) => {
    switch (func.toUpperCase()) {
      case 'COUNT': return group.length;
      case 'SUM': return group.reduce((sum, row) => sum + (parseFloat(row[field]) || 0), 0);
      case 'AVG': return group.reduce((sum, row) => sum + (parseFloat(row[field]) || 0), 0) / group.length;
      case 'MAX': return Math.max(...group.map(row => parseFloat(row[field]) || 0));
      case 'MIN': return Math.min(...group.map(row => parseFloat(row[field]) || 0));
      default: return null;
    }
  };

//   const handleSelectChange = (value) => {
//     setQuery(prev => {
//       let newSelect;
//       if (value === '*') {
//         newSelect = ['*'];
//       } else if (prev.select.includes(value)) {
//         newSelect = prev.select.filter(item => item !== value && item !== '');
//       } else {
//         newSelect = [...prev.select.filter(item => item !== '*' && item !== ''), value];
//       }
//       if (newSelect.length === 0) {
//         newSelect = ['*'];
//       }
//       return { ...prev, select: newSelect };
//     });
//   };

//   const resetQuery = () => {
//     setQuery({
//       select: [''],
//       from: activeTab,
//       where: '',
//       groupBy: '',
//       having: '',
//       orderBy: '',
//       orderDir: 'ASC'
//     });
//     setQueryResult(null);
//   };

const handleSelectChange = (value) => {
    setQuery(prev => {
      let newSelect;
      if (value === '*') {
        newSelect = ['*'];
      } else if (prev.select.includes(value)) {
        newSelect = prev.select.filter(item => item !== value && item !== '');
      } else {
        newSelect = [...prev.select.filter(item => item !== '*' && item !== ''), value];
      }
      if (newSelect.length === 0) {
        newSelect = [''];
      }
      return { ...prev, select: newSelect };
    });

    
  // Remove the SELECT clause error if a valid selection is made
  if (value !== '') {
    setErrors(prev => prev.filter(error => !error.includes("SELECT clause is required")));
  }
  };
   


const handleFromChange = (table) => {
    setActiveTab(table);
    setQuery({
      select: [''],
      from: table,
      where: '',
      groupBy: '',
      having: '',
      orderBy: '',
      orderDir: 'ASC'
    });
  };

  const toggleSelectOptions = (event) => {
    event.stopPropagation();
    setShowSelectOptions(prevState => !prevState);
  };

//   const resetField = (field) => {
//     setQuery(prev => ({
//       ...prev,
//       [field]: field === 'select' ? [''] : field === 'orderDir' ? 'ASC' : ''
//     }));
//   };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Query Simulator</h1>
      
      <div className={styles.layout}>
        <div className={styles.tablesSection}>
          <div className={styles.tabContainer}>
            {Object.keys(schema).map((table) => (
              <button
                key={table}
                onClick={() => handleFromChange(table)}
                className={`${styles.tab} ${activeTab === table ? styles.activeTab : ''}`}
              >
                {table}
              </button>
            ))}
          </div>

          <div className={styles.tableDisplay}>
            <h2 className={styles.tableTitle}>{activeTab} Table</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {schema[activeTab].columns.map(column => (
                      <th 
                        key={column} 
                        className={`${styles.th} ${query.select.includes(column) || query.select.includes('*') ? styles.highlightedColumn : ''}`}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schema[activeTab].data.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? styles.evenRow : ''}>
                      {schema[activeTab].columns.map(column => (
                        <td 
                          key={column} 
                          className={`${styles.td} ${query.select.includes(column) || query.select.includes('*') ? styles.highlightedColumn : ''}`}
                        >
                          {row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.queryBuilder}>
          <div className={styles.clause}>
            <span className={styles.clauseTitle}>SELECT</span>
            <span onClick={toggleSelectOptions} className={styles.select}>{query.select.join(', ')}</span>
            {!showSelectOptions && 
              <button onClick={toggleSelectOptions} className={styles.toggleButton} style={{width:'60px',height:'32px',marginRight:'3px'}}>
                Edit
              </button>
            }
            {showSelectOptions && 
              <span  className={styles.toggleButton} style={{width:'60px', height:'30px',textAlign:'center',fontSize:'small'}}>
                Hide
              </span>
            }
            <button onClick={() => resetField('select')} className={styles.resetButton}>Reset</button>
          </div>
          {showSelectOptions && (
            <div ref={selectOptionsRef} className={styles.selectOptions}>
              <div className={styles.checkboxGroup}>
                <label className={styles.label}>
                  <input
                    type="checkbox"
                    checked={query.select.includes('*')}
                    onChange={() => handleSelectChange('*')}
                    className={styles.checkbox}
                  />
                  <span className={styles.columnName}>*</span>
                </label>
                {schema[activeTab].columns.map(column => (
                  <label key={column} className={styles.label}>
                    <input
                      type="checkbox"
                      checked={query.select.includes(column)}
                      onChange={() => handleSelectChange(column)}
                      className={styles.checkbox}
                    />
                    <span className={styles.columnName}>{column}</span>
                  </label>
                ))}
              </div>
              <div className={styles.checkboxGroup}>
                {aggregateFunctions.map(func => (
                  schema[activeTab].columns.map(col => (
                    <label key={`${func}(${col})`} className={styles.label}>
                      <input
                        type="checkbox"
                        checked={query.select.includes(`${func}(${col})`)}
                        onChange={() => handleSelectChange(`${func}(${col})`)}
                        className={styles.checkbox}
                      />
                      <span className={styles.columnName}>{`${func}(${col})`}</span>
                    </label>
                  ))
                ))}
              </div>
            </div>
          )}

          <div className={styles.clause}>
            <span className={styles.clauseTitle}>FROM</span>
            <select 
              value={query.from}
              onChange={(e) => handleFromChange(e.target.value)}
              className={styles.select}
            >
              {Object.keys(schema).map(table => (
                <option key={table} value={table}>{table}</option>
              ))}
            </select>
            <button onClick={() => resetField('from')} className={styles.resetButton}>Reset</button>
          </div>

          <div className={styles.clause}>
            <span className={styles.clauseTitle}>WHERE</span>
            <input
              value={query.where}
              onChange={(e) => setQuery({...query, where: e.target.value})}
              placeholder="e.g. age > 25"
              className={styles.input}
            />
            <button onClick={() => resetField('where')} className={styles.resetButton}>Reset</button>
          </div>

          <div className={styles.clause}>
            <span className={styles.clauseTitle}>GROUP BY</span>
            <select
              value={query.groupBy}
              onChange={(e) => setQuery({...query, groupBy: e.target.value})}
              className={styles.select}
            >
              <option value="">Select a column</option>
              {schema[activeTab].columns.map(column => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
            <button onClick={() => resetField('groupBy')} className={styles.resetButton}>Reset</button>
          </div>

          <div className={styles.clause}>
            <span className={styles.clauseTitle}>HAVING</span>
            <input
              value={query.having}
              onChange={(e) => setQuery({...query, having: e.target.value})}
              placeholder="e.g. COUNT(*) > 1"
              className={styles.input}
              disabled={!query.groupBy}
            />
            <button onClick={() => resetField('having')} className={styles.resetButton}>Reset</button>
          </div>

          <div className={styles.clause}>
            <span className={styles.clauseTitle}>ORDER BY</span>
            <select
              value={query.orderBy}
              onChange={(e) => setQuery({...query, orderBy: e.target.value})}
              className={styles.select}
            >
             <option value="">Select a column</option>
              {schema[activeTab].columns.map(column => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
            <button onClick={() => resetField('orderBy')} className={styles.resetButton}>Reset</button>
            <select
              value={query.orderDir}
              onChange={(e) => setQuery({...query, orderDir: e.target.value})}
              className={styles.select}
            >
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
            </select>
           
            <button onClick={() => resetField('orderDir')} className={styles.resetButton}>Reset</button>
          </div>

          <div className={styles.buttonGroup}>
            <button 
              onClick={executeQuery} 
              className={styles.executeButton}
              disabled={errors.length > 0}
            >
              Execute Query
            </button>
            <button 
              onClick={resetQuery} 
              className={styles.resetButton}
            >
              Reset Query
            </button>
          </div>

          {errors.length > 0 && (
            <div className={styles.errorContainer}>
              <ul className={styles.errorList}>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {queryResult && queryResult.length > 0 && (
        <div className={styles.queryResult}>
          <h3 className={styles.resultTitle}>Query Result:</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {Object.keys(queryResult[0]).map(key => (
                    <th key={key} className={styles.th}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queryResult.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? styles.evenRow : ''}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} className={styles.td}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuerySimulator;