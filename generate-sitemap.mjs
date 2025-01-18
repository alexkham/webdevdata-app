
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

// // Get JS method routes
// const jsDir = path.join(process.cwd(), 'app', 'api', 'db', 'developement', 'javascript');
// const jsMethodRoutes = [];

// const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('_methods.json'));
// for (const file of jsFiles) {
//  const objectType = file.replace('_methods.json', '');
//  const data = JSON.parse(fs.readFileSync(path.join(jsDir, file), 'utf8'));
 
//  const routes = data.map(method => 
//    `/javascript/${objectType}/${method.function.toLowerCase().split('(')[0]}`
//  );
//  jsMethodRoutes.push(...routes);
// }

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
//      ...exampleTypes.map(example => `/c-programming/examples/${example}`),
//      ...jsMethodRoutes
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

// JS method routes section removed
// const jsDir = path.join(process.cwd(), 'app', 'api', 'db', 'developement', 'javascript');
// const jsMethodRoutes = [];
// const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('_methods.json'));
// for (const file of jsFiles) {
//   const objectType = file.replace('_methods.json', '');
//   const data = JSON.parse(fs.readFileSync(path.join(jsDir, file), 'utf8'));
//   const routes = data.map(method => 
//     `/javascript/${objectType}/${method.function.toLowerCase().split('(')[0]}`
//   );
//   jsMethodRoutes.push(...routes);
// }

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
      ...exampleTypes.map(example => `/c-programming/examples/${example}`)
      // jsMethodRoutes removed from here
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