// utils/emulators/python/stdlib/typing/supportsint.js
//
// Emulator for the Supports* protocols demo:
//   import typing
//   value = {$value}
//   protocols = [typing.SupportsInt, ..., typing.SupportsRound]
//   [p.__name__ for p in protocols if isinstance(value, p)]
//
// The value is an int, a float or a str (the 'auto' input kinds; inf is a
// NameError). Each protocol is runtime-checkable and tests for one method;
// the table lists the methods each builtin type defines (CPython 3.13:
// int has no __complex__ or __bytes__, float no __complex__, __index__ or
// __bytes__,
// str none of them).

import { autoValue } from './_pytyping.js';

const PROTOCOLS = [
  ['SupportsInt', '__int__'],
  ['SupportsFloat', '__float__'],
  ['SupportsComplex', '__complex__'],
  ['SupportsBytes', '__bytes__'],
  ['SupportsIndex', '__index__'],
  ['SupportsAbs', '__abs__'],
  ['SupportsRound', '__round__'],
];
const METHODS = {
  int: new Set(['__int__', '__float__', '__index__', '__abs__', '__round__']),
  float: new Set(['__int__', '__float__', '__abs__', '__round__']),
  str: new Set(),
};

export default {
  check: (value) => {
    const v = autoValue(value, ['typing']);
    const has = METHODS[v.kind];
    return PROTOCOLS.filter(([, m]) => has.has(m)).map(([name]) => name);
  },
};
