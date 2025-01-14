// import { parseString } from 'xml2js';

// export async function fetchSitemap() {
//   // This is a placeholder URL. Replace with your actual sitemap URL or fetching logic
//   const response = await fetch('https://webdevdata.net/sitemap.xml');
//   const xmlText = await response.text();
  
//   return new Promise((resolve, reject) => {
//     parseString(xmlText, (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         const urls = result.urlset.url.map(url => ({
//           loc: url.loc[0],
//           lastmod: url.lastmod ? url.lastmod[0] : null,
//         }));
//         resolve(urls);
//       }
//     });
//   });
// }

// export function searchPages(pages, query) {
//   return pages.filter(page => 
//     page.loc.toLowerCase().includes(query.toLowerCase())
//   );
// }
import { parseString } from 'xml2js';

export async function fetchSitemap() {
  // This is a placeholder URL. Replace with your actual sitemap URL or fetching logic
  const response = await fetch('/sitemap.xml');
  const xmlText = await response.text();
  
  return new Promise((resolve, reject) => {
    parseString(xmlText, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const urls = result.urlset.url.map(url => ({
          loc: url.loc[0],
          lastmod: url.lastmod ? url.lastmod[0] : null,
        }));
        resolve(urls);
      }
    });
  });
}

export function searchPages(pages, query) {
  return pages.filter(page => 
    page.loc.toLowerCase().includes(query.toLowerCase())
  );
}