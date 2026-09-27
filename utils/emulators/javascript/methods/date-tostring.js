// Emulator for JavaScript Date.prototype.toUTCString.
//
// toUTCString rather than toString, because toString embeds the reader's
// timezone name and would differ for everyone.
export default function dateToString(iso) {
  return new Date(iso).toUTCString();
}
