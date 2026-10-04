// utils/emulators/python/stdlib/sys/version.js
//
// Emulator for the sys.version_info demo tabs, modelling CPython 3.13.

import { VERSION_INFO, tupleGe, pyLiteralOf } from './_pysys.js';

const num = (v) => {
  const lit = pyLiteralOf(v);
  return lit.kind === 'int' ? Number(lit.value) : lit.value;
};

// Python str(x) of a demo number inside an f-string
const strOf = (v) => {
  const lit = pyLiteralOf(v);
  return lit.kind === 'int' ? String(lit.value) : lit.repr;
};

export const atLeast = (major, minor) => tupleGe(VERSION_INFO, [num(major), num(minor)]);

export default {
  // sys.version_info >= (major, minor)
  atleast: (major, minor) => atLeast(major, minor),

  // (f'3.{minor}' >= '3.9', (3, minor) >= (3, 9))
  strings: (minor) => {
    const s = `3.${strOf(minor)}`;
    return { __pyTuple: [s >= '3.9', tupleGe([3, num(minor)], [3, 9])] };
  },
};
