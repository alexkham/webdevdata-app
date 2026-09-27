// Emulator for JavaScript Map.prototype.has.
export default function mapHas(json, key) {
  return new Map(JSON.parse(json)).has(key);
}
