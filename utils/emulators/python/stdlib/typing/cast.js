// utils/emulators/python/stdlib/typing/cast.js
//
// Emulator for the cast / assert_never / reveal_type demo tabs. The value
// is an 'auto' input (int, float or str literal; inf is a NameError whose
// "Did you mean" hint depends on the names bound before it).
//
//   cast:     cast(int, value) returns value unchanged (Lib/typing.py)
//   never:    assert_never(value) raises AssertionError with repr(value),
//             cut to 100 characters + '...'
//   reveal:   reveal_type(value) prints "Runtime type is '<name>'" to
//             stderr (captured here) and returns value unchanged

import { autoValue, autoRepr, assertNever } from './_pytyping.js';
import { pyStrRepr } from '../../../../demo-coerce.js';

export default {
  // from typing import cast
  // cast(int, {$value})
  cast: (value) => ({ __pyRaw: autoRepr(autoValue(value, ['cast'])) }),

  // from typing import assert_never
  // assert_never({$value})
  never: (value) => assertNever(autoRepr(autoValue(value, ['assert_never']))),

  // import contextlib, io
  // from typing import reveal_type
  // err = io.StringIO()
  // with contextlib.redirect_stderr(err):
  //     result = reveal_type({$value})
  // (result, err.getvalue())
  reveal: (value) => {
    const v = autoValue(value, ['contextlib', 'io', 'reveal_type', 'err']);
    return { __pyRaw: `(${autoRepr(v)}, ${pyStrRepr(`Runtime type is '${v.kind}'\n`)})` };
  },
};
