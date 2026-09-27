// Emulator for JavaScript Date.prototype.getTimezoneOffset.
//
// This one is deliberately reader-dependent: the number IS the reader's own
// offset, which is the only honest way to demonstrate the method.
export default function dateGetTimezoneOffset(iso) {
  return new Date(iso).getTimezoneOffset();
}
