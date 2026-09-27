// Emulator for Object.prototype.hasOwnProperty.
export default function objectHasOwnProperty(json, key) {
  return JSON.parse(json).hasOwnProperty(key);
}
