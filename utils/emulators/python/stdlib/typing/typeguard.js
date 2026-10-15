// utils/emulators/python/stdlib/typing/typeguard.js
//
// Emulator for the TypeGuard / TypeIs demo, on _pytyping.js:
//   from typing import *
//   def check(x: object) -> {$hint}: ...
//   get_type_hints(check)['return']
//
// get_type_hints() evaluates the string return annotation as a
// ForwardRef with is_argument=True (functions are not modules), exactly
// like a parameter annotation; x: object needs no evaluation.

import { functionHints, raw } from './_pytyping.js';

export default {
  evaluate: (text) => raw(functionHints([['return', text]], { fnName: 'check' }).hints[0][1]),
};
