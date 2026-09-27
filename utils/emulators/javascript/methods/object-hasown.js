// Emulator for the static Object.hasOwn.
export default function objectHasOwn(json, key) {
  return Object.hasOwn(JSON.parse(json), key);
}
