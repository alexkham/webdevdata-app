// Emulator for JavaScript Date.prototype.toLocaleDateString.
//
// timeZone is pinned to UTC so the output depends only on the locale the
// reader chose, not on where they happen to be sitting.
export default function dateToLocaleString(iso, locale) {
  return new Date(iso).toLocaleDateString(locale, { timeZone: 'UTC' });
}
