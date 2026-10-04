// utils/emulators/python/stdlib/functools/cached_property.js
//
// Emulator for the functools.cached_property demo tabs: the first read of
// r.total runs the method and stores the result in the instance dict;
// later reads return the stored value until del removes it.

import { pyNum, PyFloat, raise, asPy, tuple, intRepr } from './_pyfunctools.js';

// sum(range(n + 1)) for an int n
function total(n) {
  if (n instanceof PyFloat) raise('TypeError', "'float' object cannot be interpreted as an integer");
  const m = n + 1n;
  return m > 0n ? (m * (m - 1n)) / 2n : 0n;
}

class Report {
  constructor(n) {
    this.n = n;
    this.calls = 0n;
    this.dict = new Map();
  }

  get total() {
    if (this.dict.has('total')) return this.dict.get('total');
    this.calls += 1n;
    const v = total(this.n);
    this.dict.set('total', v);
    return v;
  }

  delTotal() {
    if (!this.dict.delete('total')) raise('AttributeError', 'total');
  }
}

const show = (v) => ({ __pyRaw: intRepr(v) });

export default {
  // r = Report(n); r.total, r.total, r.calls
  once: (n) => {
    const r = new Report(pyNum(n));
    return asPy(tuple(show(r.total), show(r.total), r.calls));
  },

  // first = r.total; r.n = m; stale = r.total; del r.total; first, stale, r.total, r.calls
  reset: (n, m) => {
    const r = new Report(pyNum(n));
    const first = r.total;
    r.n = pyNum(m);
    const stale = r.total;
    r.delTotal();
    return asPy(tuple(show(first), show(stale), show(r.total), r.calls));
  },
};
