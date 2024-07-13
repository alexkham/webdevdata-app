// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import styles from './SearchBar.module.css';

// export default function SearchBar() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [results, setResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedIndex, setSelectedIndex] = useState(-1);
//   const searchRef = useRef(null);

//   useEffect(() => {
//     const debounceTimer = setTimeout(() => {
//       if (searchTerm) {
//         fetchResults();
//       } else {
//         setResults([]);
//       }
//     }, 300);

//     return () => clearTimeout(debounceTimer);
//   }, [searchTerm]);

// //   const fetchResults = async () => {
// //     setIsLoading(true);
// //     try {
// //       const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
// //       const data = await response.json();
// //       setResults(data);
// //     } catch (error) {
// //       console.error('Error fetching search results:', error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

 
// const fetchResults = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
//       const data = await response.json();
//       console.log('Search results:', data); // Add this line
//       setResults(data.results || []); // Adjust this line
//       console.log(data)
//     } catch (error) {
//       console.error('Error fetching search results:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

// const handleKeyDown = (e) => {
//     if (e.key === 'ArrowDown') {
//       e.preventDefault();
//       setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
//     } else if (e.key === 'ArrowUp') {
//       e.preventDefault();
//       setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
//     } else if (e.key === 'Enter' && selectedIndex >= 0) {
//       e.preventDefault();
//       handleSelectResult(results[selectedIndex]);
//     }
//   };

//   const handleSelectResult = (result) => {
//     setSearchTerm(result.title);
//     setResults([]);
//     setSelectedIndex(-1);
//     // You can add additional logic here, e.g., navigating to a page or updating parent component
//     console.log('Selected:', result);
//   };

//   return (
//     <div className={styles.searchContainer} ref={searchRef}>
//       <input
//         type="text"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder="Search..."
//         className={styles.searchInput}
//       />
//       {isLoading && <div className={styles.loading}>Loading...</div>}
//       {results.length > 0 && (
//         <ul className={styles.resultsList}>
//           {results.map((result, index) => (
//             <li
//               key={result.id}
//               className={`${styles.resultItem} ${index === selectedIndex ? styles.selected : ''}`}
//               onClick={() => handleSelectResult(result)}
//             >
//               {result.title}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
'use client'
// components/SearchBar.js
import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (event) => {
    const q = event.target.value;
    setQuery(q);
    if (!q) {
      setResults([]);
      return;
    }
    const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await response.json();
    setResults(data);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        placeholder="Search..."
        onChange={handleSearch}
      />
      {results.length > 0 && (
        <ul>
          {results.map((result, index) => (
            <li key={index}>{result.file}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
