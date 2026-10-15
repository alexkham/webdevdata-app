// utils/emulators/python/stdlib/dataclasses/index.js
//
// Emulator for the dataclasses hub demos, on the CPython port in
// _pydataclasses.js (asdict → JSON goes through the json port).

import {
  makeClass, dataclass, method, callClass, callFunction, getattr, richcmp, truthy, asdict,
  T, PyFloat, Dict, Tuple, GenericAlias, numLit, floatLit, show, run, tuple,
} from './_pydataclasses.js';
import { dumps, PyDict, pyFloat } from '../json/_pyjson.js';

// float * int / float * float, as float.__mul__ does it
function mul(a, b) {
  const f = (v) => (v instanceof PyFloat ? v.v : Number(v));
  return new PyFloat(f(a) * f(b));
}

function itemClass() {
  return dataclass(makeClass('Item', {
    body: [
      { ann: 'name', type: T.str },
      { ann: 'price', type: T.float },
      { ann: 'qty', type: T.int, value: 1n },
      { name: 'total', value: method('Item', 'total', ['self'], ([self]) => mul(getattr(self, 'price'), getattr(self, 'qty'))) },
    ],
  }));
}

function versionClass() {
  return dataclass(makeClass('Version', {
    body: [
      { ann: 'major', type: T.int },
      { ann: 'minor', type: T.int, value: 0n },
    ],
  }), { order: true });
}

// this value model → the json port's (PyDict / pyFloat / tuples)
function toJsonModel(v) {
  if (v instanceof Dict) return new PyDict(v.entries.map(([k, x]) => [toJsonModel(k), toJsonModel(x)]));
  if (Array.isArray(v)) return v.map(toJsonModel);
  if (v instanceof Tuple) return { __pyTuple: v.items.map(toJsonModel) };
  if (v instanceof PyFloat) return pyFloat(v.v);
  return v;
}

export default {
  // item = Item(name, price, qty); (item, item.total(), item == Item('pen', 1.5, 2))
  record: (name, price, qty) => run(() => {
    const Item = itemClass();
    const item = callClass(Item, [name, floatLit(price), numLit(qty)]);
    const total = callFunction(getattr(item, 'total'), []);
    const ref = callClass(Item, ['pen', new PyFloat(1.5), 2n]);
    return show(tuple(item, total, richcmp(item, ref, 'eq')));
  }),

  // a = Version(…); b = Version(…); (a < b, a == b, max(a, b))
  order: (aMajor, aMinor, bMajor, bMinor) => run(() => {
    const Version = versionClass();
    const a = callClass(Version, [numLit(aMajor), numLit(aMinor)]);
    const b = callClass(Version, [numLit(bMajor), numLit(bMinor)]);
    const biggest = truthy(richcmp(b, a, 'gt')) ? b : a; // max(): keeps the first maximum
    return show(tuple(richcmp(a, b, 'lt'), richcmp(a, b, 'eq'), biggest));
  }),

  // json.dumps(asdict(User(name, tags)))
  json: (name, tags) => run(() => {
    const User = dataclass(makeClass('User', {
      body: [
        { ann: 'name', type: T.str },
        { ann: 'tags', type: new GenericAlias(T.list, [T.str]) },
      ],
    }));
    const user = callClass(User, [name, tags.slice()]);
    return dumps(toJsonModel(asdict(user)));
  }),
};
