// // // // // // // // import fs from 'fs';
// // // // // // // // import path from 'path';
// // // // // // // // import { fileURLToPath } from 'url';

// // // // // // // // const __filename = fileURLToPath(import.meta.url);
// // // // // // // // const __dirname = path.dirname(__filename);
// // // // // // // // const SITE_URL = 'https://webdevdata.net'; // Replace with your website URL

// // // // // // // // const excludedPages = process.argv.slice(2);

// // // // // // // // (async () => {
// // // // // // // //   try {
// // // // // // // //     const { globby } = await import('globby');

// // // // // // // //     const pages = await globby([
// // // // // // // //       '.next/server/pages/**/*.html',
// // // // // // // //       '!.next/server/pages/404.html',
// // // // // // // //       '!.next/server/pages/500.html',
// // // // // // // //       '!.next/server/pages/_*.html',
// // // // // // // //     ]);

// // // // // // // //     const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// // // // // // // // <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// // // // // // // //   ${pages
// // // // // // // //     .filter(page => !excludedPages.some(excludedPage => 
// // // // // // // //       page.endsWith(`/${excludedPage}.html`) || 
// // // // // // // //       page.includes(`/${excludedPage}/`)
// // // // // // // //     ))
// // // // // // // //     .map((page) => {
// // // // // // // //       const route = page
// // // // // // // //         .replace('.next/server/pages', '')
// // // // // // // //         .replace('.html', '')
// // // // // // // //         .replace(/\/index/g, '');
// // // // // // // //       return `
// // // // // // // //   <url>
// // // // // // // //     <loc>${SITE_URL}${route}</loc>
// // // // // // // //     <lastmod>${new Date().toISOString()}</lastmod>
// // // // // // // //     <changefreq>weekly</changefreq>
// // // // // // // //     <priority>0.8</priority>
// // // // // // // //   </url>`;
// // // // // // // //     })
// // // // // // // //     .join('')}
// // // // // // // // </urlset>`;

// // // // // // // //     fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
// // // // // // // //     console.log('Sitemap generated successfully!');
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error('An error occurred:', error);
// // // // // // // //   }
// // // // // // // // })();
// // // // // // // import fs from 'fs';
// // // // // // // import path from 'path';
// // // // // // // import { fileURLToPath } from 'url';

// // // // // // // const __filename = fileURLToPath(import.meta.url);
// // // // // // // const __dirname = path.dirname(__filename);
// // // // // // // const SITE_URL = 'https://webdevdata.net'; // Replace with your website URL

// // // // // // // const excludedPages = process.argv.slice(2).map(arg => arg.replace(/^-+/, ''));

// // // // // // // (async () => {
// // // // // // //   try {
// // // // // // //     const { globby } = await import('globby');

// // // // // // //     const pages = await globby([
// // // // // // //       '.next/server/pages/**/*.html',
// // // // // // //       '!.next/server/pages/404.html',
// // // // // // //       '!.next/server/pages/500.html',
// // // // // // //       '!.next/server/pages/_*.html',
// // // // // // //     ]);

// // // // // // //     console.log('Pages to exclude:', excludedPages);

// // // // // // //     const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// // // // // // // <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// // // // // // //   ${pages
// // // // // // //     .filter(page => !excludedPages.some(excludedPage => 
// // // // // // //       page.includes(`/${excludedPage}.html`) || 
// // // // // // //       page.includes(`/${excludedPage}/`)
// // // // // // //     ))
// // // // // // //     .map((page) => {
// // // // // // //       const route = page
// // // // // // //         .replace('.next/server/pages', '')
// // // // // // //         .replace('.html', '')
// // // // // // //         .replace(/\/index/g, '');
// // // // // // //       return `
// // // // // // //   <url>
// // // // // // //     <loc>${SITE_URL}${route}</loc>
// // // // // // //     <lastmod>${new Date().toISOString()}</lastmod>
// // // // // // //     <changefreq>weekly</changefreq>
// // // // // // //     <priority>0.8</priority>
// // // // // // //   </url>`;
// // // // // // //     })
// // // // // // //     .join('')}
// // // // // // // </urlset>`;

// // // // // // //     fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
// // // // // // //     console.log('Sitemap generated successfully!');
// // // // // // //     console.log('Excluded pages:', excludedPages);
// // // // // // //   } catch (error) {
// // // // // // //     console.error('An error occurred:', error);
// // // // // // //   }
// // // // // // // })();

// // // // // // import fs from 'fs';
// // // // // // import path from 'path';
// // // // // // import { fileURLToPath } from 'url';

// // // // // // const __filename = fileURLToPath(import.meta.url);
// // // // // // const __dirname = path.dirname(__filename);
// // // // // // const SITE_URL = 'https://webdevdata.net'; // Replace with your website URL

// // // // // // const excludedPages = process.argv.slice(2).map(arg => arg.replace(/^-+/, ''));

// // // // // // (async () => {
// // // // // //   try {
// // // // // //     const { globby } = await import('globby');

// // // // // //     console.log('Starting sitemap generation...');

// // // // // //     const pages = await globby([
// // // // // //       '.next/server/pages/**/*.html',
// // // // // //       '!.next/server/pages/404.html',
// // // // // //       '!.next/server/pages/500.html',
// // // // // //       '!.next/server/pages/_*.html',
// // // // // //     ]);

// // // // // //     console.log(`Found ${pages.length} pages`);
// // // // // //     console.log('Pages to exclude:', excludedPages);

// // // // // //     const filteredPages = pages.filter(page => !excludedPages.some(excludedPage => 
// // // // // //       page.includes(`/${excludedPage}.html`) || 
// // // // // //       page.includes(`/${excludedPage}/`)
// // // // // //     ));

// // // // // //     console.log(`After exclusion: ${filteredPages.length} pages`);

// // // // // //     if (filteredPages.length === 0) {
// // // // // //       console.warn('No pages found after applying exclusions. Check your exclusion list and build output.');
// // // // // //     }

// // // // // //     const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// // // // // // <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// // // // // //   ${filteredPages
// // // // // //     .map((page) => {
// // // // // //       const route = page
// // // // // //         .replace('.next/server/pages', '')
// // // // // //         .replace('.html', '')
// // // // // //         .replace(/\/index/g, '');
// // // // // //       return `
// // // // // //   <url>
// // // // // //     <loc>${SITE_URL}${route}</loc>
// // // // // //     <lastmod>${new Date().toISOString()}</lastmod>
// // // // // //     <changefreq>weekly</changefreq>
// // // // // //     <priority>0.8</priority>
// // // // // //   </url>`;
// // // // // //     })
// // // // // //     .join('')}
// // // // // // </urlset>`;

// // // // // //     const outputPath = path.join(__dirname, 'public', 'sitemap.xml');
// // // // // //     fs.writeFileSync(outputPath, sitemap);
// // // // // //     console.log(`Sitemap generated successfully at ${outputPath}`);
// // // // // //     console.log('Excluded pages:', excludedPages);
// // // // // //   } catch (error) {
// // // // // //     console.error('An error occurred:', error);
// // // // // //     console.error('Stack trace:', error.stack);
// // // // // //   }
// // // // // // })();
// // // // // import fs from 'fs';
// // // // // import path from 'path';
// // // // // import { fileURLToPath } from 'url';

// // // // // const __filename = fileURLToPath(import.meta.url);
// // // // // const __dirname = path.dirname(__filename);
// // // // // const SITE_URL = 'https://webdevdata.net'; // Replace with your website URL

// // // // // const excludedPages = process.argv.slice(2).map(arg => arg.replace(/^-+/, ''));

// // // // // (async () => {
// // // // //   try {
// // // // //     const { globby } = await import('globby');

// // // // //     console.log('Starting sitemap generation...');
// // // // //     console.log('Current directory:', __dirname);

// // // // //     const pagesPattern = '.next/server/pages/**/*.html';
// // // // //     console.log('Looking for pages with pattern:', pagesPattern);

// // // // //     const pages = await globby([
// // // // //       pagesPattern,
// // // // //       '!.next/server/pages/404.html',
// // // // //       '!.next/server/pages/500.html',
// // // // //       '!.next/server/pages/_*.html',
// // // // //     ]);

// // // // //     console.log(`Found ${pages.length} pages:`);
// // // // //     pages.forEach(page => console.log(' -', page));

// // // // //     console.log('Pages to exclude:', excludedPages);

// // // // //     const filteredPages = pages.filter(page => !excludedPages.some(excludedPage => 
// // // // //       page.includes(`/${excludedPage}.html`) || 
// // // // //       page.includes(`/${excludedPage}/`)
// // // // //     ));

// // // // //     console.log(`After exclusion: ${filteredPages.length} pages:`);
// // // // //     filteredPages.forEach(page => console.log(' -', page));

// // // // //     if (filteredPages.length === 0) {
// // // // //       console.warn('No pages found after applying exclusions. Check your exclusion list and build output.');
// // // // //     }

// // // // //     const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// // // // // <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// // // // //   ${filteredPages
// // // // //     .map((page) => {
// // // // //       const route = page
// // // // //         .replace('.next/server/pages', '')
// // // // //         .replace('.html', '')
// // // // //         .replace(/\/index/g, '');
// // // // //       return `
// // // // //   <url>
// // // // //     <loc>${SITE_URL}${route}</loc>
// // // // //     <lastmod>${new Date().toISOString()}</lastmod>
// // // // //     <changefreq>weekly</changefreq>
// // // // //     <priority>0.8</priority>
// // // // //   </url>`;
// // // // //     })
// // // // //     .join('')}
// // // // // </urlset>`;

// // // // //     const outputPath = path.join(__dirname, 'public', 'sitemap.xml');
// // // // //     fs.writeFileSync(outputPath, sitemap);
// // // // //     console.log(`Sitemap generated successfully at ${outputPath}`);
  
// // // // //   } catch (error) {
// // // // //     console.error('An error occurred:', error);
// // // // //     console.error('Stack trace:', error.stack);
// // // // //   }
// // // // // })();

// // // // // import fs from 'fs';
// // // // // import path from 'path';
// // // // // import { fileURLToPath } from 'url';

// // // // // const __filename = fileURLToPath(import.meta.url);
// // // // // const __dirname = path.dirname(__filename);
// // // // // const SITE_URL = 'https://www.webdevdata.net';

// // // // // const excludedPages = process.argv.slice(2).map(arg => arg.replace(/^--/, ''));

// // // // // (async () => {
// // // // //   try {
// // // // //     const { globby } = await import('globby');

// // // // //     const pages = await globby([
// // // // //       '.next/server/pages/**/*.html',
// // // // //       '!.next/server/pages/404.html',
// // // // //       '!.next/server/pages/500.html',
// // // // //       '!.next/server/pages/_*.html',
// // // // //     ]);

// // // // //     const filteredPages = pages.filter(page => !excludedPages.some(excludedPage => 
// // // // //       page.includes(`/${excludedPage}.html`) || 
// // // // //       page.includes(`/${excludedPage}/`)
// // // // //     ));

// // // // //     const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// // // // // <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// // // // //   ${filteredPages
// // // // //     .map((page) => {
// // // // //       const route = page
// // // // //         .replace('.next/server/pages', '')
// // // // //         .replace('.html', '')
// // // // //         .replace(/\/index/g, '');
// // // // //       return `
// // // // //   <url>
// // // // //     <loc>${SITE_URL}${route}</loc>
// // // // //     <lastmod>${new Date().toISOString()}</lastmod>
// // // // //     <changefreq>weekly</changefreq>
// // // // //     <priority>0.8</priority>
// // // // //   </url>`;
// // // // //     })
// // // // //     .join('')}
// // // // // </urlset>`;

// // // // //     const outputPath = path.join(__dirname, 'public', 'sitemap.xml');
// // // // //     fs.writeFileSync(outputPath, sitemap);
// // // // //     console.log(`Sitemap generated successfully at ${outputPath}`);
// // // // //     console.log('Excluded pages:', excludedPages);
// // // // //   } catch (error) {
// // // // //     console.error('An error occurred:', error);
// // // // //   }
// // // // // })();

// // // // import fs from 'fs';
// // // // import path from 'path';
// // // // import { fileURLToPath } from 'url';

// // // // const __filename = fileURLToPath(import.meta.url);
// // // // const __dirname = path.dirname(__filename);
// // // // const SITE_URL = 'https://www.webdevdata.net';

// // // // const excludedPages = process.argv.slice(2).map(arg => arg.replace(/^--/, ''));

// // // // (async () => {
// // // //   try {
// // // //     const { globby } = await import('globby');
    
// // // //     // Modified paths to check both static and SSR pages
// // // //     const pages = await globby([
// // // //       'pages/**/*.js',
// // // //       'pages/**/*.jsx',
// // // //       'pages/**/*.ts',
// // // //       'pages/**/*.tsx',
// // // //       '!pages/_*.js',
// // // //       '!pages/_*.jsx',
// // // //       '!pages/_*.ts',
// // // //       '!pages/_*.tsx',
// // // //       '!pages/api',
// // // //       '!pages/404.js',
// // // //       '!pages/500.js'
// // // //     ]);

// // // //     const filteredPages = pages.filter(page => !excludedPages.some(excludedPage =>
// // // //       page.includes(`/${excludedPage}.`) ||
// // // //       page.includes(`/${excludedPage}/`)
// // // //     ));

// // // //     const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// // // // <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// // // //   ${filteredPages
// // // //     .map((page) => {
// // // //       const route = page
// // // //         .replace('pages', '')
// // // //         .replace(/\.(js|jsx|ts|tsx)$/, '')
// // // //         .replace(/\/index$/, '');
// // // //       return `
// // // //   <url>
// // // //     <loc>${SITE_URL}${route}</loc>
// // // //     <lastmod>${new Date().toISOString()}</lastmod>
// // // //     <changefreq>weekly</changefreq>
// // // //     <priority>0.8</priority>
// // // //   </url>`;
// // // //     })
// // // //     .join('')}
// // // // </urlset>`;

// // // //     const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
// // // //     fs.writeFileSync(outputPath, sitemap);
// // // //     console.log(`Sitemap generated at ${outputPath}`);

// // // //   } catch (error) {
// // // //     console.error('Error:', error);
// // // //   }
// // // // })();

// // // import fs from 'fs';
// // // import path from 'path';
// // // import { fileURLToPath } from 'url';

// // // const __filename = fileURLToPath(import.meta.url);
// // // const __dirname = path.dirname(__filename);

// // // // Read JSON file
// // // const functionsDb = JSON.parse(fs.readFileSync(
// // //  path.join(process.cwd(), './app/api/db/developement/c/functions_new.json'),
// // //  'utf8'
// // // ));

// // // const SITE_URL = 'https://www.webdevdata.net';
// // // const excludedPages = process.argv.slice(2).map(arg => arg.replace(/^--/, ''));

// // // (async () => {
// // //  try {
// // //    const { globby } = await import('globby');
   
// // //    const pages = await globby([
// // //      'pages/**/*.{js,jsx,ts,tsx}',
// // //      '!pages/_*.{js,jsx,ts,tsx}',
// // //      '!pages/api',
// // //      '!pages/404.js',
// // //      '!pages/500.js'
// // //    ]);

// // //    const filteredPages = pages.filter(page => !excludedPages.some(excludedPage =>
// // //      page.includes(`/${excludedPage}.`) ||
// // //      page.includes(`/${excludedPage}/`)
// // //    ));

// // //    const dynamicRoutes = functionsDb.map(func => `/c-programming/functions/${func.function_name}`);

// // //    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// // // <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// // // ${[...filteredPages.map(page => {
// // //  const route = page
// // //    .replace('pages', '')
// // //    .replace(/\.(js|jsx|ts|tsx)$/, '')
// // //    .replace(/\/index$/, '');
// // //  return `  <url>
// // //    <loc>${SITE_URL}${route}</loc>
// // //    <lastmod>${new Date().toISOString()}</lastmod>
// // //    <changefreq>weekly</changefreq>
// // //    <priority>0.8</priority>
// // //  </url>`;
// // // }), ...dynamicRoutes.map(route => `  <url>
// // //    <loc>${SITE_URL}${route}</loc>
// // //    <lastmod>${new Date().toISOString()}</lastmod>
// // //    <changefreq>weekly</changefreq>
// // //    <priority>0.8</priority>
// // //  </url>`
// // // )].join('\n')}
// // // </urlset>`;

// // //    const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
// // //    fs.writeFileSync(outputPath, sitemap);
// // //    console.log(`Sitemap generated at ${outputPath}`);
// // //  } catch (error) {
// // //    console.error('Error:', error);
// // //  }
// // // })();

// // // import fs from 'fs';
// // // import path from 'path';
// // // import { fileURLToPath } from 'url';

// // // const __filename = fileURLToPath(import.meta.url);
// // // const __dirname = path.dirname(__filename);

// // // const functionsDb = JSON.parse(fs.readFileSync(
// // //  path.join(process.cwd(), './app/api/db/developement/c/functions_new.json'),
// // //  'utf8'
// // // ));

// // // const pythonFunctionsDb = JSON.parse(fs.readFileSync(
// // //  path.join(process.cwd(), './app/api/db/developement/python/functions.json'),
// // //  'utf8'
// // // ));

// // // const SITE_URL = 'https://www.webdevdata.net';
// // // const excludedPages = process.argv.slice(2).map(arg => arg.replace(/^--/, ''));

// // // (async () => {
// // //  try {
// // //    const { globby } = await import('globby');
   
// // //    const pages = await globby([
// // //      'pages/**/*.{js,jsx,ts,tsx}',
// // //      '!pages/_*.{js,jsx,ts,tsx}',
// // //      '!pages/api',
// // //      '!pages/404.js',
// // //      '!pages/500.js'
// // //    ]);

// // //    const filteredPages = pages.filter(page => !excludedPages.some(excludedPage =>
// // //      page.includes(`/${excludedPage}.`) ||
// // //      page.includes(`/${excludedPage}/`)
// // //    ));

// // //    const dynamicRoutes = [
// // //      ...functionsDb.map(func => `/c-programming/functions/${func.function_name}`),
// // //      ...pythonFunctionsDb.map(func => `/python/functions/${func.function_name}`)
// // //    ];

// // //    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// // // <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// // // ${[...filteredPages.map(page => {
// // //  const route = page
// // //    .replace('pages', '')
// // //    .replace(/\.(js|jsx|ts|tsx)$/, '')
// // //    .replace(/\/index$/, '');
// // //  return `  <url>
// // //    <loc>${SITE_URL}${route}</loc>
// // //    <lastmod>${new Date().toISOString()}</lastmod>
// // //    <changefreq>weekly</changefreq>
// // //    <priority>0.8</priority>
// // //  </url>`;
// // // }), ...dynamicRoutes.map(route => `  <url>
// // //    <loc>${SITE_URL}${route}</loc>
// // //    <lastmod>${new Date().toISOString()}</lastmod>
// // //    <changefreq>weekly</changefreq>
// // //    <priority>0.8</priority>
// // //  </url>`
// // // )].join('\n')}
// // // </urlset>`;

// // //    const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
// // //    fs.writeFileSync(outputPath, sitemap);
// // //    console.log(`Sitemap generated at ${outputPath}`);
// // //  } catch (error) {
// // //    console.error('Error:', error);
// // //  }
// // // })();


// // import fs from 'fs';
// // import path from 'path';
// // import { fileURLToPath } from 'url';

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // const functionsDb = JSON.parse(fs.readFileSync(
// //  path.join(process.cwd(), './app/api/db/developement/c/functions_new.json'),
// //  'utf8'
// // ));

// // const pythonFunctionsDb = JSON.parse(fs.readFileSync(
// //  path.join(process.cwd(), './app/api/db/developement/python/functions.json'),
// //  'utf8'
// // ));

// // const SITE_URL = 'https://www.webdevdata.net';
// // const excludedPages = process.argv.slice(2).map(arg => arg.replace(/^--/, ''));

// // (async () => {
// //  try {
// //    const { globby } = await import('globby');
   
// //    const pages = await globby([
// //      'pages/**/*.{js,jsx,ts,tsx}',
// //      '!pages/_*.{js,jsx,ts,tsx}',
// //      '!pages/api',
// //      '!pages/404.js',
// //      '!pages/500.js'
// //    ]);

// //    const filteredPages = pages.filter(page => !excludedPages.some(excludedPage =>
// //      page.includes(`/${excludedPage}.`) ||
// //      page.includes(`/${excludedPage}/`)
// //    ));

// //    const dynamicRoutes = [
// //      ...functionsDb.map(func => `/c-programming/functions/${func.function_name}`),
// //      ...pythonFunctionsDb.map(func => `/python/functions/${func.name.trim().toLowerCase()}`)
// //    ];

// //    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// // <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// // ${[...filteredPages.map(page => {
// //  const route = page
// //    .replace('pages', '')
// //    .replace(/\.(js|jsx|ts|tsx)$/, '')
// //    .replace(/\/index$/, '');
// //  return `  <url>
// //    <loc>${SITE_URL}${route}</loc>
// //    <lastmod>${new Date().toISOString()}</lastmod>
// //    <changefreq>weekly</changefreq>
// //    <priority>0.8</priority>
// //  </url>`;
// // }), ...dynamicRoutes.map(route => `  <url>
// //    <loc>${SITE_URL}${route}</loc>
// //    <lastmod>${new Date().toISOString()}</lastmod>
// //    <changefreq>weekly</changefreq>
// //    <priority>0.8</priority>
// //  </url>`
// // )].join('\n')}
// // </urlset>`;

// //    const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
// //    fs.writeFileSync(outputPath, sitemap);
// //    console.log(`Sitemap generated at ${outputPath}`);
// //  } catch (error) {
// //    console.error('Error:', error);
// //  }
// // })();
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const functionsDb = JSON.parse(fs.readFileSync(
//  path.join(process.cwd(), './app/api/db/developement/c/functions_new.json'),
//  'utf8'
// ));

// const pythonFunctionsDb = JSON.parse(fs.readFileSync(
//  path.join(process.cwd(), './app/api/db/developement/python/functions.json'),
//  'utf8'
// ));

// // Get things-not-to-do types from filenames
// const doNotDir = path.join(process.cwd(), 'app', 'api', 'db', 'content', 'C', 'do_not');
// const thingsNotToDoTypes = fs.readdirSync(doNotDir)
//  .filter(filename => filename.endsWith('.json'))
//  .map(filename => filename.replace('.json', ''));

// const SITE_URL = 'https://www.webdevdata.net';
// const excludedPages = process.argv.slice(2).map(arg => arg.replace(/^--/, ''));

// (async () => {
//  try {
//    const { globby } = await import('globby');
   
//    const pages = await globby([
//      'pages/**/*.{js,jsx,ts,tsx}',
//      '!pages/_*.{js,jsx,ts,tsx}',
//      '!pages/api',
//      '!pages/404.js',
//      '!pages/500.js'
//    ]);

//    const filteredPages = pages.filter(page => !excludedPages.some(excludedPage =>
//      page.includes(`/${excludedPage}.`) ||
//      page.includes(`/${excludedPage}/`)
//    ));

//    const dynamicRoutes = [
//      ...functionsDb.map(func => `/c-programming/functions/${func.function_name}`),
//      ...pythonFunctionsDb.map(func => `/python/functions/${func.name.trim().toLowerCase()}`),
//      ...thingsNotToDoTypes.map(type => `/c-programming/things-not-to-do/${type}`)
//    ];

//    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// ${[...filteredPages.map(page => {
//  const route = page
//    .replace('pages', '')
//    .replace(/\.(js|jsx|ts|tsx)$/, '')
//    .replace(/\/index$/, '');
//  return `  <url>
//    <loc>${SITE_URL}${route}</loc>
//    <lastmod>${new Date().toISOString()}</lastmod>
//    <changefreq>weekly</changefreq>
//    <priority>0.8</priority>
//  </url>`;
// }), ...dynamicRoutes.map(route => `  <url>
//    <loc>${SITE_URL}${route}</loc>
//    <lastmod>${new Date().toISOString()}</lastmod>
//    <changefreq>weekly</changefreq>
//    <priority>0.8</priority>
//  </url>`
// )].join('\n')}
// </urlset>`;

//    const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
//    fs.writeFileSync(outputPath, sitemap);
//    console.log(`Sitemap generated at ${outputPath}`);
//  } catch (error) {
//    console.error('Error:', error);
//  }
// })();

// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const functionsDb = JSON.parse(fs.readFileSync(
//  path.join(process.cwd(), './app/api/db/developement/c/functions_new.json'),
//  'utf8'
// ));

// const pythonFunctionsDb = JSON.parse(fs.readFileSync(
//  path.join(process.cwd(), './app/api/db/developement/python/functions.json'),
//  'utf8'
// ));

// // Get things-not-to-do types
// const doNotDir = path.join(process.cwd(), 'app', 'api', 'db', 'content', 'C', 'do_not');
// const thingsNotToDoTypes = fs.readdirSync(doNotDir)
//  .filter(filename => filename.endsWith('.json'))
//  .map(filename => filename.replace('.json', ''));

// // Get example types 
// const examplesDir = path.join(process.cwd(), 'app', 'api', 'db', 'content', 'C', 'examples');
// const exampleTypes = fs.readdirSync(examplesDir)
//  .filter(filename => filename.endsWith('.json'))
//  .map(filename => filename.replace('.json', ''));

// const SITE_URL = 'https://www.webdevdata.net';
// const excludedPages = process.argv.slice(2).map(arg => arg.replace(/^--/, ''));

// (async () => {
//  try {
//    const { globby } = await import('globby');
   
//    const pages = await globby([
//      'pages/**/*.{js,jsx,ts,tsx}',
//      '!pages/_*.{js,jsx,ts,tsx}',
//      '!pages/api',
//      '!pages/404.js',
//      '!pages/500.js'
//    ]);

//    const filteredPages = pages.filter(page => !excludedPages.some(excludedPage =>
//      page.includes(`/${excludedPage}.`) ||
//      page.includes(`/${excludedPage}/`)
//    ));

//    const dynamicRoutes = [
//      ...functionsDb.map(func => `/c-programming/functions/${func.function_name}`),
//      ...pythonFunctionsDb.map(func => `/python/functions/${func.name.trim().toLowerCase()}`),
//      ...thingsNotToDoTypes.map(type => `/c-programming/things-not-to-do/${type}`),
//      ...exampleTypes.map(example => `/c-programming/examples/${example}`)
//    ];

//    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// ${[...filteredPages.map(page => {
//  const route = page
//    .replace('pages', '')
//    .replace(/\.(js|jsx|ts|tsx)$/, '')
//    .replace(/\/index$/, '');
//  return `  <url>
//    <loc>${SITE_URL}${route}</loc>
//    <lastmod>${new Date().toISOString()}</lastmod>
//    <changefreq>weekly</changefreq>
//    <priority>0.8</priority>
//  </url>`;
// }), ...dynamicRoutes.map(route => `  <url>
//    <loc>${SITE_URL}${route}</loc>
//    <lastmod>${new Date().toISOString()}</lastmod>
//    <changefreq>weekly</changefreq>
//    <priority>0.8</priority>
//  </url>`
// )].join('\n')}
// </urlset>`;

//    const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
//    fs.writeFileSync(outputPath, sitemap);
//    console.log(`Sitemap generated at ${outputPath}`);
//  } catch (error) {
//    console.error('Error:', error);
//  }
// })();


import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const functionsDb = JSON.parse(fs.readFileSync(
 path.join(process.cwd(), './app/api/db/developement/c/functions_new.json'),
 'utf8'
));

const pythonFunctionsDb = JSON.parse(fs.readFileSync(
 path.join(process.cwd(), './app/api/db/developement/python/functions.json'),
 'utf8'
));

// Get things-not-to-do types
const doNotDir = path.join(process.cwd(), 'app', 'api', 'db', 'content', 'C', 'do_not');
const thingsNotToDoTypes = fs.readdirSync(doNotDir)
 .filter(filename => filename.endsWith('.json'))
 .map(filename => filename.replace('.json', ''));

// Get example types 
const examplesDir = path.join(process.cwd(), 'app', 'api', 'db', 'content', 'C', 'examples');
const exampleTypes = fs.readdirSync(examplesDir)
 .filter(filename => filename.endsWith('.json'))
 .map(filename => filename.replace('.json', ''));

// Get JS method routes
const jsDir = path.join(process.cwd(), 'app', 'api', 'db', 'developement', 'javascript');
const jsMethodRoutes = [];

const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('_methods.json'));
for (const file of jsFiles) {
 const objectType = file.replace('_methods.json', '');
 const data = JSON.parse(fs.readFileSync(path.join(jsDir, file), 'utf8'));
 
 const routes = data.map(method => 
   `/javascript/${objectType}/${method.function.toLowerCase().split('(')[0]}`
 );
 jsMethodRoutes.push(...routes);
}

const SITE_URL = 'https://www.webdevdata.net';
const excludedPages = process.argv.slice(2).map(arg => arg.replace(/^--/, ''));

(async () => {
 try {
   const { globby } = await import('globby');
   
   const pages = await globby([
     'pages/**/*.{js,jsx,ts,tsx}',
     '!pages/_*.{js,jsx,ts,tsx}',
     '!pages/api',
     '!pages/404.js',
     '!pages/500.js'
   ]);

   const filteredPages = pages.filter(page => !excludedPages.some(excludedPage =>
     page.includes(`/${excludedPage}.`) ||
     page.includes(`/${excludedPage}/`)
   ));

   const dynamicRoutes = [
     ...functionsDb.map(func => `/c-programming/functions/${func.function_name}`),
     ...pythonFunctionsDb.map(func => `/python/functions/${func.name.trim().toLowerCase()}`),
     ...thingsNotToDoTypes.map(type => `/c-programming/things-not-to-do/${type}`),
     ...exampleTypes.map(example => `/c-programming/examples/${example}`),
     ...jsMethodRoutes
   ];

   const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...filteredPages.map(page => {
 const route = page
   .replace('pages', '')
   .replace(/\.(js|jsx|ts|tsx)$/, '')
   .replace(/\/index$/, '');
 return `  <url>
   <loc>${SITE_URL}${route}</loc>
   <lastmod>${new Date().toISOString()}</lastmod>
   <changefreq>weekly</changefreq>
   <priority>0.8</priority>
 </url>`;
}), ...dynamicRoutes.map(route => `  <url>
   <loc>${SITE_URL}${route}</loc>
   <lastmod>${new Date().toISOString()}</lastmod>
   <changefreq>weekly</changefreq>
   <priority>0.8</priority>
 </url>`
)].join('\n')}
</urlset>`;

   const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
   fs.writeFileSync(outputPath, sitemap);
   console.log(`Sitemap generated at ${outputPath}`);
 } catch (error) {
   console.error('Error:', error);
 }
})();