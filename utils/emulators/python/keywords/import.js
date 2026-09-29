// utils/emulators/python/keywords/import.js
//
// Emulator for the import-keyword demo tabs.
//  star:  dir(itertools) is the module __dict__'s keys (CPython 3.13, where
//         itertools is a built-in module on every platform). A star import
//         without __all__ copies the names not starting with '_'; exec()
//         adds __builtins__ to the target namespace.
//  cache: every import returns the sys.modules entry; with no iteration
//         the name `it` is never bound.

import { raise } from '../../../py-exceptions.js';

const ITERTOOLS_DIR = new Set([
  '__doc__', '__loader__', '__name__', '__package__', '__spec__',
  '_grouper', '_tee', '_tee_dataobject',
  'accumulate', 'batched', 'chain', 'combinations', 'combinations_with_replacement',
  'compress', 'count', 'cycle', 'dropwhile', 'filterfalse', 'groupby', 'islice',
  'pairwise', 'permutations', 'product', 'repeat', 'starmap', 'takewhile', 'tee',
  'zip_longest',
]);

function star(name) {
  const inModule = ITERTOOLS_DIR.has(name);
  const copied = (inModule && !name.startsWith('_')) || name === '__builtins__';
  return { __pyTuple: [inModule, copied] };
}

function cache(times) {
  if (times <= 0) raise('NameError', "name 'it' is not defined. Did you mean: 'id'?");
  return { __pyTuple: [times, 'itertools'] };
}

export default { star, cache };
