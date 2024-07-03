import { parseString, Builder } from 'xml2js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { data, from } = req.body;

    try {
      let result;
      if (from === 'json') {
        result = jsonToXml(data);
      } else if (from === 'xml') {
        result = await xmlToJson(data);
      } else {
        throw new Error('Invalid conversion type');
      }

      res.status(200).json({ result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function jsonToXml(json) {
  const builder = new Builder();
  return builder.buildObject(JSON.parse(json));
}

function xmlToJson(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) reject(err);
      else resolve(JSON.stringify(result, null, 2));
    });
  });
}