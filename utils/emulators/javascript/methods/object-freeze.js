// Emulator for the static Object.freeze.
//
// Returns [isFrozen(object), isFrozen(object.n)] because the single most
// important fact about freeze is that it is SHALLOW — a nested object is
// left completely unprotected, and only a side-by-side check shows it.
export default function objectFreeze(json) {
  const o = Object.freeze(JSON.parse(json));
  return [Object.isFrozen(o), Object.isFrozen(o.n)];
}
