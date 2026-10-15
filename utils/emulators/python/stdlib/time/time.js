// utils/emulators/python/stdlib/time/time.js
//
// Emulator for the time.time / time.time_ns demo, on the CPython port in
// _pytime.js. Both tabs start from a reading typed by the reader, so the
// result never depends on the real clock.

import * as T from './_pytime.js';
import { PyFloat, trueDiv } from '../datetime/_pydatetime.js';

const NS = 1000000000n;

// Python int / float arithmetic on { int } | { float } values
const toF = (v) => (v.int !== undefined ? Number(v.int) : v.float);
const mul = (a, b) => (a.int !== undefined && b.int !== undefined ? { int: a.int * b.int } : { float: toF(a) * toF(b) });
const add = (a, b) => (a.int !== undefined && b.int !== undefined ? { int: a.int + b.int } : { float: toF(a) + toF(b) });
const sub = (a, b) => (a.int !== undefined && b.int !== undefined ? { int: a.int - b.int } : { float: toF(a) - toF(b) });
// a / b: int / int is correctly rounded (long_true_divide); a float operand
// turns the int into a float first
const div = (a, b) => (a.int !== undefined && b.int !== undefined ? { float: trueDiv(a.int, b.int) } : { float: toF(a) / toF(b) });
// round(x) for a float x: round half to even, an int result
function pyRound(x) {
  if (Number.isNaN(x)) T.raise('ValueError', 'cannot convert float NaN to integer');
  if (!Number.isFinite(x)) T.raise('OverflowError', 'cannot convert float infinity to integer');
  const f = Math.floor(x);
  const d = x - f;
  let r = f;
  if (d > 0.5 || (d === 0.5 && f % 2 !== 0)) r = f + 1;
  return { int: BigInt(r) };
}
const py = (v) => (v.int !== undefined ? v.int : new PyFloat(v.float));

export default {
  // now = seconds  # what time.time() returned
  // time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(now))
  utc: (seconds) => T.strftime('%Y-%m-%d %H:%M:%S', T.gmtime(T.arg(seconds))),

  // ns = seconds * 10**9 + nanos
  // secs = ns / 10**9
  // (secs, round(secs * 10**9) - ns)
  ns: (seconds, nanos) => {
    const ns = add(mul(T.arg(seconds), { int: NS }), T.arg(nanos));
    const secs = div(ns, { int: NS });
    const back = pyRound(toF(mul(secs, { int: NS })));
    return T.asPy(T.tuple(py(secs), py(sub(back, ns))));
  },
};
