// utils/emulators/python/stdlib/typing/newtype.js
//
// Emulator for the NewType demo:
//   from typing import NewType
//   UserId = NewType('UserId', int)
//   UserId({$value})
//
// NewType.__call__ returns its argument unchanged (Lib/typing.py:
// `__call__ = _idfunc`, the identity function from _typing) — no
// conversion, no check.
// The value is an 'auto' input (int, float or str literal; inf is a
// NameError).

import { autoValue, autoRepr } from './_pytyping.js';

export default {
  call: (value) => ({ __pyRaw: autoRepr(autoValue(value, ['NewType', 'UserId'])) }),
};
