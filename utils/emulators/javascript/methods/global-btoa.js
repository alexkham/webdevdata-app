// Emulator for the global btoa.
//
// Deliberately calls btoa directly so the demo shows the real
// InvalidCharacterError for any character above U+00FF — that limitation is
// the main thing worth knowing about it.
export default function globalBtoa(s) {
  return btoa(s);
}
