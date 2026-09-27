// Emulator for the static Object.entries.
export default function objectEntries(json) {
  return Object.entries(JSON.parse(json));
}
