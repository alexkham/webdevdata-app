// utils/emulators/python/format.js
//
// Emulator for Python format(value, format_spec). Covers the atoms
// exercised in the demo:
//   - fill + align: e.g. "*^10", ">10", "<10", "^10"
//   - width: ">10", "10"
//   - .precision: ".2f", ".1%", ".5" (string truncation)
//   - type: d, b, o, x, X, f, %, s
//   - "0" flag: "08d", "08b"
//   - "," thousands separator (for numeric types)
//
// Not a full CPython format-spec parser — covers the common cases in the
// demo. Deeper edge cases (sign flags, "#" prefix, exponent styles) can
// be added if the demo needs them.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

function parseSpec(spec) {
  // Format spec: [[fill]align][sign][#][0][width][,_][.precision][type]
  const out = {
    fill: ' ',
    align: null,
    zero: false,
    width: 0,
    comma: false,
    precision: null,
    type: '',
  };
  if (spec === '') return out;

  const re = /^(?:(.)?([<>=^]))?([+\- ])?(#)?(0)?(\d+)?([,_])?(?:\.(\d+))?([bcdeEfFgGnosxX%])?$/;
  const m = spec.match(re);
  if (!m) throw new ValueErrorLike('Invalid format specifier');
  out.fill = m[1] !== undefined ? m[1] : (m[5] ? '0' : ' ');
  out.align = m[2] || null;
  out.sign = m[3] || null;
  out.hash = !!m[4];
  out.zero = !!m[5];
  out.width = m[6] ? parseInt(m[6], 10) : 0;
  out.comma = m[7] === ',';
  out.underscore = m[7] === '_';
  out.precision = m[8] !== undefined ? parseInt(m[8], 10) : null;
  out.type = m[9] || '';
  return out;
}

function pad(str, width, fill, align, isNumeric) {
  if (str.length >= width) return str;
  const delta = width - str.length;
  const eff = align || (isNumeric ? '>' : '<');
  if (eff === '>') return fill.repeat(delta) + str;
  if (eff === '<') return str + fill.repeat(delta);
  if (eff === '^') {
    const right = Math.floor(delta / 2);
    const left = delta - right;
    return fill.repeat(left) + str + fill.repeat(right);
  }
  return str + fill.repeat(delta);
}

function insertSeparator(intStr, sep) {
  const neg = intStr.startsWith('-') ? '-' : '';
  const digits = neg ? intStr.slice(1) : intStr;
  const withSep = digits.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return neg + withSep;
}

export default function pyFormat(value, spec) {
  const p = parseSpec(String(spec == null ? '' : spec));

  const t = p.type;
  const asNumber = t === 'd' || t === 'b' || t === 'o' || t === 'x' || t === 'X' ||
                   t === 'f' || t === 'F' || t === '%' || t === 'e' || t === 'E' ||
                   t === 'g' || t === 'G';

  let str;

  if (t === '' || t === 's') {
    // When comma/underscore is specified and value is numeric, treat as implicit 'd'.
    if ((p.comma || p.underscore) && typeof value === 'number') {
      let s = Math.trunc(value).toString();
      s = insertSeparator(s, p.comma ? ',' : '_');
      str = s;
    } else {
      str = String(value == null ? '' : value);
      if (p.precision !== null) str = str.slice(0, p.precision);
    }
  } else {
    const n = Number(value);
    if (!Number.isFinite(n) && (t === 'd' || t === 'b' || t === 'o' || t === 'x' || t === 'X')) {
      throw new ValueErrorLike('Unknown format code for object');
    }

    if (t === 'd') {
      let s = Math.trunc(n).toString();
      if (p.comma) s = insertSeparator(s, ',');
      if (p.underscore) s = insertSeparator(s, '_');
      str = s;
    } else if (t === 'b') {
      const abs = Math.abs(Math.trunc(n));
      str = (n < 0 ? '-' : '') + abs.toString(2);
    } else if (t === 'o') {
      const abs = Math.abs(Math.trunc(n));
      str = (n < 0 ? '-' : '') + abs.toString(8);
    } else if (t === 'x') {
      const abs = Math.abs(Math.trunc(n));
      str = (n < 0 ? '-' : '') + abs.toString(16);
    } else if (t === 'X') {
      const abs = Math.abs(Math.trunc(n));
      str = (n < 0 ? '-' : '') + abs.toString(16).toUpperCase();
    } else if (t === 'f' || t === 'F') {
      const prec = p.precision === null ? 6 : p.precision;
      let s = n.toFixed(prec);
      if (p.comma) {
        const [i, d] = s.split('.');
        s = insertSeparator(i, ',') + (d !== undefined ? '.' + d : '');
      }
      str = s;
    } else if (t === '%') {
      const prec = p.precision === null ? 6 : p.precision;
      str = (n * 100).toFixed(prec) + '%';
    } else {
      str = String(value);
    }
  }

  // Zero-padding for numeric with 0 flag and no explicit align.
  if (p.zero && asNumber && !p.align) {
    p.fill = '0';
    p.align = '>';
  }

  return pad(str, p.width, p.fill, p.align, asNumber);
}