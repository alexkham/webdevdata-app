// utils/emulators/python/stdlib/typing/typevar.js
//
// Emulator for the TypeVar substitution demo, on _pytyping.js:
//   T = TypeVar('T') / def f(x: {$hint}): pass / get_type_hints(f)['x']

import { demo } from './_pytyping.js';

export default {
  substitute: demo.typevar,
};
