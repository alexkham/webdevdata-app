// utils/emulators/python/keywords/match.js
//
// Emulator for the match-keyword demo tabs. Numbers follow the Python
// value of the literal the code shows (utils/py-num.js); str.split() uses
// Python's whitespace set (str.isspace), which differs from JS \s.

import { pyReprExact as pyRepr } from '../../../demo-coerce.js';
import { fromLiteral, cmp } from '../../../py-num.js';

// Characters for which Python str.isspace() is true — exactly the ones
// str.split() with no argument splits on.
const PY_WS = new Set([
  0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x1c, 0x1d, 0x1e, 0x1f, 0x20, 0x85, 0xa0,
  0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007,
  0x2008, 0x2009, 0x200a, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000,
]);

function pySplit(s) {
  const out = [];
  let cur = '';
  for (const ch of s) {
    if (PY_WS.has(ch.codePointAt(0))) {
      if (cur) out.push(cur);
      cur = '';
    } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

// case 200 | 201 / 404 / 500 | 502 | 503 / _  — literal patterns use ==
function statusText(status) {
  const v = fromLiteral(status);
  const is = (...codes) => codes.some((c) => cmp(v, { int: BigInt(c) }) === 0);
  if (is(200, 201)) return 'OK';
  if (is(404)) return 'Not Found';
  if (is(500, 502, 503)) return 'Server error';
  return 'Unknown';
}

// match command.split(): sequence patterns, a star capture and a guard
function parseCommand(command) {
  const words = pySplit(command);
  if (words.length === 2 && words[0] === 'go') return `go ${words[1]}`;
  if (words.length >= 1 && words[0] === 'take') {
    const items = words.slice(1);
    if (items.length > 0) return `take ${pyRepr(items)}`; // guard: if items
  }
  if (words.length === 1 && (words[0] === 'quit' || words[0] === 'exit')) return 'bye';
  if (words.length === 0) return 'empty';
  return 'unknown';
}

// case RED: is a capture pattern — it always matches and rebinds RED
function captureTrap(color) {
  return { __pyTuple: ['matched RED', color] };
}

// case Color.RED: is a value pattern — compared with ==
function dotted(color) {
  return color === 'red' ? 'red' : 'not red';
}

export default {
  literal: statusText,
  sequence: parseCommand,
  trap: captureTrap,
  dotted,
};
