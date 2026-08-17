// utils/emulators/python/operators/not-in.js
//
// Emulator for Python `item not in container` — the negation of `in`.

import pyIn from './in.js';

export default function notIn(item, container) {
  return !pyIn(item, container);
}
