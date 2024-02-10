// pages/api/folders.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const directoryPath = path.join(process.cwd(), './db/developement');
  const folders = fs.readdirSync(directoryPath).filter(file => 
    fs.statSync(path.join(directoryPath, file)).isDirectory()
  );

  res.status(200).json({ folders });
}
