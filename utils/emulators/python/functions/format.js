// Emulator for Python format(value, spec) covering the common spec
// mini-language: fill/align, 0-pad, width, grouping, precision, and the
// b/d/o/x/X/f/% presentation types.
class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}
const group = (digits) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
export default function pyFormat(value, spec = '') {
  const m = String(spec).match(/^(?:(.)?([<>^]))?([+\- ])?(0)?(\d+)?([,])?(?:\.(\d+))?([bdoxXfeEgGs%])?$/);
  if (!m) throw new ValueErrorLike('Invalid format specifier');
  const fill = m[1];
  const align = m[2];
  const zero = m[4];
  const width = m[5];
  const comma = m[6];
  const prec = m[7];
  const type = m[8];
  const isNum = typeof value === 'number';

  if (type && 'bdoxX'.includes(type) && (!isNum || !Number.isInteger(value))) {
    throw new ValueErrorLike("Unknown format code '" + type + "' for object of type '" + (isNum ? 'float' : 'str') + "'");
  }
  if (type && 'f%eEgG'.includes(type) && !isNum) {
    throw new ValueErrorLike("Unknown format code '" + type + "' for object of type 'str'");
  }
  if (comma && !isNum) throw new ValueErrorLike("Cannot specify ',' with 's'.");

  let body;
  const neg = isNum && value < 0;
  const av = isNum ? Math.abs(value) : value;
  if (!isNum) body = String(value);
  else if (type === 'b') body = av.toString(2);
  else if (type === 'o') body = av.toString(8);
  else if (type === 'x') body = av.toString(16);
  else if (type === 'X') body = av.toString(16).toUpperCase();
  else if (type === 'f') body = av.toFixed(prec !== undefined ? Number(prec) : 6);
  else if (type === '%') body = (av * 100).toFixed(prec !== undefined ? Number(prec) : 6) + '%';
  else if (type === 'e' || type === 'E') {
    body = av.toExponential(prec !== undefined ? Number(prec) : 6);
    if (type === 'E') body = body.toUpperCase();
  } else body = String(av);
  if (comma) body = body.replace(/^\d+/, group);
  if (neg) body = '-' + body;

  const w = width ? Number(width) : 0;
  if (body.length >= w) return body;
  if (zero && isNum && !align) {
    const sign2 = body[0] === '-' ? '-' : '';
    return sign2 + body.slice(sign2.length).padStart(w - sign2.length, '0');
  }
  const f2 = fill || ' ';
  const a2 = align || (isNum ? '>' : '<');
  const pad = w - body.length;
  if (a2 === '>') return f2.repeat(pad) + body;
  if (a2 === '<') return body + f2.repeat(pad);
  const left = Math.floor(pad / 2);
  return f2.repeat(left) + body + f2.repeat(pad - left);
}
