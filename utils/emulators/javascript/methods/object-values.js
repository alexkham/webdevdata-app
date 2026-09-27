// Emulator for the static Object.values.
export default function objectValues(json) {
  return Object.values(JSON.parse(json));
}
