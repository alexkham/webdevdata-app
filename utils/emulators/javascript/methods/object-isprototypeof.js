// Emulator for Object.prototype.isPrototypeOf.
export default function objectIsPrototypeOf(json) {
  const v = JSON.parse(json);
  return [Object.prototype.isPrototypeOf(v), Array.prototype.isPrototypeOf(v)];
}
