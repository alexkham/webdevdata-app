// utils/emulators/python/complex.js
//
// Emulator for Python complex(real, imag) / complex(string).
//
// Two-arg numeric: real and imag as floats.
// One-arg string: parse "3+4j", "-1.5j", "5", etc. — no spaces.
//
// Renders result in Python's canonical form:
//   - purely imaginary: "3j", "-4j"
//   - non-zero real: "(a+bj)" or "(a-bj)"

class ValueErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ValueError'; }
}

function formatNumber(n) {
  // Python renders floats with '.0' for whole numbers.
  if (Object.is(n, -0)) n = 0;
  const s = String(n);
  return s;
}

function formatComplex(r, i) {
  if (r === 0) {
    if (i === 0) return '0j';
    return formatNumber(i) + 'j';
  }
  const sign = i >= 0 ? '+' : '-';
  return `(${formatNumber(r)}${sign}${formatNumber(Math.abs(i))}j)`;
}

function parseComplexString(s) {
  s = s.trim();
  if (s === '') throw new ValueErrorLike('complex() arg is a malformed string');
  if (/\s/.test(s)) throw new ValueErrorLike('complex() arg is a malformed string');

  // Match forms like "3+4j", "-1.5j", "5", "5j", "-3-4j"
  // Real-only: no j suffix.
  if (!s.endsWith('j')) {
    const n = Number(s);
    if (!Number.isFinite(n)) throw new ValueErrorLike('complex() arg is a malformed string');
    return { r: n, i: 0 };
  }

  // Has j suffix. Try to split at the last +/- (not at position 0).
  const body = s.slice(0, -1);
  // Find the last +/- that's not at the start and not right after 'e' (exponent).
  let splitAt = -1;
  for (let k = body.length - 1; k > 0; k--) {
    const ch = body[k];
    if ((ch === '+' || ch === '-') && body[k - 1] !== 'e' && body[k - 1] !== 'E') {
      splitAt = k;
      break;
    }
  }

  if (splitAt === -1) {
    // Purely imaginary.
    const imagStr = body === '' || body === '+' ? '1' : body === '-' ? '-1' : body;
    const i = Number(imagStr);
    if (!Number.isFinite(i)) throw new ValueErrorLike('complex() arg is a malformed string');
    return { r: 0, i };
  }

  const realStr = body.slice(0, splitAt);
  let imagStr = body.slice(splitAt);
  if (imagStr === '+' || imagStr === '') imagStr = '1';
  else if (imagStr === '-') imagStr = '-1';

  const r = Number(realStr);
  const i = Number(imagStr);
  if (!Number.isFinite(r) || !Number.isFinite(i)) {
    throw new ValueErrorLike('complex() arg is a malformed string');
  }
  return { r, i };
}

export default function pyComplex(real, imag) {
  const realRaw = real === null || real === undefined ? '' : String(real).trim();
  const imagRaw = imag === null || imag === undefined ? '' : String(imag).trim();

  // If real looks like a complex-number string (contains 'j' or +/- inside), use string form.
  if (realRaw !== '' && /j/.test(realRaw) && imagRaw === '') {
    const { r, i } = parseComplexString(realRaw);
    return formatComplex(r, i);
  }

  // Otherwise numeric form.
  const r = realRaw === '' ? 0 : Number(realRaw);
  const i = imagRaw === '' ? 0 : Number(imagRaw);
  if (!Number.isFinite(r) || !Number.isFinite(i)) {
    throw new ValueErrorLike('complex() arg is a malformed number');
  }
  return formatComplex(r, i);
}