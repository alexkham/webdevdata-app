import { encode, decode } from 'html-entities';

export default function handler(req, res) {
  const { text, action } = req.body;
  
  if (action === 'encode') {
    res.status(200).json({ result: encode(text) });
  } else if (action === 'decode') {
    res.status(200).json({ result: decode(text) });
  } else {
    res.status(400).json({ error: 'Invalid action' });
  }
}