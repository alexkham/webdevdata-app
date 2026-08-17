// utils/emulators/python/str.js
//
// Emulator for Python str(object=""). The demo passes text through the
// input, so the identity case is what matters here — for text-shaped
// input, str() is essentially the identity function.
//
// For the numeric / None / list / dict pitfalls covered in the content
// file, the interesting behavior is documented but not exercised by the
// demo (the demo only takes a single text input). This emulator returns
// the same string Python's str() would for the covered demo cases.

export default function pyStr(x) {
  if (x === undefined) return '';
  if (x === null) return 'None';
  if (typeof x === 'boolean') return x ? 'True' : 'False';
  if (typeof x === 'number') {
    if (Number.isNaN(x)) return 'nan';
    if (x === Infinity) return 'inf';
    if (x === -Infinity) return '-inf';
    return String(x);
  }
  return String(x);
}