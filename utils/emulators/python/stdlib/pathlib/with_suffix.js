// utils/emulators/python/stdlib/pathlib/with_suffix.js
//
// Emulator for the with_suffix / with_stem / with_name demo, on _pypath.js.

import { pure, py } from './_pypath.js';

export default {
  suffix: (path, suffix) => py(pure(path).withSuffix(suffix)),
  stem: (path, stem) => py(pure(path).withStem(stem)),
  name: (path, name) => py(pure(path).withName(name)),
};
