// utils/emulators/python/dict-clear.js
//
// Emulator for Python dict.clear(). Returns an empty object so the demo
// has something to display — Python actually returns None and mutates
// the dict in place (demoExplainer says so). The subtle shared-reference
// behavior is documented in the content file but is not testable in the
// demo shell.

export default function dictClear(dict) {
  if (dict === null || dict === undefined) {
    throw new TypeError("'NoneType' object has no attribute 'clear'");
  }
  if (typeof dict !== 'object' || Array.isArray(dict)) {
    throw new TypeError("descriptor 'clear' requires a 'dict' object");
  }
  return {};
}