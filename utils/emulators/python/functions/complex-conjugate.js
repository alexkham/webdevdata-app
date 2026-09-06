// Emulator for Python complex.conjugate() — negates the imaginary part.
// This is the one type where conjugate actually changes the value.
//
// Python's complex repr is fiddly: parentheses only when the real part is
// not a positive zero, whole floats print without their trailing .0, and
// the imaginary part always carries an explicit sign inside the parens.

function fmt(x) {
  if (Number.isNaN(x)) return 'nan';
  if (x === Infinity) return 'inf';
  if (x === -Infinity) return '-inf';
  if (Object.is(x, -0)) return '-0';
  if (Number.isInteger(x) && Math.abs(x) < 1e16) return String(x);
  return String(x);
}

export default function complexConjugate(re, im) {
  if (typeof re !== 'number' || typeof im !== 'number') {
    throw new TypeError('conjugate() demo arguments must be numbers');
  }
  const outRe = re;
  const outIm = -im; // conjugation flips the imaginary sign

  // A positive zero real part is omitted entirely: complex(0, 4) is 4j.
  if (outRe === 0 && !Object.is(outRe, -0)) {
    return { __pyRaw: `${fmt(outIm)}j` };
  }

  let imText = fmt(outIm);
  if (!imText.startsWith('-')) imText = `+${imText}`;
  return { __pyRaw: `(${fmt(outRe)}${imText}j)` };
}
