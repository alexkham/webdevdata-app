// Emulator for the static Object.fromEntries.
export default function objectFromEntries(json) {
  return Object.fromEntries(JSON.parse(json));
}
