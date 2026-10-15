// utils/emulators/python/stdlib/typing/annotated.js
//
// Emulator for the Annotated demo, on _pytyping.js.

import { demo } from './_pytyping.js';

export default {
  stripped: demo.evaluate,
  extras: demo.extras,
  originArgs: demo.originArgsExtras,
};
