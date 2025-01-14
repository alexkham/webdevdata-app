import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { path: reqPath } = req.query;
  
  if (!reqPath) {
    return res.status(400).json({ error: 'Path parameter is required' });
  }

  try {
    const pagesDirectory = path.join(process.cwd(), 'pages', reqPath);
    const files = await fs.readdir(pagesDirectory);
    
    const links = await Promise.all(files.map(async (file) => {
      const filePath = path.join(pagesDirectory, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isDirectory()) {
        return {
          href: `${reqPath}/${file}`,
          label: file,
        };
      } else if (file.endsWith('.js') || file.endsWith('.tsx')) {
        const fileName = file.replace(/\.(js|tsx)$/, '');
        const isDynamic = fileName.startsWith('[') && fileName.endsWith(']');
        if (isDynamic) {
          return {
            href: null,
            label: fileName.slice(1, -1),
          };
        } else {
          return {
            href: `${reqPath}/${fileName}`,
            label: fileName,
          };
        }
      }
      return null;
    }));

    const validLinks = links.filter(Boolean);
    res.status(200).json(validLinks);
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({ error: 'Unable to read directory' });
  }
}