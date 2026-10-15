// utils/emulators/python/stdlib/dataclasses/kw_only.js
//
// Emulator for the KW_ONLY demo tabs, on the CPython port in
// _pydataclasses.js (the generated __init__ binds arguments like CPython).

import {
  makeClass, dataclass, callClass, getattr, KW_ONLY, PyFloat, T, numLit, show, run, tuple,
} from './_pydataclasses.js';

function requestClass() {
  return dataclass(makeClass('Request', {
    body: [
      { ann: 'url', type: T.str },
      { ann: '_', type: KW_ONLY },
      { ann: 'timeout', type: T.float, value: new PyFloat(10) },
      { ann: 'retries', type: T.int, value: 3n },
    ],
  }));
}

export default {
  // Request(*args)
  positional: (args) => run(() => show(callClass(requestClass(), args.slice()))),

  // r = Request(url, retries=retries); (r, Request.__match_args__)
  keywords: (url, retries) => run(() => {
    const Request = requestClass();
    const r = callClass(Request, [url], [['retries', numLit(retries)]]);
    return show(tuple(r, getattr(Request, '__match_args__')));
  }),
};
