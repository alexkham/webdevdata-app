// Emulator for JavaScript Date.prototype.toISOString.
export default function dateToIsoString(iso) {
  return new Date(iso).toISOString();
}
