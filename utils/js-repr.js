// utils/js-repr.js
//
// The JavaScript counterpart of pyRepr in utils/code-highlight.js.
//
// Renders a value the way a JS developer would write it, which is close to
// Node's util.inspect but without its line-wrapping and without the extra
// spaces inside array brackets — `[1, 2]` rather than `[ 1, 2 ]`, because
// the first is how the value is written in source.
//
// Escape hatch, mirroring pyRepr's __pyRaw:
//   { __jsRaw: "/ab+c/gi" } → /ab+c/gi   (pre-formatted, emitted verbatim)

const QUOTE_ESCAPES = {
  '\\': '\\\\',
  "'": "\\'",
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\b': '\\b',
  '\f': '\\f',
  '\v': '\\v',
};

function reprString(value) {
  let body = '';
  for (const ch of value) {
    if (QUOTE_ESCAPES[ch] !== undefined) {
      body += QUOTE_ESCAPES[ch];
    } else if (ch < ' ' || ch === '') {
      body += '\\x' + ch.charCodeAt(0).toString(16).padStart(2, '0');
    } else {
      body += ch;
    }
  }
  return "'" + body + "'";
}

// Object keys print bare when they are valid identifiers, quoted otherwise —
// matching how you would type the literal.
const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export function jsRepr(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  const t = typeof value;

  if (t === 'string') return reprString(value);
  if (t === 'boolean') return value ? 'true' : 'false';
  if (t === 'bigint') return `${value}n`;
  if (t === 'symbol') return value.toString();
  if (t === 'function') return value.name ? `[Function: ${value.name}]` : '[Function (anonymous)]';

  if (t === 'number') {
    // Object.is distinguishes -0 from 0, which String() does not.
    if (Object.is(value, -0)) return '-0';
    return String(value); // covers NaN, Infinity, -Infinity
  }

  if (Array.isArray(value)) {
    // Holes in a sparse array print as <N empty items> in Node; the demos
    // never produce them, so a plain map is enough.
    return '[' + value.map(jsRepr).join(', ') + ']';
  }

  if (t === 'object') {
    if (value.__jsRaw !== undefined) return value.__jsRaw;

    if (value instanceof Date) return value.toISOString();
    if (value instanceof RegExp) return value.toString();
    if (value instanceof Error) return `${value.name}: ${value.message}`;

    if (value instanceof Map) {
      if (value.size === 0) return 'Map(0) {}';
      const body = [...value.entries()]
        .map(([k, v]) => `${jsRepr(k)} => ${jsRepr(v)}`)
        .join(', ');
      return `Map(${value.size}) { ${body} }`;
    }

    if (value instanceof Set) {
      if (value.size === 0) return 'Set(0) {}';
      return `Set(${value.size}) { ${[...value].map(jsRepr).join(', ')} }`;
    }

    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    const body = entries
      .map(([k, v]) => `${IDENT.test(k) ? k : reprString(k)}: ${jsRepr(v)}`)
      .join(', ');
    return `{ ${body} }`;
  }

  return String(value);
}

export default jsRepr;
