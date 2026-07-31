// utils/code-highlight.js
//
// Tiny Python tokenizer for the reference code blocks. No Prism, no deps —
// the snippets are short and controlled (they come from our own content
// files), so a small regex scanner is enough.
//
//   highlightPython('s = "hello".replace("l", "L")')
//     → [ { cls: null, text: 's = ' }, { cls: 'str', text: '"hello"' }, ... ]
//
// Token classes (map to CSS in the consuming component):
//   'kw'   — Python keyword            'str'  — string literal
//   'num'  — numeric literal           'com'  — comment (# …)
//   'fn'   — identifier followed by (  'bltn' — common built-in name
//   null   — plain text

const KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
  'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
  'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
  'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
]);

const BUILTINS = new Set([
  'print', 'len', 'str', 'int', 'float', 'bool', 'list', 'dict', 'set',
  'tuple', 'range', 'enumerate', 'sorted', 'reversed', 'zip', 'map', 'filter',
  'sum', 'min', 'max', 'abs', 'round', 'type', 'isinstance', 'repr', 'input',
  'open', 're',
]);

const TOKEN_RE = new RegExp(
  [
    '(#[^\\n]*)',                                   // 1 comment
    '("""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\')',    // 2 triple-quoted string
    '("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')', // 3 string
    '\\b(\\d+(?:\\.\\d+)?)\\b',                     // 4 number
    '\\b([A-Za-z_][A-Za-z0-9_]*)\\b',               // 5 identifier
  ].join('|'),
  'g'
);

export function highlightPython(code) {
  const tokens = [];
  let last = 0;
  let m;

  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(code)) !== null) {
    if (m.index > last) tokens.push({ cls: null, text: code.slice(last, m.index) });

    if (m[1] !== undefined) {
      tokens.push({ cls: 'com', text: m[1] });
    } else if (m[2] !== undefined || m[3] !== undefined) {
      tokens.push({ cls: 'str', text: m[2] !== undefined ? m[2] : m[3] });
    } else if (m[4] !== undefined) {
      tokens.push({ cls: 'num', text: m[4] });
    } else {
      const word = m[5];
      const isCall = code[TOKEN_RE.lastIndex] === '(';
      if (KEYWORDS.has(word)) tokens.push({ cls: 'kw', text: word });
      else if (BUILTINS.has(word)) tokens.push({ cls: 'bltn', text: word });
      else if (isCall) tokens.push({ cls: 'fn', text: word });
      else tokens.push({ cls: null, text: word });
    }
    last = TOKEN_RE.lastIndex;
  }
  if (last < code.length) tokens.push({ cls: null, text: code.slice(last) });

  return tokens;
}

// Python repr() of a JS string — used by demo/pitfall components to render
// call previews and outputs the way Python would print them.
export function pyRepr(value) {
  if (typeof value === 'string') {
    return "'" + value.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  }
  if (value === null || value === undefined) return 'None';
  if (value === true) return 'True';
  if (value === false) return 'False';
  return String(value);
}
