// Emulator for Set.prototype.values, keys and entries.
//
// Shows values alongside entries because a Set has no separate keys — keys
// IS values (the same function object), and entries yields [v, v] pairs.
export default function setIterators(json) {
  const s = new Set(JSON.parse(json));
  return [[...s.values()], [...s.entries()]];
}
