// Emulator for the static Object.getPrototypeOf.
//
// A prototype object cannot be rendered usefully, so the demo reports WHICH
// well-known prototype was found instead.
export default function objectGetPrototypeOf(json) {
  const p = Object.getPrototypeOf(JSON.parse(json));
  return [p === Object.prototype, p === Array.prototype];
}
