// Emulator for Python float.fromhex(s) — parses the exact hexadecimal form.
//
// Grammar: [sign] ['0x'] hexdigits ['.' hexdigits] [('p'|'P') [sign] decimal]
// The '0x' prefix is OPTIONAL, which is why '0.5' parses as hex 5/16 = 0.3125
// rather than one half.

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

const BAD = 'invalid hexadecimal floating-point string';

// Python always shows a whole float with a trailing .0, where a bare JS
// number would render as "256". Same duplication style as bytesRepr.
function pyFloatRepr(n) {
  if (Number.isNaN(n)) return 'nan';
  if (n === Infinity) return 'inf';
  if (n === -Infinity) return '-inf';
  if (Object.is(n, -0)) return '-0.0';
  if (Number.isInteger(n) && Math.abs(n) < 1e16) return `${n}.0`;
  return String(n);
}

export default function floatFromhex(s) {
  if (typeof s !== 'string') throw new TypeError('fromhex() argument must be str');

  let t = s.trim().toLowerCase();

  let sign = 1;
  if (t.startsWith('+')) t = t.slice(1);
  else if (t.startsWith('-')) { sign = -1; t = t.slice(1); }

  if (t === 'inf' || t === 'infinity') return { __pyRaw: pyFloatRepr(sign * Infinity) };
  if (t === 'nan') return { __pyRaw: 'nan' };

  if (t.startsWith('0x')) t = t.slice(2);

  // Split off the binary exponent.
  let exp = 0;
  const p = t.indexOf('p');
  if (p !== -1) {
    const expText = t.slice(p + 1);
    if (!/^[+-]?\d+$/.test(expText)) throw new ValueErrorLike(BAD);
    exp = parseInt(expText, 10);
    t = t.slice(0, p);
  }

  const dot = t.indexOf('.');
  const intPart = dot === -1 ? t : t.slice(0, dot);
  const fracPart = dot === -1 ? '' : t.slice(dot + 1);

  if (intPart === '' && fracPart === '') throw new ValueErrorLike(BAD);
  if (!/^[0-9a-f]*$/.test(intPart) || !/^[0-9a-f]*$/.test(fracPart)) {
    throw new ValueErrorLike(BAD);
  }

  let value = intPart === '' ? 0 : parseInt(intPart, 16);
  for (let i = 0; i < fracPart.length; i += 1) {
    value += parseInt(fracPart[i], 16) / Math.pow(16, i + 1);
  }

  return { __pyRaw: pyFloatRepr(sign * value * Math.pow(2, exp)) };
}
