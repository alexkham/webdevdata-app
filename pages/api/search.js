// // // // // import { readdirSync, readFileSync } from 'fs';
// // // // // import { join } from 'path';

// // // // // export default function handler(req, res) {
// // // // //   const { q } = req.query;

// // // // //   if (!q) {
// // // // //     return res.status(400).json({ error: 'Search query is required' });
// // // // //   }

// // // // //   const pagesDir = join(process.cwd(), 'pages');
// // // // //   const pages = readdirSync(pagesDir).filter(file => file.endsWith('.js') || file.endsWith('.tsx'));

// // // // //   const results = pages.map(file => {
// // // // //     const content = readFileSync(join(pagesDir, file), 'utf-8');
// // // // //     const title = file.replace(/\.(jsx|tsx)$/, '');
// // // // //     return { id: title, title, content };
// // // // //   }).filter(page => 
// // // // //     page.title.toLowerCase().includes(q.toLowerCase()) ||
// // // // //     page.content.toLowerCase().includes(q.toLowerCase())
// // // // //   );

// // // // //   res.status(200).json(results);
// // // // // }

// // // // import { readdirSync, readFileSync } from 'fs';
// // // // import { join } from 'path';

// // // // export default function handler(req, res) {
// // // //   const { q } = req.query;

// // // //   if (!q) {
// // // //     return res.status(400).json({ error: 'Search query is required' });
// // // //   }

// // // //   console.log('Query:', q); // Debugging: log the query

// // // //   const pagesDir = join(process.cwd(), 'pages');
// // // //   const pages = readdirSync(pagesDir).filter(file => file.endsWith('.js') || file.endsWith('.tsx'));

// // // //   console.log('Pages found:', pages); // Debugging: log found pages

// // // //   const results = pages.map(file => {
// // // //     const content = readFileSync(join(pagesDir, file), 'utf-8');
// // // //     const title = file.replace(/\.(jsx|tsx)$/, '');
// // // //     return { id: title, title, content };
// // // //   }).filter(page => 
// // // //     page.title.toLowerCase().includes(q.trim().toLowerCase()) ||
// // // //     page.content.toLowerCase().includes(q.trim().toLowerCase())
// // // //   );

// // // //   console.log('Filtered results:', results); // Debugging: log filtered results

// // // //   res.status(200).json(results);
// // // // }
// // // // pages/api/search.js
// // // import { readdirSync, readFileSync } from 'fs';
// // // import { join } from 'path';

// // // export default function handler(req, res) {
// // //   const { q } = req.query;
// // //   if (!q) {
// // //     return res.status(400).json({ error: 'Query is required' });
// // //   }

// // //   const directory = join(process.cwd(), 'pages');
// // //   const files = readdirSync(directory);

// // //   const results = files
// // //     .filter(file => file.endsWith('.js') || file.endsWith('.tsx'))
// // //     .map(file => {
// // //       const path = join(directory, file);
// // //       const content = readFileSync(path, 'utf-8');
// // //       return { file, content };
// // //     })
// // //     .filter(({ file, content }) => content.toLowerCase().includes(q.toLowerCase()));

// // //   res.status(200).json(results);
// // // }
// // import { readdirSync, readFileSync } from 'fs';
// // import { join } from 'path';

// // export default function handler(req, res) {
// //   const { q } = req.query;
// //   if (!q) {
// //     return res.status(400).json({ error: 'Query is required' });
// //   }

// //   // Determine the directory path
// //   const directory = join(process.cwd(), 'pages');
  
// //   // Log the directory path to the console
// //   console.log('Directory path:', directory); 

// //   // Read all files in the directory
// //   const files = readdirSync(directory);
// //   console.log('Files found:', files); // Optionally log the files found for further debugging

// //   const results = files
// //     .filter(file => file.endsWith('.js') || file.endsWith('.tsx'))
// //     .map(file => {
// //       const path = join(directory, file);
// //       const content = readFileSync(path, 'utf-8');
// //       return { file, content };
// //     })
// //     .filter(({ content }) => content.toLowerCase().includes(q.toLowerCase()));

// //   // Log the results before sending the response
// //   console.log('Search results:', results); 

// //   res.status(200).json(results);
// // }
// import { readdirSync, readFileSync } from 'fs';
// import { join } from 'path';

// export default function handler(req, res) {
//   const { q } = req.query;
//   if (!q) {
//     return res.status(400).json({ error: 'Query is required' });
//   }

//   const directory = join(process.cwd(), 'pages');
//   const files = readdirSync(directory);
//   console.log('Files found:', files); // Log all files found

//   const results = files
//     .filter(file => file.endsWith('.jsx')) // Assuming you're only interested in .jsx files for simplicity
//     .map(file => {
//       const path = join(directory, file);
//       const content = readFileSync(path, 'utf-8');
//       console.log(`Checking file: ${file}`); // Log the file being checked
//       return { file, content };
//     })
//     .filter(({ file, content }) => {
//       const contentLower = content.toLowerCase();
//       const queryLower = q.toLowerCase();
//       const isInContent = contentLower.includes(queryLower);
//       console.log(`Search in ${file}: ${isInContent}`); // Log if query is found in content
//       return isInContent;
//     });

//   console.log('Search results:', results); // Log final search results
//   res.status(200).json(results);
// }
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const directory = join(process.cwd(), 'pages');
  const files = readdirSync(directory);
  console.log('Files found:', files); // Log all files found in the directory

  const results = files
    .filter(file => file.endsWith('.jsx')) // Focus only on .jsx files for searching
    .map(file => {
      const path = join(directory, file);
      const content = readFileSync(path, 'utf-8');
      return { file, content };
    })
    .filter(({ file, content }) => {
      const contentLower = content.toLowerCase();
      const queryLower = q.toLowerCase();
      const index = contentLower.indexOf(queryLower);
      const found = index !== -1;

      // Log whether the query was found in the file and show preview if found
      if (found) {
        const previewStart = Math.max(index - 50, 0);
        const previewEnd = Math.min(index + 50, content.length);
        console.log(`Found in ${file}: ...${content.substring(previewStart, previewEnd)}...`);
      } else {
        console.log(`Not found in ${file}`);
      }
      return found;
    });

  console.log('Search results:', results); // Log the final search results
  res.status(200).json(results);
}
