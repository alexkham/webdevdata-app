import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  try {
    const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml');
    console.log(`Reading sitemap from: ${sitemapPath}`);

    const sitemapContent = readFileSync(sitemapPath, 'utf8');
    if (!sitemapContent) {
      throw new Error("Failed to read sitemap content or it's empty.");
    }

    console.log("Sitemap content read successfully.");

    const urlRegex = /<loc>(.*?)<\/loc>/g;
    const urls = [];
    let match;
    while ((match = urlRegex.exec(sitemapContent)) !== null) {
      urls.push(match[1]);
    }

    console.log(`Extracted ${urls.length} URLs from sitemap.`);

    const categorizedUrls = {
      main: [],
      categories: {},
      leaves: []
    };

    urls.forEach(url => {
      const pathSegments = new URL(url).pathname.split('/').filter(Boolean);
      if (pathSegments.length === 0) {
        categorizedUrls.main.push(url);
      } else if (pathSegments.length === 1) {
        if (!categorizedUrls.categories[pathSegments[0]]) {
          categorizedUrls.categories[pathSegments[0]] = [];
        }
        categorizedUrls.categories[pathSegments[0]].push(url);
      } else {
        categorizedUrls.leaves.push(url);
      }
    });

    console.log("Categorized URLs:");
    console.log(`Main: ${categorizedUrls.main.length}`);
    console.log(`Categories: ${Object.keys(categorizedUrls.categories).length}`);
    console.log(`Leaves: ${categorizedUrls.leaves.length}`);

    res.status(200).json(categorizedUrls);
  } catch (error) {
    console.error('Error in sitemap handler:', error);
    res.status(500).json({ error: 'Failed to parse sitemap', message: error.message });
  }
}