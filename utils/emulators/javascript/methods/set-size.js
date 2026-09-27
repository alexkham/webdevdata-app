// Emulator for the JavaScript Set size accessor.
//
// Built from a JSON array so duplicates in the source collapse visibly.
export default function setSize(json) {
  return new Set(JSON.parse(json)).size;
}
