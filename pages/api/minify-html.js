import { minify } from 'html-minifier';
import iconv from 'iconv-lite';

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { html, encoding } = req.body;
      
      const inputBuffer = iconv.encode(html, encoding);
      const decodedInput = inputBuffer.toString();
      
      const minifiedHTML = minify(decodedInput, {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        decodeEntities: true,
        characterSet: encoding,
      });
      
      const outputBuffer = iconv.encode(minifiedHTML, encoding);
      const encodedOutput = iconv.decode(outputBuffer, encoding);
      
      res.status(200).json({ minifiedHtml: encodedOutput });
    } catch (error) {
      res.status(500).json({ error: 'Error minifying HTML: ' + error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}