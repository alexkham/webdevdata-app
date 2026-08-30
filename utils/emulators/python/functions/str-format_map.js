// Emulator for Python str.format_map(mapping).
//
// The demo covers simple {name} placeholders, which is what the kv input
// can express. Format specs ({x:>5}), attribute access ({a.b}) and item
// access ({a[0]}) are part of the real grammar but out of the demo's reach.

class KeyErrorLike extends Error {
  constructor(message) { super(message); this.name = 'KeyError'; }
}
class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

export default function strFormatMap(template, mapping) {
  if (typeof template !== 'string') throw new TypeError('format_map() argument must be str');
  const map = mapping || {};

  let out = '';
  for (let i = 0; i < template.length; i += 1) {
    const ch = template[i];

    if (ch === '{') {
      if (template[i + 1] === '{') { out += '{'; i += 1; continue; }
      const close = template.indexOf('}', i + 1);
      if (close === -1) {
        throw new ValueErrorLike("Single '{' encountered in format string");
      }
      const key = template.slice(i + 1, close);
      if (!Object.prototype.hasOwnProperty.call(map, key)) {
        // Python reports the key via repr, so the message carries quotes.
        throw new KeyErrorLike("'" + key + "'");
      }
      out += String(map[key]);
      i = close;
      continue;
    }

    if (ch === '}') {
      if (template[i + 1] === '}') { out += '}'; i += 1; continue; }
      throw new ValueErrorLike("Single '}' encountered in format string");
    }

    out += ch;
  }
  return out;
}
