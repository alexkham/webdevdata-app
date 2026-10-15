// utils/emulators/python/stdlib/contextlib/_demo.js
//
// The plain-Python pieces the contextlib demo snippets evaluate around the
// context managers. Numbers follow the Python value of the literal the code
// shows (utils/py-num.js: int, float such as 1e+21, NameError for inf);
// floor division and list indexing come from the try-keyword emulator.

import { fromLiteral, isInt, toPy } from '../../../../py-num.js';
import { floorDiv, listIndex } from '../../keywords/try.js';
import { exc } from './_pycontextlib.js';

// 100 // n  (or a // n) — the value appended to the demo logs
export const floorDivLit = (n, a = 100n) => toPy(floorDiv({ int: a }, fromLiteral(n)));

// seq[i] for a JS array and a 'number' input
export const indexLit = (seq, i) => seq[listIndex(seq.length, fromLiteral(i))];

// range(n) for a 'number' input: the exact int bound (BigInt)
export function rangeBound(n) {
  const v = fromLiteral(n);
  if (!isInt(v)) throw exc('TypeError', "'float' object cannot be interpreted as an integer");
  return v.int;
}

// d[key] for a JS Map with str keys
export function getItem(map, key) {
  if (!map.has(key)) throw exc('KeyError', key);
  return map.get(key);
}

// f'{e}' / str(e) of an exception
export const str = (e) => e.message;
