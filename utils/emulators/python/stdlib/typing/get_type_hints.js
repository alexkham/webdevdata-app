// utils/emulators/python/stdlib/typing/get_type_hints.js
//
// Emulator for the get_type_hints / get_origin / get_args demo, on _pytyping.js.

import { demo } from './_pytyping.js';

export default {
  evaluate: demo.evaluate,
  extras: demo.extras,
  originArgs: demo.originArgs,
};
