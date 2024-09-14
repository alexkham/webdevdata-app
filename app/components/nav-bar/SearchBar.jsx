// // // // import { useState, useEffect } from 'react';
// // // // import { fetchSitemap, searchPages } from '@/utils/fetch-sitemap';

// // // // function SearchBar() {
// // // //   const [query, setQuery] = useState('');
// // // //   const [pages, setPages] = useState([]);
// // // //   const [results, setResults] = useState([]);

// // // //   useEffect(() => {
// // // //     fetchSitemap().then(setPages);
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     setResults(searchPages(pages, query));
// // // //   }, [query, pages]);

// // // //   return (
// // // //     <div>
// // // //       <input 
// // // //         type="text" 
// // // //         value={query} 
// // // //         onChange={(e) => setQuery(e.target.value)} 
// // // //         placeholder="Search pages..."
// // // //       />
// // // //       <ul>
// // // //         {results.map((page) => (
// // // //           <li key={page.loc}>
// // // //             <a href={page.loc}>{page.loc}</a>
// // // //           </li>
// // // //         ))}
// // // //       </ul>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default SearchBar;
// // // import { useState, useEffect } from 'react';

// // // function SearchBar() {
// // //   const [query, setQuery] = useState('');
// // //   const [urls, setUrls] = useState({ main: [], categories: {}, leaves: [] });
// // //   const [results, setResults] = useState([]);

// // //   useEffect(() => {
// // //     fetch('/api/sitemap')
// // //       .then(response => response.json())
// // //       .then(data => setUrls(data))
// // //       .catch(error => console.error('Error fetching sitemap:', error));
// // //   }, []);

// // //   useEffect(() => {
// // //     const allUrls = [
// // //       ...urls.main,
// // //       ...Object.values(urls.categories).flat(),
// // //       ...urls.leaves
// // //     ];
// // //     setResults(allUrls.filter(url => url.toLowerCase().includes(query.toLowerCase())));
// // //   }, [query, urls]);

// // //   return (
// // //     <div>
// // //       <input
// // //         type="text"
// // //         value={query}
// // //         onChange={(e) => setQuery(e.target.value)}
// // //         placeholder="Search pages..."
// // //       />
// // //       <ul>
// // //         {results.map((url) => (
// // //           <li key={url}>
// // //             <a href={url}>{url}</a>
// // //           </li>
// // //         ))}
// // //       </ul>
// // //     </div>
// // //   );
// // // }

// // // export default SearchBar;
// // import { useState, useEffect } from 'react';

// // function SearchBar() {
// //   const [query, setQuery] = useState('');
// //   const [urls, setUrls] = useState({ main: [], categories: {}, leaves: [] });
// //   const [results, setResults] = useState([]);

// //   useEffect(() => {
// //     fetch('/api/sitemap')
// //       .then(response => response.json())
// //       .then(data => setUrls(data))
// //       .catch(error => console.error('Error fetching sitemap:', error));
// //   }, []);

// //   useEffect(() => {
// //     if (query) {
// //       const regex = new RegExp(query.split('').join('.*'), 'i');
// //       const allUrls = [
// //         ...urls.main,
// //         ...Object.values(urls.categories).flat(),
// //         ...urls.leaves
// //       ];
// //       setResults(allUrls.filter(url => regex.test(url)));
// //     } else {
// //       setResults([]);
// //     }
// //   }, [query, urls]);

// //   return (
// //     <div>
// //       <input
// //         type="text"
// //         value={query}
// //         onChange={(e) => setQuery(e.target.value)}
// //         placeholder="Search pages..."
// //       />
// //       <ul>
// //         {results.map((url) => (
// //           <li key={url}>
// //             <a href={url}>{url}</a>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }

// // export default SearchBar;
// import { useState, useEffect } from 'react';

// function SearchBar() {
//   const [query, setQuery] = useState('');
//   const [urls, setUrls] = useState({ main: [], categories: {}, leaves: [] });
//   const [results, setResults] = useState([]);

//   useEffect(() => {
//     fetch('/api/sitemap')
//       .then(response => response.json())
//       .then(data => setUrls(data))
//       .catch(error => console.error('Error fetching sitemap:', error));
//   }, []);

//   useEffect(() => {
//     if (query) {
//       const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
//       const allUrls = [
//         ...urls.main,
//         ...Object.values(urls.categories).flat(),
//         ...urls.leaves
//       ];
//       setResults(allUrls.filter(url => 
//         terms.every(term => url.toLowerCase().includes(term))
//       ));
//     } else {
//       setResults([]);
//     }
//   }, [query, urls]);

//   return (
//     <div>
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Search pages..."
//       />
//       <ul>
//         {results.map((url) => (
//           <li key={url}>
//             <a href={url}>{url}</a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default SearchBar;
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';

export default function SearchBar({width='300px'}) {
  const [query, setQuery] = useState('');
  const [urls, setUrls] = useState({ main: [], categories: {}, leaves: [] });
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch('/api/sitemap')
      .then(response => response.json())
      .then(data => setUrls(data))
      .catch(error => console.error('Error fetching sitemap:', error));
  }, []);

  useEffect(() => {
    if (query) {
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
      const allUrls = [
        ...urls.main,
        ...Object.values(urls.categories).flat(),
        ...urls.leaves
      ];
      setResults(allUrls.filter(url => 
        terms.every(term => url.toLowerCase().includes(term))
      ));
    } else {
      setResults([]);
    }
  }, [query, urls]);

  return (
    <div className={styles.container} style={{maxWidth:width}}>
      <div className={styles.searchInputWrapper}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pages..."
          className={styles.searchInput}
        />
        {query && (
          <button 
            className={styles.clearButton} 
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
      {results.length > 0 && (
        <ul className={styles.resultsList}>
          {results.map((url) => (
            <li key={url} className={styles.resultItem}>
              <a href={url} className={styles.resultLink}>{url}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}