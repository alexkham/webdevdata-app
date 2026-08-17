// utils/emulators/python/str-splitlines.js
//
// Emulator for Python str.splitlines(keepends=False).
//
// Universal newlines set (matching CPython):
//   \n \r \r\n \v \f \x1c \x1d \x1e \x85 \u2028 \u2029
//
// Semantics:
//   - No trailing empty string when the text ends with a newline.
//   - \r\n counts as ONE separator.
//   - keepends=True keeps the terminator on each line.
//
// The demo passes source text through a `text` input; escape sequences
// like \n arrive as literal two-character sequences ("\\n"), so we
// unescape them here — a small demo convenience so users see meaningful
// output instead of the escapes themselves.

const SEP = new Set(['\n', '\r', '\v', '\f', '\x1c', '\x1d', '\x1e', '\x85', '\u2028', '\u2029']);

function unescape(s) {
  return String(s)
    .replace(/\\r\\n/g, '\r\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\v/g, '\v')
    .replace(/\\f/g, '\f')
    .replace(/\\t/g, '\t');
}

export default function strSplitlines(string, keepends = false) {
  const s = unescape(string == null ? '' : string);
  const keep = keepends === true || keepends === 1 || keepends === '1';
  const out = [];
  let start = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (!SEP.has(c)) continue;
    let end = i + 1;
    // \r\n is one separator
    if (c === '\r' && s[i + 1] === '\n') end = i + 2;
    const line = keep ? s.slice(start, end) : s.slice(start, i);
    out.push(line);
    start = end;
    i = end - 1;
  }
  // Only add the trailing chunk if it isn't empty (no phantom empty tail).
  if (start < s.length) out.push(s.slice(start));
  return out;
}