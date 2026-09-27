// Emulator for Map.prototype.keys, values and entries.
//
// Returns the key list and the value list side by side, because the point
// worth showing is that a Map preserves INSERTION order for every key type
// — including integer-like keys, which a plain object reorders.
export default function mapIterators(json) {
  const m = new Map(JSON.parse(json));
  return [[...m.keys()], [...m.values()]];
}
