// Emulator for JavaScript Set.prototype.delete.
//
// Returns [didDelete, remainingSize] — the boolean reports whether the value
// was actually present, which is the whole difference from clear().
export default function setDelete(json, value) {
  const s = new Set(JSON.parse(json));
  return [s.delete(value), s.size];
}
