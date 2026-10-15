// utils/emulators/python/stdlib/secrets/systemrandom.js
//
// Emulator for the secrets.SystemRandom demo tabs: random.Random's own
// algorithms (the random engine's PyRandom) on the os.urandom stand-in of
// _pysecrets.js, plus the seeded Mersenne Twister for comparison. The
// draws are real; the tabs show only what is the same for every draw.

import { SystemRandom, numArg, PyFloat } from './_pysecrets.js';
import { PyRandom, lit } from '../random/_pyrandom.js';
import { PyException } from '../../../../py-exceptions.js';

const raise = (type, msg = '') => { throw new PyException(type, msg); };
const MAX_CARDS = 100000;
const SSIZE_MAX = (1n << 63n) - 1n;

// range(n) for a number typed into the demo: int literal → BigInt; a float
// literal ('1e+21') is rejected by range()
function rangeArg(v) {
  const n = numArg(v);
  if (n instanceof PyFloat) raise('TypeError', "'float' object cannot be interpreted as an integer");
  return n;
}

export default {
  // rng = secrets.SystemRandom(); winners = rng.sample(range(n), k)
  // (len(winners), len(set(winners)), all(0 <= w < n for w in winners))
  winners: (nIn, kIn) => {
    const N = rangeArg(nIn);
    const kv = numArg(kIn);
    // sample() takes len(range(n)), a C ssize_t
    if ((N > 0n ? N : 0n) > SSIZE_MAX) raise('OverflowError', 'Python int too large to convert to C ssize_t');
    // a float k: PyRandom.sample's own float path (range check, then [None] * k)
    const winners = new SystemRandom().sample({ range: N }, kv instanceof PyFloat ? kv.value : kv);
    const distinct = new Set(winners.map(String)).size;
    return { __pyTuple: [winners.length, distinct, winners.every((w) => w >= 0n && w < N)] };
  },

  // deck = list(range(cards)); secrets.SystemRandom().shuffle(deck)
  // (len(deck), sorted(deck) == list(range(cards)))
  shuffle: (cardsIn) => {
    const n = rangeArg(cardsIn);
    const count = n > 0n ? Number(n) : 0;
    if (n > BigInt(MAX_CARDS)) {
      const e = new Error(`a ${count}-card deck is too big for the in-browser demo — run it in Python`);
      e.name = 'DemoLimit';
      throw e;
    }
    const deck = Array.from({ length: count }, (_, i) => BigInt(i));
    new SystemRandom().shuffle(deck);
    const sorted = [...deck].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
    return { __pyTuple: [deck.length, sorted.every((v, i) => v === BigInt(i))] };
  },

  // a, b = SystemRandom(seed), SystemRandom(seed); r1, r2 = Random(seed), Random(seed)
  // (a.getrandbits(64) == b.getrandbits(64), r1.getrandbits(64) == r2.getrandbits(64))
  seed: (seed) => {
    const s = lit(seed);
    const a = new SystemRandom(s);
    const b = new SystemRandom(s);
    const r1 = new PyRandom(s);
    const r2 = new PyRandom(s);
    return { __pyTuple: [a.getrandbits(64n) === b.getrandbits(64n), r1.getrandbits(64n) === r2.getrandbits(64n)] };
  },
};
