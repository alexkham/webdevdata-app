// Emulator for the Date UTC getters.
//
// Returns [getUTCHours(), getHours()] because the whole point of the UTC
// family is the contrast with the local one — and the second number is
// whatever the READER's timezone makes it.
export default function dateUtcMethods(iso) {
  const d = new Date(iso);
  return [d.getUTCHours(), d.getHours()];
}
