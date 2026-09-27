// Emulator for Object.prototype.propertyIsEnumerable.
export default function objectPropertyIsEnumerable(json, key) {
  return JSON.parse(json).propertyIsEnumerable(key);
}
