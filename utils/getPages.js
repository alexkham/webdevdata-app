import fs from 'fs';
import path from 'path';

export function getPages(dir = 'pages') {
  const pagesDir = path.join(process.cwd(), dir);
  const pageFiles = fs.readdirSync(pagesDir);

  return pageFiles
    .filter(file => file.endsWith('.js') || file.endsWith('.tsx'))
    .map(file => {
      const name = file.replace(/\.(js|tsx)$/, '');
      const route = name === 'index' ? '/' : `/${name}`;
      return { name, route };
    });
}