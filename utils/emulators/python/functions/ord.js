// utils/emulators/python/ord.js
//
// Emulator for Python ord(c). Takes a string of length 1 and returns its
// Unicode codepoint. Empty and multi-character strings both raise
// TypeError matching CPython's exact wording. Uses codePointAt so
// astral-plane characters (emoji) return their real codepoint rather
// than the surrogate-half value String.charCodeAt would give.
//
// The demo passes strings from a `text` input. Python counts codepoints,
// so an emoji is length 1 to Python (and to JS's codePointAt-based
// counting), but grapheme clusters like emoji+skin-tone are length 2.

export default function pyOrd(c) {
  if (typeof c !== 'string') {
    throw new TypeError('ord() expected string of length 1, but ' + typeof c + ' found');
  }
  const codepoints = [...c];  // spread splits by codepoint, not UTF-16 unit
  if (codepoints.length !== 1) {
    throw new TypeError('ord() expected a character, but string of length ' + codepoints.length + ' found');
  }
  return codepoints[0].codePointAt(0);
}