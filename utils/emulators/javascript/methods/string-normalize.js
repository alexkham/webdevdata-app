// Emulator for JavaScript String.prototype.normalize.
//
// The demo lists the resulting CODE POINTS in hex, because the whole point
// of normalisation is invisible otherwise — the composed and decomposed
// forms of an accented letter render identically.
export default function stringNormalize(s, form) {
  return [...s.normalize(form)].map((c) => c.codePointAt(0).toString(16));
}
