// Emulator for the static Number.isFinite.
//
// Same contrast as Number.isNaN — the global coerces, the static does not.
export default function numberIsFinite(value) {
  return [Number.isFinite(value), isFinite(value)];
}
