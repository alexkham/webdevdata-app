// // // import fs from 'fs';
// // // import path from 'path';
// // // import { fileURLToPath } from 'url';

// // // const __filename = fileURLToPath(import.meta.url);
// // // const __dirname = path.dirname(__filename);
// // // const SITE_URL = 'https://webdevdata.net'; // Replace with your website URL

// // // const excludedPages = process.argv.slice(2);

// // // (async () => {
// // //   try {
// // //     const { globby } = await import('globby');

// // //     const pages = await globby([
// // //       '.next/server/pages/**/*.html',
// // //       '!.next/server/pages/404.html',
// // //       '!.next/server/pages/500.html',
// // //       '!.next/server/pages/_*.html',
// // //     ]);

// // //     const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// // // <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// // //   ${pages
// // //     .filter(page => !excludedPages.some(excludedPage => 
// // //       page.endsWith(`/${excludedPage}.html`) || 
// // //       page.includes(`/${excludedPage}/`)
// // //     ))
// // //     .map((page) => {
// // //       const route = page
// // //         .replace('.next/server/pages', '')
// // //         .replace('.html', '')
// // //         .replace(/\/index/g, '');
// // //       return `
// // //   <url>
// // //     <loc>${SITE_URL}${route}</loc>
// // //     <lastmod>${new Date().toISOString()}</lastmod>
// // //     <changefreq>weekly</changefreq>
// // //     <priority>0.8</priority>
// // //   </url>`;
// // //     })
// // //     .join('')}
// // // </urlset>`;

// // //     fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
// // //     console.log('Sitemap generated successfully!');
// // //   } catch (error) {
// // //     console.error('An error occurred:', error);
// // //   }
// // // })();
// // import fs from 'fs';
// // import path from 'path';
// // import { fileURLToPath } from 'url';

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);
// // const SITE_URL = 'https://webdevdata.net'; // Replace with your website URL

// // const excludedPages = process.argv.slice(2).map(arg => arg.replace(/^-+/, ''));

// // (async () => {
// //   try {
// //     const { globby } = await import('globby');

// //     const pages = await globby([
// //       '.next/server/pages/**/*.html',
// //       '!.next/server/pages/404.html',
// //       '!.next/server/pages/500.html',
// //       '!.next/server/pages/_*.html',
// //     ]);

// //     console.log('Pages to exclude:', excludedPages);

// //     const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// // <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// //   ${pages
// //     .filter(page => !excludedPages.some(excludedPage => 
// //       page.includes(`/${excludedPage}.html`) || 
// //       page.includes(`/${excludedPage}/`)
// //     ))
// //     .map((page) => {
// //       const route = page
// //         .replace('.next/server/pages', '')
// //         .replace('.html', '')
// //         .replace(/\/index/g, '');
// //       return `
// //   <url>
// //     <loc>${SITE_URL}${route}</loc>
// //     <lastmod>${new Date().toISOString()}</lastmod>
// //     <changefreq>weekly</changefreq>
// //     <priority>0.8</priority>
// //   </url>`;
// //     })
// //     .join('')}
// // </urlset>`;

// //     fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
// //     console.log('Sitemap generated successfully!');
// //     console.log('Excluded pages:', excludedPages);
// //   } catch (error) {
// //     console.error('An error occurred:', error);
// //   }
// // })();

// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const SITE_URL = 'https://webdevdata.net'; // Replace with your website URL

// const excludedPages = process.argv.slice(2).map(arg => arg.replace(/^-+/, ''));

// (async () => {
//   try {
//     const { globby } = await import('globby');

//     console.log('Starting sitemap generation...');

//     const pages = await globby([
//       '.next/server/pages/**/*.html',
//       '!.next/server/pages/404.html',
//       '!.next/server/pages/500.html',
//       '!.next/server/pages/_*.html',
//     ]);

//     console.log(`Found ${pages.length} pages`);
//     console.log('Pages to exclude:', excludedPages);

//     const filteredPages = pages.filter(page => !excludedPages.some(excludedPage => 
//       page.includes(`/${excludedPage}.html`) || 
//       page.includes(`/${excludedPage}/`)
//     ));

//     console.log(`After exclusion: ${filteredPages.length} pages`);

//     if (filteredPages.length === 0) {
//       console.warn('No pages found after applying exclusions. Check your exclusion list and build output.');
//     }

//     const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//   ${filteredPages
//     .map((page) => {
//       const route = page
//         .replace('.next/server/pages', '')
//         .replace('.html', '')
//         .replace(/\/index/g, '');
//       return `
//   <url>
//     <loc>${SITE_URL}${route}</loc>
//     <lastmod>${new Date().toISOString()}</lastmod>
//     <changefreq>weekly</changefreq>
//     <priority>0.8</priority>
//   </url>`;
//     })
//     .join('')}
// </urlset>`;

//     const outputPath = path.join(__dirname, 'public', 'sitemap.xml');
//     fs.writeFileSync(outputPath, sitemap);
//     console.log(`Sitemap generated successfully at ${outputPath}`);
//     console.log('Excluded pages:', excludedPages);
//   } catch (error) {
//     console.error('An error occurred:', error);
//     console.error('Stack trace:', error.stack);
//   }
// })();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_URL = 'https://webdevdata.net'; // Replace with your website URL

const excludedPages = process.argv.slice(2).map(arg => arg.replace(/^-+/, ''));

(async () => {
  try {
    const { globby } = await import('globby');

    console.log('Starting sitemap generation...');
    console.log('Current directory:', __dirname);

    const pagesPattern = '.next/server/pages/**/*.html';
    console.log('Looking for pages with pattern:', pagesPattern);

    const pages = await globby([
      pagesPattern,
      '!.next/server/pages/404.html',
      '!.next/server/pages/500.html',
      '!.next/server/pages/_*.html',
    ]);

    console.log(`Found ${pages.length} pages:`);
    pages.forEach(page => console.log(' -', page));

    console.log('Pages to exclude:', excludedPages);

    const filteredPages = pages.filter(page => !excludedPages.some(excludedPage => 
      page.includes(`/${excludedPage}.html`) || 
      page.includes(`/${excludedPage}/`)
    ));

    console.log(`After exclusion: ${filteredPages.length} pages:`);
    filteredPages.forEach(page => console.log(' -', page));

    if (filteredPages.length === 0) {
      console.warn('No pages found after applying exclusions. Check your exclusion list and build output.');
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${filteredPages
    .map((page) => {
      const route = page
        .replace('.next/server/pages', '')
        .replace('.html', '')
        .replace(/\/index/g, '');
      return `
  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

    const outputPath = path.join(__dirname, 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, sitemap);
    console.log(`Sitemap generated successfully at ${outputPath}`);
    console.log('Sitemap content:', sitemap);
  } catch (error) {
    console.error('An error occurred:', error);
    console.error('Stack trace:', error.stack);
  }
})();