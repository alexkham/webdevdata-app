// Emulator for JavaScript Array.prototype.push.
//
// push returns the NEW LENGTH, not the array — the demo output is that
// number. A copy is pushed so the caller's array is untouched.
export default function arrayPush(items, value) {
  if (!Array.isArray(items)) throw new TypeError('push() demo source must be an array');
  return [...items].push(value);
}
