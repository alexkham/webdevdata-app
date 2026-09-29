// utils/demo-coerce.js
//
// Form-value → emulator-argument coercion for the snippet demos
// (SnippetDemo) and their audit. Same input kinds and rules as the
// inline coerce() in MethodDemo — kept separate so that shared component
// stays untouched.
//
// fillSnippet() substitutes {$name} placeholders with the Python repr of
// the coerced argument. The `{$…}` form cannot collide with f-string
// fields or dict literals in the snippet itself.

import { pyRepr } from './code-highlight.js';

export function coerce(raw, param) {
  const s = String(raw);
  switch (param.input) {
    case 'number': {
      const n = parseInt(s, 10);
      return Number.isNaN(n) ? -1 : n;
    }
    case 'number-or-none': {
      const n = parseInt(s, 10);
      return Number.isNaN(n) ? null : n;
    }
    case 'float': {
      const f = parseFloat(s);
      return Number.isNaN(f) ? 0 : f;
    }
    case 'text-or-none':
      return s === '' ? null : s;
    case 'csv':
      return s.trim() === '' ? [] : s.split(',').map((x) => x.trim());
    case 'csv-num':
      return s.trim() === ''
        ? []
        : s.split(',').map((x) => {
            const f = parseFloat(x.trim());
            return Number.isNaN(f) ? 0 : f;
          });
    case 'auto': {
      const t = s.trim();
      if (/^[+-]?\d+$/.test(t)) return parseInt(t, 10);
      if (/^[+-]?(\d+\.\d*|\.\d+|\d+)([eE][+-]?\d+)?$/.test(t) && /[.eE]/.test(t)) return parseFloat(t);
      return s;
    }
    default:
      return s;
  }
}

// Python float repr: shortest round-trip digits (JS toExponential() with no
// argument gives the same digits), positional between 1e-4 and 1e16,
// exponent form outside it ('1e+16', '1e-05'), always a '.0' when integral.
export function pyFloatRepr(x) {
  if (Number.isNaN(x)) return 'nan';
  if (!Number.isFinite(x)) return x > 0 ? 'inf' : '-inf';
  if (x === 0) return Object.is(x, -0) ? '-0.0' : '0.0';
  const [mant, e] = x.toExponential().split('e');
  const exp = Number(e);
  if (exp < -4 || exp >= 16) return `${mant}e${exp < 0 ? '-' : '+'}${String(Math.abs(exp)).padStart(2, '0')}`;
  const neg = mant[0] === '-';
  const digits = mant.replace('-', '').replace('.', '');
  let s;
  if (exp < 0) s = '0.' + '0'.repeat(-exp - 1) + digits;
  else if (digits.length > exp + 1) s = digits.slice(0, exp + 1) + '.' + digits.slice(exp + 1);
  else s = digits + '0'.repeat(exp + 1 - digits.length) + '.0';
  return (neg ? '-' : '') + s;
}

// Python repr() of a str, exactly: quote choice like CPython, \\ \n \r \t
// escapes, and every character str.isprintable() rejects (categories Cc,
// Cf, Cs, Co, Cn, Zl, Zp, Zs except the ASCII space) escaped as \xNN,
// \uNNNN or \UNNNNNNNN. (pyRepr in code-highlight only escapes C0 controls;
// it is shared site-wide, so snippet demos that echo text use this.)
const NON_PRINTABLE = /[\p{Cc}\p{Cf}\p{Cs}\p{Co}\p{Cn}\p{Zl}\p{Zp}\p{Zs}]/u;
export function pyStrRepr(s) {
  const useDouble = s.includes("'") && !s.includes('"');
  const q = useDouble ? '"' : "'";
  let out = '';
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (ch === '\\') out += '\\\\';
    else if (ch === q) out += '\\' + q;
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (ch === '\t') out += '\\t';
    else if (ch !== ' ' && NON_PRINTABLE.test(ch)) {
      if (cp <= 0xff) out += '\\x' + cp.toString(16).padStart(2, '0');
      else if (cp <= 0xffff) out += '\\u' + cp.toString(16).padStart(4, '0');
      else out += '\\U' + cp.toString(16).padStart(8, '0');
    } else out += ch;
  }
  return q + out + q;
}

// pyRepr with exact str reprs at every depth (lists, tuples, dicts, sets).
// Used for snippet-demo output and code. Known edge: a character that the
// browser's Unicode version assigns but Python 3.13's (15.1) does not is
// shown raw instead of escaped.
export function pyReprExact(value) {
  if (typeof value === 'string') return pyStrRepr(value);
  if (Array.isArray(value)) return '[' + value.map(pyReprExact).join(', ') + ']';
  if (value && typeof value === 'object') {
    if (value.__pyRaw !== undefined) return value.__pyRaw;
    if (value.__pyTuple !== undefined) {
      const items = value.__pyTuple.map(pyReprExact);
      return '(' + items.join(', ') + (items.length === 1 ? ',' : '') + ')';
    }
    if (value.__pySet !== undefined) {
      if (value.__pySet.length === 0) return 'set()';
      return '{' + [...value.__pySet].sort().map(pyReprExact).join(', ') + '}';
    }
    return '{' + Object.entries(value).map(([k, v]) => `${pyReprExact(k)}: ${pyReprExact(v)}`).join(', ') + '}';
  }
  return pyRepr(value);
}

// Python literal for a coerced argument. A 'float' param always prints as
// a Python float literal (2.0, 1e+16, -0.0); inf stays 'inf', which — like
// in real Python — is a NameError, not a literal.
export function argLiteral(value, param) {
  if (param && param.input === 'float' && typeof value === 'number') {
    return pyFloatRepr(value);
  }
  return pyReprExact(value);
}

export function fillSnippet(template, params, args) {
  return template.replace(/\{\$(\w+)\}/g, (whole, name) => {
    const i = params.findIndex((p) => p.name === name);
    return i === -1 ? whole : argLiteral(args[i], params[i]);
  });
}

// "Type: message" the way a traceback's last line shows it; bare "Type"
// when the message is empty (raise StopIteration).
export function errorLine(e) {
  const name = (e && e.name) || 'Error';
  const msg = e && e.message;
  return msg ? `${name}: ${msg}` : name;
}
