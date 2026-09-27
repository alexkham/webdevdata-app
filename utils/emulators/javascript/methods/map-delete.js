// Emulator for JavaScript Map.prototype.delete.
//
// Returns [didDelete, remainingSize] because delete's boolean return is the
// interesting part — it reports whether the key was actually there.
export default function mapDelete(json, key) {
  const m = new Map(JSON.parse(json));
  return [m.delete(key), m.size];
}
