// Emulator for JavaScript Map.prototype.get.
export default function mapGet(json, key) {
  return new Map(JSON.parse(json)).get(key);
}
