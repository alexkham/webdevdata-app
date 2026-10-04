// utils/emulators/python/stdlib/random/getstate-setstate.js
//
// Emulator for the getstate / setstate demo, on the CPython port in
// _pyrandom.js: the state is (3, 624 Mersenne Twister words + position,
// gauss_next).

import { PyRandom, lit, demoGuard, pyF } from './_pyrandom.js';

const five = (r) => Array.from({ length: 5 }, () => r.randint(1n, 9n));

export default {
  replay: (seed) => {
    const r = new PyRandom(lit(seed));
    const state = r.getstate();
    const first = five(r);
    r.setstate(state);
    const again = five(r);
    return { __pyTuple: [first, again] };
  },

  // for _ in range(n): random.random()
  // (state[0], len(state[1]), state[1][-1], state[2])
  shape: (seed, n) => {
    const r = new PyRandom(lit(seed));
    const count = lit(n);
    demoGuard(count > 1000000n ? 1n << 60n : count, `range(${count})`);
    for (let i = 0n; i < count; i += 1n) r.random();
    const [version, internal, cached] = r.getstate();
    return { __pyTuple: [version, BigInt(internal.length), internal[internal.length - 1], cached === null ? null : pyF(cached)] };
  },
};
