// utils/emulators/python/repr.js
//
// Emulator for Python repr(x). Follows CPython's quoting and escape rules
// for strings:
//   - Wrap in single quotes by default.
//   - If the string contains a single quote AND no double quote, wrap in
//     double quotes instead (avoids escaping the single quote).
//   - Escape backslashes, newlines (\n), carriage returns (\r), tabs (\t).
//   - Escape the outer quote character if it appears inside.
//
// Other types are shown as CPython would: None → "None", True/False,
// numbers as their str form.

function reprString(s) {
  const hasSingle = s.includes("'");
  const hasDouble = s.includes('"');
  // Choose quote — prefer single unless the string contains one but not the other.
  const useDouble = hasSingle && !hasDouble;
  const q = useDouble ? '"' : "'";

  let out = '';
  for (const ch of s) {
    if (ch === '\\') out += '\\\\';
    else if (ch === q) out += '\\' + q;
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (ch === '\t') out += '\\t';
    else {
      const code = ch.codePointAt(0);
      if (code < 0x20 || code === 0x7f) {
        out += '\\x' + code.toString(16).padStart(2, '0');
      } else {
        out += ch;
      }
    }
  }
  return q + out + q;
}

export default function pyRepr(x) {
  if (x === undefined) return 'None';
  if (x === null) return 'None';
  if (typeof x === 'boolean') return x ? 'True' : 'False';
  if (typeof x === 'number') {
    if (Number.isNaN(x)) return 'nan';
    if (x === Infinity) return 'inf';
    if (x === -Infinity) return '-inf';
    return String(x);
  }
  if (typeof x === 'string') return reprString(x);
  return String(x);
}