// Emulator for Python complex(real, imag) over numbers, matching
// Python's repr rules: complex(0, 2) is 2j, complex(3, 4) is (3+4j).
export default function pyComplex(real, imag = 0) {
  if (typeof real !== 'number' || typeof imag !== 'number') {
    throw new TypeError('complex() demo arguments must be numbers');
  }
  if (real === 0) {
    return { __pyRaw: String(imag) + 'j' };
  }
  const sign = imag < 0 ? '-' : '+';
  return { __pyRaw: '(' + String(real) + sign + String(Math.abs(imag)) + 'j)' };
}
