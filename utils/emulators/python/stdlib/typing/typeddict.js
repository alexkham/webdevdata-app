// utils/emulators/python/stdlib/typing/typeddict.js
//
// Emulator for the TypedDict demo:
//   from typing import TypedDict
//   class Movie(TypedDict):
//       title: str
//       year: int
//   Movie(title={$title}, year={$year})
//
// Calling a TypedDict class builds a plain dict from the keyword
// arguments, in order, without looking at the annotations. The arguments
// are 'auto' inputs (int, float or str literal; inf is a NameError,
// raised for the first argument that is evaluated).

import { autoValue, autoRepr } from './_pytyping.js';

const BODY = ['TypedDict', 'Movie'];

export default {
  create: (title, year) => {
    const t = autoValue(title, BODY);
    const y = autoValue(year, BODY);
    return { __pyRaw: `{'title': ${autoRepr(t)}, 'year': ${autoRepr(y)}}` };
  },
};
