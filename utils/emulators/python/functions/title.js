// utils/emulators/python/title.js
//
// Emulator for Python str.title(): the first LETTER of every run of
// letters is uppercased, the rest lowercased. Word boundaries are
// non-letter characters — which is why "don't" becomes "Don'T", the
// documented Python quirk.

export default function title(s) {
  if (typeof s !== 'string') throw new TypeError('title() argument must be str');
  return s.replace(/[a-zA-ZÀ-ɏ]+/g, (word) =>
    word[0].toUpperCase() + word.slice(1).toLowerCase()
  );
}
