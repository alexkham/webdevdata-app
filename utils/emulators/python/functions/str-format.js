// utils/emulators/python/str-format.js
//
// Emulator for Python str.format(). The demo takes a template and a
// SINGLE arg — enough to demonstrate the placeholder syntax and format
// spec. Real str.format takes *args and **kwargs; the emulator focuses
// on the single-arg case:
//
//   - `{}` — auto-numbered placeholder (only one usable in single-arg demo)
//   - `{0}` — indexed placeholder (references the single arg)
//   - `{:spec}` — the format spec is applied via pyFormat
//   - `{{` / `}}` — literal braces
//
// Named placeholders (`{name}`) are not exercised in the single-arg
// demo but they would work in real Python code.

import pyFormat from './format.js';

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}
class IndexErrorLike extends Error {
  constructor(message) { super(message); this.name = 'IndexError'; }
}
class KeyErrorLike extends Error {
  constructor(message) { super(message); this.name = 'KeyError'; }
}

export default function strFormat(template, arg) {
  const t = String(template == null ? '' : template);

  // Coerce arg for use — try to make numbers numeric so format specs like
  // ".4f" or "04d" work as expected. If the string looks like a number,
  // convert.
  const argVal = coerce(arg);

  let out = '';
  let i = 0;
  let mode = null; // 'auto' or 'manual' or null
  let autoIdx = 0;
  while (i < t.length) {
    const ch = t[i];

    // Doubled braces → literal.
    if (ch === '{' && t[i + 1] === '{') { out += '{'; i += 2; continue; }
    if (ch === '}' && t[i + 1] === '}') { out += '}'; i += 2; continue; }

    if (ch === '}') {
      // Lone closing brace is an error.
      throw new ValueErrorLike("Single '}' encountered in format string");
    }

    if (ch === '{') {
      // Find the matching closing brace at same nesting level.
      const end = t.indexOf('}', i);
      if (end === -1) {
        throw new ValueErrorLike("Single '{' encountered in format string");
      }
      const inner = t.slice(i + 1, end);
      // Split at the first ':' for [name][:spec].
      const colonIdx = inner.indexOf(':');
      const nameRaw = colonIdx === -1 ? inner : inner.slice(0, colonIdx);
      const spec = colonIdx === -1 ? '' : inner.slice(colonIdx + 1);
      let value;

      if (nameRaw === '') {
        if (mode === 'manual') {
          throw new ValueErrorLike('cannot switch from manual field specification to automatic field numbering');
        }
        mode = 'auto';
        if (autoIdx !== 0) {
          // For the single-arg demo, only slot 0 is valid.
          throw new IndexErrorLike('Replacement index ' + autoIdx + ' out of range for positional args tuple');
        }
        value = argVal;
        autoIdx++;
      } else if (/^\d+$/.test(nameRaw)) {
        if (mode === 'auto') {
          throw new ValueErrorLike('cannot switch from automatic field numbering to manual field specification');
        }
        mode = 'manual';
        const idx = parseInt(nameRaw, 10);
        if (idx !== 0) {
          throw new IndexErrorLike('Replacement index ' + idx + ' out of range for positional args tuple');
        }
        value = argVal;
      } else {
        // Named placeholder in a single-arg demo — treat as unknown key.
        throw new KeyErrorLike("'" + nameRaw + "'");
      }

      out += pyFormat(value, spec);
      i = end + 1;
      continue;
    }

    out += ch;
    i++;
  }
  return out;
}

function coerce(v) {
  if (v === null || v === undefined || v === '') return v;
  // Try numeric coercion — if the string parses cleanly, use the number so
  // numeric format specs work.
  const n = Number(v);
  if (Number.isFinite(n) && String(n) === String(v).trim()) return n;
  return v;
}