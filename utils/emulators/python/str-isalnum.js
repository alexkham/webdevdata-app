// utils/emulators/python/str-isalnum.js
//
// Emulator for Python str.isalnum(). Returns true iff every codepoint is
// a Unicode letter (\p{L}) OR a Unicode number (\p{N}) AND the string is
// non-empty.

const NOT_ALNUM = /[^\p{L}\p{N}]/u;

export default function strIsAlnum(string) {
  const s = String(string == null ? '' : string);
  if (s.length === 0) return false;
  return !NOT_ALNUM.test(s);
}