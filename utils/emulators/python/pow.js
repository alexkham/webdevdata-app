// utils/emulators/python/pow.js
//
// Emulator for Python pow(base, exp, mod=None).
//
// Two-arg form: base ** exp (float and int both supported).
// Three-arg form: base ** exp mod m, computed by square-and-multiply so
// large exponents stay tractable — matching CPython's fast path.
//
// Errors mirrored:
//   - ZeroDivisionError for 0 ** negative
//   - TypeError for three-arg with any non-integer
//
// The demo passes mod through the number-or-none input; empty means None.

class ZeroDivisionErrorLike extends Error {
  constructor(message) { super(message); this.name = 'ZeroDivisionError'; }
}

// Integer square-and-multiply. Uses BigInt for safety with large exponents.
function modPowBig(base, exp, mod) {
  let b = BigInt(base);
  let e = BigInt(exp);
  const m = BigInt(mod);
  if (m === 1n) return 0n;
  let result = 1n;
  b = ((b % m) + m) % m;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % m;
    e >>= 1n;
    b = (b * b) % m;
  }
  return result;
}

function isIntegerLike(v) {
  return Number.isFinite(Number(v)) && Number.isInteger(Number(v));
}

export default function pyPow(base, exp, mod) {
  const noMod = mod === undefined || mod === null || mod === '' || Number.isNaN(Number(mod));
  const nBase = Number(base);
  const nExp = Number(exp);

  if (!noMod) {
    // Three-arg: all integers.
    if (!isIntegerLike(base) || !isIntegerLike(exp) || !isIntegerLike(mod)) {
      throw new TypeError('pow() 3rd argument not allowed unless all arguments are integers');
    }
    const m = Number(mod);
    if (m === 0) throw new ZeroDivisionErrorLike('pow() 3rd argument cannot be 0');
    // Positive exponent: straightforward modpow.
    if (nExp >= 0) return Number(modPowBig(nBase, nExp, m));
    // Negative exponent (3.8+): modular inverse via Fermat/Euler.
    // Simple extended-Euclid-based inverse.
    const inv = modInverseBig(BigInt(nBase), BigInt(m));
    if (inv === null) {
      throw new Error("ValueError: base is not invertible for the given modulus");
    }
    return Number(modPowBig(inv, -nExp, m));
  }

  // Two-arg form.
  if (nBase === 0 && nExp < 0) {
    throw new ZeroDivisionErrorLike('0.0 cannot be raised to a negative power');
  }
  return Math.pow(nBase, nExp);
}

function modInverseBig(a, m) {
  // Extended Euclidean algorithm.
  let [old_r, r] = [((a % m) + m) % m, m];
  let [old_s, s] = [1n, 0n];
  while (r !== 0n) {
    const q = old_r / r;
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
  }
  if (old_r !== 1n) return null;
  return ((old_s % m) + m) % m;
}