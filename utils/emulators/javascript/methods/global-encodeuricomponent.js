// Emulator for the global encodeURIComponent.
//
// Returns both forms, because choosing between them is the entire decision:
// encodeURI leaves the reserved URL characters alone, encodeURIComponent
// escapes them.
export default function globalEncodeUriComponent(s) {
  return [encodeURIComponent(s), encodeURI(s)];
}
