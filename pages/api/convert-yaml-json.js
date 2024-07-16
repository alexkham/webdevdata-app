import yaml from 'js-yaml';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { data, conversionType } = req.body;

    try {
      let result;
      if (conversionType === 'yaml2json') {
        result = yaml.load(data);
        result = JSON.stringify(result, null, 2);
      } else {
        result = yaml.dump(JSON.parse(data));
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