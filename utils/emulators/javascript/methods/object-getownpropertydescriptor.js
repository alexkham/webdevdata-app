// Emulator for the static Object.getOwnPropertyDescriptor.
export default function objectGetOwnPropertyDescriptor(json, key) {
  return Object.getOwnPropertyDescriptor(JSON.parse(json), key);
}
