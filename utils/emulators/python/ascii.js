// utils/emulators/python/ascii.js
//
// Emulator for Python ascii(x). Same as repr() but every codepoint >= 128
// is replaced with an escape sequence:
//   - 0x80..0xFF     → \xHH
//   - 0x0100..0xFFFF → \uXXXX
//   - 0x10000+       → \UXXXXXXXX

function chooseQuote(s) {
  const hasSingle = s.includes("'");
  const hasDouble = s.includes('"');
  const useDouble = hasSingle && !hasDouble;
  return useDouble ? '"' : "'";
}

function escapeChar(ch, quote) {
  const cp = ch.codePointAt(0);
  if (cp === 0x5c) return '\\\\';
  if (ch === quote) return '\\' + quote;
  if (cp === 0x0a) return '\\n';
  if (cp === 0x0d) return '\\r';
  if (cp === 0x09) return '\\t';
  if (cp < 0x20 || cp === 0x7f) {
    return '\\x' + cp.toString(16).padStart(2, '0');
  }
  if (cp < 0x80) return ch; // Printable ASCII.
  if (cp <= 0xff) return '\\x' + cp.toString(16).padStart(2, '0');
  if (cp <= 0xffff) return '\\u' + cp.toString(16).padStart(4, '0');
  return '\\U' + cp.toString(16).padStart(8, '0');
}

export default function pyAscii(x) {
  if (x === undefined) return 'None';
  if (x === null) return 'None';
  if (typeof x === 'boolean') return x ? 'True' : 'False';
  if (typeof x === 'number') {
    if (Number.isNaN(x)) return 'nan';
    if (x === Infinity) return 'inf';
    if (x === -Infinity) return '-inf';
    return String(x);
  }
  const s = String(x);
  const q = chooseQuote(s);
  let out = '';
  for (const ch of s) out += escapeChar(ch, q);
  return q + out + q;
}