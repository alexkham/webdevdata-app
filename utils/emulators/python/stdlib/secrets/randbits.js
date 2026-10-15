// utils/emulators/python/stdlib/secrets/randbits.js
//
// Emulator for the secrets.randbits demo tabs. The bits are really drawn
// (Web Crypto, SystemRandom.getrandbits — see _pysecrets.js); the tabs
// show only what is the same for every draw. Inputs whose output would
// vary from run to run raise DemoLimit instead of showing one draw.

import { randbits, numArg } from './_pysecrets.js';

function demoLimit(msg) {
  const e = new Error(`${msg} — run it in Python`);
  e.name = 'DemoLimit';
  throw e;
}

// up to 5 bits (32 values), 1000 draws reach both 0 and 2**k - 1 except
// with probability below 1e-13; with more bits min / max vary per run
const MAX_RANGE_BITS = 5n;

export default {
  // x = secrets.randbits(k); text = f'{x:0{(k + 3) // 4}x}'; (len(text), x < 2 ** k)
  hex: (kIn) => {
    const k = numArg(kIn);
    const x = randbits(k);
    const width = Number((k + 3n) / 4n);
    const text = x.toString(16).padStart(width, '0');
    return { __pyTuple: [text.length, x < 2n ** k] };
  },

  // draws = [secrets.randbits(k) for _ in range(1000)]
  // (min(draws), max(draws), 2 ** k - 1)
  range: (kIn) => {
    const k = numArg(kIn);
    // the first draw raises for a negative or float k (a large int k is
    // valid: check it with a cheap 0-bit draw instead of a huge one)
    randbits(typeof k === 'bigint' && k > MAX_RANGE_BITS ? 0n : k);
    if (k > MAX_RANGE_BITS) demoLimit(`with ${k} bits the smallest and largest of 1000 draws change from run to run`);
    const draws = Array.from({ length: 1000 }, () => randbits(k));
    let lo = draws[0];
    let hi = draws[0];
    for (const d of draws) { if (d < lo) lo = d; if (d > hi) hi = d; }
    return { __pyTuple: [lo, hi, 2n ** k - 1n] };
  },
};
