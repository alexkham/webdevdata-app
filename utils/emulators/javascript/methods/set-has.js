// Emulator for JavaScript Set.prototype.has.
export default function setHas(json, value) {
  return new Set(JSON.parse(json)).has(value);
}
