// Emulator for JavaScript String.prototype.replace.
//
// A string pattern replaces only the FIRST occurrence, which is the whole
// point of the page — so the demo deliberately passes strings, not regexes.
export default function stringReplace(s, search, repl) {
  return s.replace(search, repl);
}
