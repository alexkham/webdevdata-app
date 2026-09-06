// Emulator for Python float.conjugate() — the identity on real numbers.
// The sign of zero is preserved, so (-0.0).conjugate() stays -0.0.

// Python always shows a whole float with a trailing .0, where a bare JS
// number would render as "4". Same duplication style as bytesRepr.
function pyFloatRepr(n) {
  if (Number.isNaN(n)) return 'nan';
  if (n === Infinity) return 'inf';
  if (n === -Infinity) return '-inf';
  if (Object.is(n, -0)) return '-0.0';
  if (Number.isInteger(n) && Math.abs(n) < 1e16) return `${n}.0`;
  return String(n);
}

export default function floatConjugate(n) {
  if (typeof n !== 'number') throw new TypeError('conjugate() demo argument must be float');
  return { __pyRaw: pyFloatRepr(n) };
}
